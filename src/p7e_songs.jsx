
/* ============================ SONGS — the band's shared chord charts ============================
   Charts are stored in NUMBERS (Nashville system) so a key change re-spells every chord instantly.
   You can type chords as numbers ("1 5 6m 4") or as chord names in the song's key ("G D Em C"). */
const SHARP_N = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_N = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const FLAT_KEYS = [5, 10, 3, 8, 1];
const SONG_KEYS = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const spell = (pc, key) => (FLAT_KEYS.includes(key) ? FLAT_N : SHARP_N)[((pc % 12) + 12) % 12];
const DEG_PC = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11 };
const DIA_Q = { 1: "", 2: "m", 3: "m", 4: "", 5: "", 6: "m", 7: "dim" };
const PC_DEG = ["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "b7", "7"];
const QMAP = { "": "", M: "", maj: "", m: "m", min: "m", "-": "m", "7": "7", maj7: "maj7", M7: "maj7", ma7: "maj7", "Δ": "maj7", "Δ7": "maj7", m7: "m7", min7: "m7", "-7": "m7", sus: "sus4", sus4: "sus4", sus2: "sus2", "2": "sus2", add9: "add9", add2: "add9", "6": "6", m6: "m6", "9": "9", m9: "m9", maj9: "maj9", "11": "11", "13": "13", dim: "dim", o: "dim", "°": "dim", dim7: "dim7", o7: "dim7", "°7": "dim7", aug: "aug", "+": "aug", m7b5: "m7b5", "ø": "m7b5", "ø7": "m7b5", "7sus4": "7sus4", "7sus": "7sus4", mmaj7: "mmaj7", "m(maj7)": "mmaj7", mM7: "mmaj7", "69": "69", "7b9": "7b9", "7#9": "7#9", aug7: "aug7", "+7": "aug7", madd9: "madd9", "m(add9)": "madd9", m2: "madd9", "5": "5" };
const degPc = (d) => { const m = /^([b#]?)([1-7])$/.exec(d); if (!m) return 0; return (DEG_PC[m[2]] + (m[1] === "b" ? -1 : m[1] === "#" ? 1 : 0) + 12) % 12; };
function parseToken(tok, key) {
  const n = /^([b#]?)([1-7])([^/]*?)(?:\/([b#]?[1-7]))?$/.exec(tok);
  if (n) {
    const raw = n[3]; let q;
    if (raw === "") q = n[1] ? "" : DIA_Q[n[2]]; else if (raw === "M" || raw === "maj") q = ""; else if (raw in QMAP) q = QMAP[raw]; else return null;
    return { d: n[1] + n[2], q, bass: n[4] || null };
  }
  const c = /^([A-G])([#b]?)([^/]*?)(?:\/([A-G][#b]?))?$/.exec(tok);
  if (c) {
    const pc = (PC_OF[c[1] + c[2]] != null ? PC_OF[c[1] + c[2]] : PC_OF[c[1]]); if (pc == null || !(c[3] in QMAP)) return null;
    const rel = (pc - key + 12) % 12; const bassPc = c[4] ? PC_OF[c[4]] : null;
    return { d: PC_DEG[rel], q: QMAP[c[3]], bass: bassPc != null ? PC_DEG[(bassPc - key + 12) % 12] : null };
  }
  return null;
}
const chordNum = (ch) => ch.d + (ch.q === "" ? "" : ch.q) + (ch.bass ? "/" + ch.bass : "");
const chordRoot = (ch, key) => (key + degPc(ch.d)) % 12;
const chordName = (ch, key) => spell(chordRoot(ch, key), key) + ch.q + (ch.bass ? "/" + spell(key + degPc(ch.bass), key) : "");
const SECTION_RE = /^\s*\[(.+?)\]\s*$|^\s*((?:intro|verse|pre-?chorus|chorus|bridge|tag|outro|instrumental|interlude|ending|turnaround|refrain|vamp)\b[^:]*):?\s*$/i;
const IGNORE_TOK = /^(\||\|\||-|–|\(?x\d+\)?|n\.?c\.?|\/|\.|%)$/i;
function lineChords(line, key) {
  const toks = line.trim().split(/\s+/).filter(Boolean); if (!toks.length) return null;
  const out = []; let any = false;
  for (const t of toks) { if (IGNORE_TOK.test(t)) { out.push({ mark: t }); continue; } const ch = parseToken(t, key); if (!ch) return null; out.push(ch); any = true; }
  return any ? out : null;
}
function parseChart(text, key) {
  const sections = []; let cur = null;
  const ensure = (name) => { cur = { name, lines: [] }; sections.push(cur); };
  (text || "").split("\n").forEach((raw) => {
    const line = raw.replace(/\s+$/, ""); if (!line.trim()) return;
    const sm = SECTION_RE.exec(line); if (sm) { ensure((sm[1] || sm[2]).trim()); return; }
    if (!cur) ensure("Song");
    const cs = lineChords(line, key);
    if (cs) cur.lines.push({ chords: cs, lyric: "" });
    else { const last = cur.lines[cur.lines.length - 1]; if (last && !last.lyric && last.chords.length) last.lyric = line.trim(); else cur.lines.push({ chords: [], lyric: line.trim() }); }
  });
  return sections;
}
const convertChart = (text, key, to) => (text || "").split("\n").map((line) => { if (SECTION_RE.test(line)) return line; const cs = lineChords(line, key); if (!cs) return line; return cs.map((c) => (c.mark ? c.mark : to === "names" ? chordName(c, key) : chordNum(c))).join("  "); }).join("\n");
const uniqueChords = (sections) => { const seen = new Map(); sections.forEach((s) => s.lines.forEach((l) => l.chords.forEach((c) => { if (!c.mark && !seen.has(chordNum(c))) seen.set(chordNum(c), c); }))); return [...seen.values()]; };
const firstLineNums = (song) => { const s = parseChart(song.chart, song.key); const l = s.flatMap((x) => x.lines).find((x) => x.chords.length); return l ? l.chords.filter((c) => !c.mark).map(chordNum).join(" ") : ""; };
const strumChord = (ch, key) => { const r = chordRoot(ch, key); const v = chordVoicings(r, ch.q); if (v[0]) strumShape(v[0].frets, "acoustic", v[0].capo); else { const ct = CHORD_TYPES.find((c) => c.id === ch.q) || CHORD_TYPES[0]; AE.chord(ct.iv.map((x) => 48 + r + x), 1.2); } };

const SEED_SONGS = [
  { id: "s-amazing", title: "Amazing Grace", artist: "John Newton (1779) · public domain", key: 7, origKey: 7, bpm: 72, meter: "3/4", setlist: true, by: "Liya Desta",
    chart: "[Verse]\n1  4  1\nAmazing grace, how sweet the sound\n1  5\nThat saved a wretch like me\n1  4  1\nI once was lost, but now am found\n1  5  1\nWas blind, but now I see" },
  { id: "s-template", title: "Example: Saturday opener", artist: "Template — replace with your song", key: 9, origKey: 9, bpm: 76, meter: "4/4", setlist: true, by: "Dawit Alemu",
    chart: "[Intro]\n1  5  6m  4\n[Verse]\n1  5  6m  4\n1  5  4  4\n[Pre-Chorus]\n4  5  6m  5/7\n[Chorus]\n4  1  5  6m\n4  1  5  5\n[Bridge]\n4  6m  5  1/3\n4  6m  5  5\n[Ending]\n4  5  1" },
];
const instFor = (roles) => (roles.includes("keys") ? "keys" : roles.includes("acoustic") || roles.includes("lead") ? "guitar" : roles.includes("bass") ? "bass" : roles.includes("drums") ? "drums" : roles.includes("singer") ? "vocals" : "chart");
const keyLabel = (k) => SONG_KEYS[k];

/* ---------- small pieces ---------- */
function ChordPill({ ch, songKey, mode = "both", big }) {
  const { T } = useApp();
  if (ch.mark) return <span style={{ alignSelf: "center", color: T.faint, fontWeight: 700, fontSize: big ? 22 : 14 }}>{ch.mark}</span>;
  return (
    <button onClick={() => strumChord(ch, songKey)} className="bz-press" style={{ minWidth: big ? 92 : 54, padding: big ? "12px 14px" : "6px 10px", borderRadius: big ? 20 : 14, border: `1.5px solid ${T.border}`, background: T.card, color: T.text, cursor: "pointer", fontFamily: FONT, textAlign: "center" }}>
      {mode !== "nums" && <div style={{ fontWeight: 900, fontSize: big ? 30 : 17, lineHeight: 1.1 }}>{chordName(ch, songKey)}</div>}
      {mode !== "names" && <div style={{ fontWeight: 800, fontSize: mode === "nums" ? (big ? 34 : 18) : big ? 15 : 11.5, color: mode === "nums" ? T.text : ink(T, T.pop), marginTop: mode === "nums" ? 0 : 2 }}>{chordNum(ch)}</div>}
    </button>
  );
}
function SectionBlock({ s, songKey, mode }) {
  const { T } = useApp();
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "inline-block", fontSize: 11, fontWeight: 900, letterSpacing: 1, padding: "3px 10px", borderRadius: 99, background: T.accent, color: T.accentText, marginBottom: 8 }}>{s.name.toUpperCase()}</div>
      {s.lines.map((l, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          {l.chords.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{l.chords.map((c, k) => <ChordPill key={k} ch={c} songKey={songKey} mode={mode} />)}</div>}
          {l.lyric && <div style={{ fontSize: 14.5, marginTop: 4, lineHeight: 1.45 }}>{l.lyric}</div>}
        </div>
      ))}
    </div>
  );
}

/* ---------- instrument views ---------- */
function GuitarView({ chords, songKey }) {
  const { T } = useApp();
  const opts = [{ capo: 0, label: "No capo", shapeKey: songKey }, ...[0, 7, 2, 9, 4].map((sk) => ({ capo: (songKey - sk + 12) % 12, shapeKey: sk })).filter((o) => o.capo > 0 && o.capo <= 7).map((o) => ({ ...o, label: `Capo ${o.capo} · ${SONG_KEYS[o.shapeKey]} shapes` }))].sort((a, b) => a.capo - b.capo);
  const [capo, setCapo] = useState(opts.find((o) => o.capo > 0 && o.capo <= 4) ? opts.find((o) => o.capo > 0 && o.capo <= 4).capo : 0);
  const o = opts.find((x) => x.capo === capo) || opts[0];
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "4px 2px 6px" }}>CAPO</div>
      <Scroller>{opts.map((x) => <Chip key={x.capo} active={x.capo === capo} onClick={() => setCapo(x.capo)}>{x.label}</Chip>)}</Scroller>
      {capo > 0 && <Card tone="soft" style={{ margin: "10px 0", fontSize: 12.5, lineHeight: 1.5 }}>Capo on fret <b>{capo}</b>, then play the shapes of <b>{SONG_KEYS[o.shapeKey]}</b>. It will sound in <b>{SONG_KEYS[songKey]}</b> with the band. Dot numbers = fingers.</Card>}
      {chords.map((ch) => {
        const r = chordRoot(ch, songKey); const shapeRoot = (r - capo + 12) % 12; let vs = chordVoicings(shapeRoot, ch.q);
        if (capo > 0) vs = [...vs.filter((v) => v.cat === "Open"), ...vs.filter((v) => v.cat !== "Open" && v.cat !== "Capo")];
        const shapeName = spell(shapeRoot, o.shapeKey) + ch.q + (ch.bass ? "/" + spell((o.shapeKey + degPc(ch.bass)) % 12, o.shapeKey) : "");
        return (
          <Card key={chordNum(ch)} pad={12} style={{ marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ minWidth: 44, height: 34, padding: "0 8px", borderRadius: 10, background: T.accent, color: T.accentText, display: "grid", placeItems: "center", fontWeight: 900 }}>{chordNum(ch)}</div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 900, fontSize: 18 }}>{capo ? shapeName : chordName(ch, songKey)}</div>{capo > 0 && <div style={{ fontSize: 11.5, color: T.sub }}>sounds {chordName(ch, songKey)}</div>}{ch.bass && <div style={{ fontSize: 11.5, color: T.sub }}>bass note on the lowest string: {capo ? spell((o.shapeKey + degPc(ch.bass)) % 12, o.shapeKey) : spell(songKey + degPc(ch.bass), songKey)}</div>}</div>
              <Btn small variant="soft" icon={Play} onClick={() => strumChord(ch, songKey)}>Hear</Btn>
            </div>
            <div className="bz-noscroll" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {vs.slice(0, 7).map((v, i) => (
                <div key={i} onClick={() => strumShape(v.frets, "acoustic", capo || v.capo)} className="bz-press" style={{ flexShrink: 0, width: 108, padding: "6px 4px", borderRadius: 14, border: `1.5px solid ${i === 0 ? T.accent : T.border}`, textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 0.5, color: T.sub }}>{(i === 0 ? "BEST · " : "") + v.cat.toUpperCase()}</div>
                  <ChordBox frets={v.frets} name={capo ? shapeName : chordName(ch, songKey)} capo={capo || v.capo} width={98} />
                  <div style={{ fontSize: 9, color: T.sub, lineHeight: 1.2 }}>{v.label}</div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
function KeysView({ chords, songKey }) {
  const { T } = useApp(); const [style, setStyle] = useState("smooth");
  const voiced = useMemo(() => { let prev = null; return chords.map((ch) => { const r = chordRoot(ch, songKey); const ct = CHORD_TYPES.find((c) => c.id === ch.q) || CHORD_TYPES[0]; const pcs = ct.iv.map((x) => (r + x) % 12); const rh = style === "smooth" ? voiceLead(prev, pcs) : ct.iv.map((x) => 60 + ((r + 12 - 0) % 12) + x - (r > 6 ? 12 : 0)); prev = rh; const bpc = ch.bass ? (songKey + degPc(ch.bass)) % 12 : r; return { rh, lh: 36 + bpc }; }); }, [chords, songKey, style]);
  return (
    <div>
      <Seg value={style} onChange={setStyle} options={[{ value: "smooth", label: "Smooth (voice-led)" }, { value: "root", label: "Root position" }]} />
      <Card tone="soft" style={{ margin: "10px 0", fontSize: 12.5, lineHeight: 1.5 }}>Right hand = highlighted notes · left hand plays the <b>bass note</b> (orange, low). "Smooth" moves your hand as little as possible between chords — the way pros play worship.</Card>
      {chords.map((ch, i) => (
        <Card key={chordNum(ch)} pad={12} style={{ marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ minWidth: 44, height: 34, padding: "0 8px", borderRadius: 10, background: T.accent, color: T.accentText, display: "grid", placeItems: "center", fontWeight: 900 }}>{chordNum(ch)}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 900, fontSize: 18 }}>{chordName(ch, songKey)}</div><div style={{ fontSize: 11.5, color: T.sub }}>RH: {voiced[i].rh.map((m) => spell(m, songKey)).join(" · ")} · LH: {spell(voiced[i].lh, songKey)}</div></div>
            <Btn small variant="soft" icon={Play} onClick={() => { AE.tone(voiced[i].lh, 1.3, 0, 0.7); AE.chord(voiced[i].rh, 1.3); }}>Hear</Btn>
          </div>
          <Piano start={36} octaves={4} highlight={[...voiced[i].rh, voiced[i].lh]} roots={[voiced[i].lh]} height={74} labels={false} />
        </Card>
      ))}
    </div>
  );
}
function BassView({ chords, songKey }) {
  const { T } = useApp();
  return (
    <div>
      <Card tone="soft" style={{ marginBottom: 10, fontSize: 12.5, lineHeight: 1.5 }}>Play the <b>root</b> (or the note after the slash). Safe extra notes: the <b>5th</b> and the <b>octave</b>. Frets shown on the E and A strings.</Card>
      {chords.map((ch) => { const bpc = ch.bass ? (songKey + degPc(ch.bass)) % 12 : chordRoot(ch, songKey); const fifth = (bpc + 7) % 12; const eF = (bpc - 4 + 12) % 12, aF = (bpc - 9 + 12) % 12;
        return (
          <Card key={chordNum(ch)} pad={12} style={{ marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ minWidth: 44, height: 34, padding: "0 8px", borderRadius: 10, background: T.accent, color: T.accentText, display: "grid", placeItems: "center", fontWeight: 900 }}>{chordNum(ch)}</div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 900, fontSize: 18 }}>{spell(bpc, songKey)} <span style={{ fontSize: 12, color: T.sub, fontWeight: 600 }}>for {chordName(ch, songKey)}</span></div><div style={{ fontSize: 12, color: T.sub }}>E string fret {eF} · A string fret {aF} · 5th = {spell(fifth, songKey)}</div></div>
              <Btn small variant="soft" icon={Play} onClick={() => AE.play("bass", 28 + eF, 1.2, 0, 0.9)}>Hear</Btn>
            </div>
            <div style={{ marginTop: 8 }}><Fretboard tuning={[28, 33, 38, 43]} pcs={[bpc, fifth]} rootPc={bpc} frets={12} /></div>
          </Card>
        ); })}
    </div>
  );
}
function DrumsView({ song, sections }) {
  const { T } = useApp(); const [run, setRun] = useState(false);
  const beats = song.meter === "6/8" ? 6 : song.meter === "3/4" ? 3 : song.meter === "12/8" ? 12 : 4;
  useEffect(() => { if (!run) return; let i = 0; const ms = 60000 / (song.bpm * (song.meter === "6/8" || song.meter === "12/8" ? 3 : 1)); const t = setInterval(() => { AE.click(i % beats === 0); i++; }, ms); return () => clearInterval(t); }, [run, song.bpm, song.meter]); // eslint-disable-line
  const g = GROOVES.filter((x) => x.meter === song.meter);
  return (
    <div>
      <Card tone="hero" style={{ padding: 18, textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1 }}>{song.bpm}<span style={{ fontSize: 16 }}> bpm</span></div>
        <div style={{ fontSize: 14, opacity: 0.9, margin: "6px 0 12px" }}>{song.meter}{song.feel ? ` · ${song.feel}` : ""}</div>
        <Btn variant={run ? "light" : "accent"} icon={run ? Square : Play} onClick={() => setRun((r) => !r)}>{run ? "Stop click" : "Start click"}</Btn>
      </Card>
      <SectionTitle>Song map</SectionTitle>
      <Card pad={10}>{sections.map((s, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 6px", borderTop: i ? `1px solid ${T.border}` : "none", fontSize: 13.5 }}><b>{s.name}</b><span style={{ color: T.sub }}>{s.lines.reduce((n, l) => n + l.chords.filter((c) => !c.mark).length, 0)} chords · {s.lines.filter((l) => l.chords.length).length} lines</span></div>)}</Card>
      {g.length > 0 && <><SectionTitle>Grooves that fit ({song.meter})</SectionTitle><Scroller>{g.map((x) => <Chip key={x.id}>{x.name}</Chip>)}</Scroller></>}
    </div>
  );
}

/* ---------- screens ---------- */
function SongsScreen() {
  const { T, songs, push, user } = useApp(); const [q, setQ] = useState("");
  const list = songs.filter((s) => !q || (s.title + " " + (s.artist || "")).toLowerCase().includes(q.toLowerCase()));
  const set = list.filter((s) => s.setlist); const rest = list.filter((s) => !s.setlist);
  const Row = ({ s }) => (
    <Card onClick={() => push({ screen: "song", id: s.id })} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: T.accent, color: T.accentText, display: "grid", placeItems: "center", flexShrink: 0 }}><div style={{ textAlign: "center", lineHeight: 1 }}><div style={{ fontSize: 9, fontWeight: 800, opacity: 0.8 }}>KEY</div><div style={{ fontWeight: 900, fontSize: 20 }}>{keyLabel(s.key)}</div></div></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 15.5, lineHeight: 1.2 }}>{s.title}</div>
        <div style={{ fontSize: 12, color: T.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.bpm} bpm · {s.meter} · {firstLineNums(s) || "no chords yet"}</div>
      </div>
      <ChevronRight size={18} color={T.sub} />
    </Card>
  );
  return (
    <div>
      <TabHeader title="Songs" sub="Our keys · chords · numbers" />
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "10px 12px" }}><Search size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search songs…" style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", color: T.text, fontFamily: FONT, fontSize: 14 }} /></div>
        <Btn icon={Plus} onClick={() => push({ screen: "songedit" })}>New</Btn>
      </div>
      {set.length > 0 && <><SectionTitle>This Saturday's set</SectionTitle>{set.map((s) => <Row key={s.id} s={s} />)}</>}
      {rest.length > 0 && <><SectionTitle>All songs</SectionTitle>{rest.map((s) => <Row key={s.id} s={s} />)}</>}
      {!list.length && <Card tone="soft" style={{ fontSize: 13 }}>No songs yet — tap <b>New</b> to add the first chart.</Card>}
      <Card tone="soft" style={{ marginTop: 14, fontSize: 12.5, lineHeight: 1.55 }}><b>How it works:</b> once you agree the key with the singer, add the song with its chords. Everyone sees the exact chords for their instrument, every way to play them, and the <b>numbers</b> — so on stage you can call "four!" in the in-ears and the whole band knows the chord, in any key.</Card>
    </div>
  );
}

function ShareSongSheet({ song, open, onClose }) {
  const { T, groups, setChat, user, toast, leader } = useApp();
  const mine = (groups || []).filter((g) => g.everyone || g.members.includes("@me") || leader);
  const sendTo = (gid, withLyrics) => {
    const secs = parseChart(song.chart, song.key);
    const lyr = secs.flatMap((s) => [`[${s.name}]`, ...s.lines.map((l) => l.lyric).filter(Boolean)]).filter((x, i, a) => !(x.startsWith("[") && (!a[i + 1] || a[i + 1].startsWith("[")))).join("\n");
    setChat((c) => ({ ...c, [gid]: [...(c[gid] || []), ...(withLyrics && lyr.trim() ? [{ id: Date.now(), from: user.name, me: true, text: `${song.title} — lyrics\n\n${lyr}`, t: nowHM() }] : []), { id: Date.now() + 1, from: user.name, me: true, song: song.id, text: "", t: nowHM() }] }));
    toast(`Sent to ${(mine.find((g) => g.id === gid) || {}).label || "group"} ✓`); onClose();
  };
  const mus = mine.find((g) => g.id === "musicians");
  return (
    <Sheet open={open} onClose={onClose} title="Send this song">
      {mus && <Btn full variant="accent" icon={Send} onClick={() => sendTo("musicians", false)}>Send chords to 🎸 Musicians</Btn>}
      <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "14px 2px 6px" }}>OR CHOOSE A GROUP</div>
      {mine.map((g) => (
        <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 2px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 22 }}>{g.emoji || "💬"}</div><div style={{ flex: 1, fontWeight: 700 }}>{g.label}</div>
          <Btn small variant="soft" onClick={() => sendTo(g.id, false)}>Chords</Btn>
          <Btn small variant="ghost" onClick={() => sendTo(g.id, true)}>+ Lyrics</Btn>
        </div>
      ))}
    </Sheet>
  );
}

