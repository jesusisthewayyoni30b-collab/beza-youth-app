/* ============================ STUDIO: multitrack recorder (layers, metronome, effects, export MP3) ============================ */
const STUDIO_THEMES = [
  { id: "graphite", name: "Graphite", bg: "#1C1C1E", panel: "#2A2A2D", panel2: "#323236", lane: "#232326", lane2: "#262629", grid: "rgba(255,255,255,0.06)", bar: "rgba(255,255,255,0.13)", text: "#E8E8EA", sub: "#9A9AA2", accent: "#4DA3FF", rec: "#FF453A", ok: "#32D74B", btn: "#3A3A3F", font: FONT, regions: ["#4FBF6A", "#3F8CFF", "#E0B43A", "#9B6BFF", "#FF8A3D", "#2EC8D8", "#FF5A7A", "#A3C94F"] },
  { id: "midnight", name: "Midnight", bg: "#0D1422", panel: "#16203A", panel2: "#1C2846", lane: "#111A2E", lane2: "#141E34", grid: "rgba(140,180,255,0.07)", bar: "rgba(140,180,255,0.16)", text: "#E6EEFF", sub: "#8B9BC0", accent: "#39D0FF", rec: "#FF4D6A", ok: "#3DE3A0", btn: "#22304F", font: FONT, regions: ["#39D0FF", "#7C8CFF", "#3DE3A0", "#FFC857", "#FF7AB6", "#B48CFF", "#5CE1E6", "#FF9F5A"] },
  { id: "silver", name: "Silver", bg: "#BFC3C9", panel: "#E4E6EA", panel2: "#D6D9DE", lane: "#CDD0D5", lane2: "#C6C9CF", grid: "rgba(0,0,0,0.07)", bar: "rgba(0,0,0,0.16)", text: "#17191D", sub: "#555A63", accent: "#0A6CFF", rec: "#E0281E", ok: "#1E9E45", btn: "#C9CCD2", font: FONT, regions: ["#2E9E55", "#2F6FE0", "#C89412", "#7A4DE0", "#E0661E", "#13A3B5", "#D93A62", "#7E9E2E"] },
  { id: "neon", name: "Graffiti Neon", graffiti: true, bg: "#0A0C10", panel: "#15171C", panel2: "#1D2027", lane: "#101217", lane2: "#13161B", grid: "rgba(215,255,58,0.07)", bar: "rgba(215,255,58,0.18)", text: "#F4F7EA", sub: "#9AA38A", accent: "#D7FF3A", rec: "#FF2E88", ok: "#3DFFB2", btn: "#262A31", font: FONT, head: MARKER, regions: ["#FF2E88", "#D7FF3A", "#22E4FF", "#FFB800", "#B66BFF", "#3DFFB2", "#FF6A3D", "#7DF9FF"], spray: "radial-gradient(circle at 12% 20%, rgba(255,46,136,0.10), transparent 40%), radial-gradient(circle at 88% 70%, rgba(34,228,255,0.10), transparent 42%)" },
  { id: "riot", name: "Graffiti Riot", graffiti: true, bg: "#170D10", panel: "#24151A", panel2: "#2E1B21", lane: "#1D1114", lane2: "#211418", grid: "rgba(255,120,60,0.08)", bar: "rgba(255,120,60,0.2)", text: "#FFF1E6", sub: "#C29A8A", accent: "#FF5A1F", rec: "#FF2D2D", ok: "#FFD23F", btn: "#3A2229", font: FONT, head: MARKER, regions: ["#FF5A1F", "#FFD23F", "#FF3D8B", "#2EE6C5", "#B8FF3A", "#FF9E2C", "#7B6BFF", "#FF6F61"], spray: "radial-gradient(circle at 80% 15%, rgba(255,90,31,0.14), transparent 40%), radial-gradient(circle at 10% 85%, rgba(255,210,63,0.10), transparent 40%)" },
];
const uidS = () => Math.random().toString(36).slice(2, 10);
const LAT_KEY = "bz-studio-latency";
const sNewTrack = (n, color, name) => ({ id: uidS(), name: name || `Track ${n}`, color, vol: 0.8, pan: 0, mute: false, solo: false, arm: false, fx: { eq: { low: 0, mid: 0, high: 0 }, comp: 0, verb: 0, delay: 0, gate: false }, clips: [] });
const blankProject = (name, bpm = 80, sig = 4) => ({ id: uidS(), name: name || "New project", bpm, sig, theme: 0, tracks: [sNewTrack(1, STUDIO_THEMES[0].regions[0])], updated: Date.now(), clickMode: "ear", clickOn: true, countIn: true, snap: true, monitor: false });
const FX_PRESETS = [
  { id: "clean", label: "Clean", fx: { eq: { low: 0, mid: 0, high: 0 }, comp: 0, verb: 0, delay: 0 } },
  { id: "vocal", label: "Warm vocal", fx: { eq: { low: -3, mid: 1, high: 3 }, comp: 0.5, verb: 0.22, delay: 0 } },
  { id: "harm", label: "Harmony pad", fx: { eq: { low: -6, mid: -1, high: 2 }, comp: 0.45, verb: 0.4, delay: 0.12 } },
  { id: "hall", label: "Big hall", fx: { eq: { low: -2, mid: 0, high: 2 }, comp: 0.3, verb: 0.6, delay: 0 } },
  { id: "gtr", label: "Acoustic", fx: { eq: { low: -4, mid: -2, high: 4 }, comp: 0.35, verb: 0.15, delay: 0 } },
  { id: "punch", label: "Punchy", fx: { eq: { low: 3, mid: -2, high: 2 }, comp: 0.7, verb: 0.05, delay: 0 } },
  { id: "echo", label: "Echo", fx: { eq: { low: -2, mid: 0, high: 1 }, comp: 0.3, verb: 0.2, delay: 0.35 } },
];

/* ---------- audio helpers ---------- */
function sMakeIR(ctx, secs = 2.6, decay = 3.2) {
  const sr = ctx.sampleRate; const n = Math.floor(sr * secs); const b = ctx.createBuffer(2, n, sr);
  for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); let seed = c ? 7 : 3; for (let i = 0; i < n; i++) { seed = (seed * 16807) % 2147483647; const r = seed / 2147483647 * 2 - 1; d[i] = r * Math.pow(1 - i / n, decay) * (i < sr * 0.01 ? i / (sr * 0.01) : 1); } }
  return b;
}
const clickWave = (sr, accent) => { const n = Math.floor(sr * 0.035); const d = new Float32Array(n); const f = accent ? 1760 : 1320; for (let i = 0; i < n; i++) d[i] = Math.sin((2 * Math.PI * f * i) / sr) * Math.exp(-i / (sr * 0.006)) * 0.9; return d; };

/* builds the whole mix (used live and for export) */
function buildMix(ctx, proj, bufs, opts = {}) {
  const master = ctx.createGain(); master.gain.value = proj.master == null ? 0.9 : proj.master;
  const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -1.5; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.002; lim.release.value = 0.12;
  master.connect(lim); lim.connect(opts.dest || ctx.destination);
  const verb = ctx.createConvolver(); verb.buffer = sMakeIR(ctx, proj.verbSize || 2.6); const verbRet = ctx.createGain(); verbRet.gain.value = 0.9; verb.connect(verbRet); verbRet.connect(master);
  const dly = ctx.createDelay(4); dly.delayTime.value = (60 / proj.bpm) * 0.75; const fb = ctx.createGain(); fb.gain.value = 0.35; const dlyHp = ctx.createBiquadFilter(); dlyHp.type = "highpass"; dlyHp.frequency.value = 300;
  dly.connect(dlyHp); dlyHp.connect(fb); fb.connect(dly); const dlyRet = ctx.createGain(); dlyRet.gain.value = 0.8; dlyHp.connect(dlyRet); dlyRet.connect(master);
  const anySolo = proj.tracks.some((t) => t.solo);
  const strips = {};
  proj.tracks.forEach((t) => {
    const inp = ctx.createGain();
    const lo = ctx.createBiquadFilter(); lo.type = "lowshelf"; lo.frequency.value = 140;
    const mid = ctx.createBiquadFilter(); mid.type = "peaking"; mid.frequency.value = 1200; mid.Q.value = 0.9;
    const hi = ctx.createBiquadFilter(); hi.type = "highshelf"; hi.frequency.value = 6500;
    const comp = ctx.createDynamicsCompressor(); const mk = ctx.createGain();
    const fader = ctx.createGain(); const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
    const sV = ctx.createGain(), sD = ctx.createGain();
    inp.connect(lo); lo.connect(mid); mid.connect(hi); hi.connect(comp); comp.connect(mk); mk.connect(fader); fader.connect(pan); pan.connect(master);
    fader.connect(sV); sV.connect(verb); fader.connect(sD); sD.connect(dly);
    const an = ctx.createAnalyser ? ctx.createAnalyser() : null; if (an) { an.fftSize = 512; fader.connect(an); }
    strips[t.id] = { inp, lo, mid, hi, comp, mk, fader, pan, sV, sD, an };
    applyStrip(strips[t.id], t, anySolo, ctx, true);
  });
  return { master, strips, verb, dly, lim, anySolo };
}
function applyStrip(s, t, anySolo, ctx, now) {
  const at = now ? 0 : ctx.currentTime; const set = (p, v) => { if (now) p.value = v; else p.setTargetAtTime(v, at, 0.02); };
  const fx = t.fx || {}; const eq = fx.eq || {};
  set(s.lo.gain, eq.low || 0); set(s.mid.gain, eq.mid || 0); set(s.hi.gain, eq.high || 0);
  const c = fx.comp || 0; set(s.comp.threshold, -6 - c * 30); set(s.comp.ratio, 1 + c * 7); s.comp.attack.value = 0.006; s.comp.release.value = 0.18; set(s.mk.gain, 1 + c * 1.1);
  const live = !t.mute && (!anySolo || t.solo); set(s.fader.gain, live ? t.vol : 0);
  if (s.pan.pan) set(s.pan.pan, t.pan || 0);
  set(s.sV.gain, fx.verb || 0); set(s.sD.gain, fx.delay || 0);
}
const clipFade = (g, ctx, when, len, fi = 0.006, fo = 0.008) => { g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(1, when + fi); g.gain.setValueAtTime(1, Math.max(when + fi, when + len - fo)); g.gain.linearRampToValueAtTime(0, when + len); };
function scheduleClips(ctx, proj, bufs, strips, when, from, srcs) {
  proj.tracks.forEach((t) => (t.clips || []).forEach((c) => {
    const b = bufs[c.aid]; if (!b) return; const end = c.start + c.len; if (end <= from) return;
    const s = ctx.createBufferSource(); s.buffer = b; const g = ctx.createGain(); s.connect(g); g.connect(strips[t.id].inp);
    const late = Math.max(0, from - c.start); const at = when + Math.max(0, c.start - from); const len = c.len - late;
    if (len <= 0.005) return; clipFade(g, ctx, at, len, late > 0 ? 0.004 : c.fadeIn || 0.006, c.fadeOut || 0.008);
    if (c.gain != null) { const cg = ctx.createGain(); cg.gain.value = c.gain; s.disconnect(); s.connect(cg); cg.connect(g); }
    s.start(at, c.off + late, len); srcs.push(s);
  }));
}
const projEnd = (p) => p.tracks.reduce((m, t) => (t.clips || []).reduce((a, c) => Math.max(a, c.start + c.len), m), 0);

