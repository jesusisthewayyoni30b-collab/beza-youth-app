
/* ============================ SOUND ENGINEER CURRICULUM ============================ */
L("sd_what", {
  level: 0, title: "What Is Sound? Frequency, Level & dB", mins: 18,
  sum: "The physics every engineer must understand.",
  body: [
    ["p", "Welcome to the sound desk! The sound team serves everyone: the congregation hears through you, the singers hear themselves through you. Let's start with what sound actually is."],
    ["h", "Sound waves"],
    ["p", "Sound is pressure waves moving through air. Frequency (Hz) is how many waves per second — low frequencies are bass (20–250 Hz), mids carry most of the voice (250 Hz–4 kHz), highs bring clarity and air (4–20 kHz). Human hearing covers about 20 Hz to 20 kHz."],
    ["list", ["Sub-bass 20–60 Hz: felt more than heard (kick, bass)", "Bass 60–250 Hz: warmth and body", "Low-mids 250–500 Hz: 'mud' lives here", "Mids 500 Hz–2 kHz: tone of most instruments", "Upper-mids 2–5 kHz: presence and clarity (and harshness)", "Highs 5–20 kHz: sparkle, air, sibilance"]],
    ["w", "eqdemo", { f: 100 }, "Hear a boost at 100 Hz (warmth)."],
    ["w", "eqdemo", { f: 3000 }, "Hear a boost at 3 kHz (presence)."],
    ["h", "Level and decibels"],
    ["p", "Loudness is measured in decibels (dB). It's a log scale: +6 dB ≈ double the signal level, +10 dB sounds about twice as loud. On the console, 0 dB on a fader means 'unity' — no change. Digital meters (dBFS) top out at 0; above that is clipping (distortion)."],
    ["h", "Safe listening"],
    ["p", "Church services typically run 85–95 dB SPL at the mix position. Above 100 dB for long periods damages hearing — for you and the congregation. Use an SPL meter app and protect your ears."],
    ["terms", [["Hz", "Cycles per second"], ["dB", "Decibel — level ratio"], ["dBFS", "Digital level relative to full scale"], ["SPL", "Sound pressure level (how loud in the room)"], ["Unity", "0 dB — no change in level"]]],
    ["mistakes", ["Mixing louder to 'fix' things", "Ignoring the low-mid mud zone", "Not taking ear breaks"]],
    ["home", "EQ Lab ear quiz: 10 rounds. Learn which bands sound 'boomy', 'boxy', 'honky', 'harsh' and 'airy'."],
  ],
  quiz: [["Mud usually lives around…", ["50 Hz", "250–500 Hz", "3 kHz", "12 kHz"], 1], ["+6 dB roughly…", ["Halves the level", "Doubles the signal level", "Adds bass", "Does nothing"], 1], ["0 dB on a fader means…", ["Silent", "Unity — no change", "Maximum", "Clipping"], 1]],
  practice: [["eq7", { quiz: true }, "EQ ear training"]],
});

