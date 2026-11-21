
/* ------------------------------ UI PRIMITIVES ------------------------------ */
const FONT = "'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif";
const SERIF = "'Fraunces', 'Playfair Display', Georgia, serif";
const GRAFF = "'Sedgwick Ave Display', 'Permanent Marker', cursive";
const MARKER = "'Permanent Marker', 'Poppins', cursive";
const headFont = (T) => (T.graffiti ? MARKER : T.serif ? SERIF : FONT);

function Card({ children, style, onClick, tone = "card", pad = 16 }) {
  const { T } = useApp();
  const bg = tone === "hero" ? (T.heroBg || T.hero) : tone === "soft" ? T.soft : tone === "accent" ? T.accent : tone === "card2" ? T.card2 : T.card;
  const g = T.graffiti;
  const color = tone === "hero" ? T.heroText : tone === "soft" ? T.softText : tone === "accent" ? T.accentText : T.text;
  return (
    <div onClick={onClick} className={onClick ? "bz-press" : ""}
      style={{
        background: bg, color, borderRadius: 24, padding: pad, position: "relative", overflow: "hidden", textShadow: g && tone === "hero" ? "0 1px 3px rgba(0,0,0,0.45)" : undefined,
        border: g ? (tone === "card" || tone === "card2" ? `1.5px solid ${T.border}` : tone === "soft" ? "1.5px solid rgba(34,228,255,0.35)" : "none") : tone === "card" && T.dark ? `1px solid ${T.border}` : "none",
        boxShadow: g ? (tone === "hero" ? "5px 6px 0 #0B0D10" : tone === "accent" ? "4px 4px 0 #0B0D10" : "none") : tone === "hero" ? "0 14px 30px -14px rgba(0,0,0,0.45)" : (T.dark ? "none" : "0 6px 18px -12px rgba(23,59,71,0.25)"),
        backdropFilter: T.id === "youth" ? "blur(6px)" : undefined, cursor: onClick ? "pointer" : "default", ...style
      }}>{children}</div>
  );
}

function Btn({ children, onClick, variant = "accent", small, icon: Icon, style, disabled, full }) {
  const { T } = useApp();
  const v = {
    accent: { background: T.accent, color: T.accentText },
    pop: { background: T.pop, color: T.popText },
    hero: { background: T.hero, color: T.heroText },
    ghost: { background: "transparent", color: "inherit", border: "1.5px solid currentColor", borderColor: "color-mix(in srgb, currentColor 28%, transparent)" },
    soft: { background: T.soft, color: T.softText },
    danger: { background: "transparent", color: T.bad, border: `1.5px solid ${T.bad}55` },
    light: { background: "rgba(255,255,255,0.92)", color: "#1F2D33" },
  }[variant];
  return (
    <button disabled={disabled} onClick={onClick} className="bz-press"
      style={{
        border: "none", borderRadius: 999, padding: small ? "8px 14px" : "13px 20px", fontFamily: FONT, fontWeight: 600,
        fontSize: small ? 12.5 : 14.5, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.45 : 1, width: full ? "100%" : undefined, whiteSpace: "normal", textAlign: "center", lineHeight: 1.25, maxWidth: "100%", minWidth: "auto", overflowWrap: "normal",
        boxShadow: T.graffiti && (variant === "accent" || variant === "pop") ? "3px 3px 0 #0B0D10" : "none", ...v, ...style
      }}>
      {Icon && <Icon size={small ? 15 : 18} strokeWidth={2.4} noBlob style={{ flexShrink: 0 }} />}{children != null && children !== false && <span>{children}</span>}
    </button>
  );
}

function Chip({ active, onClick, children, style }) {
  const { T } = useApp();
  return (
    <button onClick={onClick} className="bz-press" style={{
      border: active ? "none" : `1.5px solid ${T.border}`, background: active ? T.accent : T.card, color: active ? T.accentText : T.text,
      borderRadius: 999, padding: "7px 13px", fontFamily: FONT, fontSize: 12.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", ...style
    }}>{children}</button>
  );
}

