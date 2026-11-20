import asyncio
from playwright.async_api import async_playwright
FAKE=open("test/fakecloud.js").read()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        for w,h,n in [(1440,900,"desk"),(820,1100,"tab"),(412,880,"phone")]:
            ctx = await b.new_context(viewport={"width":w,"height":h}); await ctx.add_init_script(FAKE)
            pg = await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
            await pg.goto("http://localhost:8766/index.html"); await pg.wait_for_timeout(1800)
            await pg.screenshot(path=f"test/{n}_intro.png")
            await pg.mouse.click(w//2,h//2); await pg.wait_for_timeout(1500)
            await pg.screenshot(path=f"test/{n}_login.png")
            if n=="desk":
                await pg.get_by_placeholder("Full name").fill("Hanna T"); await pg.get_by_placeholder("Email").fill("h@x.com"); await pg.get_by_placeholder("Choose a password").fill("secret123")
                await pg.get_by_role("button", name="Join the team").click(); await pg.wait_for_timeout(1200)
                await pg.screenshot(path=f"test/{n}_onb.png")
            print(n, errs); await ctx.close()
        await b.close()
asyncio.run(main())
