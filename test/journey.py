import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Keys"])
        await A.get_by_role("button", name="Games", exact=True).last.click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_text("Degree Dash").first.click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_text("Level journey").scroll_into_view_if_needed(); await A.screenshot(path="test/jr.png")
        await A.locator(V).get_by_role("button", name="1", exact=False).first.click(); await A.wait_for_timeout(800)
        for i in range(10):
            btns = A.locator(V+" button").filter(has_text="1")
            opts = A.locator(V).get_by_role("button")
            try:
                await A.locator(V).locator("button").filter(has_text="2").first.click(timeout=2000)
            except Exception: pass
            await A.wait_for_timeout(1900)
        await A.wait_for_timeout(1000); await A.screenshot(path="test/jr2.png")
        await A.get_by_role("button", name="Games", exact=True).last.click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_text("Piano Tiles").click(); await A.wait_for_timeout(400); await A.screenshot(path="test/jr3.png")
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:800])
        await b.close()
asyncio.run(main())
