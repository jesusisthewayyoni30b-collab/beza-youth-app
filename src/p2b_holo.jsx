
/* ============================ HOLO / NEON UI (futuristic stats & badges) ============================ */
const NEON = { flame: ["#FF5E3A", "#FFC23D"], time: ["#22E4FF", "#3D7BFF"], classes: ["#B57BFF", "#FF3EA5"], good: ["#3DFFB0", "#22E4FF"], gold: ["#FFD23D", "#FF8A3D"] };
const HOLO_CSS = `
@keyframes bzOrbit{to{transform:rotate(360deg)}}
@keyframes bzPulse{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes bzScan{from{transform:translateY(-100%)}to{transform:translateY(100%)}}
.bz-orbit{animation:bzOrbit 6s linear infinite}
.bz-pulse{animation:bzPulse 2.4s ease-in-out infinite}
`;
function HoloStyle() { return <style>{HOLO_CSS}</style>; }

/* glowing icon orb: rotating gradient ring + glass core + glowing glyph */
function NeonIcon({ icon: I, colors = NEON.time, size = 44, spin = true, dim }) {
  const [a, b] = colors; const ring = Math.max(2, size * 0.06);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0, opacity: dim ? 0.45 : 1, filter: dim ? "grayscale(1)" : "none" }}>
      {!dim && <div style={{ position: "absolute", inset: -size * 0.12, borderRadius: "50%", background: `radial-gradient(circle, ${a}55 0%, transparent 68%)`, filter: "blur(4px)" }} className="bz-pulse" />}
      <div className={spin && !dim ? "bz-orbit" : ""} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(from 0deg, ${a}, ${b}, transparent 55%, ${a})` }} />
      <div style={{ position: "absolute", inset: ring, borderRadius: "50%", background: "radial-gradient(circle at 30% 25%, #2A3442 0%, #0C1016 75%)", boxShadow: `inset 0 0 ${size * 0.25}px ${a}40`, display: "grid", placeItems: "center" }}>
        <I size={size * 0.48} noBlob strokeWidth={2.2} color={b === a ? a : "#FFFFFF"} style={{ filter: `drop-shadow(0 0 ${size * 0.08}px ${a}) drop-shadow(0 0 ${size * 0.18}px ${b}99)` }} />
      </div>
    </div>
  );
}

/* stat block: neon orb + glowing number + tracked label */
function HoloStat({ icon, colors, value, label, size = 38, row }) {
  return (
    <div style={{ display: "flex", flexDirection: row ? "row" : "column", alignItems: "center", gap: row ? 10 : 6, minWidth: 0 }}>
      <NeonIcon icon={icon} colors={colors} size={size} />
      <div style={{ textAlign: row ? "left" : "center", minWidth: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.05, fontVariantNumeric: "tabular-nums", textShadow: `0 0 12px ${colors[0]}AA` }}>{value}</div>
        <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.6, opacity: 0.75, textTransform: "uppercase", marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

/* inline glyph to replace emoji inside text (e.g. "🔥 3" → <Glyph icon={Flame}/> 3) */
function Glyph({ icon: I, colors = NEON.flame, size = 15 }) {
  return <I size={size} noBlob strokeWidth={2.4} color={colors[1]} style={{ verticalAlign: "-3px", filter: `drop-shadow(0 0 4px ${colors[0]})` }} />;
}

/* ---------------- PRACTICE CALENDAR (last 5 weeks, meaningful) ---------------- */
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MON_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtMins = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? " " + (m % 60) + "m" : ""}` : `${m}m`);
function PracticeCalendar({ logs, goal = 30 }) {
  const { T } = useApp();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const mon = new Date(today); mon.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 28);
  const byDay = {}; logs.forEach((l) => { const d = new Date(l.at); d.setHours(0, 0, 0, 0); const k = d.getTime(); (byDay[k] = byDay[k] || []).push(l); });
  const days = Array.from({ length: 35 }, (_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); const ls = byDay[d.getTime()] || []; return { d, i, dow: i % 7, mins: ls.reduce((s, l) => s + l.mins, 0), ls, future: d > today, today: d.getTime() === today.getTime() }; });
  const [sel, setSel] = useState(days.find((x) => x.today).i);
  const past = days.filter((x) => !x.future);
  const active = past.filter((x) => x.mins > 0);
  const total = past.reduce((s, x) => s + x.mins, 0);
  const best = past.reduce((b, x) => (x.mins > b.mins ? x : b), { mins: 0 });
  const wk = (w) => days.slice(w * 7, w * 7 + 7).reduce((s, x) => s + x.mins, 0);
  const thisW = wk(4), lastW = wk(3); const trend = lastW ? Math.round(((thisW - lastW) / lastW) * 100) : thisW ? 100 : 0;
  const goalDays = past.filter((x) => x.mins >= goal).length;
  const teamDays = past.filter((x) => x.dow === 4 || x.dow === 5); const teamHit = teamDays.filter((x) => x.mins > 0).length;
  const lvl = (m) => (m <= 0 ? 0 : m < 15 ? 1 : m < goal ? 2 : 3);
  const A = T.graffiti ? "#C6FF3D" : T.accent;
  const fill = (m) => [T.card2, A + "55", A + "AA", A][lvl(m)];
  const s = days[sel];
  const tile = (label, value, sub, colors) => (
    <div style={{ flex: "1 1 45%", minWidth: 0, padding: "10px 12px", borderRadius: 16, background: T.hero, color: T.heroText, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -18, top: -18, width: 60, height: 60, borderRadius: "50%", background: `radial-gradient(circle, ${colors[0]}66, transparent 70%)` }} />
      <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.4, opacity: 0.7 }}>{label}</div>
      <div style={{ fontSize: 19, fontWeight: 900, marginTop: 2, textShadow: `0 0 12px ${colors[0]}99` }}>{value}</div>
      <div style={{ fontSize: 10.5, opacity: 0.75, marginTop: 1 }}>{sub}</div>
    </div>
  );
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        {tile("ACTIVE DAYS", `${active.length}/${past.length}`, `${Math.round((active.length / Math.max(1, past.length)) * 100)}% consistency`, NEON.good)}
        {tile("TOTAL TIME", fmtMins(total), active.length ? `≈ ${Math.round(total / active.length)} min per active day` : "start today", NEON.time)}
        {tile("THIS WEEK", fmtMins(thisW), lastW || thisW ? `${trend >= 0 ? "▲" : "▼"} ${Math.abs(trend)}% vs last week (${fmtMins(lastW)})` : "no practice yet", trend >= 0 ? NEON.good : NEON.flame)}
        {tile("BEST DAY", best.mins ? fmtMins(best.mins) : "—", best.mins ? `${DAY_SHORT[best.dow]} ${best.d.getDate()} ${MON_SHORT[best.d.getMonth()]}` : "go set a record", NEON.gold)}
      </div>
      <Card pad={12}>
        <div style={{ display: "grid", gridTemplateColumns: "38px repeat(7, minmax(0, 1fr)) 38px", gap: 4, alignItems: "center" }}>
          <div />
          {DAY_SHORT.map((d, i) => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 800, color: i === 4 || i === 5 ? ink(T, A) : T.sub }}>{d}<div style={{ fontSize: 7.5, letterSpacing: 0.4, fontWeight: 800, color: ink(T, A), height: 9 }}>{i === 4 ? "REHRSL" : i === 5 ? "SERVE" : ""}</div></div>)}
          <div style={{ fontSize: 8.5, fontWeight: 800, color: T.faint, textAlign: "right" }}>WEEK</div>
          {[0, 1, 2, 3, 4].map((w) => (
            <React.Fragment key={w}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: T.sub, lineHeight: 1.1 }}>{w === 4 ? "This wk" : `${MON_SHORT[days[w * 7].d.getMonth()]} ${days[w * 7].d.getDate()}`}</div>
              {days.slice(w * 7, w * 7 + 7).map((x) => {
                const L = lvl(x.mins); const on = x.i === sel;
                return (
                  <button key={x.i} onClick={() => setSel(x.i)} style={{ aspectRatio: "1", minWidth: 0, borderRadius: 9, cursor: "pointer", padding: 0, position: "relative", fontFamily: FONT,
                    background: x.future ? "transparent" : fill(x.mins), border: x.future ? `1.5px dashed ${T.border}` : x.today ? `2px solid ${T.text}` : on ? `2px solid ${ink(T, A)}` : "2px solid transparent",
                    boxShadow: L === 3 ? `0 0 10px ${A}AA` : "none", color: L >= 2 ? (T.graffiti ? "#111" : T.accentText) : T.text, transform: on ? "scale(1.08)" : "none", transition: "transform .15s" }}>
                    <span style={{ position: "absolute", left: 4, top: 2, fontSize: 8.5, fontWeight: 700, opacity: 0.7 }}>{x.d.getDate()}</span>
                    {x.mins > 0 && <span style={{ fontSize: 10.5, fontWeight: 900, position: "relative", top: 4 }}>{x.mins}</span>}
                  </button>
                );
              })}
              <div style={{ fontSize: 10, fontWeight: 800, textAlign: "right", color: wk(w) ? T.text : T.faint, whiteSpace: "nowrap" }}>{wk(w) ? fmtMins(wk(w)).replace(" ", "") : "—"}</div>
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12, fontSize: 10, color: T.sub, fontWeight: 700, flexWrap: "wrap" }}>
          <span>Minutes:</span>
          {[["0", 0], ["1–14", 5], [`15–${goal - 1}`, 20], [`${goal}+ goal`, goal]].map(([l, m]) => <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 4, background: fill(m), boxShadow: lvl(m) === 3 ? `0 0 6px ${A}` : "none" }} />{l}</span>)}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 12, borderRadius: 4, border: `2px solid ${T.text}` }} />today</span>
        </div>
      </Card>
      <Card tone="card2" pad={12} style={{ marginTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{s.today ? "Today" : `${DAY_SHORT[s.dow]} ${s.d.getDate()} ${MON_SHORT[s.d.getMonth()]}`}{s.dow === 4 ? " · rehearsal day" : s.dow === 5 ? " · youth program, we serve" : ""}</div>
          <div style={{ fontWeight: 900, fontSize: 14, color: ink(T, A) }}>{s.future ? "upcoming" : s.mins ? `${s.mins} min` : "rest day"}</div>
        </div>
        {s.ls.length > 0 ? <div style={{ marginTop: 6 }}>{s.ls.map((l, k) => <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "4px 0", borderTop: k ? `1px solid ${T.border}` : "none" }}><span>{l.what}</span><span style={{ color: T.sub }}>{l.mins} min</span></div>)}</div>
          : <div style={{ fontSize: 12, color: T.sub, marginTop: 4 }}>{s.future ? "Nothing yet — this day is still ahead." : s.today ? `No practice logged yet. ${goal} minutes hits your daily goal.` : "No practice logged. Tap any square to see what you did that day."}</div>}
        <div style={{ fontSize: 11, color: T.sub, marginTop: 8 }}>Goal reached on <b style={{ color: T.text }}>{goalDays}</b> days · practised on <b style={{ color: T.text }}>{teamHit} of {teamDays.length}</b> Fri/Sat team days</div>
      </Card>
    </div>
  );
}
