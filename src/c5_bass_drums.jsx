
/* ============================ BASS CURRICULUM ============================ */
L("bs_role", {
  level: 0, title: "The Bass: Role, Posture & Plucking", mins: 16,
  sum: "You are the bridge between rhythm and harmony.",
  body: [
    ["p", "The bass is the most important instrument most people never notice — until it's missing. You connect the drums (rhythm) with the chords (harmony). When the bass is right, the whole room feels it."],
    ["h", "Your job"],
    ["list", ["Play the root of the chord so the harmony is clear", "Lock with the kick drum so the groove is tight", "Control the low end of the mix — less is usually more", "Lead the band through chord changes with confident notes"]],
    ["h", "Tuning & posture"],
    ["p", "4-string bass: E A D G (same as the lowest four guitar strings, one octave lower). Strap height so your plucking hand rests comfortably near the pickups and your fretting hand doesn't have to bend sharply."],
    ["w", "fret", { pcs: [4, 9, 2, 7], root: 4, bass: true, openOnly: true }, "Open strings E A D G — tap to hear real bass samples."],
    ["h", "Plucking"],
    ["p", "Alternate index (i) and middle (m) fingers. Pluck through the string so the finger comes to rest on the next string (a 'rest stroke'). Anchor your thumb on the pickup or the E string. A pick is fine for brighter, punchier songs."],
    ["h", "Fretting"],
    ["p", "One finger per fret, thumb behind the neck. Press just behind the fret. Lift fingers just enough to stop notes — muting is half of bass playing."],
    ["terms", [["Root", "The note the chord is named after"], ["Rest stroke", "Finger plucks and lands on the next string"], ["Low end", "The bass frequencies of the mix"]]],
    ["mistakes", ["Playing too many notes", "Letting open strings ring into the next chord", "Uneven finger volume"]],
    ["home", "3 minutes: alternate i–m plucking on each open string with the click at 70 BPM, 8th notes."],
  ],
  quiz: [["Bass standard tuning is…", ["E A D G", "G D A E", "E A D G B E", "B E A D"], 0], ["The bass mainly locks with the…", ["Vocals", "Kick drum", "Lead guitar", "Keys pad"], 1]],
  practice: [["fingers", { inst: "bass", ex: "bassopen" }, "Plucking drill"]],
});

L("bs_roots", {
  level: 1, title: "Notes on the Neck & Root Playing", mins: 20,
  sum: "Find any root fast and play solid 8th notes.",
  body: [
    ["p", "Root playing is the foundation. Great bassists play simple roots for whole songs — perfectly in time."],
    ["h", "Notes on the E and A strings"],
    ["p", "Most roots live on the E and A strings. E string: F (1), G (3), A (5), B (7), C (8), D (10), E (12). A string: B (2), C (3), D (5), E (7), F (8), G (10), A (12). Memorise these first."],
    ["w", "fret", { pcs: [0, 2, 4, 5, 7, 9, 11], root: 0, bass: true }, "Natural notes on the bass (C highlighted)."],
    ["h", "Root 8ths"],
    ["p", "Play the root of each chord as steady 8th notes. In G: G G G G G G G G | D D D D… Tight, even, locked to the hi-hat and kick."],
    ["w", "basslab", { pattern: "roots8", key: 7 }, "Root 8ths over 1–5–6–4 in G with drums."],
    ["h", "Muting between notes"],
    ["p", "Release fretting-hand pressure just slightly at the end of a note to stop it — the finger stays on the string. Rest the plucking thumb on lower strings to keep them quiet."],
    ["terms", [["8th notes", "Two notes per beat"], ["Muting", "Stopping unwanted ringing"]]],
    ["mistakes", ["Rushing 8ths", "Letting notes overlap into the next chord"]],
    ["home", "Bass Lab: root 8ths in G, D and A for 5 minutes."],
  ],
  quiz: [["G on the E string is at fret…", ["1", "3", "5", "7"], 1], ["C on the A string is at fret…", ["1", "3", "5", "8"], 1]],
  practice: [["basslab", { pattern: "roots8" }, "Bass Lab grooves"]],
});

