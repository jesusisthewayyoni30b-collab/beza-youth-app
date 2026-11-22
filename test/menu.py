import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna T", "hanna@x.com", ["Keys"])
        await A.get_by_role("button", name="Chat", exact=True).last.click(); await A.wait_for_timeout(800)
        await A.get_by_placeholder("Message").fill("Hello team, this is a test message"); await A.keyboard.press("Enter"); await A.wait_for_timeout(800)
        await A.get_by_text("Hello team, this is a test message").last.click(); await A.wait_for_timeout(500)
        await A.screenshot(path="test/menu.png")
        await A.get_by_role("button", name="React ❤️").click(); await A.wait_for_timeout(500)
        print("chip:", await A.get_by_text("❤️ 1").count())
        await A.get_by_text("❤️ 1").click(); await A.wait_for_timeout(400)
        print("chip after toggle:", await A.get_by_text("❤️ 1").count())
        await A.get_by_text("Hello team, this is a test message").last.click(); await A.wait_for_timeout(400)
        await A.get_by_role("button", name="React 🙏").click(); await A.wait_for_timeout(300)
        await A.get_by_text("Hello team, this is a test message").last.click(); await A.wait_for_timeout(400)
        await A.get_by_role("button", name="React 🔥").click(); await A.wait_for_timeout(300)
        print("one reaction each:", await A.get_by_text("🙏 1").count(), await A.get_by_text("🔥 1").count())
        await A.screenshot(path="test/menu2.png")
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:800])
        await b.close()
asyncio.run(main())
