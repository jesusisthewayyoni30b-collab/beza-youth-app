import asyncio
from playwright.async_api import async_playwright
exec(open("test/cloud1.py").read().split("async def main")[0])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--use-fake-ui-for-media-stream","--use-fake-device-for-media-stream","--autoplay-policy=no-user-gesture-required"])
        ctx = await b.new_context(viewport={"width":1300,"height":860}, accept_downloads=True); await ctx.add_init_script(FAKE); await ctx.add_init_script("window.BEZA_ML_BASE='http://localhost:8766/ml/'")
        errs=[]
        A = await newpage(ctx, errs, "A"); await signup(A, "Yonatan Seyoum", "yoni@x.com", ["Keys"])
        await A.get_by_text("Songs", exact=True).first.click(); await A.wait_for_timeout(800)
        await A.screenshot(path="test/st_songs.png")
        await A.locator("div[style*='display: block']").get_by_text("Rehearsal Room").first.click(); await A.wait_for_timeout(800)
        await A.screenshot(path="test/st_room.png")
        await A.locator("div[style*='display: block']").get_by_text("Split a song").first.click(); await A.wait_for_timeout(500)
        await A.locator("div[style*='display: block'] input[type=file]").first.set_input_files("test/ml/My Song (Live).wav"); await A.wait_for_timeout(1500)
        await A.screenshot(path="test/st_pick.png")
        print("\n".join(errs)[:1500])
        await A.get_by_role("button", name="Split it").click()
        for i in range(60):
            await A.wait_for_timeout(1000)
            if await A.get_by_text("1 · Preview").count(): break
        print("split done:", await A.get_by_text("1 · Preview").count(), "secs", i)
        await A.screenshot(path="test/st_done.png", full_page=True)
        print("files:", await A.get_by_text("My Song (Live) – Vocals.mp3").count())
        async with A.expect_download() as dl:
            await A.get_by_role("button", name="MP3").first.click()
        d = await dl.value; print("download name:", d.suggested_filename); await d.save_as("/tmp/vox.mp3")
        await A.get_by_role("button", name="Share to the team").click()
        for i in range(30):
            await A.wait_for_timeout(1000)
            if await A.get_by_text("Shared!").count(): break
        print("shared:", await A.get_by_text("Shared!").count())
        S = await A.evaluate("window.__fake.S()")
        print("stem docs:", [k for k in S["docs"] if k.startswith("stems/")], len([k for k in S["docs"] if k.startswith("stemdata/")]))
        print(await A.evaluate("(()=>{const S=window.__fake.S(); return Object.entries(S.docs).filter(([k])=>k.startsWith('stemdata/')).map(([k,v])=>k+':'+(v.d&&v.d.__b64?v.d.__b64.length:JSON.stringify(v.d).slice(0,80)))})()"))
        print(await A.evaluate("""(async()=>{const S=window.__fake.S(); const v=Object.entries(S.docs).find(([k])=>k.startsWith('stemdata/'))[1]; const u=Uint8Array.from(atob(v.d.__b64),c=>c.charCodeAt(0)); const hd=[...u.slice(0,12)]; const c=new OfflineAudioContext(2,1,44100); try{const b=await c.decodeAudioData(u.buffer); return 'ok '+b.duration+' first bytes '+[...u.slice(0,4)]}catch(e){return 'fail '+e+' '+hd}})()"""))
        # try again -> duplicate
        await A.get_by_role("button", name="Change").click(); await A.wait_for_timeout(300)
        await A.locator("div[style*='display: block'] input[type=file]").first.set_input_files("test/ml/My Song (Live).wav"); await A.wait_for_timeout(2000)
        print("dup msg:", await A.get_by_text("Already shared by").count())
        await A.screenshot(path="test/st_dup.png")
        await A.locator("div[style*='display: block']").get_by_text("Open it").first.click(); await A.wait_for_timeout(4000)
        await A.screenshot(path="test/st_folder.png", full_page=True)
        print("ERRS", errs[-5:])
        await A.get_by_role("button", name="No vocals").first.click(); await A.wait_for_timeout(200)
        await A.get_by_role("button", name="Play").first.click(); await A.wait_for_timeout(1200)
        await A.get_by_role("button", name="75%").first.click(); await A.wait_for_timeout(2500)
        await A.screenshot(path="test/st_play.png")
        await A.get_by_role("button", name="Open in Studio").click(); await A.wait_for_timeout(5000)
        await A.screenshot(path="test/st_studio.png")
        # record 2s on My recording
        await A.get_by_role("button", name="Record", exact=True).click(); await A.wait_for_timeout(6000)
        await A.screenshot(path="test/st_rec.png")
        await A.get_by_role("button", name="Record", exact=True).click(); await A.wait_for_timeout(1500)
        await A.screenshot(path="test/st_after.png")
        await A.get_by_role("button", name="Studio settings").click(); await A.wait_for_timeout(400)
        await A.get_by_text("Graffiti Neon").click(); await A.wait_for_timeout(300)
        await A.screenshot(path="test/st_set.png")
        await A.get_by_role("button", name="Close").click(); await A.wait_for_timeout(300)
        await A.get_by_role("button", name="Export").click(); await A.wait_for_timeout(300)
        async with A.expect_download(timeout=60000) as dl:
            await A.get_by_role("button", name="Download MP3").click()
        d = await dl.value; print("export:", d.suggested_filename)
        await A.screenshot(path="test/st_neon.png")
        print("\n".join(errs)[:2500])
        await b.close()
asyncio.run(main())