function Seg({ options, value, onChange, style }) {
  const { T } = useApp();
  return (
    <div style={{ display: "flex", background: T.input, borderRadius: 999, padding: 4, gap: 2, ...style }}>
      {options.map((o) => {
        const val = typeof o === "object" ? o.value : o; const label = typeof o === "object" ? o.label : o;
        const on = val === value;
        return (
          <button key={String(val)} onClick={() => onChange(val)} style={{
            flex: 1, border: "none", borderRadius: 999, padding: "8px 6px", fontFamily: FONT, fontSize: 12.5, fontWeight: 600,
            background: on ? T.hero : "transparent", color: on ? T.heroText : T.sub, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap"
          }}>{label}</button>
        );
      })}
    </div>
  );
}

function Ring({ pct, size = 78, stroke = 8, color, track, children }) {
  const r = (size - stroke) / 2; const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track || "rgba(255,255,255,0.2)"} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0, Math.min(1, pct)))} style={{ transition: "stroke-dashoffset .6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontWeight: 700, fontSize: size * 0.2 }}>{children}</div>
    </div>
  );
}

function Bar({ pct, color, track, h = 7 }) {
  const { T } = useApp();
  return (
    <div style={{ height: h, borderRadius: 99, background: track || T.input, overflow: "hidden" }}>
      <div style={{ width: `${Math.round(Math.max(0, Math.min(1, pct)) * 100)}%`, height: "100%", borderRadius: 99, background: color || T.accent, transition: "width .5s" }} />
    </div>
  );
}

function Toggle({ on, onChange }) {
  const { T } = useApp();
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 46, height: 28, borderRadius: 99, border: "none", padding: 3, cursor: "pointer",
      background: on ? T.accent : T.input, transition: "background .2s", flexShrink: 0
    }}>
      <div style={{ width: 22, height: 22, borderRadius: 99, background: on ? T.accentText : (T.dark ? "#8b98a3" : "#fff"), transform: `translateX(${on ? 18 : 0}px)`, transition: "transform .2s", boxShadow: "0 1px 3px rgba(0,0,0,.25)" }} />
    </button>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, fmt }) {
  const { T } = useApp();
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
        <span style={{ color: "inherit", opacity: 0.78, fontWeight: 500 }}>{label}</span><span style={{ fontWeight: 700 }}>{fmt ? fmt(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="bz-range" style={{ width: "100%", accentColor: T.accent }} />
    </div>
  );
}

function SectionTitle({ children, action, onAction, style }) {
  const { T } = useApp();
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "22px 2px 12px", ...style }}>
      <h3 style={{ margin: 0, fontSize: T.graffiti ? 20 : 17.5, fontWeight: T.graffiti ? 400 : 700, letterSpacing: T.graffiti ? 0.3 : -0.2, fontFamily: T.graffiti ? MARKER : FONT, position: "relative" }}>
        {children}
        {T.graffiti && <svg width="70%" height="8" viewBox="0 0 100 8" preserveAspectRatio="none" style={{ position: "absolute", left: 0, bottom: -6 }}><path d="M2 5 C 25 1, 55 8, 98 3" stroke={T.accent} strokeWidth="3" fill="none" strokeLinecap="round" /></svg>}
      </h3>
      {action && <button onClick={onAction} style={{ border: "none", background: "none", color: T.sub, fontFamily: FONT, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>{action}</button>}
    </div>
  );
}

