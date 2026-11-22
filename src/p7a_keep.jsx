
/* ================================ SCREENS ================================ */
/* The team's real rhythm: Friday rehearsal (≈4–7/8 PM), Saturday run-through before the 3:00 PM youth program, where we serve. */
const WEEK = (() => { const now = new Date(); const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7)); return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => { const x = new Date(mon); x.setDate(mon.getDate() + i); return { d, n: x.getDate() }; }); })();
const WEEKLY_EVENTS = {}; // empty for now: leaders will set the real schedule
const EVENTS = Object.fromEntries(WEEK.map((w) => [w.n, WEEKLY_EVENTS[w.d] || []]));
const colorOf = (name) => (TEAM.find((m) => m.name === name) || {}).color || "#F5A94C";
function UpdateCard() { return null; }

/* ---------------- MANDATORY UPDATE GATE ---------------- */
const BEZA_BUILD = typeof __BEZA_BUILD__ !== "undefined" ? __BEZA_BUILD__ : "dev";
const BEZA_BUILD_NAME = typeof __BEZA_BUILD_NAME__ !== "undefined" ? __BEZA_BUILD_NAME__ : "dev";
const shellVersion = () => { const m = /BezaShell\/(\d+)/.exec(navigator.userAgent || ""); return m ? +m[1] : 0; };
function UpdateGate() {
  const { update, runUpdate } = useApp();
  const v = update.remote || {}; const busy = update.progress != null;
  const C = ["#22E4FF", "#B57BFF"];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100000, background: "radial-gradient(120% 80% at 50% 0%, #1A2740 0%, #07090B 70%)", color: "#F2F8FF", display: "grid", placeItems: "center", padding: 24, fontFamily: FONT, overflowY: "auto" }}>
      <HoloStyle />
      <div style={{ width: "100%", maxWidth: 380, textAlign: "center" }}>
        <img alt="Beza Youth Worship Team" src="assets/logo-white.png" style={{ width: 170, display: "block", margin: "0 auto 26px", filter: "drop-shadow(0 0 18px rgba(140,190,255,.35))" }} />
        <div style={{ display: "grid", placeItems: "center" }}><NeonIcon icon={Download} colors={C} size={74} /></div>
        <div style={{ fontSize: 11, letterSpacing: 3, fontWeight: 800, color: C[0], marginTop: 20 }}>UPDATE REQUIRED</div>
        <div style={{ fontSize: 26, fontWeight: 900, marginTop: 6, lineHeight: 1.15 }}>A new version is ready</div>
        <div style={{ fontSize: 13.5, opacity: 0.75, marginTop: 8, lineHeight: 1.5 }}>Version {v.name || "new"} is out. Update now to keep using the app, so the whole team stays on the same songs, lessons and charts.</div>
        {update.shellOld && v.apk ? (
          <a href={v.apk} style={{ display: "block", marginTop: 22, padding: "16px 0", borderRadius: 18, background: `linear-gradient(90deg, ${C[0]}, ${C[1]})`, color: "#06121A", fontWeight: 900, fontSize: 16, textDecoration: "none", boxShadow: `0 0 26px ${C[0]}66` }}>Download the new app</a>
        ) : (
          <button onClick={runUpdate} disabled={busy} style={{ width: "100%", marginTop: 22, padding: "16px 0", borderRadius: 18, border: "none", cursor: "pointer", background: `linear-gradient(90deg, ${C[0]}, ${C[1]})`, color: "#06121A", fontWeight: 900, fontSize: 16, fontFamily: FONT, boxShadow: `0 0 26px ${C[0]}66` }}>{busy ? "Updating…" : "Update now"}</button>
        )}
        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 12 }}>You're on {update.version}. Takes a few seconds, no reinstall.</div>
      </div>
    </div>
  );
}


