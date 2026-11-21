import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Keys"])
        uid = await A.evaluate("JSON.parse(sessionStorage.getItem('fakeauth')).uid")
        await A.evaluate(f"window.__fake.write('leaders/{uid}', {{code:'X'}}); (()=>{{const S=window.__fake.S(); const u=S.docs['users/{uid}']; u.leader=true; window.__fake.write('users/{uid}', u);}})()"); await A.evaluate("(()=>{const k='beza-youth-team-v2'; const o=JSON.parse(localStorage[k]); o.leader=true; localStorage[k]=JSON.stringify(o);})()"); await A.reload(); await A.wait_for_timeout(3000); await A.mouse.click(200,300); await A.wait_for_timeout(1500)
        B = await newpage(ctx, errs, "B"); await signup(B, "Dawit Alemu", "dawit@x.com", ["Singer"])
        await A.bring_to_front()
        await A.locator(V).get_by_text("Calendar").first.click(); await A.wait_for_timeout(500)
        await A.screenshot(path="test/cal_0.png"); await A.get_by_role("button", name="Add").click(); await A.wait_for_timeout(300)
        await A.get_by_placeholder("Title (e.g. Full band rehearsal)").fill("Full band rehearsal")
        await A.get_by_placeholder("Place (e.g. Main hall)").fill("Main hall")
        await A.get_by_role("button", name="Every week").click()
        await A.get_by_placeholder("Notes: songs, what to bring, dress code…").fill("Songs: Good Plan, Amazing Grace")
        await A.get_by_role("button", name="Save & notify the team").click(); await A.wait_for_timeout(1200)
        await A.screenshot(path="test/cal_a.png")
        await B.bring_to_front(); await B.wait_for_timeout(1500); await B.screenshot(path="test/cal_b.png")
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:1500])
        await b.close()
asyncio.run(main())
