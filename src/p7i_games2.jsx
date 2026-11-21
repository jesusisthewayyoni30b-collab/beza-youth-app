/* ============================ GAMES PER TEAM ============================
   Every team gets ONLY games that train what they actually do on Saturday.
   Singers: voice games (mic). Musicians: their instrument. Sound team: engineer's ears. */
const GAME_HOW = {
  degree: ["You hear a short 'home' sound (the key), then one note. Tap its number 1–7.", "Knowing the number of every note in the key — the language of the band."],
  interval: ["Two notes play. Tap the distance between them (M3 = major 3rd, P5 = perfect 5th…).", "Hearing distances — for melodies, solos and finding harmony."],
  quality: ["A chord plays. Is it major, minor, 7th, sus…?", "Recognising chord colours instantly."],
  numbers: ["Questions about the number system: which chord is the 5 in G? What number is this chord?", "Thinking in numbers so you can play any song in any key."],
  builder: ["Play the scale shown on the piano, up or down, before time runs out.", "Finger knowledge of every scale and key."],
  echo: ["Listen to a short melody, then play it back on the keys.", "Playing by ear — hearing a line and finding it on your instrument."],
  rhythm: ["Listen to a rhythm, then tap it back in time.", "Steady time and reading rhythms."],
  bpm: ["A groove plays. Pick the tempo (beats per minute).", "Feeling tempo — counting songs in right, setting delay times."],
  fret: ["A string and fret are shown. Tap the note name.", "Knowing every note on the neck, not just shapes."],
  fretb: ["A bass string and fret are shown. Tap the note name.", "Knowing where every root is on your bass."],
  meter: ["A groove plays. Is it 4/4, 3/4, 6/8 or an odd meter?", "Feeling the time signature of a song right away."],
  freq: ["A sound plays with one EQ band boosted (or cut). Which frequency was it?", "The #1 engineer skill: naming frequencies by ear for EQ and feedback."],
  sd_level: ["Two sounds play: A then B. Was B louder, softer or the same — and by how much?", "Hearing small level changes when you ride faders."],
  sd_pan: ["A sound plays. Is it panned left, centre or right?", "Stereo placement — where each instrument sits in the mix."],
  sd_verb: ["A clap plays. Is it dry, a small room, a hall or a long cathedral?", "Choosing the right reverb for each song."],
  sd_comp: ["A drum loop plays twice. Was the second one compressed?", "Hearing compression so you don't squash the mix."],
  sd_ring: ["A ringing tone plays (like feedback starting). Which frequency is ringing?", "Ringing out the monitors and killing feedback fast on Saturday."],
  sd_mix: ["A band loop plays with one instrument too loud. Which one?", "Spotting the problem in a mix in seconds."],
};
/* ---------- sound-team games (same quiz engine as the other games) ---------- */
const sdTone = (c, dest, kind, when = 0, dur = 1.2, f = 220) => {
  const t = c.currentTime + when;
  if (kind === "noise") { const s = c.createBufferSource(); s.buffer = AE.pink ? AE.pink() : AE.noise(); s.loop = true; s.connect(dest); s.start(t); s.stop(t + dur); return; }
  const o = c.createOscillator(); o.type = kind; o.frequency.value = f; const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.4, t + 0.02); g.gain.setValueAtTime(0.4, t + dur - 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
};
const sdLoop = (c, dest, bars = 1, bpm = 100, vol = {}) => { const b = 60 / bpm; for (let i = 0; i < bars * 8; i++) { const w = i * b / 2; AE.hit("hihat", w, (vol.hat || 1) * 0.45, dest); if (i % 4 === 0) AE.hit("kick", w, (vol.kick || 1), dest); if (i % 4 === 2) AE.hit("snare", w, (vol.snare || 1) * 0.85, dest); } };
GAMES.push(
  { id: "sd_level", title: "Level Ears", desc: "Louder, softer or the same?", icon: Sliders, color: "#7CFFB2", roles: ["sound"],
    gen: (L) => { const [t] = TS(L); const steps = [[6, 0], [6, 3, 0], [3, 2, 0], [2, 1, 0], [1, 0.5, 0]][t]; const d = pick(steps) * pick([-1, 1]); const lab = d === 0 ? "Same" : `${d > 0 ? "Louder" : "Softer"} ${Math.abs(d)} dB`;
      const opts = [...new Set(["Same", ...steps.filter((x) => x).flatMap((x) => [`Louder ${x} dB`, `Softer ${x} dB`])])];
      return { kind: "choice", sig: lab + rand(9), prompt: "A, then B. How did B change?", options: opts, answer: lab, play: () => { const c = AE.get(); const f = 180 + rand(300); const g1 = c.createGain(); g1.gain.value = 0.5; g1.connect(AE.out()); const g2 = c.createGain(); g2.gain.value = 0.5 * Math.pow(10, d / 20); g2.connect(AE.out()); sdTone(c, g1, "sawtooth", 0, 0.9, f); sdTone(c, g2, "sawtooth", 1.1, 0.9, f); } }; } },
  { id: "sd_pan", title: "Pan Spotter", desc: "Left, centre or right?", icon: Headphones, color: "#22E4FF", roles: ["sound"],
    gen: (L) => { const [t] = TS(L); const pos = t === 0 ? [["Left", -1], ["Centre", 0], ["Right", 1]] : t === 1 ? [["Left", -1], ["Half left", -0.5], ["Centre", 0], ["Half right", 0.5], ["Right", 1]] : [["Left", -1], ["Half left", -0.5], ["Slight left", -0.25], ["Centre", 0], ["Slight right", 0.25], ["Half right", 0.5], ["Right", 1]];
      const [nm, v] = pick(pos); return { kind: "choice", sig: nm, prompt: "🎧 Use headphones. Where is the sound?", options: pos.map((x) => x[0]), answer: nm, play: () => { const c = AE.get(); const p = c.createStereoPanner(); p.pan.value = v; p.connect(AE.out()); sdLoop(c, p, 1, 110); } }; } },
  { id: "sd_verb", title: "Reverb Detective", desc: "Dry, room, hall or cathedral?", icon: Waves, color: "#B57BFF", roles: ["sound"],
    gen: (L) => { const kinds = [["Dry", 0], ["Small room", 0.5], ["Hall", 2], ["Cathedral", 5]]; const [nm, sec] = pick(kinds);
      return { kind: "choice", sig: nm + rand(5), prompt: "How much space is on this snare?", options: kinds.map((x) => x[0]), answer: nm, play: () => { const c = AE.get(); const dry = c.createGain(); dry.connect(AE.out());
        if (sec > 0) { const len = Math.floor(c.sampleRate * sec); const ir = c.createBuffer(2, len, c.sampleRate); for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); } const cv = c.createConvolver(); cv.buffer = ir; const wet = c.createGain(); wet.gain.value = 0.7; dry.connect(cv); cv.connect(wet); wet.connect(AE.out()); }
        [0, 0.9, 1.8].forEach((w) => AE.hit("snare", w, 0.9, dry)); } }; } },
  { id: "sd_comp", title: "Squash or Not?", desc: "Was the second loop compressed?", icon: Target, color: "#FF8A00", roles: ["sound"],
    gen: (L) => { const [t] = TS(L); const yes = Math.random() < 0.5; const ratio = [20, 12, 8, 5, 3][t];
      return { kind: "choice", sig: String(yes) + rand(9), prompt: "Loop A is raw. Is loop B compressed?", options: ["Yes, compressed", "No, the same"], answer: yes ? "Yes, compressed" : "No, the same", play: () => { const c = AE.get(); const a = c.createGain(); a.connect(AE.out()); sdLoop(c, a, 1, 100, { snare: 1.3, kick: 1.2 }); const b = c.createGain(); if (yes) { const cp = c.createDynamicsCompressor(); cp.threshold.value = -30; cp.ratio.value = ratio; cp.attack.value = 0.003; cp.release.value = 0.12; const mk = c.createGain(); mk.gain.value = 2.2; b.connect(cp); cp.connect(mk); mk.connect(AE.out()); } else b.connect(AE.out());
        setTimeout(() => sdLoop(c, b, 1, 100, { snare: 1.3, kick: 1.2 }), 2600); } }; } },
  { id: "sd_ring", title: "Feedback Hunter", desc: "Which frequency is ringing?", icon: Radio, color: "#FF3B5C", roles: ["sound"],
    gen: (L) => { const [t] = TS(L); const pool = t === 0 ? [250, 1000, 4000] : t === 1 ? [125, 250, 500, 1000, 2000, 4000] : [160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000]; const f = pick(pool); const lab = (x) => (x >= 1000 ? `${x / 1000}k` : String(x)) + " Hz";
      return { kind: "choice", sig: String(f), prompt: "This is how feedback starts. Which frequency is ringing?", options: pool.map(lab), answer: lab(f), play: () => { const c = AE.get(); const g = c.createGain(); g.gain.value = 0.25; g.connect(AE.out()); sdTone(c, g, "sine", 0, 1.8, f); const n = c.createGain(); n.gain.value = 0.05; n.connect(AE.out()); sdTone(c, n, "noise", 0, 1.8); } }; } },
  { id: "sd_mix", title: "Mix Spotter", desc: "Which instrument is too loud?", icon: Sliders, color: "#FFE53D", roles: ["sound"],
    gen: (L) => { const [t] = TS(L); const parts = t === 0 ? ["Kick", "Snare", "Hi-hat"] : ["Kick", "Snare", "Hi-hat", "Bass", "Keys"]; const hot = pick(parts); const boost = [3, 2.4, 2, 1.7, 1.5][t];
      return { kind: "choice", sig: hot + rand(9), prompt: "One part of the mix is too loud. Which one?", options: parts, answer: hot, play: () => { const c = AE.get(); const v = (n) => (n === hot ? boost : 1); sdLoop(c, AE.out(), 2, 96, { kick: v("Kick"), snare: v("Snare"), hat: v("Hi-hat") }); const b = 60 / 96;
        if (parts.includes("Bass")) [0, 2, 4, 6].forEach((beat, k) => AE.play("bass", [36, 36, 41, 43][k], b * 1.8, beat * b, 0.55 * v("Bass")));
        if (parts.includes("Keys")) [[0, [60, 64, 67]], [4, [65, 69, 72]]].forEach(([beat, ch]) => ch.forEach((m) => AE.play("piano", m, b * 3.6, beat * b, 0.42 * v("Keys")))); } }; } },
  { id: "fretb", title: "Bass Fretboard Finder", desc: "Which note is at this string and fret?", icon: Activity, color: "#8B5CFF", roles: ["bass"],
    gen: (L) => { const [t, g5] = TS(L); const STR = [["E", 28], ["A", 33], ["D", 38], ["G", 43]]; const strings = t === 0 ? STR.slice(0, g5 < 3 ? 1 : 2) : STR; const maxF = [5, 7, 9, 12, 12][t];
      const [sn, open] = pick(strings); const f = rand(maxF + 1); const m = open + f; const ans = NOTE_NAMES[m % 12]; const opts = t < 2 ? ["C", "D", "E", "F", "G", "A", "B"] : NOTE_NAMES.slice();
      return { kind: "choice", sig: sn + f, prompt: `${sn} string, fret ${f} — which note?`, options: opts.includes(ans) ? opts : [...opts, ans], answer: ans, play: () => AE.play("bass", m, 1.2, 0, 0.9) }; } },
);
/* who plays what — no overlaps that don't fit the team */
const GAME_SETS = {
  singer: [],
  keys: ["degree", "quality", "numbers", "builder", "echo"],
  acoustic: ["fret", "quality", "numbers", "rhythm"],
  lead: ["fret", "interval", "echo", "degree"],
  bass: ["fretb", "degree", "bpm", "meter"],
  drums: ["rhythm", "bpm", "meter"],
  sound: ["freq", "sd_ring", "sd_mix", "sd_level", "sd_pan", "sd_verb", "sd_comp"],
};
const gamesForRole = (rid) => (GAME_SETS[rid] || []).map((id) => GAMES.find((g) => g.id === id)).filter(Boolean);