function SongScreen({ id, share: share0 }) {
  const { T, songs, setSongs, user, push, leader } = useApp();
  const song = songs.find((s) => s.id === id);
  const [view, setView] = useState(instFor(user.roles));
  const [mode, setMode] = useState("both");
  const [share, setShare] = useState(!!share0);
  if (!song) return <div><TopBar title="Song not found" /></div>;
  const sections = parseChart(song.chart, song.key); const chords = uniqueChords(sections);
  const setKey = (k) => setSongs((ss) => ss.map((s) => (s.id === id ? { ...s, key: k } : s)));
  return (
    <div>
      <TopBar title={song.title} sub={song.artist || `Added by ${song.by || "the team"}`} right={<Btn small variant="soft" icon={Edit} onClick={() => push({ screen: "songedit", id })}>Edit</Btn>} />
      <Card tone="hero" style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, fontWeight: 800, opacity: 0.8, letterSpacing: 1 }}>OUR KEY</div><div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1 }}>{keyLabel(song.key)}</div></div>
          <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.6, opacity: 0.92 }}>{song.bpm} bpm · {song.meter}<br />Original key {keyLabel(song.origKey != null ? song.origKey : song.key)}{song.origKey != null && song.origKey !== song.key ? ` (${(((song.key - song.origKey + 18) % 12) - 6) > 0 ? "+" : ""}${((song.key - song.origKey + 18) % 12) - 6} semitones)` : ""}<br />{chords.length} chords</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn full variant="accent" icon={Zap} onClick={() => push({ screen: "live", id })}>Live mode</Btn>
          <Btn full variant="light" icon={Send} onClick={() => setShare(true)}>Send to group</Btn>
        </div>
      </Card>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "14px 2px 6px" }}>CHANGE KEY (singer moved it? tap the new key)</div>
      <Scroller>{SONG_KEYS.map((k, i) => <Chip key={k} active={song.key === i} onClick={() => setKey(i)}>{k}{song.origKey === i ? " ★" : ""}</Chip>)}</Scroller>
      <div style={{ margin: "12px 0" }}><Seg value={view} onChange={setView} options={[{ value: "chart", label: "Chart" }, { value: "guitar", label: "Guitar" }, { value: "keys", label: "Keys" }, { value: "bass", label: "Bass" }, { value: "drums", label: "Drums" }, { value: "vocals", label: "Vocals" }]} /></div>
      {view === "chart" && (
        <>
          <Scroller style={{ marginBottom: 10 }}>{[["both", "Chords + numbers"], ["names", "Chords only"], ["nums", "Numbers only"]].map(([v, l]) => <Chip key={v} active={mode === v} onClick={() => setMode(v)}>{l}</Chip>)}</Scroller>
          <Card>{sections.map((s, i) => <SectionBlock key={i} s={s} songKey={song.key} mode={mode} />)}{!sections.length && <div style={{ color: T.sub, fontSize: 13 }}>No chart yet — tap Edit.</div>}</Card>
          <SectionTitle>Chords in this song</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{chords.map((c) => <ChordPill key={chordNum(c)} ch={c} songKey={song.key} />)}</div>
        </>
      )}
      {view === "guitar" && <GuitarView chords={chords} songKey={song.key} />}
      {view === "keys" && <KeysView chords={chords} songKey={song.key} />}
      {view === "bass" && <BassView chords={chords} songKey={song.key} />}
      {view === "drums" && <DrumsView song={song} sections={sections} />}
      {view === "vocals" && (
        <>
          <Card tone="soft" style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5 }}>Key of <b>{keyLabel(song.key)}</b> · home note <b>{spell(song.key, song.key)}</b>{song.startDeg ? <> · first note <b>{spell(song.key + degPc(song.startDeg), song.key)}</b> ({song.startDeg})</> : null}</div>
            <Btn small variant="accent" icon={Volume2} onClick={() => { const w = playKey(keyBase(song.key), "cad"); if (song.startDeg) setTimeout(() => AE.tone(keyBase(song.key) + degPc(song.startDeg), 1.4), w); }}>Hear key</Btn>
          </Card>
          <Card>{sections.map((s, i) => <SectionBlock key={i} s={s} songKey={song.key} mode="names" />)}</Card>
          {song.lyrics && <><SectionTitle>Lyrics (from chat)</SectionTitle><Card style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.6 }}>{song.lyrics}</Card></>}
        </>
      )}
      <ShareSongSheet song={song} open={share} onClose={() => setShare(false)} />
    </div>
  );
}

