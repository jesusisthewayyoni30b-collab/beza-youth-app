/* ============================ REHEARSAL ROOM: split songs into parts, practise with them, share to the team ============================ */
import { Mp3Encoder } from "@breezystack/lamejs";

const ML_BASE = (() => {
  if (typeof window === "undefined") return "";
  if (window.BEZA_ML_BASE) return window.BEZA_ML_BASE;
  if (/github\.io$/.test(location.hostname)) return location.origin + location.pathname.replace(/[^/]*$/, "") + "ml/";
  return "https://jesusisthewayyoni30b-collab.github.io/beza-youth-app/ml/";
})();
const SEP_SR = 44100, SEP_N = 343980;
const MODEL_FILE = "htdemucs_6s_fp16weights.onnx";
const MODEL_ORDER = ["drums", "bass", "other", "vocals", "guitar", "piano"];
const STEM_INFO = {
  vocals: { label: "Vocals", emoji: "🎤", color: "#FF5E8A" },
  drums: { label: "Drums", emoji: "🥁", color: "#FFB020" },
  bass: { label: "Bass", emoji: "🎸", color: "#3DD6A0" },
  guitar: { label: "Guitar", emoji: "🎸", color: "#5AA9FF" },
  piano: { label: "Keys", emoji: "🎹", color: "#B98CFF" },
  other: { label: "Other", emoji: "✨", color: "#9AA4B2" },
};
const SHOW_ORDER = ["vocals", "drums", "bass", "guitar", "piano", "other"];
const SHARE_KBPS = 96, DL_KBPS = 192, CHUNK = 900 * 1024;
const TEAM_QUOTA_MB = 1024;