L("sd_flow", {
  level: 0, title: "Signal Flow: From Mic to Speaker", mins: 20,
  sum: "If you understand the path, you can fix any problem.",
  body: [
    ["p", "Signal flow is the road the sound travels. When something goes wrong during the youth program, engineers who know the road find the problem in seconds."],
    ["w", "tool", { id: "flow", label: "Interactive signal flow" }, "Tap each stage to learn what it does."],
    ["h", "The channel strip, in order"],
    ["steps", ["Input: mic or DI plugged into the stage box", "Preamp gain: brings the signal to a healthy level", "Phantom power (+48V) for condenser mics and active DIs", "High-pass filter: removes rumble", "Gate (optional) → EQ → Compressor (order can vary)", "Aux sends: pre-fader to monitors, post-fader to effects", "Pan & channel fader", "Groups/DCAs → Main L/R → amplifiers/speakers"]],
    ["h", "Troubleshooting with flow"],
    ["p", "No sound from the lead vocal? Follow the road: Is the mic on? Cable connected? Right stage box input? Gain up? Channel muted? Fader up? Assigned to main? Main up? Check the meters at each step."],
    ["terms", [["Stage box/snake", "Carries stage inputs to the console"], ["DI box", "Converts instrument signals for the console"], ["Pre-fader", "Send not affected by channel fader"], ["Post-fader", "Send follows the channel fader"], ["DCA", "Remote fader controlling several channels"]]],
    ["mistakes", ["Phantom power on ribbon mics (can damage some)", "Monitor sends post-fader (singers' mix changes when you mix FOH)", "Starting with faders up and gains wrong"]],
    ["home", "Draw your church's signal flow from stage to speakers. Label every input."],
  ],
  quiz: [["Monitor sends are usually…", ["Post-fader", "Pre-fader", "Off", "On the master"], 1], ["Condenser mics need…", ["Phantom power", "A DI", "A gate", "Reverb"], 0]],
  practice: [["flow", {}, "Signal flow & gain"]],
});

L("sd_mics", {
  level: 1, title: "Microphones, DIs & Placement", mins: 20,
  sum: "Capture the best sound at the source.",
  body: [
    ["p", "The best EQ is a good microphone in the right place. Fix it at the source and the mix becomes easy."],
    ["h", "Mic types"],
    ["list", ["Dynamic (e.g. SM58/SM57): rugged, handles loud sources — vocals, guitar amps, snare", "Condenser: detailed, sensitive — choir, acoustic instruments, overheads; needs phantom power", "Ribbon: smooth, vintage — less common live"]],
    ["h", "Polar patterns"],
    ["p", "Cardioid mics pick up from the front and reject the back. Point the back at the monitor wedge. Supercardioid rejects the sides more but has a small rear lobe — angle wedges at about 45°."],
    ["h", "Placement guide"],
    ["list", ["Vocals: 2–8 cm, slightly off-axis to reduce pops", "Acoustic guitar: DI, or mic 15–30 cm from where neck meets body", "Guitar amp: close to the speaker, between centre and edge", "Kick: inside or at the port; snare: 3–5 cm above the rim, angled at the centre", "Keys/bass: DI boxes (stereo for keys)"]],
    ["h", "DI boxes"],
    ["p", "Instrument outputs are high impedance and unbalanced; DIs convert them to balanced mic-level signals for long cable runs. Passive DIs for active pickups/keys; active DIs for passive pickups."],
    ["terms", [["Cardioid", "Heart-shaped pickup pattern"], ["Proximity effect", "More bass when close"], ["Balanced", "Noise-cancelling cable connection (XLR)"], ["Off-axis", "Not pointing directly at the source"]]],
    ["mistakes", ["Condenser vocal mics on loud stages (feedback)", "Mic pointed at the wedge", "Long unbalanced instrument cables"]],
    ["home", "Make an input list for Sunday: channel, source, mic/DI, phantom, stand."],
  ],
  quiz: [["A cardioid rejects sound from the…", ["Front", "Back", "Top", "Nowhere"], 1], ["DI boxes are used for…", ["Vocals", "Keys and bass", "Drums only", "Speakers"], 1]],
  practice: [["flow", {}, "Signal flow"]],
});

