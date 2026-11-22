/* ============================ HOW TO DO IT: pictures, videos and detailed steps for every singer exercise ============================ */

/* ---- moving stick-figure pictures (our own drawings) ---- */
const J = (o) => o; // joints: h head, n neck, p hip, eL/hL eR/hR elbows/hands, kL/fL kR/fR knees/feet
const STAND = J({ h: [100, 38], n: [100, 58], p: [100, 120], eL: [86, 88], hL: [84, 118], eR: [114, 88], hR: [116, 118], kL: [93, 155], fL: [91, 190], kR: [107, 155], fR: [109, 190] });
const POSES = {
  stand: [STAND, { ...STAND, h: [100, 34], n: [100, 54] }],
  shoulders: [{ ...STAND, eL: [84, 80], hL: [82, 110], eR: [116, 80], hR: [118, 110], n: [100, 54] }, STAND],
  neck: [{ ...STAND, h: [86, 44] }, { ...STAND, h: [114, 44] }],
  side: [{ ...STAND, n: [94, 60], h: [88, 41], eR: [104, 34], hR: [84, 18], eL: [84, 90], hL: [86, 120] }, { ...STAND, eR: [112, 36], hR: [108, 14] }],
  ragdoll: [STAND, { ...STAND, n: [116, 116], h: [112, 138], eL: [118, 140], hL: [114, 168], eR: [124, 140], hR: [122, 168] }],
  deadbug: [
    { h: [46, 160], n: [64, 160], p: [118, 160], eL: [66, 130], hL: [66, 102], eR: [70, 130], hR: [70, 102], kL: [118, 128], fL: [148, 128], kR: [122, 128], fR: [152, 128] },
    { h: [46, 160], n: [64, 160], p: [118, 160], eL: [48, 146], hL: [26, 154], eR: [70, 130], hR: [70, 102], kL: [118, 128], fL: [148, 128], kR: [148, 152], fR: [178, 156] },
  ],
  bridge: [
    { h: [42, 164], n: [60, 164], p: [108, 166], eL: [80, 168], hL: [100, 168], eR: [80, 168], hR: [100, 168], kL: [132, 140], fL: [148, 168], kR: [134, 140], fR: [150, 168] },
    { h: [42, 164], n: [60, 162], p: [106, 134], eL: [80, 168], hL: [100, 168], eR: [80, 168], hR: [100, 168], kL: [134, 128], fL: [148, 168], kR: [136, 128], fR: [150, 168] },
  ],
  plank: [
    { h: [40, 118], n: [56, 124], p: [118, 132], eL: [56, 160], hL: [80, 162], eR: [58, 160], hR: [82, 162], kL: [150, 148], fL: [182, 162], kR: [152, 148], fR: [184, 162] },
    { h: [40, 116], n: [56, 123], p: [118, 131], eL: [56, 160], hL: [80, 162], eR: [58, 160], hR: [82, 162], kL: [150, 147], fL: [182, 162], kR: [152, 147], fR: [184, 162] },
  ],
  sideplank: [
    { h: [52, 96], n: [64, 108], p: [116, 136], eL: [64, 150], hL: [88, 162], eR: [76, 94], hR: [84, 70], kL: [150, 150], fL: [182, 164], kR: [150, 148], fR: [182, 160] },
    { h: [52, 92], n: [64, 104], p: [116, 130], eL: [64, 150], hL: [88, 162], eR: [76, 90], hR: [84, 66], kL: [150, 146], fL: [182, 164], kR: [150, 144], fR: [182, 160] },
  ],
  squat: [
    { h: [96, 52], n: [98, 72], p: [104, 128], eL: [118, 86], hL: [140, 88], eR: [120, 88], hR: [142, 90], kL: [138, 128], fL: [138, 172], kR: [140, 130], fR: [140, 172] },
    { h: [96, 50], n: [98, 70], p: [104, 126], eL: [118, 84], hL: [140, 86], eR: [120, 86], hR: [142, 88], kL: [138, 126], fL: [138, 172], kR: [140, 128], fR: [140, 172] },
  ],
};
const pts = (J, a, b, c) => [J[a], J[b], J[c]].map((x) => x.join(",")).join(" ");
function Figure({ pose, color, dur = 2.4 }) {
  const ps = POSES[pose] || POSES.stand; const [A, B] = ps; const col = color || "currentColor";
  const lines = [["n", "p", "p"], ["n", "eL", "hL"], ["n", "eR", "hR"], ["p", "kL", "fL"], ["p", "kR", "fR"]];
  const lying = ["deadbug", "bridge", "plank", "sideplank"].includes(pose);
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ display: "block" }} aria-hidden="true">
      {lying && <line x1="10" y1="172" x2="190" y2="172" stroke={col} strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />}
      {pose === "squat" && <line x1="150" y1="20" x2="150" y2="180" stroke={col} strokeOpacity="0.25" strokeWidth="4" />}
      {lines.map(([a, b, c], i) => (
        <polyline key={i} points={pts(A, a, b, c)} fill="none" stroke={col} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="points" dur={dur + "s"} repeatCount="indefinite" values={`${pts(A, a, b, c)};${pts(B, a, b, c)};${pts(A, a, b, c)}`} keyTimes="0;0.5;1" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
        </polyline>
      ))}
      <circle r="13" fill={col} cx={A.h[0]} cy={A.h[1]}>
        <animate attributeName="cx" dur={dur + "s"} repeatCount="indefinite" values={`${A.h[0]};${B.h[0]};${A.h[0]}`} />
        <animate attributeName="cy" dur={dur + "s"} repeatCount="indefinite" values={`${A.h[1]};${B.h[1]};${A.h[1]}`} />
      </circle>
      {pose === "stand" && <g stroke={col} strokeOpacity="0.5" strokeWidth="2" strokeDasharray="4 4"><line x1="100" y1="4" x2="100" y2="22" /></g>}
    </svg>
  );
}
/* faces for mouth / breathing exercises */
function FaceFig({ kind, color }) {
  const c = color || "currentColor";
  const mouth = {
    trill: <g><path d="M78 128 q22 10 44 0" stroke={c} strokeWidth="6" fill="none" strokeLinecap="round"><animate attributeName="d" dur="0.18s" repeatCount="indefinite" values="M78 128 q22 10 44 0;M78 130 q22 4 44 0;M78 128 q22 10 44 0" /></path><g stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.7"><line x1="132" y1="122" x2="150" y2="116"><animate attributeName="opacity" dur="0.5s" repeatCount="indefinite" values="1;0;1" /></line><line x1="132" y1="132" x2="152" y2="134"><animate attributeName="opacity" dur="0.5s" begin="0.25s" repeatCount="indefinite" values="1;0;1" /></line></g></g>,
    hum: <g><line x1="84" y1="128" x2="116" y2="128" stroke={c} strokeWidth="6" strokeLinecap="round" />{[0, 1, 2].map((i) => <path key={i} d={`M${62 - i * 9} ${92 - i * 4} q-8 12 0 24`} stroke={c} strokeWidth="3" fill="none" opacity="0.6"><animate attributeName="opacity" dur="1s" begin={i * 0.2 + "s"} repeatCount="indefinite" values="0.8;0.1;0.8" /></path>)}{[0, 1, 2].map((i) => <path key={"r" + i} d={`M${138 + i * 9} ${92 - i * 4} q8 12 0 24`} stroke={c} strokeWidth="3" fill="none" opacity="0.6"><animate attributeName="opacity" dur="1s" begin={i * 0.2 + "s"} repeatCount="indefinite" values="0.8;0.1;0.8" /></path>)}</g>,
    yawn: <ellipse cx="100" cy="132" rx="14" ry="20" fill="none" stroke={c} strokeWidth="6"><animate attributeName="ry" dur="3s" repeatCount="indefinite" values="6;22;22;6" keyTimes="0;0.35;0.7;1" /></ellipse>,
    straw: <g><circle cx="100" cy="128" r="7" fill="none" stroke={c} strokeWidth="5" /><rect x="96" y="132" width="8" height="52" rx="3" fill={c} opacity="0.85" />{[0, 1, 2].map((i) => <circle key={i} cx="100" cy="186" r="3" fill={c}><animate attributeName="cy" dur="1.2s" begin={i * 0.4 + "s"} repeatCount="indefinite" values="186;198" /><animate attributeName="opacity" dur="1.2s" begin={i * 0.4 + "s"} repeatCount="indefinite" values="1;0" /></circle>)}</g>,
    tongue: <g><path d="M80 124 q20 8 40 0" stroke={c} strokeWidth="6" fill="none" /><rect x="90" y="126" width="20" height="18" rx="9" fill={c} opacity="0.8"><animate attributeName="height" dur="2s" repeatCount="indefinite" values="6;30;6" /></rect></g>,
    jaw: <g><ellipse cx="100" cy="134" rx="12" ry="14" fill="none" stroke={c} strokeWidth="6" />{[56, 144].map((x) => <circle key={x} cx={x} cy="112" r="9" fill={c} opacity="0.6"><animateTransform attributeName="transform" type="rotate" from={`0 ${x} 118`} to={`360 ${x} 118`} dur="1.6s" repeatCount="indefinite" /></circle>)}</g>,
    sing: <ellipse cx="100" cy="130" rx="14" ry="12" fill="none" stroke={c} strokeWidth="6"><animate attributeName="ry" dur="1.2s" repeatCount="indefinite" values="8;14;8" /></ellipse>,
    hiss: <g><path d="M84 128 h32" stroke={c} strokeWidth="6" strokeLinecap="round" />{[0, 1, 2, 3].map((i) => <path key={i} d={`M124 ${124 + i * 3} q10 -4 20 0 t20 0`} stroke={c} strokeWidth="2.5" fill="none" opacity="0.6"><animate attributeName="opacity" dur="0.8s" begin={i * 0.2 + "s"} repeatCount="indefinite" values="0.9;0;0.9" /></path>)}</g>,
  }[kind];
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ display: "block" }} aria-hidden="true">
      <ellipse cx="100" cy="100" rx="56" ry="66" fill="none" stroke={c} strokeWidth="6" />
      <circle cx="80" cy="88" r="5" fill={c} /><circle cx="120" cy="88" r="5" fill={c} />
      <path d="M100 96 v14" stroke={c} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      {mouth}
    </svg>
  );
}
function BreathFig({ color }) {
  const c = color || "currentColor";
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ display: "block" }} aria-hidden="true">
      <circle cx="100" cy="30" r="16" fill={c} />
      <path d="M70 58 q30 -10 60 0 l6 70 q-36 10 -72 0 z" fill="none" stroke={c} strokeWidth="6" strokeLinejoin="round" />
      <ellipse cx="100" cy="118" rx="30" ry="18" fill={c} opacity="0.25"><animate attributeName="rx" dur="5s" repeatCount="indefinite" values="22;38;38;22" keyTimes="0;0.4;0.6;1" /><animate attributeName="ry" dur="5s" repeatCount="indefinite" values="12;22;22;12" keyTimes="0;0.4;0.6;1" /></ellipse>
      <g fill={c}><rect x="78" y="72" width="26" height="10" rx="5" opacity="0.9" /><rect x="86" y="114" width="28" height="10" rx="5" opacity="0.9"><animate attributeName="y" dur="5s" repeatCount="indefinite" values="114;124;124;114" keyTimes="0;0.4;0.6;1" /></rect></g>
      <text x="100" y="178" textAnchor="middle" fontSize="13" fill={c} fontFamily="sans-serif" fontWeight="700"><animate attributeName="opacity" dur="5s" repeatCount="indefinite" values="1;1;0;0" keyTimes="0;0.4;0.41;1" />breathe in — belly out</text>
      <text x="100" y="178" textAnchor="middle" fontSize="13" fill={c} fontFamily="sans-serif" fontWeight="700" opacity="0"><animate attributeName="opacity" dur="5s" repeatCount="indefinite" values="0;0;1;1" keyTimes="0;0.6;0.61;1" />breathe out slowly</text>
    </svg>
  );
}
const PIC = {
  stand: { f: "stand" }, shoulders: { f: "shoulders" }, neck: { f: "neck" }, side: { f: "side" }, ragdoll: { f: "ragdoll" }, deadbug: { f: "deadbug" }, bridge: { f: "bridge" }, plank: { f: "plank" }, sideplank: { f: "sideplank" }, squat: { f: "squat" },
  trill: { face: "trill" }, hum: { face: "hum" }, yawn: { face: "yawn" }, straw: { face: "straw" }, tongue: { face: "tongue" }, jaw: { face: "jaw" }, sing: { face: "sing" }, hiss: { face: "hiss" }, breath: { breath: 1 },
};
function HowPic({ pic, color }) {
  const p = PIC[pic]; if (!p) return null;
  return p.f ? <Figure pose={p.f} color={color} dur={["shoulders", "neck"].includes(p.f) ? 2 : 3} /> : p.face ? <FaceFig kind={p.face} color={color} /> : <BreathFig color={color} />;
}

