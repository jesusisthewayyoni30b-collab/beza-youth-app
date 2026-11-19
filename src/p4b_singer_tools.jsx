
/* ============================ PRACTICE TOOLS: VOICE & EAR ============================ */
function ToolBar({ embedded, ...p }) { return embedded ? null : <TopBar {...p} />; }
const MAJ = [0, 2, 4, 5, 7, 9, 11];
const degMidi = (base, i) => base + MAJ[((i % 7) + 7) % 7] + 12 * Math.floor(i / 7);
const keyBase = (k) => 60 + k - (k > 5 ? 12 : 0);
function KeyChips({ value, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
      {NOTE_NAMES.map((n, i) => <Chip key={n} active={value === i} onClick={() => onChange(i)} style={{ padding: "7px 0" }}>{n}</Chip>)}
    </div>
  );
}
function Scroller({ children, style }) { return <div className="bz-noscroll" style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, ...style }}>{children}</div>; }

/* ---------------- VOCAL GYM: 40+ exercises ---------------- */
const VG = (id, cat, name, lvl, pat, syl, how, extra = {}) => ({ id, cat, name, lvl, pat, syl, how, ...extra });
const VOCAL_EX = [
  VG("yawn", "Release", "Yawn-sigh slide", 0, [12, 0], "Haaa", "Start a yawn, then sigh from high to low. Releases jaw and throat tension.", { glide: true, down: true }),
  VG("hum1", "Release", "Gentle hum on one note", 0, [0, 0, 0, 0], "Mmm", "Lips closed, teeth apart, jaw loose. Massage your cheeks while humming.", { sustain: true }),
  VG("jaw", "Release", "Floppy jaw 'ya-ya'", 0, [0, 2, 4, 2, 0], "Ya-ya-ya", "Let the jaw drop loosely on every 'ya'. Don't control it.", {}),
  VG("ts", "Breath", "'Ts-ts' support pulses", 0, [0, 0, 0, 0, 0, 0, 0, 0], "Ts!", "Short pulses from the belly on one note. Feel the abs kick inward on each pulse.", { short: true }),
  VG("messa", "Breath", "Messa di voce", 2, [0], "Ah", "One long note: start soft, grow louder, return to soft. Keep pitch perfectly steady.", { sustain: true, beats: [8] }),
  VG("long5", "Breath", "Long-phrase 9-tone scale", 2, [0, 2, 4, 5, 7, 9, 11, 12, 14, 12, 11, 9, 7, 5, 4, 2, 0], "Ah", "The whole pattern on one breath. Plan your breath before you start.", {}),
  VG("liptrill5", "SOVT", "Lip trill 5-tone", 0, [0, 2, 4, 5, 7, 5, 4, 2, 0], "Brrr", "Lips loose, a little air pressure. Press your cheeks lightly with fingertips if needed.", {}),
  VG("liptrillarp", "SOVT", "Lip trill arpeggio 1-3-5-8", 1, [0, 4, 7, 12, 7, 4, 0], "Brrr", "Keep the trill going over the top note — that means your breath is supporting.", {}),
  VG("tongue", "SOVT", "Tongue trill octave", 1, [0, 12, 0], "Rrrr", "Rolled 'r' on an octave slide. Great for releasing tongue tension.", { glide: true }),
  VG("straw", "SOVT", "Straw siren", 1, [0, 12], "Ooo (through a straw)", "Phonate through a straw — sirens up and down. The gentlest exercise for tired voices.", { glide: true }),
  VG("hum135", "Resonance", "Hum 1-3-5-3-1", 0, [0, 4, 7, 4, 0], "Mmm", "Feel the buzz on lips and nose. Open to 'Ah' on the last note while keeping the buzz.", {}),
  VG("ng", "Resonance", "'Ng' slide 5-4-3-2-1", 1, [7, 5, 4, 2, 0], "Ng", "Back of tongue touches soft palate (as in 'sing'). Pure nasal resonance.", {}),
  VG("mum", "Resonance", "'Mum-mum' 1-2-3-2-1", 0, [0, 2, 4, 2, 0], "Mum", "Bouncy and forward. Lips buzz on every 'm'.", {}),
  VG("nay", "Resonance", "Bright 'Nay' arpeggio", 1, [0, 4, 7, 12, 7, 4, 0], "Nay", "Bratty and forward like a child teasing. Builds mix resonance.", {}),
  VG("siren", "Range", "Siren glide", 0, [0, 12], "Ooo", "Smooth like an ambulance — low to high to low, no breaks.", { glide: true }),
  VG("octnay", "Range", "Octave 'Nay' jumps", 1, [0, 12, 0], "Nay", "Aim for the top note without reaching. Small and bright.", {}),
  VG("whoop", "Range", "Falsetto 'whoop' flips", 2, [0, 12, 7, 0], "Whoo", "Flip into light head voice on the top note — then smooth it out.", {}),
  VG("fifth", "Range", "5th slides", 0, [0, 7, 0], "Wee", "Slide up a 5th and back. Keep it light.", { glide: true }),
  VG("maj5", "Scales", "Major 5-tone", 0, [0, 2, 4, 5, 7, 5, 4, 2, 0], "Ma-me-mi-mo-mu", "The classic. Each note clean and connected.", {}),
  VG("maj9", "Scales", "9-tone scale", 1, [0, 2, 4, 5, 7, 9, 11, 12, 14, 12, 11, 9, 7, 5, 4, 2, 0], "Ah", "Long and smooth. Breathe at the top only if you must.", {}),
  VG("oct", "Scales", "Full octave up & down", 0, [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0], "Do-re-mi…", "Sing in solfège: Do Re Mi Fa Sol La Ti Do.", { solfege: true }),
  VG("minor", "Scales", "Natural minor octave", 1, [0, 2, 3, 5, 7, 8, 10, 12, 10, 8, 7, 5, 3, 2, 0], "Ah", "Feel the darker colour of the b3 and b6.", {}),
  VG("tizM", "Scales", "Tizita Major pattern", 1, [0, 2, 4, 7, 9, 12, 9, 7, 4, 2, 0], "Ah / ሃ", "Tizita: 1 2 3 5 6 — the sound of longing and remembrance.", {}),
  VG("tizm", "Scales", "Tizita Minor pattern", 2, [0, 2, 3, 7, 8, 12, 8, 7, 3, 2, 0], "Ah", "Tender minor qenet. Tune the b3 and b6 carefully.", {}),
  VG("bati", "Scales", "Bati Major pattern", 2, [0, 4, 5, 7, 11, 12, 11, 7, 5, 4, 0], "Ah", "Bright and proud. The 7th leads strongly to the octave.", {}),
  VG("amb", "Scales", "Ambassel pattern", 3, [0, 1, 5, 7, 8, 12, 8, 7, 5, 1, 0], "Ah", "The b2 is close to the root — sing it slowly and accurately with a drone.", {}),
  VG("tizrun", "Scales", "Tizita run", 3, [12, 9, 7, 4, 2, 0, 2, 4, 2, 0], "Ah", "Fast Tizita ornament run. Start slow!", { fast: true }),
  VG("arp", "Arpeggios", "Major arpeggio 1-3-5-8", 0, [0, 4, 7, 12, 7, 4, 0], "Ya", "Clean jumps. Think the next note before you sing it.", {}),
  VG("arpext", "Arpeggios", "Extended 1-3-5-8-10", 2, [0, 4, 7, 12, 16, 12, 7, 4, 0], "Ah", "Reach the 10th with space and support.", {}),
  VG("arpm", "Arpeggios", "Minor arpeggio", 1, [0, 3, 7, 12, 7, 3, 0], "Mah", "Sad colour, same clean jumps.", {}),
  VG("arp7", "Arpeggios", "Dominant 7 arpeggio", 2, [0, 4, 7, 10, 12, 10, 7, 4, 0], "Lah", "The b7 — tune it carefully.", {}),
  VG("run123", "Agility", "Fast 1-2-3-2-1", 1, [0, 2, 4, 2, 0, 2, 4, 2, 0], "Ah", "Light and quick. No 'h' between notes.", { fast: true }),
  VG("run5", "Agility", "1-to-5 runs", 2, [0, 2, 4, 5, 7, 5, 4, 2, 0, 2, 4, 5, 7, 5, 4, 2, 0], "Ah", "Two runs on one breath.", { fast: true }),
  VG("penta", "Agility", "Pentatonic run 8-6-5-3-2-1", 2, [12, 9, 7, 4, 2, 0], "Oh", "The most common worship run. Also Tizita Major!", { fast: true }),
  VG("gospel", "Agility", "Gospel run 5-6-8-6-5-3-2-1", 3, [7, 9, 12, 9, 7, 4, 2, 0], "Yeah", "Soulful run — land the final note with confidence.", { fast: true }),
  VG("turn", "Agility", "Turn 1-2-1-7-1", 2, [0, 2, 0, -1, 0, 2, 0, -1, 0], "Ah", "Classic ornament around the root.", { fast: true }),
  VG("vowels", "Vowels", "Mee-May-Mah-Moh-Moo", 0, [0, 0, 0, 0, 0], "Mee-May-Mah-Moh-Moo", "Same note, five pure vowels. Keep the tone even across all of them.", {}),
  VG("vowel135", "Vowels", "Vowel arpeggio", 1, [0, 4, 7, 4, 0], "Ee-Eh-Ah-Oh-Oo", "One vowel per note. Notice how 'Ah' and 'Oh' open the sound.", {}),
  VG("diction", "Diction", "Red leather, yellow leather", 1, [0, 2, 4, 5, 7, 5, 4, 2, 0], "Red leather yellow leather", "Crisp tongue-tip consonants on every note.", {}),
  VG("dict2", "Diction", "Amharic clarity", 1, [0, 2, 4, 2, 0], "ጥ-ቅ-ጭ-ጵ-ፅ + ah", "Ejectives clearly but not explosively. Stay on the vowel.", {}),
  VG("hey", "Mix & Belt", "'Hey!' calls 1-3-5", 2, [0, 4, 7], "Hey!", "Speech-like calls. Bright and forward — never squeezed.", { short: true }),
  VG("nyah", "Mix & Belt", "Bratty 'Nyah' 1-3-5-3-1", 2, [0, 4, 7, 4, 0], "Nyah", "Twang builds a safe, strong mix.", {}),
  VG("stac", "Staccato", "Staccato 'Ha' arpeggio", 1, [0, 4, 7, 4, 0], "Ha", "Short, bouncy, from the belly.", { short: true }),
  VG("stac5", "Staccato", "Staccato 5-tone", 1, [0, 2, 4, 5, 7, 5, 4, 2, 0], "Hee", "Each note separate and on pitch immediately.", { short: true }),
  VG("thirds", "Intervals", "Scale in 3rds", 2, [0, 4, 2, 5, 4, 7, 5, 9, 7, 11, 9, 12], "La", "Builds harmony ears: 1-3, 2-4, 3-5…", {}),
  VG("ladder", "Intervals", "Interval ladder from 1", 2, [0, 2, 0, 4, 0, 5, 0, 7, 0, 9, 0, 11, 0, 12], "La", "Return to 1 between each interval. Know exactly where 1 is.", {}),
  VG("fourths", "Intervals", "Scale in 4ths", 3, [0, 5, 2, 7, 4, 9, 5, 11, 7, 12], "La", "Harder jumps — slow down.", {}),
  VG("cooltrill", "Cool-down", "Descending lip trill", 0, [7, 5, 4, 2, 0], "Brrr", "Gentle, getting lower each rep.", { down: true }),
  VG("coolhum", "Cool-down", "Hum slide down", 0, [7, 0], "Mmm", "Slide gently from mid to low.", { glide: true, down: true }),
];
const VG_CATS = ["All", ...Array.from(new Set(VOCAL_EX.map((e) => e.cat)))];
const SOLFEGE = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Ti", "Do"];

