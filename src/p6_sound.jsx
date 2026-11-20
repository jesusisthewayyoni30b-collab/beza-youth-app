
/* ============================ SOUND ENGINEER TOOLS ============================ */
const FLOW = [
  { t: "Mic / DI", s: "Source", d: "Dynamic mics (SM58) for vocals & amps, condensers for choir/overheads, DI boxes for keys, bass and acoustic guitar. Good source = good mix." },
  { t: "Stage box / Snake", s: "Transport", d: "Carries every input from the stage to the console. Label channels and keep the patch list the same every Sunday." },
  { t: "Preamp gain", s: "Gain staging", d: "The most important knob. Set it so the loudest singing peaks around −12 to −6 dBFS — healthy level, no clipping." },
  { t: "High-pass filter", s: "Clean up", d: "Remove rumble below the instrument: vocals ~100 Hz, acoustic ~80 Hz, keys ~60 Hz. Not on kick or bass." },
  { t: "Gate", s: "Optional", d: "Closes the channel when quiet. Useful on toms; rarely needed on vocals in church." },
  { t: "EQ", s: "Tone", d: "Cut problems first (mud, boxiness, harshness), then gently boost presence and air." },
  { t: "Compressor", s: "Dynamics", d: "Evens out loud and soft moments so the vocal sits steady in the mix." },
  { t: "Aux sends", s: "Monitors & FX", d: "Pre-fader auxes feed monitor mixes; post-fader auxes feed reverb and delay." },
  { t: "Fader & DCA", s: "Balance", d: "Faders set the mix. DCAs/groups let one fader control all vocals or all drums." },
  { t: "Main L/R → Amps → Speakers", s: "Output", d: "The final mix goes to the PA. Keep the master near 0 dB and mix with the channel faders." },
];
function SignalFlow({ embedded }) {
  const { T } = useApp();
  const [open, setOpen] = useState(2);
  return (
    <div>
      <ToolBar embedded={embedded} title="Signal Flow & Gain Staging" sub="Follow the signal from mic to speaker" />
      <div style={{ position: "relative", paddingLeft: 6 }}>
        {FLOW.map((n, i) => (
          <div key={i} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 30, height: 30, borderRadius: 99, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, background: open === i ? T.accent : T.card2, color: open === i ? T.accentText : T.text }}>{i + 1}</div>
              {i < FLOW.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 14, background: T.border }} />}
            </div>
            <Card pad={12} onClick={() => setOpen(open === i ? -1 : i)} tone={open === i ? "soft" : "card"} style={{ flex: 1, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700, fontSize: 14 }}>{n.t}</span><span style={{ fontSize: 11, color: T.sub, fontWeight: 600 }}>{n.s}</span></div>
              {open === i && <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 6 }}>{n.d}</div>}
            </Card>
          </div>
        ))}
      </div>
      <GainLab />
      {!embedded && <MarkComplete id="flow" label="Signal flow" mins={5} />}
    </div>
  );
}

