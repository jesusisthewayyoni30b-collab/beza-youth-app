
/* ============================ MUSIC BASICS (for singers & everyone) + CHORD LIBRARY BY KEY ============================ */
const KEY_ORDER = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]; // C G D A E B F# Db Ab Eb Bb F
const keyNm = (pc) => spell(((pc % 12) + 12) % 12, ((pc % 12) + 12) % 12);
const MAJ_STEPS = [0, 2, 4, 5, 7, 9, 11];
/* proper note names for a 7-note scale: one letter per degree (G dorian = G A Bb C D E F, never A#) */
function scaleNames(key, steps) {
  const L = "CDEFGAB"; const NAT = [0, 2, 4, 5, 7, 9, 11]; const SH = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]; const FL = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const build = (tn) => { const li = L.indexOf(tn[0]); return steps.map((st, i) => { const letter = L[(li + i) % 7]; const target = (key + st) % 12; const d = ((target - NAT[L.indexOf(letter)]) % 12 + 18) % 12 - 6; return letter + (d === 1 ? "#" : d === 2 ? "##" : d === -1 ? "b" : d === -2 ? "bb" : ""); }); };
  const score = (ns) => ns.reduce((t, n) => t + (n.length > 2 ? 10 : n.length - 1), 0);
  const a = build(SH[key % 12]), b = build(FL[key % 12]); const pref = keyNm(key) === FL[key % 12] ? b : a; const other = pref === a ? b : a;
  return score(other) < score(pref) ? other : pref;
}
const MODES7 = [
  { id: "major", name: "Major (Ionian)", steps: [0, 2, 4, 5, 7, 9, 11], feel: "Bright, home. Most worship songs." },
  { id: "minor", name: "Minor (Aeolian)", steps: [0, 2, 3, 5, 7, 8, 10], feel: "Deep, reflective, prayerful." },
  { id: "dorian", name: "Dorian", steps: [0, 2, 3, 5, 7, 9, 10], feel: "Minor with hope (a bright 6). Gospel & soul." },
  { id: "mixo", name: "Mixolydian", steps: [0, 2, 4, 5, 7, 9, 10], feel: "Major with a flat 7: rock and anthem choruses." },
  { id: "lydian", name: "Lydian", steps: [0, 2, 4, 6, 7, 9, 11], feel: "Dreamy, floating (#4). Pads and intros." },
  { id: "phryg", name: "Phrygian", steps: [0, 1, 3, 5, 7, 8, 10], feel: "Dark, Middle-Eastern (b2)." },
  { id: "locrian", name: "Locrian", steps: [0, 1, 3, 5, 6, 8, 10], feel: "Unstable (b5). Rare, for colour only." },
  { id: "harm", name: "Harmonic minor", steps: [0, 2, 3, 5, 7, 8, 11], feel: "Minor with a strong pull home (raised 7)." },
  { id: "mel", name: "Melodic minor", steps: [0, 2, 3, 5, 7, 9, 11], feel: "Smooth minor for runs and jazz/gospel colour." },
];
const TRI_Q = { "4,7": ["", ""], "3,7": ["m", "m"], "3,6": ["dim", "°"], "4,8": ["aug", "+"] };
const SEV_Q = { "4,7,11": ["maj7", "maj7"], "4,7,10": ["7", "7"], "3,7,10": ["m7", "m7"], "3,6,10": ["m7b5", "ø7"], "3,6,9": ["dim7", "°7"], "3,7,11": ["mmaj7", "m(maj7)"], "4,8,11": ["aug", "+maj7"] };
/* the chords that live inside a key + mode, with their numbers */
function modeChords(key, steps, sev) {
  const names = steps.length === 7 ? scaleNames(key, steps) : null;
  return steps.map((st, i) => {
    const pick = (k) => steps[(i + k) % 7] + (i + k >= 7 ? 12 : 0) - st;
    const iv = sev ? [pick(2), pick(4), pick(6)] : [pick(2), pick(4)];
    const [q, suf] = (sev ? SEV_Q : TRI_Q)[iv.join(",")] || ["", ""];
    const acc = st - MAJ_STEPS[i]; const pre = acc === -1 ? "b" : acc === 1 ? "#" : acc === -2 ? "bb" : "";
    const root = (key + st) % 12;
    return { i, root, q, num: `${pre}${i + 1}${suf}`, name: (names ? names[i] : spell(root, key)) + (q === "mmaj7" ? "m(maj7)" : q), iv: [0, ...iv] };
  });
}
const PROGS = {
  major: [["1 5 6m 4", [0, 4, 5, 3]], ["1 4 5", [0, 3, 4]], ["6m 4 1 5", [5, 3, 0, 4]], ["2m 5 1", [1, 4, 0]], ["1 6m 4 5", [0, 5, 3, 4]]],
  minor: [["1m b6 b7", [0, 5, 6]], ["1m 4m 5m", [0, 3, 4]], ["1m b7 b6 b7", [0, 6, 5, 6]], ["b6 b7 1m", [5, 6, 0]]],
};
const playChordIv = (root, iv, when = 0) => AE.chord(voiceChord(48 + root, iv, 0, "close"), 1.4, 0);

