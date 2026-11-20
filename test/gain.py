import asyncio, json
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
REM_SHOT=False
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--autoplay-policy=no-user-gesture-required"])
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Sam T", "s@x.com", ["Sound"])
        L = lambda pg: pg.locator("div[style*='display: block']")
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(500)
        tx = await L(A).locator("div.bz-press").all_inner_texts(); print([t.split(chr(10))[0] for t in tx][:14])
        await L(A).locator("div.bz-press").filter(has_text="Signal Flow").last.click(); await A.wait_for_timeout(800)
        await L(A).get_by_text("Gain Lab").scroll_into_view_if_needed()
        await L(A).get_by_role("button", name="Play this channel").click(); await A.wait_for_timeout(9000)
        el = L(A).get_by_text("2 · LISTEN AND WATCH"); await el.scroll_into_view_if_needed(); await A.wait_for_timeout(500)
        await A.screenshot(path="test/gain1.png")
        print("zone:", await L(A).get_by_text("Fader needed").inner_text())
        await L(A).get_by_role("button", name="Check my levels").click(); await A.wait_for_timeout(300)
        await L(A).get_by_text("channels set right").scroll_into_view_if_needed(); await A.screenshot(path="test/gain2.png")
        print([e for e in errs if 'Audio' not in e][:3]); await b.close()
asyncio.run(main())
