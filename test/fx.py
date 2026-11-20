import asyncio, json
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
REM_SHOT=False
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna T", "h@x.com", ["Acoustic Guitar"])
        L = lambda pg: pg.locator("div[style*='display: block']")
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(500)
        await L(A).locator("div.bz-press").filter(has_text="Finger Exercises").last.click(); await A.wait_for_timeout(600)
        await L(A).get_by_text("How to read this").click(); await A.wait_for_timeout(300)
        el = L(A).get_by_text("How to read this"); await el.scroll_into_view_if_needed(); await A.mouse.wheel(0,-250); await A.wait_for_timeout(300)
        await A.screenshot(path="test/fx_read.png")
        print([e for e in errs if 'Audio' not in e][:3]); await b.close()
asyncio.run(main())
