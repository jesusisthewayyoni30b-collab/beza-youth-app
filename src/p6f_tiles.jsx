/* ================================ TILES GAMES ================================
   Piano-Tiles / Guitar-Hero style: notes fall down lanes, play them when they hit the line.
   Play with: touch, PC/phone keyboard, a MIDI instrument, or your REAL instrument / voice through the mic.
   "Wait for me" mode stops the music until you play the right note — perfect for learning. */
const TL_NOTE = (s) => { const m = s.match(/^([A-G][#b]?)(-?\d)$/); const pc = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 }[m[1]]; return 12 * (+m[2] + 1) + pc; };
const TL_MEL = (arr) => { let t = 0; return arr.map(([n, d]) => { const ev = { t, m: TL_NOTE(n), d }; t += d; return ev; }); };
const TL_SONGS = {
  ode: { title: "Joyful, Joyful (Ode to Joy)", bpm: 96, notes: () => TL_MEL([["E4", 1], ["E4", 1], ["F4", 1], ["G4", 1], ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1], ["C4", 1], ["C4", 1], ["D4", 1], ["E4", 1], ["E4", 1.5], ["D4", 0.5], ["D4", 2], ["E4", 1], ["E4", 1], ["F4", 1], ["G4", 1], ["G4", 1], ["F4", 1], ["E4", 1], ["D4", 1], ["C4", 1], ["C4", 1], ["D4", 1], ["E4", 1], ["D4", 1.5], ["C4", 0.5], ["C4", 2]]) },
  dox: { title: "Doxology (Old 100th)", bpm: 84, notes: () => TL_MEL([["G4", 2], ["G4", 1], ["F#4", 1], ["E4", 1], ["D4", 1], ["G4", 1], ["A4", 1], ["B4", 2], ["B4", 2], ["B4", 1], ["B4", 1], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 1], ["A4", 2], ["G4", 2], ["A4", 1], ["B4", 1], ["A4", 1], ["G4", 1], ["E4", 1], ["F#4", 1], ["G4", 2], ["D5", 2], ["B4", 1], ["G4", 1], ["A4", 1], ["C5", 1], ["B4", 1], ["A4", 1], ["G4", 2]]) },
  grace: { title: "Amazing Grace (first line)", bpm: 76, notes: () => TL_MEL([["D4", 1], ["G4", 2], ["B4", 0.5], ["G4", 0.5], ["B4", 2], ["A4", 1], ["G4", 2], ["E4", 1], ["D4", 2], ["D4", 1], ["G4", 2], ["B4", 0.5], ["G4", 0.5], ["B4", 2], ["A4", 1], ["D5", 3]]) },
};
/* exercises built in the chosen key */
const TL_DRILLS = {
  five: { title: "Five-finger warm-up", bpm: 80, gen: (k) => [0, 2, 4, 5, 7, 5, 4, 2, 0].map((x, i) => ({ t: i, m: 60 + k + x, d: 1 })) },
  scale: { title: "Major scale up & down", bpm: 84, gen: (k) => [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0].map((x, i) => ({ t: i, m: 60 + k + x, d: 1 })) },
  arp: { title: "Arpeggio 1-3-5-8", bpm: 80, gen: (k) => [0, 4, 7, 12, 7, 4, 0, 4, 7, 12, 16, 12, 7, 4, 0].map((x, i) => ({ t: i, m: 60 + k + x, d: 1 })) },
  thirds: { title: "Scale in 3rds", bpm: 76, gen: (k) => [0, 4, 2, 5, 4, 7, 5, 9, 7, 11, 9, 12].map((x, i) => ({ t: i, m: 60 + k + x, d: 1 })) },
  tiz: { title: "Tizita run (1 2 3 5 6)", bpm: 88, gen: (k) => [0, 2, 4, 7, 9, 12, 9, 7, 4, 2, 0, 2, 4, 2, 0].map((x, i) => ({ t: i * 0.5, m: 60 + k + x, d: 0.5 })) },
  roots: { title: "Roots of 1 – 5 – 6m – 4", bpm: 80, gen: (k) => [0, 0, 7, 7, 9, 9, 5, 5, 0, 0, 7, 7, 9, 9, 5, 5].map((x, i) => ({ t: i * 2, m: 48 + k + x - (x > 6 ? 12 : 0), d: 2 })) },
};
const DRUM_LANES = [{ id: "hat", name: "Hi-hat", key: "a", color: "#22E4FF", midi: [42, 44, 46, 26, 22] }, { id: "snare", name: "Snare", key: "s", color: "#FF3EA5", midi: [38, 40, 37, 39] }, { id: "tom", name: "Tom", key: "d", color: "#FFE53D", midi: [41, 43, 45, 47, 48, 50] }, { id: "kick", name: "Kick", key: "f", color: "#C6FF3D", midi: [35, 36] }, { id: "crash", name: "Crash", key: "g", color: "#FF8A00", midi: [49, 57, 51, 52, 55, 59, 53] }];
const STICK_LANES = [{ id: "R", name: "Right", key: "j", color: "#22E4FF", midi: [] }, { id: "L", name: "Left", key: "f", color: "#FF3EA5", midi: [] }];
const drumBar = (bar, spec) => Object.entries(spec).flatMap(([lane, beats]) => beats.map((b) => ({ t: bar * 4 + b, lane, d: 0.25 })));
const TL_DRUMS = {
  quarters: { title: "Kick on every beat", bpm: 72, lanes: DRUM_LANES, gen: () => [0, 1, 2, 3].flatMap((b) => drumBar(b, { kick: [0, 1, 2, 3] })) },
  basic: { title: "Basic worship beat", bpm: 72, lanes: DRUM_LANES, gen: () => [0, 1, 2, 3].flatMap((b) => drumBar(b, { hat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], snare: [1, 3], kick: [0, 2], ...(b === 0 ? { crash: [0] } : {}) })) },
  pop: { title: "Worship pop", bpm: 84, lanes: DRUM_LANES, gen: () => [0, 1, 2, 3].flatMap((b) => drumBar(b, { hat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], snare: [1, 3], kick: [0, 1.5, 2], ...(b === 0 ? { crash: [0] } : {}) })) },
  half: { title: "Half-time build", bpm: 76, lanes: DRUM_LANES, gen: () => [0, 1, 2, 3].flatMap((b) => drumBar(b, { hat: [0, 1, 2, 3], snare: [2], kick: [0, 2.5] })) },
  fill: { title: "Groove + fill on beat 4", bpm: 72, lanes: DRUM_LANES, gen: () => [0, 1, 2, 3].flatMap((b) => (b % 2 ? drumBar(b, { hat: [0, 0.5, 1, 1.5, 2, 2.5], snare: [1, 3, 3.25], tom: [3.5, 3.75], kick: [0, 2] }) : drumBar(b, { hat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], snare: [1, 3], kick: [0, 2], crash: [0] }))) },
  six8: { title: "6/8 ballad", bpm: 60, lanes: DRUM_LANES, gen: () => [0, 1, 2, 3].flatMap((b) => [0, 1, 2, 3, 4, 5].map((e) => ({ t: b * 3 + e * 0.5, lane: "hat", d: 0.25 })).concat([{ t: b * 3, lane: "kick", d: 0.25 }, { t: b * 3 + 1.5, lane: "snare", d: 0.25 }])) },
  singles: { title: "Sticking: singles R L R L", bpm: 80, lanes: STICK_LANES, gen: () => Array.from({ length: 32 }, (_, i) => ({ t: i * 0.5, lane: i % 2 ? "L" : "R", d: 0.25 })) },
  doubles: { title: "Sticking: doubles R R L L", bpm: 72, lanes: STICK_LANES, gen: () => Array.from({ length: 32 }, (_, i) => ({ t: i * 0.5, lane: Math.floor(i / 2) % 2 ? "L" : "R", d: 0.25 })) },
  para: { title: "Sticking: paradiddle RLRR LRLL", bpm: 66, lanes: STICK_LANES, gen: () => Array.from({ length: 32 }, (_, i) => ({ t: i * 0.5, lane: "RLRRLRLL"[i % 8], d: 0.25 })) },
};
const TILE_GAMES = {
  keys: { id: "tiles_keys", title: "Piano Tiles", desc: "Falling notes — play them on your piano (mic / MIDI), the PC keyboard or the screen", inst: "piano", color: "#22E4FF", oct: 0, inputs: ["touch", "keys", "midi", "mic"] },
  acoustic: { id: "tiles_guitar", title: "Guitar Tiles", desc: "Play the falling notes on your real guitar — the mic listens", inst: "acoustic", color: "#FF8A00", oct: -12, inputs: ["mic", "touch", "keys", "midi"] },
  lead: { id: "tiles_lead", title: "Lead Tiles", desc: "Melodies and runs on your guitar — the mic listens", inst: "electric", color: "#FFE53D", oct: 0, inputs: ["mic", "touch", "keys", "midi"] },
  bass: { id: "tiles_bass", title: "Bass Tiles", desc: "Roots and lines on your bass — the mic listens", inst: "bass", color: "#8B5CFF", oct: -24, inputs: ["mic", "touch", "keys", "midi"] },
  singer: { id: "tiles_voice", title: "Pitch Tiles", desc: "Sing the falling notes — the mic checks your pitch", inst: "piano", color: "#FF3EA5", oct: 0, inputs: ["mic", "touch", "keys"], voice: true },
  drums: { id: "tiles_drums", title: "Drum Tiles", desc: "Kick, snare, hats & fills — tap pads, PC keys, an e-kit (MIDI) or your real kit (mic)", inst: "drums", color: "#C6FF3D", oct: 0, inputs: ["touch", "keys", "midi", "mic"], drums: true },
};
const INPUT_LABEL = { touch: "📱 Screen", keys: "⌨️ Keyboard", midi: "🎹 MIDI", mic: "🎤 Real instrument / voice" };
const TL_KEYS = ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"];

