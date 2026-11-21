
/* ============================ MUSICIAN TOOLS ============================ */
function ChordLibrary({ embedded, inst: i0, q: q0, root: r0 }) {
  const { T, user } = useApp();
  const rs = (user && user.roles) || [];
  const allowed = [rs.includes("keys") && "piano", (rs.includes("acoustic") || rs.includes("lead")) && "guitar", rs.includes("bass") && "bass"].filter(Boolean);
  const instOpts = allowed.length ? allowed : ["piano", "guitar", "bass"];
  const [root, setRoot] = useState(r0 ?? 0);
  const [q, setQ] = useState(q0 ?? "");
  const [inst, setInst] = useState(i0 && instOpts.includes(i0) ? i0 : instOpts[0]);
  useEffect(() => { if (inst === "guitar") AE.load("acoustic"); if (inst === "bass") AE.load("bass"); }, [inst]);
  const [inv, setInv] = useState(0);
  const [voicing, setVoicing] = useState("close");
  const [lbl, setLbl] = useState("note");
  const ct = CHORD_TYPES.find((c) => c.id === q);
  const maxInv = Math.min(ct.iv.length, 4) - 1; const useInv = Math.min(inv, maxInv);
  const voiced = voiceChord(48 + root, ct.iv, useInv, voicing);
  const name = NOTE_NAMES[root] + q; const slash = voiced[0] % 12 !== root ? `${name}/${nn(voiced[0])}` : name;
  const pStart = Math.floor(Math.min(...voiced) / 12) * 12; const pOct = Math.min(4, Math.ceil((Math.max(...voiced) - pStart + 1) / 12));
  const shape = guitarShape(root, q);
  const pcs = ct.iv.map((i) => root + i);
  const play = () => {
    if (inst === "guitar" && shape) AE.strum(shape.frets.map((f, s) => (f < 0 ? null : GUITAR_TUNING[s] + f)).filter((x) => x != null), "down", 0, 0.8, "acoustic", 2);
    else if (inst === "guitar") AE.strum(voiced.map((m) => m + 0), "down", 0, 0.8, "acoustic", 2);
    else if (inst === "bass") { const r = 28 + ((root - 4 + 12) % 12) + 12; AE.play("bass", r, 0.5); AE.play("bass", r + 7, 0.5, 0.45); AE.play("bass", r + 12, 0.8, 0.9); }
    else AE.chord(voiced, 1.6, 0);
  };
  return (
    <div>
      <ToolBar embedded={embedded} title="Chord Library" sub="Every chord · every key · inversions & voicings" />
      {instOpts.length > 1 && <Seg value={inst} onChange={setInst} options={instOpts.map((v) => ({ value: v, label: { piano: "Keys", guitar: "Guitar", bass: "Bass" }[v] }))} />}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, margin: "12px 0 8px" }}>
        {NOTE_NAMES.map((n, i) => <Chip key={n} active={root === i} onClick={() => setRoot(i)} style={{ padding: "7px 0" }}>{n}</Chip>)}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }} className="bz-noscroll">
        {CHORD_TYPES.map((c) => <Chip key={c.id || "maj"} active={q === c.id} onClick={() => { setQ(c.id); setInv(0); }}>{c.name}</Chip>)}
      </div>
      <Card tone="hero" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{slash}</div>
            <div style={{ fontSize: 12.5, opacity: 0.78, marginTop: 6 }}>Formula {ct.f} · Notes {pcs.map(nn).join(" ")}</div>
          </div>
          <button onClick={play} className="bz-press" style={{ width: 56, height: 56, borderRadius: 99, border: "none", background: T.pop, color: T.popText, display: "grid", placeItems: "center", cursor: "pointer" }}><Play size={24} fill="currentColor" /></button>
        </div>
      </Card>
      {inst === "piano" && (
        <>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.sub, margin: "0 2px 6px" }}>Inversion</div>
            <Seg value={useInv} onChange={setInv} options={["Root", "1st", "2nd", "3rd"].slice(0, maxInv + 1).map((l, i) => ({ value: i, label: l }))} />
            <div style={{ fontSize: 12, fontWeight: 600, color: T.sub, margin: "10px 2px 6px" }}>Voicing</div>
            <Seg value={voicing} onChange={setVoicing} options={[{ value: "close", label: "Close" }, { value: "open", label: "Open / Drop-2" }, { value: "spread", label: "Spread (LH bass)" }]} />
          </div>
          <Card style={{ marginTop: 12, padding: 12 }}>
            <Piano start={pStart} octaves={pOct} highlight={voiced} roots={voiced.filter((m) => m % 12 === root)} height={112} pcKeys showOctaveCtl />
            <div style={{ fontSize: 12, color: T.sub, marginTop: 8, textAlign: "center" }}>Bottom → top: {voiced.map(nnOct).join(" · ")}</div>
          </Card>
        </>
      )}
      {inst === "guitar" && (
        <Card style={{ marginTop: 12, padding: 12 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {shape ? <ChordBox frets={shape.frets} name={name} /> : <div style={{ width: 120, fontSize: 12, color: T.sub }}>No standard box shape — use the map below.</div>}
            <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.55 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{shape ? shape.label : "Fretboard map"}</div>
              {shape && <div style={{ color: T.sub }}>Frets (low→high): {shape.frets.map((f) => (f < 0 ? "x" : f)).join(" ")}</div>}
              <div style={{ color: T.sub, marginTop: 4 }}>Orange = root. Tap any dot on the map to hear it.</div>
            </div>
          </div>
          <Seg style={{ margin: "12px 0 8px" }} value={lbl} onChange={setLbl} options={[{ value: "note", label: "Note names" }, { value: "deg", label: "Intervals" }]} />
          <Fretboard pcs={pcs} rootPc={root} labelMode={lbl} />
        </Card>
      )}
      {inst === "bass" && (
        <Card style={{ marginTop: 12, padding: 12 }}>
          <Seg style={{ marginBottom: 8 }} value={lbl} onChange={setLbl} options={[{ value: "note", label: "Note names" }, { value: "deg", label: "Intervals" }]} />
          <Fretboard tuning={BASS_TUNING} pcs={pcs} rootPc={root} labelMode={lbl} />
          <div style={{ fontSize: 12.5, color: T.sub, marginTop: 8, lineHeight: 1.5 }}>Lock the <b>root</b> with the kick on beat 1. Use the <b>5th</b> and the octave to move, and the <b>3rd</b> to walk into the next chord.</div>
        </Card>
      )}
      <SectionTitle>Chords in the key of {NOTE_NAMES[root]}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
        {DIATONIC.degs.map((d, i) => {
          const r = (root + d) % 12; const qq = DIATONIC.q[i];
          return (
            <Card key={i} pad={8} onClick={() => { setRoot(r); setQ(qq); setInv(0); }} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{i + 1}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: T.sub }}>{NOTE_NAMES[r]}{qq === "dim" ? "°" : qq}</div>
            </Card>
          );
        })}
      </div>
      {!embedded && <MarkComplete id="chords" label="Chord Library" mins={8} />}
    </div>
  );
}

