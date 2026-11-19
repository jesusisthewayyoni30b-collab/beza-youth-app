
/* ============================ DEMO SONGS (real samples, rendered offline) ============================ */
const DEMO_SONGS = [
  { id: "opener", name: "Sunday Opener", desc: "4/4 pop worship · G · 84 bpm", key: 7, bpm: 84, feel: "44", prog: [0, 4, 5, 3], drums: "pop", bass: "eighths", keys: "pad", ac: "strum8", pad: false,
    lead: { inst: "electric", base: 67, mel: [[4, 0, 1], [2, 1, 0.5], [0, 1.5, 0.5], [0, 2, 2], [2, 4, 1], [4, 5, 1], [7, 6, 2], [9, 8, 1.5], [7, 9.5, 0.5], [4, 10, 2], [5, 12, 1], [4, 13, 1], [2, 14, 2]] } },
  { id: "ballad", name: "Slow Ballad", desc: "6/8 · D · 60 bpm", key: 2, bpm: 60, feel: "68", prog: [0, 3, 5, 4], drums: "ballad68", bass: "whole", keys: "arp68", ac: null, pad: true,
    lead: { inst: "electric", base: 74, mel: [[4, 0, 3], [2, 3, 3], [0, 6, 6], [7, 12, 3], [4, 15, 3], [2, 18, 6]] } },
  { id: "gospel", name: "Gospel Shuffle", desc: "12/8 shuffle · F · 88 bpm", key: 5, bpm: 88, feel: "shuffle", prog: [0, 3, 0, 4], sev: true, drums: "shuffle", bass: "walk", keys: "comp", ac: null, pad: false,
    lead: { inst: "piano", base: 77, mel: [[7, 0, 1], [10, 1, 0.67], [12, 1.67, 1.33], [10, 3, 1], [7, 4, 2], [5, 6, 1], [3, 7, 0.67], [0, 7.67, 2.33], [0, 10, 1], [3, 11, 1], [5, 12, 2], [7, 14, 2]] } },
  { id: "chik", name: "Chik-chika Praise", desc: "Ethiopian 6/8 · A minor · 132", key: 9, bpm: 132, feel: "68", chords: [[9, "m"], [2, "m"], [4, ""], [9, "m"]], drums: "chik", bass: "chik", keys: "stab", ac: "strum68", pad: false,
    lead: { inst: "electric", base: 69, mel: [[0, 0, 1], [3, 1, 1], [7, 2, 2], [8, 4, 1], [7, 5, 1], [3, 6, 2], [2, 8, 1], [0, 9, 3], [12, 12, 2], [8, 14, 1], [7, 15, 1], [3, 16, 2], [2, 18, 1], [3, 19, 1], [0, 20, 4]] } },
  { id: "acoustic", name: "Acoustic Set", desc: "4/4 · E · 76 bpm · cajón feel", key: 4, bpm: 76, feel: "44", prog: [0, 5, 3, 4], drums: "cajon", bass: "root", keys: "soft", ac: "strum8", pad: false,
    lead: { inst: "piano", base: 76, mel: [[0, 0, 1.5], [-1, 1.5, 0.5], [-3, 2, 2], [-5, 4, 1], [-3, 5, 1], [0, 6, 2], [2, 8, 1.5], [0, 9.5, 0.5], [-1, 10, 2], [-3, 12, 2], [-5, 14, 2]] } },
  { id: "anthem", name: "Big Build Anthem", desc: "4/4 · C · 72 bpm · quiet → huge", key: 0, bpm: 72, feel: "44", prog: [5, 3, 0, 4], drums: "build", bass: "build", keys: "pad", ac: "strum8", acFrom: 4, pad: true, leadFrom: 4,
    lead: { inst: "electric", base: 72, mel: [[4, 0, 2], [7, 2, 2], [9, 4, 1], [7, 5, 1], [4, 6, 2], [2, 8, 2], [4, 10, 1], [2, 11, 1], [0, 12, 4]] } },
];
const SONG_CACHE = {};
async function makeSong(id = "opener") {
  if (SONG_CACHE[id]) return SONG_CACHE[id];
  const S = DEMO_SONGS.find((x) => x.id === id) || DEMO_SONGS[0];
  AE.get(); await Promise.all([AE.load("piano"), AE.load("acoustic"), AE.load("electric"), AE.load("bass"), AE.loadDrums()]);
  const bars = 8, sr = 44100;
  const is68 = S.feel === "68"; const unit = is68 ? 60 / S.bpm / 3 : 60 / S.bpm; const perBar = is68 ? 6 : 4; const barDur = perBar * unit; const dur = bars * barDur + 2.5;
  const chordAt = (bar) => {
    if (S.chords) { const [r, q] = S.chords[bar % S.chords.length]; return { r, iv: q === "m" ? [0, 3, 7] : [0, 4, 7] }; }
    const d = S.prog[bar % S.prog.length]; const r = (S.key + DIATONIC.degs[d]) % 12; const q = DIATONIC.q[d];
    let iv = q === "m" ? [0, 3, 7] : q === "dim" ? [0, 3, 6] : [0, 4, 7]; if (S.sev) iv = [...iv, d === 4 ? 10 : q === "m" ? 10 : 11]; return { r, iv };
  };
  const render = async (fn) => {
    const ctx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(2, Math.ceil(sr * dur), sr);
    const smp = (inst, midi, t, len, vel = 0.7, pan = 0) => {
      const bank = AE.bank(inst); if (!bank) return; let best = bank[0]; for (const b of bank) if (Math.abs(b[0] - midi) < Math.abs(best[0] - midi)) best = b;
      const s = ctx.createBufferSource(); s.buffer = best[1]; s.playbackRate.value = Math.pow(2, (midi - best[0]) / 12);
      const g = ctx.createGain(); g.gain.setValueAtTime(vel, t); g.gain.setValueAtTime(vel, t + len); g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.35);
      const p = ctx.createStereoPanner(); p.pan.value = pan; s.connect(g); g.connect(p); p.connect(ctx.destination); s.start(t); s.stop(t + len + 0.45);
    };
    const drum = (name, t, vel = 0.9, rate = 1, len, pan = 0) => {
      const b = AE.drumBuf(name); if (!b) return; const s = ctx.createBufferSource(); s.buffer = b; s.playbackRate.value = rate; const g = ctx.createGain(); g.gain.value = vel;
      if (len) { g.gain.setValueAtTime(vel, t + len * 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + len); } const p = ctx.createStereoPanner(); p.pan.value = pan; s.connect(g); g.connect(p); p.connect(ctx.destination); s.start(t);
    };
    const synth = (midis, t, len, vel = 0.12) => {
      midis.forEach((m) => [-6, 6].forEach((det, k) => { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = 440 * Math.pow(2, (m - 69) / 12); o.detune.value = det; const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(500, t); f.frequency.linearRampToValueAtTime(1400, t + len * 0.5); f.frequency.linearRampToValueAtTime(700, t + len); const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel / midis.length, t + Math.min(1.2, len * 0.4)); g.gain.setValueAtTime(vel / midis.length, t + len - 0.2); g.gain.linearRampToValueAtTime(0.0001, t + len + 0.6); const p = ctx.createStereoPanner(); p.pan.value = k ? 0.6 : -0.6; o.connect(f); f.connect(g); g.connect(p); p.connect(ctx.destination); o.start(t); o.stop(t + len + 0.7); }));
    };
    fn({ smp, drum, synth });
    return await ctx.startRendering();
  };
  const T0 = (bar, u) => bar * barDur + u * unit;
  const strum = (smp, notes, t, dir, vel, inst = "acoustic") => (dir === "U" ? [...notes].reverse() : notes).forEach((m, i) => smp(inst, m, t + i * 0.012, 0.5, vel * (dir === "U" ? 0.7 : 1), 0.35));
  const shapeNotes = (c) => { const sh = guitarShape(c.r, c.iv[1] === 3 ? "m" : "") || { frets: [-1, 3, 2, 0, 1, 0] }; return sh.frets.map((f, s) => (f < 0 ? null : GUITAR_TUNING[s] + f)).filter((x) => x != null); };
  // DRUMS split into kick / snare / hats & toms
  const drumPart = (part) => ({ drum }) => {
    for (let b = 0; b < bars; b++) {
      const K = (u, v = 1) => part === "kick" && drum("kick", T0(b, u), v); const Sn = (u, v = 0.85, r = 1) => part === "snare" && drum("snare", T0(b, u), v, r);
      const H = (u, v = 0.35, len = 0.1, pan = 0.25) => part === "hats" && drum("hihat", T0(b, u), v, 1.05, len, pan); const Tm = (n, u, v = 0.8, pan = 0) => part === "hats" && drum(n, T0(b, u), v, 1, undefined, pan);
      if (S.drums === "pop") { for (let s = 0; s < 8; s++) H(s / 2, s % 2 ? 0.28 : 0.42); K(0); K(2.5); Sn(1); Sn(3); if (b % 4 === 3) { Tm("tom1", 3, 0.7, -0.3); Tm("tom2", 3.5, 0.75, 0.1); K(3.75, 0.7); } }
      if (S.drums === "ballad68") { for (let u = 0; u < 6; u++) H(u, u % 3 ? 0.16 : 0.26, 0.08); K(0, 0.85); if (b % 2) K(5, 0.5); Sn(3, 0.55, 1.15); if (b === bars - 1) { Tm("tom1", 4, 0.6, -0.3); Tm("tom2", 5, 0.6, 0.2); } }
      if (S.drums === "shuffle") { for (let q = 0; q < 4; q++) { H(q, 0.4); H(q + 2 / 3, 0.25); } K(0); K(2); K(2 + 2 / 3, 0.6); Sn(1); Sn(3); Sn(3 + 2 / 3, 0.25, 1.1); Sn(1 + 2 / 3, 0.2, 1.1); }
      if (S.drums === "chik") { for (let u = 0; u < 6; u++) H(u, [0.45, 0.25, 0.32, 0.45, 0.25, 0.32][u], 0.06); K(0); K(3); Sn(3, 0.7); if (b % 2) Sn(5, 0.45); Tm("tom1", 2, 0.45, -0.35); Tm("tom3", 4, 0.5, 0.35); }
      if (S.drums === "cajon") { for (let s = 0; s < 8; s++) H(s / 2, s % 2 ? 0.1 : 0.16, 0.05, 0.1); K(0, 0.75); K(1.5, 0.55); K(2.5, 0.6); Sn(1, 0.5, 0.82); Sn(3, 0.5, 0.82); Sn(3.75, 0.2, 0.82); }
      if (S.drums === "build") { if (b < 2) { } else if (b < 4) { for (let q = 0; q < 4; q++) K(q, 0.55 + b * 0.05); if (b === 3) for (let s = 0; s < 8; s++) Sn(2 + s / 4, 0.25 + s * 0.08); } else { for (let s = 0; s < 16; s++) H(s / 4, s % 4 === 0 ? 0.45 : s % 2 ? 0.18 : 0.3, 0.06); K(0); K(1.5, 0.8); K(2.5); Sn(1); Sn(3); if (b === bars - 1) { Tm("tom1", 3, 0.8, -0.3); Tm("tom2", 3.25, 0.8, 0); Tm("tom3", 3.5, 0.85, 0.3); } } }
    }
  };
  const stems = {};
  stems["Kick"] = await render(drumPart("kick"));
  stems["Snare"] = await render(drumPart("snare"));
  stems["Hats & Toms"] = await render(drumPart("hats"));
  stems["Bass"] = await render(({ smp }) => {
    for (let b = 0; b < bars; b++) { const c = chordAt(b); const nx = chordAt(b + 1); const m = 28 + ((c.r - 4 + 12) % 12); const B = (u, mm, l, v = 0.85) => smp("bass", mm, T0(b, u), l * unit * 0.9, v);
      if (S.bass === "eighths") [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].forEach((u, k) => B(u, k === 7 ? m + 7 : m, 0.45, k % 2 ? 0.7 : 0.85));
      if (S.bass === "whole") { B(0, m, 3.6); B(3, m + 7, 2.6, 0.6); }
      if (S.bass === "walk") { const nm = 28 + ((nx.r - 4 + 12) % 12); [m, m + 4, m + 7, nm > m ? nm - 1 : nm + 1].forEach((mm, k) => B(k, mm, 0.9)); }
      if (S.bass === "chik") { B(0, m, 1.5); B(2, m + 7, 0.9, 0.7); B(3, m, 1.5); B(5, m + 12, 0.9, 0.7); }
      if (S.bass === "root") { B(0, m, 1.9); B(2, m, 1.4, 0.7); B(3.5, m + 7, 0.45, 0.6); }
      if (S.bass === "build") { if (b < 2) B(0, m, 3.8, 0.6); else if (b < 4) { B(0, m, 1.9, 0.7); B(2, m, 1.9, 0.7); } else [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].forEach((u, k) => B(u, m, 0.45, k % 2 ? 0.7 : 0.85)); }
    }
  });
  stems["Keys"] = await render(({ smp }) => {
    let prev = null;
    for (let b = 0; b < bars; b++) { const c = chordAt(b); const v = voiceLead(prev, c.iv.map((x) => c.r + x)); prev = v;
      if (S.keys === "pad") v.forEach((m) => smp("piano", m, T0(b, 0), barDur * 0.9, b >= 4 && S.drums === "build" ? 0.45 : 0.38, -0.25));
      if (S.keys === "arp68") { const root = 48 + c.r; const seq = [root, v[0], v[1], v[2], v[1], v[0]]; seq.forEach((m, u) => smp("piano", m, T0(b, u), unit * 2.5, u === 0 ? 0.5 : 0.36, -0.2)); }
      if (S.keys === "comp") [[1, 0.5], [1 + 2 / 3, 0.35], [3, 0.5], [3 + 2 / 3, 0.35]].forEach(([u, vel]) => v.forEach((m) => smp("piano", m, T0(b, u), unit * 0.45, vel, -0.15)));
      if (S.keys === "stab") [1, 2, 4, 5].forEach((u) => v.forEach((m) => smp("piano", m + 12, T0(b, u), unit * 0.4, 0.3, -0.3)));
      if (S.keys === "soft") [0, 2].forEach((u) => v.forEach((m) => smp("piano", m, T0(b, u), unit * 1.8, 0.32, -0.2)));
    }
  });
  if (S.ac) stems["Acoustic"] = await render(({ smp }) => {
    for (let b = (S.acFrom || 0); b < bars; b++) { const ns = shapeNotes(chordAt(b));
      if (S.ac === "strum8") [["D", 0], ["D", 1], ["U", 1.5], ["U", 2.5], ["D", 3], ["U", 3.5]].forEach(([d, u]) => strum(smp, ns, T0(b, u), d, 0.42));
      if (S.ac === "strum68") [["D", 0], ["D", 1], ["U", 2], ["D", 3], ["D", 4], ["U", 5]].forEach(([d, u]) => strum(smp, ns, T0(b, u), d, 0.4));
    }
  });
  stems["Lead"] = await render(({ smp }) => {
    const L = S.lead; const span = is68 ? 24 : 16; const reps = bars * perBar / span;
    for (let rep = 0; rep < reps; rep++) { const start = rep * span; if (S.leadFrom && start < S.leadFrom * perBar) continue; L.mel.forEach(([st, t, l]) => smp(L.inst, L.base + st, (start + t) * unit, l * unit * 0.95, L.inst === "piano" ? 0.5 : 0.55, 0.1)); }
  });
  if (S.pad) stems["Pad"] = await render(({ synth }) => { for (let b = 0; b < bars; b++) { const c = chordAt(b); synth(c.iv.map((x) => 60 + ((c.r + x) % 12)), T0(b, 0), barDur, S.drums === "build" && b < 4 ? 0.09 : 0.13); } });
  SONG_CACHE[id] = { stems, bpm: S.bpm * (is68 ? 3 : 1), song: S, loopLen: bars * barDur };
  return SONG_CACHE[id];
}
async function makeDemoBand() { return (await makeSong("opener")).stems; }
async function mixDemo(id = "opener") {
  const { stems } = await makeSong(id); const list = Object.values(stems); const len = Math.max(...list.map((b) => b.length));
  const ctx = AE.get(); const out = ctx.createBuffer(2, len, list[0].sampleRate);
  list.forEach((b) => { for (let ch = 0; ch < 2; ch++) { const o = out.getChannelData(ch); const d = b.getChannelData(Math.min(ch, b.numberOfChannels - 1)); for (let i = 0; i < d.length; i++) o[i] += d[i] * 0.6; } });
  return out;
}

