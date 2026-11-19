
/* ============================ GUITAR CORE (acoustic + lead) ============================ */
L("gt_setup", {
  level: 0, title: "Your Guitar: Parts, Tuning & Holding", mins: 16,
  sum: "Everything you need before the first chord.",
  body: [
    ["p", "Welcome to guitar class! Whether you'll strum acoustic or play lead electric, every great guitarist starts with the same foundations."],
    ["h", "Parts of the guitar"],
    ["list", ["Headstock & tuning pegs — tune the strings", "Nut — guides strings at the top of the neck", "Frets — metal strips; each fret = one half step", "Fretboard with dot markers at frets 3, 5, 7, 9, 12", "Body, sound hole (acoustic) or pickups (electric)", "Bridge & saddle — where strings end"]],
    ["h", "Standard tuning"],
    ["p", "From the thickest (6th) string to the thinnest (1st): E A D G B E. Memory sentence: 'Every Amazing Disciple Gives Bread Everyday'. Use a clip-on tuner or a tuner app every single time you pick up the guitar."],
    ["w", "fret", { pcs: [4, 9, 2, 7, 11], root: 4, openOnly: true }, "The open strings: E A D G B E. Tap each to hear it."],
    ["h", "Holding the guitar"],
    ["steps", ["Sit up straight; guitar body rests on your right leg (or left in classical position)", "Neck angled slightly upward", "Fretting-hand thumb behind the neck, roughly behind the middle finger", "Fingers arched, pressing just behind the fret (not on top of it)", "Strumming arm rests over the top edge of the body", "Standing: strap length so the guitar sits at the same height as when sitting"]],
    ["h", "The pick"],
    ["p", "Hold the pick between the side of your index finger and the pad of your thumb, with a few millimetres showing. Medium picks (0.6–0.73 mm) are great for strumming; heavier picks (0.88 mm+) for lead."],
    ["tip", "Sore fingertips are normal for the first 2–3 weeks. Practise 10–15 minutes several times a day rather than one long session."],
    ["terms", [["Fret", "Metal strip; one half step"], ["Open string", "Played without pressing a fret"], ["Standard tuning", "E A D G B E"], ["Action", "Height of strings above the frets"]]],
    ["mistakes", ["Pressing on top of the fret (buzz) or too far behind it", "Thumb wrapped too far over the neck for chords", "Not tuning before practice"]],
    ["home", "Tune your guitar daily. Practise 'Finger exercises: Spider 1-2-3-4' for 3 minutes at 60 BPM."],
  ],
  quiz: [["Standard tuning low to high is…", ["E A D G B E", "E B G D A E", "A D G C E A", "E A D G C F"], 0], ["Press the string…", ["On the fret", "Just behind the fret", "In the middle between frets", "Anywhere"], 1]],
  practice: [["fingers", { inst: "guitar", ex: "spider" }, "Spider exercise"]],
});

L("gt_read", {
  level: 0, title: "Reading Chord Boxes & Tab", mins: 14,
  sum: "Decode the diagrams every guitarist uses.",
  body: [
    ["p", "Guitarists rarely read standard notation. Instead we use chord boxes (for chords) and tablature (for single notes). You'll learn both in minutes."],
    ["h", "Chord boxes"],
    ["p", "A chord box is a picture of the neck standing up. Vertical lines = strings (thick E on the left). Horizontal lines = frets. Dots = where to press. O = play open. X = don't play that string. A thick line at the top = the nut."],
    ["w", "box", { name: "G" }, "G major: 3 2 0 0 0 3."],
    ["w", "box", { name: "Em" }, "E minor: the easiest full chord — 0 2 2 0 0 0."],
    ["h", "Tab"],
    ["p", "Tab has six lines — one per string, with the THIN high E at the TOP (opposite to chord boxes!). Numbers are frets. '0' is open. Read left to right."],
    ["tab", ["e|-----0-------|", "B|---1---1-----|", "G|-0-------0---|", "D|-------------|", "A|-------------|", "E|-------------|"], "Read left to right: G string open → B string 1st fret → high e open → B 1st fret → G open."],
    ["w", "tool", { id: "fingers", label: "See moving tab in the Finger Exercise player" }, "Every exercise shows animated tab."],
    ["terms", [["Chord box", "Vertical chord diagram"], ["Tab", "Six-line fret notation"], ["X", "Mute/don't play"], ["O", "Open string"]]],
    ["mistakes", ["Reading tab upside down (high e is on top)", "Strumming X strings"]],
    ["home", "Read and play the shapes for E, Em, A, Am, D, Dm, G and C from the Chord Library."],
  ],
  quiz: [["In tab, the top line is…", ["Low E", "High e", "G string", "A string"], 1], ["X above a string means…", ["Open", "Don't play", "Fret 10", "Strum twice"], 1]],
  practice: [["shapes", {}, "Chord shapes"]],
});

