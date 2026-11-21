import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Acoustic guitar"])
        B = await newpage(ctx, errs, "B"); await signup(B, "Dawit Alemu", "dawit@x.com", ["Singer"])
        await A.get_by_role("button", name="Chat", exact=True).last.click(); await A.wait_for_timeout(700)
        inp = A.get_by_placeholder("Message the team…")
        await inp.fill("Practice at 3pm Saturday 🙏"); await inp.press("Enter"); await A.wait_for_timeout(1500)
        await B.bring_to_front(); await B.wait_for_timeout(800)
        print("B ping:", await B.get_by_text("Hanna Tesfaye · 🙌 All team", exact=False).count())
        await B.screenshot(path="test/cs_ping.png")
        print("B badge text:", (await B.locator("[data-nav]").inner_text()).replace("\n"," "))
        await B.get_by_text("Hanna Tesfaye · 🙌", exact=False).first.click(); await B.wait_for_timeout(1500)
        print("B in chat:", await B.get_by_text("Practice at 3pm Saturday").count())
        await A.bring_to_front(); await A.wait_for_timeout(1200)
        await A.screenshot(path="test/cs_seen.png")
        await A.get_by_text("Practice at 3pm Saturday").click(); await A.wait_for_timeout(300)
        btn = A.get_by_role("button", name="Seen by", exact=False); print("seen btn:", await btn.inner_text())
        await btn.click(); await A.wait_for_timeout(300); await A.screenshot(path="test/cs_sheet.png")
        print("reads:", [k for k in (await A.evaluate("window.__fake.S()"))['docs'] if '/reads/' in k])
        print("\n".join(e for e in errs if "AudioContext" not in e)[:1500])
        await b.close()
asyncio.run(main())
