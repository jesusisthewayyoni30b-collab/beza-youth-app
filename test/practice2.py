import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
V="div[style*='display: block']"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        ctx = await b.new_context(viewport={"width":412,"height":880}); await ctx.add_init_script(FAKE)
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Hanna Tesfaye", "hanna@x.com", ["Singer","Keys","Drums"])
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(700)
        await A.screenshot(path="test/pr_singer.png", full_page=False)
        await A.locator(V).get_by_text("Breathing & support").click(); await A.wait_for_timeout(500)
        await A.screenshot(path="test/pr_cat.png")
        await A.locator(V).get_by_text("Singer's body warm-up").first.click() if await A.locator(V).get_by_text("Singer's body warm-up").count() else None
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(400)
        print("tab reset ok:", await A.locator(V).get_by_text("Training packages").count())
        await A.locator(V).get_by_role("button", name="Keys").first.click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_text("Finger exercises").first.click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_text("Hanon #2").click(); await A.wait_for_timeout(600)
        await A.screenshot(path="test/pr_hanon.png")
        await A.get_by_role("button", name="Play along").click(); await A.wait_for_timeout(1500); await A.get_by_role("button", name="Stop").click()
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_role("button", name="Drums").first.click(); await A.wait_for_timeout(400)
        await A.screenshot(path="test/pr_drums.png")
        await A.locator(V).get_by_text("Metronome").first.click(); await A.wait_for_timeout(500)
        await A.locator(V).get_by_role("button", name="7/8").click(); await A.get_by_role("button", name="Start").click(); await A.wait_for_timeout(1500)
        await A.screenshot(path="test/pr_metro.png"); await A.get_by_role("button", name="Stop", exact=False).first.click()
        # routine
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_text("Rudiments & stick control").click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_text("Practice-pad stick control").click(); await A.wait_for_timeout(500)
        await A.get_by_role("button", name="Start routine").click(); await A.wait_for_timeout(2200)
        await A.screenshot(path="test/pr_routine.png")
        # session pack
        await A.get_by_role("button", name="Practice", exact=True).last.click(); await A.wait_for_timeout(400)
        await A.locator(V).get_by_text("Start today's workout").click(); await A.wait_for_timeout(700)
        await A.screenshot(path="test/pr_pack.png")
        # lessons lock
        await A.get_by_role("button", name="Learn", exact=True).last.click(); await A.wait_for_timeout(500)
        await A.locator(V).get_by_role("button", name="Singer").first.click(); await A.wait_for_timeout(400)
        await A.screenshot(path="test/le_list.png")
        await A.locator(V).get_by_role("button", name="Next: Heart of Worship").click(); await A.wait_for_timeout(600)
        await A.get_by_role("button", name="Ask a leader").click(); await A.wait_for_timeout(300)
        await A.get_by_placeholder("Type your question…").fill("What does 'audience of one' mean?"); await A.get_by_role("button", name="Send to leaders").click(); await A.wait_for_timeout(900)
        await A.screenshot(path="test/le_ask.png")
        S = await A.evaluate("window.__fake.S()"); print("questions:", [ (k, v.get('ctxTitle')) for k,v in S['docs'].items() if k.startswith('questions/')])
        print("\n".join(e for e in errs if "AudioContext" not in e)[:2500])
        await b.close()
asyncio.run(main())
