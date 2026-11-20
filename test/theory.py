import asyncio, json
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
REM_SHOT=False
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Sam T", "s@x.com", ["Singer", "Keys", "Acoustic"])
        L = lambda pg: pg.locator("div[style*='display: block']")
        async def shot(n): await A.screenshot(path=f"test/th_{n}.png")
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(500)
        await L(A).locator("div.bz-press").filter(has_text="Music Basics").last.click(); await A.wait_for_timeout(700); await shot("steps")
        for t in ["Transpose", "Keys", "Numbers", "My key"]:
            await L(A).get_by_role("button", name=t, exact=True).first.click(); await A.wait_for_timeout(500); await shot(t.replace(" ",""))
        await L(A).get_by_role("button", name="Transpose", exact=True).first.click(); await A.wait_for_timeout(300)
        await L(A).get_by_text("TRANSPOSE BY").scroll_into_view_if_needed(); await A.mouse.wheel(0,150); await A.wait_for_timeout(300); await shot("calc")
        await L(A).locator("button").first.click(); await A.wait_for_timeout(500)
        await L(A).locator("div.bz-press").filter(has_text="Chord Library").last.click(); await A.wait_for_timeout(700)
        await L(A).get_by_role("button", name="Dorian", exact=True).click(); await A.wait_for_timeout(300); await L(A).get_by_role("button", name="7th chords").click(); await A.wait_for_timeout(500)
        await L(A).get_by_text("the 7 chords").scroll_into_view_if_needed(); await shot("lib_piano")
        await L(A).get_by_role("button", name="🎸 Guitar").click(); await A.wait_for_timeout(1500); await L(A).get_by_text("the 7 chords").scroll_into_view_if_needed(); await shot("lib_guitar")
        for t in ["Any chord", "Capo"]:
            await L(A).get_by_role("button", name=t, exact=True).first.click(); await A.wait_for_timeout(800); await shot(t.replace(" ",""))
        print([e for e in errs if 'Audio' not in e][:5]); await b.close()
asyncio.run(main())
