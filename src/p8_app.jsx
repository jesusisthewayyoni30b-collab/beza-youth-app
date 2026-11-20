
/* ================================ APP SHELL ================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap');
.bz-root *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.bz-press{transition:transform .12s ease, opacity .12s}
.bz-press:active{transform:scale(.96)}
.bz-noscroll{scrollbar-width:none}
.bz-noscroll::-webkit-scrollbar{display:none}
.bz-fade{animation:bzFade .2s ease}
.bz-up{animation:bzUp .3s cubic-bezier(.2,.9,.3,1)}
.bz-push{animation:bzPush .32s cubic-bezier(.2,.9,.3,1)}
.bz-shake{animation:bzShake .4s}
.bz-toast{animation:bzToast .35s cubic-bezier(.2,1.4,.4,1)}
@keyframes bzFade{from{opacity:0}to{opacity:1}}
@keyframes bzUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes bzPush{from{opacity:.4;transform:translateX(40px)}to{opacity:1;transform:none}}
@keyframes bzToast{from{opacity:0;transform:translate(-50%,14px) scale(.9)}to{opacity:1;transform:translate(-50%,0) scale(1)}}
@keyframes bzShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
.bz-drip{transform-origin:top;animation:bzDrip 1.4s cubic-bezier(.3,.8,.3,1) both}
@keyframes bzDrip{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.bz-pop{animation:bzPop .55s cubic-bezier(.2,1.6,.4,1) both}
@keyframes bzPop{from{transform:scale(0) rotate(-20deg)}to{transform:scale(1) rotate(0)}}
.bz-spray{opacity:0;animation:bzSpray 1s ease-out both}
@keyframes bzSpray{0%{opacity:0;transform:translate(110px,90px) scale(.3)}20%{opacity:1}100%{opacity:.9;transform:translate(var(--dx),var(--dy)) scale(1)}}
.bz-can{animation:bzCan 1.6s ease-in-out both}
@keyframes bzCan{0%{transform:translate(120px,40px) rotate(30deg)}25%{transform:translate(0,0) rotate(-18deg)}35%{transform:rotate(-8deg) translateY(-6px)}45%{transform:rotate(-22deg) translateY(4px)}55%{transform:rotate(-10deg) translateY(-6px)}65%{transform:rotate(-20deg)}100%{transform:translate(140px,60px) rotate(40deg);opacity:0}}
.bz-reveal{animation:bzReveal 1.1s cubic-bezier(.6,0,.2,1) .6s both}
@keyframes bzReveal{from{clip-path:circle(0% at 70% 60%);transform:rotate(-6deg) scale(.9)}to{clip-path:circle(150% at 70% 60%);transform:none}}
.bz-letter{display:inline-block;animation:bzLetter .6s cubic-bezier(.2,1.8,.4,1) both}
@keyframes bzLetter{from{opacity:0;transform:translateY(-70px) rotate(-25deg) scale(1.6)}to{opacity:1;transform:none}}
.bz-fadein{animation:bzFadeIn .6s ease both}
@keyframes bzFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.bz-sticker{animation:bzSticker .5s cubic-bezier(.2,1.8,.4,1) both}
@keyframes bzSticker{from{opacity:0;transform:scale(0) rotate(40deg)}to{opacity:1}}
.bz-range{-webkit-appearance:none;appearance:none;height:6px;border-radius:9px;background:rgba(127,127,127,.28);outline:none}
.bz-range::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:var(--bz-accent);border:3px solid var(--bz-thumb);cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.3)}
.bz-range::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--bz-accent);border:3px solid var(--bz-thumb);cursor:pointer}
input::placeholder,textarea::placeholder{color:inherit;opacity:.45}
.bz-stage{min-height:100vh;width:100%;display:flex;align-items:center;justify-content:center;padding:24px 0}
.bz-device{width:400px;height:860px;border-radius:48px;overflow:hidden;position:relative;box-shadow:0 40px 80px -30px rgba(0,0,0,.55),0 0 0 10px #12171b,0 0 0 11px #2a3238}
.bz-status{display:flex}
.bz-web.bz-stage{padding:0;display:block}
.bz-web .bz-device{width:100vw;height:100vh;height:100dvh;border-radius:0;box-shadow:none}
.bz-web .bz-status{display:none !important}
.bz-web .bz-top{padding-top:0}
.bz-scaled.bz-stage{padding:0;display:block;overflow:hidden;height:100vh;height:100dvh}
.bz-side-item{transition:background .2s,color .2s}
.bz-side-item:hover{filter:brightness(1.08)}
.bz-top{padding-top:50px}
@media (max-width:999px){.bz-stage{padding:0}.bz-device{width:100vw;height:100vh;height:100dvh;border-radius:0;box-shadow:none}.bz-status{display:none}.bz-top{padding-top:max(14px,env(safe-area-inset-top))}}
`;

const LS_KEY = "beza-youth-team-v2";
const loadSaved = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; } };
const TABS = ["learn", "practice", "songs", "home", "games", "progress", "chat"];

function Layer({ visible, fill, push: isPush, children, web, wide }) {
  const ref = useRef(null); const saved = useRef(0);
  React.useLayoutEffect(() => { if (visible && ref.current) ref.current.scrollTop = saved.current; }, [visible]);
  return (
    <div ref={ref} onScroll={(e) => { if (visible) saved.current = e.currentTarget.scrollTop; }} className={`bz-noscroll bz-top ${isPush ? "bz-push" : ""}`}
      style={{ position: "absolute", inset: 0, overflowY: fill ? "hidden" : "auto", display: visible ? "block" : "none" }}>
      <div style={{ padding: web ? `28px 36px ${fill ? 24 : 60}px` : `6px 18px ${fill ? 118 : 124}px`, height: fill ? "100%" : undefined, position: "relative", maxWidth: web ? (wide ? "none" : 1180) : undefined, margin: web ? "0 auto" : undefined, boxSizing: "border-box" }}>{children}</div>
    </div>
  );
}

function GraffitiBG() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 860" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.11 }}>
      <text x="-20" y="180" fontFamily="Sedgwick Ave Display, cursive" fontSize="120" fill="none" stroke="#FF3EA5" strokeWidth="2" transform="rotate(-12 0 180)">BEZA</text>
      <text x="150" y="420" fontFamily="Sedgwick Ave Display, cursive" fontSize="96" fill="none" stroke="#22E4FF" strokeWidth="2" transform="rotate(8 150 420)">YOUTH</text>
      <text x="-10" y="660" fontFamily="Permanent Marker, cursive" fontSize="80" fill="none" stroke="#C6FF3D" strokeWidth="2" transform="rotate(-6 0 660)">PRAISE</text>
      <text x="200" y="820" fontFamily="Poppins" fontWeight="900" fontSize="62" fill="none" stroke="#FFE53D" strokeWidth="2" transform="rotate(-4 200 820)">ኢየሱስ</text>
      <path d="M300 60 l12 -24 l12 24 l12 -24 l12 24 v14 h-48 z" fill="none" stroke="#FFE53D" strokeWidth="3" />
      {[[40, 300, "#FF8A00"], [350, 240, "#8B5CFF"], [80, 520, "#22E4FF"], [330, 600, "#FF3EA5"], [200, 120, "#C6FF3D"]].map(([x, y, c], i) => (
        <g key={i} fill={c}>{Array.from({ length: 14 }).map((_, k) => <circle key={k} cx={x + Math.cos(k * 2.4) * (8 + (k * 7) % 30)} cy={y + Math.sin(k * 2.4) * (8 + (k * 11) % 30)} r={1 + (k % 4)} />)}</g>
      ))}
      {[[60, "#FF3EA5"], [250, "#22E4FF"], [370, "#C6FF3D"]].map(([x, c], i) => <rect key={i} x={x} y={0} width={6} height={60 + i * 30} rx={3} fill={c} />)}
    </svg>
  );
}

function BottomNav({ tab, onTab, labels }) {
  const { T } = useApp();
  const items = [["learn", BookOpen, labels.learn], ["practice", Dumbbell, labels.practice], ["songs", Music, labels.songs], ["home", Plus, labels.home], ["games", Trophy, labels.games], ["progress", BarChart, labels.progress], ["chat", MessageCircle, labels.chat]];
  const i = TABS.indexOf(tab); const N = items.length; const ActiveIcon = items[i][1];
  const PAD = 6; const frac = ((i + 0.5) / N).toFixed(4); const ctr = `(${PAD}px + (100% - ${PAD * 2}px) * ${frac})`;
  return (
    <div data-nav="1" style={{ position: "absolute", left: 12, right: 12, bottom: 12, height: 70, zIndex: 40, filter: T.dark ? "drop-shadow(0 -4px 14px rgba(0,0,0,.45))" : "drop-shadow(0 6px 16px rgba(23,59,71,.22))" }}>
      <div style={{ position: "absolute", left: 10, right: 10, top: -27, height: 28, overflow: "hidden", pointerEvents: "none" }}><svg width="120" height="30" viewBox="0 0 132 30" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: `calc(${PAD - 18}px + (100% + ${36 - PAD * 2}px) * ${frac} - 60px)`, transition: "left .5s cubic-bezier(.45,1.45,.45,1)", overflow: "visible" }}><path d="M0,30 C28,30 36,1 66,1 C96,1 104,30 132,30 Z" fill={T.nav} />{T.graffiti && <path d="M6,29 C30,28 38,2 66,2 C94,2 102,28 126,29" fill="none" stroke="rgba(198,255,61,0.35)" strokeWidth="1.5" />}</svg></div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: T.nav, border: T.graffiti ? "1px solid rgba(255,255,255,0.06)" : "none" }} />
      <div className="bz-press" style={{ position: "absolute", top: -21, left: `calc(${ctr} - 28px)`, width: 56, height: 56, borderRadius: 99, background: T.graffiti ? "linear-gradient(135deg,#C6FF3D,#22E4FF)" : T.accent, color: T.accentText, display: "grid", placeItems: "center", transition: "left .5s cubic-bezier(.45,1.45,.45,1)", boxShadow: T.graffiti ? "3px 4px 0 #0B0D10" : "0 8px 18px -6px rgba(0,0,0,.4)", pointerEvents: "none", zIndex: 2 }}>
        <ActiveIcon size={26} noBlob strokeWidth={2.6} color={T.graffiti ? "#111" : T.accentText} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: PAD, right: PAD, display: "flex", zIndex: 3 }}>
        {items.map(([id, I, label], k) => { const on = k === i;
          return (
            <button key={id} onClick={() => onTab(id)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", paddingBottom: 10, gap: 4, color: on ? T.text : T.navIcon, fontFamily: FONT }}>
              {!on && <I size={23} noBlob strokeWidth={2.1} />}
              <span style={{ fontSize: 10, fontWeight: on ? 800 : 600, whiteSpace: "nowrap", letterSpacing: -0.1 }}>{label}</span>
            </button>
          ); })}
      </div>
    </div>
  );
}

function SideNav({ tab, onTab, labels }) {
  const { T, user, avatar, push, leader, streak, minutes } = useApp();
  const items = [["home", Home, labels.home], ["learn", BookOpen, labels.learn], ["practice", Dumbbell, labels.practice], ["songs", Music, labels.songs], ["games", Trophy, labels.games], ["progress", BarChart, labels.progress], ["chat", MessageCircle, labels.chat]];
  return (
    <div data-nav="1" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 248, background: T.nav, display: "flex", flexDirection: "column", padding: "26px 16px 18px", boxSizing: "border-box", zIndex: 40, borderRight: `1px solid ${T.border}` }}>
      <div style={{ padding: "0 8px 22px" }}><LogoLockup width={176} /></div>
      {items.map(([id, I, label]) => { const on = id === tab; return (
        <button key={id} onClick={() => onTab(id)} className="bz-side-item" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginBottom: 4, borderRadius: 16, border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 14.5, fontWeight: on ? 800 : 600, textAlign: "left", background: on ? (T.graffiti ? "linear-gradient(135deg,#C6FF3D,#22E4FF)" : T.accent) : "transparent", color: on ? (T.graffiti ? "#111" : T.accentText) : T.navIcon }}>
          <I size={21} noBlob strokeWidth={2.3} />{label}
        </button>
      ); })}
      {leader && <button onClick={() => { onTab("home"); setTimeout(() => push({ screen: "leaders" }), 30); }} className="bz-side-item" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginTop: 6, borderRadius: 16, border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 700, background: "transparent", color: T.navIcon }}><Shield size={20} noBlob />Leaders Board</button>}
      <div style={{ flex: 1 }} />
      <div onClick={() => push({ screen: "profile" })} className="bz-press" style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 18, background: T.card, cursor: "pointer" }}>
        <Avatar name={user.name} src={avatar} size={40} color={T.pop} />
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 800, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div><div style={{ fontSize: 11, color: T.sub }}>🔥 {streak} day streak · {minutes} min</div></div>
        <Settings size={18} noBlob color={T.sub} />
      </div>
    </div>
  );
}

function SidePanel() {
  const { T, user, games, push, setTab } = useApp();
  const v = VERSES[new Date().getDate() % VERSES.length];
  const board = [...TEAM.map((m) => ({ name: m.name, color: m.color, xp: teamScore(m) })), { name: user.name, color: T.pop, xp: gameXP(games), me: true }].sort((a, b) => b.xp - a.xp);
  const day = new Date().getDate(); const nextDay = Object.keys(EVENTS).map(Number).filter((d) => d >= day && EVENTS[d].length).sort((a, b) => a - b)[0]; const ev = nextDay ? EVENTS[nextDay][0] : null;
  const wk = WEEK.find((w) => w.n === nextDay);
  return (
    <div className="bz-noscroll" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 320, overflowY: "auto", padding: "28px 22px", boxSizing: "border-box", borderLeft: `1px solid ${T.border}`, zIndex: 20 }}>
      <Card tone="hero" style={{ padding: 18, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.85 }}>VERSE OF THE DAY</div>
        <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.5, margin: "8px 0 6px" }}>"{v.txt}"</div>
        <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 700 }}>{v.ref}</div>
      </Card>
      {ev && (
        <Card style={{ marginBottom: 14 }} onClick={() => { setTab("home"); setTimeout(() => push({ screen: "schedule", day: nextDay }), 30); }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: T.sub }}>NEXT UP · {wk ? wk.d.toUpperCase() : ""} {nextDay}</div>
          <div style={{ fontWeight: 800, fontSize: 15, marginTop: 6 }}>{ev.title}</div>
          <div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>{to12(ev.t)} – {to12(ev.end)} · {ev.sub}</div>
        </Card>
      )}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: T.sub }}>GAME LEADERBOARD</div><button onClick={() => { setTab("games"); setTimeout(() => push({ screen: "board" }), 30); }} style={{ background: "none", border: "none", color: T.accent, fontFamily: FONT, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>See all</button></div>
        {board.slice(0, 6).map((r, i) => (
          <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
            <div style={{ width: 22, textAlign: "center", fontWeight: 900, fontSize: 12.5 }}>{["🥇", "🥈", "🥉"][i] || i + 1}</div>
            <Avatar name={r.name} size={28} color={r.color} />
            <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: r.me ? 800 : 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.me ? "You" : r.name}</div>
            <div style={{ fontSize: 12.5, fontWeight: 800 }}>{r.xp.toLocaleString()}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

const useWinSize = () => { const [w, setW] = useState({ w: window.innerWidth, h: window.innerHeight }); useEffect(() => { const f = () => setW({ w: window.innerWidth, h: window.innerHeight }); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []); return w; };

export default function BezaYouthWorshipTeam() {
  const saved = useMemo(loadSaved, []);
  const [themeId, setThemeId] = useState(saved.themeV === 2 && saved.themeId ? saved.themeId : "youth");
  const [user, setUserRaw] = useState(saved.user || null);
  const outside = !user || !user.roles || !user.roles.length;
  const T = outside ? THEMES.graffiti : (THEMES[themeId] || THEMES.youth);
  const [tab, setTabRaw] = useState("home");
  const [stacks, setStacks] = useState({ learn: [], practice: [], home: [], songs: [], games: [], progress: [], chat: [] });
  const [done, setDone] = useState(() => new Set(saved.done || []));
  const [logs, setLogs] = useState(saved.logs || []);
  const [voice, setVoice] = useState(saved.voice || null);
  const [voiceRange, setVoiceRange] = useState(saved.voiceRange || null);
  const [avatar, setAvatar] = useState(saved.avatar || null);
  const [leader, setLeader] = useState(!!saved.leader);
  const [settings, setSettings] = useState({ lang: "en", notif: true, reminder: "18:00", click: "click", a4: 440, pcKeys: true, autoUpdate: true, ...(saved.settings || {}) });
  const [update, setUpdate] = useState({ version: BEZA_BUILD_NAME, build: BEZA_BUILD, available: false, progress: null, remote: null });
  const [assignments, setAssignments] = useState(saved.assignments || []);
  const [sessionsDone, setSessionsDone] = useState(saved.sessionsDone || {});
  const [toastMsg, setToastMsg] = useState("");
  const [quick, setQuick] = useState(false);
  const [intro, setIntro] = useState(true);
  const [chat, setChat] = useState(() => (CLOUD.on ? {} : { ...SEED_CHAT, ...(saved.chat || {}) }));
  const [groups, setGroups] = useState(CLOUD.on ? null : saved.groups || null);
  const [authState, setAuthState] = useState(CLOUD.on ? "loading" : "off");
  const [, setTeamV] = useState(0);
  const [games, setGames] = useState(saved.games || { best: {} });
  const [songs, setSongs] = useState(CLOUD.on ? [] : saved.songs || SEED_SONGS);
  const [feed, setFeed] = useState(CLOUD.on ? [] : [
    { id: 1, who: "Liya Desta", leader: true, pinned: true, t: "Today · 10:20 AM", text: "Friday rehearsal starts at 4:00 PM this week (we usually finish around 7–8 PM). Saturday we run through before the 3:00 PM youth program. Singers: finish the Harmony I class before Friday 🙏" },
    { id: 2, who: "Eyob Fikru", t: "Yesterday", text: "Sound team — the 7-band EQ Lab now works with your own recordings. Upload a rehearsal and try the ear quiz 🎧" },
  ]);
  const [planDone, setPlanDone] = useState({});
  const [host, setHost] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify({ themeV: 2, themeId, user, done: [...done], logs: logs.slice(0, 400), voice, voiceRange, avatar, leader, settings, assignments, sessionsDone, groups, games, songs, chat: Object.fromEntries(Object.entries(chat).map(([k, v]) => [k, v.slice(-60).map((m) => (m.file && (m.file.url || m.file.audio) ? { ...m, file: { ...m.file, url: null, audio: null } } : m))])) })); } catch (e) { } }, [themeId, user, done, logs, voice, voiceRange, avatar, leader, settings, assignments, sessionsDone, groups, games, songs, chat]);
  useEffect(() => { if (!CLOUD.on && !groups && user && user.roles && user.roles.length) setGroups(defaultGroups(user, leader)); }, [user, groups]); // eslint-disable-line
  useEffect(() => { if (!CLOUD.on && leader && groups) { const l = groups.find((g) => g.id === "leaders"); if (l && !l.members.includes("@me")) setGroups((gs) => gs.map((g) => (g.id === "leaders" ? { ...g, members: [...g.members, "@me"] } : g))); } }, [leader]); // eslint-disable-line
  useEffect(() => { AE.settings.a4 = settings.a4; AE.settings.click = settings.click; }, [settings]);
  useEffect(() => {
    try { AE.preloadAll(); } catch (e) { }
    const unlock = () => { try { AE.get(); } catch (e) { } };
    window.addEventListener("pointerdown", unlock, { passive: true }); window.addEventListener("touchend", unlock, { passive: true });
    return () => { window.removeEventListener("pointerdown", unlock); window.removeEventListener("touchend", unlock); };
  }, []);

  useEffect(() => {
    if (!CLOUD.on) return;
    return CLOUD.onAuth(async (u) => {
      if (!u) { setUserRaw(null); setLeader(false); setAuthState("out"); return; }
      const local = saved.user && saved.user.uid === u.uid ? saved : null;
      const legacy = saved.user && !saved.user.uid ? saved : null; // progress made before accounts existed
      let prof; let ok = false;
      for (let i = 0; i < 40 && !ok; i++) { try { prof = await CLOUD.get(`users/${u.uid}`); ok = true; } catch (e) { if (local) break; await new Promise((r) => setTimeout(r, 1500)); } }
      if (prof) {
        setUserRaw({ uid: u.uid, name: prof.name || u.name || "Member", email: u.email, roles: prof.roles || [], levels: prof.levels || {} });
        setDone(new Set(prof.done || [])); setLogs(prof.logs || []); setVoice(prof.voice || null); setVoiceRange(prof.voiceRange || null); setAvatar(prof.avatar || null); setGames(prof.games || { best: {} }); setSessionsDone(prof.sessionsDone || {}); setLeader(!!prof.leader);
      } else if (!ok && local) {
        setUserRaw({ ...local.user });
      } else if (legacy) {
        setUserRaw({ uid: u.uid, name: window.__bezaPendingName || u.name || legacy.user.name, email: u.email, roles: legacy.user.roles || [], levels: legacy.user.levels || {} }); setLeader(false);
      } else {
        setUserRaw({ uid: u.uid, name: window.__bezaPendingName || u.name || (u.email || "Member").split("@")[0], email: u.email, roles: [], levels: {} });
        setDone(new Set()); setLogs([]); setVoice(null); setAvatar(u.photo || null); setGames({ best: {} }); setSessionsDone({}); setLeader(false); setAssignments([]);
      }
      setTabRaw("home"); setAuthState("in");
    });
  }, []); // eslint-disable-line
  const toast = useCallback((m) => { setToastMsg(m); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToastMsg(""), 2700); }, []);
  const push = useCallback((r) => setStacks((s) => ({ ...s, [tabRef.current]: [...s[tabRef.current], { ...r, key: Date.now() + Math.random() }] })), []);
  const pop = useCallback(() => setStacks((s) => ({ ...s, [tabRef.current]: s[tabRef.current].slice(0, -1) })), []);
  const tabRef = useRef(tab); tabRef.current = tab;
  const setTab = useCallback((t) => {
    if (t === tabRef.current) { setStacks((s) => { if (s[t].length) return { ...s, [t]: [] }; if (t === "home") setQuick(true); return s; }); return; }
    setTabRaw(t);
  }, []);
  const logPractice = useCallback((m, what = "Practice") => setLogs((l) => [{ at: Date.now(), mins: m, what }, ...l]), []);
  const completeLesson = useCallback((id, mins = 10) => { setDone((d) => new Set([...d, id])); logPractice(mins, (LESSONS[id] && LESSONS[id].title) || "Class"); setAssignments((a) => a.map((x) => (x.ref === id && x.toMe ? { ...x, status: "done" } : x))); toast("Class complete! You're growing 🔥"); }, [toast, logPractice]);
  const checkUpdate = useCallback(async () => {
    if (BEZA_BUILD === "dev") return null;
    try {
      const r = await fetch("version.json?t=" + Date.now(), { cache: "no-store" }); if (!r.ok) return null;
      const v = await r.json();
      const shellOld = v.minShell && shellVersion() > 0 && shellVersion() < v.minShell;
      if ((v.build && v.build !== BEZA_BUILD) || shellOld) { setUpdate((u) => ({ ...u, available: true, remote: v, shellOld })); return v; }
      setUpdate((u) => ({ ...u, available: false, remote: v })); return false;
    } catch (e) { return null; }
  }, []);
  useEffect(() => {
    checkUpdate(); const iv = setInterval(checkUpdate, 5 * 60 * 1000);
    const vis = () => { if (document.visibilityState === "visible") checkUpdate(); };
    document.addEventListener("visibilitychange", vis); window.addEventListener("online", vis);
    return () => { clearInterval(iv); document.removeEventListener("visibilitychange", vis); window.removeEventListener("online", vis); };
  }, [checkUpdate]);
  const runUpdate = useCallback(async () => {
    setUpdate((u) => ({ ...u, progress: 0 }));
    try { if (window.caches) { const ks = await caches.keys(); await Promise.all(ks.filter((k) => !/samples|media/.test(k)).map((k) => caches.delete(k))); } } catch (e) { }
    try { if (navigator.serviceWorker) { const rs = await navigator.serviceWorker.getRegistrations(); await Promise.all(rs.map((r) => r.update().catch(() => { }))); } } catch (e) { }
    setUpdate((u) => ({ ...u, progress: 100 }));
    const url = new URL(window.location.href); url.searchParams.set("v", (update.remote && update.remote.build) || Date.now()); window.location.replace(url.toString());
  }, [update.remote]);
  const setUser = (u) => {
    if (CLOUD.on && !u) { CLOUD.signOut().catch(() => { }); setGroups(null); setChat({}); setAssignments([]); setDone(new Set()); setLogs([]); setAvatar(null); setVoice(null); setGames({ best: {} }); setSessionsDone({}); }
    setUserRaw(u); setTabRaw("home"); setStacks({ learn: [], practice: [], home: [], songs: [], games: [], progress: [], chat: [] });
    if (!CLOUD.on && u && u.roles && u.roles.length && !logs.length) { const now = Date.now(); setLogs([2, 3, 4, 6, 7, 9, 11].map((d, i) => ({ at: now - d * 864e5, mins: [15, 30, 10, 25, 20, 30, 12][i], what: ["Vocal Gym", "Daily Vocal Workout", "Ear training", "Harmony drills", "Breath Lab", "Daily Keys Workout", "Scale studies"][i] }))); setDone(new Set()); }
  };
  const setRoles = (roles, levels) => {
    setUserRaw((u) => ({ ...u, roles, levels: { ...(u.levels || {}), ...levels } }));
    if (CLOUD.on && user && user.uid && !(user.roles || []).length) { const pick = CURRICULUM.heart.all[0]; CLOUD.set(`assignments/welcome-${user.uid}`, { id: `welcome-${user.uid}`, toUid: user.uid, fromUid: user.uid, from: "Beza Youth leaders", role: "heart", kind: "lesson", ref: pick, title: LESSONS[pick].title, due: "Before Saturday rehearsal", comment: "Welcome to the team! Before anything else — skills, songs, sound — start here. Read it slowly, pray through it, and come ready to share one thing God spoke to you 🙏", status: "sent", at: Date.now() }, false).catch(() => { }); return; }
    if (!CLOUD.on && !assignments.some((a) => a.toMe)) { const pick = CURRICULUM.heart.all[0];
      setAssignments((a) => [{ id: Date.now(), toMe: true, from: CLOUD.on ? "Beza Youth leaders" : "Liya Desta", role: "heart", kind: "lesson", ref: pick, title: LESSONS[pick].title, due: "Before Saturday rehearsal", comment: "Welcome to the team! Before anything else — skills, songs, sound — start here. Read it slowly, pray through it, and come ready to share one thing God spoke to you 🙏", status: "sent" }, ...a]); }
  };
  const roles = (user && user.roles) || [];
  const plan = useMemo(() => {
    if (!roles.length) return [];
    const r0 = roles[0]; const t0 = toolsFor([r0])[0]; const C = CURRICULUM[r0]; const next = C ? C.all.find((id) => !done.has(id)) || C.all[0] : null; const s = sessionsFor(roles)[0];
    const H = CURRICULUM.heart; const hNext = H.all.find((id) => !done.has(id)) || H.all[0];
    const items = [
      { id: "heart", title: LESSONS[hNext].title, sub: "Heart of Worship · start here", mins: LESSONS[hNext].mins, go: { screen: "lesson", id: hNext, role: "heart" } },
      t0 && { id: "warm", title: t0[1].title, sub: t0[1].desc, mins: 10, go: { screen: "tool", id: t0[0] } },
      next && { id: "lesson", title: LESSONS[next].title, sub: `${roleLabel(r0)} · Level ${LESSONS[next].level} class`, mins: LESSONS[next].mins, go: { screen: "lesson", id: next, role: r0 } },
      roles[1] && toolsFor([roles[1]])[0] && { id: "t2", title: toolsFor([roles[1]])[0][1].title, sub: `${roleLabel(roles[1])} practice`, mins: 10, go: { screen: "tool", id: toolsFor([roles[1]])[0][0] } },
      s && { id: "sess", title: s.title, sub: "30-minute guided session", mins: 30, go: { screen: "session", id: s.id } },
    ].filter(Boolean);
    return items.map((x) => ({ ...x, done: !!planDone[x.id] }));
  }, [roles.join(), done, planDone]); // eslint-disable-line
  const setPlan = (fn) => { const next = fn(plan); const m = {}; next.forEach((x) => (m[x.id] = x.done)); setPlanDone(m); };
  const streak = useMemo(() => { let s = 0; for (let d = 0; d < 60; d++) { const day = new Date(); day.setDate(day.getDate() - d); const has = logs.some((l) => new Date(l.at).toDateString() === day.toDateString()); if (has) s++; else if (d > 0) break; } return s; }, [logs]);

  const ctx = {
    T, themeId, setThemeId, user, setUser, setRoles, tab, setTab, push, pop, done, completeLesson, logs, logPractice, minutes: logs.reduce((s, l) => s + l.mins, 0), streak,
    voice, setVoice, voiceRange, setVoiceRange, avatar, setAvatar, leader, setLeader, settings, setSettings, update, runUpdate, checkUpdate, toast, chat, setChat, feed, setFeed, plan, setPlan,
    assignments, setAssignments, sessionsDone, setSessionsDone, host, groups: groups || [], setGroups: (f) => setGroups((g) => (typeof f === "function" ? f(g || []) : f)), games, setGames, songs, setSongs, replayIntro: () => setIntro(true),
  };
  const needsOnboarding = user && (!user.roles || !user.roles.length);
  const L = STR[settings.lang];
  const win = useWinSize();
  const view = /[?&]web=1/.test(window.location.search) ? "web" : "auto";
  const big = view === "web" || (view === "auto" && win.w >= 1000);
  const web = !!user && !needsOnboarding && big;
  const full = big || view === "auto"; // never show the phone-frame preview to real users
  const scaled = web && win.w < 1000; const VW = 1280; const sc = scaled ? win.w / VW : 1; const VH = scaled ? win.h / sc : win.h;
  const panel = web && (scaled ? VW : win.w) >= 1240;
  ctx.web = web;
  const time = nowHM();
  const rootFor = (t) => (t === "home" ? <HomeScreen /> : t === "learn" ? <LearnScreen /> : t === "practice" ? <PracticeScreen /> : t === "progress" ? <ProgressScreen /> : t === "songs" ? <SongsScreen /> : t === "games" ? <GamesHub root /> : <ChatScreen />);

  return (
    <Ctx.Provider value={ctx}>
      {CLOUD.on && user && user.uid && user.roles && user.roles.length > 0 && <CloudSync uid={user.uid} onTeam={() => setTeamV((v) => v + 1)} />}
      <style>{FONT_FACES + CSS}</style>
      {update.available && <UpdateGate />}
      <div className={`bz-root bz-stage${web || (big && full) ? " bz-web" : ""}${scaled ? " bz-scaled" : ""}`} style={{ background: T.dark ? "#07090b" : "#d9dfe1", fontFamily: FONT, ["--bz-accent"]: T.accent, ["--bz-thumb"]: T.dark ? "#1b2328" : "#fff", ["--ico-blob"]: T.blob }}>
        <div className="bz-device" ref={setHost} style={{ background: T.bg, color: T.text, ...(scaled ? { width: VW, height: VH, transform: `scale(${sc})`, transformOrigin: "0 0" } : {}) }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `${NOISE_SVG}, ${WEAVE}`, opacity: T.texture, pointerEvents: "none", mixBlendMode: T.dark ? "overlay" : "multiply" }} />
          {T.graffiti && <GraffitiBG />}
          <div className="bz-status" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 44, alignItems: "center", justifyContent: "space-between", padding: "0 30px", fontSize: 14, fontWeight: 700, zIndex: 30 }}>
            <span>{time}</span><span style={{ width: 110, height: 28, borderRadius: 20, background: "#000", position: "absolute", left: "50%", transform: "translateX(-50%)", top: 8 }} /><span style={{ display: "flex", gap: 5, alignItems: "center" }}><Radio size={14} noBlob /><span style={{ width: 24, height: 12, borderRadius: 4, border: `1.6px solid ${T.text}`, display: "inline-block", position: "relative" }}><span style={{ position: "absolute", inset: 1.5, right: 5, background: T.text, borderRadius: 2 }} /></span></span>
          </div>
          {authState === "loading" ? <CloudSplash /> : !user ? (
            big ? <AuthDesktop>{CLOUD.on ? <CloudLogin desktop /> : <Login />}</AuthDesktop>
              : <div className="bz-noscroll bz-top" style={{ position: "absolute", inset: 0, overflowY: "auto" }}>{CLOUD.on ? <CloudLogin /> : <Login />}</div>
          ) : needsOnboarding ? (
            <div className="bz-noscroll bz-top" style={{ position: "absolute", inset: 0, overflowY: "auto" }}><div style={big ? { maxWidth: 760, margin: "0 auto", padding: "40px 24px 60px" } : undefined}><Onboarding onDone={(r, lv) => setRoles(r, lv)} /></div></div>
          ) : (
            <>
              {web && <SideNav tab={tab} onTab={setTab} labels={L} />}
              {web && panel && <SidePanel />}
              <div style={web ? { position: "absolute", left: 248, right: panel ? 320 : 0, top: 0, bottom: 0 } : { position: "absolute", inset: 0 }}>
              {TABS.map((t) => {
                const st = stacks[t]; const activeTab = t === tab;
                return (
                  <React.Fragment key={t}>
                    <Layer web={web} visible={activeTab && st.length === 0} fill={t === "chat"}>{rootFor(t)}</Layer>
                    {st.map((r, k) => <Layer web={web} wide={["tool", "game", "games", "board", "groups", "group", "session"].includes(r.screen)} key={r.key} push visible={activeTab && k === st.length - 1}><RouteView r={r} /></Layer>)}
                  </React.Fragment>
                );
              })}
              </div>
              {!web && <BottomNav tab={tab} onTab={setTab} labels={L} />}
              <QuickSheet open={quick} onClose={() => setQuick(false)} />
            </>
          )}
          {toastMsg && <div className="bz-toast" style={{ position: "absolute", bottom: web ? 32 : 104, left: "50%", transform: "translateX(-50%)", zIndex: 80, background: T.graffiti ? "#111" : T.hero, color: "#fff", padding: "11px 16px", borderRadius: 99, fontSize: 13, fontWeight: 700, boxShadow: T.graffiti ? "3px 3px 0 #FF3EA5" : "0 10px 24px rgba(0,0,0,.3)", maxWidth: "88%", textAlign: "center", border: T.graffiti ? "1.5px solid #C6FF3D" : "none" }}>{toastMsg}</div>}
          {intro && <Intro onDone={() => setIntro(false)} />}
        </div>
      </div>
    </Ctx.Provider>
  );
}
