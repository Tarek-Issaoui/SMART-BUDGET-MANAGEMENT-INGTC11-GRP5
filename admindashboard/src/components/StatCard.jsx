export default function StatCard({ title, value, icon, iconBg, iconColor, sub, trend, trendUp }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "var(--r-lg)",
      border: "1px solid var(--border)",
      padding: "20px 22px 18px",
      boxShadow: "var(--shadow)",
      display: "flex",
      flexDirection: "column",
      gap: 0,
      transition: "box-shadow 0.2s, transform 0.2s",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 12.5, color: "var(--text2)", fontWeight: 400 }}>{title}</span>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: iconBg || "var(--purple-pale)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: iconColor || "var(--purple)",
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div style={{
        fontSize: 28,
        fontWeight: 700,
        color: iconColor || "var(--purple)",
        letterSpacing: "-0.02em",
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}>
        {value}
      </div>

      {/* Trend + sub */}
      {(trend || sub) && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
          {trend !== undefined && (
            <span style={{
              fontSize: 11, fontWeight: 600,
              padding: "2px 7px", borderRadius: 20,
              background: trendUp ? "#D1FAE5" : "#FEE2E2",
              color: trendUp ? "#10B981" : "#EF4444",
            }}>
              {trendUp ? "▲" : "▼"} {trend}
            </span>
          )}
          {sub && <span style={{ fontSize: 11.5, color: "var(--text3)" }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}
