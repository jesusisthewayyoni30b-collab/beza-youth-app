/* ============================ PRACTICE REMINDERS ============================ */
const DAYS7 = [["Mon", 1], ["Tue", 2], ["Wed", 3], ["Thu", 4], ["Fri", 5], ["Sat", 6], ["Sun", 0]];
const QUICK_TIMES = ["06:00", "07:00", "12:30", "17:00", "18:00", "20:00", "21:00"];
const GOALS = [10, 15, 20, 30, 45, 60];
const capNotif = () => (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications) || null;

/* schedules the real phone notifications (Android app) — on the web we remind in-app */
async function applyReminders(s, ask) {
  const LN = capNotif();
  try {
    if (LN) {
      if (ask) { const p = await LN.requestPermissions(); if (p.display !== "granted") return "denied"; }
      const pend = await LN.getPending(); if (pend.notifications && pend.notifications.length) await LN.cancel({ notifications: pend.notifications.map((n) => ({ id: n.id })) });
      if (!s.notif) return "off";
      const [h, m] = (s.reminder || "18:00").split(":").map(Number);
      const days = s.days && s.days.length ? s.days : [0, 1, 2, 3, 4, 5, 6];
      await LN.schedule({ notifications: days.map((d) => ({ id: 100 + d, title: "Time to practise 🎶", body: `Your ${s.goal || 20}-minute session is waiting. Let's grow for God's glory!`, schedule: { on: { weekday: d + 1, hour: h, minute: m }, allowWhileIdle: true } })) });
      return "scheduled";
    }
    if (ask && window.Notification && Notification.permission === "default") await Notification.requestPermission();
    return window.Notification && Notification.permission === "granted" ? "web" : "inapp";
  } catch (e) { console.warn("reminders", e); return "error"; }
}

/* while the app is open (web / iPhone), pop a notification at the reminder time */
function useWebReminder(settings, minsToday) {
  useEffect(() => {
    if (capNotif() || !settings.notif) return;
    const tick = () => {
      const d = new Date(); const hm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      const days = settings.days && settings.days.length ? settings.days : [0, 1, 2, 3, 4, 5, 6];
      const key = "beza-rem-" + d.toDateString();
      if (hm === settings.reminder && days.includes(d.getDay()) && !localStorage.getItem(key) && minsToday < (settings.goal || 20)) {
        localStorage.setItem(key, "1");
        if (window.Notification && Notification.permission === "granted") {
          const show = (reg) => (reg ? reg.showNotification("Time to practise 🎶", { body: `Your ${settings.goal || 20}-minute session is waiting.`, icon: "assets/icon-192.png" }) : new Notification("Time to practise 🎶", { body: `Your ${settings.goal || 20}-minute session is waiting.`, icon: "assets/icon-192.png" }));
          if (navigator.serviceWorker) navigator.serviceWorker.getRegistration().then(show).catch(() => show(null)); else show(null);
        }
      }
    };
    tick(); const t = setInterval(tick, 20000); return () => clearInterval(t);
  }, [settings.notif, settings.reminder, (settings.days || []).join(","), settings.goal, minsToday]);
}
/* is it past my practice time today and I haven't reached my goal? */
const reminderDue = (settings, minsToday) => {
  if (!settings.notif) return false; const d = new Date(); const days = settings.days && settings.days.length ? settings.days : [0, 1, 2, 3, 4, 5, 6];
  const [h, m] = (settings.reminder || "18:00").split(":").map(Number);
  return days.includes(d.getDay()) && d.getHours() * 60 + d.getMinutes() >= h * 60 + m && minsToday < (settings.goal || 20);
};

