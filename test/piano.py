import asyncio, json
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
REM_SHOT=False
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--autoplay-policy=no-user-gesture-required"])
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        await ctx.add_init_script("""(()=>{const O=window.AudioContext;let n=0;const P=O.prototype.createOscillator;O.prototype.createOscillator=function(){window.__osc=(window.__osc||0)+1;return P.call(this)};})()""")
        errs=[]; res=[]
        A = await ctx.new_page(); A.on("response", lambda r: "/assets/piano/" in r.url and res.append(r.status))
        A.on("pageerror", lambda e: errs.append(str(e)))
        await A.goto("http://localhost:8766/index.html"); await A.wait_for_timeout(800); await A.mouse.click(200,400); await A.wait_for_timeout(1500)
        await signup(A, "Sam T", "s@x.com", ["Singer"])
        L = lambda pg: pg.locator("div[style*='display: block']")
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(500)
        await L(A).locator("div.bz-press").filter(has_text="Ear Gym").last.click(); await A.wait_for_timeout(800)
        osc0 = await A.evaluate("window.__osc||0")
        btns = await L(A).locator("button").all_inner_texts(); print([x for x in btns if x.strip()][:25])
        print("piano mp3 responses:", res[:5], len(res), "osc before:", osc0)
        print(errs[:3]); await b.close()
asyncio.run(main())