/* ---------------- TRANSPOSE (shared by Music Basics and Chord Library) ---------------- */
function semitoneWalk(from, amt) { const out = [from]; const dir = amt < 0 ? -1 : 1; for (let k = 1; k <= Math.abs(amt); k++) out.push((from + dir * k + 120) % 12); return out; }
function TransposeCalc({ showChords = true }) {
  const { T } = useApp();
  const [from, setFrom] = useState(7); const [amt, setAmt] = useState(-5);
  const to = (from + amt + 120) % 12; const walk = semitoneWalk(from, amt);
  const other = amt > 0 ? amt - 12 : amt + 12;
  const ex = modeChords(from, MODES7[0].steps, false).filter((c) => [0, 3, 4, 5].includes(c.i)); const ex2 = modeChords(to, MODES7[0].steps, false).filter((c) => [0, 3, 4, 5].includes(c.i));
  const hear = () => { AE.chord(voiceChord(48 + from, [0, 4, 7], 0, "close"), 1.1, 0); setTimeout(() => AE.chord(voiceChord(48 + to, [0, 4, 7], 0, "close"), 1.4, 0), 1100); };
  return (
    <Card tone="hero">
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.8 }}>SONG IS IN</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>{KEY_ORDER.map((k) => <Chip key={k} active={from === k} onClick={() => setFrom(k)}>{keyNm(k)}</Chip>)}</div>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.8, marginTop: 14 }}>TRANSPOSE BY</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>{[-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7].map((a) => <Chip key={a} active={amt === a} onClick={() => setAmt(a)}>{a > 0 ? "+" + a : a}</Chip>)}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "18px 0 6px" }}>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, opacity: 0.7 }}>FROM</div><div style={{ fontSize: 40, fontWeight: 900 }}>{keyNm(from)}</div></div>
        <div style={{ fontSize: 22, fontWeight: 900, opacity: 0.9 }}>{amt > 0 ? `+${amt} →` : `${amt} →`}</div>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, opacity: 0.7 }}>NEW KEY</div><div style={{ fontSize: 40, fontWeight: 900, color: "#C6FF3D" }}>{keyNm(to)}</div></div>
      </div>
      <div style={{ textAlign: "center", fontSize: 13, opacity: 0.9 }}>{amt < 0 ? `${Math.abs(amt)} half step${Math.abs(amt) > 1 ? "s" : ""} DOWN (lower, easier for high notes)` : `${amt} half step${amt > 1 ? "s" : ""} UP (higher, brighter)`}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", marginTop: 10 }}>
        {walk.map((p, i) => <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ padding: "4px 8px", borderRadius: 8, fontWeight: 800, fontSize: 13, background: i === 0 ? "rgba(255,255,255,0.18)" : i === walk.length - 1 ? "#C6FF3D" : "rgba(255,255,255,0.08)", color: i === walk.length - 1 ? "#111" : "inherit" }}>{keyNm(p)}</span>{i < walk.length - 1 && <span style={{ opacity: 0.6, fontSize: 11 }}>{amt < 0 ? "−1" : "+1"}</span>}</span>)}
      </div>
      <div style={{ fontSize: 12, opacity: 0.8, textAlign: "center", marginTop: 8 }}>Count every key on the piano, black keys too. Same new key: {other > 0 ? "+" + other : other} (just an octave {other > 0 ? "higher" : "lower"}).</div>
      {showChords && <div style={{ marginTop: 12, background: "rgba(0,0,0,0.2)", borderRadius: 14, padding: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.8, marginBottom: 6 }}>THE NUMBERS STAY THE SAME, THE CHORDS MOVE</div>
        {[0, 1, 2, 3].map((k) => <div key={k} style={{ display: "grid", gridTemplateColumns: "50px 1fr 20px 1fr", alignItems: "center", fontSize: 14, padding: "3px 0" }}><b>{ex[k].num}</b><span>{ex[k].name}</span><span style={{ opacity: 0.5 }}>→</span><b style={{ color: "#C6FF3D" }}>{ex2[k].name}</b></div>)}
      </div>}
      <Btn full variant="light" icon={Play} style={{ marginTop: 12 }} onClick={hear}>Hear old key → new key</Btn>
    </Card>
  );
}

