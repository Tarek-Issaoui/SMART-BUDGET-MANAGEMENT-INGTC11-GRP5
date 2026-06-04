const PRESETS = {
  success:  { color: "#10B981", bg: "#D1FAE5" },
  danger:   { color: "#EF4444", bg: "#FEE2E2" },
  warning:  { color: "#F59E0B", bg: "#FEF3C7" },
  info:     { color: "#3B82F6", bg: "#DBEAFE" },
  purple:   { color: "#7C3AED", bg: "#EDE9FE" },
  neutral:  { color: "#6B7280", bg: "#F3F4F6" },
};

export default function Badge({ label, variant = "purple", color, bg, dot = false }) {
  const preset = PRESETS[variant] || PRESETS.purple;
  const c = color || preset.color;
  const b = bg    || preset.bg;
  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      padding: "3px 9px", borderRadius: 20,
      background: b, color: c,
      display: "inline-flex", alignItems: "center", gap: 5,
      whiteSpace: "nowrap",
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />}
      {label}
    </span>
  );
}
