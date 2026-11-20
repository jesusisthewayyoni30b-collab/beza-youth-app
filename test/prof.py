import asyncio, json, collections
from playwright.async_api import async_playwright
FAKE=open("test/fakecloud.js").read()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        pg = await ctx.new_page(); cdp = await ctx.new_cdp_session(pg)
        await cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4}); await cdp.send("Profiler.enable"); await cdp.send("Profiler.setSamplingInterval", {"interval": 200}); await cdp.send("Profiler.start")
        await pg.goto("http://localhost:8766/index.html"); await pg.wait_for_timeout(1500)
        prof = (await cdp.send("Profiler.stop"))["profile"]
        nodes = {n["id"]: n for n in prof["nodes"]}; self_ = collections.Counter()
        dt = prof["timeDeltas"]; 
        for sid, d in zip(prof["samples"], dt): n = nodes[sid]; cf = n["callFrame"]; self_[(cf["functionName"] or "(anon)") + " " + cf["url"].split("/")[-1] + ":" + str(cf["lineNumber"])] += d
        for k, v in self_.most_common(25): print(round(v/1000,1), "ms", k)
        await b.close()
asyncio.run(main())
