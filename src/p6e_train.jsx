/* ============================ TRAINING CONTENT ============================
   1) more Keys drills (finger exercises, scales, chords, arpeggios, progressions, left hand, worship styles)
   2) guided routines with a timer (body, hands, breathing, stick control, feet, dynamics, sound checks)
   3) per-department training sections (categories) and gym-style training packages               */

/* ---------- 1) KEYS DRILLS ---------- */
const kTri = (k, d) => { const r = (k + DIATONIC.degs[((d % 7) + 7) % 7]) % 12; const q = DIATONIC.q[((d % 7) + 7) % 7]; return { r, q, iv: q === "m" ? [0, 3, 7] : q === "dim" ? [0, 3, 6] : [0, 4, 7] }; };
const kLH = (r) => 36 + r + (r > 7 ? -12 : 0) + 12; // bass note between C2..G3
const kProg = (P, degs, opt = {}) => { let prev = null; return KD_KEYS(P, true).flatMap((k) => degs.map((d, i) => {
  const t = kTri(k, d); const iv = opt.sev ? (t.q === "m" ? [0, 3, 7, 10] : t.q === "dim" ? [0, 3, 6, 10] : d % 7 === 4 ? [0, 4, 7, 10] : [0, 4, 7, 11]) : opt.add9 ? [...t.iv, 14] : t.iv;
  const rh = voiceLead(prev, iv.map((x) => (t.r + x) % 12)); prev = rh; const bass = opt.bass ? (k + opt.bass[i]) % 12 : t.r;
  return { n: [kLH(bass), ...rh], k, label: `${NOTE_NAMES[k]} key · ${opt.labels ? opt.labels[i] : String((d % 7) + 1) + (t.q === "m" ? "m" : t.q === "dim" ? "°" : "")} = ${NOTE_NAMES[t.r]}${t.q === "dim" ? "dim" : t.q}${opt.bass ? "/" + NOTE_NAMES[bass] : ""}` };
})); };
Object.assign(KD, {
  hanon2: { cat: "Finger exercises", name: "Hanon #2", lvl: 1, desc: "C-E-A-G-F-G-F-E pattern climbing the scale. Fingers 1-2-5-4-3-4-3-2. Lift each finger, play from the knuckle, keep the wrist level.", seq: (P) => [0, 1, 2, 3, 4, 5, 6].flatMap((d) => [0, 2, 5, 4, 3, 4, 3, 2].map((o) => ({ n: [degMidi(keyBase(P.key), d + o)] }))), sub: 4 },
  hanon3: { cat: "Finger exercises", name: "Hanon #3", lvl: 1, desc: "C-E-A-G-F-E-F-G. Strengthens fingers 3-4-5, the weakest ones. Slow and even before fast.", seq: (P) => [0, 1, 2, 3, 4, 5, 6].flatMap((d) => [0, 2, 5, 4, 3, 2, 3, 4].map((o) => ({ n: [degMidi(keyBase(P.key), d + o)] }))), sub: 4 },
  trills: { cat: "Finger exercises", name: "Finger-pair trills", lvl: 0, desc: "Trill each pair of fingers: 1-2, 2-3, 3-4, 4-5 (8 notes each). Weak pairs (3-4, 4-5) get extra reps. Keep other fingers resting on the keys.", seq: (P) => [[0, 1], [1, 2], [2, 3], [3, 4]].flatMap(([a, b]) => Array.from({ length: 8 }, (_, i) => ({ n: [degMidi(keyBase(P.key), i % 2 ? b : a)], label: `Fingers ${a + 1}–${b + 1}` }))), sub: 4 },
  contrary: { cat: "Finger exercises", name: "Contrary motion (both hands)", lvl: 1, desc: "Both thumbs start on the key note and the hands move away from each other, then back. Same finger numbers in both hands, so the brain learns symmetry.", seq: (P) => { const b = keyBase(P.key); const up = [0, 1, 2, 3, 4, 5, 6, 7].map((d) => ({ n: [degMidi(b, -d), degMidi(b, d)], label: `L ${nn(degMidi(b, -d))} · R ${nn(degMidi(b, d))}` })); return upDown(up); }, sub: 2 },
  thumb: { cat: "Finger exercises", name: "Thumb-under drill", lvl: 0, desc: "1-2-3, thumb passes under to 4th note, back again. The thumb moves early and quietly; the hand stays still.", seq: (P) => { const b = keyBase(P.key); return [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 4, 3, 2, 1].map((d) => ({ n: [degMidi(b, d)] })); }, sub: 2 },
  chrom: { cat: "Scales", name: "Chromatic scale", lvl: 0, all12: false, desc: "Every key, white and black. Fingering: 3 on black keys, 1 on white keys, 2 only on E-F and B-C. Great for evenness.", seq: (P) => { const b = 60 + P.key - (P.key > 6 ? 12 : 0); return upDown(Array.from({ length: 13 }, (_, i) => ({ n: [b + i], label: nn(b + i) }))); }, sub: 4 },
  octhands: { cat: "Scales", name: "Scale hands together (octave apart)", lvl: 1, all12: true, desc: "Both hands play the scale an octave apart. Left-hand fingering is the mirror of the right: 5-4-3-2-1-3-2-1. Listen for both hands landing at once.", seq: (P) => KD_KEYS(P, true).flatMap((k) => upDown(Array.from({ length: 8 }, (_, i) => ({ n: [degMidi(keyBase(k), i) - 12, degMidi(keyBase(k), i)], k, label: `${NOTE_NAMES[k]} · ${nn(degMidi(keyBase(k), i))}` })))), sub: 2 },
  thirds: { cat: "Scales", name: "Scale in 3rds", lvl: 1, all12: true, desc: "1-3, 2-4, 3-5 … up the scale. Trains your ear for harmony and your fingers for skips.", seq: (P) => KD_KEYS(P, true).flatMap((k) => [0, 1, 2, 3, 4, 5, 6, 7].flatMap((d) => [d, d + 2].map((x) => ({ n: [degMidi(keyBase(k), x)], k, label: `${NOTE_NAMES[k]} · ${d + 1} → ${((d + 2) % 7) + 1}` })))), sub: 2 },
  sixths: { cat: "Scales", name: "Scale in 6ths (two notes)", lvl: 2, all12: true, desc: "Play the scale with a 6th on top of every note. This is the sweet worship harmony sound used in intros.", seq: (P) => KD_KEYS(P, true).flatMap((k) => upDown([0, 1, 2, 3, 4, 5, 6, 7].map((d) => ({ n: [degMidi(keyBase(k), d), degMidi(keyBase(k), d + 5)], k, label: `${NOTE_NAMES[k]} · ${d + 1} + 6th` })))), sub: 1 },
  pentarun: { cat: "Scales", name: "Pentatonic run in 3s", lvl: 2, all12: true, desc: "Major pentatonic (1 2 3 5 6) in groups of three. The go-to run for fills and endings.", seq: (P) => KD_KEYS(P, true).flatMap((k) => { const st = [0, 2, 4, 7, 9]; const m = (i) => keyBase(k) + st[i % 5] + 12 * Math.floor(i / 5); return [0, 1, 2, 3, 4, 5, 6, 7].flatMap((i) => [i, i + 1, i + 2].map((x) => ({ n: [m(x)], k, label: `${NOTE_NAMES[k]} pentatonic` }))); }), sub: 3 },
  sev: { cat: "Chords & voicings", name: "7th chords of the key", lvl: 2, all12: true, desc: "1maj7 · 2m7 · 3m7 · 4maj7 · 5(7) · 6m7 · 7m7b5. Say each name aloud. These colours are everywhere in modern worship.", seq: (P) => KD_KEYS(P, true).flatMap((k) => [0, 1, 2, 3, 4, 5, 6].map((d) => { const t = kTri(k, d); const iv = t.q === "m" ? [0, 3, 7, 10] : t.q === "dim" ? [0, 3, 6, 10] : d === 4 ? [0, 4, 7, 10] : [0, 4, 7, 11]; const nm = t.q === "m" ? "m7" : t.q === "dim" ? "m7b5" : d === 4 ? "7" : "maj7"; return { n: [kLH(t.r) - 12, ...voiceChord(60 + t.r - (t.r > 6 ? 12 : 0), iv, 0, "close")], k, label: `${d + 1} = ${NOTE_NAMES[t.r]}${nm}` }; })), sub: 0.5 },
  colour: { cat: "Chords & voicings", name: "Sus & add9 colours", lvl: 1, all12: true, desc: "For the 1, 4 and 5 chords: plain → sus2 → sus4 → back home → add9. Hear how sus wants to resolve and add9 sounds open.", seq: (P) => KD_KEYS(P, true).flatMap((k) => [0, 3, 4].flatMap((d) => { const r = (k + DIATONIC.degs[d]) % 12; const b = 60 + r - (r > 6 ? 12 : 0); return [[[0, 4, 7], ""], [[0, 2, 7], "sus2"], [[0, 5, 7], "sus4"], [[0, 4, 7], ""], [[0, 4, 7, 14], "add9"]].map(([iv, q]) => ({ n: [b - 12, ...iv.map((x) => b + x)], k, label: `${d + 1} = ${NOTE_NAMES[r]}${q}` })); })), sub: 0.5 },
  spread: { cat: "Chords & voicings", name: "Spread worship voicing", lvl: 2, all12: true, desc: "LH: root–5th–octave. RH: the triad on top. The big, full sound for choruses. Try 1–5–6–4.", seq: (P) => { let prev = null; return KD_KEYS(P, true).flatMap((k) => [0, 4, 5, 3].map((d) => { const t = kTri(k, d); const rh = voiceLead(prev, t.iv.map((x) => (t.r + x) % 12)); prev = rh; const lo = kLH(t.r) - 12; return { n: [lo, lo + 7, lo + 12, ...rh], k, label: `${d + 1} = ${NOTE_NAMES[t.r]}${t.q}` }; })); }, sub: 0.5 },
  slash: { cat: "Chords & voicings", name: "Slash chords: 1 – 1/3 – 4 – 5", lvl: 2, all12: true, desc: "The bass walks up (1 → 3 → 4 → 5) while the right hand stays smooth. 1/3 means the 1 chord with the 3rd in the bass.", seq: (P) => kProg(P, [0, 0, 3, 4], { bass: [0, 4, 5, 7], labels: ["1", "1/3", "4", "5"] }), sub: 0.5 },
  arp7: { cat: "Arpeggios & patterns", name: "7th-chord arpeggios", lvl: 2, all12: true, desc: "1-3-5-7-8 and back on the maj7 of your key, then the 6m7. Smooth thumb crossing on the way up.", seq: (P) => KD_KEYS(P, true).flatMap((k) => [[0, 4, 7, 11, 12, 11, 7, 4], [9, 12, 16, 19, 21, 19, 16, 12]].flatMap((ar, ai) => ar.map((x) => ({ n: [keyBase(k) + x], k, label: `${NOTE_NAMES[k]} · ${ai ? "6m7" : "1maj7"}` })))), sub: 2 },
  broken: { cat: "Arpeggios & patterns", name: "Worship broken chord 1-5-8-10", lvl: 1, all12: true, desc: "Left-hand pattern for slow songs: root, 5th, octave, 10th (the 3rd an octave up). Over 1 – 5 – 6m – 4.", seq: (P) => KD_KEYS(P, true).flatMap((k) => [0, 4, 5, 3].flatMap((d) => { const t = kTri(k, d); const b = kLH(t.r) - 12; const third = t.q === "m" ? 15 : 16; return [0, 7, 12, third, 12, 7].map((x) => ({ n: [b + x], k, label: `${d + 1} = ${NOTE_NAMES[t.r]}${t.q}` })); })), sub: 2 },
  alberti: { cat: "Arpeggios & patterns", name: "Alberti bass (1-5-3-5)", lvl: 1, all12: true, desc: "Classic moving accompaniment: bottom–top–middle–top. Over 1 – 4 – 5 – 1. Keeps a song moving without a drummer.", seq: (P) => KD_KEYS(P, true).flatMap((k) => [0, 3, 4, 0].flatMap((d) => { const t = kTri(k, d); const v = voiceChord(48 + t.r - (t.r > 7 ? 12 : 0), t.iv, 0, "close"); return [v[0], v[2], v[1], v[2], v[0], v[2], v[1], v[2]].map((m) => ({ n: [m], k, label: `${d + 1} = ${NOTE_NAMES[t.r]}${t.q}` })); })), sub: 4 },
  p1451: { cat: "Progressions", name: "1–4–5–1 with bass", lvl: 0, all12: true, desc: "The foundation of hymns and gospel. LH plays the root, RH voice-leads (move as few fingers as possible).", seq: (P) => kProg(P, [0, 3, 4, 0]), sub: 0.5 },
  p6415: { cat: "Progressions", name: "6–4–1–5", lvl: 1, all12: true, desc: "The emotional worship loop (minor start). Count 4 beats per chord.", seq: (P) => kProg(P, [5, 3, 0, 4]), sub: 0.5 },
  p1645: { cat: "Progressions", name: "1–6–4–5", lvl: 1, all12: true, desc: "The classic 50s / gospel ballad progression.", seq: (P) => kProg(P, [0, 5, 3, 4]), sub: 0.5 },
  p251: { cat: "Progressions", name: "2–5–1 with 7ths", lvl: 3, all12: true, desc: "2m7 → 5(7) → 1maj7. The strongest 'coming home' move in music. Gospel players use it everywhere.", seq: (P) => kProg(P, [1, 4, 0], { sev: true }), sub: 0.5 },
  walkup: { cat: "Progressions", name: "Gospel walk-up 4 – 5 – 6m", lvl: 2, all12: true, desc: "Climb into the chorus: 4 → 5 → 6m, then land on 1/3 → 4. Builds energy without getting louder.", seq: (P) => kProg(P, [3, 4, 5, 0, 3], { bass: [5, 7, 9, 4, 5], labels: ["4", "5", "6m", "1/3", "4"] }), sub: 0.5 },
  descbass: { cat: "Progressions", name: "Descending bass 1 – 5/7 – 6m – 1/5 – 4", lvl: 2, all12: true, desc: "The bass steps down the scale under smooth chords (Pachelbel-style). Lovely for bridges and endings.", seq: (P) => kProg(P, [0, 4, 5, 0, 3], { bass: [0, 11, 9, 7, 5], labels: ["1", "5/7", "6m", "1/5", "4"] }), sub: 0.5 },
  lhoct: { cat: "Left hand", name: "LH octaves on the roots", lvl: 1, all12: true, desc: "Left hand plays octaves (fingers 5 + 1) on 1 – 5 – 6m – 4, two per bar. Strong, steady foundation.", seq: (P) => KD_KEYS(P, true).flatMap((k) => [0, 4, 5, 3].flatMap((d) => { const t = kTri(k, d); const b = kLH(t.r) - 12; return [0, 1].map(() => ({ n: [b, b + 12], k, label: `${d + 1} = ${NOTE_NAMES[t.r]}` })); })), sub: 1 },
  lh158: { cat: "Left hand", name: "LH 1-5-8 pulse", lvl: 1, all12: true, desc: "Root, 5th, octave in quarter notes. Learn it until you don't have to think, then add the right hand.", seq: (P) => KD_KEYS(P, true).flatMap((k) => [0, 4, 5, 3].flatMap((d) => { const t = kTri(k, d); const b = kLH(t.r) - 12; return [0, 7, 12, 7].map((x) => ({ n: [b + x], k, label: `${d + 1} = ${NOTE_NAMES[t.r]}` })); })), sub: 1 },
  indep: { cat: "Left hand", name: "Hand independence", lvl: 2, all12: true, desc: "LH plays the root on every beat; RH holds the chord and re-strikes only on beat 1 and the 'and' of 2. Count out loud.", seq: (P) => { let prev = null; return KD_KEYS(P, true).flatMap((k) => [0, 4, 5, 3].flatMap((d) => { const t = kTri(k, d); const rh = voiceLead(prev, t.iv.map((x) => (t.r + x) % 12)); prev = rh; const b = kLH(t.r) - 12; return [[b, ...rh], [b], [b], [...rh], [b], [b], [b], [b]].map((n) => ({ n, k, label: `${d + 1} = ${NOTE_NAMES[t.r]}${t.q}` })); })); }, sub: 2 },
  pads: { cat: "Worship playing", name: "Pad swells with add9", lvl: 1, all12: true, desc: "Hold each chord for a full bar: 1add9 – 5 – 6m7 – 4add9. Play softly with the sustain pedal, change cleanly. This is the sound under prayer and reading.", seq: (P) => kProg(P, [0, 4, 5, 3], { add9: true }), sub: 0.25 },
  tizrun: { cat: "Worship playing", name: "Tizita run (Ethiopian pentatonic)", lvl: 2, all12: true, desc: "Tizita major uses 1 2 3 5 6 — the heart of many Ethiopian worship melodies. Run it up and down, then improvise over a pad.", seq: (P) => KD_KEYS(P, true).flatMap((k) => { const st = [0, 2, 4, 7, 9, 12, 14, 16]; return upDown(st.map((x) => ({ n: [keyBase(k) + x], k, label: `${NOTE_NAMES[k]} Tizita` }))); }), sub: 2 },
  keyup: { cat: "Worship playing", name: "Key change up a whole step", lvl: 3, desc: "End in your key on 1, play the 5 of the NEW key (one bar), land on the new 1. The classic last-chorus lift.", seq: (P) => { const k = P.key, n = (P.key + 2) % 12; const v = (r, q) => voiceChord(55 + r - (r > 8 ? 12 : 0), q === "m" ? [0, 3, 7] : [0, 4, 7], 0, "close"); return [[k, 0, "Old key 1"], [k, 3, "Old key 4"], [(n + 7) % 12, -1, "5 of NEW key"], [n, 0, "NEW key 1"]].map(([r, d, l]) => { const rr = d >= 0 ? (r + DIATONIC.degs[d]) % 12 : r; return { n: [kLH(rr), ...v(rr, "")], label: `${l} = ${NOTE_NAMES[rr]}` }; }); }, sub: 0.25 },
});
Object.assign(KD.five, { cat: "Finger exercises" }); Object.assign(KD.hanon, { cat: "Finger exercises" }); Object.assign(KD.scales, { cat: "Scales" }); Object.assign(KD.scale, { cat: "Scales" });
Object.assign(KD.triads, { cat: "Chords & voicings" }); Object.assign(KD.inv, { cat: "Chords & voicings" }); Object.assign(KD.arp, { cat: "Arpeggios & patterns" }); Object.assign(KD.circle1564, { cat: "Progressions" });
const KD_CATS = ["Finger exercises", "Scales", "Chords & voicings", "Arpeggios & patterns", "Progressions", "Left hand", "Worship playing"];

