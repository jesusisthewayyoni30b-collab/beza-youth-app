/* ============================ LESSON LOCKS + ASK A LEADER ============================ */
/* Rule: every track is learned in order. Heart of Worship comes first: department lesson N opens only
   after Heart of Worship lesson N is complete (and the department lesson before it). Leaders see everything. */
function lessonLock(id, role, done, leader, assigned) {
  if (leader || assigned) return null;
  const C = CURRICULUM[role]; if (!C) return null; const idx = C.all.indexOf(id); if (idx < 0) return null;
  if (idx > 0 && !done.has(C.all[idx - 1])) return { kind: "prev", needId: C.all[idx - 1], needRole: role, text: `Finish "${LESSONS[C.all[idx - 1]].title}" first.` };
  if (role !== "heart") {
    const H = CURRICULUM.heart.all; const need = Math.min(idx + 1, H.length); const hDone = H.filter((h) => done.has(h)).length;
    if (hDone < need) { const nid = H.find((h) => !done.has(h)); return { kind: "heart", needId: nid, needRole: "heart", text: `Complete Heart of Worship lesson ${need} first — "${LESSONS[nid].title}". Each Heart of Worship lesson opens one ${roleLabel(role)} lesson.` }; }
  }
  return null;
}
/* the lesson someone should do next in a track (may send them to Heart of Worship) */
function nextLessonFor(role, done, leader) {
  const C = CURRICULUM[role]; if (!C) return null;
  const id = C.all.find((x) => !done.has(x)) || C.all[0];
  const lk = lessonLock(id, role, done, leader);
  return lk && lk.kind === "heart" ? { id: lk.needId, role: "heart", via: role } : { id, role };
}

/* ---------- Ask a leader (floating helper while learning) ---------- */
function AskLeaderFab({ context, compact }) {
  const { T, user, host, web, toast } = useApp();
  const [open, setOpen] = useState(false); const [txt, setTxt] = useState(""); const [busy, setBusy] = useState(false);
  const [mine, setMine] = useState([]);
  useEffect(() => { if (!CLOUD.on || !user.uid) return; return CLOUD.listen("questions", { where: ["uid", "==", user.uid] }, (l) => setMine(l.sort((a, b) => toMs(b.at) - toMs(a.at)))); }, [user.uid]);
  const here = mine.filter((q) => !context || q.ctxId === context.id);
  const unseen = mine.filter((q) => q.answer && !q.seen).length;
  useEffect(() => { if (open) mine.filter((q) => q.answer && !q.seen).forEach((q) => CLOUD.update(`questions/${q._id}`, { seen: true }).catch(() => { })); }, [open, mine]);
  const send = async () => {
    const t = txt.trim(); if (!t || busy) return; setBusy(true);
    const id = `${Date.now()}_${(user.uid || "local").slice(0, 6)}`;
    const doc = { uid: user.uid || null, name: user.name, roles: user.roles || [], text: t, ctxId: context ? context.id : "general", ctxTitle: context ? context.title : "General", ctxKind: context ? context.kind : "general", ctxRole: context ? context.role || "" : "", at: CLOUD.on ? CLOUD.now() : Date.now(), answer: "", seen: false };
    try { if (CLOUD.on) await CLOUD.set(`questions/${id}`, doc, false); setTxt(""); toast("Sent to the leaders 🙏 You'll get the answer here."); }
    catch (e) { toast("Couldn't send. Check your internet and try again."); }
    setBusy(false);
  };
  if (!host) return null;
  return createPortal(<>
    <button onClick={() => setOpen(true)} className="bz-press" aria-label="Ask a leader" style={{ position: "absolute", right: web ? (window.innerWidth >= 1240 ? 348 : 28) : 16, bottom: web ? 28 : 98, zIndex: 45, height: 52, width: compact ? 52 : "auto", justifyContent: "center", padding: compact ? 0 : "0 16px 0 12px", borderRadius: 99, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#22E4FF,#B57BFF)", color: "#07121A", fontFamily: FONT, fontWeight: 900, fontSize: 13.5, boxShadow: "0 10px 28px rgba(34,228,255,0.35)" }}>
      <span style={{ fontSize: 20 }}>💬</span>{compact ? null : "Ask a leader"}
      {unseen > 0 && <span style={{ position: "absolute", top: -4, right: -2, minWidth: 18, height: 18, borderRadius: 99, background: "#FF3B5C", color: "#fff", fontSize: 10.5, display: "grid", placeItems: "center", padding: "0 4px" }}>{unseen}</span>}
    </button>
    <Sheet open={open} onClose={() => setOpen(false)} title="Ask a leader">
      <div style={{ fontSize: 12.5, color: T.sub, lineHeight: 1.5, marginTop: -6 }}>Didn't understand something{context ? <> in <b style={{ color: T.text }}>{context.title}</b></> : ""}? Ask anything — it goes straight to the leaders and their answer comes back here.</div>
      <div style={{ maxHeight: 260, overflowY: "auto", margin: "12px 0" }} className="bz-noscroll">
        {here.length === 0 && <div style={{ fontSize: 12.5, color: T.faint, textAlign: "center", padding: 10 }}>No questions yet. There are no silly questions 💛</div>}
        {[...here].reverse().map((q) => <div key={q._id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ maxWidth: "82%", background: T.accent, color: T.accentText, borderRadius: "16px 16px 4px 16px", padding: "8px 12px", fontSize: 13.5, whiteSpace: "pre-wrap" }}>{q.text}</div></div>
          {q.answer ? <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "flex-end" }}><Avatar name={q.answeredBy || "Leader"} size={26} color="#B57BFF" /><div style={{ maxWidth: "82%", background: T.card2, borderRadius: "16px 16px 16px 4px", padding: "8px 12px", fontSize: 13.5, whiteSpace: "pre-wrap", lineHeight: 1.5 }}><div style={{ fontSize: 11, fontWeight: 800, color: T.sub, marginBottom: 2 }}>{q.answeredBy || "Leader"} answered</div>{q.answer}</div></div>
            : <div style={{ fontSize: 11, color: T.faint, textAlign: "right", marginTop: 4 }}>⏳ Waiting for a leader…</div>}
        </div>)}
      </div>
      <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={3} placeholder="Type your question…" style={{ width: "100%", boxSizing: "border-box", border: `1.5px solid ${T.border}`, background: T.input, color: T.text, borderRadius: 16, padding: 12, fontFamily: FONT, fontSize: 14, resize: "vertical", outline: "none" }} />
      <Btn full style={{ marginTop: 10 }} icon={Send} onClick={send}>{busy ? "Sending…" : "Send to leaders"}</Btn>
    </Sheet>
  </>, host);
}

