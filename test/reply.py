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
        await A.get_by_role("button", name="Chat", exact=True).last.click(); await A.wait_for_timeout(600)
        inp = A.get_by_placeholder("Message the team…")
        await inp.fill("Who is leading the opening song on Saturday?"); await inp.press("Enter"); await A.wait_for_timeout(1200)
        await B.bring_to_front(); await B.wait_for_timeout(900); await B.screenshot(path="test/rp_b0.png"); await B.locator("[data-nav] button").last.click(); await B.wait_for_timeout(1200); await B.screenshot(path="test/rp_b1.png")
        await B.locator("#" + "x").count(); await B.locator("[id^=bzmsg-] div[style*=pointer]").first.click(); await B.wait_for_timeout(300); await B.screenshot(path="test/rp_menu.png")
        await B.get_by_role("button", name="↩ Reply").click(); await B.wait_for_timeout(200)
        t = B.get_by_placeholder("Message the team…")
        await t.fill("I can lead it! I was thinking we start with a slow intro, then build into the chorus with the full band, and after the bridge we go up a whole step for the last chorus. What do you all think about that plan for Saturday afternoon?")
        await B.wait_for_timeout(300); await B.screenshot(path="test/rp_typing.png")
        await t.press("Enter"); await B.wait_for_timeout(1500)
        await B.screenshot(path="test/rp_sent.png")
        S = await B.evaluate("window.__fake.S()"); print([v.get('reply') for k,v in S['docs'].items() if '/messages/' in k and v.get('reply')])
        print("\n".join(e for e in errs if "AudioContext" not in e)[:1500])
        await b.close()
asyncio.run(main())