/* ---------- 2) GUIDED ROUTINES (timer + click) ---------- */
/* step: [name, seconds, how-to, bpm?] */
const ROUTINES = {
  sg_body: { title: "Singer's body warm-up", who: "singer", desc: "Release the tension that strangles the voice: neck, shoulders, jaw, tongue and ribs.", steps: [
    ["Stand tall", 30, "Feet hip-width, knees soft, weight slightly forward. Imagine a string pulling the crown of your head up. Shoulders drop down and back."],
    ["Shoulder rolls", 30, "Big slow circles backwards 5×, forwards 5×. Breathe out as they drop."],
    ["Neck release", 40, "Ear to shoulder (left, then right), 3 slow breaths each side. Then chin to chest and roll gently half-circles. Never roll the head backwards."],
    ["Jaw massage", 30, "Find the jaw muscle in front of your ears. Massage in circles with your fingertips while letting the mouth hang open."],
    ["Tongue stretch", 30, "Tongue out and down toward your chin 5×, then circle it around your teeth 5× each way. A loose tongue means a free sound."],
    ["Side stretch for ribs", 40, "Right arm over your head, lean left and breathe INTO your right ribs. Then the other side. Ribs must move for good breathing."],
    ["Rag-doll roll-down", 40, "Slowly roll down vertebra by vertebra, hang loose and shake your arms, breathe low into your back. Roll up slowly, head last."],
    ["Lip bubbles", 30, "Relaxed lip trill on a comfortable note, sliding up and down. If the lips stop, support with more air, not more push."],
  ] },
  sg_core: { title: "Core & support strength", who: "singer", desc: "No equipment. A strong, flexible core gives steady breath support. Stop if anything hurts.", steps: [
    ["Dead bug", 40, "On your back, arms up, knees at 90°. Slowly lower the opposite arm and leg while breathing out on 'sss'. Lower back stays on the floor."],
    ["Rest", 15, "Breathe low and slow."],
    ["Glute bridge with hiss", 40, "Feet flat, lift the hips, hold. Breathe in low, hiss out for 8 counts while holding the bridge."],
    ["Rest", 15, "Breathe."],
    ["Plank with counting", 30, "Forearm plank (knees down is fine). Count out loud 1 to 10 slowly, smooth voice, no breath holding."],
    ["Rest", 15, "Breathe."],
    ["Side plank", 40, "20 seconds each side. Breathe into the top ribs."],
    ["Standing 'ts-ts' pulses", 30, "Stand tall, hand on belly. Short 'ts!' pulses from the belly, 4 per beat. Feel the abs kick inward."],
    ["Sing while holding a squat", 30, "Wall-sit or half squat. Sing a 5-note scale on 'ah' — your voice should stay steady even when the body works."],
  ] },
  sg_breath: { title: "Silent breath builders", who: "singer", desc: "Quiet exercises you can do anywhere (even on a bus) to grow breath control.", steps: [
    ["Low breath check", 40, "One hand on chest, one on belly. Breathe in through the nose: only the belly hand and the sides of the ribs move."],
    ["4-7-8 calm", 60, "In for 4, hold for 7, out for 8. Repeat 3 times. Calms nerves before singing."],
    ["Straw breathing", 60, "Breathe out slowly through a thin straw (or pursed lips) for as long as possible. Steady stream, ribs stay wide."],
    ["Rib hold", 45, "Breathe in, then keep the ribs open while you breathe out slowly. This is 'appoggio' — the singer's support."],
    ["Snatch breaths", 40, "Quick silent breath through the mouth (½ beat), then 4 counts out. Practise for fast phrases in songs."],
    ["Long 'sss' timer", 45, "Big low breath, hiss evenly. Count how long. Write it down — try to beat it next week."],
  ] },
  sg_recover: { title: "Vocal recovery & health", who: "singer", desc: "After a long rehearsal or when your voice feels tired.", steps: [
    ["Drink water", 30, "Room-temperature water, small sips. Your vocal folds are hydrated from the inside — drink through the whole day, not only now."],
    ["Steam", 120, "Breathe steam from a bowl of hot water (towel over your head) or a hot shower. Moist air soothes the folds."],
    ["Gentle straw phonation", 60, "Hum gently through a straw, sliding in your comfortable middle range. It rebalances the voice with almost no effort."],
    ["Soft descending hums", 40, "'Mmm' from medium high to low, very softly."],
    ["Silence", 60, "Rest the voice. No whispering — whispering strains the folds more than soft speaking."],
    ["Check-in", 20, "Any pain, burning or hoarseness that lasts more than 2 weeks? Tell a leader and see a doctor."],
  ] },
  sg_lyrics: { title: "Lyrics, meaning & leading", who: "singer", desc: "Worship leading starts with understanding what you sing.", steps: [
    ["Read the lyrics out loud", 60, "Read the song like a poem, slowly, with meaning. Where would you naturally breathe? Mark it with '."],
    ["Find the Scripture", 60, "Which Bible passage is the song built on? Look it up. Knowing it changes how you sing it."],
    ["Pray the song", 60, "Turn each line into a personal prayer. Sing it to God, not to the congregation."],
    ["Mark the peak", 40, "Which word or line is the emotional peak? Underline it. Plan your dynamics: start smaller so the peak can grow."],
    ["Speak a short exhortation", 60, "Practise one sentence you might say before the song (e.g. 'Let's lift His name together'). Short, clear, Christ-centred."],
  ] },
  ky_hands: { title: "Keys: hand & finger warm-up", who: "keys", desc: "Two minutes before playing protects your hands and makes you faster.", steps: [
    ["Warm hands", 30, "Rub your palms together quickly, then open and close your fists 10 times."],
    ["Finger spreads", 30, "Spread all fingers wide, hold 3 seconds, relax. Repeat 6×."],
    ["Wrist circles", 30, "Slow circles both ways. Then gentle prayer-position stretch for 10 seconds."],
    ["Finger taps on the lid", 40, "Fingers curved on a closed lid. Tap 1-2-3-4-5-4-3-2 with each hand, slowly. Only one finger moves at a time."],
    ["Silent chord shapes", 40, "Without sound, place your hand in C, F, G, Am shapes on the keys. Feel them, then release."],
  ] },
  gt_hands: { title: "Guitar & bass: hand care", who: "acoustic", desc: "Warm up before you fret. Prevents pain and helps barre chords.", steps: [
    ["Warm hands", 30, "Rub palms, then open-close fists 10×."],
    ["Finger stretches", 40, "Gently pull each finger back with the other hand for 5 seconds. Never force."],
    ["Thumb & wrist", 30, "Thumb circles both ways, then gentle wrist circles. Keep the fretting wrist straight when you play."],
    ["Spider on one string", 60, "Fingers 1-2-3-4 on frets 5-8 of one string, slow and clean. Fingertips close to the frets.", 60],
    ["Light grip check", 40, "Play a G chord and slowly relax pressure until it buzzes, then add just enough to ring. That's how hard you should press — no more."],
  ] },
  gt_rhythm: { title: "Strumming hand stamina", who: "acoustic", desc: "Down-up stamina with the click. Keep the arm moving like a pendulum.", steps: [
    ["Muted quarters", 60, "Mute the strings with the fretting hand. Down strums on every click.", 70],
    ["Muted 8ths", 60, "Down-up 8ths, even volume both ways.", 70],
    ["Accent on 2 & 4", 60, "Same 8ths, accent beats 2 and 4 — the backbeat.", 80],
    ["16ths", 60, "Down-up-down-up per click. Small, relaxed motion from the wrist.", 66],
    ["Real chords", 90, "G – C – D – Em, one bar each, folk pattern D-DU-UDU.", 80],
  ] },
  dr_wrists: { title: "Drummer: wrist & forearm warm-up", who: "drums", desc: "Your hands are your instrument. 3 minutes saves you from injury.", steps: [
    ["Shake out", 20, "Shake your hands loosely at your sides."],
    ["Wrist circles", 30, "Slow circles both ways with sticks in hand."],
    ["Forearm stretch", 40, "Arm straight, palm down, gently pull fingers toward you (20 s), then palm up (20 s). Each arm."],
    ["Finger rolls", 30, "Roll the stick through your fingers like a pencil spin, slowly."],
    ["Slow full strokes", 60, "On a pad or pillow: big relaxed strokes, stick rebounds back up. Right 8, left 8.", 60],
  ] },
  dr_pad: { title: "Practice-pad stick control", who: "drums", desc: "The 10-minute routine every great drummer does. Use the click, stay relaxed.", steps: [
    ["Singles (RLRL)", 60, "Even volume and height in both hands. Watch your weaker hand.", 80],
    ["Doubles (RRLL)", 60, "Second stroke as loud as the first — use the rebound and the fingers.", 75],
    ["Paradiddle (RLRR LRLL)", 60, "Accent the first note of each group.", 70],
    ["8 on a hand", 60, "8 right, 8 left, 4 right, 4 left, 2-2, then singles. Classic warm-up.", 85],
    ["Accent tap", 60, "Accent every 4th note; taps stay low (2 cm), accents high (25 cm).", 80],
    ["Triplets", 60, "RLR LRL — the lead hand switches every beat. Count 1-trip-let.", 70],
    ["Speed burst", 45, "Singles: 4 bars as fast as you can stay relaxed, then 4 bars rest.", 100],
  ] },
  dr_feet: { title: "Feet: kick & hi-hat", who: "drums", desc: "Strong, steady feet make the band feel safe.", steps: [
    ["Heel-down kick quarters", 60, "Heel on the pedal, play from the ankle. Soft and even.", 70],
    ["Heel-up kick quarters", 60, "Lift the heel, play from the thigh. More power, same timing.", 80],
    ["Kick doubles", 60, "Two quick kicks per beat (slide or heel-toe). Clean, not rushed.", 70],
    ["Hi-hat foot on 2 & 4", 60, "Left foot 'chick' on 2 and 4 while the kick plays 1 and 3.", 80],
    ["Hands + feet", 90, "Basic groove: hats 8ths, snare 2 & 4, kick 1 & 3, hat foot on 2 & 4. Keep it relaxed.", 76],
  ] },
  dr_dyn: { title: "Dynamics ladder", who: "drums", desc: "Worship drumming is about control: playing soft is harder than loud.", steps: [
    ["Whisper (pp)", 45, "Basic groove as softly as possible. Sticks low, rim-clicks or brushes if you have them.", 72],
    ["Soft (p)", 45, "A little more. Hats closed and tight.", 72],
    ["Medium (mf)", 45, "Normal verse level.", 72],
    ["Strong (f)", 45, "Chorus level. Open the hats, bigger snare.", 72],
    ["Back down", 60, "Go f → mf → p over 4 bars each. Tempo must not change when volume changes!", 72],
    ["Build with the toms", 60, "Bridge build: floor tom 8ths, getting louder over 8 bars, crash on the 1.", 72],
  ] },
  dr_fills: { title: "Fills that land on 1", who: "drums", desc: "A fill is only good if the band knows where the 1 is.", steps: [
    ["3 bars groove + 1 bar fill", 90, "Simplest fill: snare 8ths on beat 4 only. Crash + kick on the next 1.", 76],
    ["Half-bar fill", 90, "Fill on beats 3 & 4: snare-snare-tom-tom, 8th notes.", 76],
    ["Triplet fill", 90, "Beat 4 as a triplet (snare-tom-floor). Feels great in 6/8 too.", 72],
    ["The 'no fill'", 60, "Just stop on beat 4 (a stop-hit) and come back on 1. Often the most powerful fill in worship.", 76],
  ] },
  sd_line: { title: "Sound: line-check routine", who: "sound", desc: "Do it the same way every Saturday and nothing gets forgotten.", steps: [
    ["Power-up order", 30, "Console and processing first, amps / powered speakers LAST. (Power down in the reverse order.)"],
    ["Load the scene", 30, "Load last week's saved scene or a clean template. Check the date/name."],
    ["Line check", 120, "Tap or speak into every input in order: kick, snare, hats, toms, bass, keys L/R, guitars, vocals. Mark anything silent."],
    ["Gain staging", 120, "With each musician playing their loudest part, set the gain so peaks hit around -18 to -12 dBFS. Faders at 0 (unity)."],
    ["Monitors", 120, "One person at a time: what they need to hear. Start with their own instrument, then the vocals and the click."],
    ["Save", 20, "Save the scene with today's date."],
  ] },
  sd_listen: { title: "Critical listening walk", who: "sound", desc: "Train your ears with any good worship recording.", steps: [
    ["Low end", 60, "Listen only to kick and bass. Do they sit together or fight?"],
    ["Vocals", 60, "Is the lead vocal always on top and clear? Where are the backing vocals panned?"],
    ["Space", 60, "Which instruments have reverb? Short or long? Is there delay on the vocal?"],
    ["Dynamics", 60, "How much louder is the chorus than the verse? Where does the song breathe?"],
    ["Compare", 60, "Now listen to your last recording from Saturday. Write 3 things to improve."],
  ] },
};
/* steps that are real playing get the real interactive tool right inside the routine */
const ROUTINE_TOOLS = {
  sg_body: { 7: ["vocalgym", { ex: "liptrill5" }] },
  sg_core: { 7: ["vocalgym", { ex: "ts" }], 8: ["vocalgym", { ex: "maj5" }] },
  sg_breath: { 1: ["breath", { level: 0 }], 2: ["breath", { level: 0 }], 4: ["breath", { level: 1 }], 5: ["breath", { level: 3, tab: "sustain" }] },
  sg_recover: { 2: ["vocalgym", { ex: "straw" }], 3: ["vocalgym", { ex: "coolhum" }] },
  ky_hands: { 3: ["keysdrills", { drill: "five" }], 4: ["keysdrills", { drill: "triads" }] },
  gt_hands: { 3: ["fingers", { inst: "guitar", ex: "spider" }], 4: ["changes", { a: "G", b: "C" }] },
  gt_rhythm: { 0: ["strum", { pattern: "quarters" }], 1: ["strum", { pattern: "eighths" }], 2: ["strum", { pattern: "chuck" }], 3: ["strum", { pattern: "sixteen" }], 4: ["strum", { pattern: "folk" }] },
  dr_wrists: { 4: ["rudiments", { r: "singles" }] },
  dr_pad: { 0: ["rudiments", { r: "singles" }], 1: ["rudiments", { r: "doubles" }], 2: ["rudiments", { r: "paradiddle" }], 3: ["rudiments", { r: "singles" }], 4: ["rudiments", { r: "accent" }], 5: ["rudiments", { r: "trip" }], 6: ["rudiments", { r: "singles" }] },
  dr_feet: { 0: ["metronome", { bpm: 70 }], 1: ["metronome", { bpm: 80 }], 2: ["metronome", { bpm: 70 }], 3: ["groove", { id: "basic" }], 4: ["groove", { id: "basic" }] },
  dr_dyn: { 0: ["groove", { id: "basic" }], 3: ["groove", { id: "pop" }], 5: ["groove", { id: "toms" }] },
  dr_fills: { 0: ["groove", { id: "fill" }], 1: ["groove", { id: "fill" }], 2: ["groove", { id: "ballad" }], 3: ["groove", { id: "basic" }] },
  sd_line: { 3: ["flow", {}] },
  sd_listen: { 0: ["eq7", {}] },
};
/* a moving picture for body steps so beginners can copy it */
const cueOf = (name, how) => { const t = (name + " " + how).toLowerCase();
  if (/breath|hiss|inhale|4-7-8|straw|sss/.test(t)) return ["breath", "🫁"]; if (/fist|warm hands|rub/.test(t)) return ["fist", "✊"]; if (/circle|roll/.test(t)) return ["spin", "🔄"];
  if (/neck|ear to shoulder/.test(t)) return ["tilt", "🙂"]; if (/jaw|tongue|massage/.test(t)) return ["bob", "😮"]; if (/stretch|spread|side|rag|bend/.test(t)) return ["stretch", "🙆"];
  if (/plank|bridge|squat|bug|core/.test(t)) return ["hold", "💪"]; if (/water|drink|steam/.test(t)) return ["bob", "💧"]; if (/silence|rest|check/.test(t)) return ["calm", "🤫"]; if (/pray|scripture|lyrics|read/.test(t)) return ["calm", "📖"];
  return ["bob", "⭐"]; };