/* ---------------- MUSIC BASICS ---------------- */
const BASICS_TABS = [{ value: "steps", label: "Half steps" }, { value: "transpose", label: "Transpose" }, { value: "keys", label: "Keys" }, { value: "numbers", label: "Numbers" }, { value: "mykey", label: "My key" }];
function MusicBasics({ embedded, tab: t0 }) {
  const { T } = useApp();
  const [tab, setTab] = useState(t0 || "steps");
  return (
    <div>
      <ToolBar embedded={embedded} title="Music Basics" sub="Transpose, keys & numbers, explained simply" />
      <div className="bz-noscroll" style={{ overflowX: "auto" }}><Seg value={tab} onChange={setTab} options={BASICS_TABS} style={{ minWidth: 420 }} /></div>
      <div style={{ marginTop: 12 }}>
        {tab === "steps" && <BasicsSteps />}
        {tab === "transpose" && <BasicsTranspose />}
        {tab === "keys" && <BasicsKeys />}
        {tab === "numbers" && <BasicsNumbers />}
        {tab === "mykey" && <BasicsMyKey />}
      </div>
      {!embedded && <MarkComplete id="basics" label="Music basics" mins={10} />}
    </div>
  );
}
const Para = ({ children }) => <div style={{ fontSize: 13.5, lineHeight: 1.6, marginBottom: 8 }}>{children}</div>;
function BasicsSteps() {
  const { T } = useApp(); const [last, setLast] = useState(null);
  return (
    <>
      <Card tone="soft">
        <Para><b>Music has only 12 notes.</b> On a piano they repeat over and over: C, C#, D, D#, E, F, F#, G, G#, A, A#, B, then C again (higher).</Para>
        <Para>The distance from one key to the very next key (white <i>or</i> black) is a <b>half step</b>, also called a <b>semitone</b>. Two half steps = a <b>whole step</b>.</Para>
        <Para>A sharp <b>#</b> means one half step <b>up</b>; a flat <b>b</b> means one half step <b>down</b>. So C# and Db are the same key, just two names.</Para>
        <Para>When musicians say <b>"+1"</b> or <b>"−2"</b>, they are counting these half steps.</Para>
      </Card>
      <SectionTitle>Tap the keys and count</SectionTitle>
      <Card>
        <Piano start={60} octaves={1} highlight={last != null ? [last] : []} onNote={(m) => { AE.tone(m, 0.9); setLast(m); }} height={130} />
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 14 }}>{last == null ? "Tap any key" : <span><b>{nn(last)}</b> is <b>{last - 60}</b> half step{last - 60 === 1 ? "" : "s"} above C</span>}</div>
      </Card>
      <Card tone="soft" style={{ marginTop: 10 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Words you will hear at rehearsal</div>
        {[["Half step / semitone", "1 key on the piano (= 1 in transpose)"], ["Whole step / tone", "2 keys (= 2 in transpose)"], ["Octave", "12 half steps: the same note, higher or lower"], ["Sharp ♯ / flat ♭", "one half step up / down"], ["Key", "the 'home' note and scale of a song"], ["Modulate / key change", "the song moves to a new key (often +1 or +2 for the last chorus)"]].map(([a, b]) => <div key={a} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderTop: `1px solid ${T.border}`, fontSize: 13 }}><b>{a}</b><span style={{ color: T.sub, textAlign: "right" }}>{b}</span></div>)}
      </Card>
    </>
  );
}
function BasicsTranspose() {
  const { T } = useApp();
  const mkQ = () => { const from = KEY_ORDER[Math.floor(Math.random() * 12)]; const amt = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5][Math.floor(Math.random() * 10)]; const ans = (from + amt + 120) % 12; const opts = new Set([ans]); while (opts.size < 4) opts.add((ans + [1, -1, 2, -2, 5, 7][Math.floor(Math.random() * 6)] + 120) % 12); return { from, amt, ans, opts: [...opts].sort(() => Math.random() - 0.5) }; };
  const [q, setQ] = useState(mkQ); const [pick, setPick] = useState(null); const [score, setScore] = useState([0, 0]);
  return (
    <>
      <Card tone="soft">
        <Para><b>Transpose = move the whole song up or down</b> so it fits the singer's voice. The melody and the chords keep the same shape, they just start on a different note.</Para>
        <Para><b>The number is how many half steps.</b> <b>−</b> means lower, <b>+</b> means higher. Example: song in <b>G</b>, leader says <b>"−5"</b>: count 5 keys down: G → F# → F → E → Eb → <b>D</b>. The song is now in D.</Para>
        <Para><b>Song too high for you?</b> Go down (−1, −2…). <b>Too low?</b> Go up (+1, +2…). One half step is small, five is big.</Para>
        <Para><b>−5 and +7 land on the same key</b> (5 + 7 = 12 = one octave). Musicians pick whichever is easier to say.</Para>
      </Card>
      <SectionTitle>Try it</SectionTitle>
      <TransposeCalc />
      <SectionTitle>Quick quiz · {score[0]}/{score[1]}</SectionTitle>
      <Card>
        <div style={{ fontSize: 15, fontWeight: 700 }}>The song is in <b>{keyNm(q.from)}</b>. The leader says <b>"{q.amt > 0 ? "+" + q.amt : q.amt}"</b>. What's the new key?</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
          {q.opts.map((o) => <Btn key={o} variant={pick == null ? "soft" : o === q.ans ? "accent" : o === pick ? "ghost" : "soft"} onClick={() => { if (pick != null) return; setPick(o); setScore(([a, b]) => [a + (o === q.ans ? 1 : 0), b + 1]); }}>{keyNm(o)}{pick != null && o === q.ans ? " ✓" : ""}</Btn>)}
        </div>
        {pick != null && <div style={{ marginTop: 10, fontSize: 13 }}>{pick === q.ans ? "Correct! " : "Not quite. "}{semitoneWalk(q.from, q.amt).map(keyNm).join(" → ")}<Btn small style={{ marginLeft: 8 }} onClick={() => { setQ(mkQ()); setPick(null); }}>Next</Btn></div>}
      </Card>
      <Card tone="soft" style={{ marginTop: 10, fontSize: 13, lineHeight: 1.6 }}>
        <b>How the band does it:</b> keys players press the <b>transpose</b> button (−5 means their keyboard sounds 5 half steps lower while they play the same shapes). Guitarists move the <b>capo</b> or change chords. Singers just sing the same melody, starting on the new note. Everyone uses the <b>same numbers</b> (1, 4, 5, 6m) so nothing else changes.
      </Card>
    </>
  );
}
function BasicsKeys() {
  const { T } = useApp(); const [key, setKey] = useState(0);
  const notes = MAJ_STEPS.map((s) => 60 + key + s).concat([72 + key]);
  const playScale = () => notes.forEach((m, i) => AE.tone(m, 0.45, i * 0.32));
  return (
    <>
      <Card tone="soft">
        <Para><b>A key is a song's home.</b> "The song is in G" means G feels like home: the song usually starts or ends there, and it uses the 7 notes of the <b>G major scale</b>.</Para>
        <Para>Every major scale uses the same pattern of steps: <b>Whole · Whole · Half · Whole · Whole · Whole · Half</b>. Start that pattern on any note and you get that note's major scale.</Para>
        <Para>Minor keys (like "Em") feel deeper and sadder; they use a different pattern.</Para>
      </Card>
      <SectionTitle>Hear a major scale in any key</SectionTitle>
      <Card>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{KEY_ORDER.map((k) => <Chip key={k} active={key === k} onClick={() => setKey(k)}>{keyNm(k)}</Chip>)}</div>
        <div style={{ marginTop: 12 }}><Piano start={60} octaves={2} highlight={notes} roots={[60 + key, 72 + key]} height={110} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13, fontWeight: 800 }}>{notes.map((m, i) => <span key={i} style={{ textAlign: "center" }}>{scaleNames(key, MAJ_STEPS)[i % 7]}<div style={{ fontSize: 10.5, color: T.sub }}>{i === 7 ? "1" : i + 1}</div></span>)}</div>
        <Btn full icon={Play} style={{ marginTop: 10 }} onClick={playScale}>Play {keyNm(key)} major</Btn>
      </Card>
    </>
  );
}
function BasicsNumbers() {
  const { T } = useApp(); const [key, setKey] = useState(7);
  const chords = modeChords(key, MAJ_STEPS, false);
  return (
    <>
      <Card tone="soft">
        <Para><b>The number system</b> gives each note of the key a number: the home note is <b>1</b>, the next is <b>2</b>, up to <b>7</b>. Chords get the number of the note they start on.</Para>
        <Para>In every major key the pattern is the same: <b>1 · 2m · 3m · 4 · 5 · 6m · 7°</b> (m = minor). So "1 5 6m 4" works in every key. That's why bands talk in numbers: if the key changes, the numbers don't.</Para>
        <Para><b>On the in-ears:</b> "going to the 4", "back to 1", "6 minor", "walk up to 5", "last chorus up one (+1)".</Para>
      </Card>
      <SectionTitle>Numbers in any key</SectionTitle>
      <Card>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{KEY_ORDER.map((k) => <Chip key={k} active={key === k} onClick={() => setKey(k)}>{keyNm(k)}</Chip>)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 12 }}>
          {chords.map((c) => <button key={c.i} onClick={() => playChordIv(c.root, c.iv)} className="bz-press" style={{ border: "none", borderRadius: 12, padding: "10px 2px", background: T.card2, color: T.text, fontFamily: FONT, cursor: "pointer" }}><div style={{ fontWeight: 900, fontSize: 16 }}>{c.num}</div><div style={{ fontSize: 12, color: T.sub, marginTop: 2 }}>{c.name}</div></button>)}
        </div>
        <div style={{ fontSize: 12, color: T.sub, marginTop: 10 }}>Tap a number to hear the chord. Try 1 → 5 → 6m → 4: the most common worship progression.</div>
      </Card>
    </>
  );
}
function BasicsMyKey() {
  const { T, voiceRange } = useApp();
  const [song, setSong] = useState(72); const [mine, setMine] = useState(voiceRange && voiceRange.high ? voiceRange.high - 2 : 69); const [key, setKey] = useState(7);
  const diff = mine - song; const amt = Math.max(-7, Math.min(7, diff)); const newKey = (key + amt + 120) % 12;
  const notesSel = Array.from({ length: 29 }, (_, i) => 52 + i);
  return (
    <>
      <Card tone="soft">
        <Para><b>Find your key in 3 steps.</b> 1) Find the <b>highest note</b> of the song. 2) Know the highest note <b>you can sing comfortably</b> (your Range Tester result helps). 3) The difference in half steps is your transpose.</Para>
        <Para>Example: the song's top note is <b>C5</b>, but you're comfortable up to <b>A4</b>. That's 3 half steps too high, so ask for <b>−3</b>.</Para>
      </Card>
      <SectionTitle>Calculate it</SectionTitle>
      <Card>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub }}>SONG IS IN</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>{KEY_ORDER.map((k) => <Chip key={k} active={key === k} onClick={() => setKey(k)}>{keyNm(k)}</Chip>)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
          {[["SONG'S HIGHEST NOTE", song, setSong], ["MY COMFORTABLE TOP", mine, setMine]].map(([l, v, set]) => (
            <div key={l}><div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, marginBottom: 6 }}>{l}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Btn small variant="soft" onClick={() => { set(v - 1); AE.tone(v - 1, 0.8); }}>−</Btn><div style={{ flex: 1, textAlign: "center", fontWeight: 900, fontSize: 20 }}>{nnOct(v)}</div><Btn small variant="soft" onClick={() => { set(v + 1); AE.tone(v + 1, 0.8); }}>+</Btn></div>
              <Btn small variant="ghost" full style={{ marginTop: 6 }} icon={Play} onClick={() => AE.tone(v, 1.2)}>Hear</Btn></div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: 14, borderRadius: 16, background: T.hero, color: T.heroText, textAlign: "center" }}>
          {diff === 0 ? <div style={{ fontWeight: 800 }}>Perfect fit: keep the song in {keyNm(key)}</div> : <>
            <div style={{ fontSize: 12, opacity: 0.8 }}>ASK THE BAND FOR</div>
            <div style={{ fontSize: 38, fontWeight: 900 }}>{amt > 0 ? "+" + amt : amt}</div>
            <div style={{ fontSize: 14 }}>New key: <b style={{ color: "#C6FF3D" }}>{keyNm(newKey)}</b>{Math.abs(diff) > 7 ? " · more than 7 is a big jump; try singing that part an octave lower" : ""}</div></>}
        </div>
        {voiceRange && <div style={{ fontSize: 12, color: T.sub, marginTop: 8 }}>Your Range Tester result: {voiceRange.label}. Leave 1–2 half steps of space below your very top note for a long service.</div>}
      </Card>
    </>
  );
}