/* ---------------- GAIN LAB: real sound, real meter ---------------- */
const GAIN_SOURCES = [
  { id: "soft", name: "Soft singer", stem: "Lead", mic: -54, tip: "Quiet voices need lots of gain. Ask them to sing the loudest line of the song." },
  { id: "loud", name: "Worship leader (big chorus)", stem: "Lead", mic: -32, tip: "Set gain on the loudest moment (the chorus), not the quiet verse, or it will clip later." },
  { id: "ac", name: "Acoustic guitar (DI)", stem: "Acoustic", mic: -42, tip: "Have them strum hard, the way they play in the final chorus." },
  { id: "kick", name: "Kick drum", stem: "Kick", mic: -26, tip: "Drums are loud: you usually need much less gain than for vocals." },
  { id: "bass", name: "Bass guitar (DI)", stem: "Bass", mic: -38, tip: "Watch the peaks when they dig in or slap; bass hits hard." },
  { id: "keys", name: "Keys (stereo DI)", stem: "Keys", mic: -24, tip: "Keyboards already send a strong line level: very little gain needed." },
];
const GAIN_TARGET = -12;
const randomGains = () => Object.fromEntries(GAIN_SOURCES.map((g) => { const id = GAIN_TARGET - g.mic; const off = (8 + Math.round(Math.random() * 14)) * (Math.random() < 0.5 ? -1 : 1); return [g.id, Math.max(0, Math.min(60, id + off > 60 || id + off < 0 ? id - off : id + off))]; }));
function GainLab() {
  const { T } = useApp();
  const [src, setSrc] = useState("soft");
  const [gains, setGains] = useState(randomGains);
  const [play, setPlay] = useState(false); const [busy, setBusy] = useState(false);
  const [peak, setPeak] = useState(-90); const [hold, setHold] = useState(-90); const [clip, setClip] = useState(false);
  const [checked, setChecked] = useState(null);
  const R = useRef({});
  const S = GAIN_SOURCES.find((g) => g.id === src); const gain = gains[src];
  const ideal = (g) => GAIN_TARGET - g.mic; // gain that puts the loudest peaks at -12 dBFS
  const faderNeeded = -(gain - ideal(S)); const faderReal = Math.max(-60, Math.min(10, faderNeeded));
  const stop = () => { const r = R.current; try { r.srcNode && r.srcNode.stop(); r.noise && r.noise.stop(); } catch (e) { } cancelAnimationFrame(r.raf); R.current = {}; setPlay(false); setPeak(-90); setHold(-90); setClip(false); };
  useEffect(() => stop, []); // eslint-disable-line
  const start = async (id = src) => {
    stop(); setBusy(true);
    const song = await makeSong("opener"); const ctx = AE.get(); if (ctx.state !== "running") await ctx.resume();
    const g = GAIN_SOURCES.find((x) => x.id === id); const buf = song.stems[g.stem];
    let pk = 0; for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i += 3) { const v = Math.abs(d[i]); if (v > pk) pk = v; } }
    const norm = 1 / Math.max(1e-4, pk);
    const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.loopEnd = song.loopLen; s.loopStart = 0;
    const mic = ctx.createGain(); mic.gain.value = norm * Math.pow(10, g.mic / 20); // what the mic sends
    const pre = ctx.createGain(); // the preamp gain knob
    const an = ctx.createAnalyser(); an.fftSize = 2048;
    const sh = ctx.createWaveShaper(); const curve = new Float32Array(2049); for (let i = 0; i < 2049; i++) { const x = (i - 1024) / 1024 * 4; curve[i] = Math.max(-1, Math.min(1, x)); } sh.curve = curve; sh.oversample = "2x";
    const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1);
    const noise = ctx.createBufferSource(); noise.buffer = nb; noise.loop = true; const nG = ctx.createGain(); nG.gain.value = Math.pow(10, -64 / 20); // console noise floor after the preamp
    const sum = ctx.createGain(); const fader = ctx.createGain(); const outG = ctx.createGain(); outG.gain.value = 0.9;
    s.connect(mic); mic.connect(pre); pre.connect(an); pre.connect(sh); sh.connect(sum); noise.connect(nG); nG.connect(sum); sum.connect(fader); fader.connect(outG); outG.connect(AE.out());
    s.start(); noise.start();
    R.current = { srcNode: s, noise, pre, fader, an, ctx, ph: -90, pt: 0 };
    const buf2 = new Float32Array(an.fftSize);
    const loop = () => { const r = R.current; if (!r.an) return; r.raf = requestAnimationFrame(loop); r.an.getFloatTimeDomainData(buf2); let m = 0; for (let i = 0; i < buf2.length; i++) { const v = Math.abs(buf2[i]); if (v > m) m = v; } const db = m > 0 ? 20 * Math.log10(m) : -90;
      setPeak(db); const now = performance.now(); if (db > r.ph || now - r.pt > 1500) { r.ph = db; r.pt = now; setHold(db); } if (db >= -0.1) { r.clipT = now; setClip(true); } else if (r.clipT && now - r.clipT > 900) { r.clipT = 0; setClip(false); } };
    loop(); setBusy(false); setPlay(true);
  };
  useEffect(() => { const r = R.current; if (!r.pre) return; r.pre.gain.setTargetAtTime(Math.pow(10, gain / 20), r.ctx.currentTime, 0.02); r.fader.gain.setTargetAtTime(Math.pow(10, faderReal / 20), r.ctx.currentTime, 0.02); }, [gain, faderReal]);
  const pick = (id) => { setSrc(id); if (play) start(id); };
  const zone = (db) => (db >= -0.1 ? ["CLIPPING: harsh distortion. Turn the gain DOWN", "#FF5A5A"] : db > -6 ? ["Hot: close to clipping. A little lower is safer", "#FFC23D"] : db >= -18 ? ["Perfect: healthy level with room to spare", "#3DDC97"] : db >= -30 ? ["A bit low: add some gain", "#9FB4C7"] : ["Too low: the fader can't make up for it, add gain", "#9FB4C7"]);
  const hz = play ? zone(hold) : ["Press play, then turn the gain knob", "#9FB4C7"];
  const pct = (db) => Math.max(0, Math.min(1, (db + 60) / 60));
  const check = () => setChecked(GAIN_SOURCES.map((g) => { const p = GAIN_TARGET + (gains[g.id] - ideal(g)); return { g, p, ok: p >= -18 && p <= -6 }; }));
  return (
    <>
      <SectionTitle>Gain Lab: set the preamp like a pro</SectionTitle>
      <Card tone="soft" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
        <b>What is gain?</b> Every mic or instrument plugs into a channel whose first knob is <b>gain</b> (the preamp). It decides how strong the signal is <i>before</i> anything else: EQ, compressor, monitors, faders. A soft singer needs a lot of gain, a keyboard very little.
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
          {[["Too low", "You have to push the fader way up, so you also turn up hiss and noise, and there's no headroom left.", "#9FB4C7"], ["Just right", "Loudest moments peak around −18 to −6 dBFS (green). The fader sits near 0 and sounds clean.", "#3DDC97"], ["Too high", "The signal clips: harsh crackly distortion that no fader or EQ can fix. Monitors and feedback get worse too.", "#FF5A5A"]].map(([t, d, c]) => (
            <div key={t} style={{ background: T.card, borderRadius: 14, padding: 10, borderTop: `3px solid ${c}` }}><div style={{ fontWeight: 800, fontSize: 12.5 }}>{t}</div><div style={{ fontSize: 11.5, color: T.sub, marginTop: 4, lineHeight: 1.45 }}>{d}</div></div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}><b>Remember:</b> gain sets the <i>level coming in</i>. Faders set the <i>mix</i>. Set gain once at soundcheck, then mix with faders.</div>
      </Card>
      <Card tone="hero" style={{ marginTop: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.8, marginBottom: 6 }}>1 · PICK A CHANNEL</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{GAIN_SOURCES.map((g) => <Chip key={g.id} active={src === g.id} onClick={() => pick(g.id)}>{g.name}</Chip>)}</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 8 }}>💡 {S.tip}</div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.8, margin: "14px 0 6px" }}>2 · LISTEN AND WATCH THE METER</div>
        <div style={{ position: "relative", height: 22, borderRadius: 8, background: "linear-gradient(90deg,#4f7fb3 0%,#4f7fb3 50%,#3ddc97 70%,#3ddc97 90%,#ffc23d 94%,#ff5a5a 100%)", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${(1 - pct(peak)) * 100}%`, background: "rgba(10,14,18,0.82)", transition: "width .05s" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `calc(${pct(hold) * 100}% - 1px)`, width: 3, background: "#fff", opacity: play ? 1 : 0 }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pct(-18) * 100}%`, width: `${(pct(-6) - pct(-18)) * 100}%`, border: "2px dashed rgba(255,255,255,0.7)", borderRadius: 6, boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, opacity: 0.7, marginTop: 4 }}><span>−60</span><span>−30</span><span>−18</span><span>−6</span><span>0 dBFS</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <div style={{ fontWeight: 800, color: hz[1], fontSize: 14 }}>{hz[0]}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800 }}><span style={{ width: 14, height: 14, borderRadius: 99, background: clip ? "#FF3B3B" : "rgba(255,255,255,0.15)", boxShadow: clip ? "0 0 12px #FF3B3B" : "none" }} />CLIP</div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.8, margin: "14px 0 0" }}>3 · TURN THE GAIN</div>
        <Slider label="Preamp gain" value={gain} min={0} max={60} onChange={(v) => { setGains((g) => ({ ...g, [src]: v })); setChecked(null); }} fmt={(v) => `+${v} dB`} />
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>Fader needed to keep the same volume: <b>{faderNeeded > 0 ? "+" : ""}{Math.round(faderNeeded)} dB</b>{faderNeeded > 10 ? " · the fader only goes to +10, so it stays too quiet and noisy" : faderNeeded < -20 ? " · fader pulled way down: you're hiding a clipped signal" : " · nice, the fader sits close to 0"}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn full variant={play ? "light" : "accent"} icon={play ? Square : Play} onClick={() => (play ? stop() : start())}>{busy ? "Loading band…" : play ? "Stop" : "Play this channel"}</Btn>
        </div>
      </Card>
      <Card style={{ marginTop: 10 }}>
        <div style={{ fontWeight: 800 }}>🎯 Soundcheck challenge</div>
        <div style={{ fontSize: 12.5, color: T.sub, marginTop: 4 }}>Every channel starts at a random gain, just like a new Saturday. Set all 6 so their loudest peaks land in the green box, then check your work.</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <Btn variant="accent" icon={Check} onClick={check}>Check my levels</Btn>
          <Btn variant="ghost" onClick={() => { stop(); setChecked(null); setGains(randomGains()); }}>New soundcheck</Btn>
        </div>
        {checked && <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 900, fontSize: 18, color: checked.every((c) => c.ok) ? T.good : T.text }}>{checked.filter((c) => c.ok).length} / 6 channels set right {checked.every((c) => c.ok) ? "🎉" : ""}</div>
          {checked.map(({ g, p, ok }) => <div key={g.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "6px 0", borderTop: `1px solid ${T.border}` }}><span>{ok ? "✅" : p > -6 ? "🔴" : "🔵"} {g.name}</span><span style={{ color: T.sub }}>{ok ? `peaks ${Math.round(p)} dBFS` : p > -6 ? `peaks ${Math.round(p) >= 0 ? "clipping" : Math.round(p) + " dBFS"}: lower about ${Math.round(p - GAIN_TARGET)} dB` : `peaks ${Math.round(p)} dBFS: raise about ${Math.round(GAIN_TARGET - p)} dB`}</span></div>)}
        </div>}
      </Card>
      <Card tone="soft" style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6 }}>
        <b>Saturday soundcheck routine (2:15 PM)</b>
        <div>1. All faders down, gain knobs at minimum.</div>
        <div>2. One person at a time: play or sing the <b>loudest</b> part of the set.</div>
        <div>3. Press <b>PFL / Solo</b> on their channel and raise the gain until the peaks sit around −12 dBFS.</div>
        <div>4. Next person. When everyone is set, build the mix with the faders.</div>
        <div>5. If someone gets much louder during the service, nudge their gain down a little. Don't let the clip light come on.</div>
      </Card>
    </>
  );
}

const COMP_PRESETS = [
  { n: "Lead vocal", thr: -18, ratio: 3, knee: 6, att: 10, rel: 120, mk: 4 },
  { n: "Bass", thr: -20, ratio: 4, knee: 4, att: 25, rel: 100, mk: 5 },
  { n: "Kick", thr: -14, ratio: 4, knee: 2, att: 30, rel: 80, mk: 3 },
  { n: "Acoustic", thr: -16, ratio: 2.5, knee: 6, att: 15, rel: 150, mk: 3 },
  { n: "Bus glue", thr: -10, ratio: 2, knee: 8, att: 30, rel: 200, mk: 2 },
];
const compOut = (i, { thr, ratio, knee }) => { if (knee <= 0 || i < thr - knee / 2) return i <= thr ? i : thr + (i - thr) / ratio; if (i > thr + knee / 2) return thr + (i - thr) / ratio; const d = i - thr + knee / 2; return i + ((1 / ratio - 1) * d * d) / (2 * knee); };
const NOTE_VALUES = [["1/4", 1], ["1/8 dotted", 0.75], ["1/8", 0.5], ["1/8 triplet", 1 / 3], ["1/16", 0.25]];