L("bs_kick", {
  level: 1, title: "Locking with the Kick Drum", mins: 18,
  sum: "The groove lives where bass and kick meet.",
  body: [
    ["p", "When bass notes start exactly with kick drum hits, the groove feels powerful and tight. Listen to the drummer more than anyone else."],
    ["h", "Match the kick pattern"],
    ["p", "If the drummer plays kick on 1 and the '& of 2', play your notes on those beats too. Rest where the kick rests. This is called 'locking'."],
    ["w", "basslab", { pattern: "kicklock", key: 2 }, "Bass locked to the kick pattern in D."],
    ["h", "Note length"],
    ["p", "Short notes (staccato) feel punchy and leave space; long notes (legato) feel smooth. Match the drummer's feel: punchy kick → shorter bass notes."],
    ["terms", [["Locking", "Bass and kick hitting together"], ["Staccato", "Short notes"], ["Legato", "Long, connected notes"]]],
    ["mistakes", ["Playing busy lines while the drummer plays simple", "Not watching the drummer"]],
    ["home", "Groove Lab + Bass Lab: write a kick pattern, then match it with roots."],
  ],
  quiz: [["Locking means…", ["Tuning", "Bass notes with kick hits", "Playing loud", "Muting all strings"], 1]],
  practice: [["basslab", { pattern: "kicklock" }, "Lock with the kick"]],
});

L("bs_158", {
  level: 2, title: "Root–Fifth–Octave Patterns", mins: 18,
  sum: "Movement without clutter.",
  body: [
    ["p", "Root, 5th and octave are the safest notes over any major or minor chord. They add movement while keeping the harmony clear."],
    ["h", "The shape"],
    ["p", "From a root on the E string: the 5th is 2 frets up on the A string; the octave is 2 frets up on the D string. This shape works everywhere on the neck."],
    ["w", "fret", { pcs: [7, 2], root: 7, bass: true }, "G root and its 5th (D) across the neck."],
    ["w", "basslab", { pattern: "r58", key: 7 }, "1–5–8 pattern over 1–5–6–4."],
    ["h", "Rhythms"],
    ["list", ["Root (half note) – 5th (half note)", "Root–Root–5th–Octave (8ths)", "Root on 1, octave on '& of 2' for a pop feel"]],
    ["mistakes", ["Using the 5th on diminished chords (it's b5)", "Octave pops too loud"]],
    ["home", "Bass Lab: R-5-8 pattern in 5 keys."],
  ],
  quiz: [["The 5th from a root on the E string is…", ["Same fret, A string", "2 frets up, A string", "2 frets down, A string", "D string open"], 1]],
  practice: [["basslab", { pattern: "r58" }, "Root-5-8 grooves"], ["fingers", { inst: "bass", ex: "bass158" }, "1-5-8 drill"]],
});

L("bs_approach", {
  level: 2, title: "Approach Notes & Walking into Chords", mins: 18,
  sum: "Lead the band smoothly into the next chord.",
  body: [
    ["p", "On the last beat before a chord change, play a note that leads into the next root: a scale step above or below, or a half step below (chromatic approach)."],
    ["ex", "Example", "G to C: play G on beats 1–3, then B (a half step below C) on beat 4, landing on C."],
    ["w", "basslab", { pattern: "approach", key: 7 }, "Approach notes into each chord."],
    ["h", "Walk-ups and walk-downs"],
    ["p", "G – G/B – C: the bass walks G → B → C. G – D/F# – Em: G → F# → E. These lines make the whole band sound connected. Coordinate with keys."],
    ["mistakes", ["Approach notes on every beat", "Clashing with the keys player's slash chords"]],
    ["home", "Add one approach note per chord change in a song this week."],
  ],
  quiz: [["A chromatic approach into C uses…", ["D", "B", "G", "E"], 1]],
  practice: [["basslab", { pattern: "approach" }, "Approach-note grooves"]],
});

L("bs_scales", {
  level: 3, title: "Scales & Chord Tones for Bass", mins: 20,
  sum: "Know every note you can use.",
  body: [
    ["p", "Beyond roots and fifths, chord tones (1, 3, 5, 7) and scale notes let you build melodic lines and fills."],
    ["w", "fret", { pcs: [0, 2, 4, 5, 7, 9, 11], root: 0, bass: true }, "C major across the bass neck."],
    ["w", "fret", { pcs: [9, 0, 4], root: 9, bass: true }, "A minor chord tones."],
    ["p", "Major scale one-octave shape from the E string: 2-4 / 1-2-4 / 1-3-4 (fingers). Practise in every key."],
    ["w", "tool", { id: "fingers", label: "Bass major scale exercise", props: { inst: "bass", ex: "bassmajor" } }, ""],
    ["terms", [["Chord tones", "1, 3, 5, (7) of the chord"], ["Passing tone", "Scale note between chord tones"]]],
    ["mistakes", ["Playing the major 3rd over a minor chord", "Scale runs during vocal lines"]],
    ["home", "Major scale in G, D, A, E — 2 minutes each."],
  ],
  quiz: [["Chord tones of a triad are…", ["1 2 3", "1 3 5", "1 4 5", "2 4 6"], 1]],
  practice: [["fingers", { inst: "bass", ex: "bassmajor" }, "Bass scales"]],
});

