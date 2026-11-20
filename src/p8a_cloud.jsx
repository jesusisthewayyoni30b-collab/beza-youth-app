
/* ============================ CLOUD (Firebase: accounts + shared team data) ============================ */
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, sendPasswordResetEmail, signOut as fbSignOut, updateProfile } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, doc as fsDoc, setDoc, getDoc, deleteDoc, updateDoc, collection, onSnapshot, query, orderBy, limit as fsLimit, where, serverTimestamp } from "firebase/firestore";

const FB_CONFIG = {
  apiKey: "AIzaSyDdULD6MFvt8ghq_uL1OUk-cH7YA4HT7RM",
  authDomain: "beza-youth.firebaseapp.com",
  projectId: "beza-youth",
  storageBucket: "beza-youth.firebasestorage.app",
  messagingSenderId: "1040652743191",
  appId: "1:1040652743191:web:9fe92173e90fef6c7b2252",
};

function makeFirebaseCloud() {
  const app = initializeApp(FB_CONFIG);
  const auth = getAuth(app);
  let db;
  try { db = initializeFirestore(app, { ignoreUndefinedProperties: true, localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) }); }
  catch (e) { db = initializeFirestore(app, { ignoreUndefinedProperties: true }); }
  const ref = (p) => fsDoc(db, ...p.split("/"));
  const col = (p) => collection(db, ...p.split("/"));
  getRedirectResult(auth).catch(() => { });
  return {
    on: true,
    onAuth: (cb) => onAuthStateChanged(auth, (u) => cb(u ? { uid: u.uid, email: u.email || "", name: u.displayName || "", photo: u.photoURL || null } : null)),
    signUp: async (name, email, pw) => { const c = await createUserWithEmailAndPassword(auth, email, pw); try { await updateProfile(c.user, { displayName: name }); } catch (e) { } return c.user.uid; },
    signIn: (email, pw) => signInWithEmailAndPassword(auth, email, pw),
    google: () => { const p = new GoogleAuthProvider(); p.setCustomParameters({ prompt: "select_account" }); const standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone; return standalone ? signInWithRedirect(auth, p) : signInWithPopup(auth, p); },
    reset: (email) => sendPasswordResetEmail(auth, email),
    signOut: () => fbSignOut(auth),
    get: async (p) => { const s = await getDoc(ref(p)); return s.exists() ? s.data() : null; },
    set: (p, d, merge = true) => setDoc(ref(p), d, { merge }),
    update: (p, d) => updateDoc(ref(p), d),
    del: (p) => deleteDoc(ref(p)),
    listen: (p, opts, cb, err) => {
      const parts = []; if (opts.where) parts.push(where(...opts.where)); if (opts.order) parts.push(orderBy(opts.order[0], opts.order[1] || "asc")); if (opts.limit) parts.push(fsLimit(opts.limit));
      const q = parts.length ? query(col(p), ...parts) : col(p);
      return onSnapshot(q, (s) => cb(s.docs.map((d) => ({ _id: d.id, ...d.data({ serverTimestamps: "estimate" }) }))), (e) => { console.warn("listen", p, e && e.code); err && err(e); });
    },
    now: () => serverTimestamp(),
  };
}
const CLOUD = (() => {
  if (typeof window !== "undefined" && window.BEZA_FAKE_CLOUD) return window.BEZA_FAKE_CLOUD;
  if (typeof window !== "undefined" && /[?&]local=1/.test(window.location.search)) return { on: false };
  try { return makeFirebaseCloud(); } catch (e) { console.warn("cloud off", e); return { on: false }; }
})();
if (CLOUD.on) TEAM.length = 0; // real members replace the sample team

const toMs = (t) => (t && typeof t.toMillis === "function" ? t.toMillis() : typeof t === "number" ? t : t && t.seconds ? t.seconds * 1000 : Date.now());
const relTime = (ms) => { const d = (Date.now() - ms) / 60000; if (d < 2) return "just now"; if (d < 60) return `${Math.round(d)}m ago`; if (d < 1440) return `${Math.round(d / 60)}h ago`; if (d < 2880) return "yesterday"; return `${Math.round(d / 1440)}d ago`; };
const chatTime = (ms) => { const d = new Date(ms); const now = new Date(); const hm = to12(`${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`); if (d.toDateString() === now.toDateString()) return hm; const y = new Date(now); y.setDate(now.getDate() - 1); if (d.toDateString() === y.toDateString()) return "Yesterday"; return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }); };
const MEMBER_COLORS = ["#E58FA8", "#6FB3D2", "#B79CE6", "#F5A94C", "#7CC9A0", "#EC8FC2", "#8FA6E5", "#E5C06F", "#6FD2C5", "#D28F6F"];
const colorForUid = (uid) => MEMBER_COLORS[[...(uid || "x")].reduce((s, c) => s + c.charCodeAt(0), 0) % MEMBER_COLORS.length];
const stable = (o) => JSON.stringify(o, (k, v) => (v && typeof v === "object" && !Array.isArray(v) ? Object.keys(v).sort().reduce((a, x) => ((a[x] = v[x]), a), {}) : v));
const strip = (o) => { const r = {}; Object.keys(o || {}).forEach((k) => { if (k[0] !== "_" && o[k] !== undefined) r[k] = o[k]; }); return r; };