function TilesGame({ dept }) {
  const { T, games, setGames, toast, voiceRange, logPractice, settings } = useApp();
  const G = TILE_GAMES[dept] || TILE_GAMES.keys;
  const [phase, setPhase] = useState("menu");
  const [pick, setPick] = useState(G.drums ? "basic" : "five");
  const [key, setKey] = useState(0);
  const [input, setInput] = useState(G.inputs[0]);
  const [wait, setWait] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [click, setClick] = useState(true);
  const [res, setRes] = useState(null);
  const [micLvl, setMicLvl] = useState(0); const [heard, setHeard] = useState(null); const [micErr, setMicErr] = useState("");
  const cv = useRef(null); const S = useRef(null); const raf = useRef(0);
  const lists = G.drums ? Object.entries(TL_DRUMS) : [...Object.entries(TL_DRILLS), ...Object.entries(TL_SONGS)];
  const best = (games.best[G.id] || {});
  /* singers: move the chart into the singer's octave */
  const voiceShift = (ns) => { if (!G.voice) return G.oct; const mid = voiceRange ? (voiceRange.low + voiceRange.high) / 2 : 62; const avg = ns.reduce((a, e) => a + e.m, 0) / ns.length; return Math.round((mid - avg) / 12) * 12; };
  const buildChart = () => {
    if (G.drums) { const D = TL_DRUMS[pick]; return { notes: D.gen().sort((a, b) => a.t - b.t), lanes: D.lanes, bpm: D.bpm, title: D.title }; }
    const isSong = !!TL_SONGS[pick]; const src = isSong ? TL_SONGS[pick] : TL_DRILLS[pick];
    let ns = isSong ? src.notes() : src.gen(key); const sh = voiceShift(ns); ns = ns.map((e) => ({ ...e, m: e.m + sh }));
    const pitches = [...new Set(ns.map((e) => e.m))].sort((a, b) => a - b);
    const lanes = pitches.map((m, i) => ({ id: m, m, name: nn(m), key: TL_KEYS[i] || "", color: [1, 3, 6, 8, 10].includes(m % 12) ? "#8B5CFF" : G.color, black: [1, 3, 6, 8, 10].includes(m % 12) }));
    return { notes: ns.map((e) => ({ ...e, lane: e.m })), lanes, bpm: src.bpm, title: src.title };
  };
  const levelKey = () => `${pick}${G.drums || TL_SONGS[pick] ? "" : "-" + key}`;

  /* ---------- the game loop ---------- */
  const start = async () => {
    const ch = buildChart(); const c = AE.get(); if (c.state !== "running") await c.resume();
    if (G.drums) AE.loadDrums(); else AE.load(G.inst);
    const bpm = ch.bpm * speed; const st = { ...ch, bpm, notes: ch.notes.map((n, i) => ({ ...n, i, hit: null })), beat: -4, last: performance.now(), score: 0, combo: 0, maxCombo: 0, perfect: 0, good: 0, miss: 0, wrong: 0, flash: {}, msg: null, lastClick: -5, done: false };
    S.current = st; setRes(null); setPhase("play");
  };
  const judge = (lane, when) => {
    const st = S.current; if (!st || st.done) return;
    const bpm = st.bpm; const nowB = st.beat - (when || 0) * bpm / 60;
    const anyLane = lane === "*";
    const cand = st.notes.filter((n) => !n.hit && (anyLane || n.lane === lane || (typeof lane === "number" && typeof n.lane === "number" && (input === "mic" || G.voice) && ((n.lane % 12) + 12) % 12 === ((lane % 12) + 12) % 12)));
    let bestN = null, bd = 1e9; cand.forEach((n) => { const d = Math.abs(n.t - nowB); if (d < bd) { bd = d; bestN = n; } });
    const ms = bd * 60000 / bpm;
    st.flash[lane] = performance.now();
    if (bestN && (wait ? bestN.t <= st.beat + 0.6 && bestN === st.notes.find((n) => !n.hit) || ms < 160 : ms < 190)) {
      const q = wait ? (ms < 140 ? "perfect" : "good") : ms < 90 ? "perfect" : "good";
      bestN.hit = q; st[q]++; st.combo++; st.maxCombo = Math.max(st.maxCombo, st.combo); st.score += (q === "perfect" ? 100 : 60) + Math.min(50, st.combo * 2); st.msg = { t: q === "perfect" ? "PERFECT" : "GOOD", c: q === "perfect" ? "#C6FF3D" : "#22E4FF", at: performance.now() };
    } else { st.wrong++; st.combo = 0; st.msg = { t: "✗", c: "#FF3B5C", at: performance.now() }; }
  };
  const press = (lane, playSound = true) => {
    const st = S.current; if (!st) return;
    if (playSound) { if (G.drums) { const L = (st.lanes || []).find((l) => l.id === lane); const id = L ? L.id : lane; if (id === "kick") AE.kick(0, 1); else if (id === "snare" || id === "L") AE.snare(0, 0.8); else if (id === "R" || id === "hat") AE.hat(0, false, 0.6); else if (id === "tom") AE.tom(0, 2, 0.8); else if (id === "crash") AE.hat(0, true, 0.8); } else if (typeof lane === "number") AE.play(G.inst, lane, 0.6, 0, 0.75); }
    judge(lane, 0);
  };
  useEffect(() => {
    if (phase !== "play") return;
    const st = S.current; const cnv = cv.current; if (!cnv) return; const g = cnv.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const draw = () => {
      raf.current = requestAnimationFrame(draw);
      const now = performance.now(); const dt = Math.min(0.1, (now - st.last) / 1000); st.last = now;
      const next = st.notes.find((n) => !n.hit && !n.missed);
      const blocked = wait && next && st.beat >= next.t;
      if (!blocked) {
        const prevB = st.beat; st.beat += dt * st.bpm / 60;
        if (click && Math.floor(st.beat) !== Math.floor(prevB)) { const b = Math.floor(st.beat); AE.click(((b % 4) + 4) % 4 === 0); }
      }
      if (!wait) st.notes.forEach((n) => { if (!n.hit && !n.missed && (st.beat - n.t) * 60000 / st.bpm > 200) { n.missed = true; st.miss++; st.combo = 0; st.msg = { t: "MISS", c: "#FF3B5C", at: now }; } });
      const end = st.notes.length ? st.notes[st.notes.length - 1].t + 2 : 4;
      if (!st.done && (st.notes.every((n) => n.hit || n.missed) || st.beat > end + 2)) { st.done = true; setTimeout(finish, 600); }
      // ---- draw ----
      const W = cnv.clientWidth, H = cnv.clientHeight; if (cnv.width !== W * dpr) { cnv.width = W * dpr; cnv.height = H * dpr; }
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      const lanes = st.lanes; const lw = W / lanes.length; const hitY = H - 26; const ppb = Math.max(70, H / 4.2);
      lanes.forEach((L, i) => { g.fillStyle = i % 2 ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.065)"; g.fillRect(i * lw, 0, lw, H); const f = st.flash[L.id]; if (f && now - f < 160) { g.fillStyle = `rgba(255,255,255,${0.25 * (1 - (now - f) / 160)})`; g.fillRect(i * lw, 0, lw, H); } });
      g.strokeStyle = "rgba(198,255,61,0.9)"; g.lineWidth = 3; g.shadowColor = "#C6FF3D"; g.shadowBlur = 12; g.beginPath(); g.moveTo(0, hitY); g.lineTo(W, hitY); g.stroke(); g.shadowBlur = 0;
      st.notes.forEach((n) => {
        const li = lanes.findIndex((L) => L.id === n.lane); if (li < 0) return;
        const yb = hitY - (n.t - st.beat) * ppb; const h = Math.max(16, n.d * ppb - 6); const y = yb - h;
        if (yb < -10 || y > H + 10) return; if (n.hit && st.beat - n.t > 0.6) return;
        const L = lanes[li]; g.globalAlpha = n.missed ? 0.25 : n.hit ? 0.35 : 1;
        g.fillStyle = n.hit ? "#C6FF3D" : L.color; const x = li * lw + 4, w = lw - 8; const r = 9;
        g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.fill();
        if (!n.hit && h > 22) { g.fillStyle = "#0b0f14"; g.font = `800 ${Math.min(14, lw / 3.2)}px Poppins, sans-serif`; g.textAlign = "center"; g.fillText(G.drums ? L.name : nn(n.m), x + w / 2, yb - 8); }
        g.globalAlpha = 1;
      });
      if (blocked) { g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(0, hitY - 2, W, 26); g.fillStyle = "#fff"; g.font = "800 12px Poppins, sans-serif"; g.textAlign = "center"; g.fillText(`Play ${G.drums ? (lanes.find((L) => L.id === next.lane) || {}).name : nn(next.m)} ▸ waiting for you`, W / 2, hitY + 16); }
      if (st.msg && now - st.msg.at < 600) { g.globalAlpha = 1 - (now - st.msg.at) / 600; g.fillStyle = st.msg.c; g.font = "900 28px Poppins, sans-serif"; g.textAlign = "center"; g.fillText(st.msg.t, W / 2, H * 0.35); g.globalAlpha = 1; }
      if (st.beat < 0) { g.fillStyle = "#fff"; g.font = "900 54px Poppins, sans-serif"; g.textAlign = "center"; g.fillText(String(Math.ceil(-st.beat)), W / 2, H * 0.45); }
      g.fillStyle = "#fff"; g.font = "800 13px Poppins, sans-serif"; g.textAlign = "left"; g.fillText(`${st.score}`, 10, 20); g.textAlign = "right"; g.fillText(st.combo > 1 ? `x${st.combo}` : "", W - 10, 20);
    };
    draw();
    return () => cancelAnimationFrame(raf.current);
  }, [phase]); // eslint-disable-line

  /* ---------- inputs: PC keyboard ---------- */
  useEffect(() => {
    if (phase !== "play" || input !== "keys") return;
    const down = (e) => { if (e.repeat) return; const st = S.current; if (!st) return; const L = st.lanes.find((l) => l.key === e.key.toLowerCase()); if (L) { e.preventDefault(); press(L.id); } };
    window.addEventListener("keydown", down); return () => window.removeEventListener("keydown", down);
  }, [phase, input]); // eslint-disable-line
  /* ---------- inputs: MIDI ---------- */
  useEffect(() => {
    if (phase !== "play" || input !== "midi") return;
    let acc = null; const handler = (ev) => { const [s, n, v] = ev.data; if ((s & 0xf0) !== 0x90 || !v) return; const st = S.current; if (!st) return;
      if (G.drums) { const L = st.lanes.find((l) => l.midi.includes(n)); press(L ? L.id : "*", false); } else press(n, false); };
    if (!navigator.requestMIDIAccess) { setMicErr("This browser has no MIDI support. Use Chrome on a computer or Android."); return; }
    navigator.requestMIDIAccess().then((a) => { acc = a; a.inputs.forEach((i) => { i.onmidimessage = handler; }); a.onstatechange = () => a.inputs.forEach((i) => { i.onmidimessage = handler; }); if (!a.inputs.size) setMicErr("No MIDI device found. Plug in your keyboard / e-kit with USB (OTG on phones) and press Start again."); }).catch(() => setMicErr("MIDI permission was blocked."));
    return () => { if (acc) acc.inputs.forEach((i) => { i.onmidimessage = null; }); };
  }, [phase, input]); // eslint-disable-line
  /* ---------- inputs: microphone (pitch for instruments/voice, onsets for drums) ---------- */
  useEffect(() => {
    if (phase !== "play" || input !== "mic") return;
    let stream = null, rafId = 0, stop = false; setMicErr("");
    (async () => {
      try {
        const c = AE.get(); stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: !G.drums } }); if (stop) return;
        const src = c.createMediaStreamSource(stream); const an = c.createAnalyser(); an.fftSize = G.drums ? 1024 : 4096; src.connect(an); AE.listen(an);
        const buf = new Float32Array(an.fftSize); const smooth = makePitchSmoother(3); let lastNote = null, cnt = 0, quiet = 0, prevR = 0, lastOn = 0, frame = 0;
        const loop = () => {
          rafId = requestAnimationFrame(loop); an.getFloatTimeDomainData(buf);
          let r = 0; for (let k = 0; k < buf.length; k += 2) r += buf[k] * buf[k]; r = Math.sqrt(r / (buf.length / 2)); if ((frame++) % 3 === 0) setMicLvl(Math.min(1, r * 10));
          if (G.drums) { const now = performance.now(); if (r > 0.045 && r > prevR * 2.2 && now - lastOn > 90) { lastOn = now; judge("*", 0.05); } prevR = r * 0.6 + prevR * 0.4; return; }
          if (frame % 2) return;
          const f = detectPitch(buf, c.sampleRate);
          if (f > 38 && f < 1600 && detectPitch.conf > 0.78) { const m = Math.round(smooth(ftom(f, AE.settings.a4))); quiet = 0;
            if (m === lastNote) cnt++; else { lastNote = m; cnt = 1; }
            if (cnt === 3) { setHeard(m); judge(m, 0.08); }
          } else { smooth(null); quiet++; if (quiet > 4) { lastNote = null; cnt = 0; } }
        };
        loop();
      } catch (e) { setMicErr(AE.micErr(e)); }
    })();
    return () => { stop = true; cancelAnimationFrame(rafId); if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, [phase, input]); // eslint-disable-line

  const finish = () => {
    const st = S.current; if (!st) return; const total = st.notes.length;
    const acc = total ? (st.perfect + st.good * 0.7) / (total + st.wrong * 0.5) : 0;
    const stars = acc >= 0.95 ? 3 : acc >= 0.8 ? 2 : acc >= 0.6 ? 1 : 0;
    const r = { score: st.score, acc: Math.round(acc * 100), stars, perfect: st.perfect, good: st.good, miss: st.miss + (total - st.perfect - st.good - st.miss), wrong: st.wrong, combo: st.maxCombo };
    setRes(r); setPhase("result");
    const lk = levelKey(); const prev = best[lk] || { score: 0, stars: 0 };
    setGames((Gs) => ({ ...Gs, best: { ...Gs.best, [G.id]: { ...(Gs.best[G.id] || {}), [lk]: { score: Math.max(prev.score, r.score), stars: Math.max(prev.stars, stars) } } } }));
    logPractice(Math.max(1, Math.round(total * 60 / st.bpm / 60)), G.title);
    if (stars === 3) AE.chord([72, 76, 79, 84], 1.2);
  };

  const curList = S.current && S.current.lanes;
  if (phase === "play") return (
    <div>
      <TopBar title={G.title} sub={`${buildChart().title} · ${INPUT_LABEL[input]}${wait ? " · wait mode" : ""}`} right={<Btn small variant="soft" onClick={() => { S.current.done = true; setPhase("menu"); }}>Quit</Btn>} />
      {micErr && <Card style={{ marginBottom: 8, fontSize: 12.5, borderLeft: `4px solid ${T.bad}` }}>{micErr}</Card>}
      {input === "mic" && <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: 12 }}><span>🎤</span><div style={{ flex: 1, height: 8, borderRadius: 9, background: T.card2, overflow: "hidden" }}><div style={{ width: `${micLvl * 100}%`, height: "100%", background: T.good }} /></div>{!G.drums && <b style={{ minWidth: 40 }}>{heard != null ? nn(heard) : "—"}</b>}</div>}
      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "radial-gradient(120% 90% at 50% 0%, #1a2433, #07090b)", border: `1px solid ${T.border}` }}>
        <canvas ref={cv} style={{ width: "100%", height: "min(56vh, 460px)", display: "block" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${(curList || []).length || 1}, 1fr)`, gap: 4, marginTop: 6 }}>
        {(curList || []).map((L) => <button key={L.id} onPointerDown={(e) => { e.preventDefault(); press(L.id); }} style={{ height: G.drums ? 70 : 64, borderRadius: 12, border: "none", cursor: "pointer", background: L.black ? "#1b1f2a" : G.drums ? L.color : "#f4f6f8", color: L.black ? "#fff" : "#111", fontFamily: FONT, fontWeight: 900, fontSize: 11.5, touchAction: "none", boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.18)" }}>{L.name}{input === "keys" && L.key ? <div style={{ fontSize: 10, opacity: 0.6 }}>[{L.key.toUpperCase()}]</div> : null}</button>)}
      </div>
      <div style={{ fontSize: 11, color: T.sub, textAlign: "center", marginTop: 8 }}>{input === "mic" ? (G.drums ? "Hit your drums — every clean hit counts on the next tile." : G.voice ? "Sing each note when it reaches the green line (any octave counts)." : "Play each note on your instrument when it reaches the line (any octave counts).") : input === "midi" ? "Play on your MIDI instrument." : input === "keys" ? "Use the keys shown on each lane." : "Tap the lane buttons."}</div>
    </div>
  );
  return (
    <div>
      <TopBar title={G.title} sub={G.desc} />
      {phase === "result" && res && <Card tone="hero" style={{ padding: 18, textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 34 }}>{"★".repeat(res.stars)}<span style={{ opacity: 0.3 }}>{"★".repeat(3 - res.stars)}</span></div>
        <div style={{ fontSize: 30, fontWeight: 900 }}>{res.score.toLocaleString()}</div>
        <div style={{ fontSize: 13, opacity: 0.9 }}>{res.acc}% accuracy · best combo x{res.combo}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 8, fontSize: 12.5 }}><span>✅ {res.perfect} perfect</span><span>👍 {res.good} good</span><span>❌ {res.miss} missed</span>{res.wrong > 0 && <span>⚠ {res.wrong} wrong</span>}</div>
        <div style={{ fontSize: 12.5, marginTop: 8, opacity: 0.9 }}>{res.stars === 3 ? "Excellent! Try it faster or without wait mode." : res.stars === 2 ? "Great work — once more for 3 stars!" : res.stars === 1 ? "Good start. Slow it down and use wait mode." : "Keep going: turn on wait mode and slow speed."}</div>
        <Btn full variant="light" icon={Repeat} style={{ marginTop: 12 }} onClick={start}>Play again</Btn>
      </Card>}
      <SectionTitle>1 · Choose {G.drums ? "a groove" : "a song or drill"}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {lists.map(([id, x]) => { const b = best[`${id}${G.drums || TL_SONGS[id] ? "" : "-" + key}`]; return <Card key={id} pad={10} onClick={() => setPick(id)} style={{ cursor: "pointer", border: pick === id ? `2px solid ${G.color}` : undefined }}><div style={{ fontWeight: 800, fontSize: 13, lineHeight: 1.25 }}>{x.title}</div><div style={{ fontSize: 11, color: T.sub, marginTop: 3 }}>{TL_SONGS[id] ? "Song" : G.drums ? `${x.bpm} bpm` : "Drill · your key"}{b ? ` · ${"★".repeat(b.stars)}` : ""}</div></Card>; })}
      </div>
      {!G.drums && TL_DRILLS[pick] && <><div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "12px 2px 6px" }}>KEY</div><KeyChips value={key} onChange={setKey} /></>}
      <SectionTitle>2 · How will you play?</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{G.inputs.map((x) => <Card key={x} pad={10} onClick={() => setInput(x)} style={{ cursor: "pointer", border: input === x ? `2px solid ${G.color}` : undefined, fontWeight: 800, fontSize: 13 }}>{INPUT_LABEL[x]}<div style={{ fontSize: 11, color: T.sub, fontWeight: 500, marginTop: 3 }}>{x === "mic" ? (G.drums ? "Your real drums — the mic hears each hit" : G.voice ? "Sing into the phone" : "Your real instrument near the phone") : x === "midi" ? (G.drums ? "Electronic kit via USB" : "USB / Bluetooth MIDI keyboard") : x === "keys" ? "Computer or phone keyboard" : "Tap the buttons"}</div></Card>)}</div>
      <SectionTitle>3 · Settings</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <Chip active={wait} onClick={() => setWait((w) => !w)}>{wait ? "✓ " : ""}Wait for me (learning mode)</Chip>
        <Chip active={click} onClick={() => setClick((w) => !w)}>{click ? "✓ " : ""}Click</Chip>
        {[[0.6, "Slow"], [0.8, "Steady"], [1, "Normal"], [1.25, "Fast"]].map(([v, l]) => <Chip key={v} active={speed === v} onClick={() => setSpeed(v)}>{l}</Chip>)}
      </div>
      <Btn full variant="accent" icon={Play} style={{ marginTop: 16 }} onClick={start}>Start</Btn>
      <Card tone="soft" style={{ marginTop: 14, fontSize: 12.5, lineHeight: 1.55 }}>
        <b>Why this game?</b> It's real practice: {G.drums ? "you're training time, coordination and reading grooves." : G.voice ? "you're training pitch accuracy and reading notes." : "you're training finger accuracy, reading notes and playing in time."} Start in <b>wait mode</b> (the notes wait for you), then turn it off and play in time. Three stars = ready for rehearsal.
        {input === "mic" && <div style={{ marginTop: 6 }}>🎤 Mic tips: quiet room, phone 30–60 cm from {G.drums ? "the kit" : G.voice ? "your mouth" : "the instrument"}, one note at a time.{G.drums ? " With a real kit, any clean hit counts for the next tile." : ""}</div>}
      </Card>
    </div>
  );
}
