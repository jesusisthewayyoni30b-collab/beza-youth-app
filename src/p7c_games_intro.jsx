
/* ================================ INTRO (modern / futuristic) ================================ */

/* ---- cinematic intro sound (synthesised, ~5s): riser → boom + shimmer chord → bell sparkle ---- */
function playIntroSound(fromT = 0) {
  const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
  const ctx = new C(); const now = ctx.currentTime + 0.05; const T0 = now - fromT;
  const out = ctx.createGain(); out.gain.value = 0.9; const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3; out.connect(comp); comp.connect(ctx.destination);
  // reverb (generated impulse)
  const IRS = ctx.sampleRate; const rev = ctx.createConvolver(); const len = Math.floor(IRS * 1.8); const ir = ctx.createBuffer(2, len, IRS);
  for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); let g = 1; const k = Math.pow(0.001, 1 / len); for (let i = 0; i < len; i++) { d[i] = (Math.random() * 2 - 1) * g; g *= k; } }
  rev.buffer = ir; const revG = ctx.createGain(); revG.gain.value = 0.55; rev.connect(revG); revG.connect(out);
  const dly = ctx.createDelay(1); dly.delayTime.value = 0.32; const fb = ctx.createGain(); fb.gain.value = 0.38; const dlyG = ctx.createGain(); dlyG.gain.value = 0.35; dly.connect(fb); fb.connect(dly); dly.connect(dlyG); dlyG.connect(out); dlyG.connect(rev);
  const at = (t) => Math.max(now, T0 + t);
  const live = (t) => T0 + t >= now - 0.02;
  // 1) whoosh riser 0 → 1.3s
  if (live(1.2)) { const nb = ctx.createBuffer(1, 22050 * 1.6, 22050); const nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const n = ctx.createBufferSource(); n.buffer = nb; const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.4; bp.frequency.setValueAtTime(220, at(0)); bp.frequency.exponentialRampToValueAtTime(5200, at(1.25));
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, at(0)); g.gain.exponentialRampToValueAtTime(0.35, at(1.15)); g.gain.exponentialRampToValueAtTime(0.0001, at(1.4));
    n.connect(bp); bp.connect(g); g.connect(out); g.connect(rev); n.start(at(0)); n.stop(at(1.5));
    const sub = ctx.createOscillator(); sub.type = "sine"; sub.frequency.setValueAtTime(41, at(0)); sub.frequency.exponentialRampToValueAtTime(73, at(1.25)); const sg = ctx.createGain(); sg.gain.setValueAtTime(0.0001, at(0)); sg.gain.exponentialRampToValueAtTime(0.25, at(1.2)); sg.gain.exponentialRampToValueAtTime(0.0001, at(1.35)); sub.connect(sg); sg.connect(out); sub.start(at(0)); sub.stop(at(1.4)); }
  // 2) impact boom at 1.3s
  if (live(1.6)) { const b = ctx.createOscillator(); b.type = "sine"; b.frequency.setValueAtTime(95, at(1.3)); b.frequency.exponentialRampToValueAtTime(32, at(2.3)); const bg = ctx.createGain(); bg.gain.setValueAtTime(0.0001, at(1.29)); bg.gain.exponentialRampToValueAtTime(0.9, at(1.32)); bg.gain.exponentialRampToValueAtTime(0.0001, at(2.6)); b.connect(bg); bg.connect(out); b.start(at(1.29)); b.stop(at(2.7)); }
  // 3) shimmer pad chord (Dadd9) 1.3 → 5s
  [50, 57, 64, 66, 69, 74].forEach((m, k) => { [-7, 7].forEach((det) => {
    const o = ctx.createOscillator(); o.type = k < 2 ? "triangle" : "sawtooth"; o.frequency.value = 440 * Math.pow(2, (m - 69) / 12); o.detune.value = det;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(300, at(1.3)); lp.frequency.exponentialRampToValueAtTime(2600, at(2.8)); lp.frequency.exponentialRampToValueAtTime(900, at(5));
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, at(1.3)); g.gain.exponentialRampToValueAtTime(0.045, at(1.9)); g.gain.setValueAtTime(0.045, at(3.9)); g.gain.exponentialRampToValueAtTime(0.0001, at(5.2));
    o.connect(lp); lp.connect(g); g.connect(out); g.connect(rev); o.start(at(1.3)); o.stop(at(5.3)); }); });
  // 4) bell sparkle arpeggio + final chime at 3.9s
  const bell = (t, m, v = 0.18, dur = 1.6) => { if (!live(t)) return; [1, 2.76, 5.4].forEach((h, i) => { const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = 440 * Math.pow(2, (m - 69) / 12) * h; const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, at(t)); g.gain.exponentialRampToValueAtTime(v / (i + 1.5), at(t) + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, at(t) + dur / (i + 1)); o.connect(g); g.connect(out); g.connect(dly); g.connect(rev); o.start(at(t)); o.stop(at(t) + dur); }); };
  [[1.45, 86], [1.7, 81], [1.95, 90], [2.2, 88], [2.45, 93]].forEach(([t, m]) => bell(t, m, 0.12));
  bell(3.9, 81, 0.22, 2.4); bell(3.9, 88, 0.16, 2.4);
  setTimeout(() => { try { ctx.close(); } catch (e) { } }, Math.max(500, (5.6 - fromT) * 1000 + 3000));
  return ctx;
}
function Intro({ onDone }) {
  const { settings } = useApp();
  const [needTap, setNeedTap] = useState(false); const t0r = useRef(performance.now()); const sndRef = useRef(null);
  const [out, setOut] = useState(false);
  const [pct, setPct] = useState(0);
  const cv = useRef(null);
  useEffect(() => {
    const t0 = performance.now(); let raf;
    const c = cv.current; const g = c.getContext("2d"); const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = c.offsetWidth, H = c.offsetHeight; c.width = W * dpr; c.height = H * dpr; g.scale(dpr, dpr);
    const P = Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, z: 0.2 + Math.random() * 0.8, p: Math.random() * 6.28 }));
    const tick = () => {
      const t = (performance.now() - t0) / 1000; const q = Math.floor(t * 10); if (q !== tick.q) { tick.q = q; setPct(Math.min(1, t / 3.9)); }
      g.clearRect(0, 0, W, H);
      // drifting particles toward centre
      P.forEach((q) => { q.y -= 0.12 * q.z; if (q.y < -4) q.y = H + 4; const a = Math.min(1, t / 1.2) * (0.25 + 0.55 * q.z) * (0.6 + 0.4 * Math.sin(t * 2 + q.p)); g.fillStyle = `rgba(190,230,255,${a})`; g.beginPath(); g.arc(q.x, q.y, 0.6 + q.z * 0.9, 0, 6.28); g.fill(); });
      // flowing sound line
      const y0 = H * 0.74; const amp = Math.min(1, Math.max(0, (t - 1.4) / 1.2)) * 16;
      const grd = g.createLinearGradient(W * 0.08, 0, W * 0.92, 0); grd.addColorStop(0, "rgba(34,228,255,0)"); grd.addColorStop(0.25, "rgba(34,228,255,0.9)"); grd.addColorStop(0.5, "rgba(139,92,255,0.95)"); grd.addColorStop(0.75, "rgba(255,62,165,0.9)"); grd.addColorStop(1, "rgba(255,62,165,0)");
      [[1, 1.6, 0.95], [0.6, 1, 0.45], [0.35, 0.8, 0.25]].forEach(([k, lw, al], j) => {
        g.beginPath(); for (let x = W * 0.08; x <= W * 0.92; x += 2) { const u = (x - W * 0.08) / (W * 0.84); const env = Math.sin(u * Math.PI); const y = y0 + env * amp * k * Math.sin(u * 14 + t * (3 + j) + j) * Math.cos(u * 5 - t * 1.3); x === W * 0.08 ? g.moveTo(x, y) : g.lineTo(x, y); }
        g.strokeStyle = grd; g.globalAlpha = al * Math.min(1, t / 1.0); g.lineWidth = lw; g.shadowColor = "rgba(139,92,255,0.8)"; g.shadowBlur = 10; g.stroke(); g.globalAlpha = 1; g.shadowBlur = 0;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const a1 = setTimeout(() => setOut(true), 4300); const a2 = setTimeout(onDone, 5100);
    if (settings.introSound !== false) setTimeout(() => { try { const sc = playIntroSound(Math.max(0, (performance.now() - t0) / 1000)); sndRef.current = sc; if (sc && sc.state !== "running") { sc.close(); sndRef.current = null; setNeedTap(true); } } catch (e) { } }, 30);
    return () => { cancelAnimationFrame(raf); clearTimeout(a1); clearTimeout(a2); };
  }, []); // eslint-disable-line
  const mono = "ui-monospace, 'SF Mono', Menlo, monospace";
  const corner = (pos) => <div style={{ position: "absolute", width: 18, height: 18, ...pos, borderColor: "rgba(200,235,255,0.45)", borderStyle: "solid", borderWidth: 0, ...(pos.top != null ? { borderTopWidth: 1 } : { borderBottomWidth: 1 }), ...(pos.left != null ? { borderLeftWidth: 1 } : { borderRightWidth: 1 }), animation: "fxFade 1s ease .3s both" }} />;
  return (
    <div onClick={() => { setOut(true); setTimeout(onDone, 600); }} style={{ position: "absolute", inset: 0, zIndex: 200, overflow: "hidden", cursor: "pointer", background: "radial-gradient(90% 60% at 50% 40%, #0B1424 0%, #05070D 60%, #020306 100%)", transition: "opacity .8s ease, filter .8s ease, transform .8s cubic-bezier(.7,0,.3,1)", opacity: out ? 0 : 1, filter: out ? "blur(10px) brightness(1.4)" : "none", transform: out ? "scale(1.06)" : "none", fontFamily: FONT }}>
      <canvas ref={cv} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      {needTap && <button onClick={(e) => { e.stopPropagation(); setNeedTap(false); const el = (performance.now() - t0r.current) / 1000; if (el < 4.6) playIntroSound(el); }} style={{ position: "absolute", right: 24, bottom: 64, zIndex: 5, padding: "8px 14px", borderRadius: 99, border: "1px solid rgba(200,235,255,0.35)", background: "rgba(10,16,28,0.6)", color: "rgba(220,240,255,0.9)", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, letterSpacing: 2, cursor: "pointer" }}>🔊 TAP FOR SOUND</button>}
      {/* soft aurora */}
      <div style={{ position: "absolute", left: "50%", top: "38%", width: 520, height: 520, marginLeft: -260, marginTop: -260, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,255,0.22) 0%, rgba(34,228,255,0.08) 40%, transparent 70%)", filter: "blur(10px)", animation: "fxBreathe 4s ease-in-out .4s both" }} />
      {/* HUD */}
      <div style={{ position: "absolute", inset: 22 }}>{corner({ top: 0, left: 0 })}{corner({ top: 0, right: 0 })}{corner({ bottom: 0, left: 0 })}{corner({ bottom: 0, right: 0 })}</div>
      <div style={{ position: "absolute", top: 30, left: 50, right: 50, display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 9.5, letterSpacing: 2, color: "rgba(200,235,255,0.5)", animation: "fxFade 1s ease .5s both" }}><span>BEZA · YOUTH</span><span>{to12(nowHM())}</span></div>
      {/* orbit */}
      <div style={{ position: "absolute", left: "50%", top: "38%", width: 0, height: 0, perspective: 600 }}>
        <div style={{ position: "absolute", left: -170, top: -170, width: 340, height: 340, transform: "rotateX(72deg)", animation: "fxFade 1.2s ease 1.1s both" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: "1px solid transparent", background: "conic-gradient(from 0deg, transparent 0deg, rgba(34,228,255,0.9) 60deg, transparent 120deg, transparent 180deg, rgba(255,62,165,0.8) 240deg, transparent 300deg) border-box", WebkitMask: "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", animation: "fxSpin 6s linear infinite" }} />
        </div>
      </div>
      {/* light line that opens into the logo */}
      <div style={{ position: "absolute", left: 0, right: 0, top: "38%", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)", boxShadow: "0 0 18px 2px rgba(120,200,255,0.7)", transformOrigin: "50% 50%", animation: "fxLine2 1.6s cubic-bezier(.7,0,.2,1) .2s both" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "38%", transform: "translateY(-50%)", display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 270, animation: "fxSlit 1.3s cubic-bezier(.7,0,.2,1) .75s both" }}>
          <img alt="Beza Youth" src="assets/logo-white.png" style={{ display: "block", width: "100%", filter: "drop-shadow(0 0 22px rgba(140,190,255,0.35))", animation: "fxFocus 1.6s ease .75s both" }} />
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: "url(assets/logo-white.png)", maskImage: "url(assets/logo-white.png)", WebkitMaskSize: "100% 100%", maskSize: "100% 100%", background: "linear-gradient(100deg, transparent 40%, rgba(160,240,255,0.85) 50%, transparent 60%)", backgroundSize: "300% 100%", animation: "fxSweep 1.6s ease 2.1s both" }} />
        </div>
      </div>
      {/* titles */}
      <div style={{ position: "absolute", left: 0, right: 0, top: "calc(38% + 92px)", textAlign: "center" }}>
        <div style={{ color: "#F2F8FF", fontWeight: 300, fontSize: 14, textTransform: "uppercase", animation: "fxTrack 1.6s cubic-bezier(.2,.8,.2,1) 1.9s both" }}>Worship Team</div>
        <div style={{ margin: "12px auto 0", height: 1, width: 160, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)", animation: "fxLine3 1.2s ease 2.2s both" }} />
        <div style={{ marginTop: 12, fontFamily: mono, fontSize: 9.5, letterSpacing: 3, color: "rgba(200,235,255,0.5)", animation: "fxFade 1s ease 2.6s both" }}>BEZA INTERNATIONAL CHURCH</div>
      </div>
      {/* loader */}
      <div style={{ position: "absolute", left: 50, right: 50, bottom: 50, animation: "fxFade 1s ease .6s both" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 9.5, color: "rgba(200,235,255,0.55)", letterSpacing: 2, marginBottom: 8 }}><span>{pct < 0.4 ? "TUNING" : pct < 0.8 ? "PREPARING" : "ENTER HIS PRESENCE"}</span><span>{String(Math.round(pct * 100)).padStart(3, "0")}</span></div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.1)" }}><div style={{ width: `${pct * 100}%`, height: "100%", transition: "width .1s linear", background: "linear-gradient(90deg,#22E4FF,#8B5CFF,#FF3EA5)", boxShadow: "0 0 8px rgba(139,92,255,0.9)" }} /></div>
      </div>
      <style>{`
        @keyframes fxFade{from{opacity:0}to{opacity:1}}
        @keyframes fxSpin{to{transform:rotate(360deg)}}
        @keyframes fxBreathe{0%{opacity:0;transform:scale(.6)}60%{opacity:1}100%{opacity:.85;transform:scale(1)}}
        @keyframes fxLine2{0%{transform:scaleX(0);opacity:1}45%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1.2) scaleY(.5);opacity:0}}
        @keyframes fxSlit{from{clip-path:inset(50% 0 50% 0)}to{clip-path:inset(-20% 0 -20% 0)}}
        @keyframes fxFocus{from{filter:blur(8px) brightness(2.2);transform:scale(1.04)}to{filter:blur(0) brightness(1) drop-shadow(0 0 22px rgba(140,190,255,0.35));transform:scale(1)}}
        @keyframes fxSweep{from{background-position:110% 0}to{background-position:-10% 0}}
        @keyframes fxTrack{from{opacity:0;letter-spacing:1.4em;filter:blur(4px)}to{opacity:1;letter-spacing:.62em;filter:blur(0)}}
        @keyframes fxLine3{from{transform:scaleX(0);opacity:0}to{transform:scaleX(1);opacity:1}}
      `}</style>
    </div>
  );
}

