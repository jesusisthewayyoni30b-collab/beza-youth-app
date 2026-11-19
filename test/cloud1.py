import asyncio, json
from playwright.async_api import async_playwright
FAKE=open("test/fakecloud.js").read()
async def newpage(ctx, errs, tag):
    pg = await ctx.new_page(); pg.on("pageerror", lambda e: errs.append(tag+": "+str(e)))
    pg.on("console", lambda m: m.type=="warning" and errs.append(tag+" warn: "+m.text))
    await pg.goto("http://localhost:8766/index.html"); await pg.wait_for_timeout(800)
    await pg.mouse.click(200,400); await pg.wait_for_timeout(1500)
    return pg
async def signup(pg, name, email, roles):
    await pg.get_by_placeholder("Full name").fill(name)
    await pg.get_by_placeholder("Email").fill(email)
    await pg.get_by_placeholder("Choose a password").fill("secret123")
    await pg.get_by_role("button", name="Join the team").click(); await pg.wait_for_timeout(800)
    for r in roles:
        await pg.locator("button").filter(has_text=r).first.click(); await pg.wait_for_timeout(100)
    await pg.locator("button").filter(has_text="Continue (").click(); await pg.wait_for_timeout(300)
    await pg.locator("button").filter(has_text="Let's go").click(); await pg.wait_for_timeout(2500)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await A.screenshot(path="test/c_login.png")
        await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Singer"])
        await A.screenshot(path="test/c_A_home.png")
        B = await newpage(ctx, errs, "B")
        await signup(B, "Dawit Alemu", "dawit@x.com", ["Keys", "Singer"])
        S = await A.evaluate("window.__fake.S()")
        print("docs:", sorted(S["docs"].keys()))
        # A sends chat in All team
        await A.get_by_role("button", name="Chat", exact=True).last.click(); await A.wait_for_timeout(800)
        await A.get_by_placeholder("Message").fill("Hello from Hanna"); await A.keyboard.press("Enter"); await A.wait_for_timeout(1500)
        await B.get_by_role("button", name="Chat", exact=True).last.click(); await B.wait_for_timeout(1500)
        print("B sees msg:", await B.get_by_text("Hello from Hanna").count())
        await B.screenshot(path="test/c_B_chat.png")
        await A.screenshot(path="test/c_A_chat.png")
        print("groups:", [ (k, v.get("members"), v.get("autoRoles")) for k,v in (await A.evaluate("window.__fake.S()"))["docs"].items() if k.startswith("groups/") and k.count("/")==1])
        print("\n".join(errs[:15]))
        await b.close()
asyncio.run(main())