L("gt_open", {
  level: 1, title: "Your First Open Chords", mins: 22,
  sum: "E, Em, A, Am, D, Dm, G and C — the chords of a thousand worship songs.",
  body: [
    ["p", "With eight open chords you can play hundreds of worship songs, especially with a capo. Learn each shape until you can place all fingers at once without looking."],
    ["w", "box", { name: "Em" }, "Em — fingers 2 and 3 on the 2nd fret."],
    ["w", "box", { name: "E" }, "E — add finger 1 on the G string, 1st fret."],
    ["w", "box", { name: "Am" }, "Am — the E shape moved over one string."],
    ["w", "box", { name: "A" }, "A — three fingers in a row on fret 2."],
    ["w", "box", { name: "D" }, "D — triangle shape, don't play the low E and A."],
    ["w", "box", { name: "Dm" }, "Dm."],
    ["w", "box", { name: "G" }, "G — use fingers 2, 1, 3 (or 3, 2, 4 to prepare for C)."],
    ["w", "box", { name: "C" }, "C — don't play the low E."],
    ["h", "The key of G family"],
    ["p", "G, C, D and Em are 1, 4, 5 and 6m in G — the most common worship key on guitar. Practise G → C → D → Em until it flows."],
    ["w", "prog", { key: 7, degs: [0, 3, 4, 5], inst: "guitar" }, "G – C – D – Em."],
    ["h", "Clean chords checklist"],
    ["steps", ["Press each string one at a time — does every note ring?", "Fingertips arched, not touching neighbouring strings", "Thumb lower behind the neck if notes are muted", "Fix one buzzing string at a time"]],
    ["terms", [["Open chord", "Chord using open strings near the nut"], ["Muted string", "A string that doesn't ring"], ["Shape", "Finger pattern for a chord"]]],
    ["mistakes", ["Playing muted X strings", "Flat fingers muting the high strings", "Looking at each finger one by one forever — practise placing all together"]],
    ["home", "Chord Change Trainer: G ↔ C, C ↔ D, D ↔ Em. One minute each, count your changes daily."],
  ],
  quiz: [["G, C, D, Em are which numbers in G?", ["1 2 3 4", "1 4 5 6m", "1 3 5 6", "1 4 6 5"], 1], ["In D, which strings don't you play?", ["High E and B", "Low E and A", "G and D", "None"], 1]],
  practice: [["changes", { a: "G", b: "C" }, "One-minute changes"], ["shapes", {}, "Chord shapes & capo"]],
});

L("gt_fingers", {
  level: 1, title: "Finger Independence & Technique", mins: 16,
  sum: "Build speed, strength and accuracy with daily exercises.",
  body: [
    ["p", "Your fretting fingers need independence (moving one without the others) and strength. These exercises are the guitarist's gym — five minutes a day changes everything."],
    ["h", "The rules"],
    ["list", ["One finger per fret: index = fret 1, middle = fret 2, ring = fret 3, pinky = fret 4", "Leave fingers down when possible (don't lift them high)", "Use a metronome; start at 60 BPM", "Alternate pick: down, up, down, up", "Only speed up when perfectly clean for 3 repetitions"]],
    ["w", "tool", { id: "fingers", label: "Spider & chromatic exercises", props: { ex: "spider" } }, "Watch the tab, listen and play along."],
    ["h", "Core exercises"],
    ["steps", ["Chromatic 1-2-3-4 up all six strings and back", "Spider: two fingers move string by string while others stay", "Reverse 4-3-2-1", "Stretch 1-3-4 / 1-2-4 combinations", "Fifth-fret position, then move down to 1st fret as stretch improves"]],
    ["tip", "Relax between repetitions. Tension is the enemy of speed. Shake out your hand every minute."],
    ["terms", [["Alternate picking", "Strict down–up picking"], ["One finger per fret", "Hand position rule"], ["Economy of motion", "Small, efficient movements"]]],
    ["mistakes", ["Lifting fingers high off the board", "Speeding up with mistakes", "Practising only on the 1st fret (too wide a stretch) — start at fret 5"]],
    ["home", "5 minutes a day: Spider + Chromatic. Record your clean BPM each week."],
  ],
  quiz: [["One finger per fret means index on fret…", ["1", "2", "3", "4"], 0], ["When should you speed up?", ["Immediately", "After 3 clean repetitions", "Never", "When bored"], 1]],
  practice: [["fingers", { ex: "chromatic" }, "Finger exercises"]],
});