/* ================================ GAME ARENA ================================ */
const rand = (n) => Math.floor(Math.random() * n);
const pick = (a) => a[rand(a.length)];
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rand(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const choicesFrom = (correct, pool, n = 4) => shuffle([correct, ...shuffle([...new Set(pool)].filter((x) => x !== correct)).slice(0, n - 1)]);
const playCadence = (base) => { [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]].forEach((c, i) => setTimeout(() => AE.chord(c.map((x) => base + x), 0.5), i * 420)); return 4 * 420 + 250; };
const KEYS_ALL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const KEY_PATH = [0, 7, 5, 2, 10, 9, 3, 4, 8, 11, 1, 6]; // C G F D Bb A Eb E Ab B Db F# — easiest first
const MINOR_CIRCLE = [9, 4, 2, 11, 7, 6, 0, 1, 5, 8, 10, 3]; // Am Em Dm Bm Gm F#m Cm C#m Fm G#m Bbm Ebm
const keysUpTo = (n) => KEY_PATH.slice(0, Math.max(1, Math.min(12, n)));
const PER = 3, MAXL = 15;
/* 15 levels per game; each level maps onto the full difficulty curve (1..150) the generators were built for */
const vL = (L) => Math.round(1 + (Math.min(MAXL, Math.max(1, L)) - 1) * 149 / 14);
/* special levels: every 5th is a BOSS level; 4, 8, 12 bring a surprise twist */
const SURPRISES = [["speed", "⚡ Speed round", "Half the time per question — think fast!"], ["streak", "🔥 Streak frenzy", "Streaks count triple — don't break the chain!"], ["sudden", "🎯 Sudden death", "One wrong answer ends the level."], ["mix", "🧩 Mix-up", "Questions from every level you've unlocked."]];
const levelKind = (L) => (L % 5 === 0 ? { id: "boss", label: "👑 BOSS LEVEL", desc: "15 questions, faster timer, mixed from the last 5 levels — DOUBLE XP." } : L % 4 === 0 ? (([id, label, desc]) => ({ id, label, desc }))(SURPRISES[(L / 4 - 1) % SURPRISES.length]) : null);
const TIERS = [["Beginner", "#7CFFB2"], ["Intermediate", "#22E4FF"], ["Advanced", "#8B5CFF"], ["Pro", "#FF8A00"], ["Legend", "#FF3EA5"]];
const tierIdx = (L) => Math.min(TIERS.length - 1, Math.floor((L - 1) / PER));
const tierOf = (L) => TIERS[tierIdx(L)];
const inTier = (L) => ((L - 1) % PER) + 1;
const segOf = (L) => Math.floor((((vL(L) - 1) % 30)) / 5); // 0..5 — something new every level
const passFor = (L) => [7, 7, 8, 8, 9][tierIdx(L)];
const prog01 = (L) => (((vL(L) - 1) % 30)) / 29; // 0..1 inside a tier
const TS = (L) => [Math.min(4, Math.floor((vL(L) - 1) / 30)), segOf(L), ((vL(L) - 1) % 30) + 1];
const kName = (k) => NOTE_NAMES[k];
const DEG_SEMI = { "1": 0, "b2": 1, "2": 2, "b3": 3, "3": 4, "4": 5, "#4": 6, "5": 7, "b6": 8, "6": 9, "b7": 10, "7": 11, "8": 12 };
const DEG_ORDER = ["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7", "8"];
const sortDeg = (a) => DEG_ORDER.filter((d) => a.includes(d));
const CAD = { I: [0, 4, 7], ii: [2, 5, 9], IV: [5, 9, 12], V: [7, 11, 14], vi: [9, 12, 16] };
const CADENCES = [["I", "IV", "V", "I"], ["I", "vi", "IV", "V", "I"], ["I", "ii", "V", "I"], ["I", "V", "vi", "IV", "I"], ["I", "IV", "I", "V", "I"]];
let cadTurn = 0;
const playKey = (base, style) => {
  if (style === "note") { AE.tone(base - 12, 1.2, 0, 0.7); return 1300; }
  if (style === "chord") { AE.chord([base - 12, base - 5, base, base + 4, base + 7], 1); return 1100; }
  const cad = CADENCES[cadTurn++ % CADENCES.length]; const gap = style === "fast" ? 300 : 420;
  cad.forEach((c, i) => setTimeout(() => AE.chord([base - 12 + CAD[c][0], ...CAD[c].map((x) => base + x)], 0.55), i * gap));
  return cad.length * gap + 250;
};
const qName = (q) => (CHORD_TYPES.find((c) => c.id === q) || {}).name || q;
const fLabel = (f) => (f >= 1000 ? `${f / 1000}k` : `${f}`) + " Hz";
const sc = (id) => ALL_SCALES.find((x) => x.id === id);
const scName = (id) => (sc(id) || {}).name || id;

