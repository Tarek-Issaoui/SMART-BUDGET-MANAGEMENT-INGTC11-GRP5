import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/":             { title: "Tableau de bord", sub: "Aperçu général de l'application" },
  "/budgets":      { title: "Budgets",         sub: "Vue d'ensemble des budgets créés" },
  "/transactions": { title: "Transactions",    sub: "Historique de toutes les transactions" },
  "/users":        { title: "Utilisateurs",    sub: "Gestion des comptes utilisateurs" },
  "/alertes":      { title: "Alertes",         sub: "Notifications et messages système" },
  "/parametres":   { title: "Paramètres",      sub: "Configuration de l'application" },
};

export default function Navbar() {
  const { pathname } = useLocation();
  const { title, sub } = PAGE_TITLES[pathname] || { title: "Admin", sub: "" };

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", height: 62,
      background: "#fff",
      borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 10,
    }}>
      {/* Left: breadcrumb style title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "var(--purple-pale)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--purple)" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--text3)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{title}</span>
        </div>
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 13px",
          background: "var(--purple-bg)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          fontSize: 12.5, color: "var(--text3)",
          cursor: "pointer", minWidth: 160,
        }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--text3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Rechercher...
          <span style={{ marginLeft: "auto", fontSize: 10, background: "var(--border)", padding: "1px 5px", borderRadius: 4, color: "var(--text3)" }}>⌘K</span>
        </div>

        {/* Bell */}
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "var(--purple-bg)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--purple-pale)"}
        onMouseLeave={e => e.currentTarget.style.background = "var(--purple-bg)"}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--purple)" strokeWidth="1.8">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span style={{
            position: "absolute", top: 7, right: 8,
            width: 7, height: 7,
            background: "var(--purple)", borderRadius: "50%",
            border: "2px solid #fff",
          }} />
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: "var(--border)" }} />

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED, #A855F7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff",
            boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
          }}>NA</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>nawres</div>
            <div style={{ fontSize: 10.5, color: "var(--text3)" }}>Super Admin</div>
          </div>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--text3)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
    </header>
  );
}
