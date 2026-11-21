/* ============================ "I'M LISTENING" COACHES ============================
   Shared mic listening so every exercise can SHOW (play + light up), let you FOLLOW, and LISTEN back:
   - useMicListen: pitch + onset detection
   - LiveCoach: sing/play along and see if you're on the target note right now
   - FollowMe: step-by-step "your turn" — the app waits until it hears the right note/chord (mic, MIDI or tap)
   - TimingCoach: for drums & strumming — every hit is checked against the click (early / on time / late) */
function useMicListen(on, { onPitch, onOnset, chroma = false } = {}) {
  const [lvl, setLvl] = useState(0); const [err, setErr] = useState("");
  const cbP = useRef(onPitch); cbP.current = onPitch; const cbO = useRef(onOnset); cbO.current = onOnset;
  useEffect(() => {
    if (!on) { setLvl(0); return; } let stream = null, raf = 0, stop = false; setErr("");
    (async () => { try {
      const c = AE.get(); stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }); if (stop) return;
      if (c.state !== "running") await c.resume();
      const src = c.createMediaStreamSource(stream); const an = c.createAnalyser(); an.fftSize = 4096; src.connect(an); AE.listen(an);
      const buf = new Float32Array(4096); const fb = new Float32Array(an.frequencyBinCount); const binHz = c.sampleRate / an.fftSize; const sm = makePitchSmoother(4); let fr = 0, prevR = 0, lastOn = 0;
      const loop = () => { raf = requestAnimationFrame(loop); an.getFloatTimeDomainData(buf);
        let r = 0; for (let k = 0; k < buf.length; k += 4) r += buf[k] * buf[k]; r = Math.sqrt(r / (buf.length / 4)); if ((fr++) % 3 === 0) setLvl(Math.min(1, r * 9));
        const now = performance.now(); if (r > 0.035 && r > prevR * 2.0 && now - lastOn > 85) { lastOn = now; cbO.current && cbO.current(now); } prevR = r * 0.5 + prevR * 0.5;
        if (!cbP.current || fr % 2) return;
        const f = detectPitch(buf, c.sampleRate); let ch = null;
        if (chroma) { an.getFloatFrequencyData(fb); ch = new Array(12).fill(0); for (let i = Math.floor(70 / binHz); i < Math.min(fb.length, Math.floor(1500 / binHz)); i++) { const mag = Math.pow(10, fb[i] / 20); const m = 69 + 12 * Math.log2((i * binHz) / 440); ch[((Math.round(m) % 12) + 12) % 12] += mag * mag; } }
        if (f > 38 && f < 1600 && detectPitch.conf > 0.78) cbP.current(sm(ftom(f, AE.settings.a4)), r, ch); else { sm(null); cbP.current(null, r, ch); } };
      loop(); } catch (e) { setErr(AE.micErr(e)); } })();
    return () => { stop = true; cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, [on, chroma]);
  return { lvl, err };
}
const MicMeter = ({ lvl, label }) => { const { T } = useApp(); return <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, color: T.sub }}><span>🎤</span><div style={{ flex: 1, height: 7, borderRadius: 9, background: T.card2, overflow: "hidden" }}><div style={{ width: `${lvl * 100}%`, height: "100%", background: T.good, transition: "width .06s" }} /></div>{label}</div>; };

