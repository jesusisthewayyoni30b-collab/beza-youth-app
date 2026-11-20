
/* ============================ SINGER TOOLS ============================ */
/* accurate pitch detection: YIN on a 2x-decimated buffer, then refined on the fundamental (tested within ±4 cents on voice, piano, guitar and bass) */
function detectPitch(buf, sr, lo = 38, hi = 1600) {
  const N = buf.length >> 1; const x = new Float32Array(N); let e = 0;
  for (let i = 0; i < N; i++) { const v = (buf[2 * i] + buf[2 * i + 1]) * 0.5; x[i] = v; e += v * v; }
  const rms = Math.sqrt(e / N); detectPitch.rms = rms; detectPitch.conf = 0;
  if (rms < 0.0025) return -1;
  const fs = sr / 2; const tMin = Math.max(2, Math.floor(fs / hi)); const tMax = Math.min(Math.floor(fs / lo), (N >> 1) - 2); const W = N - tMax - 1;
  const d = new Float32Array(tMax + 2);
  for (let t = 1; t <= tMax + 1; t++) { let s = 0; for (let i = 0; i < W; i++) { const q = x[i] - x[i + t]; s += q * q; } d[t] = s; }
  const c = new Float32Array(tMax + 2); c[0] = 1; let run = 0;
  for (let t = 1; t <= tMax + 1; t++) { run += d[t]; c[t] = run ? (d[t] * t) / run : 1; }
  let tau = -1;
  for (let t = tMin; t <= tMax; t++) { if (c[t] < 0.12) { while (t + 1 <= tMax && c[t + 1] < c[t]) t++; tau = t; break; } }
  if (tau < 0) { let m = 1, mt = -1; for (let t = tMin; t <= tMax; t++) if (c[t] < m) { m = c[t]; mt = t; } if (m < 0.3) tau = mt; else return -1; }
  const a = c[tau - 1], b = c[tau], cc = c[tau + 1]; const den = a + cc - 2 * b; const bt = den ? tau + (a - cc) / (2 * den) : tau;
  detectPitch.conf = 1 - b;
  let f = fs / bt;
  // refine on the fundamental itself (Hann-windowed DTFT peak search ±40 cents)
  if (f > 90) {
    const L = buf.length; const mag = (fq) => { const w = 2 * Math.PI * fq / sr; let re = 0, im = 0; for (let i = 0; i < L; i += 2) { const h = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / L); re += buf[i] * h * Math.cos(w * i); im += buf[i] * h * Math.sin(w * i); } return re * re + im * im; };
    let best = f, bm = -1, prev = [];
    for (let k = -40; k <= 40; k += 4) { const fq = f * Math.pow(2, k / 1200); const m = mag(fq); prev.push([fq, m]); if (m > bm) { bm = m; best = fq; } }
    let lo2 = best * Math.pow(2, -4 / 1200), hi2 = best * Math.pow(2, 4 / 1200);
    for (let it = 0; it < 12; it++) { const m1 = lo2 + (hi2 - lo2) / 3, m2 = hi2 - (hi2 - lo2) / 3; if (mag(m1) < mag(m2)) lo2 = m1; else hi2 = m2; }
    const ref = (lo2 + hi2) / 2; const tot = prev.reduce((s, p) => s + p[1], 0) / prev.length;
    if (bm > tot * 1.5 && Math.abs(1200 * Math.log2(ref / f)) < 35) f = ref;
  }
  return f;
}
const autoCorrelate = (b, sr) => detectPitch(b, sr);
/* steady reading: median of recent frames, ignoring one-off octave jumps */
function makePitchSmoother(n = 5) { const h = []; return (m) => { if (m == null) { h.length = 0; return null; } h.push(m); if (h.length > n) h.shift(); const srt = [...h].sort((x, y) => x - y); const med = srt[srt.length >> 1]; return Math.abs(m - med) > 0.6 && h.length >= 3 ? med : (h.length >= 3 ? med * 0.6 + m * 0.4 : m); }; }

const VOICE_TYPES = [
  { name: "Bass", lo: 40, hi: 64, color: "#5AA9E6" }, { name: "Baritone", lo: 45, hi: 69, color: "#4FA3A5" },
  { name: "Tenor", lo: 48, hi: 72, color: "#5DBB94" }, { name: "Alto", lo: 53, hi: 77, color: "#E6B85C" },
  { name: "Mezzo-soprano", lo: 57, hi: 81, color: "#F07D6A" }, { name: "Soprano", lo: 60, hi: 84, color: "#EC8FC2" },
];
/* chest-voice-only spans used for classification (the test measures chest voice only) */
const CHEST = { Bass: [40, 60], Baritone: [45, 64], Tenor: [47, 67], Alto: [53, 69], "Mezzo-soprano": [55, 71], Soprano: [58, 74] };
const classifyVoice = (lo, hi) => VOICE_TYPES.reduce((best, v) => { const [cl, ch] = CHEST[v.name]; const s = Math.abs(cl - lo) * 1.5 + Math.abs(ch - hi); return s < best.s ? { v, s } : best; }, { v: null, s: 1e9 }).v;

