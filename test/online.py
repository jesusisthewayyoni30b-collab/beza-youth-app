import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Keys"])
        B = await newpage(ctx, errs, "B"); await signup(B, "Dawit Alemu", "dawit@x.com", ["Singer"])
        await A.bring_to_front(); await A.wait_for_timeout(1500)
        await A.locator("[data-nav] button").last.click(); await A.wait_for_timeout(800)
        await A.get_by_text("Everyone on the team").click(); await A.wait_for_timeout(500)
        await A.screenshot(path="test/online.png")
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:800])
        await b.close()
asyncio.run(main())