L("bs_groove", {
  level: 3, title: "Groove Feel: 16ths, Ghost Notes & 6/8", mins: 20,
  sum: "Make the room move.",
  body: [
    ["p", "Groove is about placement and dynamics, not notes. Ghost notes (muted, percussive plucks) and 16th-note subdivisions create feel."],
    ["h", "Ghost notes"],
    ["p", "Lightly touch the string with the fretting hand (no pressure) and pluck: a 'thud' with no pitch. Use them between main notes for funk and gospel grooves."],
    ["h", "6/8 for Ethiopian songs"],
    ["p", "Play roots on 1 and 4 (the two big beats), with a pickup on 6. Keep it bouncy and short."],
    ["w", "basslab", { pattern: "six8", key: 9 }, "6/8 groove in A."],
    ["mistakes", ["Ghost notes too loud", "4/4 thinking in 6/8 songs"]],
    ["home", "Bass Lab 6/8 pattern for 5 minutes."],
  ],
  quiz: [["Ghost notes have…", ["Clear pitch", "No clear pitch", "Distortion", "Reverb"], 1]],
  practice: [["basslab", { pattern: "six8" }, "6/8 grooves"]],
});

L("bs_dynamics", {
  level: 4, title: "Dynamics, Space & Arrangement", mins: 16,
  sum: "When NOT to play is the expert skill.",
  body: [
    ["p", "Bass entrances are dramatic. Many arrangements leave bass out of verse 1 and bring it in at the chorus for a huge lift."],
    ["list", ["Verse 1: tacet or whole notes", "Chorus: 8ths locked to the kick", "Bridge: drop out, then build with pulsing 8ths", "Final chorus: full groove, maybe octaves", "Tag: whole notes or pedal tone"]],
    ["h", "Pedal tones"],
    ["p", "Hold one note (often the 1 or the 5) while chords change above it. It builds tension and drama in bridges."],
    ["mistakes", ["Playing the whole song at the same intensity", "Missing the leader's dynamic cues"]],
    ["home", "Map a song's bass dynamics and play it with a recording."],
  ],
  quiz: [["A pedal tone is…", ["A foot pedal", "A held note while chords change", "A fill", "A slide"], 1]],
  practice: [["basslab", { pattern: "pedal" }, "Pedal-tone builds"]],
});

L("bs_fills", {
  level: 4, title: "Fills & Melodic Lines", mins: 16,
  sum: "Tasteful moments that lift the song.",
  body: [
    ["p", "A bass fill is a short melodic phrase, usually at the end of a section. Coordinate with the drummer's fills — one of you fills, the other holds."],
    ["list", ["Scale run up into the chorus: 5-6-7-8", "Octave jumps on the last beat", "Walk-down from 1 to 6m in a bridge"]],
    ["mistakes", ["Fills at the same time as the drummer", "Fills every 4 bars"]],
    ["home", "Create one fill into a chorus and one into the bridge."],
  ],
  quiz: [["Who should fill when the drummer fills?", ["Bass too", "Usually only one of you", "Everyone", "Nobody"], 1]],
  practice: [["fingers", { inst: "bass", ex: "bassmajor" }, "Scale runs"]],
});

L("bs_lead", {
  level: 5, title: "Leading with the Bass: Inversions & Direction", mins: 16,
  sum: "Shape the harmony from the bottom.",
  body: [
    ["p", "The bass note decides how a chord feels. Playing the 3rd under a chord (1/3) creates lift; the 5th (1/5) creates suspension. Expert bassists choose inversions to make progressions flow — in agreement with the keys player."],
    ["w", "prog", { key: 7, degs: [0, 0, 3, 4], slash: [null, 2, null, null] }, "G – G/B – C – D: the bass walks up."],
    ["p", "In spontaneous worship, the bass often follows the leader's melody direction: rising bass lines under building moments, pedal tones under prayer."],
    ["home", "Choose inversions for one song's bridge and rehearse with keys."],
  ],
  quiz: [["1/3 means…", ["Play a third of a note", "1 chord with the 3rd in the bass", "Minor chord", "Skip a bar"], 1]],
  practice: [["basslab", {}, "All bass grooves"]],
});

