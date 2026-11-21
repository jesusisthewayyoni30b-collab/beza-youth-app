/* ============================ TEAM CALENDAR + DAILY VERSE ============================ */
/* ---------- daily verse: a different verse every day (400+ days before any repeat) ---------- */
const VERSE_CH = [["Psalm 95", 11], ["Psalm 96", 13], ["Psalm 98", 9], ["Psalm 100", 5], ["Psalm 103", 22], ["Psalm 145", 21], ["Psalm 146", 10], ["Psalm 147", 20], ["Psalm 148", 14], ["Psalm 149", 9], ["Psalm 150", 6], ["Psalm 34", 22], ["Psalm 23", 6], ["Psalm 27", 14], ["Psalm 63", 11], ["Psalm 84", 12], ["Psalm 91", 16], ["Psalm 121", 8], ["Psalm 139", 24]];
const VERSE_EXTRA = ["John 15:1-17", "Romans 12:1-21", "Colossians 3:12-17", "Philippians 4:4-13", "Ephesians 5:15-21", "1 Corinthians 13:1-13", "Matthew 5:3-16", "Isaiah 40:28-31", "Isaiah 6:1-8", "Revelation 4:8-11", "Revelation 5:9-13", "Galatians 5:22-25", "Lamentations 3:22-26", "Habakkuk 3:17-19", "1 Peter 2:9-10", "James 1:2-6", "Hebrews 12:1-3", "John 4:23-24", "Joshua 1:8-9", "Proverbs 3:5-6", "2 Timothy 3:16-17"];
const VERSE_REFS = (() => {
  const all = [];
  VERSE_CH.forEach(([c, n]) => { for (let v = 1; v <= n; v++) all.push(`${c}:${v}`); });
  VERSE_EXTRA.forEach((r) => { const m = r.match(/^(.*):(\d+)-(\d+)$/); for (let v = +m[2]; v <= +m[3]; v++) all.push(`${m[1]}:${v}`); });
  ["Zephaniah 3:17", "Micah 6:8", "Acts 16:25", "Hebrews 13:15", "2 Chronicles 5:13", "2 Chronicles 20:21", "2 Timothy 2:15", "Psalm 22:3", "Psalm 40:3", "Psalm 46:10", "Psalm 51:10", "Psalm 119:105", "Isaiah 61:3", "John 3:16", "John 14:6", "Romans 8:28", "Romans 15:13", "Jeremiah 29:11", "Nehemiah 8:10", "Exodus 15:2"].forEach((r) => all.push(r));
  // spread chapters out so consecutive days come from different books (deterministic shuffle)
  let seed = 7; const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
  return all;
})();
const VERSE_EPOCH = Date.UTC(2026, 10, 1);
const verseRefFor = (d = new Date()) => { const day = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - VERSE_EPOCH) / 864e5); return VERSE_REFS[((day % VERSE_REFS.length) + VERSE_REFS.length) % VERSE_REFS.length]; };
const verseCache = () => { try { return JSON.parse(localStorage.getItem("beza-verses") || "{}"); } catch (e) { return {}; } };
async function fetchVerse(ref) {
  const c = verseCache(); if (c[ref]) return c[ref];
  const r = await fetch(`https://bible-api.com/${ref.replace(/ /g, "+")}?translation=kjv`); if (!r.ok) throw new Error("verse");
  const j = await r.json(); const txt = (j.text || "").replace(/\s+/g, " ").trim(); if (!txt) throw new Error("empty");
  const c2 = verseCache(); c2[ref] = txt; const keys = Object.keys(c2); if (keys.length > 60) keys.slice(0, keys.length - 60).forEach((k) => delete c2[k]);
  try { localStorage.setItem("beza-verses", JSON.stringify(c2)); } catch (e) { } return txt;
}
function useDailyVerse() {
  const ref = verseRefFor(); const [txt, setTxt] = useState(() => verseCache()[ref] || null);
  useEffect(() => { let on = true; fetchVerse(ref).then((t) => on && setTxt(t)).catch(() => { });
    // fetch tomorrow's too, so it's ready offline
    const tm = new Date(); tm.setDate(tm.getDate() + 1); fetchVerse(verseRefFor(tm)).catch(() => { });
    return () => { on = false; }; }, [ref]);
  return { ref, txt: txt || "Open your Bible and read today's verse — it will appear here when you're online.", loaded: !!txt };
}

