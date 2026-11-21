/* =====================================================================
   BEZA YOUTH WORSHIP TEAM — app (v1.3.0)
   Youth worship team training app: Singers · Musicians · Sound
   ===================================================================== */

/* ---------------------------- MUSIC THEORY ---------------------------- */
const NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const nn = (m) => NOTE_NAMES[((Math.round(m) % 12) + 12) % 12];
const nnOct = (m) => nn(m) + (Math.floor(Math.round(m) / 12) - 1);
const mtof = (m, a4 = 440) => a4 * Math.pow(2, (m - 69) / 12);
const ftom = (f, a4 = 440) => 69 + 12 * Math.log2(f / a4);
const to12 = (hm) => { if (typeof hm !== "string") return hm; const m = hm.match(/^(\d{1,2}):(\d{2})$/); if (!m) return hm; let h = +m[1]; const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return `${h}:${m[2]} ${ap}`; };
const nowHM = () => { const d = new Date(); return to12(`${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`); };
const DEG_LABEL = ["1", "b2", "2", "b3", "3", "4", "#4/b5", "5", "b6", "6", "b7", "7"];

const SCALE_GROUPS = [
  {
    id: "western", name: "Western", items: [
      { id: "major", name: "Major", steps: [0, 2, 4, 5, 7, 9, 11], feel: "Bright and joyful. Most worship songs live here — learn this one first." },
      { id: "minor", name: "Natural Minor", steps: [0, 2, 3, 5, 7, 8, 10], feel: "Deep and reflective. Great for songs of surrender and lament." },
      { id: "harm", name: "Harmonic Minor", steps: [0, 2, 3, 5, 7, 8, 11], feel: "Minor with a raised 7th — dramatic, almost Middle-Eastern colour." },
      { id: "mel", name: "Melodic Minor", steps: [0, 2, 3, 5, 7, 9, 11], feel: "Smooth minor used for gospel and jazz runs." },
      { id: "pmaj", name: "Major Pentatonic", steps: [0, 2, 4, 7, 9], feel: "Five 'safe' notes. Perfect for ad-libs and vocal runs." },
      { id: "pmin", name: "Minor Pentatonic", steps: [0, 3, 5, 7, 10], feel: "Soulful home base for lead guitar and gospel licks." },
      { id: "blues", name: "Blues", steps: [0, 3, 5, 6, 7, 10], feel: "Minor pentatonic + the 'blue note' (b5). Gospel flavour." },
    ]
  },
  {
    id: "modes", name: "Modes", items: [
      { id: "ion", name: "Ionian", steps: [0, 2, 4, 5, 7, 9, 11], feel: "Mode 1 = the major scale. Happy, resolved." },
      { id: "dor", name: "Dorian", steps: [0, 2, 3, 5, 7, 9, 10], feel: "Minor with a bright 6th. Hopeful minor — great over 'ii' chords." },
      { id: "phr", name: "Phrygian", steps: [0, 1, 3, 5, 7, 8, 10], feel: "Dark, Spanish/Eastern feel thanks to the b2." },
      { id: "lyd", name: "Lydian", steps: [0, 2, 4, 6, 7, 9, 11], feel: "Dreamy, floating — the #4 makes pads feel heavenly." },
      { id: "mix", name: "Mixolydian", steps: [0, 2, 4, 5, 7, 9, 10], feel: "Major with a b7. Rock/gospel energy — the 'V' chord sound." },
      { id: "aeo", name: "Aeolian", steps: [0, 2, 3, 5, 7, 8, 10], feel: "Mode 6 = natural minor." },
      { id: "loc", name: "Locrian", steps: [0, 1, 3, 5, 6, 8, 10], feel: "Unstable and tense — mostly heard over the vii° chord." },
    ]
  },
  {
    id: "colour", name: "Gospel, Jazz & World", items: [
      { id: "mblues", name: "Major Blues", steps: [0, 2, 3, 4, 7, 9], feel: "Major pentatonic + the b3 'slide' note. Classic gospel runs." },
      { id: "hmaj", name: "Harmonic Major", steps: [0, 2, 4, 5, 7, 8, 11], feel: "Major with a b6 — bittersweet, cinematic." },
      { id: "phrd", name: "Phrygian Dominant", steps: [0, 1, 4, 5, 7, 8, 10], feel: "Mode 5 of harmonic minor. Middle-Eastern, intense." },
      { id: "lydd", name: "Lydian Dominant", steps: [0, 2, 4, 6, 7, 9, 10], feel: "Bright #4 + b7 — the sound over a 7(#11) chord." },
      { id: "alt", name: "Altered", steps: [0, 1, 3, 4, 6, 8, 10], feel: "Every tension at once. Jazz/gospel V7alt runs." },
      { id: "whole", name: "Whole Tone", steps: [0, 2, 4, 6, 8, 10], feel: "All whole steps — dreamy, floating, no home." },
      { id: "dimhw", name: "Diminished (H-W)", steps: [0, 1, 3, 4, 6, 7, 9, 10], feel: "Half-whole pattern. Used over dominant 7(b9) chords." },
      { id: "dimwh", name: "Diminished (W-H)", steps: [0, 2, 3, 5, 6, 8, 9, 11], feel: "Whole-half pattern. Used over dim7 chords." },
      { id: "bebop", name: "Bebop Dominant", steps: [0, 2, 4, 5, 7, 9, 10, 11], feel: "Mixolydian + a passing major 7 so runs land on beats." },
      { id: "hung", name: "Hungarian Minor", steps: [0, 2, 3, 6, 7, 8, 11], feel: "Two augmented steps — dramatic and exotic." },
      { id: "hira", name: "Hirajoshi", steps: [0, 2, 3, 7, 8], feel: "Japanese pentatonic — still and haunting." },
      { id: "chrom", name: "Chromatic", steps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], feel: "All 12 notes. Finger and pitch accuracy workout." },
    ]
  },
  {
    id: "ethiopian", name: "Ethiopian Qenet", items: [
      { id: "tizM", name: "Tizita Major", steps: [0, 2, 4, 7, 9], feel: "'Memory / longing'. Warm and nostalgic — heard everywhere in Mezmur." },
      { id: "tizm", name: "Tizita Minor", steps: [0, 2, 3, 7, 8], feel: "The minor Tizita. Tender, heartfelt — perfect for slow worship." },
      { id: "batM", name: "Bati Major", steps: [0, 4, 5, 7, 11], feel: "Bright and proud, with a leading-tone pull back home." },
      { id: "batm", name: "Bati Minor", steps: [0, 3, 5, 7, 10], feel: "Same notes as minor pentatonic — strong and soulful." },
      { id: "amb", name: "Ambassel", steps: [0, 1, 5, 7, 8], feel: "Ancient, prayerful feel from the b2 and b6." },
      { id: "anc", name: "Anchihoye", steps: [0, 1, 5, 6, 9], feel: "The most exotic qenet — mysterious and intense." },
    ]
  },
];
const ALL_SCALES = SCALE_GROUPS.flatMap((g) => g.items);