/* ---------------- ACOUSTIC ---------------- */
L("ac_strum", {
  level: 1, title: "Strumming Fundamentals", mins: 22,
  sum: "The right hand drives the band. Learn the pendulum and core patterns.",
  body: [
    ["p", "In many worship bands the acoustic guitar is the rhythm engine. Your right hand matters even more than fancy chords."],
    ["h", "The pendulum"],
    ["p", "Your strumming hand moves down and up constantly, like a pendulum, in time with the music — even when it doesn't hit the strings. Down on the numbers (1, 2, 3, 4), up on the '&'. Patterns are created by choosing when to hit and when to miss."],
    ["w", "strumdemo", { pattern: "eighths" }, "Straight 8ths: D U D U D U D U."],
    ["h", "Core worship patterns"],
    ["list", ["Quarter notes: D D D D — slow ballads, intros", "Folk pattern: D – D U – U D U", "Driving 8ths: D U D U D U D U with accents on 2 and 4", "6/8: D – – D U – (or D D U D D U)", "16th worship strum: D – D U – U D U with a muted 'chuck' on 2 and 4"]],
    ["w", "strumdemo", { pattern: "folk" }, "The classic folk/worship pattern."],
    ["h", "Dynamics with strumming"],
    ["list", ["Soft: strum only the top 3–4 strings, close to the neck", "Medium: full chords, relaxed wrist", "Full: strum near the bridge with more attack", "Build: move from quarter notes → 8ths → 16ths"]],
    ["tip", "Lock with the drummer's hi-hat. If they play 8ths, your pendulum is 8ths. If they play 16ths, your pendulum moves twice as fast."],
    ["terms", [["Pendulum", "Constant down–up motion"], ["Chuck", "Percussive muted strum"], ["Accent", "Emphasised strum"], ["Downstroke/upstroke", "Strum direction"]]],
    ["mistakes", ["Stopping the hand when 'missing' a strum", "Strumming from the elbow only — use a loose wrist", "Same volume for every song section"]],
    ["home", "Strumming Lab: each pattern for 1 minute with a 1–5–6–4 progression at 70 BPM."],
  ],
  quiz: [["In a pendulum, downstrokes land on…", ["The &s", "The numbers", "Random beats", "Only beat 1"], 1], ["To play softly you can…", ["Strum harder", "Strum only top strings near the neck", "Use a capo", "Stop"], 1]],
  practice: [["strum", {}, "Strumming Lab"], ["session", { id: "ac_daily" }, "30-min Acoustic Session"]],
});

L("ac_changes", {
  level: 2, title: "Smooth Chord Changes", mins: 18,
  sum: "Anchor fingers, pivot fingers and one-minute changes.",
  body: [
    ["p", "Most songs don't fail because of the chords — they fail because of the gaps between chords. Let's eliminate the gap."],
    ["h", "Anchor & pivot fingers"],
    ["p", "Look for fingers that stay on the same fret between chords (anchors) or slide along the same string (pivots). G to Em: finger 2 stays on the A string. C to Am: fingers 1 and 2 stay put. Use them!"],
    ["w", "box", { name: "C" }, "C…"],
    ["w", "box", { name: "Am" }, "…to Am: only finger 3 moves."],
    ["h", "One-minute changes"],
    ["p", "Pick two chords. Strum once on each chord, switching back and forth for 60 seconds. Count the changes. Write the number down. Repeat daily — you'll double your score in two weeks."],
    ["w", "tool", { id: "changes", label: "Open the Chord Change Trainer" }, "Built-in timer, click and score history."],
    ["h", "Last-strum trick"],
    ["p", "On the last '&' before a change, strum open strings while your hand moves. Nobody notices, and the rhythm never stops."],
    ["terms", [["Anchor finger", "Stays in place"], ["Pivot finger", "Slides on the same string"], ["Ghost strum", "Open-string strum during a change"]]],
    ["mistakes", ["Stopping the strum to change", "Lifting all fingers high every change", "Practising changes without a timer"]],
    ["home", "One-minute changes: G–C, C–D, D–Em, Em–C, G–D. Log your scores."],
  ],
  quiz: [["From C to Am, how many fingers move?", ["0", "1", "2", "3"], 1]],
  practice: [["changes", {}, "Chord Change Trainer"]],
});

L("ac_capo", {
  level: 2, title: "Capo Mastery: Every Key with 5 Shapes", mins: 22,
  sum: "Play in any key the singer needs using G, C, D, A and E shapes.",
  body: [
    ["p", "The capo is a worship guitarist's best friend. It lets you keep easy open shapes while changing the key to suit the singer."],
    ["h", "How a capo works"],
    ["p", "A capo clamps all strings at one fret, acting as a new nut. Every fret raises the pitch a half step. G shapes with capo 2 sound in A. 'Shape key' = what your fingers play; 'sounding key' = what the congregation hears."],
    ["h", "The capo formula"],
    ["p", "Capo fret = sounding key − shape key (in half steps). Want B? G shapes + capo 4, or A shapes + capo 2. Want Eb? C shapes + capo 3, or D shapes + capo 1."],
    ["w", "capochart", {}, "The capo chart: choose the key the singer needs."],
    ["h", "Choosing the best shape"],
    ["list", ["G shapes: big and warm (G C D Em)", "C shapes: sparkly (C F G Am) — F is the challenge", "D shapes: bright and high (D G A Bm)", "A shapes: open and ringing (A D E F#m)", "E shapes: deep and powerful (E A B C#m)"]],
    ["tip", "Two guitarists? One plays G shapes capo 2, the other D shapes capo 7 — same key (A), different voicings. This sounds huge and professional."],
    ["h", "Practical tips"],
    ["list", ["Place the capo close behind the fret, straight", "Retune after placing the capo", "Mark the capo fret on your chart", "Above capo 7 the guitar gets thin — choose another shape"]],
    ["terms", [["Capo", "Clamp that raises pitch"], ["Shape key", "The key your fingers think in"], ["Sounding key", "The key you actually hear"]]],
    ["mistakes", ["Calling chords by shape names to the band ('play G') when the key is A", "Capo slanted or too far from the fret", "Not retuning"]],
    ["home", "Capo chart: find two ways to play in A, B, Bb and E. Play 1–5–6–4 in each."],
  ],
  quiz: [["G shapes with capo 2 sound in…", ["F", "A", "B", "G"], 1], ["To play in Eb with C shapes, capo on…", ["1", "2", "3", "5"], 2], ["Capo fret = …", ["Shape − sounding", "Sounding − shape", "Always 2", "Shape + sounding"], 1]],
  practice: [["shapes", { tab: "capo" }, "Capo chart & shapes"]],
});

