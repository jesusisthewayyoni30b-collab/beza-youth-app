import asyncio, json
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Singer"])
        B = await newpage(ctx, errs, "B"); await signup(B, "Dawit Alemu", "dawit@x.com", ["Keys"])
        # leader code
        await A.evaluate("window.__fake.write('secret/leaderCode', {code:'GRACE7'})")
        uidA = await A.evaluate("JSON.parse(sessionStorage.getItem('fakeauth')).uid")
        ok = await A.evaluate("BEZA_FAKE_CLOUD.set('leaders/%s',{code:'WRONG'}).then(()=>'ok').catch(e=>e.code)" % uidA); print("wrong code ->", ok)
        ok = await A.evaluate("BEZA_FAKE_CLOUD.set('leaders/%s',{code:'GRACE7'}).then(()=>'ok').catch(e=>e.code)" % uidA); print("right code ->", ok)
        await A.reload(); await A.wait_for_timeout(800); await A.mouse.click(200,400); await A.wait_for_timeout(2500)
        # B adds a song
        await B.get_by_role("button", name="Songs", exact=True).last.click(); await B.wait_for_timeout(500)
        await B.locator("div[style*='display: block']").get_by_role("button", name="New").first.click(); await B.wait_for_timeout(400)
        await B.locator("div[style*='display: block'] input").first.fill("Way Maker")
        await B.locator("div[style*='display: block'] textarea").first.fill("[Verse]\n1 5 6m 4")
        await B.locator("div[style*='display: block']").get_by_role("button", name="Add song").click(); await B.wait_for_timeout(1500)
        await A.get_by_role("button", name="Songs", exact=True).last.click(); await A.wait_for_timeout(1000)
        print("A sees Way Maker:", await A.get_by_text("Way Maker").count())
        # A chat groups visible (leader)
        await A.get_by_role("button", name="Chat", exact=True).last.click(); await A.wait_for_timeout(800)
        print("A chat chips:", await A.locator("div[style*='display: block'] button").all_inner_texts())
        await B.reload(); await B.wait_for_timeout(800); await B.mouse.click(200,400); await B.wait_for_timeout(2000)
        await B.get_by_role("button", name="Chat", exact=True).last.click(); await B.wait_for_timeout(800)
        print("B chat chips:", await B.locator("div[style*='display: block'] button").all_inner_texts())
        # A profile -> Leaders board
        await A.get_by_role("button", name="Home", exact=True).last.click(); await A.wait_for_timeout(500)
        await A.evaluate("()=>{}")
        S = await A.evaluate("window.__fake.S()")
        print("users leader flags:", [(v.get('name'), v.get('leader')) for k,v in S['docs'].items() if k.startswith('users/')])
        print("assignments:", [k for k in S['docs'] if k.startswith('assignments/')])
        # sign out and back in keeps progress
        await B.evaluate("BEZA_FAKE_CLOUD.signOut()"); await B.wait_for_timeout(800)
        await B.get_by_role("button", name="Sign in").first.click()
        await B.get_by_placeholder("Email").fill("dawit@x.com"); await B.get_by_placeholder("Password").fill("secret123")
        await B.locator("button").filter(has_text="Sign in").last.click(); await B.wait_for_timeout(2500)
        await B.screenshot(path="test/c_B_back.png")
        print("B back home:", await B.get_by_role("button", name="Songs", exact=True).count())
        await A.screenshot(path="test/c_A_lead.png")
        print("\n".join(e for e in errs if "AudioContext" not in e)[:2000])
        await b.close()
asyncio.run(main())