const CHORD_TYPES = [
  { id: "", name: "Major", iv: [0, 4, 7], f: "1 3 5" },
  { id: "m", name: "Minor", iv: [0, 3, 7], f: "1 b3 5" },
  { id: "dim", name: "Dim", iv: [0, 3, 6], f: "1 b3 b5" },
  { id: "aug", name: "Aug", iv: [0, 4, 8], f: "1 3 #5" },
  { id: "sus2", name: "Sus2", iv: [0, 2, 7], f: "1 2 5" },
  { id: "sus4", name: "Sus4", iv: [0, 5, 7], f: "1 4 5" },
  { id: "6", name: "6", iv: [0, 4, 7, 9], f: "1 3 5 6" },
  { id: "m6", name: "m6", iv: [0, 3, 7, 9], f: "1 b3 5 6" },
  { id: "7", name: "Dom 7", iv: [0, 4, 7, 10], f: "1 3 5 b7" },
  { id: "maj7", name: "Maj7", iv: [0, 4, 7, 11], f: "1 3 5 7" },
  { id: "m7", name: "m7", iv: [0, 3, 7, 10], f: "1 b3 5 b7" },
  { id: "m7b5", name: "m7b5", iv: [0, 3, 6, 10], f: "1 b3 b5 b7" },
  { id: "dim7", name: "Dim7", iv: [0, 3, 6, 9], f: "1 b3 b5 bb7" },
  { id: "add9", name: "Add9", iv: [0, 4, 7, 14], f: "1 3 5 9" },
  { id: "9", name: "9", iv: [0, 4, 7, 10, 14], f: "1 3 5 b7 9" },
  { id: "maj9", name: "Maj9", iv: [0, 4, 7, 11, 14], f: "1 3 5 7 9" },
  { id: "m9", name: "m9", iv: [0, 3, 7, 10, 14], f: "1 b3 5 b7 9" },
  { id: "11", name: "11", iv: [0, 7, 10, 14, 17], f: "1 5 b7 9 11" },
  { id: "13", name: "13", iv: [0, 4, 10, 14, 21], f: "1 3 b7 9 13" }, { id: "7sus4", name: "7sus4", iv: [0, 5, 7, 10] }, { id: "mmaj7", name: "m(maj7)", iv: [0, 3, 7, 11] }, { id: "69", name: "6/9", iv: [0, 4, 7, 9, 14] }, { id: "7b9", name: "7♭9", iv: [0, 4, 7, 10, 13] }, { id: "7#9", name: "7♯9", iv: [0, 4, 7, 10, 15] }, { id: "aug7", name: "Aug7", iv: [0, 4, 8, 10] }, { id: "madd9", name: "m(add9)", iv: [0, 3, 7, 14] }, { id: "5", name: "Power (5)", iv: [0, 7] },
];