/* recorder worklet: posts 4096-sample blocks stamped with the audio clock */
const REC_WORKLET = `class R extends AudioWorkletProcessor{constructor(){super();this.on=false;this.b=new Float32Array(4096);this.n=0;this.t=0;this.port.onmessage=(e)=>{if(e.data==='start'){this.on=true;this.n=0;}else if(e.data==='stop'){if(this.n){this.port.postMessage({t:this.t,d:this.b.slice(0,this.n)});}this.on=false;this.n=0;this.port.postMessage({end:true});}};}
process(i){const c=i[0]&&i[0][0];if(this.on&&c){if(this.n===0)this.t=currentTime;this.b.set(c,this.n);this.n+=c.length;if(this.n>=4096){this.port.postMessage({t:this.t,d:this.b.slice(0,this.n)});this.n=0;}}return true;}}
registerProcessor('bz-rec',R);`;

const BT_RE = /bluetooth|headset|hands-?free|airpods|buds|\bbt\b|wh-|wf-|jbl|beats/i;
async function pickPhoneMic(saved) {
  const devs = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "audioinput");
  if (saved && devs.some((d) => d.deviceId === saved)) return { id: saved, devs };
  const bt = devs.some((d) => BT_RE.test(d.label));
  if (!bt) return { id: null, devs };
  const good = devs.find((d) => !BT_RE.test(d.label) && /built-?in|internal|phone|bottom|microphone|speakerphone|mic/i.test(d.label) && d.deviceId !== "default" && d.deviceId !== "communications") || devs.find((d) => !BT_RE.test(d.label) && d.deviceId !== "default" && d.deviceId !== "communications");
  return { id: good ? good.deviceId : null, devs };
}

/* removes metronome bleed: finds each click we played and subtracts it */
function removeClicks(data, sr, clickTimes /* seconds in clip time */, accents) {
  const tA = clickWave(sr, true), tB = clickWave(sr, false); let fixed = 0; const W = Math.floor(sr * 0.02);
  clickTimes.forEach((ct, i) => {
    const t = accents[i] ? tA : tB; const c0 = Math.round(ct * sr); let best = 0, bv = 0;
    let tt = 0; for (let k = 0; k < t.length; k++) tt += t[k] * t[k];
    for (let lag = -W; lag <= W; lag += 2) { const s = c0 + lag; if (s < 0 || s + t.length >= data.length) continue; let x = 0; for (let k = 0; k < t.length; k += 2) x += data[s + k] * t[k]; if (Math.abs(x) > Math.abs(bv)) { bv = x; best = lag; } }
    for (let lag = best - 2; lag <= best + 2; lag++) { const s = c0 + lag; if (s < 0 || s + t.length >= data.length) continue; let x = 0; for (let k = 0; k < t.length; k++) x += data[s + k] * t[k]; const g = x / tt; if (g > 0.003) { for (let k = 0; k < t.length; k++) data[s + k] -= g * t[k]; fixed++; break; } }
  });
  return fixed;
}

/* ============================ ENGINE (one per open project) ============================ */
function useStudioEngine(projRef, setPos, onBeat) {
  const R = useRef(null);
  if (!R.current) R.current = { ctx: null, mix: null, bufs: {}, srcs: [], playing: false, t0: 0, from: 0, clickT: null, nextBeat: 0, beatIdx: 0, rec: null, stream: null, micSrc: null, worklet: null, monitorOn: false };
  const E = R.current;
  const ctx = () => { if (!E.ctx) { const C = window.AudioContext || window.webkitAudioContext; E.ctx = new C({ latencyHint: "interactive" }); E.clickOut = E.ctx.createGain(); E.clickOut.gain.value = 0.7; E.clickOut.connect(E.ctx.destination); } if (E.ctx.state === "suspended") E.ctx.resume(); return E.ctx; };
  const loadBuf = async (aid) => { if (E.bufs[aid]) return E.bufs[aid]; const c = ctx(); const d = await IDB.get("clips", aid); if (!d) return null; const b = c.createBuffer(2, d.L.length, d.sr || c.sampleRate); b.copyToChannel(d.L, 0); b.copyToChannel(d.R || d.L, 1); E.bufs[aid] = b; return b; };
  const loadAll = async (p) => { for (const t of p.tracks) for (const c of t.clips || []) await loadBuf(c.aid); };
  const time = () => (E.playing ? E.from + (E.ctx.currentTime - E.t0) : E.from);
  const rebuild = () => { if (E.mix) { try { E.mix.master.disconnect(); } catch (e) { } } E.mix = buildMix(ctx(), projRef.current, E.bufs); if (E.micSrc && E.monitorOn) monitor(true); };
  const params = () => { const p = projRef.current; if (!E.mix) return; const ids = Object.keys(E.mix.strips); if (ids.length !== p.tracks.length || p.tracks.some((t) => !E.mix.strips[t.id])) { if (E.playing) { const t = time(); stopSrcs(); rebuild(); startAt(t); } else rebuild(); return; } const anySolo = p.tracks.some((t) => t.solo); p.tracks.forEach((t) => applyStrip(E.mix.strips[t.id], t, anySolo, E.ctx, false)); E.mix.master.gain.setTargetAtTime(p.master == null ? 0.9 : p.master, E.ctx.currentTime, 0.02); E.mix.dly.delayTime.setTargetAtTime((60 / p.bpm) * 0.75, E.ctx.currentTime, 0.05); };
  const stopSrcs = () => { E.srcs.forEach((s) => { try { s.stop(); } catch (e) { } }); E.srcs = []; };
  const clickAt = (when, acc, audible) => {
    if (audible) { const c = E.ctx; const b = c.createBuffer(1, 2000, c.sampleRate); b.copyToChannel(clickWave(c.sampleRate, acc).slice(0, 2000), 0); const s = c.createBufferSource(); s.buffer = b; s.connect(E.clickOut); s.start(when); }
  };
  const scheduler = () => {
    const p = projRef.current; const c = E.ctx; const spb = 60 / p.bpm;
    while (E.nextBeat < c.currentTime + 0.12) {
      const beatInBar = ((E.beatIdx % p.sig) + p.sig) % p.sig; const acc = beatInBar === 0;
      const inCount = E.countEnd && E.nextBeat < E.countEnd - 0.001;
      const audible = (p.clickOn || inCount) && (p.clickMode !== "silent" || inCount);
      if (p.clickOn || inCount) clickAt(E.nextBeat, acc, audible);
      if (E.rec && audible && !inCount) E.rec.clicks.push({ t: E.nextBeat, acc });
      const at = E.nextBeat; const bi = beatInBar; const delay = Math.max(0, (at - c.currentTime + (c.outputLatency || 0)) * 1000);
      setTimeout(() => { if (!E.playing) return; onBeat && onBeat(bi, inCount); if (p.clickMode === "silent" && (p.clickOn || inCount) && navigator.vibrate) { try { navigator.vibrate(acc ? 45 : 22); } catch (e) { } } }, delay);
      E.nextBeat += spb; E.beatIdx++;
    }
  };
  const startAt = (from, preroll = 0) => {
    const c = ctx(); if (!E.mix) rebuild(); stopSrcs(); const p = projRef.current; const spb = 60 / p.bpm;
    const when = c.currentTime + 0.08; const songFrom = from - preroll; const f0 = Math.max(0, songFrom);
    scheduleClips(c, p, E.bufs, E.mix.strips, when + (f0 - songFrom), f0, E.srcs);
    E.t0 = when; E.from = songFrom; E.playing = true; E.countEnd = preroll > 0 ? when + preroll : null;
    const beatPos = songFrom / spb; const firstBeat = Math.ceil(beatPos - 1e-6); E.beatIdx = firstBeat; E.nextBeat = when + (firstBeat - beatPos) * spb;
    clearInterval(E.clickT); E.clickT = setInterval(scheduler, 25); scheduler();
  };
  const stop = () => { const t = time(); stopSrcs(); clearInterval(E.clickT); E.playing = false; E.from = Math.max(0, t); return E.from; };
  const openMic = async (deviceId) => {
    const c = ctx(); if (E.stream) return E.stream;
    const cons = { echoCancellation: false, noiseSuppression: false, autoGainControl: false, channelCount: 1 };
    let st; try { st = await navigator.mediaDevices.getUserMedia({ audio: deviceId ? { ...cons, deviceId: { exact: deviceId } } : cons }); } catch (e) { if (deviceId) st = await navigator.mediaDevices.getUserMedia({ audio: cons }); else throw e; }
    E.stream = st; E.micSrc = c.createMediaStreamSource(st);
    if (!E.worklet) { await c.audioWorklet.addModule(URL.createObjectURL(new Blob([REC_WORKLET], { type: "text/javascript" }))); }
    E.worklet = new AudioWorkletNode(c, "bz-rec"); const z = c.createGain(); z.gain.value = 0; E.micSrc.connect(E.worklet); E.worklet.connect(z); z.connect(c.destination);
    E.meter = c.createAnalyser(); E.meter.fftSize = 1024; E.micSrc.connect(E.meter);
    E.worklet.port.onmessage = (e) => { if (!E.rec) return; if (e.data.end) { E.rec.done && E.rec.done(); return; } E.rec.blocks.push(e.data); };
    return st;
  };
  const closeMic = () => { try { E.stream && E.stream.getTracks().forEach((t) => t.stop()); } catch (e) { } E.stream = null; try { E.micSrc && E.micSrc.disconnect(); } catch (e) { } E.micSrc = null; E.worklet = null; };
  const monitor = (on, trackId) => {
    E.monitorOn = on; if (!E.micSrc) return; try { E.monGain && E.monGain.disconnect(); } catch (e) { }
    if (on && E.mix) { const id = trackId || (projRef.current.tracks.find((t) => t.arm) || {}).id; const s = id && E.mix.strips[id]; if (s) { E.monGain = E.ctx.createGain(); E.monGain.gain.value = 1; E.micSrc.connect(E.monGain); E.monGain.connect(s.inp); } }
  };
  const record = async (from, countIn) => {
    const p = projRef.current; const spb = 60 / p.bpm; const pre = countIn ? spb * p.sig : 0;
    E.rec = { blocks: [], clicks: [], from };
    E.worklet.port.postMessage("start"); startAt(from, pre); E.rec.songT0 = E.t0 - E.from; /* ctx time where song time 0 sits */
  };
  const finishRecord = () => new Promise((res) => {
    if (!E.rec) return res(null); const rec = E.rec; rec.done = () => { E.rec = null; res(rec); };
    E.worklet.port.postMessage("stop"); setTimeout(() => { if (E.rec === rec) { E.rec = null; res(rec); } }, 600);
  });
  useEffect(() => () => { stopSrcs(); clearInterval(E.clickT); closeMic(); try { E.ctx && E.ctx.close(); } catch (e) { } }, []); // eslint-disable-line
  return { E, ctx, loadBuf, loadAll, rebuild, params, startAt, stop, time, openMic, closeMic, monitor, record, finishRecord };
}