/* rhythm cells (positions inside one beat; 2-beat cells span two beats) */
const CELLS = {
  q: [0], r: [], e: [0, 0.5], off: [0.5], s: [0, 0.25, 0.5, 0.75], de: [0, 0.75], es: [0, 0.5, 0.75], se: [0, 0.25, 0.5], ses: [0, 0.25, 0.75],
  tri: [0, 1 / 3, 2 / 3], tri2: [0, 2 / 3], syn: [0.25, 0.75], s3: [0.25, 0.5, 0.75], sx: [0.75],
  H_dq: [0, 1.5], H_32: [0, 2 / 3, 4 / 3], H_ant: [0, 1.5, 1.75], H_tied: [0, 0.5, 1.5], H_lomb: [0, 0.25, 1, 1.25],
};
const RHY_TIERS = [
  [["q", "e"], ["q", "e", "r"], ["q", "e", "r", "off"], ["q", "e", "off", "H_dq"], ["q", "e", "r", "off", "H_dq"], ["q", "e", "r", "off", "H_dq", "H_tied"]],
  [["q", "e", "de"], ["q", "e", "es", "se"], ["q", "e", "de", "es", "se", "r"], ["e", "s", "es", "se"], ["q", "e", "s", "de", "off", "H_tied"], ["e", "s", "de", "es", "se", "off", "r", "H_dq"]],
  [["q", "e", "tri"], ["e", "tri", "tri2"], ["q", "tri", "s", "e"], ["e", "s", "ses", "tri", "off"], ["s", "de", "ses", "syn", "tri"], ["e", "s", "de", "ses", "syn", "tri", "tri2", "H_ant"]],
  [["e", "syn", "off", "H_ant"], ["s", "syn", "s3", "sx", "e"], ["H_32", "q", "e", "tri"], ["s", "ses", "syn", "s3", "H_ant", "H_tied"], ["tri", "tri2", "s", "syn", "H_32", "H_lomb"], ["s", "de", "ses", "syn", "s3", "sx", "tri", "H_32", "H_ant", "H_lomb"]],
  [["s", "syn", "s3", "sx", "ses", "tri2"], ["H_32", "H_lomb", "H_ant", "syn", "s"], ["s3", "sx", "syn", "tri", "tri2", "H_lomb", "r"], ["s", "ses", "syn", "s3", "sx", "tri", "tri2", "H_32", "H_ant", "H_lomb", "H_tied"], ["syn", "sx", "s3", "H_32", "H_lomb", "tri2", "off"], Object.keys(CELLS)],
];
const buildRhythm = (allowed) => {
  for (let tries = 0; tries < 40; tries++) {
    const pat = []; let b = 0;
    while (b < 4) { const opts = allowed.filter((c) => !(c.startsWith("H_") && b > 2)); const c = pick(opts); CELLS[c].forEach((x) => pat.push(b + x)); b += c.startsWith("H_") ? 2 : 1; }
    if (pat.length >= 3 && pat.length <= 12) return pat;
  }
  return [0, 1, 2, 3];
};

const SB_PLAN = [
  (s) => ({ ids: ["major"], keys: keysUpTo(1 + Math.floor((s - 1) * 12 / 30)), newKey: KEY_PATH[Math.min(11, Math.floor((s - 1) * 12 / 30))] }),
  (s) => (s <= 18 ? { ids: ["minor"], keys: MINOR_CIRCLE.slice(0, 1 + Math.floor((s - 1) * 12 / 18)), newKey: MINOR_CIRCLE[Math.min(11, Math.floor((s - 1) * 12 / 18))] } : { ids: s <= 24 ? ["pmaj", "pmin"] : ["pmaj", "pmin", "major", "minor"], keys: KEYS_ALL }),
  (s) => ({ ids: [["harm"], ["harm", "mel"], ["mel", "blues"], ["blues", "mblues"], ["harm", "mel", "blues", "mblues"], ["harm", "mel", "blues", "mblues", "pmin", "minor"]][Math.floor((s - 1) / 5)], keys: s % 5 <= 2 && s % 5 > 0 ? keysUpTo(6) : KEYS_ALL }),
  (s) => ({ ids: [["dor"], ["mix"], ["lyd", "phr"], ["loc", "dor", "mix"], ["hmaj", "phrd", "lyd"], ["ion", "dor", "phr", "lyd", "mix", "aeo", "loc"]][Math.floor((s - 1) / 5)], keys: s <= 10 ? keysUpTo(8) : KEYS_ALL }),
  (s) => ({ ids: [["tizM", "tizm"], ["batM", "batm"], ["amb", "anc"], ["whole", "lydd", "alt"], ["dimhw", "dimwh", "bebop", "hung", "hira"], ALL_SCALES.filter((x) => x.id !== "chrom").map((x) => x.id)][Math.floor((s - 1) / 5)], keys: KEYS_ALL }),
];

