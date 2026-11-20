
/* ================================ TOOLS REGISTRY ================================ */
const TOOLS = {
  vocalgym: { title: "Vocal Gym", desc: "40+ warm-ups & exercises", icon: Mic, roles: ["singer"], C: VocalGym },
  breath: { title: "Breath Lab", desc: "Beginner → Expert + sustain challenge", icon: Wind, roles: ["singer"], C: BreathLab },
  harmony: { title: "Harmony Drills", desc: "17 drills · mute your part", icon: Users, roles: ["singer"], C: HarmonyDrills },
  range: { title: "Range Tester & Tuner", desc: "Voice type + live pitch", icon: Target, roles: ["singer"], C: RangeTester },
  scales: { title: "Scale Studies", desc: "Patterns, drones, speed challenge", icon: Ladder, roles: ["singer", "keys", "acoustic", "lead", "bass"], C: ScaleExplorer },
  ear: { title: "Ear Gym", desc: "13 trainers · pitch, melody, harmony", icon: Headphones, roles: ["singer", "keys", "acoustic", "lead", "bass"], C: EarTrainer },
  rhythm: { title: "Rhythm Lab", desc: "26 lessons · odd meters · polyrhythms", icon: Timer, roles: ["singer", "keys", "acoustic", "lead", "bass", "drums"], C: RhythmLab },
  numbers: { title: "Number System", desc: "Progressions in every key", icon: Layers, roles: ["singer", "keys", "acoustic", "lead", "bass"], C: NumberSystem },
  chords: { title: "Chord Library", desc: "Every chord · inversions · voicings", icon: Music, roles: ["keys", "acoustic", "lead", "bass"], C: ChordLibrary },
  keysdrills: { title: "Keys Drills", desc: "Technique & progressions", icon: PianoIcon, roles: ["keys"], C: KeysDrills },
  fingers: { title: "Finger Exercises", desc: "Animated tab · real sounds", icon: Guitar, roles: ["acoustic", "lead", "bass"], C: FingerExercises },
  shapes: { title: "Shapes & Capo", desc: "Every chord in all 12 keys · fingers · capo", icon: Guitar, roles: ["acoustic", "lead"], C: GuitarShapes },
  strum: { title: "Strumming Lab", desc: "8 patterns · real acoustic", icon: Activity, roles: ["acoustic"], C: StrumLab },
  changes: { title: "One-Minute Changes", desc: "Mic counts your changes", icon: Repeat, roles: ["acoustic", "lead"], C: ChangeTrainer },
  basslab: { title: "Bass Lab", desc: "Real bass + drums grooves", icon: Activity, roles: ["bass"], C: BassLab },
  groove: { title: "Groove Lab", desc: "Real kit drum machine", icon: Drum, roles: ["drums", "bass"], C: GrooveLab },
  rudiments: { title: "Rudiment Trainer", desc: "Sticking, accents, ramps", icon: Drum, roles: ["drums"], C: RudimentTrainer },
  flow: { title: "Signal Flow & Gain", desc: "Mic → console → speakers", icon: Sliders, roles: ["sound"], C: SignalFlow },
  eq7: { title: "7-Band EQ Lab", desc: "Real audio + ear quiz", icon: Sliders, roles: ["sound"], C: EQ7Lab },
  comp: { title: "Compression Lab", desc: "On real audio", icon: Target, roles: ["sound"], C: CompLab },
  fx: { title: "Reverb & Delay Lab", desc: "Space & tempo delays", icon: Waves, roles: ["sound", "lead"], C: FxLab },
  mixer: { title: "Mixing Console", desc: "6 demo songs · reverb & delay FX", icon: Sliders, roles: ["sound"], C: Mixer },
};
const toolsFor = (roles) => Object.entries(TOOLS).filter(([, t]) => t.roles.some((r) => roles.includes(r)));
const sessionsFor = (roles) => SESSIONS.filter((s) => s.roles.some((r) => roles.includes(r)));
function ToolScreen({ id, props }) { const t = TOOLS[id]; if (!t) return null; const C = t.C; return <C {...(props || {})} />; }

/* ================================ SHARED HEADERS ================================ */
function TabHeader({ title, sub, right }) {
  const { T, user, avatar, push } = useApp();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "4px 0 14px" }}>
      <div style={{ minWidth: 0 }}>
        {sub && <div style={{ fontSize: 12.5, color: T.sub, fontWeight: 500 }}>{sub}</div>}
        <h1 style={{ margin: 0, fontSize: T.graffiti ? 34 : 28, lineHeight: 1.05, fontWeight: T.graffiti ? 400 : 700, fontFamily: T.graffiti ? GRAFF : T.serif ? SERIF : FONT, letterSpacing: T.graffiti ? 0.5 : -0.5, color: T.graffiti ? T.text : T.text, textShadow: T.graffiti ? `3px 3px 0 ${T.pop}` : "none" }}>{title}</h1>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {right}
        <div onClick={() => push({ screen: "profile" })} style={{ cursor: "pointer" }}><Avatar name={user.name} src={avatar} size={40} color={T.pop} ring={T.graffiti ? T.accent : undefined} /></div>
      </div>
    </div>
  );
}

/* ================================ AUTH & ONBOARDING ================================ */
function Login() {
  const { T, setUser } = useApp();
  const [mode, setMode] = useState("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const go = () => setUser({ name: name.trim() || (mode === "in" ? "Liya Desta" : "New Member"), email: email || "member@beza.church", roles: mode === "in" ? ["singer", "keys"] : [], levels: {} });
  const input = { width: "100%", boxSizing: "border-box", border: `1.5px solid ${T.border}`, background: T.input, color: T.text, borderRadius: 16, padding: "13px 14px", fontFamily: FONT, fontSize: 14, outline: "none" };
  return (
    <div style={{ padding: "18px 22px 30px", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "grid", placeItems: "center", margin: "26px 0 22px" }}><LogoLockup width={270} center /></div>
      <Card style={{ padding: 18 }}>
        <Seg value={mode} onChange={setMode} options={[{ value: "up", label: "Create account" }, { value: "in", label: "Sign in" }]} />
        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {mode === "up" && <input style={input} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />}
          <input style={input} placeholder="Email or phone" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={input} placeholder="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <Btn full style={{ marginTop: 16 }} onClick={go} icon={ChevronRight}>{mode === "in" ? "Sign in" : "Join the team"}</Btn>
        <div style={{ fontSize: 11.5, color: T.sub, textAlign: "center", marginTop: 12 }}>{mode === "up" ? "Next: tell us how you serve." : "Welcome back 💛"}</div>
      </Card>
    </div>
  );
}

const START_LEVELS = [["New to this", 0], ["Some experience", 1], ["Comfortable", 2], ["Experienced", 3]];
function Onboarding({ onDone, initial, inSheet }) {
  const { T, user, settings } = useApp();
  const [step, setStep] = useState(0);
  const [rem, setRem] = useState({ notif: true, reminder: settings.reminder || "18:00", days: settings.days || [0, 1, 2, 3, 4, 5, 6], goal: settings.goal || 20 });
  const [roles, setRoles] = useState(initial || []);
  const [levels, setLevels] = useState((user && user.levels) || {});
  const toggle = (id) => setRoles((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]));
  return (
    <div style={{ padding: inSheet ? 0 : "18px 20px 30px" }}>
      {!inSheet && <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><BezaLogo width={150} /></div>}
      {step === 0 ? (
        <>
          <div style={{ fontFamily: GRAFF, fontSize: 36, lineHeight: 1.05, textAlign: "center", margin: "10px 0 4px", textShadow: `3px 3px 0 ${T.pop}` }}>How do you serve?</div>
          <div style={{ textAlign: "center", color: T.sub, fontSize: 13, marginBottom: 16 }}>Choose <b style={{ color: T.accent }}>everything</b> you serve in — as many as you like. You'll see lessons and practice for each one.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {ROLES.map((r, i) => {
              const on = roles.includes(r.id); const I = r.icon; const full = false;
              return (
                <button key={r.id} onClick={() => toggle(r.id)} className="bz-press" style={{ position: "relative", textAlign: "left", padding: "14px 12px", borderRadius: 22, cursor: full ? "default" : "pointer", fontFamily: FONT, border: on ? "none" : `1.5px solid ${T.border}`, background: on ? r.color : T.card, color: on ? "#111" : T.text, opacity: full ? 0.45 : 1, transform: on ? `rotate(${i % 2 ? 1.5 : -1.5}deg)` : "none", boxShadow: on ? "4px 4px 0 #0B0D10" : "none", transition: "all .2s", gridColumn: i === ROLES.length - 1 ? "1 / -1" : "auto" }}>
                  <I size={28} blobColor={on ? "#ffffff" : r.color} />
                  <div style={{ fontWeight: 800, fontSize: 15, marginTop: 8 }}>{r.label}</div>
                  <div style={{ fontSize: 11.5, opacity: 0.75 }}>{r.blurb}</div>
                  {on && <div style={{ position: "absolute", top: 10, right: 10, width: 24, height: 24, borderRadius: 99, background: "#111", color: r.color, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800 }}>{roles.indexOf(r.id) + 1}</div>}
                </button>
              );
            })}
          </div>
          <Btn full style={{ marginTop: 18 }} disabled={!roles.length} onClick={() => setStep(1)} icon={ChevronRight}>Continue ({roles.length} chosen)</Btn>
        </>
      ) : step === 2 ? (
        <>
          <div style={{ fontFamily: GRAFF, fontSize: 32, lineHeight: 1.05, textAlign: "center", margin: "10px 0 6px", textShadow: `3px 3px 0 ${T.pop}` }}>When will you practise?</div>
          <div style={{ textAlign: "center", color: T.sub, fontSize: 13, marginBottom: 16 }}>Pick a time that fits your day. A little every day beats a lot once a week. You can change this anytime in Settings.</div>
          <Card><ReminderPicker value={rem} onChange={setRem} /></Card>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <Btn variant="ghost" onClick={() => setStep(1)} icon={ChevronLeft}>Back</Btn>
            <Btn full onClick={() => onDone(roles, levels, rem)} icon={Check}>Let's go!</Btn>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontFamily: GRAFF, fontSize: 32, lineHeight: 1.05, textAlign: "center", margin: "10px 0 6px", textShadow: `3px 3px 0 ${T.pop}` }}>Where are you starting?</div>
          <div style={{ textAlign: "center", color: T.sub, fontSize: 13, marginBottom: 16 }}>Everyone starts from zero — this just helps us point you to the right lesson.</div>
          {roles.map((id) => { const r = roleOf(id); return (
            <Card key={id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><IconBubble icon={r.icon} tone="accent" size={36} /><div style={{ fontWeight: 800 }}>{r.label}</div></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>{START_LEVELS.map(([l, v]) => <Chip key={l} active={(levels[id] ?? 0) === v} onClick={() => setLevels((x) => ({ ...x, [id]: v }))}>{l}</Chip>)}</div>
            </Card>
          ); })}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setStep(0)} icon={ChevronLeft}>Back</Btn>
            {inSheet ? <Btn full onClick={() => onDone(roles, levels)} icon={Check}>Save</Btn> : <Btn full onClick={() => setStep(2)} icon={ChevronRight}>Next: practice time</Btn>}
          </div>
        </>
      )}
    </div>
  );
}