function SongEditScreen({ id, lyrics: l0 }) {
  const { T, songs, setSongs, user, pop, toast, leader, push } = useApp();
  const ex = songs.find((s) => s.id === id);
  const [f, setF] = useState(() => ex ? { ...ex } : { id: "s" + Date.now(), title: "", artist: "", key: 7, origKey: 7, bpm: 76, meter: "4/4", setlist: true, startDeg: "", chart: "[Verse]\n\n[Chorus]\n", lyrics: l0 || "", by: user.name });
  const [as, setAsRaw] = useState("nums");
  const [draft, setDraft] = useState(null); // text being typed (committed to numbers on blur / switch / save)
  const [sendMus, setSendMus] = useState(!ex);
  const [del, setDel] = useState(false);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const commit = () => { if (draft == null) return f.chart; const c = convertChart(draft, f.key, "nums"); setF((x) => ({ ...x, chart: c })); setDraft(null); return c; };
  const shown = draft != null ? draft : as === "names" ? convertChart(f.chart, f.key, "names") : f.chart;
  const setAs = (v) => { commit(); setAsRaw(v); };
  const setKeyE = (k) => { commit(); set("key", k); };
  const secs = parseChart(draft != null ? convertChart(draft, f.key, "nums") : f.chart, f.key); const n = uniqueChords(secs).length;
  const [bpmTxt, setBpmTxt] = useState(String(f.bpm || 76));
  const bpmCommit = (v) => { const n = Math.max(30, Math.min(240, parseInt(v) || f.bpm || 76)); set("bpm", n); setBpmTxt(String(n)); };
  const taps = useRef([]);
  const tapTempo = () => { const now = performance.now(); taps.current = taps.current.filter((t) => now - t < 3000).concat(now); if (taps.current.length >= 3) { const d = taps.current.slice(1).map((t, i) => t - taps.current[i]); const avg = d.reduce((a, b) => a + b, 0) / d.length; bpmCommit(Math.round(60000 / avg)); } else toast("Keep tapping on the beat…"); };
  const save = () => {
    if (!f.title.trim()) { toast("Give the song a title"); return; }
    const chart = commit();
    const bpm = Math.max(30, Math.min(240, parseInt(bpmTxt) || f.bpm || 76));
    const s = { ...f, bpm, chart, title: f.title.trim(), updated: Date.now() };
    setSongs((ss) => (ss.some((x) => x.id === s.id) ? ss.map((x) => (x.id === s.id ? s : x)) : [s, ...ss]));
    toast(ex ? "Song updated ✓" : "Song added ✓"); pop();
    if (sendMus) setTimeout(() => push({ screen: "song", id: s.id, share: true }), 50);
  };
  const inp = { width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.input, color: T.text, fontFamily: FONT, fontSize: 14, outline: "none" };
  return (
    <div>
      <TopBar title={ex ? "Edit song" : "New song"} sub="Agree the key with the singer, then add the chords" />
      <Card>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, marginBottom: 6 }}>TITLE</div>
        <input value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Song title" style={{ ...inp, fontWeight: 700, fontSize: 16 }} />
        <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "12px 0 6px" }}>ARTIST / NOTES</div>
        <input value={f.artist} onChange={(e) => set("artist", e.target.value)} placeholder="e.g. original artist, who leads it" style={inp} />
        <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "12px 0 6px" }}>OUR KEY (agreed with the singer)</div>
        <Scroller>{SONG_KEYS.map((k, i) => <Chip key={k} active={f.key === i} onClick={() => setKeyE(i)}>{k}</Chip>)}</Scroller>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "12px 0 6px" }}>ORIGINAL KEY</div>
        <Scroller>{SONG_KEYS.map((k, i) => <Chip key={k} active={f.origKey === i} onClick={() => set("origKey", i)}>{k}</Chip>)}</Scroller>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, marginBottom: 6 }}>TEMPO (BPM)</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <Btn small variant="soft" onClick={() => bpmCommit((parseInt(bpmTxt) || f.bpm) - 1)}>−</Btn>
              <input type="text" inputMode="numeric" value={bpmTxt} onChange={(e) => setBpmTxt(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))} onBlur={() => bpmCommit(bpmTxt)} onKeyDown={(e) => e.key === "Enter" && e.target.blur()} placeholder="76" style={{ ...inp, width: 90, flex: "0 0 auto", textAlign: "center", fontSize: 18, fontWeight: 800 }} />
              <Btn small variant="soft" onClick={() => bpmCommit((parseInt(bpmTxt) || f.bpm) + 1)}>+</Btn>
              <Btn small variant="soft" icon={Activity} onClick={tapTempo}>Tap tempo</Btn>
              <span style={{ fontSize: 11.5, color: T.sub }}>{f.bpm < 70 ? "slow · ballad" : f.bpm < 100 ? "mid tempo" : f.bpm < 130 ? "upbeat" : "fast"}</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "12px 0 6px" }}>TIME</div>
        <Scroller>{["4/4", "3/4", "6/8", "12/8"].map((m) => <Chip key={m} active={f.meter === m} onClick={() => set("meter", m)}>{m}</Chip>)}</Scroller>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}><div style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>On this Saturday's set</div><Toggle on={!!f.setlist} onChange={(v) => set("setlist", v)} /></div>
      </Card>
      <SectionTitle>Chords</SectionTitle>
      <Card>
        <Seg value={as} onChange={setAs} options={[{ value: "nums", label: "Write as numbers" }, { value: "names", label: `Write as chords (key ${keyLabel(f.key)})` }]} />
        <textarea value={shown} onChange={(e) => setDraft(e.target.value)} onBlur={commit} rows={12} spellCheck={false} style={{ ...inp, marginTop: 10, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14, lineHeight: 1.6, resize: "vertical" }} />
        <div style={{ fontSize: 11.5, color: T.sub, marginTop: 8, lineHeight: 1.6 }}>
          Sections in brackets: <b>[Verse]</b> <b>[Chorus]</b> <b>[Bridge]</b>. One line of chords, then (optional) the lyric line under it.<br />
          Numbers: <b>1 4 5 6m</b> · slash: <b>5/7</b> · colours: <b>4sus2 1maj7 2m7 b7</b>. Or chord names: <b>G D/F# Em C</b> — they're saved as numbers automatically.
        </div>
        <div style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, color: n ? T.good : T.sub }}>{n ? `✓ ${secs.length} sections · ${n} different chords recognised` : "No chords recognised yet"}</div>
      </Card>
      <SectionTitle>Lyrics (paste from the chat)</SectionTitle>
      <Card><textarea value={f.lyrics} onChange={(e) => set("lyrics", e.target.value)} rows={6} placeholder="Paste the lyrics the singer sent…" style={{ ...inp, resize: "vertical", lineHeight: 1.5 }} /></Card>
      <Card style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}><div style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>Send the chords to the 🎸 Musicians group after saving</div><Toggle on={sendMus} onChange={setSendMus} /></Card>
      <Btn full style={{ marginTop: 14 }} variant="accent" icon={Check} onClick={save}>{ex ? "Save changes" : "Add song"}</Btn>
      {ex && (leader || ex.by === user.name) && (!del ? <Btn full style={{ marginTop: 10 }} variant="ghost" icon={Trash} onClick={() => setDel(true)}>Delete song</Btn> : <Btn full style={{ marginTop: 10 }} variant="danger" icon={Trash} onClick={() => { setSongs((ss) => ss.filter((x) => x.id !== ex.id)); pop(); setTimeout(pop, 30); }}>Tap again to delete for everyone</Btn>)}
    </div>
  );
}

