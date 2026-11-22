import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna T", "hanna@x.com", ["Singer"])
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(800)
        await A.locator(V).get_by_text("Vocal technique").first.click(); await A.wait_for_timeout(600)
        await A.locator(V).get_by_text("Lip trills (SOVT)").first.click(); await A.wait_for_timeout(800)
        await A.locator(V).get_by_text("📖 How to do it").first.click(); await A.wait_for_timeout(1500)
        el = A.locator(V).get_by_text("STEP BY STEP").first; await el.scroll_into_view_if_needed()
        await A.screenshot(path="test/how1.png")
        await A.go_back() if False else None
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(600)
        await A.locator(V).get_by_text("Body & vocal health").first.click(); await A.wait_for_timeout(600)
        await A.locator(V).get_by_text("Core & support strength").first.click(); await A.wait_for_timeout(800)
        await A.locator(V).get_by_text("📖 How to do it").first.click(); await A.wait_for_timeout(1200)
        await A.locator(V).get_by_text("STEP BY STEP").first.scroll_into_view_if_needed()
        await A.screenshot(path="test/how2.png")
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:800])
        await b.close()
asyncio.run(main())
