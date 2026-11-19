
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
  const [gain, setGain] = useState(30);
  const [lvl, setLvl] = useState(-60);
  useEffect(() => {
    let t = 0; const iv = setInterval(() => { t += 0.12; const src = -52 + 14 * Math.abs(Math.sin(t * 1.7)) + (Math.random() < 0.08 ? 8 : 0) + Math.random() * 3; setLvl(src + gain); }, 90);
    return () => clearInterval(iv);
  }, [gain]);
  const pct = Math.max(0, Math.min(1, (lvl + 60) / 60));
  const zone = lvl > -0.5 ? ["CLIPPING — turn the gain down!", T.bad] : lvl > -6 ? ["Hot — a little lower is safer", T.pop] : lvl > -20 ? ["Perfect gain staging ✅", T.good] : ["Too low — add gain", T.sub];
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
      <SectionTitle>Try it: set the preamp gain</SectionTitle>
      <Card tone="hero">
        <div style={{ height: 16, borderRadius: 9, background: "linear-gradient(90deg,#4fb37e 0%,#4fb37e 66%,#f2c14e 80%,#ef6b5a 96%)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${(1 - pct) * 100}%`, background: "rgba(20,26,30,0.85)", transition: "width .09s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, opacity: 0.6, marginTop: 4 }}><span>−60</span><span>−18</span><span>−6</span><span>0 dBFS</span></div>
        <div style={{ textAlign: "center", fontWeight: 700, margin: "10px 0", color: zone[1] }}>{zone[0]}</div>
        <Slider label="Preamp gain" value={gain} min={0} max={70} onChange={setGain} fmt={(v) => `+${v} dB`} />
      </Card>
      {!embedded && <MarkComplete id="flow" label="Signal flow" mins={5} />}
    </div>
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
