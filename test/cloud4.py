import asyncio, json
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Singer"])
        await A.evaluate("window.__fake.write('secret/leaderCode', {code:'BEZAYOUTH2027'})")
        L = lambda pg: pg.locator("div[style*='display: block']")
        await L(A).get_by_text("HT", exact=True).first.click(); await A.wait_for_timeout(600)
        await L(A).get_by_text("Settings", exact=True).first.click(); await A.wait_for_timeout(600)
        await A.evaluate("() => { const s = Array.from(document.querySelectorAll('div')).find(d => d.style.display==='block' && d.scrollHeight > d.clientHeight); s.scrollTop = 99999; }"); await A.wait_for_timeout(400)
        logo = L(A).locator("img[alt]").last; bb = await logo.bounding_box()
        await A.mouse.move(bb["x"]+bb["width"]/2, bb["y"]+bb["height"]/2); await A.mouse.down(); await A.wait_for_timeout(2800); await A.mouse.up(); await A.wait_for_timeout(500)
        await A.get_by_placeholder("Type the leader code").fill("beza youth 2027"); await A.screenshot(path="test/c_code.png")
        await A.get_by_role("button", name="Unlock").click(); await A.wait_for_timeout(1500)
        print("leader row:", await L(A).get_by_text("Leaders Board").count())
        print([e for e in errs if "Audio" not in e][:5])
        await b.close()
asyncio.run(main())