/* progress numbers for a member doc */
function memberStats(u) {
  const done = new Set(u.done || []); const roles = u.roles || [];
  const ids = Array.from(new Set(roles.flatMap((r) => (CURRICULUM[r] ? CURRICULUM[r].all : []))));
  const prog = ids.length ? ids.filter((i) => done.has(i)).length / ids.length : 0;
  const logs = u.logs || []; const mins = logs.reduce((s, l) => s + (l.mins || 0), 0);
  let streak = 0; for (let d = 0; d < 60; d++) { const day = new Date(); day.setDate(day.getDate() - d); const has = logs.some((l) => new Date(l.at).toDateString() === day.toDateString()); if (has) streak++; else if (d > 0) break; }
  const lastMs = toMs(u.lastActive);
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return logs.filter((l) => new Date(l.at).toDateString() === d.toDateString()).reduce((s, l) => s + (l.mins || 0), 0); });
  return { prog, mins, streak, lastMs, last: u.lastActive ? relTime(lastMs) : "—", week, classes: done.size, activeToday: u.lastActive ? new Date(lastMs).toDateString() === new Date().toDateString() : false };
}

/* default groups (stored with uids; membership by role is automatic) */
const CLOUD_GROUPS = [
  { _id: "all", label: "All team", emoji: "🙌", everyone: true, order: 0 },
  { _id: "singers", label: "Singers", emoji: "🎤", autoRoles: ["singer"], order: 1 },
  { _id: "musicians", label: "Musicians", emoji: "🎸", autoRoles: MUSICIAN_ROLES, order: 2 },
  { _id: "sound", label: "Sound team", emoji: "🎚️", autoRoles: ["sound"], order: 3 },
  { _id: "leaders", label: "Leaders", emoji: "🛡️", leadersOnly: true, autoLeaders: true, order: 4 },
];

