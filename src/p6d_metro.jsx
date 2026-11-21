/* ================================ METRONOME ================================ */
/* Sample-accurate Web Audio scheduler (25 ms lookahead) — any tempo, any time signature, groupings, subdivisions,
   accents per beat, speed trainer and gap-click trainer. */
const METRO_SIGS = [[2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [6, 8], [7, 8], [9, 8], [12, 8], [5, 8], [3, 8]];
const METRO_SUBS = [{ id: 1, label: "♩", name: "Beats" }, { id: 2, label: "♫", name: "8ths" }, { id: 3, label: "3", name: "Triplets" }, { id: 4, label: "♬", name: "16ths" }, { id: "sw", label: "Swing", name: "Swing 8ths" }];
const METRO_SOUNDS = [{ id: "click", name: "Click" }, { id: "wood", name: "Woodblock" }, { id: "beep", name: "Beep" }, { id: "cow", name: "Cowbell" }, { id: "kit", name: "Drum kit" }, { id: "voice", name: "Count 1-2-3" }];
const TEMPO_WORDS = [[40, "Largo · very slow"], [60, "Adagio · slow worship"], [72, "Andante · ballad"], [90, "Moderato · mid-tempo"], [110, "Allegretto · light praise"], [125, "Allegro · upbeat praise"], [150, "Vivace · fast praise"], [180, "Presto · very fast"]];
const tempoWord = (b) => (TEMPO_WORDS.filter(([x]) => b >= x).pop() || TEMPO_WORDS[0])[1];
/* default accent grouping for compound / odd meters (e.g. 7/8 = 2+2+3) */
const metroGroups = (n, d) => (d === 8 && n % 3 === 0 ? Array(n / 3).fill(3) : n === 5 ? [3, 2] : n === 7 ? [2, 2, 3] : n === 9 && d !== 8 ? [2, 2, 2, 3] : n === 11 ? [2, 2, 3, 2, 2] : [n]);
const accentsFromGroups = (g) => { const a = []; g.forEach((len, gi) => { for (let i = 0; i < len; i++) a.push(i === 0 ? (gi === 0 ? 2 : 1) : 0); }); return a; }; // 2 = downbeat, 1 = accent, 0 = normal, -1 = mute

function metroVoice(c, dest, t, level, sound) {
  // level: 3 downbeat, 2 accent, 1 beat, 0 subdivision
  if (sound === "kit") {
    if (level >= 2) AE.kick(t - c.currentTime, level === 3 ? 1 : 0.8);
    if (level === 1) AE.snare(t - c.currentTime, 0.45);
    AE.hat(t - c.currentTime, false, level === 0 ? 0.28 : 0.42);
    return;
  }
  const o = c.createOscillator(); const g = c.createGain(); let f = 1000, dur = 0.05, vol = 0.3, type = "sine";
  if (sound === "wood") { type = "square"; f = [520, 820, 1050, 1300][level]; dur = 0.03; }
  else if (sound === "beep") { type = "sine"; f = [660, 880, 1320, 1760][level]; dur = 0.07; }
  else if (sound === "cow") { type = "square"; f = [560, 800, 800, 1080][level]; dur = 0.12; }
  else { type = "sine"; f = [800, 1000, 1400, 1700][level]; dur = 0.05; }
  vol = [0.12, 0.3, 0.42, 0.58][level];
  if (sound === "cow") { const o2 = c.createOscillator(); o2.type = "square"; o2.frequency.value = f * 1.48; const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f * 1.2; bp.Q.value = 3; o.connect(bp); o2.connect(bp); bp.connect(g); o2.start(t); o2.stop(t + dur + 0.02); }
  else o.connect(g);
  o.type = type; o.frequency.value = f;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(dest); o.start(t); o.stop(t + dur + 0.02);
}
function metroSpeak(n, level) { try { if (!window.speechSynthesis) return; const u = new SpeechSynthesisUtterance(String(n)); u.rate = 1.6; u.pitch = level >= 2 ? 1.3 : 1; u.volume = 1; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { } }

function Metronome({ embedded, bpm: bpm0, sig: sig0, mode: mode0 }) {
  const { T, logPractice, toast } = useApp();
  const saved = (() => { try { return JSON.parse(localStorage.getItem("beza-metro") || "{}"); } catch (e) { return {}; } })();
  const [bpm, setBpmRaw] = useState(bpm0 || saved.bpm || 76);
  const [num, setNum] = useState((sig0 && sig0[0]) || saved.num || 4); const [den, setDen] = useState((sig0 && sig0[1]) || saved.den || 4);
  const [groups, setGroups] = useState(sig0 ? metroGroups(sig0[0], sig0[1]) : saved.groups || metroGroups(saved.num || 4, saved.den || 4));
  const [acc, setAcc] = useState(sig0 ? accentsFromGroups(metroGroups(sig0[0], sig0[1])) : saved.acc || accentsFromGroups(saved.groups || metroGroups(saved.num || 4, saved.den || 4)));
  const [sub, setSub] = useState(saved.sub || 1); const [sound, setSound] = useState(saved.sound || "click");
  const [subVol, setSubVol] = useState(saved.subVol != null ? saved.subVol : 0.6);
  const [run, setRun] = useState(false); const [beat, setBeat] = useState(-1); const [bar, setBar] = useState(0);
  const [flash, setFlash] = useState(saved.flash !== false);
  const [mode, setMode] = useState(mode0 || "normal"); // normal | trainer | gap
  const [tr, setTr] = useState(saved.tr || { start: 60, target: 100, step: 4, every: 4 });
  const [gap, setGap] = useState(saved.gap || { play: 2, mute: 2 });
  const [countIn, setCountIn] = useState(false);
  const [txt, setTxt] = useState(String(bpm0 || saved.bpm || 76));
  const st = useRef({}); const taps = useRef([]); const startAt = useRef(0); const dirty = useRef(false);
  const setBpm = (v) => { const b = Math.max(20, Math.min(300, Math.round(v))); setBpmRaw(b); setTxt(String(b)); };
  useEffect(() => { try { localStorage.setItem("beza-metro", JSON.stringify({ bpm, num, den, groups, acc, sub, sound, subVol, flash, tr, gap })); } catch (e) { } }, [bpm, num, den, groups, acc, sub, sound, subVol, flash, tr, gap]);
  const setSig = (n, d, g) => { const gg = g || metroGroups(n, d); setNum(n); setDen(d); setGroups(gg); setAcc(accentsFromGroups(gg)); };
  /* the beat that clicks: quarter for x/4, eighth for x/8 (6/8 counts 6 eighths, grouped in 3s) */
  st.current = { bpm, num, den, acc, sub, sound, subVol, mode, tr, gap, countIn };
  useEffect(() => {
    if (!run) return;
    const c = AE.get(); const out = c.createGain(); out.connect(AE.out ? AE.out() : c.destination); out.gain.value = 1;
    let next = c.currentTime + 0.12; let b = 0; let s = 0; let barN = 0; let curBpm = st.current.mode === "trainer" ? st.current.tr.start : st.current.bpm; let ci = st.current.countIn ? st.current.num : 0;
    if (st.current.mode === "trainer") setBpm(curBpm);
    const vis = []; let raf = 0;
    const loop = () => { const now = c.currentTime; while (vis.length && vis[0].t <= now) { const v = vis.shift(); setBeat(v.b); setBar(v.bar); } raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const tick = () => {
      const S = st.current;
      while (next < c.currentTime + 0.12) {
        const subN = S.sub === "sw" ? 2 : S.sub; const beatLen = 60 / (S.mode === "trainer" ? curBpm : S.bpm);
        const lvlAcc = S.acc[b] != null ? S.acc[b] : 0;
        const muted = S.mode === "gap" && barN % (S.gap.play + S.gap.mute) >= S.gap.play && ci === 0;
        if (s === 0) {
          if (!muted && lvlAcc !== -1) { if (S.sound === "voice") { const at = next; const n = ci > 0 ? S.num - ci + 1 : b + 1; setTimeout(() => metroSpeak(n, lvlAcc + 1), Math.max(0, (at - c.currentTime) * 1000 - 40)); } else metroVoice(c, out, next, ci > 0 ? (b === 0 ? 3 : 1) : lvlAcc === 2 ? 3 : lvlAcc === 1 ? 2 : 1, S.sound); }
          vis.push({ t: next, b: ci > 0 ? -2 - b : b, bar: barN });
        } else if (!muted && S.subVol > 0.02 && ci === 0) { if (S.sound !== "voice") { const g2 = c.createGain(); g2.gain.value = S.subVol; g2.connect(out); metroVoice(c, g2, next, 0, S.sound === "kit" ? "click" : S.sound); } }
        // advance
        let stepLen = beatLen / subN;
        if (S.sub === "sw") stepLen = s === 0 ? beatLen * (2 / 3) : beatLen / 3;
        next += stepLen; s++;
        if (s >= subN) { s = 0; b++;
          if (b >= S.num) { b = 0; if (ci > 0) { ci = 0; } else { barN++;
            if (S.mode === "trainer" && barN % S.tr.every === 0 && curBpm < S.tr.target) { curBpm = Math.min(S.tr.target, curBpm + S.tr.step); const nb = curBpm; setTimeout(() => setBpm(nb), 0); }
          } } }
      }
    };
    tick(); const iv = setInterval(tick, 25);
    startAt.current = Date.now();
    return () => { clearInterval(iv); cancelAnimationFrame(raf); try { out.disconnect(); } catch (e) { } setBeat(-1); const mins = Math.round((Date.now() - startAt.current) / 60000); if (mins >= 1) logPractice(mins, "Metronome"); };
  }, [run]); // eslint-disable-line
  const tap = () => { const now = performance.now(); taps.current = [...taps.current.filter((x) => now - x < 2500), now]; if (taps.current.length >= 2) { const d = taps.current.slice(1).map((x, i) => x - taps.current[i]); const avg = d.reduce((a, x) => a + x, 0) / d.length; setBpm(60000 / avg * (den === 8 ? 1 : 1)); } };
  useEffect(() => { const k = (e) => { if (e.target && /input|textarea/i.test(e.target.tagName)) return; if (e.code === "Space") { e.preventDefault(); setRun((r) => !r); } else if (e.key === "t" || e.key === "T") tap(); else if (e.key === "ArrowUp") setBpm(bpm + 1); else if (e.key === "ArrowDown") setBpm(bpm - 1); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); });
  const cycleAcc = (i) => setAcc((a) => a.map((x, j) => (j === i ? (x === 2 ? 1 : x === 1 ? 0 : x === 0 ? -1 : 2) : x)));
  const groupStr = groups.join("+");
  const groupOpts = (() => { const o = new Set([String(num)]); if (num % 2 === 0) o.add(Array(num / 2).fill(2).join("+")); if (num % 3 === 0) o.add(Array(num / 3).fill(3).join("+")); if (num === 5) { o.add("3+2"); o.add("2+3"); } if (num === 7) { o.add("2+2+3"); o.add("3+2+2"); o.add("2+3+2"); } if (num === 8) o.add("3+3+2"); if (num === 9) o.add("2+2+2+3"); if (num === 10) o.add("3+3+2+2"); if (num === 11) o.add("2+2+3+2+2"); if (num === 12) o.add("3+3+3+3"); o.add(groupStr); return [...o]; })();
  const Big = ({ children, onClick, w = 52 }) => <button onClick={onClick} className="bz-press" style={{ width: w, height: 52, borderRadius: 16, border: `1.5px solid ${T.border}`, background: T.card2, color: T.text, fontFamily: FONT, fontWeight: 900, fontSize: 17, cursor: "pointer" }}>{children}</button>;
  const isDown = beat === 0 && run;
  return (
    <div>
      {!embedded && <ToolBar title="Metronome" sub="Any tempo · any time signature · trainers" />}
      <Card tone="hero" style={{ padding: 18, textAlign: "center", position: "relative", overflow: "hidden", background: flash && run && beat >= 0 && acc[beat] === 2 ? undefined : undefined }}>
        {flash && run && beat >= 0 && <div key={bar + "-" + beat} style={{ position: "absolute", inset: 0, background: acc[beat] === 2 ? "rgba(198,255,61,0.28)" : "rgba(255,255,255,0.10)", animation: "bzMetroFlash .18s ease-out forwards", pointerEvents: "none" }} />}
        <style>{"@keyframes bzMetroFlash{from{opacity:1}to{opacity:0}}"}</style>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, opacity: 0.8 }}>{num}/{den}{groups.length > 1 ? `  ·  ${groupStr}` : ""}{mode === "trainer" ? "  ·  SPEED TRAINER" : mode === "gap" ? "  ·  GAP CLICK" : ""}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, margin: "8px 0 2px" }}>
          <Big onClick={() => setBpm(bpm - 5)}>−5</Big><Big w={44} onClick={() => setBpm(bpm - 1)}>−</Big>
          <input value={txt} inputMode="numeric" onChange={(e) => setTxt(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))} onBlur={() => setBpm(+txt || bpm)} onKeyDown={(e) => e.key === "Enter" && e.target.blur()} style={{ width: 118, textAlign: "center", fontSize: 58, fontWeight: 900, background: "transparent", border: "none", color: "inherit", fontFamily: FONT, outline: "none", padding: 0 }} />
          <Big w={44} onClick={() => setBpm(bpm + 1)}>+</Big><Big onClick={() => setBpm(bpm + 5)}>+5</Big>
        </div>
        <div style={{ fontSize: 12.5, opacity: 0.85 }}>BPM · {tempoWord(bpm)}</div>
        <input type="range" min={20} max={300} value={bpm} onChange={(e) => setBpm(+e.target.value)} style={{ width: "100%", marginTop: 10, accentColor: "#C6FF3D" }} />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", height: 48, gap: 8, margin: "14px 0 6px" }}>
          {Array.from({ length: num }).map((_, i) => { const a = acc[i] != null ? acc[i] : 0; const on = run && (beat === i || beat === -2 - i);
            return <button key={i} onClick={() => cycleAcc(i)} title="Tap to change: downbeat → accent → normal → mute" style={{ width: num > 9 ? 26 : 34, height: a === -1 ? 10 : a === 2 ? 44 : a === 1 ? 34 : 24, alignSelf: "flex-end", borderRadius: 10, border: "none", cursor: "pointer", background: on ? (a === 2 || beat < -1 ? "#C6FF3D" : "#fff") : a === -1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.32)", boxShadow: on ? "0 0 18px rgba(198,255,61,0.9)" : "none", transition: "background .05s" }} />; })}
        </div>
        <div style={{ fontSize: 11, opacity: 0.7 }}>{beat < -1 && run ? `Count-in… ${-1 - beat}` : "Tap a bar to change its accent (big = downbeat, small = mute)"}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <Btn variant="light" onClick={tap} style={{ flex: 1 }}>Tap tempo</Btn>
          <Btn full variant={run ? "light" : "accent"} icon={run ? Square : Play} onClick={() => setRun((r) => !r)} style={{ flex: 2 }}>{run ? `Stop · bar ${bar + 1}` : "Start"}</Btn>
        </div>
        <div style={{ fontSize: 10.5, opacity: 0.6, marginTop: 8 }}>Keyboard: Space = start/stop · T = tap · ↑↓ = tempo</div>
      </Card>

      <SectionTitle>Time signature</SectionTitle>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{METRO_SIGS.map(([n, d]) => <Chip key={n + "/" + d} active={num === n && den === d} onClick={() => setSig(n, d)}>{n}/{d}</Chip>)}</div>
      <Card pad={12} style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <b style={{ fontSize: 13 }}>Custom</b>
        <Btn small variant="soft" onClick={() => setSig(Math.max(1, num - 1), den)}>−</Btn>
        <div style={{ textAlign: "center", lineHeight: 1 }}><div style={{ fontSize: 22, fontWeight: 900 }}>{num}</div><div style={{ height: 2, background: T.text, margin: "3px 0" }} /><div style={{ fontSize: 22, fontWeight: 900 }}>{den}</div></div>
        <Btn small variant="soft" onClick={() => setSig(Math.min(16, num + 1), den)}>+</Btn>
        <div style={{ display: "flex", gap: 4 }}>{[2, 4, 8, 16].map((d) => <Chip key={d} active={den === d} onClick={() => setSig(num, d)}>/{d}</Chip>)}</div>
      </Card>
      {groupOpts.length > 1 && <><div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "12px 2px 6px" }}>GROUPING (where the accents fall)</div>
        <Scroller>{groupOpts.map((g) => <Chip key={g} active={g === groupStr} onClick={() => { const gg = g.split("+").map(Number); setGroups(gg); setAcc(accentsFromGroups(gg)); }}>{g}</Chip>)}</Scroller></>}

      <SectionTitle>Subdivision</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>{METRO_SUBS.map((x) => <button key={x.id} onClick={() => setSub(x.id)} style={{ padding: "10px 2px", borderRadius: 14, border: `1.5px solid ${sub === x.id ? T.accent : T.border}`, background: sub === x.id ? T.accent : T.card, color: sub === x.id ? T.accentText : T.text, fontFamily: FONT, cursor: "pointer" }}><div style={{ fontWeight: 900, fontSize: 18 }}>{x.label}</div><div style={{ fontSize: 10, fontWeight: 700 }}>{x.name}</div></button>)}</div>
      {sub !== 1 && <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, fontSize: 12.5 }}><span style={{ fontWeight: 700 }}>Subdivision volume</span><input type="range" min={0} max={1} step={0.05} value={subVol} onChange={(e) => setSubVol(+e.target.value)} style={{ flex: 1, accentColor: T.accent }} /></div>}

      <SectionTitle>Sound</SectionTitle>
      <Scroller>{METRO_SOUNDS.map((x) => <Chip key={x.id} active={sound === x.id} onClick={() => setSound(x.id)}>{x.name}</Chip>)}</Scroller>
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <Chip active={flash} onClick={() => setFlash((f) => !f)}>{flash ? "✓ " : ""}Flash on the beat</Chip>
        <Chip active={countIn} onClick={() => setCountIn((f) => !f)}>{countIn ? "✓ " : ""}1-bar count-in</Chip>
      </div>

      <SectionTitle>Trainers</SectionTitle>
      <Seg value={mode} onChange={(m) => { setRun(false); setMode(m); }} options={[{ value: "normal", label: "Normal" }, { value: "trainer", label: "Speed up" }, { value: "gap", label: "Gap click" }]} />
      {mode === "trainer" && <Card style={{ marginTop: 10, fontSize: 13, lineHeight: 1.55 }}>
        Starts at <b>{tr.start}</b> and adds <b>+{tr.step} bpm</b> every <b>{tr.every} bars</b> until <b>{tr.target}</b>. Use it to build speed on fills, rudiments and runs without losing control.
        {[["start", "Start", 30, 240, 2], ["target", "Target", 40, 300, 2], ["step", "Add", 1, 20, 1], ["every", "Every (bars)", 1, 16, 1]].map(([k, l, mn, mx, stp]) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}><span style={{ width: 92, fontWeight: 700 }}>{l}</span><input type="range" min={mn} max={mx} step={stp} value={tr[k]} onChange={(e) => setTr((x) => ({ ...x, [k]: +e.target.value }))} style={{ flex: 1, accentColor: T.accent }} /><b style={{ width: 34, textAlign: "right" }}>{tr[k]}</b></div>)}
      </Card>}
      {mode === "gap" && <Card style={{ marginTop: 10, fontSize: 13, lineHeight: 1.55 }}>
        The click plays for <b>{gap.play}</b> bar{gap.play > 1 ? "s" : ""}, then goes silent for <b>{gap.mute}</b>. Keep perfect time in the silence: when it comes back, you should land exactly on the 1. This is how drummers build an inner clock.
        {[["play", "Click bars"], ["mute", "Silent bars"]].map(([k, l]) => <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}><span style={{ width: 92, fontWeight: 700 }}>{l}</span><input type="range" min={1} max={8} value={gap[k]} onChange={(e) => setGap((x) => ({ ...x, [k]: +e.target.value }))} style={{ flex: 1, accentColor: T.accent }} /><b style={{ width: 34, textAlign: "right" }}>{gap[k]}</b></div>)}
      </Card>}

      <SectionTitle>Worship tempo presets</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[["Slow worship", 64, 4, 4], ["6/8 ballad", 52, 6, 8], ["Mid praise", 96, 4, 4], ["Upbeat praise", 128, 4, 4], ["3/4 hymn", 84, 3, 4], ["Ethiopian 6/8 (chik-chika)", 110, 6, 8], ["Fast celebration", 150, 4, 4], ["Odd meter 7/8", 160, 7, 8]].map(([n, b, nn, dd]) => <Card key={n} pad={10} onClick={() => { setBpm(b); setSig(nn, dd); }} style={{ cursor: "pointer" }}><div style={{ fontWeight: 800, fontSize: 13 }}>{n}</div><div style={{ fontSize: 11.5, color: T.sub }}>{b} bpm · {nn}/{dd}</div></Card>)}
      </div>
      <Card tone="soft" style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55 }}>
        <b>How to practise with it:</b> 1) Start 10–20 bpm slower than the song. 2) Play 4 perfect bars, then add 4 bpm. 3) If you make a mistake twice, drop 8 bpm. 4) Finish with Gap click to test your inner time. In x/8 meters every click is an eighth note — 6/8 at 110 means 110 eighth notes a minute.
      </Card>
    </div>
  );
}