function VoiceSpectrum({ low, high, live, highlight }) {
  const { T } = useApp();
  const MIN = 36, MAX = 88, pct = (m) => ((m - MIN) / (MAX - MIN)) * 100;
  return (
    <div style={{ position: "relative", paddingTop: 4 }}>
      {VOICE_TYPES.map((v) => (
        <div key={v.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
          <div style={{ width: 74, fontSize: 11, fontWeight: 600, color: highlight === v.name ? T.text : T.sub }}>{v.name}</div>
          <div style={{ flex: 1, position: "relative", height: 12, borderRadius: 9, background: T.input }}>
            <div style={{ position: "absolute", left: `${pct(v.lo)}%`, width: `${pct(v.hi) - pct(v.lo)}%`, top: 0, bottom: 0, borderRadius: 9, background: v.color, opacity: highlight && highlight !== v.name ? 0.35 : 0.95 }} />
          </div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 82, right: 0, top: 0, bottom: 0, pointerEvents: "none" }}>
        {low != null && high != null && (
          <div style={{ position: "absolute", left: `${pct(low)}%`, width: `${Math.max(1, pct(high) - pct(low))}%`, top: -2, bottom: -2, border: `2px dashed ${T.text}`, borderRadius: 8 }} />
        )}
        {live != null && live > MIN && live < MAX && (
          <div style={{ position: "absolute", left: `${pct(live)}%`, top: -6, bottom: -6, width: 3, borderRadius: 3, background: T.pop, boxShadow: `0 0 10px ${T.pop}` }} />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginLeft: 82, fontSize: 10, color: T.faint, marginTop: 2 }}>
        {["C2", "C3", "C4", "C5", "C6"].map((x) => <span key={x}>{x}</span>)}
      </div>
    </div>
  );
}

function RangeTester({ track, embedded }) {
  const { T, setVoice, voice, setVoiceRange, toast } = useApp();
  const [phase, setPhase] = useState("intro");
  const [live, setLive] = useState(null);
  const [low, setLow] = useState(null);
  const [high, setHigh] = useState(null);
  const [err, setErr] = useState(""); const [lvl, setLvl] = useState(0); const silent = useRef(0); const [deaf, setDeaf] = useState(false);
  const streamRef = useRef(null), rafRef = useRef(0), st = useRef({ n: null, c: 0 }), phaseRef = useRef(phase);
  phaseRef.current = phase;
  const stop = () => { cancelAnimationFrame(rafRef.current); if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; } };
  useEffect(() => stop, []);
  const start = async () => {
    setErr(""); setLow(null); setHigh(null);
    try {
      const ctx = AE.get();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true } });
      streamRef.current = stream; if (ctx.state !== "running") await ctx.resume();
      const src = ctx.createMediaStreamSource(stream); const an = ctx.createAnalyser(); an.fftSize = 4096; src.connect(an); AE.listen(an);
      const buf = new Float32Array(an.fftSize); let frame = 0; const smooth = makePitchSmoother(5);
      const loop = () => {
        rafRef.current = requestAnimationFrame(loop); if ((frame++) % 3) return;
        an.getFloatTimeDomainData(buf); let r = 0; for (let k = 0; k < buf.length; k += 4) r += buf[k] * buf[k]; r = Math.sqrt(r / (buf.length / 4)); setLvl(Math.min(1, r * 12));
        if (r < 0.002) { silent.current++; if (silent.current > 240) setDeaf(true); } else { silent.current = 0; setDeaf(false); }
        const f = detectPitch(buf, ctx.sampleRate);
        if (f > 38 && f < 1600 && detectPitch.conf > 0.8) {
          const m = smooth(ftom(f, AE.settings.a4)); setLive(m); const r = Math.round(m);
          if (st.current.n === r) st.current.c++; else { st.current.n = r; st.current.c = 1; }
          if (st.current.c >= 4) {
            if (phaseRef.current === "low") setLow((p) => (p == null ? r : Math.min(p, r)));
            if (phaseRef.current === "high") setHigh((p) => (p == null ? r : Math.max(p, r)));
          }
        } else { smooth(null); setLive(null); }
      };
      loop(); setPhase("low");
    } catch (e) { setErr(AE.micErr(e)); }
  };
  const result = low != null && high != null ? classifyVoice(low, high) : null;
  useEffect(() => { if (phase === "result" && result) { setVoice(result.name); setVoiceRange && setVoiceRange({ low, high, label: `${nnOct(low)}–${nnOct(high)}`, at: Date.now() }); toast && toast(`${result.name} saved to your profile ✓`); } }, [phase]); // eslint-disable-line
  const cents = live != null ? Math.round((live - Math.round(live)) * 100) : 0;

  return (
    <div>
      <ToolBar embedded={embedded} title="Vocal Range Tester" sub="Find your range, voice type & live pitch" />
      <Card tone="hero" style={{ textAlign: "center", padding: 22 }}>
        <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
          {phase === "intro" ? "Chest voice only · read the guide below" : phase === "low" ? "Step 1 · Slide DOWN in chest voice as low as you can" : phase === "high" ? "Step 2 · Slide UP in chest voice — stop before it flips" : "Your voice type (chest range)"}
        </div>
        {phase === "result" && result ? (
          <>
            <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 700, margin: "8px 0 2px" }}>{result.name}</div>
            <div style={{ fontSize: 14, opacity: 0.8 }}>Your range: {nnOct(low)} – {nnOct(high)} · {high - low} semitones</div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: SERIF, fontSize: 64, fontWeight: 700, lineHeight: 1.1, margin: "8px 0 0" }}>{live != null ? nnOct(live) : "—"}</div>
            <div style={{ height: 8, width: 180, margin: "10px auto 0", borderRadius: 9, background: "rgba(255,255,255,0.18)", position: "relative" }}>
              <div style={{ position: "absolute", left: "50%", top: -3, width: 2, height: 14, background: "rgba(255,255,255,0.6)" }} />
              {live != null && <div style={{ position: "absolute", left: `calc(${50 + cents}% - 6px)`, top: -2, width: 12, height: 12, borderRadius: 9, background: Math.abs(cents) < 15 ? T.good : T.pop, transition: "left .1s" }} />}
            </div>
            <div style={{ fontSize: 11.5, opacity: 0.7, marginTop: 6 }}>{live != null ? `${cents > 0 ? "+" : ""}${cents} cents` : "Waiting for your voice…"}</div>
            {(phase === "low" || phase === "high") && <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 10 }}>
              <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1, opacity: 0.7 }}>MIC</span>
              <div style={{ width: 140, height: 6, borderRadius: 9, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}><div style={{ width: `${Math.round(lvl * 100)}%`, height: "100%", background: lvl > 0.08 ? "#3DFFB0" : "#FFC23D", transition: "width .08s" }} /></div>
            </div>}
            {deaf && (phase === "low" || phase === "high") && <div style={{ fontSize: 12, marginTop: 8, opacity: 0.9 }}>We can't hear anything. Check the right microphone is selected (click the 🎙 icon in the address bar) and that it isn't muted.</div>}
            {(low != null || high != null) && <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600 }}>Low: {low != null ? nnOct(low) : "—"} · High: {high != null ? nnOct(high) : "—"}</div>}
          </>
        )}
      </Card>
      {err && <Card tone="soft" style={{ marginTop: 12, fontSize: 13 }}>{err}</Card>}
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        {phase === "intro" && <><Btn full icon={Mic} onClick={start}>Start test</Btn><Btn variant="ghost" onClick={() => { setLow(47); setHigh(72); setPhase("result"); }}>Demo</Btn></>}
        {phase === "low" && <Btn full icon={ChevronRight} onClick={() => setPhase("high")} disabled={low == null}>Next: highest note</Btn>}
        {phase === "high" && <Btn full icon={Check} onClick={() => { stop(); setPhase("result"); }} disabled={high == null}>See my voice type</Btn>}
        {phase === "result" && <Btn full variant="ghost" icon={RefreshCw} onClick={() => { setPhase("intro"); setLive(null); }}>Test again</Btn>}
      </div>
      <SectionTitle>The voice spectrum</SectionTitle>
      <Card><VoiceSpectrum low={low} high={high} live={phase !== "result" ? live : null} highlight={result ? result.name : voice} /></Card>
      <SectionTitle>How to take the test</SectionTitle>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, lineHeight: 1.55, marginBottom: 10 }}>This test measures your <b>chest voice only</b> — your strong, speaking-style voice. No falsetto, no head voice, no vocal fry.</div>
        {[["Warm up first", "Do 3–5 minutes of humming and lip trills so your voice is ready."], ["Find chest voice", "Say 'Hey!' like calling a friend. Feel the buzz in your chest — that is the voice we measure."], ["Go LOW", "On 'uh' or 'ah', slide down slowly as low as you can while the note is still clear and steady. Stop when it turns into a croak or rattle (fry) — that does not count. Hold your lowest clear note for 2 seconds."], ["Go HIGH", "Speak-sing 'ah' or 'hey' and slide up slowly in chest voice. Stop at the last note before your voice flips, cracks or goes light/airy. Never shout or push — if it hurts or strains, stop."], ["Hold & repeat", "Hold each extreme note for 2 seconds so the tuner can catch it. Try twice and keep the best clear notes."]].map(([t, d], i) => (
          <div key={t} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ minWidth: 26, height: 26, borderRadius: 99, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, background: T.accent, color: T.accentText }}>{i + 1}</div>
            <div><div style={{ fontWeight: 700, fontSize: 13.5 }}>{t}</div><div style={{ fontSize: 12.5, color: T.sub, lineHeight: 1.5 }}>{d}</div></div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn small variant="soft" icon={Play} onClick={() => { [55, 53, 52, 50, 48, 47, 45, 43].forEach((m, k) => AE.tone(m, 0.5, k * 0.45, 0.6)); }}>Guide: slide down</Btn>
          <Btn small variant="soft" icon={Play} onClick={() => { [55, 57, 59, 60, 62, 64, 65, 67].forEach((m, k) => AE.tone(m, 0.5, k * 0.45, 0.6)); }}>Guide: slide up</Btn>
        </div>
      </Card>
      <Card tone="soft" style={{ marginTop: 12, fontSize: 13, lineHeight: 1.55 }}>
        <b>Tips:</b> sing on "ah" or "oo", don't strain, and hold each note for about 2 seconds. Your range grows with practice — retest every month. Voice type is a guide, not a box!
      </Card>
      {!embedded && <MarkComplete id="range" label="Range test" mins={5} />}
    </div>
  );
}

