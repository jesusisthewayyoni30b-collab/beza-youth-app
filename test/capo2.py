import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Acoustic guitar"])
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_text("Capo & keys").first.click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_text("Capo chart").first.click(); await A.wait_for_timeout(600)
        await A.locator(V).get_by_role("button", name="Capo", exact=True).click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_role("button", name="Eb / D#").click(); await A.wait_for_timeout(300)
        await A.locator(V).get_by_text("Capo options for").scroll_into_view_if_needed(); await A.screenshot(path="test/capo_a.png")
        await A.locator(V).get_by_role("button", name="The 5 shape families").click(); await A.wait_for_timeout(300)
        await A.screenshot(path="test/capo_b.png")
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:800])
        await b.close()
asyncio.run(main())
