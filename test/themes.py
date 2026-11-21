import asyncio, sys
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Drums","Keys"])
        for th in sys.argv[1].split(","):
            await A.evaluate(f"(()=>{{const k=Object.keys(localStorage).find(x=>{{try{{return JSON.parse(localStorage[x]).themeV===2}}catch(e){{return false}}}}); const o=JSON.parse(localStorage[k]); o.themeId='{th}'; localStorage[k]=JSON.stringify(o);}})()")
            await A.reload(); await A.wait_for_timeout(3500); await A.mouse.click(200,300); await A.wait_for_timeout(1500)
            await A.screenshot(path=f"test/th_{th}_home.png")
            await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(600)
            await A.screenshot(path=f"test/th_{th}_practice.png")
            await A.locator(V).get_by_text("Metronome").first.click(); await A.wait_for_timeout(500)
            await A.screenshot(path=f"test/th_{th}_metro.png")
            await A.get_by_role("button", name="Games", exact=True).last.click(); await A.wait_for_timeout(500)
            await A.locator(V).get_by_text("Drum Tiles").click(); await A.wait_for_timeout(500)
            await A.screenshot(path=f"test/th_{th}_tiles.png")
        print("\n".join(e for e in errs if "AudioContext" not in e)[:1500])
        await b.close()
asyncio.run(main())