/* Runs inside the app: keeps local state and the cloud in sync */
function CloudSync({ uid, onTeam }) {
  const ctx = useApp();
  const { user, done, logs, voice, voiceRange, settings, avatar, games, sessionsDone, leader, groups, setGroups, songs, setSongs, chat, setChat, assignments, setAssignments, feed, setFeed, setLeader } = ctx;
  const me = useRef({}); me.current = { uid, user, leader };
  const people = useRef([]); // all users incl. me: {uid, name, roles, leader}
  const [peopleV, setPeopleV] = useState(0);

  /* ---- my profile → users/{uid} (debounced) ---- */
  useEffect(() => {
    if (!user || !user.roles) return;
    const t = setTimeout(() => {
      CLOUD.set(`users/${uid}`, { name: user.name, email: user.email || "", roles: user.roles, levels: user.levels || {}, voice: voice || null, voiceRange: voiceRange || null, prefs: { notif: !!settings.notif, reminder: settings.reminder || "18:00", days: settings.days || [0, 1, 2, 3, 4, 5, 6], goal: settings.goal || 20 }, avatar: avatar && avatar.length < 300000 ? avatar : null, done: [...done], logs: logs.slice(0, 300), games: games || { best: {} }, sessionsDone: sessionsDone || {}, leader: !!leader, color: colorForUid(uid), lastActive: CLOUD.now() }).catch((e) => console.warn("profile save", e && e.code));
    }, 1500);
    return () => clearTimeout(t);
  }, [uid, user, done, logs, voice, voiceRange, settings.notif, settings.reminder, (settings.days || []).join(","), settings.goal, avatar, games, sessionsDone, leader]);

  /* ---- team members ---- */
  useEffect(() => CLOUD.listen("users", {}, (list) => {
    people.current = list.map((u) => ({ uid: u._id, name: u.name || "Member", roles: u.roles || [], leader: !!u.leader }));
    const others = list.filter((u) => u._id !== uid && u.roles && u.roles.length).map((u) => ({ id: u._id, uid: u._id, name: u.name || "Member", roles: u.roles || [], voice: u.voice || null, voiceRange: u.voiceRange || null, color: u.color || colorForUid(u._id), leader: !!u.leader, avatar: u.avatar || null, games: u.games || { best: {} }, ...memberStats(u) }));
    TEAM.length = 0; others.sort((a, b) => a.name.localeCompare(b.name)).forEach((m) => TEAM.push(m));
    setPeopleV((v) => v + 1); onTeam && onTeam();
  }), [uid]); // eslint-disable-line

  /* ---- groups ---- */
  const gRemote = useRef(null); const gMirror = useRef({});
  const nameOf = (u) => (u === uid ? "@me" : ((people.current.find((p) => p.uid === u) || {}).name || u));
  const uidOf = (n) => (n === "@me" ? uid : ((people.current.find((p) => p.name === n && p.uid !== uid) || {}).uid || n));
  const autoOf = (g) => people.current.filter((p) => (g.autoRoles && p.roles.some((r) => g.autoRoles.includes(r))) || (g.autoLeaders && p.leader) || (p.uid === uid && g.autoLeaders && me.current.leader)).map((p) => p.uid);
  const toLocalGroups = () => (gRemote.current || []).slice().sort((a, b) => (a.order ?? 50) - (b.order ?? 50) || toMs(a.createdAt) - toMs(b.createdAt)).map((g) => {
    const auto = autoOf(g); const ex = g.excluded || [];
    const uids = Array.from(new Set([...(g.members || []), ...auto.filter((u) => !ex.includes(u))]));
    return { id: g._id, label: g.label, emoji: g.emoji || "💬", everyone: !!g.everyone, announce: !!g.announce, leadersOnly: !!g.leadersOnly, members: g.everyone ? [] : uids.map(nameOf) };
  });
  const remoteFromLocal = (lg) => {
    const base = (gRemote.current || []).find((x) => x._id === lg.id) || {};
    const auto = new Set(autoOf(base)); const uids = (lg.members || []).map(uidOf);
    return strip({ ...base, label: lg.label, emoji: lg.emoji, everyone: !!lg.everyone, announce: !!lg.announce, leadersOnly: !!lg.leadersOnly, members: lg.everyone ? [] : uids.filter((u) => !auto.has(u)), excluded: lg.everyone ? [] : [...auto].filter((u) => !uids.includes(u)) });
  };
  useEffect(() => CLOUD.listen("groups", {}, (list) => {
    if (!list.length) { CLOUD_GROUPS.forEach((g) => CLOUD.set(`groups/${g._id}`, { ...strip(g), createdAt: CLOUD.now() }, true).catch(() => { })); return; }
    gRemote.current = list; gMirror.current = {};
    list.forEach((g) => { gMirror.current[g._id] = stable(strip(g)); });
    setGroups(toLocalGroups());
  }), [uid]); // eslint-disable-line
  useEffect(() => { if (gRemote.current) setGroups(toLocalGroups()); }, [peopleV, leader]); // eslint-disable-line
  useEffect(() => {
    if (!gRemote.current || !groups || !me.current.leader) return;
    const ids = new Set(groups.map((g) => g.id));
    groups.forEach((lg, i) => {
      const r = remoteFromLocal(lg); if (r.order == null) r.order = 10 + i;
      if (stable(r) !== gMirror.current[lg.id]) { gMirror.current[lg.id] = stable(r); CLOUD.set(`groups/${lg.id}`, { ...r, ...(!(gRemote.current || []).some((x) => x._id === lg.id) ? { createdAt: CLOUD.now() } : {}) }, false).catch((e) => console.warn("group save", e && e.code)); }
    });
    Object.keys(gMirror.current).forEach((id) => { if (!ids.has(id) && !CLOUD_GROUPS.some((g) => g._id === id)) { delete gMirror.current[id]; CLOUD.del(`groups/${id}`).catch(() => { }); } });
  }, [groups]); // eslint-disable-line

  /* ---- chat messages for the groups I can see ---- */
  const visible = (groups || []).filter((g) => g.everyone || (g.members || []).includes("@me") || leader).filter((g) => !g.leadersOnly || leader).map((g) => g.id);
  const visKey = visible.join(",");
  const cMirror = useRef({}); const cReady = useRef({}); const cText = useRef({}); const cRemote = useRef({});
  useEffect(() => {
    const offs = visible.map((gid) => CLOUD.listen(`groups/${gid}/messages`, { order: ["at", "desc"], limit: 120 }, (list) => {
      const msgs = list.map((m) => ({ id: m._id, uid: m.uid, from: m.from, color: m.color, text: m.text || "", song: m.song || undefined, file: m.file ? { ...m.file, url: m.file.data || null } : undefined, sys: !!m.sys, react: m.react || {}, edited: !!m.edited, me: m.uid === uid, at: toMs(m.at), t: chatTime(toMs(m.at)) })).sort((a, b) => a.at - b.at);
      cMirror.current[gid] = {}; cText.current[gid] = {}; cRemote.current[gid] = new Set(msgs.map((m) => m.id)); msgs.forEach((m) => { cMirror.current[gid][m.id] = stable(m.react); cText.current[gid][m.id] = m.text || ""; });
      cReady.current[gid] = true;
      setChat((c) => ({ ...c, [gid]: msgs }));
    }));
    return () => offs.forEach((f) => f && f());
  }, [visKey, uid]); // eslint-disable-line
  useEffect(() => {
    Object.keys(chat || {}).forEach((gid) => {
      if (!cReady.current[gid]) return; const mir = cMirror.current[gid] || (cMirror.current[gid] = {}); const txm = cText.current[gid] || (cText.current[gid] = {});
      const here = new Set((chat[gid] || []).map((m) => String(m.id))); const rem = cRemote.current[gid] || new Set();
      rem.forEach((id) => { if (!here.has(id)) { rem.delete(id); delete mir[id]; delete txm[id]; CLOUD.del(`groups/${gid}/messages/${id}`).catch((e) => console.warn("del", e && e.code)); } });
      (chat[gid] || []).forEach((m) => {
        const key = String(m.id);
        if (mir[key] === undefined) {
          const docId = key.includes("_") ? key : `${key}_${uid.slice(0, 6)}`; mir[key] = stable(m.react || {}); mir[docId] = mir[key]; txm[key] = txm[docId] = m.text || "";
          CLOUD.set(`groups/${gid}/messages/${docId}`, strip({ uid, from: m.sys ? "" : (me.current.user.name || "Member"), color: colorForUid(uid), text: m.text || "", song: m.song, file: m.file && (m.file.data || !m.file.url) ? { name: m.file.name, size: m.file.size, data: m.file.data || null } : undefined, sys: !!m.sys, react: m.react || {}, at: CLOUD.now() }), false).catch((e) => console.warn("send", e && e.code));
        } else {
          const pid = key.includes("_") ? key : `${key}_${uid.slice(0, 6)}`;
          if (m.edited && txm[key] !== undefined && txm[key] !== (m.text || "")) { txm[key] = m.text || ""; CLOUD.update(`groups/${gid}/messages/${pid}`, { text: m.text || "", edited: true }).catch((e) => console.warn("edit", e && e.code)); }
          if (mir[key] !== stable(m.react || {})) { mir[key] = stable(m.react || {}); CLOUD.update(`groups/${gid}/messages/${key}`, { react: m.react || {} }).catch(() => { }); } }
      });
    });
  }, [chat]); // eslint-disable-line

  /* ---- generic list sync (songs, feed, assignments) ---- */
  useListSync("songs", {}, songs, setSongs, (s) => strip({ ...s, uid: s.uid || uid }), (d) => { const { _id, ...rest } = d; return { ...rest, id: rest.id || _id }; }, () => true, SEED_SONGS);
  useListSync("feed", { order: ["at", "desc"], limit: 30 }, feed, setFeed, (f) => strip({ ...f, at: f.at || Date.now(), uid: f.uid || uid }), (d) => { const { _id, ...rest } = d; return { ...rest, id: rest.id || _id, t: chatTime(toMs(rest.at)) }; }, () => me.current.leader);
  const asgTo = (a) => strip({ ...a, toUid: a.toUid || (a.toMe ? uid : a.to), fromUid: a.fromUid || uid, toMe: undefined });
  const asgFrom = (d) => { const { _id, ...rest } = d; return { ...rest, id: rest.id || _id, to: rest.toUid, toMe: rest.toUid === uid }; };
  useListSync("assignments", leader ? {} : { where: ["toUid", "==", uid] }, assignments, setAssignments, asgTo, asgFrom, () => true, null, leader);

  /* ---- leader flag from leaders/{uid} ---- */
  useEffect(() => { CLOUD.get(`leaders/${uid}`).then((d) => { if (d) setLeader(true); }).catch(() => { }); }, [uid]); // eslint-disable-line
  return null;
}