function MoveCue({ kind, emoji, run, secs }) {
  const { T } = useApp(); const [ph, setPh] = useState(0);
  useEffect(() => { if (!run || kind !== "breath") return; let k = 0; const t = setInterval(() => { k = (k + 1) % 14; setPh(k); }, 1000); return () => clearInterval(t); }, [run, kind]);
  const anim = { fist: "bzFist 1s ease-in-out infinite", spin: "bzSpin 2s linear infinite", tilt: "bzTilt 3s ease-in-out infinite", bob: "bzBob 1.2s ease-in-out infinite", stretch: "bzStretch 3s ease-in-out infinite", hold: "bzHold 1.6s ease-in-out infinite", calm: "bzBob 4s ease-in-out infinite" }[kind];
  if (kind === "breath") { const lab = ph < 4 ? "Breathe in…" : ph < 6 ? "Hold" : "Out slowly…"; const sc = ph < 4 ? 0.6 + ph * 0.12 : ph < 6 ? 1.08 : 1.08 - (ph - 6) * 0.06;
    return <div style={{ display: "grid", placeItems: "center", height: 130 }}><div style={{ width: 110, height: 110, borderRadius: 99, display: "grid", placeItems: "center", background: "radial-gradient(circle, rgba(34,228,255,0.55), rgba(181,123,255,0.25))", transform: `scale(${run ? sc : 0.8})`, transition: "transform 1s ease-in-out", fontWeight: 900, fontSize: 13, color: "#fff", textAlign: "center" }}>{run ? lab : "🫁"}</div></div>; }
  return <div style={{ display: "grid", placeItems: "center", height: 110 }}><style>{"@keyframes bzFist{0%,100%{transform:scale(.85)}50%{transform:scale(1.15)}}@keyframes bzSpin{to{transform:rotate(360deg)}}@keyframes bzTilt{0%,100%{transform:rotate(-25deg)}50%{transform:rotate(25deg)}}@keyframes bzBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes bzStretch{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.35)}}@keyframes bzHold{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}"}</style>
    <div style={{ fontSize: 64, animation: run ? anim : "none", display: "inline-block" }}>{kind === "fist" && run ? <FistSwap /> : emoji}</div></div>;
}
function FistSwap() { const [o, setO] = useState(false); useEffect(() => { const t = setInterval(() => setO((v) => !v), 500); return () => clearInterval(t); }, []); return <span>{o ? "🖐️" : "✊"}</span>; }
const routineMins = (id) => Math.max(1, Math.round(ROUTINES[id].steps.reduce((s, x) => s + x[1], 0) / 60));