/* sing / play along — live needle vs the note the app is playing now */
function LiveCoach({ on, target, title = "I'm listening to you" }) {
  const { T } = useApp();
  const [c, setC] = useState(null); const [sung, setSung] = useState(null); const tally = useRef({ ok: 0, n: 0 }); const [pct, setPct] = useState(null);
  const tg = useRef(target); tg.current = target;
  const { lvl, err } = useMicListen(on, { onPitch: (m) => { if (m == null || tg.current == null) { setC(null); return; } setSung(m); let d = (m - tg.current) % 12; if (d > 6) d -= 12; if (d < -6) d += 12; const cents = Math.round(d * 100); setC(cents); tally.current.n++; if (Math.abs(cents) <= 35) tally.current.ok++; if (tally.current.n % 10 === 0) setPct(Math.round((tally.current.ok / tally.current.n) * 100)); } });
  useEffect(() => { if (on) { tally.current = { ok: 0, n: 0 }; setPct(null); } }, [on]);
  if (!on) return null;
  return (
    <Card style={{ marginTop: 10, padding: 12, borderLeft: `4px solid ${T.good}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800 }}><span>👂 {title}</span><span>{pct != null ? `${pct}% in tune` : ""}</span></div>
      <div style={{ position: "relative", height: 16, borderRadius: 9, background: T.card2, margin: "10px 0 6px" }}>
        <div style={{ position: "absolute", left: "33%", width: "34%", top: 0, bottom: 0, background: T.good + "44", borderRadius: 9 }} />
        {c != null && <div style={{ position: "absolute", top: -3, width: 7, height: 22, borderRadius: 4, left: `calc(${50 + Math.max(-50, Math.min(50, c))}% - 3px)`, background: Math.abs(c) <= 35 ? T.good : T.bad, transition: "left .08s" }} />}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
        <span>Target: <b>{target != null ? nn(target) : "—"}</b></span>
        <b style={{ color: c == null ? T.sub : Math.abs(c) <= 35 ? T.good : T.bad }}>{target == null ? "Wait for the note…" : c == null ? "Sing / play now" : Math.abs(c) <= 35 ? "✓ In tune" : c > 0 ? `Too high (${nn(Math.round(sung))})` : `Too low (${nn(Math.round(sung))})`}</b>
      </div>
      <div style={{ marginTop: 8 }}><MicMeter lvl={lvl} /></div>
      {err && <div style={{ fontSize: 12, color: T.bad, marginTop: 6 }}>{err}</div>}
    </Card>
  );
}

/* step-by-step: the app waits until it HEARS the right note or chord */
function FollowMe({ steps, onPos, inst = "piano", tapRef, title }) {
  const { T } = useApp();
  const [pos, setPos] = useState(0); const [src, setSrc] = useState("mic"); const [wrong, setWrong] = useState(0); const [flash, setFlash] = useState(null); const [heard, setHeard] = useState(null);
  const st = useRef({}); st.current = { pos, steps };
  useEffect(() => { setPos(0); setWrong(0); }, [steps]);
  useEffect(() => { onPos && onPos(pos); }, [pos]); // eslint-disable-line
  const target = steps[pos] || null;
  const hit = () => { setFlash("ok"); AE.play("piano", 96, 0.08, 0, 0.25); setTimeout(() => setFlash(null), 250); setPos((p) => p + 1); };
  const miss = () => { setWrong((w) => w + 1); setFlash("bad"); setTimeout(() => setFlash(null), 250); };
  const check = (midis, chroma) => {
    const S = st.current; const t = S.steps[S.pos]; if (!t) return;
    const want = [...new Set(t.n.map((m) => ((m % 12) + 12) % 12))];
    if (want.length === 1) { if (midis && midis.some((m) => ((Math.round(m) % 12) + 12) % 12 === want[0])) hit(); else if (midis) miss(); return; }
    if (chroma) { const tot = Math.sqrt(chroma.reduce((a, b) => a + b * b, 0)) || 1; const v = chroma.map((x) => x / tot); const tv = new Array(12).fill(0); want.forEach((p, i) => (tv[p] = i === 0 ? 1 : 0.8)); const tn = Math.sqrt(tv.reduce((a, b) => a + b * b, 0)); const sim = tv.reduce((a, x, i) => a + (x / tn) * v[i], 0); if (sim > 0.72) hit(); return; }
    if (midis) { const got = new Set(midis.map((m) => ((Math.round(m) % 12) + 12) % 12)); if (want.every((p) => got.has(p))) hit(); }
  };
  /* mic: stable single note, or chord colour */
  const stab = useRef({ m: null, k: 0, ck: 0, fired: false });
  const isChord = target && new Set(target.n.map((m) => m % 12)).size > 1;
  const { lvl, err } = useMicListen(src === "mic" && pos < steps.length, { chroma: true, onPitch: (m, r, ch) => {
    const s = stab.current;
    if (isChord) { if (r > 0.02) { s.ck++; if (s.ck >= 6 && !s.fired) { s.fired = true; check(null, ch); } } else { s.ck = 0; s.fired = false; } return; }
    if (m == null) { s.m = null; s.k = 0; s.fired = false; setHeard(null); return; } const rm = Math.round(m); setHeard(rm);
    if (rm === s.m) { s.k++; if (s.k === 3 && !s.fired) { s.fired = true; check([rm]); } } else { s.m = rm; s.k = 1; s.fired = false; } } });
  /* MIDI */
  const held = useRef(new Set());
  useEffect(() => {
    if (src !== "midi" || !navigator.requestMIDIAccess) return; let acc = null;
    const h = (ev) => { const [s, n, v] = ev.data; if ((s & 0xf0) === 0x90 && v) { held.current.add(n); check([...held.current]); } else if ((s & 0xf0) === 0x80 || ((s & 0xf0) === 0x90 && !v)) held.current.delete(n); };
    navigator.requestMIDIAccess().then((a) => { acc = a; a.inputs.forEach((i) => { i.onmidimessage = h; }); }).catch(() => { });
    return () => { if (acc) acc.inputs.forEach((i) => { i.onmidimessage = null; }); };
  }, [src]); // eslint-disable-line
  /* tap on the on-screen instrument */
  const tapped = useRef([]);
  if (tapRef) tapRef.current = (m) => { const t = st.current.steps[st.current.pos]; if (!t) return; if (t.n.length > 1) { tapped.current = [...tapped.current.filter((x) => performance.now() - x.at < 1500), { m, at: performance.now() }]; check(tapped.current.map((x) => x.m)); if (st.current.pos !== pos) tapped.current = []; } else check([m]); };
  const done = pos >= steps.length;
  return (
    <Card style={{ marginTop: 10, padding: 14, border: `2px solid ${flash === "ok" ? T.good : flash === "bad" ? T.bad : T.border}`, transition: "border-color .15s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><b style={{ fontSize: 13 }}>🎯 {title || "Your turn — I'm listening"}</b><span style={{ fontSize: 12, color: T.sub }}>{Math.min(pos, steps.length)}/{steps.length}{wrong ? ` · ${wrong} retries` : ""}</span></div>
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>{[["mic", "🎤 Mic"], ["midi", "🎹 MIDI"], ["tap", "👆 Tap"]].map(([k, l]) => <Chip key={k} active={src === k} onClick={() => setSrc(k)} style={{ fontSize: 12 }}>{l}</Chip>)}</div>
      {done ? <div style={{ textAlign: "center", padding: "14px 0" }}><div style={{ fontSize: 30 }}>🎉</div><div style={{ fontWeight: 900, fontSize: 17 }}>All {steps.length} done!</div><div style={{ fontSize: 12.5, color: T.sub }}>{wrong === 0 ? "Perfect — not a single wrong note." : `${wrong} retries. Go again and aim for zero!`}</div><Btn small variant="accent" icon={Repeat} style={{ marginTop: 10 }} onClick={() => { setPos(0); setWrong(0); }}>Again</Btn></div> : <>
        <div style={{ textAlign: "center", margin: "12px 0 6px" }}>
          <div style={{ fontSize: 11, color: T.sub, fontWeight: 700 }}>PLAY THIS NOW</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{target.label || target.n.map(nn).join(" ")}</div>
          {steps[pos + 1] && <div style={{ fontSize: 12, color: T.faint }}>next: {steps[pos + 1].label || steps[pos + 1].n.map(nn).join(" ")}</div>}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}><Btn small variant="soft" icon={Play} onClick={() => target.n.forEach((m) => AE.play(inst, m, 1, 0, 0.7))}>Hear it</Btn><Btn small variant="ghost" icon={SkipForward} onClick={() => setPos((p) => p + 1)}>Skip</Btn></div>
        {src === "mic" && <div style={{ marginTop: 10 }}><MicMeter lvl={lvl} label={heard != null && !isChord ? <b style={{ minWidth: 34 }}>{nn(heard)}</b> : null} /></div>}
        {src === "tap" && <div style={{ fontSize: 11.5, color: T.sub, textAlign: "center", marginTop: 8 }}>Tap the notes on the instrument below.</div>}
        {src === "midi" && <div style={{ fontSize: 11.5, color: T.sub, textAlign: "center", marginTop: 8 }}>Play on your USB / Bluetooth MIDI keyboard.</div>}
        {err && <div style={{ fontSize: 12, color: T.bad, marginTop: 6 }}>{err}</div>}
      </>}
    </Card>
  );
}

/* drums & strumming: is each hit on the beat? */
function TimingCoach({ on, bpm, sub = 2, startAt }) {
  const { T } = useApp();
  const [last, setLast] = useState(null); const [stats, setStats] = useState({ on: 0, n: 0, early: 0, late: 0 }); const t0 = useRef(0);
  useEffect(() => { if (on) { t0.current = startAt || performance.now(); setStats({ on: 0, n: 0, early: 0, late: 0 }); setLast(null); } }, [on, startAt]);
  const { lvl, err } = useMicListen(on, { onOnset: (now) => { const grid = 60000 / bpm / sub; const ph = ((now - 30 - t0.current) % grid + grid) % grid; const d = ph > grid / 2 ? ph - grid : ph; const ms = Math.round(d);
    setLast(ms); setStats((s) => ({ n: s.n + 1, on: s.on + (Math.abs(ms) <= 35 ? 1 : 0), early: s.early + (ms < -35 ? 1 : 0), late: s.late + (ms > 35 ? 1 : 0) })); } });
  if (!on) return null;
  const pct = stats.n ? Math.round((stats.on / stats.n) * 100) : null;
  return (
    <Card style={{ marginTop: 10, padding: 12, borderLeft: `4px solid ${T.good}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800 }}><span>👂 I'm listening to your timing</span><span>{pct != null ? `${pct}% on the beat` : "Play along with the click"}</span></div>
      <div style={{ position: "relative", height: 26, borderRadius: 9, background: T.card2, margin: "10px 0 4px" }}>
        <div style={{ position: "absolute", left: "42%", width: "16%", top: 0, bottom: 0, background: T.good + "44", borderRadius: 9 }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: T.text, opacity: 0.4 }} />
        {last != null && <div style={{ position: "absolute", top: 2, width: 10, height: 22, borderRadius: 5, left: `calc(${50 + Math.max(-48, Math.min(48, last / 3))}% - 5px)`, background: Math.abs(last) <= 35 ? T.good : T.bad, transition: "left .05s" }} />}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: T.sub }}><span>◀ early ({stats.early})</span><b style={{ color: last == null ? T.sub : Math.abs(last) <= 35 ? T.good : T.bad }}>{last == null ? "—" : Math.abs(last) <= 35 ? "On time ✓" : last < 0 ? `${-last} ms early` : `${last} ms late`}</b><span>late ({stats.late}) ▶</span></div>
      <div style={{ marginTop: 8 }}><MicMeter lvl={lvl} /></div>
      {err && <div style={{ fontSize: 12, color: T.bad, marginTop: 6 }}>{err}</div>}
    </Card>
  );
}
