import asyncio, json
from playwright.async_api import async_playwright
FAKE=open("test/fakecloud.js").read()
exec(open("test/cloud1.py").read().split("async def main")[0].split("async def newpage")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--use-fake-ui-for-media-stream","--use-fake-device-for-media-stream","--autoplay-policy=no-user-gesture-required"])
        ctx = await b.new_context(viewport={"width":1440,"height":900}, permissions=["microphone"]); await ctx.add_init_script(FAKE)
        pg = await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type in ("error",) else None)
        await pg.goto("http://localhost:8766/index.html"); await pg.wait_for_timeout(800); await pg.mouse.click(700,450); await pg.wait_for_timeout(1500)
        await pg.get_by_placeholder("Full name").fill("Hanna T"); await pg.get_by_placeholder("Email").fill("h@x.com"); await pg.get_by_placeholder("Choose a password").fill("secret123")
        await pg.get_by_role("button", name="Join the team").click(); await pg.wait_for_timeout(800)
        await pg.locator("button").filter(has_text="Singer").first.click(); await pg.locator("button").filter(has_text="Continue (").click(); await pg.wait_for_timeout(300)
        await pg.locator("button").filter(has_text="Let's go").click(); await pg.wait_for_timeout(2000)
        await pg.get_by_role("button", name="Practice", exact=True).last.click(); await pg.wait_for_timeout(500)
        L = pg.locator("div[style*='display: block']")
        tx = await L.locator("div.bz-press").all_inner_texts(); print([t.split(chr(10))[0] for t in tx][:30])
        await L.locator("div.bz-press").filter(has_text="Range Tester & Tuner").last.click(); await pg.wait_for_timeout(600)
        await L.get_by_role("button").filter(has_text="Start").first.click(); await pg.wait_for_timeout(2500)
        await pg.screenshot(path="test/mic.png")
        print("errs", errs[:5]); await b.close()
asyncio.run(main())