function RoutinePlayer({ embedded, id }) {
  const { T, logPractice, toast } = useApp();
  const R = ROUTINES[id] || ROUTINES.sg_body;
  const [i, setI] = useState(0); const [left, setLeft] = useState(R.steps[0][1]); const [run, setRun] = useState(false); const [click, setClick] = useState(true); const [beat, setBeat] = useState(0);
  const [doneS, setDoneS] = useState({}); const [peek, setPeek] = useState(null);
  const toggleDone = (k) => setDoneS((d) => ({ ...d, [k]: !d[k] }));
  const step = R.steps[i]; const stTool = (ROUTINE_TOOLS[id] || {})[i]; const bpm = stTool ? null : step[3]; const [cueK, cueE] = cueOf(step[0], step[2]);
  const [voiceOn, setVoiceOn] = useState(true);
  useEffect(() => { if (!run || !voiceOn || stTool) return; try { if (window.speechSynthesis) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(step[0]); u.rate = 1; speechSynthesis.speak(u); } } catch (e) { } }, [i, run]); // eslint-disable-line
  useEffect(() => () => { try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) { } }, []);
  useEffect(() => { setI(0); setLeft(R.steps[0][1]); setRun(false); }, [id]); // eslint-disable-line
  useEffect(() => { if (!run) return; const t = setInterval(() => setLeft((l) => l - 1), 1000); return () => clearInterval(t); }, [run]);
  useEffect(() => { if (!run || !bpm || !click) return; let k = 0; const t = setInterval(() => { AE.click(k % 4 === 0); setBeat(k % 4); k++; }, 60000 / bpm); return () => clearInterval(t); }, [run, bpm, click, i]);
  useEffect(() => {
    if (left > 0) return; AE.chord([72, 76, 79], 0.6); setDoneS((d) => ({ ...d, [i]: true }));
    if (i < R.steps.length - 1) { setI(i + 1); setLeft(R.steps[i + 1][1]); }
    else { setRun(false); logPractice(routineMins(id), R.title); toast("Routine complete! 💪"); setLeft(R.steps[i][1]); }
  }, [left]); // eslint-disable-line
  const go = (n) => { setI(n); setLeft(R.steps[n][1]); };
  const total = R.steps.reduce((s, x) => s + x[1], 0); const done = R.steps.slice(0, i).reduce((s, x) => s + x[1], 0) + (step[1] - left);
  return (
    <div>
      {!embedded && <ToolBar title={R.title} sub={`Guided routine · ${routineMins(id)} min`} />}
      <Card tone="hero" style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Ring pct={1 - left / step[1]} size={84} stroke={9} color="#C6FF3D" track="rgba(255,255,255,0.22)"><span style={{ fontSize: 18 }}>{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</span></Ring>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.85 }}>STEP {i + 1} OF {R.steps.length}{bpm ? ` · ${bpm} BPM` : ""}</div>
            <div style={{ fontSize: 21, fontWeight: 900, lineHeight: 1.15 }}>{step[0]}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: "11px 13px", borderRadius: 14, background: "rgba(0,0,0,0.22)", fontSize: 13.5, lineHeight: 1.55 }}>{step[2]}</div>
        {!stTool && <MoveCue kind={cueK} emoji={cueE} run={run} />}
        {!stTool && <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}><Chip active={voiceOn} onClick={() => setVoiceOn((v) => !v)} style={{ fontSize: 11 }}>{voiceOn ? "🔊 Coach voice on" : "🔇 Coach voice off"}</Chip></div>}
        {bpm && <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>{[0, 1, 2, 3].map((b) => <div key={b} style={{ width: 12, height: 12, borderRadius: 99, background: run && click && b === beat ? (b === 0 ? "#C6FF3D" : "#fff") : "rgba(255,255,255,0.25)" }} />)}<Chip active={click} onClick={() => setClick((c) => !c)} style={{ marginLeft: "auto" }}>{click ? "Click on" : "Click off"}</Chip></div>}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn variant="light" icon={SkipBack} onClick={() => i > 0 && go(i - 1)} />
          <Btn full variant={run ? "light" : "accent"} icon={run ? Pause : Play} onClick={() => setRun((r) => !r)}>{run ? "Pause" : done > 0 ? "Resume" : "Start routine"}</Btn>
          <Btn variant="light" icon={SkipForward} onClick={() => setLeft(0)} />
        </div>
        <div style={{ marginTop: 12 }}><Bar pct={done / total} color="#fff" track="rgba(255,255,255,0.22)" /></div>
      </Card>
      {stTool && TOOLS[stTool[0]] && (() => { const TT = TOOLS[stTool[0]]; return <div key={id + i} style={{ marginTop: 12 }}><div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "0 2px 8px" }}>▶ DO IT HERE — {TT.title.toUpperCase()} (watch, play along, and turn on "Listen to me")</div><TT.C embedded {...stTool[1]} /></div>; })()}
      <div style={{ fontSize: 12.5, color: T.sub, margin: "12px 2px" }}>{R.desc}</div>
      <div style={{ fontSize: 11, color: T.faint, margin: "0 2px 8px" }}>Tap a step to read it · tick the box when you've done it</div>
      {R.steps.map((s, k) => { const dn = !!doneS[k]; const open = peek === k;
        return <Card key={k} pad={11} style={{ marginBottom: 7, border: k === i ? `2px solid ${T.accent}` : undefined }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => toggleDone(k)} aria-label={dn ? "Mark not done" : "Mark done"} style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, cursor: "pointer", border: `2px solid ${dn ? T.good : T.border}`, background: dn ? T.good : "transparent", color: "#fff", fontWeight: 900, fontSize: 15, display: "grid", placeItems: "center" }}>{dn ? "✓" : ""}</button>
            <div onClick={() => setPeek(open ? null : k)} style={{ flex: 1, minWidth: 0, cursor: "pointer" }}><div style={{ fontWeight: 800, fontSize: 13.5, textDecoration: dn ? "line-through" : "none", opacity: dn ? 0.6 : 1 }}>{k + 1}. {s[0]}</div><div style={{ fontSize: 11.5, color: T.sub }}>{s[1] >= 60 ? `${Math.round(s[1] / 6) / 10} min` : `${s[1]} s`}{s[3] ? ` · ${s[3]} bpm` : ""}{k === i ? " · now" : ""}</div></div>
            <span onClick={() => setPeek(open ? null : k)} style={{ color: T.sub, cursor: "pointer", fontSize: 14 }}>{open ? "▲" : "▼"}</span>
          </div>
          {open && <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.5 }}>{s[2]}{k !== i && <div style={{ marginTop: 8 }}><Btn small variant="soft" icon={Play} onClick={() => { go(k); setPeek(null); }}>Do this step now</Btn></div>}</div>}
        </Card>; })}
    </div>
  );
}

