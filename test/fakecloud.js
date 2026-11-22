(() => {
  const K = "fakecloud";
  const load = () => { try { return JSON.parse(localStorage.getItem(K)) || { docs: {}, auth: {} }; } catch (e) { return { docs: {}, auth: {} }; } };
  let S = load(); const save = () => localStorage.setItem(K, JSON.stringify(S));
  const subs = []; let authCbs = []; let cur = JSON.parse(sessionStorage.getItem("fakeauth") || "null");
  const fix = (v) => { if (v && v.__ts) return Date.now(); if (Array.isArray(v)) return v.map(fix); if (v && typeof v === "object") { const o = {}; for (const k in v) if (v[k] !== undefined) o[k] = fix(v[k]); return o; } return v; };
  const run = (sub) => { const segs = sub.p.split("/").length; let list = Object.entries(S.docs).filter(([k]) => k.startsWith(sub.p + "/") && k.split("/").length === segs + 1).map(([k, v]) => ({ _id: k.split("/").pop(), ...v }));
    const o = sub.o; if (o.where) list = list.filter((d) => d[o.where[0]] === o.where[2]); if (o.order) list.sort((a, b) => ((a[o.order[0]] > b[o.order[0]]) ? 1 : -1) * (o.order[1] === "desc" ? -1 : 1)); if (o.limit) list = list.slice(0, o.limit);
    sub.cb(JSON.parse(JSON.stringify(list))); };
  const notify = () => subs.forEach((s) => setTimeout(() => run(s), 5));
  window.addEventListener("storage", (e) => { if (e.key === K) { S = load(); notify(); } });
  const write = (p, d) => { S = load(); S.docs[p] = d; save(); notify(); };
  const err = (code) => { const e = new Error(code); e.code = code; return e; };
  window.__fake = { S: () => load(), write, setDoc: (p, d) => write(p, d) };
  window.BEZA_FAKE_CLOUD = {
    on: true,
    bytes: (u8) => { let b = ""; for (let i = 0; i < u8.length; i++) b += String.fromCharCode(u8[i]); return { __b64: btoa(b) }; },
    onAuth: (cb) => { authCbs.push(cb); cur = JSON.parse(sessionStorage.getItem("fakeauth") || "null"); setTimeout(() => cb(cur), 10); return () => { authCbs = authCbs.filter((x) => x !== cb); }; },
    _set: (u) => { cur = u; sessionStorage.setItem("fakeauth", JSON.stringify(u)); authCbs.forEach((cb) => cb(u)); },
    signUp: async function (name, email, pw) { S = load(); if (S.auth[email]) throw err("auth/email-already-in-use"); if ((pw || "").length < 6) throw err("auth/weak-password"); const uid = "u" + Math.random().toString(36).slice(2, 10); S.auth[email] = { uid, pw, name }; save(); this._set({ uid, email, name, photo: null }); return uid; },
    signIn: async function (email, pw) { S = load(); const a = S.auth[email]; if (!a || a.pw !== pw) throw err("auth/invalid-credential"); this._set({ uid: a.uid, email, name: a.name, photo: null }); },
    google: async () => { throw err("auth/popup-blocked"); },
    reset: async () => { },
    signOut: async function () { this._set(null); },
    getAll: async (p) => { S = load(); const n = p.split("/").length; return Object.entries(S.docs).filter(([k]) => k.startsWith(p + "/") && k.split("/").length === n + 1).map(([k, v]) => ({ _id: k.split("/").pop(), ...v })); },
    deleteMe: async function () { S = load(); const email = cur && cur.email; if (email) delete S.auth[email]; save(); },
    providers: () => ["password"],
    changePw: async (o, n) => { S = load(); const a = S.auth[cur.email]; if (!a || a.pw !== o) { const e = new Error("bad"); e.code = "auth/wrong-password"; throw e; } a.pw = n; save(); },
    get: async (p) => { S = load(); return S.docs[p] ? JSON.parse(JSON.stringify(S.docs[p])) : null; },
    set: async (p, d, merge = true) => {
      S = load();
      if (p.startsWith("leaders/")) { const sec = S.docs["secret/leaderCode"]; if (!sec || sec.code !== d.code) throw err("permission-denied"); }
      write(p, merge ? { ...(S.docs[p] || {}), ...fix(d) } : fix(d)); },
    update: async (p, d) => { S = load(); if (!S.docs[p]) throw err("not-found"); write(p, { ...S.docs[p], ...fix(d) }); },
    del: async (p) => { S = load(); delete S.docs[p]; save(); notify(); },
    listen: (p, o, cb) => { const s = { p, o, cb }; subs.push(s); setTimeout(() => run(s), 5); return () => { const i = subs.indexOf(s); if (i >= 0) subs.splice(i, 1); }; },
    now: () => ({ __ts: true }),
  };
})();