/* ================================ HOME (+) ================================ */
function HomeScreen() {
  const { T, user, avatar, settings, push, setTab, feed, done, logs, assignments, plan, setPlan, web } = useApp();
  const L = STR[settings.lang];
  const hr = new Date().getHours(); const greet = hr < 12 ? L.morn : hr < 17 ? L.aft : L.eve;
  const first = user.name.split(" ")[0];
  const today = new Date().toDateString();
  const minsToday = logs.filter((l) => new Date(l.at).toDateString() === today).reduce((s, l) => s + l.mins, 0);
  const goal = settings.goal || 20; const pct = Math.min(1, minsToday / goal);
  const [day, setDay] = useState(new Date().getDate());
  const mine = assignments.filter((a) => a.toMe && a.status !== "done");
  const sess = sessionsFor(user.roles)[0];
  const verse = VERSES[new Date().getDate() % VERSES.length];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
        {web ? <div /> : <LogoLockup width={132} />}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => push({ screen: "schedule" })} style={{ position: "relative", width: 42, height: 42, borderRadius: 14, border: `1.5px solid ${T.border}`, background: T.card, color: T.text, display: "grid", placeItems: "center", cursor: "pointer" }}>
            <Bell size={20} /><span style={{ position: "absolute", top: 8, right: 9, width: 8, height: 8, borderRadius: 9, background: T.pop }} />
          </button>
          <div onClick={() => push({ screen: "profile" })} style={{ cursor: "pointer" }}><Avatar name={user.name} src={avatar} size={42} color={T.pop} ring={T.graffiti ? T.accent : undefined} /></div>
        </div>
      </div>
      <div style={{ marginTop: 18, fontSize: 14, color: T.sub, fontWeight: 500 }}>{greet}, <b style={{ color: T.text }}>{first}</b> 👋</div>
      <h1 style={{ margin: "4px 0 0", fontSize: T.graffiti ? 40 : 30, lineHeight: T.graffiti ? 1.2 : T.serif ? 1.15 : 1.3, fontWeight: T.graffiti ? 400 : 700, fontFamily: T.graffiti ? GRAFF : T.serif ? SERIF : FONT }}>
        Small steps.<br /><span style={{ color: ink(T, T.accent), textShadow: T.graffiti ? `3px 3px 0 ${T.pop}` : "none" }}>Big worship.</span>
      </h1>

      <Card tone="hero" style={{ marginTop: 16, padding: 20 }}>
        <svg width="150" height="150" style={{ position: "absolute", right: -40, bottom: -56, opacity: 0.18 }}><circle cx="75" cy="75" r="62" fill="none" stroke="#fff" strokeWidth="16" /></svg>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, letterSpacing: 1 }}>TODAY'S PRACTICE</div>
            <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginTop: 2 }}>{pct >= 1 ? "Goal smashed! 🔥" : pct > 0 ? `${minsToday} of ${goal} minutes — keep going` : `Let's start your ${goal} minutes`}</div>
            {sess && <Btn small variant="light" style={{ marginTop: 12 }} icon={Play} onClick={() => push({ screen: "session", id: sess.id })}>{sess.title}</Btn>}
          </div>
          <Ring pct={pct} size={86} stroke={9} color={T.graffiti ? "#C6FF3D" : T.pop} track="rgba(255,255,255,0.25)"><span style={{ fontSize: 16 }}>{Math.round(pct * 100)}%</span></Ring>
        </div>
      </Card>

      {mine.length > 0 && (
        <>
          <SectionTitle>Assigned to you</SectionTitle>
          {mine.map((a) => (
            <Card key={a.id} tone="soft" style={{ marginBottom: 10 }} onClick={() => push(a.kind === "session" ? { screen: "session", id: a.ref } : { screen: "lesson", id: a.ref, role: a.role })}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Avatar name={a.from} size={34} color={colorOf(a.from)} />
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 11.5, opacity: 0.8 }}>{a.from} · {roleLabel(a.role)} · due {a.due}</div><div style={{ fontWeight: 800, fontSize: 14.5 }}>{a.title}</div></div>
                <ChevronRight size={18} />
              </div>
              {a.comment && <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 14, background: "rgba(0,0,0,0.2)", fontSize: 13, lineHeight: 1.45, fontStyle: "italic" }}>“{a.comment}”</div>}
            </Card>
          ))}
        </>
      )}

      <SectionTitle action="All lessons" onAction={() => setTab("learn")}>Continue learning</SectionTitle>
      <Scroller style={{ gap: 10 }}>
        {["heart", ...user.roles].map((rid) => { const C = CURRICULUM[rid]; if (!C) return null; const next = C.all.find((id) => !done.has(id)) || C.all[0]; const L2 = LESSONS[next]; const r = roleOf(rid); const p = C.all.filter((i) => done.has(i)).length / C.all.length;
          return (
            <Card key={rid} onClick={() => push({ screen: "lesson", id: next, role: rid })} style={{ minWidth: 230, maxWidth: 230, borderTop: `5px solid ${r.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 11, fontWeight: 800, color: ink(T, r.color) }}>{r.label.toUpperCase()}</span><span style={{ fontSize: 11, color: T.sub }}>{Math.round(p * 100)}%</span></div>
              <div style={{ fontWeight: 800, fontSize: 15, margin: "6px 0 4px", lineHeight: 1.25 }}>{L2.title}</div>
              <div style={{ fontSize: 11.5, color: T.sub }}>{C.flat ? `Lesson ${C.all.indexOf(next) + 1} of ${C.all.length}` : `Level ${L2.level} · ${LEVELS[L2.level]}`} · {L2.mins} min</div>
              <div style={{ marginTop: 10 }}><Bar pct={p} color={r.color} h={6} /></div>
            </Card>
          ); })}
      </Scroller>

      <SectionTitle>Games</SectionTitle>
      <GameArenaCard />

      <SectionTitle action="Practice" onAction={() => setTab("practice")}>Quick practice</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {toolsFor(user.roles).slice(0, 4).map(([id, t], i) => (
          <Card key={id} tone={i === 0 ? "accent" : i === 3 ? "soft" : "card"} onClick={() => push({ screen: "tool", id })} style={{ minHeight: 104 }}>
            <t.icon size={26} blobColor={i === 0 ? "#fff" : undefined} />
            <div style={{ fontWeight: 800, fontSize: 14, marginTop: 10 }}>{t.title}</div>
            <div style={{ fontSize: 11.5, opacity: 0.75 }}>{t.desc}</div>
          </Card>
        ))}
      </div>

      <UpdateCard />
      {reminderDue(settings, minsToday) && (
        <Card tone="hero" style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }} onClick={() => push({ screen: "tool", id: user.roles.includes("singer") ? "vocalgym" : user.roles.includes("keys") ? "keysdrills" : "ear" })}>
          <NeonIcon icon={Bell} colors={NEON.gold} size={42} />
          <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 14.5 }}>It's practice time ⏰</div><div style={{ fontSize: 12.5, opacity: 0.8 }}>Your {to12(settings.reminder)} session · {Math.max(0, (settings.goal || 20) - minsToday)} min left to reach today's goal</div></div>
          <ChevronRight />
        </Card>
      )}

      <SectionTitle action="Schedule" onAction={() => push({ screen: "schedule" })}>This week</SectionTitle>
      <div style={{ display: "flex", gap: 6, justifyContent: "space-between" }}>
        {WEEK.map((w) => { const on = w.n === day; const has = (EVENTS[w.n] || []).length > 0;
          return (
            <button key={w.n} onClick={() => setDay(w.n)} style={{ flex: 1, border: on ? "none" : `1.5px solid ${T.border}`, background: on ? T.accent : T.card, color: on ? T.accentText : T.text, borderRadius: 16, padding: "9px 0 8px", fontFamily: FONT, cursor: "pointer", transform: on && T.graffiti ? "rotate(-3deg)" : "none", boxShadow: on && T.graffiti ? "3px 3px 0 #0B0D10" : "none" }}>
              <div style={{ fontSize: 10.5, opacity: 0.75, fontWeight: 500 }}>{w.d}</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{String(w.n).padStart(2, "0")}</div>
              <div style={{ width: 5, height: 5, borderRadius: 9, background: has ? (on ? T.accentText : T.pop) : "transparent", margin: "3px auto 0" }} />
            </button>
          ); })}
      </div>
      {(EVENTS[day] || []).map((e) => (
        <Card key={e.title} pad={12} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }} onClick={() => push({ screen: "schedule", day })}>
          <IconBubble icon={Calendar} size={36} /><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{e.title}</div><div style={{ fontSize: 11.5, color: T.sub }}>{to12(e.t)} – {to12(e.end)} · {e.sub}</div></div><ChevronRight size={16} />
        </Card>
      ))}

      <SectionTitle>{L.plan}</SectionTitle>
      <Card>
        {plan.map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i ? `1px solid ${T.border}` : "none" }}>
            <button onClick={() => setPlan((pl) => pl.map((x) => (x.id === p.id ? { ...x, done: !x.done } : x)))} style={{ width: 26, height: 26, borderRadius: 99, border: p.done ? "none" : `2px solid ${T.faint}`, background: p.done ? T.accent : "transparent", color: T.accentText, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>{p.done && <Check size={15} />}</button>
            <div style={{ flex: 1, cursor: "pointer" }} onClick={() => push(p.go)}>
              <div style={{ fontWeight: 600, fontSize: 14, textDecoration: p.done ? "line-through" : "none", opacity: p.done ? 0.55 : 1 }}>{p.title}</div>
              <div style={{ fontSize: 11.5, color: T.sub }}>{p.sub}</div>
            </div>
            <div style={{ fontSize: 11.5, color: T.sub, fontWeight: 600 }}>{p.mins}m</div>
          </div>
        ))}
      </Card>

      <SectionTitle>{L.feed}</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {feed.map((f) => (
          <Card key={f.id} pad={14}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Avatar name={f.who} size={34} color={colorOf(f.who)} />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{f.who}{f.leader && <span style={{ marginLeft: 6, fontSize: 10, padding: "2px 7px", borderRadius: 9, background: T.soft, color: T.softText }}>Leader</span>}</div><div style={{ fontSize: 11, color: T.sub }}>{f.t}</div></div>
              {f.pinned && <Megaphone size={17} />}
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.5, marginTop: 8 }}>{f.text}</div>
          </Card>
        ))}
      </div>
      <Card tone="card2" style={{ marginTop: 16, padding: 20, transform: T.graffiti ? "rotate(-1deg)" : "none" }}>
        <div style={{ fontFamily: T.graffiti ? MARKER : SERIF, fontSize: 19, lineHeight: 1.4 }}>“{verse.txt}”</div>
        <div style={{ fontSize: 12, marginTop: 10, opacity: 0.7, fontWeight: 600 }}>— {verse.ref} (KJV)</div>
      </Card>
    </div>
  );
}

/* ================================ LEARN ================================ */
function LearnScreen() {
  const { T, user, push, done } = useApp();
  const tracks = ["heart", ...user.roles];
  const [rid, setRid] = useState("heart");
  const [q, setQ] = useState("");
  useEffect(() => { if (!tracks.includes(rid)) setRid("heart"); }, [user.roles]); // eslint-disable-line
  const C = CURRICULUM[rid]; const r = roleOf(rid);
  if (!C) return null;
  const p = C.all.filter((i) => done.has(i)).length / C.all.length;
  const next = C.all.find((id) => !done.has(id)) || C.all[0];
  const startLvl = (user.levels && user.levels[rid]) || 0;
  return (
    <div>
      <TabHeader title="Learn" sub="From zero to expert" />
      <Scroller>{tracks.map((x) => <Chip key={x} active={rid === x} onClick={() => setRid(x)} style={x === "heart" ? { borderColor: "#FFE53D" } : undefined}>{x === "heart" ? "♥ Heart of Worship" : roleOf(x).label}</Chip>)}</Scroller>
      <Card tone="hero" style={{ marginTop: 12, padding: 18, background: T.graffiti ? `linear-gradient(135deg, ${r.color} 0%, #8B5CFF 120%)` : undefined, color: T.graffiti ? "#111" : undefined }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, opacity: 0.8, letterSpacing: 1 }}>{C.tagline.toUpperCase()}</div>
            <div style={{ fontFamily: T.graffiti ? GRAFF : SERIF, fontSize: 30, lineHeight: 1.05, margin: "4px 0 10px" }}>{C.title}</div>
            <Btn small variant={T.graffiti ? "hero" : "accent"} icon={Play} onClick={() => push({ screen: "lesson", id: next, role: rid })}>Continue</Btn>
          </div>
          <Ring pct={p} size={80} stroke={8} color={T.graffiti ? "#111" : T.pop} track="rgba(255,255,255,0.35)"><span style={{ fontSize: 15 }}>{Math.round(p * 100)}%</span></Ring>
        </div>
        <div style={{ fontSize: 12, marginTop: 10, fontWeight: 600, opacity: 0.85 }}>{C.all.length} {C.flat ? "lessons" : `classes · ${C.levels.length} levels`} · ~{Math.round(C.all.reduce((s, id) => s + LESSONS[id].mins, 0) / 60)} hours of teaching</div>
      </Card>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.card, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "10px 12px", marginTop: 12 }}>
        <Search size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search lessons…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: T.text, fontFamily: FONT, fontSize: 14 }} />
      </div>
      {C.levels.map((lv) => {
        const ids = lv.ids.filter((id) => !q || LESSONS[id].title.toLowerCase().includes(q.toLowerCase())); if (!ids.length) return null;
        const lp = lv.ids.filter((i) => done.has(i)).length / lv.ids.length;
        return (
          <div key={lv.n}>
            {C.flat ? <div style={{ margin: "22px 2px 10px", fontSize: 13, color: T.sub, lineHeight: 1.5 }}>Not levels — just what every worshipper should know and understand. Take them in order, slowly, with your Bible open.</div> :
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "22px 2px 10px" }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 16, background: lv.n === startLvl ? T.accent : T.card2, color: lv.n === startLvl ? T.accentText : T.text, transform: T.graffiti ? "rotate(-6deg)" : "none" }}>{lv.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16, fontFamily: T.graffiti ? MARKER : FONT }}>Level {lv.n} · {lv.name}</div>
                <div style={{ marginTop: 4 }}><Bar pct={lp} h={5} color={r.color} /></div>
              </div>
              {lv.n === startLvl && <span style={{ fontSize: 10.5, fontWeight: 800, color: T.accent }}>YOUR START</span>}
            </div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ids.map((id) => { const Ls = LESSONS[id]; const isDone = done.has(id); const shared = id.startsWith("th_");
                return (
                  <Card key={id} pad={13} onClick={() => push({ screen: "lesson", id, role: rid })} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 14, display: "grid", placeItems: "center", background: isDone ? T.accent : T.card2, color: isDone ? T.accentText : T.text, flexShrink: 0 }}>{isDone ? <Check size={20} /> : <Book size={20} />}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.25 }}>{Ls.title}</div>
                      <div style={{ fontSize: 11.5, color: T.sub, marginTop: 2 }}>{C.flat ? `Lesson ${C.all.indexOf(id) + 1} · ` : ""}{Ls.mins} min{C.flat ? "" : " class"}{shared ? " · theory" : ""}{Ls.quiz.length ? ` · ${Ls.quiz.length} quiz Qs` : " · reflection"}</div>
                    </div>
                    <ChevronRight size={18} color={T.sub} />
                  </Card>
                ); })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Lesson widgets ---------------- */
