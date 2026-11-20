import asyncio, json
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
REM_SHOT=False
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna T", "h@x.com", ["Singer"])
        L = lambda pg: pg.locator("div[style*='display: block']")
        await L(A).get_by_text("HT", exact=True).first.click(); await A.wait_for_timeout(500)
        await L(A).get_by_text("Settings", exact=True).first.click(); await A.wait_for_timeout(500)
        await L(A).get_by_text("Help & feedback").first.click(); await A.wait_for_timeout(400)
        await A.locator("textarea").last.fill("The tuner should show cents bigger please"); await A.screenshot(path="test/fb_sheet.png")
        await A.get_by_role("button", name="Send to leaders").click(); await A.wait_for_timeout(800)
        S = await A.evaluate("window.__fake.S()"); print("feedback docs:", [v['text'] for k,v in S['docs'].items() if k.startswith('feedback/')])
        print([e for e in errs if 'Audio' not in e][:3]); await b.close()
asyncio.run(main())