/* ============================ STUDIO HOME (project list) ============================ */
function StudioScreen({ fromFolder, songId, pid }) {
  const { push } = useApp();
  const [open, setOpen] = useState(pid || null); const [list, setList] = useState(null); const [busy, setBusy] = useState("");
  const { songs } = useApp(); const lib = useStemLibrary();
  const refresh = () => IDB.all("projects").then((a) => setList((a || []).sort((x, y) => (y.updated || 0) - (x.updated || 0))));
  useEffect(() => { refresh(); }, []);
  useEffect(() => {
    if (open || (!fromFolder && !songId)) return;
    (async () => {
      if (songId) { const s = songs.find((x) => x.id === songId); const p = blankProject(s ? s.title : "Song idea", s ? s.bpm : 80, s && s.meter === "3/4" ? 3 : s && s.meter === "6/8" ? 6 : 4); p.songId = songId; await IDB.set("projects", p.id, p); setOpen(p.id); return; }
      const meta = (lib || []).find((m) => m._id === fromFolder); if (!meta) return;
      setBusy("Bringing the parts into the Studio…");
      const p = blankProject(meta.title, 80, 4); p.folder = fromFolder; p.tracks = [];
      const C = window.OfflineAudioContext || window.webkitOfflineAudioContext; const sr = (new (window.AudioContext || window.webkitAudioContext)()).sampleRate;
      for (let i = 0; i < meta.stems.length; i++) {
        const s = meta.stems[i]; const blob = await fetchPart(fromFolder, s.key, s.chunks); const d = await decodeTo(await blob.arrayBuffer(), sr);
        const aid = uidS(); await IDB.set("clips", aid, { sr: d.sr, L: d.L, R: d.R });
        const t = sNewTrack(i + 1, (STEM_INFO[s.key] || {}).color || STUDIO_THEMES[0].regions[i % 8], s.label || (STEM_INFO[s.key] || {}).label); t.clips = [{ id: uidS(), aid, start: 0, off: 0, len: d.dur, name: t.name }]; p.tracks.push(t);
      }
      p.tracks.push(sNewTrack(p.tracks.length + 1, STUDIO_THEMES[0].regions[3], "My recording"));
      await IDB.set("projects", p.id, p); setBusy(""); setOpen(p.id);
    })().catch((e) => setBusy("Couldn't open the parts: " + e.message));
  }, [fromFolder, songId, lib]); // eslint-disable-line
  if (open) return <StudioEditor pid={open} onClose={() => { setOpen(null); refresh(); }} />;
  return <StudioHome list={list} busy={busy} onOpen={setOpen} refresh={refresh} />;
}
function StudioHome({ list, busy, onOpen, refresh }) {
  const { T } = useApp(); const [name, setName] = useState("");
  const create = async () => { const p = blankProject(name.trim() || `Idea ${new Date().toLocaleDateString(undefined, { day: "numeric", month: "short" })}`); await IDB.set("projects", p.id, p); onOpen(p.id); };
  return (
    <div>
      <TopBar title="Studio" sub="Record layers · harmonies · ideas" />
      {busy && <Card tone="soft" style={{ marginBottom: 10 }}>{busy}</Card>}
      <Card tone="hero" style={{ padding: 16 }}>
        <div style={{ fontWeight: 900, fontSize: 17 }}>New project</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name it (e.g. Good Plan harmonies)" style={{ flex: 1, minWidth: 0, borderRadius: 14, border: "none", padding: "11px 12px", fontFamily: FONT, fontSize: 14 }} />
          <Btn variant="light" icon={Plus} onClick={create}>Create</Btn>
        </div>
        <div style={{ fontSize: 12, opacity: 0.9, marginTop: 8 }}>Tip: open a song folder in the Rehearsal Room → <b>Open in Studio</b> to record on top of the band.</div>
      </Card>
      <SectionTitle>Your projects (saved on this device)</SectionTitle>
      {list == null && <Card tone="soft">Loading…</Card>}
      {(list || []).map((p) => (
        <Card key={p.id} onClick={() => onOpen(p.id)} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 26 }}>🎛️</div>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 800 }}>{p.name}</div><div style={{ fontSize: 12, color: T.sub }}>{p.tracks.length} track{p.tracks.length === 1 ? "" : "s"} · {p.bpm} bpm · {relTime(p.updated || Date.now())}</div></div>
          <Btn small variant="danger" icon={Trash} onClick={async (e) => { e.stopPropagation(); if (!confirm(`Delete project "${p.name}"?`)) return; for (const t of p.tracks) for (const c of t.clips) await IDB.del("clips", c.aid); await IDB.del("projects", p.id); refresh(); }} />
        </Card>
      ))}
      {list && !list.length && <Card tone="soft" style={{ fontSize: 13 }}>No projects yet.</Card>}
    </div>
  );
}