function PlayBtn({ onClick, label = "Play", small = true }) { return <Btn small={small} variant="accent" icon={Play} onClick={onClick}>{label}</Btn>; }
function LessonWidget({ kind, p, caption }) {
  const { T, push } = useApp();
  const [hl, setHl] = useState(null);
  const box = (name) => OPEN_SHAPES[name] || (() => { const m = name.match(/^([A-G]#?)(.*)$/); const g = guitarShape(NOTE_NAMES.indexOf(m[1]), m[2]); return g ? g.frets : null; })();
  let body = null;
  if (kind === "piano") body = <Piano start={p.start} octaves={p.oct || 1} highlight={p.notes} roots={p.roots || []} height={92} />;
  else if (kind === "interval") body = (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <PlayBtn label="Melodic" onClick={() => { AE.tone(60 + p.a, 0.8); setTimeout(() => AE.tone(60 + p.b, 1), 700); }} />
      <Btn small variant="soft" onClick={() => AE.chord([60 + p.a, 60 + p.b], 1.5)}>Together</Btn>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{p.labelA || nn(60 + p.a)} → {p.labelB || nn(60 + p.b)} · {Math.abs(p.b - p.a)} half steps</span>
    </div>
  );
  else if (kind === "scale") { const sc = ALL_SCALES.find((x) => x.id === p.scale); const base = 60 + p.root - (p.root > 6 ? 12 : 0); const ns = [...sc.steps.map((s) => base + s), base + 12];
    body = (<div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><b>{NOTE_NAMES[p.root]} {sc.name}</b><PlayBtn onClick={() => { const seq = [...ns, ...ns.slice(0, -1).reverse()]; seq.forEach((m, i) => setTimeout(() => { AE.tone(m, 0.35); setHl(m); }, i * 260)); setTimeout(() => setHl(null), seq.length * 260 + 200); }} /></div>
      <Piano start={base - (base % 12)} octaves={2} highlight={hl != null ? [hl] : ns} roots={[base, base + 12]} height={80} />
    </div>); }
  else if (kind === "chord" || kind === "chordinv") { const ct = CHORD_TYPES.find((c) => c.id === p.q); const [inv, setInv] = [hl ?? 0, setHl]; const v = voiceChord(55 + p.root, ct.iv, kind === "chordinv" ? inv : 0, "close");
    body = (<div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8, flexWrap: "wrap" }}><b style={{ fontSize: 18 }}>{NOTE_NAMES[p.root]}{p.q}</b>
        <div style={{ display: "flex", gap: 6 }}>{kind === "chordinv" && ["Root", "1st", "2nd"].map((l, i) => <Chip key={l} active={inv === i} onClick={() => { setInv(i); AE.chord(voiceChord(55 + p.root, ct.iv, i, "close"), 1.3); }}>{l}</Chip>)}<PlayBtn onClick={() => AE.chord(v, 1.5)} /></div></div>
      <Piano start={Math.floor(v[0] / 12) * 12} octaves={2} highlight={v} roots={v.filter((m) => m % 12 === p.root)} height={80} />
      <div style={{ fontSize: 12, color: T.sub, marginTop: 6 }}>{ct.f} · {v.map(nn).join(" ")}</div>
    </div>); }
  else if (kind === "degrees") { const base = keyBase(p.key); body = <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4 }}>{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <Chip key={i} onClick={() => AE.tone(degMidi(base, i), 1)} style={{ padding: "10px 0" }}>{i + 1}</Chip>)}</div>; }
  else if (kind === "prog") {
    const mk = (key, degs, slash) => degs.map((d, i) => { const r = (key + DIATONIC.degs[d]) % 12; const q = DIATONIC.q[d]; const ext = p.ext ? (q === "m" ? [0, 3, 7, 10, 14] : d === 4 ? [0, 4, 10, 14, 21] : [0, 4, 7, 11, 14]) : q === "m" ? [0, 3, 7] : q === "dim" ? [0, 3, 6] : [0, 4, 7]; const bassDeg = slash && slash[i] != null ? slash[i] : null; const bass = bassDeg != null ? (key + DIATONIC.degs[bassDeg]) % 12 : r; return { name: NOTE_NAMES[r] + (q === "dim" ? "°" : q) + (p.ext ? (q === "m" ? "9" : d === 4 ? "13" : "maj9") : "") + (bass !== r ? "/" + NOTE_NAMES[bass] : ""), pcs: ext.map((x) => r + x), bass, num: d + 1 }; });
    const chords = [...mk(p.key, p.degs, p.slash), ...(p.then ? mk(p.then.key, p.then.degs) : [])];
    const play = () => { let prev = null; chords.forEach((c, i) => setTimeout(() => { const v = p.ext ? c.pcs.map((x) => 60 + ((x % 12) + 12) % 12 + (x >= 12 ? 12 : 0)) : voiceLead(prev, c.pcs); prev = v; if (p.inst === "guitar") { const sh = guitarShape(c.pcs[0] % 12, c.name.includes("m") && !c.name.includes("maj") ? "m" : ""); AE.strum(sh ? sh.frets.map((f, s) => (f < 0 ? null : GUITAR_TUNING[s] + f)).filter((x) => x != null) : v, "down", 0, 0.8, "acoustic", 1.4); } else AE.chord(v, 1.3); AE.play("bass", 28 + ((c.bass - 4 + 12) % 12), 1.2, 0, 0.7); setHl(i); }, i * 1100)); setTimeout(() => setHl(null), chords.length * 1100); };
    body = (<div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>{chords.map((c, i) => <div key={i} style={{ padding: "8px 10px", borderRadius: 12, background: hl === i ? T.accent : T.card2, color: hl === i ? T.accentText : T.text, textAlign: "center", minWidth: 46 }}><div style={{ fontWeight: 800, fontSize: 14 }}>{c.num}</div><div style={{ fontSize: 11 }}>{c.name}</div></div>)}</div>
      <PlayBtn label="Play progression" onClick={play} />
    </div>); }
  else if (kind === "click") { body = <MiniClick bpm={p.bpm} beats={p.beats} sub={p.sub || 1} />; }
  else if (kind === "fret") body = <Fretboard tuning={p.bass ? BASS_TUNING : GUITAR_TUNING} pcs={p.pcs} rootPc={p.root} highlightFrets={p.openOnly ? (p.bass ? [0, 0, 0, 0] : [0, 0, 0, 0, 0, 0]) : undefined} frets={p.openOnly ? 5 : 12} />;
  else if (kind === "box") { const f = box(p.name); body = f ? <div style={{ display: "flex", alignItems: "center", gap: 14 }}><ChordBox frets={f} name={p.name} /><div><div style={{ fontSize: 12.5, color: T.sub, marginBottom: 8 }}>Frets low→high: {f.map((x) => (x < 0 ? "x" : x)).join(" ")}</div><PlayBtn label="Strum" onClick={() => strumShape(f)} /></div></div> : null; }
  else if (kind === "tool") { const t = TOOLS[p.id]; body = <Btn full variant="accent" icon={t ? t.icon : Play} onClick={() => push({ screen: "tool", id: p.id, props: p.props })}>{p.label || (t && t.title)}</Btn>; }
  else if (kind === "breathmini") body = <BreathMini seq={p.seq} />;
  else if (kind === "harmonydemo") { const d = HARMONY_DRILLS.find((x) => x.id === p.drill); body = d ? <div><div style={{ fontWeight: 700, marginBottom: 8 }}>{d.name}</div><div style={{ display: "flex", gap: 8 }}><PlayBtn label="Hear it" onClick={() => { const base = 60; const len = Math.max(...d.parts.map((x) => x.d.length)); for (let i = 0; i < len; i++) setTimeout(() => d.parts.forEach((pt) => { const v = pt.d[i]; if (v != null) AE.tone(degMidi(base, pt.penta ? pentaDeg(v) : v), 0.75 * d.beat, 0, 0.6); }), i * 800 * d.beat); }} /><Btn small variant="soft" onClick={() => push({ screen: "tool", id: "harmony", props: { drill: d.id } })}>Practise it</Btn></div></div> : null; }
  else if (kind === "rhythm") body = <RhythmEntries meter={p.meter} entry={p.entry} />;
  else if (kind === "eqdemo") body = <EqDemo f={p.f} />;
  else if (kind === "strumdemo") body = <StrumLab embedded locked pattern={p.pattern} />;
  else if (kind === "capochart") body = <GuitarShapes embedded tab="capo" />;
  else if (kind === "delaycalc") body = <DelayCalc />;
  else if (kind === "basslab") body = <BassLab embedded locked pattern={p.pattern} songKey={p.key} />;
  else if (kind === "groove") body = <GrooveLab embedded locked id={p.id} />;
  else if (kind === "drumkit") body = <DrumKitPads />;
  if (!body) return null;
  return (
    <div style={{ margin: "14px 0" }}>
      <Card style={{ padding: 14, border: `2px dashed ${T.graffiti ? "rgba(198,255,61,0.45)" : T.border}` }}>
        <div style={{ fontSize: 10.5, fontWeight: 800, color: T.accent, letterSpacing: 1, marginBottom: 8 }}>▶ TRY IT</div>
        {body}
        {caption && <div style={{ fontSize: 12.5, color: T.sub, marginTop: 10, lineHeight: 1.45 }}>{caption}</div>}
      </Card>
    </div>
  );
}
function MiniClick({ bpm, beats = 4, sub = 1 }) {
  const { T } = useApp(); const [run, setRun] = useState(false); const [i, setI] = useState(-1);
  useLoop(run, (60 / bpm / sub) * 1000, (k) => { const pos = k % (beats * sub); setI(pos); AE.click(pos === 0 ? true : pos % sub === 0 ? false : false, 0); }, [bpm, beats, sub]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Btn small variant={run ? "light" : "accent"} icon={run ? Square : Play} onClick={() => { setRun((r) => !r); setI(-1); }}>{run ? "Stop" : `${bpm} bpm`}</Btn>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{Array.from({ length: beats * sub }).map((_, k) => <div key={k} style={{ width: k % sub === 0 ? 18 : 10, height: k % sub === 0 ? 18 : 10, borderRadius: 99, background: i === k ? (k === 0 ? T.pop : T.accent) : T.card2, alignSelf: "center" }} />)}</div>
    </div>
  );
}
function BreathMini({ seq }) {
  const { T } = useApp(); const [run, setRun] = useState(false); const [st, setSt] = useState({ idx: 0, left: seq[0][1] });
  useEffect(() => { if (!run) return; const iv = setInterval(() => setSt((s) => { if (s.left > 1) return { ...s, left: s.left - 1 }; const idx = (s.idx + 1) % seq.length; AE.tone(idx === 0 ? 72 : 64, 0.4, 0, 0.3); return { idx, left: seq[idx][1] }; }), 1000); return () => clearInterval(iv); }, [run]); // eslint-disable-line
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 64, height: 64, borderRadius: 99, background: T.soft, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 20, transform: `scale(${run && st.idx === 0 ? 1.1 : 0.9})`, transition: "transform 1s" }}>{run ? st.left : "—"}</div>
      <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{run ? seq[st.idx][0] : "Ready"}</div><Btn small variant={run ? "light" : "accent"} style={{ marginTop: 6 }} onClick={() => { setRun((r) => !r); setSt({ idx: 0, left: seq[0][1] }); }}>{run ? "Stop" : "Start"}</Btn></div>
    </div>
  );
}
function EqDemo({ f }) {
  const [on, setOn] = useState(false); const [boost, setBoost] = useState(true); const n = useRef(null);
  useEffect(() => {
    if (!on) return; const c = AE.get(); const s = c.createBufferSource(); s.buffer = AE.pink(); s.loop = true; const bq = c.createBiquadFilter(); bq.type = "peaking"; bq.frequency.value = f; bq.Q.value = 2; const g = c.createGain(); g.gain.value = 0.6;
    s.connect(bq); bq.connect(g); g.connect(AE.out()); s.start(); n.current = bq; return () => { try { s.stop(); } catch (e) { } n.current = null; };
  }, [on, f]);
  useEffect(() => { if (n.current) n.current.gain.value = boost ? 12 : 0; });
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <Btn small variant={on ? "light" : "accent"} icon={on ? Square : Play} onClick={() => setOn((x) => !x)}>{on ? "Stop" : "Pink noise"}</Btn>
      <Btn small variant={boost ? "pop" : "soft"} onClick={() => setBoost((b) => !b)}>{boost ? `+12 dB at ${f >= 1000 ? f / 1000 + "k" : f} Hz` : "Flat"}</Btn>
    </div>
  );
}

