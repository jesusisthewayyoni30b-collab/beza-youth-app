
/* ============================ PRACTICE TOOLS: INSTRUMENTS ============================ */
function useLoop(running, stepMs, onStep, deps = []) {
  const ref = useRef(onStep); ref.current = onStep;
  useEffect(() => {
    if (!running) return; let i = 0; AE.get();
    const tick = () => { ref.current(i); i++; };
    tick(); const iv = setInterval(tick, stepMs);
    return () => clearInterval(iv);
  }, [running, stepMs, ...deps]); // eslint-disable-line
}

/* ---------------- FINGER EXERCISES (animated tab, real guitar/bass samples) ---------------- */
const rep = (arr, n) => Array.from({ length: n }, () => arr).flat();
const upDown = (up) => [...up, ...[...up].reverse()];
const FX = (id, name, inst, lvl, desc, notes, sub = 2) => ({ id, name, inst, lvl, desc, notes, sub });
const FINGER_EX = [
  FX("spider", "Spider 1-2-3-4 (fret 5)", "guitar", 0, "One finger per fret, every string up and back. Alternate picking.", [...[0, 1, 2, 3, 4, 5].flatMap((s) => [5, 6, 7, 8].map((f) => [s, f])), ...[5, 4, 3, 2, 1, 0].flatMap((s) => [8, 7, 6, 5].map((f) => [s, f]))]),
  FX("chromatic", "Chromatic ladder", "guitar", 0, "Up the strings at fret 1, shift up one fret, come back down. Keep fingers close to the board.", [...[0, 1, 2, 3, 4, 5].flatMap((s) => [1, 2, 3, 4].map((f) => [s, f])), ...[5, 4, 3, 2, 1, 0].flatMap((s) => [5, 4, 3, 2].map((f) => [s, f]))]),
  FX("spiderx", "Spider walk (cross pairs)", "guitar", 1, "Fingers 1 & 3 on neighbouring strings, then 2 & 4. Builds real independence.", [0, 1, 2, 3, 4].flatMap((s) => [[s, 5], [s + 1, 7], [s, 6], [s + 1, 8]])),
  FX("stretch", "Stretch 1-3-4", "guitar", 1, "Frets 5-7-8 on every string. Thumb low behind the neck.", upDown([0, 1, 2, 3, 4, 5].flatMap((s) => [5, 7, 8].map((f) => [s, f])))),
  FX("penta", "A minor pentatonic — box 1", "guitar", 1, "The lead guitarist's home. Also C major pentatonic / Tizita Major in C.", upDown([[0, 5], [0, 8], [1, 5], [1, 7], [2, 5], [2, 7], [3, 5], [3, 7], [4, 5], [4, 8], [5, 5], [5, 8]])),
  FX("major3nps", "G major — 3 notes per string", "guitar", 2, "Find every G (root) as you play. Smooth position shifts.", upDown([[0, 3], [0, 5], [0, 7], [1, 3], [1, 5], [1, 7], [2, 4], [2, 5], [2, 7], [3, 4], [3, 5], [3, 7], [4, 5], [4, 7], [4, 8], [5, 5], [5, 7], [5, 8]])),
  FX("tremolo", "Tremolo picking", "guitar", 1, "Fast, even down-up on one string. Tiny wrist motions.", [...rep([[4, 5]], 8), ...rep([[4, 7]], 8), ...rep([[4, 8]], 8), ...rep([[4, 7]], 8)], 4),
  FX("arp", "C major picked arpeggio", "guitar", 0, "Let every note ring like a harp — perfect for intimate moments.", rep([[1, 3], [2, 2], [3, 0], [4, 1], [5, 0], [4, 1], [3, 0], [2, 2]], 2)),
  FX("bend", "Bend targets (whole step)", "guitar", 2, "Play the target (7th fret), then bend the 5th fret up to match it.", rep([[3, 7], [3, 5, "b"], [4, 8], [4, 6, "b"]], 2), 1),
  FX("sixths", "6ths in G (G & e strings)", "guitar", 2, "Two notes together, skipping the B string. Sweet gospel fills.", upDown([[[3, 4], [5, 3]], [[3, 5], [5, 5]], [[3, 7], [5, 7]], [[3, 9], [5, 8]], [[3, 11], [5, 10]], [[3, 12], [5, 12]]]), 1),
  FX("legato", "Hammer-on / pull-off chain", "guitar", 2, "Pick only the first note of each pair; hammer and pull the rest.", rep([[3, 5], [3, 7], [3, 5], [3, 7], [4, 5], [4, 7], [4, 5], [4, 7]], 2), 4),
  FX("bassopen", "Open-string plucking", "bass", 0, "Alternate index and middle. Every note the same volume.", [...rep([[0, 0]], 4), ...rep([[1, 0]], 4), ...rep([[2, 0]], 4), ...rep([[3, 0]], 4)]),
  FX("bassspider", "Bass chromatic 1-2-3-4", "bass", 0, "One finger per fret at fret 5. Mute as you go.", upDown([0, 1, 2, 3].flatMap((s) => [5, 6, 7, 8].map((f) => [s, f])))),
  FX("bass158", "Root–5–octave (G, C, D)", "bass", 1, "The movable 1-5-8 shape on three chords.", [[0, 3], [1, 5], [2, 5], [1, 5], [1, 3], [2, 5], [3, 5], [2, 5], [1, 5], [2, 7], [3, 7], [2, 7], [0, 3], [1, 5], [2, 5], [1, 5]]),
  FX("bassmajor", "G major scale — one octave", "bass", 1, "Fingers 2-4 / 1-2-4 / 1-3-4. Say the scale degrees.", upDown([[0, 3], [0, 5], [1, 2], [1, 3], [1, 5], [2, 2], [2, 4], [2, 5]])),
  FX("bassoct", "Octave pops", "bass", 2, "Root then octave (skip a string). Mute the string in between.", rep([[0, 3], [2, 5], [0, 3], [2, 5], [1, 3], [3, 5], [1, 3], [3, 5]], 2), 2),
];
const FX_HOME = { spider: 9, chromatic: 5, spiderx: 9, stretch: 9, penta: 9, major3nps: 7, tremolo: 4, arp: 0, bend: 2, sixths: 7, legato: 0, bassspider: 9, bass158: 7, bassmajor: 7, bassoct: 7 };
const FX_TPL = {
  spider: (K, f) => [`Spider 1-2-3-4 (fret ${f})`],
  chromatic: (K, f) => [`Chromatic ladder (from fret ${f})`],
  penta: (K) => [`${K} minor pentatonic — box 1`, `The lead guitarist's home. Also ${NOTE_NAMES[(NOTE_NAMES.indexOf(K) + 3) % 12]} major pentatonic / Tizita Major in ${NOTE_NAMES[(NOTE_NAMES.indexOf(K) + 3) % 12]}.`],
  major3nps: (K) => [`${K} major — 3 notes per string`, `Find every ${K} (root) as you play. Smooth position shifts.`],
  arp: (K) => [`${K} major picked arpeggio`],
  sixths: (K) => [`6ths in ${K} (G & e strings)`],
  bass158: (K) => { const i = NOTE_NAMES.indexOf(K); return [`Root–5–octave (${K}, ${NOTE_NAMES[(i + 5) % 12]}, ${NOTE_NAMES[(i + 7) % 12]})`, "The movable 1-5-8 shape on the 1, 4 and 5 chords of your key."]; },
  bassmajor: (K) => [`${K} major scale — one octave`],
  bassoct: (K) => [`Octave pops in ${K}`],
};
const fxFrets = (notes) => notes.flatMap((n) => (Array.isArray(n[0]) ? n : [n]).map((x) => x[1]));
function fxShift(ex, k) {
  const h = FX_HOME[ex.id]; if (h == null || k == null) return 0;
  const s = (k - h + 12) % 12; const fr = fxFrets(ex.notes); const lo = Math.min(...fr), hi = Math.max(...fr);
  const c = [s - 12, s].find((c) => lo + c >= 0 && hi + c <= 15); return c != null ? c : s;
}
const fxTranspose = (notes, c) => (c ? notes.map((n) => (Array.isArray(n[0]) ? n.map((x) => [x[0], x[1] + c, ...x.slice(2)]) : [n[0], n[1] + c, ...n.slice(2)])) : notes);
function fxLabel(ex, k, c) {
  const h = FX_HOME[ex.id]; if (h == null || k == null) return [ex.name, ex.desc];
  const K = NOTE_NAMES[k]; const f = Math.min(...fxFrets(ex.notes)) + c; const t = FX_TPL[ex.id] ? FX_TPL[ex.id](K, f) : [];
  return [t[0] || `${ex.name.replace(/ \(.*\)$/, "")} — key of ${K} (fret ${f})`, t[1] || ex.desc];
}
function FingerExercises({ embedded, inst: i0, ex: e0 }) {
  const { T, user } = useApp();
  const roles = (user && user.roles) || [];
  const canGuitar = roles.includes("acoustic") || roles.includes("lead") || !roles.length;
  const canBass = roles.includes("bass") || !roles.length;
  const kind0 = i0 === "bass" ? "bass" : e0 && FINGER_EX.find((x) => x.id === e0) ? FINGER_EX.find((x) => x.id === e0).inst : canGuitar ? "guitar" : "bass";
  const [kind, setKind] = useState(kind0);
  const list = FINGER_EX.filter((x) => x.inst === kind);
  const [ex, setEx] = useState(FINGER_EX.find((x) => x.id === e0 && x.inst === kind0) || list[0]);
  const [key, setKey] = useState(null);
  const fk = FX_HOME[ex.id] == null ? null : key == null ? FX_HOME[ex.id] : key;
  const fShift = fxShift(ex, fk);
  const notesX = useMemo(() => fxTranspose(ex.notes, fShift), [ex, fShift]);
  const [exName, exDesc] = fxLabel(ex, fk, fShift);
  const [bpm, setBpm] = useState(60);
  const [run, setRun] = useState(false);
  const [i, setI] = useState(-1);
  const [ramp, setRamp] = useState(false);
  const [click, setClick] = useState(true);
  const sound = kind === "bass" ? "bass" : i0 === "electric" || roles.includes("lead") && !roles.includes("acoustic") ? "electric" : "acoustic";
  useEffect(() => { AE.load(sound); }, [sound]);
  const tuning = kind === "bass" ? BASS_TUNING : GUITAR_TUNING;
  const stepMs = (60 / bpm / ex.sub) * 1000;
  useLoop(run, stepMs, (k) => {
    const idx = k % notesX.length; setI(idx);
    if (click && k % ex.sub === 0) AE.click((k / ex.sub) % 4 === 0);
    const n = notesX[idx]; const notes = Array.isArray(n[0]) ? n : [n];
    notes.forEach((nt) => AE.play(sound, tuning[nt[0]] + nt[1] + (nt[2] === "b" ? 2 : 0), Math.min(1.2, (stepMs / 1000) * (ex.id === "arp" ? 3 : 0.95)), 0, 0.75));
    if (ramp && idx === notesX.length - 1) setBpm((b) => Math.min(220, b + 4));
  }, [ex, notesX, sound, click, ramp]);
  const strings = tuning.length;
  const win = 14; const start = Math.max(0, Math.min(notesX.length - win, (i < 0 ? 0 : i) - 4));
  const view = notesX.slice(start, start + win);
  return (
    <div>
      <ToolBar embedded={embedded} title="Finger Exercises" sub="Animated tab · real guitar & bass sounds" />
      {canGuitar && canBass && <Seg value={kind} onChange={(k) => { setRun(false); setKind(k); setEx(FINGER_EX.find((x) => x.inst === k)); }} options={[{ value: "guitar", label: "Guitar" }, { value: "bass", label: "Bass" }]} />}
      {fk != null && (
        <Card style={{ marginTop: 12, padding: 12 }}>
          <div style={{ fontSize: 10.5, color: T.faint, fontWeight: 700, marginBottom: 6 }}>CHOOSE YOUR KEY · the pattern moves up or down the neck</div>
          <KeyChips value={fk} onChange={(k) => { setRun(false); setI(-1); setKey(k); }} />
        </Card>
      )}
      <Card tone="hero" style={{ marginTop: 12, padding: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, letterSpacing: 1, textTransform: "uppercase" }}>{LEVELS[ex.lvl]} · {bpm} bpm</div>
        <div style={{ fontFamily: headFont(T), fontSize: 21, margin: "2px 0 4px" }}>{exName}</div>
        <div style={{ fontSize: 12.5, opacity: 0.85, marginBottom: 10 }}>{exDesc}</div>
        <div style={{ background: "rgba(0,0,0,0.28)", borderRadius: 14, padding: "10px 8px", fontFamily: "ui-monospace, Menlo, monospace" }}>
          {Array.from({ length: strings }).map((_, row) => {
            const s = strings - 1 - row; const name = nn(tuning[s]).toLowerCase();
            return (
              <div key={row} style={{ display: "flex", alignItems: "center", height: 22, position: "relative" }}>
                <div style={{ width: 16, fontSize: 11, opacity: 0.7, fontWeight: 700 }}>{s === 0 && kind === "guitar" ? "E" : name}</div>
                <div style={{ position: "absolute", left: 18, right: 0, top: "50%", height: 1, background: "rgba(255,255,255,0.35)" }} />
                {view.map((n, k) => {
                  const notes = Array.isArray(n[0]) ? n : [n]; const hit = notes.find((nt) => nt[0] === s); const on = start + k === i;
                  return <div key={k} style={{ flex: 1, textAlign: "center", position: "relative", zIndex: 1 }}>{hit && <span style={{ display: "inline-block", minWidth: 18, padding: "0 3px", borderRadius: 6, fontSize: 12, fontWeight: 800, background: on ? T.accent : T.hero === "#121519" ? "#1b1f26" : "rgba(20,24,30,0.9)", color: on ? T.accentText : "#fff" }}>{hit[1]}{hit[2] || ""}</span>}</div>;
                })}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn full variant={run ? "light" : "accent"} icon={run ? Square : Play} onClick={() => { setRun((r) => !r); setI(-1); }}>{run ? "Stop" : "Play along"}</Btn>
        </div>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <Slider label="Tempo" value={bpm} min={40} max={200} onChange={setBpm} fmt={(v) => `${v} bpm`} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Click</span><Toggle on={click} onChange={setClick} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 13, fontWeight: 600 }}>Tempo ramp (+4 bpm each loop)</span><Toggle on={ramp} onChange={setRamp} /></div>
      </Card>
      <SectionTitle>Exercises</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((x) => (
          <Card key={x.id} pad={12} tone={x.id === ex.id ? "soft" : "card"} onClick={(e) => { setRun(false); setEx(x); setI(-1); scrollUp(e); }} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconBubble icon={kind === "bass" ? Activity : Guitar} size={36} tone={x.id === ex.id ? "accent" : "soft"} />
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{x.name}</div><div style={{ fontSize: 11.5, color: T.sub }}>{LEVELS[x.lvl]} · {x.notes.length} notes</div></div>
          </Card>
        ))}
      </div>
      {!embedded && <MarkComplete id="fingers" label="Finger exercises" mins={5} />}
    </div>
  );
}

/* ---------------- KEYS DRILLS ---------------- */
const CIRCLE = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];
const KD_KEYS = (P, all12) => (P.all && all12 ? CIRCLE : [P.key]);
const KD = {
  five: { name: "Five-finger patterns", lvl: 0, all12: true, desc: "1-2-3-4-5-4-3-2 in your key. Curved fingers, loose wrist.", seq: (P) => KD_KEYS(P, true).flatMap((k) => [0, 2, 4, 5, 7, 5, 4, 2].map((x) => ({ n: [keyBase(k) + x], k, label: `${NOTE_NAMES[k]} · ${nn(keyBase(k) + x)}` }))), sub: 2 },
  triads: { name: "Triad ladder (every chord in the key)", lvl: 1, all12: true, desc: "Climb the 7 chords of the key: 1 · 2m · 3m · 4 · 5 · 6m · 7dim. Say the number aloud. 'All 12 keys' = every major & minor triad chromatically.", seq: (P) => P.all ? [...Array.from({ length: 12 }, (_, r) => ({ n: [60 + r, 64 + r, 67 + r], label: NOTE_NAMES[r] })), ...Array.from({ length: 12 }, (_, r) => ({ n: [60 + r, 63 + r, 67 + r], label: NOTE_NAMES[r] + "m" }))] : [0, 1, 2, 3, 4, 5, 6, 7].map((d) => { const b = keyBase(P.key); const nts = [d, d + 2, d + 4].map((x) => degMidi(b, x)); const q = DIATONIC.q[d % 7]; return { n: nts, label: `${d % 7 + 1}${q} = ${NOTE_NAMES[(P.key + DIATONIC.degs[d % 7]) % 12]}${q === "dim" ? "°" : q}` }; }), sub: 1 },
  inv: { name: "Inversion ladder", lvl: 2, desc: "Root → 1st → 2nd → root for the 1, 4 and 5 chords of your key.", seq: (P) => [0, 5, 7].flatMap((x, ci) => { const r = (P.key + x) % 12; return [0, 1, 2, 3].map((v) => ({ n: voiceChord(55 + r, [0, 4, 7], v % 3, "close").map((m) => m + (v === 3 ? 12 : 0)), label: `${["1", "4", "5"][ci]} = ${NOTE_NAMES[r]}` + ["", " (1st inv)", " (2nd inv)", " (root)"][v] })); }), sub: 1 },
  circle1564: { name: "1–5–6–4 progression", lvl: 2, all12: true, desc: "Voice-led triads in your key. Think numbers! 'All 12 keys' walks the circle of 5ths.", seq: (P) => { let prev = null; return KD_KEYS(P, true).flatMap((k) => [0, 4, 5, 3].map((d) => { const r = (k + DIATONIC.degs[d]) % 12; const iv = DIATONIC.q[d] === "m" ? [0, 3, 7] : [0, 4, 7]; const v = voiceLead(prev, iv.map((x) => r + x)); prev = v; return { n: [36 + r + (r > 7 ? -12 : 0) + 12, ...v], label: `${NOTE_NAMES[k]}: ${d + 1} = ${NOTE_NAMES[r]}${DIATONIC.q[d]}` }; })); }, sub: 1 },
  arp: { name: "Arpeggios 1-3-5-8", lvl: 1, all12: true, desc: "Smooth thumb crossings in your key.", seq: (P) => KD_KEYS(P, true).flatMap((k) => [0, 4, 7, 12, 16, 12, 7, 4].map((x) => ({ n: [keyBase(k) + x], k, label: `${NOTE_NAMES[k]} · ${nn(keyBase(k) + x)}` }))), sub: 2 },
  hanon: { name: "Hanon #1", lvl: 1, desc: "The classic finger-strength pattern, ascending through the scale of your key.", seq: (P) => [0, 1, 2, 3, 4, 5, 6].flatMap((d) => [0, 2, 3, 4, 5, 4, 3, 2].map((o) => ({ n: [degMidi(keyBase(P.key), d + o)] }))), sub: 4 },
  scales: { name: "Scale trainer (every scale, every key)", lvl: 0, desc: "Pick any scale, any key, 1–2 octaves — up, down or both. Or run it through all 12 keys.", seq: (P) => { const S = ALL_SCALES.find((x) => x.id === P.sid) || ALL_SCALES[0]; const n = S.steps.length; const keys = P.all ? CIRCLE : [P.key];
      return keys.flatMap((k) => { const b = 60 + k - (k > 6 ? 12 : 0); const notes = Array.from({ length: n * P.oct + 1 }, (_, i) => b + 12 * Math.floor(i / n) + S.steps[i % n]); const ev = notes.map((m) => ({ n: [m], label: `${NOTE_NAMES[k]} ${S.name} · ${nn(m)}` })); return P.dir === "down" ? [...ev].reverse() : P.dir === "both" ? [...ev, ...[...ev].reverse().slice(1)] : ev; }); }, sub: 2, own: true },
  scale: { name: "Major scale — 2 octaves", lvl: 0, desc: "RH fingering in C, G, D, A, E: 1-2-3-1-2-3-4-1-2-3-1-2-3-4-5. In other keys keep the thumb off the black keys.", seq: (P) => upDown(Array.from({ length: 15 }, (_, i) => ({ n: [degMidi(keyBase(P.key), i)] }))), sub: 2 },
};
function KeysDrills({ embedded, drill: d0 }) {
  const { T } = useApp();
  const [id, setId] = useState(d0 && KD[d0] ? d0 : "scales");
  const [dir, setDir] = useState("both");
  const [P, setP] = useState({ sid: "major", key: 0, oct: 1, all: false });
  const d = KD[id];
  const seq = useMemo(() => { if (d.own) return d.seq({ ...P, dir }); const s0 = d.seq(P); return dir === "up" ? s0 : dir === "down" ? [...s0].reverse() : [...s0, ...[...s0].reverse().slice(1)]; }, [id, dir, P]); // eslint-disable-line
  const [bpm, setBpm] = useState(70);
  const [run, setRun] = useState(false);
  const [i, setI] = useState(-1);
  const stepMs = (60 / bpm / d.sub) * 1000;
  useLoop(run, stepMs, (k) => {
    const idx = k % seq.length; setI(idx); const ev = seq[idx];
    if (k % d.sub === 0) AE.click((k / d.sub) % 4 === 0);
    if (ev.n.length > 1) AE.chord(ev.n, (stepMs / 1000) * 0.95); else AE.tone(ev.n[0], (stepMs / 1000) * 0.9, 0, 0.7);
  }, [id, seq]);
  const ev = seq[Math.max(0, i)] || seq[0];
  const allN = seq.flatMap((e) => e.n); const lo = Math.min(...allN), hi = Math.max(...allN); const start = Math.max(24, lo - (lo % 12)); const pOct = Math.min(4, Math.max(2, Math.ceil((hi - start) / 12)));
  return (
    <div>
      <ToolBar embedded={embedded} title="Keys Drills" sub="Technique, chords & progressions with real piano" />
      <Scroller>{Object.entries(KD).sort((x, y) => (y[1].own ? 1 : 0) - (x[1].own ? 1 : 0)).map(([k, v]) => <Chip key={k} active={id === k} onClick={() => { setRun(false); setI(-1); setId(k); }}>{v.name.split(" (")[0]}</Chip>)}</Scroller>
      <div style={{ marginTop: 10 }}><Seg value={dir} onChange={(v) => { setRun(false); setI(-1); setDir(v); }} options={[{ value: "up", label: "↑ Up" }, { value: "down", label: "↓ Down" }, { value: "both", label: "↑↓ Up & down" }]} /></div>
      {d.own && (
        <Card style={{ marginTop: 10, padding: 12 }}>
          {SCALE_GROUPS.map((g) => <div key={g.id} style={{ marginBottom: 6 }}><div style={{ fontSize: 10.5, color: T.faint, fontWeight: 700, marginBottom: 4 }}>{g.name.toUpperCase()}</div><Scroller>{g.items.map((x) => <Chip key={x.id} active={P.sid === x.id} onClick={() => { setRun(false); setI(-1); setP((p) => ({ ...p, sid: x.id })); }}>{x.name}</Chip>)}</Scroller></div>)}
          <div style={{ marginTop: 8 }}><KeyChips value={P.key} onChange={(k) => { setRun(false); setI(-1); setP((p) => ({ ...p, key: k, all: false })); }} /></div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            <Chip active={P.oct === 1} onClick={() => setP((p) => ({ ...p, oct: 1 }))}>1 octave</Chip><Chip active={P.oct === 2} onClick={() => setP((p) => ({ ...p, oct: 2 }))}>2 octaves</Chip>
            <Chip active={P.all} onClick={() => { setRun(false); setI(-1); setP((p) => ({ ...p, all: !p.all })); }}>🔁 All 12 keys (circle of 5ths)</Chip>
          </div>
        </Card>
      )}
      {!d.own && (
        <Card style={{ marginTop: 10, padding: 12 }}>
          <div style={{ fontSize: 10.5, color: T.faint, fontWeight: 700, marginBottom: 6 }}>CHOOSE YOUR KEY</div>
          <KeyChips value={P.all && d.all12 ? -1 : P.key} onChange={(k) => { setRun(false); setI(-1); setP((p) => ({ ...p, key: k, all: false })); }} />
          {d.all12 && <div style={{ marginTop: 8 }}><Chip active={P.all} onClick={() => { setRun(false); setI(-1); setP((p) => ({ ...p, all: !p.all })); }}>🔁 All 12 keys (circle of 5ths)</Chip></div>}
        </Card>
      )}
      <Card tone="hero" style={{ marginTop: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, letterSpacing: 1, textTransform: "uppercase" }}>{LEVELS[d.lvl]}</div>
        <div style={{ fontFamily: headFont(T), fontSize: 21 }}>{d.own ? d.name : `${d.name.split(" (")[0]} — ${P.all && d.all12 ? "all 12 keys" : NOTE_NAMES[P.key] + " major"}`}</div>
        <div style={{ fontSize: 12.5, opacity: 0.85, margin: "4px 0 10px" }}>{d.desc}</div>
        <div style={{ fontSize: 22, fontWeight: 800, minHeight: 30 }}>{i >= 0 ? (ev.label || ev.n.map(nn).join(" ")) : "Ready"}</div>
        <Bar pct={(i + 1) / seq.length} color={T.accent} track="rgba(255,255,255,0.2)" />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn full variant={run ? "light" : "accent"} icon={run ? Square : Play} onClick={() => { setRun((r) => !r); setI(-1); }}>{run ? "Stop" : "Play along"}</Btn>
        </div>
      </Card>
      <Card style={{ marginTop: 12, padding: 12 }}>
        <Piano start={start} octaves={pOct} highlight={i >= 0 ? ev.n : []} roots={i >= 0 ? [ev.n[0]] : []} height={104} pcKeys showOctaveCtl />
        <div style={{ marginTop: 12 }}><Slider label="Tempo" value={bpm} min={40} max={180} onChange={setBpm} fmt={(v) => `${v} bpm`} /></div>
      </Card>
      {!embedded && <MarkComplete id="keysdrills" label="Keys drills" mins={8} />}
    </div>
  );
}