/* ---------- team calendar (leaders post, everyone sees + gets notified) ---------- */
const EV_KINDS = [["rehearsal", "🎸 Rehearsal", "#22E4FF"], ["program", "🙌 Youth program", "#C6FF3D"], ["prayer", "🙏 Prayer", "#FFE53D"], ["meeting", "🗣️ Meeting", "#B57BFF"], ["training", "📚 Training", "#FF8A00"], ["other", "📌 Other", "#FF3EA5"]];
const evKind = (k) => EV_KINDS.find((x) => x[0] === k) || EV_KINDS[5];
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseYmd = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const DAYN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; const MONN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDay = (d) => `${DAYN[d.getDay()]} ${d.getDate()} ${MONN[d.getMonth()]}`;
/* events on a date (weekly repeats included) */
const eventsOn = (events, d) => { const key = ymd(d); return (events || []).filter((e) => { if (e.date === key) return true; if (e.repeat === "weekly") { const s = parseYmd(e.date); return d >= s && d.getDay() === s.getDay() && (!e.until || key <= e.until); } return false; }).sort((a, b) => (a.start || "").localeCompare(b.start || "")); };
const forMe = (e, user, groups) => { const w = e.who || ["all"]; if (w.includes("all")) return true; const roles = user.roles || []; return w.some((x) => roles.includes(x) || (x === "musicians" && roles.some((r) => MUSICIAN_ROLES.includes(r))) || (x === "singers" && roles.includes("singer")) || (groups || []).some((g) => g.id === x && (g.members || []).includes("@me"))); };
const WHO_OPTS = [["all", "Everyone"], ["singers", "Singers"], ["musicians", "Musicians"], ["sound", "Sound team"], ["leaders", "Leaders"]];
const upcoming = (events, user, groups, days = 7) => { const out = []; const d0 = new Date(); d0.setHours(0, 0, 0, 0); for (let k = 0; k < days; k++) { const d = new Date(d0); d.setDate(d0.getDate() + k); eventsOn(events, d).filter((e) => forMe(e, user, groups)).forEach((e) => out.push({ e, d })); } return out; };

