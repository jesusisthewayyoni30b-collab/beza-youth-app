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