L("ac_barre", {
  level: 3, title: "Barre Chords: E-Shape & A-Shape", mins: 24,
  sum: "Unlock every chord on the neck with two movable shapes.",
  body: [
    ["p", "Barre chords are where many guitarists give up — and where great ones are made. With two shapes you can play any major or minor chord anywhere."],
    ["h", "The barre"],
    ["p", "Your index finger lies flat across all strings, acting like a capo. Roll it slightly onto its bony side, keep it close to the fret, and use arm weight (pull back gently) rather than squeezing with the thumb."],
    ["h", "E-shape barre"],
    ["p", "Take the open E chord, play it with fingers 2-3-4, then slide up and barre with finger 1. The root is on the 6th string. Fret 1 = F, fret 3 = G, fret 5 = A, fret 7 = B, fret 8 = C."],
    ["w", "box", { name: "F" }, "F (E-shape, 1st fret)."],
    ["w", "fret", { pcs: [5, 9, 0], root: 5 }, "Where F's notes live."],
    ["h", "A-shape barre"],
    ["p", "Root on the 5th string. Barre at fret 2 = B, fret 3 = C, fret 5 = D, fret 7 = E. Minor versions use the Am shape."],
    ["w", "box", { name: "Bm" }, "Bm (A-shape minor, 2nd fret) — the most common barre chord in worship."],
    ["h", "Building strength"],
    ["steps", ["Practise the barre alone: press, strum, check each string", "Partial barres first: only the top 3–4 strings", "Then full barres for 4 beats, release, relax, repeat", "Change between an open chord and a barre chord (G → Bm)"]],
    ["warn", "If your hand hurts (not just tired), stop. Reduce pressure, check thumb position and action height. A well set-up guitar makes barres much easier."],
    ["terms", [["Barre", "One finger pressing several strings"], ["Movable shape", "Can be moved up and down the neck"], ["Root string", "String holding the chord's root"]]],
    ["mistakes", ["Squeezing hard with the thumb", "Barre finger too far from the fret", "Giving up after one week — strength takes 4–8 weeks"]],
    ["home", "5 minutes daily: F, Bm, Bb, C#m barre chords + changes to open chords."],
  ],
  quiz: [["E-shape barre at fret 3 is…", ["F", "G", "A", "C"], 1], ["A-shape root is on the … string", ["6th", "5th", "4th", "1st"], 1]],
  practice: [["shapes", { tab: "barre" }, "Barre shapes in every key"], ["changes", { a: "G", b: "Bm" }, "Open ↔ barre changes"]],
});

L("ac_caged", {
  level: 3, title: "The CAGED System", mins: 22,
  sum: "See every chord in five places across the neck.",
  body: [
    ["p", "CAGED shows how the five open shapes (C, A, G, E, D) connect up the neck. It's the map behind capo playing, barre chords and lead guitar."],
    ["h", "Five shapes, one chord"],
    ["p", "Any chord can be played with each of the five shapes by moving them up the neck. For a C chord: C shape (open), A shape (3rd fret), G shape (5th fret), E shape (8th fret), D shape (10th fret). The order always repeats: C–A–G–E–D."],
    ["w", "fret", { pcs: [0, 4, 7], root: 0 }, "All the C major notes across the neck. Can you see the five shapes?"],
    ["h", "Why it matters for worship"],
    ["list", ["Play higher voicings so you don't double the other guitar", "Find the same chord near where your hand already is", "Lead players: every CAGED shape has a matching scale position"]],
    ["terms", [["CAGED", "C–A–G–E–D shape order"], ["Voicing", "Arrangement of chord notes"]]],
    ["mistakes", ["Learning the theory without playing the shapes", "Trying all five shapes at once — learn E and A first, then C, G, D"]],
    ["home", "Find G major in all five shapes. Then D major."],
  ],
  quiz: [["CAGED order after G is…", ["C", "E", "D", "A"], 1]],
  practice: [["chords", { inst: "guitar" }, "Fretboard maps"]],
});

L("ac_picking", {
  level: 3, title: "Fingerpicking & Arpeggio Patterns", mins: 20,
  sum: "Beautiful patterns for intimate worship moments.",
  body: [
    ["p", "When the band drops out and it's just acoustic and vocals, fingerpicking or picked arpeggios create intimacy."],
    ["h", "Finger assignments (PIMA)"],
    ["list", ["p = thumb: bass strings (6, 5, 4)", "i = index: G string", "m = middle: B string", "a = ring: high e string"]],
    ["h", "Patterns"],
    ["list", ["Basic arpeggio: p–i–m–a–m–i", "Travis feel: alternating thumb on bass with fingers on the beat '&'", "Pinch: thumb + finger together on beat 1", "6/8 pattern: p–i–m–a–m–i (one bar)"]],
    ["h", "Picked arpeggios"],
    ["p", "With a pick, play the bass note, then the top strings one at a time. Let notes ring — it creates a harp-like shimmer."],
    ["terms", [["PIMA", "Finger names p i m a"], ["Arpeggio", "Chord notes played separately"], ["Travis picking", "Alternating thumb pattern"]]],
    ["mistakes", ["Thumb playing the wrong bass note (always the chord's root first)", "Uneven volume between fingers"]],
    ["home", "Fingerpick 1–5–6–4 in G with p–i–m–a–m–i for 5 minutes."],
  ],
  quiz: [["'p' is the…", ["Pinky", "Thumb", "Index", "Pick"], 1]],
  practice: [["fingers", { ex: "arp" }, "Arpeggio exercise"]],
});