L("sd_gain", {
  level: 1, title: "Gain Staging", mins: 18,
  sum: "The single most important skill on the desk.",
  body: [
    ["p", "Gain staging means setting healthy levels at every stage so you get maximum clarity and minimum noise and distortion."],
    ["h", "Setting preamp gain"],
    ["steps", ["Faders down, PFL/solo the channel", "Ask the musician to play/sing at their LOUDEST", "Raise gain until peaks hit about −12 to −6 dBFS (digital) or around 0 VU/yellow (analog)", "Leave headroom for the excited final chorus", "Then bring the fader up to blend"]],
    ["w", "tool", { id: "flow", label: "Practise setting gain" }, "Move the gain until the meter sits in the green zone."],
    ["h", "Why it matters"],
    ["list", ["Too low: noise, and you'll push faders to the top", "Too high: clipping — harsh distortion that EQ can't fix", "Right: faders sit near 0 dB where they're most precise"]],
    ["tip", "Singers sing louder on Sunday than at soundcheck. Leave 3–6 dB extra headroom on vocals."],
    ["terms", [["Headroom", "Space between normal level and clipping"], ["PFL", "Pre-fade listen — solo for checking"], ["Clipping", "Distortion from overload"]]],
    ["mistakes", ["Using faders to fix wrong gain", "Setting gain on quiet speaking", "Changing gain during the service (it changes monitors too!)"]],
    ["home", "Signal flow tool: set gain correctly 5 times in a row."],
  ],
  quiz: [["Digital peak target for gain is around…", ["0 dBFS", "−12 to −6 dBFS", "−40 dBFS", "+6 dBFS"], 1], ["Changing preamp gain during a service also changes…", ["Nothing", "Monitor levels", "The lyrics", "Phantom power"], 1]],
  practice: [["flow", {}, "Gain staging"]],
});

L("sd_eq", {
  level: 2, title: "EQ Deep Dive (7-Band)", mins: 26,
  sum: "Shape tone, remove problems and make room for everyone.",
  body: [
    ["p", "EQ (equalisation) changes the balance of frequencies. Used well, it makes every instrument clear. Used badly, it makes everything harsh or muddy."],
    ["h", "EQ types"],
    ["list", ["High-pass filter (HPF): removes everything below a frequency", "Shelf: boosts/cuts everything above (high shelf) or below (low shelf)", "Bell/peaking: boosts/cuts around a centre frequency; Q sets the width", "Graphic EQ: fixed bands, often on speakers/monitors"]],
    ["w", "tool", { id: "eq7", label: "Open the 7-band EQ Lab" }, "Upload a real recording or use the band demo, and shape it live with the spectrum analyser."],
    ["h", "Cut before you boost"],
    ["p", "Find problems by sweeping: boost a narrow bell +8 dB, sweep until it sounds worst, then CUT there by 3–6 dB. Then add small boosts only if needed."],
    ["h", "Instrument starting points"],
    ["list", ["Lead vocal: HPF 100 Hz, cut 250–400 Hz mud, small boost 3–5 kHz presence, de-ess 6–8 kHz, air shelf 10–12 kHz", "Acoustic DI: HPF 80–100, cut 200 Hz boom, cut boxy 800 Hz, boost 5 kHz sparkle", "Kick: boost 60 Hz thump, cut 300–400 Hz box, boost 3–4 kHz click", "Snare: boost 200 Hz body, 5 kHz crack", "Bass: HPF 35–40, boost 80–100 body, cut 250 mud, boost 700–1k growl", "Keys/pads: HPF 120–200 Hz to stay out of the bass"]],
    ["h", "Making room (complementary EQ)"],
    ["p", "If the vocal and acoustic fight at 3 kHz, cut the acoustic a little at 3 kHz and boost the vocal there. Every instrument gets its own 'space'."],
    ["terms", [["Q", "Bandwidth of a bell EQ"], ["Sweep", "Moving a boosted band to find a problem"], ["De-esser", "Reduces harsh 's' sounds"], ["Complementary EQ", "Cutting one source where another is boosted"]]],
    ["mistakes", ["Boosting everything", "EQ'ing in solo for too long — judge in the full mix", "No HPF on vocals and pads"]],
    ["home", "EQ Lab with a song you upload: build a vocal EQ chain, then do 20 rounds of the 7-band ear quiz."],
  ],
  quiz: [["To find a problem frequency you…", ["Cut wide", "Boost narrow and sweep", "Turn up the master", "Add reverb"], 1], ["Q controls…", ["Volume", "Bandwidth", "Delay time", "Phantom power"], 1], ["Vocal 'presence' is around…", ["100 Hz", "400 Hz", "3–5 kHz", "15 kHz"], 2]],
  practice: [["eq7", {}, "7-band EQ Lab"], ["eq7", { quiz: true }, "Ear quiz"], ["session", { id: "sd_ear" }, "30-min Engineer Ear Session"]],
});

