import { AlertTriangle, Bell, Info, CheckCircle, CheckCheck, Wallet } from "lucide-react";
import { useApp } from "../context/AppContext";
import { NavLink } from "react-router";

function formatAlertTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) + " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function Alerts() {
  const { alerts, budgets, markAlertRead, markAllRead } = useApp();

  const unread = alerts.filter(a => !a.est_lu);
  const read = alerts.filter(a => a.est_lu);

  const stats = [
    { label: "Non lues", value: unread.length, color: "text-red-600", bg: "bg-red-50 border-red-200" },
    { label: "Total", value: alerts.length, color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  ];

  const AlertCard = ({ alert }: { alert: typeof alerts[0] }) => {
    const budget = budgets.find(b => b.id === alert.budget_id);
    const isUnread = !alert.est_lu;

    return (
      <div className={`border rounded-xl p-4 transition-all ${isUnread ? "bg-amber-50 border-amber-200" : "bg-card border-border opacity-70"}`}>
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isUnread ? "bg-amber-100" : "bg-muted"}`}>
            <Bell size={16} className={isUnread ? "text-amber-600" : "text-muted-foreground"} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-foreground text-sm">Alerte budget #{alert.budget_id}</p>
              {isUnread && <span className="w-2 h-2 rounded-full bg-amber-500" />}
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">{alert.message ?? "—"}</p>
            {budget && (
              <NavLink to="/budgets" className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:underline">
                <Wallet size={11} /> {budget.nom}
              </NavLink>
            )}
            <p className="text-xs text-muted-foreground mt-2">{formatAlertTime(alert.cree_le)}</p>
          </div>
          {isUnread && (
            <button onClick={() => markAlertRead(alert.id)}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/60 text-muted-foreground hover:text-foreground transition-colors"
              title="Marquer comme lu">
              <CheckCircle size={16} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Alertes</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{alerts.length} alertes au total</p>
        </div>
        {unread.length > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <CheckCheck size={16} /> Tout marquer lu
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className={`border rounded-xl p-4 ${s.bg}`}>
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-2xl ${s.color}`} style={{ fontFamily: "'JetBrains Mono'" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Unread alerts */}
      {unread.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-foreground" />
            <h3 className="text-foreground">Non lues ({unread.length})</h3>
          </div>
          {unread.map(a => <AlertCard key={a.id} alert={a} />)}
        </div>
      )}

      {/* Read alerts */}
      {read.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-muted-foreground" />
            <h3 className="text-muted-foreground">Lues ({read.length})</h3>
          </div>
          {read.map(a => <AlertCard key={a.id} alert={a} />)}
        </div>
      )}

      {alerts.length === 0 && (
        <div className="text-center py-20">
          <Bell size={40} className="text-muted mx-auto mb-4" />
          <p className="text-muted-foreground">Aucune alerte pour le moment</p>
        </div>
      )}
    </div>
  );
}
