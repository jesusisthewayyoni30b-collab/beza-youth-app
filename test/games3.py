import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--use-fake-ui-for-media-stream","--use-fake-device-for-media-stream"])
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Singer","Sound","Acoustic guitar"])
        await A.get_by_role("button", name="Games", exact=True).last.click(); await A.wait_for_timeout(600)
        await A.screenshot(path="test/g3_singer.png", full_page=True)
        await A.locator(V).get_by_text("Pitch Match").click(); await A.wait_for_timeout(400)
        await A.get_by_role("button", name="Start singing").click(); await A.wait_for_timeout(1500)
        await A.screenshot(path="test/g3_vg.png")
        await A.get_by_role("button", name="Games", exact=True).last.click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_role("button", name="Sound").first.click(); await A.wait_for_timeout(400)
        await A.screenshot(path="test/g3_sound.png", full_page=True)
        await A.locator(V).get_by_text("Feedback Hunter").click(); await A.wait_for_timeout(400)
        await A.screenshot(path="test/g3_fb.png")
        for g in ["Mix Spotter","Squash or Not?","Reverb Detective","Pan Spotter","Level Ears"]:
            await A.get_by_role("button", name="Games", exact=True).last.click(); await A.wait_for_timeout(300)
            await A.locator(V).get_by_role("button", name="Sound").first.click(); await A.wait_for_timeout(200)
            await A.locator(V).get_by_text(g).click(); await A.wait_for_timeout(300)
            btn = A.locator(V+" button").filter(has_text="1"); 
            await A.locator(V).locator("button:not([disabled])").filter(has_text="1").first.click(); await A.wait_for_timeout(1500)
        await A.screenshot(path="test/g3_lvl.png")
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_role("button", name="Acoustic Guitar").first.click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_text("Chords & changes").click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_text("G ↔ C").click(); await A.wait_for_timeout(600)
        await A.locator(V).get_by_role("button", name="Minor key").click(); await A.wait_for_timeout(200)
        await A.screenshot(path="test/g3_changes.png", full_page=True)
        print("\n".join(e for e in errs if "AudioContext" not in e)[:2500])
        await b.close()
asyncio.run(main())