/* ---------- SINGERS: voice-only games (the mic listens) ---------- */
const VOICE_GAMES = [
  { id: "vg_match", title: "Pitch Match", emoji: "🎯", color: "#FF3EA5", desc: "Hear a note, sing it back in tune.", how: "A note plays. Sing it (any octave) and hold it steady until the bar turns green. Faster and more accurate = more points.", trains: "Singing in tune — the most important singing skill." },
  { id: "vg_interval", title: "Interval Singer", emoji: "🪜", color: "#8B5CFF", desc: "Hear a note, sing the interval above it.", how: "A starting note plays. Sing the note the game asks for (for example 'a 3rd above'). Hold it until it turns green.", trains: "Finding harmony notes on your own." },
  { id: "vg_echo", title: "Echo Singer", emoji: "🔁", color: "#22E4FF", desc: "Hear a short melody, sing it back.", how: "Listen to the melody (3–6 notes). Then sing it back one note at a time — each note turns green when you hit it.", trains: "Learning melodies by ear — how you learn new songs." },
  { id: "vg_harmony", title: "Harmony Builder", emoji: "🎶", color: "#C6FF3D", desc: "Hear the melody note, sing the harmony above it.", how: "A melody note plays inside a chord. Sing the harmony note a 3rd above it (the next note of the chord). Hold until green.", trains: "Worship-team harmony: singing a 3rd above the lead." },
];
const VG_IV = [["a 2nd above", 2], ["a major 3rd above", 4], ["a minor 3rd above", 3], ["a 4th above", 5], ["a 5th above", 7], ["a 6th above", 9], ["an octave above", 12], ["a 3rd below", -4], ["a 5th below", -7]];
function VoiceGame({ id }) {
  const { T, games, setGames, voiceRange, logPractice } = useApp();
  const G = VOICE_GAMES.find((x) => x.id === id) || VOICE_GAMES[0];
  const best = games.best[G.id] || {};
  const [lvl, setLvl] = useState(0); const [phase, setPhase] = useState("menu");
  const [round, setRound] = useState(0); const [q, setQ] = useState(null); const [step, setStep] = useState(0);
  const [cur, setCur] = useState(null); const [score, setScore] = useState(0); const [hits, setHits] = useState(0); const [left, setLeft] = useState(10); const [err, setErr] = useState("");
  const ROUNDS = 8; const mid = voiceRange ? Math.round((voiceRange.low + voiceRange.high) / 2) : 62;
  const st = useRef({}); st.current = { q, step, phase };
  const newQ = (r) => {
    const key = (mid + 120 - 7 + rand(5)) % 12; const base = mid - ((mid - key) % 12 + 12) % 12; const sc = [0, 2, 4, 5, 7, 9, 11];
    let nq;
    if (id === "vg_match") { const pool = lvl === 0 ? [0, 2, 4, 7] : lvl === 1 ? sc : Array.from({ length: 12 }, (_, i) => i); const m = base + pick(pool) - (lvl === 2 && Math.random() < 0.4 ? 12 : 0); nq = { targets: [m], cue: [m], prompt: "Sing this note" }; }
    else if (id === "vg_interval") { const pool = lvl === 0 ? VG_IV.slice(1, 2).concat(VG_IV.slice(4, 5), VG_IV.slice(6, 7)) : lvl === 1 ? VG_IV.slice(0, 7) : VG_IV; const [nm, iv] = pick(pool); const r = mid - Math.round(iv / 2); nq = { targets: [r + iv], cue: [r], prompt: `Sing ${nm} the note you hear`, hint: r + iv }; }
    else if (id === "vg_echo") { const len = [3, 4, 6][lvl]; let d = 0; const ds = [0]; while (ds.length < len) { d = Math.max(0, Math.min(6, d + pick(lvl === 0 ? [-1, 1] : [-2, -1, 1, 2]))); ds.push(d); } const ms = ds.map((x) => base + sc[x]); nq = { targets: ms, cue: ms, prompt: `Sing back the ${len}-note melody` }; }
    else if (id === "vg_scale") { const ns = (lvl === 0 ? [0, 2, 4, 5, 7] : lvl === 1 ? [0, 2, 4, 5, 7, 9, 11, 12] : [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0]).map((x) => base + x); nq = { targets: ns, cue: [base], chord: [base - 12, base - 8, base - 5], prompt: "Sing up the scale: Do-Re-Mi… one note at a time", hint: null }; }
    else if (id === "vg_chord") { const d = pick([0, 3, 4, 5]); const r = base + sc[d]; const third = r + (DIATONIC.q[d] === "m" ? 3 : 4); const which = pick(lvl === 0 ? [["root", r], ["5th", r + 7]] : [["root", r], ["3rd", third], ["5th", r + 7]]); nq = { targets: [which[1]], cue: [], chord: [r - 12, third - 12, r - 5], prompt: `Sing the ${which[0]} of this chord`, hint: which[1] }; }
    else if (id === "vg_hold") { const m = base + pick([0, 2, 4, 7]); nq = { targets: [m], cue: [m], prompt: `Sing and HOLD for ${[3, 5, 8][lvl]} seconds`, hold: [3, 5, 8][lvl] * 20 }; }
    else { const d = pick(lvl === 0 ? [0, 3, 4] : [0, 1, 3, 4, 5]); const mel = base + sc[d]; const har = base + sc[(d + 2) % 7] + (d + 2 >= 7 ? 12 : 0); nq = { targets: [har], cue: [mel], chord: [base + sc[d] - 12, base + sc[(d + 2) % 7] - 12 + (d + 2 >= 7 ? 12 : 0), base + sc[(d + 4) % 7] - 12 + (d + 4 >= 7 ? 12 : 0)], prompt: "Sing the harmony a 3rd ABOVE the melody note", hint: har }; }
    setQ(nq); setStep(0); setLeft(id === "vg_echo" || id === "vg_scale" ? 20 : id === "vg_hold" ? 16 : 10); setRound(r); setTimeout(() => cue(nq), 350);
  };
  const cue = (nq) => { const x = nq || q; if (!x) return; if (x.chord) AE.chord(x.chord, 1.6, 0, "piano"); x.cue.forEach((m, i) => AE.play("piano", m, 0.9, i * 0.7, 0.85)); };
  const start = () => { setScore(0); setHits(0); setPhase("play"); newQ(0); };
  const next = (ok) => { if (ok) { setHits((h) => h + 1); AE.chord([84, 88, 91], 0.25); } if (round + 1 >= ROUNDS) { setPhase("done"); } else newQ(round + 1); };
  useEffect(() => { if (phase !== "play") return; const t = setInterval(() => setLeft((l) => { if (l <= 1) { next(false); return 10; } return l - 1; }), 1000); return () => clearInterval(t); }, [phase, round]); // eslint-disable-line
  useEffect(() => {
    if (phase !== "play") return; let stream = null, raf = 0, stop = false; setErr("");
    (async () => { try {
      const c = AE.get(); stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: true } }); if (stop) return;
      const src = c.createMediaStreamSource(stream); const an = c.createAnalyser(); an.fftSize = 4096; src.connect(an); AE.listen(an); const buf = new Float32Array(4096); const sm = makePitchSmoother(5); let fr = 0, hold = 0;
      const loop = () => { raf = requestAnimationFrame(loop); if ((fr++) % 3) return; an.getFloatTimeDomainData(buf); const f = detectPitch(buf, c.sampleRate); const S = st.current; if (!S.q) return;
        if (f > 60 && f < 1400 && detectPitch.conf > 0.8) { const m = sm(ftom(f, AE.settings.a4)); const tgt = S.q.targets[S.step]; let d = (m - tgt) % 12; if (d > 6) d -= 12; if (d < -6) d += 12; const cents = Math.round(d * 100); setCur(cents);
          if (Math.abs(cents) <= 35) { hold++; if (hold >= (S.q.hold || 8)) { hold = 0; setScore((s) => s + 100 + Math.max(0, 50 - Math.abs(cents))); if (S.step + 1 < S.q.targets.length) { setStep(S.step + 1); AE.play("piano", 96, 0.1, 0, 0.3); } else { st.current.q = null; next(true); } } } else hold = 0;
        } else { sm(null); setCur(null); hold = 0; } };
      loop(); } catch (e) { setErr(AE.micErr(e)); } })();
    return () => { stop = true; cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, [phase]); // eslint-disable-line
  useEffect(() => { if (phase !== "done") return; const acc = hits / ROUNDS; const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc >= 0.5 ? 1 : 0; const k = String(lvl); const prev = best[k] || { score: 0, stars: 0 };
    setGames((Gs) => ({ ...Gs, best: { ...Gs.best, [G.id]: { ...(Gs.best[G.id] || {}), [k]: { score: Math.max(prev.score, score), stars: Math.max(prev.stars, stars) } } } })); logPractice(3, G.title); }, [phase]); // eslint-disable-line
  const LV = ["Easy", "Medium", "Hard"];
  if (phase === "play" && q) return (
    <div>
      <TopBar title={`${G.emoji} ${G.title}`} sub={`${LV[lvl]} · round ${round + 1} of ${ROUNDS}`} right={<Btn small variant="soft" onClick={() => setPhase("menu")}>Quit</Btn>} />
      <Card tone="hero" style={{ textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1, opacity: 0.85 }}>{score} PTS · {left}s</div>
        <div style={{ fontSize: 20, fontWeight: 900, margin: "8px 0" }}>{q.prompt}</div>
        {q.targets.length > 1 && <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "8px 0" }}>{q.targets.map((_, k) => <div key={k} style={{ width: 26, height: 26, borderRadius: 99, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 12, background: k < step ? "#C6FF3D" : k === step ? "#fff" : "rgba(255,255,255,0.2)", color: "#111" }}>{k + 1}</div>)}</div>}
        <div style={{ position: "relative", height: 18, borderRadius: 9, background: "rgba(255,255,255,0.18)", margin: "14px 0 6px" }}>
          <div style={{ position: "absolute", left: "33%", width: "34%", top: 0, bottom: 0, background: "rgba(198,255,61,0.35)", borderRadius: 9 }} />
          {cur != null && <div style={{ position: "absolute", top: -4, width: 8, height: 26, borderRadius: 4, left: `calc(${50 + Math.max(-50, Math.min(50, cur))}% - 4px)`, background: Math.abs(cur) <= 35 ? "#C6FF3D" : "#FF6B6B", transition: "left .08s" }} />}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, minHeight: 20 }}>{cur == null ? "🎤 Listening… sing now" : Math.abs(cur) <= 35 ? "In tune — hold it!" : cur > 0 ? "Too high ↓" : "Too low ↑"}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn full variant="light" icon={Repeat} onClick={() => cue()}>Hear again</Btn>
          {q.hint != null && <Btn variant="light" onClick={() => AE.play("piano", q.hint, 1.2, 0, 0.7)}>Hint</Btn>}
          <Btn variant="light" icon={SkipForward} onClick={() => next(false)} />
        </div>
      </Card>
      {err && <Card style={{ marginTop: 10, fontSize: 12.5, borderLeft: `4px solid ${T.bad}` }}>{err}</Card>}
      <Card tone="soft" style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.5 }}>Any octave counts — men and women can sing the same game. Use earphones for the best results so the mic only hears you.</Card>
    </div>
  );
  return (
    <div>
      <TopBar title={`${G.emoji} ${G.title}`} sub={G.desc} />
      {phase === "done" && <Card tone="hero" style={{ textAlign: "center", padding: 20, marginBottom: 12 }}>
        <div style={{ fontSize: 34 }}>{"⭐".repeat(hits / ROUNDS >= 0.9 ? 3 : hits / ROUNDS >= 0.7 ? 2 : hits / ROUNDS >= 0.5 ? 1 : 0) || "—"}</div>
        <div style={{ fontSize: 28, fontWeight: 900 }}>{score} pts</div><div style={{ fontSize: 13, opacity: 0.9 }}>{hits}/{ROUNDS} notes sung in tune</div>
        <Btn full variant="light" icon={Repeat} style={{ marginTop: 12 }} onClick={start}>Play again</Btn>
      </Card>}
      <Card style={{ fontSize: 13.5, lineHeight: 1.55 }}><b>How to play · </b>{G.how}<div style={{ marginTop: 8 }}><b>What it trains · </b>{G.trains}</div></Card>
      <SectionTitle>Level</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>{LV.map((l, k) => <Card key={l} pad={12} onClick={() => setLvl(k)} style={{ textAlign: "center", cursor: "pointer", border: lvl === k ? `2px solid ${G.color}` : undefined }}><div style={{ fontWeight: 900 }}>{l}</div><div style={{ fontSize: 12, marginTop: 2 }}>{best[String(k)] ? "⭐".repeat(best[String(k)].stars) || "·" : "—"}</div></Card>)}</div>
      <Btn full variant="accent" icon={Mic} style={{ marginTop: 14 }} onClick={start}>Start singing</Btn>
      {voiceRange && <div style={{ fontSize: 11.5, color: T.sub, textAlign: "center", marginTop: 8 }}>Notes are placed in your range ({voiceRange.label}).</div>}
    </div>
  );
}