/* the picker used in sign-up and in Settings */
function ReminderPicker({ value, onChange }) {
  const { T } = useApp();
  const v = { notif: true, reminder: "18:00", days: [0, 1, 2, 3, 4, 5, 6], goal: 20, ...value };
  const set = (k, x) => onChange({ ...v, [k]: x });
  const lab = { fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "14px 0 8px", letterSpacing: 0.5 };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div><div style={{ fontWeight: 800, fontSize: 15 }}>Remind me to practise</div><div style={{ fontSize: 12, color: T.sub }}>{v.notif ? `${to12(v.reminder)} · ${v.days.length === 7 ? "every day" : DAYS7.filter(([, n]) => v.days.includes(n)).map(([d]) => d).join(", ")}` : "Off"}</div></div>
        <Toggle on={v.notif} onChange={(x) => set("notif", x)} />
      </div>
      {v.notif && <>
        <div style={lab}>WHAT TIME?</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {QUICK_TIMES.map((t) => <Chip key={t} active={v.reminder === t} onClick={() => set("reminder", t)}>{to12(t)}</Chip>)}
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 99, border: `1.5px solid ${QUICK_TIMES.includes(v.reminder) ? T.border : T.accent}`, fontSize: 13, fontWeight: 700 }}>
            Other: <input type="time" value={v.reminder} onChange={(e) => e.target.value && set("reminder", e.target.value)} style={{ background: "transparent", border: "none", color: T.text, fontFamily: FONT, fontSize: 13, fontWeight: 700, outline: "none" }} />
          </label>
        </div>
        <div style={lab}>WHICH DAYS?</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {DAYS7.map(([d, n]) => <Chip key={d} active={v.days.includes(n)} onClick={() => set("days", v.days.includes(n) ? v.days.filter((x) => x !== n) : [...v.days, n])}>{d}</Chip>)}
        </div>
        <div style={lab}>DAILY GOAL</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {GOALS.map((g) => <Chip key={g} active={v.goal === g} onClick={() => set("goal", g)}>{g} min</Chip>)}
        </div>
      </>}
    </div>
  );
}

/* ============================ HELP & FEEDBACK ============================ */
const FB_KINDS = [["bug", "🐞 Something's broken"], ["idea", "💡 Idea"], ["question", "❓ Question"], ["other", "💬 Other"]];
const HELP_FAQ = [
  ["How do I change my practice reminder?", "Profile → Settings → Practice reminder. Pick a time, the days and your daily goal, then Save."],
  ["The microphone doesn't work", "Allow the microphone when the browser asks. On a computer, click the 🎙 icon next to the web address and make sure the right mic is selected. Watch the MIC bar: if it moves, we can hear you."],
  ["How do I change what I serve in?", "Profile → tap your roles under your name → choose again. Your lessons update straight away."],
  ["Where are the chord charts for Saturday?", "Songs tab → \"This Saturday's set\". Tap a song, pick your instrument, or open Live mode while playing."],
  ["I changed phones. Is my progress gone?", "No. Sign in with the same email (or Google) and everything comes back."],
  ["The app says \"Update required\"", "Tap Update now. It takes a few seconds and keeps the whole team on the same version."],
];
function HelpFeedback({ onClose }) {
  const { T, user, toast } = useApp();
  const [kind, setKind] = useState("idea"); const [text, setText] = useState(""); const [busy, setBusy] = useState(false); const [open, setOpen] = useState(-1);
  const send = async () => {
    if (text.trim().length < 3) { toast("Write a few words first"); return; }
    setBusy(true);
    const id = `${Date.now()}_${(user.uid || "local").slice(0, 6)}`;
    const doc = { id, kind, text: text.trim(), uid: user.uid || null, name: user.name, roles: user.roles || [], version: BEZA_BUILD_NAME, device: shellVersion() > 0 ? "Android app" : /iPhone|iPad/.test(navigator.userAgent) ? "iPhone" : /Android/.test(navigator.userAgent) ? "Android browser" : "Computer", at: Date.now(), status: "new" };
    try { if (CLOUD.on) await CLOUD.set(`feedback/${id}`, doc, false); setText(""); toast("Sent to the leaders 💛 Thank you!"); onClose && onClose(); }
    catch (e) { toast("Couldn't send right now. Check your internet and try again."); }
    setBusy(false);
  };
  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 18 }}>Help & feedback</div>
      <div style={{ fontSize: 12.5, color: T.sub, marginTop: 2 }}>Tell the leaders what's not working, what you'd love to see, or ask a question.</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>{FB_KINDS.map(([k, l]) => <Chip key={k} active={kind === k} onClick={() => setKind(k)}>{l}</Chip>)}</div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder={kind === "bug" ? "What happened? What were you doing when it went wrong?" : kind === "idea" ? "What would make the app better for you or the team?" : kind === "question" ? "Ask anything about the app or the team…" : "Write your message…"}
        style={{ width: "100%", boxSizing: "border-box", marginTop: 10, border: `1.5px solid ${T.border}`, background: T.input, color: T.text, borderRadius: 16, padding: 12, fontFamily: FONT, fontSize: 14, resize: "vertical", outline: "none" }} />
      <Btn full style={{ marginTop: 10 }} icon={Send} onClick={send}>{busy ? "Sending…" : "Send to leaders"}</Btn>
      <div style={{ fontWeight: 800, fontSize: 14, margin: "18px 0 6px" }}>Quick help</div>
      {HELP_FAQ.map(([q, a], i) => (
        <div key={i} onClick={() => setOpen(open === i ? -1 : i)} style={{ padding: "10px 0", borderTop: `1px solid ${T.border}`, cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontWeight: 700, fontSize: 13.5 }}><span>{q}</span><span style={{ color: T.sub }}>{open === i ? "−" : "+"}</span></div>
          {open === i && <div style={{ fontSize: 12.5, color: T.sub, marginTop: 6, lineHeight: 1.5 }}>{a}</div>}
        </div>
      ))}
    </div>
  );
}
/* leaders: feedback inbox */
function FeedbackInbox() {
  const { T } = useApp();
  const [list, setList] = useState(null);
  useEffect(() => { if (!CLOUD.on) { setList([]); return; } return CLOUD.listen("feedback", { order: ["at", "desc"], limit: 60 }, (d) => setList(d), () => setList([])); }, []);
  const mark = (f, status) => CLOUD.update(`feedback/${f._id}`, { status }).catch(() => { });
  if (!list) return null;
  const fresh = list.filter((f) => f.status !== "done");
  return (
    <>
      <SectionTitle>Feedback inbox {fresh.length ? `· ${fresh.length} new` : ""}</SectionTitle>
      {list.length === 0 ? <Card tone="soft" style={{ fontSize: 13, textAlign: "center" }}>No feedback yet. Members send it from Settings → Help & feedback.</Card> :
        list.slice(0, 20).map((f) => (
          <Card key={f._id} pad={12} style={{ marginBottom: 8, opacity: f.status === "done" ? 0.55 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12, color: T.sub }}><span><b style={{ color: T.text }}>{f.name}</b> · {(FB_KINDS.find(([k]) => k === f.kind) || [0, f.kind])[1]}</span><span>{relTime(f.at)}</span></div>
            <div style={{ fontSize: 13.5, marginTop: 6, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{f.text}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: T.faint }}>{f.device} · v{f.version}</span>
              {f.status !== "done" ? <Btn small variant="soft" icon={Check} onClick={() => mark(f, "done")}>Done</Btn> : <Btn small variant="ghost" onClick={() => mark(f, "new")}>Reopen</Btn>}
            </div>
          </Card>
        ))}
    </>
  );
}

