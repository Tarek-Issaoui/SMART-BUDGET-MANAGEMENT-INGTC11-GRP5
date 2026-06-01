import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  LayoutDashboard, Wallet, ArrowLeftRight, Tag, Users, Bell,
  LogOut, Menu, X
} from "lucide-react";
import { useApp } from "../context/AppContext";

const navItems = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/budgets", label: "Budgets", icon: Wallet },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/categories", label: "Catégories", icon: Tag },
  { to: "/groupes", label: "Groupes", icon: Users },
  { to: "/alertes", label: "Alertes", icon: Bell },
];

export function Layout() {
  const { currentUser, alerts, logout, loading } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !currentUser) navigate("/connexion", { replace: true });
  }, [currentUser, loading, navigate]);

  const unread = alerts.filter(a => !a.est_lu).length;
  const initials = currentUser?.nom_utilisateur?.slice(0, 2).toUpperCase() ?? "?";

  const handleLogout = () => { logout(); navigate("/connexion"); };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="size-full flex bg-background" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-60 flex-shrink-0 flex flex-col transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ backgroundColor: "#1E1B4B" }}>
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: "1px solid rgba(167,139,250,0.15)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">GBI</span>
            </div>
            <span className="text-white">Gestion Budget Intelligent</span>
          </div>
          <button className="lg:hidden text-sidebar-foreground" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isAlerts = item.to === "/alertes";
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`
                }
              >
                <Icon size={17} />
                <span className="flex-1">{item.label}</span>
                {isAlerts && unread > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs">
                    {unread}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 pb-4 pt-3" style={{ borderTop: "1px solid rgba(167,139,250,0.15)" }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs truncate">{currentUser?.nom_utilisateur}</p>
              <p className="text-sidebar-foreground text-xs truncate opacity-70">{currentUser?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-sidebar-foreground hover:text-red-400 transition-colors" title="Déconnexion">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 flex items-center gap-4 px-6 py-4 bg-card border-b border-border">
          <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <NavLink to="/alertes" className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </NavLink>
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-xs">{initials}</span>
            </div>
            <span className="text-sm text-foreground hidden sm:block">{currentUser?.nom_utilisateur}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
