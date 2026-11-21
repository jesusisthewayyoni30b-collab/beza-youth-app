
/* --------------------------------- DATA --------------------------------- */
const ROLES = [
  { id: "singer", label: "Singer", icon: Mic, color: "#FF3EA5", channel: "singers", blurb: "Lead, harmony & choir" },
  { id: "keys", label: "Keys", icon: PianoIcon, color: "#22E4FF", channel: "musicians", blurb: "Piano, synth & pads" },
  { id: "acoustic", label: "Acoustic Guitar", icon: Guitar, color: "#FF8A00", channel: "musicians", blurb: "Rhythm & strumming" },
  { id: "lead", label: "Lead Guitar", icon: Zap, color: "#FFE53D", channel: "musicians", blurb: "Melody, tone & solos" },
  { id: "bass", label: "Bass", icon: Activity, color: "#8B5CFF", channel: "musicians", blurb: "Groove & low end" },
  { id: "drums", label: "Drums", icon: Drum, color: "#C6FF3D", channel: "musicians", blurb: "Time & energy" },
  { id: "sound", label: "Sound", icon: Sliders, color: "#7CFFB2", channel: "sound", blurb: "Mixing, PA & stream" },
];
const HEART_ROLE = { id: "heart", label: "Heart of Worship", icon: Heart, color: "#FFE53D", channel: "all", blurb: "Prayer & presence" };
const roleOf = (id) => (id === "heart" ? HEART_ROLE : ROLES.find((r) => r.id === id) || ROLES[0]);
const roleLabel = (id) => roleOf(id).label;
const MUSICIAN_ROLES = ["keys", "acoustic", "lead", "bass", "drums"];
const CHANNELS = [
  { id: "all", label: "All team", roles: null }, { id: "singers", label: "Singers", roles: ["singer"] },
  { id: "musicians", label: "Musicians", roles: MUSICIAN_ROLES }, { id: "sound", label: "Sound", roles: ["sound"] }, { id: "leaders", label: "Leaders", leaders: true },
];
const GROUP_EMOJI = ["🙌", "🎤", "🎸", "🎚️", "🛡️", "🙏", "🔥", "🎹", "🥁", "📣", "✨", "💬"];
const defaultGroups = (user, leader) => {
  const me = user && user.roles ? user.roles : [];
  const who = (fn, meIn) => [...TEAM.filter(fn).map((m) => m.name), ...(meIn ? ["@me"] : [])];
  return [
    { id: "all", label: "All team", emoji: "🙌", everyone: true, members: [] },
    { id: "singers", label: "Singers", emoji: "🎤", members: who((m) => m.roles.includes("singer"), me.includes("singer")) },
    { id: "musicians", label: "Musicians", emoji: "🎸", members: who((m) => m.roles.some((r) => MUSICIAN_ROLES.includes(r)), me.some((r) => MUSICIAN_ROLES.includes(r))) },
    { id: "sound", label: "Sound team", emoji: "🎚️", members: who((m) => m.roles.includes("sound"), me.includes("sound")) },
    { id: "leaders", label: "Leaders", emoji: "🛡️", leadersOnly: true, members: who((m) => m.leader, leader) },
  ];
};

