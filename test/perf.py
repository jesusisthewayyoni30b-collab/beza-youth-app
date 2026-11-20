import asyncio, sys
from playwright.async_api import async_playwright
FAKE=open("test/fakecloud.js").read()
async def run(p, label):
    b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
    ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
    await ctx.add_init_script("window.__lt=[];new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__lt.push([Math.round(e.startTime),Math.round(e.duration)]))).observe({type:'longtask',buffered:true});")
    pg = await ctx.new_page(); cdp = await ctx.new_cdp_session(pg); await cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})
    await pg.goto("http://localhost:8766/index.html"); await pg.wait_for_timeout(16000)
    lt = await pg.evaluate("window.__lt"); tbt = sum(max(0,d-50) for s,d in lt)
    print(lt); print(label, "long tasks:", len(lt), "blocking ms:", tbt, "worst:", max([d for s,d in lt] or [0]), "during intro (<5.5s):", sum(max(0,d-50) for s,d in lt if s<5500))
    await b.close()
async def main():
    async with async_playwright() as p:
        await run(p, sys.argv[1])
asyncio.run(main())
