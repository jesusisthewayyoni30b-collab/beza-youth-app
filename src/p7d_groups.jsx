
/* ================================ CHAT GROUP MANAGEMENT (leaders) ================================ */
function GroupsAdmin() {
  const { T, leader, groups, setGroups, push, toast } = useApp();
  const [newName, setNewName] = useState("");
  if (!leader) return <div><TopBar title="Not available" /></div>;
  const create = () => {
    const name = newName.trim(); if (!name) return;
    const id = "g" + Date.now();
    setGroups((g) => [...g, { id, label: name, emoji: "💬", members: ["@me"] }]);
    setNewName(""); toast(`Group "${name}" created`); push({ screen: "group", id });
  };
  return (
    <div>
      <TopBar title="Manage groups" sub="Leaders only · who's in which chat" />
      <Card tone="soft" style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 12 }}>Members only see the groups they're in. "All team" always includes everyone. Tap a group to add or remove people, rename it, or make it announcements-only.</Card>
      {groups.map((g) => (
        <Card key={g.id} onClick={() => push({ screen: "group", id: g.id })} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 16, background: T.card2, display: "grid", placeItems: "center", fontSize: 24, flexShrink: 0 }}>{g.emoji || "💬"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{g.label}{g.leadersOnly ? " 🔒" : ""}</div>
            <div style={{ fontSize: 12, color: T.sub }}>{g.everyone ? "Everyone · automatic" : `${g.members.length} members`}{g.announce ? " · announcements only" : ""}</div>
          </div>
          <div style={{ display: "flex", flexShrink: 0 }}>{(g.everyone ? TEAM.slice(0, 3).map((m) => m.name) : g.members.slice(0, 3)).map((n, i) => <div key={n} style={{ marginLeft: i ? -10 : 0 }}><Avatar name={n === "@me" ? "You" : n} size={26} color={(TEAM.find((m) => m.name === n) || {}).color || T.pop} /></div>)}</div>
          <ChevronRight size={18} color={T.sub} />
        </Card>
      ))}
      <SectionTitle>New group</SectionTitle>
      <Card style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && create()} placeholder="e.g. Saturday band, Altos, Friday sectional…" style={{ flex: 1, minWidth: 0, padding: "11px 12px", borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.input, color: T.text, fontFamily: FONT, fontSize: 14, outline: "none" }} />
        <Btn icon={Plus} onClick={create}>Create</Btn>
      </Card>
    </div>
  );
}