const isPC = () => {
  if (typeof window === "undefined") return false;
  if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) return false;
  const ua = navigator.userAgent || "";
  if (/Android|iPhone|iPad|iPod|Mobile|Silk|Kindle/i.test(ua)) return false;
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return false; // iPad pretending to be a Mac
  return true;
};
const tick = () => new Promise((r) => setTimeout(r, 0));
const fmtMB = (b) => (b / 1048576 < 10 ? (b / 1048576).toFixed(1) : Math.round(b / 1048576)) + " MB";
const fmtT = (s) => { s = Math.max(0, s || 0); const m = Math.floor(s / 60); const x = Math.floor(s % 60); return `${m}:${String(x).padStart(2, "0")}`; };
const baseName = (n) => (n || "Song").replace(/\.[a-z0-9]{2,5}$/i, "").trim() || "Song";
const safeFile = (n) => (n || "audio").replace(/[\\/:*?"<>|]+/g, "-").trim();
const normTitle = (t) => (t || "").toLowerCase().replace(/\(.*?\)|\[.*?\]/g, "").replace(/[^a-z0-9ሀ-፿]+/g, " ").trim();

/* ---------- tiny IndexedDB store (audio lives on the device) ---------- */
const IDB = (() => {
  let p;
  const open = () => p || (p = new Promise((res, rej) => {
    const r = indexedDB.open("beza-audio", 1);
    r.onupgradeneeded = () => { const d = r.result; ["stems", "projects", "clips"].forEach((s) => { if (!d.objectStoreNames.contains(s)) d.createObjectStore(s); }); };
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
  const run = async (s, mode, f) => { const d = await open(); return new Promise((res, rej) => { const t = d.transaction(s, mode); const req = f(t.objectStore(s)); t.oncomplete = () => res(req && req.result); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }); };
  return {
    get: (s, k) => run(s, "readonly", (st) => st.get(k)).catch(() => null),
    set: (s, k, v) => run(s, "readwrite", (st) => st.put(v, k)),
    del: (s, k) => run(s, "readwrite", (st) => st.delete(k)).catch(() => { }),
    keys: (s) => run(s, "readonly", (st) => st.getAllKeys()).catch(() => []),
    all: (s) => run(s, "readonly", (st) => st.getAll()).catch(() => []),
  };
})();

async function sha256(buf) { const h = await crypto.subtle.digest("SHA-256", buf); return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 40); }

/* ---------- MP3 ---------- */
const toI16 = (f) => { const o = new Int16Array(f.length); for (let i = 0; i < f.length; i++) { const v = f[i] < -1 ? -1 : f[i] > 1 ? 1 : f[i]; o[i] = v < 0 ? v * 32768 : v * 32767; } return o; };
async function encodeMp3(chs, sr, kbps, onProg) {
  const rate = [32000, 44100, 48000].includes(sr) ? sr : 44100;
  const enc = new Mp3Encoder(2, rate, kbps);
  const L = toI16(chs[0]), R = toI16(chs[1] || chs[0]); const out = []; const B = 1152 * 32;
  for (let i = 0; i < L.length; i += B) {
    const b = enc.encodeBuffer(L.subarray(i, i + B), R.subarray(i, i + B)); if (b.length) out.push(new Uint8Array(b));
    if ((i / B) % 24 === 0) { onProg && onProg(i / L.length); await tick(); }
  }
  const e = enc.flush(); if (e.length) out.push(new Uint8Array(e));
  onProg && onProg(1);
  return new Blob(out, { type: "audio/mpeg" });
}
function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
/* store-only ZIP (no compression — MP3s don't shrink anyway) */
const CRC_T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (u) => { let c = 0xffffffff; for (let i = 0; i < u.length; i++) c = CRC_T[(c ^ u[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
async function makeZip(files /* [{name, blob}] */) {
  const enc = new TextEncoder(); const parts = []; const central = []; let off = 0;
  for (const f of files) {
    const data = new Uint8Array(await f.blob.arrayBuffer()); const nm = enc.encode(f.name); const crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, nm.length, true);
    parts.push(new Uint8Array(h.buffer), nm, data);
    const c = new DataView(new ArrayBuffer(46)); c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, nm.length, true); c.setUint32(42, off, true);
    central.push(new Uint8Array(c.buffer), nm); off += 30 + nm.length + data.length;
  }
  const csize = central.reduce((s, x) => s + x.length, 0);
  const e = new DataView(new ArrayBuffer(22)); e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, csize, true); e.setUint32(16, off, true);
  return new Blob([...parts, ...central, new Uint8Array(e.buffer)], { type: "application/zip" });
}

/* ---------- decode any audio file to stereo Float32 at a given rate ---------- */
async function decodeTo(arrayBuf, sr) {
  const C = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const tmp = new C(2, 1, sr);
  const ab = await new Promise((res, rej) => { const p = tmp.decodeAudioData(arrayBuf.slice(0), res, rej); if (p && p.then) p.then(res, rej); });
  const L = new Float32Array(ab.getChannelData(0)); const R = ab.numberOfChannels > 1 ? new Float32Array(ab.getChannelData(1)) : new Float32Array(L);
  return { L, R, sr: ab.sampleRate, dur: ab.duration };
}

/* ---------- the separation engine (runs in a background worker, fully on this computer) ---------- */
const SEP_WORKER_SRC = `
let sess = null, ep = "wasm", bytes = null;
const mk = async (eps) => self.ort.InferenceSession.create(bytes, { executionProviders: eps, graphOptimizationLevel: "all" });
const run = async (x) => { const t = new self.ort.Tensor("float32", x, [1, 2, ${SEP_N}]); const r = await sess.run({ mix: t }); const out = r.stems || r[Object.keys(r)[0]]; return new Float32Array(out.data); };
self.onmessage = async (e) => {
  const m = e.data;
  try {
    if (m.type === "init") {
      importScripts(m.base + "ort/ort.min.js");
      const ort = self.ort; ort.env.wasm.wasmPaths = m.base + "ort/"; ort.env.wasm.numThreads = 1;
      bytes = new Uint8Array(m.model);
      if (m.gpu) { try { sess = await mk(["webgpu"]); ep = "webgpu"; } catch (err) { sess = null; } }
      if (!sess) { sess = await mk(["wasm"]); ep = "wasm"; }
      postMessage({ type: "ready", ep });
    } else if (m.type === "run") {
      let y; const keep = m.x.slice(0);
      try { y = await run(m.x); } catch (err) { if (ep !== "webgpu") throw err; sess = await mk(["wasm"]); ep = "wasm"; y = await run(keep); }
      if (!y.every || y.length < 10) throw new Error("bad output");
      postMessage({ type: "out", i: m.i, y, ep }, [y.buffer]);
    }
  } catch (err) { postMessage({ type: "err", msg: String((err && err.message) || err) }); }
};`;

async function fetchModel(onProg) {
  const url = ML_BASE + MODEL_FILE;
  let cache = null; try { cache = await caches.open("beza-ml-v1"); const hit = await cache.match(url); if (hit) { onProg(1, true); return await hit.arrayBuffer(); } } catch (e) { cache = null; }
  const r = await fetch(url); if (!r.ok) throw new Error("Couldn't download the splitter (" + r.status + "). Check the internet and try again.");
  const total = +r.headers.get("content-length") || 140e6; const rd = r.body.getReader(); const parts = []; let got = 0;
  for (; ;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; onProg(Math.min(0.99, got / total)); }
  const blob = new Blob(parts); if (cache) { try { await cache.put(url, new Response(blob)); } catch (e) { } }
  onProg(1); return await blob.arrayBuffer();
}

function makeSeparator() {
  let w = null; let pend = null; let ready = null;
  const send = (msg, tr) => new Promise((res, rej) => { pend = { res, rej }; w.postMessage(msg, tr || []); });
  return {
    async init(onModel) {
      if (ready) return ready;
      ready = (async () => {
        const model = await fetchModel(onModel);
        w = new Worker(URL.createObjectURL(new Blob([SEP_WORKER_SRC], { type: "text/javascript" })));
        w.onmessage = (e) => { const p = pend; pend = null; if (!p) return; if (e.data.type === "err") p.rej(new Error(e.data.msg)); else p.res(e.data); };
        w.onerror = (e) => { const p = pend; pend = null; p && p.rej(new Error(e.message || "worker failed")); };
        const r = await send({ type: "init", base: ML_BASE, model, gpu: !!navigator.gpu }, [model]);
        return r.ep;
      })();
      ready.catch(() => { ready = null; });
      return ready;
    },
    run: (x, i) => send({ type: "run", x, i }, [x.buffer]),
    stop() { try { w && w.terminate(); } catch (e) { } w = null; ready = null; if (pend) { pend.rej(new Error("stopped")); pend = null; } },
  };
}

/* overlap-add over 7.8 s windows, exactly like the reference implementation */
async function separateAudio(sep, L, R, onProg, cancelled) {
  const total = L.length; const overlap = Math.floor(SEP_N / 4); const stride = SEP_N - overlap;
  const n = Math.max(1, Math.ceil(total / stride));
  const tr = Math.floor(SEP_N * 0.25); const win = new Float32Array(SEP_N).fill(1);
  for (let i = 0; i < tr; i++) { const v = i / (tr - 1); win[i] = v; win[SEP_N - 1 - i] = v; }
  const out = MODEL_ORDER.map(() => [new Float32Array(total), new Float32Array(total)]); const wsum = new Float32Array(total);
  const t0 = performance.now();
  for (let c = 0; c < n; c++) {
    if (cancelled()) throw new Error("stopped");
    const s = c * stride; const e = Math.min(s + SEP_N, total); const len = e - s;
    const x = new Float32Array(2 * SEP_N); x.set(L.subarray(s, e), 0); x.set(R.subarray(s, e), SEP_N);
    const { y, ep } = await sep.run(x, c); if (ep) sep.ep = ep;
    for (let k = 0; k < MODEL_ORDER.length; k++) for (let ch = 0; ch < 2; ch++) {
      const o = out[k][ch]; const base = (k * 2 + ch) * SEP_N;
      for (let i = 0; i < len; i++) o[s + i] += y[base + i] * win[i];
    }
    for (let i = 0; i < len; i++) wsum[s + i] += win[i];
    const el = (performance.now() - t0) / 1000; onProg((c + 1) / n, ((el / (c + 1)) * (n - c - 1)), sep.ep);
  }
  for (let i = 0; i < total; i++) { const w = wsum[i] > 1e-8 ? 1 / wsum[i] : 0; for (let k = 0; k < out.length; k++) { out[k][0][i] *= w; out[k][1][i] *= w; } }
  const res = {}; MODEL_ORDER.forEach((k, i) => (res[k] = out[i])); return res;
}

/* ---------- time-stretch without changing pitch (WSOLA). Offsets are found on the full mix and applied to every part, so the parts can never drift apart ---------- */
async function stretchAll(chans /* Float32Array[] */, ref /* mono mix */, speed, onProg) {
  if (speed === 1) return chans;
  const N = 2048, Hs = 1024, tol = 512; const Ha = Hs * speed; const len = ref.length;
  const outLen = Math.ceil(len / speed) + N; const outs = chans.map(() => new Float32Array(outLen));
  const win = new Float32Array(N); for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N);
  let prev = 0; const frames = Math.floor((len - N - tol) / Ha);
  for (let k = 0; k < frames; k++) {
    const nominal = Math.round(k * Ha); let p = nominal;
    if (k > 0) {
      const nat = prev + Hs; let best = 0, bc = -Infinity;
      const corr = (d, step) => { const q = nominal + d; if (q < 0 || q + N > len) return -Infinity; let s = 0; for (let i = 0; i < N; i += step) s += ref[q + i] * ref[nat + i]; return s; };
      for (let d = -tol; d <= tol; d += 16) { const c = corr(d, 8); if (c > bc) { bc = c; best = d; } }
      const b0 = best; for (let d = b0 - 15; d <= b0 + 15; d++) { const c = corr(d, 4); if (c > bc) { bc = c; best = d; } }
      p = Math.max(0, Math.min(len - N, nominal + best));
    }
    const o = k * Hs;
    for (let c = 0; c < chans.length; c++) { const src = chans[c], dst = outs[c]; for (let i = 0; i < N; i++) dst[o + i] += src[p + i] * win[i]; }
    prev = p;
    if (k % 400 === 0) { onProg && onProg(k / frames); await tick(); }
  }
  onProg && onProg(1);
  return outs;
}

/* ---------- team library: audio stored in pieces inside the team database (free plan, no Storage needed) ---------- */
const bytesOut = (u8) => (CLOUD.bytes ? CLOUD.bytes(u8) : u8);
const bytesIn = (d) => (d && typeof d.toUint8Array === "function" ? d.toUint8Array() : d && d.__b64 ? Uint8Array.from(atob(d.__b64), (c) => c.charCodeAt(0)) : d instanceof Uint8Array ? d : new Uint8Array(d || []));
async function uploadParts(hash, key, blob, onProg) {
  const u = new Uint8Array(await blob.arrayBuffer()); const n = Math.max(1, Math.ceil(u.length / CHUNK));
  for (let i = 0; i < n; i++) { await CLOUD.set(`stemdata/${hash}__${key}__${i}`, { h: hash, d: bytesOut(u.subarray(i * CHUNK, (i + 1) * CHUNK)) }, false); onProg && onProg((i + 1) / n); }
  return { chunks: n, size: u.length };
}
async function fetchPart(hash, key, chunks) {
  const ck = `${hash}/${key}`; const hit = await IDB.get("stems", ck); if (hit) return hit;
  const parts = []; for (let i = 0; i < chunks; i++) { const d = await CLOUD.get(`stemdata/${hash}__${key}__${i}`); if (!d) throw new Error("This part is missing — ask whoever shared it to share again."); parts.push(bytesIn(d.d)); }
  const blob = new Blob(parts, { type: "audio/mpeg" }); IDB.set("stems", ck, blob).catch(() => { }); return blob;
}
async function deleteFolder(meta) {
  const items = [...(meta.stems || []), ...(meta.extras || []).map((x) => ({ key: "x_" + x.id, chunks: x.chunks }))];
  for (const s of items) for (let i = 0; i < (s.chunks || 0); i++) { try { await CLOUD.del(`stemdata/${meta._id}__${s.key}__${i}`); } catch (e) { } }
  await CLOUD.del(`stems/${meta._id}`);
}
function useStemLibrary() {
  const [list, setList] = useState(null);
  useEffect(() => { if (!CLOUD.on || !CLOUD.listen) { setList([]); return; } return CLOUD.listen("stems", { order: ["at", "desc"] }, setList, () => setList([])); }, []);
  return list;
}
let __ownerCache = null;
function useOwner() {
  const { user } = useApp(); const [o, setO] = useState(__ownerCache === true);
  useEffect(() => { if (!CLOUD.on || !user || !user.uid) return; if (__ownerCache != null) { setO(__ownerCache); return; } CLOUD.get(`owners/${user.uid}`).then((d) => { __ownerCache = !!d; setO(!!d); }).catch(() => { __ownerCache = false; }); }, [user && user.uid]); // eslint-disable-line
  return o;
}

/* ============================ PLAYER (all parts in perfect sync) ============================ */
function useStemEngine(parts /* [{key,label,color,L,R}] */) {
  const ref = useRef(null);
  if (!ref.current) ref.current = { ctx: null, srcs: [], gains: {}, t0: 0, from: 0, cache: {}, speed: 1 };
  const E = ref.current;
  const [playing, setPlaying] = useState(false); const [pos, setPos] = useState(0); const [speed, setSpeedS] = useState(1);
  const [loop, setLoop] = useState(null); const [mix, setMix] = useState({}); const [busy, setBusy] = useState(null);
  const dur = parts.length ? parts[0].L.length / (parts[0].sr || SEP_SR) : 0;
  const sr = parts.length ? parts[0].sr || SEP_SR : SEP_SR;
  const ctx = () => { if (!E.ctx) { const C = window.AudioContext || window.webkitAudioContext; E.ctx = new C({ sampleRate: sr }); } if (E.ctx.state === "suspended") E.ctx.resume(); return E.ctx; };
  const level = (k, m) => { const st = m[k] || {}; const anySolo = parts.some((p) => (m[p.key] || {}).solo); if (st.mute) return 0; if (anySolo && !st.solo) return 0; return st.vol == null ? 1 : st.vol; };
  useEffect(() => { if (!E.ctx) return; parts.forEach((p) => { const g = E.gains[p.key]; if (g) g.gain.setTargetAtTime(level(p.key, mix), E.ctx.currentTime, 0.015); }); }, [mix]); // eslint-disable-line
  const buffersFor = async (sp) => {
    if (E.cache[sp]) return E.cache[sp];
    const c = ctx(); let chans = parts.flatMap((p) => [p.L, p.R]);
    if (sp !== 1) {
      const ref2 = new Float32Array(parts[0].L.length); parts.forEach((p) => { for (let i = 0; i < ref2.length; i++) ref2[i] += (p.L[i] + p.R[i]) * 0.5; });
      setBusy({ label: `Getting ${Math.round(sp * 100)}% speed ready…`, p: 0 });
      chans = await stretchAll(chans, ref2, sp, (q) => setBusy({ label: `Getting ${Math.round(sp * 100)}% speed ready…`, p: q }));
      setBusy(null);
    }
    const bufs = parts.map((p, i) => { const b = c.createBuffer(2, chans[i * 2].length, sr); b.copyToChannel(chans[i * 2], 0); b.copyToChannel(chans[i * 2 + 1], 1); return b; });
    E.cache[sp] = bufs; return bufs;
  };
  const stopSrcs = () => { E.srcs.forEach((s) => { try { s.stop(); } catch (e) { } }); E.srcs = []; };
  const now = () => (E.playing ? E.from + (E.ctx.currentTime - E.t0) * E.speed : E.from);
  const start = async (from, sp = E.speed, lp = loop) => {
    const c = ctx(); const bufs = await buffersFor(sp); stopSrcs();
    if (lp && (from < lp.a || from >= lp.b)) from = lp.a;
    if (from >= dur) from = 0;
    const when = c.currentTime + 0.06;
    parts.forEach((p, i) => {
      let g = E.gains[p.key]; if (!g) { g = c.createGain(); g.connect(c.destination); E.gains[p.key] = g; }
      g.gain.value = level(p.key, mix);
      const s = c.createBufferSource(); s.buffer = bufs[i];
      if (lp) { s.loop = true; s.loopStart = lp.a / sp; s.loopEnd = lp.b / sp; }
      s.connect(g); s.start(when, from / sp); E.srcs.push(s);
      if (i === 0 && !lp) s.onended = () => { if (E.srcs[0] === s) { E.playing = false; setPlaying(false); E.from = 0; setPos(0); } };
    });
    E.t0 = when; E.from = from; E.speed = sp; E.playing = true; E.loop = lp; setPlaying(true);
  };
  const pause = () => { const p = cur(); stopSrcs(); E.playing = false; E.from = p; setPlaying(false); setPos(p); };
  const cur = () => { let p = now(); const lp = E.loop; if (E.playing && lp && p >= lp.b) p = lp.a + ((p - lp.a) % (lp.b - lp.a)); return Math.min(dur, Math.max(0, p)); };
  useEffect(() => { if (!playing) return; let raf; const f = () => { setPos(cur()); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf); }, [playing]); // eslint-disable-line
  useEffect(() => () => { stopSrcs(); try { E.ctx && E.ctx.close(); } catch (e) { } }, []); // eslint-disable-line
  return {
    playing, pos, dur, speed, loop, mix, busy,
    toggle: () => (E.playing ? pause() : start(E.from)),
    seek: (t) => { E.from = Math.max(0, Math.min(dur - 0.05, t)); setPos(E.from); if (E.playing) start(E.from); },
    setSpeed: async (sp) => { const p = cur(); setSpeedS(sp); if (E.playing) await start(p, sp); else { E.speed = sp; await buffersFor(sp); } },
    setLoop: (lp) => { setLoop(lp); E.loop = lp; if (E.playing) start(cur(), E.speed, lp); },
    setMix: (f) => setMix((m) => (typeof f === "function" ? f(m) : f)),
    stop: () => { stopSrcs(); E.playing = false; E.from = 0; setPlaying(false); setPos(0); },
    cur,
  };
}

function Waveform({ parts, pos, dur, loop, onSeek, onLoop, height = 70 }) {
  const { T } = useApp(); const cv = useRef(null); const drag = useRef(null);
  const peaks = useMemo(() => {
    const W = 600; const n = parts.length ? parts[0].L.length : 0; const step = Math.max(1, Math.floor(n / W)); const pk = new Float32Array(W);
    for (let x = 0; x < W; x++) { let m = 0; const s = x * step; for (let i = s; i < s + step && i < n; i += 4) { let v = 0; parts.forEach((p) => { v += p.L[i]; }); v = Math.abs(v); if (v > m) m = v; } pk[x] = m; }
    const srt = Array.from(pk).sort((a, b) => a - b); let mx = srt[Math.floor(srt.length * 0.98)] || 0; if (mx > 0) for (let i = 0; i < W; i++) pk[i] = Math.min(1, pk[i] / mx); if (false) for (let i = 0; i < W; i++) pk[i] /= mx; return pk;
  }, [parts]);
  useEffect(() => {
    const c = cv.current; if (!c) return; const r = c.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1; c.width = r.width * dpr; c.height = height * dpr;
    const g = c.getContext("2d"); g.scale(dpr, dpr); const W = r.width, H = height; g.clearRect(0, 0, W, H);
    if (loop && dur) { g.fillStyle = T.accent + "44"; g.fillRect((loop.a / dur) * W, 0, ((loop.b - loop.a) / dur) * W, H); }
    const px = dur ? (pos / dur) * W : 0;
    for (let x = 0; x < W; x += 2) { const v = peaks[Math.floor((x / W) * peaks.length)] || 0; const h = Math.max(1.5, v * (H - 8)); g.fillStyle = x < px ? T.accent : T.dark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)"; g.fillRect(x, (H - h) / 2, 1.4, h); }
    g.fillStyle = T.text; g.fillRect(px - 1, 0, 2, H);
  }, [peaks, pos, dur, loop, T, height]);
  const tAt = (e) => { const r = cv.current.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * dur; };
  return (
    <canvas ref={cv} style={{ width: "100%", height, display: "block", cursor: "pointer", touchAction: "none", borderRadius: 10 }}
      onPointerDown={(e) => { drag.current = { t: tAt(e), x: e.clientX }; cv.current.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { const d = drag.current; if (d && Math.abs(e.clientX - d.x) > 8) { const t = tAt(e); onLoop && onLoop({ a: Math.min(d.t, t), b: Math.max(d.t, t) }, true); } }}
      onPointerUp={(e) => { const d = drag.current; drag.current = null; if (!d) return; if (Math.abs(e.clientX - d.x) <= 8) onSeek(d.t); else { const t = tAt(e); const lp = { a: Math.min(d.t, t), b: Math.max(d.t, t) }; if (lp.b - lp.a > 0.5) onLoop && onLoop(lp, false); } }} />
  );
}

const SPEEDS = [0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1];
function presetsFor(keys) {
  const has = (k) => keys.includes(k); const list = [{ id: "full", label: "Full band", on: keys }];
  if (has("vocals")) list.push({ id: "novox", label: "No vocals", on: keys.filter((k) => k !== "vocals") }, { id: "vox", label: "Vocals only", on: ["vocals"] });
  if (has("drums")) list.push({ id: "nodr", label: "No drums", on: keys.filter((k) => k !== "drums") });
  if (has("bass")) list.push({ id: "nobass", label: "No bass", on: keys.filter((k) => k !== "bass") });
  if (has("guitar")) list.push({ id: "nogtr", label: "No guitar", on: keys.filter((k) => k !== "guitar") });
  if (has("piano")) list.push({ id: "nokeys", label: "No keys", on: keys.filter((k) => k !== "piano") });
  if (has("drums") && has("bass")) list.push({ id: "rhythm", label: "Bass + drums", on: ["drums", "bass"] });
  return list;
}
const myPartKey = (roles, keys) => { const r = roles || []; const m = r.includes("drums") ? "drums" : r.includes("bass") ? "bass" : r.includes("keys") ? "piano" : (r.includes("acoustic") || r.includes("lead") || r.includes("guitar")) ? "guitar" : r.includes("singer") ? "vocals" : null; return m && keys.includes(m) ? m : null; };

function StemPlayer({ parts, title }) {
  const { T, user } = useApp(); const P = useStemEngine(parts);
  const keys = parts.map((p) => p.key); const presets = presetsFor(keys); const mine = myPartKey(user && user.roles, keys);
  if (mine) presets.splice(1, 0, { id: "me", label: `Band without me (${STEM_INFO[mine].label})`, on: keys.filter((k) => k !== mine) });
  const applyPreset = (pr) => P.setMix(Object.fromEntries(keys.map((k) => [k, { ...(P.mix[k] || {}), mute: !pr.on.includes(k), solo: false }])));
  const st = (k) => P.mix[k] || {};
  useEffect(() => {
    const h = (e) => { if (/INPUT|TEXTAREA/.test((e.target && e.target.tagName) || "")) return; if (e.code === "Space") { e.preventDefault(); P.toggle(); } else if (e.key === "ArrowLeft") P.seek(P.cur() - 5); else if (e.key === "ArrowRight") P.seek(P.cur() + 5); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  });
  return (
    <div>
      <Card style={{ padding: 14 }}>
        {title && <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>{title}</div>}
        <Waveform parts={parts} pos={P.pos} dur={P.dur} loop={P.loop} onSeek={P.seek} onLoop={(lp, live) => { if (!live) P.setLoop(lp); }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: T.sub, marginTop: 4 }}><span>{fmtT(P.pos)}</span><span>{P.loop ? `🔁 ${fmtT(P.loop.a)} – ${fmtT(P.loop.b)}` : "Drag on the wave to loop a part"}</span><span>{fmtT(P.dur)}</span></div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
          <Btn small variant="soft" icon={SkipBack} onClick={() => P.seek(P.loop ? P.loop.a : 0)} />
          <Btn variant="accent" icon={P.playing ? Pause : Play} onClick={P.toggle} style={{ minWidth: 120 }}>{P.playing ? "Pause" : "Play"}</Btn>
          <Btn small variant="soft" onClick={() => P.setLoop(P.loop ? null : { a: P.cur(), b: Math.min(P.dur, P.cur() + 10) })}>{P.loop ? "Clear loop" : "Loop 10 s from here"}</Btn>
        </div>
        {P.loop && <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 8 }}>
          <Btn small variant="ghost" onClick={() => P.setLoop({ a: Math.min(P.cur(), P.loop.b - 0.5), b: P.loop.b })}>Set start here</Btn>
          <Btn small variant="ghost" onClick={() => P.setLoop({ a: P.loop.a, b: Math.max(P.cur(), P.loop.a + 0.5) })}>Set end here</Btn>
        </div>}
        <div style={{ fontSize: 11, fontWeight: 800, color: T.sub, margin: "12px 2px 6px", letterSpacing: 0.5 }}>SPEED (same key, just slower)</div>
        <Scroller>{SPEEDS.map((s) => <Chip key={s} active={P.speed === s} onClick={() => P.setSpeed(s)}>{Math.round(s * 100)}%</Chip>)}</Scroller>
        {P.busy && <div style={{ marginTop: 8 }}><div style={{ fontSize: 12, color: T.sub }}>{P.busy.label}</div><PBar p={P.busy.p} /></div>}
      </Card>
      <div style={{ fontSize: 11, fontWeight: 800, color: T.sub, margin: "14px 2px 6px", letterSpacing: 0.5 }}>QUICK MIXES</div>
      <Scroller>{presets.map((pr) => <Chip key={pr.id} onClick={() => applyPreset(pr)}>{pr.label}</Chip>)}</Scroller>
      <Card pad={8} style={{ marginTop: 10 }}>
        {parts.map((p, i) => {
          const s = st(p.key); const anySolo = keys.some((k) => st(k).solo); const live = !s.mute && (!anySolo || s.solo);
          return (
            <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 6px", borderTop: i ? `1px solid ${T.border}` : "none", opacity: live ? 1 : 0.5 }}>
              <div style={{ width: 8, height: 30, borderRadius: 4, background: p.color }} />
              <div style={{ width: 92, fontWeight: 700, fontSize: 13.5 }}>{p.emoji} {p.label}</div>
              <input aria-label={p.label + " volume"} type="range" min={0} max={1.5} step={0.01} value={s.vol == null ? 1 : s.vol} onChange={(e) => P.setMix((m) => ({ ...m, [p.key]: { ...(m[p.key] || {}), vol: +e.target.value } }))} style={{ flex: 1, minWidth: 60, accentColor: p.color }} />
              <button onClick={() => P.setMix((m) => ({ ...m, [p.key]: { ...(m[p.key] || {}), mute: !s.mute } }))} style={msBtn(T, s.mute, "#FF5E5E")}>M</button>
              <button onClick={() => P.setMix((m) => ({ ...m, [p.key]: { ...(m[p.key] || {}), solo: !s.solo } }))} style={msBtn(T, s.solo, "#FFC531")}>S</button>
            </div>
          );
        })}
      </Card>
      <div style={{ fontSize: 11, color: T.sub, marginTop: 6, textAlign: "center" }}>M = mute · S = solo (only hear that part){isPC() ? " · Space = play/pause · ← → = 5 s" : ""}</div>
    </div>
  );
}
const msBtn = (T, on, c) => ({ width: 34, height: 30, borderRadius: 8, border: `1.5px solid ${on ? c : T.border}`, background: on ? c : "transparent", color: on ? "#111" : T.text, fontWeight: 900, fontFamily: FONT, cursor: "pointer" });
function PBar({ p, color }) { const { T } = useApp(); return <div style={{ height: 8, borderRadius: 6, background: T.dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)", overflow: "hidden", marginTop: 4 }}><div style={{ width: `${Math.round((p || 0) * 100)}%`, height: "100%", background: color || T.accent, transition: "width .2s" }} /></div>; }

/* ============================ SONGS TAB FOLDERS ============================ */
function FolderTile({ emoji, title, sub, color, onClick, count }) {
  const { T } = useApp();
  return (
    <div onClick={onClick} className="bz-press" style={{ flex: 1, minWidth: 0, cursor: "pointer", position: "relative", background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 22, padding: "18px 16px 16px", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 16, width: 64, height: 7, borderRadius: "0 0 8px 8px", background: color }} />
      <div style={{ fontSize: 34, lineHeight: 1 }}>{emoji}</div>
      <div style={{ fontFamily: headFont(T), fontWeight: 900, fontSize: 19, marginTop: 10, lineHeight: 1.1 }}>{title}</div>
      <div style={{ fontSize: 12, color: T.sub, marginTop: 4, lineHeight: 1.35 }}>{sub}</div>
      {count != null && <div style={{ position: "absolute", top: 14, right: 14, background: color, color: "#111", fontWeight: 900, fontSize: 12, borderRadius: 999, padding: "3px 9px" }}>{count}</div>}
    </div>
  );
}

function StageScreen() {
  const { T, songs, push } = useApp();
  const set = songs.filter((s) => s.setlist);
  return (
    <div>
      <TopBar title="The Stage" sub="This Saturday's set" right={<Btn small icon={Plus} onClick={() => push({ screen: "songedit" })}>New</Btn>} />
      {set.map((s) => <SongRow key={s.id} s={s} />)}
      {!set.length && <Card tone="soft" style={{ fontSize: 13, lineHeight: 1.5 }}>No songs on this Saturday's set yet. Open a song → <b>Edit</b> → turn on <b>On this Saturday's set</b>.</Card>}
      {set.length > 0 && <Btn full variant="accent" icon={Zap} style={{ marginTop: 6 }} onClick={() => push({ screen: "live", id: set[0].id })}>Start Live mode with {set[0].title}</Btn>}
    </div>
  );
}
function SongRow({ s }) {
  const { T, push } = useApp();
  return (
    <Card onClick={() => push({ screen: "song", id: s.id })} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: T.accent, color: T.accentText, display: "grid", placeItems: "center", flexShrink: 0 }}><div style={{ textAlign: "center", lineHeight: 1 }}><div style={{ fontSize: 9, fontWeight: 800, opacity: 0.8 }}>KEY</div><div style={{ fontWeight: 900, fontSize: 20 }}>{keyLabel(s.key)}</div></div></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 15.5, lineHeight: 1.2 }}>{s.title}</div>
        <div style={{ fontSize: 12, color: T.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.bpm} bpm · {s.meter} · {firstLineNums(s) || "no chords yet"}</div>
      </div>
      <ChevronRight size={18} color={T.sub} />
    </Card>
  );
}

/* ============================ REHEARSAL ROOM ============================ */
function RehearsalRoom() {
  const { T, push } = useApp(); const lib = useStemLibrary(); const [q, setQ] = useState(""); const pc = isPC();
  const list = (lib || []).filter((m) => !q || (m.title + " " + (m.file || "")).toLowerCase().includes(q.toLowerCase()));
  const fileIn = useRef(null);
  return (
    <div>
      <TopBar title="Rehearsal Room" sub="Songs split into parts — practise with them" />
      <div style={{ display: "grid", gridTemplateColumns: pc ? "1fr 1fr" : "1fr", gap: 10, marginBottom: 12 }}>
        {pc && <Card tone="hero" onClick={() => push({ screen: "splitter" })} style={{ padding: 16 }}><div style={{ fontSize: 28 }}>✂️</div><div style={{ fontWeight: 900, fontSize: 17, marginTop: 6 }}>Split a song</div><div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 4, lineHeight: 1.45 }}>Drop in an MP3 → get vocals, drums, bass, guitar, keys as separate tracks. Runs on this computer.</div></Card>}
        <Card tone={pc ? "card" : "hero"} onClick={() => push({ screen: "studio" })} style={{ padding: 16 }}><div style={{ fontSize: 28 }}>🎛️</div><div style={{ fontWeight: 900, fontSize: 17, marginTop: 6 }}>Studio</div><div style={{ fontSize: 12.5, opacity: 0.9, marginTop: 4, lineHeight: 1.45 }}>Record layers on top of each other — harmonies, ideas, parts. Metronome, effects, export MP3.</div></Card>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "10px 12px", marginBottom: 6 }}><Search size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search shared songs…" style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", color: T.text, fontFamily: FONT, fontSize: 14 }} /></div>
      <SectionTitle>Shared with the team</SectionTitle>
      {lib == null && <Card tone="soft" style={{ fontSize: 13 }}>Loading…</Card>}
      {list.map((m) => (
        <Card key={m._id} onClick={() => push({ screen: "stemfolder", id: m._id })} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: T.soft, display: "grid", placeItems: "center", fontSize: 26, flexShrink: 0 }}>📁</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.25, overflowWrap: "anywhere" }}>{m.title}</div>
            <div style={{ fontSize: 12, color: T.sub }}>{(m.stems || []).length} parts{(m.extras || []).length ? ` · ${(m.extras || []).length} studio mix${(m.extras || []).length > 1 ? "es" : ""}` : ""} · by {m.byName || "someone"} · {relTime(toMs(m.at))}</div>
            <div style={{ display: "flex", gap: 4, marginTop: 5 }}>{(m.stems || []).map((s) => <span key={s.key} title={(STEM_INFO[s.key] || {}).label} style={{ width: 18, height: 6, borderRadius: 3, background: (STEM_INFO[s.key] || {}).color || "#888" }} />)}</div>
          </div>
          <ChevronRight size={18} color={T.sub} />
        </Card>
      ))}
      {lib && !list.length && <Card tone="soft" style={{ fontSize: 13, lineHeight: 1.5 }}>{q ? "No shared song matches that." : pc ? "Nothing shared yet — tap Split a song, then Share to the team." : "Nothing shared yet. Someone on a computer can split a song and share it here."}</Card>}
      <SectionTitle>Your own files</SectionTitle>
      <Card style={{ fontSize: 13, lineHeight: 1.5 }}>
        Got the MP3 parts from the group chat? Open them here to loop, slow down and mute parts. They stay on this device.
        <div style={{ marginTop: 10 }}><Btn small variant="soft" icon={Upload} onClick={() => fileIn.current && fileIn.current.click()}>Open MP3 parts</Btn></div>
        <input ref={fileIn} type="file" accept="audio/*" multiple style={{ display: "none" }} onChange={(e) => { const fs = [...(e.target.files || [])]; e.target.value = ""; if (fs.length) push({ screen: "localstems", files: fs }); }} />
      </Card>
      {!pc && <div style={{ fontSize: 11.5, color: T.sub, textAlign: "center", marginTop: 12 }}>✂️ Splitting songs is done on a computer (open beza-youth.web.app on a laptop).</div>}
    </div>
  );
}