const PROGRESSIONS = [
  { n: "1 – 5 – 6 – 4", d: [0, 4, 5, 3], note: "The #1 worship progression." },
  { n: "1 – 4 – 5 – 1", d: [0, 3, 4, 0], note: "Classic hymn & gospel." },
  { n: "6 – 4 – 1 – 5", d: [5, 3, 0, 4], note: "Emotional, minor-feel bridges." },
  { n: "1 – 6 – 4 – 5", d: [0, 5, 3, 4], note: "Uplifting choruses." },
  { n: "4 – 1 – 5 – 6", d: [3, 0, 4, 5], note: "Starts away from home — builds tension." },
  { n: "2 – 5 – 1", d: [1, 4, 0, 0], note: "Gospel turnaround." },
];
function voiceLead(prev, pcs) {
  const cands = [];
  for (let base = 52; base <= 64; base++) {
    if (base % 12 !== pcs[0] % 12) continue;
    [0, 1, 2].forEach((inv) => cands.push(voiceChord(base, pcs.map((p) => ((p - pcs[0]) % 12 + 12) % 12), inv, "close")));
  }
  if (!prev) return cands.reduce((a, b) => (Math.abs(a[0] - 60) < Math.abs(b[0] - 60) ? a : b));
  const cost = (c) => c.reduce((s, m, i) => s + Math.abs(m - (prev[i] ?? prev[prev.length - 1])), 0);
  return cands.reduce((a, b) => (cost(a) <= cost(b) ? a : b));
}
function NumberSystem({ embedded }) {
  const { T, user } = useApp();
  const guitarist = user && user.roles && (user.roles.includes("acoustic") || user.roles.includes("lead")) && !user.roles.includes("keys");
  const [key, setKey] = useState(7);
  const [prog, setProg] = useState(PROGRESSIONS[0]);
  const [bpm, setBpm] = useState(72);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(-1);
  const triad = (i) => { const r = (key + DIATONIC.degs[i]) % 12; const q = DIATONIC.q[i]; const iv = q === "m" ? [0, 3, 7] : q === "dim" ? [0, 3, 6] : [0, 4, 7]; return { name: NOTE_NAMES[r] + (q === "dim" ? "°" : q), pcs: iv.map((x) => r + x), r }; };
  useEffect(() => {
    if (!playing) return; let i = 0, prev = null; AE.get();
    const step = () => {
      const c = triad(prog.d[i % prog.d.length]); const v = voiceLead(prev, c.pcs); prev = v;
      const b = 60 / bpm;
      if (guitarist) { const sh = guitarShape(c.r, DIATONIC.q[prog.d[i % prog.d.length]] === "m" ? "m" : DIATONIC.q[prog.d[i % prog.d.length]] === "dim" ? "dim" : ""); const ns = sh ? sh.frets.map((f, s) => (f < 0 ? null : GUITAR_TUNING[s] + f)).filter((x) => x != null) : v; const dirs = ["down", "down", "up", "up", "down", "up"]; [0, 1, 1.5, 2.5, 3, 3.5].forEach((t, k) => AE.strum(ns, dirs[k], t * b, k ? 0.55 : 0.85, "acoustic", b * 1.2)); }
      else { AE.chord(v, b * 3.6); }
      AE.play("bass", 28 + ((c.r - 4 + 12) % 12), b * 3.6, 0, 0.7); setCur(i % prog.d.length); i++;
    };
    step(); const iv = setInterval(step, (60 / bpm) * 4 * 1000);
    return () => { clearInterval(iv); setCur(-1); };
  }, [playing, key, prog, bpm]); // eslint-disable-line
  const capo = (() => { const shapes = [["G", 7], ["C", 0], ["D", 2], ["A", 9], ["E", 4]]; let best = null; shapes.forEach(([n, pc]) => { const c = (key - pc + 12) % 12; if (c <= 7 && (!best || c < best.c)) best = { n, c }; }); return best; })();
  return (
    <div>
      <ToolBar embedded={embedded} title="Number System & Progressions" sub={`Key of ${NOTE_NAMES[key]}`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginBottom: 12 }}>
        {NOTE_NAMES.map((n, i) => <Chip key={n} active={key === i} onClick={() => setKey(i)} style={{ padding: "7px 0" }}>{n}</Chip>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const c = triad(i); const active = cur >= 0 && prog.d[cur] === i;
          return (
            <Card key={i} pad={10} tone={active ? "accent" : i === 0 ? "hero" : "card"} onClick={() => AE.chord(voiceLead(null, c.pcs), 1.4)} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{i + 1}</div>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>{c.name} · {DIATONIC.roman[i]}</div>
            </Card>
          );
        })}
        <Card pad={10} tone="soft" style={{ textAlign: "center", display: "grid", placeItems: "center" }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, lineHeight: 1.3 }}>Capo {capo.c}<br />play {capo.n} shapes</div>
        </Card>
      </div>
      <SectionTitle>Progressions</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {PROGRESSIONS.map((p) => (
          <Card key={p.n} pad={12} tone={p.n === prog.n ? "soft" : "card"} onClick={() => setProg(p)} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{p.n}</div>
              <div style={{ fontSize: 12, color: T.sub }}>{p.d.map((i) => triad(i).name).join(" – ")} · {p.note}</div>
            </div>
            {p.n === prog.n && <Check size={18} />}
          </Card>
        ))}
      </div>
      <Card tone="hero" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
          {prog.d.map((i, k) => (
            <div key={k} style={{ flex: 1, padding: "10px 0", borderRadius: 14, textAlign: "center", fontWeight: 800, background: cur === k ? T.accent : "rgba(255,255,255,0.12)", color: cur === k ? T.accentText : "inherit" }}>
              <div style={{ fontSize: 18 }}>{i + 1}</div><div style={{ fontSize: 11, opacity: 0.8 }}>{triad(i).name}</div>
            </div>
          ))}
        </div>
        <Slider label="Tempo" value={bpm} min={50} max={140} onChange={setBpm} fmt={(v) => `${v} bpm`} />
        <Btn full variant={playing ? "light" : "pop"} icon={playing ? Square : Play} onClick={() => setPlaying((p) => !p)}>{playing ? "Stop" : "Play along"}</Btn>
      </Card>
      {!embedded && <MarkComplete id="numbers" label="Number system" mins={8} />}
    </div>
  );
}