/* ---------------- Lesson screen (classroom) ---------------- */
function LessonScreen({ id, role }) {
  const { T, done, completeLesson, push, user } = useApp();
  const Ls = LESSONS[id];
  const [ans, setAns] = useState({});
  const [flip, setFlip] = useState({});
  if (!Ls) return <TopBar title="Lesson not found" />;
  const C = CURRICULUM[role]; const idx = C ? C.all.indexOf(id) : -1; const nextId = C && idx >= 0 ? C.all[idx + 1] : null;
  const isDone = done.has(id); const correct = Ls.quiz.filter((q, i) => ans[i] === q[2]).length;
  let sec = 0;
  return (
    <div>
      <TopBar title={C && C.flat ? `Lesson ${idx + 1} of ${C.all.length}` : `Level ${Ls.level} · ${LEVELS[Ls.level]}`} sub={C && C.flat ? C.title : `${roleOf(role).label} · class ${idx + 1} of ${C ? C.all.length : "?"}`} />
      <Card tone="hero" style={{ padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, opacity: 0.85 }}>{C && C.flat ? "LESSON" : "CLASS"} {String(idx + 1).padStart(2, "0")} · {Ls.mins} MIN</div>
        <div style={{ fontFamily: T.graffiti ? MARKER : SERIF, fontSize: 27, lineHeight: 1.15, margin: "6px 0 8px" }}>{Ls.title}</div>
        <div style={{ fontSize: 13.5, opacity: 0.92, lineHeight: 1.5 }}>{Ls.sum}</div>
        {isDone && <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.25)", borderRadius: 99, padding: "5px 10px", fontSize: 12, fontWeight: 700 }}><Check size={14} /> Completed</div>}
      </Card>
      {Ls.body.map((b, i) => {
        const [k, a, c, d] = b;
        if (k === "h") { sec++; return <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, margin: "22px 0 8px" }}><div style={{ width: 30, height: 30, borderRadius: 10, display: "grid", placeItems: "center", background: T.accent, color: T.accentText, fontWeight: 900, fontSize: 13, transform: T.graffiti ? "rotate(-6deg)" : "none" }}>{sec}</div><h3 style={{ margin: 0, fontSize: 18, fontFamily: T.graffiti ? MARKER : FONT, fontWeight: T.graffiti ? 400 : 700 }}>{a}</h3></div>; }
        if (k === "p") return <p key={i} style={{ fontSize: 14.5, lineHeight: 1.7, margin: "8px 0", opacity: 0.94 }}>{a}</p>;
        if (k === "tip") return <Card key={i} tone="soft" style={{ margin: "12px 0", fontSize: 13.5, lineHeight: 1.55 }}><b>💡 Tip · </b>{a}</Card>;
        if (k === "warn") return <Card key={i} style={{ margin: "12px 0", fontSize: 13.5, lineHeight: 1.55, borderLeft: `5px solid ${T.bad}` }}><b style={{ color: T.bad }}>⚠ Careful · </b>{a}</Card>;
        if (k === "list") return <ul key={i} style={{ margin: "8px 0", paddingLeft: 20, fontSize: 14, lineHeight: 1.65 }}>{a.map((x, j) => <li key={j} style={{ marginBottom: 4 }}>{x}</li>)}</ul>;
        if (k === "steps") return <div key={i} style={{ margin: "10px 0" }}>{a.map((x, j) => <div key={j} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}><div style={{ minWidth: 24, height: 24, borderRadius: 99, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 800, background: T.card2 }}>{j + 1}</div><div style={{ fontSize: 14, lineHeight: 1.55, paddingTop: 2 }}>{x}</div></div>)}</div>;
        if (k === "terms") return (
          <div key={i} style={{ margin: "14px 0" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: T.sub, letterSpacing: 1, marginBottom: 8 }}>KEY TERMS · TAP TO FLIP</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {a.map(([t, dd], j) => <Card key={j} pad={12} tone={flip[`${i}-${j}`] ? "accent" : "card2"} onClick={() => setFlip((f) => ({ ...f, [`${i}-${j}`]: !f[`${i}-${j}`] }))} style={{ minHeight: 70, display: "grid", placeItems: "center", textAlign: "center" }}><div style={{ fontSize: flip[`${i}-${j}`] ? 12.5 : 14.5, fontWeight: flip[`${i}-${j}`] ? 600 : 800, lineHeight: 1.35 }}>{flip[`${i}-${j}`] ? dd : t}</div></Card>)}
            </div>
          </div>
        );
        if (k === "tab") return <Card key={i} tone="card2" style={{ margin: "12px 0" }}><div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>✏️ Example tab</div><div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 12, padding: "10px 12px", overflowX: "auto" }} className="bz-noscroll">{a.map((ln, j) => <div key={j} style={{ fontFamily: "ui-monospace, Menlo, Consolas, monospace", fontSize: 14, lineHeight: 1.45, whiteSpace: "pre" }}>{ln}</div>)}</div>{c && <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 8 }}>{c}</div>}</Card>;
        if (k === "ex") return <Card key={i} tone="card2" style={{ margin: "12px 0" }}><div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>✏️ {a}</div><div style={{ fontSize: 13.5, lineHeight: 1.55 }}>{c}</div></Card>;
        if (k === "verse") return <Card key={i} style={{ margin: "14px 0", padding: 18, transform: T.graffiti ? "rotate(-1deg)" : "none" }}><div style={{ fontFamily: T.graffiti ? MARKER : SERIF, fontSize: 18, lineHeight: 1.45 }}>“{a}”</div><div style={{ fontSize: 12, marginTop: 8, opacity: 0.7, fontWeight: 600 }}>— {c}</div></Card>;
        if (k === "mistakes") return <Card key={i} style={{ margin: "14px 0", borderLeft: `5px solid ${T.pop}` }}><div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>🚫 Common mistakes</div>{a.map((x, j) => <div key={j} style={{ fontSize: 13.5, lineHeight: 1.55, marginBottom: 4 }}>• {x}</div>)}</Card>;
        if (k === "reflect") return <Card key={i} tone="card2" style={{ margin: "16px 0" }}><div style={{ fontWeight: 900, fontSize: 13, marginBottom: 8 }}>🕊️ REFLECT & PRAY</div>{a.map((x, j) => <div key={j} style={{ display: "flex", gap: 10, marginBottom: 8 }}><div style={{ fontWeight: 800, color: T.accent }}>{j + 1}.</div><div style={{ fontSize: 14, lineHeight: 1.55, fontStyle: "italic" }}>{x}</div></div>)}</Card>;
        if (k === "home") return <Card key={i} tone="accent" style={{ margin: "16px 0", transform: T.graffiti ? "rotate(-0.6deg)" : "none" }}><div style={{ fontWeight: 900, fontSize: 13, marginBottom: 4 }}>{role === "heart" ? "🙏 THIS WEEK" : "📌 HOMEWORK"}</div><div style={{ fontSize: 13.5, lineHeight: 1.55 }}>{a}</div></Card>;
        if (k === "w") return <LessonWidget key={i} kind={a} p={c || {}} caption={d} />;
        return null;
      })}
      {Ls.practice && Ls.practice.length > 0 && (
        <>
          <SectionTitle>Practice what you learned</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Ls.practice.map(([tid, props, label], j) => { const isSession = tid === "session"; const t = TOOLS[tid]; const s = isSession ? SESSIONS.find((x) => x.id === props.id) : null;
              return <Card key={j} pad={12} onClick={() => push(isSession ? { screen: "session", id: props.id } : { screen: "tool", id: tid, props })} style={{ display: "flex", alignItems: "center", gap: 12 }}><IconBubble icon={isSession ? Dumbbell : t ? t.icon : Play} size={38} tone="accent" /><div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{label}</div><div style={{ fontSize: 11.5, color: T.sub }}>{isSession ? `${s ? s.title : "Session"} · 30 min guided` : t ? t.title : ""}</div></div><ChevronRight size={18} /></Card>; })}
          </div>
        </>
      )}
      {Ls.quiz.length > 0 && <SectionTitle>Check your understanding</SectionTitle>}
      {Ls.quiz.map(([q, opts, c, why], qi) => (
        <Card key={qi} style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{qi + 1}. {q}</div>
          <div style={{ display: "grid", gap: 6 }}>
            {opts.map((o, ai) => { const picked = ans[qi] === ai; const show = ans[qi] != null; const right = ai === c;
              return <button key={ai} onClick={() => setAns((x) => ({ ...x, [qi]: ai }))} style={{ textAlign: "left", padding: "10px 12px", borderRadius: 14, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${show && right ? T.good : picked ? T.bad : T.border}`, background: show && right ? T.good + "22" : T.card2, color: T.text }}>{o}{show && right ? " ✓" : picked && !right ? " ✗" : ""}</button>; })}
          </div>
          {ans[qi] != null && why && <div style={{ fontSize: 12.5, color: T.sub, marginTop: 8 }}>{why}</div>}
        </Card>
      ))}
      <Card tone={isDone ? "soft" : "hero"} style={{ marginTop: 14, textAlign: "center" }}>
        {Ls.quiz.length > 0 ? <div style={{ fontSize: 13, opacity: 0.9 }}>Quiz score: <b>{correct}/{Ls.quiz.length}</b></div> : <div style={{ fontSize: 13, opacity: 0.9 }}>Take time to pray before you mark this {C && C.flat ? "lesson" : "class"} complete 🙏</div>}
        <Btn full style={{ marginTop: 10 }} variant={isDone ? "soft" : "accent"} icon={isDone ? Check : Award} onClick={() => !isDone && completeLesson(id, Ls.mins)}>{isDone ? (C && C.flat ? "Lesson completed" : "Class completed") : (C && C.flat ? "Complete this lesson" : "Complete this class")}</Btn>
        {nextId && <Btn full style={{ marginTop: 8 }} variant="ghost" icon={ChevronRight} onClick={() => push({ screen: "lesson", id: nextId, role })}>Next: {LESSONS[nextId].title}</Btn>}
      </Card>
    </div>
  );
}

/* ================================ PRACTICE ================================ */
function GameArenaCard() {
  const { T, setTab, games } = useApp();
  const xp = gameXP(games);
  return (
    <Card tone="hero" onClick={() => setTab("games")} style={{ padding: 18, marginBottom: 14, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 56, height: 56, borderRadius: 18, background: "rgba(0,0,0,0.22)", display: "grid", placeItems: "center", flexShrink: 0 }}><Trophy size={30} noBlob /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.85 }}>GAME ARENA</div>
        <div style={{ fontSize: 18, fontWeight: 900, lineHeight: 1.2 }}>Play, level up & top the team board</div>
        <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>{xp ? `${xp.toLocaleString()} XP so far` : "Ear training · numbers · scales · rhythm"}</div>
      </div>
      <ChevronRight size={20} noBlob />
    </Card>
  );
}

function PracticeScreen() {
  const { T, user, push, logs, sessionsDone } = useApp();
  const week = logs.filter((l) => Date.now() - l.at < 7 * 864e5).reduce((s, l) => s + l.mins, 0);
  const sess = sessionsFor(user.roles);
  return (
    <div>
      <TabHeader title="Practice" sub={`${week} min this week`} />
      <GameArenaCard />
      <SectionTitle>30-minute guided sessions</SectionTitle>
      <Scroller style={{ gap: 10 }}>
        {sess.map((s, i) => (
          <Card key={s.id} tone={i % 2 ? "card" : "hero"} onClick={() => push({ screen: "session", id: s.id })} style={{ minWidth: 240, maxWidth: 240, minHeight: 170 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, opacity: 0.85 }}>{LEVELS[s.level].toUpperCase()}</span><span style={{ fontSize: 11, fontWeight: 800 }}>30 MIN</span></div>
            <div style={{ fontFamily: T.graffiti ? MARKER : FONT, fontSize: 20, lineHeight: 1.15, margin: "10px 0 6px", fontWeight: T.graffiti ? 400 : 800 }}>{s.title}</div>
            <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.45 }}>{s.desc}</div>
            <div style={{ display: "flex", gap: 3, marginTop: 12 }}>{s.blocks.map((b, k) => <div key={k} style={{ flex: b.mins, height: 6, borderRadius: 9, background: (T.spray || [T.accent, T.pop])[k % (T.spray ? 6 : 2)] }} />)}</div>
            {sessionsDone[s.id] && <div style={{ fontSize: 11, marginTop: 8, fontWeight: 700 }}>✓ Completed {sessionsDone[s.id]}×</div>}
          </Card>
        ))}
      </Scroller>
      {user.roles.map((rid, ri) => { const r = roleOf(rid); const list = Object.entries(TOOLS).filter(([, t]) => t.roles.includes(rid) && !user.roles.slice(0, ri).some((prev) => t.roles.includes(prev))); if (!list.length) return null;
        return (
          <div key={rid}>
            <SectionTitle>{r.label} tools</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {list.map(([id, t], i) => (
                <Card key={id} onClick={() => push({ screen: "tool", id })} style={{ minHeight: 110, transform: T.graffiti && i % 3 === 0 ? "rotate(-1deg)" : "none" }}>
                  <t.icon size={26} blobColor={r.color} />
                  <div style={{ fontWeight: 800, fontSize: 14, marginTop: 10 }}>{t.title}</div>
                  <div style={{ fontSize: 11.5, color: T.sub }}>{t.desc}</div>
                </Card>
              ))}
            </div>
          </div>
        ); })}
    </div>
  );
}

function SessionScreen({ id }) {
  const { T, logPractice, toast, setSessionsDone } = useApp();
  const s = SESSIONS.find((x) => x.id === id);
  const [bi, setBi] = useState(0);
  const [left, setLeft] = useState(s.blocks[0].mins * 60);
  const [run, setRun] = useState(false);
  const [doneB, setDoneB] = useState({});
  const total = s.blocks.reduce((a, b) => a + b.mins * 60, 0);
  const elapsed = s.blocks.slice(0, bi).reduce((a, b) => a + b.mins * 60, 0) + (s.blocks[bi].mins * 60 - left);
  useEffect(() => { if (!run) return; const iv = setInterval(() => setLeft((l) => l - 1), 1000); return () => clearInterval(iv); }, [run]);
  useEffect(() => { if (left > 0) return; setDoneB((d) => ({ ...d, [bi]: true })); AE.chord([72, 76, 79], 0.8); logPractice(s.blocks[bi].mins, s.title); if (bi < s.blocks.length - 1) { setBi(bi + 1); setLeft(s.blocks[bi + 1].mins * 60); toast(`Next: ${s.blocks[bi + 1].name}`); } else { setRun(false); setSessionsDone((x) => ({ ...x, [s.id]: (x[s.id] || 0) + 1 })); toast("Session complete! 30 minutes of worship practice 🔥"); } }, [left]); // eslint-disable-line
  const go = (i) => { setBi(i); setLeft(s.blocks[i].mins * 60); };
  const b = s.blocks[bi]; const T2 = TOOLS[b.tool];
  return (
    <div>
      <TopBar title={s.title} sub={`${LEVELS[s.level]} · 30-minute guided session`} />
      <Card tone="hero" style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Ring pct={1 - left / (b.mins * 60)} size={86} stroke={9} color={T.graffiti ? "#C6FF3D" : T.accent} track="rgba(255,255,255,0.22)"><span style={{ fontSize: 17 }}>{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</span></Ring>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.85, letterSpacing: 1 }}>STEP {bi + 1} OF {s.blocks.length} · {b.mins} MIN</div>
            <div style={{ fontFamily: T.graffiti ? MARKER : FONT, fontSize: 21, lineHeight: 1.15, fontWeight: T.graffiti ? 400 : 800 }}>{b.name}</div>
            <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>{T2 ? T2.title : ""}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 14, background: "rgba(0,0,0,0.22)", fontSize: 13, lineHeight: 1.5 }}><b>Coach:</b> {b.guide}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn variant="light" icon={SkipBack} onClick={() => bi > 0 && go(bi - 1)} />
          <Btn full variant={run ? "light" : "accent"} icon={run ? Pause : Play} onClick={() => setRun((r) => !r)}>{run ? "Pause timer" : elapsed > 0 ? "Resume" : "Start session"}</Btn>
          <Btn variant="light" icon={SkipForward} onClick={() => setLeft(0)} />
        </div>
        <div style={{ marginTop: 12 }}><Bar pct={elapsed / total} color="#fff" track="rgba(255,255,255,0.22)" /></div>
      </Card>
      <div style={{ display: "flex", gap: 4, margin: "12px 0" }}>
        {s.blocks.map((x, i) => <button key={i} onClick={() => go(i)} style={{ flex: x.mins, height: 30, borderRadius: 9, border: "none", cursor: "pointer", background: i === bi ? T.accent : doneB[i] ? T.good + "55" : T.card2, color: i === bi ? T.accentText : T.text, fontSize: 10, fontWeight: 800, overflow: "hidden", whiteSpace: "nowrap" }}>{x.mins}′</button>)}
      </div>
      <div key={bi}>{T2 && <T2.C embedded {...b.props} />}</div>
    </div>
  );
}

/* ================================ PROGRESS ================================ */
const BADGES = [
  { id: "first", label: "First class", icon: Star, test: (s) => s.done.size >= 1 },
  { id: "range", label: "Voice found", icon: Mic, test: (s) => !!s.voice },
  { id: "streak", label: "7-day streak", icon: Flame, test: (s) => s.streak >= 7 },
  { id: "hour", label: "1 hour practice", icon: Clock, test: (s) => s.minutes >= 60 },
  { id: "five", label: "5 classes", icon: Trophy, test: (s) => s.done.size >= 5 },
  { id: "session", label: "30-min session", icon: Dumbbell, test: (s) => Object.keys(s.sessionsDone).length > 0 },
  { id: "lvl", label: "Level up", icon: Crown, test: (s) => s.user.roles.some((r) => CURRICULUM[r] && CURRICULUM[r].levels.some((l) => l.ids.every((i) => s.done.has(i)))) },
  { id: "all", label: "Track master", icon: Award, test: (s) => s.user.roles.some((r) => CURRICULUM[r] && CURRICULUM[r].all.every((i) => s.done.has(i))) },
];
function ProgressScreen() {
  const { T, user, done, logs, streak, voice, assignments, sessionsDone, push, settings } = useApp();
  const minutes = logs.reduce((s, l) => s + l.mins, 0);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()], mins: logs.filter((l) => new Date(l.at).toDateString() === d.toDateString()).reduce((s, l) => s + l.mins, 0) }; });
  const mx = Math.max(30, ...days.map((d) => d.mins));
  const heat = Array.from({ length: 35 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (34 - i)); const m = logs.filter((l) => new Date(l.at).toDateString() === d.toDateString()).reduce((s, l) => s + l.mins, 0); return m; });
  const allIds = Array.from(new Set(user.roles.flatMap((r) => (CURRICULUM[r] ? CURRICULUM[r].all : []))));
  const overall = allIds.length ? allIds.filter((i) => done.has(i)).length / allIds.length : 0;
  const st = { done, voice, streak, minutes, sessionsDone, user };
  return (
    <div>
      <HoloStyle />
      <TabHeader title="Progress" sub="Your growth, step by step" />
      <Card tone="hero" style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Ring pct={overall} size={96} stroke={10} color={T.graffiti ? "#C6FF3D" : T.pop} track="rgba(255,255,255,0.22)"><span style={{ fontSize: 19 }}>{Math.round(overall * 100)}%</span></Ring>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.85, letterSpacing: 1 }}>OVERALL</div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginTop: 10 }}>
              <HoloStat icon={Flame} colors={NEON.flame} value={streak} label={streak === 1 ? "day streak" : "days streak"} />
              <HoloStat icon={Timer} colors={NEON.time} value={minutes} label="minutes" />
              <HoloStat icon={BookOpen} colors={NEON.classes} value={done.size} label="classes" />
            </div>
          </div>
        </div>
      </Card>
      {["heart", ...user.roles].map((rid) => { const C = CURRICULUM[rid]; if (!C) return null; const r = roleOf(rid); const p = C.all.filter((i) => done.has(i)).length / C.all.length;
        const cur = C.levels.find((l) => !l.ids.every((i) => done.has(i))) || C.levels[C.levels.length - 1];
        return (
          <Card key={rid} style={{ marginTop: 12, borderLeft: `6px solid ${r.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <NeonIcon icon={r.icon} size={42} colors={[r.color, "#FFFFFF"]} />
              <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 15 }}>{r.label}</div><div style={{ fontSize: 12, color: T.sub }}>{C.flat ? `${C.all.filter((i) => done.has(i)).length} of ${C.all.length} lessons done` : `Now in Level ${cur.n} · ${cur.name}`}</div></div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>{Math.round(p * 100)}%</div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
              {C.flat ? C.all.map((i) => <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: done.has(i) ? r.color : T.card2 }} />) : C.levels.map((l) => { const lp = l.ids.filter((i) => done.has(i)).length / l.ids.length; return <div key={l.n} style={{ flex: 1 }}><Bar pct={lp} h={8} color={r.color} /><div style={{ fontSize: 9.5, color: T.sub, textAlign: "center", marginTop: 4, fontWeight: 700 }}>L{l.n}</div></div>; })}
            </div>
          </Card>
        ); })}
      <SectionTitle>Practice this week</SectionTitle>
      <Card>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 130 }}>
          {days.map((d, i) => <div key={i} style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 10, color: T.sub, marginBottom: 4 }}>{d.mins || ""}</div><div style={{ height: Math.max(4, (d.mins / mx) * 90), borderRadius: 10, background: i === 6 ? T.accent : (T.spray ? T.spray[i % 6] : T.pop), opacity: d.mins ? 1 : 0.25 }} /><div style={{ fontSize: 10.5, color: T.sub, marginTop: 6, fontWeight: 700 }}>{d.label}</div></div>)}
        </div>
      </Card>
      <SectionTitle>Practice calendar · last 5 weeks</SectionTitle>
      <PracticeCalendar logs={logs} goal={settings.goal || 20} />
      {assignments.filter((a) => a.toMe).length > 0 && (<>
        <SectionTitle>Assignments</SectionTitle>
        {assignments.filter((a) => a.toMe).map((a) => (
          <Card key={a.id} pad={12} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }} onClick={() => push(a.kind === "session" ? { screen: "session", id: a.ref } : { screen: "lesson", id: a.ref, role: a.role })}>
            <div style={{ width: 26, height: 26, borderRadius: 99, background: done.has(a.ref) ? T.good : T.card2, display: "grid", placeItems: "center" }}>{done.has(a.ref) && <Check size={14} />}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{a.title}</div><div style={{ fontSize: 11.5, color: T.sub }}>from {a.from} · due {a.due}</div></div>
          </Card>
        ))}
      </>)}
      <SectionTitle>Badges</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {BADGES.map((b) => { const got = b.test(st); return (
          <div key={b.id} style={{ textAlign: "center", opacity: got ? 1 : 0.7 }}>
            <div style={{ display: "grid", placeItems: "center" }}><NeonIcon icon={got ? b.icon : Lock} size={56} dim={!got} colors={[NEON.gold, NEON.classes, NEON.time, NEON.good][BADGES.indexOf(b) % 4]} /></div>
            <div style={{ fontSize: 10.5, fontWeight: 700, marginTop: 6 }}>{b.label}</div>
          </div>
        ); })}
      </div>
      {logs.length > 0 && (<>
        <SectionTitle>Recent practice</SectionTitle>
        <Card pad={6}>{logs.slice(0, 8).map((l, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 10px", borderTop: i ? `1px solid ${T.border}` : "none", fontSize: 13 }}><span style={{ fontWeight: 600 }}>{l.what}</span><span style={{ color: T.sub }}>+{l.mins} min · {new Date(l.at).toLocaleDateString(undefined, { weekday: "short" })}</span></div>)}</Card>
      </>)}
    </div>
  );
}

/* ================================ CHAT ================================ */
function ChatScreen() {
  const { T, user, avatar, chat, setChat, leader, push } = useApp();
  const { groups, songs } = useApp();
  const [songPick, setSongPick] = useState(false);
  const chans = (groups || []).filter((g) => g.everyone || g.members.includes("@me") || leader);
  const [ch0, setCh] = useState("all");
  const ch = chans.some((c) => c.id === ch0) ? ch0 : "all";
  const cur = chans.find((c) => c.id === ch) || chans[0] || { label: "All team", everyone: true, members: [] };
  const canPost = !cur.announce || leader;
  const [info, setInfo] = useState(false);
  const [txt, setTxt] = useState("");
  const [emo, setEmo] = useState(false);
  const [grp, setGrp] = useState(0);
  const [recent, setRecent] = useState(["🙏", "🔥", "❤️", "😂", "🙌", "🎤", "🎹", "🥁"]);
  const [reactFor, setReactFor] = useState(null);
  const fileRef = useRef(null); const listRef = useRef(null);
  useEffect(() => { const el = listRef.current; if (el) el.scrollTop = el.scrollHeight; }, [chat, ch]);
  const send = (extra = {}) => { if (!txt.trim() && !extra.file) return; setChat((c) => ({ ...c, [ch]: [...(c[ch] || []), { id: Date.now(), from: user.name, me: true, text: txt.trim(), t: nowHM(), ...extra }] })); setTxt(""); setEmo(false); };
  const onFile = (e) => { const f = e.target.files && e.target.files[0]; if (!f) return; const isImg = f.type.startsWith("image/");
    if (CLOUD.on) { e.target.value = ""; const kb = f.size > 1e6 ? (f.size / 1e6).toFixed(1) + " MB" : Math.round(f.size / 1e3) + " KB";
      if (!isImg) { send({ file: { name: f.name, size: kb + " · not uploaded (photos only)" } }); return; }
      const r = new FileReader(); r.onload = () => { const img = new Image(); img.onload = () => { const mx = 900; const sc = Math.min(1, mx / Math.max(img.width, img.height)); const c = document.createElement("canvas"); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); const data = c.toDataURL("image/jpeg", 0.72); send({ file: { name: f.name, size: Math.round(data.length * 0.75 / 1e3) + " KB", url: data, data } }); }; img.src = r.result; }; r.readAsDataURL(f); return; } const url = isImg ? URL.createObjectURL(f) : null; send({ file: { name: f.name, size: f.size > 1e6 ? (f.size / 1e6).toFixed(1) + " MB" : Math.round(f.size / 1e3) + " KB", url, audio: f.type.startsWith("audio/") ? URL.createObjectURL(f) : null } }); e.target.value = ""; };
  const react = (mid, e) => { setChat((c) => ({ ...c, [ch]: c[ch].map((m) => (m.id === mid ? { ...m, react: { ...(m.react || {}), [e]: ((m.react || {})[e] || 0) + 1 } } : m)) })); setReactFor(null); };
  const addEmoji = (e) => { setTxt((t) => t + e); setRecent((r) => [e, ...r.filter((x) => x !== e)].slice(0, 16)); };
  const emoGroups = [["Recent", recent.join(" ")], ...EMOJI_GROUPS];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TabHeader title="Chat" sub={CLOUD.on ? `● ${1 + TEAM.filter((m) => Date.now() - (m.lastMs || 0) < 10 * 60000).length} online · ${TEAM.length + 1} on the team` : "● 9 online"} right={leader ? <Btn small variant="soft" icon={Users} onClick={() => push({ screen: "groups" })}>Manage</Btn> : null} />
      <Scroller style={{ marginBottom: 8, flexShrink: 0 }}>{chans.map((c) => <Chip key={c.id} active={ch === c.id} onClick={() => setCh(c.id)}>{c.emoji ? c.emoji + " " : ""}{c.label}{c.leadersOnly ? " 🔒" : ""}</Chip>)}</Scroller>
      <div onClick={() => setInfo(true)} className="bz-press" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 12, background: T.card2, fontSize: 11.5, color: T.sub, marginBottom: 6, cursor: "pointer", flexShrink: 0 }}>
        <Users size={14} noBlob /><span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cur.everyone ? `Everyone on the team · ${TEAM.length + 1} members` : `${cur.members.length} members${cur.announce ? " · only leaders can post" : ""}`}{!cur.everyone && !cur.members.includes("@me") ? " · you're viewing as leader" : ""}</span><ChevronRight size={14} noBlob />
      </div>
      <Sheet open={info} onClose={() => setInfo(false)} title={`${cur.emoji || ""} ${cur.label}`}>
        <div style={{ maxHeight: 380, overflowY: "auto" }} className="bz-noscroll">
          {(cur.everyone ? [...TEAM.map((m) => m.name), "@me"] : cur.members).map((n) => { const me = n === "@me"; const m = TEAM.find((x) => x.name === n); return (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 2px", borderTop: `1px solid ${T.border}` }}>
              <Avatar name={me ? user.name : n} src={me ? avatar : null} size={34} color={me ? T.pop : m ? m.color : colorOf(n)} />
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{me ? `${user.name} (you)` : n}</div><div style={{ fontSize: 11, color: T.sub }}>{(me ? user.roles : m ? m.roles : []).map(roleLabel).join(" · ")}</div></div>
              {m && m.leader && <Chip style={{ padding: "3px 8px", fontSize: 10.5 }}>Leader</Chip>}
            </div>
          ); })}
        </div>
        {leader && <Btn full variant="accent" icon={Edit} style={{ marginTop: 12 }} onClick={() => { setInfo(false); push({ screen: "group", id: cur.id }); }}>Manage this group</Btn>}
      </Sheet>
      <Sheet open={songPick} onClose={() => setSongPick(false)} title={`Send a chord chart to ${cur.label}`}>
        <div style={{ maxHeight: 380, overflowY: "auto" }} className="bz-noscroll">
          {(songs || []).map((sg) => <div key={sg.id} onClick={() => { setChat((c) => ({ ...c, [ch]: [...(c[ch] || []), { id: Date.now(), from: user.name, me: true, song: sg.id, text: "", t: nowHM() }] })); setSongPick(false); }} className="bz-press" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px", borderTop: `1px solid ${T.border}`, cursor: "pointer" }}><div style={{ width: 40, height: 40, borderRadius: 12, background: T.accent, color: T.accentText, display: "grid", placeItems: "center", fontWeight: 900 }}>{SONG_KEYS[sg.key]}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 800 }}>{sg.title}</div><div style={{ fontSize: 11.5, color: T.sub }}>{sg.bpm} bpm · {firstLineNums(sg)}</div></div><Send size={18} noBlob /></div>)}
          {!(songs || []).length && <div style={{ fontSize: 13, color: T.sub }}>No songs yet — add one in the Songs tab.</div>}
        </div>
        <Btn full variant="soft" icon={Plus} style={{ marginTop: 10 }} onClick={() => { setSongPick(false); push({ screen: "songedit" }); }}>New song</Btn>
      </Sheet>
      <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "6px 0" }} className="bz-noscroll">
        {(chat[ch] || []).map((m) => (
          m.sys ? <div key={m.id} style={{ textAlign: "center", fontSize: 11, color: T.faint, margin: "4px 0 12px" }}><span style={{ background: T.card2, padding: "3px 10px", borderRadius: 99 }}>{m.text}</span></div> :
          <div key={m.id} style={{ display: "flex", gap: 8, justifyContent: m.me ? "flex-end" : "flex-start", marginBottom: 12 }}>
            {!m.me && <Avatar name={m.from} size={30} color={m.color || colorOf(m.from)} />}
            <div style={{ maxWidth: "76%", position: "relative" }}>
              {!m.me && <div style={{ fontSize: 11, color: T.sub, fontWeight: 600, margin: "0 0 3px 4px" }}>{m.from}</div>}
              <div onClick={() => setReactFor(reactFor === m.id ? null : m.id)} style={{ cursor: "pointer", background: m.me ? T.accent : T.card, color: m.me ? T.accentText : T.text, padding: m.file && m.file.url ? 5 : "10px 13px", borderRadius: m.me ? "18px 18px 4px 18px" : "18px 18px 18px 4px", border: !m.me ? `1px solid ${T.border}` : "none", fontSize: 13.5, lineHeight: 1.45, transition: "transform .15s", transform: reactFor === m.id ? "scale(1.02)" : "none" }}>
                {m.file && m.file.url && <img alt="" src={m.file.url} style={{ display: "block", maxWidth: "100%", borderRadius: 14 }} />}
                {m.file && !m.file.url && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: m.text ? 6 : 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: m.me ? "rgba(0,0,0,0.12)" : T.soft, display: "grid", placeItems: "center" }}>{m.file.audio ? <Music size={18} /> : <FileText size={18} />}</div>
                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.file.name}</div><div style={{ fontSize: 11, opacity: 0.7 }}>{m.file.size}</div></div>
                    <Download size={16} />
                  </div>
                )}
                {m.file && m.file.audio && <audio controls src={m.file.audio} style={{ width: "100%", height: 34, marginBottom: m.text ? 6 : 0 }} />}
                {m.song && <ChatSongCard id={m.song} />}
                {m.text && <div style={{ padding: m.file && m.file.url ? "6px 8px 4px" : 0, whiteSpace: "pre-wrap" }}>{m.text}</div>}
                {m.text && !m.song && (m.text.split("\n").length >= 3 || m.text.length > 140) && <button onClick={(e) => { e.stopPropagation(); push({ screen: "songedit", lyrics: m.text }); }} style={{ display: "block", marginTop: 8, background: "rgba(0,0,0,0.12)", border: "none", borderRadius: 99, padding: "5px 10px", fontFamily: FONT, fontSize: 11.5, fontWeight: 800, color: "inherit", cursor: "pointer" }}>🎵 Make a chord chart from these lyrics</button>}
              </div>
              {reactFor === m.id && (
                <div className="bz-up" style={{ position: "absolute", [m.me ? "right" : "left"]: 0, top: -44, zIndex: 5, display: "flex", gap: 2, background: T.graffiti ? "#111" : T.card, border: `1px solid ${T.border}`, borderRadius: 99, padding: "4px 6px", boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}>
                  {["🙏", "❤️", "🔥", "😂", "🙌", "😮", "👏"].map((e) => <button key={e} onClick={() => react(m.id, e)} style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer", padding: "2px 3px" }}>{e}</button>)}
                </div>
              )}
              <div style={{ display: "flex", gap: 4, justifyContent: m.me ? "flex-end" : "flex-start", marginTop: 3, alignItems: "center", flexWrap: "wrap" }}>
                {m.react && Object.entries(m.react).map(([e, n]) => <span key={e} onClick={() => react(m.id, e)} style={{ fontSize: 11, padding: "1px 7px", borderRadius: 99, background: T.card2, cursor: "pointer" }}>{e} {n}</span>)}
                <span style={{ fontSize: 10, color: T.faint, margin: "0 4px" }}>{to12(m.t)}</span>
              </div>
            </div>
            {m.me && <Avatar name={user.name} src={avatar} size={30} color={T.pop} />}
          </div>
        ))}
      </div>
      {emo && (
        <Card pad={8} style={{ marginBottom: 8, flexShrink: 0 }}>
          <Scroller style={{ marginBottom: 6 }}>{emoGroups.map(([g], i) => <Chip key={g} active={grp === i} onClick={() => setGrp(i)} style={{ padding: "4px 10px", fontSize: 11 }}>{g}</Chip>)}</Scroller>
          <div className="bz-noscroll" style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 2, height: 196, overflowY: "auto" }}>
            {emoGroups[grp][1].split(" ").filter(Boolean).map((e, i) => <button key={i} onClick={() => addEmoji(e)} style={{ fontSize: 23, background: "none", border: "none", cursor: "pointer", padding: 3, borderRadius: 8 }}>{e}</button>)}
          </div>
        </Card>
      )}
      {!canPost && <div style={{ textAlign: "center", fontSize: 12, color: T.sub, padding: "12px 0", flexShrink: 0 }}>📣 Only leaders can post in this group</div>}
      {canPost && <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.card, borderRadius: 999, padding: 5, border: `1.5px solid ${T.border}`, flexShrink: 0 }}>
        <button onClick={() => setEmo((v) => !v)} style={{ width: 38, height: 38, borderRadius: 99, border: "none", background: emo ? T.soft : "transparent", color: T.text, display: "grid", placeItems: "center", cursor: "pointer" }}><Smile size={21} /></button>
        <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message the team…" style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", color: T.text, fontFamily: FONT, fontSize: 14 }} />
        <button onClick={() => setSongPick(true)} title="Send a song chart" style={{ width: 38, height: 38, borderRadius: 99, border: "none", background: "transparent", color: T.text, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}><Music size={20} noBlob /></button>
        <button onClick={() => fileRef.current.click()} style={{ width: 38, height: 38, borderRadius: 99, border: "none", background: "transparent", color: T.text, display: "grid", placeItems: "center", cursor: "pointer" }}><Paperclip size={20} /></button>
        <input ref={fileRef} type="file" hidden onChange={onFile} />
        <button onClick={() => send()} style={{ width: 40, height: 40, borderRadius: 99, border: "none", background: T.accent, color: T.accentText, display: "grid", placeItems: "center", cursor: "pointer" }}><Send size={18} /></button>
      </div>}
    </div>
  );
}