buildTrack("bass", "Bass", "Roots · groove · lock · lead the low end", [
  "bs_role", "th_sound", "th_rhythm",
  "bs_roots", "bs_kick", "th_major", "th_chords",
  "bs_158", "bs_approach", "th_time", "th_minor",
  "bs_scales", "bs_groove",
  "bs_dynamics", "bs_fills",
  "bs_lead",
]);

/* ============================ DRUMS CURRICULUM ============================ */
L("dr_kit", {
  level: 0, title: "The Kit, Grip & Posture", mins: 16,
  sum: "Set up for power, control and healthy wrists.",
  body: [
    ["p", "The drummer is the heartbeat of the worship band. Everyone follows your time. That's a big responsibility — and a beautiful one."],
    ["h", "The parts of the kit"],
    ["list", ["Kick (bass drum) — played with the right foot", "Snare — the main backbeat", "Hi-hat — two cymbals; foot pedal opens/closes", "Toms — high, mid, floor", "Ride — steady pattern cymbal", "Crash — accents and transitions"]],
    ["w", "drumkit", {}, "Tap each piece to hear the real kit samples."],
    ["h", "Grip"],
    ["p", "Matched grip: both hands hold the sticks the same way. The fulcrum is between the thumb and the first two fingers, about a third from the butt end. Other fingers wrap loosely. Let the stick bounce — don't squeeze."],
    ["h", "Posture & setup"],
    ["steps", ["Throne height: thighs level or slightly sloping down", "Snare just above your knees, slightly tilted", "Hi-hat and kick pedals where feet rest naturally", "Cymbals reachable without stretching", "Back straight, shoulders relaxed"]],
    ["terms", [["Fulcrum", "Pivot point of the grip"], ["Matched grip", "Both hands same"], ["Rebound", "Letting the stick bounce back"]]],
    ["mistakes", ["Death grip on the sticks", "Throne too low (knees up)", "Burying the beater into the kick head"]],
    ["home", "5 minutes: single strokes on a pad or pillow with the click at 70 BPM, focusing on rebound."],
  ],
  quiz: [["The fulcrum is between…", ["Pinky and ring", "Thumb and first fingers", "Palm and wrist", "Elbow"], 1]],
  practice: [["rudiments", { r: "singles" }, "Single strokes"]],
});

L("dr_count", {
  level: 0, title: "Counting, Subdivision & the Click", mins: 16,
  sum: "Your internal clock is your most important instrument.",
  body: [
    ["p", "A drummer must feel quarter notes, 8ths, triplets and 16ths at any tempo — and switch between them without changing the pulse."],
    ["w", "click", { bpm: 70, beats: 4, sub: 4 }, "16ths: '1 e & a 2 e & a…'"],
    ["w", "click", { bpm: 70, beats: 4, sub: 3 }, "Triplets: '1 trip let 2 trip let…'"],
    ["h", "Playing with a click"],
    ["p", "In-ear click is standard in modern worship. The goal is to 'bury' the click — play so exactly with it that you can't hear it. Practise at slow tempos: slow is harder than fast."],
    ["h", "Counting in the band"],
    ["p", "Count-ins must be loud, clear and in tempo: '1… 2… 1 2 3 4'. Or click the sticks. Everyone enters on the next 1."],
    ["mistakes", ["Speeding up in choruses", "Unclear count-ins", "Only practising fast"]],
    ["home", "Rhythm Lab & metronome: subdivision changes (quarters → 8ths → triplets → 16ths) every bar at 60 BPM."],
  ],
  quiz: [["16ths are counted…", ["1 & 2 &", "1 e & a", "1 trip let", "1 2 3 4"], 1]],
  practice: [["rhythm", {}, "Rhythm Lab"], ["rudiments", { r: "singles" }, "Subdivision drill"]],
});