/* ---------------- GUITAR SHAPES · CAPO · BARRE ---------------- */
const SHAPE_QUALS = [["", "Major"], ["m", "Minor"], ["7", "7"], ["maj7", "Maj7"], ["m7", "m7"], ["sus2", "Sus2"], ["sus4", "Sus4"], ["add9", "Add9"]];
const strumShape = (frets, inst = "acoustic", base = 0) => AE.strum(frets.map((f, s) => (f < 0 ? null : GUITAR_TUNING[s] + f + base)).filter((x) => x != null), "down", 0, 0.85, inst, 2);
function capoOptions(root, q) {
  const out = [];
  Object.entries(OPEN_SHAPES).forEach(([name, frets]) => {
    const m = name.match(/^([A-G]#?b?)(.*)$/); if (m[2] !== q) return;
    const sr = NOTE_NAMES.indexOf(m[1]); if (sr < 0) return;
    const capo = (root - sr + 12) % 12;
    out.push({ shape: name, capo, frets });
  });
  return out.sort((a, b) => a.capo - b.capo);
}
const fingerNeed = (frets) => { const fr = frets.map((f, s) => ({ f, s })).filter((x) => x.f > 0); if (!fr.length) return 0; const minF = Math.min(...fr.map((x) => x.f)); const atMin = fr.filter((x) => x.f === minF); if (atMin.length >= 2 && fr.length > 3) { const from = Math.min(...atMin.map((x) => x.s)); let ok = true; for (let k = from; k < 6; k++) if (frets[k] < minF) ok = false; if (ok) return 1 + fr.filter((x) => x.f !== minF).length; } return fr.length; };
const VOICE_CACHE = {};
function findVoicings(root, ivs, max = 4) {
  const ck = root + ":" + ivs.join(","); if (VOICE_CACHE[ck]) return VOICE_CACHE[ck];
  const req = [...new Set(ivs.map((x) => x % 12))]; const opt5 = req.length >= 4 && req.includes(7) ? 7 : null;
  const must = req.filter((x) => x !== opt5);
  const res = [];
  for (let b = 0; b <= 12; b++) {
    const opts = [...new Set([-1, ...(b <= 3 ? [0] : []), ...(b === 0 ? [1, 2, 3] : [b, b + 1, b + 2, b + 3])])];
    const fr = [];
    const dfs = (s, started, gap) => {
      if (s === 6) {
        const played = fr.map((f, i) => (f < 0 ? null : GUITAR_TUNING[i] + f)).filter((x) => x != null); if (played.length < Math.min(4, ivs.length + 1)) return;
        const pcs = new Set(played.map((m) => (((m - root) % 12) + 12) % 12)); if (!must.every((x) => pcs.has(x))) return; if ([...pcs].some((x) => !req.includes(x))) return;
        const fretted = fr.filter((f) => f > 0); if (fretted.length) { const span = Math.max(...fretted) - Math.min(...fretted); if (span > 3) return; if (b > 0 && Math.min(...fretted) !== b) return; }
        const need = fingerNeed(fr); if (need > 4) return;
        const score = played.length * 2.2 + (fr[0] >= 0 || fr[1] >= 0 ? 1.5 : 0) - (fretted.length ? Math.min(...fretted) : 0) * 0.35 - need * 0.5 + (fr.filter((f) => f === 0).length * 0.4) - (gap ? 3 : 0) + (pcs.size === req.length ? 2 : 0);
        res.push({ frets: [...fr], score });
        return;
      }
      for (const f of opts) {
        if (!started) { if (f < 0) { if (s > 2) continue; fr[s] = -1; dfs(s + 1, false, gap); continue; } if (((GUITAR_TUNING[s] + f - root) % 12 + 12) % 12 !== 0) continue; fr[s] = f; dfs(s + 1, true, gap); continue; }
        if (f < 0 && s < 5) { if (gap) continue; fr[s] = -1; dfs(s + 1, true, true); continue; }
        const pc = (((GUITAR_TUNING[s] + Math.max(0, f) - root) % 12) + 12) % 12; if (f >= 0 && !req.includes(pc)) continue;
        fr[s] = f; dfs(s + 1, true, gap);
      }
    };
    dfs(0, false, false);
  }
  res.sort((a, b) => b.score - a.score);
  const out = []; const seenBase = new Set();
  for (const r of res) { const fretted = r.frets.filter((f) => f > 0); const base = fretted.length ? Math.min(...fretted) : 0; const key = Math.round(base / 3); if (seenBase.has(key)) continue; seenBase.add(key); out.push(r.frets); if (out.length >= max) break; }
  VOICE_CACHE[ck] = out; return out;
}

function chordVoicings(root, q) {
  const out = []; const nm = NOTE_NAMES[root] + q;
  if (OPEN_SHAPES[nm]) out.push({ cat: "Open", frets: OPEN_SHAPES[nm], capo: 0, label: "Open chord" });
  if (E_SHAPES[q]) { let f = (root - 4 + 12) % 12; if (f === 0) f = 12; out.push({ cat: "E-shape barre", frets: E_SHAPES[q].map((x) => (x < 0 ? -1 : x + f)), capo: 0, label: `Root on low E · fret ${f}` }); }
  if (A_SHAPES[q]) { let f = (root - 9 + 12) % 12; const mo = Math.min(...A_SHAPES[q].filter((x) => x >= 0)); if (f + mo < 1) f += 12; if (f === 0) f = 12; out.push({ cat: "A-shape barre", frets: A_SHAPES[q].map((x) => (x < 0 ? -1 : x + f)), capo: 0, label: `Root on A string · fret ${f}` }); }
  const ct = CHORD_TYPES.find((c) => c.id === q); const key = (f) => f.join(",");
  if (ct) findVoicings(root, ct.iv, 4).forEach((f) => { if (!out.some((o) => key(o.frets) === key(f))) { const fr = f.filter((x) => x > 0); const base = fr.length ? Math.min(...fr) : 0; out.push({ cat: f.some((x) => x === 0) && base <= 3 ? "Open" : "Shape", frets: f, capo: 0, label: base > 1 ? `Around fret ${base}` : "Open position" }); } });
  capoOptions(root, q).filter((o) => o.capo > 0 && o.capo <= 7).slice(0, 3).forEach((o) => out.push({ cat: "Capo", frets: o.frets, capo: o.capo, label: `Capo ${o.capo} · ${o.shape} shape` }));
  return out;
}
const KEY_SETS = [["triads", "Triads"], ["sevenths", "7th chords"], ["colour", "Worship colours"]];
const keyChords = (key, set) => {
  const degs = DIATONIC.degs; const tri = DIATONIC.q; const sev = ["maj7", "m7", "m7", "maj7", "7", "m7", "m7b5"];
  if (set === "triads") return degs.map((d, i) => ({ num: ["1", "2", "3", "4", "5", "6", "7"][i] + (tri[i] === "m" ? "m" : tri[i] === "dim" ? "°" : ""), root: (key + d) % 12, q: tri[i] }));
  if (set === "sevenths") return degs.map((d, i) => ({ num: ["1", "2", "3", "4", "5", "6", "7"][i] + sev[i].replace("maj7", "maj7"), root: (key + d) % 12, q: sev[i] }));
  return [[0, "sus2"], [0, "add9"], [0, "sus4"], [3, "add9"], [3, "sus2"], [4, "sus4"], [4, "7"], [5, "m7"], [1, "m7"], [0, "6"]].map(([i, q]) => ({ num: String(i + 1) + q, root: (key + degs[i]) % 12, q }));
};
function VoicingRow({ root, q, num }) {
  const { T } = useApp();
  const vs = chordVoicings(root, q); const [sel, setSel] = useState(0); const [guide, setGuide] = useState(false);
  const v = vs[sel]; const name = NOTE_NAMES[root] + q;
  return (
    <Card pad={12} style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div style={{ minWidth: 40, height: 32, padding: "0 8px", borderRadius: 10, background: T.accent, color: T.accentText, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 13 }}>{num}</div>
        <div style={{ flex: 1, fontWeight: 800, fontSize: 17 }}>{name}</div>
        {v && <Btn small variant="soft" icon={Play} onClick={() => strumShape(v.frets, "acoustic", v.capo)}>Strum</Btn>}
      </div>
      {!vs.length && <div style={{ fontSize: 12, color: T.sub }}>No common box shape — use the fretboard map.</div>}
      <div className="bz-noscroll" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {vs.map((x, i) => (
          <div key={i} onClick={() => { setSel(i); strumShape(x.frets, "acoustic", x.capo); }} className="bz-press" style={{ flexShrink: 0, width: 112, padding: "6px 4px", borderRadius: 14, border: `1.5px solid ${i === sel ? T.accent : T.border}`, background: i === sel ? T.soft : "transparent", textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 0.5, color: x.cat === "Open" ? T.good : x.cat === "Capo" ? T.pop || T.accent : T.accent }}>{x.cat.toUpperCase()}</div>
            <ChordBox frets={x.frets} name={x.capo ? `${name}` : name} capo={x.capo} width={100} />
            <div style={{ fontSize: 9.5, color: T.sub, lineHeight: 1.25 }}>{x.label}</div>
          </div>
        ))}
      </div>
      {v && <button onClick={() => setGuide((g) => !g)} style={{ marginTop: 6, background: "none", border: "none", color: T.accent, fontFamily: FONT, fontWeight: 700, fontSize: 12, cursor: "pointer", padding: 0 }}>{guide ? "Hide" : "Show"} finger guide ({v.cat})</button>}
      {v && guide && <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.7 }}>{fingerGuide(v.frets, v.capo).map((g) => <div key={g.s} style={{ display: "flex", gap: 8 }}><span style={{ width: 92, color: T.sub, fontWeight: 700, flexShrink: 0 }}>{g.s}</span><span>{g.txt}</span></div>)}</div>}
    </Card>
  );
}
const CHORD_GROUPS = [["Triads", ["", "m", "dim", "aug", "sus2", "sus4", "5"]], ["6ths & adds", ["6", "m6", "add9", "madd9", "69"]], ["7th chords", ["7", "maj7", "m7", "m7b5", "dim7", "7sus4", "mmaj7", "aug7"]], ["Extended & altered", ["9", "maj9", "m9", "11", "13", "7b9", "7#9"]]];
function ChordTile({ root, q }) {
  const { T } = useApp(); const vs = useMemo(() => chordVoicings(root, q), [root, q]); const [k, setK] = useState(0);
  const v = vs[Math.min(k, vs.length - 1)]; const name = NOTE_NAMES[root] + q; const ct = CHORD_TYPES.find((c) => c.id === q);
  if (!v) return null;
  return (
    <Card pad={8} style={{ textAlign: "center" }}>
      <div onClick={() => strumShape(v.frets, "acoustic", v.capo)} className="bz-press" style={{ cursor: "pointer" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: T.sub, letterSpacing: 0.5 }}>{(ct ? ct.name : q).toUpperCase()}</div>
        <ChordBox frets={v.frets} name={name} capo={v.capo} width={118} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
        <button onClick={() => setK((x) => (x - 1 + vs.length) % vs.length)} style={{ background: "none", border: "none", color: T.text, cursor: "pointer", padding: 4 }}><ChevronLeft size={16} noBlob /></button>
        <div style={{ fontSize: 9.5, color: T.sub, lineHeight: 1.2 }}>{v.cat} · {Math.min(k, vs.length - 1) + 1}/{vs.length}</div>
        <button onClick={() => setK((x) => (x + 1) % vs.length)} style={{ background: "none", border: "none", color: T.text, cursor: "pointer", padding: 4 }}><ChevronRight size={16} noBlob /></button>
      </div>
    </Card>
  );
}
function AllChords() {
  const { T } = useApp(); const [root, setRoot] = useState(0);
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, margin: "14px 2px 8px" }}>ROOT</div>
      <KeyChips value={root} onChange={setRoot} />
      <Card tone="soft" style={{ margin: "12px 0", fontSize: 12, lineHeight: 1.5 }}>Every chord type on <b>{NOTE_NAMES[root]}</b> — {CHORD_GROUPS.reduce((n, g) => n + g[1].length, 0)} chords. Tap a diagram to hear it, use ‹ › for more ways to play it. Dot numbers = fingers (1 index · 2 middle · 3 ring · 4 pinky).</Card>
      {CHORD_GROUPS.map(([gname, ids]) => (
        <div key={gname}>
          <SectionTitle>{gname}</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>{ids.filter((q) => CHORD_TYPES.some((c) => c.id === q)).map((q) => <ChordTile key={root + q} root={root} q={q} />)}</div>
        </div>
      ))}
    </div>
  );
}
function GuitarShapes({ embedded, tab: t0, q: q0 }) {
  const { T } = useApp();
  useEffect(() => { AE.load("acoustic"); }, []);
  const [tab, setTab] = useState(t0 || "all");
  const [root, setRoot] = useState(7);
  const [q, setQ] = useState(q0 || "");
  const [songKey, setSongKey] = useState(9);
  const [bk, setBk] = useState(0); const [bset, setBset] = useState("triads");
  const opts = capoOptions(root, q);
  const barre = guitarShape(root, q);
  const name = NOTE_NAMES[root] + q;
  return (
    <div>
      <ToolBar embedded={embedded} title="Guitar Shapes & Capo" sub="Every chord with and without capo" />
      <Seg value={tab} onChange={setTab} options={[{ value: "all", label: "All chords" }, { value: "bykey", label: "By key" }, { value: "capo", label: "Capo" }, { value: "barre", label: "Barre" }]} />
      {tab === "all" && <AllChords />}
      {tab === "bykey" && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, margin: "14px 2px 8px" }}>KEY</div>
          <KeyChips value={bk} onChange={setBk} />
          <div style={{ marginTop: 10 }}><Seg value={bset} onChange={setBset} options={KEY_SETS.map(([v, l]) => ({ value: v, label: l }))} /></div>
          <Card tone="soft" style={{ margin: "12px 0", fontSize: 12, lineHeight: 1.5 }}>Every chord in <b>{NOTE_NAMES[bk]} major</b>. Swipe each row for every way to play it: <b style={{ color: T.good }}>Open</b>, <b>E-shape barre</b> (root on low E), <b>A-shape barre</b> (root on A) and <b>Capo</b> shapes. Numbers on the dots = fingers (1 index · 2 middle · 3 ring · 4 pinky). Tap a diagram to hear it.</Card>
          {keyChords(bk, bset).map((c) => <VoicingRow key={bk + bset + c.num} root={c.root} q={c.q} num={c.num} />)}
        </>
      )}
      {(tab === "shapes" || tab === "barre") && (
        <>
          <div style={{ marginTop: 12 }}><KeyChips value={root} onChange={setRoot} /></div>
          <Scroller style={{ marginTop: 8 }}>{SHAPE_QUALS.map(([v, l]) => <Chip key={l} active={q === v} onClick={() => setQ(v)}>{l}</Chip>)}</Scroller>
        </>
      )}
      {tab === "shapes" && (
        <>
          <Card tone="hero" style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><div style={{ fontFamily: headFont(T), fontSize: 34 }}>{name}</div><div style={{ fontSize: 12.5, opacity: 0.85 }}>{opts.length} capo option{opts.length === 1 ? "" : "s"}{barre ? " · barre shape" : ""}</div></div>
            <IconBubble icon={Guitar} tone="accent" size={50} />
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
            {opts.map((o) => (
              <Card key={o.shape + o.capo} pad={10} onClick={() => strumShape(o.frets, "acoustic", o.capo)} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: o.capo === 0 ? T.good : T.accent }}>{o.capo === 0 ? "NO CAPO" : `CAPO ${o.capo}`}</div>
                <div style={{ display: "grid", placeItems: "center" }}><ChordBox frets={o.frets} name={`${o.shape} shape`} capo={o.capo} /></div>
                <div style={{ fontSize: 11, color: T.sub }}>Tap to hear</div>
              </Card>
            ))}
            {barre && (
              <Card pad={10} tone="soft" onClick={() => strumShape(barre.frets)} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800 }}>{barre.label.toUpperCase()}</div>
                <div style={{ display: "grid", placeItems: "center" }}><ChordBox frets={barre.frets} name={name} /></div>
                <div style={{ fontSize: 11, opacity: 0.75 }}>Tap to hear</div>
              </Card>
            )}
          </div>
          {opts.length === 0 && !barre && <Card tone="soft" style={{ marginTop: 10, fontSize: 13 }}>No common box shape for this chord — use the fretboard map in the Chord Library.</Card>}
          <SectionTitle>Every way to play {name}</SectionTitle>
          <VoicingRow key={root + q} root={root} q={q} num={name} />
        </>
      )}
      {tab === "capo" && (
        <>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, margin: "14px 2px 8px" }}>THE KEY THE SINGER NEEDS</div>
          <KeyChips value={songKey} onChange={setSongKey} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {[["G", 7], ["C", 0], ["D", 2], ["A", 9], ["E", 4]].map(([sh, pc]) => {
              const capo = (songKey - pc + 12) % 12; const ok = capo <= 9;
              const chords = [0, 3, 4, 5].map((d) => NOTE_NAMES[(pc + DIATONIC.degs[d]) % 12] + (d === 5 ? "m" : ""));
              return (
                <Card key={sh} pad={12} style={{ opacity: ok ? 1 : 0.45 }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 62, textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 800 }}>{capo === 0 ? "—" : capo}</div><div style={{ fontSize: 10, color: T.sub, fontWeight: 700 }}>{capo === 0 ? "NO CAPO" : "CAPO"}</div></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{sh} shapes</div>
                    <div style={{ fontSize: 12, color: T.sub }}>1 4 5 6m = {chords.join(" · ")}</div>
                  </div>
                  <Btn small variant="soft" icon={Play} onClick={() => { const fam = [OPEN_SHAPES[chords[0]], OPEN_SHAPES[chords[3]], OPEN_SHAPES[chords[1]], OPEN_SHAPES[chords[2]]]; fam.forEach((f, k) => f && setTimeout(() => strumShape(f, "acoustic", capo), k * 900)); }} />
                </div>
                  {ok && <div className="bz-noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 10 }}>{chords.map((c, k) => { const f = OPEN_SHAPES[c] || (guitarShape(NOTE_NAMES.indexOf(c.replace(/m$/, "")), c.endsWith("m") ? "m" : "") || {}).frets; const sounds = NOTE_NAMES[(songKey + DIATONIC.degs[[0, 3, 4, 5][k]]) % 12] + (k === 3 ? "m" : ""); return f ? <div key={c} onClick={() => strumShape(f, "acoustic", capo)} className="bz-press" style={{ flexShrink: 0, textAlign: "center", cursor: "pointer" }}><ChordBox frets={f} name={`${c} shape`} capo={capo} width={96} /><div style={{ fontSize: 10.5, color: T.sub, fontWeight: 700 }}>{["1", "4", "5", "6m"][k]} · sounds {sounds}</div></div> : null; })}</div>}
                </Card>
              );
            })}
          </div>
          <Card tone="soft" style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55 }}>Two guitarists? One plays G shapes, the other D or A shapes higher up with a capo — same key, bigger sound.</Card>
        </>
      )}
      {tab === "barre" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 12 }}>
          {NOTE_NAMES.map((n, r) => { const b = guitarShape(r, q); if (!b) return null; return (
            <Card key={n} pad={6} onClick={() => strumShape(b.frets)} style={{ textAlign: "center" }}>
              <div style={{ display: "grid", placeItems: "center", transform: "scale(0.86)", margin: "-8px 0" }}><ChordBox frets={b.frets} name={n + q} /></div>
              <div style={{ fontSize: 10, color: T.sub, fontWeight: 600 }}>{b.label.replace(" barre", "")}</div>
            </Card>
          ); })}
        </div>
      )}
      {!embedded && <MarkComplete id="shapes" label="Guitar shapes" mins={5} />}
    </div>
  );
}