/* ================================ PROFILE & SETTINGS ================================ */
function ProfileScreen() {
  const { T, user, setUser, setRoles, avatar, setAvatar, voice, voiceRange, done, logs, streak, push, leader } = useApp();
  const fileRef = useRef(null);
  const [editRoles, setEditRoles] = useState(false);
  const minutes = logs.reduce((s, l) => s + l.mins, 0);
  const onPic = (e) => { const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { const img = new Image(); img.onload = () => { const c = document.createElement("canvas"); const s = 240; c.width = s; c.height = s; const g = c.getContext("2d"); const m = Math.min(img.width, img.height); g.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s); setAvatar(c.toDataURL("image/jpeg", 0.85)); }; img.src = r.result; }; r.readAsDataURL(f); };
  const Row = ({ icon: I, label, sub, onClick, right }) => (
    <div onClick={onClick} className="bz-press" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 4px", cursor: "pointer" }}>
      <IconBubble icon={I} size={36} /><div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>{sub && <div style={{ fontSize: 11.5, color: T.sub }}>{sub}</div>}</div>{right || <ChevronRight size={18} color={T.sub} />}
    </div>
  );
  return (
    <div>
      <TopBar title="Profile" />
      <Card tone="hero" style={{ textAlign: "center", padding: "26px 18px 20px" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Avatar name={user.name} src={avatar} size={96} color={T.pop} ring="rgba(255,255,255,0.35)" />
          <button onClick={() => fileRef.current.click()} style={{ position: "absolute", right: -2, bottom: -2, width: 34, height: 34, borderRadius: 99, border: "none", background: T.accent, color: T.accentText, display: "grid", placeItems: "center", cursor: "pointer" }}><Camera size={17} /></button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPic} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 21, marginTop: 12 }}>{user.name}</div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
          {user.roles.map((r) => <span key={r} style={{ fontSize: 11.5, fontWeight: 800, padding: "4px 10px", borderRadius: 99, background: roleOf(r).color, color: "#111" }}>{roleLabel(r)}</span>)}
          {voice && <span style={{ fontSize: 11.5, fontWeight: 800, padding: "4px 10px", borderRadius: 99, background: "rgba(0,0,0,0.25)" }}>🎤 {voice}{voiceRange ? ` · ${voiceRange.label}` : ""}</span>}
        </div>
        <div style={{ display: "flex", marginTop: 18 }}>
          <HoloStyle />
          {[[streak, "Day streak", Flame, NEON.flame], [minutes, "Minutes", Timer, NEON.time], [done.size, "Classes", BookOpen, NEON.classes]].map(([v, l, I, c], i) => (
            <div key={l} style={{ flex: 1, display: "grid", placeItems: "center", borderLeft: i ? "1px solid rgba(255,255,255,0.15)" : "none" }}><HoloStat icon={I} colors={c} value={v} label={l} size={40} /></div>
          ))}
        </div>
      </Card>
      <Card style={{ marginTop: 14, padding: "4px 12px" }}>
        <Row icon={Edit} label="How I serve" sub={user.roles.map(roleLabel).join(" · ")} onClick={() => setEditRoles(true)} />
        <div style={{ height: 1, background: T.border, marginLeft: 52 }} />
        <Row icon={Settings} label="Settings" sub="Theme, practice, MIDI, updates" onClick={() => push({ screen: "settings" })} />
        <div style={{ height: 1, background: T.border, marginLeft: 52 }} />
        <Row icon={Calendar} label="Team schedule" onClick={() => push({ screen: "schedule" })} />
        {leader && <><div style={{ height: 1, background: T.border, marginLeft: 52 }} /><Row icon={Shield} label="Leaders Board" sub="Only visible to leaders" onClick={() => push({ screen: "leaders" })} /></>}
        <div style={{ height: 1, background: T.border, marginLeft: 52 }} />
        <Row icon={LogOut} label="Log out" onClick={() => setUser(null)} right={<span />} />
      </Card>
      <Sheet open={editRoles} onClose={() => setEditRoles(false)} title="How I serve">
        <Onboarding inSheet initial={user.roles} onDone={(roles, levels) => { setRoles(roles, levels); setEditRoles(false); }} />
      </Sheet>
    </div>
  );
}

