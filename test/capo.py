import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
CH="[Intro]\n4m b3 b2 b6 (x2)\n[Verse 1]\n4m b3\nThe Lord is my shepherd\nb2 b6 4m\nAnd he is everything I need"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Acoustic guitar"])
        await A.get_by_role("button", name="Songs", exact=True).last.click(); await A.wait_for_timeout(500)
        await A.locator(V).get_by_role("button", name="New").first.click(); await A.wait_for_timeout(400)
        await A.locator(V+" input").first.fill("Good Plan")
        await A.locator(V).get_by_role("button", name="E", exact=True).first.click()
        await A.locator(V+" textarea").first.fill(CH); await A.locator(V+" input").first.click()
        await A.get_by_text("Send the chords", exact=False).locator("..").locator("div").last.click()
        await A.locator(V).get_by_role("button", name="Add song").click(); await A.wait_for_timeout(800)
        await A.locator(V).get_by_text("Good Plan").first.click(); await A.wait_for_timeout(500)
        print("banner:", await A.get_by_text("Key check", exact=False).count())
        await A.get_by_role("button", name="Fix: set key to", exact=False).click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_role("button", name="Eb", exact=True).first.click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_role("button", name="Chart", exact=True).click(); await A.wait_for_timeout(300)
        print("chart Eb:", (await A.locator(V).inner_text()).split("INTRO")[1][:80].replace("\n"," "))
        await A.locator(V).get_by_role("button", name="Guitar", exact=True).click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_role("button", name="Capo 3", exact=False).first.click(); await A.wait_for_timeout(300)
        t = await A.locator(V).inner_text(); import re
        print("capo3 names:", re.findall(r"\n([A-G][b#]?m?)\nsounds ([A-G][b#]?m?)", t))
        await A.screenshot(path="test/capo3.png")
        await A.get_by_role("button", name="Live mode").click(); await A.wait_for_timeout(500)
        await A.get_by_role("button", name="Capo 3", exact=False).first.click(); await A.wait_for_timeout(300)
        await A.get_by_role("button", name="Am 6m").first.click(); await A.wait_for_timeout(300)
        await A.screenshot(path="test/capo3_live.png")
        await A.get_by_role("button", name="🎹 Keys").click(); await A.wait_for_timeout(300)
        await A.get_by_role("button", name="+3 · play C", exact=False).first.click(); await A.wait_for_timeout(300)
        t = await A.locator(V).inner_text(); print("live keys +3:", "Set your keyboard's transpose to +3" in t, t.split("NOW")[1][:60].replace("\n"," ") if "NOW" in t else "")
        await A.screenshot(path="test/keys_tr_live.png")
        await A.go_back() if False else None
        print("live banner:", await A.get_by_text("Key check", exact=False).count())
        print("\n".join(e for e in errs if "AudioContext" not in e)[:1500])
        await b.close()
asyncio.run(main())