const TEAM = [
  { id: 1, name: "Hanna Tesfaye", roles: ["singer"], voice: "Soprano", prog: 0.82, mins: 312, streak: 14, last: "12m ago", color: "#E58FA8" },
  { id: 2, name: "Dawit Alemu", roles: ["keys", "singer"], voice: "Tenor", prog: 0.67, mins: 260, streak: 9, last: "1h ago", color: "#6FB3D2" },
  { id: 3, name: "Selam Girma", roles: ["singer"], voice: "Alto", prog: 0.74, mins: 285, streak: 11, last: "3h ago", color: "#B79CE6" },
  { id: 4, name: "Abel Mekonnen", roles: ["drums"], prog: 0.41, mins: 120, streak: 3, last: "yesterday", color: "#F5A94C" },
  { id: 5, name: "Meron Haile", roles: ["singer", "acoustic"], voice: "Mezzo-soprano", prog: 0.58, mins: 190, streak: 6, last: "5h ago", color: "#F07D6A" },
  { id: 6, name: "Yonas Bekele", roles: ["bass"], prog: 0.52, mins: 176, streak: 5, last: "2h ago", color: "#5DBB94" },
  { id: 7, name: "Bethlehem Assefa", roles: ["singer"], voice: "Alto", prog: 0.36, mins: 98, streak: 2, last: "2 days ago", color: "#D99A6C" },
  { id: 8, name: "Kidus Tadesse", roles: ["lead", "acoustic"], prog: 0.71, mins: 240, streak: 12, last: "30m ago", color: "#7C8FE0" },
  { id: 9, name: "Ruth Wondimu", roles: ["acoustic", "singer"], voice: "Soprano", prog: 0.63, mins: 205, streak: 8, last: "4h ago", color: "#E6B85C" },
  { id: 10, name: "Nahom Kebede", roles: ["sound"], prog: 0.49, mins: 150, streak: 4, last: "yesterday", color: "#4FA3A5" },
  { id: 11, name: "Liya Desta", roles: ["singer", "keys"], voice: "Soprano", prog: 0.88, mins: 340, streak: 21, last: "8m ago", color: "#EC8FC2", leader: true },
  { id: 12, name: "Samuel Yirga", roles: ["singer", "bass"], voice: "Tenor", prog: 0.45, mins: 133, streak: 3, last: "6h ago", color: "#8BC36A" },
  { id: 13, name: "Mahlet Solomon", roles: ["keys"], prog: 0.29, mins: 64, streak: 1, last: "4 days ago", color: "#C38BE0" },
  { id: 14, name: "Eyob Fikru", roles: ["sound", "drums"], prog: 0.77, mins: 268, streak: 10, last: "1h ago", color: "#5AA9E6" },
];

const SEED_CHAT = {
  all: [
    { id: 1, from: "Liya Desta", color: "#EC8FC2", text: "Good morning team! ☀️ Rehearsal is Friday from 4:00 PM. Please come warmed up 🙏", t: "08:12" },
    { id: 2, from: "Dawit Alemu", color: "#6FB3D2", text: "Uploaded the set list + keys for Saturday's youth program", t: "08:40", file: { name: "Saturday_Setlist_Nov23.pdf", size: "182 KB" } },
    { id: 3, from: "Kidus Tadesse", color: "#7C8FE0", text: "Song 3 is in A now, not G 🎸", t: "09:05" },
    { id: 4, from: "Hanna Tesfaye", color: "#E58FA8", text: "Got it! Altos, let's practise the bridge harmony on the app 😄", t: "09:21", react: { "🙏": 3, "🔥": 2 } },
  ],
  singers: [{ id: 1, from: "Selam Girma", color: "#B79CE6", text: "Range test says I'm an Alto 🎤", t: "Yesterday" }],
  musicians: [
    { id: 1, from: "Dawit Alemu", color: "#6FB3D2", text: "Pad patch for Saturday: 'Warm Air' in A 🎹", t: "Yesterday" },
    { id: 2, from: "Kidus Tadesse", color: "#7C8FE0", text: "Dotted 8th delay at 72 bpm = 625 ms 🔁", t: "Yesterday" },
    { id: 3, from: "Abel Mekonnen", color: "#F5A94C", text: "Click at 72 bpm for the opener 🥁", t: "Yesterday" },
    { id: 4, from: "Yonas Bekele", color: "#5DBB94", text: "Locking with Abel's kick on the opener 🔒", t: "Yesterday" },
  ],
  sound: [{ id: 1, from: "Eyob Fikru", color: "#5AA9E6", text: "New scene saved on the console: SATURDAY_V3 🎚️", t: "Mon" }],
  leaders: [{ id: 1, from: "Liya Desta", color: "#EC8FC2", text: "Let's check in on members with low streaks this week.", t: "Mon" }],
};
const VERSES = [
  { ref: "Psalm 33:3", txt: "Sing unto him a new song; play skilfully with a loud noise." },
  { ref: "Colossians 3:16", txt: "…singing with grace in your hearts to the Lord." },
  { ref: "Psalm 150:6", txt: "Let every thing that hath breath praise the LORD." },
];
const UPDATE_INFO = { from: "1.3.0", to: "1.4.0", size: "3.1 MB", notes: ["More harmony drills & Ethiopian runs", "Mixer: save your mix presets", "Smoother chat & photo sharing"] };
const LEADER_CODE = "BEZA26";