/* phone reminders 1 hour before each of MY events in the next 2 weeks */
async function scheduleEventReminders(events, user, groups, on) {
  const LN = capNotif(); if (!LN) return;
  try {
    const pend = await LN.getPending(); const old = (pend.notifications || []).filter((n) => n.id >= 7000 && n.id < 8000); if (old.length) await LN.cancel({ notifications: old.map((n) => ({ id: n.id })) });
    if (!on) return; const list = upcoming(events, user, groups, 14); let id = 7000; const now = Date.now(); const notes = [];
    list.forEach(({ e, d }) => { const [h, m] = (e.start || "09:00").split(":").map(Number); const at = new Date(d); at.setHours(h, m - 60, 0, 0); if (at.getTime() > now + 60000 && id < 7990) notes.push({ id: id++, title: `⏰ In 1 hour: ${e.title}`, body: `${to12(e.start)}${e.place ? " · " + e.place : ""}`, schedule: { at, allowWhileIdle: true } }); });
    if (notes.length) await LN.schedule({ notifications: notes });
  } catch (e) { console.warn("event reminders", e); }
}
/* web / iPhone: remind while the app is open */
function useEventReminders(events, user, groups, settings, onNotice) {
  useEffect(() => { if (!user || !user.roles || !user.roles.length) return; scheduleEventReminders(events, user, groups, settings.eventNotif !== false); }, [JSON.stringify(events || []), user && (user.roles || []).join(), settings.eventNotif]); // eslint-disable-line
  useEffect(() => {
    if (!user || capNotif() || settings.eventNotif === false) return;
    const tick = () => { upcoming(events, user, groups, 1).forEach(({ e, d }) => { const [h, m] = (e.start || "09:00").split(":").map(Number); const at = new Date(d); at.setHours(h, m, 0, 0); const mins = (at - Date.now()) / 60000; const k = `beza-evrem-${e.id}-${ymd(d)}`;
      if (mins > 0 && mins <= 60 && !localStorage.getItem(k)) { localStorage.setItem(k, "1"); onNotice && onNotice(`⏰ In ${Math.round(mins)} min: ${e.title}`, `${to12(e.start)}${e.place ? " · " + e.place : ""}`, "event"); } }); };
    tick(); const t = setInterval(tick, 60000); return () => clearInterval(t);
  }, [JSON.stringify(events || []), user && user.uid]); // eslint-disable-line
  /* once a week: "here's your week" */
  useEffect(() => {
    if (!user || !events) return; const now = new Date(); const wk = `${now.getFullYear()}-${Math.floor((now - new Date(now.getFullYear(), 0, 1)) / (7 * 864e5))}`; const k = "beza-weekping-" + wk;
    if (localStorage.getItem(k)) return; const list = upcoming(events, user, groups, 7); if (!list.length) return;
    const t = setTimeout(() => { localStorage.setItem(k, "1"); onNotice && onNotice(`📅 This week: ${list.length} event${list.length > 1 ? "s" : ""}`, list.slice(0, 3).map(({ e, d }) => `${DAYN[d.getDay()]} ${to12(e.start)} ${e.title}`).join(" · "), "event"); }, 4000);
    return () => clearTimeout(t);
  }, [events && events.length, user && user.uid]); // eslint-disable-line
}