/* ---- the guides. v = YouTube video id (a real demo), q = YouTube search for more examples ---- */
const SG_HOW = {
  /* breathing */
  breath: { pic: "breath", v: "e-9LPpsBidE", q: "breathing exercises for singers beginners", what: "Low, quiet breathing that fills your belly and ribs — not your shoulders. Every other exercise depends on this.",
    steps: ["Stand tall or lie on your back. Put one hand on your chest and one on your belly.", "Breathe in slowly through your nose for 4 counts. Only the belly hand and the sides of your ribs should move out.", "Hold gently for 4 (no squeezing in the throat).", "Breathe out on a soft 'sss' for 6–8 counts. Let the belly come back in slowly — don't let the ribs collapse fast.", "Do 5 rounds. Then try box breathing: in 4 · hold 4 · out 4 · hold 4."],
    feel: "Calm, your shoulders don't move, and the 'sss' is the same strength from start to end.", mistakes: ["Lifting the shoulders when you breathe in", "Gasping loudly — a good breath is almost silent", "Pushing all the air out in the first second"] },
  ts: { pic: "hiss", v: "m7wpP_-_-ck", q: "ts ts breath support exercise singers", what: "Short, strong 'ts!' sounds that wake up your support muscles (the belly and lower back).",
    steps: ["Stand tall, one hand on your belly just under the ribs.", "Say a sharp 'ts!' — like a tiny sneeze of air. Your hand should feel the belly kick inward.", "Do 4 'ts' per beat with the click: ts-ts-ts-ts, rest, repeat.", "Let the breath drop back in by itself between groups — don't gasp.", "Speed up only when every 'ts' is clean and the throat stays relaxed."],
    feel: "The work is low in your belly; your throat and shoulders feel nothing.", mistakes: ["Squeezing the throat to make the sound", "Pulling the shoulders up", "Going fast before it's clean"] },
  messa: { pic: "sing", v: "HlGl2mS7-g8", q: "messa di voce exercise", what: "One long note that grows from soft to loud and back to soft — the best exercise for breath control.",
    steps: ["Take a low, quiet breath.", "Start the note very softly on 'ah' (or 'oo' if that's easier).", "Slowly grow louder over 4 counts — keep the same pitch and the same 'colour' of sound.", "Slowly get softer again over 4 counts.", "Stop cleanly before you run out of air. Repeat on 5 notes in your comfortable middle range."],
    feel: "Smooth like a dimmer switch: no jumps, no cracks, the pitch stays put on the tuner.", mistakes: ["Pitch going sharp when loud or flat when soft", "Getting loud suddenly instead of slowly", "Squeezing the last bit of air out"] },
  long5: { pic: "sing", v: "ZXNO8Be4Q6Y", q: "long tones singing exercise breath control", what: "Steady, even long notes — they teach your breath to stay the same from start to finish.",
    steps: ["Breathe low and quiet.", "Sing 'ah' or 'oo' on the note the app plays and hold it for 8 counts.", "Keep the volume and pitch exactly the same the whole time (watch the meter).", "Rest one breath, then go to the next note.", "Use a mirror: your face and neck should stay relaxed."],
    feel: "The line on the pitch meter is flat and steady.", mistakes: ["Wobbling pitch at the end of the breath", "Starting with a hard 'click' in the throat", "Running out of air because the first breath was in the shoulders"] },
  /* technique */
  yawn: { pic: "yawn", v: "3cYyX7bEoqI", q: "yawn sigh vocal exercise", what: "A gentle yawn followed by a sigh from high to low. It opens the throat and relaxes the voice box.",
    steps: ["Start a real yawn with your mouth closed or half open — feel the back of your throat open wide.", "At the top of the yawn, let out a soft sigh on 'haaa', sliding from a high comfortable note down to a low one.", "Keep it light and breathy — this is relaxation, not singing loudly.", "Repeat 5–6 times."],
    feel: "Open and spacious at the back of the throat, like the start of a yawn.", mistakes: ["Pushing the sigh loudly", "Forcing the jaw wide open — the space is inside, at the back"] },
  liptrill5: { pic: "trill", v: "_9OK-jhmffQ", q: "lip trill vocal exercise", what: "Blowing air through relaxed lips so they 'bubble' like a motorboat, while you sing. The safest warm-up there is.",
    steps: ["Close your lips loosely and blow air through them so they flutter: 'brrrr'.", "If they won't flutter, press lightly on your cheeks with two fingers next to the corners of the mouth.", "Now add your voice — 'brrrr' on a note.", "Follow the app: slide 1-2-3-4-5-4-3-2-1 on the bubble, going up a half step each time.", "Keep the air flowing steadily — the bubble should never stop."],
    feel: "Tickly lips, an easy sound, and no effort in the throat even on higher notes.", mistakes: ["The trill stops — that means not enough air, not 'push harder with the throat'", "Tight lips", "Puffing the cheeks out hard"] },
  straw: { pic: "straw", v: "0xYDvwvmBIM", q: "straw phonation exercise singers", what: "Singing through a drinking straw. The straw balances the air so your vocal folds work with almost no strain.",
    steps: ["Take a normal drinking straw (a thin one works best). Put it between your lips, sealed all around.", "Hum a note into the straw — all the sound goes through it, none through your nose.", "Slide slowly up and down like a siren.", "Then try a simple song melody through the straw.", "Finally, take the straw out and sing the same thing — notice how easy it feels."],
    feel: "A buzzy pressure in the lips and face, and a very easy throat.", mistakes: ["Air leaking out of the corners of the mouth", "Pushing too much air — a gentle stream is enough", "Puffing the cheeks"] },
  hum135: { pic: "hum", v: "ElDCTulc96w", q: "humming resonance exercise singers", what: "Humming 1-3-5-3-1 to find the 'buzz' in your face — that buzz is your best, clearest tone.",
    steps: ["Lips gently closed, teeth slightly apart, tongue resting behind the bottom teeth.", "Hum 'mmm' on the first note the app plays.", "Hum up 1-3-5 and back down 5-3-1.", "Feel for a buzz on your lips, nose and cheekbones. Touch your nose — you should feel it vibrate.", "Go up a half step each time while it stays easy."],
    feel: "Your lips and nose tickle. If it only buzzes in the throat, smile slightly and bring the sound forward.", mistakes: ["Clenched teeth", "Humming too loudly", "Sound stuck in the throat instead of the face"] },
  nay: { pic: "sing", v: "s1aN8BCuKpY", q: "nay vocal exercise twang", what: "A bright, slightly 'bratty' 'Nay' that puts the sound forward in your face and helps you sing strongly without shouting.",
    steps: ["Say 'nay' like a cheeky child: bright, a bit nasal, smiling a little.", "Sing it on 1-3-5-3-1 with the app.", "Keep the sound bright and forward on every note — don't let it go dark and heavy as you go up.", "Go up a half step each round while it stays easy."],
    feel: "Bright and buzzy in the front of the face; strong but not tiring.", mistakes: ["Pushing for volume", "Spreading the mouth into a wide, tight grin", "Letting the sound fall back into the throat on high notes"] },
  siren: { pic: "sing", v: "DR35ycLaO6E", q: "vocal siren exercise chest to head voice", what: "Sliding smoothly from your lowest to your highest comfortable note and back, like a siren. It smooths out the 'break' between chest and head voice.",
    steps: ["Use 'oo', 'ng' (as in 'sing') or a lip trill — they make it easier.", "Start low and slide up slowly, without steps, to a high comfortable note.", "Slide back down the same way.", "When you reach the 'break' (where the voice wants to flip), get a little lighter instead of pushing.", "Do 5–6 slow sirens."],
    feel: "One smooth line from bottom to top. A small wobble at the break is normal at first — it gets smoother with practice.", mistakes: ["Pushing through the break with force", "Going higher than is comfortable", "Sliding too fast"] },
  octnay: { pic: "sing", v: "s1aN8BCuKpY", q: "octave nay vocal exercise", what: "'Nay' on an octave jump (1-8-1). Builds the top of your range safely.",
    steps: ["Sing 'nay' on the low note, then jump up an octave and back.", "Keep the top note as bright and light as the bottom — think 'up and over', not 'reach and push'.", "Let the jaw stay loose and the head level (don't lift the chin).", "Go up a half step each round, and stop at the top of your comfortable range."],
    feel: "The high note 'pops' out easily and brightly.", mistakes: ["Lifting the chin to reach high notes", "Getting louder as you go higher", "Going past the point where it gets tight"] },
  hey: { pic: "sing", q: "safe belt mix exercise hey singing", what: "A speech-like 'Hey!' that teaches a strong, healthy power sound (mix/belt) — the sound of a powerful worship chorus.",
    steps: ["Call out 'Hey!' like you're calling a friend across the street — friendly, bright, not shouting.", "Now sing that same 'Hey!' on a medium note with the app.", "Keep it speech-like and short at first.", "Go up slowly. Stop as soon as it feels like shouting or tightness."],
    feel: "Strong and exciting but easy — like an energetic call, not a scream.", mistakes: ["Yelling from the throat", "Pushing the chin forward", "Doing many in a row without rest"] },
  run123: { pic: "sing", v: "6z2CbYtV4mE", q: "vocal agility exercise beginners", what: "Clean, quick runs (1-2-3-2-1) so every note in a run is clear.",
    steps: ["Sing 1-2-3-2-1 slowly on 'ah' with the app — every note clear, like stairs.", "Then do it on 'ha-ha-ha-ha-ha' (a tiny breath push for each note) to feel each note.", "Go back to 'ah' and make it smooth while keeping the notes clear.", "Raise the speed only when it's clean at the slow speed."],
    feel: "Each note is a separate step, not a blurry slide.", mistakes: ["Going fast too early", "Smearing the notes together", "Getting louder as you speed up"] },
  gospel: { pic: "sing", v: "GAFUAKJ0zG4", q: "gospel run tutorial beginner", what: "A classic worship/gospel run, learned slowly first and then up to speed.",
    steps: ["Listen to the run the app plays two or three times.", "Sing it at half speed on 'ah' — note by note.", "Repeat 5 times perfectly slow.", "Speed up a little at a time. Clean at slow speed always beats messy at full speed."],
    feel: "Relaxed, flowing, every note in tune.", mistakes: ["Rushing", "Adding extra notes", "Tension in the jaw"] },
  vowels: { pic: "sing", q: "pure vowels singing exercise", what: "Clear, pure vowels (ee-eh-ah-oh-oo) so every word is understood and the tone stays rich.",
    steps: ["Sing one note and move through ee - eh - ah - oh - oo without stopping the sound.", "Only the tongue and lips move; the jaw stays relaxed and the space inside stays tall.", "Use a mirror: lips round for 'oh' and 'oo', relaxed for 'ee' and 'eh'.", "Repeat on 5 notes."],
    feel: "The tone stays the same quality while only the vowel changes.", mistakes: ["Moving the jaw a lot", "Spreading 'ee' into a wide grin", "Changing pitch between vowels"] },
  diction: { pic: "sing", q: "diction exercises for singers tongue twisters", what: "Crisp consonants so the congregation understands every word.",
    steps: ["Say the tongue-twister slowly with clear consonants (t, d, k, g, p, b).", "Whisper it — whispering makes you use your lips and tongue more.", "Now sing it on one note, then on the app's pattern.", "Keep the vowels long and the consonants quick and clear."],
    feel: "Lips and tongue are busy; the throat stays relaxed.", mistakes: ["Mumbling", "Making consonants loud with the throat", "Rushing"] },
  stac: { pic: "sing", v: "J0oYL0I9WnM", q: "staccato vocal exercise breath support", what: "Short, bouncy notes ('ha-ha-ha') that connect breath and voice.",
    steps: ["Put a hand on your belly. Laugh 'ha-ha-ha' gently — feel the belly bounce for each 'ha'.", "Sing short separate notes 1-3-5-3-1 on 'ha', with a tiny space between notes.", "Let the breath drop back in by itself between groups.", "Keep each note clean — no 'h' squeezed in the throat."],
    feel: "Bouncy and light, the belly does the work.", mistakes: ["Making the notes long", "Squeezing in the throat", "Pushing too much air ('h' sound everywhere)"] },
  /* body warm-up steps */
  "Stand tall": { pic: "stand", v: "qBBRoIzKuVU", q: "singer posture alignment", what: "Good singing posture: tall but relaxed.", steps: ["Feet hip-width apart, knees soft (not locked).", "Weight a little forward, on the front of the feet.", "Imagine a string pulling the top of your head up to the ceiling.", "Shoulders drop down and back; arms hang loosely.", "Chin level — not up, not tucked down."], feel: "Tall, open and relaxed — like you could move in any direction.", mistakes: ["Locked knees", "Chin pushed up", "Shoulders pulled back stiffly"] },
  "Shoulder rolls": { pic: "shoulders", v: "qBBRoIzKuVU", q: "shoulder rolls warm up", what: "Releases tension in the shoulders and upper back that tightens the voice.", steps: ["Lift both shoulders up to your ears.", "Roll them back and down in a big slow circle — 5 times.", "Then roll forward 5 times.", "Breathe out every time the shoulders drop."], feel: "Warm, loose shoulders.", mistakes: ["Rushing", "Holding your breath"] },
  "Neck release": { pic: "neck", v: "iX3KLLClEIo", q: "neck stretches for singers", what: "Gently stretches the neck muscles around the voice box.", steps: ["Drop your right ear toward your right shoulder. Breathe slowly 3 times.", "Come up and do the left side.", "Drop the chin to the chest and roll gently from shoulder to shoulder (half circles only).", "Never roll the head backwards."], feel: "A gentle stretch, never pain.", mistakes: ["Pulling the head with your hand", "Full circles backwards", "Lifting the opposite shoulder"] },
  "Jaw massage": { pic: "jaw", v: "iX3KLLClEIo", q: "jaw massage for singers", what: "Releases the jaw muscle — a tight jaw is the #1 cause of a tight sound.", steps: ["Find the jaw muscle just in front of your ears (clench once to feel it, then relax).", "Massage it in small circles with your fingertips for 20 seconds.", "Let your mouth hang open loosely while you massage.", "Finish by gently stroking down the cheeks to the chin."], feel: "The jaw hangs loose and heavy.", mistakes: ["Pressing too hard", "Holding the mouth shut"] },
  "Tongue stretch": { pic: "tongue", v: "iX3KLLClEIo", q: "tongue stretch exercise singers", what: "Loosens the tongue, which is connected to the voice box.", steps: ["Stick your tongue out and down towards your chin, hold for 3 seconds, 5 times.", "Circle the tongue around the outside of your teeth, 5 times each way.", "Finish with a few loose 'blah-blah-blah's."], feel: "A loose tongue and a free sound afterwards.", mistakes: ["Tensing the neck while stretching"] },
  "Side stretch for ribs": { pic: "side", v: "qBBRoIzKuVU", q: "side stretch rib expansion singers", what: "Opens the ribs so they can expand when you breathe in.", steps: ["Raise your right arm over your head.", "Lean gently to the left.", "Breathe in slowly INTO your right ribs — feel them open.", "Come back up and do the other side. 2–3 breaths each side."], feel: "The side of your ribs stretches and opens with each breath.", mistakes: ["Twisting forward", "Holding your breath"] },
  "Rag-doll roll-down": { pic: "ragdoll", v: "qBBRoIzKuVU", q: "rag doll roll down stretch", what: "Releases the back and helps you feel breath low in the body.", steps: ["Knees soft. Drop the chin to the chest.", "Slowly roll down, one part of the spine at a time, until you hang loosely.", "Shake the arms gently and breathe into your lower back.", "Roll up very slowly, the head comes up last."], feel: "Loose and heavy while hanging; tall and calm when you come up.", mistakes: ["Locked knees", "Coming up fast (you might feel dizzy)"] },
  "Lip bubbles": { ref: "liptrill5" },
  /* core */
  "Dead bug": { pic: "deadbug", v: "bxn9FBrt4-A", q: "dead bug exercise form", what: "A core exercise that builds steady breath support without straining your back.", steps: ["Lie on your back, arms straight up to the ceiling, knees bent at 90° above the hips.", "Press your lower back gently into the floor.", "Slowly lower your LEFT arm back and your RIGHT leg out straight, breathing out on 'sss'.", "Bring them back and switch sides.", "6–8 each side, slowly."], feel: "Your belly works, your lower back stays on the floor.", mistakes: ["Lower back arching off the floor", "Holding your breath", "Moving fast"] },
  "Glute bridge with hiss": { pic: "bridge", q: "glute bridge exercise form", what: "Strengthens the hips and lower back (part of your support) while you control a long breath.", steps: ["Lie on your back, knees bent, feet flat, arms by your sides.", "Lift your hips until your body is a straight line from knees to shoulders.", "Hold the bridge, breathe in low, and hiss out slowly for 8 counts.", "Lower slowly. Repeat 5 times."], feel: "Bottom and back of the legs work; the hiss stays steady.", mistakes: ["Arching the lower back too high", "Pushing through the toes instead of the heels"] },
  "Plank with counting": { pic: "plank", q: "forearm plank proper form beginners", what: "Builds core strength — and counting out loud trains you to keep using your voice while your body works.", steps: ["Forearms on the floor, elbows under the shoulders.", "Straight line from head to heels (or knees down — that's fine for beginners).", "Count out loud slowly from 1 to 10 in a calm, smooth voice.", "Don't hold your breath."], feel: "Your belly works hard but your voice stays smooth.", mistakes: ["Hips sagging or high in the air", "Holding the breath", "Straining the neck"] },
  "Side plank": { pic: "sideplank", q: "side plank beginner form", what: "Strengthens the side muscles that help your ribs stay open.", steps: ["Lie on your side, forearm under the shoulder.", "Lift the hips so the body is a straight line (bottom knee down is fine).", "Hold 20 seconds, breathing into the top ribs.", "Switch sides."], feel: "The side of the waist works; breathing stays calm.", mistakes: ["Hips dropping", "Shoulder up by the ear"] },
  "Standing 'ts-ts' pulses": { ref: "ts" },
  "Sing while holding a squat": { pic: "squat", q: "wall sit exercise form", what: "Teaches your voice to stay steady even when your body is working — like singing while moving on stage.", steps: ["Lean your back on a wall and slide down to a half squat (or a full wall-sit if you're strong).", "Knees over the ankles, not past the toes.", "Sing a 5-note scale on 'ah'.", "Keep the tone steady and the throat relaxed even when the legs burn."], feel: "Legs work, voice stays calm and steady.", mistakes: ["Knees past the toes", "Shaky, pushed voice"] },
  /* silent breath builders */
  "Low breath check": { ref: "breath" },
  "4-7-8 calm": { pic: "breath", q: "4 7 8 breathing technique", what: "A calming breath for nerves before you sing.", steps: ["Breathe in quietly through the nose for 4 counts.", "Hold for 7 counts, relaxed.", "Breathe out through the mouth for 8 counts.", "Do it 3 times — no more, it's very relaxing."], feel: "Calmer heartbeat, relaxed shoulders.", mistakes: ["Forcing the hold if you feel dizzy — just shorten it"] },
  "Straw breathing": { pic: "straw", v: "0xYDvwvmBIM", q: "straw breathing exercise", what: "Breathing out slowly through a straw trains a long, steady stream of air.", steps: ["Breathe in low.", "Breathe out slowly through a thin straw (or very small pursed lips).", "Keep the stream steady and the ribs wide as long as you can.", "Repeat 4 times."], feel: "A steady, even stream; ribs stay open.", mistakes: ["Letting the chest collapse at the start"] },
  "Rib hold": { pic: "breath", v: "ZXNO8Be4Q6Y", q: "appoggio breathing exercise rib expansion", what: "'Appoggio' — keeping the ribs open while you breathe out. This is real breath support.", steps: ["Hands on the sides of your lower ribs.", "Breathe in — feel the ribs push your hands out.", "Breathe out slowly on 'sss' but keep the ribs wide under your hands for as long as possible.", "Only at the very end let the ribs come in."], feel: "The ribs stay wide; the belly comes in slowly.", mistakes: ["Ribs collapsing at the start", "Holding tension in the throat"] },
  "Snatch breaths": { pic: "breath", q: "quick breath exercise for singers catch breath", what: "Quick, silent breaths for fast songs where there's no time.", steps: ["Open the mouth and the throat as if surprised, and let air drop in — half a beat, silent.", "Breathe out for 4 counts.", "Repeat with the click.", "The breath should be silent and low, not a gasp."], feel: "Fast but silent; the belly moves, not the shoulders.", mistakes: ["Gasping noise", "Breathing high in the chest"] },
  "Long 'sss' timer": { pic: "hiss", v: "m7wpP_-_-ck", q: "hissing breath exercise singers", what: "Measures and grows your breath control.", steps: ["Take a big low breath.", "Hiss 'sss' evenly — same strength all the way.", "Time how long it lasts.", "Write it down and try to beat it next week. 20+ seconds is good, 30+ is great."], feel: "An even hiss from start to finish.", mistakes: ["A strong start and a weak end", "Squeezing to get extra seconds"] },
  /* recovery */
  "Drink water": { pic: "stand", q: "vocal hydration tips singers", what: "Your vocal folds stay healthy when your whole body is hydrated.", steps: ["Sip room-temperature water.", "Drink through the whole day, not only before singing.", "Avoid very cold drinks and lots of coffee before singing."], feel: "A moist mouth and throat.", mistakes: ["Only drinking right before you sing"] },
  "Steam": { pic: "breath", q: "steam inhalation for singers voice", what: "Breathing steam moistens the vocal folds directly.", steps: ["Pour hot (not boiling) water into a bowl.", "Put a towel over your head and breathe the steam gently through your nose and mouth for 2 minutes.", "Or simply breathe the steam in a hot shower.", "Keep your face a safe distance from the water."], feel: "Your throat feels soothed and moist.", mistakes: ["Boiling water too close to the face"] },
  "Gentle straw phonation": { ref: "straw" },
  "Soft descending hums": { ref: "hum135" },
  "Silence": { pic: "stand", q: "vocal rest tips", what: "Real rest for the voice.", steps: ["Stop talking and singing for a few minutes.", "Don't whisper — whispering strains the voice more than soft talking.", "Breathe slowly and relax."], feel: "Rested.", mistakes: ["Whispering"] },
};
const howFor = (k) => { let g = SG_HOW[k]; if (g && g.ref) g = { ...SG_HOW[g.ref], ...g, ref: undefined }; return g || null; };
const ytSearch = (q) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);

