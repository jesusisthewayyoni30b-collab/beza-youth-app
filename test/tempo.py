import asyncio, json
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna T", "h@x.com", ["Keys"])
        L = lambda pg: pg.locator("div[style*='display: block']")
        await A.get_by_role("button", name="Songs", exact=True).last.click(); await A.wait_for_timeout(500)
        await L(A).get_by_role("button", name="New").first.click(); await A.wait_for_timeout(400)
        await L(A).locator("input").first.fill("Tempo test")
        t = L(A).get_by_placeholder("76"); await t.click(); await A.keyboard.press("Control+A"); await A.keyboard.type("128"); await A.keyboard.press("Enter")
        print("typed:", await t.input_value())
        await L(A).get_by_role("button", name="+").click(); print("plus:", await t.input_value())
        await t.scroll_into_view_if_needed(); await A.screenshot(path="test/tempo.png")
        await L(A).get_by_role("button", name="Add song").click(); await A.wait_for_timeout(800)
        S = await A.evaluate("window.__fake.S()"); print([ (v['title'], v['bpm']) for k,v in S['docs'].items() if k.startswith('songs/')])
        print(errs[:3]); await b.close()
asyncio.run(main())