L("sd_comp", {
  level: 2, title: "Compression Deep Dive", mins: 24,
  sum: "Control dynamics so every word is heard.",
  body: [
    ["p", "A compressor automatically turns down loud moments. This keeps vocals steady, bass even and drums punchy."],
    ["h", "The controls"],
    ["list", ["Threshold: level where compression starts", "Ratio: how much it reduces (4:1 = 4 dB over → 1 dB out)", "Attack: how fast it reacts (fast catches peaks, slow keeps punch)", "Release: how fast it lets go", "Knee: soft or hard onset", "Make-up gain: brings level back up"]],
    ["w", "tool", { id: "comp", label: "Compression Lab (try it on your own audio)" }, "Watch the gain-reduction meter move."],
    ["h", "Starting points"],
    ["list", ["Lead vocal: 3:1, attack 10 ms, release 100–150 ms, 3–6 dB gain reduction", "Bass: 4:1, attack 20–30 ms, release 100 ms", "Kick/snare: 4:1, slower attack (20–30 ms) to keep the transient", "Acoustic: 2.5:1, gentle", "Mix bus/group: 2:1, slow attack, 1–2 dB GR for glue"]],
    ["h", "Listening for compression"],
    ["p", "Too much: lifeless, pumping, breaths get loud, feedback risk rises (quiet parts get louder). Just right: you stop chasing the fader."],
    ["terms", [["Gain reduction (GR)", "How much the compressor turns down"], ["Transient", "The initial attack of a sound"], ["Pumping", "Audible breathing of the compressor"]]],
    ["mistakes", ["Heavy compression on vocals in a feedback-prone room", "Fast attack on drums killing punch", "Forgetting make-up gain"]],
    ["home", "Compression Lab: upload a vocal recording, set 3–6 dB GR using the presets, then make your own."],
  ],
  quiz: [["Ratio 4:1 means…", ["4 dB in → 4 dB out", "4 dB over threshold → 1 dB out", "Volume ×4", "4 ms attack"], 1], ["Slow attack on drums…", ["Removes punch", "Keeps the transient punch", "Adds reverb", "Causes feedback"], 1]],
  practice: [["comp", {}, "Compression Lab"]],
});

L("sd_fx", {
  level: 3, title: "Reverb & Delay", mins: 20,
  sum: "Space and depth without mud.",
  body: [
    ["p", "Effects put sounds in a 'space'. Worship relies on reverb and delay for atmosphere — but too much makes words unclear."],
    ["h", "Reverb"],
    ["list", ["Plate: smooth, bright — classic vocal reverb (1.4–2.2 s)", "Hall: big and lush — ballads (2.5–4 s)", "Room: natural, short — drums", "Pre-delay 20–60 ms keeps words clear before the reverb blooms"]],
    ["h", "Delay"],
    ["p", "Repeats of the sound. Sync to the song tempo: quarter note = 60000 ÷ BPM ms. Use 'throws' — send a vocal phrase end to the delay — rather than constant delay."],
    ["w", "delaycalc", {}, "Delay time calculator."],
    ["h", "Send/return setup"],
    ["p", "Put reverbs and delays on aux sends (post-fader), not inserts. One vocal reverb shared by all singers gives a unified space. High-pass the reverb return (~200 Hz) and low-pass it (~8–10 kHz) to avoid mud and harshness."],
    ["w", "tool", { id: "fx", label: "Reverb & Delay Lab" }, "Hear the settings on real audio."],
    ["terms", [["Pre-delay", "Gap before reverb starts"], ["Decay/RT60", "Reverb length"], ["Throw", "Momentary effect send"], ["Return", "Effect output back into the mix"]]],
    ["mistakes", ["Reverb on the kick and bass", "Delay not in time", "Same reverb amount for speaking and singing — mute FX during speaking/prayer"]],
    ["home", "Set up a vocal plate and a tempo delay on uploaded audio in the FX lab."],
  ],
  quiz: [["Quarter-note delay at 60 BPM =", ["500 ms", "1000 ms", "250 ms", "60 ms"], 1], ["Reverbs are best on…", ["Inserts", "Aux sends", "The master only", "Gain knob"], 1]],
  practice: [["fx", {}, "Reverb & Delay Lab"]],
});

