import { Link, useLocation } from "react-router-dom";

const NAV = [
  {
    to: "/",
    label: "Tableau de bord",
    icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  },
  {
    to: "/budgets",
    label: "Budgets",
    icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  },
  {
    to: "/transactions",
    label: "Transactions",
    icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/></svg>,
  },
  {
    to: "/users",
    label: "Utilisateurs",
    icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/></svg>,
  },
  {
    to: "/alertes",
    label: "Alertes",
    badge: 3,
    icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  },
];

const BOTTOM = [
  {
    to: "/parametres",
    label: "Paramètres",
    icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  const NavItem = ({ to, label, icon, badge }) => {
    const active = pathname === to;
    return (
      <li>
        <Link
          to={to}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 10,
            fontSize: 13.5,
            fontWeight: active ? 600 : 400,
            color: active ? "#fff" : "#C4B5FD",
            background: active
              ? "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)"
              : "transparent",
            boxShadow: active ? "0 2px 10px rgba(124,58,237,0.38)" : "none",
            transition: "all 0.15s",
            position: "relative",
          }}
          onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
          onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ flexShrink: 0, opacity: active ? 1 : 0.8 }}>{icon}</span>
          <span style={{ flex: 1 }}>{label}</span>
          {badge && (
            <span style={{
              fontSize: 10, fontWeight: 700,
              background: active ? "rgba(255,255,255,0.25)" : "#7C3AED",
              color: "#fff",
              padding: "1px 6px", borderRadius: 20,
              minWidth: 18, textAlign: "center",
            }}>{badge}</span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <aside style={{
      width: 232,
      minHeight: "100vh",
      background: "var(--sidebar-bg)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      position: "sticky",
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "22px 18px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(124,58,237,0.45)",
          }}>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: "-0.03em" }}>GBI</span>
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Gestion Budget</div>
            <div style={{ color: "#A5B4FC", fontSize: 11, marginTop: 1 }}>Intelligent — Admin</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "0 16px" }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 12px 8px" }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: "#6366F1", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 10px", marginBottom: 8 }}>
          Menu principal
        </p>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(item => <NavItem key={item.to} {...item} />)}
        </ul>

        <p style={{ fontSize: 10, fontWeight: 600, color: "#6366F1", letterSpacing: "0.1em", textTransform: "uppercase", padding: "16px 10px 8px", marginTop: 4 }}>
          Système
        </p>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 2 }}>
          {BOTTOM.map(item => <NavItem key={item.to} {...item} />)}
        </ul>
      </nav>

      {/* User footer */}
      <div style={{ padding: "14px 12px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", borderRadius: 11,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.07)",
          cursor: "pointer",
        }}>
          <div style={{
            width: 33, height: 33, borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED, #A855F7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>NA</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>nawres</div>
            <div style={{ fontSize: 11, color: "#A5B4FC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>nawresbennassib...</div>
          </div>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#A5B4FC" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
      </div>
    </aside>
  );
}