/* ---------- 3) DEPARTMENT TRAINING SECTIONS ---------- */
const TI = (t, d, tool, props, mins) => ({ t, d, tool, props: props || {}, mins: mins || 5 });
const TRT = (id, d) => TI(ROUTINES[id].title, d || ROUTINES[id].desc, "routine", { id }, routineMins(id));
const TKD = (id) => TI(KD[id].name, KD[id].desc, "keysdrills", { drill: id }, 6);
const TVG = (id, t, d) => TI(t, d, "vocalgym", { ex: id }, 4);
const TRAIN = {
  singer: [
    { id: "breath", emoji: "🌬️", title: "Breathing & support", why: "Breath is the engine of your voice. Good support = steady pitch, long phrases, no strain.", items: [
      TI("Breathing for beginners", "Calm 4·4·6, box breathing and the support hiss.", "breath", { level: 0 }, 5), TI("Intermediate breath", "Longer exhales, rib expansion, staggered breathing.", "breath", { level: 1 }, 6), TI("Advanced breath", "Extended hisses and control under pressure.", "breath", { level: 2 }, 7), TI("Sustain challenge", "Hold one note as long and steady as you can. Beat your best.", "breath", { level: 3, tab: "sustain" }, 3),
      TRT("sg_breath"), TVG("ts", "'Ts-ts' support pulses", "Short belly pulses — wakes up the support muscles."), TVG("messa", "Messa di voce (soft → loud → soft)", "One note that grows and shrinks. The ultimate breath-control exercise."), TVG("long5", "Long tones", "Even, steady long notes on 5 pitches."),
    ] },
    { id: "tech", emoji: "🎙️", title: "Vocal technique", why: "Warm-ups and exercises for a free, clear, strong voice in every part of your range.", items: [
      TVG("yawn", "Yawn-sigh (release)", "Opens the throat and drops the larynx."), TVG("liptrill5", "Lip trills (SOVT)", "The safest warm-up: balances air and voice."), TVG("straw", "Straw phonation", "Singing through a straw — gentle and powerful."), TVG("hum135", "Humming 1-3-5 (resonance)", "Find the buzz in your face — your best tone."), TVG("nay", "Bright 'Nay' (resonance)", "Forward, bright placement for cutting through the band."),
      TVG("siren", "Sirens through the break", "Smooth from chest to head voice without flipping."), TVG("octnay", "Octave 'Nay' (range)", "Builds the top of your range without shouting."), TVG("hey", "'Hey!' (mix & belt)", "A safe, speech-like power sound."), TVG("run123", "Agility 1-2-3-2-1", "Clean, fast runs."), TVG("gospel", "Gospel run", "A classic worship run, slow then fast."), TVG("vowels", "Pure vowels", "Same tone on every vowel."), TVG("diction", "Diction drill", "Clear consonants so every word is understood."), TVG("stac", "Staccato", "Short, bouncy notes from the belly."),
    ] },
    { id: "ear", emoji: "👂", title: "Ear training & pitch", why: "Singing in tune starts with hearing in tune. Train your ear daily — 5 minutes is enough.", items: [
      TI("Scale degrees", "Hear the key, name the note (1–7). The #1 skill for harmony and leading.", "ear", { tab: "deg" }, 5), TI("Intervals", "The distance between two notes. Helps you find harmony parts fast.", "ear", { tab: "int" }, 5), TI("Higher or lower", "Beginner pitch-direction training.", "ear", { tab: "hl" }, 3), TI("In tune?", "Hear if a note is sharp, flat or right on.", "ear", { tab: "tune" }, 4), TI("Pitch tuner", "Sing long notes and watch the needle. Stay within ±15 cents.", "range", {}, 4), TI("Sing scales in 3rds", "Sing up the major scale in 3rds on 'la'.", "scales", { group: "western", scale: "major", pattern: "thirds" }, 5),
    ] },
    { id: "harm", emoji: "🎶", title: "Harmony", why: "Hold your own part while others sing something else. Start with 3rds, grow to 3-part and 4-part.", items: [
      TI("Parallel 3rds above", "The most common harmony line in worship.", "harmony", { drill: "par3up" }, 6), TI("3rds below", "Low harmony under the melody.", "harmony", { drill: "third_below" }, 6), TI("6ths below", "Warm alto/baritone harmony.", "harmony", { drill: "par6down" }, 6), TI("Build the chord (1-3-5)", "Sing each note of the chord and hold it.", "harmony", { drill: "triad" }, 5), TI("1–5–6–4 pads", "Three-part 'ooh' pads over the worship loop.", "harmony", { drill: "prog1564" }, 6), TI("Suspension 4 → 3", "The beautiful 'resolving' harmony.", "harmony", { drill: "sus43" }, 5), TI("Call & response", "Echo the leader — a key worship skill.", "harmony", { drill: "callresp" }, 5), TI("Four-part chorale (SATB)", "Full choir harmony.", "harmony", { drill: "satb" }, 7), TI("Tizita harmony", "Harmony in the Ethiopian pentatonic.", "harmony", { drill: "tizita" }, 6),
    ] },
    { id: "theory", emoji: "📖", title: "Music theory", why: "Understand what the band is saying: keys, numbers, transpose, rhythm.", items: [
      TI("Half steps & whole steps", "The building blocks of every scale and transpose.", "basics", { tab: "steps" }, 5), TI("What does −5 mean?", "Transpose explained for singers.", "basics", { tab: "transpose" }, 5), TI("Keys", "Why a song 'is in G' and how to find the key.", "basics", { tab: "keys" }, 5), TI("The number system", "1 4 5 6m — how the band talks.", "basics", { tab: "numbers" }, 5), TI("Find MY key", "Use your range to choose the right key for you.", "basics", { tab: "mykey" }, 5), TI("Rhythm Lab", "Count, clap and feel the beat.", "rhythm", {}, 6),
    ] },
    { id: "body", emoji: "💪", title: "Body & vocal health", why: "Your body is your instrument. Posture, strength and recovery make your voice last for years.", items: [TRT("sg_body"), TRT("sg_core"), TRT("sg_recover")] },
    { id: "lead", emoji: "🕊️", title: "Leading worship", why: "Beyond notes: meaning, prayer and guiding people.", items: [TRT("sg_lyrics")] },
  ],
  keys: [
    { id: "fingers", emoji: "✋", title: "Finger exercises", why: "Strength, independence and evenness in every finger. 5–10 minutes daily.", items: [TRT("ky_hands"), ...["five", "trills", "thumb", "hanon", "hanon2", "hanon3", "contrary"].map(TKD)] },
    { id: "scales", emoji: "🎼", title: "Scales", why: "Scales train your fingers AND teach your hands every key.", items: [...["scales", "scale", "octhands", "thirds", "sixths", "chrom", "pentarun"].map(TKD), TI("Scale Studies", "Patterns, drones and speed challenge.", "scales", {}, 6)] },
    { id: "chords", emoji: "🎹", title: "Chords & voicings", why: "From simple triads to the colours of modern worship.", items: [...["triads", "inv", "sev", "colour", "spread", "slash"].map(TKD), TI("Chord Library", "Every chord in every key and mode.", "chords", { inst: "piano" }, 5)] },
    { id: "arps", emoji: "🌀", title: "Arpeggios & patterns", why: "Moving patterns make a song flow when you play alone.", items: ["arp", "arp7", "broken", "alberti"].map(TKD) },
    { id: "progs", emoji: "🔁", title: "Progressions", why: "Play the common worship loops in every key until they're automatic.", items: [...["p1451", "circle1564", "p6415", "p1645", "p251", "walkup", "descbass"].map(TKD), TI("Number System", "Progressions in every key, by number.", "numbers", {}, 6)] },
    { id: "lh", emoji: "🤚", title: "Left hand", why: "A strong left hand = a band that feels safe even without bass and drums.", items: ["lhoct", "lh158", "indep"].map(TKD) },
    { id: "worship", emoji: "🙌", title: "Worship playing", why: "Pads, transitions, key changes and the Ethiopian sound.", items: ["pads", "tizrun", "keyup"].map(TKD) },
    { id: "ear", emoji: "👂", title: "Ear & theory", why: "Play what you hear and understand what you play.", items: [TI("Scale degrees", "Name the note in the key.", "ear", { tab: "deg" }, 5), TI("Chord quality", "Major, minor, 7th, sus…", "ear", { tab: "qual" }, 5), TI("Inversions", "Hear root position vs inversions.", "ear", { tab: "inv" }, 5), TI("Music Basics", "Transpose, keys and numbers.", "basics", {}, 5), TI("Metronome", "Play every drill with a click.", "metronome", {}, 5)] },
  ],
  acoustic: [
    { id: "fingers", emoji: "✋", title: "Finger exercises", why: "Clean fretting and independence.", items: [TRT("gt_hands"), TI("Spider 1-2-3-4", "One finger per fret across all strings.", "fingers", { inst: "guitar", ex: "spider" }, 5), TI("Chromatic ladder", "Up the strings, shift, back down.", "fingers", { inst: "guitar", ex: "chromatic" }, 5), TI("Spider walk", "Cross-string independence.", "fingers", { inst: "guitar", ex: "spiderx" }, 5), TI("Stretch 1-3-4", "Builds reach for chords.", "fingers", { inst: "guitar", ex: "stretch" }, 4)] },
    { id: "changes", emoji: "🔄", title: "Chords & changes", why: "Fast, clean chord changes are the #1 skill for rhythm guitar.", items: [TI("G ↔ C", "One-minute changes. Beat your score.", "changes", { a: "G", b: "C" }, 3), TI("C ↔ D", "One-minute changes.", "changes", { a: "C", b: "D" }, 3), TI("D ↔ Em", "One-minute changes.", "changes", { a: "D", b: "Em" }, 3), TI("Em ↔ C", "One-minute changes.", "changes", { a: "Em", b: "C" }, 3), TI("Cadd9 ↔ G", "The worship-guitar favourite.", "changes", { a: "Cadd9", b: "G" }, 3), TI("Shapes & Capo", "Every chord shape in all 12 keys.", "shapes", {}, 6)] },
    { id: "strum", emoji: "🪘", title: "Strumming & rhythm", why: "Your strumming hand is the drummer of an acoustic set.", items: [TRT("gt_rhythm"), ...[["quarters", "Quarter notes"], ["eighths", "Straight 8ths"], ["folk", "Folk / worship"], ["chuck", "Chuck on 2 & 4"], ["push", "Push on the & of 4"], ["six8", "6/8 sway"], ["sixteen", "16th worship drive"]].map(([p, t]) => TI(t, "Play along with real acoustic guitar.", "strum", { pattern: p }, 5)), TI("Metronome", "Any tempo, any time signature.", "metronome", {}, 5)] },
    { id: "capo", emoji: "🧭", title: "Capo & keys", why: "Play in any key the singer needs using easy shapes.", items: [TI("Capo chart", "Which capo for which key.", "chords", {}, 5), TI("Number System", "Think in numbers, play in any key.", "numbers", {}, 6)] },
    { id: "ear", emoji: "👂", title: "Ear & theory", why: "Hear chord changes and know the key.", items: [TI("Chord quality", "Major or minor?", "ear", { tab: "qual" }, 5), TI("Scale degrees", "Hear the number.", "ear", { tab: "deg" }, 5), TI("Music Basics", "Transpose, keys, numbers.", "basics", {}, 5)] },
  ],
  lead: [
    { id: "tech", emoji: "⚡", title: "Technique", why: "Speed, accuracy and clean notes.", items: [TRT("gt_hands"), ...[["spider", "Spider 1-2-3-4"], ["chromatic", "Chromatic ladder"], ["spiderx", "Spider walk"], ["tremolo", "Tremolo picking"], ["legato", "Hammer-on / pull-off chain"]].map(([e, t]) => TI(t, "Animated tab with real sound.", "fingers", { inst: "guitar", ex: e }, 5))] },
    { id: "scales", emoji: "🎼", title: "Scales & positions", why: "Know where the notes are so you can play melodies anywhere.", items: [["penta", "Minor pentatonic box 1"], ["major3nps", "Major scale 3 notes per string"], ["sixths", "6ths in G"], ["arp", "Picked arpeggio"]].map(([e, t]) => TI(t, "Animated tab with real sound.", "fingers", { inst: "guitar", ex: e }, 5)).concat([TI("Scale Studies", "Every scale with drones.", "scales", {}, 6)]) },
    { id: "expr", emoji: "🎚️", title: "Expression & tone", why: "Bends, dynamics and effects that serve the song.", items: [TI("Bend targets", "Bend in tune to the target note.", "fingers", { inst: "guitar", ex: "bend" }, 5), TI("Reverb & Delay Lab", "Dotted-8th delay and ambient swells.", "fx", {}, 6)] },
    { id: "ear", emoji: "👂", title: "Ear & melody", why: "Play back what you hear.", items: [TI("Intervals", "Hear the distance.", "ear", { tab: "int" }, 5), TI("Scale degrees", "Name the note.", "ear", { tab: "deg" }, 5), TI("Metronome", "Play every lick with a click.", "metronome", {}, 5)] },
  ],
  bass: [
    { id: "fingers", emoji: "✋", title: "Hands & fretboard", why: "Even plucking and a solid fretting hand.", items: [TRT("gt_hands"), TI("Open-string plucking", "Alternate index and middle fingers.", "fingers", { inst: "bass", ex: "bassopen" }, 4), TI("Bass chromatic 1-2-3-4", "One finger per fret.", "fingers", { inst: "bass", ex: "bassspider" }, 5), TI("Octave pops", "Root and octave.", "fingers", { inst: "bass", ex: "bassoct" }, 4)] },
    { id: "groove", emoji: "🎵", title: "Grooves & locking", why: "The bass glues the drums to the harmony.", items: [["roots8", "Root 8ths"], ["kicklock", "Lock with the kick"], ["r58", "Root–5–8"], ["approach", "Approach notes"], ["pedal", "Pedal tone build"], ["six8", "6/8 bounce"]].map(([p, t]) => TI(t, "Real bass + drums.", "basslab", { pattern: p }, 5)).concat([TI("Groove Lab", "Real kit drum machine to play along with.", "groove", {}, 5)]) },
    { id: "notes", emoji: "🎼", title: "Scales & notes", why: "Know the notes of every chord.", items: [TI("Root–5–octave", "On G, C, D.", "fingers", { inst: "bass", ex: "bass158" }, 4), TI("Major scale — one octave", "G major.", "fingers", { inst: "bass", ex: "bassmajor" }, 5), TI("Scale Studies", "All scales.", "scales", {}, 5), TI("Number System", "Play by numbers.", "numbers", {}, 5)] },
    { id: "time", emoji: "⏱️", title: "Time & feel", why: "Rock-solid time.", items: [TI("Metronome", "Gap click & speed trainer.", "metronome", {}, 5), TI("Rhythm Lab", "Count and feel subdivisions.", "rhythm", {}, 6), TI("Hear the root", "Scale degrees ear training.", "ear", { tab: "deg" }, 5)] },
  ],
  drums: [
    { id: "time", emoji: "⏱️", title: "Time & tempo", why: "The drummer owns the time. Practise with the click every day.", items: [TI("Metronome", "Any tempo, any time signature, accents, subdivisions.", "metronome", {}, 5), TI("Speed trainer", "Click speeds up every few bars — build speed with control.", "metronome", { mode: "trainer" }, 6), TI("Gap click", "Click goes silent — keep perfect time inside.", "metronome", { mode: "gap" }, 6), TI("Rhythm Lab", "Subdivisions, odd meters, polyrhythms.", "rhythm", {}, 6)] },
    { id: "rudiments", emoji: "🥁", title: "Rudiments & stick control", why: "Rudiments are the scales of drumming.", items: [TRT("dr_wrists"), TRT("dr_pad"), ...[["singles", "Single stroke roll"], ["doubles", "Double stroke roll"], ["paradiddle", "Paradiddle"], ["dbl", "Double paradiddle"], ["trip", "Triplets"], ["six", "Six-stroke roll"], ["accent", "Accent tap"], ["flamtap", "Flam taps"]].map(([r, t]) => TI(t, "Sticking, accents and tempo ramps.", "rudiments", { r }, 5))] },
    { id: "grooves", emoji: "🎵", title: "Grooves", why: "Worship grooves you'll play every Saturday.", items: [["basic", "Basic worship 4/4"], ["pop", "Worship pop"], ["four", "Four on the floor"], ["half", "Half-time build"], ["ghost", "Gospel ghost notes"], ["ballad", "Ballad 6/8"], ["chik", "Ethiopian 6/8"], ["shuf", "Gospel shuffle"]].map(([g, t]) => TI(t, "Real kit — play along.", "groove", { id: g }, 5)) },
    { id: "fills", emoji: "💥", title: "Fills & transitions", why: "Fills tell the band where we're going.", items: [TRT("dr_fills"), TI("Groove + fill", "2-bar groove and fill.", "groove", { id: "fill" }, 5), TI("Tom-driven build", "Bridge builds.", "groove", { id: "toms" }, 5)] },
    { id: "feet", emoji: "🦶", title: "Feet & coordination", why: "Kick and hi-hat foot independence.", items: [TRT("dr_feet")] },
    { id: "dyn", emoji: "🔊", title: "Dynamics", why: "Serve the song: soft verses, big choruses, smooth builds.", items: [TRT("dr_dyn")] },
    { id: "ear", emoji: "👂", title: "Ear & feel", why: "Hear tempo and rhythm instantly.", items: [TI("Rhythm Lab", "Read, count and tap rhythms.", "rhythm", {}, 6), TI("Odd meters", "7/8, 5/4 — feel the groupings with the metronome.", "metronome", { sig: [7, 8] }, 5)] },
  ],
  sound: [
    { id: "flow", emoji: "🔌", title: "Signal flow & gain", why: "Know where every signal goes.", items: [TI("Signal Flow & Gain", "Mic → console → speakers.", "flow", {}, 6), TRT("sd_line")] },
    { id: "eq", emoji: "🎛️", title: "EQ", why: "Make room for every instrument.", items: [TI("7-Band EQ Lab", "Real audio + ear quiz.", "eq7", {}, 8)] },
    { id: "dyn", emoji: "🗜️", title: "Dynamics & FX", why: "Compression, reverb and delay that serve the song.", items: [TI("Compression Lab", "On real audio.", "comp", {}, 6), TI("Reverb & Delay Lab", "Space and tempo delays.", "fx", {}, 6)] },
    { id: "mix", emoji: "🎚️", title: "Mixing", why: "Put it all together.", items: [TI("Mixing Console", "6 demo songs.", "mixer", {}, 10), TRT("sd_listen")] },
  ],
};

