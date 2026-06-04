export default function CardHeader({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{title}</h2>
        {sub && <p style={{ fontSize: 11.5, color: "var(--text3)", marginTop: 2 }}>{sub}</p>}
      </div>
      {action && (
        <button style={{
          fontSize: 12, color: "var(--purple)", fontWeight: 500,
          padding: "5px 11px", borderRadius: 8,
          background: "var(--purple-pale)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 4,
          transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "#DDD6FE"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--purple-pale)"}
        >
          {action} →
        </button>
      )}
    </div>
  );
}