function ScheduleScreen({ startDay }) {
  const { T, user, leader, events, setEvents, groups, toast, settings, setSettings } = useApp();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [sel, setSel] = useState(() => { if (typeof startDay === "string") return parseYmd(startDay); return today; });
  const [edit, setEdit] = useState(null);
  const ws = new Date(sel); ws.setDate(sel.getDate() - ((sel.getDay() + 6) % 7)); // Monday
  const week = Array.from({ length: 7 }, (_, k) => { const d = new Date(ws); d.setDate(ws.getDate() + k); return d; });
  const day = eventsOn(events, sel); const wkList = week.flatMap((d) => eventsOn(events, d).filter((e) => forMe(e, user, groups)).map((e) => ({ e, d })));
  const shiftWeek = (n) => { const d = new Date(sel); d.setDate(sel.getDate() + 7 * n); setSel(d); };
  const blank = () => ({ id: `${Date.now()}`, title: "", kind: "rehearsal", date: ymd(sel), start: "15:00", end: "17:00", place: "", who: ["all"], notes: "", repeat: "none" });
  const save = async (e) => {
    if (!e.title.trim()) { toast("Give the event a title"); return; }
    const doc = { ...e, title: e.title.trim(), by: user.name, byUid: user.uid || null, at: CLOUD.on ? CLOUD.now() : Date.now() };
    try { if (CLOUD.on) await CLOUD.set(`events/${e.id}`, doc, false); else setEvents((l) => [...(l || []).filter((x) => x.id !== e.id), { ...doc, at: Date.now() }]); setEdit(null); toast("Saved — the team will be notified 📅"); }
    catch (err) { toast("Couldn't save. Only leaders can post events."); }
  };
  const del = async (e) => { try { if (CLOUD.on) await CLOUD.del(`events/${e.id}`); else setEvents((l) => (l || []).filter((x) => x.id !== e.id)); setEdit(null); toast("Event deleted"); } catch (err) { toast("Couldn't delete"); } };
  const inp = { width: "100%", boxSizing: "border-box", border: `1.5px solid ${T.border}`, background: T.input, color: T.text, borderRadius: 12, padding: "10px 12px", fontFamily: FONT, fontSize: 14, outline: "none" };
  const EvCard = ({ e, d }) => { const k = evKind(e.kind); return (
    <Card pad={13} onClick={() => leader && setEdit({ ...e })} style={{ marginBottom: 8, borderLeft: `5px solid ${k[2]}`, cursor: leader ? "pointer" : "default" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><div style={{ fontWeight: 800, fontSize: 14.5 }}>{e.title}</div><span style={{ fontSize: 11, fontWeight: 800, color: T.sub, whiteSpace: "nowrap" }}>{k[1]}</span></div>
      <div style={{ fontSize: 12.5, color: T.sub, marginTop: 3 }}>{d ? fmtDay(d) + " · " : ""}{to12(e.start)}{e.end ? ` – ${to12(e.end)}` : ""}{e.place ? ` · 📍 ${e.place}` : ""}{e.repeat === "weekly" ? " · every week" : ""}</div>
      <div style={{ fontSize: 11.5, color: T.faint, marginTop: 3 }}>For: {(e.who || ["all"]).map((w) => (WHO_OPTS.find((o) => o[0] === w) || [w, w])[1]).join(", ")}{e.by ? ` · posted by ${e.by}` : ""}</div>
      {e.notes && <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{e.notes}</div>}
    </Card>); };
  return (
    <div>
      <TopBar title="Team calendar" sub={leader ? "You're a leader: tap + to add, tap an event to edit" : "Set by the leaders · you'll be notified"} right={leader ? <Btn small icon={Plus} onClick={() => setEdit(blank())}>Add</Btn> : null} />
      <Card tone="hero" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => shiftWeek(-1)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}><ChevronLeft /></button>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{MONN[week[0].getMonth()]} {week[0].getDate()} – {MONN[week[6].getMonth()]} {week[6].getDate()}</div>
          <button onClick={() => shiftWeek(1)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}><ChevronRight /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginTop: 12 }}>
          {week.map((d) => { const on = ymd(d) === ymd(sel); const isT = ymd(d) === ymd(today); const evs = eventsOn(events, d);
            return <button key={ymd(d)} onClick={() => setSel(d)} style={{ background: on ? T.pop : "transparent", color: on ? T.popText : "inherit", border: isT && !on ? "1.5px solid rgba(255,255,255,0.5)" : "none", borderRadius: 14, padding: "6px 0", fontFamily: FONT, cursor: "pointer" }}>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{DAYN[d.getDay()]}</div><div style={{ fontSize: 17, fontWeight: 900 }}>{d.getDate()}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 2, height: 6, marginTop: 2 }}>{evs.slice(0, 3).map((e) => <span key={e.id} style={{ width: 5, height: 5, borderRadius: 9, background: evKind(e.kind)[2] }} />)}</div>
            </button>; })}
        </div>
        {ymd(sel) !== ymd(today) && <Btn small variant="light" style={{ marginTop: 10 }} onClick={() => setSel(today)}>Today</Btn>}
      </Card>
      <SectionTitle>{fmtDay(sel)}</SectionTitle>
      {day.length === 0 ? <Card tone="soft" style={{ textAlign: "center", fontSize: 13 }}>{leader ? "Nothing on this day yet. Tap + Add to post an event." : "Nothing on this day."}</Card> : day.map((e) => <EvCard key={e.id} e={e} />)}
      <SectionTitle>This week for you</SectionTitle>
      {wkList.length === 0 ? <Card tone="soft" style={{ textAlign: "center", fontSize: 13 }}>No events this week yet.</Card> : wkList.map(({ e, d }) => <EvCard key={e.id + ymd(d)} e={e} d={d} />)}
      <Card style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}><Bell size={20} /><div style={{ flex: 1, fontSize: 13 }}><b>Remind me 1 hour before</b><div style={{ fontSize: 11.5, color: T.sub }}>And tell me when leaders post something new</div></div><Toggle on={settings.eventNotif !== false} onChange={(v) => { setSettings((s) => ({ ...s, eventNotif: v })); if (v) askChatNotif(); }} /></Card>
      <Sheet open={!!edit} onClose={() => setEdit(null)} title={edit && (events || []).some((x) => x.id === edit.id) ? "Edit event" : "New event"}>
        {edit && <div style={{ display: "grid", gap: 10 }}>
          <input style={inp} placeholder="Title (e.g. Full band rehearsal)" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{EV_KINDS.map(([k, l]) => <Chip key={k} active={edit.kind === k} onClick={() => setEdit({ ...edit, kind: k })} style={{ fontSize: 12 }}>{l}</Chip>)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <label style={{ fontSize: 11, color: T.sub }}>Date<input type="date" style={inp} value={edit.date} onChange={(e) => setEdit({ ...edit, date: e.target.value })} /></label>
            <label style={{ fontSize: 11, color: T.sub }}>Start<input type="time" style={inp} value={edit.start} onChange={(e) => setEdit({ ...edit, start: e.target.value })} /></label>
            <label style={{ fontSize: 11, color: T.sub }}>End<input type="time" style={inp} value={edit.end} onChange={(e) => setEdit({ ...edit, end: e.target.value })} /></label>
          </div>
          <input style={inp} placeholder="Place (e.g. Main hall)" value={edit.place} onChange={(e) => setEdit({ ...edit, place: e.target.value })} />
          <div><div style={{ fontSize: 11, color: T.sub, marginBottom: 4 }}>WHO IS IT FOR?</div><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{WHO_OPTS.map(([k, l]) => { const on = (edit.who || []).includes(k); return <Chip key={k} active={on} onClick={() => { let w = on ? edit.who.filter((x) => x !== k) : [...(edit.who || []).filter((x) => k === "all" ? false : x !== "all"), k]; if (!w.length) w = ["all"]; setEdit({ ...edit, who: w }); }} style={{ fontSize: 12 }}>{l}</Chip>; })}</div></div>
          <div style={{ display: "flex", gap: 6 }}><Chip active={edit.repeat !== "weekly"} onClick={() => setEdit({ ...edit, repeat: "none" })}>Once</Chip><Chip active={edit.repeat === "weekly"} onClick={() => setEdit({ ...edit, repeat: "weekly" })}>Every week</Chip></div>
          <textarea style={{ ...inp, resize: "vertical" }} rows={3} placeholder="Notes: songs, what to bring, dress code…" value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} />
          <Btn full icon={Check} onClick={() => save(edit)}>Save & notify the team</Btn>
          {(events || []).some((x) => x.id === edit.id) && <Btn full variant="soft" onClick={() => del(edit)} style={{ color: "#ff5a6e" }}>Delete event</Btn>}
        </div>}
      </Sheet>
    </div>
  );
}
/* home: this week at a glance */
function WeekGlance() {
  const { T, user, events, groups, push } = useApp();
  const list = upcoming(events, user, groups, 7);
  return (<>
    <SectionTitle action="Calendar" onAction={() => push({ screen: "schedule" })}>This week</SectionTitle>
    {list.length === 0 ? <Card tone="soft" onClick={() => push({ screen: "schedule" })} style={{ fontSize: 13, textAlign: "center", cursor: "pointer" }}>Nothing scheduled this week yet. The leaders will post rehearsals and programs here.</Card>
      : list.slice(0, 4).map(({ e, d }) => { const k = evKind(e.kind); const isToday = ymd(d) === ymd(new Date());
        return <Card key={e.id + ymd(d)} pad={12} onClick={() => push({ screen: "schedule", day: ymd(d) })} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 12, borderLeft: `5px solid ${k[2]}`, cursor: "pointer" }}>
          <div style={{ width: 46, textAlign: "center", flexShrink: 0 }}><div style={{ fontSize: 11, fontWeight: 800, color: isToday ? ink(T, T.pop) : T.sub }}>{isToday ? "TODAY" : DAYN[d.getDay()].toUpperCase()}</div><div style={{ fontSize: 20, fontWeight: 900 }}>{d.getDate()}</div></div>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 800, fontSize: 14 }}>{e.title}</div><div style={{ fontSize: 12, color: T.sub }}>{to12(e.start)}{e.end ? ` – ${to12(e.end)}` : ""}{e.place ? ` · ${e.place}` : ""}</div></div>
          <ChevronRight size={16} />
        </Card>; })}
  </>);
}