L("ac_dynamics", {
  level: 4, title: "Driving the Band: Dynamics & Feel", mins: 18,
  sum: "Be the acoustic player every worship leader wants.",
  body: [
    ["p", "Advanced acoustic players shape the whole song: building tension, creating space, and locking the band together."],
    ["h", "Song map"],
    ["list", ["Intro: single strums or picking", "Verse 1: quarter notes or light 8ths", "Chorus 1: full 8ths", "Verse 2: 16ths muted for movement", "Bridge: drop to whole notes, then build with 8ths → 16ths", "Final chorus: full, accented", "Tag/ending: let ring"]],
    ["h", "Muted strums and percussive playing"],
    ["p", "Rest the side of your strumming hand on the strings near the bridge (palm mute) for a tight, percussive sound in verses. Add 'chucks' (left-hand mute + strum) on 2 and 4 for groove."],
    ["h", "Working with electric guitars and keys"],
    ["p", "When two guitars play, one strums low chords and the other plays higher voicings (capo or CAGED). When keys play big chords, thin your strumming to the top strings."],
    ["terms", [["Palm mute", "Muting with the strumming hand"], ["Build", "Gradually increasing energy"]]],
    ["mistakes", ["Full strumming from the first bar to the last", "Not watching the drummer for builds"]],
    ["home", "Map out one song's dynamics and play through it with the Strumming Lab."],
  ],
  quiz: [["In the bridge you often…", ["Play loudest", "Drop down then build", "Stop", "Change key"], 1]],
  practice: [["strum", {}, "Strumming Lab"]],
});

L("ac_worship", {
  level: 4, title: "Worship Voicings: Sus, Add9 & Ringing Strings", mins: 18,
  sum: "The modern worship acoustic sound.",
  body: [
    ["p", "Modern worship guitar often keeps fingers 3 and 4 planted on the B and high e strings (3rd fret) while the other fingers change. The ringing top notes tie every chord together."],
    ["h", "The G-family worship shapes"],
    ["list", ["G: 3 2 0 0 3 3", "Cadd9: x 3 2 0 3 3", "Dsus4: x x 0 2 3 3", "Em7: 0 2 2 0 3 3"]],
    ["w", "box", { name: "Cadd9" }, "Cadd9 — fingers 3 and 4 stay planted."],
    ["w", "box", { name: "Dsus4" }, "Dsus4."],
    ["p", "Switch between these four shapes and you'll recognise hundreds of worship songs. With a capo, this sound works in any key."],
    ["terms", [["Ringing strings", "Notes kept the same across chords"], ["Add9", "Chord with an added 9th"], ["Sus4", "4th replaces the 3rd"]]],
    ["mistakes", ["Lifting the planted fingers", "Using worship voicings when the keys player uses triads without agreeing"]],
    ["home", "Play G – Cadd9 – Dsus4 – Em7 for 5 minutes, then with capo 2."],
  ],
  quiz: [["Which fingers stay planted in worship G shapes?", ["1 and 2", "3 and 4", "Thumb", "None"], 1]],
  practice: [["shapes", { q: "add9" }, "Worship shapes"]],
});

L("ac_68", {
  level: 4, title: "6/8 & Ethiopian Rhythms on Acoustic", mins: 18,
  sum: "Swaying grooves for Mezmur.",
  body: [
    ["p", "Many Ethiopian worship songs live in a 6/8 or 12/8 feel. The acoustic guitar must bounce in threes."],
    ["h", "6/8 pendulum"],
    ["p", "Count 1-2-3-4-5-6 with accents on 1 and 4. Pendulum: D U D U D U. Basic pattern: D – U D – U with accents on 1 and 4."],
    ["w", "strumdemo", { pattern: "six8" }, "6/8 strumming."],
    ["h", "Eskista-style bounce"],
    ["p", "For fast celebratory songs, play short, muted strums in a 'one-two-three, four-five-six' bounce while the drums carry the beat. Keep it light and danceable."],
    ["terms", [["Compound time", "Beats divided in three"], ["Eskista", "Ethiopian shoulder dance and its rhythms"]]],
    ["mistakes", ["Playing 4/4 patterns in a 6/8 song", "Heavy strums that cover the drums"]],
    ["home", "Strumming Lab: 6/8 pattern for 5 minutes at 120 BPM (8th notes)."],
  ],
  quiz: [["In 6/8 accents usually fall on…", ["1 and 3", "1 and 4", "2 and 5", "every beat"], 1]],
  practice: [["strum", { pattern: "six8" }, "6/8 strumming"]],
});

