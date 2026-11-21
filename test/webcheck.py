import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":1400,"height":900}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Drums","Singer"])
        await A.get_by_role("button", name="Practice", exact=True).first.click(); await A.wait_for_timeout(700)
        await A.screenshot(path="test/w_practice.png")
        await A.get_by_role("button", name="Games", exact=True).first.click(); await A.wait_for_timeout(700)
        await A.screenshot(path="test/w_games.png")
        print("\n".join(e for e in errs if "AudioContext" not in e)[:1500])
        await b.close()
asyncio.run(main())