L("sd_monitors", {
  level: 3, title: "Monitor Mixing & In-Ears", mins: 20,
  sum: "A happy stage makes a better worship service.",
  body: [
    ["p", "If the team can't hear, they can't sing in tune or play together. Monitor mixing is serving the servants."],
    ["h", "Wedges"],
    ["list", ["Each wedge is an aux mix, pre-fader", "Give people what they ASK for, not everything", "Typical singer mix: own voice loudest, leader, keys/acoustic for pitch", "Ring out wedges with a graphic EQ to prevent feedback"]],
    ["h", "In-ear monitors (IEMs)"],
    ["p", "IEMs reduce stage volume and feedback. Mixes should be stereo if possible, include a bit of reverb and room/audience mics so musicians don't feel isolated. Always start IEM levels low."],
    ["h", "Communication"],
    ["p", "Agree on hand signals: point to the source then up/down. Use a talkback mic. Stay calm and kind — musicians are often nervous."],
    ["terms", [["Aux mix", "Separate mix sent to a monitor"], ["Talkback", "Engineer's mic to the stage"], ["Ringing out", "Removing feedback frequencies"]]],
    ["mistakes", ["Post-fader monitor sends", "Everyone in everyone's monitor", "Loud wedges causing feedback into vocal mics"]],
    ["home", "Interview two musicians: what do they need in their monitor? Write their 'monitor recipes'."],
  ],
  quiz: [["Monitor mixes should start from…", ["Everything loud", "What the musician needs", "Only drums", "The FOH mix"], 1]],
  practice: [["mixer", {}, "Mixer practice"]],
});

L("sd_buildmix", {
  level: 3, title: "Building a Worship Mix", mins: 26,
  sum: "Vocals first, then build the band around them.",
  body: [
    ["p", "A great worship mix lets the congregation sing along: clear words, a solid foundation and emotion that follows the song."],
    ["h", "Build order"],
    ["steps", ["Lead vocal — clear and on top", "Backing vocals — supporting, slightly lower", "Acoustic/keys — harmonic bed", "Drums — kick & snare first, then overheads", "Bass — lock with kick", "Electric guitars & pads — fill the space", "Effects last"]],
    ["w", "tool", { id: "mixer", label: "Open the Mixer (upload stems or use the demo band)" }, "Practise build order with real multitrack audio."],
    ["h", "Balance tips"],
    ["list", ["Mix from the congregation's position, not just the booth", "Use DCAs/groups: VOX, BAND, DRUMS, FX", "Pan keys/guitars slightly left/right for width; keep vocals, kick, snare and bass centre", "Check the mix at low volume — if the vocal is clear quietly, it's clear loudly"]],
    ["h", "Mixing the moment"],
    ["p", "Ride the lead vocal fader all service. Lift the band in instrumental moments; pull back for prayer. Mute FX during speaking. Follow the song's map."],
    ["terms", [["Balance", "Relative levels"], ["Panning", "Left/right placement"], ["Riding", "Constant small fader moves"]]],
    ["mistakes", ["Mixing the band first then trying to fit vocals on top", "Too loud too early — leave somewhere to go", "Ignoring the room's acoustics"]],
    ["home", "Mixer: build a full mix of the demo band in the correct order. Then upload your own stems and do it again."],
  ],
  quiz: [["What goes first in the build order?", ["Drums", "Lead vocal", "Bass", "Reverb"], 1], ["What stays centred?", ["Pads", "Vocal, kick, snare, bass", "Electric guitar", "Reverb"], 1]],
  practice: [["mixer", {}, "Mixer"], ["session", { id: "sd_mix" }, "30-min Mixing Session"]],
});

