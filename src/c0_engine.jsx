
/* ============================ CURRICULUM ENGINE ============================ */
/* Block shorthand used by all lessons:
   ["h", heading] ["p", paragraph] ["tip", text] ["warn", text] ["list", [items]] ["steps", [items]]
   ["terms", [[term, meaning]]] ["ex", title, text] ["verse", text, ref] ["mistakes", [items]] ["home", text]
   ["w", widgetKind, props, caption]  — live interactive example inside the lesson
   Lesson: { level, title, mins, sum, body, quiz:[[q,[a,b,c,d],correct,why]], practice:[[toolId, props, label]] } */
const LESSONS = {};
const L = (id, o) => { LESSONS[id] = { id, ...o }; return id; };
const LEVELS = ["Foundations", "Beginner", "Developing", "Intermediate", "Advanced", "Expert"];
const CURRICULUM = {};
const buildTrack = (role, title, tagline, ids, opts = {}) => {
  if (opts.flat) { const all = ids.filter((id) => LESSONS[id]); CURRICULUM[role] = { role, title, tagline, flat: true, levels: [{ n: 0, name: "Lessons", ids: all }], all }; return; }
  const levels = LEVELS.map((name, n) => ({ n, name, ids: ids.filter((id) => LESSONS[id] && LESSONS[id].level === n) })).filter((l) => l.ids.length);
  CURRICULUM[role] = { role, title, tagline, levels, all: levels.flatMap((l) => l.ids) };
};
