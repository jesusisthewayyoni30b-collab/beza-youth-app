
/* ============================ SOUND ENGINEER TOOLS (real audio) ============================ */
/* ---- Demo band: real-sample stems rendered offline (drums, bass, keys, acoustic, lead) ---- */
let DEMO_TURN = 0;
function AudioPicker({ value, onPick, allowNoise }) {
  const { T, toast } = useApp();
  const ref = useRef(null); const [busy, setBusy] = useState(false);
  const pickDemo = async () => { setBusy(true); try { const S = DEMO_SONGS[DEMO_TURN++ % DEMO_SONGS.length]; onPick({ name: `Demo: ${S.name} (real samples)`, buffer: await mixDemo(S.id) }); } finally { setBusy(false); } };
  const onFile = async (e) => { const f = e.target.files && e.target.files[0]; if (!f) return; setBusy(true); try { onPick({ name: f.name, buffer: await AE.decodeFile(f) }); } catch (er) { toast("Couldn't read that audio file — try MP3 or WAV"); } finally { setBusy(false); e.target.value = ""; } };
  return (
    <Card pad={12}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconBubble icon={Music} size={38} tone="soft" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: T.sub, fontWeight: 700 }}>SOURCE</div>
          <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{busy ? "Loading…" : value ? value.name : "Choose audio below"}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <Btn small variant="soft" style={{ flex: 1 }} onClick={pickDemo}>Demo band</Btn>
        {allowNoise && <Btn small variant="soft" style={{ flex: 1 }} onClick={() => onPick({ name: "Pink noise", buffer: AE.pink() })}>Noise</Btn>}
        <Btn small variant="accent" style={{ flex: 1 }} icon={Upload} onClick={() => ref.current.click()}>Upload</Btn>
      </div>
      <input ref={ref} type="file" accept="audio/*" hidden onChange={onFile} />
    </Card>
  );
}

