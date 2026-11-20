import asyncio
from playwright.async_api import async_playwright
FAKE=open("test/fakecloud.js").read()
async def main():
    async with async_playwright() as p:
        for args,n in [([],"blocked"),(["--autoplay-policy=no-user-gesture-required"],"allowed")]:
            b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=args)
            ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
            pg = await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
            await pg.goto("http://localhost:8766/index.html"); await pg.wait_for_timeout(1500)
            chip = await pg.get_by_text("TAP FOR SOUND").count()
            if chip: await pg.get_by_text("TAP FOR SOUND").click(); await pg.wait_for_timeout(500)
            await pg.screenshot(path=f"test/intro_{n}.png")
            print(n, "chip:", chip, "intro still showing:", await pg.locator("canvas").count(), errs)
            await b.close()
asyncio.run(main())