const GAMES = [
  { id: "degree", title: "Degree Dash", desc: "Hear the key, name the scale degree", icon: Target, color: "#22E4FF", roles: ["singer", "keys", "acoustic", "lead", "bass"],
    gen: (L) => { const [t, g5] = TS(L);
      const POOLS0 = [["1", "3", "5"], ["1", "2", "3", "5"], ["1", "2", "3", "4", "5"], ["1", "2", "3", "4", "5", "6"], ["1", "2", "3", "4", "5", "6", "7"], ["1", "2", "3", "4", "5", "6", "7", "8"]];
      const CHROM = [["b7"], ["b7", "b3"], ["b7", "b3", "b6"], ["b7", "b3", "b6", "#4"], ["b7", "b3", "b6", "#4", "b2"], ["b7", "b3", "b6", "#4", "b2"]];
      let pool, keys, style, oct = [0];
      if (t === 0) { pool = POOLS0[g5]; keys = g5 < 4 ? [0] : g5 === 4 ? keysUpTo(3) : keysUpTo(5); style = "cad"; }
      else if (t === 1) { pool = POOLS0[5]; keys = keysUpTo(2 + g5 * 2); style = "cad"; if (g5 >= 3) oct = [-12, 0, 12]; }
      else if (t === 2) { pool = sortDeg([...POOLS0[5], ...CHROM[g5]]); keys = KEYS_ALL; style = g5 < 3 ? "cad" : "fast"; oct = [-12, 0, 0, 12]; }
      else if (t === 3) { pool = sortDeg([...POOLS0[5], ...CHROM[5]]); keys = KEYS_ALL; style = g5 < 3 ? "fast" : "chord"; oct = [-12, 0, 12]; }
      else { pool = sortDeg([...POOLS0[5], ...CHROM[5]]); keys = KEYS_ALL; style = g5 < 3 ? "chord" : "note"; oct = [-24, -12, 0, 12]; }
      const key = pick(keys); const base = keyBase(key); const d = pick(pool); const o = pick(oct); const inst = t >= 3 && Math.random() < 0.4 ? "acoustic" : "piano";
      const playN = () => AE.play(inst, base + DEG_SEMI[d] + o, 1.2, 0, 0.8);
      return { kind: "choice", sig: key + d, prompt: `Key of ${kName(key)} — which degree is the note?`, options: pool, answer: d, play: () => { const w = playKey(base, style); setTimeout(playN, w); }, reveal: playN }; } },

  { id: "interval", title: "Interval Hunter", desc: "Name the distance between two notes", icon: Ladder, color: "#8B5CFF", roles: ["singer", "keys", "acoustic", "lead", "bass", "sound"],
    gen: (L) => { const [t, g5] = TS(L);
      const P0 = [["M3", "P5", "Octave"], ["M2", "M3", "P5", "Octave"], ["M2", "M3", "P4", "P5", "Octave"], ["M2", "M3", "P4", "P5", "M6", "Octave"], ["M2", "M3", "P4", "P5", "M6", "M7", "Octave"], ["M2", "M3", "P4", "P5", "M6", "M7", "Octave"]];
      const P1 = [["m3", "M3", "P5", "Octave"], ["m3", "M3", "P4", "P5", "Octave"], ["M2", "m3", "M3", "P4", "P5", "Octave"], ["M2", "m3", "M3", "P4", "P5", "m6", "M6", "Octave"], ["M2", "m3", "M3", "P4", "P5", "m6", "M6", "m7", "Octave"], ["m2", "M2", "m3", "M3", "P4", "P5", "m6", "M6", "m7", "M7", "Octave"]];
      const FULL = INTERVALS.map((x) => x[0]);
      let pool, root, dir = "up", named = true, gapMs = 750;
      if (t === 0) { pool = P0[g5]; root = 60; }
      else if (t === 1) { pool = P1[g5]; root = 60 + pick(keysUpTo(2 + g5 * 2)); if (root > 66) root -= 12; }
      else if (t === 2) { pool = P1[5]; root = 52 + rand(14); dir = g5 < 3 ? "down" : pick(["up", "down"]); }
      else if (t === 3) { pool = FULL; root = 50 + rand(16); dir = g5 < 3 ? "harm" : pick(["up", "down", "harm"]); named = g5 < 3; gapMs = 600; }
      else { pool = FULL; root = 45 + rand(24); dir = pick(["up", "down", "harm", "harm"]); named = false; gapMs = 450; }
      const name = pick(pool); const iv = INTERVALS.find((x) => x[0] === name)[1];
      const lo = dir === "down" ? root - iv : root; const hi = lo + iv;
      const what = dir === "harm" ? "both notes together" : dir === "down" ? "going DOWN" : "going up";
      const prompt = named ? `From ${kName(root % 12)} ${what} — which interval?` : `${what[0].toUpperCase() + what.slice(1)} — which interval?`;
      return { kind: "choice", sig: name + dir + (root % 12), prompt, options: pool, answer: name, rootLabel: named ? kName(root % 12) : null,
        play: () => { if (dir === "harm") AE.chord([lo, hi], 1.5); else if (dir === "down") { AE.tone(hi, 0.8); setTimeout(() => AE.tone(lo, 1.1), gapMs); } else { AE.tone(lo, 0.8); setTimeout(() => AE.tone(hi, 1.1), gapMs); } },
        extra: t <= 1 ? { label: `Hear root ${kName(root % 12)}`, fn: () => AE.tone(dir === "down" ? hi : lo, 1) } : null }; } },

  { id: "quality", title: "Chord Quality", desc: "Major, minor, 7th, sus… what is it?", icon: Music, color: "#FF3EA5", roles: ["singer", "keys", "acoustic", "lead", "bass"],
    gen: (L) => { const [t, g5] = TS(L);
      const POOLS = [
        [["", "m"], ["", "m"], ["", "m", "dim"], ["", "m", "aug"], ["", "m", "sus4"], ["", "m", "dim", "aug", "sus2", "sus4"]],
        [["maj7", "7"], ["maj7", "7", "m7"], ["maj7", "7", "m7", "m7b5"], ["maj7", "7", "m7", "m7b5", "dim7"], ["", "m", "maj7", "7", "m7"], ["", "m", "dim", "sus4", "maj7", "7", "m7", "m7b5", "dim7"]],
        [["", "m"], ["", "m", "dim", "aug"], ["maj7", "7", "m7"], ["maj7", "7", "m7", "m7b5"], ["", "m", "sus2", "sus4", "maj7", "7", "m7"], ["", "m", "dim", "aug", "sus2", "sus4", "maj7", "7", "m7", "m7b5", "dim7"]],
        [["6", "m6", "maj7"], ["add9", "sus2", ""], ["9", "7", "maj9"], ["m9", "m7", "m6"], ["6", "m6", "add9", "9", "maj9", "m9"], ["", "m", "6", "m6", "add9", "9", "maj9", "m9", "7", "maj7", "m7"]],
        [CHORD_TYPES.map((c) => c.id).slice(0, 8), CHORD_TYPES.map((c) => c.id).slice(4, 14), CHORD_TYPES.map((c) => c.id), CHORD_TYPES.map((c) => c.id), CHORD_TYPES.map((c) => c.id), CHORD_TYPES.map((c) => c.id)],
      ];
      const ids = new Set(CHORD_TYPES.map((c) => c.id)); const pool = POOLS[t][g5].filter((x) => ids.has(x));
      const q = pick(pool); const ct = CHORD_TYPES.find((c) => c.id === q);
      const root = t === 0 && g5 < 3 ? 48 : 45 + rand(14); const inv = t >= 2 ? rand(Math.min(3, ct.iv.length)) : 0; const v = voiceChord(root, ct.iv, inv, t >= 3 ? "open" : "close");
      const how = t === 0 && g5 < 2 ? "arp" : t >= 4 && Math.random() < 0.5 ? "strum" : "block";
      return { kind: "choice", sig: q + root, prompt: t === 0 && g5 < 3 ? "Root is C — what kind of chord?" : "What kind of chord is this?", options: shuffle(pool).map(qName), answer: qName(q),
        play: () => { if (how === "arp") { v.forEach((m, i) => AE.tone(m, 0.6, i * 0.22, 0.6)); setTimeout(() => AE.chord(v, 1.4), v.length * 220 + 120); } else if (how === "strum") AE.strum(v); else AE.chord(v, 1.6); } }; } },

  { id: "numbers", title: "Number Ninja", desc: "Numbers, chords, piano keys & ears", icon: Layers, color: "#C6FF3D", roles: ["singer", "keys", "acoustic", "lead", "bass"],
    gen: (L) => { const [t, g5] = TS(L);
      const keys = t === 0 ? (g5 < 2 ? [0] : g5 < 4 ? [0, 7] : [0, 7, 5]) : t === 1 ? keysUpTo(3 + g5 * 2) : KEYS_ALL;
      const MODES = [
        [["fwd"], ["fwd", "rev"], ["fwd", "rev", "tap"], ["tap", "root"], ["fwd", "rev", "tap", "root"], ["tap", "root", "chord"]],
        [["fwd", "rev", "tap"], ["tap", "root"], ["root", "chord"], ["fwd", "tap", "root", "chord"], ["chord", "root", "tap"], ["fwd", "rev", "tap", "root", "chord"]],
        [["chord", "root"], ["chord", "prog"], ["tap", "chord", "prog"], ["root", "prog"], ["prog", "chord"], ["fwd", "rev", "tap", "root", "chord", "prog"]],
        [["prog"], ["prog", "chord"], ["prog", "root"], ["prog", "prog3"], ["prog3", "chord"], ["prog", "prog3", "chord", "root"]],
        [["prog3"], ["prog3", "chord"], ["prog3", "root", "tap"], ["prog3"], ["prog3", "chord"], ["prog3", "prog", "chord", "root", "tap"]],
      ];
      const mode = pick(MODES[t][g5]); const seven = t >= 2; const maxD = seven ? 7 : 6;
      const key = pick(keys); const base = keyBase(key);
      const nm = (dd) => NOTE_NAMES[(key + DIATONIC.degs[dd]) % 12] + DIATONIC.q[dd];
      const triad = (dd) => { const r = (key + DIATONIC.degs[dd]) % 12; const q = DIATONIC.q[dd]; return (q === "m" ? [0, 3, 7] : q === "dim" ? [0, 3, 6] : [0, 4, 7]).map((x) => r + x); };
      const playCh = (dd, w = 0) => setTimeout(() => { const r = (key + DIATONIC.degs[dd]) % 12; AE.tone(36 + r + (r > 7 ? -12 : 0) + 12, 1.2, 0, 0.7); AE.chord(voiceLead(null, triad(dd)), 1.2); }, w);
      const nums = Array.from({ length: maxD }, (_, i) => String(i + 1));
      const d = 1 + rand(maxD - 1); // never the 1 (that's the reference)
      if (mode === "fwd") return { kind: "choice", sig: mode + key + d, prompt: `Key of ${kName(key)}: what is the ${d + 1} chord?`, options: choicesFrom(nm(d), [...nums.map((n) => nm(+n - 1)), ...[1, 3, 4].map((x) => NOTE_NAMES[(key + DIATONIC.degs[d] + x) % 12] + DIATONIC.q[d])], t >= 1 ? 6 : 4), answer: nm(d), play: null, reveal: () => playCh(d) };
      if (mode === "rev") return { kind: "choice", sig: mode + key + d, prompt: `Key of ${kName(key)}: ${nm(d)} is which number?`, options: nums, answer: String(d + 1), play: null, reveal: () => playCh(d) };
      if (mode === "tap") { const r = (key + DIATONIC.degs[d]) % 12; return { kind: "seq", sig: mode + key + d, prompt: `Key of ${kName(key)}: tap the root of the ${d + 1} chord on the piano`, seq: [60 + r], base: 60, play: null, reveal: () => playCh(d) }; }
      if (mode === "root") { const r = DIATONIC.degs[d]; return { kind: "choice", sig: mode + key + d, prompt: `Key of ${kName(key)}: hear the key, then a bass note — which number?`, options: nums, answer: String(d + 1), play: () => { const w = playKey(base, t >= 2 ? "fast" : "cad"); setTimeout(() => AE.play("bass", base - 24 + r, 1.4, 0, 0.9), w); } }; }
      if (mode === "chord") return { kind: "choice", sig: mode + key + d, prompt: `Key of ${kName(key)}: the 1 chord, then… which number?`, options: nums, answer: String(d + 1), play: () => { playCh(0); playCh(d, 1100); } };
      const len = mode === "prog3" ? 3 : 2; const seq = Array.from({ length: len }, () => 1 + rand(maxD - 1)); const lab = (a) => ["1", ...a.map((x) => String(x + 1))].join(" → ");
      const wrong = []; while (wrong.length < 5) { const w = seq.map((x) => (Math.random() < 0.5 ? x : 1 + rand(maxD - 1))); if (lab(w) !== lab(seq) && !wrong.includes(lab(w))) wrong.push(lab(w)); }
      return { kind: "choice", sig: mode + key + seq.join(""), prompt: `Key of ${kName(key)}: name the progression`, options: shuffle([lab(seq), ...wrong.slice(0, t >= 4 ? 5 : 3)]), answer: lab(seq), play: () => { playCh(0); seq.forEach((x, i) => playCh(x, (i + 1) * (t >= 4 ? 900 : 1100))); } }; } },

  { id: "builder", title: "Scale Builder", desc: "Play scales up and down, key by key", icon: PianoIcon, color: "#FF8A00", roles: ["singer", "keys", "acoustic", "lead", "bass"], time: (L) => Math.max(14, Math.round(40 - tierIdx(L) * 4 - prog01(L) * 6)),
    gen: (L) => { const [t, , s] = TS(L); const plan = SB_PLAN[t](s);
      let key = plan.newKey != null && Math.random() < 0.6 ? plan.newKey : pick(plan.keys); const id = pick(plan.ids); const S = sc(id) || sc("major");
      const dir = t === 0 && s <= 2 ? "up" : pick(["up", "down"]);
      const rootM = 60 + key; const up = [...S.steps.map((x) => rootM + x), rootM + 12]; const seq = dir === "up" ? up : [...up].reverse();
      return { kind: "seq", sig: id + key + dir, prompt: `Play ${kName(key)} ${S.name} ${dir === "up" ? "UP ↑ (root to root)" : "DOWN ↓ (top root to bottom)"}`, seq, base: 60, hint: dir === "up" ? `Start on ${kName(key)}` : `Start on the high ${kName(key)}`, play: null, reveal: () => seq.forEach((m, i) => AE.tone(m, 0.3, i * 0.18, 0.6)) }; } },

  { id: "echo", title: "Echo Melody", desc: "Listen, then play it back", icon: Repeat, color: "#FFE53D", roles: ["singer", "keys", "acoustic", "lead", "bass"], time: (L) => Math.max(12, Math.round(32 - tierIdx(L) * 3)),
    gen: (L) => { const [t, g5] = TS(L);
      const len = [3, 4, 5, 6, 7][t] + (g5 >= 3 ? 1 : 0); const key = t === 0 ? (g5 < 4 ? 0 : pick([0, 7, 5])) : t === 1 ? pick(keysUpTo(3 + g5)) : pick(KEYS_ALL);
      const range = t === 0 ? (g5 < 2 ? [0, 1, 2] : g5 < 4 ? [0, 1, 2, 3, 4] : [0, 1, 2, 3, 4, 5]) : t === 1 ? [0, 1, 2, 3, 4, 5, 6, 7] : [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const leap = [2, 3, 4, 5, 7][t]; const minor = t >= 3 && Math.random() < 0.5; const base = keyBase(key); const steps = minor ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
      const dm = (d) => base + Math.floor(d / 7) * 12 + steps[((d % 7) + 7) % 7];
      let prev = 0; const ds = [0]; while (ds.length < len) { let n = pick(range); if (Math.abs(n - prev) > leap) n = Math.max(range[0], Math.min(range[range.length - 1], prev + pick([-2, -1, 1, 2]))); if (n === prev) n = prev + (prev < 4 ? 1 : -1); ds.push(n); prev = n; }
      let midis = ds.map(dm); if (t >= 4 && g5 >= 3) { const i = 1 + rand(len - 2); midis[i] += pick([-1, 1]); }
      const gap = [0.55, 0.5, 0.45, 0.4, 0.33][t]; const low = Math.min(...midis);
      return { kind: "seq", sig: midis.join(","), prompt: `Play back the ${len}-note ${minor ? "minor " : ""}melody (starts on ${NOTE_NAMES[midis[0] % 12]})`, seq: midis, base: low, play: () => midis.forEach((m, i) => AE.tone(m, 0.45, i * gap, 0.7)) }; } },

  { id: "rhythm", title: "Rhythm Tap", desc: "Tap the rhythm back in time", icon: Timer, color: "#7CFFB2", roles: ["singer", "keys", "acoustic", "lead", "bass", "drums", "sound"], time: () => 30,
    gen: (L) => { const [t, g5] = TS(L); const pat = buildRhythm(RHY_TIERS[t][g5]); const bpm = 66 + t * 8 + g5 * 2 + rand(5); return { kind: "tap", sig: pat.join(","), prompt: "Listen, then tap the same rhythm", pattern: pat, bpm, tol: Math.max(45, 150 - t * 22 - g5 * 3) }; } },

  { id: "freq", title: "Frequency Hunter", desc: "Which band was boosted or cut?", icon: Sliders, color: "#22E4FF", roles: ["sound"],
    gen: (L) => { const [t, g5] = TS(L);
      const POOLS = [[125, 1000, 8000], [125, 500, 2000, 8000], [125, 500, 1000, 4000, 8000], [63, 250, 1000, 4000, 12000], [63, 125, 250, 500, 1000, 2000, 4000, 8000], [31, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000], [100, 200, 400, 800, 1600, 3150, 6300, 12500], [80, 125, 200, 315, 500, 800, 1250, 2000, 3150, 5000, 8000, 12500]];
      const pool = POOLS[Math.min(7, t * 2 + (g5 >= 3 ? 1 : 0) - (t === 0 && g5 < 2 ? 0 : 0))]; const f = pick(pool); const cut = t >= 1 && Math.random() < 0.15 + t * 0.12; const gain = (cut ? -1 : 1) * Math.max(3, 14 - t * 2.2 - g5 * 0.4); const qv = 1.2 + t * 0.4;
      return { kind: "choice", sig: f + "" + cut, prompt: cut ? "Which band was CUT?" : "Which band was boosted?", options: pool.map(fLabel), answer: fLabel(f), play: () => { const c = AE.get(); const src = c.createBufferSource(); src.buffer = AE.pink(); const bq = c.createBiquadFilter(); bq.type = "peaking"; bq.frequency.value = f; bq.Q.value = qv; bq.gain.value = gain; const gg = c.createGain(); gg.gain.value = 0.55; src.connect(bq); bq.connect(gg); gg.connect(AE.out()); src.start(); src.stop(c.currentTime + 2.4); } }; } },

  { id: "bpm", title: "Tempo Detective", desc: "Guess the BPM of the groove", icon: Drum, color: "#FF8A00", roles: ["drums", "sound", "bass"],
    gen: (L) => { const [t] = TS(L); const p = prog01(L); const gap = Math.max(2, Math.round([[30, 15], [15, 8], [8, 5], [5, 3], [3, 2]][t].reduce((a, b) => a + (b - a) * p))); const bpm = 60 + rand(t >= 2 ? 21 : 13) * 5 + (t >= 3 ? rand(5) : 0);
      const opts = shuffle([...new Set([bpm, bpm + gap, bpm - gap, bpm + 2 * gap, ...(t >= 1 ? [bpm - 2 * gap] : [])])].filter((x) => x > 40)); const bars = t >= 3 ? 1 : 2; const feel = pick(["straight", "half", "four"]);
      return { kind: "choice", sig: String(bpm), prompt: "What tempo is this groove?", options: opts.map((x) => `${x} bpm`), answer: `${bpm} bpm`, play: () => { const b = 60 / bpm; for (let i = 0; i < 8 * bars; i++) AE.hat(i * b / 2, false, i % 2 ? 0.25 : 0.4); for (let i = 0; i < 4 * bars; i++) { if (feel === "four" || i % 2 === 0) AE.kick(i * b); if (feel === "half" ? i % 4 === 2 : i % 2 === 1) AE.snare(i * b, 0.8); } } }; } },

  { id: "fret", title: "Fretboard Finder", desc: "Which note is at this string and fret?", icon: Guitar, color: "#FF8A00", roles: ["acoustic", "lead", "bass"],
    gen: (L) => { const [t, g5] = TS(L); const bass = false; const STR = [["E (low)", 40], ["A", 45], ["D", 50], ["G", 55], ["B", 59], ["e (high)", 64]];
      const strings = t === 0 ? STR.slice(0, g5 < 3 ? 2 : 3) : t === 1 ? STR.slice(0, 4) : STR; const maxF = [5, 7, 9, 12, 12][t] + (g5 >= 3 ? 2 : 0);
      const [sn, open] = pick(strings); const f = t === 0 ? rand(Math.min(maxF, 6)) : rand(maxF + 1); const m = open + f; const pc = ((m % 12) + 12) % 12;
      const opts = t < 2 ? ["C", "D", "E", "F", "G", "A", "B"].concat(t >= 1 ? [] : []) : NOTE_NAMES.slice(); const ans = NOTE_NAMES[pc];
      const pool = opts.includes(ans) ? opts : [...opts, ans];
      return { kind: "choice", sig: sn + f, prompt: `${sn} string, fret ${f} — which note?`, options: pool, answer: ans, play: () => AE.play("acoustic", m, 1.2, 0, 0.8), extra: { label: "Hear it", fn: () => AE.play("acoustic", m, 1.2, 0, 0.8) } }; } },

  { id: "meter", title: "Meter Detective", desc: "4/4, 3/4, 6/8 or 7/8? Feel the groove", icon: Timer, color: "#C6FF3D", roles: ["drums", "bass", "keys", "acoustic", "lead"],
    gen: (L) => { const [t] = TS(L); const pool = t === 0 ? ["4/4", "3/4"] : t === 1 ? ["4/4", "3/4", "6/8"] : t === 2 ? ["4/4", "3/4", "6/8", "2/4"] : ["4/4", "3/4", "6/8", "5/4", "7/8"];
      const m = pick(pool); const bpm = 70 + rand(40); const b = 60 / bpm; const [n, d] = m.split("/").map(Number); const unit = d === 8 ? b / 2 : b; const groups = m === "7/8" ? [0, 2, 4] : m === "6/8" ? [0, 3] : m === "5/4" ? [0, 3] : [0];
      return { kind: "choice", sig: m + bpm, prompt: "Listen to the groove — what is the time signature?", options: pool, answer: m, play: () => { for (let bar = 0; bar < 3; bar++) for (let i = 0; i < n; i++) { const w = (bar * n + i) * unit; AE.hat(w, false, 0.45); if (i === 0) AE.kick(w, 1); else if (groups.includes(i)) AE.kick(w, 0.55); if (d === 4 && n % 2 === 0 && i % 2 === 1) AE.snare(w, 0.6); if (d === 8 && i === 3 && n === 6) AE.snare(w, 0.6); if (n === 3 && d === 4 && i > 0) AE.snare(w, 0.35); } } }; } },
];
try { window.__BEZA_GAMES = () => GAMES; window.__BEZA_EAR = () => EAR_MODULES; } catch (e) { }
const gamesFor = (roles) => GAMES.filter((g) => g.roles.some((r) => roles.includes(r)));
const QPL = 10, PASS = 7;
const gameXP = (games) => Object.values(games.best || {}).reduce((s, lv) => s + Object.values(lv).reduce((a, x) => a + (x.score || 0), 0), 0);
const teamScore = (m, gid) => { if (m.games) return gid ? Math.max(0, ...Object.values((m.games.best || {})[gid] || {}).map((x) => x.score || 0)) * 4 : gameXP(m.games); const seed = (m.id * 9301 + (gid ? gid.length * 49297 : 0)) % 233280; return Math.round((seed / 233280) * 4000 + m.prog * 5000); };

function GamesHub({ root }) {
  const { T, user, games, push } = useApp();
  const roles = user.roles || [];
  const [rid0, setRid] = useState(roles[0]); const rid = roles.includes(rid0) ? rid0 : roles[0]; const rr = roleOf(rid);
  const list = gamesForRole(rid); const tg = TILE_GAMES[rid];
  const myXP = gameXP(games);
  const board = [...TEAM.map((m) => ({ name: m.name, color: m.color, xp: teamScore(m) })), { name: user.name, color: T.pop, xp: myXP, me: true }].sort((a, b) => b.xp - a.xp);
  const myRank = board.findIndex((b) => b.me) + 1;
  return (
    <div>
      <TopBar title="Game Arena" sub="Learn by playing · climb the team board" onBack={root ? false : undefined} />
      <Card tone="hero" style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(0,0,0,0.25)", display: "grid", placeItems: "center" }}><Trophy size={34} noBlob /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1, opacity: 0.85 }}>YOUR TEAM RANK</div>
            <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>#{myRank} <span style={{ fontSize: 15, fontWeight: 700, opacity: 0.85 }}>of {board.length}</span></div>
            <div style={{ fontSize: 12.5, opacity: 0.9 }}>{myXP.toLocaleString()} XP</div>
          </div>
          <Btn small variant="light" onClick={() => push({ screen: "board" })}>Board</Btn>
        </div>
      </Card>
      <div style={{ fontSize: 12.5, color: T.sub, margin: "12px 2px 0" }}>{rr.label}: <b style={{ color: T.text }}>{list.length + (tg ? 1 : 0) + (rid === "singer" ? VOICE_GAMES.length : 0)} games</b> made for your team</div>
      {roles.length > 1 && <Scroller style={{ marginTop: 14 }}>{roles.map((x) => <Chip key={x} active={rid === x} onClick={() => setRid(x)} style={{ borderColor: roleOf(x).color }}>{roleOf(x).label}</Chip>)}</Scroller>}
      {tg && <>
        <SectionTitle>Play with your {rid === "singer" ? "voice" : "instrument"}</SectionTitle>
        <Card onClick={() => push({ screen: "tiles", dept: rid })} style={{ padding: 16, display: "flex", gap: 14, alignItems: "center", borderLeft: `6px solid ${tg.color}`, cursor: "pointer" }}>
          <div style={{ width: 58, height: 58, borderRadius: 18, background: tg.color, color: "#111", display: "grid", placeItems: "center", fontSize: 28, flexShrink: 0 }}>{rid === "drums" ? "🥁" : rid === "singer" ? "🎤" : rid === "keys" ? "🎹" : "🎸"}</div>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 900, fontSize: 17 }}>{tg.title}</div><div style={{ fontSize: 12, color: T.sub, lineHeight: 1.4, marginTop: 2 }}>{tg.desc}</div><div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>{tg.inputs.map((x) => <span key={x} style={{ fontSize: 10.5, fontWeight: 800, padding: "2px 8px", borderRadius: 99, background: T.card2 }}>{rid === "singer" && x === "mic" ? "🎤 Your voice" : INPUT_LABEL[x]}</span>)}</div></div>
          <ChevronRight size={18} />
        </Card>
      </>}
      {rid === "singer" && <>
        <SectionTitle>Voice games</SectionTitle>
        <div style={{ fontSize: 12.5, color: T.sub, margin: "-4px 2px 10px" }}>Every game here is played with your voice — the mic listens and checks your pitch.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{VOICE_GAMES.map((v) => { const b = games.best[v.id] || {}; const st = Object.values(b).reduce((a, x) => a + (x.stars || 0), 0);
          return <Card key={v.id} onClick={() => push({ screen: "vgame", id: v.id })} style={{ display: "flex", gap: 12, alignItems: "center", borderLeft: `6px solid ${v.color}`, cursor: "pointer" }}>
            <div style={{ fontSize: 30 }}>{v.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 900, fontSize: 15 }}>{v.title}</div><div style={{ fontSize: 12, color: T.sub, lineHeight: 1.4 }}>{v.desc}</div><div style={{ fontSize: 11, color: T.faint, marginTop: 3 }}>Trains: {v.trains}</div></div>
            <div style={{ fontSize: 12, fontWeight: 800 }}>⭐ {st}/45</div>
          </Card>; })}</div>
      </>}
      {list.length > 0 && <SectionTitle>{rr.label} games</SectionTitle>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {list.map((g) => { const b = games.best[g.id] || {}; const unlocked = Math.min(MAXL, Object.keys(b).filter((k) => b[k].stars > 0).length + 1); const stars = Object.values(b).reduce((s, x) => s + (x.stars || 0), 0);
          return (
            <Card key={g.id} onClick={() => push({ screen: "game", id: g.id })} style={{ minHeight: 150, borderTop: `4px solid ${g.color}` }}>
              <g.icon size={28} blobColor={g.color} />
              <div style={{ fontWeight: 800, fontSize: 14.5, marginTop: 10, lineHeight: 1.2 }}>{g.title}</div>
              <div style={{ fontSize: 11.5, color: T.sub, marginTop: 3, lineHeight: 1.35 }}>{g.desc}</div>
              {GAME_HOW[g.id] && <div style={{ fontSize: 10.5, color: T.faint, marginTop: 4, lineHeight: 1.35 }}>Trains: {GAME_HOW[g.id][1]}</div>}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, marginTop: 10 }}><span style={{ color: tierOf(unlocked)[1] }}>Level {unlocked}/{MAXL} · {tierOf(unlocked)[0]}</span><span>⭐ {stars}/{MAXL * 3}</span></div>
            </Card>
          ); })}
      </div>
    </div>
  );
}