/* ============================ THE EDITOR ============================ */
function StudioEditor({ pid, onClose }) {
  const { toast, user } = useApp(); const { host } = useApp();
  const [proj, setProjS] = useState(null); const projRef = useRef(null); const hist = useRef({ past: [], future: [] });
  const [pos, setPos] = useState(0); const [playing, setPlaying] = useState(false); const [recording, setRecording] = useState(false); const [counting, setCounting] = useState(false);
  const [beat, setBeat] = useState(-1); const [sel, setSel] = useState(null); const [selTrack, setSelTrack] = useState(null); const [zoom, setZoom] = useState(60);
  const [panel, setPanel] = useState("fx"); const [sheet, setSheet] = useState(null); const [micLevel, setMicLevel] = useState(0); const [micInfo, setMicInfo] = useState(null);
  const [mobile, setMobile] = useState(window.innerWidth < 760);
  const S = STUDIO_THEMES[(proj && proj.theme) || 0];
  const eng = useStudioEngine(projRef, setPos, (b, inCount) => { setBeat(b); setCounting(!!inCount); });
  useEffect(() => { const h = () => setMobile(window.innerWidth < 760); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  useEffect(() => { (async () => { const p = await IDB.get("projects", pid); if (!p) { onClose(); return; } p.tracks.forEach((t) => (t.arm = false)); projRef.current = p; setProjS(p); setSelTrack(p.tracks[0] && p.tracks[0].id); await eng.loadAll(p); eng.rebuild(); })(); }, [pid]); // eslint-disable-line
  const saveT = useRef(null);
  const commit = (f, undoable = true) => {
    const prev = projRef.current; const next = typeof f === "function" ? f(JSON.parse(JSON.stringify(prev))) : f; next.updated = Date.now();
    if (undoable) { hist.current.past.push(prev); if (hist.current.past.length > 80) hist.current.past.shift(); hist.current.future = []; }
    projRef.current = next; setProjS(next); eng.params();
    clearTimeout(saveT.current); saveT.current = setTimeout(() => IDB.set("projects", next.id, next).catch(() => { }), 400);
  };
  const undo = () => { const h = hist.current; if (!h.past.length) return; h.future.push(projRef.current); const p = h.past.pop(); projRef.current = p; setProjS(p); eng.params(); IDB.set("projects", p.id, p); };
  const redo = () => { const h = hist.current; if (!h.future.length) return; h.past.push(projRef.current); const p = h.future.pop(); projRef.current = p; setProjS(p); eng.params(); IDB.set("projects", p.id, p); };
  useEffect(() => { if (!playing) return; let raf; const f = () => { setPos(Math.max(0, eng.time())); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf); }, [playing]); // eslint-disable-line
  useEffect(() => { if (!recording && !(micInfo && micInfo.open)) return; let raf; const a = new Float32Array(1024); const f = () => { const m = eng.E.meter; if (m) { m.getFloatTimeDomainData(a); let pk = 0; for (let i = 0; i < a.length; i++) pk = Math.max(pk, Math.abs(a[i])); setMicLevel(pk); } raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf); }, [recording, micInfo && micInfo.open]); // eslint-disable-line

  const play = () => { if (playing) { eng.stop(); setPlaying(false); setBeat(-1); return; } eng.startAt(pos); setPlaying(true); };
  const stopAll = async () => { if (recording) return stopRec(); eng.stop(); setPlaying(false); setBeat(-1); };
  const toStart = () => { const was = playing; eng.stop(); setPos(0); eng.E.from = 0; if (was) eng.startAt(0); };

  const ensureMic = async () => {
    if (eng.E.stream) return true;
    try {
      let saved = null; try { saved = localStorage.getItem("bz-studio-mic"); } catch (e) { }
      await navigator.mediaDevices.getUserMedia({ audio: true }).then((s) => s.getTracks().forEach((t) => t.stop())).catch(() => { });
      const { id, devs } = await pickPhoneMic(saved);
      await eng.openMic(id); const tr = eng.E.stream.getAudioTracks()[0]; const lab = (tr && tr.label) || "Microphone";
      setMicInfo({ open: true, label: lab, devs, id: id || (tr && tr.getSettings && tr.getSettings().deviceId) });
      if (projRef.current.monitor) eng.monitor(true);
      return true;
    } catch (e) { toast(AE.micErr ? AE.micErr(e) : "Microphone blocked"); return false; }
  };
  const latency = () => { let v = null; try { v = JSON.parse(localStorage.getItem(LAT_KEY) || "null"); } catch (e) { } if (v && v.total != null) return v.total; const c = eng.E.ctx; const tr = eng.E.stream && eng.E.stream.getAudioTracks()[0]; const inL = (tr && tr.getSettings && tr.getSettings().latency) || 0.012; return (c.outputLatency || 0.02) + (c.baseLatency || 0) + inL; };
  const startRec = async () => {
    const p = projRef.current; let arm = p.tracks.find((t) => t.arm);
    if (!arm) { const t = p.tracks.find((x) => x.id === selTrack && !(x.clips || []).length) || p.tracks.find((x) => !(x.clips || []).length) || null; if (t) { commit((q) => { q.tracks.find((x) => x.id === t.id).arm = true; return q; }, false); arm = t; } else { const nt = sNewTrack(p.tracks.length + 1, S.regions[p.tracks.length % S.regions.length]); nt.arm = true; commit((q) => { q.tracks.push(nt); return q; }); arm = nt; setSelTrack(nt.id); } }
    if (!(await ensureMic())) return;
    eng.rebuild(); if (projRef.current.monitor) eng.monitor(true, arm.id);
    const from = p.snap ? Math.max(0, Math.floor(pos / (60 / p.bpm)) * (60 / p.bpm)) : pos;
    setPos(from); eng.record(from, p.countIn); setRecording({ track: arm.id, from }); setPlaying(true);
  };
  const stopRec = async () => {
    const r = recording; const rec = await eng.finishRecord(); eng.stop(); setPlaying(false); setRecording(false); setBeat(-1); setCounting(false);
    if (!rec || !rec.blocks.length) return;
    const c = eng.E.ctx; const sr = c.sampleRate; const lat = latency();
    const songT0 = rec.songT0; const first = rec.blocks[0].t;
    const total = rec.blocks.reduce((s, b) => s + b.d.length, 0); const raw = new Float32Array(total); let o = 0; rec.blocks.forEach((b) => { raw.set(b.d, o); o += b.d.length; });
    const startSong = first - songT0 - lat; // song time of the first recorded sample, after latency correction
    const cut = Math.max(0, Math.round((r.from - startSong) * sr)); let data = raw.subarray(cut); const clipStart = startSong + cut / sr;
    if (data.length < sr * 0.15) { toast("Recording too short"); return; }
    data = new Float32Array(data);
    let note = "";
    if (projRef.current.clickMode === "speaker" && rec.clicks.length) { const times = rec.clicks.map((k) => (k.t - songT0) - clipStart).filter((t) => t > 0 && t < data.length / sr); const n = removeClicks(data, sr, times, rec.clicks.map((k) => k.acc)); if (n) note = ` · cleaned ${n} clicks`; }
    let pk = 0; for (let i = 0; i < data.length; i++) pk = Math.max(pk, Math.abs(data[i]));
    const aid = uidS(); await IDB.set("clips", aid, { sr, L: data, R: data }); await eng.loadBuf(aid);
    const tk = projRef.current.tracks.find((t) => t.id === r.track); const takeN = ((tk && tk.clips) || []).length + 1;
    commit((q) => { const t = q.tracks.find((x) => x.id === r.track); if (t) t.clips.push({ id: uidS(), aid, start: Math.max(0, clipStart), off: clipStart < 0 ? -clipStart : 0, len: data.length / sr - (clipStart < 0 ? -clipStart : 0), name: `Take ${takeN}` }); return q; });
    eng.rebuild();
    toast(pk < 0.01 ? "Recorded — but it was very quiet. Check the mic." : `Recorded ✓${note}`);
  };
  /* keyboard shortcuts on computers */
  useEffect(() => {
    const h = (e) => { if (/INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || "")) return; if (e.code === "Space") { e.preventDefault(); recording ? stopRec() : play(); } else if (e.key === "r" || e.key === "R") { recording ? stopRec() : startRec(); } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); } else if ((e.key === "Delete" || e.key === "Backspace") && sel) { delClip(); } else if (e.key === "Enter") toStart(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  });

  const addTrack = (name) => { const p = projRef.current; const nt = sNewTrack(p.tracks.length + 1, S.regions[p.tracks.length % S.regions.length], name); commit((q) => { q.tracks.push(nt); return q; }); setSelTrack(nt.id); return nt; };
  const setTrack = (id, patch, undoable = false) => commit((q) => { const t = q.tracks.find((x) => x.id === id); if (t) Object.assign(t, typeof patch === "function" ? patch(t) : patch); return q; }, undoable);
  const delTrack = (id) => { commit((q) => { q.tracks = q.tracks.filter((t) => t.id !== id); return q; }); };
  const findClip = (cid) => { for (const t of projRef.current.tracks) { const c = t.clips.find((x) => x.id === cid); if (c) return { t, c }; } return null; };
  const delClip = () => { if (!sel) return; commit((q) => { q.tracks.forEach((t) => (t.clips = t.clips.filter((c) => c.id !== sel))); return q; }); setSel(null); };
  const splitClip = () => { const f = sel && findClip(sel); if (!f) return; const at = pos - f.c.start; if (at <= 0.05 || at >= f.c.len - 0.05) { toast("Move the playhead inside the clip to split"); return; } commit((q) => { const t = q.tracks.find((x) => x.id === f.t.id); const c = t.clips.find((x) => x.id === sel); const b = { ...c, id: uidS(), start: c.start + at, off: c.off + at, len: c.len - at }; c.len = at; t.clips.push(b); return q; }); };
  const dupClip = () => { const f = sel && findClip(sel); if (!f) return; commit((q) => { const t = q.tracks.find((x) => x.id === f.t.id); const c = t.clips.find((x) => x.id === sel); t.clips.push({ ...c, id: uidS(), start: c.start + c.len }); return q; }); };
  const importFile = async (file, toTrack) => {
    try {
      const c = eng.ctx(); const d = await decodeTo(await file.arrayBuffer(), c.sampleRate); const aid = uidS(); await IDB.set("clips", aid, { sr: d.sr, L: d.L, R: d.R }); await eng.loadBuf(aid);
      let tid = toTrack; if (!tid) { const t = addTrack(baseName(file.name).slice(0, 28)); tid = t.id; }
      commit((q) => { const t = q.tracks.find((x) => x.id === tid); t.clips.push({ id: uidS(), aid, start: 0, off: 0, len: d.dur, name: baseName(file.name) }); return q; });
      toast(`Imported ${baseName(file.name)}`);
    } catch (e) { toast("Couldn't import that file"); }
  };

  if (!proj) return <div style={{ padding: 20 }}>Opening the studio…</div>;
  const spb = 60 / proj.bpm; const barDur = spb * proj.sig;
  const end = Math.max(projEnd(proj) + barDur * 4, barDur * 16, pos + barDur * 4);
  const selT = proj.tracks.find((t) => t.id === selTrack);
  const ui = (
    <div style={{ position: "fixed", inset: 0, zIndex: 9000, background: S.bg, backgroundImage: S.spray, color: S.text, fontFamily: S.font, display: "flex", flexDirection: "column", userSelect: "none" }}>
      <StudioTop S={S} proj={proj} onClose={() => { eng.stop(); eng.closeMic(); onClose(); }} commit={commit} undo={undo} redo={redo} canUndo={hist.current.past.length > 0} canRedo={hist.current.future.length > 0} setSheet={setSheet} mobile={mobile} />
      <Transport S={S} proj={proj} pos={pos} playing={playing} recording={recording} counting={counting} beat={beat} play={play} stop={stopAll} toStart={toStart} rec={() => (recording ? stopRec() : startRec())} commit={commit} zoom={zoom} setZoom={setZoom} mobile={mobile} setSheet={setSheet} micLevel={micLevel} />
      <Timeline S={S} proj={proj} pos={pos} setPos={(t) => { setPos(t); eng.E.from = t; if (playing && !recording) eng.startAt(t); }} zoom={zoom} end={end} sel={sel} setSel={setSel} selTrack={selTrack} setSelTrack={setSelTrack} setTrack={setTrack} commit={commit} delTrack={delTrack} mobile={mobile} recording={recording} bufs={eng.E.bufs} addTrack={addTrack} importFile={importFile} playing={playing} />
      {sel && <ClipBar S={S} onSplit={splitClip} onDup={dupClip} onDel={delClip} onClose={() => setSel(null)} clip={(findClip(sel) || {}).c} setGain={(g) => commit((q) => { q.tracks.forEach((t) => t.clips.forEach((c) => { if (c.id === sel) c.gain = g; })); return q; }, false)} />}
      <BottomPanel S={S} proj={proj} panel={panel} setPanel={setPanel} selT={selT} setTrack={setTrack} commit={commit} mobile={mobile} selTrack={selTrack} setSelTrack={setSelTrack} strips={eng.E.mix && eng.E.mix.strips} playing={playing} />
      {sheet === "export" && <ExportSheet S={S} proj={proj} eng={eng} onClose={() => setSheet(null)} />}
      {sheet === "settings" && <StudioSettings S={S} proj={proj} commit={commit} eng={eng} micInfo={micInfo} setMicInfo={setMicInfo} ensureMic={ensureMic} onClose={() => setSheet(null)} />}
      {sheet === "click" && <ClickSheet S={S} proj={proj} commit={commit} onClose={() => setSheet(null)} eng={eng} ensureMic={ensureMic} />}
    </div>
  );
  return createPortal(ui, document.body);
}

/* ---------- small studio UI parts ---------- */
const sBtn = (S, on, col, extra) => ({ height: 34, minWidth: 34, padding: "0 10px", borderRadius: 8, border: `1px solid ${on ? col || S.accent : "transparent"}`, background: on ? (col || S.accent) : S.btn, color: on ? "#0B0B0D" : S.text, fontFamily: S.font, fontWeight: 700, fontSize: 12.5, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, flexShrink: 0, ...extra });
function StudioTop({ S, proj, onClose, commit, undo, redo, canUndo, canRedo, setSheet, mobile }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: S.panel, borderBottom: `1px solid ${S.bar}` }}>
      <button aria-label="Back" onClick={onClose} style={sBtn(S, false)}><ChevronLeft size={18} noBlob /></button>
      <input value={proj.name} onChange={(e) => commit((q) => ({ ...q, name: e.target.value }), false)} style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: S.text, fontFamily: S.head || S.font, fontWeight: 800, fontSize: mobile ? 15 : 17 }} />
      <button aria-label="Undo" disabled={!canUndo} onClick={undo} style={{ ...sBtn(S, false), opacity: canUndo ? 1 : 0.4 }}>↶</button>
      <button aria-label="Redo" disabled={!canRedo} onClick={redo} style={{ ...sBtn(S, false), opacity: canRedo ? 1 : 0.4 }}>↷</button>
      <button onClick={() => setSheet("settings")} style={sBtn(S, false)} aria-label="Studio settings"><Settings size={16} noBlob />{!mobile && "Setup"}</button>
      <button onClick={() => setSheet("export")} style={sBtn(S, true)}><Download size={16} noBlob />{mobile ? "" : "Export"}</button>
    </div>
  );
}
function Transport({ S, proj, pos, playing, recording, counting, beat, play, stop, toStart, rec, commit, zoom, setZoom, mobile, setSheet, micLevel }) {
  const spb = 60 / proj.bpm; const b = Math.floor(pos / spb + 1e-6); const bar = Math.floor(b / proj.sig) + 1; const bt = (b % proj.sig) + 1;
  const modeIcon = proj.clickMode === "silent" ? "💡" : proj.clickMode === "speaker" ? "🔊" : "🎧";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: S.panel2, borderBottom: `1px solid ${S.bar}`, flexWrap: mobile ? "wrap" : "nowrap" }}>
      <div style={{ display: "flex", gap: 6 }}>
        <button aria-label="Go to start" onClick={toStart} style={sBtn(S, false)}><SkipBack size={16} noBlob /></button>
        <button aria-label={playing ? "Pause" : "Play"} onClick={play} disabled={!!recording} style={sBtn(S, playing && !recording, S.ok, { width: 44 })}>{playing && !recording ? <Pause size={17} noBlob /> : <Play size={17} noBlob />}</button>
        <button aria-label="Stop" onClick={stop} style={sBtn(S, false)}><Square size={15} noBlob /></button>
        <button aria-label="Record" onClick={rec} style={sBtn(S, !!recording, S.rec, { width: 44 })}><span style={{ width: 13, height: 13, borderRadius: 7, background: recording ? "#fff" : S.rec, display: "inline-block", animation: recording ? "bzpulse 1s infinite" : "none" }} /></button>
      </div>
      <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontWeight: 800, fontSize: mobile ? 15 : 18, background: S.bg, borderRadius: 8, padding: "5px 10px", minWidth: mobile ? 96 : 150, textAlign: "center", color: recording ? S.rec : S.text }}>
        {counting ? "COUNT-IN" : `${bar}.${bt}`}{!mobile && <span style={{ color: S.sub, fontSize: 12, marginLeft: 10 }}>{fmtT(pos)}</span>}
      </div>
      {/* the metronome zone — only this box flashes */}
      <div onClick={() => setSheet("click")} title="Metronome" style={{ display: "flex", alignItems: "center", gap: 4, background: S.bg, borderRadius: 8, padding: "4px 6px", cursor: "pointer", border: `1px solid ${S.bar}` }}>
        <span style={{ fontSize: 13 }}>{modeIcon}</span>
        {Array.from({ length: proj.sig }, (_, i) => (
          <div key={i} data-beat={i} style={{ width: mobile ? 13 : 16, height: 22, borderRadius: 4, background: beat === i ? (i === 0 ? S.rec : S.accent) : S.btn, boxShadow: beat === i ? `0 0 12px ${i === 0 ? S.rec : S.accent}` : "none", transition: "background .05s", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 900, color: beat === i ? "#111" : S.sub }}>{i + 1}</div>
        ))}
      </div>
      <button onClick={() => commit((q) => ({ ...q, clickOn: !q.clickOn }), false)} style={sBtn(S, proj.clickOn)} aria-label="Metronome on/off"><Timer size={15} noBlob />{!mobile && "Click"}</button>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input aria-label="Tempo" type="number" min={30} max={260} value={proj.bpm} onChange={(e) => { const v = Math.max(30, Math.min(260, +e.target.value || 80)); commit((q) => ({ ...q, bpm: v }), false); }} style={{ width: 56, height: 32, borderRadius: 8, border: "none", background: S.bg, color: S.text, textAlign: "center", fontWeight: 800, fontFamily: S.font }} />
        <span style={{ fontSize: 11, color: S.sub }}>bpm</span>
        <select aria-label="Time signature" value={proj.sig} onChange={(e) => commit((q) => ({ ...q, sig: +e.target.value }), false)} style={{ height: 32, borderRadius: 8, border: "none", background: S.bg, color: S.text, fontWeight: 800, fontFamily: S.font }}>{[2, 3, 4, 5, 6, 7, 9, 12].map((n) => <option key={n} value={n}>{n}/{n === 6 || n === 9 || n === 12 ? 8 : 4}</option>)}</select>
      </div>
      <button onClick={() => commit((q) => ({ ...q, countIn: !q.countIn }), false)} style={sBtn(S, proj.countIn)}>{mobile ? "1-2-3-4" : "Count-in"}</button>
      <button onClick={() => commit((q) => ({ ...q, snap: !q.snap }), false)} style={sBtn(S, proj.snap)}>Snap</button>
      {recording && <div style={{ width: 60, height: 8, borderRadius: 4, background: S.btn, overflow: "hidden" }} title="Mic level"><div style={{ width: `${Math.min(100, micLevel * 140)}%`, height: "100%", background: micLevel > 0.9 ? S.rec : S.ok }} /></div>}
      <div style={{ flex: 1 }} />
      <button aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(12, z / 1.4))} style={sBtn(S, false)}>−</button>
      <button aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(400, z * 1.4))} style={sBtn(S, false)}>+</button>
    </div>
  );
}

