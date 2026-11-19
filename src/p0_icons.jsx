import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import EMOJI_GROUPS from "../assets/emoji.json";

/* =====================================================================
   BEZA YOUTH WORSHIP TEAM — custom hand-drawn icon set (no stock icons)
   Each icon = a spray-paint blob behind + a bold marker drawing on top.
   ===================================================================== */
const BLOBS = [
  "M4.5 8.5C5.6 4.8 10 3.6 13.6 4.6s6.6 4.1 5.8 8.2-4.7 7.4-9 6.8-6.9-4.3-5.9-11.1z",
  "M7 5.5c3.3-2.5 9-1.4 11.2 2.2 2.3 3.7.4 9.6-3.8 10.8-4.2 1.2-9.8-.8-10.6-4.9C3 9.5 4.6 7.3 7 5.5z",
  "M5 13c-1-3.8 1.4-8.3 5.6-8.8 4.2-.6 8.6 2 8.9 6 .3 4-2.8 8.4-7 8.6C8.4 19 5.8 16.6 5 13z",
];
function mkIcon(draw, blob = 0, opts = {}) {
  const C = ({ size = 20, strokeWidth, fill, style, color, blobColor, noBlob, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth={strokeWidth || opts.sw || 2.2}
      strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, overflow: "visible", ...style }} className={className}>
      {!noBlob && blob >= 0 && <path d={BLOBS[blob]} transform="translate(1.6 1.4)" fill={blobColor || "var(--ico-blob, #FF3EA5)"} fillOpacity={0.55} stroke="none" />}
      {typeof draw === "function" ? draw(fill) : draw}
    </svg>
  );
  return C;
}
const P = (d, extra) => <path d={d} {...extra} />;