function SettingsScreen() {
  const { T, settings, setSettings, themeId, setThemeId, update, runUpdate, checkUpdate, user, setUser, toast, leader, setLeader, push, replayIntro } = useApp();
  const [midiMsg, setMidiMsg] = useState(midiState.connected ? midiState.inputs.join(", ") : "");
  const [gate, setGate] = useState(false); const [remOpen, setRemOpen] = useState(false);
  const [code, setCode] = useState(""); const [err, setErr] = useState(false);
  const hold = useRef(null);
  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));
  const Group = ({ title, children }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, textTransform: "uppercase", letterSpacing: 0.8, margin: "0 6px 7px" }}>{title}</div>
      <Card pad={0} style={{ padding: "0 14px" }}>{React.Children.toArray(children).map((c, i) => <div key={i} style={{ borderTop: i ? `1px solid ${T.border}` : "none" }}>{c}</div>)}</Card>
    </div>
  );
  const Row = ({ icon: I, label, value, right, onClick }) => (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 52, cursor: onClick ? "pointer" : "default" }}>
      <div style={{ width: 30, height: 30, borderRadius: 10, background: T.soft, color: T.softText, display: "grid", placeItems: "center", flexShrink: 0 }}><I size={17} noBlob /></div>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{label}</div>
      {value && <div style={{ fontSize: 13, color: T.sub, marginRight: right ? 6 : 0 }}>{value}</div>}
      {right !== undefined ? right : onClick ? <ChevronRight size={17} color={T.faint} /> : null}
    </div>
  );
  const Mini = ({ options, value, onChange }) => (
    <div style={{ display: "flex", background: T.input, borderRadius: 99, padding: 3 }}>
      {options.map(([v, l]) => <button key={v} onClick={() => onChange(v)} style={{ border: "none", borderRadius: 99, padding: "5px 10px", fontFamily: FONT, fontSize: 11.5, fontWeight: 700, cursor: "pointer", background: value === v ? T.accent : "transparent", color: value === v ? T.accentText : T.sub }}>{l}</button>)}
    </div>
  );
  const tryCode = (c) => { if (CLOUD.on) { CLOUD.set(`leaders/${user.uid}`, { code: c.toUpperCase().replace(/[^A-Z0-9]/g, ""), name: user.name }, false).then(() => { setLeader(true); setGate(false); setCode(""); toast("Leaders Board unlocked 🛡️"); push({ screen: "leaders" }); }).catch(() => { setErr(true); setTimeout(() => { setErr(false); setCode(""); }, 700); }); return; } if (c.toUpperCase() === LEADER_CODE) { setLeader(true); setGate(false); setCode(""); toast("Leaders Board unlocked 🛡️"); push({ screen: "leaders" }); } else { setErr(true); setTimeout(() => { setErr(false); setCode(""); }, 700); } };
  const startHold = () => { clearTimeout(hold.current); hold.current = setTimeout(() => { if (navigator.vibrate) navigator.vibrate(30); setGate(true); }, 2500); };
  const endHold = () => clearTimeout(hold.current);
  return (
    <div>
      <TopBar title={STR[settings.lang].settings} />
      <Group title="Appearance">
        <div style={{ padding: "12px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {Object.values(THEMES).filter((th) => th.id !== "graffiti").map((th) => (
              <button key={th.id} onClick={() => setThemeId(th.id)} style={{ border: themeId === th.id ? `2.5px solid ${T.accent}` : `1.5px solid ${T.border}`, borderRadius: 14, padding: 4, background: "transparent", cursor: "pointer", fontFamily: FONT, color: T.text, minWidth: 0 }}>
                <div style={{ height: 44, borderRadius: 10, background: th.bg, backgroundImage: th.texture > 0.4 ? NOISE_SVG : "none", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 5, right: 5, top: 5, height: 13, borderRadius: 5, background: th.heroBg || th.hero }} />
                  <div style={{ position: "absolute", left: 5, bottom: 5, width: 14, height: 14, borderRadius: 9, background: th.accent }} />
                  <div style={{ position: "absolute", right: 5, bottom: 5, width: 14, height: 14, borderRadius: 9, background: th.pop }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>{th.name}</div>
              </button>
            ))}
          </div>
          <button onClick={() => setThemeId("graffiti")} className="bz-press" style={{ width: "100%", marginTop: 10, border: themeId === "graffiti" ? `2.5px solid ${T.accent}` : `1.5px solid ${T.border}`, borderRadius: 18, padding: 0, overflow: "hidden", cursor: "pointer", background: "#242B34", position: "relative", height: 74, textAlign: "left" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE_SVG, opacity: 0.6 }} />
            {[["#FF3EA5", 18, 10, 46], ["#22E4FF", 70, 30, 38], ["#C6FF3D", 250, 8, 52], ["#8B5CFF", 300, 34, 34], ["#FFE53D", 200, 40, 26]].map(([c, x, y, r], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: r, height: r, borderRadius: "46% 54% 58% 42%", background: c, opacity: 0.55, filter: "blur(2px)" }} />)}
            <div style={{ position: "relative", padding: "12px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#C6FF3D", letterSpacing: 1.5 }}>✦ SPECIAL THEME</div>
              <div style={{ fontFamily: GRAFF, fontSize: 26, color: "#fff", lineHeight: 1.1, textShadow: "2px 2px 0 #FF3EA5" }}>Graffiti</div>
            </div>
            {themeId === "graffiti" && <div style={{ position: "absolute", right: 12, top: 24, width: 26, height: 26, borderRadius: 99, background: "#C6FF3D", color: "#111", display: "grid", placeItems: "center" }}><Check size={15} noBlob /></div>}
          </button>
        </div>
        <Row icon={Globe} label="Language" right={<Mini options={[["en", "English"], ["am", "አማርኛ"]]} value={settings.lang} onChange={(v) => set("lang", v)} />} />
        <Row icon={Sparkles} label="Replay intro animation" onClick={replayIntro} />
      </Group>
      <Group title="Practice">
        <Row icon={Bell} label="Practice reminder" value={settings.notif ? `${to12(settings.reminder)} · ${settings.goal || 20} min` : "Off"} onClick={() => setRemOpen(true)} />
        <Row icon={Timer} label="Metronome sound" right={<Mini options={[["click", "Click"], ["wood", "Wood"], ["beep", "Beep"]]} value={settings.click} onChange={(v) => { set("click", v); AE.settings.click = v; AE.click(true); }} />} />
        <Row icon={Music} label="Reference pitch" right={<Mini options={[[440, "A440"], [442, "A442"]]} value={settings.a4} onChange={(v) => set("a4", v)} />} />
      </Group>
      <Group title="Audio & MIDI">
        <Row icon={Radio} label="MIDI keyboard" value={midiMsg ? midiMsg.slice(0, 16) : "Not connected"} right={<Btn small variant="soft" onClick={async () => { try { const ins = await connectMidi(); setMidiMsg(ins.length ? ins.join(", ") : "No device found"); toast(ins.length ? `MIDI connected: ${ins[0]}` : "Plug in a MIDI keyboard and tap again"); } catch (e) { setMidiMsg("Unavailable"); toast(e.message); } }}>Connect</Btn>} />
        <Row icon={Keyboard} label="Play with PC keyboard" right={<Toggle on={settings.pcKeys} onChange={(v) => set("pcKeys", v)} />} />
      </Group>
      <Group title="App">
        <Row icon={RefreshCw} label="Version" value={update.version} right={<Btn small variant="soft" onClick={async () => { const r = await checkUpdate(); toast(r === false ? "You're on the latest version ✓" : r ? "New version found" : "Can't reach the update server right now"); }}>Check</Btn>} />
        <Row icon={Info} label="Help & feedback" onClick={() => toast("Feedback goes straight to the leaders 💛")} />
      </Group>
      <Group title="Account">
        <Row icon={User} label={user.name} value={user.roles.map(roleLabel).join(" · ")} />
        <div onClick={() => setUser(null)} style={{ minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center", color: T.bad, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Log out</div>
      </Group>
      <div style={{ display: "grid", placeItems: "center", padding: "10px 0 6px", userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
        onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold} onContextMenu={(e) => e.preventDefault()}>
        <BezaLogo width={120} />
      </div>
      <div style={{ textAlign: "center", fontSize: 11, color: T.faint, lineHeight: 1.6 }}>Beza Youth Worship Team · v{update.version}<br />Piano: Salamander Grand (CC-BY) · Guitar/bass/drums: Tone.js sample libraries</div>
      <Sheet open={remOpen} onClose={() => setRemOpen(false)}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 12 }}>Practice reminder</div>
        <ReminderPicker value={{ notif: settings.notif, reminder: settings.reminder, days: settings.days, goal: settings.goal }} onChange={(r) => setSettings((x) => ({ ...x, ...r }))} />
        <Btn full style={{ marginTop: 16 }} icon={Check} onClick={async () => { const r = await applyReminders(settings, true); setRemOpen(false); toast(r === "denied" ? "Notifications are blocked. Allow them in your phone settings." : r === "scheduled" ? `Reminder set for ${to12(settings.reminder)} ✓` : settings.notif ? `Saved ✓ We'll remind you at ${to12(settings.reminder)} when the app is open` : "Reminder off"); }}>Save</Btn>
      </Sheet>
      <Sheet open={gate} onClose={() => setGate(false)}>
        <div style={{ textAlign: "center", padding: "6px 0 10px" }}>
          <div style={{ fontFamily: GRAFF, fontSize: 28 }}>Leader code</div>
          <div className={err ? "bz-shake" : ""} style={{ marginTop: 16 }}>
            <input autoFocus value={code} maxLength={40} placeholder="Type the leader code" onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && code.trim() && tryCode(code.replace(/[^a-z0-9]/gi, ""))}
              style={{ width: "100%", boxSizing: "border-box", textAlign: "center", fontSize: 18, fontWeight: 800, letterSpacing: 1, padding: "14px 12px", borderRadius: 16, border: `2px solid ${err ? T.bad : T.border}`, background: T.card2, color: T.text, fontFamily: FONT, outline: "none" }} />
            <Btn full style={{ marginTop: 12 }} icon={Shield} onClick={() => code.trim() && tryCode(code.replace(/[^a-z0-9]/gi, ""))}>Unlock</Btn>
          </div>
          <div style={{ fontSize: 12, color: err ? T.bad : T.faint, marginTop: 12 }}>{err ? "Wrong code" : "Spaces and capitals don't matter"}</div>
        </div>
      </Sheet>
    </div>
  );
}

