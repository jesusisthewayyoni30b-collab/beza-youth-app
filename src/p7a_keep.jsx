
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
        <img alt="Beza Youth" src="assets/logo-white.png" style={{ width: 170, display: "block", margin: "0 auto 26px", filter: "drop-shadow(0 0 18px rgba(140,190,255,.35))" }} />
        <div style={{ display: "grid", placeItems: "center" }}><NeonIcon icon={Download} colors={C} size={74} /></div>
        <div style={{ fontSize: 11, letterSpacing: 3, fontWeight: 800, color: C[0], marginTop: 20 }}>UPDATE REQUIRED</div>
        <div style={{ fontSize: 26, fontWeight: 900, marginTop: 6, lineHeight: 1.15 }}>A new version is ready</div>
        <div style={{ fontSize: 13.5, opacity: 0.75, marginTop: 8, lineHeight: 1.5 }}>Version {v.name || "new"} is out. Update now to keep using the app, so the whole team stays on the same songs, lessons and charts.</div>
        {Array.isArray(v.notes) && v.notes.length > 0 && (
          <div style={{ textAlign: "left", marginTop: 18, padding: "14px 16px", borderRadius: 18, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(34,228,255,0.25)" }}>
            <div style={{ fontSize: 10.5, letterSpacing: 2, fontWeight: 800, opacity: 0.7, marginBottom: 8 }}>WHAT'S NEW</div>
            {v.notes.slice(0, 6).map((n, i) => <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, lineHeight: 1.45, marginTop: i ? 6 : 0 }}><span style={{ color: C[0], fontWeight: 900 }}>›</span><span>{n}</span></div>)}
          </div>
        )}
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

function ScheduleScreen({ startDay }) {
  const { T, toast } = useApp();
  const [day, setDay] = useState(startDay || new Date().getDate());
  const [rem, setRem] = useState({});
  const evs = EVENTS[day] || []; const idx = WEEK.findIndex((w) => w.n === day);
  const hours = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
  const used = hours.filter((h) => evs.some((e) => e.t.slice(0, 2) === h.slice(0, 2)) || evs.some((e) => +h.slice(0, 2) > +e.t.slice(0, 2) && +h.slice(0, 2) < +e.end.slice(0, 2)));
  const shown = evs.length ? hours.filter((h) => +h.slice(0, 2) >= +evs[0].t.slice(0, 2) - 1 && +h.slice(0, 2) <= +evs[evs.length - 1].end.slice(0, 2)) : [];
  return (
    <div>
      <TopBar title="Team schedule" sub="Friday rehearsal · Saturday youth program 3:00 PM" />
      <Card tone="hero" style={{ padding: 18 }}>
        <svg width="160" height="160" style={{ position: "absolute", right: -50, bottom: -60, opacity: 0.1 }}><circle cx="80" cy="80" r="64" fill="none" stroke="#fff" strokeWidth="16" /></svg>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => idx > 0 && setDay(WEEK[idx - 1].n)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}><ChevronLeft /></button>
          <div style={{ fontWeight: 600, fontSize: 18 }}>November</div>
          <button onClick={() => idx < WEEK.length - 1 && setDay(WEEK[idx + 1].n)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}><ChevronRight /></button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          {WEEK.slice(Math.max(0, Math.min(idx - 2, WEEK.length - 5)), Math.max(0, Math.min(idx - 2, WEEK.length - 5)) + 5).map((w) => (
            <button key={w.n} onClick={() => setDay(w.n)} style={{ background: "none", border: "none", color: "inherit", fontFamily: FONT, cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 13, opacity: 0.7 }}>{w.d}</div>
              <div style={{ width: 44, height: 44, borderRadius: 99, display: "grid", placeItems: "center", marginTop: 8, fontWeight: 700, fontSize: 16, background: w.n === day ? T.pop : "transparent", color: w.n === day ? T.popText : "inherit" }}>{w.n}</div>
            </button>
          ))}
        </div>
        <Btn full variant="pop" style={{ marginTop: 16, padding: "15px 0", fontSize: 16 }} onClick={() => { setRem((r) => ({ ...r, [day]: true })); toast("Reminder set ⏰ — we'll notify you 1 hour before"); }}>{rem[day] ? "Reminder set ✓" : "Set Reminder"}</Btn>
      </Card>
      <div style={{ fontSize: 20, fontWeight: 700, margin: "22px 2px 12px" }}>{{ Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" }[WEEK[idx].d]}, {day}th</div>
      {evs.length === 0 && <Card tone="soft" style={{ textAlign: "center", fontSize: 13 }}>No events yet. The leaders will post the team schedule here soon.</Card>}
      <div style={{ position: "relative" }}>
        {shown.map((h) => {
          const ev = evs.find((e) => e.t.slice(0, 2) === h.slice(0, 2));
          return (
            <div key={h} style={{ display: "flex", gap: 12, minHeight: ev ? 0 : 38 }}>
              <div style={{ width: 52, fontSize: 11.5, color: T.sub, paddingTop: 4 }}>{to12(h)}</div>
              <div style={{ flex: 1, paddingBottom: ev ? 10 : 0 }}>
                {ev && (
                  <Card tone={evs.indexOf(ev) % 2 ? "card" : "soft"} pad={14}>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>{ev.title}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 3 }}>{to12(ev.t)} – {to12(ev.end)} · {ev.sub}</div>
                    <div style={{ display: "flex", marginTop: 10 }}>{ev.who.map((w, k) => <div key={w} style={{ marginLeft: k ? -8 : 0 }}><Avatar name={w} size={28} color={colorOf(w)} ring={T.id === "youth" ? "#4A5866" : T.card} /></div>)}</div>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