const guessKeyFromName = (n) => { const s = n.toLowerCase(); for (const k of SHOW_ORDER) { if (s.includes(STEM_INFO[k].label.toLowerCase()) || s.includes(k)) return k; } if (/vox|voice|sing/.test(s)) return "vocals"; if (/kit|perc/.test(s)) return "drums"; if (/key|synth|organ/.test(s)) return "piano"; return null; };
function LocalStemsScreen({ files }) {
  const { T } = useApp(); const [parts, setParts] = useState(null); const [err, setErr] = useState("");
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const out = []; let sr = null;
        for (const f of files || []) { const d = await decodeTo(await f.arrayBuffer(), sr || 44100); sr = d.sr; const k = guessKeyFromName(f.name); const used = out.some((o) => o.key === k); const key = k && !used ? k : "f" + out.length; const inf = STEM_INFO[key] || { label: baseName(f.name).slice(-24), emoji: "🎵", color: MEMBER_COLORS[out.length % MEMBER_COLORS.length] }; out.push({ key, ...inf, label: k && !used ? inf.label : baseName(f.name).slice(-24), L: d.L, R: d.R, sr }); }
        const n = Math.max(...out.map((o) => o.L.length)); out.forEach((o) => { if (o.L.length < n) { const L = new Float32Array(n); L.set(o.L); const R = new Float32Array(n); R.set(o.R); o.L = L; o.R = R; } });
        if (!off) setParts(out);
      } catch (e) { if (!off) setErr("Couldn't open one of those files. Use MP3, WAV or M4A."); }
    })();
    return () => { off = true; };
  }, [files]);
  return (
    <div>
      <TopBar title="Your files" sub={`${(files || []).length} file${(files || []).length === 1 ? "" : "s"} · only on this device`} />
      {err && <Card tone="soft">{err}</Card>}
      {!parts && !err && <Card tone="soft">Opening…</Card>}
      {parts && <StemPlayer parts={parts} />}
    </div>
  );
}