/* ============================ CONSOLE FX ============================ */
const REVERBS = {
  Hall: { decay: 2.6, early: [0.019, 0.031, 0.047, 0.061], bright: 0.35, pre: 25, desc: "Big concert hall — lush, long, smooth" },
  Plate: { decay: 1.8, early: [], bright: 0.75, pre: 5, dense: true, desc: "Classic vocal plate — bright and dense, no 'room'" },
  Room: { decay: 0.7, early: [0.007, 0.011, 0.016, 0.023], bright: 0.45, pre: 3, desc: "Small room — makes things feel live and close" },
  Chamber: { decay: 1.4, early: [0.011, 0.017, 0.026], bright: 0.5, pre: 12, desc: "Echo chamber — warm, natural, great on snare and keys" },
  Cathedral: { decay: 6, early: [0.035, 0.058, 0.083, 0.11], bright: 0.22, pre: 40, desc: "Huge stone church — for pads and big moments" },
  Spring: { decay: 1.6, early: [], bright: 0.6, pre: 0, spring: true, desc: "Guitar-amp spring — boingy, vintage, splashy" },
};
function makeRevIR(c, type, decay) {
  const R = REVERBS[type] || REVERBS.Hall; const len = Math.max(1, Math.floor(c.sampleRate * (decay + 0.1))); const ir = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch); let y = 0;
    for (let i = 0; i < len; i++) {
      const t = i / c.sampleRate; const env = Math.exp((-6.9 * t) / decay); let x = (Math.random() * 2 - 1) * (R.dense ? 1 : 0.85);
      if (R.spring) x *= 0.6 + 0.4 * Math.sin(2 * Math.PI * (180 + 900 * Math.exp(-t * 3)) * t) + (i % Math.floor(c.sampleRate * 0.033) < 30 ? 2.5 : 0);
      const a = R.bright * (1 - 0.7 * Math.min(1, t / decay)) + 0.05; y += a * (x - y); d[i] = y * env;
    }
    R.early.forEach((e, k) => { const i = Math.floor(c.sampleRate * (e + (ch ? 0.003 * (k + 1) : 0))); if (i < len) d[i] += 0.6 / (k + 1); });
  }
  return ir;
}
const DELAYS = {
  Digital: { lp: 16000, wow: 0, desc: "Clean repeats — exact copies" },
  Tape: { lp: 2800, wow: 0.0025, desc: "Warm, darker, slightly wobbly repeats" },
  Analog: { lp: 5000, wow: 0.0008, desc: "Soft repeats that melt away" },
  "Ping-pong": { lp: 9000, wow: 0, pp: true, desc: "Bounces left ↔ right" },
  Slapback: { lp: 6000, wow: 0, slap: true, desc: "One quick echo (~110 ms) — rockabilly / vocal thickness" },
};
const DLY_SYNC = [["1/4", 1], ["1/8.", 0.75], ["1/8", 0.5], ["1/16", 0.25], ["1/4T", 2 / 3]];
const lvl = (pk) => { const v = 20 * Math.log10(pk + 1e-6); return Math.max(0, Math.min(1, (v + 48) / 51)); };