function TopBar({ title, sub, onBack, right }) {
  const { T, pop } = useApp();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0 14px" }}>
      {onBack !== false && <button onClick={onBack || pop} className="bz-press" style={{ width: 40, height: 40, borderRadius: 14, border: `1.5px solid ${T.border}`, background: T.card, color: T.text, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
        <ChevronLeft size={20} />
      </button>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: T.graffiti ? 400 : 700, fontFamily: T.graffiti ? MARKER : FONT, fontSize: T.graffiti ? 19 : 17, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: T.sub }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function IconBubble({ icon: Icon, tone = "soft", size = 44, custom }) {
  const { T } = useApp();
  const bg = tone === "hero" ? T.hero : tone === "accent" ? T.accent : tone === "pop" ? T.pop : T.soft;
  const fg = tone === "hero" ? T.heroText : tone === "accent" ? T.accentText : tone === "pop" ? T.popText : T.softText;
  return <div style={{ width: size, height: size, borderRadius: size * 0.34, background: bg, color: fg, display: "grid", placeItems: "center", flexShrink: 0 }}>{custom || <Icon size={size * 0.46} strokeWidth={2.2} />}</div>;
}

const hexLum = (c) => { const m = /^#?([0-9a-f]{6})$/i.exec(c || ""); if (!m) return 0.3; const n = parseInt(m[1], 16); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255); };
/* make a brand/role colour readable as TEXT on the current theme's cards */
const ink = (T, c) => { const m = /^#?([0-9a-f]{6})$/i.exec(c || ""); if (!m) return c; let n = parseInt(m[1], 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const bgL = T.dark ? 0.12 : 0.9; for (let i = 0; i < 14; i++) { const L = hexLum("#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)); if ((Math.max(L, bgL) + 0.05) / (Math.min(L, bgL) + 0.05) >= 4.5) break; if (T.dark) { r = Math.round(r + (255 - r) * 0.2); g = Math.round(g + (255 - g) * 0.2); b = Math.round(b + (255 - b) * 0.2); } else { r = Math.round(r * 0.85); g = Math.round(g * 0.85); b = Math.round(b * 0.85); } } return `rgb(${r},${g},${b})`; };
function Avatar({ name = "?", src, size = 40, color = "#F5A94C", ring }) {
  const initials = name.split(" ").map((s) => s[0]).join("").slice(0, size < 34 ? 1 : 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: 999, flexShrink: 0, background: src ? `url(${src}) center/cover` : color, color: hexLum(color) > 0.3 ? "#1B1F24" : "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: size * 0.36, boxShadow: ring ? `0 0 0 3px ${ring}` : "none" }}>
      {!src && initials}
    </div>
  );
}

function Sheet({ open, onClose, children, title }) {
  const { T, host, web } = useApp();
  if (!open || !host) return null;
  return createPortal(
    <div style={{ position: "absolute", inset: 0, zIndex: 60, display: "flex", flexDirection: "column", justifyContent: web ? "center" : "flex-end", alignItems: web ? "center" : "stretch" }}>
      <div onClick={onClose} className="bz-fade" style={{ position: "absolute", inset: 0, background: "rgba(10,16,20,0.45)" }} />
      <div className="bz-up" style={{ position: "relative", background: T.sheet || T.card, color: T.text, borderRadius: web ? 28 : "28px 28px 0 0", padding: "10px 18px 26px", maxHeight: "86%", overflowY: "auto", width: web ? 520 : undefined, maxWidth: web ? "92%" : undefined }}>
        <div style={{ width: 42, height: 5, borderRadius: 9, background: T.faint, margin: "0 auto 14px" }} />
        {title && <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>{title}</div>}
        {children}
      </div>
    </div>, host
  );
}

function MarkComplete({ id, label, mins = 5 }) {
  const { logPractice } = useApp();
  const [done, setDone] = useState(false);
  return (
    <div style={{ marginTop: 22 }}>
      <Btn full variant={done ? "soft" : "accent"} icon={done ? Check : Award} onClick={() => { if (!done) { logPractice(mins, label || id); setDone(true); } }}>
        {done ? `Logged · +${mins} min` : `I practised this · log ${mins} min`}
      </Btn>
    </div>
  );
}

/* ------------------------------ BRAND + ILLUSTRATIONS ------------------------------ */
function BezaLogo({ size = 44, width, color }) {
  const { T } = useApp();
  const w = width || size * 2.4;
  return <img alt="Beza Youth" src="assets/logo-white.png" draggable={false} style={{ width: w, height: "auto", display: "block", filter: T.dark || color === "#fff" || color === "#FFFFFF" ? "none" : "invert(1) brightness(0.25)" }} />;
}
function LogoLockup({ width = 240, tag = true, center }) {
  const { T } = useApp();
  return (
    <div style={{ display: "flex", justifyContent: center ? "center" : "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width }}>
        <BezaLogo width={width} />
        {tag && <div style={{ fontFamily: GRAFF, fontSize: width * 0.115, lineHeight: 1, marginTop: width * 0.02, color: T.graffiti ? T.accent : T.text, letterSpacing: 1, textAlign: "center", textShadow: T.graffiti ? "2px 2px 0 #FF3EA5" : "none" }}>Worship Team</div>}
      </div>
    </div>
  );
}

function WavyWords({ words = ["WORSHIP", "WORSHIP", "WORSHIP"], width = 300, colors }) {
  const { T } = useApp();
  const cols = colors || [T.accent, "#FFFFFF", "#FFFFFF"];
  const h = 150;
  return (
    <svg viewBox={`0 0 300 ${h}`} width={width} style={{ display: "block", overflow: "visible" }}>
      <defs>
        {[0, 1, 2].map((i) => (
          <path key={i} id={`wv${i}`} d={`M8,${46 + i * 40} C 80,${16 + i * 40} 150,${78 + i * 40} 292,${34 + i * 40}`} />
        ))}
      </defs>
      {words.map((w, i) => (
        <text key={i} fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="43" letterSpacing="1" fill={cols[i] || "#fff"}>
          <textPath href={`#wv${i}`} startOffset="0">{w}</textPath>
        </text>
      ))}
    </svg>
  );
}

function Doodle({ kind, w = 110, h = 80 }) {
  const { T } = useApp();
  const skin = "#C98B5E", shirt = T.id === "light" ? "#F5A94C" : T.pop, dark = T.id === "youth" ? "#2E3A46" : "#1F4D5C", line = T.id === "youth" ? "#fff" : "#1F4D5C";
  const common = { width: w, height: h, viewBox: "0 0 110 80" };
  if (kind === "mic") return (
    <svg {...common}><circle cx="34" cy="26" r="11" fill={skin} /><path d="M20 38 C14 40 12 52 12 80 H58 C58 54 54 40 46 38 Z" fill={shirt} />
      <path d="M26 20 C28 12 44 12 44 22" fill={dark} /><rect x="58" y="22" width="9" height="16" rx="4.5" fill={dark} /><path d="M62 38 V58" stroke={line} strokeWidth="2.5" />
      <path d="M44 44 C52 44 56 36 58 32" stroke={skin} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M76 18 q6 4 0 8 M82 13 q10 9 0 18" stroke={line} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="94" cy="54" r="5" fill={T.accent} /><path d="M99 54 V36 L106 40" stroke={line} strokeWidth="2" fill="none" /></svg>
  );
  if (kind === "guitar") return (
    <svg {...common}><ellipse cx="44" cy="54" rx="20" ry="16" fill={shirt} /><ellipse cx="60" cy="46" rx="14" ry="11" fill={shirt} /><circle cx="52" cy="50" r="5" fill={dark} />
      <rect x="66" y="22" width="34" height="6" rx="3" transform="rotate(-24 66 22)" fill={dark} /><rect x="94" y="6" width="10" height="10" rx="3" fill={dark} />
      <path d="M30 52 L88 26" stroke={line} strokeWidth="1.2" /><path d="M30 56 L88 30" stroke={line} strokeWidth="1.2" /></svg>
  );
  if (kind === "faders") return (
    <svg {...common}><rect x="8" y="14" width="94" height="58" rx="10" fill={dark} />
      {[0, 1, 2, 3, 4].map((i) => (<g key={i}><rect x={20 + i * 17} y="22" width="3" height="42" rx="1.5" fill="rgba(255,255,255,.35)" /><rect x={15 + i * 17} y={[44, 30, 50, 36, 26][i]} width="13" height="9" rx="3" fill={i === 1 ? T.accent : shirt} /></g>))}</svg>
  );
  if (kind === "drum") return (
    <svg {...common}><ellipse cx="55" cy="50" rx="30" ry="9" fill={dark} /><rect x="25" y="50" width="60" height="22" fill={shirt} /><ellipse cx="55" cy="72" rx="30" ry="9" fill={shirt} />
      <ellipse cx="55" cy="50" rx="28" ry="7.5" fill="#F4EFE9" /><path d="M26 14 L50 46" stroke={dark} strokeWidth="4" strokeLinecap="round" /><path d="M88 12 L64 44" stroke={dark} strokeWidth="4" strokeLinecap="round" /></svg>
  );
  return (
    <svg {...common}><rect x="6" y="30" width="98" height="40" rx="8" fill={dark} />
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={12 + i * 10} y="36" width="9" height="30" rx="2" fill="#fff" />)}
      {[0, 1, 3, 4, 5, 7].map((i) => <rect key={i} x={18 + i * 10} y="36" width="6" height="18" rx="1.5" fill={dark} />)}
      <circle cx="80" cy="14" r="6" fill={T.accent} /><path d="M86 14 V2 L96 6" stroke={line} strokeWidth="2" fill="none" /></svg>
  );
}

/* ------------------------------ INSTRUMENT VIEWS ------------------------------ */
function Piano({ start = 48, octaves = 2, highlight = [], roots = [], labels = true, onNote, height = 120, pcKeys = false, showOctaveCtl = false }) {
  const { T, settings } = useApp();
  const [shift, setShift] = useState(0);
  const [pressed, setPressed] = useState(null);
  const [lit, setLit] = useState(() => new Set());
  /* light up and press down every key the app plays, so learners SEE the notes too */
  useEffect(() => { const tms = []; const off = AE.onNote((ev) => { if (!ev) { tms.forEach(clearTimeout); setLit(new Set()); return; } const m = ev.midi;
    tms.push(setTimeout(() => setLit((s) => { const n = new Set(s); n.add(m); return n; }), Math.max(0, ev.when * 1000)));
    tms.push(setTimeout(() => setLit((s) => { if (!s.has(m)) return s; const n = new Set(s); n.delete(m); return n; }), Math.max(120, (ev.when + Math.min(ev.dur, 1.2)) * 1000))); });
    return () => { off(); tms.forEach(clearTimeout); }; }, []);
  const s0 = start + shift * 12;
  const hl = new Set(highlight); const rt = new Set(roots);
  const total = octaves * 12 + 1; const keys = Array.from({ length: total }, (_, i) => s0 + i);
  const whites = keys.filter((m) => ![1, 3, 6, 8, 10].includes(m % 12));
  const wW = 100 / whites.length;
  const play = (m) => { AE.tone(m, 0.9); setPressed(m); setTimeout(() => setPressed((p) => (p === m ? null : p)), 180); onNote && onNote(m); };
  usePcKeyboard(pcKeys && settings.pcKeys, s0, play);
  useMidiNotes((n) => { if (pcKeys) { setPressed(n); setTimeout(() => setPressed((p) => (p === n ? null : p)), 180); onNote && onNote(n); AE.tone(n, 0.9); } });
  return (
    <div>
      {showOctaveCtl && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 11.5, color: T.sub }}>
          <span><Keyboard size={13} style={{ verticalAlign: -2 }} /> PC keys A–; · MIDI ready</span>
          <span style={{ display: "flex", gap: 6 }}>
            <Chip onClick={() => setShift((s) => Math.max(-2, s - 1))} style={{ padding: "4px 10px" }}>− Oct</Chip>
            <Chip onClick={() => setShift((s) => Math.min(2, s + 1))} style={{ padding: "4px 10px" }}>Oct +</Chip>
          </span>
        </div>
      )}
      <div style={{ position: "relative", height, borderRadius: 14, overflow: "hidden", background: T.keyB, padding: 3, touchAction: "none" }}>
        <div style={{ position: "relative", height: "100%" }}>
          {whites.map((m, i) => {
            const down = lit.has(m) || pressed === m; const on = hl.has(m) || down; const isRoot = rt.has(m);
            return (
              <div key={m} onPointerDown={(e) => { e.preventDefault(); play(m); }} style={{
                position: "absolute", left: `${i * wW}%`, width: `calc(${wW}% - 2px)`, top: down ? 3 : 0, bottom: 0, borderRadius: "0 0 8px 8px", boxShadow: down ? "inset 0 4px 10px rgba(0,0,0,0.35), 0 0 14px rgba(198,255,61,0.6)" : "none", transition: "background .08s, top .06s",
                background: down ? "#C6FF3D" : on ? (isRoot ? T.pop : T.accent) : T.keyW, cursor: "pointer", display: "flex", alignItems: "flex-end", justifyContent: "center",
                paddingBottom: 6, fontSize: 9.5, fontWeight: 700, color: on ? (isRoot ? T.popText : T.accentText) : "#55626A"
              }}>{labels && (on || m % 12 === 0) ? nn(m) + (m % 12 === 0 && !on ? Math.floor(m / 12) - 1 : "") : ""}</div>
            );
          })}
          {keys.map((m) => {
            if (![1, 3, 6, 8, 10].includes(m % 12)) return null;
            const wi = whites.filter((w) => w < m).length; const down = lit.has(m) || pressed === m; const on = hl.has(m) || down; const isRoot = rt.has(m);
            return (
              <div key={m} onPointerDown={(e) => { e.preventDefault(); play(m); }} style={{
                position: "absolute", left: `calc(${wi * wW}% - ${wW * 0.32}%)`, width: `${wW * 0.62}%`, top: down ? 2 : 0, height: "60%", zIndex: 2, boxShadow: down ? "0 0 12px rgba(198,255,61,0.8)" : "none", transition: "background .08s, top .06s",
                borderRadius: "0 0 6px 6px", background: down ? "#9BE01F" : on ? (isRoot ? T.pop : T.accent) : "#1b2126", border: "1px solid #000", cursor: "pointer",
                display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, fontSize: 8, fontWeight: 700, color: on ? T.accentText : "transparent"
              }}>{labels && on ? nn(m) : ""}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Fretboard({ tuning = GUITAR_TUNING, pcs = [], rootPc = null, frets = 12, labelMode = "note", highlightFrets }) {
  const { T } = useApp();
  const W = 340, H = tuning.length * 22 + 26, x0 = 36, fw = (W - x0 - 6) / frets;
  const pcSet = new Set(pcs.map((p) => ((p % 12) + 12) % 12));
  const strings = [...tuning].reverse();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      <rect x={x0} y={8} width={W - x0 - 6} height={H - 24} rx={4} fill={T.dark ? "#2a2018" : "#E9D8C2"} />
      {Array.from({ length: frets + 1 }).map((_, f) => (
        <line key={f} x1={x0 + f * fw} x2={x0 + f * fw} y1={8} y2={H - 16} stroke={f === 0 ? (T.dark ? "#ddd" : "#333") : (T.dark ? "#8d7c6a" : "#a89580")} strokeWidth={f === 0 ? 4 : 1.4} />
      ))}
      {[3, 5, 7, 9, 12].filter((f) => f <= frets).map((f) => (
        <circle key={f} cx={x0 + (f - 0.5) * fw} cy={H - 8} r={2.6} fill={T.sub} />
      ))}
      {strings.map((open, si) => {
        const y = 8 + 11 + si * 22;
        return (
          <g key={si}>
            <line x1={x0} x2={W - 6} y1={y} y2={y} stroke={T.dark ? "#cfc6bb" : "#6d655c"} strokeWidth={0.8 + (strings.length - si) * 0.25} />
            <text x={4} y={y + 4} fontSize={10} fontWeight={700} fill={T.sub}>{nn(open)}</text>
            {Array.from({ length: frets + 1 }).map((_, f) => {
              const m = open + f; const pc = m % 12; if (!pcSet.has(pc)) return null;
              const strIndex = strings.length - 1 - si;
              if (highlightFrets && highlightFrets[strIndex] !== f) return null;
              const isRoot = pc === rootPc; const cx = f === 0 ? x0 - 11 : x0 + (f - 0.5) * fw;
              return (
                <g key={f} style={{ cursor: "pointer" }} onClick={() => AE.play(tuning.length === 4 ? "bass" : "acoustic", m, 1)}>
                  <circle cx={cx} cy={y} r={8.5} fill={isRoot ? T.pop : T.accent} stroke={T.dark ? "#0006" : "#fff"} strokeWidth={1.2} />
                  <text x={cx} y={y + 3.4} fontSize={8.5} fontWeight={800} textAnchor="middle" fill={isRoot ? T.popText : T.accentText}>
                    {labelMode === "note" ? nn(m) : DEG_LABEL[((pc - rootPc) % 12 + 12) % 12].split("/")[0]}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

const FINGER_NAMES = { 1: "index", 2: "middle", 3: "ring", 4: "pinky" };
const STRING_NAMES = ["Low E (6th)", "A (5th)", "D (4th)", "G (3rd)", "B (2nd)", "High e (1st)"];
function fingerChord(frets) {
  const fr = frets.map((f, s) => ({ f, s })).filter((x) => x.f > 0); const fingers = frets.map(() => null);
  if (!fr.length) return { fingers, barre: null };
  const minF = Math.min(...fr.map((x) => x.f)); const atMin = fr.filter((x) => x.f === minF);
  let barre = null; let rest = fr; let finger = 0;
  if (atMin.length >= 2 && fr.length > 4) { const from = Math.min(...atMin.map((x) => x.s)); let ok = true; for (let k = from; k < 6; k++) if (frets[k] < minF) ok = false; if (ok) { barre = { fret: minF, from }; for (let k = from; k < 6; k++) if (frets[k] === minF) fingers[k] = 1; rest = fr.filter((x) => fingers[x.s] == null); finger = 1; } }
  rest.sort((x, y) => x.f - y.f || x.s - y.s);
  const groups = {}; rest.forEach((x) => (groups[x.f] = groups[x.f] || []).push(x));
  Object.keys(groups).map(Number).sort((x, y) => x - y).forEach((f) => { const g = groups[f]; const ideal = f - minF + 1; if (barre && g.length >= 3) { finger = Math.min(4, Math.max(finger + 1, ideal)); g.forEach((x) => (fingers[x.s] = finger)); } else g.forEach((x) => { finger = Math.min(4, Math.max(finger + 1, ideal)); fingers[x.s] = finger; }); });
  return { fingers, barre };
}
const fingerGuide = (frets, capo = 0) => { const { fingers, barre } = fingerChord(frets); return frets.map((f, s) => ({ s: STRING_NAMES[s], txt: f < 0 ? "don't play (mute)" : f === 0 ? (capo ? `open (capo ${capo})` : "open") : `${f}${["th", "st", "nd", "rd"][f % 10 > 3 || [11, 12, 13].includes(f) ? 0 : f % 10]} fret${capo ? " behind capo" : ""} · ${FINGER_NAMES[fingers[s]] || ""} finger (${fingers[s]})${barre && fingers[s] === 1 && f === barre.fret ? " — barre" : ""}` })).reverse(); };
function ChordBox({ frets, name, capo = 0, width = 120, fingers: showF = true }) {
  const { T } = useApp();
  const played = frets.filter((f) => f > 0); const minF = played.length ? Math.min(...played) : 1;
  const base = Math.max(...frets) <= 4 ? 1 : minF; const rows = 5, W = 120, H = 156, x0 = 18, y0 = 40, sw = (W - 2 * x0) / 5, fh = (H - y0 - 10) / rows;
  const { fingers, barre } = fingerChord(frets);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={width} style={{ flexShrink: 0 }}>
      <text x={W / 2} y={12} textAnchor="middle" fontSize={12} fontWeight={800} fill={T.text}>{name}</text>
      {capo > 0 && <text x={W / 2} y={25} textAnchor="middle" fontSize={8.5} fontWeight={800} fill={T.pop || T.accent}>CAPO {capo}</text>}
      {base > 1 && <text x={2} y={y0 + fh * 0.65} fontSize={9} fontWeight={700} fill={T.sub}>{base}fr</text>}
      <line x1={x0} x2={W - x0} y1={y0} y2={y0} stroke={capo ? (T.pop || T.accent) : T.text} strokeWidth={base === 1 ? 4 : 1.2} />
      {Array.from({ length: rows }).map((_, r) => <line key={r} x1={x0} x2={W - x0} y1={y0 + (r + 1) * fh} y2={y0 + (r + 1) * fh} stroke={T.sub} strokeWidth={1} />)}
      {Array.from({ length: 6 }).map((_, s) => <line key={s} x1={x0 + s * sw} x2={x0 + s * sw} y1={y0} y2={y0 + rows * fh} stroke={T.sub} strokeWidth={1} />)}
      {barre && <rect x={x0 + barre.from * sw - 7} y={y0 + (barre.fret - base + 0.5) * fh - 7} width={(5 - barre.from) * sw + 14} height={14} rx={7} fill={T.text} />}
      {frets.map((f, s) => {
        const x = x0 + s * sw;
        if (f === -1) return <text key={s} x={x} y={y0 - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill={T.sub}>×</text>;
        if (f === 0) return <circle key={s} cx={x} cy={y0 - 8} r={3.5} fill="none" stroke={T.text} strokeWidth={1.4} />;
        const row = f - base; const cy = y0 + (row + 0.5) * fh; const inBarre = barre && f === barre.fret && s >= barre.from;
        return <g key={s}>{!inBarre && <circle cx={x} cy={cy} r={7} fill={T.text} />}{showF && fingers[s] && (!inBarre || s === barre.from) && <text x={x} y={cy + 3.4} textAnchor="middle" fontSize={9.5} fontWeight={900} fill={T.bg}>{fingers[s]}</text>}</g>;
      })}
    </svg>
  );
}

/* scroll the nearest scrolling layer back to the top (so a selected item's player is visible) */
function scrollUp(e) { let p = e && e.currentTarget; while (p && p !== document.body) { const st = getComputedStyle(p); if (/(auto|scroll)/.test(st.overflowY) && p.scrollHeight > p.clientHeight) { p.scrollTo({ top: 0, behavior: "smooth" }); return; } p = p.parentElement; } }