function GroupEdit({ id }) {
  const { T, leader, groups, setGroups, setChat, user, avatar, pop, toast } = useApp();
  const g = groups.find((x) => x.id === id);
  const [q, setQ] = useState("");
  const [roleF, setRoleF] = useState("all");
  const [confirmDel, setConfirmDel] = useState(false);
  if (!leader || !g) return <div><TopBar title="Group not found" /></div>;
  const fixed = g.id === "all";
  const people = [{ name: "@me", label: `${user.name} (you)`, roles: user.roles, color: T.pop, src: avatar }, ...TEAM.map((m) => ({ name: m.name, label: m.name, roles: m.roles, color: m.color, leader: m.leader }))];
  const shown = people.filter((p) => (roleF === "all" || p.roles.includes(roleF)) && p.label.toLowerCase().includes(q.toLowerCase()));
  const has = (n) => g.everyone || g.members.includes(n);
  const sys = (text) => setChat((c) => ({ ...c, [g.id]: [...(c[g.id] || []), { id: Date.now() + Math.random(), sys: true, text, t: nowHM() }] }));
  const upd = (patch) => setGroups((gs) => gs.map((x) => (x.id === g.id ? { ...x, ...patch } : x)));
  const display = (n) => (n === "@me" ? user.name : n);
  const toggle = (n) => {
    if (fixed) return;
    const on = g.members.includes(n);
    upd({ members: on ? g.members.filter((x) => x !== n) : [...g.members, n] });
    sys(on ? `${user.name} removed ${display(n)}` : `${user.name} added ${display(n)}`);
  };
  const addMany = (fn, label) => { const add = people.filter((p) => fn(p) && !g.members.includes(p.name)).map((p) => p.name); if (!add.length) return toast("Everyone is already in"); upd({ members: [...g.members, ...add] }); sys(`${user.name} added all ${label} (${add.length})`); };
  return (
    <div>
      <TopBar title={g.label} sub={fixed ? "Everyone is always in this group" : `${g.members.length} members`} />
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.sub, marginBottom: 6 }}>GROUP NAME</div>
        <input value={g.label} onChange={(e) => upd({ label: e.target.value })} style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.input, color: T.text, fontFamily: FONT, fontSize: 15, fontWeight: 700, outline: "none" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>{GROUP_EMOJI.map((e) => <button key={e} onClick={() => upd({ emoji: e })} style={{ width: 38, height: 38, borderRadius: 12, fontSize: 20, border: `1.5px solid ${g.emoji === e ? T.accent : T.border}`, background: g.emoji === e ? T.soft : "transparent", cursor: "pointer" }}>{e}</button>)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>Announcements only</div><div style={{ fontSize: 11.5, color: T.sub }}>Only leaders can send messages</div></div>
          <Toggle on={!!g.announce} onChange={(v) => { upd({ announce: v }); sys(v ? "Only leaders can post now 📣" : "Everyone can post again 💬"); }} />
        </div>
      </Card>
      {!fixed && (
        <>
          <SectionTitle>Quick add</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
            <Chip onClick={() => addMany((p) => p.roles.includes("singer"), "singers")}>+ All singers</Chip>
            <Chip onClick={() => addMany((p) => p.roles.some((r) => MUSICIAN_ROLES.includes(r)), "musicians")}>+ All musicians</Chip>
            <Chip onClick={() => addMany((p) => p.roles.includes("sound"), "sound team")}>+ Sound team</Chip>
            <Chip onClick={() => addMany((p) => p.leader || p.name === "@me", "leaders")}>+ Leaders</Chip>
          </div>
        </>
      )}
      <SectionTitle>Members</SectionTitle>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people…" style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.input, color: T.text, fontFamily: FONT, fontSize: 14, outline: "none", marginBottom: 8 }} />
      <Scroller style={{ marginBottom: 8 }}>{["all", ...ROLES.map((r) => r.id)].map((r) => <Chip key={r} active={roleF === r} onClick={() => setRoleF(r)}>{r === "all" ? "Everyone" : roleLabel(r)}</Chip>)}</Scroller>
      <Card pad={6}>
        {shown.map((p, i) => { const on = has(p.name); return (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 8px", borderTop: i ? `1px solid ${T.border}` : "none" }}>
            <Avatar name={display(p.name)} src={p.src} size={34} color={p.color} />
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{p.label}{p.leader ? " · Leader" : ""}</div><div style={{ fontSize: 11, color: T.sub, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.roles.map(roleLabel).join(" · ")}</div></div>
            {fixed ? <Check size={18} color={T.good} noBlob /> : <Btn small variant={on ? "soft" : "accent"} onClick={() => toggle(p.name)}>{on ? "Remove" : "Add"}</Btn>}
          </div>
        ); })}
        {!shown.length && <div style={{ padding: 14, fontSize: 12.5, color: T.sub, textAlign: "center" }}>No one matches</div>}
      </Card>
      {!fixed && (
        <div style={{ marginTop: 16 }}>
          {!confirmDel ? <Btn full variant="ghost" icon={Trash} onClick={() => setConfirmDel(true)}>Delete this group</Btn> : (
            <Card tone="soft"><div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Delete "{g.label}" and its messages for everyone?</div>
              <div style={{ display: "flex", gap: 8 }}><Btn full variant="ghost" onClick={() => setConfirmDel(false)}>Cancel</Btn><Btn full variant="accent" icon={Trash} onClick={() => { setGroups((gs) => gs.filter((x) => x.id !== g.id)); setChat((c) => { const n = { ...c }; delete n[g.id]; return n; }); toast("Group deleted"); pop(); }}>Delete</Btn></div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