/* ---------------- CHORD LIBRARY: BY KEY & MODE (piano + guitar + numbers + transpose + capo) ---------------- */
function ChordsByKey({ inst }) {
  const { T } = useApp();
  const [key, setKey] = useState(7); const [mode, setMode] = useState("major"); const [sev, setSev] = useState(false);
  const M = MODES7.find((m) => m.id === mode); const chords = modeChords(key, M.steps, sev);
  const progs = PROGS[["minor", "dorian", "phryg", "harm", "mel", "locrian"].includes(mode) ? "minor" : "major"];
  const playProg = (idx) => idx.forEach((i, k) => { const c = chords[i]; setTimeout(() => (inst === "guitar" ? strumByName(c) : playChordIv(c.root, c.iv)), k * 900); });
  const strumByName = (c) => { const v = chordVoicings(c.root, c.q)[0]; if (v) strumShape(v.frets, "acoustic", v.capo); else playChordIv(c.root, c.iv); };
  return (
    <>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, marginBottom: 6 }}>KEY</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{KEY_ORDER.map((k) => <Chip key={k} active={key === k} onClick={() => setKey(k)}>{keyNm(k)}</Chip>)}</div>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "12px 0 6px" }}>SCALE / MODE</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{MODES7.map((m) => <Chip key={m.id} active={mode === m.id} onClick={() => setMode(m.id)}>{m.name}</Chip>)}</div>
      <div style={{ fontSize: 12, color: T.sub, marginTop: 6 }}>{M.feel} Notes: <b style={{ color: T.text }}>{scaleNames(key, M.steps).join(" ")}</b></div>
      <div style={{ marginTop: 10 }}><Seg value={sev} onChange={setSev} options={[{ value: false, label: "Triads" }, { value: true, label: "7th chords" }]} /></div>
      <SectionTitle>{scaleNames(key, M.steps)[0]} {M.name.split(" (")[0].toLowerCase()} · the 7 chords and their numbers</SectionTitle>
      {inst === "piano" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 10 }}>
          {chords.map((c) => { const v = voiceChord(48 + c.root, c.iv, 0, "close"); const st = Math.floor(Math.min(...v) / 12) * 12;
            return <Card key={c.i} pad={10} onClick={() => playChordIv(c.root, c.iv)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><span style={{ minWidth: 40, padding: "4px 8px", borderRadius: 10, background: T.accent, color: T.accentText, fontWeight: 900, textAlign: "center" }}>{c.num}</span><b style={{ fontSize: 16 }}>{c.name}</b><span style={{ marginLeft: "auto", fontSize: 11, color: T.sub }}>{v.map((m) => { const nm = scaleNames(key, M.steps); const ix = M.steps.findIndex((st) => (key + st) % 12 === m % 12); return ix >= 0 ? nm[ix] : spell(m % 12, key); }).join(" ")}</span></div>
              <Piano start={st} octaves={Math.max(1, Math.ceil((Math.max(...v) - st + 1) / 12))} highlight={v} roots={[v[0]]} height={70} labels={false} />
            </Card>; })}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {chords.map((c) => <div key={c.i}><div style={{ textAlign: "center", marginBottom: 4 }}><span style={{ padding: "3px 10px", borderRadius: 10, background: T.accent, color: T.accentText, fontWeight: 900 }}>{c.num}</span> <b>{c.name}</b></div><ChordTile root={c.root} q={c.q === "mmaj7" ? "mmaj7" : c.q} /></div>)}
        </div>
      )}
      <SectionTitle>Common progressions in {keyNm(key)}</SectionTitle>
      {progs.map(([lab, idx]) => <Card key={lab} pad={10} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }} onClick={() => playProg(idx)}>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 900 }}>{idx.map((i) => chords[i].num).join("  ")}</div><div style={{ fontSize: 12.5, color: T.sub }}>{idx.map((i) => chords[i].name).join(" – ")}</div></div><Play size={18} />
      </Card>)}
    </>
  );
}
function CapoChart() {
  const { T } = useApp(); const [key, setKey] = useState(2);
  const easy = [0, 7, 2, 9, 4]; // C G D A E shape keys
  const rows = Array.from({ length: 10 }, (_, capo) => { const shapeKey = (key - capo + 12) % 12; return { capo, shapeKey, easy: easy.includes(shapeKey) }; });
  return (
    <>
      <Card tone="soft" style={{ fontSize: 13, lineHeight: 1.6 }}>A <b>capo</b> raises every string. Capo on fret 2 = everything sounds <b>+2</b>. So to play in a hard key, put the capo on and play easy shapes. The numbers (1 4 5 6m) never change, only the shapes.</Card>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "12px 0 6px" }}>THE SONG IS IN (sounding key)</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{KEY_ORDER.map((k) => <Chip key={k} active={key === k} onClick={() => setKey(k)}>{keyNm(k)}</Chip>)}</div>
      <SectionTitle>Capo options for {keyNm(key)}</SectionTitle>
      {rows.map((r) => { const ch = modeChords(r.shapeKey, MAJ_STEPS, false).filter((c) => [0, 3, 4, 5].includes(c.i));
        return <Card key={r.capo} pad={10} style={{ marginBottom: 8, opacity: r.easy ? 1 : 0.6, border: r.easy ? `2px solid ${T.good}` : undefined }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><b>{r.capo === 0 ? "No capo" : `Capo ${r.capo}`} → play <span style={{ color: T.accent }}>{keyNm(r.shapeKey)}</span> shapes</b>{r.easy && <span style={{ fontSize: 11, fontWeight: 800, color: T.good }}>EASY</span>}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 6, fontSize: 12.5 }}>{ch.map((c) => <div key={c.i} style={{ textAlign: "center", background: T.card2, borderRadius: 10, padding: "6px 2px" }}><div style={{ fontWeight: 900 }}>{c.num}</div><div>{c.name}</div><div style={{ fontSize: 10, color: T.sub }}>sounds {spell((c.root + r.capo) % 12, key)}{c.q}</div></div>)}</div>
        </Card>; })}
    </>
  );
}
function ChordLibraryHub({ embedded, ...rest }) {
  const { user } = useApp(); const rs = (user && user.roles) || [];
  const [tab, setTab] = useState("key"); const [inst, setInst] = useState(rs.includes("keys") || !(rs.includes("acoustic") || rs.includes("lead")) ? "piano" : "guitar");
  return (
    <div>
      <ToolBar embedded={embedded} title="Chord Library" sub="Every key & mode · numbers · transpose · capo" />
      <Seg value={tab} onChange={setTab} options={[{ value: "key", label: "By key" }, { value: "any", label: "Any chord" }, { value: "transpose", label: "Transpose" }, { value: "capo", label: "Capo" }]} />
      {(tab === "key") && <div style={{ marginTop: 10 }}><Seg value={inst} onChange={setInst} options={[{ value: "piano", label: "🎹 Piano" }, { value: "guitar", label: "🎸 Guitar" }]} /></div>}
      <div style={{ marginTop: 12 }}>
        {tab === "key" && <ChordsByKey inst={inst} />}
        {tab === "any" && <ChordLibrary embedded {...rest} />}
        {tab === "transpose" && <TransposeCalc />}
        {tab === "capo" && <CapoChart />}
      </div>
    </div>
  );
}