L("sd_feedback", {
  level: 4, title: "Feedback, Acoustics & PA Tuning", mins: 22,
  sum: "Tame the squeal and make the room work for you.",
  body: [
    ["p", "Feedback happens when a mic picks up a speaker that plays the mic's own signal, looping and growing. Every engineer must prevent and fix it fast."],
    ["h", "Prevention"],
    ["list", ["Mains in front of the mics, angled away", "Wedges behind cardioid mic rejection", "Singers close to mics (lets you use less gain)", "Fewer open mics — mute unused channels", "Avoid heavy compression on quiet singers"]],
    ["h", "Ringing out"],
    ["steps", ["Set the system to normal level", "Slowly raise a monitor until it starts to ring", "Find the frequency (RTA or ears + graphic EQ)", "Cut 3–6 dB narrowly", "Repeat for 2–3 frequencies; stop before the sound becomes thin"]],
    ["w", "eqdemo", { f: 2500, ring: true }, "What a ringing frequency sounds like (gentle demo)."],
    ["h", "Room acoustics"],
    ["p", "Hard walls create long reverb and echoes. Soft materials (curtains, carpets, people!) absorb sound. An empty room sounds very different from a full one — expect to adjust after people arrive."],
    ["terms", [["Feedback", "Loop between mic and speaker"], ["RTA", "Real-time analyser"], ["Gain before feedback", "How loud a mic can get before ringing"]]],
    ["mistakes", ["Cutting huge amounts on the main EQ", "Leaving unused mics open", "Panicking — pull the fader down first, then fix"]],
    ["home", "During a rehearsal, ring out one wedge with the leader's permission."],
  ],
  quiz: [["First action when feedback starts?", ["Add reverb", "Pull the offending fader down", "Turn up the master", "Unplug the mic"], 1]],
  practice: [["eq7", { quiz: true }, "Frequency ear training"]],
});

L("sd_daw", {
  level: 4, title: "DAW Recording & Editing", mins: 24,
  sum: "Record rehearsals, make stems and produce worship tracks.",
  body: [
    ["p", "A DAW (Digital Audio Workstation) — Reaper, Logic, Ableton, Studio One, Pro Tools — records and edits audio. Worship teams use DAWs for multitrack recording, virtual soundchecks, tracks/click and online releases."],
    ["h", "Session setup"],
    ["list", ["Sample rate 48 kHz, 24-bit", "Name and colour tracks before recording", "Group tracks: VOX, DRUMS, BAND", "Record with peaks around −12 dBFS"]],
    ["h", "Editing"],
    ["list", ["Cut, move and fade regions; always fade edits to avoid clicks", "Comping: choose the best takes", "Pitch & timing correction: subtle — keep it human"]],
    ["h", "Inserts, sends and buses"],
    ["p", "Inserts process one track (EQ, compression). Sends share effects. Buses sum groups so you can process them together. Same concepts as the live console!"],
    ["h", "Virtual soundcheck"],
    ["p", "Record a multitrack of rehearsal, then play it back through the console channels to practise mixing without the band. This is the best training tool for sound teams — you can use the Mixer in this app the same way with uploaded stems."],
    ["h", "Exporting"],
    ["p", "Leave about −6 dB peak on the master before mastering. Export WAV for mastering, MP3/AAC for sharing in the team chat."],
    ["terms", [["DAW", "Recording software"], ["Comping", "Combining best takes"], ["Bus", "Group channel"], ["Stem", "Group mixdown (e.g. drums stem)"]]],
    ["mistakes", ["Unnamed tracks", "Edits without fades", "Recording too hot"]],
    ["home", "Export 4 stems (vocals, drums, bass, keys) from any project and mix them in the Mixer tool."],
  ],
  quiz: [["Recording peaks should be around…", ["0 dBFS", "−12 dBFS", "−60 dBFS", "+3 dBFS"], 1], ["A stem is…", ["A mic stand", "A group mixdown", "A plugin", "A cable"], 1]],
  practice: [["mixer", {}, "Mix your own stems"]],
});

