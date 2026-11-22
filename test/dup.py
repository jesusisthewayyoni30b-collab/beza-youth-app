import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Eliana Samuel", "eli@x.com", ["Singer"])
        await A.wait_for_timeout(2000)
        await A.evaluate("window.BEZA_FAKE_CLOUD.signOut()"); await A.evaluate("sessionStorage.clear(); localStorage.removeItem('beza-youth-team-v2')"); await A.reload(); await A.wait_for_timeout(1500); await A.mouse.click(200,400); await A.wait_for_timeout(800)
        await A.get_by_placeholder("Full name (e.g. Hanna Tesfaye)").fill("eliana  samuel")
        await A.get_by_placeholder("Email").fill("eli2@x.com"); await A.get_by_placeholder("Choose a password (6+ characters)").fill("secret123")
        await A.get_by_role("button", name="Join the team").click(); await A.wait_for_timeout(3000)
        await A.screenshot(path="test/dup.png")
        print("blocked msg:", await A.get_by_text("already has an account").count())
        S = await A.evaluate("window.__fake.S()"); print("auth accounts:", list(S['auth'].keys()))
        # sign in properly and change password
        await A.get_by_placeholder("Email").fill("eli@x.com"); await A.locator("input[type=password]").fill("secret123"); await A.keyboard.press("Enter"); await A.wait_for_timeout(3000)
        await A.locator("div[style*='display: block']").get_by_text("ES").first.click(); await A.wait_for_timeout(600)
        await A.get_by_text("Settings", exact=True).first.click(); await A.wait_for_timeout(600)
        await A.get_by_text("Password", exact=True).click(); await A.wait_for_timeout(400)
        await A.get_by_placeholder("Current password").fill("secret123"); await A.get_by_placeholder("New password (6+ characters)").fill("newpass1"); await A.get_by_placeholder("Type the new password again").fill("newpass1")
        await A.screenshot(path="test/pw.png")
        await A.get_by_role("button", name="Change password").click(); await A.wait_for_timeout(800)
        S = await A.evaluate("window.__fake.S()"); print("pw now:", S['auth']['eli@x.com']['pw'])
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:800])
        await b.close()
asyncio.run(main())