function voiceChord(root, iv, inv, voicing) {
  let notes = iv.map((i) => root + i);
  for (let k = 0; k < inv; k++) { const n = notes.shift(); notes.push(n + 12); }
  notes.sort((a, b) => a - b);
  if (voicing === "open") {
    if (notes.length >= 4) { const i = notes.length - 2; notes[i] -= 12; }
    else if (notes.length === 3) { notes = [notes[0], notes[2], notes[1] + 12]; }
    notes.sort((a, b) => a - b);
  }
  if (voicing === "spread") notes = [notes[0] - 12, ...notes];
  return notes;
}

const DIATONIC = { degs: [0, 2, 4, 5, 7, 9, 11], q: ["", "m", "m", "", "", "m", "dim"], roman: ["I", "ii", "iii", "IV", "V", "vi", "vii°"] };

/* Guitar shapes: strings low E → high e. -1 = muted */
const OPEN_SHAPES = {
  "C": [-1, 3, 2, 0, 1, 0], "D": [-1, -1, 0, 2, 3, 2], "E": [0, 2, 2, 1, 0, 0], "G": [3, 2, 0, 0, 0, 3], "A": [-1, 0, 2, 2, 2, 0],
  "Am": [-1, 0, 2, 2, 1, 0], "Em": [0, 2, 2, 0, 0, 0], "Dm": [-1, -1, 0, 2, 3, 1],
  "C7": [-1, 3, 2, 3, 1, 0], "D7": [-1, -1, 0, 2, 1, 2], "E7": [0, 2, 0, 1, 0, 0], "G7": [3, 2, 0, 0, 0, 1], "A7": [-1, 0, 2, 0, 2, 0], "B7": [-1, 2, 1, 2, 0, 2],
  "Cmaj7": [-1, 3, 2, 0, 0, 0], "Dmaj7": [-1, -1, 0, 2, 2, 2], "Gmaj7": [3, 2, 0, 0, 0, 2], "Amaj7": [-1, 0, 2, 1, 2, 0], "Fmaj7": [-1, -1, 3, 2, 1, 0], "Emaj7": [0, 2, 1, 1, 0, 0],
  "Am7": [-1, 0, 2, 0, 1, 0], "Em7": [0, 2, 0, 0, 0, 0], "Dm7": [-1, -1, 0, 2, 1, 1],
  "Dsus2": [-1, -1, 0, 2, 3, 0], "Dsus4": [-1, -1, 0, 2, 3, 3], "Asus2": [-1, 0, 2, 2, 0, 0], "Asus4": [-1, 0, 2, 2, 3, 0], "Esus4": [0, 2, 2, 2, 0, 0], "Csus2": [-1, 3, 0, 0, 1, 3],
  "Cadd9": [-1, 3, 2, 0, 3, 0], "Gadd9": [3, 2, 0, 2, 0, 3], "A6": [-1, 0, 2, 2, 2, 2], "Am6": [-1, 0, 2, 2, 1, 2],
};
const E_SHAPES = { "": [0, 2, 2, 1, 0, 0], "m": [0, 2, 2, 0, 0, 0], "7": [0, 2, 0, 1, 0, 0], "m7": [0, 2, 0, 0, 0, 0], "sus4": [0, 2, 2, 2, 0, 0] };
const A_SHAPES = {
  "": [-1, 0, 2, 2, 2, 0], "m": [-1, 0, 2, 2, 1, 0], "7": [-1, 0, 2, 0, 2, 0], "m7": [-1, 0, 2, 0, 1, 0], "maj7": [-1, 0, 2, 1, 2, 0],
  "sus2": [-1, 0, 2, 2, 0, 0], "sus4": [-1, 0, 2, 2, 3, 0], "dim": [-1, 0, 1, 2, 1, -1], "m7b5": [-1, 0, 1, 0, 1, -1], "dim7": [-1, 0, 1, 2, 1, 2],
  "aug": [-1, 0, 3, 2, 2, -1], "6": [-1, 0, 2, 2, 2, 2], "m6": [-1, 0, 2, 2, 1, 2], "9": [-1, 0, -1, 0, 0, 0], "m9": [-1, 0, -2, 0, 0, 0], "maj9": [-1, 0, -1, 1, 0, 0],
};
const GUITAR_TUNING = [40, 45, 50, 55, 59, 64];
const BASS_TUNING = [28, 33, 38, 43];