/* ---------- the splitter (computer only) ---------- */
function SplitterScreen() {
  const { T, user, push, toast } = useApp();
  const [file, setFile] = useState(null); const [info, setInfo] = useState(null); const [mode, setMode] = useState(6);
  const [phase, setPhase] = useState("pick"); const [prog, setProg] = useState({}); const [err, setErr] = useState("");
  const [result, setResult] = useState(null); const [dup, setDup] = useState(null); const [sameName, setSameName] = useState(null);
  const [share, setShare] = useState(null); const [dl, setDl] = useState(null);
  const sepRef = useRef(null); const cancel = useRef(false); const inp = useRef(null); const lib = useStemLibrary();
  useEffect(() => () => { cancel.current = true; sepRef.current && sepRef.current.stop(); }, []);
  if (!isPC()) return <div><TopBar title="Split a song" /><Card tone="soft" style={{ lineHeight: 1.55 }}>✂️ Splitting needs a computer — phones run out of memory. Open <b>beza-youth.web.app</b> on a laptop or desktop and come back to Songs → Rehearsal Room.</Card></div>;
  const pick = async (f) => {
    if (!f) return; setErr(""); setResult(null); setShare(null); setDup(null); setSameName(null); setFile(f); setPhase("reading");
    try {
      const buf = await f.arrayBuffer(); const hash = await sha256(buf); const dec = await decodeTo(buf, SEP_SR);
      setInfo({ hash, dec, name: baseName(f.name), full: f.name, size: f.size });
      setPhase("ready");
      if (CLOUD.on) { const ex = await CLOUD.get(`stems/${hash}`).catch(() => null); if (ex) setDup({ ...ex, _id: hash }); }
    } catch (e) { setErr("Couldn't read that file. Use an MP3, WAV, M4A or FLAC."); setPhase("pick"); }
  };
  useEffect(() => { if (!info || !lib) return; const t = normTitle(info.name); const m = lib.find((x) => x._id !== info.hash && normTitle(x.title) === t); setSameName(m || null); }, [info, lib]);
  const run = async () => {
    cancel.current = false; setErr(""); setPhase("model"); setProg({ model: 0 });
    try {
      if (!sepRef.current) sepRef.current = makeSeparator();
      const ep = await sepRef.current.init((p, cached) => setProg({ model: p, cached }));
      setPhase("split"); setProg({ p: 0, ep });
      const raw = await separateAudio(sepRef.current, info.dec.L, info.dec.R, (p, left, ep2) => setProg({ p, left, ep: ep2 || ep }), () => cancel.current);
      let stems = raw;
      if (mode === 4) { const o = raw.other; for (const k of ["guitar", "piano"]) for (let c = 0; c < 2; c++) { const s = raw[k][c]; for (let i = 0; i < s.length; i++) o[c][i] += s[i]; } stems = { vocals: raw.vocals, drums: raw.drums, bass: raw.bass, other: o }; }
      const parts = SHOW_ORDER.filter((k) => stems[k]).map((k) => ({ key: k, ...STEM_INFO[k], label: mode === 4 && k === "other" ? "Instruments" : STEM_INFO[k].label, L: stems[k][0], R: stems[k][1], sr: SEP_SR }));
      setResult(parts); setPhase("done"); try { new Notification && document.hidden && new Notification("Song split ✓", { body: info.full }); } catch (e) { }
    } catch (e) { if (String(e.message) !== "stopped") { setErr(/memory|allocation|RangeError/i.test(e.message) ? "This computer ran out of memory. Close other tabs and try again, or try a shorter song." : e.message || "Something went wrong."); setPhase("ready"); } }
  };
  const fileName = (p) => safeFile(`${info.name} – ${p.label}.mp3`);
  const mixParts = (on) => { const n = result[0].L.length; const L = new Float32Array(n), R = new Float32Array(n); result.filter((p) => on.includes(p.key)).forEach((p) => { for (let i = 0; i < n; i++) { L[i] += p.L[i]; R[i] += p.R[i]; } }); return [L, R]; };
  const dlOne = async (p) => { setDl({ name: p.label, p: 0 }); const b = await encodeMp3([p.L, p.R], SEP_SR, DL_KBPS, (q) => setDl({ name: p.label, p: q })); downloadBlob(b, fileName(p)); setDl(null); };
  const dlMix = async (pr) => { setDl({ name: pr.label, p: 0 }); const b = await encodeMp3(mixParts(pr.on), SEP_SR, DL_KBPS, (q) => setDl({ name: pr.label, p: q })); downloadBlob(b, safeFile(`${info.name} – ${pr.label}.mp3`)); setDl(null); };
  const dlAll = async () => { const files = []; for (let i = 0; i < result.length; i++) { const p = result[i]; setDl({ name: `${p.label} (${i + 1}/${result.length})`, p: 0 }); files.push({ name: fileName(p), blob: await encodeMp3([p.L, p.R], SEP_SR, DL_KBPS, (q) => setDl({ name: `${p.label} (${i + 1}/${result.length})`, p: q })) }); } setDl({ name: "Packing ZIP", p: 1 }); downloadBlob(await makeZip(files), safeFile(`${info.name} – parts.zip`)); setDl(null); };
  const doShare = async () => {
    if (!CLOUD.on) { toast("Sign in to share with the team"); return; }
    setShare({ step: "Checking…", p: 0 });
    try {
      const ex = await CLOUD.get(`stems/${info.hash}`); if (ex) { setDup({ ...ex, _id: info.hash }); setShare(null); return; }
      const metaStems = []; const n = result.length;
      for (let i = 0; i < n; i++) {
        const p = result[i]; setShare({ step: `Preparing ${p.label}`, p: i / n });
        const b = await encodeMp3([p.L, p.R], SEP_SR, SHARE_KBPS, (q) => setShare({ step: `Preparing ${p.label}`, p: (i + q * 0.5) / n }));
        const r = await uploadParts(info.hash, p.key, b, (q) => setShare({ step: `Sending ${p.label}`, p: (i + 0.5 + q * 0.5) / n }));
        metaStems.push({ key: p.key, label: p.label, ...r });
      }
      const again = await CLOUD.get(`stems/${info.hash}`); if (again) { setDup({ ...again, _id: info.hash }); setShare(null); return; }
      await CLOUD.set(`stems/${info.hash}`, { title: info.name, file: info.full, hash: info.hash, by: user.uid, byName: user.name, at: Date.now(), mode, dur: info.dec.dur, kbps: SHARE_KBPS, stems: metaStems, extras: [], size: metaStems.reduce((s, x) => s + x.size, 0) }, false);
      setShare({ done: true }); toast("Shared with the team ✓");
    } catch (e) { setShare({ err: /permission/i.test(e.message || "") ? "The team database refused it — a leader needs to update the database rules (see the setup note)." : "Couldn't share: " + (e.message || "network error") }); }
  };
  const dupLine = dup && <>Already shared by <b>{dup.byName || "someone"}</b> {dup.at ? `on ${new Date(toMs(dup.at)).toLocaleDateString(undefined, { day: "numeric", month: "short" })}` : ""}</>;
  return (
    <div>
      <TopBar title="Split a song" sub="Runs on this computer — the song never leaves it until you share" />
      {(phase === "pick" || phase === "reading") && (
        <Card style={{ textAlign: "center", padding: 28, border: `2px dashed ${T.border}` }}
          onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files[0]); }}>
          <div style={{ fontSize: 40 }}>🎵</div>
          <div style={{ fontWeight: 800, fontSize: 16, margin: "8px 0 4px" }}>{phase === "reading" ? "Reading the song…" : "Drop a song here"}</div>
          <div style={{ fontSize: 12.5, color: T.sub, marginBottom: 12 }}>MP3, WAV, M4A or FLAC</div>
          <Btn icon={Upload} onClick={() => inp.current.click()}>Choose a file</Btn>
          <input ref={inp} type="file" accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; e.target.value = ""; pick(f); }} />
        </Card>
      )}
      {err && <Card tone="soft" style={{ marginTop: 10, border: `1.5px solid ${T.bad}`, fontSize: 13 }}>{err}</Card>}
      {info && phase !== "pick" && phase !== "reading" && (
        <Card style={{ marginTop: 10 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 30 }}>🎵</div>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 800, overflowWrap: "anywhere" }}>{info.full}</div><div style={{ fontSize: 12, color: T.sub }}>{fmtT(info.dec.dur)} · {fmtMB(info.size)}</div></div>
            {(phase === "ready" || phase === "done") && <Btn small variant="ghost" onClick={() => { setInfo(null); setResult(null); setPhase("pick"); setDup(null); setShare(null); }}>Change</Btn>}
          </div>
          {dup && <div style={{ marginTop: 10, fontSize: 13, background: T.soft, color: T.softText, borderRadius: 12, padding: "10px 12px", lineHeight: 1.5 }}>📁 {dupLine}. <span onClick={() => push({ screen: "stemfolder", id: dup._id })} style={{ fontWeight: 800, textDecoration: "underline", cursor: "pointer" }}>Open it</span> — no need to split again.</div>}
          {!dup && sameName && <div style={{ marginTop: 10, fontSize: 13, background: T.soft, color: T.softText, borderRadius: 12, padding: "10px 12px", lineHeight: 1.5 }}>Heads up: <b>{sameName.title}</b> is already in the Rehearsal Room (shared by {sameName.byName}). If it's the same song, <span onClick={() => push({ screen: "stemfolder", id: sameName._id })} style={{ fontWeight: 800, textDecoration: "underline", cursor: "pointer" }}>open that one</span>.</div>}
          {phase === "ready" && (
            <>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.sub, margin: "14px 2px 6px" }}>HOW MANY PARTS?</div>
              <Seg value={mode} onChange={setMode} options={[{ value: 4, label: "4 · vocals, drums, bass, instruments" }, { value: 6, label: "6 · + guitar & keys separate" }]} />
              <div style={{ fontSize: 11.5, color: T.sub, marginTop: 6, lineHeight: 1.45 }}>Vocals, drums and bass come out clean. Guitar and keys are good for learning parts, but can bleed into each other a little.</div>
              <Btn full icon={Layers} style={{ marginTop: 12 }} onClick={run}>Split it</Btn>
            </>
          )}
          {phase === "model" && <div style={{ marginTop: 12 }}><div style={{ fontSize: 13, fontWeight: 700 }}>{prog.model >= 1 ? "Starting the splitter…" : "First time on this computer: downloading the splitter (~140 MB, only once)…"}</div><PBar p={prog.model} /></div>}
          {phase === "split" && <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Splitting… {Math.round((prog.p || 0) * 100)}%{prog.left != null && prog.p > 0.02 ? ` · about ${Math.max(1, Math.round(prog.left / 60))} min left` : ""}</div><PBar p={prog.p} />
            <div style={{ fontSize: 11.5, color: T.sub, marginTop: 6 }}>{prog.ep === "webgpu" ? "Using this computer's graphics chip ⚡" : "Using this computer's processor — older laptops take longer."} Keep this tab open.</div>
            <Btn small variant="ghost" style={{ marginTop: 8 }} onClick={() => { cancel.current = true; sepRef.current && sepRef.current.stop(); sepRef.current = null; setPhase("ready"); }}>Cancel</Btn>
          </div>}
        </Card>
      )}
      {phase === "done" && result && (
        <>
          <SectionTitle>1 · Preview</SectionTitle>
          <StemPlayer parts={result} />
          <SectionTitle>2 · Download</SectionTitle>
          <Card pad={10}>
            {result.map((p, i) => (
              <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", borderTop: i ? `1px solid ${T.border}` : "none" }}>
                <div style={{ width: 8, height: 26, borderRadius: 4, background: p.color }} />
                <div style={{ flex: 1, minWidth: 0, fontSize: 13 }}><b>{p.emoji} {p.label}</b><div style={{ fontSize: 11.5, color: T.sub, overflowWrap: "anywhere" }}>{fileName(p)}</div></div>
                <Btn small variant="soft" icon={Download} disabled={!!dl} onClick={() => dlOne(p)}>MP3</Btn>
              </div>
            ))}
            <div style={{ fontSize: 11, fontWeight: 800, color: T.sub, margin: "12px 4px 6px" }}>PRACTICE MIXES (ready to play along with)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "0 4px" }}>{presetsFor(result.map((p) => p.key)).filter((x) => x.id !== "full").map((pr) => <Btn key={pr.id} small variant="ghost" icon={Download} disabled={!!dl} onClick={() => dlMix(pr)}>{pr.label}</Btn>)}</div>
            <Btn full variant="accent" icon={Download} disabled={!!dl} style={{ marginTop: 12 }} onClick={dlAll}>Download all parts (.zip)</Btn>
            {dl && <div style={{ marginTop: 8 }}><div style={{ fontSize: 12, color: T.sub }}>Making {dl.name}…</div><PBar p={dl.p} /></div>}
          </Card>
          <SectionTitle>3 · Share to the team</SectionTitle>
          <Card>
            {dup ? <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>✅ {dupLine}. <span onClick={() => push({ screen: "stemfolder", id: dup._id })} style={{ fontWeight: 800, textDecoration: "underline", cursor: "pointer" }}>Open the folder</span></div>
              : share && share.done ? <div style={{ fontSize: 13.5 }}>✅ Shared! Everyone now sees <b>📁 {info.name}</b> in the Rehearsal Room. <span onClick={() => push({ screen: "stemfolder", id: info.hash })} style={{ fontWeight: 800, textDecoration: "underline", cursor: "pointer" }}>Open it</span></div>
                : share && !share.err ? <div><div style={{ fontSize: 13, fontWeight: 700 }}>{share.step} {Math.round((share.p || 0) * 100)}%</div><PBar p={share.p} /></div>
                  : <>
                    <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>Creates a folder called <b>📁 {info.name}</b> that everyone on the team can open, play along with, and download. Only team members can see it.</div>
                    {share && share.err && <div style={{ fontSize: 12.5, color: T.bad, marginBottom: 8 }}>{share.err}</div>}
                    <Btn full icon={Send} onClick={doShare}>Share to the team</Btn>
                  </>}
          </Card>
        </>
      )}
    </div>
  );
}