function VocalGym({ embedded, cat: c0, ex: e0 }) {
  const { T, voice } = useApp();
  const vt = VOICE_TYPES.find((v) => v.name === voice);
  const [cat, setCat] = useState(c0 || "All");
  const [ex, setEx] = useState(VOCAL_EX.find((e) => e.id === e0) || VOCAL_EX.find((e) => !c0 || e.cat === c0) || VOCAL_EX[0]);
  const [base, setBase] = useState(vt ? vt.lo + 5 : 53);
  const [bpm, setBpm] = useState(ex.fast ? 90 : 100);
  const [reps, setReps] = useState(6);
  const [dir, setDir] = useState(ex.down ? "down" : "up");
  const [guide, setGuide] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState({ rep: -1, step: -1, key: null });
  const timers = useRef([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clear(), []);
  const stop = () => { clear(); AE.stopAll(); setPlaying(false); setCur({ rep: -1, step: -1, key: null }); };
  const keysFor = () => {
    const up = Array.from({ length: reps }, (_, r) => base + r);
    if (dir === "up") return up; if (dir === "down") return up.map((_, r) => base + reps - 1 - r);
    return [...up, ...up.slice(0, -1).reverse()];
  };
  const play = () => {
    clear(); AE.get(); setPlaying(true);
    const beat = 60 / bpm; let t = 0; const ks = keysFor();
    ks.forEach((key, r) => {
      const t0 = t; timers.current.push(setTimeout(() => { AE.chord([key - 12, key, key + 4, key + 7], beat * 1.3); setCur({ rep: r, step: -1, key }); }, t0 * 1000));
      t += beat * 1.5;
      if (ex.glide) {
        const t1 = t; const dur = beat * 4;
        timers.current.push(setTimeout(() => { if (guide) AE.glide(key + ex.pat[0], key + ex.pat[ex.pat.length - 1], dur); setCur({ rep: r, step: 0, key }); }, t1 * 1000)); t += dur + beat * 0.5;
      } else {
        ex.pat.forEach((iv, i) => {
          const len = ex.beats ? ex.beats[i] * beat : ex.short ? beat * 0.5 : ex.fast ? beat * 0.5 : beat;
          const t1 = t; timers.current.push(setTimeout(() => { if (guide || i === 0) AE.tone(key + iv, ex.short ? len * 0.4 : len * (ex.sustain ? 1 : 0.9), 0, 0.6); setCur({ rep: r, step: i, key }); }, t1 * 1000));
          t += len;
        });
      }
      t += beat;
    });
    timers.current.push(setTimeout(() => stop(), t * 1000));
  };
  const key = cur.key ?? base;
  const hl = cur.step >= 0 && !ex.glide ? [key + ex.pat[cur.step]] : [];
  const list = VOCAL_EX.filter((e) => cat === "All" || e.cat === cat);
  const label = (iv) => { const n = ((iv % 12) + 12) % 12; const o = Math.floor(iv / 12); return ex.solfege ? SOLFEGE[MAJ.indexOf(n) >= 0 ? MAJ.indexOf(n) + (o > 0 ? 7 : 0) : 0] || "" : (iv === 12 ? "8" : iv === 14 ? "9" : iv === 16 ? "10" : DEG_LABEL[n].split("/")[0]); };
  return (
    <div>
      <ToolBar embedded={embedded} title="Vocal Gym" sub={`${VOCAL_EX.length} exercises · ${voice ? `tuned for ${voice}` : "take the range test to tune your start note"}`} />
      <Card tone="hero" style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Ring pct={playing ? (cur.rep + 1) / keysFor().length : 0} size={78} color={T.accent} track="rgba(255,255,255,0.2)"><span style={{ fontSize: 15 }}>{nn(key)}</span></Ring>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, textTransform: "uppercase", letterSpacing: 1 }}>{ex.cat} · {LEVELS[ex.lvl]}</div>
            <div style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>{ex.name}</div>
            <div style={{ fontSize: 12.5, marginTop: 3 }}>Sing: <b>{ex.syl}</b></div>
          </div>
        </div>
        <div style={{ fontSize: 12.5, opacity: 0.88, lineHeight: 1.5, marginTop: 10 }}>{ex.how}</div>
        {!ex.glide && (
          <div style={{ display: "flex", gap: 4, marginTop: 12, flexWrap: "wrap" }}>
            {ex.pat.map((iv, i) => (
              <div key={i} style={{ minWidth: 26, padding: "4px 5px", textAlign: "center", borderRadius: 9, fontSize: 11.5, fontWeight: 700, background: cur.step === i ? T.accent : "rgba(255,255,255,0.15)", color: cur.step === i ? T.accentText : "inherit" }}>{label(iv)}</div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 14 }}>
          {playing ? <Btn full variant="light" icon={Square} onClick={stop}>Stop</Btn> : <Btn full variant="accent" icon={Play} onClick={play}>Start · {keysFor().length} reps from {nnOct(base)}</Btn>}
        </div>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <Slider label="Start note" value={base} min={36} max={76} onChange={(v) => { stop(); setBase(v); }} fmt={nnOct} />
        <Slider label="Tempo" value={bpm} min={50} max={180} onChange={setBpm} fmt={(v) => `${v} bpm`} />
        <Slider label="Repetitions (half steps)" value={reps} min={2} max={12} onChange={setReps} />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Seg style={{ flex: 1 }} value={dir} onChange={setDir} options={[{ value: "up", label: "Up" }, { value: "down", label: "Down" }, { value: "updown", label: "Up & down" }]} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Guide notes (turn off to test yourself)</span><Toggle on={guide} onChange={setGuide} />
        </div>
      </Card>
      <div style={{ marginTop: 12 }}><Piano start={Math.max(36, Math.min(base, 60) - (Math.min(base, 60) % 12))} octaves={2} highlight={hl} roots={[key]} height={86} /></div>
      <SectionTitle>Exercise library</SectionTitle>
      <Scroller>{VG_CATS.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</Scroller>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
        {list.map((e) => (
          <Card key={e.id} pad={12} tone={e.id === ex.id ? "soft" : "card"} onClick={(ev) => { stop(); setEx(e); setDir(e.down ? "down" : "up"); setBpm(e.fast ? 90 : 100); scrollUp(ev); }} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconBubble icon={e.glide ? Waves : e.cat === "Breath" ? Wind : e.cat === "Agility" ? Zap : Mic} size={38} tone={e.id === ex.id ? "accent" : "soft"} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{e.name}</div>
              <div style={{ fontSize: 11.5, color: T.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.cat} · {LEVELS[e.lvl]} · "{e.syl}"</div>
            </div>
            {e.id === ex.id && <Check size={18} />}
          </Card>
        ))}
      </div>
      {!embedded && <MarkComplete id="vocalgym" label="Vocal Gym" mins={10} />}
    </div>
  );
}

/* ---------------- BREATH LAB: beginner → expert + sustain challenge ---------------- */
const BREATH_LEVELS = [
  { name: "Beginner", items: [
    { id: "calm", name: "Calm 4·4·6", seq: [["Breathe in", 4, "in"], ["Hold", 4, "hold"], ["Breathe out", 6, "out"]] },
    { id: "box4", name: "Box 4·4·4·4", seq: [["Breathe in", 4, "in"], ["Hold", 4, "hold"], ["Breathe out", 4, "out"], ["Hold", 4, "hold"]] },
    { id: "hiss12", name: "Support hiss 4 / 12", seq: [["Breathe in low", 4, "in"], ["Hiss 'sss' evenly", 12, "out"]] },
  ] },
  { name: "Intermediate", items: [
    { id: "box5", name: "Box 5·5·5·5", seq: [["Breathe in", 5, "in"], ["Hold", 5, "hold"], ["Breathe out", 5, "out"], ["Hold", 5, "hold"]] },
    { id: "478", name: "Relax 4·7·8", seq: [["Breathe in", 4, "in"], ["Hold", 7, "hold"], ["Breathe out", 8, "out"]] },
    { id: "hiss20", name: "Support hiss 4 / 20", seq: [["Breathe in low", 4, "in"], ["Hiss evenly", 20, "out"]] },
    { id: "pulse", name: "'Ts' pulses × 12", seq: [["Breathe in", 4, "in"], ["Ts – ts – ts (1 per second)", 12, "pulse"]] },
  ] },
  { name: "Advanced", items: [
    { id: "box6", name: "Box 6·6·6·6", seq: [["Breathe in", 6, "in"], ["Hold", 6, "hold"], ["Breathe out", 6, "out"], ["Hold", 6, "hold"]] },
    { id: "5510", name: "5·5·10", seq: [["Breathe in", 5, "in"], ["Hold", 5, "hold"], ["Breathe out slowly", 10, "out"]] },
    { id: "hiss30", name: "Support hiss 4 / 30", seq: [["Breathe in low", 4, "in"], ["Hiss evenly", 30, "out"]] },
    { id: "ladder", name: "Hiss ladder 10→25", seq: [["In", 4, "in"], ["Hiss", 10, "out"], ["In", 4, "in"], ["Hiss", 15, "out"], ["In", 4, "in"], ["Hiss", 20, "out"], ["In", 4, "in"], ["Hiss", 25, "out"]] },
  ] },
  { name: "Expert", items: [
    { id: "6612", name: "6·6·12", seq: [["Breathe in", 6, "in"], ["Hold", 6, "hold"], ["Breathe out", 12, "out"]] },
    { id: "hiss45", name: "Support hiss 5 / 45", seq: [["Breathe in low", 5, "in"], ["Hiss evenly", 45, "out"]] },
    { id: "ladder2", name: "Hiss ladder 15→40", seq: [["In", 5, "in"], ["Hiss", 15, "out"], ["In", 5, "in"], ["Hiss", 25, "out"], ["In", 5, "in"], ["Hiss", 32, "out"], ["In", 5, "in"], ["Hiss", 40, "out"]] },
    { id: "catch", name: "Catch-breath phrases", seq: [["Quick catch breath", 2, "in"], ["Sing/hiss phrase", 10, "out"], ["Quick catch breath", 2, "in"], ["Sing/hiss phrase", 10, "out"], ["Quick catch breath", 2, "in"], ["Sing/hiss phrase", 14, "out"]] },
  ] },
];
const SUSTAIN_TARGETS = [12, 18, 25, 35];
function BreathLab({ embedded, level: l0, tab: t0 }) {
  const { T, logPractice } = useApp();
  const [tab, setTab] = useState(t0 || "guided");
  const [lvl, setLvl] = useState(l0 ?? 0);
  const [pat, setPat] = useState(BREATH_LEVELS[l0 ?? 0].items[0]);
  const [running, setRunning] = useState(false);
  const [total, setTotal] = useState(180);
  const [st, setSt] = useState({ left: 180, idx: 0, pl: pat.seq[0][1] });
  const [snd, setSnd] = useState("Tones");
  const { left, idx, pl } = st;
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => setSt((p) => {
      let { left, idx, pl } = p; left -= 1; pl -= 1;
      if (pl <= 0) { idx = (idx + 1) % pat.seq.length; pl = pat.seq[idx][1]; }
      return { left: Math.max(0, left), idx, pl };
    }), 1000);
    return () => clearInterval(iv);
  }, [running, pat]);
  useEffect(() => { if (running && snd !== "Silent") AE.tone(pat.seq[idx][2] === "in" ? 72 : pat.seq[idx][2] === "hold" ? 67 : 64, 0.5, 0, 0.35); }, [idx]); // eslint-disable-line
  useEffect(() => { if (running && pat.seq[idx][2] === "pulse" && snd !== "Silent") AE.click(false); }, [pl]); // eslint-disable-line
  useEffect(() => { if (running && left <= 0) { setRunning(false); logPractice(Math.round(total / 60), "Breath Lab"); } }, [left]); // eslint-disable-line
  const reset = (p, t) => setSt({ left: t, idx: 0, pl: p.seq[0][1] });
  const [label, dur, kind] = pat.seq[idx];
  const scale = !running ? 0.78 : kind === "in" ? 1 : kind === "hold" ? (pat.seq[(idx - 1 + pat.seq.length) % pat.seq.length][2] === "in" ? 1 : 0.62) : 0.62;
  /* sustain challenge */
  const [sus, setSus] = useState({ run: false, t: 0, best: 0, hist: [] });
  const [note, setNote] = useState(57);
  const susRef = useRef(null); const droneOff = useRef(null);
  useEffect(() => () => { clearInterval(susRef.current); droneOff.current && droneOff.current(); }, []);
  const susStart = () => { AE.get(); droneOff.current = AE.drone(note); const t0 = performance.now(); setSus((s) => ({ ...s, run: true, t: 0 })); susRef.current = setInterval(() => setSus((s) => ({ ...s, t: (performance.now() - t0) / 1000 })), 100); };
  const susStop = () => { clearInterval(susRef.current); droneOff.current && droneOff.current(); setSus((s) => ({ run: false, t: s.t, best: Math.max(s.best, s.t), hist: [s.t, ...s.hist].slice(0, 6) })); };
  const target = SUSTAIN_TARGETS[lvl];
  return (
    <div>
      <ToolBar embedded={embedded} title="Breath Lab" sub="Beginner → Expert · grow your capacity" />
      <Seg value={tab} onChange={setTab} options={[{ value: "guided", label: "Guided patterns" }, { value: "sustain", label: "Sustain challenge" }]} />
      <Scroller style={{ marginTop: 10 }}>{BREATH_LEVELS.map((L, i) => <Chip key={L.name} active={lvl === i} onClick={() => { setLvl(i); setRunning(false); setPat(L.items[0]); reset(L.items[0], total); }}>{L.name}</Chip>)}</Scroller>
      {tab === "guided" ? (
        <>
          <div style={{ fontFamily: headFont(T), fontSize: 34, lineHeight: 1.05, margin: "14px 0 4px" }}>Take a Deep Breath</div>
          <div style={{ color: T.sub, fontSize: 13 }}>{running ? "You're doing great — stay relaxed." : "Strong breath = strong, steady singing."}</div>
          <div style={{ display: "grid", placeItems: "center", margin: "20px 0 14px" }}>
            <div style={{ position: "relative", width: 220, height: 220, display: "grid", placeItems: "center" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px dashed ${T.border}` }} />
              <div style={{ position: "absolute", width: 220 * scale, height: 220 * scale, borderRadius: "50%", background: T.graffiti ? "radial-gradient(circle at 35% 35%, #22E4FF55, #8B5CFF44 60%, #FF3EA533)" : T.soft, transition: `all ${dur}s ease-in-out` }} />
              <Ring pct={1 - left / total} size={220} stroke={6} color={T.accent} track="transparent"><span /></Ring>
              <div style={{ position: "absolute", textAlign: "center" }}>
                <div style={{ fontSize: 38, fontWeight: 800 }}>{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</div>
                <div style={{ fontSize: 13, color: T.sub, fontWeight: 600, maxWidth: 150 }}>{running ? `${label} · ${pl}` : pat.name}</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
            {[["Tones", Music], ["Silent", Volume2]].map(([n, I]) => (
              <button key={n} onClick={() => setSnd(n)} style={{ border: "none", width: 76, padding: "9px 0", borderRadius: 16, background: snd === n ? T.card2 : "transparent", color: T.text, fontFamily: FONT, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "grid", placeItems: "center", gap: 4 }}><I size={18} />{n}</button>
            ))}
          </div>
          <Scroller style={{ marginBottom: 10 }}>
            {BREATH_LEVELS[lvl].items.map((p) => <Chip key={p.id} active={p.id === pat.id} onClick={() => { setPat(p); setRunning(false); reset(p, total); }}>{p.name}</Chip>)}
          </Scroller>
          <Scroller style={{ marginBottom: 12 }}>{[60, 180, 300, 600].map((s) => <Chip key={s} active={total === s} onClick={() => { setTotal(s); setRunning(false); reset(pat, s); }}>{s / 60} min</Chip>)}</Scroller>
          {running ? <Btn full variant="hero" onClick={() => setRunning(false)}>Pause session</Btn>
            : <Btn full icon={Play} onClick={() => { AE.get(); if (left === 0 || left === total) reset(pat, total); setRunning(true); }}>{left < total && left > 0 ? "Resume" : "Begin session"}</Btn>}
        </>
      ) : (
        <>
          <Card tone="hero" style={{ marginTop: 12, textAlign: "center", padding: 22 }}>
            <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 600 }}>Sing "Ah" on the drone note, steady and supported</div>
            <div style={{ fontSize: 60, fontWeight: 800, margin: "6px 0" }}>{sus.t.toFixed(1)}s</div>
            <Bar pct={sus.t / target} color={sus.t >= target ? T.good : T.accent} track="rgba(255,255,255,0.2)" h={10} />
            <div style={{ fontSize: 12, marginTop: 8, opacity: 0.85 }}>{LEVELS[lvl + 1] || "Expert"} target: {target}s · Personal best: <b>{sus.best.toFixed(1)}s</b></div>
            <div style={{ marginTop: 14 }}>{sus.run ? <Btn full variant="light" icon={Square} onClick={susStop}>Stop — I ran out of breath</Btn> : <Btn full variant="accent" icon={Play} onClick={susStart}>Start drone & timer</Btn>}</div>
          </Card>
          <Card style={{ marginTop: 12 }}>
            <Slider label="Drone note" value={note} min={45} max={72} onChange={setNote} fmt={nnOct} />
            {sus.hist.length > 0 && <div style={{ fontSize: 12.5, color: T.sub }}>Recent: {sus.hist.map((h) => h.toFixed(1) + "s").join(" · ")}</div>}
          </Card>
        </>
      )}
      <Card tone="soft" style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.5 }}>
        <b>Safety:</b> breath work should feel calm. If you feel dizzy or lightheaded, stop and breathe normally. Never strain to hold your breath.
      </Card>
    </div>
  );
}

/* ---------------- SCALE STUDIES (singers & musicians) ---------------- */
const SCALE_PATTERNS = [
  { id: "straight", label: "Up & down" }, { id: "thirds", label: "In 3rds" }, { id: "g3", label: "Groups of 3" }, { id: "g4", label: "Groups of 4" }, { id: "two", label: "2 octaves" },
];
function scaleSeq(n, pattern) {
  const up = (top) => Array.from({ length: top + 1 }, (_, i) => i);
  if (pattern === "thirds") { const a = []; for (let i = 0; i + 2 <= n; i++) a.push(i, i + 2); const d = []; for (let i = n; i - 2 >= 0; i--) d.push(i, i - 2); return [...a, ...d, 0]; }
  if (pattern === "g3" || pattern === "g4") { const g = pattern === "g3" ? 3 : 4; const a = []; for (let i = 0; i + g - 1 <= n; i++) for (let k = 0; k < g; k++) a.push(i + k); const d = []; for (let i = n; i - g + 1 >= 0; i--) for (let k = 0; k < g; k++) d.push(i - k); return [...a, ...d]; }
  if (pattern === "two") { const u = up(n * 2); return [...u, ...u.slice(0, -1).reverse()]; }
  const u = up(n); return [...u, ...u.slice(0, -1).reverse()];
}
function ScaleExplorer({ embedded, musician, group: g0, scale: s0, pattern: p0 }) {
  const { T, user, voice } = useApp();
  const isMus = musician ?? (user && user.roles && !user.roles.includes("singer"));
  const [root, setRoot] = useState(0);
  const [group, setGroup] = useState(g0 || (isMus ? "modes" : "western"));
  const [scale, setScale] = useState((ALL_SCALES.find((x) => x.id === s0)) || SCALE_GROUPS.find((g) => g.id === (g0 || (isMus ? "modes" : "western"))).items[0]);
  const [view, setView] = useState("piano");
  const [pattern, setPattern] = useState(p0 || "straight");
  const [bpm, setBpm] = useState(90);
  const [drone, setDrone] = useState(false);
  const [climb, setClimb] = useState(false);
  const [cur, setCur] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timers = useRef([]); const droneOff = useRef(null);
  const vt = VOICE_TYPES.find((v) => v.name === voice);
  const base = (vt && !isMus ? vt.lo + 2 - ((vt.lo + 2 - root) % 12 + 12) % 12 + 12 : 60 + root - (root > 6 ? 12 : 0));
  const n = scale.steps.length;
  const midiAt = (i) => base + scale.steps[((i % n) + n) % n] + 12 * Math.floor(i / n);
  const stopAll = () => { timers.current.forEach(clearTimeout); timers.current = []; setPlaying(false); setCur(-1); droneOff.current && droneOff.current(); droneOff.current = null; };
  useEffect(() => () => stopAll(), []); // eslint-disable-line
  const playRun = (tempo = bpm, round = 0) => {
    timers.current.forEach(clearTimeout); timers.current = []; AE.get(); setPlaying(true);
    if (drone && !droneOff.current) droneOff.current = AE.drone(base - 12);
    const seq = scaleSeq(n, pattern).map(midiAt); const step = 60 / tempo / (pattern === "straight" || pattern === "two" ? 1 : 2) * 1000;
    const inst = view === "guitar" ? "acoustic" : view === "bass" ? "bass" : "piano";
    seq.forEach((m, i) => timers.current.push(setTimeout(() => { AE.play(inst, view === "bass" ? m - 24 : view === "guitar" ? m - 12 : m, step / 1000 * 0.95); setCur(m); }, i * step)));
    timers.current.push(setTimeout(() => {
      if (climb && round < 9) playRun(tempo + 6, round + 1); else stopAll();
    }, seq.length * step + 400));
  };
  const items = SCALE_GROUPS.find((g) => g.id === group).items;
  const notes = [...scale.steps.map((s) => base + s), base + 12];
  return (
    <div>
      <ToolBar embedded={embedded} title="Scale Studies" sub={`${NOTE_NAMES[root]} ${scale.name} · ${SCALE_PATTERNS.find((p) => p.id === pattern).label}`} />
      <Scroller>{SCALE_GROUPS.map((g) => <Chip key={g.id} active={group === g.id} onClick={() => { setGroup(g.id); setScale(g.items[0]); }}>{g.name}</Chip>)}</Scroller>
      <Scroller style={{ margin: "10px 0 8px" }}>{items.map((s) => <Chip key={s.id} active={s.id === scale.id} onClick={() => setScale(s)}>{s.name}</Chip>)}</Scroller>
      <KeyChips value={root} onChange={setRoot} />
      <Card tone="hero" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 600 }}>{SCALE_GROUPS.find((g) => g.id === group).name}</div>
            <div style={{ fontFamily: headFont(T), fontSize: 26, fontWeight: 700 }}>{NOTE_NAMES[root]} {scale.name}</div>
          </div>
          {playing ? <Btn small variant="light" icon={Square} onClick={stopAll}>Stop</Btn> : <Btn small variant="accent" icon={Play} onClick={() => playRun()}>Play</Btn>}
        </div>
        <div style={{ fontSize: 13, opacity: 0.88, marginTop: 6, lineHeight: 1.5 }}>{scale.feel}</div>
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
          {notes.slice(0, -1).map((m, i) => (
            <div key={i} style={{ textAlign: "center", padding: "6px 8px", minWidth: 34, borderRadius: 12, background: cur >= 0 && cur % 12 === m % 12 ? T.accent : "rgba(255,255,255,0.14)", color: cur >= 0 && cur % 12 === m % 12 ? T.accentText : "inherit" }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{nn(m)}</div>
              <div style={{ fontSize: 10, opacity: 0.8 }}>{DEG_LABEL[scale.steps[i]].split("/")[0]}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 8 }}>STUDY PATTERN</div>
        <Scroller style={{ marginBottom: 10 }}>{SCALE_PATTERNS.map((p) => <Chip key={p.id} active={pattern === p.id} onClick={() => setPattern(p.id)}>{p.label}</Chip>)}</Scroller>
        <Slider label="Tempo" value={bpm} min={40} max={200} onChange={setBpm} fmt={(v) => `${v} bpm`} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Drone under the scale</span><Toggle on={drone} onChange={setDrone} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 13, fontWeight: 600 }}>Speed challenge (+6 bpm each round)</span><Toggle on={climb} onChange={setClimb} /></div>
      </Card>
      {isMus && <Seg style={{ marginTop: 12 }} value={view} onChange={setView} options={[{ value: "piano", label: "Keys" }, { value: "guitar", label: "Guitar" }, { value: "bass", label: "Bass" }]} />}
      <Card style={{ marginTop: 12, padding: 12 }}>
        {view === "piano" && (() => { const lo = Math.min(...notes), hi = Math.max(...notes); const st = lo - (((lo % 12) + 12) % 12); const oc = Math.min(4, Math.max(2, Math.ceil((hi - st) / 12))); return <Piano start={st} octaves={oc} highlight={cur >= 0 ? [cur] : notes} roots={[base, base + 12, base + 24]} height={110} pcKeys showOctaveCtl />; })()}
        {view === "guitar" && <Fretboard pcs={scale.steps.map((s) => s + root)} rootPc={root} labelMode="deg" />}
        {view === "bass" && <Fretboard tuning={BASS_TUNING} pcs={scale.steps.map((s) => s + root)} rootPc={root} labelMode="deg" />}
      </Card>
      {!embedded && <MarkComplete id="scales" label="Scale studies" mins={8} />}
    </div>
  );
}

/* ---------------- EAR TRAINER ---------------- */
const INTERVALS = [["m2", 1], ["M2", 2], ["m3", 3], ["M3", 4], ["P4", 5], ["Tritone", 6], ["P5", 7], ["m6", 8], ["M6", 9], ["m7", 10], ["M7", 11], ["Octave", 12]];
const INT_SETS = { Beginner: ["M3", "P5", "Octave"], Developing: ["m3", "M3", "P4", "P5", "Octave"], Intermediate: ["M2", "m3", "M3", "P4", "P5", "M6", "Octave"], Advanced: INTERVALS.map((x) => x[0]) };
const EAR_LV = ["Easy", "Medium", "Hard", "Expert"];
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const fineTone = (freq, dur = 1, when = 0, type = "triangle", vol = 0.22) => { const c = AE.get(); const t = c.currentTime + when; const o = c.createOscillator(); const g = c.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.setValueAtTime(vol, t + dur - 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(AE.out()); o.start(t); o.stop(t + dur + 0.05); };
const cad = (base, w = 420) => { [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]].forEach((c, i) => setTimeout(() => AE.chord([base - 12 + c[0], ...c.map((x) => base + x)], 0.5), i * w)); return 4 * w + 250; };
const triadOf = (key, d) => { const r = (key + DIATONIC.degs[d]) % 12; const q = DIATONIC.q[d]; return (q === "m" ? [0, 3, 7] : q === "dim" ? [0, 3, 6] : [0, 4, 7]).map((x) => r + x); };
const playTriad = (key, d, w = 0, bass = true) => setTimeout(() => { const r = (key + DIATONIC.degs[d]) % 12; if (bass) AE.play("bass", 36 + r, 1.2, 0, 0.8); AE.chord(voiceLead(null, triadOf(key, d)), 1.2); }, w);
const rk = (lv, easyKeys = [0]) => (lv === 0 ? pick(easyKeys) : lv === 1 ? pick([0, 7, 5, 2, 10]) : rand(12));

const EAR_MODULES = [
  { id: "deg", name: "Scale degrees", tag: "Melody", icon: Target, learn: "Every note has a number in its key. 1 feels like home, 5 is strong and open, 7 pulls up to 8, 4 leans down to 3, 6 sounds sweet, 2 wants to move. Listen to the key first, then feel how the note relates to home.",
    gen: (lv) => { const key = rk(lv); const base = keyBase(key); const pools = [["1", "3", "5", "8"], ["1", "2", "3", "4", "5", "6", "7", "8"], ["1", "2", "3", "4", "5", "6", "7", "8", "b3", "b7"], ["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"]]; const pool = pools[lv]; const d = pick(pool); const o = lv === 3 ? pick([-12, 0, 12]) : 0;
      return { sig: key + d, prompt: `Key of ${NOTE_NAMES[key]} — which degree?`, options: sortDeg(pool), answer: d, play: () => { const w = cad(base, lv >= 2 ? 330 : 420); setTimeout(() => AE.tone(base + DEG_SEMI[d] + o, 1.2), w); } }; } },
  { id: "int", name: "Intervals", tag: "Melody", icon: Ladder, learn: "Use song anchors: M2 = 'Happy Birthday', M3 = 'Oh When the Saints', P4 = 'Here Comes the Bride', P5 = 'Twinkle Twinkle', M6 = 'My Bonnie', Octave = 'Somewhere Over the Rainbow'. Easy keeps the same root (C) so you can learn the sound of each distance.",
    gen: (lv) => { const pools = [["M2", "M3", "P4", "P5", "Octave"], ["m2", "M2", "m3", "M3", "P4", "P5", "M6", "Octave"], INTERVALS.map((x) => x[0]), INTERVALS.map((x) => x[0])]; const pool = pools[lv]; const n = pick(pool); const iv = INTERVALS.find((x) => x[0] === n)[1]; const root = lv === 0 ? 60 : 50 + rand(16); const dir = lv === 0 ? "up" : lv === 1 ? pick(["up", "down"]) : pick(["up", "down", "harm"]); const lo = dir === "down" ? root - iv : root;
      return { sig: n + dir + root, prompt: `${dir === "harm" ? "Together" : dir === "down" ? "Going down" : "Going up"}${lv === 0 ? " from C" : ""} — which interval?`, options: pool, answer: n, play: () => { if (dir === "harm") AE.chord([lo, lo + iv], 1.4); else if (dir === "down") { AE.tone(lo + iv, 0.8); setTimeout(() => AE.tone(lo, 1), 700); } else { AE.tone(lo, 0.8); setTimeout(() => AE.tone(lo + iv, 1), 700); } } }; } },
  { id: "hl", name: "Higher or lower", tag: "Pitch", icon: TrendingUp, learn: "Pure pitch discrimination. Two notes very close together — is the second higher or lower? Expert gets down to a few cents, the level of fine tuning a great singer needs.",
    gen: (lv) => { const cents = [100, 40, 15, 6][lv]; const up = Math.random() < 0.5; const m = 57 + rand(12); const f = hz(m);
      return { sig: up + "" + m, prompt: `Is the 2nd note higher or lower? (${cents} cents apart)`, options: ["Higher", "Lower"], answer: up ? "Higher" : "Lower", play: () => { fineTone(f, 0.9); fineTone(f * Math.pow(2, ((up ? 1 : -1) * cents) / 1200), 0.9, 1.1); } }; } },
  { id: "tune", name: "In tune?", tag: "Pitch", icon: Activity, learn: "Singers and players must hear when something is sharp or flat. A reference note plays, then a second note — is it in tune, sharp or flat?",
    gen: (lv) => { const off = [35, 20, 10, 5][lv]; const r = pick(["In tune", "Sharp", "Flat"]); const m = 55 + rand(14); const f = hz(m); const f2 = f * Math.pow(2, (r === "Sharp" ? off : r === "Flat" ? -off : 0) / 1200);
      return { sig: r + m, prompt: "Reference, then the test note — in tune, sharp or flat?", options: ["Flat", "In tune", "Sharp"], answer: r, play: () => { fineTone(f, 1, 0, "sawtooth", 0.1); fineTone(f2, 1.1, 1.2, "sawtooth", 0.1); } }; } },
  { id: "note", name: "Name the note", tag: "Pitch", icon: Music, learn: "Relative pitch to absolute. Easy and Medium play a C first as your reference; Hard and Expert don't — that's perfect-pitch training. Do a little every day.",
    gen: (lv) => { const pool = [["C", "D", "E", "F", "G"], ["C", "D", "E", "F", "G", "A", "B"], NOTE_NAMES, NOTE_NAMES][lv]; const n = pick(pool); const m = 60 + NOTE_NAMES.indexOf(n) + (lv === 3 ? pick([-12, 0, 12]) : 0);
      return { sig: n, prompt: lv < 2 ? "Here's C, then the mystery note — name it" : "No reference — name the note", options: pool, answer: n, play: () => { if (lv < 2) { AE.tone(60, 0.8); setTimeout(() => AE.tone(m, 1.1), 900); } else AE.tone(m, 1.2); } }; } },
  { id: "qual", name: "Chord quality", tag: "Harmony", icon: Layers, learn: "Major = bright, minor = sad/deep, diminished = tense and small, augmented = floating and unresolved, sus = open and waiting, 7 = bluesy and wants to move, maj7 = soft and dreamy, m7 = smooth and soulful.",
    gen: (lv) => { const ids = new Set(CHORD_TYPES.map((c) => c.id)); const pool = [["", "m"], ["", "m", "dim", "aug", "sus4"], ["maj7", "7", "m7", "m7b5", "dim7", "sus2"], ["", "m", "dim", "aug", "sus2", "sus4", "maj7", "7", "m7", "m7b5", "dim7", "add9", "6", "m6", "9"]][lv].filter((x) => ids.has(x)); const q = pick(pool); const ct = CHORD_TYPES.find((c) => c.id === q); const v = voiceChord(46 + rand(12), ct.iv, lv >= 2 ? rand(Math.min(3, ct.iv.length)) : 0, "close");
      return { sig: q + v[0], prompt: "What kind of chord?", options: pool.map(qName), answer: qName(q), play: () => { if (lv === 0) { v.forEach((m, i) => AE.tone(m, 0.5, i * 0.2, 0.6)); setTimeout(() => AE.chord(v, 1.3), v.length * 200 + 150); } else AE.chord(v, 1.5); } }; } },
  { id: "inv", name: "Inversions", tag: "Harmony", icon: RefreshCw, learn: "Listen to the lowest note. Root position sounds solid; 1st inversion (3rd in the bass) sounds lighter; 2nd inversion (5th in the bass) sounds unsettled, like it wants to move.",
    gen: (lv) => { const q = lv < 2 ? pick(["", "m"]) : pick(["", "m", "maj7", "7", "m7"]); const ct = CHORD_TYPES.find((c) => c.id === q); const names = ["Root position", "1st inversion", "2nd inversion", "3rd inversion"].slice(0, ct.iv.length >= 4 ? 4 : 3); const inv = rand(names.length); const v = voiceChord(48 + rand(8), ct.iv, inv, "close");
      return { sig: q + inv, prompt: "Which inversion? (listen to the bass)", options: names, answer: names[inv], play: () => { if (lv === 0) { AE.tone(v[0], 0.7); setTimeout(() => AE.chord(v, 1.3), 700); } else AE.chord(v, 1.5); } }; } },
  { id: "ctone", name: "Chord tones", tag: "Harmony", icon: Star, learn: "Singers pick harmony notes from the chord. A chord plays, then one note from it — is it the root, 3rd, 5th or 7th?",
    gen: (lv) => { const q = lv < 2 ? pick(["", "m"]) : pick(["maj7", "7", "m7"]); const ct = CHORD_TYPES.find((c) => c.id === q); const names = ["Root", "3rd", "5th", "7th"].slice(0, ct.iv.length); const i = rand(names.length); const root = 48 + rand(10);
      return { sig: q + i, prompt: "Chord, then a note — which chord tone?", options: names, answer: names[i], play: () => { AE.chord(ct.iv.map((x) => root + x), 1.2); setTimeout(() => AE.tone(root + 12 + ct.iv[i] + (lv === 3 ? pick([-12, 0]) : 0), 1.1), 1300); } }; } },
  { id: "bass", name: "Bass degree", tag: "Harmony", icon: Waves, learn: "Bass players and keys players follow the bass. Hear the key, then a bass note — which number of the key is it?",
    gen: (lv) => { const key = rk(lv); const base = keyBase(key); const pool = [["1", "4", "5"], ["1", "2", "4", "5", "6"], ["1", "2", "3", "4", "5", "6", "7"], ["1", "2", "b3", "3", "4", "5", "6", "b7", "7"]][lv]; const d = pick(pool);
      return { sig: key + d, prompt: `Key of ${NOTE_NAMES[key]} — bass note number?`, options: pool, answer: d, play: () => { const w = cad(base); setTimeout(() => AE.play("bass", base - 24 + DEG_SEMI[d], 1.4, 0, 0.9), w); } }; } },
  { id: "prog", name: "Progressions", tag: "Harmony", icon: BarChart, learn: "Most worship songs use 1, 4, 5 and 6. The 1 is home, 4 lifts, 5 leans back home, 6 is the emotional minor. Each progression starts on 1.",
    gen: (lv) => { const key = rk(lv); const maxD = lv >= 2 ? 6 : 5; const allowed = lv === 0 ? [3, 4] : lv === 1 ? [3, 4, 5] : [1, 2, 3, 4, 5]; const len = [2, 3, 3, 4][lv]; const seq = Array.from({ length: len }, () => pick(allowed)); const lab = (a) => ["1", ...a.map((x) => String(x + 1))].join(" → ");
      const opts = new Set([lab(seq)]); let g = 0; while (opts.size < 4 && g++ < 60) opts.add(lab(seq.map((x) => (Math.random() < 0.5 ? x : pick(allowed)))));
      return { sig: key + seq.join(""), prompt: `Key of ${NOTE_NAMES[key]} — which progression?`, options: shuffle([...opts]), answer: lab(seq), play: () => { playTriad(key, 0); seq.forEach((d, i) => playTriad(key, d, (i + 1) * 1000)); } }; } },
  { id: "cadence", name: "Cadences", tag: "Harmony", icon: Check, learn: "How phrases end: Perfect (5→1) sounds finished. Plagal (4→1) is the 'Amen'. Half (→5) sounds like a question. Deceptive (5→6) surprises you with a minor chord.",
    gen: (lv) => { const key = rk(lv); const C = [["Perfect (5→1)", [4, 0]], ["Plagal (4→1)", [3, 0]], ["Half (→5)", [0, 4]], ["Deceptive (5→6)", [4, 5]]].slice(0, lv === 0 ? 2 : 4); const c = pick(C);
      return { sig: key + c[0], prompt: "How does the phrase end?", options: C.map((x) => x[0]), answer: c[0], play: () => { playTriad(key, 0); playTriad(key, lv >= 2 ? 1 : 3, 900); c[1].forEach((d, i) => playTriad(key, d, 1800 + i * 900)); } }; } },
  { id: "stype", name: "Scale type", tag: "Melody", icon: Sliders, learn: "Major is bright, natural minor is sad, harmonic minor has that exotic jump at the top, pentatonic has 5 notes and no half steps, the Ethiopian qenet have their own colours — Tizita feels like longing, Ambassel and Anchihoye are ancient and intense.",
    gen: (lv) => { const pools = [["major", "minor"], ["major", "minor", "harm", "pmaj", "pmin"], ["major", "minor", "harm", "mel", "dor", "mix", "lyd", "blues"], ["major", "minor", "harm", "mel", "dor", "phr", "lyd", "mix", "loc", "tizM", "tizm", "batM", "amb", "anc", "whole"]]; const id = pick(pools[lv]); const S = sc(id); const root = 57 + rand(8); const down = lv >= 2 && Math.random() < 0.4; const notes = [...S.steps.map((x) => root + x), root + 12]; const seq = down ? [...notes].reverse() : notes;
      return { sig: id + root, prompt: `Which scale is this${down ? " (played down)" : ""}?`, options: pools[lv].map(scName), answer: S.name, play: () => seq.forEach((m, i) => AE.tone(m, 0.35, i * 0.24, 0.65)) }; } },
  { id: "dict", name: "Melody dictation", tag: "Melody", icon: PianoIcon, kind: "seq", learn: "Hear a short melody, then play it on the piano. Sing it back first in your head, find the starting note, then follow the ups and downs.",
    gen: (lv) => { const key = lv < 2 ? 0 : rand(12); const base = keyBase(key); const len = [3, 4, 5, 7][lv]; let prev = 0; const ds = [0]; while (ds.length < len) { let n = prev + pick(lv < 2 ? [-1, 1, -2, 2] : [-1, 1, -2, 2, -3, 3, 4, -4]); n = Math.max(-2, Math.min(9, n)); if (n === prev) n++; ds.push(n); prev = n; } const ms = ds.map((d) => degMidi(base, d));
      return { sig: ms.join(), kind: "seq", prompt: `Play it back — starts on ${NOTE_NAMES[ms[0] % 12]}`, seq: ms, base: Math.min(...ms), play: () => ms.forEach((m, i) => AE.tone(m, 0.45, i * 0.5, 0.7)) }; } },
];

function EarTrainer({ embedded, tab: t0 }) {
  const { T } = useApp();
  const startId = t0 === "intervals" ? "int" : "deg";
  const [mod, setMod] = useState(t0 ? startId : null);
  const [lv, setLv] = useState(0);
  const [q, setQ] = useState(null);
  const [fb, setFb] = useState(null);
  const [sel, setSel] = useState([]);
  const [score, setScore] = useState({ ok: 0, n: 0, streak: 0 });
  const [best, setBest] = useState(() => { try { return JSON.parse(localStorage.getItem("beza-ear") || "{}"); } catch (e) { return {}; } });
  const last = useRef(null); const mixed = useRef(false);
  const M = EAR_MODULES.find((m) => m.id === mod);
  const fresh = (mm) => { const m = mm || M; let nq; for (let k = 0; k < 40; k++) { nq = { kind: m.kind || "choice", ...m.gen(lv) }; if (nq.sig !== (last.current && last.current.sig) && (nq.kind === "seq" || nq.answer !== (last.current && last.current.answer) || k > 30)) break; } last.current = nq; return nq; };
  const ask = () => { let m = M; if (mixed.current) { const others = EAR_MODULES.filter((x) => x.id !== (last.current && last.current.mod)); m = pick(others); } const nq = fresh(m); nq.mod = m.id; nq.modName = m.name; setQ(nq); setFb(null); setSel([]); setTimeout(() => nq.play && nq.play(), 150); };
  const done = (ok) => {
    setFb(ok ? "right" : "wrong"); if (ok) { AE.tone(84, 0.12, 0, 0.3); AE.tone(91, 0.18, 0.08, 0.3); }
    setScore((s) => { const n = { ok: s.ok + (ok ? 1 : 0), n: s.n + 1, streak: ok ? s.streak + 1 : 0 }; const k = (mixed.current ? "mix" : mod) + lv; if (n.streak > (best[k] || 0)) { const b = { ...best, [k]: n.streak }; setBest(b); try { localStorage.setItem("beza-ear", JSON.stringify(b)); } catch (e) { } } return n; });
    setTimeout(ask, ok ? 900 : 2000);
  };
  const choose = (o) => { if (!q || fb) return; done(o === q.answer); };
  const tapKey = (m) => { if (!q || fb || q.kind !== "seq") return; const ns = [...sel, m]; setSel(ns); if (ns.length === q.seq.length) done(ns.every((x, i) => x % 12 === q.seq[i] % 12)); };
  const open = (id, mix) => { mixed.current = !!mix; setMod(id); setQ(null); setFb(null); setScore({ ok: 0, n: 0, streak: 0 }); last.current = null; };
  if (!mod) return (
    <div>
      <ToolBar embedded={embedded} title="Ear Gym" sub={`${EAR_MODULES.length} trainers · 4 levels each · learn & challenge`} />
      <Card tone="hero" onClick={() => open("deg", true)} style={{ padding: 16, display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Zap size={28} noBlob /><div style={{ flex: 1 }}><div style={{ fontWeight: 900, fontSize: 17 }}>Mixed workout</div><div style={{ fontSize: 12.5, opacity: 0.9 }}>Every question a different skill — never the same twice</div></div><ChevronRight size={20} noBlob />
      </Card>
      {["Pitch", "Melody", "Harmony"].map((tag) => (
        <div key={tag}>
          <SectionTitle>{tag}</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {EAR_MODULES.filter((m) => m.tag === tag).map((m) => { const b = Math.max(0, ...EAR_LV.map((_, i) => best[m.id + i] || 0)); return (
              <Card key={m.id} onClick={(e) => { open(m.id); scrollUp(e); }} pad={14} style={{ minHeight: 104 }}>
                <m.icon size={24} /><div style={{ fontWeight: 800, fontSize: 14, marginTop: 8 }}>{m.name}</div><div style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>{b ? `Best streak 🔥 ${b}` : "Not tried yet"}</div>
              </Card>
            ); })}
          </div>
        </div>
      ))}
      {!embedded && <MarkComplete id="ear" label="Ear training" mins={10} />}
    </div>
  );
  return (
    <div>
      {!embedded && <TopBar title={mixed.current ? "Mixed workout" : M.name} sub={mixed.current ? "A different skill every question" : `${M.tag} · ear training`} />}
      {embedded && <Scroller style={{ marginBottom: 10 }}>{EAR_MODULES.map((m) => <Chip key={m.id} active={mod === m.id && !mixed.current} onClick={() => open(m.id)}>{m.name}</Chip>)}</Scroller>}
      {!embedded && <Btn small variant="ghost" icon={ChevronLeft} onClick={() => setMod(null)} style={{ marginBottom: 10 }}>All trainers</Btn>}
      <Seg value={lv} onChange={(v) => { setLv(v); setQ(null); setFb(null); setScore({ ok: 0, n: 0, streak: 0 }); }} options={EAR_LV.map((l, i) => ({ value: i, label: l }))} />
      {!mixed.current && <Card tone="soft" style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55 }}><b>How to hear it:</b> {M.learn}</Card>}
      <Card tone="hero" style={{ marginTop: 12, padding: 18, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800 }}><span><Glyph icon={Check} colors={NEON.good} /> {score.ok}/{score.n}</span><span><Glyph icon={Flame} /> {score.streak} · best {best[(mixed.current ? "mix" : mod) + lv] || 0}</span></div>
        {q && mixed.current && <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.8, marginTop: 10 }}>{q.modName.toUpperCase()}</div>}
        <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.3, margin: "10px 0" }}>{q ? q.prompt : "Ready when you are"}</div>
        {fb && <div className="bz-fadein" style={{ fontWeight: 800, marginBottom: 8, color: fb === "right" ? "#7CFFB2" : "#FFE53D" }}>{fb === "right" ? "Correct! 🎉" : `It was ${q.answer || q.seq.map(nn).join(" ")}`}</div>}
        {q ? <Btn variant="light" icon={Volume2} onClick={q.play}>Play again</Btn> : <Btn variant="accent" icon={Play} onClick={ask}>Start</Btn>}
      </Card>
      {q && q.kind !== "seq" && <div style={{ display: "grid", gridTemplateColumns: q.options.length > 6 ? "1fr 1fr 1fr" : "1fr 1fr", gap: 8, marginTop: 12 }}>{q.options.map((o) => <button key={o} onClick={() => choose(o)} className="bz-press" style={{ minHeight: 50, padding: "8px 6px", borderRadius: 14, border: `1.5px solid ${fb && o === q.answer ? T.good : T.border}`, background: fb && o === q.answer ? T.good + "33" : T.card, color: T.text, fontFamily: FONT, fontWeight: 800, fontSize: 13.5, cursor: "pointer", lineHeight: 1.2 }}>{o}</button>)}</div>}
      {q && q.kind === "seq" && <Card style={{ marginTop: 12, padding: 12 }}><div style={{ fontSize: 12.5, color: T.sub, marginBottom: 8 }}>Your notes: {sel.map(nn).join(" ") || "—"} ({sel.length}/{q.seq.length})</div><Piano start={q.base - (q.base % 12)} octaves={2} highlight={fb ? q.seq : []} roots={[]} height={110} onNote={tapKey} /><Btn style={{ marginTop: 8 }} variant="ghost" icon={RefreshCw} onClick={() => setSel([])}>Clear</Btn></Card>}
    </div>
  );
}

/* ---------------- HARMONY DRILLS ---------------- */
const HD = (id, name, lvl, desc, parts, beat = 1, opts = {}) => ({ id, name, lvl, desc, parts, beat, ...opts });
const rng = (a, b) => (a <= b ? Array.from({ length: b - a + 1 }, (_, i) => a + i) : Array.from({ length: a - b + 1 }, (_, i) => a - i));
const HARMONY_DRILLS = [
  HD("par3up", "Parallel 3rds — up the scale", 1, "Harmony a diatonic 3rd above a rising scale.", [{ n: "High harmony", d: rng(0, 7).map((x) => x + 2) }, { n: "Melody", d: rng(0, 7) }]),
  HD("par3dn", "Parallel 3rds — down the scale", 1, "Same idea descending. Hold your part as the melody falls.", [{ n: "High harmony", d: rng(7, 0).map((x) => x + 2) }, { n: "Melody", d: rng(7, 0) }]),
  HD("par6down", "Parallel 6ths below", 1, "Warm low harmony: a 6th under the melody.", [{ n: "Melody", d: rng(0, 7) }, { n: "Low harmony", d: rng(0, 7).map((x) => x - 5) }]),
  HD("third_below", "3rds below a melody", 2, "Harmony underneath — common for altos.", [{ n: "Melody", d: [4, 5, 4, 3, 2, 1, 0] }, { n: "Low harmony", d: [4, 5, 4, 3, 2, 1, 0].map((x) => x - 2) }]),
  HD("static", "Static harmony", 1, "Hold one note while the melody moves — great for beginners.", [{ n: "Harmony (hold)", d: [4, 4, 4, 4, 4, 4, 4, 4, 4] }, { n: "Melody", d: [0, 1, 2, 3, 2, 1, 2, 1, 0] }]),
  HD("drone5", "Drone on 5 below", 1, "Low part holds the 5th below while melody moves.", [{ n: "Melody", d: [0, 1, 2, 3, 4, 3, 2, 1, 0] }, { n: "Drone", d: Array(9).fill(-3) }]),
  HD("triad", "Build the chord (1-3-5)", 1, "Low enters, then melody, then high. Listen to the chord form.", [{ n: "High (3rd)", d: [null, null, null, null, 2, 2, 2, 2] }, { n: "Melody (root)", d: [null, null, 0, 0, 0, 0, 0, 0] }, { n: "Low (5th)", d: [-3, -3, -3, -3, -3, -3, -3, -3] }]),
  HD("prog1451", "1–4–5–1 in three parts", 3, "Smooth voice leading — each part moves as little as possible.", [{ n: "Top", d: [2, 3, 1, 2] }, { n: "Middle", d: [0, 0, -1, 0] }, { n: "Bottom", d: [-3, -2, -3, -3] }], 2),
  HD("prog1564", "1–5–6–4 pads", 3, "The modern worship progression as three-part 'Ooh' pads.", [{ n: "Top", d: [2, 1, 0, 0] }, { n: "Middle", d: [0, -1, -2, -2] }, { n: "Bottom", d: [-3, -3, -5, -4] }], 2),
  HD("prog6415", "6–4–1–5 pads", 3, "Emotional bridge progression in three parts.", [{ n: "Top", d: [0, 0, 2, 1] }, { n: "Middle", d: [-2, -2, 0, -1] }, { n: "Bottom", d: [-5, -4, -3, -3] }], 2),
  HD("amen", "'Amen' plagal cadence (4→1)", 2, "The classic hymn ending.", [{ n: "Top", d: [5, 4] }, { n: "Middle", d: [3, 2] }, { n: "Bottom", d: [0, 0] }], 3),
  HD("sus43", "Suspension 4 → 3", 3, "Tension resolves: the top voice holds 4 then falls to 3.", [{ n: "Top", d: [3, 3, 2, 2] }, { n: "Middle", d: [0, 0, 0, 0] }, { n: "Bottom", d: [-3, -3, -3, -3] }], 1.5),
  HD("callresp", "Call & response echo", 2, "Leader calls; team answers a 3rd higher.", [{ n: "Leader", d: [4, 4, 5, 4, 2, null, null, null, null, null] }, { n: "Team (3rd up)", d: [null, null, null, null, null, 6, 6, 7, 6, 4] }]),
  HD("ladder", "Interval ladder over a drone", 2, "Sing each interval above the held root.", [{ n: "Intervals", d: [1, null, 2, null, 3, null, 4, null, 5, null, 6, null, 7] }, { n: "Root drone", d: Array(13).fill(0) }]),
  HD("minor3", "3rds in the relative minor", 3, "Harmony in a minor colour (starting on 6).", [{ n: "High harmony", d: rng(5, 12).map((x) => x + 2) }, { n: "Melody", d: rng(5, 12) }]),
  HD("tizita", "Tizita harmony (pentatonic)", 4, "Harmony moves two qenet steps above the melody — authentic Mezmur colour.", [{ n: "High harmony", penta: true, d: [0, 1, 2, 3, 4, 3, 2, 1, 0].map((x) => x + 2) }, { n: "Melody", penta: true, d: [0, 1, 2, 3, 4, 3, 2, 1, 0] }]),
  HD("satb", "Four-part chorale (S-A-T-B)", 5, "1–4–1–5–1 in four parts like a choir.", [{ n: "Soprano", d: [2, 3, 2, 1, 2] }, { n: "Alto", d: [0, 0, 0, -1, 0] }, { n: "Tenor", d: [-3, -2, -3, -3, -3] }, { n: "Bass", d: [-7, -4, -7, -10, -7] }], 2),
];
const HARM_TYPES = [["3rd above", [0, 2]], ["3rd below", [0, -2]], ["6th below", [0, -5]], ["4th above", [0, 3]], ["5th below", [0, -4]], ["Triad (3 parts)", [4, 2, 0]], ["Octave + 3rd", [0, 2, -7]]];
const scaleDrill = (sid, hi) => { const S = ALL_SCALES.find((x) => x.id === sid); const n = S.steps.length; const [hn, offs] = HARM_TYPES[hi]; const mel = rng(0, n);
  const names = offs.length === 3 ? ["Top", "Middle", "Bottom"] : offs[1] > 0 ? ["Harmony", "Melody"] : ["Melody", "Harmony"];
  const order = offs.length === 3 ? offs : offs[1] > 0 ? [offs[1], 0] : [0, offs[1]];
  return HD("scale-" + sid + "-" + hi, `${S.name} — ${hn}`, 2, `Harmony through the ${S.name} scale. Every note stays inside the scale.`, order.map((o, i) => ({ n: names[i], sc: S.steps, d: mel.map((x) => x + o) }))); };
const dirParts = (parts, dir) => (dir === "up" ? parts : parts.map((p) => ({ ...p, d: dir === "down" ? [...p.d].reverse() : [...p.d, ...[...p.d].reverse().slice(1)] })));
const PENTA = [0, 1, 2, 4, 5];
const pentaDeg = (p) => 7 * Math.floor(p / 5) + PENTA[((p % 5) + 5) % 5];
function HarmonyDrills({ embedded, drill: d0 }) {
  const { T } = useApp();
  const [dr, setDr] = useState(HARMONY_DRILLS.find((d) => d.id === d0) || HARMONY_DRILLS[0]);
  const [key, setKey] = useState(0);
  const [bpm, setBpm] = useState(76);
  const [mine, setMine] = useState(0);
  const [mute, setMute] = useState(false);
  const [loop, setLoop] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [solo, setSolo] = useState(null);
  const [dir, setDir] = useState("up");
  const [bScale, setBScale] = useState("major");
  const [bType, setBType] = useState(0);
  const base = keyBase(key);
  const midiOf = (part, d) => (d == null ? null : part.sc ? base + 12 * Math.floor(d / part.sc.length) + part.sc[((d % part.sc.length) + part.sc.length) % part.sc.length] : degMidi(base, part.penta ? pentaDeg(d) : d));
  const parts = useMemo(() => dirParts(dr.parts, dir), [dr, dir]);
  const len = Math.max(...parts.map((p) => p.d.length));
  const stRef = useRef({ mute, mine, solo }); stRef.current = { mute, mine, solo };
  useEffect(() => {
    if (!playing) return; let i = 0; AE.get();
    const dur = (60 / bpm) * dr.beat;
    const tick = () => {
      if (i >= len) { if (!loop) { setPlaying(false); setStep(-1); return; } i = 0; }
      setStep(i); const { mute, mine, solo } = stRef.current;
      parts.forEach((p, pi) => {
        if (solo != null && solo !== pi) return; if (mute && pi === mine) return;
        const m = midiOf(p, p.d[i]); if (m != null) AE.tone(m, dur * 0.95, 0, pi === mine ? 0.8 : 0.55);
      });
      i++;
    };
    tick(); const iv = setInterval(tick, dur * 1000);
    return () => clearInterval(iv);
  }, [playing, dr, key, bpm, loop, dir]); // eslint-disable-line
  const pick = (d) => { setPlaying(false); setStep(-1); setDr(d); setMine(0); setSolo(null); };
  return (
    <div>
      <ToolBar embedded={embedded} title="Harmony Drills" sub={`${HARMONY_DRILLS.length} drills + every scale · up, down or both`} />
      <Card tone="hero" style={{ padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, textTransform: "uppercase", letterSpacing: 1 }}>{LEVELS[dr.lvl]} · key of {NOTE_NAMES[key]}</div>
        <div style={{ fontFamily: headFont(T), fontSize: 22, lineHeight: 1.15, margin: "2px 0 4px" }}>{dr.name}</div>
        <div style={{ fontSize: 12.5, opacity: 0.88 }}>{dr.desc}</div>
        <div style={{ marginTop: 12 }}><Seg value={dir} onChange={(v) => { setDir(v); setStep(-1); }} options={[{ value: "up", label: "↑ Up" }, { value: "down", label: "↓ Down" }, { value: "both", label: "↑↓ Both" }]} /></div>
        <div style={{ marginTop: 12, overflowX: "auto" }} className="bz-noscroll">
          {parts.map((p, pi) => (
            <div key={pi} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <button onClick={() => setMine(pi)} style={{ width: 92, flexShrink: 0, textAlign: "left", border: "none", background: "transparent", color: "inherit", fontFamily: FONT, fontSize: 11, fontWeight: 700, cursor: "pointer", opacity: mine === pi ? 1 : 0.7 }}>
                {mine === pi ? "★ " : ""}{p.n}
              </button>
              {Array.from({ length: len }).map((_, i) => {
                const m = midiOf(p, p.d[i]); const on = step === i && m != null;
                return <div key={i} style={{ minWidth: 30, height: 30, borderRadius: 9, display: "grid", placeItems: "center", fontSize: 10.5, fontWeight: 800, background: m == null ? "transparent" : on ? (mine === pi ? T.accent : "#fff") : mine === pi ? "rgba(198,255,61,0.25)" : "rgba(255,255,255,0.14)", color: on ? "#111" : "inherit", border: m == null ? "1px dashed rgba(255,255,255,0.25)" : "none" }}>{m != null ? nn(m) : ""}</div>;
              })}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <Btn full variant={playing ? "light" : "accent"} icon={playing ? Square : Play} onClick={() => setPlaying((p) => !p)}>{playing ? "Stop" : "Play"}</Btn>
          <Btn variant={mute ? "pop" : "light"} onClick={() => setMute((m) => !m)}>{mute ? "My part muted" : "Mute my part"}</Btn>
        </div>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 8 }}>YOUR PART (★) · SOLO A PART</div>
        <Scroller style={{ marginBottom: 10 }}>
          {dr.parts.map((p, pi) => <Chip key={pi} active={mine === pi} onClick={() => setMine(pi)}>{p.n}</Chip>)}
        </Scroller>
        <Scroller style={{ marginBottom: 10 }}>
          <Chip active={solo == null} onClick={() => setSolo(null)}>All parts</Chip>
          {dr.parts.map((p, pi) => <Chip key={pi} active={solo === pi} onClick={() => setSolo(pi)}>Only {p.n}</Chip>)}
        </Scroller>
        <Slider label="Tempo" value={bpm} min={40} max={140} onChange={setBpm} fmt={(v) => `${v} bpm`} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Loop</span><Toggle on={loop} onChange={setLoop} /></div>
        <KeyChips value={key} onChange={setKey} />
      </Card>
      <Card tone="soft" style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55 }}>
        <b>Method:</b> 1) listen to all parts · 2) solo your part and sing along · 3) play all, sing your part · 4) mute your part and hold it alone · 5) change key and repeat.
      </Card>
      <SectionTitle>Scale harmony builder</SectionTitle>
      <Card>
        <div style={{ fontSize: 12, color: T.sub, marginBottom: 8 }}>Pick any scale and a harmony — practise it up, down or both, in any key.</div>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "4px 0 6px" }}>SCALE</div>
        {SCALE_GROUPS.map((g) => <div key={g.id} style={{ marginBottom: 6 }}><div style={{ fontSize: 10.5, color: T.faint, fontWeight: 700, marginBottom: 4 }}>{g.name.toUpperCase()}</div><Scroller>{g.items.filter((x) => x.id !== "chrom").map((x) => <Chip key={x.id} active={bScale === x.id} onClick={() => setBScale(x.id)}>{x.name}</Chip>)}</Scroller></div>)}
        <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "8px 0 6px" }}>HARMONY</div>
        <Scroller>{HARM_TYPES.map(([n], i) => <Chip key={n} active={bType === i} onClick={() => setBType(i)}>{n}</Chip>)}</Scroller>
        <Btn full variant="accent" icon={Play} style={{ marginTop: 12 }} onClick={(ev) => { pick(scaleDrill(bScale, bType)); scrollUp(ev); }}>Load this drill</Btn>
      </Card>
      <SectionTitle>All drills</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {HARMONY_DRILLS.map((d, i) => (
          <Card key={d.id} pad={12} tone={d.id === dr.id ? "soft" : "card"} onClick={(ev) => { pick(d); scrollUp(ev); }} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 12, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13, background: d.id === dr.id ? T.accent : T.card2, color: d.id === dr.id ? T.accentText : T.text }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{d.name}</div>
              <div style={{ fontSize: 11.5, color: T.sub }}>{LEVELS[d.lvl]} · {d.parts.length} parts</div>
            </div>
          </Card>
        ))}
      </div>
      {!embedded && <MarkComplete id="harmony" label="Harmony drills" mins={10} />}
    </div>
  );
}