L("dr_firstgroove", {
  level: 1, title: "Your First Worship Groove", mins: 18,
  sum: "Kick on 1 and 3, snare on 2 and 4, 8ths on the hats.",
  body: [
    ["p", "This one beat powers thousands of worship songs. Learn it until it's effortless."],
    ["steps", ["Right hand: 8ths on the hi-hat: 1 & 2 & 3 & 4 &", "Left hand: snare on 2 and 4", "Right foot: kick on 1 and 3", "Put hands together first, then add the foot"]],
    ["w", "groove", { id: "basic" }, "Basic rock/worship groove — real drum samples."],
    ["h", "Variations"],
    ["list", ["Kick on 1, '& of 2' and 3 (pop feel)", "Ride instead of hi-hat in choruses", "Quarter notes on hats for slow songs", "Cross-stick instead of snare for soft verses"]],
    ["w", "groove", { id: "pop" }, "Pop worship variation."],
    ["mistakes", ["Hi-hat louder than snare", "Kick drifting off the beat"]],
    ["home", "Groove Lab: basic groove 70–100 BPM, 5 minutes."],
  ],
  quiz: [["In the basic groove the snare plays on…", ["1 and 3", "2 and 4", "Every 8th", "Only 1"], 1]],
  practice: [["groove", { id: "basic" }, "Groove Lab"]],
});

L("dr_rudiments", {
  level: 1, title: "Rudiments: Singles, Doubles & Paradiddles", mins: 20,
  sum: "The vocabulary of every fill and groove.",
  body: [
    ["p", "Rudiments are sticking patterns that build control. Every fill you'll ever play is made of them."],
    ["list", ["Single stroke roll: R L R L", "Double stroke roll: R R L L", "Paradiddle: R L R R L R L L", "Triplets: R L R L R L", "Flam: grace note + main note", "Six-stroke roll: R L L R R L"]],
    ["w", "tool", { id: "rudiments", label: "Open the Rudiment Trainer" }, "Hear each rudiment with left/right panning and accents."],
    ["h", "Practice method"],
    ["p", "Start at 60 BPM. Play each rudiment for 1 minute. Increase 5 BPM only when perfectly even. Practise on a pad with a click daily."],
    ["mistakes", ["Weak left hand", "Speeding up when tired"]],
    ["home", "Rudiment Trainer: singles, doubles, paradiddles — 2 minutes each with tempo ramp."],
  ],
  quiz: [["A paradiddle is…", ["RLRL", "RRLL", "RLRR LRLL", "RLL"], 2]],
  practice: [["rudiments", { r: "paradiddle" }, "Rudiment Trainer"], ["session", { id: "dr_daily" }, "30-min Drummer Session"]],
});

L("dr_fills", {
  level: 2, title: "Fills & Transitions", mins: 18,
  sum: "Lead the band into the next section.",
  body: [
    ["p", "A fill tells the band: 'something is changing!'. Good fills are short, in time and land on 1 with a crash."],
    ["list", ["1-beat fill: 16ths on the snare on beat 4", "2-beat fill: snare to toms on beats 3–4", "Full-bar fill: around the toms", "Build fill: 8ths → 16ths on the snare over 2–4 bars"]],
    ["w", "groove", { id: "fill" }, "3 bars groove + 1 bar fill."],
    ["mistakes", ["Fills that rush", "Landing late on the 1", "Fills too big for the song"]],
    ["home", "Practise 1-beat and 2-beat fills into the crash at 80 BPM."],
  ],
  quiz: [["A good fill lands on…", ["Beat 2", "The next 1", "Anywhere", "The & of 4"], 1]],
  practice: [["groove", { id: "fill" }, "Fill trainer"]],
});

L("dr_dynamics", {
  level: 2, title: "Dynamics & Building a Worship Song", mins: 18,
  sum: "From whisper to roar — and back.",
  body: [
    ["p", "Worship drumming is a journey: you control the energy of the room. Play the song, not the kit."],
    ["list", ["Verse: cross-stick, closed hats, light kick", "Pre-chorus: open hats slightly, add toms", "Chorus: full snare, ride or open hats, crashes on 1", "Bridge: drop to kick only or toms, then build with 8th-note snare", "Final chorus: biggest", "Tag: half-time or out"]],
    ["h", "Half-time feel"],
    ["p", "Snare only on beat 3 instead of 2 and 4 — the song feels slower and bigger without changing tempo."],
    ["w", "groove", { id: "half" }, "Half-time build."],
    ["home", "Map one song's dynamics and play it with the recording."],
  ],
  quiz: [["Half-time places the snare on…", ["1", "2 and 4", "3", "Every beat"], 2]],
  practice: [["groove", { id: "half" }, "Half-time groove"]],
});