function YouTubeBox({ id, title }) {
  const [on, setOn] = useState(false);
  const url = `https://www.youtube.com/watch?v=${id}`;
  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 14, overflow: "hidden", background: "#000" }}>
      {on ? <iframe title={title} src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
        : <button aria-label={"Play video: " + title} onClick={() => setOn(true)} style={{ position: "absolute", inset: 0, border: 0, padding: 0, cursor: "pointer", background: `#111 url(https://i.ytimg.com/vi/${id}/hqdefault.jpg) center/cover` }}>
          <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 64, height: 46, borderRadius: 12, background: "#FF0033", display: "grid", placeItems: "center" }}><span style={{ width: 0, height: 0, borderLeft: "18px solid #fff", borderTop: "11px solid transparent", borderBottom: "11px solid transparent", marginLeft: 4 }} /></span>
        </button>}
      {on && <a href={url} target="_blank" rel="noreferrer" style={{ position: "absolute", right: 8, bottom: 8, fontSize: 11, color: "#fff", background: "rgba(0,0,0,0.6)", padding: "3px 8px", borderRadius: 8, textDecoration: "none" }}>Open in YouTube ↗</a>}
    </div>
  );
}

/* the "How to do it" card: picture + video + steps + how it should feel + mistakes */
function HowTo({ k, title, open: open0 }) {
  const { T } = useApp(); const g = howFor(k); const [open, setOpen] = useState(!!open0);
  useEffect(() => { setOpen(!!open0); }, [k]); // eslint-disable-line
  if (!g) return null;
  return (
    <Card style={{ marginTop: 12, padding: 14 }}>
      <div onClick={() => setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, background: T.soft, color: T.softText || T.text, flexShrink: 0, padding: 4, boxSizing: "border-box" }}><HowPic pic={g.pic} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 900, fontSize: 15 }}>📖 How to do it{title ? ` — ${title}` : ""}</div>
          <div style={{ fontSize: 12.5, color: T.sub, lineHeight: 1.4, marginTop: 2 }}>{g.what}</div>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: T.accent, marginTop: 4 }}>{open ? "Hide ▲" : `${g.v ? "▶ Video · " : ""}Picture · Step by step ▼`}</div>
        </div>
      </div>
      {open && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: g.v ? "minmax(0,1fr) minmax(0,1.6fr)" : "1fr", gap: 10, alignItems: "center" }}>
            <div style={{ background: T.soft, color: T.softText || T.text, borderRadius: 14, padding: 8, maxWidth: g.v ? undefined : 220, margin: g.v ? undefined : "0 auto", aspectRatio: "1 / 1", boxSizing: "border-box" }}><HowPic pic={g.pic} /></div>
            {g.v && <YouTubeBox id={g.v} title={title || k} />}
          </div>
          <div style={{ fontSize: 11, fontWeight: 900, color: T.sub, letterSpacing: 0.6, margin: "14px 0 6px" }}>STEP BY STEP</div>
          {g.steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13.5, lineHeight: 1.5 }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: T.accent, color: T.accentText, fontWeight: 900, fontSize: 12, display: "grid", placeItems: "center", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1 }}>{s}</div>
            </div>
          ))}
          <div style={{ background: T.dark ? "rgba(61,220,132,0.12)" : "rgba(30,160,90,0.1)", borderRadius: 12, padding: "10px 12px", fontSize: 13, lineHeight: 1.5, marginTop: 8 }}><b>✅ You're doing it right when:</b> {g.feel}</div>
          {g.mistakes && g.mistakes.length > 0 && <div style={{ background: T.dark ? "rgba(255,90,90,0.12)" : "rgba(220,50,50,0.08)", borderRadius: 12, padding: "10px 12px", fontSize: 13, lineHeight: 1.5, marginTop: 8 }}><b>⚠️ Common mistakes:</b><ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>{g.mistakes.map((m, i) => <li key={i}>{m}</li>)}</ul></div>}
          <a href={ytSearch(g.q)} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 10, fontSize: 12.5, fontWeight: 800, color: T.accent }}>More example videos on YouTube ↗</a>
          <div style={{ fontSize: 11, color: T.faint, marginTop: 6 }}>Stop if anything hurts. A little tiredness is normal; pain is not.</div>
        </div>
      )}
    </Card>
  );
}
