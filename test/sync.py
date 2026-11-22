import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        c1 = await b.new_context(viewport={"width":412,"height":880}); await c1.add_init_script(FAKE)
        errs=[]
        A = await newpage(c1, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Keys"])
        await A.wait_for_timeout(2500)
        st = await A.evaluate("localStorage.getItem('fakecloud')")
        c2 = await b.new_context(viewport={"width":1300,"height":860}); await c2.add_init_script(FAKE)
        B = await c2.new_page(); B.on("pageerror", lambda e: errs.append("B: "+str(e)))
        await B.goto("http://localhost:8766/index.html"); await B.evaluate("(s)=>localStorage.setItem('fakecloud', s)", st)
        await B.reload(); await B.wait_for_timeout(1000); await B.mouse.click(200,400); await B.wait_for_timeout(800)
        await B.get_by_text("Sign in", exact=True).first.click(); await B.wait_for_timeout(300)
        await B.get_by_placeholder("Email").fill("hanna@x.com"); await B.locator("input[type=password]").fill("secret123"); await B.keyboard.press("Enter"); await B.wait_for_timeout(3500)
        await B.screenshot(path="test/sync_b.png")
        uid = await A.evaluate("JSON.parse(sessionStorage.getItem('fakeauth')).uid")
        # simulate progress on A: write lesson done via app state? use fake store mirror: A completes via evaluate on its doc then check B merges
        await B.evaluate(f"(()=>{{const S=window.__fake.S(); const u=S.docs['users/{uid}']; u.done=[...(u.done||[]),'hw_what']; u.logs=[{{at:Date.now(),mins:12,what:'Phone practice'}},...(u.logs||[])]; u.dev='zzz'; u.upd=Date.now(); window.__fake.write('users/{uid}', u)}})()")
        await B.wait_for_timeout(2500)
        print("B local done has it:", await B.evaluate("JSON.parse(localStorage.getItem('beza-youth-team-v2')).done.includes('hw_what')"))
        await B.wait_for_timeout(2500)
        S = await B.evaluate("window.__fake.S()"); print("cloud still has it after B saves:", 'hw_what' in S['docs'][f'users/{uid}']['done'], S['docs'][f'users/{uid}'].get('dev'))
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:800])
        await b.close()
asyncio.run(main())
