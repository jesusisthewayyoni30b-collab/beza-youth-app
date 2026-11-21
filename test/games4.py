import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--use-fake-ui-for-media-stream","--use-fake-device-for-media-stream"])
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Keys","Acoustic guitar","Lead guitar","Bass","Drums","Sound","Singer"])
        dep = {"Acoustic Guitar":["Open Chord Ears","Chord Change Ears"],"Bass":["Bass Walk"],"Drums":["Kit Piece ID","Subdivision Spotter","Dynamics Ears"],"Sound":["Sound Tech Quiz"]}
        for d, gs in dep.items():
            for g in gs:
                await A.get_by_role("button", name="Games", exact=True).last.click(); await A.wait_for_timeout(250)
                await A.locator(V).get_by_role("button", name=d).first.click(); await A.wait_for_timeout(200)
                await A.locator(V).get_by_text(g, exact=True).first.click(); await A.wait_for_timeout(300)
                await A.locator(V).locator("button:not([disabled])").filter(has_text="1").first.click(); await A.wait_for_timeout(1200)
                t = (await A.locator(V).inner_text()).replace("\n"," | ")[:140]
                print(g, "->", t)
        for g in ["Tizita Singer","Minor Scale Climber"]:
            await A.get_by_role("button", name="Games", exact=True).last.click(); await A.wait_for_timeout(250)
            await A.locator(V).get_by_role("button", name="Singer").first.click(); await A.wait_for_timeout(200)
            await A.locator(V).get_by_text(g).first.click(); await A.wait_for_timeout(300)
            await A.get_by_role("button", name="Start singing").click(); await A.wait_for_timeout(1200)
            print(g, "->", (await A.locator(V).inner_text()).replace("\n"," | ")[:120])
        await A.screenshot(path="test/g4.png")
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:2500])
        await b.close()
asyncio.run(main())