/* leaders: questions inbox with answers */
function QuestionsInbox() {
  const { T, user, toast } = useApp();
  const [list, setList] = useState(null); const [draft, setDraft] = useState({});
  useEffect(() => { if (!CLOUD.on) { setList([]); return; } return CLOUD.listen("questions", { order: ["at", "desc"], limit: 80 }, (d) => setList(d), () => setList([])); }, []);
  if (!list) return null;
  const open = list.filter((q) => !q.answer);
  const answer = (q) => { const a = (draft[q._id] || "").trim(); if (!a) return; CLOUD.update(`questions/${q._id}`, { answer: a, answeredBy: user.name, answeredAt: CLOUD.now(), seen: false }).then(() => { toast("Answer sent ✓"); setDraft((d) => ({ ...d, [q._id]: "" })); }).catch(() => toast("Couldn't send the answer")); };
  return (
    <>
      <SectionTitle>Learning questions {open.length ? `· ${open.length} waiting` : ""}</SectionTitle>
      {list.length === 0 ? <Card tone="soft" style={{ fontSize: 13, textAlign: "center" }}>No questions yet. Members ask from the 💬 button inside lessons and practice.</Card> :
        list.slice(0, 30).map((q) => (
          <Card key={q._id} pad={12} style={{ marginBottom: 8, opacity: q.answer ? 0.7 : 1, borderLeft: q.answer ? undefined : "4px solid #22E4FF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12, color: T.sub }}><span><b style={{ color: T.text }}>{q.name}</b> · {q.ctxTitle}</span><span>{relTime(toMs(q.at))}</span></div>
            <div style={{ fontSize: 13.5, marginTop: 6, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{q.text}</div>
            {q.answer ? <div style={{ marginTop: 8, fontSize: 13, background: T.card2, borderRadius: 12, padding: "8px 10px", whiteSpace: "pre-wrap" }}><b>{q.answeredBy}:</b> {q.answer}</div> :
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input value={draft[q._id] || ""} onChange={(e) => setDraft((d) => ({ ...d, [q._id]: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && answer(q)} placeholder="Write the answer…" style={{ flex: 1, minWidth: 0, border: `1.5px solid ${T.border}`, background: T.input, color: T.text, borderRadius: 12, padding: "9px 11px", fontFamily: FONT, fontSize: 13.5, outline: "none" }} />
                <Btn small icon={Send} onClick={() => answer(q)}>Answer</Btn>
              </div>}
          </Card>
        ))}
    </>
  );
}
