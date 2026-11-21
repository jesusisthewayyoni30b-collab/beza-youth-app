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
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_text("Chord Library").last.click(); await A.wait_for_timeout(600)
        await A.locator(V).get_by_text("All 12 keys").first.click(); await A.wait_for_timeout(400)
        await A.screenshot(path="test/all12.png")
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:800])
        await b.close()
asyncio.run(main())