/* ============================ CHAT NOTIFICATIONS ============================ */
/* phone app → Android notification; web / iPhone → system notification while the app is open or in the background */
let chatNotifSeq = 0;
async function askChatNotif() {
  try { const LN = capNotif(); if (LN) { const p = await LN.checkPermissions(); if (p.display !== "granted") await LN.requestPermissions(); return; }
    if (window.Notification && Notification.permission === "default") await Notification.requestPermission(); } catch (e) { }
}
function chatNotify(title, body, gid) {
  try {
    const LN = capNotif();
    if (LN) { LN.schedule({ notifications: [{ id: 5000 + (chatNotifSeq++ % 900), title, body, group: "chat-" + gid, extra: { gid }, schedule: { at: new Date(Date.now() + 300), allowWhileIdle: true } }] }).catch(() => { }); return true; }
    if (window.Notification && Notification.permission === "granted") {
      const opts = { body, icon: "assets/icon-192.png", badge: "assets/icon-192.png", tag: "chat-" + gid, renotify: true, data: { gid } };
      const show = (reg) => { if (reg) reg.showNotification(title, opts); else { const n = new Notification(title, opts); n.onclick = () => { window.focus(); window.dispatchEvent(new CustomEvent("bz-open-chat", { detail: gid })); n.close(); }; } };
      if (navigator.serviceWorker) navigator.serviceWorker.getRegistration().then(show).catch(() => show(null)); else show(null);
      return true;
    }
  } catch (e) { }
  return false;
}
