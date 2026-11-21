import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Singer"])
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(500)
        await A.locator(V).get_by_text("Body & vocal health").click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_text("Singer's body warm-up").click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_text("6. Side stretch for ribs").click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_role("button", name="Mark done").nth(1).click()
        await A.locator(V).get_by_text("6. Side stretch for ribs").scroll_into_view_if_needed(); await A.screenshot(path="test/rt2.png")
        print("\n".join(e for e in errs if "AudioContext" not in e)[:1500])
        await b.close()
asyncio.run(main())