function guitarShape(root, q) {
  const name = nn(root) + q;
  if (OPEN_SHAPES[name]) return { frets: OPEN_SHAPES[name], label: "Open shape" };
  const opts = [];
  if (E_SHAPES[q]) { let f = (root - 4 + 12) % 12; if (f === 0) f = 12; opts.push({ base: f, t: E_SHAPES[q], label: "E-shape barre" }); }
  if (A_SHAPES[q]) {
    let f = (root - 9 + 12) % 12; const minOff = Math.min(...A_SHAPES[q].filter((x) => x !== -1));
    if (f + minOff < 1) f += 12; if (f === 0) f = 12; opts.push({ base: f, t: A_SHAPES[q], label: "A-shape barre" });
  }
  if (!opts.length) return null;
  opts.sort((a, b) => a.base - b.base);
  const o = opts[0];
  return { frets: o.t.map((x) => (x === -1 ? -1 : x + o.base)), label: o.label };
}

/* ------------------------------ AUDIO ENGINE (real samples) ------------------------------ */
const SAMPLE_SETS = {
  piano: { dir: "piano", notes: ["A1", "C2", "Ds2", "Fs2", "A2", "C3", "Ds3", "Fs3", "A3", "C4", "Ds4", "Fs4", "A4", "C5", "Ds5", "Fs5", "A5", "C6", "Ds6", "Fs6", "A6", "C7"], rel: 1.1 },
  acoustic: { dir: "acoustic", notes: ["E2", "G2", "As2", "Cs3", "E3", "G3", "As3", "Cs4", "E4", "G4", "As4", "Cs5"], rel: 0.9 },
  electric: { dir: "electric", notes: ["Cs2", "E2", "Fs2", "A2", "C3", "Ds3", "Fs3", "A3", "C4", "Ds4", "Fs4", "A4", "C5", "Ds5", "Fs5", "A5", "C6"], rel: 0.7 },
  bass: { dir: "bass", notes: ["E1", "G1", "As1", "Cs2", "E2", "G2", "As2", "Cs3", "E3", "G3"], rel: 0.35 },
};
const DRUM_FILES = ["kick", "snare", "hihat", "tom1", "tom2", "tom3"];
const sampleMidi = (n) => { const m = n.match(/^([A-G])(s?)(\d)$/); return (parseInt(m[3]) + 1) * 12 + { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] ? 1 : 0); };

