import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        pg = await b.new_page(viewport={"width":412,"height":880}); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8766/index.html"); await pg.wait_for_timeout(1000); await pg.mouse.click(200,400); await pg.wait_for_timeout(3000)
        print("login shown:", await pg.get_by_role("button", name="Join the team").count(), errs[:3])
        await b.close()
asyncio.run(main())