function LiveScreen({ id }) {
  const { T, songs } = useApp(); const song = songs.find((s) => s.id === id);
  const [si, setSi] = useState(0); const [mode, setMode] = useState("both");
  if (!song) return null;
  const secs = parseChart(song.chart, song.key); const s = secs[si] || { name: "", lines: [] }; const nx = secs[si + 1];
  return (
    <div>
      <TopBar title={song.title} sub={`Key ${keyLabel(song.key)} · ${song.bpm} bpm · ${song.meter} · LIVE`} />
      <Scroller style={{ marginBottom: 10 }}>{[["both", "Chords + numbers"], ["nums", "Numbers (for calling)"], ["names", "Chords"]].map(([v, l]) => <Chip key={v} active={mode === v} onClick={() => setMode(v)}>{l}</Chip>)}</Scroller>
      <Scroller style={{ marginBottom: 12 }}>{secs.map((x, i) => <Chip key={i} active={i === si} onClick={() => setSi(i)}>{x.name}</Chip>)}</Scroller>
      <Card tone="hero" style={{ padding: 18, minHeight: 300 }}>
        <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 2, opacity: 0.85 }}>{s.name.toUpperCase()}</div>
        {s.lines.map((l, i) => (
          <div key={i} style={{ marginTop: 14 }}>
            {l.chords.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{l.chords.map((c, k) => <ChordPill key={k} ch={c} songKey={song.key} mode={mode} big />)}</div>}
            {l.lyric && <div style={{ fontSize: 16, marginTop: 6, opacity: 0.92 }}>{l.lyric}</div>}
          </div>
        ))}
      </Card>
      {nx && <Card tone="soft" style={{ marginTop: 10, fontSize: 13 }}>Next: <b>{nx.name}</b> — {nx.lines.flatMap((l) => l.chords).filter((c) => !c.mark).slice(0, 8).map((c) => (mode === "names" ? chordName(c, song.key) : chordNum(c))).join("  ")}</Card>}
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <Btn full variant="soft" icon={ChevronLeft} disabled={si === 0} onClick={() => setSi((x) => Math.max(0, x - 1))}>Back</Btn>
        <Btn full variant="accent" icon={ChevronRight} disabled={si >= secs.length - 1} onClick={() => setSi((x) => Math.min(secs.length - 1, x + 1))}>{nx ? nx.name : "End"}</Btn>
      </div>
    </div>
  );
}

/* song card inside the chat */
function ChatSongCard({ id }) {
  const { T, songs, push } = useApp(); const s = songs.find((x) => x.id === id);
  if (!s) return <div style={{ fontSize: 13, opacity: 0.8 }}>🎵 Song no longer available</div>;
  return (
    <div onClick={(e) => { e.stopPropagation(); push({ screen: "song", id }); }} style={{ cursor: "pointer", minWidth: 200 }}>
      <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: 1, opacity: 0.75 }}>🎵 CHORD CHART</div>
      <div style={{ fontWeight: 900, fontSize: 16, margin: "2px 0" }}>{s.title}</div>
      <div style={{ fontSize: 12.5 }}>Key <b>{keyLabel(s.key)}</b> · {s.bpm} bpm · {s.meter}</div>
      <div style={{ fontSize: 12.5, marginTop: 4, fontFamily: "ui-monospace, Menlo, monospace" }}>{firstLineNums(s)}</div>
      <div style={{ marginTop: 8, fontSize: 12, fontWeight: 800, textDecoration: "underline" }}>Open chart →</div>
    </div>
  );
}