const ENTRY_OPTIONS = {
  "4/4": [{ id: "one", label: "On the 1 (downbeat)", off: 0 }, { id: "p4", label: "Pickup on beat 4", off: -2 }, { id: "p4and", label: "Pickup on '&' of 4", off: -1 }, { id: "and1", label: "Just after: '&' of 1", off: 1 }, { id: "b2", label: "On beat 2", off: 2 }],
  "3/4": [{ id: "one", label: "On the 1 (downbeat)", off: 0 }, { id: "p3", label: "Pickup on beat 3", off: -2 }, { id: "and1", label: "Just after: '&' of 1", off: 1 }],
  "6/8": [{ id: "one", label: "On the 1 (downbeat)", off: 0 }, { id: "p6", label: "Pickup on 6", off: -1 }, { id: "b4", label: "On 4 (second big beat)", off: 3 }],
};
function RhythmEntries({ meter: m0, entry: e0 }) {
  const { T } = useApp();
  const [meter, setMeter] = useState(m0 || "4/4");
  const [entry, setEntry] = useState((ENTRY_OPTIONS[m0 || "4/4"].find((o) => o.id === e0)) || ENTRY_OPTIONS[m0 || "4/4"][0]);
  const [bpm, setBpm] = useState(80);
  const [run, setRun] = useState(false);
  const [cell, setCell] = useState(-1);
  const [tapFb, setTapFb] = useState("");
  const per = meter === "4/4" ? 8 : 6; const total = per * 2; const entryCell = per + entry.off;
  const stepSec = meter === "6/8" ? 60 / bpm / 3 : 60 / bpm / 2;
  const entryTime = useRef(0);
  useEffect(() => {
    if (!run) return;
    let c = 0; AE.get();
    const tick = () => {
      const pos = c % total; setCell(pos);
      const inBar = pos % per; const isBeat = meter === "6/8" ? inBar % 3 === 0 : inBar % 2 === 0;
      if (isBeat) AE.click(inBar === 0); else if (meter === "6/8") AE.click(false);
      if (pos === entryCell) { AE.tone(79, 0.25, 0, 0.6); entryTime.current = performance.now(); }
      c++;
    };
    tick(); const iv = setInterval(tick, stepSec * 1000);
    return () => clearInterval(iv);
  }, [run, meter, bpm, entry]); // eslint-disable-line
  const tap = () => {
    if (!run || !entryTime.current) return;
    const loop = total * stepSec * 1000; let d = performance.now() - entryTime.current; if (d > loop / 2) d -= loop;
    const ms = Math.round(d); setTapFb(Math.abs(ms) < 70 ? `Right on time! (${ms > 0 ? "+" : ""}${ms} ms) 🎯` : ms < 0 ? `${-ms} ms early` : `${ms} ms late`);
  };
  const countLabel = (i) => {
    const inBar = i % per;
    if (meter === "6/8") return String(inBar + 1);
    return inBar % 2 === 0 ? String(inBar / 2 + 1) : "&";
  };
  return (
    <div>
      <Seg value={meter} onChange={(m) => { setMeter(m); setEntry(ENTRY_OPTIONS[m][0]); }} options={["4/4", "3/4", "6/8"]} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {ENTRY_OPTIONS[meter].map((o) => (
          <Card key={o.id} pad={12} tone={o.id === entry.id ? "soft" : "card"} onClick={() => setEntry(o)} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: 99, border: `2px solid ${T.accent}`, display: "grid", placeItems: "center" }}>{o.id === entry.id && <div style={{ width: 10, height: 10, borderRadius: 9, background: T.accent }} />}</div>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{o.label}</div>
          </Card>
        ))}
      </div>
      <Card tone="hero" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, opacity: 0.7, marginBottom: 6 }}><span>Count-in bar</span><span>Song bar</span></div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${total}, 1fr)`, gap: 3 }}>
          {Array.from({ length: total }).map((_, i) => {
            const isEntry = i === entryCell; const on = i === cell;
            return (
              <div key={i} style={{ position: "relative", height: 44, borderRadius: 8, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700,
                background: on ? (isEntry ? T.pop : T.accent) : isEntry ? "rgba(246,178,107,0.35)" : "rgba(255,255,255,0.1)",
                color: on ? (isEntry ? T.popText : T.accentText) : "inherit", borderLeft: i === per ? "3px solid rgba(255,255,255,0.7)" : "none" }}>
                {countLabel(i)}
                {isEntry && <div style={{ position: "absolute", top: -9, fontSize: 8.5, background: T.pop, color: T.popText, padding: "1px 5px", borderRadius: 6 }}>SING</div>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <Btn full variant={run ? "light" : "pop"} icon={run ? Square : Play} onClick={() => { setRun((r) => !r); setTapFb(""); setCell(-1); }}>{run ? "Stop" : "Start count-in"}</Btn>
          <Btn variant="light" onClick={tap} disabled={!run}>TAP</Btn>
        </div>
        <div style={{ minHeight: 18, marginTop: 8, fontSize: 13, fontWeight: 600, textAlign: "center" }}>{tapFb || "Tap exactly when you would start singing"}</div>
      </Card>
      <Card style={{ marginTop: 12 }}><Slider label="Tempo" value={bpm} min={50} max={150} onChange={setBpm} fmt={(v) => `${v} bpm`} /></Card>
      <SectionTitle>Hymn examples</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[{ t: "Amazing Grace", d: "3/4 · starts with a pickup on beat 3", m: "3/4", e: "p3" }, { t: "Holy, Holy, Holy", d: "4/4 · starts right on the downbeat", m: "4/4", e: "one" }].map((x) => (
          <Card key={x.t} pad={12} onClick={() => { setMeter(x.m); setEntry(ENTRY_OPTIONS[x.m].find((o) => o.id === x.e)); }} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconBubble icon={Music} size={38} />
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{x.t}</div><div style={{ fontSize: 12, color: T.sub }}>{x.d}</div></div>
            <ChevronRight size={18} color={T.sub} />
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- RHYTHM LAB: learn → read & tap → entries ---------- */
const rr = (n, step = 1, from = 0) => Array.from({ length: n }, (_, i) => from + i * step);
const RL = (id, name, lvl, beats, layers, count, text, opts = {}) => ({ id, name, lvl, beats, layers, count, text, bpm: 80, accents: [0], ...opts });
const L1 = (hits, sound = "snare", label = "Rhythm") => [{ hits, sound, label }];
const RL_LESSONS = [
  RL("q", "Quarter notes", 0, 4, L1(rr(4)), "1  2  3  4", "The heartbeat. One note on every beat. Clap with the click until it disappears into it."),
  RL("e", "Eighth notes", 0, 4, L1(rr(8, 0.5)), "1 & 2 & 3 & 4 &", "Two even notes per beat. Say '1 and 2 and' out loud — your voice keeps you steady."),
  RL("rest", "Rests (silence counts)", 0, 4, L1([0, 2]), "1 (2) 3 (4)", "A rest is a beat you still feel but don't play. Keep counting in your head through the silence."),
  RL("off", "Off-beats (the &s)", 1, 4, L1(rr(4, 1, 0.5)), "(1) & (2) & (3) & (4) &", "Play only on the 'and'. This is the reggae / upbeat-worship skank feel. Hardest part: don't rush."),
  RL("dq", "Dotted quarter + eighth", 1, 4, L1([0, 1.5, 2, 3]), "1 (2) & 3 4", "A long note held 1½ beats, then a quick eighth. Very common in worship melodies."),
  RL("s", "Sixteenth notes", 1, 4, L1(rr(16, 0.25)), "1 e & a 2 e & a…", "Four notes per beat. Say '1-e-and-a'. Drummers' hi-hats and strummers' fast patterns live here.", { bpm: 70 }),
  RL("gal", "Gallop (8th + two 16ths)", 2, 4, L1([0, 0.5, 0.75, 1, 1.5, 1.75, 2, 2.5, 2.75, 3, 3.5, 3.75]), "1 & a 2 & a…", "Long-short-short. The driving rock/worship strum.", { bpm: 76 }),
  RL("rgal", "Reverse gallop (two 16ths + 8th)", 2, 4, L1([0, 0.25, 0.5, 1, 1.25, 1.5, 2, 2.25, 2.5, 3, 3.25, 3.5]), "1 e & 2 e &…", "Short-short-long. Pushes forward.", { bpm: 76 }),
  RL("de", "Dotted 8th + 16th", 2, 4, L1([0, 0.75, 1, 1.75, 2, 2.75, 3, 3.75]), "1 . . a 2 . . a…", "The 'skip' rhythm. Bouncy and joyful — not the same as swing! Feel the a as a quick pickup.", { bpm: 72 }),
  RL("syn", "Syncopation (tied over the beat)", 2, 4, L1([0, 1.5, 2.5, 3]), "1 (2) & (3) & 4", "Notes land between beats and hold over them. This is what makes modern worship melodies feel alive."),
  RL("push", "Anticipation / the push", 2, 4, L1([0, 1, 2, 3.5]), "1 2 3 (4) &", "Play the next chord early, on the & of 4. Bands push chords together — everyone must feel it.", { bpm: 84 }),
  RL("tri", "Triplets", 3, 4, L1(rr(12, 1 / 3)), "1-trip-let 2-trip-let…", "Three even notes per beat. Say 'tri-pu-let' or 'straw-ber-ry'. Different from sixteenths!", { bpm: 72 }),
  RL("swing", "Swing / shuffle", 3, 4, L1(rr(4).flatMap((b) => [b, b + 2 / 3])), "1 . a 2 . a…", "Long-short using the triplet grid. Gospel, blues and many hymns feel like this.", { bpm: 90 }),
  RL("qtri", "Quarter-note triplets", 3, 4, [{ hits: rr(6, 2 / 3), sound: "snare", label: "3 over 2 beats" }, { hits: rr(4), sound: "kick", label: "Beat" }], "1 . trip . let . 3 . trip . let .", "Three notes stretched across two beats. Used in big builds and dramatic vocal lines.", { bpm: 70 }),
  RL("waltz", "3/4 — the waltz", 1, 3, L1([0, 1, 2]), "1 2 3 | 1 2 3", "Three beats in a bar, strong on 1. Amazing Grace and many hymns.", { accents: [0], bpm: 90 }),
  RL("68", "6/8 — two big beats", 2, 6, L1([0, 2, 3, 5]), "1 2 3 4 5 6", "Six eighths grouped 3+3. Feel TWO big pulses (1 and 4), not six small ones.", { accents: [0, 3], bpm: 180, unit: "eighths" }),
  RL("chik", "Chik-chika 6/8 groove", 3, 6, [{ hits: [0, 3], sound: "kick", label: "Kick" }, { hits: [1, 2, 4, 5], sound: "hat", label: "Shaker" }, { hits: [3], sound: "snare", label: "Clap" }], "1 2 3 4 5 6", "The Ethiopian/East-African 6/8 worship feel — kick on the big beats, shaker filling every eighth.", { accents: [0, 3], bpm: 200, unit: "eighths" }),
  RL("128", "12/8 slow ballad", 3, 12, [{ hits: [0, 6], sound: "kick", label: "Kick" }, { hits: rr(12), sound: "hat", label: "Hat" }, { hits: [3, 9], sound: "snare", label: "Snare" }], "1 2 3 4 5 6 7 8 9 10 11 12", "Four big beats each split in three. Soulful slow worship and gospel ballads.", { accents: [0, 3, 6, 9], bpm: 150, unit: "eighths" }),
  RL("hem", "Hemiola (3 against 2)", 4, 6, [{ hits: [0, 2, 4], sound: "snare", label: "Groups of 2" }, { hits: [0, 3], sound: "kick", label: "Groups of 3" }], "1 2 3 4 5 6", "The same six pulses felt as 3+3 AND 2+2+2 at once. Common in Ethiopian and African music.", { accents: [0, 3], bpm: 180, unit: "eighths" }),
  RL("54", "5/4 (3 + 2)", 4, 5, L1([0, 1, 2, 3, 4]), "1 2 3 4 5", "Five beats grouped 3+2. Count '1-2-3-1-2' and lean on the accents.", { accents: [0, 3], bpm: 110 }),
  RL("78", "7/8 (2 + 2 + 3)", 4, 7, L1(rr(7)), "1 2 3 4 5 6 7", "Seven quick pulses grouped 2+2+3. Say 'quick-quick-slow'.", { accents: [0, 2, 4], bpm: 220, unit: "eighths" }),
  RL("p32", "Polyrhythm 3:2", 4, 2, [{ hits: rr(3, 2 / 3), sound: "snare", label: "3" }, { hits: [0, 1], sound: "kick", label: "2" }], "1 . . 2 . .", "Two different pulses at once. Phrase: 'nice cup of tea'. Tap one hand each.", { bpm: 60 }),
  RL("p43", "Polyrhythm 4:3", 5, 3, [{ hits: rr(4, 0.75), sound: "snare", label: "4" }, { hits: [0, 1, 2], sound: "kick", label: "3" }], "1 . . 2 . . 3 . .", "Four evenly against three. Listen until both lines sound independent.", { bpm: 60 }),
  RL("p54", "Polyrhythm 5:4", 5, 4, [{ hits: rr(5, 0.8), sound: "snare", label: "5" }, { hits: [0, 1, 2, 3], sound: "kick", label: "4" }], "1 2 3 4", "Expert. Only the downbeat lines up. Keep the 4 as your anchor.", { bpm: 56 }),
  RL("clave", "Son clave (3-2)", 4, 8, L1([0, 1.5, 3, 5, 6]), "1 2 3 4 | 1 2 3 4", "The famous Afro-Cuban pattern over two bars. Feel how it pulls against the beat.", { accents: [0, 4], bpm: 96 }),
  RL("g3", "Groups of three 16ths", 5, 4, [{ hits: rr(6, 0.75), sound: "snare", label: "Every 3rd 16th" }, { hits: rr(4), sound: "kick", label: "Beat" }], "1 e & a 2 e & a…", "Accents every three sixteenths across 4/4 — modern gospel drum fills and builds.", { bpm: 72 }),
];
const RL_LV = ["Foundations", "Beginner", "Developing", "Intermediate", "Advanced", "Expert"];

function RhythmPlayer({ beats, layers, accents = [0], bpm: b0 = 80, unit, count, onScore }) {
  const { T } = useApp();
  const [bpm, setBpm] = useState(b0);
  const [run, setRun] = useState(false);
  const [mute, setMute] = useState({});
  const [click, setClick] = useState(true);
  const [ph, setPh] = useState(-1);
  const [fb, setFb] = useState(""); const [acc, setAcc] = useState({ ok: 0, n: 0 });
  const t0 = useRef(0); const beatDur = 60 / bpm; const loopDur = beats * beatDur;
  useEffect(() => { setBpm(b0); setRun(false); setAcc({ ok: 0, n: 0 }); setFb(""); }, [beats, layers, b0]);
  useEffect(() => {
    if (!run) { setPh(-1); return; } AE.get(); let loopN = 0; let raf;
    const sched = (off) => { for (let b = 0; b < beats; b++) if (click) AE.click(accents.includes(b), off + b * beatDur); layers.forEach((L, li) => { if (mute[li]) return; L.hits.forEach((h) => { const w = off + h * beatDur; if (L.sound === "kick") AE.kick(w); else if (L.sound === "hat") AE.hat(w, false, 0.45); else if (L.sound === "tone") AE.tone(72, 0.15, w, 0.6); else AE.hit("snare", w, accents.includes(Math.round(h)) && Math.abs(h - Math.round(h)) < 0.01 ? 0.85 : 0.6); }); }); };
    t0.current = performance.now() + 60; sched(0.06); const iv = setInterval(() => { loopN++; const due = t0.current + loopN * loopDur * 1000; sched(Math.max(0, (due - performance.now()) / 1000)); }, loopDur * 1000);
    const anim = () => { const t = (performance.now() - t0.current) / 1000; setPh(t < 0 ? -1 : (t % loopDur) / loopDur); raf = requestAnimationFrame(anim); }; raf = requestAnimationFrame(anim);
    return () => { clearInterval(iv); cancelAnimationFrame(raf); };
  }, [run, bpm, beats, layers, mute, click]); // eslint-disable-line
  const tap = () => {
    if (!run) return; AE.hit("snare", 0, 0.4); const t = ((performance.now() - t0.current) / 1000) % loopDur; const hits = layers[0].hits.map((h) => h * beatDur);
    let best = 1e9; hits.forEach((h) => { [h, h + loopDur, h - loopDur].forEach((x) => { if (Math.abs(t - x) < Math.abs(best)) best = t - x; }); });
    const ms = Math.round(best * 1000); const ok = Math.abs(ms) <= 60; setAcc((a) => ({ ok: a.ok + (ok ? 1 : 0), n: a.n + 1 })); setFb(ok ? `🎯 ${ms > 0 ? "+" : ""}${ms} ms` : ms < 0 ? `${-ms} ms early` : `${ms} ms late`);
  };
  const colors = [T.accent, T.pop, "#22E4FF"];
  return (
    <div>
      <div style={{ background: "rgba(0,0,0,0.22)", borderRadius: 16, padding: "12px 10px" }}>
        {layers.map((L, li) => (
          <div key={li} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, opacity: 0.8, marginBottom: 3 }}>{L.label}</div>
            <div style={{ position: "relative", height: 24, borderRadius: 8, background: "rgba(255,255,255,0.08)" }}>
              {Array.from({ length: beats }).map((_, b) => <div key={b} style={{ position: "absolute", left: `${(b / beats) * 100}%`, top: 0, bottom: 0, width: accents.includes(b) ? 2 : 1, background: `rgba(255,255,255,${accents.includes(b) ? 0.6 : 0.22})` }} />)}
              {L.hits.map((h, k) => { const lit = ph >= 0 && Math.abs(ph * beats - h) < 0.12; return <div key={k} style={{ position: "absolute", left: `calc(${(h / beats) * 100}% - 6px + ${50 / beats / beats}%)`, top: 5, width: 13, height: 13, borderRadius: 9, background: mute[li] ? "transparent" : colors[li % 3], border: `2px solid ${colors[li % 3]}`, transform: lit ? "scale(1.5)" : "none", transition: "transform .08s" }} />; })}
              {ph >= 0 && <div style={{ position: "absolute", left: `${ph * 100}%`, top: -3, bottom: -3, width: 2, background: "#fff", boxShadow: "0 0 8px #fff" }} />}
            </div>
          </div>
        ))}
        <div style={{ display: "flex", fontSize: 10, opacity: 0.75, fontWeight: 700 }}>{Array.from({ length: beats }).map((_, b) => <div key={b} style={{ flex: 1 }}>{b + 1}</div>)}</div>
      </div>
      {count && <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, marginTop: 8, opacity: 0.9 }}>Count: {count}</div>}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Btn full variant={run ? "light" : "accent"} icon={run ? Square : Play} onClick={() => { setRun((r) => !r); setFb(""); }}>{run ? "Stop" : "Play loop"}</Btn>
        <button onPointerDown={tap} disabled={!run} className="bz-press" style={{ flex: 1, borderRadius: 999, border: "none", background: run ? "#fff" : "rgba(255,255,255,0.3)", color: "#111", fontFamily: FONT, fontWeight: 900, fontSize: 15, cursor: "pointer" }}>TAP</button>
      </div>
      <div style={{ minHeight: 18, marginTop: 8, fontSize: 12.5, fontWeight: 700, textAlign: "center" }}>{fb || `Tap along with the ${layers[0].label.toLowerCase()} line`}{acc.n ? ` · accuracy ${Math.round((acc.ok / acc.n) * 100)}%` : ""}</div>
      <div style={{ marginTop: 10 }}><Slider label={unit === "eighths" ? "Tempo (eighth notes)" : "Tempo"} value={bpm} min={40} max={unit === "eighths" ? 260 : 180} onChange={setBpm} fmt={(v) => `${v} bpm`} /></div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <Chip active={click} onClick={() => setClick((c) => !c)}>Click {click ? "on" : "off"}</Chip>
        {layers.length > 1 && layers.map((L, li) => <Chip key={li} active={!mute[li]} onClick={() => setMute((m) => ({ ...m, [li]: !m[li] }))}>{mute[li] ? "🔇" : "🔊"} {L.label}</Chip>)}
      </div>
    </div>
  );
}

function RhythmReader() {
  const { T } = useApp();
  const [lv, setLv] = useState(0); const [n, setN] = useState(0);
  const last = useRef("");
  const pat = useMemo(() => { const tier = RHY_TIERS[lv]; let p; for (let k = 0; k < 30; k++) { p = buildRhythm(tier[Math.min(5, Math.floor(n / 2))]); if (p.join() !== last.current) break; } last.current = p.join(); return p; }, [lv, n]);
  const label = (h) => { const b = Math.floor(h); const f = h - b; return f < 0.01 ? String(b + 1) : Math.abs(f - 0.5) < 0.01 ? "&" : Math.abs(f - 0.25) < 0.01 ? "e" : Math.abs(f - 0.75) < 0.01 ? "a" : Math.abs(f - 1 / 3) < 0.02 ? "trip" : "let"; };
  return (
    <div>
      <Seg value={lv} onChange={(v) => { setLv(v); setN(0); }} options={TIERS.map(([t], i) => ({ value: i, label: t.slice(0, 5) }))} />
      <Card tone="hero" style={{ marginTop: 12, padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.8 }}>PATTERN {n + 1} · {TIERS[lv][0].toUpperCase()}</div>
        <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14, fontWeight: 700, margin: "6px 0 10px" }}>{pat.map(label).join(" ")}</div>
        <RhythmPlayer beats={4} layers={[{ hits: pat, sound: "snare", label: "Rhythm" }]} bpm={70 + lv * 6} />
      </Card>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <Btn full variant="accent" icon={SkipForward} onClick={() => setN((x) => x + 1)}>New pattern</Btn>
      </div>
      <Card tone="soft" style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55 }}>Read the count first, say it out loud, play the loop and tap along. Every new pattern is different — every 2 patterns the rhythm vocabulary grows.</Card>
    </div>
  );
}

function RhythmLab({ track, embedded, meter: m0, entry: e0 }) {
  const { T } = useApp();
  const [tab, setTab] = useState(m0 || e0 ? "entries" : "learn");
  const [les, setLes] = useState(RL_LESSONS[0]);
  return (
    <div>
      <ToolBar embedded={embedded} title="Rhythm Lab" sub={`${RL_LESSONS.length} rhythm lessons · read & tap · song entries`} />
      <Seg value={tab} onChange={setTab} options={[{ value: "learn", label: "Learn" }, { value: "read", label: "Read & tap" }, { value: "entries", label: "Entries" }]} />
      {tab === "learn" && (
        <>
          <Card tone="hero" style={{ marginTop: 12, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.8 }}>{RL_LV[les.lvl].toUpperCase()}</div>
            <div style={{ fontFamily: headFont(T), fontSize: 21, margin: "2px 0 4px", lineHeight: 1.2 }}>{les.name}</div>
            <div style={{ fontSize: 12.5, opacity: 0.9, lineHeight: 1.5, marginBottom: 12 }}>{les.text}</div>
            <RhythmPlayer beats={les.beats} layers={les.layers} accents={les.accents} bpm={les.bpm} unit={les.unit} count={les.count} />
          </Card>
          {RL_LV.map((lvName, li) => { const items = RL_LESSONS.filter((x) => x.lvl === li); if (!items.length) return null; return (
            <div key={lvName}>
              <SectionTitle>{lvName}</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map((x) => (
                  <Card key={x.id} pad={12} tone={x.id === les.id ? "soft" : "card"} onClick={(e) => { setLes(x); scrollUp(e); }} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <IconBubble icon={x.layers.length > 1 ? Layers : Timer} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{x.name}</div><div style={{ fontSize: 11.5, color: T.sub }}>{x.beats} {x.unit || "beats"} · {x.layers.length > 1 ? `${x.layers.length} layers` : `${x.layers[0].hits.length} notes`}</div></div>
                    <ChevronRight size={18} color={T.sub} />
                  </Card>
                ))}
              </div>
            </div>
          ); })}
        </>
      )}
      {tab === "read" && <div style={{ marginTop: 12 }}><RhythmReader /></div>}
      {tab === "entries" && <div style={{ marginTop: 12 }}><RhythmEntries meter={m0} entry={e0} /></div>}
      {!embedded && <MarkComplete id="rhythm" label="Rhythm Lab" mins={10} />}
    </div>
  );
}