const GROOVES = [
  { id: "basic", name: "Basic Worship 4/4", meter: "4/4", steps: 16, div: 4, bpm: 84, rows: { kick: [0, 8], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], open: [], tom: [] } },
  { id: "pop", name: "Worship Pop", meter: "4/4", steps: 16, div: 4, bpm: 76, rows: { kick: [0, 6, 8, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], open: [], tom: [] } },
  { id: "four", name: "Four on the Floor", meter: "4/4", steps: 16, div: 4, bpm: 124, rows: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [], open: [2, 6, 10, 14], tom: [] } },
  { id: "half", name: "Half-time Build", meter: "4/4", steps: 16, div: 4, bpm: 70, rows: { kick: [0, 3, 10], snare: [8], hat: [0, 2, 4, 6, 8, 10, 12, 14], open: [], tom: [14, 15] } },
  { id: "ghost", name: "Gospel Ghost Notes", meter: "4/4", steps: 16, div: 4, bpm: 88, rows: { kick: [0, 7, 10], snare: [4, 12], ghost: [3, 6, 9, 14, 15], hat: [0, 2, 4, 6, 8, 10, 12, 14], open: [], tom: [] } },
  { id: "fill", name: "Groove + Fill (2 bars)", meter: "4/4", steps: 32, div: 4, bpm: 80, rows: { kick: [0, 8, 16], snare: [4, 12, 20, 24, 25, 26, 27], hat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22], open: [], tom: [28, 29, 30, 31] } },
  { id: "toms", name: "Tom-driven Build", meter: "4/4", steps: 16, div: 4, bpm: 76, rows: { kick: [0, 8], snare: [], hat: [], open: [], tom: [0, 2, 4, 6, 8, 10, 12, 14] } },
  { id: "ballad", name: "Ballad 6/8", meter: "6/8", steps: 12, div: 2, bpm: 110, rows: { kick: [0, 6], snare: [3, 9], hat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], open: [], tom: [] } },
  { id: "chik", name: "Ethiopian 6/8 (simplified)", meter: "6/8", steps: 12, div: 2, bpm: 150, rows: { kick: [0, 6, 8], snare: [3, 9], hat: [0, 2, 3, 5, 6, 8, 9, 11], open: [], tom: [5, 11] } },
  { id: "shuf", name: "Gospel Shuffle", meter: "12/8", steps: 12, div: 3, bpm: 92, rows: { kick: [0, 7], snare: [3, 9], hat: [0, 2, 3, 5, 6, 8, 9, 11], open: [], tom: [] } },
];
const DRUM_ROWS = [["kick", "Kick"], ["snare", "Snare"], ["ghost", "Ghost"], ["hat", "Hi-hat"], ["open", "Open hat"], ["tom", "Toms"]];
const DRUM_ROWS_CUSTOM = [["kick", "Kick"], ["snare", "Snare"], ["ghost", "Ghost"], ["hat", "Hi-hat"], ["open", "Open hat"], ["t1", "High tom"], ["t2", "Mid tom"], ["t3", "Floor tom"]];
const normRows = (r) => ({ kick: [], snare: [], ghost: [], hat: [], open: [], tom: [], t1: [], t2: [], t3: [], ...JSON.parse(JSON.stringify(r)) });
const CUSTOM_METERS = [{ id: "44", label: "4/4 · 1 bar", meter: "4/4", steps: 16, div: 4 }, { id: "44x2", label: "4/4 · 2 bars", meter: "4/4", steps: 32, div: 4 }, { id: "34", label: "3/4", meter: "3/4", steps: 12, div: 4 }, { id: "68", label: "6/8", meter: "6/8", steps: 12, div: 2 }, { id: "128", label: "12/8 shuffle", meter: "12/8", steps: 12, div: 3 }, { id: "54", label: "5/4", meter: "5/4", steps: 20, div: 4 }, { id: "78", label: "7/8", meter: "7/8", steps: 14, div: 2 }];
const loadMine = () => { try { return JSON.parse(localStorage.getItem("beza-my-grooves") || "[]"); } catch (e) { return []; } };
function GrooveLab({ embedded, id: g0, locked }) {
  const { T } = useApp();
  const first = GROOVES.find((x) => x.id === g0) || GROOVES[0];
  const [g, setG] = useState(first);
  const [rows, setRows] = useState(() => normRows(first.rows));
  const [bpm, setBpm] = useState(first.bpm);
  const [run, setRun] = useState(false);
  const [step, setStep] = useState(-1); const [lis, setLis] = useState(false); const [runAt, setRunAt] = useState(0);
  useEffect(() => { if (run) setRunAt(performance.now()); }, [run]); // eslint-disable-line
  const rowsRef = useRef(rows); rowsRef.current = rows;
  useEffect(() => {
    if (!run) return; let s = 0; AE.get();
    const tick = () => {
      const r = rowsRef.current; const i = s % g.steps; setStep(i);
      if (r.kick.includes(i)) AE.kick(); if (r.snare.includes(i)) AE.snare(0, 0.85); if (r.ghost.includes(i)) AE.snare(0, 0.18); if (r.hat.includes(i)) AE.hat(0, false, i % 4 === 0 ? 0.55 : 0.38); if (r.open.includes(i)) AE.hat(0, true); if (r.tom.includes(i)) AE.tom(0, i % 3 === 0 ? 3 : i % 2 ? 2 : 1); if (r.t1.includes(i)) AE.tom(0, 1); if (r.t2.includes(i)) AE.tom(0, 2); if (r.t3.includes(i)) AE.tom(0, 3);
      s++;
    };
    tick(); const iv = setInterval(tick, (60 / bpm / g.div) * 1000);
    return () => { clearInterval(iv); setStep(-1); };
  }, [run, bpm, g]);
  const pick = (x) => { setG(x); setRows(normRows(x.rows)); setBpm(x.bpm); };
  const [mine, setMine] = useState(loadMine);
  const [cname, setCname] = useState("My groove");
  const custom = !!g.custom;
  const saveMine = (list) => { setMine(list); try { localStorage.setItem("beza-my-grooves", JSON.stringify(list)); } catch (e) { } };
  const newCustom = (m = CUSTOM_METERS[0], from) => { const x = { id: "custom-" + Date.now(), custom: true, name: from ? `${from.name} (my copy)` : "My groove", meter: m.meter, steps: m.steps, div: m.div, mid: m.id, bpm: from ? from.bpm : 80, rows: from ? normRows(from.rows) : normRows({}) }; setRun(false); setG(x); setRows(normRows(x.rows)); setBpm(x.bpm); setCname(x.name); };
  const setMeter = (m) => { setRun(false); setG((x) => ({ ...x, meter: m.meter, steps: m.steps, div: m.div, mid: m.id })); setRows((r) => { const n = {}; Object.keys(r).forEach((k) => (n[k] = r[k].filter((i) => i < m.steps))); return n; }); };
  const save = () => { const x = { ...g, name: cname.trim() || "My groove", rows, bpm }; const list = mine.some((y) => y.id === x.id) ? mine.map((y) => (y.id === x.id ? x : y)) : [...mine, x]; saveMine(list); setG(x); };
  const fillRow = (row, every) => setRows((r) => ({ ...r, [row]: Array.from({ length: g.steps }, (_, i) => i).filter((i) => i % every === 0) }));
  const toggle = (row, i) => setRows((r) => ({ ...r, [row]: r[row].includes(i) ? r[row].filter((x) => x !== i) : [...r[row], i] }));
  return (
    <div>
      <ToolBar embedded={embedded} title="Groove Lab" sub="Real drum kit · tap cells to write grooves" />
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6 }} className="bz-noscroll">
        {!locked && <Chip active={custom && !mine.some((y) => y.id === g.id)} onClick={() => newCustom()} style={{ borderStyle: "dashed" }}>✏️ New blank groove</Chip>}
        {!locked && mine.map((x) => <Chip key={x.id} active={x.id === g.id} onClick={() => { setRun(false); pick(x); setCname(x.name); }}>⭐ {x.name}</Chip>)}
        {(locked ? GROOVES.filter((x) => x.id === g.id) : GROOVES).map((x) => <Chip key={x.id} active={x.id === g.id} onClick={() => { setRun(false); pick(x); }}>{x.name}</Chip>)}
      </div>
      {custom && (
        <Card tone="soft" style={{ marginTop: 10, padding: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input value={cname} onChange={(e) => setCname(e.target.value)} style={{ flex: 1, minWidth: 0, padding: "9px 12px", borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.input, color: T.text, fontFamily: FONT, fontSize: 14, fontWeight: 700, outline: "none" }} />
            <Btn small variant="accent" icon={Check} onClick={save}>Save</Btn>
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, color: T.sub, margin: "10px 0 6px" }}>TIME SIGNATURE</div>
          <Scroller>{CUSTOM_METERS.map((m) => <Chip key={m.id} active={(g.mid || "44") === m.id} onClick={() => setMeter(m)}>{m.label}</Chip>)}</Scroller>
          <div style={{ fontSize: 11, fontWeight: 800, color: T.sub, margin: "10px 0 6px" }}>QUICK FILL</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <Chip onClick={() => fillRow("hat", g.div === 4 ? 2 : 1)}>Hats on every 8th</Chip>
            {g.div === 4 && <Chip onClick={() => fillRow("hat", 1)}>Hats on 16ths</Chip>}
            <Chip onClick={() => fillRow("kick", g.div)}>Kick on every beat</Chip>
            <Chip onClick={() => setRows(normRows({}))}>🧹 Clear all</Chip>
            {mine.some((y) => y.id === g.id) && <Chip onClick={() => { saveMine(mine.filter((y) => y.id !== g.id)); pick(GROOVES[0]); }}>🗑 Delete</Chip>}
          </div>
        </Card>
      )}
      {!locked && !custom && <div style={{ marginTop: 6 }}><Chip onClick={() => newCustom(CUSTOM_METERS.find((m) => m.steps === g.steps && m.div === g.div) || CUSTOM_METERS[0], g)}>📋 Edit a copy of “{g.name}”</Chip></div>}
      <Card style={{ marginTop: 10, padding: 12 }}>
        <div className="bz-noscroll" style={{ overflowX: g.steps > 16 ? "auto" : "visible" }}><div style={{ minWidth: g.steps > 16 ? g.steps * 22 + 60 : undefined }}>
        {(custom ? DRUM_ROWS_CUSTOM : DRUM_ROWS).map(([id, label]) => (
          <div key={id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ width: 54, fontSize: 10.5, fontWeight: 700, color: T.sub }}>{label}</div>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: `repeat(${g.steps}, 1fr)`, gap: 2.5 }}>
              {Array.from({ length: g.steps }).map((_, i) => {
                const on = rows[id].includes(i); const groupSize = g.div === 4 ? 4 : 3; const shade = Math.floor(i / groupSize) % 2 === 0;
                return (
                  <button key={i} onClick={() => toggle(id, i)} style={{
                    height: 26, border: step === i ? `2px solid ${T.pop}` : "none", borderRadius: 6, cursor: "pointer", padding: 0,
                    background: on ? (id === "kick" ? T.pop : id === "ghost" ? "#8B5CFF" : id.startsWith("t") && id !== "tom" ? "#22E4FF" : T.accent) : shade ? T.input : T.card2
                  }} />
                );
              })}
            </div>
          </div>
        ))}
        </div></div>
        <div style={{ fontSize: 11, color: T.sub, marginTop: 4 }}>{custom ? "Tap any cell to add or remove a hit · " : ""}Meter {g.meter} · {g.steps} steps {g.div === 4 ? "(16th notes)" : g.div === 3 ? "(triplets)" : "(8th notes)"}</div>
      </Card>
      <Card tone="hero" style={{ marginTop: 12 }}>
        <Slider label="Tempo" value={bpm} min={50} max={180} onChange={setBpm} fmt={(v) => `${v} bpm`} />
        <div style={{ display: "flex", gap: 8 }}>
          <Btn full variant={run ? "light" : "accent"} icon={run ? Square : Play} onClick={() => setRun((r) => !r)}>{run ? "Stop" : "Play groove"}</Btn>
          <Btn variant="light" icon={RefreshCw} onClick={() => setRows(normRows(g.rows))}>{custom ? "Undo" : "Reset"}</Btn>
        </div>
      </Card>
      {!locked && <Card tone="soft" style={{ marginTop: 12, fontSize: 13, lineHeight: 1.55 }}>
        <b>Practise like this:</b> play along on your kit or a pad. Mute rows (tap cells off) and play those parts yourself. Raise the tempo 4 bpm only when it feels effortless.
      </Card>}
      <div style={{ marginTop: 12 }}><Chip active={lis} onClick={() => setLis((v) => !v)} style={{ fontWeight: 800 }}>{lis ? "👂 Listening to you — ON" : "👂 Listen to me (mic)"}</Chip></div>
      <TimingCoach on={lis && run} bpm={bpm} sub={2} startAt={runAt} />
      {!embedded && <MarkComplete id="groove" label="Groove Lab" mins={8} />}
    </div>
  );
}