/* ---------- 4) TRAINING PACKAGES (gym-style splits) ---------- */
const TPK = (id, roles, day, title, desc, level, blocks) => ({ id, roles, day, level, title, desc, pack: true, blocks });
const PACKS = [
  TPK("pk_sg1", ["singer"], "Day 1", "Breath & Body", "Posture, release, core support and long breaths.", 0, [S("Body warm-up", 5, "routine", { id: "sg_body" }, "Release neck, jaw, tongue and ribs before you make a sound."), S("Breath basics", 4, "breath", { level: 0 }, "Calm breaths, then the support hiss. Shoulders stay still."), S("Breath builder", 5, "breath", { level: 1 }, "Longer exhales — keep the ribs wide."), S("Support pulses", 3, "vocalgym", { ex: "ts" }, "Short 'ts' pulses from the belly."), S("Messa di voce", 4, "vocalgym", { ex: "messa" }, "Soft → loud → soft on one note."), S("Sustain challenge", 3, "breath", { level: 3, tab: "sustain" }, "Beat your best time.")]),
  TPK("pk_sg2", ["singer"], "Day 2", "Tone & Resonance", "Free, warm, ringing tone.", 0, [S("Release", 3, "vocalgym", { ex: "yawn" }, "Yawn-sighs from high to low."), S("Lip trills", 4, "vocalgym", { ex: "liptrill5" }, "Bubbling lips, steady air."), S("Straw", 4, "vocalgym", { ex: "straw" }, "Sing through a straw: gentle and efficient."), S("Humming 1-3-5", 4, "vocalgym", { ex: "hum135" }, "Feel the buzz on lips and nose."), S("'Ng' & 'Nay'", 5, "vocalgym", { ex: "nay" }, "Bright and forward."), S("Pure vowels", 4, "vocalgym", { ex: "vowels" }, "Same tone on every vowel."), S("Cool-down", 2, "vocalgym", { ex: "coolhum" }, "Soft descending hums.")]),
  TPK("pk_sg3", ["singer"], "Day 3", "Range & Power", "Smooth registers, safe belting.", 2, [S("Body warm-up", 4, "routine", { id: "sg_body" }, "Loosen up."), S("Sirens", 5, "vocalgym", { ex: "siren" }, "Through the break without flipping."), S("Octave Nay", 5, "vocalgym", { ex: "octnay" }, "Bratty and small, not loud."), S("Whoops", 4, "vocalgym", { ex: "whoop" }, "Light head-voice slides."), S("Mix & belt", 5, "vocalgym", { ex: "hey" }, "Speech-like power. Stop if it scratches."), S("Range check", 3, "range", {}, "Note your highest comfortable note."), S("Cool-down", 2, "vocalgym", { ex: "cooltrill" }, "Easy trills down.")]),
  TPK("pk_sg4", ["singer"], "Day 4", "Ear & Pitch", "Hear it, then sing it right.", 1, [S("Hum warm-up", 3, "vocalgym", { ex: "hum1" }, "Gentle hum."), S("Scale degrees", 6, "ear", { tab: "deg" }, "Name the degree, then sing it."), S("Intervals", 6, "ear", { tab: "int" }, "Sing each interval back."), S("In tune?", 4, "ear", { tab: "tune" }, "Sharp, flat or right on."), S("Pitch tuner", 5, "range", {}, "Long notes within ±15 cents."), S("Scales in 3rds", 4, "scales", { group: "western", scale: "major", pattern: "thirds" }, "Slow and accurate.")]),
  TPK("pk_sg5", ["singer"], "Day 5", "Harmony Day", "3rds, 6ths and 3-part pads.", 2, [S("Warm-up", 4, "vocalgym", { ex: "nay" }, "Bright arpeggios."), S("3rds above", 6, "harmony", { drill: "par3up" }, "Mute your part and sing it alone."), S("3rds below", 5, "harmony", { drill: "third_below" }, "Low harmony."), S("6ths below", 5, "harmony", { drill: "par6down" }, "Warm low line."), S("1–5–6–4 pads", 6, "harmony", { drill: "prog1564" }, "Pick a part and hold it."), S("Suspension 4→3", 4, "harmony", { drill: "sus43" }, "Feel the resolve.")]),
  TPK("pk_sg6", ["singer"], "Day 6", "Agility & Runs", "Clean runs and Ethiopian qenet.", 3, [S("Lip-trill arpeggios", 4, "vocalgym", { ex: "liptrillarp" }, "Connect breath and pitch."), S("1-2-3-2-1", 5, "vocalgym", { ex: "run123" }, "Slow first, then faster."), S("Pentatonic run", 5, "vocalgym", { ex: "penta" }, "Even notes, no 'h'."), S("Gospel run", 5, "vocalgym", { ex: "gospel" }, "Classic worship run."), S("Tizita run", 5, "vocalgym", { ex: "tizrun" }, "Ethiopian pentatonic."), S("Cool-down", 2, "vocalgym", { ex: "cooltrill" }, "Easy.")]),
  TPK("pk_sg7", ["singer"], "Rest day", "Recovery & Theory", "Rest the voice, grow the mind.", 0, [S("Vocal recovery", 6, "routine", { id: "sg_recover" }, "Steam, straw, silence."), S("Music Basics: numbers", 6, "basics", { tab: "numbers" }, "Learn how the band talks."), S("Lyrics & meaning", 5, "routine", { id: "sg_lyrics" }, "Study Saturday's songs.")]),
  TPK("pk_sgq", ["singer"], "Quick 15", "Before rehearsal", "15 minutes to be ready to sing.", 0, [S("Body", 3, "routine", { id: "sg_body" }, "Quick release."), S("Lip trills", 3, "vocalgym", { ex: "liptrill5" }, "Wake the voice."), S("Hum", 3, "vocalgym", { ex: "hum135" }, "Find the buzz."), S("Sirens", 3, "vocalgym", { ex: "siren" }, "Open the range."), S("Bright Nay", 3, "vocalgym", { ex: "nay" }, "Ready to sing.")]),

  TPK("pk_ky1", ["keys"], "Day 1", "Fingers & Scales", "Strength, evenness and every key.", 0, [S("Hand warm-up", 3, "routine", { id: "ky_hands" }, "Warm hands play better."), S("Five-finger patterns", 4, "keysdrills", { drill: "five" }, "Curved fingers."), S("Finger trills", 4, "keysdrills", { drill: "trills" }, "Extra reps on 3-4 and 4-5."), S("Hanon #1", 5, "keysdrills", { drill: "hanon" }, "Even and slow."), S("Scale trainer", 7, "keysdrills", { drill: "scales" }, "Your key, 2 octaves, both hands."), S("Contrary motion", 4, "keysdrills", { drill: "contrary" }, "Hands mirror each other.")]),
  TPK("pk_ky2", ["keys"], "Day 2", "Chords & Inversions", "Smooth voicings and colours.", 1, [S("Triad ladder", 5, "keysdrills", { drill: "triads" }, "Name each chord."), S("Inversions", 6, "keysdrills", { drill: "inv" }, "Root, 1st, 2nd."), S("7th chords", 6, "keysdrills", { drill: "sev" }, "Say each name."), S("Sus & add9", 5, "keysdrills", { drill: "colour" }, "Hear the colours."), S("Spread voicing", 5, "keysdrills", { drill: "spread" }, "Big chorus sound.")]),
  TPK("pk_ky3", ["keys"], "Day 3", "Progressions in all keys", "Worship loops until they're automatic.", 1, [S("1–4–5–1", 5, "keysdrills", { drill: "p1451" }, "With bass."), S("1–5–6–4", 6, "keysdrills", { drill: "circle1564" }, "Voice-led."), S("6–4–1–5", 5, "keysdrills", { drill: "p6415" }, "Emotional loop."), S("2–5–1", 5, "keysdrills", { drill: "p251" }, "With 7ths."), S("Walk-up", 5, "keysdrills", { drill: "walkup" }, "Into the chorus."), S("Number System", 4, "numbers", {}, "Any key by number.")]),
  TPK("pk_ky4", ["keys"], "Day 4", "Left hand & Grooves", "A left hand the band can lean on.", 1, [S("LH octaves", 5, "keysdrills", { drill: "lhoct" }, "Steady roots."), S("LH 1-5-8", 5, "keysdrills", { drill: "lh158" }, "Quarter-note pulse."), S("Broken chord", 5, "keysdrills", { drill: "broken" }, "Ballad pattern."), S("Alberti bass", 5, "keysdrills", { drill: "alberti" }, "Moving accompaniment."), S("Independence", 6, "keysdrills", { drill: "indep" }, "Count out loud.")]),
  TPK("pk_ky5", ["keys"], "Day 5", "Worship playing", "Pads, runs and key changes.", 2, [S("Pad swells", 6, "keysdrills", { drill: "pads" }, "Soft, sustained."), S("Slash chords", 5, "keysdrills", { drill: "slash" }, "Bass walks up."), S("Descending bass", 5, "keysdrills", { drill: "descbass" }, "Bridges and endings."), S("Tizita run", 5, "keysdrills", { drill: "tizrun" }, "Ethiopian colour."), S("Key change", 4, "keysdrills", { drill: "keyup" }, "Last-chorus lift.")]),
  TPK("pk_ky6", ["keys"], "Day 6", "Ear & Theory", "Hear it, name it, play it.", 1, [S("Scale degrees", 6, "ear", { tab: "deg" }, "Then find it on the keys."), S("Chord quality", 6, "ear", { tab: "qual" }, "Major, minor, 7th…"), S("Inversions", 5, "ear", { tab: "inv" }, "Which inversion?"), S("Music Basics", 5, "basics", { tab: "numbers" }, "Numbers & transpose.")]),
  TPK("pk_kyq", ["keys"], "Quick 15", "Before rehearsal", "Ready to play in 15.", 0, [S("Hand warm-up", 2, "routine", { id: "ky_hands" }, ""), S("Five-finger", 3, "keysdrills", { drill: "five" }, ""), S("Scale in today's key", 4, "keysdrills", { drill: "scales" }, ""), S("1–5–6–4", 3, "keysdrills", { drill: "circle1564" }, ""), S("Pads", 3, "keysdrills", { drill: "pads" }, "")]),

  TPK("pk_ac1", ["acoustic"], "Day 1", "Fingers & Changes", "Clean fretting, fast changes.", 0, [S("Hand care", 3, "routine", { id: "gt_hands" }, ""), S("Spider", 5, "fingers", { inst: "guitar", ex: "spider" }, "Start at 60 bpm."), S("G ↔ C", 3, "changes", { a: "G", b: "C" }, "Beat yesterday."), S("C ↔ D", 3, "changes", { a: "C", b: "D" }, ""), S("D ↔ Em", 3, "changes", { a: "D", b: "Em" }, ""), S("Cadd9 ↔ G", 3, "changes", { a: "Cadd9", b: "G" }, "")]),
  TPK("pk_ac2", ["acoustic"], "Day 2", "Strumming & Groove", "Lock with the click.", 0, [S("Strumming stamina", 6, "routine", { id: "gt_rhythm" }, ""), S("Folk pattern", 5, "strum", { pattern: "folk" }, ""), S("Chuck on 2 & 4", 5, "strum", { pattern: "chuck" }, ""), S("6/8 sway", 5, "strum", { pattern: "six8" }, ""), S("16th drive", 5, "strum", { pattern: "sixteen" }, "")]),
  TPK("pk_ac3", ["acoustic"], "Day 3", "Capo, Keys & Numbers", "Play in any key the singer needs.", 1, [S("Shapes & capo", 7, "shapes", {}, "Learn one new key."), S("Capo chart", 5, "chords", {}, "Which capo for which key."), S("Number System", 6, "numbers", {}, "1 4 5 6m in 3 keys."), S("Chord quality ear", 5, "ear", { tab: "qual" }, "Major or minor?")]),
  TPK("pk_acq", ["acoustic"], "Quick 15", "Before rehearsal", "", 0, [S("Hand care", 2, "routine", { id: "gt_hands" }, ""), S("Spider", 3, "fingers", { inst: "guitar", ex: "spider" }, ""), S("Changes", 3, "changes", { a: "G", b: "C" }, ""), S("Strumming", 5, "strum", { pattern: "folk" }, "")]),

  TPK("pk_ld1", ["lead"], "Day 1", "Technique", "Speed and accuracy.", 1, [S("Hand care", 3, "routine", { id: "gt_hands" }, ""), S("Chromatic", 5, "fingers", { inst: "guitar", ex: "chromatic" }, ""), S("Tremolo", 5, "fingers", { inst: "guitar", ex: "tremolo" }, ""), S("Legato", 5, "fingers", { inst: "guitar", ex: "legato" }, ""), S("Metronome speed-up", 5, "metronome", { mode: "trainer" }, "Pick your hardest lick.")]),
  TPK("pk_ld2", ["lead"], "Day 2", "Scales & Melody", "Know the neck.", 1, [S("Pentatonic box 1", 5, "fingers", { inst: "guitar", ex: "penta" }, ""), S("Major 3nps", 6, "fingers", { inst: "guitar", ex: "major3nps" }, ""), S("6ths", 5, "fingers", { inst: "guitar", ex: "sixths" }, ""), S("Intervals ear", 5, "ear", { tab: "int" }, "")]),
  TPK("pk_ld3", ["lead"], "Day 3", "Expression & Tone", "Serve the song.", 2, [S("Bends", 5, "fingers", { inst: "guitar", ex: "bend" }, "In tune!"), S("Reverb & delay", 7, "fx", {}, "Dotted-8th delay."), S("Arpeggios", 5, "fingers", { inst: "guitar", ex: "arp" }, "")]),

  TPK("pk_bs1", ["bass"], "Day 1", "Hands & Fretboard", "", 0, [S("Hand care", 3, "routine", { id: "gt_hands" }, ""), S("Open-string plucking", 4, "fingers", { inst: "bass", ex: "bassopen" }, ""), S("Chromatic", 5, "fingers", { inst: "bass", ex: "bassspider" }, ""), S("Root–5–8", 5, "fingers", { inst: "bass", ex: "bass158" }, ""), S("Major scale", 5, "fingers", { inst: "bass", ex: "bassmajor" }, "")]),
  TPK("pk_bs2", ["bass"], "Day 2", "Lock with the drums", "", 0, [S("Root 8ths", 5, "basslab", { pattern: "roots8" }, ""), S("Lock with the kick", 6, "basslab", { pattern: "kicklock" }, ""), S("Root–5–8", 5, "basslab", { pattern: "r58" }, ""), S("6/8 bounce", 5, "basslab", { pattern: "six8" }, "")]),
  TPK("pk_bs3", ["bass"], "Day 3", "Notes & Time", "", 1, [S("Approach notes", 6, "basslab", { pattern: "approach" }, ""), S("Pedal tone", 5, "basslab", { pattern: "pedal" }, ""), S("Gap click", 5, "metronome", { mode: "gap" }, ""), S("Scale degrees", 5, "ear", { tab: "deg" }, "")]),

  TPK("pk_dr1", ["drums"], "Day 1", "Hands (rudiments)", "Stick control like a gym session for your hands.", 0, [S("Wrist warm-up", 3, "routine", { id: "dr_wrists" }, ""), S("Pad routine", 7, "routine", { id: "dr_pad" }, ""), S("Paradiddle", 5, "rudiments", { r: "paradiddle" }, ""), S("Doubles", 5, "rudiments", { r: "doubles" }, ""), S("Flam taps", 5, "rudiments", { r: "flamtap" }, "")]),
  TPK("pk_dr2", ["drums"], "Day 2", "Time (click day)", "Make the click disappear.", 0, [S("Metronome quarters", 4, "metronome", {}, "Play only quarter notes and 'bury' the click."), S("Subdivisions", 5, "metronome", {}, "Switch to 8ths, triplets, 16ths."), S("Speed trainer", 6, "metronome", { mode: "trainer" }, "Groove from 60 to 100."), S("Gap click", 6, "metronome", { mode: "gap" }, "2 bars on, 2 bars off."), S("Rhythm Lab", 5, "rhythm", {}, "")]),
  TPK("pk_dr3", ["drums"], "Day 3", "Grooves", "Worship grooves you'll play on Saturday.", 0, [S("Basic 4/4", 5, "groove", { id: "basic" }, ""), S("Worship pop", 5, "groove", { id: "pop" }, ""), S("Half-time", 5, "groove", { id: "half" }, ""), S("Ballad 6/8", 5, "groove", { id: "ballad" }, ""), S("Ethiopian 6/8", 5, "groove", { id: "chik" }, "")]),
  TPK("pk_dr4", ["drums"], "Day 4", "Fills & Transitions", "Land on 1 every time.", 1, [S("Fills routine", 6, "routine", { id: "dr_fills" }, ""), S("Groove + fill", 6, "groove", { id: "fill" }, ""), S("Tom build", 5, "groove", { id: "toms" }, ""), S("Six-stroke roll", 5, "rudiments", { r: "six" }, "")]),
  TPK("pk_dr5", ["drums"], "Day 5", "Feet & Dynamics", "Control from whisper to roar.", 1, [S("Feet routine", 6, "routine", { id: "dr_feet" }, ""), S("Dynamics ladder", 5, "routine", { id: "dr_dyn" }, ""), S("Gospel ghost notes", 5, "groove", { id: "ghost" }, "")]),
  TPK("pk_drq", ["drums"], "Quick 15", "Before rehearsal", "", 0, [S("Wrists", 3, "routine", { id: "dr_wrists" }, ""), S("Singles & doubles", 4, "rudiments", { r: "singles" }, ""), S("Groove with click", 5, "groove", { id: "basic" }, ""), S("Gap click", 3, "metronome", { mode: "gap" }, "")]),

  TPK("pk_sd1", ["sound"], "Day 1", "Ears", "Train your ears like an engineer.", 1, [S("EQ ear quiz", 8, "eq7", {}, ""), S("Critical listening", 5, "routine", { id: "sd_listen" }, "")]),
  TPK("pk_sd2", ["sound"], "Day 2", "Gain, EQ & Dynamics", "", 1, [S("Signal flow & gain", 6, "flow", {}, ""), S("Compression", 6, "comp", {}, ""), S("Reverb & delay", 6, "fx", {}, "")]),
  TPK("pk_sd3", ["sound"], "Day 3", "Full mix", "", 2, [S("Line-check routine", 6, "routine", { id: "sd_line" }, ""), S("Mixing console", 12, "mixer", {}, "Build a full mix in order: drums, bass, keys, guitars, vocals.")]),
];
PACKS.forEach((p) => { if (!SESSIONS.some((s) => s.id === p.id)) SESSIONS.push(p); });
const sessMins = (s) => s.blocks.reduce((a, b) => a + b.mins, 0);
const packsFor = (rid) => PACKS.filter((p) => p.roles.includes(rid));
/* today's suggested package: rotate through the split by weekday */
const todaysPack = (rid) => { const list = packsFor(rid).filter((p) => p.day.startsWith("Day")); if (!list.length) return null; const d = new Date().getDay(); return list[(d + 6) % 7 % list.length]; };