function TeamBoard() {
  const { T, user, games } = useApp();
  const list = [...new Set((user.roles || []).flatMap((r) => GAME_SETS[r] || []))].map((id) => GAMES.find((g) => g.id === id)).filter(Boolean);
  const [gid, setGid] = useState("all");
  const myBest = (id) => Math.max(0, ...Object.values(games.best[id] || {}).map((x) => x.score || 0));
  const myVal = gid === "all" ? gameXP(games) : myBest(gid);
  const rows = [...TEAM.map((m) => ({ name: m.name, color: m.color, roles: m.roles, v: gid === "all" ? teamScore(m) : Math.round(teamScore(m, gid) / 4) })), { name: user.name, color: T.pop, roles: user.roles, v: myVal, me: true }].sort((a, b) => b.v - a.v);
  const medal = ["🥇", "🥈", "🥉"];
  return (
    <div>
      <TopBar title="Team Leaderboard" sub="Game scores only · everyone can see" />
      <Scroller><Chip active={gid === "all"} onClick={() => setGid("all")}>All games (XP)</Chip>{list.map((g) => <Chip key={g.id} active={gid === g.id} onClick={() => setGid(g.id)}>{g.title}</Chip>)}</Scroller>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "14px 0", alignItems: "end" }}>
        {[1, 0, 2].map((i) => { const r = rows[i]; if (!r) return <div key={i} />; return (
          <Card key={i} tone={i === 0 ? "hero" : "card"} pad={10} style={{ textAlign: "center", paddingTop: i === 0 ? 18 : 10 }}>
            <div style={{ fontSize: 26 }}>{medal[i]}</div>
            <div style={{ display: "grid", placeItems: "center", margin: "4px 0" }}><Avatar name={r.name} size={i === 0 ? 48 : 40} color={r.color} /></div>
            <div style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.2 }}>{r.me ? "You" : r.name.split(" ")[0]}</div>
            <div style={{ fontSize: 11.5, opacity: 0.85 }}>{r.v.toLocaleString()}</div>
          </Card>
        ); })}
      </div>
      <Card pad={6}>
        {rows.map((r, i) => (
          <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 8px", borderTop: i ? `1px solid ${T.border}` : "none", background: r.me ? T.soft : "transparent", borderRadius: r.me ? 12 : 0 }}>
            <div style={{ width: 26, textAlign: "center", fontWeight: 900, fontSize: 13 }}>{i < 3 ? medal[i] : i + 1}</div>
            <Avatar name={r.name} size={32} color={r.color} />
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{r.me ? `${r.name} (you)` : r.name}</div><div style={{ fontSize: 11, color: T.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.roles.map(roleLabel).join(" · ")}</div></div>
            <div style={{ fontWeight: 800, fontSize: 13.5 }}>{r.v.toLocaleString()}</div>
          </div>
        ))}
      </Card>
      <div style={{ fontSize: 11.5, color: T.faint, textAlign: "center", marginTop: 10 }}>Only game scores are public. Lesson & practice progress stays private to you and the leaders.</div>
    </div>
  );
}