L("ac_lead", {
  level: 5, title: "Leading Worship from the Acoustic", mins: 18,
  sum: "Start songs, hold the room and guide the band.",
  body: [
    ["p", "Many worship leaders lead from the acoustic guitar. Your strumming sets the tempo, your dynamics set the energy, and your cues guide everyone."],
    ["h", "Starting a song"],
    ["p", "Strum a clear 1 bar of the 1 chord at the exact tempo, or count in aloud. If using a click, start with the click so the drummer can lock."],
    ["h", "Free worship"],
    ["p", "Hold a simple loop (4–5–6m or 1–4) with steady 8ths or swells. Simplify when you start to sing spontaneously — your hands should be automatic."],
    ["h", "Cues while playing"],
    ["list", ["Nod on the last beat before a new section", "Lift the guitar neck to build, lower it to bring down", "Stop strumming on the last chord and let it ring to end"]],
    ["mistakes", ["Speeding up when excited", "Changing patterns too often while singing"]],
    ["home", "Lead one song in rehearsal from the acoustic, including the count-in and ending."],
  ],
  quiz: [["A good spontaneous loop is…", ["Complex", "Simple and steady", "Changing key", "Silent"], 1]],
  practice: [["session", { id: "ac_daily" }, "30-min Acoustic Session"]],
});

/* ---------------- LEAD ---------------- */
L("ld_penta", {
  level: 1, title: "Melodies & the Pentatonic Box", mins: 20,
  sum: "Your first lead guitar language.",
  body: [
    ["p", "Lead guitar in worship is about melody and atmosphere, not showing off. The pentatonic scale is where every lead player starts."],
    ["h", "Minor pentatonic box 1"],
    ["p", "In E minor (open position) or A minor (5th fret), the box shape uses two notes per string. Index on fret 5, ring or pinky on fret 7/8."],
    ["w", "fret", { pcs: [9, 0, 2, 4, 7], root: 9 }, "A minor pentatonic across the neck. Same notes as C major pentatonic."],
    ["w", "tool", { id: "fingers", label: "Play the box with moving tab", props: { ex: "penta" } }, "A minor pentatonic up and down."],
    ["h", "Major pentatonic = Tizita Major"],
    ["p", "Move the minor pentatonic shape down 3 frets and the same shape becomes the major pentatonic of the original key. For a song in C, play the A minor box (5th fret) — it's C major pentatonic. These notes are also Tizita Major!"],
    ["h", "Playing melodies"],
    ["p", "Learn the vocal melody of songs on guitar. Worship intros often use the chorus melody. Find it by ear using the box."],
    ["terms", [["Pentatonic", "Five-note scale"], ["Box", "A fixed scale pattern position"], ["Relative", "A minor and C major share notes"]]],
    ["mistakes", ["Running up and down the scale instead of playing melodies", "Ignoring the song's key"]],
    ["home", "Play the box at 60, 70, 80 BPM. Then find the chorus melody of a song in this week's set."],
  ],
  quiz: [["A minor pentatonic shares notes with…", ["G major pentatonic", "C major pentatonic", "D major", "E minor"], 1]],
  practice: [["fingers", { ex: "penta" }, "Pentatonic box"], ["scales", { group: "western", scale: "pmin" }, "Pentatonic on the fretboard"]],
});

L("ld_picking", {
  level: 2, title: "Picking Technique: Alternate & Economy", mins: 18,
  sum: "Clean, even, fast — with less effort.",
  body: [
    ["p", "Your picking hand determines tone, timing and speed. Lead guitarists practise picking as much as scales."],
    ["h", "Alternate picking"],
    ["p", "Strict down-up-down-up regardless of string changes. It keeps time perfectly. Practise on one string (tremolo) then with string changes."],
    ["h", "Economy picking"],
    ["p", "When moving to the next string in the same direction, continue the motion (two downstrokes in a row across strings). Smooth for arpeggios and sweeps."],
    ["h", "Muting"],
    ["list", ["Palm of the picking hand rests lightly on low strings you're not playing", "Fretting-hand fingers lightly touch higher strings", "Clean lead = silent unused strings"]],
    ["w", "tool", { id: "fingers", label: "Picking exercises", props: { ex: "tremolo" } }, "Tremolo, string-crossing and arpeggios."],
    ["terms", [["Alternate picking", "Strict down/up"], ["Economy picking", "Directional across strings"], ["Tremolo picking", "Fast repeated notes"]]],
    ["mistakes", ["Big picking motions", "Unmuted strings ringing"]],
    ["home", "3 minutes tremolo at increasing BPM + 2 minutes string-crossing."],
  ],
  quiz: [["Alternate picking means…", ["Only downstrokes", "Strict down-up", "Random", "Fingers only"], 1]],
  practice: [["fingers", { ex: "tremolo" }, "Picking drills"]],
});

