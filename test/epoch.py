import asyncio, json
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
REM_SHOT=False
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A")
        print("epoch after first load:", await A.evaluate("localStorage.getItem('beza-epoch')"))
        await signup(A, "Hanna T", "h@x.com", ["Singer"])
        print("signed in:", await A.get_by_role("button", name="Songs", exact=True).count())
        await A.evaluate("localStorage.setItem('beza-epoch','old')"); await A.reload(); await A.wait_for_timeout(3000); await A.mouse.click(200,400); await A.wait_for_timeout(1500)
        print("after reset -> login shown:", await A.get_by_role("button", name="Join the team").count(), "app data:", await A.evaluate("localStorage.getItem('beza-youth-team-v2')"))
        print([e for e in errs if 'Audio' not in e][:3]); await b.close()
asyncio.run(main())
