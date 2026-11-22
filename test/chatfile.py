import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}, accept_downloads=True); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna T", "hanna@x.com", ["Keys"])
        await A.get_by_role("button", name="Chat", exact=True).last.click(); await A.wait_for_timeout(800)
        await A.locator("div[style*='display: block'] input[type=file]").last.set_input_files("/tmp/guide.docx"); await A.wait_for_timeout(2500)
        await A.screenshot(path="test/cf.png")
        await A.get_by_text("guide.docx").last.click(); await A.wait_for_timeout(3500)
        await A.screenshot(path="test/cf_view.png")
        async with A.expect_download() as dl:
            await A.get_by_role("button", name="Save").click()
        d = await dl.value; print("downloaded:", d.suggested_filename)
        await A.get_by_role("button", name="Close").click(); await A.wait_for_timeout(300)
        await A.get_by_role("button", name="Message options").last.click(); await A.wait_for_timeout(300)
        await A.get_by_role("button", name="Delete").last.click(); await A.wait_for_timeout(300)
        await A.locator("button").filter(has_text="Delete").last.click(); await A.wait_for_timeout(1200)
        print("file msgs left:", await A.get_by_text("guide.docx").count())
        S = await A.evaluate("window.__fake.S()"); print("chunks left:", len([k for k in S['docs'] if k.startswith('stemdata/')]))
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:800])
        await b.close()
asyncio.run(main())