L("ld_expressive", {
  level: 2, title: "Bends, Slides, Hammer-ons & Vibrato", mins: 22,
  sum: "Make the guitar sing like a voice.",
  body: [
    ["p", "Expression techniques turn notes into emotion. In worship, a slow singing bend or a gentle vibrato can be more powerful than a hundred notes."],
    ["h", "Bends"],
    ["p", "Push the string up (or pull down on low strings) to raise the pitch. Use 2–3 fingers together. Always bend TO a target pitch — a half step or whole step. Check by playing the target note first."],
    ["h", "Vibrato"],
    ["p", "Small, regular bends back and forth. Comes from the wrist rotating, not the finger. Match vibrato speed to the song's tempo."],
    ["h", "Slides, hammer-ons, pull-offs"],
    ["list", ["Slide: move to another fret without lifting", "Hammer-on: pick one note, 'hammer' another finger down to sound a higher note", "Pull-off: pick a higher note, pull the finger off to sound a lower one", "Legato: combining hammers and pulls for smooth lines"]],
    ["w", "tool", { id: "fingers", label: "Bend & legato drills", props: { ex: "bend" } }, "Target pitch, then bend to match."],
    ["terms", [["Bend", "Raising pitch by pushing the string"], ["Vibrato", "Repeated pitch wobble"], ["Legato", "Smooth connected notes"]]],
    ["mistakes", ["Out-of-tune bends", "Vibrato that's too fast and nervous", "Only using one finger to bend"]],
    ["home", "Bend drill: target note then bend, 20 times. Record and check pitch."],
  ],
  quiz: [["Always bend to…", ["Any pitch", "A target pitch", "The open string", "The root"], 1]],
  practice: [["fingers", { ex: "bend" }, "Bends & legato"]],
});

L("ld_major", {
  level: 2, title: "Major Scale Positions", mins: 20,
  sum: "Play melodies in any key across the neck.",
  body: [
    ["p", "Worship songs are usually major. Knowing major scale positions lets you play hooks and melodies anywhere."],
    ["w", "fret", { pcs: [7, 9, 11, 0, 2, 4, 6], root: 7 }, "G major across the neck. Find the roots (orange) first."],
    ["h", "Three-notes-per-string"],
    ["p", "Each string gets three notes. Smooth for speed and connects positions diagonally. Start with the position whose root is on the 6th string."],
    ["w", "tool", { id: "fingers", label: "G major position exercise", props: { ex: "major3nps" } }, ""],
    ["terms", [["Position", "Area of the neck"], ["3NPS", "Three notes per string"]]],
    ["mistakes", ["Learning shapes without hearing degrees", "Ignoring where the roots are"]],
    ["home", "Play G major 3NPS up and down 10 times, then improvise over 1–5–6–4 in G using only these notes."],
  ],
  quiz: [["When learning positions, first find the…", ["Highest note", "Roots", "Open strings", "Capo"], 1]],
  practice: [["fingers", { ex: "major3nps" }, "Major positions"], ["scales", { group: "western", scale: "major" }, "Major on the fretboard"]],
});

L("ld_ambient", {
  level: 3, title: "Swells, Delay & Ambient Worship Tone", mins: 20,
  sum: "The atmospheric electric sound of modern worship.",
  body: [
    ["p", "Ambient electric guitar fills space with swells, long delays and reverbs — creating a 'heavenly' bed under the song."],
    ["h", "Volume swells"],
    ["p", "Pick a note or chord with the volume knob down (or a volume pedal), then roll it up so the attack disappears. It sounds like a violin or pad."],
    ["h", "Dotted-8th delay"],
    ["p", "Set your delay to a dotted 8th of the song tempo with 2–4 repeats. Play simple 8th-note rhythms and the delay fills in the 16ths — the signature modern worship sound. Delay time (ms) = 60000 ÷ BPM × 0.75."],
    ["w", "delaycalc", {}, "Delay time calculator."],
    ["h", "Reverb"],
    ["p", "Big halls and shimmer reverbs (octave-up) create ambient beds. Keep the low end clean so reverb doesn't become mud."],
    ["h", "Playing ambient parts"],
    ["list", ["Use high notes: 1, 5 and 9 of the key", "Hold notes long; let effects do the work", "Stay out of the vocal range during verses"]],
    ["terms", [["Swell", "Fade-in note"], ["Dotted 8th", "3/4 of a beat"], ["Shimmer", "Reverb with octave-up pitch"]]],
    ["mistakes", ["Delay not synced to tempo", "Ambient parts too loud — they should be felt, not noticed"]],
    ["home", "Calculate delay times for songs at 68, 72 and 128 BPM. Practise swells on 1–5–6–4."],
  ],
  quiz: [["Dotted 8th delay at 80 BPM ≈", ["375 ms", "562 ms", "750 ms", "250 ms"], 1, "60000 ÷ 80 × 0.75 = 562.5 ms"]],
  practice: [["fx", { tab: "delay" }, "Delay & reverb lab"]],
});