/* ================================ LEADERS BOARD ================================ */
const DUE_OPTS = ["Today", "Tomorrow", "Before Saturday rehearsal", "This week", "Next week"];
function AssignFlow({ member, onSend }) {
  const { T } = useApp();
  const [role, setRole] = useState(member.roles[0]);
  const [kind, setKind] = useState("lesson");
  const [ref, setRef] = useState(null);
  const [due, setDue] = useState(DUE_OPTS[2]);
  const [comment, setComment] = useState("");
  const C = CURRICULUM[role];
  const title = ref ? (kind === "lesson" ? LESSONS[ref].title : SESSIONS.find((s) => s.id === ref).title) : null;
  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}><Avatar name={member.name} size={40} color={member.color} /><div><div style={{ fontWeight: 800 }}>Assign to {member.name.split(" ")[0]}</div><div style={{ fontSize: 12, color: T.sub }}>{member.roles.map(roleLabel).join(" · ")}</div></div></div>
      {member.roles.length > 1 && <Seg value={role} onChange={(r) => { setRole(r); setRef(null); }} options={member.roles.map((r) => ({ value: r, label: roleLabel(r).replace(" Guitar", "") }))} />}
      <Seg style={{ marginTop: 8 }} value={kind} onChange={(k) => { setKind(k); setRef(null); }} options={[{ value: "lesson", label: "A specific class" }, { value: "session", label: "A 30-min session" }]} />
      <div className="bz-noscroll" style={{ maxHeight: 230, overflowY: "auto", margin: "10px 0", display: "flex", flexDirection: "column", gap: 6 }}>
        {kind === "lesson" ? C.levels.map((lv) => (
          <div key={lv.n}>
            <div style={{ fontSize: 11, fontWeight: 800, color: T.sub, margin: "6px 2px" }}>LEVEL {lv.n} · {lv.name.toUpperCase()}</div>
            {lv.ids.map((id) => <div key={id} onClick={() => setRef(id)} style={{ padding: "9px 12px", borderRadius: 12, marginBottom: 4, cursor: "pointer", background: ref === id ? T.accent : T.card2, color: ref === id ? T.accentText : T.text, fontSize: 13, fontWeight: 600 }}>{LESSONS[id].title}</div>)}
          </div>
        )) : sessionsFor([role]).map((s) => <div key={s.id} onClick={() => setRef(s.id)} style={{ padding: "10px 12px", borderRadius: 12, cursor: "pointer", background: ref === s.id ? T.accent : T.card2, color: ref === s.id ? T.accentText : T.text, fontSize: 13, fontWeight: 600 }}>{s.title} · {LEVELS[s.level]}</div>)}
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: T.sub, margin: "4px 2px 6px" }}>DUE</div>
      <Scroller>{DUE_OPTS.map((d) => <Chip key={d} active={due === d} onClick={() => setDue(d)}>{d}</Chip>)}</Scroller>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment — e.g. focus on the breathing part 🙏" rows={3} style={{ width: "100%", boxSizing: "border-box", marginTop: 10, border: `1.5px solid ${T.border}`, background: T.input, color: T.text, borderRadius: 16, padding: 12, fontFamily: FONT, fontSize: 13.5, outline: "none", resize: "none" }} />
      <Btn full style={{ marginTop: 10 }} icon={Send} disabled={!ref} onClick={() => onSend({ role, kind, ref, title, due, comment })}>{ref ? `Send "${title}"` : "Choose what to assign"}</Btn>
    </div>
  );
}
function LeadersBoard() {
  const { T, leader, setFeed, user, toast, setChat, assignments, setAssignments } = useApp();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("prog");
  const [sel, setSel] = useState(null);
  const [assign, setAssign] = useState(null);
  const [post, setPost] = useState("");
  if (!leader) return <div><TopBar title="Not available" /></div>;
  const list = TEAM.filter((m) => filter === "all" || m.roles.includes(filter)).sort((a, b) => (sort === "prog" ? b.prog - a.prog : sort === "streak" ? b.streak - a.streak : a.prog - b.prog));
  const avg = TEAM.length ? TEAM.reduce((s, m) => s + m.prog, 0) / TEAM.length : 0;
  const weekly = CLOUD.on ? Array.from({ length: 7 }, (_, i) => TEAM.reduce((s, m) => s + ((m.week || [])[i] || 0), 0)) : [180, 240, 210, 320, 150, 410, 290]; const mx = Math.max(1, ...weekly);
  const sent = assignments.filter((a) => !a.toMe);
  return (
    <div>
      <TopBar title="Leaders Board" sub="Hidden · leaders only" right={<IconBubble icon={Shield} tone="accent" size={38} />} />
      <Card tone="hero" style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Ring pct={avg} size={92} stroke={10} color="#C6FF3D" track="rgba(255,255,255,0.22)"><span style={{ fontSize: 18 }}>{Math.round(avg * 100)}%</span></Ring>
          <div><div style={{ fontSize: 17, fontWeight: 800 }}>Team progress</div><div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 4 }}>{TEAM.length} members · {CLOUD.on ? TEAM.filter((m) => m.activeToday).length : 9} active today<br />{TEAM.filter((m) => m.prog < 0.4).length} need encouragement</div></div>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
        {[[Clock, `${TEAM.reduce((s, m) => s + m.mins, 0)}`, "Practice minutes"], [Flame, (TEAM.length ? TEAM.reduce((s, m) => s + m.streak, 0) / TEAM.length : 0).toFixed(1), "Avg streak"], [Book, CLOUD.on ? `${TEAM.reduce((s, m) => s + (m.classes || 0), 0)}` : "128", "Classes completed"], [Send, `${sent.length}`, "Assignments sent"]].map(([I, v, l], i) => (
          <Card key={l} pad={14} tone={i === 3 ? "soft" : "card"}><I size={20} /><div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>{v}</div><div style={{ fontSize: 11.5, color: i === 3 ? undefined : T.sub }}>{l}</div></Card>
        ))}
      </div>
      <SectionTitle>Practice this week</SectionTitle>
      <Card>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120 }}>
          {weekly.map((v, i) => <div key={i} style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 10, color: T.sub, marginBottom: 4 }}>{v}</div><div style={{ height: (v / mx) * 86, borderRadius: 10, background: T.spray ? T.spray[i % 6] : T.accent }} /><div style={{ fontSize: 10.5, color: T.sub, marginTop: 6, fontWeight: 600 }}>{CLOUD.on ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][(new Date().getDay() + i + 1) % 7] : WEEK[i].d}</div></div>)}
        </div>
      </Card>
      <SectionTitle>Post to team feed</SectionTitle>
      <Card style={{ display: "flex", gap: 8, alignItems: "center", padding: 10 }}>
        <input value={post} onChange={(e) => setPost(e.target.value)} placeholder="Announcement for everyone…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: T.text, fontFamily: FONT, fontSize: 13.5, minWidth: 0 }} />
        <Btn small icon={Megaphone} onClick={() => { if (!post.trim()) return; setFeed((f) => [{ id: Date.now(), who: user.name, leader: true, pinned: true, t: "Just now", text: post.trim() }, ...f]); setPost(""); toast("Posted to everyone's feed 📣"); }}>Post</Btn>
      </Card>
      <SectionTitle>Members</SectionTitle>
      <Scroller>{[["all", "All"], ...ROLES.map((r) => [r.id, r.label])].map(([id, l]) => <Chip key={id} active={filter === id} onClick={() => setFilter(id)}>{l}</Chip>)}</Scroller>
      <Seg style={{ margin: "8px 0 12px" }} value={sort} onChange={setSort} options={[{ value: "prog", label: "Top progress" }, { value: "streak", label: "Streak" }, { value: "low", label: "Needs help" }]} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((m) => (
          <Card key={m.id} pad={12} onClick={() => setSel(m)} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={m.name} size={42} color={m.color} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</span><span style={{ fontSize: 12, fontWeight: 800 }}>{Math.round(m.prog * 100)}%</span></div>
              <div style={{ display: "flex", gap: 4, margin: "4px 0 6px", flexWrap: "wrap" }}>{m.roles.map((r) => <span key={r} style={{ fontSize: 10, fontWeight: 800, padding: "1px 7px", borderRadius: 99, background: roleOf(r).color, color: "#111" }}>{roleLabel(r)}</span>)}<span style={{ fontSize: 11, color: T.sub }}>🔥 {m.streak} · {m.last}</span></div>
              <Bar pct={m.prog} h={6} color={m.prog < 0.4 ? T.bad : m.prog > 0.7 ? T.good : T.accent} />
            </div>
          </Card>
        ))}
      </div>
      {sent.length > 0 && (<>
        <SectionTitle>Sent assignments</SectionTitle>
        {sent.map((a) => <Card key={a.id} pad={12} style={{ marginBottom: 8 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{a.title}</div><div style={{ fontSize: 11.5, color: T.sub }}>→ {a.toName} · {roleLabel(a.role)} · due {a.due}</div>{a.comment && <div style={{ fontSize: 12.5, marginTop: 6, fontStyle: "italic" }}>“{a.comment}”</div>}</Card>)}
      </>)}
      <Sheet open={!!sel && !assign} onClose={() => setSel(null)}>
        {sel && (
          <div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Avatar name={sel.name} size={58} color={sel.color} />
              <div><div style={{ fontWeight: 800, fontSize: 18 }}>{sel.name}</div><div style={{ fontSize: 12.5, color: T.sub }}>{sel.roles.map(roleLabel).join(" · ")}{sel.voice ? ` · ${sel.voice}${sel.voiceRange ? ` (${sel.voiceRange.label})` : ""}` : ""} · {sel.last}</div></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, margin: "16px 0" }}>
              {[[`${Math.round(sel.prog * 100)}%`, "Progress"], [<span>{sel.streak} <Glyph icon={Flame} /></span>, "Streak"], [`${sel.mins}`, "Minutes"]].map(([v, l]) => <Card key={l} tone="card2" pad={10} style={{ textAlign: "center" }}><div style={{ fontWeight: 800, fontSize: 17 }}>{v}</div><div style={{ fontSize: 11, color: T.sub }}>{l}</div></Card>)}
            </div>
            {sel.roles.map((r, ri) => { const C = CURRICULUM[r]; return C ? <div key={r} style={{ marginBottom: 12 }}><div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>{roleLabel(r)}</div>{C.levels.map((l, li) => { const p = Math.max(0, Math.min(1, sel.prog * 1.6 - li * 0.32 + ri * 0.05)); return <div key={l.n} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}><div style={{ width: 92, fontSize: 11.5, color: T.sub }}>L{l.n} {l.name}</div><div style={{ flex: 1 }}><Bar pct={p} h={6} color={roleOf(r).color} /></div><div style={{ width: 34, fontSize: 11, textAlign: "right" }}>{Math.round(p * 100)}%</div></div>; })}</div> : null; })}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Btn full icon={Heart} onClick={() => { setChat((c) => ({ ...c, all: [...c.all, { id: Date.now(), from: user.name, me: true, text: `Proud of you ${sel.name.split(" ")[0]}! Keep going 💛🙏`, t: nowHM() }] })); toast(`Encouragement sent to ${sel.name.split(" ")[0]} 💛`); setSel(null); }}>Encourage</Btn>
              <Btn variant="ghost" icon={Book} onClick={() => setAssign(sel)}>Assign</Btn>
            </div>
          </div>
        )}
      </Sheet>
      <Sheet open={!!assign} onClose={() => { setAssign(null); setSel(null); }}>
        {assign && <AssignFlow member={assign} onSend={(a) => { setAssignments((x) => [{ id: Date.now(), ...a, to: assign.id, toName: assign.name, from: user.name, at: Date.now(), status: "sent" }, ...x]); toast(`Assigned to ${assign.name.split(" ")[0]} ✅`); setAssign(null); setSel(null); }} />}
      </Sheet>
    </div>
  );
}

