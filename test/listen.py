import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--use-fake-ui-for-media-stream","--use-fake-device-for-media-stream"])
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Keys","Acoustic guitar","Drums","Singer"])
        async def tool(dept, cat, item, shot):
            await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(300)
            await A.locator(V).get_by_role("button", name=dept).first.click(); await A.wait_for_timeout(200)
            await A.locator(V).get_by_text(cat).first.click(); await A.wait_for_timeout(300)
            await A.locator(V).get_by_text(item).first.click(); await A.wait_for_timeout(600)
        await tool("Keys","Finger exercises","Hanon #2","")
        await A.locator(V).get_by_text("Your turn (I listen)").click(); await A.wait_for_timeout(1200)
        await A.locator(V).get_by_text("Your turn — play each step").scroll_into_view_if_needed(); await A.screenshot(path="test/ls_keys.png")
        await tool("Acoustic Guitar","Finger exercises","Spider 1-2-3-4","")
        await A.locator(V).get_by_text("Your turn (I listen)").click(); await A.wait_for_timeout(1000)
        await A.locator(V).get_by_text("PLAY THIS NOW").scroll_into_view_if_needed(); await A.screenshot(path="test/ls_gtr.png")
        await tool("Drums","Rudiments & stick control","Paradiddle","")
        await A.locator(V).get_by_text("Listen to me (mic)").click(); await A.locator(V).get_by_role("button", name="Play", exact=False).first.click(); await A.wait_for_timeout(1500)
        await A.locator(V).get_by_text("listening to your timing").scroll_into_view_if_needed(); await A.screenshot(path="test/ls_drum.png")
        await tool("Singer","Vocal technique","Lip trills (SOVT)","")
        await A.locator(V).get_by_text("Listen to me (mic)").click(); await A.wait_for_timeout(300)
        await A.screenshot(path="test/ls_vg.png")
        await tool("Acoustic Guitar","Finger exercises","Guitar & bass: hand care","")
        await A.locator(V).get_by_role("button", name="Start routine").click(); await A.wait_for_timeout(1500); await A.screenshot(path="test/ls_rt.png")
        print("\n".join(e for e in errs if "AudioContext" not in e)[:2500])
        await b.close()
asyncio.run(main())