/* ---------------- 7-BAND EQ LAB ---------------- */
const EQ7 = [
  { type: "lowshelf", f: 60, g: 0, q: 0.7, label: "Sub / Boom", short: "60" },
  { type: "peaking", f: 150, g: 0, q: 1, label: "Body / Warmth", short: "150" },
  { type: "peaking", f: 400, g: 0, q: 1, label: "Mud / Box", short: "400" },
  { type: "peaking", f: 1000, g: 0, q: 1, label: "Honk / Tone", short: "1k" },
  { type: "peaking", f: 2500, g: 0, q: 1, label: "Presence", short: "2.5k" },
  { type: "peaking", f: 6000, g: 0, q: 1, label: "Sibilance / Edge", short: "6k" },
  { type: "highshelf", f: 12000, g: 0, q: 0.7, label: "Air / Sparkle", short: "12k" },
];
const EQ_PRESETS = {
  Flat: [0, 0, 0, 0, 0, 0, 0], "Vocal clarity": [0, -1, -4, -1, 3, 1, 3], "Acoustic DI": [-2, -3, -2, -3, 1, 3, 2], "Reduce mud": [0, 0, -6, 0, 0, 0, 0],
  Kick: [5, 0, -5, 0, 3, 0, 0], Bass: [3, 2, -4, 2, 0, -2, -4], Telephone: [-12, -10, 0, 6, 4, -10, -12], Warm: [2, 3, 0, -1, -2, -1, 0],
};
const freqToX = (f, W) => (Math.log10(f / 20) / 3) * W, xToFreq = (x, W) => 20 * Math.pow(10, (x / W) * 3);
function useEQCurve(bands, hpf, W = 330) {
  return useMemo(() => {
    const c = AE.get(); const N = 110; const freqs = new Float32Array(N); for (let i = 0; i < N; i++) freqs[i] = xToFreq((i / (N - 1)) * W, W);
    const total = new Float32Array(N); const mag = new Float32Array(N), ph = new Float32Array(N);
    const all = [...bands, ...(hpf && hpf.on ? [{ type: "highpass", f: hpf.f, q: 0.707, g: 0 }] : [])];
    all.forEach((b) => { const n = c.createBiquadFilter(); n.type = b.type; n.frequency.value = b.f; n.Q.value = b.q; n.gain.value = b.g; n.getFrequencyResponse(freqs, mag, ph); for (let i = 0; i < N; i++) total[i] += 20 * Math.log10(Math.max(1e-6, mag[i])); });
    return Array.from(total).map((db, i) => [(i / (N - 1)) * W, Math.max(-24, Math.min(24, db))]);
  }, [JSON.stringify(bands), hpf && hpf.on, hpf && hpf.f]); // eslint-disable-line
}
function EQGraph({ bands, setBands, hpf, sel, setSel, analyser, hideHandles, H = 180 }) {
  const { T } = useApp();
  const W = 330; const y = (db) => H / 2 - db * (H / 2) / 18;
  const curve = useEQCurve(bands, hpf, W);
  const svgRef = useRef(null), canRef = useRef(null), drag = useRef(false);
  useEffect(() => {
    if (!analyser) return; let raf; const data = new Float32Array(analyser.frequencyBinCount); const sr = AE.get().sampleRate;
    const draw = () => {
      raf = requestAnimationFrame(draw); const cv = canRef.current; if (!cv) return; const g = cv.getContext("2d"); const w = cv.width, h = cv.height;
      analyser.getFloatFrequencyData(data); g.clearRect(0, 0, w, h);
      const grad = g.createLinearGradient(0, 0, w, 0); (T.spray || [T.accent, T.pop]).forEach((c, i, a) => grad.addColorStop(i / Math.max(1, a.length - 1), c + "AA"));
      g.fillStyle = grad; g.beginPath(); g.moveTo(0, h);
      for (let px = 0; px <= w; px += 3) { const f = xToFreq((px / w) * W, W); const bin = Math.min(data.length - 1, Math.round((f / (sr / 2)) * data.length)); const db = data[bin]; const v = Math.max(0, Math.min(1, (db + 100) / 80)); g.lineTo(px, h - v * h * 0.9); }
      g.lineTo(w, h); g.closePath(); g.globalAlpha = 0.55; g.fill(); g.globalAlpha = 1;
    };
    draw(); return () => cancelAnimationFrame(raf);
  }, [analyser, T]);
  const onPointer = (e, down) => {
    if (hideHandles || !setBands) return; if (down) drag.current = true; if (!drag.current) return;
    const r = svgRef.current.getBoundingClientRect(); const px = ((e.clientX - r.left) / r.width) * W; const py = ((e.clientY - r.top) / r.height) * H;
    let i = sel; if (down) { let best = 1e9; bands.forEach((b, k) => { const d = Math.hypot(freqToX(b.f, W) - px, y(b.g) - py); if (d < best) { best = d; i = k; } }); setSel(i); }
    const f = Math.max(25, Math.min(18000, xToFreq(px, W))); const g = Math.max(-15, Math.min(15, ((H / 2 - py) * 18) / (H / 2)));
    setBands((bs) => bs.map((b, k) => (k === i ? { ...b, f: Math.round(f), g: Math.round(g * 2) / 2 } : b)));
  };
  const path = curve.map(([px, db], i) => `${i ? "L" : "M"}${px.toFixed(1)},${y(db).toFixed(1)}`).join("");
  return (
    <div style={{ position: "relative" }}>
      <canvas ref={canRef} width={660} height={H * 2} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: 14, pointerEvents: "none" }} />
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" style={{ touchAction: "none", display: "block", position: "relative", cursor: hideHandles ? "default" : "crosshair" }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onPointer(e, true); }} onPointerMove={(e) => onPointer(e, false)} onPointerUp={() => (drag.current = false)}>
        <rect width={W} height={H} rx={14} fill={T.input} opacity={0.6} />
        {[50, 100, 200, 500, 1000, 2000, 5000, 10000].map((f) => (<g key={f}><line x1={freqToX(f, W)} x2={freqToX(f, W)} y1={0} y2={H} stroke={T.border} /><text x={freqToX(f, W) + 2} y={H - 4} fontSize={8} fill={T.faint}>{f >= 1000 ? f / 1000 + "k" : f}</text></g>))}
        {[-12, -6, 0, 6, 12].map((d) => <line key={d} x1={0} x2={W} y1={y(d)} y2={y(d)} stroke={d === 0 ? T.faint : T.border} strokeDasharray={d === 0 ? "" : "3 4"} />)}
        <path d={`${path} L${W},${H / 2} L0,${H / 2} Z`} fill={T.accent} opacity={0.16} />
        <path d={path} fill="none" stroke={T.accent} strokeWidth={3} strokeLinecap="round" />
        {!hideHandles && bands.map((b, k) => (
          <g key={k}><circle cx={freqToX(b.f, W)} cy={y(b.g)} r={k === sel ? 11 : 8} fill={k === sel ? T.pop : T.hero === "#121519" ? "#15181d" : T.card} stroke={T.accent} strokeWidth={2.5} />
            <text x={freqToX(b.f, W)} y={y(b.g) + 3.5} fontSize={9} fontWeight={800} textAnchor="middle" fill={k === sel ? T.popText : T.text}>{k + 1}</text></g>
        ))}
      </svg>
    </div>
  );
}
function EQ7Lab({ embedded, quiz: quiz0 }) {
  const { T } = useApp();
  const [bands, setBands] = useState(EQ7.map((b) => ({ ...b })));
  const [hpf, setHpf] = useState({ on: true, f: 80 });
  const [sel, setSel] = useState(4);
  const [src, setSrc] = useState(null);
  const [play, setPlay] = useState(false);
  const [bypass, setBypass] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [qfb, setQfb] = useState("");
  const [score, setScore] = useState({ ok: 0, n: 0 });
  const [analyser, setAnalyser] = useState(null);
  const nodes = useRef(null);
  useEffect(() => { if (quiz0 && !src) setSrc({ name: "Pink noise", buffer: AE.pink() }); }, []); // eslint-disable-line
  const eff = quiz != null ? EQ7.map((b, i) => ({ ...b, g: i === quiz ? 10 : 0 })) : bands;
  useEffect(() => {
    if (!play || !src) return;
    const c = AE.get(); const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.Q.value = 0.707;
    const fl = EQ7.map((b) => { const n = c.createBiquadFilter(); n.type = b.type; return n; });
    const an = c.createAnalyser(); an.fftSize = 4096; an.smoothingTimeConstant = 0.8; const g = c.createGain(); g.gain.value = 0.9;
    const s = c.createBufferSource(); s.buffer = src.buffer; s.loop = true;
    s.connect(hp); let last = hp; fl.forEach((n) => { last.connect(n); last = n; }); last.connect(g); g.connect(an); an.connect(AE.out()); s.start();
    nodes.current = { hp, fl }; setAnalyser(an);
    return () => { try { s.stop(); } catch (e) { } setTimeout(() => { try { g.disconnect(); } catch (e) { } }, 100); nodes.current = null; setAnalyser(null); };
  }, [play, src]);
  useEffect(() => {
    const n = nodes.current; if (!n) return;
    n.hp.frequency.value = hpf.on && !bypass && quiz == null ? hpf.f : 10;
    n.fl.forEach((f, i) => { const b = eff[i]; f.frequency.value = b.f; f.Q.value = b.q; f.gain.value = bypass ? 0 : b.g; });
  });
  const b = bands[sel];
  const setB = (k, v) => setBands((bs) => bs.map((q, i) => (i === sel ? { ...q, [k]: v } : q)));
  const startQuiz = () => { setQfb(""); if (!src) setSrc({ name: "Pink noise", buffer: AE.pink() }); setQuiz(Math.floor(Math.random() * 7)); setPlay(true); };
  const guess = (i) => { const ok = i === quiz; setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), n: s.n + 1 })); setQfb(ok ? "Correct! 🎉" : `It was ${EQ7[quiz].short} Hz — ${EQ7[quiz].label}`); setQuiz(null); };
  return (
    <div>
      <ToolBar embedded={embedded} title="7-Band EQ Lab" sub="Real audio · live spectrum · ear training" />
      <AudioPicker value={src} onPick={(v) => { setPlay(false); setSrc(v); }} allowNoise />
      <Card style={{ padding: 10, marginTop: 10 }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}><EQGraph bands={quiz != null ? eff : bands} setBands={setBands} hpf={quiz == null ? hpf : null} sel={sel} setSel={setSel} analyser={analyser} hideHandles={quiz != null} /></div>
      </Card>
      <Card tone="hero" style={{ marginTop: 10, padding: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn full variant={play ? "light" : "accent"} icon={play ? Square : Play} disabled={!src} onClick={() => { setPlay((p) => !p); }}>{play ? "Stop" : src ? "Listen" : "Pick a source"}</Btn>
          <Btn variant={bypass ? "pop" : "light"} onClick={() => setBypass((v) => !v)}>{bypass ? "Bypassed" : "A/B"}</Btn>
          <Btn variant="light" icon={RefreshCw} onClick={() => setBands(EQ7.map((q) => ({ ...q })))} />
        </div>
      </Card>
      {quiz == null && (
        <Card style={{ marginTop: 10, padding: 14 }}>
          <div className="bz-noscroll" style={{ display: "flex", overflowX: "auto", borderRadius: 16, border: "1px solid #000", background: "linear-gradient(180deg,#25282e,#15171b)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.06)" }}>
            <div style={{ flex: "1 0 86px", padding: "10px 4px 12px", borderRight: "1px solid #0a0b0d", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: "100%", padding: "3px 0", borderRadius: 5, background: hpf.on ? "#22E4FF" : "#2a2d33", color: hpf.on ? "#111" : "#9aa0aa", fontSize: 10, fontWeight: 900, textAlign: "center" }}>HPF</div>
              <SBtn on={hpf.on} onClick={() => setHpf((h) => ({ ...h, on: !h.on }))} color="#22E4FF" w={52}>{hpf.on ? "ON" : "OFF"}</SBtn>
              <Knob big size={48} value={hpf.f} min={20} max={400} step={5} def={80} label="Cut-off" color="#22E4FF" fmt={(v) => `${v} Hz`} onChange={(f) => setHpf((h) => ({ ...h, f }))} />
              <div style={{ fontSize: 9, color: "#7d838d", textAlign: "center", lineHeight: 1.3 }}>Removes rumble below</div>
            </div>
            {bands.map((q, k) => { const col = ["#8B5CFF", "#7C8FE0", "#22E4FF", "#7CFFB2", "#C6FF3D", "#FFE53D", "#FF8A00"][k]; const lp = Math.round((Math.log10(q.f / 20) / 3) * 1000); const set1 = (key, v) => setBands((bs) => bs.map((x, i) => (i === k ? { ...x, [key]: v } : x)));
              return (
                <div key={k} onPointerDown={() => setSel(k)} style={{ flex: "1 0 86px", padding: "10px 4px 12px", borderRight: "1px solid #0a0b0d", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: k === sel ? "rgba(255,255,255,0.05)" : "transparent" }}>
                  <div style={{ width: "100%", padding: "3px 0", borderRadius: 5, background: col, color: "#111", fontSize: 10, fontWeight: 900, textAlign: "center" }}>{k + 1} · {EQ7[k].short}</div>
                  <div style={{ fontSize: 8.5, color: "#9aa0aa", fontWeight: 700, textAlign: "center", minHeight: 22, lineHeight: 1.25 }}>{EQ7[k].label}</div>
                  <Knob big size={52} value={q.g} min={-15} max={15} step={0.5} def={0} label="Gain" color={col} fmt={(v) => `${v > 0 ? "+" : ""}${v} dB`} onChange={(v) => set1("g", v)} />
                  <Knob big size={42} value={lp} min={20} max={985} step={1} def={Math.round((Math.log10(EQ7[k].f / 20) / 3) * 1000)} label="Freq" color={col} fmt={() => (q.f >= 1000 ? (q.f / 1000).toFixed(q.f >= 10000 ? 0 : 1) + "k" : q.f) + " Hz"} onChange={(v) => set1("f", Math.round(20 * Math.pow(10, (v / 1000) * 3)))} />
                  {q.type === "peaking" ? <Knob big size={36} value={q.q} min={0.3} max={8} step={0.1} def={1} label="Q" color={col} fmt={(v) => v.toFixed(1)} onChange={(v) => set1("q", Math.round(v * 10) / 10)} /> : <div style={{ fontSize: 9, fontWeight: 900, color: col, padding: "14px 0 6px", letterSpacing: 1 }}>{q.type === "lowshelf" ? "LOW SHELF" : "HIGH SHELF"}</div>}
                </div>
              ); })}
          </div>
          <div style={{ fontSize: 11, color: T.sub, textAlign: "center", margin: "8px 0 4px" }}>Drag knobs up/down · double-tap to reset · swipe for all bands</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, margin: "6px 0 8px" }}>PRESETS</div>
          <Scroller>{Object.entries(EQ_PRESETS).map(([n, gs]) => <Chip key={n} onClick={() => setBands(EQ7.map((q, i) => ({ ...q, g: gs[i] })))}>{n}</Chip>)}</Scroller>
        </Card>
      )}
      <SectionTitle>Ear training · 7 bands</SectionTitle>
      <Card tone="soft">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 13, lineHeight: 1.45, flex: 1 }}>{quiz != null ? "One band is boosted +10 dB. Which one?" : qfb || "We secretly boost one of 7 bands. Listen and guess."}</div>
          <div style={{ fontWeight: 800, fontSize: 18, marginLeft: 8 }}>{score.ok}/{score.n}</div>
        </div>
        {quiz != null ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{EQ7.map((q, i) => <Btn key={i} small variant="hero" onClick={() => guess(i)}>{q.short} · {q.label.split(" /")[0]}</Btn>)}</div>
        ) : <Btn small icon={Target} onClick={startQuiz}>Next round</Btn>}
      </Card>
      <SectionTitle>Frequency cheat sheet</SectionTitle>
      <Card style={{ fontSize: 12.5, lineHeight: 1.7 }}>
        {[["Rumble / stage noise", "< 80 Hz → high-pass"], ["Boom", "60–100 Hz"], ["Warmth / body", "120–250 Hz"], ["Mud / box", "250–500 Hz → cut"], ["Honk / nasal", "800 Hz–1.5 kHz"], ["Presence", "2–5 kHz"], ["Sibilance 'sss'", "5–8 kHz → de-ess"], ["Air", "10–16 kHz"]].map(([a, bb]) => (
          <div key={a} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${T.border}`, padding: "4px 0" }}><span style={{ fontWeight: 600 }}>{a}</span><span style={{ color: T.sub }}>{bb}</span></div>
        ))}
      </Card>
      {!embedded && <MarkComplete id="eq7" label="EQ Lab" mins={8} />}
    </div>
  );
}

/* ---------------- COMPRESSION LAB (simulated + real audio) ---------------- */
function CompLab({ embedded }) {
  const { T } = useApp();
  const [p, setP] = useState(COMP_PRESETS[0]);
  const [m, setM] = useState({ in: -40, gr: 0 });
  const [src, setSrc] = useState(null);
  const [play, setPlay] = useState(false);
  const [bypass, setBypass] = useState(false);
  const set = (k, v) => setP((x) => ({ ...x, [k]: v, n: "Custom" }));
  const out = (i) => compOut(i, p);
  const pRef = useRef(p); pRef.current = p;
  const nodes = useRef(null);
  useEffect(() => {
    if (!play || !src) return;
    const c = AE.get(); const s = c.createBufferSource(); s.buffer = src.buffer; s.loop = true;
    const pre = c.createAnalyser(); pre.fftSize = 1024; const comp = c.createDynamicsCompressor(); const mk = c.createGain(); const post = c.createAnalyser(); post.fftSize = 1024;
    s.connect(pre); pre.connect(comp); comp.connect(mk); mk.connect(post); post.connect(AE.out()); s.start();
    nodes.current = { comp, mk, pre, post, s };
    return () => { try { s.stop(); } catch (e) { } nodes.current = null; };
  }, [play, src]);
  useEffect(() => { const n = nodes.current; if (!n) return; n.comp.threshold.value = bypass ? 0 : p.thr; n.comp.ratio.value = bypass ? 1 : p.ratio; n.comp.knee.value = p.knee; n.comp.attack.value = p.att / 1000; n.comp.release.value = p.rel / 1000; n.mk.gain.value = Math.pow(10, (bypass ? 0 : p.mk) / 20); });
  useEffect(() => {
    let t = 0, gr = 0, last = performance.now(), raf; const buf = new Float32Array(1024);
    const loop = (now) => {
      const dt = now - last; last = now; t += dt / 1000; const n = nodes.current;
      if (n) { n.pre.getFloatTimeDomainData(buf); let pk = 0; for (let i = 0; i < buf.length; i++) pk = Math.max(pk, Math.abs(buf[i])); const lvl = 20 * Math.log10(Math.max(1e-5, pk)); setM({ in: Math.max(-60, lvl), gr: -n.comp.reduction }); }
      else {
        const phrase = Math.max(0, Math.sin(t * 1.3)); let lvl = -46 + 34 * phrase * (0.75 + 0.25 * Math.sin(t * 9)); if (Math.random() < 0.02) lvl += 8;
        const pp = pRef.current; const target = Math.max(0, lvl - compOut(lvl, pp)); const coef = target > gr ? 1 - Math.exp(-dt / pp.att) : 1 - Math.exp(-dt / pp.rel); gr += (target - gr) * coef; setM({ in: lvl, gr });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, []);
  const W = 300, H = 200, sx = (db) => ((db + 60) / 60) * W, sy = (db) => H - ((db + 60) / 60) * H;
  let path = ""; for (let i = -60; i <= 0; i += 1) path += `${i === -60 ? "M" : "L"}${sx(i)},${sy(Math.min(0, out(i) + p.mk))}`;
  const meter = (label, val, col, max = 60, inv) => (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ height: 110, width: 18, margin: "0 auto", borderRadius: 9, background: "rgba(255,255,255,0.12)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, [inv ? "top" : "bottom"]: 0, height: `${Math.max(0, Math.min(100, (val / max) * 100))}%`, background: col, borderRadius: 9 }} />
      </div>
      <div style={{ fontSize: 10.5, marginTop: 6, opacity: 0.8, fontWeight: 600 }}>{label}</div>
    </div>
  );
  return (
    <div>
      <ToolBar embedded={embedded} title="Compression Lab" sub="Watch & hear the compressor work" />
      <AudioPicker value={src} onPick={(v) => { setPlay(false); setSrc(v); }} />
      <Scroller style={{ marginTop: 10 }}>{COMP_PRESETS.map((x) => <Chip key={x.n} active={p.n === x.n} onClick={() => setP(x)}>{x.n}</Chip>)}</Scroller>
      <Card tone="hero" style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ flex: 2, minWidth: 0 }}>
          <rect width={W} height={H} rx={12} fill="rgba(0,0,0,0.2)" />
          <line x1={0} y1={H} x2={W} y2={0} stroke="rgba(255,255,255,0.3)" strokeDasharray="4 5" />
          <line x1={sx(p.thr)} x2={sx(p.thr)} y1={0} y2={H} stroke="#FFE53D" strokeDasharray="3 4" />
          <text x={sx(p.thr) + 4} y={14} fontSize={10} fill="#FFE53D" fontWeight={700}>threshold</text>
          <path d={path} fill="none" stroke={T.accent} strokeWidth={3.5} />
          <circle cx={sx(Math.max(-60, m.in))} cy={sy(Math.min(0, out(m.in) + p.mk))} r={7} fill="#FFE53D" />
        </svg>
        <div style={{ flex: 1, display: "flex" }}>{meter("IN", m.in + 60, "#7fd3a6")}{meter("GR", m.gr, "#FFE53D", 24, true)}{meter("OUT", out(m.in) + p.mk + 60, T.accent)}</div>
      </Card>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <Btn full variant={play ? "light" : "accent"} icon={play ? Square : Play} disabled={!src} onClick={() => setPlay((x) => !x)}>{play ? "Stop audio" : src ? "Hear it on real audio" : "Pick audio to hear it"}</Btn>
        <Btn variant={bypass ? "pop" : "ghost"} onClick={() => setBypass((v) => !v)}>{bypass ? "Bypassed" : "A/B"}</Btn>
      </div>
      <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, margin: "10px 0" }}>Gain reduction: −{m.gr.toFixed(1)} dB</div>
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))", gap: 14, padding: "16px 10px", borderRadius: 18, background: "linear-gradient(180deg,#25282e,#15171b)", border: "1px solid #000", boxShadow: "inset 0 1px 0 rgba(255,255,255,.06)" }}>
          <Knob big size={64} value={p.thr} min={-50} max={0} step={1} def={-20} label="Threshold" color="#FF3EA5" fmt={(v) => `${v} dB`} onChange={(v) => set("thr", v)} />
          <Knob big size={64} value={p.ratio} min={1} max={20} step={0.5} def={3} label="Ratio" color="#FFE53D" fmt={(v) => `${v}:1`} onChange={(v) => set("ratio", v)} />
          <Knob big size={64} value={p.knee} min={0} max={12} step={1} def={6} label="Knee" color="#C6FF3D" fmt={(v) => `${v} dB`} onChange={(v) => set("knee", v)} />
          <Knob big size={64} value={p.att} min={1} max={100} step={1} def={10} label="Attack" color="#22E4FF" fmt={(v) => `${v} ms`} onChange={(v) => set("att", v)} />
          <Knob big size={64} value={p.rel} min={20} max={800} step={10} def={120} label="Release" color="#8B5CFF" fmt={(v) => `${v} ms`} onChange={(v) => set("rel", v)} />
          <Knob big size={64} value={p.mk} min={0} max={15} step={0.5} def={4} label="Make-up" color="#FF8A00" fmt={(v) => `+${v} dB`} onChange={(v) => set("mk", v)} />
        </div>
        <div style={{ fontSize: 11, color: T.sub, textAlign: "center", marginTop: 8 }}>Drag a knob up/down · double-tap to reset</div>
      </Card>
      <Card tone="soft" style={{ marginTop: 12, fontSize: 13, lineHeight: 1.55 }}><b>Rule of thumb:</b> 3–6 dB of gain reduction on vocals. Fast attack catches peaks but can dull consonants; slower attack keeps punch. Release should let the meter recover between phrases.</Card>
      {!embedded && <MarkComplete id="comp" label="Compression Lab" mins={6} />}
    </div>
  );
}

/* ---------------- REVERB & DELAY LAB ---------------- */
function makeIR(c, decay) { const len = Math.floor(c.sampleRate * decay); const ir = c.createBuffer(2, len, c.sampleRate); for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); } return ir; }
function FxLab({ embedded, tab: t0 }) {
  const { T } = useApp();
  const [tab, setTab] = useState(t0 || "delay");
  const [bpm, setBpm] = useState(72);
  const [nv, setNv] = useState(1);
  const [fb, setFb] = useState(35);
  const [mix, setMix] = useState(30);
  const [decay, setDecay] = useState(2);
  const [pre, setPre] = useState(30);
  const [src, setSrc] = useState(null);
  const [play, setPlay] = useState(false);
  const ms = Math.round((60000 / bpm) * NOTE_VALUES[nv][1]);
  const graph = useRef(null);
  const build = (input) => {
    const c = AE.get(); const dry = c.createGain(); const wet = c.createGain(); input.connect(dry); dry.connect(AE.out()); wet.connect(AE.out());
    if (tab === "delay") { const d = c.createDelay(3); const f = c.createGain(); input.connect(d); d.connect(f); f.connect(d); d.connect(wet); return { dry, wet, d, f }; }
    const conv = c.createConvolver(); conv.buffer = makeIR(c, decay); const pd = c.createDelay(1); input.connect(pd); pd.connect(conv); conv.connect(wet); return { dry, wet, pd, conv };
  };
  const apply = (g) => { if (!g) return; g.dry.gain.value = 1 - mix / 200; g.wet.gain.value = mix / 100; if (g.d) { g.d.delayTime.value = ms / 1000; g.f.gain.value = fb / 100; } if (g.pd) g.pd.delayTime.value = pre / 1000; };
  useEffect(() => {
    if (!play || !src) return; const c = AE.get(); const input = c.createGain(); const g = build(input); apply(g); graph.current = g;
    const s = c.createBufferSource(); s.buffer = src.buffer; s.loop = true; s.connect(input); s.start();
    return () => { try { s.stop(); } catch (e) { } setTimeout(() => { try { g.dry.disconnect(); g.wet.disconnect(); } catch (e) { } }, 3000); graph.current = null; };
  }, [play, src, tab, tab === "reverb" ? decay : 0]); // eslint-disable-line
  useEffect(() => apply(graph.current));
  const audition = () => { const c = AE.get(); const input = c.createGain(); const g = build(input); apply(g); [64, 67, 71, 74].forEach((m, i) => AE.tone(m, 0.18, i * 0.18, 0.8, input)); setTimeout(() => { try { g.dry.disconnect(); g.wet.disconnect(); } catch (e) { } }, 9000); };
  const W = 320, H = 120;
  return (
    <div>
      <ToolBar embedded={embedded} title="Reverb & Delay Lab" sub="Space without mud · try it on your audio" />
      <Seg value={tab} onChange={(t) => { setPlay(false); setTab(t); }} options={[{ value: "delay", label: "Delay" }, { value: "reverb", label: "Reverb" }]} />
      <div style={{ marginTop: 10 }}><AudioPicker value={src} onPick={(v) => { setPlay(false); setSrc(v); }} /></div>
      <Card tone="hero" style={{ marginTop: 10 }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
          {tab === "delay"
            ? Array.from({ length: 8 }).map((_, i) => { const amp = i === 0 ? 1 : (mix / 100) * Math.pow(fb / 100, i - 1); const xx = 10 + i * (ms / 1000) * 150; if (xx > W - 8) return null; return <rect key={i} x={xx} y={H - 10 - amp * (H - 24)} width={10} height={amp * (H - 24)} rx={4} fill={i === 0 ? "#FFE53D" : T.accent} />; })
            : (() => { let d = `M10,${H - 10}`; const x0 = 10 + (pre / 1000) * 300; d += ` L10,${H - 10 - (H - 24)} L14,${H - 10}`; for (let px = x0; px < W - 6; px += 4) { const tt = (px - x0) / 300; const a = (mix / 100) * Math.exp((-tt * 6.9) / decay); d += ` L${px},${H - 10 - a * (H - 30) * (0.7 + ((px * 7919) % 30) / 100)}`; } return <path d={d + ` L${W - 6},${H - 10} Z`} fill={T.accent} opacity={0.75} />; })()}
          <line x1={0} x2={W} y1={H - 10} y2={H - 10} stroke="rgba(255,255,255,0.3)" />
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, gap: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{tab === "delay" ? `${ms} ms · ${NOTE_VALUES[nv][0]} @ ${bpm} bpm` : `${decay.toFixed(1)} s · ${pre} ms pre-delay`}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <Btn small variant="light" icon={Play} onClick={audition}>Pluck</Btn>
            {src && <Btn small variant={play ? "pop" : "accent"} icon={play ? Square : Play} onClick={() => setPlay((x) => !x)}>{play ? "Stop" : "Audio"}</Btn>}
          </div>
        </div>
      </Card>
      <Card style={{ marginTop: 12, padding: 12 }}>
        <div style={{ borderRadius: 16, border: "1px solid #000", background: "linear-gradient(180deg,#25282e,#15171b)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.06)", padding: "14px 10px" }}>
          {tab === "delay" && <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginBottom: 14 }}>{NOTE_VALUES.map(([l], i) => <button key={l} onClick={() => setNv(i)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #000", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: FONT, background: nv === i ? "#22E4FF" : "#2a2d33", color: nv === i ? "#111" : "#c8ccd3", boxShadow: nv === i ? "0 0 8px #22E4FF" : "none" }}>{l}</button>)}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))", gap: 14 }}>
            {tab === "delay" ? (
              <>
                <Knob big size={64} value={bpm} min={50} max={160} step={1} def={72} label="Tempo" color="#FFE53D" fmt={(v) => `${v} bpm`} onChange={setBpm} />
                <Knob big size={64} value={fb} min={0} max={85} step={1} def={35} label="Feedback" color="#22E4FF" fmt={(v) => `${v}%`} onChange={setFb} />
              </>
            ) : (
              <>
                <Knob big size={64} value={decay} min={0.4} max={6} step={0.1} def={2} label="Decay" color="#7CFFB2" fmt={(v) => `${v.toFixed(1)} s`} onChange={(v) => setDecay(Math.round(v * 10) / 10)} />
                <Knob big size={64} value={pre} min={0} max={150} step={1} def={20} label="Pre-delay" color="#8B5CFF" fmt={(v) => `${v} ms`} onChange={setPre} />
              </>
            )}
            <Knob big size={64} value={mix} min={0} max={100} step={1} def={30} label="Mix (wet)" color="#FF3EA5" fmt={(v) => `${v}%`} onChange={setMix} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: T.sub, textAlign: "center", marginTop: 8 }}>Drag a knob up/down · double-tap to reset</div>
      </Card>
      <Card tone="soft" style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.7 }}>
        {(tab === "delay" ? [["Delay formula", "60 000 ÷ BPM = ms per beat"], ["Lead guitar", "dotted 1/8, 25–40% feedback"], ["Vocal throw", "1/4 note on phrase ends"], ["Slap-back", "80–120 ms, no feedback"]]
          : [["Vocal plate", "1.4–2.2 s, 20–40 ms pre-delay"], ["Ballad hall", "2.5–4 s"], ["Fast songs", "shorter, less wet"], ["Tip", "high-pass the return ~200 Hz"]]).map(([a, b]) => (
          <div key={a} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><b>{a}</b><span style={{ textAlign: "right" }}>{b}</span></div>
        ))}
      </Card>
      {!embedded && <MarkComplete id="fx" label="Reverb & delay" mins={6} />}
    </div>
  );
}
function DelayCalc() {
  const { T } = useApp(); const [bpm, setBpm] = useState(72);
  return (
    <div>
      <Slider label="Tempo" value={bpm} min={50} max={180} onChange={setBpm} fmt={(v) => `${v} bpm`} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {NOTE_VALUES.map(([l, f]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderRadius: 10, background: T.card2, fontSize: 12.5 }}><span>{l}</span><b>{Math.round((60000 / bpm) * f)} ms</b></div>)}
      </div>
    </div>
  );
}

/* ---------------- MIXER: multitrack with uploads ---------------- */
const STEM_COLORS = ["#FF3EA5", "#22E4FF", "#C6FF3D", "#FF8A00", "#8B5CFF", "#FFE53D", "#7CFFB2", "#F07D6A"];
const newTrack = (name, buffer, i) => ({ id: Date.now() + i + Math.random(), name, buffer, color: STEM_COLORS[i % STEM_COLORS.length], vol: 0, pan: 0, mute: false, solo: false, hpf: false, hpff: 100, eq: [0, 0, 0, 0, 0, 0, 0], comp: false, thr: -18, ratio: 3, rev: -30 });