/* ================================ QUICK SHEET (+) ================================ */
function QuickSheet({ open, onClose }) {
  const { T, push, setTab, logPractice, toast, user } = useApp();
  const [log, setLog] = useState(false);
  const [mins, setMins] = useState(10);
  const [what, setWhat] = useState("Warm-ups");
  const go = (r) => { onClose(); setLog(false); push(r); };
  const s = sessionsFor(user.roles)[0];
  const tools = toolsFor(user.roles).slice(0, 4);
  return (
    <Sheet open={open} onClose={() => { onClose(); setLog(false); }} title={log ? "Log practice" : "Quick start"}>
      {!log ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          <Card pad={14} tone="accent" onClick={() => setLog(true)} style={{ textAlign: "center" }}><div style={{ display: "grid", placeItems: "center" }}><Clock size={26} blobColor="#fff" /></div><div style={{ fontSize: 12, fontWeight: 800, marginTop: 8 }}>Log practice</div></Card>
          {s && <Card pad={14} tone="card2" onClick={() => go({ screen: "session", id: s.id })} style={{ textAlign: "center" }}><div style={{ display: "grid", placeItems: "center" }}><Dumbbell size={26} /></div><div style={{ fontSize: 12, fontWeight: 800, marginTop: 8 }}>30-min session</div></Card>}
          {tools.map(([id, t]) => <Card key={id} pad={14} tone="card2" onClick={() => go({ screen: "tool", id })} style={{ textAlign: "center" }}><div style={{ display: "grid", placeItems: "center" }}><t.icon size={26} /></div><div style={{ fontSize: 12, fontWeight: 800, marginTop: 8 }}>{t.title}</div></Card>)}
          <Card pad={14} tone="card2" onClick={() => { onClose(); setTab("chat"); }} style={{ textAlign: "center" }}><div style={{ display: "grid", placeItems: "center" }}><MessageCircle size={26} /></div><div style={{ fontSize: 12, fontWeight: 800, marginTop: 8 }}>Message team</div></Card>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 12.5, color: T.sub, fontWeight: 600, marginBottom: 8 }}>How long?</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>{[5, 10, 15, 30, 45].map((m) => <Chip key={m} active={mins === m} onClick={() => setMins(m)} style={{ flex: 1 }}>{m}m</Chip>)}</div>
          <div style={{ fontSize: 12.5, color: T.sub, fontWeight: 600, marginBottom: 8 }}>What did you practise?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>{["Warm-ups", "Scales", "Songs for Saturday", "Chords", "Grooves", "Ear training", "Mixing"].map((w) => <Chip key={w} active={what === w} onClick={() => setWhat(w)}>{w}</Chip>)}</div>
          <Btn full icon={Check} onClick={() => { logPractice(mins, what); toast(`+${mins} min logged · ${what} 🙌`); setLog(false); onClose(); }}>Save practice</Btn>
        </div>
      )}
    </Sheet>
  );
}

function RouteView({ r }) {
  switch (r.screen) {
    case "lesson": return <LessonScreen id={r.id} role={r.role} />;
    case "tool": { const t = TOOLS[r.id]; if (!t) return null; const C = t.C; return <C {...(r.props || {})} />; }
    case "session": return <SessionScreen id={r.id} />;
    case "settings": return <SettingsScreen />;
    case "leaders": return <LeadersBoard />;
    case "schedule": return <ScheduleScreen startDay={r.day} />;
    case "profile": return <ProfileScreen />;
    case "groups": return <GroupsAdmin />;
    case "group": return <GroupEdit id={r.id} />;
    case "games": return <GamesHub />;
    case "game": return <GameScreen id={r.id} />;
    case "board": return <TeamBoard />;
    case "song": return <SongScreen id={r.id} share={r.share} />;
    case "songedit": return <SongEditScreen id={r.id} lyrics={r.lyrics} />;
    case "live": return <LiveScreen id={r.id} />;
    default: return null;
  }
}
