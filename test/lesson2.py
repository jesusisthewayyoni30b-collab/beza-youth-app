import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--use-fake-ui-for-media-stream","--use-fake-device-for-media-stream"])
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Singer"])
        await A.get_by_role("button", name="Learn", exact=True).last.click(); await A.wait_for_timeout(500)
        # complete heart lesson 1
        await A.locator(V).get_by_role("button", name="Continue").click(); await A.wait_for_timeout(600)
        await A.get_by_role("button", name="Complete", exact=False).last.click(); await A.wait_for_timeout(500)
        await A.get_by_role("button", name="Learn", exact=True).last.click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_role("button", name="Singer").first.click(); await A.wait_for_timeout(400)
        await A.screenshot(path="test/le_list2.png")
        await A.locator(V).get_by_role("button", name="Continue").click(); await A.wait_for_timeout(700)
        await A.screenshot(path="test/le_lesson.png")
        await A.get_by_role("button", name="Sing").first.click(); await A.wait_for_timeout(1500)
        await A.get_by_text("Try it now", exact=False).first.scroll_into_view_if_needed(); await A.screenshot(path="test/le_sing.png")
        print("\n".join(e for e in errs if "AudioContext" not in e)[:2500])
        await b.close()
asyncio.run(main())
