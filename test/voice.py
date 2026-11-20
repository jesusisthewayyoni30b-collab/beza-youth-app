import asyncio, json
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna T", "h@x.com", ["Singer"])
        await A.wait_for_timeout(2000)
        S = await A.evaluate("window.__fake.S()"); print("voiceRange field present:", [ 'voiceRange' in v for k,v in S['docs'].items() if k.startswith('users/')])
        print([e for e in errs if 'Audio' not in e][:3]); await b.close()
asyncio.run(main())
