export default function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "var(--r-lg)",
      border: "1px solid var(--border)",
      padding: "22px 24px",
      boxShadow: "var(--shadow)",
      ...style,
    }}>
      {children}
    </div>
  );
}