L("ld_doublestops", {
  level: 3, title: "Double Stops, 6ths & Melodic Fills", mins: 18,
  sum: "Two-note shapes that sound sweet and full.",
  body: [
    ["p", "Double stops (two notes at once) in 3rds and 6ths sound like harmony vocals — perfect for worship fills between lines."],
    ["h", "6ths on the G and high e strings"],
    ["p", "Skip a string: play notes on the G and high e strings together. Moving these shapes up the scale creates gospel/soul fills."],
    ["h", "3rds on adjacent strings"],
    ["p", "Play two notes a 3rd apart on the G and B strings. Move them through the major scale."],
    ["h", "Where to play fills"],
    ["list", ["In the gaps between vocal lines", "During instrumental turnarounds", "Never over the lyrics people are learning"]],
    ["terms", [["Double stop", "Two notes played together"], ["Fill", "Short phrase in a gap"]]],
    ["mistakes", ["Filling every gap", "Fills louder than the vocals"]],
    ["home", "Play 6ths through G major. Then add one fill per chorus to a song."],
  ],
  quiz: [["Fills belong…", ["Over the lyrics", "In the gaps", "Only in intros", "Never"], 1]],
  practice: [["fingers", { ex: "sixths" }, "6ths exercise"]],
});

L("ld_chordtones", {
  level: 4, title: "Soloing Over Chord Tones", mins: 22,
  sum: "Target the right notes so every solo sounds intentional.",
  body: [
    ["p", "Advanced lead players don't just use the scale — they aim for notes in the current chord (chord tones), especially on beat 1 of each chord change."],
    ["h", "Arpeggio shapes"],
    ["p", "Learn the triad notes of each chord across the neck. In G: G = G B D, C = C E G, D = D F# A, Em = E G B."],
    ["w", "fret", { pcs: [7, 11, 2], root: 7 }, "G major chord tones across the neck."],
    ["h", "Targeting"],
    ["p", "Approach a chord tone from a scale step above or below, landing on the new chord's 3rd. The 3rd defines major or minor and sounds melodic."],
    ["h", "Qenet soloing"],
    ["p", "In Ethiopian songs, solo inside the qenet. Combine qenet notes with targeting chord tones — that is the most authentic sound."],
    ["terms", [["Chord tone", "Note in the current chord"], ["Target note", "Planned landing note"], ["Arpeggio", "Chord notes played singly"]]],
    ["mistakes", ["Random scale running", "Ignoring chord changes"]],
    ["home", "Improvise over 1–5–6–4, landing on the 3rd of each chord."],
  ],
  quiz: [["The note that defines major/minor is the…", ["Root", "3rd", "5th", "7th"], 1]],
  practice: [["fingers", { ex: "arp" }, "Arpeggio exercises"]],
});

L("ld_qenet", {
  level: 4, title: "Ethiopian Qenet on Guitar", mins: 18,
  sum: "Authentic Tizita, Bati and Ambassel lines.",
  body: [
    ["w", "fret", { pcs: [0, 2, 4, 7, 9], root: 0 }, "Tizita Major in C."],
    ["w", "fret", { pcs: [0, 2, 3, 7, 8], root: 0 }, "Tizita Minor in C."],
    ["w", "fret", { pcs: [0, 1, 5, 7, 8], root: 0 }, "Ambassel in C."],
    ["p", "Play each qenet slowly over a drone. Use slides and vibrato between notes to imitate the krar and masinko style ornaments. Short repeated motifs are more authentic than long runs."],
    ["terms", [["Krar", "Ethiopian lyre"], ["Masinko", "Ethiopian one-string bowed instrument"]]],
    ["home", "Learn one qenet per week; record a 30-second improvisation over a drone."],
  ],
  quiz: [["Ambassel in C contains…", ["Db", "D", "E", "B"], 0]],
  practice: [["scales", { group: "ethiopian" }, "Qenet on fretboard"]],
});

L("ld_parts", {
  level: 5, title: "Writing Parts That Serve the Song", mins: 18,
  sum: "From player to arranger.",
  body: [
    ["p", "At expert level, you create guitar parts: intros, hooks, ambient beds and lines that complement keys and vocals."],
    ["list", ["Find the song's hook and play it as the intro", "Choose a register that doesn't clash with keys", "Plan dynamics: ambient → rhythmic → melodic → big", "Leave space in verses", "Use effects with purpose"]],
    ["p", "Record your parts and share them in the team chat so others can learn them. Agree with the keys player who plays melody in each section."],
    ["home", "Write an intro hook for a song in this week's set and share a recording."],
  ],
  quiz: [["Verses usually need…", ["Lots of lead", "Space", "Solos", "Distortion"], 1]],
  practice: [["fingers", {}, "All lead exercises"]],
});

buildTrack("acoustic", "Acoustic Guitar", "Chords · strumming · capo · driving the band", [
  "gt_setup", "gt_read", "th_sound", "th_rhythm",
  "gt_open", "gt_fingers", "ac_strum", "th_major", "th_chords",
  "ac_changes", "ac_capo", "th_time", "th_minor",
  "ac_barre", "ac_caged", "ac_picking",
  "ac_dynamics", "ac_worship", "ac_68",
  "ac_lead",
]);
buildTrack("lead", "Lead Guitar", "Melody · technique · tone · solos", [
  "gt_setup", "gt_read", "th_sound", "th_steps", "th_rhythm",
  "gt_open", "gt_fingers", "ld_penta", "th_major", "th_intervals", "th_chords",
  "ld_picking", "ld_expressive", "ld_major", "th_minor", "th_time",
  "ld_ambient", "ld_doublestops", "ac_caged",
  "ld_chordtones", "ld_qenet",
  "ld_parts",
]);