/* keeps a local list and a Firestore collection equal (after the first snapshot) */
function useListSync(path, opts, list, setList, toRemote, fromRemote, canWrite, seed, dep) {
  const mirror = useRef(null); const remoteIds = useRef(new Set());
  useEffect(() => CLOUD.listen(path, opts, (docs) => {
    if (!docs.length && seed && mirror.current === null) { seed.forEach((s) => CLOUD.set(`${path}/${s.id}`, toRemote(s), false).catch(() => { })); }
    const m = {}; docs.forEach((d) => { m[d._id] = stable(strip(toRemote(fromRemote(d)))); });
    mirror.current = m; remoteIds.current = new Set(docs.map((d) => d._id));
    setList(docs.map(fromRemote));
  }), [path, dep]); // eslint-disable-line
  useEffect(() => {
    if (mirror.current === null || !Array.isArray(list)) return;
    const ids = new Set(list.map((x) => String(x.id)));
    list.forEach((x) => { const id = String(x.id); const r = toRemote(x); const s = stable(r); if (mirror.current[id] !== s && canWrite(x)) { mirror.current[id] = s; CLOUD.set(`${path}/${id}`, r, false).catch((e) => console.warn(path, e && e.code)); } });
    Object.keys(mirror.current).forEach((id) => { if (!ids.has(id) && remoteIds.current.has(id) && canWrite({ id })) { delete mirror.current[id]; CLOUD.del(`${path}/${id}`).catch(() => { }); } });
  }, [list]); // eslint-disable-line
}