/* ---------- a shared song folder ---------- */
function StemFolderScreen({ id }) {
  const { T, push, pop, leader, toast } = useApp(); const owner = useOwner(); const lib = useStemLibrary();
  const meta = (lib || []).find((m) => m._id === id);
  const [parts, setParts] = useState(null); const [prog, setProg] = useState(0); const [err, setErr] = useState("");
  const [extraPlay, setExtraPlay] = useState(null);
  useEffect(() => {
    if (!meta || parts) return; let off = false;
    (async () => {
      try {
        const out = []; const n = meta.stems.length;
        for (let i = 0; i < n; i++) { const s = meta.stems[i]; const blob = await fetchPart(id, s.key, s.chunks); const d = await decodeTo(await blob.arrayBuffer(), SEP_SR); out.push({ key: s.key, ...(STEM_INFO[s.key] || {}), label: s.label || (STEM_INFO[s.key] || {}).label, L: d.L, R: d.R, sr: SEP_SR, blob }); if (!off) setProg((i + 1) / n); }
        const len = Math.max(...out.map((o) => o.L.length)); out.forEach((o) => { if (o.L.length < len) { const L = new Float32Array(len); L.set(o.L); const R = new Float32Array(len); R.set(o.R); o.L = L; o.R = R; } });
        if (!off) setParts(out);
      } catch (e) { if (!off) setErr(e.message || "Couldn't load the parts."); }
    })();
    return () => { off = true; };
  }, [meta && meta._id]); // eslint-disable-line
  if (!lib) return <div><TopBar title="Loading…" /></div>;
  if (!meta) return <div><TopBar title="Folder not found" /><Card tone="soft">This folder was removed.</Card></div>;
  const fname = (lab) => safeFile(`${meta.title} – ${lab}.mp3`);
  const canDel = leader || owner;
  const dlPart = async (p) => { downloadBlob(p.blob, fname(p.label)); };
  const dlAll = async () => { downloadBlob(await makeZip(parts.map((p) => ({ name: fname(p.label), blob: p.blob }))), safeFile(`${meta.title} – parts.zip`)); };
  const native = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
  return (
    <div>
      <TopBar title={`📁 ${meta.title}`} sub={`${meta.stems.length} parts · shared by ${meta.byName || "someone"} · ${relTime(toMs(meta.at))}`} />
      {err && <Card tone="soft" style={{ border: `1.5px solid ${T.bad}` }}>{err}</Card>}
      {!parts && !err && <Card><div style={{ fontSize: 13, fontWeight: 700 }}>Loading the parts… {Math.round(prog * 100)}%</div><PBar p={prog} /><div style={{ fontSize: 11.5, color: T.sub, marginTop: 6 }}>First time only — after this it opens instantly, even offline.</div></Card>}
      {parts && <StemPlayer parts={parts} />}
      {parts && <>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn full variant="soft" icon={Sliders} onClick={() => push({ screen: "studio", fromFolder: id })}>Open in Studio</Btn>
        </div>
        <SectionTitle>Download</SectionTitle>
        {native ? <Card tone="soft" style={{ fontSize: 12.5, lineHeight: 1.5 }}>To save the MP3 files, open <b>beza-youth.web.app</b> in Chrome. You can play and practise with every part right here.</Card> : (
          <Card pad={10}>
            {parts.map((p, i) => <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 4px", borderTop: i ? `1px solid ${T.border}` : "none" }}><div style={{ width: 8, height: 24, borderRadius: 4, background: p.color }} /><div style={{ flex: 1, minWidth: 0, fontSize: 12.5, overflowWrap: "anywhere" }}>{fname(p.label)}</div><Btn small variant="soft" icon={Download} onClick={() => dlPart(p)}>MP3</Btn></div>)}
            {isPC() && <Btn full icon={Download} style={{ marginTop: 10 }} onClick={dlAll}>Download all (.zip)</Btn>}
          </Card>
        )}
      </>}
      {(meta.extras || []).length > 0 && <>
        <SectionTitle>Studio mixes</SectionTitle>
        <Card pad={10}>{meta.extras.map((x, i) => (
          <div key={x.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 4px", borderTop: i ? `1px solid ${T.border}` : "none" }}>
            <div style={{ fontSize: 20 }}>🎛️</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13, overflowWrap: "anywhere" }}>{x.name}</div><div style={{ fontSize: 11.5, color: T.sub }}>by {x.byName} · {relTime(x.at)}</div></div>
            <Btn small variant="soft" icon={extraPlay && extraPlay.id === x.id ? Square : Play} onClick={async () => { if (extraPlay && extraPlay.id === x.id) { extraPlay.a.pause(); setExtraPlay(null); return; } extraPlay && extraPlay.a.pause(); const b = await fetchPart(id, "x_" + x.id, x.chunks); const a = new Audio(URL.createObjectURL(b)); a.play(); a.onended = () => setExtraPlay(null); setExtraPlay({ id: x.id, a, b }); }} />
            {!native && <Btn small variant="ghost" icon={Download} onClick={async () => downloadBlob(await fetchPart(id, "x_" + x.id, x.chunks), safeFile(x.name + ".mp3"))} />}
          </div>
        ))}</Card>
      </>}
      {canDel && <div style={{ marginTop: 18, textAlign: "center" }}><Btn small variant="danger" icon={Trash} onClick={async () => { if (!confirm(`Delete "${meta.title}" for the whole team?`)) return; try { await deleteFolder(meta); toast("Folder deleted"); pop(); } catch (e) { toast("Couldn't delete: " + e.message); } }}>Delete folder for everyone</Btn></div>}
    </div>
  );
}

/* ---------- storage panel for leaders (and the owner) ---------- */
function TeamStorageGroup() {
  const { T, leader, toast } = useApp(); const owner = useOwner(); const lib = useStemLibrary(); const [open, setOpen] = useState(false);
  if (!(leader || owner)) return null;
  const used = (lib || []).reduce((s, m) => s + (m.size || 0) + (m.extras || []).reduce((a, x) => a + (x.size || 0), 0), 0);
  const pct = used / (TEAM_QUOTA_MB * 1048576);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "0 6px 6px", letterSpacing: 0.6 }}>TEAM STORAGE</div>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, fontWeight: 700 }}><span>Rehearsal Room audio</span><span>{fmtMB(used)} / {TEAM_QUOTA_MB} MB</span></div>
        <PBar p={Math.min(1, pct)} color={pct > 0.85 ? T.bad : pct > 0.65 ? "#FFB020" : T.accent} />
        <div style={{ fontSize: 11.5, color: T.sub, marginTop: 6, lineHeight: 1.45 }}>{(lib || []).length} shared songs. Free plan space is about {TEAM_QUOTA_MB} MB (chat & charts use a little too). Delete old songs to make room.</div>
        <div style={{ marginTop: 8 }}><Btn small variant="soft" onClick={() => setOpen((o) => !o)}>{open ? "Hide songs" : "Manage songs"}</Btn></div>
        {open && (lib || []).slice().sort((a, b) => (b.size || 0) - (a.size || 0)).map((m) => (
          <div key={m._id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderTop: `1px solid ${T.border}`, marginTop: 6 }}>
            <div style={{ flex: 1, minWidth: 0, fontSize: 13 }}><b style={{ overflowWrap: "anywhere" }}>{m.title}</b><div style={{ fontSize: 11.5, color: T.sub }}>{fmtMB((m.size || 0) + (m.extras || []).reduce((a, x) => a + (x.size || 0), 0))} · {m.byName} · {relTime(toMs(m.at))}</div></div>
            <Btn small variant="danger" icon={Trash} onClick={async () => { if (!confirm(`Delete "${m.title}" for everyone?`)) return; await deleteFolder(m).catch(() => { }); toast("Deleted"); }} />
          </div>
        ))}
      </Card>
    </div>
  );
}

/* only visible on the owner's own account; nothing else in the app mentions it */
function OwnerInbox() {
  const { leader } = useApp(); const owner = useOwner(); const [open, setOpen] = useState(false);
  if (!owner || leader) return null; // leaders already see both inboxes on the Leaders board
  return (
    <div style={{ marginBottom: 14 }}>
      <Card onClick={() => setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ fontSize: 22 }}>📥</div><div style={{ flex: 1, fontWeight: 800 }}>Team questions & feedback</div><ChevronDown size={18} style={{ transform: open ? "rotate(180deg)" : "none" }} /></Card>
      {open && <div style={{ marginTop: 6 }}><QuestionsInbox readOnly /><FeedbackInbox readOnly /></div>}
    </div>
  );
}