const DRILLS = {
  keys: [["Five-finger warm-up", 60], ["Triad ladder in C", 60], ["Inversions I–IV–V", 60], ["1-5-6-4 in a new key", 60], ["Free play on Tizita", 60]],
  lead: [["Chromatic 1-2-3-4", 60], ["Minor pentatonic box 1", 60], ["Bends to pitch", 60], ["6ths in G", 60], ["Slides to chord tones", 60]],
  acoustic: [["G → C → D → Em changes", 60], ["Strum D DU UDU at 80 bpm", 60], ["Hold F barre & release", 60], ["Capo 2: same shapes, new key", 60], ["Soft → full dynamics", 60]],
  bass: [["Root 8ths with kick", 60], ["1-5-8 on each chord", 60], ["Octave pops", 60], ["Muting & rests", 60], ["Approach notes", 60]],
  drums: [["Single strokes 16ths", 60], ["Double strokes", 60], ["Paradiddles", 60], ["Groove with click 72", 60], ["1-bar fill into chorus", 60]],
  singer: [["Lip trills 5-tone", 60], ["Sirens low → high", 60], ["Staccato 'ha' arpeggios", 60], ["Breath: 4 in / 8 out", 60], ["Song phrase with breath marks", 60]],
  sound: [["Ear: name that frequency", 60], ["Gain-stage a vocal", 60], ["Build a monitor mix", 60], ["Set a vocal compressor", 60], ["Ring out one wedge", 60]],
};