const peakCache = {};
function ClipWave({ buf, aid, off, len, color, w, h }) {
  const cv = useRef(null);
  useEffect(() => {
    const c = cv.current; if (!c || !buf) return; const dpr = window.devicePixelRatio || 1; const W = Math.max(1, Math.min(8000, Math.round(w))); c.width = W * dpr; c.height = h * dpr; const g = c.getContext("2d"); g.scale(dpr, dpr); g.clearRect(0, 0, W, h);
    let pk = peakCache[aid]; if (!pk) { const d = buf.getChannelData(0); const per = Math.max(1, Math.floor(buf.sampleRate / 200)); pk = new Float32Array(Math.ceil(d.length / per)); for (let i = 0; i < pk.length; i++) { let m = 0; for (let j = i * per; j < (i + 1) * per && j < d.length; j += 2) { const v = Math.abs(d[j]); if (v > m) m = v; } pk[i] = m; } let mx = 0; for (let i = 0; i < pk.length; i++) if (pk[i] > mx) mx = pk[i]; pk.scale = 0.92 / Math.max(mx, 0.02); peakCache[aid] = pk; }
    g.fillStyle = "rgba(0,0,0,0.55)"; const s0 = off * 200, s1 = (off + len) * 200;
    for (let x = 0; x < W; x++) { const i = Math.floor(s0 + (x / W) * (s1 - s0)); const v = Math.min(1, (pk[i] || 0) * (pk.scale || 1.6)); const hh = Math.max(1, v * (h - 4)); g.fillRect(x, (h - hh) / 2, 1, hh); }
  }, [buf, aid, off, len, w, h, color]);
  return <canvas ref={cv} style={{ width: w, height: h, display: "block" }} />;
}

