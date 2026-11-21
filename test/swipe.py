import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}, has_touch=True, is_mobile=True); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Keys"])
        await A.locator("[data-nav] button").last.click(); await A.wait_for_timeout(600)
        inp = A.get_by_placeholder("Message the team…"); await inp.fill("Swipe me to reply"); await A.locator("textarea").locator("xpath=..").locator("button").last.click(); await A.wait_for_timeout(800)
        el = A.locator("[id^=bzmsg-]").last; bb = await el.bounding_box(); print("msgs", await A.locator("[id^=bzmsg-]").count())
        y = bb["y"] + bb["height"]/2; x0 = bb["x"] + bb["width"] - 40
        cdp = await ctx.new_cdp_session(A)
        await cdp.send("Input.dispatchTouchEvent", {"type":"touchStart","touchPoints":[{"x":x0,"y":y}]})
        for k in range(1,9): await cdp.send("Input.dispatchTouchEvent", {"type":"touchMove","touchPoints":[{"x":x0-k*11,"y":y}]}); await A.wait_for_timeout(16)
        await A.screenshot(path="test/sw_mid.png")
        await cdp.send("Input.dispatchTouchEvent", {"type":"touchEnd","touchPoints":[]}); await A.wait_for_timeout(400)
        print("reply bar:", await A.get_by_text("Replying to").count())
        await A.screenshot(path="test/sw_end.png")
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:800])
        await b.close()
asyncio.run(main())