/* 30-minute guided practice sessions (blocks of tool + coach notes) */
const S = (name, mins, tool, props, guide) => ({ name, mins, tool, props: props || {}, guide });
const SESSIONS = [
  { id: "sg_daily", roles: ["singer"], level: 0, title: "Daily Vocal Workout", desc: "Breath, SOVT, resonance, scales, ear & cool-down.", blocks: [
    S("Breathe & release", 4, "breath", { level: 0 }, "Stand tall, shoulders down. Low breaths only — belly and ribs move, shoulders don't. Do two rounds of Calm 4·4·6, then a Singer's Support hiss."),
    S("Lip trills & SOVT", 5, "vocalgym", { cat: "SOVT", ex: "liptrill5" }, "Keep the trill bubbling all the way up. If it stops, add a little more breath — never push from the throat."),
    S("Resonance", 4, "vocalgym", { cat: "Resonance", ex: "hum135" }, "Hum with lips gently closed and teeth apart. Feel the buzz on your lips and nose — that's the tone you want in every song."),
    S("Scale study", 6, "scales", { group: "western", scale: "major", pattern: "thirds" }, "Sing the major scale in 3rds on 'la'. Name each degree in your head. Go slowly; accuracy before speed."),
    S("Ear training", 5, "ear", { tab: "quiz" }, "Listen to the cadence, then name the mystery degree. Sing it back after every answer."),
    S("Pitch tuner", 4, "range", {}, "Sing long notes on 1, 3 and 5 of a comfortable key. Keep the needle within ±15 cents for 4 seconds each."),
    S("Cool-down", 2, "vocalgym", { cat: "Cool-down", ex: "cooltrill" }, "Gentle descending trills and hums. End in silence and a short prayer."),
  ] },
  { id: "sg_harmony", roles: ["singer"], level: 3, title: "Harmony Session", desc: "Intervals, 3rds, 6ths and three-part stacks.", blocks: [
    S("Warm-up", 5, "vocalgym", { cat: "Resonance", ex: "nay" }, "Bright 'Nay' arpeggios to wake up the ear and the voice."),
    S("Interval ear training", 5, "ear", { tab: "intervals" }, "Focus on 3rds and 6ths. Sing every interval back before answering."),
    S("Parallel 3rds above", 7, "harmony", { drill: "par3up" }, "First listen to both parts. Then 'Mute my part' — sing the harmony alone against the melody. Repeat in 3 keys."),
    S("6ths below", 5, "harmony", { drill: "par6down" }, "Altos and baritones: this is your home. Sopranos and tenors: sing it an octave up."),
    S("Three-part pads", 6, "harmony", { drill: "prog1564" }, "Pick a part, mute it and sing it on 'Ooh'. Then switch parts."),
    S("Cool-down", 2, "breath", { level: 0 }, "Slow breathing. Thank God for the gift of harmony and unity."),
  ] },
  { id: "sg_range", roles: ["singer"], level: 2, title: "Range & Mix Builder", desc: "Sirens, mix vowels, belting safely.", blocks: [
    S("Breath activation", 4, "breath", { level: 1 }, "Intermediate breathing: wake up the ribs and abs."),
    S("Sirens through the break", 5, "vocalgym", { cat: "Range", ex: "siren" }, "Light and smooth — no flipping. Let the voice glide through the break."),
    S("Octave Nay", 6, "vocalgym", { cat: "Range", ex: "octnay" }, "Bright, small and bratty. Don't get louder as you go up."),
    S("Mix & belt", 6, "vocalgym", { cat: "Mix & Belt", ex: "hey" }, "Call 'Hey!' like you're greeting a friend across the road. Stop if it scratches."),
    S("Vowel shaping", 5, "vocalgym", { cat: "Vowels", ex: "vowels" }, "Keep vowels pure, modify slightly as you go up."),
    S("Range check", 2, "range", {}, "Sing your highest comfortable note. Note it in your journal."),
    S("Cool-down", 2, "vocalgym", { cat: "Cool-down", ex: "coolhum" }, "Descending hums."),
  ] },
  { id: "sg_agility", roles: ["singer"], level: 4, title: "Agility, Runs & Qenet", desc: "Clean runs, Tizita patterns, gospel licks.", blocks: [
    S("Warm-up", 5, "vocalgym", { cat: "SOVT", ex: "liptrillarp" }, "Lip trill arpeggios to connect breath and pitch."),
    S("Scale in groups of 3", 6, "scales", { group: "western", scale: "major", pattern: "g3" }, "Sing on 'ah'. Start slow, increase tempo only when perfectly clean."),
    S("Agility drills", 8, "vocalgym", { cat: "Agility", ex: "run123" }, "Fast 1-2-3-2-1, then the gospel run. Keep air flowing — no 'h' between notes."),
    S("Qenet runs", 6, "vocalgym", { cat: "Scales", ex: "tizrun" }, "Tizita runs: notes 1 2 3 5 6 only. Then try Tizita Minor."),
    S("Breath challenge", 3, "breath", { level: 2, tab: "sustain" }, "Sustain challenge — beat your personal best."),
    S("Cool-down", 2, "vocalgym", { cat: "Cool-down", ex: "cooltrill" }, "Easy descending trills."),
  ] },
  { id: "sg_breath", roles: ["singer"], level: 4, title: "Breath Endurance Challenge", desc: "Progressive capacity work. Stop if dizzy.", blocks: [
    S("Beginner patterns", 5, "breath", { level: 0 }, "Warm the breath up gently."),
    S("Intermediate", 7, "breath", { level: 1 }, "Longer exhales — keep the ribs wide."),
    S("Advanced", 8, "breath", { level: 2 }, "Hiss evenly. If you feel lightheaded, rest for 30 seconds."),
    S("Sustain challenge", 6, "breath", { level: 3, tab: "sustain" }, "Sing one note on 'ah' as long as possible with steady tone."),
    S("Recovery", 4, "breath", { level: 0 }, "Calm breathing to finish."),
  ] },
  { id: "ky_daily", roles: ["keys"], level: 0, title: "Daily Keys Workout", desc: "Fingers, triads, inversions, progressions & ear.", blocks: [
    S("Five-finger warm-up", 4, "keysdrills", { drill: "five" }, "Curved fingers, loose wrists. Hands separately then together."),
    S("Triad ladder", 6, "keysdrills", { drill: "triads" }, "Major then minor up the chromatic scale. Say the chord name as you play."),
    S("Inversion ladder", 7, "keysdrills", { drill: "inv" }, "Root → 1st → 2nd → root. Keep the hand relaxed; let the wrist guide."),
    S("1–5–6–4 around the circle", 8, "keysdrills", { drill: "circle1564" }, "Voice-led right hand, root in the left. Think in numbers!"),
    S("Ear training", 5, "ear", { tab: "quiz" }, "Name the degree, then find it on the keys."),
  ] },
  { id: "ky_colour", roles: ["keys"], level: 3, title: "Voicings & Colour", desc: "7ths, sus, add9, extended chords and pads.", blocks: [
    S("Arpeggios", 5, "keysdrills", { drill: "arp" }, "Major and minor arpeggios, smooth thumb crossings."),
    S("Colour chords", 8, "chords", { inst: "piano", q: "maj7" }, "Play maj7, 7, m7, sus2, sus4, add9 on each root of 1–4–5–6 in G."),
    S("Progressions with colour", 8, "numbers", {}, "Play 1–5–6–4 with add9 on 1 and 4, sus4 → 5. Listen for clashes."),
    S("Gospel 2–5–1", 6, "chords", { inst: "piano", q: "m9" }, "Dm9 → G13 → Cmaj9. Move as few fingers as possible."),
    S("Free pad worship", 3, "scales", { group: "ethiopian", scale: "tizM" }, "Hold a pad and improvise a simple Tizita melody on top."),
  ] },
  { id: "ac_daily", roles: ["acoustic"], level: 1, title: "Daily Acoustic Workout", desc: "Fingers, changes, strumming, capo & songs.", blocks: [
    S("Finger warm-up", 5, "fingers", { inst: "guitar", ex: "spider" }, "One finger per fret. Alternate picking. Start at 60 BPM."),
    S("One-minute changes", 7, "changes", { a: "G", b: "C" }, "Count changes for 60 s, then C ↔ D, D ↔ Em. Beat yesterday's score."),
    S("Strumming patterns", 8, "strum", { pattern: "folk" }, "Pendulum never stops. Lock with the click."),
    S("Capo practice", 5, "shapes", { tab: "capo" }, "Play 1–5–6–4 in A twice: G shapes capo 2, then D shapes capo 7."),
    S("Song flow", 5, "strum", { pattern: "eighths" }, "Play through a song's map: soft verse → full chorus."),
  ] },
  { id: "ac_barre", roles: ["acoustic", "lead"], level: 3, title: "Barre Chord Bootcamp", desc: "Strength, accuracy and fast changes.", blocks: [
    S("Finger stretch", 5, "fingers", { inst: "guitar", ex: "stretch" }, "Wide stretches at fret 5, then move lower."),
    S("E-shape barres", 7, "shapes", { tab: "barre" }, "F, G, A, B, C — press, strum, check each string."),
    S("A-shape barres", 7, "shapes", { tab: "barre", q: "m" }, "Bm, C#m, Dm, Em. Roll the index finger slightly."),
    S("Open ↔ barre changes", 7, "changes", { a: "G", b: "Bm" }, "Smooth changes are the goal, not perfect pressure."),
    S("Rest & stretch", 4, "fingers", { inst: "guitar", ex: "chromatic" }, "Light chromatic exercise to relax the hand."),
  ] },
  { id: "ld_daily", roles: ["lead"], level: 1, title: "Daily Lead Workout", desc: "Technique, scales, expression & ear.", blocks: [
    S("Chromatic warm-up", 5, "fingers", { inst: "electric", ex: "chromatic" }, "Alternate picking, metronome on."),
    S("Picking drill", 5, "fingers", { inst: "electric", ex: "tremolo" }, "Small motions. Mute unused strings."),
    S("Pentatonic box", 6, "fingers", { inst: "electric", ex: "penta" }, "Up and down, then play a melody using the box."),
    S("Bends & vibrato", 5, "fingers", { inst: "electric", ex: "bend" }, "Target pitch first, then bend to match."),
    S("Major positions", 5, "fingers", { inst: "electric", ex: "major3nps" }, "G major 3NPS — find every G as you go."),
    S("Ear training", 4, "ear", { tab: "intervals" }, "Hear intervals, find them on the neck."),
  ] },
  { id: "bs_daily", roles: ["bass"], level: 1, title: "Daily Bass Workout", desc: "Plucking, roots, lock, patterns & scales.", blocks: [
    S("Plucking warm-up", 4, "fingers", { inst: "bass", ex: "bassopen" }, "Alternate i–m, rest strokes, even volume."),
    S("Root 8ths", 6, "basslab", { pattern: "roots8" }, "Lock every note with the kick and hats."),
    S("Lock with the kick", 6, "basslab", { pattern: "kicklock" }, "Listen to the kick. Match it exactly."),
    S("Root–5–8", 5, "basslab", { pattern: "r58" }, "Movement without clutter."),
    S("Bass scales", 5, "fingers", { inst: "bass", ex: "bassmajor" }, "Major scale one octave, three keys."),
    S("6/8 groove", 4, "basslab", { pattern: "six8" }, "Bounce on 1 and 4."),
  ] },
  { id: "dr_daily", roles: ["drums"], level: 1, title: "Daily Drummer Workout", desc: "Rudiments, grooves, fills and 6/8.", blocks: [
    S("Single strokes", 5, "rudiments", { r: "singles" }, "Even height, even volume. Tempo ramp on."),
    S("Double strokes", 4, "rudiments", { r: "doubles" }, "Second stroke as strong as the first."),
    S("Paradiddles", 5, "rudiments", { r: "paradiddle" }, "Accent the first note of each group."),
    S("Basic groove with click", 6, "groove", { id: "basic" }, "Bury the click. Snare and kick perfectly placed."),
    S("Fills", 5, "groove", { id: "fill" }, "Groove 3 bars, fill 1 bar, crash on the 1."),
    S("6/8 Ethiopian feel", 5, "groove", { id: "chik" }, "Bounce. Light hats, strong 1 and 4."),
  ] },
  { id: "sd_ear", roles: ["sound"], level: 2, title: "Engineer Ear Session", desc: "Frequencies, compression and space.", blocks: [
    S("Frequency ear quiz", 10, "eq7", { quiz: true }, "Guess the boosted band. Say the frequency name before you answer: boom, mud, box, honk, presence, sibilance, air."),
    S("EQ a real track", 7, "eq7", {}, "Upload a song or use the demo. Fix mud, add presence — then A/B with bypass."),
    S("Compression", 7, "comp", {}, "Set 3–6 dB GR on a vocal-like source. Listen for pumping."),
    S("Reverb & delay", 6, "fx", {}, "Build a vocal plate and a tempo delay throw."),
  ] },
  { id: "sd_mix", roles: ["sound"], level: 3, title: "Mixing Session", desc: "Build a full mix in the right order.", blocks: [
    S("Gain staging", 4, "flow", {}, "Set every channel to a healthy level before touching faders."),
    S("Build order", 10, "mixer", {}, "Lead first (or the most important stem), then the band. Use mute/solo sparingly."),
    S("EQ for space", 8, "mixer", { focus: "eq" }, "Open EQ on each channel: HPF everything except kick and bass, cut mud, complementary boosts."),
    S("Dynamics & effects", 6, "mixer", { focus: "fx" }, "Compress bass and vocals, add reverb sends."),
    S("Final check", 2, "mixer", {}, "Listen at low volume. Is everything clear?"),
  ] },
];