/* every delayed callback remembers when it was scheduled, so AE.stopAll() can silence notes queued before it */
(() => { try { if (window.__bzSTpatched) return; window.__bzSTpatched = true; const _st = window.setTimeout.bind(window);
  window.setTimeout = function (fn, ms, ...a) { if (typeof fn !== "function") return _st(fn, ms, ...a); const born = window.__bzCbBorn != null ? window.__bzCbBorn : performance.now(); return _st(function () { const prev = window.__bzCbBorn; window.__bzCbBorn = born; try { return fn.apply(this, a); } finally { window.__bzCbBorn = prev; } }, ms); };
} catch (e) { } })();
const AE = (() => {
  let ctx = null, master = null, noiseBuf = null, pinkBuf = null;
  const settings = { a4: 440, click: "click" };
  const banks = {}; const loading = {}; const drums = {}; let drumsLoading = null;
  const active = new Set();
  const listeners = new Set();
  const micErr = (e) => {
    const n = (e && e.name) || ""; const inFrame = window.self !== window.top;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return "This browser can't use the microphone. Open the app in Chrome (Android/computer) or Safari (iPhone).";
    if (inFrame) return "The microphone is blocked in this preview. Open the real website: beza-youth.web.app";
    if (n === "NotAllowedError" || n === "SecurityError") return "Microphone access is blocked. Tap the 🔒 (or ⓘ) next to the web address → Permissions → Microphone → Allow, then try again. On a computer also check your system's privacy settings.";
    if (n === "NotFoundError" || n === "OverconstrainedError") return "No microphone found. Plug in or turn on a mic and try again.";
    if (n === "NotReadableError") return "Another app is using the microphone (Zoom, WhatsApp call…). Close it and try again.";
    return "Couldn't start the microphone (" + (n || "error") + "). Reload the page and try again.";
  };
  const listen = (an) => { try { const z = ctx.createGain(); z.gain.value = 0; an.connect(z); z.connect(ctx.destination); } catch (e) { } };
  const get = () => {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      ctx = new C(); master = ctx.createGain(); master.gain.value = 0.9;
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -6; comp.ratio.value = 4;
      master.connect(comp); comp.connect(ctx.destination);
      load("piano"); loadDrums();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  const out = () => { get(); return master; };
  const b64Buf = (b64) => { const bin = atob(b64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Promise((res, rej) => ctx.decodeAudioData(u.buffer, res, rej)); };
  const embedded = (inst, n) => (typeof window !== "undefined" && window.BEZA_SAMPLES && window.BEZA_SAMPLES[inst] && window.BEZA_SAMPLES[inst][n]) || null;
  const getBuf = (inst, dir, n) => { const e = embedded(inst, n); return e ? b64Buf(e).catch(() => fetchBuf(`assets/${dir}/${n}.mp3`)) : fetchBuf(`assets/${dir}/${n}.mp3`); };
  const fetchBuf = async (url) => { const r = await fetch(url); if (!r.ok) throw new Error(url); const ab = await r.arrayBuffer(); return await new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)); };
  function load(inst) {
    get(); if (banks[inst] || loading[inst]) return loading[inst];
    const set = SAMPLE_SETS[inst];
    loading[inst] = Promise.all(set.notes.map((n) => getBuf(inst, set.dir, n).then((b) => [sampleMidi(n), b]).catch(() => null)))
      .then((arr) => { const ok = arr.filter(Boolean); if (ok.length) banks[inst] = ok.sort((a, b) => a[0] - b[0]); listeners.forEach((f) => f()); return banks[inst]; });
    return loading[inst];
  }
  function loadDrums() {
    if (drumsLoading) return drumsLoading;
    drumsLoading = Promise.all(DRUM_FILES.map((n) => getBuf("drums", "drums", n).then((b) => { drums[n] = b; }).catch(() => null))).then(() => listeners.forEach((f) => f()));
    return drumsLoading;
  }
  const isReady = (inst) => (inst === "drums" ? !!drums.kick : !!banks[inst]);
  const onReady = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
  const track = (src) => { active.add(src); src.onended = () => active.delete(src); };
  /* stop everything now — with a tiny fade so there's no click — and silence any delayed notes that were queued before */
  let stopStamp = 0; const noteSubs = new Set();
  function stopAll() {
    stopStamp = performance.now(); window.__bzStopStamp = stopStamp;
    try { if (ctx && master) { const t = ctx.currentTime; master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(0.0001, t + 0.05); setTimeout(() => { active.forEach((s) => { try { s.stop(); } catch (e) { } }); active.clear(); try { const t2 = ctx.currentTime; master.gain.cancelScheduledValues(t2); master.gain.setValueAtTime(0.9, t2); } catch (e) { } }, 70); } else { active.forEach((s) => { try { s.stop(); } catch (e) { } }); active.clear(); } } catch (e) { }
    noteSubs.forEach((f) => { try { f(null); } catch (e) { } });
  }
  const stale = () => window.__bzCbBorn != null && window.__bzCbBorn < stopStamp;
  const onNote = (f) => { noteSubs.add(f); return () => noteSubs.delete(f); };
  const emitNote = (midi, when, dur) => { if (noteSubs.size) noteSubs.forEach((f) => { try { f({ midi, when, dur }); } catch (e) { } }); };
  function synthTone(midi, dur, t, vel, dest) {
    const c = ctx; const f = mtof(midi, settings.a4); const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vel * 0.32, t + 0.008);
    g.gain.exponentialRampToValueAtTime(vel * 0.12, t + 0.28); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.35);
    const o1 = c.createOscillator(); o1.type = "triangle"; o1.frequency.value = f;
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = Math.min(9000, f * 7);
    o1.connect(lp); lp.connect(g); g.connect(dest || master); o1.start(t); o1.stop(t + dur + 0.4); track(o1);
  }
  function play(inst, midi, dur = 0.8, when = 0, vel = 0.75, dest, pan = 0) {
    if (stale()) return;
    const c = get(); const t = c.currentTime + when; const bank = banks[inst];
    if (!bank) {
      const asked = c.currentTime; const pr = loading[inst] || load(inst);
      pr.then(() => { if (stopStamp > 0 && performance.now() - stopStamp < (c.currentTime - asked) * 1000 + 50) return; if (banks[inst] && c.currentTime - asked < 4) play(inst, midi, dur, Math.max(0, when - (c.currentTime - asked)), vel, dest, pan); else if (!banks[inst]) { if (!dest) emitNote(midi, 0, dur); synthTone(midi, dur, c.currentTime + 0.01, vel, dest); } });
      return;
    }
    if (!dest) emitNote(midi, when, dur);
    let best = bank[0]; for (const b of bank) if (Math.abs(b[0] - midi) < Math.abs(best[0] - midi)) best = b;
    const src = c.createBufferSource(); src.buffer = best[1];
    src.playbackRate.value = Math.pow(2, (midi - best[0]) / 12) * (settings.a4 / 440);
    const g = c.createGain(); const rel = SAMPLE_SETS[inst].rel; const v = Math.max(0.05, vel);
    g.gain.setValueAtTime(v, t); g.gain.setValueAtTime(v, t + dur); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + rel);
    let node = g; if (pan) { const p = c.createStereoPanner(); p.pan.value = pan; g.connect(p); node = p; }
    src.connect(g); node.connect(dest || master); src.start(t); src.stop(t + dur + rel + 0.05); track(src);
  }
  const tone = (midi, dur = 0.8, when = 0, vel = 0.75, dest) => play("piano", midi, dur, when, vel, dest);
  function chord(notes, dur = 1.2, strum = 0, inst = "piano", dest) { notes.forEach((n, i) => play(inst, n, dur, i * strum, 0.6, dest)); }
  function strum(notes, dir = "down", when = 0, vel = 0.7, inst = "acoustic", dur = 1.4, dest) {
    const ord = dir === "down" ? notes : [...notes].reverse();
    ord.forEach((n, i) => play(inst, n, dur, when + i * (dir === "down" ? 0.014 : 0.011), vel * (dir === "up" ? 0.8 : 1), dest));
  }
  function hit(name, when = 0, vel = 0.9, dest, pan = 0, rate = 1, len) {
    const c = get(); const t = c.currentTime + when; const b = drums[name];
    if (!b) { const asked = c.currentTime; loadDrums().then(() => { if (drums[name] && c.currentTime - asked < 1) hit(name, 0, vel, dest, pan, rate, len); else if (!drums[name]) { if (name === "kick") synthKick(c.currentTime); else if (name === "snare") synthSnare(c.currentTime); else synthHat(c.currentTime, false); } }); return; }
    const src = c.createBufferSource(); src.buffer = b; src.playbackRate.value = rate; const g = c.createGain(); g.gain.value = vel;
    if (len) { g.gain.setValueAtTime(vel, t + len * 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + len); }
    let node = g; if (pan) { const p = c.createStereoPanner(); p.pan.value = pan; g.connect(p); node = p; }
    src.connect(g); node.connect(dest || master); src.start(t); track(src);
  }
  const noise = () => {
    const c = get();
    if (!noiseBuf) { noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    return noiseBuf;
  };
  const pink = () => {
    const c = get();
    if (!pinkBuf) {
      pinkBuf = c.createBuffer(1, c.sampleRate * 3, c.sampleRate); const d = pinkBuf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < d.length; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      }
    }
    return pinkBuf;
  };
  function synthKick(t) { const c = ctx; const o = c.createOscillator(); const g = c.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14); g.gain.setValueAtTime(1, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32); o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.35); }
  function synthSnare(t) { const c = ctx; const s = c.createBufferSource(); s.buffer = noise(); const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1300; const g = c.createGain(); g.gain.setValueAtTime(0.55, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18); s.connect(hp); hp.connect(g); g.connect(master); s.start(t); s.stop(t + 0.2); }
  function synthHat(t, open) { const c = ctx; const s = c.createBufferSource(); s.buffer = noise(); const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7500; const g = c.createGain(); const d = open ? 0.28 : 0.05; g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); s.connect(hp); hp.connect(g); g.connect(master); s.start(t); s.stop(t + d + 0.02); }
  function click(accent = false, when = 0) {
    const c = get(); const t = c.currentTime + when; const o = c.createOscillator(); const g = c.createGain();
    if (settings.click === "wood") { o.type = "square"; o.frequency.value = accent ? 1250 : 820; }
    else if (settings.click === "beep") { o.type = "sine"; o.frequency.value = accent ? 1760 : 880; }
    else { o.type = "sine"; o.frequency.value = accent ? 1600 : 1000; }
    g.gain.setValueAtTime(accent ? 0.55 : 0.32, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.08);
  }
  const kick = (when = 0, v = 1) => hit("kick", when, v);
  const snare = (when = 0, v = 0.85, pan = 0) => hit("snare", when, v, undefined, pan);
  const hat = (when = 0, open = false, v = 0.5) => hit("hihat", when, open ? v * 0.9 : v, undefined, 0, open ? 0.92 : 1.08, open ? 0.45 : 0.09);
  const tom = (when = 0, which = 1, v = 0.85) => hit("tom" + which, when, v);
  function glide(fromM, toM, dur = 2) {
    // real piano guide: start note, a quick run up to the top note, then back down
    const steps = Math.max(1, Math.abs(toM - fromM)); const dir = toM > fromM ? 1 : -1; const half = dur / 2;
    const pts = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(fromM + dir * steps * f));
    pts.forEach((m, i) => play("piano", m, i === 4 ? half * 0.9 : 0.35, (i / 4) * half * 0.55, i === 0 || i === 4 ? 0.7 : 0.4));
    [...pts].reverse().slice(1).forEach((m, i) => play("piano", m, i === 3 ? 0.9 : 0.35, half + ((i + 1) / 4) * half * 0.55, i === 3 ? 0.65 : 0.38));
  }
  function drone(midi, dest) {
    let on = true; const hitDrone = () => { if (!on) return; play("piano", midi - 12, 2.6, 0, 0.45, dest); play("piano", midi - 5, 2.6, 0, 0.3, dest); play("piano", midi, 2.6, 0, 0.3, dest); };
    hitDrone(); const iv = setInterval(hitDrone, 2600);
    return () => { on = false; clearInterval(iv); };
  }
  const preloadAll = () => { get(); ["piano", "acoustic", "electric", "bass"].forEach(load); loadDrums(); };
  async function decodeFile(file) { const c = get(); const ab = await file.arrayBuffer(); return await new Promise((res, rej) => c.decodeAudioData(ab, res, rej)); }
  return { onNote, micErr, listen, preloadAll, get, out, noise, pink, play, tone, chord, strum, hit, click, kick, snare, hat, tom, glide, drone, load, loadDrums, isReady, onReady, stopAll, decodeFile, settings, bank: (i) => banks[i], drumBuf: (n) => drums[n] };
})();
function useSamples(inst) {
  const [ready, setReady] = useState(() => AE.isReady(inst));
  useEffect(() => { const off = AE.onReady(() => setReady(AE.isReady(inst))); return off; }, [inst]);
  return ready;
}