/* ---------------- STRUMMING LAB ---------------- */
const STRUMS = [
  { id: "quarters", name: "Quarter notes", slots: "D-D-D-D-", meter: 4, sub: 2 },
  { id: "eighths", name: "Straight 8ths", slots: "DUDUDUDU", meter: 4, sub: 2 },
  { id: "folk", name: "Folk / worship", slots: "D-DU-UDU", meter: 4, sub: 2 },
  { id: "chuck", name: "Chuck on 2 & 4", slots: "DUXUDUXU", meter: 4, sub: 2 },
  { id: "push", name: "Push on the & of 4", slots: "D-DU-UD-", meter: 4, sub: 2, push: true },
  { id: "six8", name: "6/8 sway", slots: "D-UD-U", meter: 2, sub: 3 },
  { id: "island", name: "Island / reggae", slots: "-U-U-U-U", meter: 4, sub: 2 },
  { id: "sixteen", name: "16th worship drive", slots: "D-DU-UDUD-DU-UDU", meter: 4, sub: 4 },
];
function StrumLab({ embedded, pattern: p0, locked }) {
  const { T } = useApp();
  useEffect(() => { AE.load("acoustic"); }, []);
  const [p, setP] = useState(STRUMS.find((x) => x.id === p0) || STRUMS[2]);
  const [key, setKey] = useState(7);
  const [bpm, setBpm] = useState(76);
  const [run, setRun] = useState(false);
  const [i, setI] = useState(-1);
  const [click, setClick] = useState(true);
  const prog = [0, 4, 5, 3];
  const chordAt = (bar) => { const d = prog[bar % 4]; const r = (key + DIATONIC.degs[d]) % 12; const q = DIATONIC.q[d]; const sh = guitarShape(r, q === "m" ? "m" : "") || { frets: [-1, -1, 0, 2, 3, 2] }; return { name: NOTE_NAMES[r] + q, frets: sh.frets }; };
  const n = p.slots.length; const stepMs = (60 / bpm / p.sub) * 1000;
  useLoop(run, stepMs, (k) => {
    const idx = k % n; const bar = Math.floor(k / n); setI(k);
    if (click && idx % p.sub === 0) AE.click(idx === 0);
    const c = chordAt(bar); const notes = c.frets.map((f, s) => (f < 0 ? null : GUITAR_TUNING[s] + f)).filter((x) => x != null);
    const ch = p.slots[idx];
    if (ch === "D") AE.strum(notes, "down", 0, idx === 0 ? 0.9 : 0.7, "acoustic", stepMs / 1000 * 2.2);
    else if (ch === "U") AE.strum(notes.slice(-4), "up", 0, 0.5, "acoustic", stepMs / 1000 * 1.6);
    else if (ch === "X") { AE.strum(notes, "down", 0, 0.45, "acoustic", 0.04); AE.hit("snare", 0, 0.12); }
  }, [p, key, click]);
  const pos = i < 0 ? -1 : i % n; const bar = i < 0 ? 0 : Math.floor(i / n);
  const arrow = (c) => (c === "D" ? "↓" : c === "U" ? "↑" : c === "X" ? "✕" : "·");
  return (
    <div>
      <ToolBar embedded={embedded} title="Strumming Lab" sub="Real acoustic guitar · 1–5–6–4" />
      <Scroller>{(locked ? STRUMS.filter((x) => x.id === p.id) : STRUMS).map((x) => <Chip key={x.id} active={x.id === p.id} onClick={() => setP(x)}>{x.name}</Chip>)}</Scroller>
      <Card tone="hero" style={{ marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: headFont(T), fontSize: 24 }}>{p.name}</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{chordAt(bar).name}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 4, marginTop: 12 }}>
          {p.slots.split("").map((c, k) => (
            <div key={k} style={{ height: 54, borderRadius: 12, display: "grid", placeItems: "center", fontSize: c === "-" ? 18 : 26, fontWeight: 900, background: pos === k ? T.accent : "rgba(255,255,255,0.12)", color: pos === k ? T.accentText : c === "X" ? "#FF8A00" : "inherit", transform: pos === k ? "scale(1.08)" : "none", transition: "transform .06s" }}>{arrow(c)}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 4, marginTop: 4 }}>
          {p.slots.split("").map((_, k) => <div key={k} style={{ textAlign: "center", fontSize: 10, opacity: 0.7, fontWeight: 700 }}>{p.sub === 2 ? (k % 2 ? "&" : k / 2 + 1) : p.sub === 4 ? ["", "e", "&", "a"][k % 4] || Math.floor(k / 4) + 1 : (k % 3 === 0 ? k / 3 * 3 + 1 : k + 1)}</div>)}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn full variant={run ? "light" : "accent"} icon={run ? Square : Play} onClick={() => { setRun((r) => !r); setI(-1); }}>{run ? "Stop" : "Strum along"}</Btn>
        </div>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <Slider label="Tempo" value={bpm} min={50} max={150} onChange={setBpm} fmt={(v) => `${v} bpm`} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Click</span><Toggle on={click} onChange={setClick} /></div>
        <KeyChips value={key} onChange={setKey} />
      </Card>
      <Card tone="soft" style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55 }}>↓ down · ↑ up · ✕ muted chuck · · keep the hand moving but miss the strings. The pendulum never stops.</Card>
      {!embedded && <MarkComplete id="strum" label="Strumming" mins={6} />}
    </div>
  );
}

