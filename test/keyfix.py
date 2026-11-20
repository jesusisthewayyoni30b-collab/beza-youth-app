import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
CH="[Intro]\nAbm  Gb  E  B  (x2)\n\n[Verse 1]\nAbm  Gb\nThe Lord is my shepherd\nE  B  Abm\nAnd he is everything I need\nGb\nSo I will not worry\nE  B  Abm\nI will not fear the enemy\nGb\n\n[Chorus]\nE  B  Gb  Abm\nYou've got a good plan"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Keys"])
        await A.get_by_role("button", name="Songs", exact=True).last.click(); await A.wait_for_timeout(500)
        await A.locator(V).get_by_role("button", name="New").first.click(); await A.wait_for_timeout(400)
        await A.locator(V+" input").first.fill("Good Plan")
        await A.locator(V).get_by_role("button", name="Eb", exact=True).first.click()
        await A.locator(V).get_by_text("Write as chords").click(); await A.wait_for_timeout(200)
        ta = A.locator(V+" textarea").first; await ta.fill(CH); await A.locator(V+" input").first.click(); await A.wait_for_timeout(400)
        print("numbers now:", (await A.evaluate("document.querySelector(\"div[style*='display: block'] textarea\").value")).split("\n")[1])
        card = A.get_by_text("These chords look like key", exact=False)
        print("banner:", await card.count(), (await card.first.locator("..").inner_text())[:200] if await card.count() else "")
        await A.screenshot(path="test/kf_banner.png")
        await A.get_by_role("button", name="Chords are in", exact=False).click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_text("Write as numbers").click(); await A.wait_for_timeout(200)
        print("as numbers:", (await A.locator(V+" textarea").first.input_value()).split("\n")[:3])
        await A.locator(V).get_by_text("Write as chords").click(); await A.wait_for_timeout(200)
        print("as chords (Eb):", (await A.locator(V+" textarea").first.input_value()).split("\n")[:2])
        # key change in names mode keeps names
        await A.locator(V).get_by_role("button", name="G", exact=True).first.click(); await A.wait_for_timeout(200)
        print("names after picking G:", (await A.locator(V+" textarea").first.input_value()).split("\n")[1])
        await A.locator(V).get_by_role("button", name="Add song").click(); await A.wait_for_timeout(800)
        print("\n".join(e for e in errs if "AudioContext" not in e)[:1500])
        await b.close()
asyncio.run(main())
