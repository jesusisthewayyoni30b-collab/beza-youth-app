import asyncio, time
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Keys"])
        for i in range(2):
            t=time.time(); await A.reload(); await A.get_by_text("Small steps.").first.wait_for(timeout=20000); print("open to home: %.2fs" % (time.time()-t))
        # slow profile: make cloud get hang 6s, app must still open fast
        await A.add_init_script("setTimeout(()=>{const c=window.BEZA_FAKE_CLOUD; const g=c.get; c.get=(p)=>new Promise(r=>setTimeout(()=>r(g(p)),6000));},0)")
        t=time.time(); await A.reload(); await A.get_by_text("Small steps.").first.wait_for(timeout=20000); print("slow network open: %.2fs" % (time.time()-t))
        # theme sync: pick theme on A, second device B same account picks it up
        await A.evaluate("(()=>{const S=window.__fake.S(); const uid=JSON.parse(sessionStorage.getItem('fakeauth')).uid; const u=S.docs['users/'+uid]; u.theme='riot'; window.__fake.write('users/'+uid,u)})()"); await A.wait_for_timeout(1500)
        print("theme now:", await A.evaluate("JSON.parse(localStorage.getItem('beza-youth-team-v2')).themeId"))
        print("\n".join(e for e in errs if "AudioContext" not in e and "bible" not in e)[:800])
        await b.close()
asyncio.run(main())