function TapPad({ q, onResult }) {
  const { T } = useApp();
  const [phase, setPhase] = useState("ready");
  const taps = useRef([]); const t0 = useRef(0); const timers = useRef([]);
  const beat = 60 / q.bpm;
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const listen = () => { setPhase("listen"); AE.get(); for (let i = 0; i < 4; i++) AE.click(i === 0, i * beat); q.pattern.forEach((p) => AE.hit("snare", 4 * beat + p * beat, 0.8)); timers.current.push(setTimeout(() => setPhase("ready2"), (8 * beat) * 1000 + 200)); };
  const go = () => { setPhase("count"); taps.current = []; AE.get(); for (let i = 0; i < 4; i++) AE.click(i === 0, i * beat); for (let i = 0; i < 4; i++) AE.click(false, (4 + i) * beat); t0.current = performance.now() + 4 * beat * 1000; timers.current.push(setTimeout(() => setPhase("tap"), 4 * beat * 1000 - 150)); timers.current.push(setTimeout(() => finish(), (8.6 * beat) * 1000)); };
  const finish = () => {
    setPhase("done"); const exp = q.pattern.map((p) => p * beat * 1000); const used = new Set(); let hit = 0, err = 0;
    exp.forEach((e) => { let best = -1, bd = 1e9; taps.current.forEach((t, i) => { const d = Math.abs(t - e); if (!used.has(i) && d < bd) { bd = d; best = i; } }); if (best >= 0 && bd <= q.tol) { used.add(best); hit++; err += bd; } });
    const extra = taps.current.length - used.size; onResult(hit === exp.length && extra <= 1, hit === exp.length ? `${Math.round(err / Math.max(1, hit))} ms average` : `${hit}/${exp.length} beats hit`);
  };
  const tap = () => { if (phase !== "tap" && phase !== "count") return; const t = performance.now() - t0.current; taps.current.push(t); AE.hit("snare", 0, 0.5); };
  return (
    <div>
      <div style={{ display: "flex", gap: 4, margin: "6px 0 12px" }}>{[0, 1, 2, 3].map((b) => <div key={b} style={{ flex: 1, height: 26, borderRadius: 8, background: T.card2, position: "relative" }}>{q.pattern.filter((p) => Math.floor(p) === b).map((p, k) => <div key={k} style={{ position: "absolute", left: `${(p - b) * 100}%`, top: 5, width: 16, height: 16, borderRadius: 99, background: phase === "listen" || phase === "ready2" || phase === "done" ? T.accent : "transparent", border: `2px solid ${T.accent}` }} />)}</div>)}</div>
      {phase === "ready" && <Btn full variant="accent" icon={Headphones} onClick={listen}>Listen to the rhythm</Btn>}
      {phase === "listen" && <Btn full variant="soft" disabled>Listening…</Btn>}
      {phase === "ready2" && <div style={{ display: "flex", gap: 8 }}><Btn variant="soft" icon={Repeat} onClick={listen}>Again</Btn><Btn full variant="accent" icon={Play} onClick={go}>My turn (4-beat count-in)</Btn></div>}
      {(phase === "count" || phase === "tap") && <button onPointerDown={tap} className="bz-press" style={{ width: "100%", height: 130, borderRadius: 28, border: "none", background: phase === "tap" ? T.accent : T.card2, color: phase === "tap" ? T.accentText : T.text, fontFamily: FONT, fontWeight: 900, fontSize: 22, cursor: "pointer" }}>{phase === "tap" ? "TAP!" : "Get ready…"}</button>}
    </div>
  );
}