/* ============================ CONSOLE UI PARTS ============================ */
function Knob({ value, min, max, onChange, label, color = "#C6FF3D", def = 0, fmt, size = 34, step = 0.1, big }) {
  const st = useRef(null);
  const p = (value - min) / (max - min); const ang = -135 + p * 270; const r = size / 2 - 3; const cx = size / 2;
  const pt = (a, rr) => [cx + rr * Math.sin((a * Math.PI) / 180), cx - rr * Math.cos((a * Math.PI) / 180)];
  const arc = (a0, a1) => { const [x0, y0] = pt(a0, r); const [x1, y1] = pt(a1, r); return `M${x0},${y0} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1}`; };
  const a0 = min < 0 && max > 0 ? -135 + ((0 - min) / (max - min)) * 270 : -135;
  const down = (e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); st.current = { y: e.clientY, v: value }; };
  const move = (e) => { if (!st.current) return; const nv = Math.max(min, Math.min(max, st.current.v + ((st.current.y - e.clientY) / 140) * (max - min))); onChange(Math.round(nv / step) * step); };
  return (
    <div style={{ textAlign: "center", userSelect: "none", touchAction: "none" }}>
      <svg width={size} height={size} onPointerDown={down} onPointerMove={move} onPointerUp={() => (st.current = null)} onDoubleClick={() => onChange(def)} style={{ cursor: "ns-resize", display: "block", margin: "0 auto" }}>
        <defs><radialGradient id="kg" cx="40%" cy="35%"><stop offset="0%" stopColor="#4a4e57" /><stop offset="100%" stopColor="#15171b" /></radialGradient></defs>
        <path d={arc(-135, 135)} stroke="#2a2d33" strokeWidth={big ? 4 : 3} fill="none" strokeLinecap="round" />
        {Math.abs(ang - a0) > 1 && <path d={ang > a0 ? arc(a0, ang) : arc(ang, a0)} stroke={color} strokeWidth={big ? 4 : 3} fill="none" strokeLinecap="round" style={big ? { filter: `drop-shadow(0 0 4px ${color})` } : undefined} />}
        <circle cx={cx} cy={cx} r={r - 4} fill="url(#kg)" stroke="#000" strokeWidth={1} />
        <line x1={cx} y1={cx} x2={pt(ang, r - 6)[0]} y2={pt(ang, r - 6)[1]} stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      </svg>
      <div style={{ fontSize: big ? 10.5 : 8, fontWeight: 800, color: "#9aa0aa", letterSpacing: 0.5, marginTop: big ? 4 : 1, textTransform: big ? "uppercase" : "none" }}>{label}</div>
      {fmt && <div style={{ fontSize: big ? 12 : 8, fontWeight: big ? 800 : 400, color: big ? color : "#e8eaee", fontFamily: "ui-monospace, Menlo, monospace", marginTop: big ? 2 : 0 }}>{fmt(value)}</div>}
    </div>
  );
}
const FADER_MARKS = [10, 5, 0, -5, -10, -20, -30, -40, -60];
const fPos = (v) => { const m = [[10, 0], [5, 0.1], [0, 0.22], [-5, 0.34], [-10, 0.46], [-20, 0.62], [-30, 0.75], [-40, 0.86], [-60, 1]]; for (let i = 0; i < m.length - 1; i++) { const [a, pa] = m[i], [b, pb] = m[i + 1]; if (v <= a && v >= b) return pa + ((a - v) / (a - b)) * (pb - pa); } return v > 10 ? 0 : 1; };
const fVal = (p) => { const m = [[10, 0], [5, 0.1], [0, 0.22], [-5, 0.34], [-10, 0.46], [-20, 0.62], [-30, 0.75], [-40, 0.86], [-60, 1]]; for (let i = 0; i < m.length - 1; i++) { const [a, pa] = m[i], [b, pb] = m[i + 1]; if (p >= pa && p <= pb) return a + ((p - pa) / (pb - pa)) * (b - a); } return p < 0 ? 10 : -60; };
function Fader({ value, onChange, meterRef, meterRef2, H = 170, cap = "#d9dce2" }) {
  const box = useRef(null); const drag = useRef(false);
  const set = (e) => { const r = box.current.getBoundingClientRect(); const p = Math.max(0, Math.min(1, (e.clientY - r.top - 9) / (r.height - 18))); onChange(Math.round(fVal(p) * 2) / 2); };
  const meter = (ref, k) => <div style={{ width: 5, height: H - 18, marginTop: 9, borderRadius: 2, background: "linear-gradient(to top, #2ee66b 0%, #2ee66b 62%, #ffd23d 80%, #ff3b3b 100%)", position: "relative", overflow: "hidden" }}><div ref={ref} style={{ position: "absolute", left: 0, right: 0, top: 0, height: "100%", background: "#0c0d10" }} />{Array.from({ length: 18 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${(i * 100) / 18}%`, height: 1, background: "#0c0d10" }} />)}</div>;
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center", touchAction: "none", userSelect: "none" }}>
      <div style={{ position: "relative", width: 22, height: H, fontSize: 7, color: "#7d838d", fontFamily: "ui-monospace, Menlo, monospace" }}>{FADER_MARKS.map((m) => <div key={m} style={{ position: "absolute", right: 0, top: 9 + fPos(m) * (H - 18) - 4 }}>{m === -60 ? "∞" : m > 0 ? `+${m}` : m}</div>)}</div>
      <div ref={box} onPointerDown={(e) => { e.preventDefault(); drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); set(e); }} onPointerMove={(e) => drag.current && set(e)} onPointerUp={() => (drag.current = false)} onDoubleClick={() => onChange(0)} style={{ position: "relative", width: 26, height: H, cursor: "ns-resize" }}>
        <div style={{ position: "absolute", left: 11, width: 4, top: 9, bottom: 9, borderRadius: 2, background: "#050608", boxShadow: "inset 0 0 3px #000" }} />
        <div style={{ position: "absolute", left: 1, width: 24, height: 18, top: fPos(value) * (H - 18), borderRadius: 3, background: `linear-gradient(to bottom, ${cap}, #8d9199 45%, #5d6168 55%, ${cap})`, boxShadow: "0 3px 6px rgba(0,0,0,.6)" }}><div style={{ position: "absolute", left: 2, right: 2, top: 8, height: 2, background: "#111" }} /></div>
      </div>
      {meter(meterRef)}{meterRef2 && meter(meterRef2)}
    </div>
  );
}
const SBtn = ({ on, onClick, children, color = "#FFE53D", w = 30 }) => <button onClick={onClick} style={{ width: w, height: 20, borderRadius: 4, border: "1px solid #000", fontSize: 9, fontWeight: 900, whiteSpace: "nowrap", cursor: "pointer", fontFamily: FONT, background: on ? color : "linear-gradient(#3a3d44,#24262b)", color: on ? "#111" : "#c8ccd3", boxShadow: on ? `0 0 8px ${color}` : "inset 0 1px 0 rgba(255,255,255,.08)" }}>{children}</button>;
const STRIP = { width: 84, flex: "1 0 84px", background: "linear-gradient(180deg,#24272d,#16181c 40%,#1b1d22)", borderRight: "1px solid #0a0b0d", borderLeft: "1px solid #30333a", padding: "8px 5px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 };
const Sect = ({ children, label }) => <div style={{ width: "100%", borderTop: "1px solid #0b0c0e", boxShadow: "0 -1px 0 #2d3037", paddingTop: 5 }}>{label && <div style={{ fontSize: 7.5, color: "#6f7580", fontWeight: 900, letterSpacing: 1, textAlign: "center", marginBottom: 3 }}>{label}</div>}{children}</div>;
const dbFmt = (v) => (v <= -60 ? "-∞" : `${v > 0 ? "+" : ""}${v.toFixed(1)}`);

const ROUGH = { Kick: { vol: -2, lo: 3, lmid: -4, comp: 3 }, Snare: { vol: -4, rev: -14, hmid: 2, comp: 3 }, "Hats & Toms": { vol: -9, pan: 0.15, hpf: true, hi: 2 }, Bass: { vol: -4, comp: 4, lmid: -2 }, Keys: { vol: -9, pan: -0.3, rev: -16, hpf: true }, Acoustic: { vol: -8, pan: 0.35, hpf: true, lmid: -3, hi: 2 }, Lead: { vol: -6, rev: -12, dly: -14, hmid: 1.5 }, Pad: { vol: -12, rev: -8, hpf: true } };
const blankCh = (name, buffer, i, rough) => ({ id: Date.now() + i + Math.random(), name, buffer, color: STEM_COLORS[i % STEM_COLORS.length], trim: 0, hpf: false, lo: 0, lmid: 0, hmid: 0, hi: 0, comp: 0, rev: -60, dly: -60, pan: 0, vol: -6, mute: false, solo: false, ...(rough ? ROUGH[name] || {} : {}) });

function Mixer({ embedded }) {
  const { T, toast, web } = useApp();
  const [tracks, setTracks] = useState([]);
  const [song, setSong] = useState(null);
  const [bpm, setBpm] = useState(84);
  const [play, setPlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [master, setMaster] = useState(0); const [busComp, setBusComp] = useState(2); const [limit, setLimit] = useState(true);
  const [rv, setRv] = useState({ type: "Hall", decay: 2.6, pre: 25, tone: 8, ret: -4 });
  const [dl, setDl] = useState({ type: "Tape", sync: "1/8.", fb: 35, tone: 6, ret: -6 });
  const [pos, setPos] = useState(0);
  const fileRef = useRef(null); const graph = useRef(null); const meters = useRef({});
  const db = (v) => (v <= -60 ? 0 : Math.pow(10, v / 20));
  const load = async (id) => { setPlay(false); setLoading(true); try { const r = await makeSong(id); setSong(r.song); setBpm(r.bpm / (r.song.feel === "68" ? 3 : 1) * (r.song.feel === "68" ? 1 : 1)); setTracks(Object.entries(r.stems).map(([n, b], i) => blankCh(n, b, i, true))); } finally { setLoading(false); } };
  const onFiles = async (e) => {
    const files = Array.from(e.target.files || []); if (!files.length) return; setLoading(true); setPlay(false);
    const out = []; for (const f of files.slice(0, 16)) { try { out.push(blankCh(f.name.replace(/\.[^.]+$/, ""), await AE.decodeFile(f), (song ? 0 : tracks.length) + out.length)); } catch (er) { toast(`Couldn't read ${f.name}`); } }
    setTracks((t) => (song ? out : [...t, ...out])); setSong(null); setLoading(false); e.target.value = "";
  };
  const beatSec = song && song.feel === "68" ? 60 / song.bpm / 3 * 3 / 2 : 60 / bpm; // 6/8: dotted-quarter pulse → use 8th*... keep musical: quarter = 2 eighths
  const dlyTime = DELAYS[dl.type].slap ? 0.11 : Math.min(1.9, (song && song.feel === "68" ? (60 / song.bpm / 3) * 2 : 60 / bpm) * (DLY_SYNC.find((x) => x[0] === dl.sync) || DLY_SYNC[0])[1]);
  useEffect(() => {
    if (!play || !tracks.length) return;
    const c = AE.get(); const t0 = c.currentTime + 0.12;
    const mBus = c.createGain(); const bus = c.createDynamicsCompressor(); bus.attack.value = 0.02; bus.release.value = 0.2; bus.knee.value = 8;
    const lim = c.createDynamicsCompressor(); lim.attack.value = 0.001; lim.release.value = 0.08; lim.knee.value = 0; const mF = c.createGain();
    const split = c.createChannelSplitter(2); const anL = c.createAnalyser(), anR = c.createAnalyser(); anL.fftSize = anR.fftSize = 1024;
    mBus.connect(bus); bus.connect(lim); lim.connect(mF); mF.connect(AE.out()); mF.connect(split); split.connect(anL, 0); split.connect(anR, 1);
    // FX1 reverb
    const rIn = c.createGain(); const rPre = c.createDelay(0.3); const conv = c.createConvolver(); conv.buffer = makeRevIR(c, rv.type, rv.decay); const rTone = c.createBiquadFilter(); rTone.type = "lowpass"; const rHp = c.createBiquadFilter(); rHp.type = "highpass"; rHp.frequency.value = 180; const rRet = c.createGain(); const rAn = c.createAnalyser(); rAn.fftSize = 512;
    rIn.connect(rPre); rPre.connect(conv); conv.connect(rHp); rHp.connect(rTone); rTone.connect(rRet); rRet.connect(rAn); rRet.connect(mBus);
    // FX2 delay (stereo network, all types are parameter changes)
    const dIn = c.createGain(); const dInR = c.createGain(); const dL = c.createDelay(2), dR = c.createDelay(2); const lpL = c.createBiquadFilter(), lpR = c.createBiquadFilter(); lpL.type = lpR.type = "lowpass";
    const fLL = c.createGain(), fLR = c.createGain(), fRR = c.createGain(), fRL = c.createGain(); const merge = c.createChannelMerger(2); const dRet = c.createGain(); const dAn = c.createAnalyser(); dAn.fftSize = 512;
    const lfo = c.createOscillator(); lfo.frequency.value = 0.6; const lfoG = c.createGain(); lfo.connect(lfoG); lfoG.connect(dL.delayTime); lfoG.connect(dR.delayTime); lfo.start();
    dIn.connect(dL); dIn.connect(dInR); dInR.connect(dR); dL.connect(lpL); dR.connect(lpR); lpL.connect(fLL); fLL.connect(dL); lpL.connect(fLR); fLR.connect(dR); lpR.connect(fRR); fRR.connect(dR); lpR.connect(fRL); fRL.connect(dL);
    lpL.connect(merge, 0, 0); lpR.connect(merge, 0, 1); merge.connect(dRet); dRet.connect(dAn); dRet.connect(mBus);
    const len = Math.max(...tracks.map((t) => t.buffer.duration)); const loopLen = song ? SONG_CACHE[song.id].loopLen : len;
    const ch = {};
    tracks.forEach((t) => {
      const s = c.createBufferSource(); s.buffer = t.buffer; s.loop = true; s.loopEnd = Math.min(loopLen, t.buffer.duration);
      const trim = c.createGain(); const hp = c.createBiquadFilter(); hp.type = "highpass"; const lo = c.createBiquadFilter(); lo.type = "lowshelf"; lo.frequency.value = 100;
      const lm = c.createBiquadFilter(); lm.type = "peaking"; lm.frequency.value = 400; lm.Q.value = 1; const hm = c.createBiquadFilter(); hm.type = "peaking"; hm.frequency.value = 2500; hm.Q.value = 1; const hi = c.createBiquadFilter(); hi.type = "highshelf"; hi.frequency.value = 9000;
      const comp = c.createDynamicsCompressor(); comp.knee.value = 6; comp.attack.value = 0.006; comp.release.value = 0.15; const fader = c.createGain(); const pan = c.createStereoPanner(); const an = c.createAnalyser(); an.fftSize = 512; const sR = c.createGain(), sD = c.createGain();
      s.connect(trim); trim.connect(hp); hp.connect(lo); lo.connect(lm); lm.connect(hm); hm.connect(hi); hi.connect(comp); comp.connect(fader); fader.connect(pan); pan.connect(an); pan.connect(mBus); fader.connect(sR); sR.connect(rIn); fader.connect(sD); sD.connect(dIn);
      s.start(t0); ch[t.id] = { s, trim, hp, lo, lm, hm, hi, comp, fader, pan, an, sR, sD };
    });
    graph.current = { ch, mBus, bus, lim, mF, conv, rPre, rTone, rRet, dL, dR, lpL, lpR, fLL, fLR, fRR, fRL, dInR, dRet, lfoG, rAn, dAn, anL, anR, irKey: rv.type + rv.decay, c };
    let raf; const buf = new Float32Array(1024); const pk = (an) => { an.getFloatTimeDomainData(buf); let p = 0; const n = an.fftSize; for (let i = 0; i < n; i++) p = Math.max(p, Math.abs(buf[i])); return p; };
    const setM = (k, v) => { const el = meters.current[k]; if (el) el.style.height = `${(1 - v) * 100}%`; };
    let lastPos = 0;
    const loop = () => { raf = requestAnimationFrame(loop);
      Object.entries(ch).forEach(([id, n]) => { setM(id, lvl(pk(n.an))); const gr = meters.current[id + "gr"]; if (gr) gr.style.width = `${Math.min(100, -n.comp.reduction * 6)}%`; });
      setM("L", lvl(pk(anL))); setM("R", lvl(pk(anR))); setM("rev", lvl(pk(rAn))); setM("dly", lvl(pk(dAn)));
      const p = ((c.currentTime - t0) % loopLen) / loopLen; if (Math.abs(p - lastPos) > 0.01) { lastPos = p; setPos(p); }
    };
    loop();
    return () => { cancelAnimationFrame(raf); Object.values(ch).forEach((n) => { try { n.s.stop(); } catch (e) { } }); try { lfo.stop(); } catch (e) { } setTimeout(() => { try { mBus.disconnect(); mF.disconnect(); rRet.disconnect(); dRet.disconnect(); } catch (e) { } }, 300); graph.current = null; setPos(0); };
  }, [play, tracks.length, song]); // eslint-disable-line
  useEffect(() => {
    const g = graph.current; if (!g) return; const anySolo = tracks.some((t) => t.solo);
    tracks.forEach((t) => { const n = g.ch[t.id]; if (!n) return; const audible = !t.mute && (!anySolo || t.solo);
      n.trim.gain.value = db(t.trim); n.hp.frequency.value = t.hpf ? 90 : 10; n.lo.gain.value = t.lo; n.lm.gain.value = t.lmid; n.hm.gain.value = t.hmid; n.hi.gain.value = t.hi;
      n.comp.threshold.value = -t.comp * 4; n.comp.ratio.value = 1 + t.comp * 0.7; n.fader.gain.value = audible ? db(t.vol) : 0; n.pan.pan.value = t.pan; n.sR.gain.value = audible ? db(t.rev) : 0; n.sD.gain.value = audible ? db(t.dly) : 0; });
    g.bus.threshold.value = -busComp * 2.5; g.bus.ratio.value = 1 + busComp * 0.35; g.lim.threshold.value = limit ? -1.5 : 0; g.lim.ratio.value = limit ? 20 : 1; g.mF.gain.value = db(master);
    const key = rv.type + rv.decay; if (g.irKey !== key) { g.conv.buffer = makeRevIR(g.c, rv.type, rv.decay); g.irKey = key; }
    g.rPre.delayTime.value = rv.pre / 1000; g.rTone.frequency.value = 1200 + rv.tone * 1400; g.rRet.gain.value = db(rv.ret);
    const D = DELAYS[dl.type]; const fb = D.slap ? 0.08 : dl.fb / 100; g.dL.delayTime.value = dlyTime; g.dR.delayTime.value = D.pp ? dlyTime : dlyTime * 1.01;
    g.lpL.frequency.value = g.lpR.frequency.value = Math.min(D.lp, 1500 + dl.tone * 1500); g.lfoG.gain.value = D.wow;
    if (D.pp) { g.dInR.gain.value = 0; g.fLL.gain.value = 0; g.fRR.gain.value = 0; g.fLR.gain.value = fb; g.fRL.gain.value = fb; } else { g.dInR.gain.value = 1; g.fLL.gain.value = fb; g.fRR.gain.value = fb; g.fLR.gain.value = 0; g.fRL.gain.value = 0; }
    g.dRet.gain.value = db(dl.ret);
  });
  const upd = (id, k, v) => setTracks((ts) => ts.map((t) => (t.id === id ? { ...t, [k]: v } : t)));
  const zero = () => setTracks((ts) => ts.map((t, i) => ({ ...blankCh(t.name, t.buffer, i, false), id: t.id, color: t.color, vol: -60 })));
  const rough = () => setTracks((ts) => ts.map((t, i) => ({ ...blankCh(t.name, t.buffer, i, true), id: t.id, color: t.color })));
  const knobC = (c) => c;
  return (
    <div>
      <ToolBar embedded={embedded} title="Mixing Console" sub={`${DEMO_SONGS.length} demo songs · real FX · or upload your stems`} />
      <div style={{ fontSize: 11, fontWeight: 800, color: T.sub, margin: "2px 2px 6px", letterSpacing: 1 }}>DEMO SONGS</div>
      <Scroller>{DEMO_SONGS.map((s) => <Chip key={s.id} active={song && song.id === s.id} onClick={() => load(s.id)}>{s.name}</Chip>)}<Chip onClick={() => fileRef.current.click()}>⬆ Upload stems</Chip></Scroller>
      <input ref={fileRef} type="file" accept="audio/*" multiple hidden onChange={onFiles} />
      {loading && <Card tone="soft" style={{ marginTop: 10, fontSize: 13 }}>Rendering the band from real instrument samples…</Card>}
      {!tracks.length && !loading && (
        <Card tone="soft" style={{ marginTop: 12, fontSize: 13, lineHeight: 1.6 }}>
          Pick a demo song — each one is a different style (pop worship, 6/8 ballad, gospel shuffle, Ethiopian chik-chika, acoustic set, big build) split into real multitrack stems: kick, snare, hats & toms, bass, keys, acoustic, lead and pad. Or upload your own rehearsal stems (MP3/WAV).
          <div style={{ marginTop: 8 }}><b>Mixing order:</b> start with every fader down → kick & bass → snare & hats → keys/guitars → lead → reverb & delay sends → master.</div>
        </Card>
      )}
      {tracks.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, padding: 10, borderRadius: 16, background: "linear-gradient(#2a2d33,#17191d)", border: "1px solid #000", color: "#e8eaee" }}>
            <button onClick={() => setPlay((p) => !p)} style={{ width: 46, height: 40, borderRadius: 10, border: "1px solid #000", background: play ? "#ff4d4d" : "#2ee66b", color: "#111", cursor: "pointer", display: "grid", placeItems: "center" }}>{play ? <Square size={18} noBlob /> : <Play size={18} noBlob />}</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song ? song.name : "Your stems"}</div>
              <div style={{ fontSize: 10, color: "#9aa0aa" }}>{song ? song.desc : `${tracks.length} tracks`}</div>
              <div style={{ height: 4, borderRadius: 3, background: "#0a0b0d", marginTop: 5, overflow: "hidden" }}><div style={{ width: `${pos * 100}%`, height: "100%", background: "#22E4FF" }} /></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><SBtn w={74} onClick={rough}>ROUGH MIX</SBtn><SBtn w={74} onClick={zero}>ALL DOWN</SBtn></div>
          </div>
          {!song && <div style={{ marginTop: 8 }}><Slider label="Song tempo (for delay sync)" value={bpm} min={50} max={180} onChange={setBpm} fmt={(v) => `${v} bpm`} /></div>}
          <div className="bz-noscroll" style={{ display: "flex", overflowX: "auto", marginTop: 10, borderRadius: 14, border: "1px solid #000", background: "#0e0f12", boxShadow: "inset 0 2px 10px rgba(0,0,0,.6)" }}>
            {tracks.map((t, i) => (
              <div key={t.id} style={STRIP}>
                <div style={{ width: "100%", padding: "3px 2px", borderRadius: 4, background: t.color, color: "#111", fontSize: 9.5, fontWeight: 900, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{i + 1} · {t.name}</div>
                <Sect label="INPUT"><div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}><Knob value={t.trim} min={-18} max={18} label="GAIN" color="#e8eaee" fmt={dbFmt} onChange={(v) => upd(t.id, "trim", v)} size={30} /><SBtn on={t.hpf} onClick={() => upd(t.id, "hpf", !t.hpf)} color="#22E4FF" w={28}>HPF</SBtn></div></Sect>
                <Sect label="EQ">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <Knob value={t.hi} min={-15} max={15} label="HI" color="#FF3EA5" onChange={(v) => upd(t.id, "hi", v)} size={30} />
                    <Knob value={t.hmid} min={-15} max={15} label="HI-MID" color="#FF8A00" onChange={(v) => upd(t.id, "hmid", v)} size={30} />
                    <Knob value={t.lmid} min={-15} max={15} label="LO-MID" color="#22E4FF" onChange={(v) => upd(t.id, "lmid", v)} size={30} />
                    <Knob value={t.lo} min={-15} max={15} label="LOW" color="#8B5CFF" onChange={(v) => upd(t.id, "lo", v)} size={30} />
                  </div>
                </Sect>
                <Sect label="COMP"><Knob value={t.comp} min={0} max={10} def={0} label="AMOUNT" color="#FFE53D" onChange={(v) => upd(t.id, "comp", v)} size={30} /><div style={{ height: 4, margin: "3px 6px 0", background: "#0a0b0d", borderRadius: 2, overflow: "hidden", display: "flex", justifyContent: "flex-end" }}><div ref={(el) => (meters.current[t.id + "gr"] = el)} style={{ width: "0%", background: "#FFE53D" }} /></div></Sect>
                <Sect label="AUX SENDS"><div style={{ display: "flex", justifyContent: "space-around" }}><Knob value={t.rev} min={-60} max={6} def={-60} label="REV" color="#7CFFB2" onChange={(v) => upd(t.id, "rev", v)} size={30} /><Knob value={t.dly} min={-60} max={6} def={-60} label="DLY" color="#22E4FF" onChange={(v) => upd(t.id, "dly", v)} size={30} /></div></Sect>
                <Sect><Knob value={t.pan} min={-1} max={1} label="PAN" color="#e8eaee" fmt={(v) => (Math.abs(v) < 0.03 ? "C" : v < 0 ? `L${Math.round(-v * 100)}` : `R${Math.round(v * 100)}`)} onChange={(v) => upd(t.id, "pan", v)} size={30} /></Sect>
                <div style={{ display: "flex", gap: 4 }}><SBtn on={t.mute} onClick={() => upd(t.id, "mute", !t.mute)} color="#ff4d4d">M</SBtn><SBtn on={t.solo} onClick={() => upd(t.id, "solo", !t.solo)}>S</SBtn></div>
                <Fader value={t.vol} onChange={(v) => upd(t.id, "vol", v)} meterRef={(el) => (meters.current[t.id] = el)} cap={t.color} />
                <div style={{ fontSize: 9, fontFamily: "ui-monospace, Menlo, monospace", color: "#e8eaee", background: "#050608", padding: "2px 6px", borderRadius: 3 }}>{dbFmt(t.vol)}</div>
              </div>
            ))}
            {/* FX1 REVERB RETURN */}
            <div style={{ ...STRIP, width: 104, flex: "1.2 0 104px", background: "linear-gradient(180deg,#1f2a26,#131816 40%,#171c1a)" }}>
              <div style={{ width: "100%", padding: "3px 2px", borderRadius: 4, background: "#7CFFB2", color: "#111", fontSize: 9.5, fontWeight: 900, textAlign: "center" }}>FX1 · REVERB</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, width: "100%" }}>{Object.keys(REVERBS).map((k) => <button key={k} onClick={() => setRv((r) => ({ ...r, type: k, decay: REVERBS[k].decay, pre: REVERBS[k].pre }))} style={{ padding: "4px 0", borderRadius: 4, border: "1px solid #000", fontSize: 8.5, fontWeight: 800, cursor: "pointer", fontFamily: FONT, background: rv.type === k ? "#7CFFB2" : "#26292f", color: rv.type === k ? "#111" : "#c8ccd3" }}>{k}</button>)}</div>
              <div style={{ fontSize: 8, color: "#9aa0aa", textAlign: "center", lineHeight: 1.25, minHeight: 30 }}>{REVERBS[rv.type].desc}</div>
              <Sect><div style={{ display: "flex", justifyContent: "space-around" }}><Knob value={rv.decay} min={0.3} max={8} def={REVERBS[rv.type].decay} label="DECAY" color="#7CFFB2" fmt={(v) => `${v.toFixed(1)}s`} onChange={(v) => setRv((r) => ({ ...r, decay: v }))} size={30} /><Knob value={rv.pre} min={0} max={150} def={REVERBS[rv.type].pre} label="PRE-DLY" color="#7CFFB2" fmt={(v) => `${Math.round(v)}ms`} onChange={(v) => setRv((r) => ({ ...r, pre: v }))} size={30} /></div></Sect>
              <Knob value={rv.tone} min={0} max={10} def={8} label="TONE" color="#7CFFB2" fmt={(v) => (v < 4 ? "dark" : v > 7 ? "bright" : "warm")} onChange={(v) => setRv((r) => ({ ...r, tone: v }))} size={30} />
              <Fader value={rv.ret} onChange={(v) => setRv((r) => ({ ...r, ret: v }))} meterRef={(el) => (meters.current.rev = el)} cap="#7CFFB2" H={150} />
              <div style={{ fontSize: 9, fontFamily: "ui-monospace, Menlo, monospace", color: "#e8eaee", background: "#050608", padding: "2px 6px", borderRadius: 3 }}>{dbFmt(rv.ret)}</div>
            </div>
            {/* FX2 DELAY RETURN */}
            <div style={{ ...STRIP, width: 104, flex: "1.2 0 104px", background: "linear-gradient(180deg,#1f2630,#13171c 40%,#171b21)" }}>
              <div style={{ width: "100%", padding: "3px 2px", borderRadius: 4, background: "#22E4FF", color: "#111", fontSize: 9.5, fontWeight: 900, textAlign: "center" }}>FX2 · DELAY</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, width: "100%" }}>{Object.keys(DELAYS).map((k) => <button key={k} onClick={() => setDl((d) => ({ ...d, type: k }))} style={{ padding: "4px 0", borderRadius: 4, border: "1px solid #000", fontSize: 8.5, fontWeight: 800, cursor: "pointer", fontFamily: FONT, background: dl.type === k ? "#22E4FF" : "#26292f", color: dl.type === k ? "#111" : "#c8ccd3" }}>{k}</button>)}</div>
              <div style={{ fontSize: 8, color: "#9aa0aa", textAlign: "center", lineHeight: 1.25, minHeight: 30 }}>{DELAYS[dl.type].desc}</div>
              {!DELAYS[dl.type].slap && <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>{DLY_SYNC.map(([n]) => <button key={n} onClick={() => setDl((d) => ({ ...d, sync: n }))} style={{ padding: "2px 5px", borderRadius: 4, border: "1px solid #000", fontSize: 8.5, fontWeight: 800, cursor: "pointer", fontFamily: FONT, background: dl.sync === n ? "#22E4FF" : "#26292f", color: dl.sync === n ? "#111" : "#c8ccd3" }}>{n}</button>)}</div>}
              <div style={{ fontSize: 9, fontFamily: "ui-monospace, Menlo, monospace", color: "#22E4FF" }}>{Math.round(dlyTime * 1000)} ms</div>
              <Sect><div style={{ display: "flex", justifyContent: "space-around" }}><Knob value={dl.fb} min={0} max={85} def={35} label="FEEDBK" color="#22E4FF" fmt={(v) => `${Math.round(v)}%`} onChange={(v) => setDl((d) => ({ ...d, fb: v }))} size={30} /><Knob value={dl.tone} min={0} max={10} def={6} label="TONE" color="#22E4FF" onChange={(v) => setDl((d) => ({ ...d, tone: v }))} size={30} /></div></Sect>
              <Fader value={dl.ret} onChange={(v) => setDl((d) => ({ ...d, ret: v }))} meterRef={(el) => (meters.current.dly = el)} cap="#22E4FF" H={150} />
              <div style={{ fontSize: 9, fontFamily: "ui-monospace, Menlo, monospace", color: "#e8eaee", background: "#050608", padding: "2px 6px", borderRadius: 3 }}>{dbFmt(dl.ret)}</div>
            </div>
            {/* MASTER */}
            <div style={{ ...STRIP, width: 104, flex: "1.2 0 104px", background: "linear-gradient(180deg,#30272a,#191416 40%,#1e191b)" }}>
              <div style={{ width: "100%", padding: "3px 2px", borderRadius: 4, background: "#ff4d4d", color: "#111", fontSize: 9.5, fontWeight: 900, textAlign: "center" }}>MASTER L/R</div>
              <Sect label="BUS COMP"><Knob value={busComp} min={0} max={10} def={2} label="GLUE" color="#ff8a8a" onChange={setBusComp} size={34} /></Sect>
              <Sect label="LIMITER"><div style={{ display: "flex", justifyContent: "center" }}><SBtn on={limit} onClick={() => setLimit((l) => !l)} color="#ff4d4d" w={50}>{limit ? "ON" : "OFF"}</SBtn></div></Sect>
              <div style={{ flex: 1 }} />
              <Fader value={master} onChange={setMaster} meterRef={(el) => (meters.current.L = el)} meterRef2={(el) => (meters.current.R = el)} cap="#ff4d4d" H={200} />
              <div style={{ fontSize: 9, fontFamily: "ui-monospace, Menlo, monospace", color: "#e8eaee", background: "#050608", padding: "2px 6px", borderRadius: 3 }}>{dbFmt(master)}</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: T.sub, textAlign: "center", marginTop: 6 }}>Swipe the console ↔ · drag knobs up/down · double-tap to reset</div>
          <Card tone="soft" style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.6 }}>
            <b>Try this:</b> tap <b>ALL DOWN</b>, then build the mix: kick to about −6, bass under it, snare & hats, then keys and guitars panned apart, lead on top. Send the lead and snare to <b>FX1</b> (try Plate vs Hall vs Cathedral) and the lead to <b>FX2</b> (Tape, dotted 8th). Watch the master meters — keep peaks out of the red.
          </Card>
        </>
      )}
      {!embedded && <MarkComplete id="mixer" label="Mixing practice" mins={10} />}
    </div>
  );
}
