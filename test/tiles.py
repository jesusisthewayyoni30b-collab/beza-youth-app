import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Keys","Drums"])
        await A.get_by_role("button", name="Games", exact=True).last.click(); await A.wait_for_timeout(700)
        await A.screenshot(path="test/g_hub.png")
        await A.locator(V).get_by_text("Piano Tiles").click(); await A.wait_for_timeout(500)
        await A.screenshot(path="test/g_menu.png", full_page=True)
        await A.locator(V).get_by_role("button", name="Start").click(); await A.wait_for_timeout(2600)
        btns = A.locator(V+" button[style*='touch-action']")
        n = await btns.count(); print("lanes", n)
        for i in [0,1,2,3,4,3,2,1,0]:
            await A.wait_for_timeout(450); await btns.nth(i).dispatch_event("pointerdown")
            if i==4: await A.screenshot(path="test/g_play.png")
        await A.wait_for_timeout(2500)
        await A.screenshot(path="test/g_res.png")
        print("result:", (await A.locator(V).inner_text())[:200].replace("\n"," | "))
        # drums with keyboard
        await A.get_by_role("button", name="Games", exact=True).last.click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_role("button", name="Drums").first.click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_text("Drum Tiles").click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_text("Kick on every beat").click()
        await A.locator(V).get_by_text("⌨️ Keyboard").click()
        await A.locator(V).get_by_role("button", name="Start").click(); await A.wait_for_timeout(2600)
        for i in range(16): await A.keyboard.press("f"); await A.wait_for_timeout(300)
        await A.wait_for_timeout(2500); await A.screenshot(path="test/g_drum.png")
        print("drum result:", (await A.locator(V).inner_text())[:160].replace("\n"," | "))
        print("\n".join(e for e in errs if "AudioContext" not in e)[:2500])
        await b.close()
asyncio.run(main())