/* ---------------- SIGN IN / CREATE ACCOUNT ---------------- */
const AUTH_ERR = {
  "auth/invalid-email": "That email doesn't look right.",
  "auth/missing-password": "Type your password.",
  "auth/weak-password": "Password needs at least 6 characters.",
  "auth/email-already-in-use": "That email already has an account. Tap \"Sign in\".",
  "auth/invalid-credential": "Email or password is wrong.",
  "auth/wrong-password": "Email or password is wrong.",
  "auth/user-not-found": "No account with that email yet. Tap \"Create account\".",
  "auth/too-many-requests": "Too many tries. Wait a minute and try again.",
  "auth/network-request-failed": "No internet connection. Connect and try again.",
  "auth/popup-closed-by-user": "Google sign-in was closed.",
  "auth/popup-blocked": "Your browser blocked the Google window. Try again.",
  "auth/unauthorized-domain": "This web address isn't allowed to sign in yet (Firebase → Authorized domains).",
};
function CloudLogin({ desktop }) {
  const { T, toast } = useApp();
  const [mode, setMode] = useState("up");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const shell = shellVersion() > 0;
  const input = { width: "100%", boxSizing: "border-box", border: `1.5px solid ${T.border}`, background: T.input, color: T.text, borderRadius: 16, padding: "13px 14px", fontFamily: FONT, fontSize: 14, outline: "none" };
  const fail = (e) => { setBusy(false); setErr(AUTH_ERR[e && e.code] || (e && e.message) || "Something went wrong. Try again."); };
  const go = async () => {
    setErr("");
    if (mode === "up" && name.trim().length < 2) return setErr("Type your full name so the team knows who you are.");
    setBusy(true);
    try { if (mode === "up") { window.__bezaPendingName = name.trim(); await CLOUD.signUp(name.trim(), email.trim(), pw); } else await CLOUD.signIn(email.trim(), pw); }
    catch (e) { fail(e); }
  };
  const forgot = async () => { if (!email.trim()) return setErr("Type your email above first, then tap \"Forgot password\"."); try { await CLOUD.reset(email.trim()); toast("Password reset email sent 📩"); setErr(""); } catch (e) { fail(e); } };
  return (
    <div style={{ padding: desktop ? 0 : "18px 22px 30px", minHeight: desktop ? undefined : "100%", display: "flex", flexDirection: "column", maxWidth: desktop ? undefined : 480, margin: desktop ? undefined : "0 auto", boxSizing: "border-box" }}>
      {desktop ? <div style={{ marginBottom: 18 }}><div style={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.5 }}>Welcome 👋</div><div style={{ fontSize: 14.5, color: T.sub, marginTop: 4 }}>Create your account or sign in to continue.</div></div>
        : <div style={{ display: "grid", placeItems: "center", margin: "26px 0 22px" }}><LogoLockup width={270} center /></div>}
      <Card style={{ padding: 18 }}>
        <Seg value={mode} onChange={(m) => { setMode(m); setErr(""); }} options={[{ value: "up", label: "Create account" }, { value: "in", label: "Sign in" }]} />
        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {mode === "up" && <input style={input} placeholder="Full name (e.g. Hanna Tesfaye)" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />}
          <input style={input} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <input style={input} placeholder={mode === "up" ? "Choose a password (6+ characters)" : "Password"} type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} autoComplete={mode === "up" ? "new-password" : "current-password"} />
        </div>
        {err && <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, color: "#FF6B6B" }}>{err}</div>}
        <Btn full style={{ marginTop: 14 }} onClick={go} icon={busy ? null : ChevronRight}>{busy ? "Please wait…" : mode === "in" ? "Sign in" : "Join the team"}</Btn>
        {!shell && <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0", color: T.faint, fontSize: 11, fontWeight: 700 }}><div style={{ flex: 1, height: 1, background: T.border }} />OR<div style={{ flex: 1, height: 1, background: T.border }} /></div>
          <button onClick={async () => { setErr(""); try { await CLOUD.google(); } catch (e) { fail(e); } }} className="bz-press" style={{ width: "100%", padding: "12px 0", borderRadius: 16, border: `1.5px solid ${T.border}`, background: "#fff", color: "#1f1f1f", fontFamily: FONT, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>
            Continue with Google
          </button>
        </>}
        <div style={{ fontSize: 11.5, color: T.sub, textAlign: "center", marginTop: 12 }}>
          {mode === "up" ? "Next: tell us how you serve." : <span onClick={forgot} style={{ textDecoration: "underline", cursor: "pointer" }}>Forgot password?</span>}
        </div>
      </Card>
      <div style={{ textAlign: "center", fontSize: 11, color: T.faint, marginTop: 14 }}>Your account keeps your progress safe on any phone.</div>
    </div>
  );
}
function CloudSplash() {
  return <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "#07090b" }}><img alt="Beza Youth" src="assets/logo-white.png" style={{ width: 170, opacity: 0.9 }} className="bz-pulse" /><HoloStyle /></div>;
}