/* ---------- 5) "Try it now" singing check used inside lessons ---------- */
function SingCheck({ notes = [60, 64, 67], label }) {
  const { T } = useApp();
  const [i, setI] = useState(0); const [on, setOn] = useState(false); const [cur, setCur] = useState(null); const [ok, setOk] = useState({}); const [err, setErr] = useState("");
  const st = useRef({ hold: 0 }); const target = notes[i];
  useEffect(() => {
    if (!on) return; let stream = null, raf = 0, stop = false;
    (async () => { try {
      const c = AE.get(); stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true } }); if (stop) return;
      const src = c.createMediaStreamSource(stream); const an = c.createAnalyser(); an.fftSize = 4096; src.connect(an); AE.listen(an); const buf = new Float32Array(4096); const sm = makePitchSmoother(5); let fr = 0;
      const loop = () => { raf = requestAnimationFrame(loop); if ((fr++) % 3) return; an.getFloatTimeDomainData(buf); const f = detectPitch(buf, c.sampleRate);
        if (f > 60 && f < 1400 && detectPitch.conf > 0.8) { const m = sm(ftom(f, AE.settings.a4)); const tgt = st.current.target; let d = (m - tgt) % 12; if (d > 6) d -= 12; if (d < -6) d += 12; const cents = Math.round(d * 100); setCur({ m, cents });
          if (Math.abs(cents) <= 30) { st.current.hold++; if (st.current.hold >= 12) { st.current.hold = 0; setOk((o) => ({ ...o, [st.current.idx]: true })); AE.chord([72, 76, 79], 0.4); } } else st.current.hold = 0;
        } else { sm(null); setCur(null); st.current.hold = 0; } };
      loop(); } catch (e) { setErr(AE.micErr(e)); setOn(false); } })();
    return () => { stop = true; cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, [on]);
  st.current.target = target; st.current.idx = i;
  const c = cur ? cur.cents : null;
  return (
    <div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>{notes.map((m, k) => <Chip key={k} active={i === k} onClick={() => { setI(k); AE.play("piano", m, 1.4, 0, 0.8); }}>{ok[k] ? "✓ " : ""}{nn(m)}</Chip>)}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: T.sub }}>{label || "Play the note, then sing it (any octave) and hold it steady."}</div>
          <div style={{ position: "relative", height: 14, borderRadius: 9, background: T.card2, marginTop: 8 }}>
            <div style={{ position: "absolute", left: "35%", width: "30%", top: 0, bottom: 0, background: T.good + "44", borderRadius: 9 }} />
            {c != null && <div style={{ position: "absolute", top: -3, width: 6, height: 20, borderRadius: 4, left: `calc(${50 + Math.max(-50, Math.min(50, c))}% - 3px)`, background: Math.abs(c) <= 30 ? T.good : T.bad, transition: "left .08s" }} />}
          </div>
          <div style={{ fontSize: 12, marginTop: 6, fontWeight: 700 }}>{!on ? " " : c == null ? "Listening… sing now" : Math.abs(c) <= 30 ? "In tune — hold it! ✓" : c > 0 ? `A little high (+${c} cents)` : `A little low (${c} cents)`}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Btn small variant="soft" icon={Play} onClick={() => AE.play("piano", target, 1.6, 0, 0.8)}>Hear</Btn>
          <Btn small variant={on ? "light" : "accent"} icon={Mic} onClick={() => setOn((o) => !o)}>{on ? "Stop" : "Sing"}</Btn>
        </div>
      </div>
      {err && <div style={{ fontSize: 12, color: T.bad, marginTop: 6 }}>{err}</div>}
      {Object.keys(ok).length === notes.length && <div style={{ fontSize: 13, fontWeight: 800, color: T.good, marginTop: 8 }}>All notes matched! 🎉</div>}
    </div>
  );
}

/* ---------- 6) singer lessons: the big idea + try-it-now (clear and simple) ---------- */
const SG_KEYS = {
  sg_instrument: ["Your voice has 3 parts: breath (power), vocal folds (sound) and your mouth/throat (tone).", "Every vocal problem comes from one of the three — so we train all three.", "Your body is the instrument: sleep, water and posture change how you sound."],
  sg_breath: ["Breathe LOW: belly and lower ribs move, shoulders stay still.", "Support = letting the air out slowly and evenly, not pushing.", "Plan where you breathe in every song."],
  sg_health: ["Warm up before every rehearsal (5–10 min), cool down after.", "Water all day, sleep, and rest when the voice is tired.", "Pain or hoarseness for 2+ weeks? Tell a leader and see a doctor."],
  sg_pitch: ["Singing in tune starts with HEARING in tune.", "Listen first, then sing — and check yourself with the tuner.", "5 minutes of ear training a day changes everything."],
  sg_vowels: ["Tone lives in the vowels: keep them pure and open.", "A relaxed jaw and lifted soft palate (start of a yawn) = warm sound.", "The team blends when everyone sings the SAME vowel shape."],
  sg_registers: ["Chest voice is low and speech-like; head voice is high and light.", "The 'break' is where they meet — a mixed voice smooths it.", "Sirens and lip trills teach the voice to cross the break without cracking."],
  sg_range: ["Your range is where you can sing; your comfort zone is where you should LEAD.", "Voice type (soprano, alto, tenor, baritone, bass) tells you which part to sing.", "Choose song keys that fit your comfortable range."],
  sg_harmony1: ["Harmony = a different note that sounds good WITH the melody.", "3rds above and 6ths below are the most common worship harmonies.", "To hold your part: know your starting note and listen to the chord, not the melody."],
  sg_harmony2: ["Three-part harmony builds the whole chord: 1, 3 and 5.", "On 1–4–5 and 1–5–6–4, each singer moves to the CLOSEST note.", "Blend: match volume, vowel and vibrato with the team."],
  sg_phrasing: ["Clear words: crisp consonants, open vowels.", "A phrase has a shape — it grows toward the important word.", "Dynamics (soft → strong) tell the story of the song."],
  sg_agility: ["Runs are scales and patterns sung quickly and cleanly.", "Practise slow first, then speed up — never the other way around.", "Less is more: a run must serve the worship, not show off."],
  sg_power: ["Power comes from breath and resonance, not from squeezing the throat.", "Belting is a bright, speech-like 'call' — 'Hey!' not a scream.", "If it hurts or scratches, stop. Healthy power never hurts."],
  sg_mic: ["Keep the mic 2–5 cm from your mouth and pointed at it.", "Pull back a little on loud notes, come closer on soft ones.", "Tell the sound team what you need in your monitor — clearly and kindly."],
  sg_lead: ["Leading worship = leading people to Jesus, not performing.", "Prepare the flow and transitions; keep cues short and clear.", "Watch the room and follow the Holy Spirit — with the team, not alone."],
  sg_arrange: ["Give each singer a clear part: melody, high harmony, low harmony.", "Start simple (unison), add harmony where the song grows.", "Teach parts slowly with numbers (1-3-5) and record them for the team."],
};
const SG_TRY = {
  sg_instrument: [[60, 67], "Hear C, then G. Sing each one — feel your voice adjust by itself."],
  sg_pitch: [[60, 62, 64, 65, 67], "Sing up the scale: Do-Re-Mi-Fa-Sol. Hold each note until it turns green."],
  sg_registers: [[57, 62, 69], "Low, middle, high: notice where your voice changes. Keep it smooth."],
  sg_range: [[55, 60, 64, 67], "Find which of these notes feel easy for you."],
  sg_harmony1: [[64, 67, 69], "The melody is C. Sing the 3rd above (E), then the 5th (G), then the 6th (A)."],
  sg_vowels: [[62, 62, 62], "Sing D on 'ee', 'eh', 'ah' — keep the pitch exactly the same while the vowel changes."],
};
Object.entries(SG_KEYS).forEach(([id, k]) => { if (LESSONS[id]) LESSONS[id].key = k; });
Object.entries(SG_TRY).forEach(([id, [ns, cap]]) => { const L0 = LESSONS[id]; if (!L0 || L0.body.some((b) => b[0] === "w" && b[1] === "singcheck")) return; const at = Math.max(1, L0.body.findIndex((b, i) => i > 0 && b[0] === "h")); L0.body.splice(at, 0, ["w", "singcheck", { notes: ns }, "🎤 Try it now: " + cap]); });