function Timeline({ S, proj, pos, setPos, zoom, end, sel, setSel, selTrack, setSelTrack, setTrack, commit, delTrack, mobile, recording, bufs, addTrack, importFile, playing }) {
  const HW = mobile ? 118 : 200; const LH = mobile ? 64 : 76; const RH = 26; const W = end * zoom; const spb = 60 / proj.bpm; const barDur = spb * proj.sig;
  const scroller = useRef(null); const drag = useRef(null); const fileRef = useRef(null); const [impTo, setImpTo] = useState(null); const [, force] = useState(0);
  useEffect(() => { const sc = scroller.current; if (!sc || !playing) return; const x = pos * zoom; if (x > sc.scrollLeft + sc.clientWidth - HW - 60) sc.scrollLeft = x - 80; }, [pos, playing]); // eslint-disable-line
  const bars = []; for (let t = 0, n = 1; t < end; t += barDur, n++) bars.push([t, n]);
  const snapT = (t) => (proj.snap ? Math.round(t / spb) * spb : t);
  const onClipDown = (e, t, c) => { e.stopPropagation(); setSel(c.id); setSelTrack(t.id); drag.current = { id: c.id, x: e.clientX, start: c.start, moved: false }; e.currentTarget.setPointerCapture(e.pointerId); };
  const onClipMove = (e) => { const d = drag.current; if (!d) return; const dx = (e.clientX - d.x) / zoom; if (Math.abs(e.clientX - d.x) > 4) d.moved = true; if (!d.moved) return; d.now = Math.max(0, snapT(d.start + dx)); force((x) => x + 1); };
  const onClipUp = () => { const d = drag.current; drag.current = null; if (d && d.moved && d.now != null) commit((q) => { q.tracks.forEach((t) => t.clips.forEach((c) => { if (c.id === d.id) c.start = d.now; })); return q; }); };
  return (
    <div ref={scroller} style={{ flex: 1, overflow: "auto", position: "relative", background: S.lane }} onClick={() => setSel(null)}>
      <div style={{ width: HW + W + 40, position: "relative" }}>
        {/* ruler */}
        <div style={{ position: "sticky", top: 0, zIndex: 5, display: "flex", height: RH, background: S.panel2, borderBottom: `1px solid ${S.bar}` }}>
          <div style={{ position: "sticky", left: 0, zIndex: 6, width: HW, flexShrink: 0, background: S.panel2, borderRight: `1px solid ${S.bar}`, display: "flex", alignItems: "center", padding: "0 8px", fontSize: 11, color: S.sub, fontWeight: 700 }}>{proj.tracks.length} tracks</div>
          <div style={{ position: "relative", width: W, cursor: "pointer" }} onPointerDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos(Math.max(0, (e.clientX - r.left) / zoom)); }}>
            {bars.map(([t, n]) => <div key={n} style={{ position: "absolute", left: t * zoom, top: 0, bottom: 0, borderLeft: `1px solid ${S.bar}`, paddingLeft: 3, fontSize: 10.5, color: S.sub, fontWeight: 700 }}>{(barDur * zoom > 26 || n % 4 === 1) ? n : ""}</div>)}
            <div style={{ position: "absolute", left: pos * zoom - 6, top: RH - 10, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `9px solid ${recording ? S.rec : S.accent}` }} />
          </div>
        </div>
        {proj.tracks.map((t, ti) => {
          const isSel = t.id === selTrack;
          return (
            <div key={t.id} style={{ display: "flex", height: LH, borderBottom: `1px solid ${S.bar}` }}>
              <div onClick={(e) => { e.stopPropagation(); setSelTrack(t.id); }} style={{ position: "sticky", left: 0, zIndex: 4, width: HW, flexShrink: 0, background: isSel ? S.panel2 : S.panel, borderRight: `1px solid ${S.bar}`, display: "flex", gap: 6, padding: "6px 6px 6px 0", boxSizing: "border-box" }}>
                <div style={{ width: 5, background: t.color, borderRadius: "0 3px 3px 0" }} />
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <input value={t.name} onChange={(e) => setTrack(t.id, { name: e.target.value })} onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: S.text, fontWeight: 700, fontSize: 12.5, fontFamily: S.font, padding: 0 }} />
                  <div style={{ display: "flex", gap: 4 }}>
                    <button aria-label={`Mute ${t.name}`} onClick={(e) => { e.stopPropagation(); setTrack(t.id, { mute: !t.mute }); }} style={sBtn(S, t.mute, "#5AA9FF", { height: 24, minWidth: 24, padding: 0, fontSize: 11 })}>M</button>
                    <button aria-label={`Solo ${t.name}`} onClick={(e) => { e.stopPropagation(); setTrack(t.id, { solo: !t.solo }); }} style={sBtn(S, t.solo, "#FFC531", { height: 24, minWidth: 24, padding: 0, fontSize: 11 })}>S</button>
                    <button aria-label={`Arm ${t.name} for recording`} onClick={(e) => { e.stopPropagation(); commit((q) => { q.tracks.forEach((x) => (x.arm = x.id === t.id ? !x.arm : false)); return q; }, false); setSelTrack(t.id); }} style={sBtn(S, t.arm, S.rec, { height: 24, minWidth: 24, padding: 0, fontSize: 11 })}>R</button>
                    {!mobile && <input aria-label={`${t.name} volume`} type="range" min={0} max={1.2} step={0.01} value={t.vol} onChange={(e) => setTrack(t.id, { vol: +e.target.value })} onClick={(e) => e.stopPropagation()} style={{ flex: 1, minWidth: 30, accentColor: t.color }} />}
                  </div>
                </div>
              </div>
              <div style={{ position: "relative", width: W, background: ti % 2 ? S.lane2 : S.lane }} onPointerDown={(e) => { if (e.target !== e.currentTarget) return; const r = e.currentTarget.getBoundingClientRect(); setPos(snapT(Math.max(0, (e.clientX - r.left) / zoom))); setSelTrack(t.id); setSel(null); }}>
                {bars.map(([x, n]) => <div key={n} style={{ position: "absolute", left: x * zoom, top: 0, bottom: 0, borderLeft: `1px solid ${S.grid}`, pointerEvents: "none" }} />)}
                {t.clips.map((c) => {
                  const d = drag.current && drag.current.id === c.id && drag.current.now != null ? drag.current.now : c.start; const on = sel === c.id; const w = Math.max(6, c.len * zoom);
                  return (
                    <div key={c.id} data-clip={c.id} onPointerDown={(e) => onClipDown(e, t, c)} onPointerMove={onClipMove} onPointerUp={onClipUp} onClick={(e) => e.stopPropagation()}
                      style={{ position: "absolute", left: d * zoom, top: 4, height: LH - 9, width: w, borderRadius: 6, background: t.color, opacity: t.mute ? 0.45 : 0.95, border: on ? `2px solid ${S.text}` : "1px solid rgba(0,0,0,0.35)", boxSizing: "border-box", overflow: "hidden", cursor: "grab", touchAction: "none" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: "rgba(0,0,0,0.8)", padding: "1px 5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", background: "rgba(255,255,255,0.25)" }}>{c.name || "Clip"}</div>
                      <ClipWave buf={bufs[c.aid]} aid={c.aid} off={c.off} len={c.len} color={t.color} w={w} h={LH - 26} />
                    </div>
                  );
                })}
                {recording && recording.track === t.id && pos > recording.from && <div style={{ position: "absolute", left: recording.from * zoom, top: 4, height: LH - 9, width: (pos - recording.from) * zoom, borderRadius: 6, background: S.rec, opacity: 0.55 }} />}
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", gap: 8, padding: 10, position: "sticky", left: 0, width: "fit-content" }}>
          <button onClick={(e) => { e.stopPropagation(); addTrack(); }} style={sBtn(S, false)}><Plus size={15} noBlob /> Track</button>
          <button onClick={(e) => { e.stopPropagation(); setImpTo(null); fileRef.current.click(); }} style={sBtn(S, false)}><Upload size={15} noBlob /> Import audio</button>
          {selTrack && <button onClick={(e) => { e.stopPropagation(); if (confirm("Delete this track?")) delTrack(selTrack); }} style={sBtn(S, false)}><Trash size={14} noBlob /></button>}
          <input ref={fileRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; e.target.value = ""; if (f) importFile(f, impTo); }} />
        </div>
        {/* playhead */}
        <div style={{ position: "absolute", left: HW + pos * zoom, top: 0, bottom: 0, width: 2, background: recording ? S.rec : S.accent, pointerEvents: "none", zIndex: 3, boxShadow: `0 0 6px ${recording ? S.rec : S.accent}` }} />
      </div>
    </div>
  );
}
function ClipBar({ S, onSplit, onDup, onDel, onClose, clip, setGain }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px", background: S.panel2, borderTop: `1px solid ${S.bar}`, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: S.sub }}>{(clip && clip.name) || "Clip"}</span>
      <button onClick={onSplit} style={sBtn(S, false)}>✂ Split at playhead</button>
      <button onClick={onDup} style={sBtn(S, false)}>⧉ Duplicate</button>
      <button onClick={onDel} style={sBtn(S, false)}><Trash size={14} noBlob /> Delete</button>
      <span style={{ fontSize: 11.5, color: S.sub, marginLeft: 6 }}>Clip volume</span>
      <input aria-label="Clip volume" type="range" min={0} max={2} step={0.01} value={clip && clip.gain != null ? clip.gain : 1} onChange={(e) => setGain(+e.target.value)} style={{ width: 110, accentColor: S.accent }} />
      <div style={{ flex: 1 }} /><button onClick={onClose} style={sBtn(S, false)}><X size={14} noBlob /></button>
    </div>
  );
}
function SKnob({ S, label, value, min, max, onChange, fmt, color }) {
  const ref = useRef(null); const st = useRef(null); const f = (value - min) / (max - min); const ang = -135 + f * 270;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, width: 58 }}>
      <div ref={ref} role="slider" aria-label={label} aria-valuenow={value} tabIndex={0}
        onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowRight") onChange(Math.min(max, value + (max - min) / 50)); if (e.key === "ArrowDown" || e.key === "ArrowLeft") onChange(Math.max(min, value - (max - min) / 50)); }}
        onPointerDown={(e) => { st.current = { y: e.clientY, v: value }; e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => { const s = st.current; if (!s) return; const dv = ((s.y - e.clientY) / 140) * (max - min); onChange(Math.max(min, Math.min(max, s.v + dv))); }}
        onPointerUp={() => (st.current = null)} onDoubleClick={() => onChange(min < 0 ? 0 : min)}
        style={{ width: 40, height: 40, borderRadius: 20, background: `conic-gradient(from -135deg, ${color || S.accent} ${f * 270}deg, ${S.btn} ${f * 270}deg 270deg, transparent 270deg)`, display: "grid", placeItems: "center", cursor: "ns-resize", touchAction: "none" }}>
        <div style={{ width: 30, height: 30, borderRadius: 15, background: S.panel, position: "relative" }}><div style={{ position: "absolute", left: 14, top: 3, width: 2, height: 10, background: S.text, transformOrigin: "1px 12px", transform: `rotate(${ang}deg)` }} /></div>
      </div>
      <div style={{ fontSize: 10, color: S.sub, fontWeight: 700, textAlign: "center", lineHeight: 1.1 }}>{label}<br /><span style={{ color: S.text }}>{fmt ? fmt(value) : value.toFixed(1)}</span></div>
    </div>
  );
}
function MeterBar({ an, S }) {
  const [v, setV] = useState(0);
  useEffect(() => { if (!an) return; let raf; const a = new Float32Array(an.fftSize); const f = () => { an.getFloatTimeDomainData(a); let pk = 0; for (let i = 0; i < a.length; i++) pk = Math.max(pk, Math.abs(a[i])); setV((o) => Math.max(pk, o * 0.9)); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf); }, [an]);
  return <div style={{ width: 6, height: 90, background: S.btn, borderRadius: 3, display: "flex", alignItems: "flex-end", overflow: "hidden" }}><div style={{ width: "100%", height: `${Math.min(100, v * 110)}%`, background: v > 0.95 ? S.rec : v > 0.7 ? "#FFC531" : S.ok }} /></div>;
}
function BottomPanel({ S, proj, panel, setPanel, selT, setTrack, commit, mobile, selTrack, setSelTrack, strips, playing }) {
  const [open, setOpen] = useState(!mobile);
  const fx = (selT && selT.fx) || {}; const eq = fx.eq || {};
  const setFx = (patch) => selT && setTrack(selT.id, (t) => ({ fx: { ...t.fx, ...patch } }));
  return (
    <div style={{ background: S.panel, borderTop: `1px solid ${S.bar}` }}>
      <div style={{ display: "flex", gap: 6, padding: "6px 10px", alignItems: "center" }}>
        {[["fx", "Track FX"], ["mixer", "Mixer"], ["master", "Master"]].map(([k, l]) => <button key={k} onClick={() => { setPanel(k); setOpen(true); }} style={sBtn(S, open && panel === k)}>{l}</button>)}
        <div style={{ flex: 1 }} /><button aria-label={open ? "Hide panel" : "Show panel"} onClick={() => setOpen((o) => !o)} style={sBtn(S, false)}>{open ? "▾" : "▴"}</button>
      </div>
      {open && panel === "fx" && (selT ? (
        <div style={{ padding: "4px 12px 12px", display: "flex", gap: 14, alignItems: "flex-start", overflowX: "auto" }}>
          <div style={{ minWidth: 120 }}>
            <div style={{ fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 5, background: selT.color }} />{selT.name}</div>
            <div style={{ fontSize: 10.5, color: S.sub, margin: "6px 0 4px" }}>PRESET</div>
            <select aria-label="Effect preset" onChange={(e) => { const p = FX_PRESETS.find((x) => x.id === e.target.value); if (p) setTrack(selT.id, { fx: JSON.parse(JSON.stringify(p.fx)) }, true); e.target.value = ""; }} defaultValue="" style={{ height: 30, borderRadius: 8, border: "none", background: S.btn, color: S.text, fontFamily: S.font, fontWeight: 700 }}><option value="" disabled>Choose…</option>{FX_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select>
            <div style={{ fontSize: 10.5, color: S.sub, margin: "8px 0 2px" }}>COLOUR</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", width: 120 }}>{S.regions.map((c) => <div key={c} onClick={() => setTrack(selT.id, { color: c })} style={{ width: 16, height: 16, borderRadius: 4, background: c, cursor: "pointer", outline: selT.color === c ? `2px solid ${S.text}` : "none" }} />)}</div>
          </div>
          <FxBox S={S} title="EQ"><SKnob S={S} label="Low" value={eq.low || 0} min={-12} max={12} onChange={(v) => setFx({ eq: { ...eq, low: v } })} fmt={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)} dB`} /><SKnob S={S} label="Mid" value={eq.mid || 0} min={-12} max={12} onChange={(v) => setFx({ eq: { ...eq, mid: v } })} fmt={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)} dB`} /><SKnob S={S} label="High" value={eq.high || 0} min={-12} max={12} onChange={(v) => setFx({ eq: { ...eq, high: v } })} fmt={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)} dB`} /></FxBox>
          <FxBox S={S} title="Compressor"><SKnob S={S} label="Amount" value={fx.comp || 0} min={0} max={1} onChange={(v) => setFx({ comp: v })} fmt={(v) => `${Math.round(v * 100)}%`} color="#FFC531" /></FxBox>
          <FxBox S={S} title="Reverb"><SKnob S={S} label="Send" value={fx.verb || 0} min={0} max={1} onChange={(v) => setFx({ verb: v })} fmt={(v) => `${Math.round(v * 100)}%`} color="#B98CFF" /></FxBox>
          <FxBox S={S} title="Delay"><SKnob S={S} label="Send" value={fx.delay || 0} min={0} max={1} onChange={(v) => setFx({ delay: v })} fmt={(v) => `${Math.round(v * 100)}%`} color="#3DD6A0" /></FxBox>
          <FxBox S={S} title="Channel"><SKnob S={S} label="Volume" value={selT.vol} min={0} max={1.2} onChange={(v) => setTrack(selT.id, { vol: v })} fmt={(v) => `${Math.round(v * 100)}%`} /><SKnob S={S} label="Pan" value={selT.pan || 0} min={-1} max={1} onChange={(v) => setTrack(selT.id, { pan: v })} fmt={(v) => (Math.abs(v) < 0.04 ? "C" : v < 0 ? `L${Math.round(-v * 100)}` : `R${Math.round(v * 100)}`)} /></FxBox>
        </div>
      ) : <div style={{ padding: 12, fontSize: 12.5, color: S.sub }}>Tap a track to edit its effects.</div>)}
      {open && panel === "mixer" && (
        <div style={{ display: "flex", gap: 8, padding: "6px 10px 12px", overflowX: "auto" }}>
          {proj.tracks.map((t) => (
            <div key={t.id} onClick={() => setSelTrack(t.id)} style={{ minWidth: 70, background: t.id === selTrack ? S.panel2 : S.bg, borderRadius: 10, padding: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, borderTop: `3px solid ${t.color}` }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, maxWidth: 62, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
              <SKnob S={S} label="Pan" value={t.pan || 0} min={-1} max={1} onChange={(v) => setTrack(t.id, { pan: v })} fmt={(v) => (Math.abs(v) < 0.04 ? "C" : v < 0 ? `L${Math.round(-v * 100)}` : `R${Math.round(v * 100)}`)} />
              <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
                <input aria-label={`${t.name} fader`} type="range" min={0} max={1.2} step={0.01} value={t.vol} onChange={(e) => setTrack(t.id, { vol: +e.target.value })} style={{ writingMode: "vertical-lr", direction: "rtl", height: 90, width: 22, accentColor: t.color }} />
                <MeterBar an={strips && strips[t.id] && strips[t.id].an} S={S} />
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                <button onClick={(e) => { e.stopPropagation(); setTrack(t.id, { mute: !t.mute }); }} style={sBtn(S, t.mute, "#5AA9FF", { height: 22, minWidth: 22, padding: 0, fontSize: 10 })}>M</button>
                <button onClick={(e) => { e.stopPropagation(); setTrack(t.id, { solo: !t.solo }); }} style={sBtn(S, t.solo, "#FFC531", { height: 22, minWidth: 22, padding: 0, fontSize: 10 })}>S</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {open && panel === "master" && (
        <div style={{ display: "flex", gap: 14, padding: "6px 12px 12px", overflowX: "auto", alignItems: "flex-start" }}>
          <FxBox S={S} title="Master"><SKnob S={S} label="Volume" value={proj.master == null ? 0.9 : proj.master} min={0} max={1.4} onChange={(v) => commit((q) => ({ ...q, master: v }), false)} fmt={(v) => `${Math.round(v * 100)}%`} /></FxBox>
          <FxBox S={S} title="Reverb room"><div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{[[1.2, "Room"], [2.6, "Hall"], [4.2, "Cathedral"]].map(([v, l]) => <button key={l} onClick={() => commit((q) => ({ ...q, verbSize: v }), false)} style={sBtn(S, (proj.verbSize || 2.6) === v, null, { height: 26 })}>{l}</button>)}</div></FxBox>
          <div style={{ fontSize: 11.5, color: S.sub, maxWidth: 260, lineHeight: 1.45 }}>A limiter on the master keeps the export from clipping. The delay follows the song tempo (dotted eighth).</div>
        </div>
      )}
    </div>
  );
}
function FxBox({ S, title, children }) { return <div style={{ background: S.bg, borderRadius: 10, padding: "6px 8px 8px", flexShrink: 0 }}><div style={{ fontSize: 10, fontWeight: 900, color: S.sub, letterSpacing: 0.8, marginBottom: 6 }}>{title.toUpperCase()}</div><div style={{ display: "flex", gap: 6 }}>{children}</div></div>; }

function StudioSheet({ S, title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 560, maxHeight: "86vh", overflow: "auto", background: S.panel, color: S.text, borderRadius: "18px 18px 0 0", padding: 16, boxSizing: "border-box", fontFamily: S.font }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}><div style={{ flex: 1, fontWeight: 900, fontSize: 17, fontFamily: S.head || S.font }}>{title}</div><button onClick={onClose} style={sBtn(S, false)} aria-label="Close"><X size={15} noBlob /></button></div>
        {children}
      </div>
    </div>
  );
}
const ModeCard = ({ S, on, onClick, icon, title, text }) => (
  <div onClick={onClick} style={{ background: on ? S.panel2 : S.bg, border: `2px solid ${on ? S.accent : "transparent"}`, borderRadius: 12, padding: 12, marginBottom: 8, cursor: "pointer" }}>
    <div style={{ fontWeight: 800, fontSize: 14 }}>{icon} {title} {on && <span style={{ color: S.accent }}>✓</span>}</div>
    <div style={{ fontSize: 12, color: S.sub, marginTop: 4, lineHeight: 1.45 }}>{text}</div>
  </div>
);
function ClickSheet({ S, proj, commit, onClose, eng, ensureMic }) {
  const [tap, setTap] = useState(null);
  const runTap = async () => {
    const c = eng.ctx(); const spb = 60 / Math.max(60, Math.min(120, proj.bpm)); const t0 = c.currentTime + 0.5; const beats = []; for (let i = 0; i < 12; i++) { beats.push(t0 + i * spb); const b = c.createBuffer(1, 1500, c.sampleRate); b.copyToChannel(clickWave(c.sampleRate, i % 4 === 0).slice(0, 1500), 0); const s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(t0 + i * spb); }
    setTap({ beats, taps: [], spb, end: t0 + 12 * spb });
  };
  const doTap = () => { if (!tap) return; const c = eng.E.ctx; const t = c.currentTime; const near = tap.beats.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a)); const taps = [...tap.taps, t - near]; setTap({ ...tap, taps }); if (taps.length >= 8) { const s = taps.slice(2).sort((a, b) => a - b); const med = s[Math.floor(s.length / 2)]; const total = Math.max(0, med) + 0.02; try { localStorage.setItem(LAT_KEY, JSON.stringify({ total, how: "tap", at: Date.now() })); } catch (e) { } setTap({ ...tap, taps, done: Math.round(total * 1000) }); } };
  return (
    <StudioSheet S={S} title="Metronome" onClose={onClose}>
      <div style={{ fontSize: 12.5, color: S.sub, marginBottom: 10, lineHeight: 1.5 }}>Pick how you want to hear the beat while you record. Anyone can use any mode.</div>
      <ModeCard S={S} on={proj.clickMode === "ear"} onClick={() => commit((q) => ({ ...q, clickMode: "ear" }), false)} icon="🎧" title="Earphones (best)" text="Click plays in your earphones only — the recording stays clean. Wired or Bluetooth: the app records from the phone's own mic either way." />
      <ModeCard S={S} on={proj.clickMode === "silent"} onClick={() => commit((q) => ({ ...q, clickMode: "silent" }), false)} icon="💡" title="Silent (flash + vibrate)" text="No sound at all. The metronome box flashes on every beat (beat 1 in red) and the phone vibrates. You hear a 1-2-3-4 count-in first, then it goes silent. 100% clean recording." />
      <ModeCard S={S} on={proj.clickMode === "speaker"} onClick={() => commit((q) => ({ ...q, clickMode: "speaker" }), false)} icon="🔊" title="Speaker + auto clean-up" text="Hear the click through the speaker. After you record, the app finds each click it played and removes it. Works well — a faint tick may remain." />
      <div style={{ background: S.bg, borderRadius: 12, padding: 12, marginTop: 6 }}>
        <div style={{ fontWeight: 800, fontSize: 13.5 }}>🎧 Bluetooth earphones? Do the 5-second tap test</div>
        <div style={{ fontSize: 12, color: S.sub, margin: "4px 0 8px", lineHeight: 1.45 }}>Bluetooth makes you hear the beat late, so you play late. Tap the big button on every click — the app measures the delay and puts your recordings back on the beat.</div>
        {!tap && <button onClick={runTap} style={sBtn(S, true)}>Start tap test</button>}
        {tap && !tap.done && <button onPointerDown={doTap} style={{ ...sBtn(S, true, S.ok), width: "100%", height: 64, fontSize: 16 }}>TAP on each click ({tap.taps.length}/8)</button>}
        {tap && tap.done != null && <div style={{ fontSize: 13, fontWeight: 700, color: S.ok }}>✓ Delay measured: {tap.done} ms. Recordings will be shifted to match. <span onClick={() => setTap(null)} style={{ textDecoration: "underline", cursor: "pointer", color: S.text }}>Again</span></div>}
      </div>
    </StudioSheet>
  );
}
function StudioSettings({ S, proj, commit, eng, micInfo, setMicInfo, ensureMic, onClose }) {
  const [cal, setCal] = useState(null); let lat = null; try { lat = JSON.parse(localStorage.getItem(LAT_KEY) || "null"); } catch (e) { }
  const [devs, setDevs] = useState((micInfo && micInfo.devs) || []);
  useEffect(() => { navigator.mediaDevices && navigator.mediaDevices.enumerateDevices && navigator.mediaDevices.enumerateDevices().then((d) => setDevs(d.filter((x) => x.kind === "audioinput"))).catch(() => { }); }, []);
  const chooseMic = async (id) => { try { localStorage.setItem("bz-studio-mic", id); } catch (e) { } eng.closeMic(); setMicInfo(null); await ensureMic(); };
  const calibrate = async () => {
    if (!(await ensureMic())) return; setCal({ msg: "Turn the volume up, take earphones out, keep quiet…" });
    const c = eng.E.ctx; const sr = c.sampleRate; const t0 = c.currentTime + 0.6; const times = [];
    const rec = { blocks: [] }; eng.E.rec = rec; eng.E.worklet.port.postMessage("start");
    for (let i = 0; i < 8; i++) { const t = t0 + i * 0.5; times.push(t); const b = c.createBuffer(1, 1500, sr); b.copyToChannel(clickWave(sr, true).slice(0, 1500), 0); const s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(t); }
    await new Promise((r) => setTimeout(r, 4800)); const r = await eng.finishRecord();
    if (!r || !r.blocks.length) { setCal({ msg: "Couldn't hear anything — check the mic." }); return; }
    const t1 = r.blocks[0].t; const all = new Float32Array(r.blocks.reduce((s, b) => s + b.d.length, 0)); let o = 0; r.blocks.forEach((b) => { all.set(b.d, o); o += b.d.length; });
    const lags = []; times.forEach((t) => { const s0 = Math.round((t - t1) * sr); let best = -1; const noise = []; for (let i = Math.max(0, s0 - 2000); i < s0; i++) noise.push(Math.abs(all[i] || 0)); const nl = noise.length ? Math.max(...noise) : 0.01; for (let i = Math.max(0, s0); i < Math.min(all.length, s0 + Math.round(sr * 0.5)); i++) { if (Math.abs(all[i]) > Math.max(0.02, nl * 4)) { best = i; break; } } if (best >= 0) lags.push((best - s0) / sr); });
    if (lags.length < 4) { setCal({ msg: "Too quiet or too noisy. Turn the volume up and try again." }); return; }
    lags.sort((a, b) => a - b); const total = lags[Math.floor(lags.length / 2)];
    try { localStorage.setItem(LAT_KEY, JSON.stringify({ total, how: "loop", at: Date.now() })); } catch (e) { }
    setCal({ msg: `✓ Measured ${Math.round(total * 1000)} ms. Your recordings will line up with the beat.` });
  };
  return (
    <StudioSheet S={S} title="Studio setup" onClose={onClose}>
      <div style={{ fontSize: 11, fontWeight: 900, color: S.sub, letterSpacing: 0.8, margin: "2px 0 6px" }}>LOOK</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 8 }}>
        {STUDIO_THEMES.map((t, i) => (
          <div key={t.id} onClick={() => commit((q) => ({ ...q, theme: i }), false)} style={{ cursor: "pointer", borderRadius: 10, overflow: "hidden", border: `2px solid ${proj.theme === i ? S.accent : "transparent"}` }}>
            <div style={{ height: 46, background: t.bg, backgroundImage: t.spray, display: "flex", flexDirection: "column", gap: 3, padding: 6, boxSizing: "border-box" }}>{t.regions.slice(0, 3).map((c, k) => <div key={k} style={{ height: 8, width: `${60 + k * 12}%`, marginLeft: `${k * 10}%`, background: c, borderRadius: 2 }} />)}</div>
            <div style={{ fontSize: 11, fontWeight: 800, padding: "4px 6px", background: t.panel, color: t.text, fontFamily: t.head || t.font }}>{t.name}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 900, color: S.sub, letterSpacing: 0.8, margin: "16px 0 6px" }}>RECORDING MIC</div>
      <div style={{ fontSize: 12, color: S.sub, lineHeight: 1.45, marginBottom: 6 }}>Earphones are for listening only — the app records from the phone's own mic, even with Bluetooth earphones connected.</div>
      <select aria-label="Recording mic" value={(micInfo && micInfo.id) || ""} onChange={(e) => chooseMic(e.target.value)} style={{ width: "100%", height: 36, borderRadius: 8, border: "none", background: S.btn, color: S.text, fontFamily: S.font, fontWeight: 700 }}>
        <option value="">{micInfo ? `Current: ${micInfo.label}` : "Automatic (phone mic)"}</option>
        {devs.map((d, i) => <option key={d.deviceId || i} value={d.deviceId}>{d.label || `Mic ${i + 1}`}{BT_RE.test(d.label) ? " (Bluetooth — lower quality)" : ""}</option>)}
      </select>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 13.5 }}>Hear yourself while recording</div><div style={{ fontSize: 11.5, color: S.sub }}>With effects. Best on a computer with earphones — phones add a small delay.</div></div>
        <button onClick={() => { const v = !proj.monitor; commit((q) => ({ ...q, monitor: v }), false); eng.monitor(v); }} style={sBtn(S, proj.monitor)}>{proj.monitor ? "On" : "Off"}</button>
      </div>
      <div style={{ fontSize: 11, fontWeight: 900, color: S.sub, letterSpacing: 0.8, margin: "16px 0 6px" }}>TIMING (no-lag recordings)</div>
      <div style={{ fontSize: 12, color: S.sub, lineHeight: 1.45 }}>Every device has a tiny delay between the speaker and the mic. Measure it once and every recording lands exactly on the beat. {lat ? `Current: ${Math.round(lat.total * 1000)} ms (${lat.how === "tap" ? "tap test" : "measured"}).` : "Not measured yet — using an estimate."}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <button onClick={calibrate} style={sBtn(S, true)}>📏 Measure (speaker)</button>
        {lat && <button onClick={() => { try { localStorage.removeItem(LAT_KEY); } catch (e) { } setCal({ msg: "Reset to the estimate." }); }} style={sBtn(S, false)}>Reset</button>}
      </div>
      {cal && <div style={{ fontSize: 12.5, marginTop: 8, fontWeight: 700 }}>{cal.msg}</div>}
      <div style={{ fontSize: 11.5, color: S.sub, marginTop: 6 }}>Using Bluetooth earphones? Use the tap test in the Metronome box instead.</div>
    </StudioSheet>
  );
}
function ExportSheet({ S, proj, eng, onClose }) {
  const { user, toast } = useApp(); const lib = useStemLibrary();
  const [name, setName] = useState(proj.name || "Mix"); const [st, setSt] = useState(null); const [folder, setFolder] = useState(proj.folder || "");
  const native = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
  const render = async () => {
    const len = projEnd(proj); if (len < 0.2) { toast("Nothing to export yet — record or import something first"); return null; }
    setSt({ msg: "Mixing…", p: 0.1 }); const sr = 44100; const total = len + 1.5;
    const C = window.OfflineAudioContext || window.webkitOfflineAudioContext; const oc = new C(2, Math.ceil(total * sr), sr);
    const bufs = {}; for (const t of proj.tracks) for (const c of t.clips) { const d = await IDB.get("clips", c.aid); if (d) { const b = oc.createBuffer(2, d.L.length, d.sr || sr); b.copyToChannel(d.L, 0); b.copyToChannel(d.R || d.L, 1); bufs[c.aid] = b; } }
    const mix = buildMix(oc, proj, bufs); scheduleClips(oc, proj, bufs, mix.strips, 0, 0, []);
    const out = await oc.startRendering(); setSt({ msg: "Making the MP3…", p: 0.4 });
    return await encodeMp3([out.getChannelData(0), out.getChannelData(1)], sr, 192, (q) => setSt({ msg: "Making the MP3…", p: 0.4 + q * 0.6 }));
  };
  const doDownload = async () => { const b = await render(); if (!b) return; downloadBlob(b, safeFile((name || "Mix") + ".mp3")); setSt({ msg: `✓ Saved "${safeFile((name || "Mix") + ".mp3")}"`, p: 1 }); };
  const doShare = async () => {
    if (!folder) { toast("Choose a song folder"); return; } const meta = (lib || []).find((m) => m._id === folder); if (!meta) return;
    if ((meta.extras || []).some((x) => x.name.trim().toLowerCase() === (name || "").trim().toLowerCase())) { setSt({ msg: `"${name}" is already shared in that folder — give it another name.`, p: 0 }); return; }
    const b = await render(); if (!b) return; setSt({ msg: "Sending to the team…", p: 0 });
    try {
      const id = uidS(); const r = await uploadParts(folder, "x_" + id, b, (q) => setSt({ msg: "Sending to the team…", p: q }));
      const fresh = await CLOUD.get(`stems/${folder}`); const extras = [...((fresh && fresh.extras) || []), { id, name: name || "Mix", by: user.uid, byName: user.name, at: Date.now(), ...r }];
      await CLOUD.update(`stems/${folder}`, { extras }); setSt({ msg: `✓ Shared to 📁 ${meta.title}`, p: 1 });
    } catch (e) { setSt({ msg: "Couldn't share: " + (e.message || "error"), p: 0 }); }
  };
  return (
    <StudioSheet S={S} title="Export" onClose={onClose}>
      <div style={{ fontSize: 11, fontWeight: 900, color: S.sub, letterSpacing: 0.8, marginBottom: 6 }}>FILE NAME</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><input value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, minWidth: 0, height: 38, borderRadius: 8, border: "none", background: S.bg, color: S.text, padding: "0 10px", fontFamily: S.font, fontWeight: 700, fontSize: 14 }} /><span style={{ color: S.sub, fontWeight: 700 }}>.mp3</span></div>
      {!native && <button onClick={doDownload} disabled={st && st.p > 0 && st.p < 1} style={{ ...sBtn(S, true), width: "100%", height: 42, marginTop: 10 }}><Download size={16} noBlob /> Download MP3</button>}
      <div style={{ fontSize: 11, fontWeight: 900, color: S.sub, letterSpacing: 0.8, margin: "16px 0 6px" }}>SHARE TO A SONG FOLDER</div>
      <select aria-label="Song folder" value={folder} onChange={(e) => setFolder(e.target.value)} style={{ width: "100%", height: 38, borderRadius: 8, border: "none", background: S.btn, color: S.text, fontFamily: S.font, fontWeight: 700 }}>
        <option value="">Choose a folder…</option>{(lib || []).map((m) => <option key={m._id} value={m._id}>📁 {m.title}</option>)}
      </select>
      <button onClick={doShare} disabled={!folder || (st && st.p > 0 && st.p < 1)} style={{ ...sBtn(S, !!folder, S.ok), width: "100%", height: 42, marginTop: 8, opacity: folder ? 1 : 0.5 }}><Send size={15} noBlob /> Share to the team</button>
      {native && <div style={{ fontSize: 11.5, color: S.sub, marginTop: 8 }}>To save MP3 files on the phone, open beza-youth.web.app in Chrome. Sharing to a folder works right here.</div>}
      {st && <div style={{ marginTop: 10 }}><div style={{ fontSize: 12.5, fontWeight: 700 }}>{st.msg}</div>{st.p > 0 && st.p < 1 && <div style={{ height: 6, background: S.btn, borderRadius: 3, overflow: "hidden", marginTop: 4 }}><div style={{ width: `${st.p * 100}%`, height: "100%", background: S.accent }} /></div>}</div>}
    </StudioSheet>
  );
}