L("dr_click", {
  level: 2, title: "Playing with Click & In-Ears", mins: 14,
  sum: "Lead the band with rock-solid time.",
  body: [
    ["p", "With a click, the drummer is usually the person who starts and controls tracks/loops. Know your tempos, and have them written on your setlist."],
    ["list", ["Set click volume so it's clear but not painful", "Use accented downbeats", "Count-in with the click for 1 bar", "If the click fails, keep steady time — never stop"]],
    ["home", "Groove at 64 BPM with the click for 3 minutes — try to make it disappear."],
  ],
  quiz: [["If the click fails you should…", ["Stop", "Keep steady time", "Speed up", "Wait"], 1]],
  practice: [["rhythm", {}, "Rhythm Lab"]],
});

L("dr_68", {
  level: 3, title: "6/8 & Ethiopian Grooves", mins: 20,
  sum: "Chikchika-style feels and swaying worship grooves.",
  body: [
    ["p", "Ethiopian worship is full of triple-feel grooves. Many songs bounce in 6/8 or 12/8 with heavy beats on 1 and 4, with the kebero (traditional drum) often driving the energy."],
    ["w", "groove", { id: "ballad" }, "6/8 ballad."],
    ["w", "groove", { id: "chik" }, "Ethiopian 6/8 feel (simplified)."],
    ["p", "Listen to Ethiopian gospel recordings and copy the kebero rhythms onto snare and toms. Keep hats light so the bounce is felt."],
    ["mistakes", ["Thinking in 4/4", "Too many cymbals"]],
    ["home", "Play both 6/8 grooves at 3 tempos."],
  ],
  quiz: [["Strong beats in 6/8 are…", ["1 and 4", "2 and 4", "1 and 3", "3 and 6"], 0]],
  practice: [["groove", { id: "chik" }, "6/8 grooves"]],
});

L("dr_ghost", {
  level: 3, title: "Ghost Notes & Groove Feel", mins: 16,
  sum: "The quiet notes that make grooves feel alive.",
  body: [
    ["p", "Ghost notes are very soft snare strokes between the main backbeats. They add movement — essential in gospel and funk feels."],
    ["p", "Play accented backbeats at full height and ghost notes from 1–2 cm above the head. Practise with an accent rudiment first."],
    ["w", "groove", { id: "ghost" }, "Groove with ghost notes."],
    ["home", "Rudiment Trainer accents + ghost-note groove for 5 minutes."],
  ],
  quiz: [["Ghost notes should be…", ["Loud", "Very soft", "On the crash", "On the kick"], 1]],
  practice: [["groove", { id: "ghost" }, "Ghost-note groove"]],
});

L("dr_cinematic", {
  level: 4, title: "Toms, Swells & Cinematic Worship", mins: 16,
  sum: "Big moments with tom grooves and cymbal swells.",
  body: [
    ["p", "Modern worship bridges often use floor-tom grooves (tribal) and mallet cymbal swells. They create anticipation without the full kit."],
    ["list", ["Floor tom 8ths with kick on 1 — builds tension", "Mallets on the ride/crash for swells", "Tom groove → full kit for the final chorus"]],
    ["w", "groove", { id: "toms" }, "Tom-driven build."],
    ["home", "Create a 4-bar tom build into a chorus."],
  ],
  quiz: [["Mallets are used for…", ["Kick", "Cymbal swells", "Ghost notes", "Count-ins"], 1]],
  practice: [["groove", { id: "toms" }, "Tom builds"]],
});

L("dr_lead", {
  level: 5, title: "Leading the Band from the Drums", mins: 16,
  sum: "Hits, stops, pushes and spontaneous worship.",
  body: [
    ["p", "Expert drummers anticipate. Watch the leader, call sections with fills, and set up band hits clearly."],
    ["list", ["Pushes: crash on the '& of 4' with the band", "Stops: cut everything on the 1 and let the vocals carry", "Spontaneous moments: simplify to kick + toms, follow the leader's energy", "Endings: big build → hit → let ring"]],
    ["home", "Plan and rehearse one push, one stop and one ending with the band."],
  ],
  quiz: [["A push lands on…", ["Beat 1", "The '& of 4'", "Beat 3", "Never"], 1]],
  practice: [["groove", {}, "Groove Lab"]],
});

buildTrack("drums", "Drums", "Time · groove · rudiments · dynamics", [
  "dr_kit", "dr_count", "th_rhythm",
  "dr_firstgroove", "dr_rudiments",
  "dr_fills", "dr_dynamics", "dr_click", "th_time",
  "dr_68", "dr_ghost",
  "dr_cinematic",
  "dr_lead",
]);