/* ---------------- ONE-MINUTE CHORD CHANGES ---------------- */
const CHANGE_CHORDS = ["G", "C", "D", "Em", "Am", "E", "A", "Dm", "Cadd9", "Dsus4", "Em7", "Asus2", "Bm", "F"];
const PC_OF = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 };
const chordPcs = (name) => { const m = name.match(/^([A-G][#b]?)(.*)$/); if (!m) return []; const r = PC_OF[m[1]]; const ct = CHORD_TYPES.find((c) => c.id === m[2]) || CHORD_TYPES[0]; return ct.iv.map((x) => (r + x) % 12); };
/* listens through the mic and reports which of the given chords is ringing (chroma matching) */
function useChordMic(on, names, onHear) {
  const [level, setLevel] = useState(0); const [heard, setHeard] = useState(null); const [err, setErr] = useState("");
  const cb = useRef(onHear); cb.current = onHear; const nm = useRef(names); nm.current = names;
  useEffect(() => {
    if (!on) { setHeard(null); setLevel(0); return; } let stream, raf, ctx, stop = false; let stable = { n: null, k: 0 }; let lastFire = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }); if (stop) return;
        ctx = AE.get(); const src = ctx.createMediaStreamSource(stream); const an = ctx.createAnalyser(); an.fftSize = 8192; an.smoothingTimeConstant = 0.5; src.connect(an);
        const buf = new Float32Array(an.frequencyBinCount); const binHz = ctx.sampleRate / an.fftSize;
        const loop = () => {
          an.getFloatFrequencyData(buf); const chroma = new Array(12).fill(0); let energy = 0;
          for (let i = Math.floor(75 / binHz); i < Math.min(buf.length, Math.floor(1400 / binHz)); i++) { const mag = Math.pow(10, buf[i] / 20); energy += mag; const midi = 69 + 12 * Math.log2((i * binHz) / 440); const pc = ((Math.round(midi) % 12) + 12) % 12; chroma[pc] += mag * mag; }
          const lv = Math.min(1, energy * 4); setLevel(lv);
          const tot = Math.sqrt(chroma.reduce((a, b) => a + b * b, 0)) || 1; const c = chroma.map((x) => x / tot);
          let best = null, bs = 0, second = 0;
          nm.current.forEach((n) => { const pcs = chordPcs(n); const t = new Array(12).fill(0); pcs.forEach((p, i) => (t[p] = i === 0 ? 1 : 0.8)); const tn = Math.sqrt(t.reduce((a, b) => a + b * b, 0)); const sim = t.reduce((a, v, i) => a + (v / tn) * c[i], 0); if (sim > bs) { second = bs; bs = sim; best = n; } else if (sim > second) second = sim; });
          const ok = lv > 0.04 && bs > 0.62 && bs - second > 0.04;
          if (ok && best === stable.n) stable.k++; else stable = { n: ok ? best : null, k: ok ? 1 : 0 };
          if (stable.k === 4) { setHeard(best); if (best !== lastFire) { lastFire = best; cb.current && cb.current(best); } }
          raf = requestAnimationFrame(loop);
        };
        loop();
      } catch (e) { setErr("Microphone not available — allow mic access, or use the TAP button."); }
    })();
    return () => { stop = true; cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, [on]); // eslint-disable-line
  return { level, heard, err };
}
function ChangeTrainer({ embedded, a: a0, b: b0 }) {
  const { T, logPractice } = useApp();
  useEffect(() => { AE.load("acoustic"); }, []);
  const [a, setA] = useState(a0 || "G");
  const [b, setB] = useState(b0 || "C");
  const [left, setLeft] = useState(60);
  const [run, setRun] = useState(false);
  const [count, setCount] = useState(0);
  const [hist, setHist] = useState({});
  const [bpm, setBpm] = useState(60);
  const fr = (n) => OPEN_SHAPES[n] || (guitarShape(NOTE_NAMES.indexOf(n.replace(/m$/, "")), n.endsWith("m") ? "m" : "") || {}).frets || [-1, -1, -1, -1, -1, -1];
  useEffect(() => { if (!run) return; const iv = setInterval(() => setLeft((l) => l - 1), 1000); return () => clearInterval(iv); }, [run]);
  useEffect(() => { if (!run) return; let k = 0; const iv = setInterval(() => { AE.click(k % 4 === 0); k++; }, 60000 / bpm); return () => clearInterval(iv); }, [run, bpm]);
  const pairKey = `${a}↔${b}`;
  useEffect(() => { if (run && left <= 0) { setRun(false); setHist((h) => ({ ...h, [pairKey]: [...(h[pairKey] || []), count] })); logPractice(1, "Chord changes"); } }, [left]); // eslint-disable-line
  const best = Math.max(0, ...(hist[pairKey] || [0]));
  const onChord = count % 2 === 0 ? a : b;
  const [mic, setMic] = useState(true);
  const countRef = useRef(0); countRef.current = count;
  const { level, heard, err } = useChordMic(run && mic, [a, b], (n) => { const target = countRef.current % 2 === 0 ? b : a; if (n === target) setCount((c) => c + 1); });
  return (
    <div>
      <ToolBar embedded={embedded} title="One-Minute Changes" sub="Play — the mic counts every clean change" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[[a, setA], [b, setB]].map(([v, set], k) => (
          <Card key={k} pad={10} tone={run && onChord === v ? "accent" : "card"} style={{ textAlign: "center" }}>
            <div style={{ display: "grid", placeItems: "center" }}><ChordBox frets={fr(v)} name={v} /></div>
            <Scroller style={{ marginTop: 6 }}>{CHANGE_CHORDS.map((c) => <Chip key={c} active={v === c} onClick={() => !run && set(c)} style={{ padding: "4px 9px", fontSize: 11 }}>{c}</Chip>)}</Scroller>
          </Card>
        ))}
      </div>
      <Card tone="hero" style={{ marginTop: 12, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div><div style={{ fontSize: 40, fontWeight: 800 }}>{left}s</div><div style={{ fontSize: 11, opacity: 0.75 }}>TIME</div></div>
          <div><div style={{ fontSize: 40, fontWeight: 800 }}>{count}</div><div style={{ fontSize: 11, opacity: 0.75 }}>CHANGES</div></div>
          <div><div style={{ fontSize: 40, fontWeight: 800 }}>{best}</div><div style={{ fontSize: 11, opacity: 0.75 }}>BEST</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 }}>
          <Chip active={mic} onClick={() => !run && setMic((m) => !m)}>🎙️ Mic listening {mic ? "ON" : "OFF"}</Chip>
        </div>
        {run && mic && (
          <div style={{ marginTop: 10 }}>
            <div style={{ height: 6, borderRadius: 6, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}><div style={{ width: `${level * 100}%`, height: "100%", background: "#7CFFB2", transition: "width .08s" }} /></div>
            <div style={{ fontSize: 12.5, marginTop: 6, fontWeight: 700 }}>{err || (heard ? `Hearing: ${heard} · next change → ${count % 2 === 0 ? b : a}` : `Strum ${onChord} — I'm listening…`)}</div>
          </div>
        )}
        {run ? (
          <button onClick={() => { setCount((c) => c + 1); if (!mic) strumShape(fr(count % 2 === 0 ? b : a)); }} className="bz-press" style={{ width: "100%", marginTop: 14, padding: "22px 0", borderRadius: 22, border: "none", background: T.accent, color: T.accentText, fontFamily: FONT, fontWeight: 800, fontSize: 18, cursor: "pointer" }}>TAP each clean change → {count % 2 === 0 ? b : a}</button>
        ) : <Btn full variant="accent" icon={Play} style={{ marginTop: 14 }} onClick={() => { AE.get(); setCount(0); setLeft(60); setRun(true); }}>Start 60 seconds</Btn>}
      </Card>
      <Card style={{ marginTop: 12 }}>
        <Slider label="Click" value={bpm} min={40} max={140} onChange={setBpm} fmt={(v) => `${v} bpm`} />
        {Object.keys(hist).length > 0 && <div style={{ fontSize: 12.5, color: T.sub }}>{Object.entries(hist).map(([k, v]) => `${k}: ${v.join(", ")}`).join("  ·  ")}</div>}
      </Card>
    </div>
  );
}

/* ---------------- BASS LAB (bass + drums over progressions) ---------------- */
const BASS_PATTERNS = [
  { id: "roots8", name: "Root 8ths", desc: "Steady 8ths on the root.", slots: [0, 0, 0, 0, 0, 0, 0, 0] },
  { id: "kicklock", name: "Lock with the kick", desc: "Bass plays exactly with the kick.", slots: [0, null, null, 0, 0, null, 0, null], kick: [0, 3, 4, 6] },
  { id: "r58", name: "Root–5–8", desc: "Movement without clutter.", slots: [0, null, 0, 7, null, 12, 7, null] },
  { id: "approach", name: "Approach notes", desc: "Last note leads a half step into the next root.", slots: [0, null, 0, 0, null, 0, 0, "ap"] },
  { id: "pedal", name: "Pedal tone build", desc: "Hold the key's root while chords move above.", slots: ["p", "p", "p", "p", "p", "p", "p", "p"] },
  { id: "six8", name: "6/8 bounce", desc: "Roots on 1 and 4 with a pickup on 6.", slots: [0, null, null, 0, null, 7], meter68: true },
];
function BassLab({ embedded, pattern: p0, songKey: k0, locked }) {
  const { T } = useApp();
  useEffect(() => { AE.load("bass"); }, []);
  const [p, setP] = useState(BASS_PATTERNS.find((x) => x.id === p0) || BASS_PATTERNS[0]);
  const [key, setKey] = useState(k0 ?? 7);
  const [bpm, setBpm] = useState(84);
  const [run, setRun] = useState(false);
  const [i, setI] = useState(-1);
  const [drums, setDrums] = useState(true);
  const prog = [0, 4, 5, 3];
  const rootAt = (bar) => { const d = prog[bar % 4]; const r = (key + DIATONIC.degs[d]) % 12; return { r, name: NOTE_NAMES[r] + DIATONIC.q[d] }; };
  const n = p.slots.length; const stepMs = (60 / bpm / (p.meter68 ? 3 : 2)) * 1000;
  const low = (pc) => 28 + ((pc - 4 + 12) % 12);
  useLoop(run, stepMs, (k) => {
    const idx = k % n; const bar = Math.floor(k / n); setI(k);
    const c = rootAt(bar); const nxt = rootAt(bar + 1); const s = p.slots[idx];
    let m = null; if (s === "ap") m = low(nxt.r) - 1 + (low(nxt.r) - 1 < 28 ? 12 : 0); else if (s === "p") m = low(key); else if (s != null) m = low(c.r) + s;
    if (m != null) AE.play("bass", m, (stepMs / 1000) * 0.9, 0, idx === 0 ? 0.95 : 0.75);
    if (drums) {
      if (p.meter68) { if (idx === 0) AE.kick(); if (idx === 3) AE.snare(0, 0.7); AE.hat(0, false, 0.3); }
      else { const kick = p.kick || [0, 4]; if (kick.includes(idx)) AE.kick(); if (idx === 2 || idx === 6) AE.snare(0, 0.75); AE.hat(0, false, 0.32); }
    }
  }, [p, key, drums]);
  const bar = i < 0 ? 0 : Math.floor(i / n); const pos = i < 0 ? -1 : i % n;
  return (
    <div>
      <ToolBar embedded={embedded} title="Bass Lab" sub="Real bass + drums · lock the groove" />
      <Scroller>{(locked ? BASS_PATTERNS.filter((x) => x.id === p.id) : BASS_PATTERNS).map((x) => <Chip key={x.id} active={x.id === p.id} onClick={() => setP(x)}>{x.name}</Chip>)}</Scroller>
      <Card tone="hero" style={{ marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div><div style={{ fontFamily: headFont(T), fontSize: 22 }}>{p.name}</div><div style={{ fontSize: 12.5, opacity: 0.85 }}>{p.desc}</div></div>
          <div style={{ fontSize: 30, fontWeight: 800 }}>{rootAt(bar).name}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, 1fr)`, gap: 4, marginTop: 12 }}>
          {p.slots.map((s, k) => <div key={k} style={{ height: 40, borderRadius: 10, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, background: pos === k ? T.accent : s == null ? "transparent" : "rgba(255,255,255,0.14)", color: pos === k ? T.accentText : "inherit", border: s == null ? "1px dashed rgba(255,255,255,0.25)" : "none" }}>{s == null ? "" : s === "ap" ? "→" : s === "p" ? "P" : s === 0 ? "R" : s === 7 ? "5" : "8"}</div>)}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn full variant={run ? "light" : "accent"} icon={run ? Square : Play} onClick={() => { setRun((r) => !r); setI(-1); }}>{run ? "Stop" : "Play groove"}</Btn>
        </div>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <Slider label="Tempo" value={bpm} min={50} max={150} onChange={setBpm} fmt={(v) => `${v} bpm`} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Drums</span><Toggle on={drums} onChange={setDrums} /></div>
        <KeyChips value={key} onChange={setKey} />
      </Card>
      <Card style={{ marginTop: 12, padding: 12 }}><Fretboard tuning={BASS_TUNING} pcs={[rootAt(bar).r, rootAt(bar).r + 7]} rootPc={rootAt(bar).r} labelMode="deg" /></Card>
      {!embedded && <MarkComplete id="basslab" label="Bass Lab" mins={8} />}
    </div>
  );
}

/* ---------------- RUDIMENT TRAINER ---------------- */
const RUDIMENTS = [
  { id: "singles", name: "Single stroke roll", st: "RLRLRLRLRLRLRLRL", sub: 4 },
  { id: "doubles", name: "Double stroke roll", st: "RRLLRRLLRRLLRRLL", sub: 4 },
  { id: "paradiddle", name: "Paradiddle", st: "RlrrLrllRlrrLrll", sub: 4 },
  { id: "dbl", name: "Double paradiddle", st: "RlrlrrLrlrll", sub: 3 },
  { id: "trip", name: "Triplets", st: "RlrLrlRlrLrl", sub: 3 },
  { id: "six", name: "Six-stroke roll", st: "RllrrLRllrrL", sub: 3 },
  { id: "accent", name: "Accent tap (1 of 4)", st: "RlrlLrlrRlrlLrlr", sub: 4 },
  { id: "flamtap", name: "Flam taps", st: "fRrfLlfRrfLl", sub: 3 },
];
function RudimentTrainer({ embedded, r: r0 }) {
  const { T } = useApp();
  const [r, setR] = useState(RUDIMENTS.find((x) => x.id === r0) || RUDIMENTS[0]);
  const [bpm, setBpm] = useState(70);
  const [run, setRun] = useState(false);
  const [i, setI] = useState(-1);
  const [ramp, setRamp] = useState(false);
  const stepMs = (60 / bpm / r.sub) * 1000;
  useLoop(run, stepMs, (k) => {
    const idx = k % r.st.length; setI(idx); const c = r.st[idx];
    if (idx % r.sub === 0) AE.click(idx === 0);
    if (c === "f") { AE.snare(0, 0.2, -0.3); AE.snare(0.025, 0.9, 0.3); }
    else { const acc = c === c.toUpperCase(); const left = c.toLowerCase() === "l"; AE.snare(0, acc ? 0.95 : 0.4, left ? -0.45 : 0.45); }
    if (ramp && idx === r.st.length - 1 && k > 0 && (k + 1) % (r.st.length * 2) === 0) setBpm((b) => Math.min(200, b + 4));
  }, [r, ramp]);
  return (
    <div>
      <ToolBar embedded={embedded} title="Rudiment Trainer" sub="Real snare · left/right panned · accents" />
      <Scroller>{RUDIMENTS.map((x) => <Chip key={x.id} active={x.id === r.id} onClick={() => { setR(x); setI(-1); }}>{x.name}</Chip>)}</Scroller>
      <Card tone="hero" style={{ marginTop: 10 }}>
        <div style={{ fontFamily: headFont(T), fontSize: 22 }}>{r.name}</div>
        <div style={{ fontSize: 12.5, opacity: 0.8 }}>CAPITAL = accent · f = flam · {bpm} bpm</div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${r.sub === 4 ? 8 : 6}, 1fr)`, gap: 5, marginTop: 12 }}>
          {r.st.split("").map((c, k) => (
            <div key={k} style={{ height: 44, borderRadius: 12, display: "grid", placeItems: "center", fontWeight: 900, fontSize: c === c.toUpperCase() && c !== "f" ? 20 : 15, background: i === k ? T.accent : c.toLowerCase() === "l" ? "rgba(34,228,255,0.18)" : "rgba(255,62,165,0.2)", color: i === k ? T.accentText : "inherit" }}>{c === "f" ? "f" : c.toUpperCase()}</div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn full variant={run ? "light" : "accent"} icon={run ? Square : Play} onClick={() => { setRun((x) => !x); setI(-1); }}>{run ? "Stop" : "Play along"}</Btn>
        </div>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <Slider label="Tempo" value={bpm} min={40} max={200} onChange={setBpm} fmt={(v) => `${v} bpm`} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 13, fontWeight: 600 }}>Tempo ramp (+4 every 2 loops)</span><Toggle on={ramp} onChange={setRamp} /></div>
      </Card>
      {!embedded && <MarkComplete id="rudiments" label="Rudiments" mins={6} />}
    </div>
  );
}

function DrumKitPads() {
  const { T } = useApp();
  const pads = [["Kick", () => AE.kick()], ["Snare", () => AE.snare()], ["Hi-hat", () => AE.hat()], ["Open hat", () => AE.hat(0, true)], ["Tom 1", () => AE.tom(0, 1)], ["Tom 2", () => AE.tom(0, 2)], ["Floor tom", () => AE.tom(0, 3)]];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
      {pads.map(([n, f], k) => <button key={n} onPointerDown={f} className="bz-press" style={{ height: 58, borderRadius: 16, border: "none", fontFamily: FONT, fontWeight: 700, fontSize: 12, cursor: "pointer", background: (T.spray || [T.accent])[k % (T.spray ? 6 : 1)], color: "#111" }}>{n}</button>)}
    </div>
  );
}
