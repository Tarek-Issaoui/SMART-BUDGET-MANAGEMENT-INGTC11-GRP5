export default function PageHeader({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>{title}</h1>
        {sub && <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