/* ============================ MORE GAMES (round 2) ============================ */
const g2Key = () => pick([0, 2, 4, 5, 7, 9, 10]);
const g2Tri = (k, d) => { const r = (k + DIATONIC.degs[d]) % 12; const q = DIATONIC.q[d]; return { r, q, iv: q === "m" ? [0, 3, 7] : q === "dim" ? [0, 3, 6] : [0, 4, 7] }; };
GAMES.push(
  /* ---- KEYS ---- */
  { id: "kb_chord", title: "Chord Builder", desc: "Tap all the notes of the chord", icon: PianoIcon, color: "#22E4FF", roles: ["keys"],
    gen: (L) => { const [t] = TS(L); const pool = [["", "m"], ["", "m", "dim", "sus4"], ["", "m", "7", "maj7", "m7"], ["", "m", "7", "maj7", "m7", "sus2", "add9", "dim"], CHORD_TYPES.slice(0, 14).map((c) => c.id)][t]; const q = pick(pool); const ct = CHORD_TYPES.find((c) => c.id === q) || CHORD_TYPES[0]; const r = rand(12);
      return { kind: "set", sig: r + q, prompt: `Build ${NOTE_NAMES[r]}${q} — tap every note, then Submit`, answerSet: [...new Set(ct.iv.map((x) => (r + x) % 12))], play: null, reveal: () => AE.chord(voiceChord(60 + r - (r > 6 ? 12 : 0), ct.iv, 0, "close"), 1.4) }; } },
  { id: "kb_inv", title: "Inversion Spotter", desc: "Root position, 1st or 2nd inversion?", icon: Layers, color: "#B57BFF", roles: ["keys"],
    gen: (L) => { const [t] = TS(L); const r = rand(12); const q = t < 2 ? "" : pick(["", "m"]); const ct = CHORD_TYPES.find((c) => c.id === q); const inv = rand(3); const v = voiceChord(55 + r - (r > 6 ? 12 : 0), ct.iv, inv, "close"); const names = ["Root position", "1st inversion", "2nd inversion"];
      return { kind: "choice", sig: r + "" + inv, prompt: t === 0 ? `${NOTE_NAMES[r]}${q} — which inversion? (listen to the LOWEST note)` : "Which inversion is this chord in?", options: names, answer: names[inv], play: () => { AE.tone(v[0], 1.2, 0, 0.8); AE.chord(v, 1.6); } }; } },
  { id: "kb_bass", title: "Slash Chord Ears", desc: "Is the bass note the root, the 3rd or the 5th?", icon: Music, color: "#C6FF3D", roles: ["keys", "bass"],
    gen: (L) => { const r = rand(12); const which = pick([["Root (normal)", 0], ["3rd in the bass (1/3)", 4], ["5th in the bass (1/5)", 7]]); const b = 36 + ((r + which[1]) % 12);
      return { kind: "choice", sig: r + which[0], prompt: `The chord is ${NOTE_NAMES[r]}. What's in the bass?`, options: ["Root (normal)", "3rd in the bass (1/3)", "5th in the bass (1/5)"], answer: which[0], play: () => { AE.tone(b, 1.6, 0, 0.9); AE.chord([60 + r, 64 + r, 67 + r].map((m) => m - (r > 6 ? 12 : 0)), 1.6); } }; } },
  /* ---- ACOUSTIC ---- */
  { id: "ac_strum", title: "Strum Spotter", desc: "Which strumming pattern is this?", icon: Activity, color: "#FF8A00", roles: ["acoustic"],
    gen: (L) => { const [t] = TS(L); const P = [["All downs (D D D D)", "D.D.D.D."], ["Down-up 8ths (DUDUDUDU)", "DUDUDUDU"], ["Folk (D DU UDU)", "D.DU.UDU"], ["Push (D DU UD U)", "D.DU.UD."]].slice(0, t === 0 ? 2 : t === 1 ? 3 : 4); const [nm, pat] = pick(P);
      return { kind: "choice", sig: nm, prompt: "Listen — which pattern is being strummed?", options: P.map((x) => x[0]), answer: nm, play: () => { const b = 60 / 84 / 2; const ch = [43, 47, 50, 55, 59, 67]; for (let bar = 0; bar < 2; bar++) [...pat].forEach((c, i) => { if (c === ".") return; const w = (bar * 8 + i) * b; AE.strum(c === "D" ? ch : ch.slice(2), c === "D" ? "down" : "up", w, c === "D" ? 0.75 : 0.5); }); } }; } },
  { id: "ac_capo", title: "Capo Calculator", desc: "Which capo and shapes for the singer's key?", icon: Guitar, color: "#FFE53D", roles: ["acoustic", "lead"],
    gen: (L) => { const shapes = [["C", 0], ["G", 7], ["D", 2], ["A", 9], ["E", 4]]; const [sn, sk] = pick(shapes); const capo = 1 + rand(5); const key = (sk + capo) % 12; const ans = `Capo ${capo}, ${sn} shapes`;
      const wrong = new Set([ans]); while (wrong.size < 4) { const [s2, k2] = pick(shapes); const c2 = 1 + rand(6); if ((k2 + c2) % 12 !== key) wrong.add(`Capo ${c2}, ${s2} shapes`); }
      return { kind: "choice", sig: ans, prompt: `The song is in ${NOTE_NAMES[key]}. Which capo + shapes give you ${NOTE_NAMES[key]}?`, options: shuffle([...wrong]), answer: ans, play: null }; } },
  /* ---- LEAD ---- */
  { id: "ld_scale", title: "Scale Spotter", desc: "Major, minor, pentatonic or blues?", icon: Ladder, color: "#FFE53D", roles: ["lead", "keys"],
    gen: (L) => { const [t] = TS(L); const S = [["Major", [0, 2, 4, 5, 7, 9, 11, 12]], ["Natural minor", [0, 2, 3, 5, 7, 8, 10, 12]], ["Major pentatonic", [0, 2, 4, 7, 9, 12]], ["Minor pentatonic", [0, 3, 5, 7, 10, 12]], ["Blues", [0, 3, 5, 6, 7, 10, 12]]].slice(0, 2 + Math.min(3, t + 1)); const [nm, st] = pick(S); const r = 57 + rand(8);
      return { kind: "choice", sig: nm + r, prompt: "Which scale is this run?", options: S.map((x) => x[0]), answer: nm, play: () => st.forEach((x, i) => AE.play("electric", r + x, 0.3, i * 0.24, 0.75)) }; } },
  { id: "ld_bend", title: "Bend Check", desc: "Was the bend in tune, flat or sharp?", icon: Zap, color: "#FF3EA5", roles: ["lead"],
    gen: (L) => { const [t] = TS(L); const err = [40, 30, 22, 15, 10][t]; const kind = pick(["In tune", "Flat (not enough)", "Sharp (too far)"]); const off = kind === "In tune" ? 0 : kind.startsWith("Flat") ? -err : err; const tgt = 64 + rand(6);
      return { kind: "choice", sig: kind + tgt, prompt: "First the target note, then the bend. How was the bend?", options: ["In tune", "Flat (not enough)", "Sharp (too far)"], answer: kind, play: () => { AE.play("electric", tgt, 0.9, 0, 0.8); AE.play("electric", tgt + off / 100, 1.1, 1.1, 0.8); } }; } },
  /* ---- BASS ---- */
  { id: "bs_root", title: "Root Finder", desc: "Hear the chord, name its root", icon: Activity, color: "#8B5CFF", roles: ["bass"],
    gen: (L) => { const [t] = TS(L); const k = t === 0 ? 0 : g2Key(); const d = pick([0, 3, 4, 5, ...(t >= 2 ? [1, 2] : [])]); const c = g2Tri(k, d); const opts = [0, 1, 2, 3, 4, 5].map((x) => NOTE_NAMES[(k + DIATONIC.degs[x]) % 12]);
      return { kind: "choice", sig: k + "" + d, prompt: `Key of ${NOTE_NAMES[k]}: what's the ROOT of this chord?`, options: opts, answer: NOTE_NAMES[c.r], play: () => { AE.chord([60 + k, 64 + k, 67 + k].map((m) => m - (k > 6 ? 12 : 0)), 0.9); setTimeout(() => AE.chord(c.iv.map((x) => 60 + c.r + x - (c.r > 6 ? 12 : 0)), 1.4), 1000); } }; } },
  { id: "bs_lock", title: "Lock Check", desc: "Is the bass locked with the kick?", icon: Drum, color: "#C6FF3D", roles: ["bass", "drums"],
    gen: (L) => { const [t] = TS(L); const off = [0.09, 0.07, 0.05, 0.04, 0.03][t]; const kind = pick(["Locked together", "Locked together", "Bass is late", "Bass is early"]); const d = kind === "Bass is late" ? off : kind === "Bass is early" ? -off : 0;
      return { kind: "choice", sig: kind + rand(9), prompt: "Listen to kick + bass. Are they locked together?", options: ["Locked together", "Bass is late", "Bass is early"], answer: kind, play: () => { const b = 60 / 90; [0, 1.5, 2, 4, 5.5, 6].forEach((x) => { AE.kick(0.1 + x * b, 1); AE.play("bass", 36, 0.3, Math.max(0, 0.1 + x * b + d), 0.9); }); for (let i = 0; i < 16; i++) AE.hat(0.1 + i * b / 2, false, 0.35); } }; } },
  /* ---- DRUMS ---- */
  { id: "dr_groove", title: "Groove Spotter", desc: "Which groove is the band playing?", icon: Drum, color: "#C6FF3D", roles: ["drums"],
    gen: (L) => { const G = [["Basic rock / worship", { k: [0, 4], s: [2, 6], h: [0, 1, 2, 3, 4, 5, 6, 7] }], ["Four on the floor", { k: [0, 2, 4, 6], s: [2, 6], h: [1, 3, 5, 7] }], ["Half-time", { k: [0], s: [4], h: [0, 2, 4, 6] }], ["Worship pop (kick on 2&)", { k: [0, 3, 4], s: [2, 6], h: [0, 1, 2, 3, 4, 5, 6, 7] }]]; const [nm, g] = pick(G);
      return { kind: "choice", sig: nm, prompt: "Which groove is this?", options: G.map((x) => x[0]), answer: nm, play: () => { const e = 60 / 96 / 2; for (let bar = 0; bar < 2; bar++) { g.k.forEach((x) => AE.kick((bar * 8 + x) * e, 1)); g.s.forEach((x) => AE.snare((bar * 8 + x) * e, 0.85)); g.h.forEach((x) => AE.hat((bar * 8 + x) * e, false, 0.4)); } } }; } },
  { id: "dr_fill", title: "Fill Counter", desc: "How many beats long was the fill?", icon: Timer, color: "#FF8A00", roles: ["drums"],
    gen: (L) => { const n = pick([1, 2, 3, 4]);
      return { kind: "choice", sig: String(n) + rand(9), prompt: "Groove, then a fill into the crash. How many beats was the fill?", options: ["1 beat", "2 beats", "3 beats", "4 beats (whole bar)"], answer: n === 4 ? "4 beats (whole bar)" : `${n} beat${n > 1 ? "s" : ""}`, play: () => { const b = 60 / 92; for (let i = 0; i < 4 + (4 - n); i++) { const w = i * b; AE.hat(w, false, 0.4); AE.hat(w + b / 2, false, 0.3); if (i % 2 === 0) AE.kick(w, 1); else AE.snare(w, 0.85); } const st = (8 - n) * b; for (let i = 0; i < n * 4; i++) { const w = st + i * b / 4; const which = i / (n * 4); if (which < 0.34) AE.snare(w, 0.7); else if (which < 0.67) AE.tom(w, 1, 0.8); else AE.tom(w, 3, 0.85); } AE.kick(8 * b, 1); AE.hat(8 * b, true, 0.9); } }; } },
  /* ---- SOUND ---- */
  { id: "sd_hpf", title: "Low-Cut Ears", desc: "Is the high-pass (low-cut) on?", icon: Sliders, color: "#7CFFB2", roles: ["sound"],
    gen: (L) => { const [t] = TS(L); const f = [200, 150, 120, 100, 80][t]; const on = Math.random() < 0.5;
      return { kind: "choice", sig: String(on) + rand(9), prompt: "First the raw sound, then the same with or without a low-cut. Is the low-cut ON?", options: ["Yes — low-cut on", "No — the same"], answer: on ? "Yes — low-cut on" : "No — the same", play: () => { const c = AE.get(); const a = c.createGain(); a.connect(AE.out()); [36, 43, 48].forEach((m, i) => AE.play("bass", m, 0.6, i * 0.6, 0.9, a)); const g = c.createGain(); if (on) { const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = f; hp.Q.value = 0.9; g.connect(hp); hp.connect(AE.out()); } else g.connect(AE.out()); [36, 43, 48].forEach((m, i) => AE.play("bass", m, 0.6, 2.2 + i * 0.6, 0.9, g)); } }; } },
  { id: "sd_delay", title: "Delay Timer", desc: "Which delay time fits the song tempo?", icon: Waves, color: "#22E4FF", roles: ["sound"],
    gen: (L) => { const bpm = pick([60, 70, 72, 75, 80, 90, 100, 120]); const q = Math.round(60000 / bpm); const kind = pick([["quarter note", 1], ["dotted 8th", 0.75], ["8th note", 0.5]]); const ans = Math.round(q * kind[1]);
      const opts = shuffle([...new Set([ans, Math.round(q), Math.round(q * 0.75), Math.round(q * 0.5), Math.round(q * 1.5)])]).slice(0, 4); if (!opts.includes(ans)) opts[0] = ans;
      return { kind: "choice", sig: bpm + kind[0], prompt: `The song is ${bpm} bpm. What's the ${kind[0]} delay time?`, options: shuffle(opts).map((x) => `${x} ms`), answer: `${ans} ms`, play: null }; } },
);
Object.assign(GAME_HOW, {
  kb_chord: ["The game names a chord. Tap all its notes on the piano, then Submit.", "Knowing every chord's notes in every key."], kb_inv: ["A chord plays. Listen to the lowest note: root, 3rd (1st inversion) or 5th (2nd inversion)?", "Smooth voicings and hearing what other keys players do."],
  kb_bass: ["A chord plays with a bass note. Is the bass the root, the 3rd or the 5th?", "Hearing slash chords like 1/3 and 1/5."], ac_strum: ["Listen to the strumming and pick the pattern.", "Copying strumming patterns by ear."],
  ac_capo: ["The singer's key is shown. Pick the capo + chord shapes that sound in that key.", "Playing in any key with easy shapes."], ld_scale: ["A run plays. Which scale was it?", "Choosing the right scale for solos and fills."],
  ld_bend: ["Hear the target, then the bend. Was it in tune, flat or sharp?", "Bending strings in tune."], bs_root: ["The key plays, then a chord. Which note is its root?", "Finding the root fast — the bass player's #1 job."],
  bs_lock: ["Kick and bass play together. Are they locked, or is the bass early/late?", "Locking with the drummer."], dr_groove: ["A groove plays. Which one is it?", "Recognising and choosing the right groove."],
  dr_fill: ["Groove, then a fill into the crash. How long was the fill?", "Knowing exactly where fills start so you land on the 1."], sd_hpf: ["Raw, then processed. Is the low-cut filter on?", "Cleaning rumble from vocals and guitars."],
  sd_delay: ["The tempo is given. Pick the right delay time (quarter = 60000 ÷ bpm).", "Setting delays in time with the song."],
});
Object.assign(GAME_SETS, {
  keys: [...GAME_SETS.keys, "kb_chord", "kb_inv", "kb_bass", "ld_scale"],
  acoustic: [...GAME_SETS.acoustic, "ac_strum", "ac_capo"],
  lead: [...GAME_SETS.lead, "ld_scale", "ld_bend", "ac_capo"],
  bass: [...GAME_SETS.bass, "bs_root", "bs_lock", "kb_bass"],
  drums: [...GAME_SETS.drums, "dr_groove", "dr_fill", "bs_lock"],
  sound: [...GAME_SETS.sound, "sd_hpf", "sd_delay"],
});
/* ---- SINGERS: more voice games ---- */
VOICE_GAMES.push(
  { id: "vg_scale", title: "Scale Climber", emoji: "🧗", color: "#FF8A00", desc: "Sing Do-Re-Mi up (and down) the scale.", how: "The key plays. Sing each step of the scale in order — each dot turns green when you hit it.", trains: "Accurate steps and a strong sense of the key." },
  { id: "vg_chord", title: "Chord Tone Singer", emoji: "🎹", color: "#B57BFF", desc: "A chord plays — sing its root, 3rd or 5th.", how: "A chord plays and the game asks for one of its notes (root, 3rd or 5th). Find it and sing it.", trains: "Finding your harmony note inside the chord the band plays." },
  { id: "vg_hold", title: "Long Note Hold", emoji: "⏳", color: "#7CFFB2", desc: "Hold one note in tune for as long as asked.", how: "A note plays. Sing it and HOLD it steady in tune — the bar must stay green for the whole time.", trains: "Breath support and steady pitch on long notes." },
);