L("sd_stream", {
  level: 4, title: "Live Streaming & Broadcast Mix", mins: 18,
  sum: "Make home viewers feel they're in the room.",
  body: [
    ["p", "The livestream mix is different from the room mix. In the room, drums and bass are loud acoustically; online, everything comes from your mix."],
    ["list", ["Use a separate aux or matrix for broadcast", "More vocals, more bass and drums than the FOH mix", "Add audience/room mics so it doesn't sound like a studio", "Use a gentle bus compressor and limiter (−1 dBTP ceiling)", "Check sync between video and audio", "Always monitor the stream on headphones"]],
    ["terms", [["Matrix", "Mix of mixes"], ["Limiter", "Prevents peaks over a ceiling"], ["LUFS", "Loudness standard (−14 to −16 LUFS for streaming)"]]],
    ["mistakes", ["Sending the room mix to the stream", "No limiter", "Forgetting to unmute the stream send"]],
    ["home", "Make a broadcast checklist for your church's stream."],
  ],
  quiz: [["Streaming loudness target is roughly…", ["−3 LUFS", "−14 to −16 LUFS", "−40 LUFS", "0 dB"], 1]],
  practice: [["mixer", {}, "Mixer"]],
});

L("sd_sunday", {
  level: 5, title: "Sunday Workflow & Troubleshooting Under Pressure", mins: 20,
  sum: "Calm, prepared, ready for anything.",
  body: [
    ["p", "Expert engineers are calm. Preparation and routine let you handle surprises without panic."],
    ["h", "Sunday timeline"],
    ["steps", ["Arrive 90 minutes early; power on console first, amps last", "Load the scene; check batteries in wireless mics", "Line check every input (quick tap/speak)", "Gain staging with each musician", "Monitor mixes", "FOH mix with the full band", "Save the scene", "Pray with the team", "Mix the service; take notes", "Power down: amps first, console last"]],
    ["h", "Troubleshooting order"],
    ["list", ["Is it muted? Is the fader up?", "Is there signal on the meter?", "Cable/battery/wireless channel?", "Patch (input number) correct?", "Swap the cable or mic", "Have a backup mic ready on a spare channel"]],
    ["h", "Communication"],
    ["p", "Keep a calm voice on talkback. After the service, debrief: what went well, what to fix. Celebrate the team."],
    ["mistakes", ["No backup plan", "Last-minute scene changes without saving", "Blaming musicians publicly"]],
    ["home", "Write your church's Sunday checklist and share it with the sound team."],
  ],
  quiz: [["Power-on order?", ["Amps first", "Console first, amps last", "Any order", "Speakers only"], 1]],
  practice: [["session", { id: "sd_mix" }, "30-min Mixing Session"]],
});

buildTrack("sound", "Sound", "Signal flow · EQ · dynamics · mixing", [
  "sd_what", "sd_flow",
  "sd_mics", "sd_gain",
  "sd_eq", "sd_comp",
  "sd_fx", "sd_monitors", "sd_buildmix",
  "sd_feedback", "sd_daw", "sd_stream",
  "sd_sunday",
]);