/* ------------------------------- MIDI + PC KEYS ------------------------------- */
const midiListeners = new Set();
const midiState = { inputs: [], connected: false, error: "" };
async function connectMidi() {
  if (!navigator.requestMIDIAccess) throw new Error("This browser has no Web MIDI. Use Chrome / Edge on PC or Android. On iPhone, the installed app adds MIDI support.");
  const access = await navigator.requestMIDIAccess();
  const bind = () => {
    midiState.inputs = [];
    access.inputs.forEach((inp) => {
      midiState.inputs.push(inp.name || "MIDI device");
      inp.onmidimessage = (e) => {
        const [s, n, v] = e.data; const cmd = s & 0xf0;
        if (cmd === 0x90 && v > 0) midiListeners.forEach((fn) => fn(n, v / 127));
      };
    });
    midiState.connected = midiState.inputs.length > 0;
  };
  bind(); access.onstatechange = bind;
  return midiState.inputs;
}
function useMidiNotes(handler) {
  const ref = useRef(handler); ref.current = handler;
  useEffect(() => { const fn = (n, v) => ref.current && ref.current(n, v); midiListeners.add(fn); return () => midiListeners.delete(fn); }, []);
}
const PC_KEYS = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14, p: 15, ";": 16 };
function usePcKeyboard(enabled, base, onNote) {
  const ref = useRef(onNote); ref.current = onNote;
  useEffect(() => {
    if (!enabled) return;
    const down = new Set();
    const kd = (e) => {
      const tag = (e.target && e.target.tagName) || ""; if (tag === "INPUT" || tag === "TEXTAREA") return;
      const k = e.key.toLowerCase();
      if (k in PC_KEYS && !down.has(k)) { down.add(k); ref.current(base + PC_KEYS[k]); }
    };
    const ku = (e) => down.delete(e.key.toLowerCase());
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [enabled, base]);
}

/* --------------------------------- THEMES --------------------------------- */
const THEMES = {
  graffiti: {
    id: "graffiti", name: "Graffiti", dark: true, graffiti: true, bg: "#242B34", texture: 0.6,
    card: "rgba(14,17,22,0.62)", card2: "rgba(255,255,255,0.08)", hero: "#121519", heroText: "#FFFFFF",
    heroBg: "linear-gradient(135deg,#FF3EA5 0%,#8B5CFF 55%,#22E4FF 120%)",
    text: "#F7F7FA", sub: "rgba(255,255,255,0.7)", faint: "rgba(255,255,255,0.36)",
    accent: "#C6FF3D", accentText: "#141A05", pop: "#FF3EA5", popText: "#FFFFFF",
    soft: "rgba(34,228,255,0.15)", softText: "#D2F9FF", border: "rgba(255,255,255,0.13)",
    nav: "#0F1216", navIcon: "rgba(255,255,255,0.5)", input: "rgba(0,0,0,0.32)", good: "#7CFFB2", bad: "#FF6B6B",
    keyW: "#F4F4F6", keyB: "#0E1014", serif: false, blob: "#FF3EA5", sheet: "#171B21",
    spray: ["#FF3EA5", "#C6FF3D", "#22E4FF", "#FF8A00", "#8B5CFF", "#FFE53D"],
  },
  riot: {
    id: "riot", name: "Street Riot", dark: true, graffiti: true, crazy: true, bg: "#121214", texture: 0.85,
    card: "rgba(8,8,10,0.80)", card2: "rgba(255,255,255,0.09)", hero: "#0B0B0D", heroText: "#FFFFFF",
    heroBg: "linear-gradient(125deg,#FF0A78 0%,#7A2BFF 52%,#00A8F0 100%)",
    text: "#FFFFFF", sub: "rgba(255,255,255,0.74)", faint: "rgba(255,255,255,0.42)",
    accent: "#39FF14", accentText: "#06140A", pop: "#FF0A78", popText: "#FFFFFF",
    soft: "rgba(0,240,255,0.14)", softText: "#CFFBFF", border: "rgba(255,255,255,0.16)",
    nav: "#08080A", navIcon: "rgba(255,255,255,0.55)", input: "rgba(0,0,0,0.45)", good: "#39FF14", bad: "#FF4D4D",
    keyW: "#F5F5F5", keyB: "#050507", serif: false, blob: "#FF0A78", sheet: "#141417",
    spray: ["#FF0A78", "#39FF14", "#00F0FF", "#FF8A00", "#B026FF", "#FFE53D"],
  },
  youth: {
    id: "youth", name: "Youth", dark: true, bg: "#4A5866", texture: 0.5,
    card: "rgba(255,255,255,0.075)", card2: "rgba(255,255,255,0.13)", hero: "#2E3A46", heroText: "#FFFFFF",
    text: "#FFFFFF", sub: "rgba(255,255,255,0.72)", faint: "rgba(255,255,255,0.52)",
    accent: "#D8C4EE", accentText: "#2B2540", pop: "#F6B26B", popText: "#2B2118",
    soft: "rgba(216,196,238,0.16)", softText: "#F1E8FA", border: "rgba(255,255,255,0.12)",
    nav: "#323F4B", navIcon: "rgba(255,255,255,0.5)", input: "rgba(0,0,0,0.18)", good: "#9BE3B8", bad: "#FF9A9A",
    keyW: "#F4F1F8", keyB: "#2A2F3A", serif: true, blob: "#B79CE6", sheet: "#3E4B58",
  },
  light: {
    id: "light", name: "Light", dark: false, bg: "#EEF2F2", texture: 0.12,
    card: "#FFFFFF", card2: "#F4F7F7", hero: "#1F4D5C", heroText: "#FFFFFF",
    text: "#173B47", sub: "#56686F", faint: "#66787E",
    accent: "#F5A94C", accentText: "#2A1A05", pop: "#E8813F", popText: "#2A1405",
    soft: "#FDEBD8", softText: "#173B47", border: "#E2E8E9",
    nav: "#FFFFFF", navIcon: "#5B6E75", input: "#F1F4F4", good: "#2E9E6A", bad: "#E0574F",
    keyW: "#FFFFFF", keyB: "#1F2D33", serif: false, blob: "#F5A94C",
  },
  calm: {
    id: "calm", name: "Calm", dark: false, bg: "#F3EFE7", texture: 0.16,
    card: "#FBF9F4", card2: "#EFEAE0", hero: "#2E3B2F", heroText: "#F6F2EA",
    text: "#232B22", sub: "#5C6054", faint: "#706C5A",
    accent: "#2E3B2F", accentText: "#F6F2EA", pop: "#C9A46A", popText: "#232B22",
    soft: "#E7E1D2", softText: "#232B22", border: "#E4DED1",
    nav: "#FBF9F4", navIcon: "#7A7765", input: "#EFEAE0", good: "#4E8A5B", bad: "#C2574B",
    keyW: "#FFFDF8", keyB: "#2E3B2F", serif: true, blob: "#C9A46A",
  },
  dark: {
    id: "dark", name: "Dark", dark: true, bg: "#0D1619", texture: 0.22,
    card: "#152227", card2: "#1B2B31", hero: "#1F4D5C", heroText: "#FFFFFF",
    text: "#EAF1F2", sub: "#9DB0B6", faint: "#7A9097",
    accent: "#F5A94C", accentText: "#1A1206", pop: "#D8C4EE", popText: "#221C33",
    soft: "rgba(245,169,76,0.13)", softText: "#FCE3C5", border: "rgba(255,255,255,0.07)",
    nav: "#121E22", navIcon: "#82989F", input: "#0F1B1F", good: "#6FD39E", bad: "#FF8A80",
    keyW: "#E9EEF0", keyB: "#0B1214", serif: false, blob: "#F5A94C", sheet: "#152227",
  },
};
const NOISE_SVG = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const WEAVE = "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.035) 0 1px, transparent 1px 4px)";

/* ------------------------------ LANGUAGE ------------------------------ */
const STR = {
  en: { home: "Home", learn: "Learn", practice: "Practice", progress: "Progress", chat: "Chat", songs: "Songs", games: "Games", profile: "Profile", eve: "Good evening", morn: "Good morning", aft: "Good afternoon", plan: "Today's Plan", feed: "Team feed", settings: "Settings" },
  am: { home: "ቤት", learn: "ትምህርት", practice: "ልምምድ", progress: "እድገት", chat: "ውይይት", songs: "መዝሙሮች", games: "ጨዋታ", profile: "መገለጫ", eve: "እንደምን አመሹ", morn: "እንደምን አደሩ", aft: "እንደምን ዋሉ", plan: "የዛሬ እቅድ", feed: "የቡድን ዜና", settings: "ቅንብሮች" },
};

/* ------------------------------ APP CONTEXT ------------------------------ */
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);