/* desktop sign-in: split screen (brand story left, form right) */
function AuthDesktop({ children }) {
  const { T } = useApp();
  const feats = [[BookOpen, NEON.classes, "Lessons for every role", "Singers, keys, guitar, bass, drums and sound, plus the Heart of Worship."], [Music, NEON.time, "Songs & chord charts", "Every chart in numbers, any key, every instrument. Ready for Saturday."], [MessageCircle, NEON.good, "Team chat & leaders", "Groups for singers and musicians, assignments and real progress."]];
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(420px, 1fr)" }}>
      <HoloStyle />
      <div style={{ position: "relative", overflow: "hidden", background: "radial-gradient(120% 90% at 20% 10%, #1B2B44 0%, #0A0E14 60%, #07090B 100%)", color: "#F2F8FF", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px" }}>
        <div style={{ position: "absolute", right: -160, top: -120, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,228,255,.18), transparent 65%)" }} />
        <div style={{ position: "absolute", left: -120, bottom: -160, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(181,123,255,.16), transparent 65%)" }} />
        <div style={{ position: "relative" }}><LogoLockup width={300} /></div>
        <div style={{ position: "relative", maxWidth: 560 }}>
          <div style={{ fontSize: 13, letterSpacing: 3, fontWeight: 800, color: "#22E4FF" }}>BEZA YOUTH WORSHIP TEAM</div>
          <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.08, marginTop: 10, letterSpacing: -1 }}>Train together.<br />Serve together.</div>
          <div style={{ display: "grid", gap: 18, marginTop: 34 }}>
            {feats.map(([I, c, t, d]) => (
              <div key={t} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <NeonIcon icon={I} colors={c} size={46} />
                <div><div style={{ fontWeight: 800, fontSize: 16 }}>{t}</div><div style={{ fontSize: 13.5, opacity: 0.7, marginTop: 2, lineHeight: 1.45 }}>{d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", fontSize: 12, opacity: 0.5 }}>Beza International Church · Rehearsals Friday · We serve Saturdays at 3:00 PM</div>
      </div>
      <div className="bz-noscroll" style={{ overflowY: "auto", display: "grid", placeItems: "center", padding: "40px 32px", background: T.bg }}>
        <div style={{ width: "100%", maxWidth: 440 }}>{children}</div>
      </div>
    </div>
  );
}