const Home = mkIcon(<>{P("M3.5 11.2 12 4l8.5 7.2")}{P("M6 9.6v9.9h12V9.6")}{P("M12 10.8v6.4M9.4 13.1h5.2", { strokeWidth: 2.6 })}</>, 0);
const BookOpen = mkIcon(<>{P("M12 6.5c-2-1.6-5-2-8-1.4v12.4c3-.6 6-.2 8 1.4 2-1.6 5-2 8-1.4V5.1c-3-.6-6-.2-8 1.4z")}{P("M12 6.5v12.4")}{P("M6.5 9h3M6.5 12h3M14.5 9h3", { strokeWidth: 1.6 })}</>, 1);
const MessageCircle = mkIcon(<>{P("M4 11.5C4 7.4 7.6 4.5 12 4.5s8 2.9 8 7-3.6 7-8 7c-1 0-2-.1-2.9-.4L5 19.5l1.2-3.4C4.8 14.9 4 13.3 4 11.5z")}{P("M8.6 11.6h.01M12 11.6h.01M15.4 11.6h.01", { strokeWidth: 3 })}</>, 2);
const User = mkIcon(<>{P("M12 12a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2z")}{P("M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6")}</>, 1);
const Plus = mkIcon(<>{P("M12 5v14M5 12h14", { strokeWidth: 2.8 })}</>, -1);
const Bell = mkIcon(<>{P("M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z")}{P("M10 20.5a2.2 2.2 0 0 0 4 0")}</>, 2);
const Settings = mkIcon(<>{P("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z")}{P("M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z")}{P("M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7")}</>, 0);
const ChevronLeft = mkIcon(<>{P("M14.5 5.5 8 12l6.5 6.5", { strokeWidth: 2.8 })}</>, -1);
const ChevronRight = mkIcon(<>{P("M9.5 5.5 16 12l-6.5 6.5", { strokeWidth: 2.8 })}</>, -1);
const ChevronDown = mkIcon(<>{P("M5.5 9.5 12 16l6.5-6.5", { strokeWidth: 2.8 })}</>, -1);
const Play = mkIcon((f) => P("M8 5.2v13.6c0 .7.8 1.1 1.4.7l10-6.8c.5-.4.5-1.1 0-1.4l-10-6.8C8.8 4.1 8 4.5 8 5.2z", { fill: f || "currentColor" }), -1);
const Pause = mkIcon(<>{P("M8.5 5.5v13M15.5 5.5v13", { strokeWidth: 3.6 })}</>, -1);
const Square = mkIcon(<rect x="6.2" y="6.2" width="11.6" height="11.6" rx="2.6" fill="currentColor" />, -1);
const Mic = mkIcon(<>{P("M12 3.5a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0v-5a3 3 0 0 0-3-3z")}{P("M6 11a6 6 0 0 0 12 0M12 17v3.5M9 20.5h6")}</>, 1);
const Music = mkIcon(<>{P("M9 18V6l10-2v12")}{P("M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM19 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z", { fill: "currentColor" })}</>, 0);
const Sliders = mkIcon(<>{P("M6 4v16M12 4v16M18 4v16", { strokeWidth: 1.8 })}{P("M4 14.5h4M10 8.5h4M16 16.5h4", { strokeWidth: 3.4 })}</>, 2);
const Headphones = mkIcon(<>{P("M4 15v-3a8 8 0 0 1 16 0v3")}{P("M4 15h3v5H5a1 1 0 0 1-1-1zM20 15h-3v5h2a1 1 0 0 0 1-1z", { fill: "currentColor" })}</>, 1);
const Lock = mkIcon(<>{P("M6 11h12v9H6z")}{P("M8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 14.5v2")}</>, 0);
const Check = mkIcon(<>{P("M5 12.5l4.2 4.2L19 7", { strokeWidth: 3 })}</>, -1);
const X = mkIcon(<>{P("M6 6l12 12M18 6 6 18", { strokeWidth: 2.8 })}</>, -1);
const Send = mkIcon(<>{P("M4 11.5 20 4l-5.5 16-3.2-6.8z")}{P("M11.3 13.2 20 4")}</>, -1);
const Paperclip = mkIcon(<>{P("M16.5 8.5 9.3 15.7a2 2 0 0 1-2.8-2.8l7.6-7.6a3.6 3.6 0 0 1 5.1 5.1l-7.9 7.9a5.2 5.2 0 0 1-7.4-7.4L11 3.9")}</>, -1);
const Smile = mkIcon(<>{P("M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z")}{P("M8.5 14.2c1 1.3 2.2 1.9 3.5 1.9s2.5-.6 3.5-1.9")}{P("M9 9.5h.01M15 9.5h.01", { strokeWidth: 3.2 })}</>, -1);
const Sparkles = mkIcon(<>{P("M11 3c.6 3.8 2.2 5.4 6 6-3.8.6-5.4 2.2-6 6-.6-3.8-2.2-5.4-6-6 3.8-.6 5.4-2.2 6-6z", { fill: "currentColor" })}{P("M18.5 14.5c.3 1.6 1 2.3 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5z")}</>, 2);
const Flame = mkIcon(<>{P("M12 21c-3.6 0-6-2.4-6-5.6 0-3.4 2.6-5 3.4-8.4 1.6 1.2 2.4 2.8 2.4 4.4 1-.6 1.6-1.8 1.8-3.2 2 1.6 4.4 4 4.4 7.2 0 3.2-2.4 5.6-6 5.6z")}{P("M12 18.5c-1.2 0-2-.8-2-1.9 0-1.1.9-1.7 1.4-2.8.9.7 2.6 1.6 2.6 2.9 0 1-.8 1.8-2 1.8z", { fill: "currentColor" })}</>, 0);
const Clock = mkIcon(<>{P("M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z")}{P("M12 7.5V12l3 2")}</>, 1);
const Trophy = mkIcon(<>{P("M7.5 4.5h9v4a4.5 4.5 0 0 1-9 0z")}{P("M7.5 6H4.5c0 2.5 1.2 4 3.3 4.3M16.5 6h3c0 2.5-1.2 4-3.3 4.3M12 13v3.5M8.5 20h7l-.8-3.5h-5.4z")}</>, 2);
const Users = mkIcon(<>{P("M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8")}{P("M16 11a2.6 2.6 0 1 0 0-5.2M17.5 14.4c1.7.5 2.8 2 3.1 4.4")}</>, 1);
const Shield = mkIcon(<>{P("M12 3.5 19 6v5.5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z")}{P("M12 8v7M9.2 10.6h5.6", { strokeWidth: 2.4 })}</>, 0);
const Moon = mkIcon(<>{P("M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z")}</>, 2);
const Sun = mkIcon(<>{P("M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z")}{P("M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4")}</>, 0);
const Globe = mkIcon(<>{P("M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z")}{P("M3.5 12h17M12 3.5c2.4 2.4 3.4 5.2 3.4 8.5s-1 6.1-3.4 8.5c-2.4-2.4-3.4-5.2-3.4-8.5s1-6.1 3.4-8.5z")}</>, 1);
const LogOut = mkIcon(<>{P("M14 4.5H6.5v15H14")}{P("M10.5 12H20M16.5 8.5 20 12l-3.5 3.5")}</>, -1);
const Volume2 = mkIcon(<>{P("M4 9.5h3.5L12 5.5v13l-4.5-4H4z", { fill: "currentColor" })}{P("M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11")}</>, 2);
const Activity = mkIcon(<>{P("M3 12h4l2.5-6 5 12 2.5-6h4")}</>, 1);
const Timer = mkIcon(<>{P("M12 21a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z")}{P("M12 13.5V9.5M10 2.8h4M18.5 6.5l1.3-1.3")}</>, 0);
const Wind = mkIcon(<>{P("M3 9h11.5a2.8 2.8 0 1 0-2.8-2.8M3 14.5h15a2.8 2.8 0 1 1-2.8 2.8M3 12h7")}</>, 2);
const Heart = mkIcon((f) => P("M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z", { fill: f || "none" }), 1);
const Star = mkIcon(<>{P("M12 3.8l2.5 5.2 5.6.7-4.1 3.9 1 5.6L12 16.5l-5 2.7 1-5.6-4.1-3.9 5.6-.7z")}</>, 0);
const Keyboard = mkIcon(<>{P("M3 6.5h18v11H3z")}{P("M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01", { strokeWidth: 2.8 })}{P("M7 14h10")}</>, 2);
const RefreshCw = mkIcon(<>{P("M19.5 12a7.5 7.5 0 0 1-13.2 4.8M4.5 12A7.5 7.5 0 0 1 17.7 7.2")}{P("M17.8 3.5v3.8H14M6.2 20.5v-3.8H10")}</>, -1);
const Camera = mkIcon(<>{P("M4 8h3.5l1.8-2.5h5.4L16.5 8H20v11H4z")}{P("M12 16.6a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6z")}</>, -1);
const FileText = mkIcon(<>{P("M7 3.5h7l4 4v13H7z")}{P("M14 3.5v4h4M9.5 12.5h6M9.5 16h6")}</>, 1);
const Zap = mkIcon(<>{P("M13 3 5.5 13.5H12L11 21l7.5-10.5H12z", { fill: "currentColor" })}</>, 2);
const Target = mkIcon(<>{P("M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z")}{P("M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z")}{P("M12 12h.01", { strokeWidth: 4 })}</>, 0);
const Award = mkIcon(<>{P("M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10z")}{P("M8.8 13.3 7.5 21l4.5-2.5 4.5 2.5-1.3-7.7")}</>, 1);
const TrendingUp = mkIcon(<>{P("M3.5 17l5.5-5.5 4 4L20.5 8M15 8h5.5v5.5")}</>, 2);
const Repeat = mkIcon(<>{P("M17 3.5l3 3-3 3M4 11.5v-1a4 4 0 0 1 4-4h12M7 20.5l-3-3 3-3M20 12.5v1a4 4 0 0 1-4 4H4")}</>, -1);
const SkipForward = mkIcon(<>{P("M5.5 5.5v13l9-6.5z", { fill: "currentColor" })}{P("M18.5 5.5v13", { strokeWidth: 3 })}</>, -1);
const SkipBack = mkIcon(<>{P("M18.5 5.5v13l-9-6.5z", { fill: "currentColor" })}{P("M5.5 5.5v13", { strokeWidth: 3 })}</>, -1);
const Info = mkIcon(<>{P("M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z")}{P("M12 11v5.5M12 7.8h.01", { strokeWidth: 2.6 })}</>, 2);
const Calendar = mkIcon(<>{P("M4 6h16v14H4z")}{P("M4 10h16M8.5 3.5v4M15.5 3.5v4")}{P("M8 14h.01M12 14h.01M16 14h.01", { strokeWidth: 2.8 })}</>, 1);
const Megaphone = mkIcon(<>{P("M4 10v4h3l9 5V5L7 10z")}{P("M7 14l1.5 5.5h2.5L10 15.3M19 9.5a3 3 0 0 1 0 5")}</>, 0);
const Download = mkIcon(<>{P("M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14")}</>, -1);
const Upload = mkIcon(<>{P("M12 15.5v-11M7.5 9 12 4.5 16.5 9M5 19.5h14")}</>, 2);
const Radio = mkIcon(<>{P("M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8M8.5 8.5a4.9 4.9 0 0 0 0 7M15.5 8.5a4.9 4.9 0 0 1 0 7")}{P("M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", { fill: "currentColor" })}</>, -1);
const Dumbbell = mkIcon(<>{P("M3.5 9.5v5M6.5 7v10M17.5 7v10M20.5 9.5v5", { strokeWidth: 2.8 })}{P("M6.5 12h11")}</>, 1);
const BarChart = mkIcon(<>{P("M5 20v-6M10 20V9M15 20v-4M20 20V5", { strokeWidth: 3 })}{P("M3 20.8h18", { strokeWidth: 1.6 })}</>, 0);
const Guitar = mkIcon(<>{P("M14.2 9.8 19.5 4.5M17.6 2.8l3.6 3.6")}{P("M11.3 9.6c-1.7-.7-3.7-.3-4.9.9-1 1-1 2.3-1.8 3-.9.8-2.4.7-3 2.1-.7 1.6.4 3.4 2 4.2s3.2.2 4.1-.7c.7-.8.6-2.2 1.6-2.9 1.1-.8 2.4-.6 3.3-1.6 1.2-1.2 1.6-3.2.7-5z")}{P("M9.3 15.1a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2z", { fill: "currentColor" })}</>, 2);
const Drum = mkIcon(<>{P("M4 9c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z")}{P("M4 9v7c0 1.7 3.6 3 8 3s8-1.3 8-3V9M7 11.5v6.5M12 12v7M17 11.5v6.5", { strokeWidth: 1.7 })}{P("M6 2.5l4 4.2M18 2.5l-4 4.2")}</>, 0);
const PianoIcon = mkIcon(<>{P("M3.5 5h17v14h-17z")}{P("M8 5v14M12 5v14M16 5v14", { strokeWidth: 1.5 })}<rect x="6.6" y="5" width="2.8" height="7.5" rx=".8" fill="currentColor" stroke="none" /><rect x="14.6" y="5" width="2.8" height="7.5" rx=".8" fill="currentColor" stroke="none" /></>, 1);
const Crown = mkIcon(<>{P("M4 17.5 3 7.5l5 4 4-6.5 4 6.5 5-4-1 10z")}{P("M4.5 20.5h15")}</>, 2);
const Spray = mkIcon(<>{P("M8 9.5h7v11H8z")}{P("M9.5 9.5V7h4v2.5M11.5 7V5")}{P("M16.5 4.5h.01M18.8 3h.01M18.8 6.2h.01M21 4.6h.01M20.6 8h.01", { strokeWidth: 2.6 })}</>, 0);
const Eye = mkIcon(<>{P("M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z")}{P("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z")}</>, 1);
const Search = mkIcon(<>{P("M10.5 17.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14z")}{P("M15.5 15.5 21 21", { strokeWidth: 2.8 })}</>, -1);
const Layers = mkIcon(<>{P("M12 3.5 21 8l-9 4.5L3 8z")}{P("M3 12l9 4.5 9-4.5M3 16l9 4.5 9-4.5")}</>, 0);
const Waves = mkIcon(<>{P("M2.5 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2.5 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2.5 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0")}</>, 2);
const Edit = mkIcon(<>{P("M4 20l1-4.5L16 4.5l3.5 3.5L8.5 19z")}{P("M14 7l3.5 3.5")}</>, 1);
const Book = mkIcon(<>{P("M5 4.5h11.5a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2z")}{P("M5 17.5a2 2 0 0 1 2-2h11.5M9 8.5h6")}</>, 0);
const Trash = mkIcon(<>{P("M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13")}</>, -1);
const Ladder = mkIcon(<>{P("M7.5 3v18M16.5 3v18")}{P("M7.5 7h9M7.5 11h9M7.5 15h9M7.5 19h9", { strokeWidth: 1.8 })}</>, 2);
const Comment = mkIcon(<>{P("M4 5.5h16v10.5H10l-4.5 3.5v-3.5H4z")}{P("M8 9.5h8M8 12.5h5")}</>, 1);