function GameScreen({ id }) {
  const { T, games, setGames, logPractice, toast } = useApp();
  const g = GAMES.find((x) => x.id === id);
  const best = games.best[g.id] || {};
  const unlocked = Math.min(MAXL, Object.keys(best).filter((k) => best[k].stars > 0).length + 1);
  const [lv, setLv] = useState(null);
  const [tier, setTier] = useState(tierIdx(unlocked));
  const [qi, setQi] = useState(0);
  const [q, setQ] = useState(null);
  const [score, setScore] = useState(0);
  const [right, setRight] = useState(0);
  const [streak, setStreak] = useState(0);
  const [fb, setFb] = useState(null);
  const [left, setLeft] = useState(0);
  const [sel, setSel] = useState([]);
  const [summary, setSummary] = useState(null);
  const rightRef = useRef(0); const scoreRef = useRef(0);
  const kind = lv ? levelKind(lv) : null; const qpl = kind && kind.id === "boss" ? 15 : QPL;
  const limit = (l) => { const base = g.time ? g.time(l) : Math.max(4, Math.round(15 - tierIdx(l) * 2 - prog01(l) * 2)); const k = levelKind(lv || l); return k && k.id === "speed" ? Math.max(3, Math.round(base / 2)) : k && k.id === "boss" ? Math.max(4, Math.round(base * 0.75)) : base; };
  const lastQ = useRef({ sig: null, ans: null });
  const start = (l) => { setTier(tierIdx(l)); rightRef.current = 0; scoreRef.current = 0; setLv(l); setQi(0); setScore(0); setRight(0); setStreak(0); setSummary(null); next(l, 0); };
  const next = (l, i) => { let nq; const k0 = levelKind(l); for (let k = 0; k < 40; k++) { const gl = k0 && k0.id === "boss" ? Math.max(1, l - rand(5)) : k0 && k0.id === "mix" ? 1 + rand(l) : l; nq = g.gen(gl); const sig = nq.sig || nq.prompt + (nq.answer || ""); if (sig !== lastQ.current.sig && (!nq.answer || nq.answer !== lastQ.current.ans || k > 30)) break; } lastQ.current = { sig: nq.sig || nq.prompt + (nq.answer || ""), ans: nq.answer }; setQ(nq); setFb(null); setSel([]); setLeft(limit(l)); setTimeout(() => nq.play && nq.play(), 250); };
  useEffect(() => { if (!q || fb || summary || q.kind === "tap") return; if (left <= 0) { answer(null); return; } const t = setTimeout(() => setLeft((x) => x - 1), 1000); return () => clearTimeout(t); }, [left, q, fb, summary]); // eslint-disable-line
  const answer = (ok, msg) => {
    if (fb) return; const kk = levelKind(lv); const pts = ok ? Math.round((100 + left * 12) * (1 + Math.min(streak, 10) * (kk && kk.id === "streak" ? 0.3 : 0.1)) * (kk && kk.id === "boss" ? 2 : 1)) : 0;
    scoreRef.current += pts; setScore(scoreRef.current); if (ok) { rightRef.current += 1; setRight(rightRef.current); setStreak((s) => s + 1); AE.tone(84, 0.12, 0, 0.35); AE.tone(91, 0.2, 0.08, 0.35); } else { setStreak(0); }
    setFb({ ok, pts, msg }); if (q.reveal) setTimeout(q.reveal, 300);
    const sudden = !ok && kk && kk.id === "sudden";
    setTimeout(() => { if (qi + 1 >= qpl || sudden) finish(); else { setQi(qi + 1); next(lv, qi + 1); } }, ok ? 900 : 1700);
  };
  const finish = () => {
    setQ(null);
    const r = rightRef.current, sc = scoreRef.current;
    const scale = qpl / 10; const pass = Math.ceil(passFor(lv) * scale); const stars = r >= qpl ? 3 : r >= Math.ceil(9 * scale) && pass < Math.ceil(9 * scale) ? 2 : r >= pass ? 1 : 0;
    const prev = best[lv] || { score: 0, stars: 0 };
    setGames((G) => ({ ...G, best: { ...G.best, [g.id]: { ...(G.best[g.id] || {}), [lv]: { score: Math.max(prev.score, sc), stars: Math.max(prev.stars, stars) } } } }));
    setSummary({ right: r, score: sc, stars, newBest: sc > prev.score });
    logPractice(3, `Game: ${g.title}`);
    if (stars > 0 && lv < MAXL && !prev.stars) toast(levelKind(lv + 1) ? `${levelKind(lv + 1).label} unlocked! 🔥` : lv % PER === 0 ? `${tierOf(lv + 1)[0]} tier unlocked! 🔥` : `Level ${lv + 1} unlocked! 🔓`);
  };
  const choose = (opt) => answer(opt === q.answer);
  const tapKey = (m) => {
    if (fb) return;
    if (q.kind === "set") { const pc = m % 12; setSel((s) => (s.includes(pc) ? s.filter((x) => x !== pc) : [...s, pc])); }
    if (q.kind === "seq") { const ns = [...sel, m]; setSel(ns); if (ns.length === q.seq.length) answer(ns.every((x, i) => x % 12 === q.seq[i] % 12)); }
  };
  if (lv == null || summary) return (
    <div>
      <TopBar title={g.title} sub={g.desc} />
      {!summary && GAME_HOW[g.id] && <Card style={{ fontSize: 13.5, lineHeight: 1.55, marginBottom: 12 }}><b>How to play · </b>{GAME_HOW[g.id][0]}<div style={{ marginTop: 6 }}><b>What it trains · </b>{GAME_HOW[g.id][1]}</div></Card>}
      {summary && (
        <Card tone="hero" style={{ textAlign: "center", padding: 22, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, opacity: 0.85 }}>{tierOf(lv)[0].toUpperCase()} · LEVEL {inTier(lv)} {summary.stars ? "CLEARED" : "NOT YET"}</div>
          <div style={{ fontSize: 40, margin: "6px 0" }}>{[0, 1, 2].map((i) => <span key={i} style={{ opacity: i < summary.stars ? 1 : 0.25 }}>⭐</span>)}</div>
          <div style={{ fontSize: 30, fontWeight: 900 }}>{summary.score.toLocaleString()} pts</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>{summary.right}/{qpl} correct{summary.newBest && summary.stars ? " · new personal best! 🎉" : ""}</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>{summary.stars ? `${Math.ceil(passFor(lv) * qpl / 10)}+ correct passes · ${qpl}/${qpl} = ⭐⭐⭐` : `You need ${Math.ceil(passFor(lv) * qpl / 10)}/${qpl} to pass. You've got this — try again!`}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Btn full variant="light" icon={Repeat} onClick={() => start(lv)}>Retry</Btn>
            {summary.stars > 0 && lv < MAXL && <Btn full variant="accent" icon={ChevronRight} onClick={() => start(lv + 1)}>{levelKind(lv + 1) ? levelKind(lv + 1).label : `Level ${lv + 1}`}</Btn>}
          </div>
        </Card>
      )}
      <SectionTitle>Level journey · {Object.values(best).filter((x) => x.stars).length}/{MAXL} cleared · ⭐ {Object.values(best).reduce((a, x) => a + (x.stars || 0), 0)}/{MAXL * 3}</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {Array.from({ length: MAXL }, (_, i) => i + 1).map((l) => { const b = best[l]; const locked = l > unlocked; const tc = tierOf(l)[1]; const k = levelKind(l); const cur = l === unlocked; const side = [0, 1, 2, 1][(l - 1) % 4];
          return (<div key={l}>
            {(l - 1) % PER === 0 && <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 2px 6px" }}><span style={{ width: 9, height: 9, borderRadius: 9, background: tc, boxShadow: `0 0 8px ${tc}` }} /><b style={{ fontSize: 13 }}>{tierOf(l)[0]}</b><span style={{ fontSize: 11, color: T.sub }}>levels {l}–{l + PER - 1}</span></div>}
            <div style={{ display: "flex", justifyContent: ["flex-start", "center", "flex-end"][side], padding: "4px 18px" }}>
              <button disabled={locked} onClick={() => start(l)} className="bz-press" style={{ width: k ? 210 : 180, display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 20, border: `2px solid ${cur ? tc : k && !locked ? tc + "99" : T.border}`, boxShadow: cur ? `0 0 18px ${tc}77` : "none", background: locked ? T.input : k ? `linear-gradient(135deg, ${tc}33, ${T.card})` : T.card, color: T.text, fontFamily: FONT, cursor: locked ? "default" : "pointer", opacity: locked ? 0.55 : 1, textAlign: "left" }}>
                <div style={{ width: 38, height: 38, borderRadius: 99, background: locked ? T.card2 : tc, color: "#111", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 15, flexShrink: 0 }}>{locked ? <Lock size={14} noBlob /> : k && k.id === "boss" ? "👑" : l}</div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 900, fontSize: 13 }}>{k ? k.label : `Level ${l}`}</div><div style={{ fontSize: 11, color: T.sub, lineHeight: 1.3 }}>{k ? k.desc : cur ? "Play next" : b && b.stars ? "Cleared" : ""}</div><div style={{ fontSize: 12, letterSpacing: 1 }}>{[0, 1, 2].map((s2) => <span key={s2} style={{ opacity: b && b.stars > s2 ? 1 : 0.2 }}>⭐</span>)}</div></div>
              </button>
            </div>
          </div>); })}
      </div>
      <Card tone="soft" style={{ marginTop: 14, fontSize: 12.5, lineHeight: 1.55 }}>15 levels, each one harder than the last: more keys, more options, trickier sounds and less time. Levels 5, 10 and 15 are 👑 BOSS levels (15 questions, double XP). Levels 4, 8 and 12 hide a surprise twist. Answer fast for bonus points, build streaks for multipliers, and collect up to ⭐⭐⭐ on every level. Never the same question twice in a row.</Card>
    </div>
  );
  return (
    <div>
      <TopBar title={`${g.title} · Level ${lv}`} sub={`${kind ? kind.label + " · " : ""}Question ${Math.min(qi + 1, qpl)} of ${qpl}`} right={<div style={{ fontWeight: 900, fontSize: 16 }}>{score.toLocaleString()}</div>} />
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>{Array.from({ length: qpl }).map((_, i) => <div key={i} style={{ flex: 1, height: 6, borderRadius: 9, background: i < qi ? g.color : i === qi ? T.text : T.card2 }} />)}</div>
      {q && (
        <Card tone="hero" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, fontWeight: 800 }}>
            <span><Glyph icon={Flame} /> Streak {streak}{streak >= 3 ? ` · ×${(1 + Math.min(streak, 10) * 0.1).toFixed(1)}` : ""}</span>
            {q.kind !== "tap" && <span>{left}s</span>}
          </div>
          {q.kind !== "tap" && <div style={{ marginTop: 8 }}><Bar pct={left / limit(lv)} color={left <= 3 ? "#FF6B6B" : "#fff"} track="rgba(255,255,255,0.22)" h={6} /></div>}
          <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.3, margin: "14px 0 10px" }}>{q.prompt}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{q.play && q.kind !== "tap" && <Btn small variant="light" icon={Volume2} onClick={q.play}>Play again</Btn>}{q.extra && <Btn small variant="light" icon={Music} onClick={q.extra.fn}>{q.extra.label}</Btn>}</div>
          {q.hint && !fb && <div style={{ fontSize: 12, opacity: 0.85, marginTop: 8 }}>💡 {q.hint}</div>}
          {fb && <div className="bz-fadein" style={{ marginTop: 12, padding: "10px 12px", borderRadius: 14, background: fb.ok ? "rgba(124,255,178,0.22)" : "rgba(255,107,107,0.25)", fontWeight: 800 }}>{fb.ok ? `Correct! +${fb.pts}` : `Not quite${q.answer ? ` — it was ${q.answer}` : ""}`}{fb.msg ? ` · ${fb.msg}` : ""}</div>}
        </Card>
      )}
      {q && q.kind === "choice" && (
        <div style={{ display: "grid", gridTemplateColumns: q.options.length > 4 ? "1fr 1fr 1fr" : "1fr 1fr", gap: 8, marginTop: 12 }}>
          {q.options.map((o) => { const show = !!fb; const isAns = o === q.answer;
            return <button key={o} onClick={() => choose(o)} className="bz-press" style={{ minHeight: 54, padding: "8px 6px", borderRadius: 16, border: `1.5px solid ${show && isAns ? T.good : T.border}`, background: show && isAns ? T.good + "33" : T.card, color: T.text, fontFamily: FONT, fontWeight: 800, fontSize: 14, cursor: "pointer", lineHeight: 1.2 }}>{o}</button>; })}
        </div>
      )}
      {q && (q.kind === "set" || q.kind === "seq") && (
        <Card style={{ marginTop: 12, padding: 12 }}>
          <div style={{ fontSize: 12.5, color: T.sub, marginBottom: 8 }}>{q.kind === "set" ? `Selected: ${sel.map((p) => NOTE_NAMES[p]).join(" ") || "—"}` : `Your notes: ${sel.map(nn).join(" ") || "—"} (${sel.length}/${q.seq.length})`}</div>
          <Piano start={q.kind === "seq" ? q.base - (q.base % 12) : 60} octaves={q.kind === "seq" ? 2 : 1} highlight={q.kind === "set" ? Array.from({ length: 13 }, (_, i) => 60 + i).filter((m) => sel.includes(m % 12)) : fb ? q.seq : []} roots={[]} height={110} onNote={tapKey} />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Btn variant="ghost" icon={RefreshCw} onClick={() => setSel([])}>Clear</Btn>
            {q.kind === "set" && <Btn full variant="accent" icon={Check} onClick={() => answer(sel.length === q.answerSet.length && q.answerSet.every((p) => sel.includes(p)))}>Submit</Btn>}
          </div>
        </Card>
      )}
      {q && q.kind === "tap" && !fb && <Card style={{ marginTop: 12 }}><TapPad key={qi} q={q} onResult={(ok, msg) => answer(ok, msg)} /></Card>}
    </div>
  );
}