/* ---------- more guided sessions for every team ---------- */
const MORE_SESSIONS = [
  { id: "sg_pitch", roles: ["singer"], level: 1, title: "Pitch Precision", desc: "Train your ear and land every note dead-on.", blocks: [S("Hum warm-up", 3, "vocalgym", { ex: "hum1" }, "Gentle hums to wake the voice."), S("Lip trills 5-tone", 4, "vocalgym", { ex: "liptrill5" }, "Smooth and even."), S("Higher or lower", 4, "ear", { tab: "hl" }, "Warm up the ear."), S("In tune?", 5, "ear", { tab: "tune" }, "Sharp, flat or right on."), S("Pitch tuner", 6, "range", {}, "Hold 1, 3, 5 in tune for 4 s each."), S("Scales in 3rds", 5, "scales", { group: "western", scale: "major", pattern: "thirds" }, "Turn on 'Sing along — I listen'."), S("Cool-down", 3, "vocalgym", { ex: "coolhum" }, "Soft descending hums.")] },
  { id: "sg_lead", roles: ["singer"], level: 3, title: "Worship Leader Prep", desc: "Voice, lyrics and flow — ready to lead on Saturday.", blocks: [S("Body warm-up", 5, "routine", { id: "sg_body" }, "Release tension."), S("Resonance", 4, "vocalgym", { ex: "nay" }, "Bright, forward tone."), S("Mix & power", 5, "vocalgym", { ex: "hey" }, "Speech-like power for choruses."), S("Lyrics & meaning", 6, "routine", { id: "sg_lyrics" }, "Study this week's songs."), S("Call & response", 5, "harmony", { drill: "callresp" }, "Lead the echo clearly."), S("Cool-down", 3, "vocalgym", { ex: "cooltrill" }, "Easy trills.")] },
  { id: "sg_diction", roles: ["singer"], level: 2, title: "Diction & Expression", desc: "Clear words, pure vowels, dynamics that tell the story.", blocks: [S("Jaw & tongue release", 3, "vocalgym", { ex: "jaw" }, "Loose jaw, free tongue."), S("Pure vowels", 5, "vocalgym", { ex: "vowels" }, "Same tone on every vowel."), S("Vowels on 1-3-5", 5, "vocalgym", { ex: "vowel135" }, "Keep the vowel shape as you move."), S("Diction drill", 5, "vocalgym", { ex: "diction" }, "Crisp consonants."), S("Staccato", 4, "vocalgym", { ex: "stac" }, "Short, bouncy, from the belly."), S("Messa di voce", 5, "vocalgym", { ex: "messa" }, "Soft → loud → soft."), S("Cool-down", 3, "vocalgym", { ex: "coolhum" }, "Hums.")] },
  { id: "sg_choir", roles: ["singer"], level: 4, title: "Choir Blend Lab", desc: "Three and four parts that sound like one voice.", blocks: [S("Warm-up", 4, "vocalgym", { ex: "liptrillarp" }, "Lip-trill arpeggios."), S("Build the chord", 5, "harmony", { drill: "triad" }, "Each part holds its note."), S("1–4–5–1 in three parts", 6, "harmony", { drill: "prog1451" }, "Turn on 'Listen to me' on your part."), S("'Amen' cadence", 4, "harmony", { drill: "amen" }, "4 → 1."), S("SATB chorale", 7, "harmony", { drill: "satb" }, "Pick your voice part."), S("Cool-down", 3, "breath", { level: 0 }, "Slow breathing and thanks.")] },

  { id: "ky_lefthand", roles: ["keys"], level: 1, title: "Left Hand Power", desc: "A left hand the whole band can lean on.", blocks: [S("Hand warm-up", 3, "routine", { id: "ky_hands" }, ""), S("LH octaves", 6, "keysdrills", { drill: "lhoct" }, "Steady roots."), S("LH 1-5-8 pulse", 6, "keysdrills", { drill: "lh158" }, "Quarter notes."), S("Broken chords", 6, "keysdrills", { drill: "broken" }, "Ballad pattern."), S("Independence", 6, "keysdrills", { drill: "indep" }, "Count out loud.")] },
  { id: "ky_gospel", roles: ["keys"], level: 3, title: "Gospel & Worship Moves", desc: "Walk-ups, 2-5-1s and slash-chord bass lines.", blocks: [S("7th chords", 6, "keysdrills", { drill: "sev" }, "Say every name."), S("2–5–1", 6, "keysdrills", { drill: "p251" }, "Smooth voice-leading."), S("Gospel walk-up", 6, "keysdrills", { drill: "walkup" }, "Into the chorus."), S("Descending bass", 6, "keysdrills", { drill: "descbass" }, "Bridges and endings."), S("Slash chords", 5, "keysdrills", { drill: "slash" }, "1 – 1/3 – 4 – 5.")] },
  { id: "ky_allkeys", roles: ["keys"], level: 2, title: "Every Key Challenge", desc: "The same skills in all 12 keys.", blocks: [S("Scales — circle of 5ths", 8, "keysdrills", { drill: "scales" }, "Turn on '🔁 All 12 keys'."), S("Triads in all keys", 7, "keysdrills", { drill: "triads" }, "All 12 keys."), S("1–5–6–4 everywhere", 8, "keysdrills", { drill: "circle1564" }, "All 12 keys."), S("Number system", 5, "numbers", {}, "Say the numbers while you play.")] },
  { id: "ky_pads", roles: ["keys"], level: 2, title: "Pads, Prayer & Flow", desc: "Play under prayer, readings and transitions.", blocks: [S("Sus & add9 colours", 6, "keysdrills", { drill: "colour" }, "Hear each colour."), S("Pad swells", 7, "keysdrills", { drill: "pads" }, "Soft and sustained."), S("Spread voicings", 6, "keysdrills", { drill: "spread" }, "Big but gentle."), S("Tizita run", 5, "keysdrills", { drill: "tizrun" }, "Ethiopian colour."), S("Key change", 4, "keysdrills", { drill: "keyup" }, "Last-chorus lift.")] },

  { id: "ac_fingerstyle", roles: ["acoustic"], level: 2, title: "Clean Hands Session", desc: "Fretting accuracy and smooth changes.", blocks: [S("Hand care", 3, "routine", { id: "gt_hands" }, ""), S("Spider walk", 6, "fingers", { inst: "guitar", ex: "spiderx" }, "Independence."), S("Stretch 1-3-4", 5, "fingers", { inst: "guitar", ex: "stretch" }, "Reach for chords."), S("Am ↔ F", 4, "changes", { a: "Am", b: "F" }, "The hardest change — go slow."), S("E ↔ A", 4, "changes", { a: "E", b: "A" }, ""), S("Dsus4 ↔ D", 4, "changes", { a: "Dsus4", b: "D" }, "Worship colour.")] },
  { id: "ac_band", roles: ["acoustic"], level: 1, title: "Play With the Band", desc: "Grooves, click and changes like on Saturday.", blocks: [S("Strumming stamina", 6, "routine", { id: "gt_rhythm" }, ""), S("Push on the & of 4", 6, "strum", { pattern: "push" }, "Listen to me: check your timing."), S("Island / reggae", 5, "strum", { pattern: "island" }, ""), S("6/8 sway", 5, "strum", { pattern: "six8" }, ""), S("Metronome gap click", 5, "metronome", { mode: "gap" }, "Keep time in the silence.")] },
  { id: "ac_keys", roles: ["acoustic"], level: 2, title: "Any Key, Any Singer", desc: "Capo, numbers and shapes in new keys.", blocks: [S("Capo chart", 6, "chords", {}, "Find 3 ways to play in Eb."), S("Shapes & capo", 8, "shapes", {}, "Learn one new key."), S("Number system", 6, "numbers", {}, "1 4 5 6m in 3 keys."), S("Chord quality ear", 5, "ear", { tab: "qual" }, "")] },

  { id: "ld_speed", roles: ["lead"], level: 2, title: "Clean Speed", desc: "Speed that stays clean.", blocks: [S("Hand care", 3, "routine", { id: "gt_hands" }, ""), S("Chromatic", 5, "fingers", { inst: "guitar", ex: "chromatic" }, ""), S("Tremolo picking", 5, "fingers", { inst: "guitar", ex: "tremolo" }, ""), S("Speed trainer", 7, "metronome", { mode: "trainer" }, "Your hardest lick, +4 bpm every 4 bars."), S("Legato chain", 5, "fingers", { inst: "guitar", ex: "legato" }, "")] },
  { id: "ld_melody", roles: ["lead"], level: 2, title: "Melody & Ear", desc: "Play what you hear.", blocks: [S("Intervals", 6, "ear", { tab: "int" }, ""), S("Scale degrees", 6, "ear", { tab: "deg" }, ""), S("Pentatonic box 1", 6, "fingers", { inst: "guitar", ex: "penta" }, "Your turn — I listen."), S("6ths in G", 6, "fingers", { inst: "guitar", ex: "sixths" }, "Sweet worship harmony lines.")] },
  { id: "ld_ambient", roles: ["lead"], level: 3, title: "Ambient Worship Guitar", desc: "Swells, delays and space.", blocks: [S("Reverb & delay lab", 8, "fx", {}, "Dotted-8th delay at the song tempo."), S("Arpeggios", 6, "fingers", { inst: "guitar", ex: "arp" }, ""), S("Bends in tune", 5, "fingers", { inst: "guitar", ex: "bend" }, ""), S("Major 3nps", 6, "fingers", { inst: "guitar", ex: "major3nps" }, "")] },
  { id: "ld_theory", roles: ["lead"], level: 1, title: "Neck Knowledge", desc: "Know every note and chord tone.", blocks: [S("Scale studies", 8, "scales", {}, "Modes on the neck."), S("Chord library", 6, "chords", {}, "Chord tones in every key."), S("Number system", 6, "numbers", {}, ""), S("Music basics", 5, "basics", {}, "")] },

  { id: "bs_groove", roles: ["bass"], level: 1, title: "Groove Lock-In", desc: "Bass and kick as one instrument.", blocks: [S("Root 8ths", 5, "basslab", { pattern: "roots8" }, ""), S("Lock with the kick", 7, "basslab", { pattern: "kicklock" }, ""), S("Groove lab", 6, "groove", { id: "pop" }, "Play roots with the kit."), S("Gap click", 5, "metronome", { mode: "gap" }, "")] },
  { id: "bs_lines", roles: ["bass"], level: 2, title: "Walking & Approach Notes", desc: "Move between chords like a pro.", blocks: [S("Root–5–8", 5, "basslab", { pattern: "r58" }, ""), S("Approach notes", 7, "basslab", { pattern: "approach" }, ""), S("Major scale", 6, "fingers", { inst: "bass", ex: "bassmajor" }, "Your turn — I listen."), S("Scale degrees ear", 5, "ear", { tab: "deg" }, "")] },
  { id: "bs_dyn", roles: ["bass"], level: 3, title: "Builds & Dynamics", desc: "Pedal tones, builds and 6/8 feel.", blocks: [S("Pedal tone build", 7, "basslab", { pattern: "pedal" }, ""), S("6/8 bounce", 6, "basslab", { pattern: "six8" }, ""), S("Octave pops", 5, "fingers", { inst: "bass", ex: "bassoct" }, ""), S("Rhythm lab", 6, "rhythm", {}, "")] },
  { id: "bs_hands", roles: ["bass"], level: 0, title: "Bass Hands Bootcamp", desc: "Strong, even fingers.", blocks: [S("Hand care", 3, "routine", { id: "gt_hands" }, ""), S("Open strings", 5, "fingers", { inst: "bass", ex: "bassopen" }, ""), S("Chromatic 1-2-3-4", 6, "fingers", { inst: "bass", ex: "bassspider" }, ""), S("Root–5–octave", 5, "fingers", { inst: "bass", ex: "bass158" }, "")] },

  { id: "dr_time", roles: ["drums"], level: 1, title: "Time Keeper", desc: "Rock-solid tempo — the band's anchor.", blocks: [S("Wrist warm-up", 3, "routine", { id: "dr_wrists" }, ""), S("Quarter notes on click", 5, "metronome", {}, "Bury the click."), S("Subdivisions", 5, "metronome", {}, "8ths, triplets, 16ths."), S("Gap click", 6, "metronome", { mode: "gap" }, "2 on, 2 off."), S("Basic groove", 6, "groove", { id: "basic" }, "Listen to me: check your timing.")] },
  { id: "dr_worship", roles: ["drums"], level: 2, title: "Worship Set Drummer", desc: "Every groove of a Saturday set.", blocks: [S("Ballad 6/8", 5, "groove", { id: "ballad" }, ""), S("Worship pop", 5, "groove", { id: "pop" }, ""), S("Half-time build", 5, "groove", { id: "half" }, ""), S("Four on the floor", 5, "groove", { id: "four" }, ""), S("Dynamics ladder", 6, "routine", { id: "dr_dyn" }, "")] },
  { id: "dr_chops", roles: ["drums"], level: 3, title: "Hands & Chops", desc: "Rudiments that become fills.", blocks: [S("Pad routine", 7, "routine", { id: "dr_pad" }, ""), S("Six-stroke roll", 5, "rudiments", { r: "six" }, ""), S("Double paradiddle", 5, "rudiments", { r: "dbl" }, ""), S("Flam taps", 5, "rudiments", { r: "flamtap" }, ""), S("Fills routine", 6, "routine", { id: "dr_fills" }, "")] },
  { id: "dr_ethio", roles: ["drums"], level: 3, title: "Ethiopian & Gospel Feels", desc: "6/8 chik-chika, shuffle and ghost notes.", blocks: [S("Ethiopian 6/8", 7, "groove", { id: "chik" }, ""), S("Gospel shuffle", 6, "groove", { id: "shuf" }, ""), S("Ghost notes", 6, "groove", { id: "ghost" }, ""), S("Odd meters", 5, "metronome", { sig: [7, 8] }, "")] },

  { id: "sd_check", roles: ["sound"], level: 1, title: "Saturday Soundcheck Drill", desc: "Line check to finished monitors in order.", blocks: [S("Line-check routine", 8, "routine", { id: "sd_line" }, ""), S("Signal flow", 6, "flow", {}, ""), S("EQ basics", 8, "eq7", {}, "Cut before you boost."), S("Compression", 6, "comp", {}, "Gentle vocal control.")] },
  { id: "sd_ears", roles: ["sound"], level: 2, title: "Golden Ears", desc: "Name frequencies and hear every change.", blocks: [S("EQ ear training", 10, "eq7", {}, "Quiz mode."), S("Critical listening", 6, "routine", { id: "sd_listen" }, ""), S("Reverb & delay", 6, "fx", {}, "Match the room.")] },
  { id: "sd_live", roles: ["sound"], level: 3, title: "Live Mix Workout", desc: "Mix a whole song from scratch.", blocks: [S("Mixing console", 15, "mixer", {}, "Drums → bass → keys → guitars → vocals."), S("Compression", 6, "comp", {}, ""), S("FX", 6, "fx", {}, "")] },
];
MORE_SESSIONS.forEach((x) => { if (!SESSIONS.some((s0) => s0.id === x.id)) SESSIONS.push(x); });
