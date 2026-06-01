import { useApp } from "../context/AppContext";
import { ProgressBar } from "../components/ui/ProgressBar";
import { PeriodBadge } from "../components/ui/badge";
import { NavLink } from "react-router";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, Bell, ArrowRight, AlertTriangle, Target } from "lucide-react";
import type { Transaction } from "../data/types";

function formatTND(n: number) {
  return n.toLocaleString("fr-TN", { minimumFractionDigits: 3 }) + " DT";
}

function pct(spent: number, total: number) {
  if (!total) return 0;
  return Math.min(Math.round((spent / total) * 100), 100);
}

// Build last 6 months flow from real transactions
function buildMonthlyFlow(transactions: Transaction[]) {
  const months: { mois: string; key: string; revenus: number; depenses: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
    months.push({ mois: label, key, revenus: 0, depenses: 0 });
  }
  for (const t of transactions) {
    const key = t.date.slice(0, 7);
    const m = months.find(x => x.key === key);
    if (!m) continue;
    if (t.type === "revenu") m.revenus += Number(t.montant);
    else m.depenses += Number(t.montant);
  }
  return months.map(({ mois, revenus, depenses }) => ({ mois, revenus, depenses }));
}

const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-sm shadow-lg">
      <p className="text-muted-foreground mb-2 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {formatTND(p.value)}</p>
      ))}
    </div>
  );
};

export function Dashboard() {
  const { transactions, budgets, alerts, categories } = useApp();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const thisMonth = transactions.filter(t => t.date.startsWith(currentMonth));
  const totalRevenu = thisMonth.filter(t => t.type === "revenu").reduce((s, t) => s + Number(t.montant), 0);
  const totalDepense = thisMonth.filter(t => t.type === "depense").reduce((s, t) => s + Number(t.montant), 0);
  const solde = totalRevenu - totalDepense;
  const unreadAlerts = alerts.filter(a => !a.est_lu);
  const overBudgets = budgets.filter(b => (b.spent ?? 0) > Number(b.montant));

  const monthlyFlow = buildMonthlyFlow(transactions);

  const statCards = [
    { label: "Revenus du mois", value: formatTND(totalRevenu), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    { label: "Dépenses du mois", value: formatTND(totalDepense), icon: TrendingDown, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
    { label: "Solde net", value: formatTND(solde), icon: Wallet, color: solde >= 0 ? "text-purple-700" : "text-red-600", bg: "bg-purple-50", border: "border-purple-200" },
    { label: "Alertes non lues", value: String(unreadAlerts.length), icon: Bell, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  ];

  const recentTx = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

  const catSpend = categories
    .filter(c => c.type === "depense")
    .map(c => ({
      name: c.nom,
      icon: c.icon ?? "📋",
      total: thisMonth.filter(t => t.categorie_id === c.id && t.type === "depense").reduce((s, t) => s + Number(t.montant), 0),
    }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const tauxEpargne = totalRevenu > 0 ? Math.round(((totalRevenu - totalDepense) / totalRevenu) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Aperçu financier — {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl">
          <Target size={15} className="text-purple-600" />
          <span className="text-xs text-purple-700">Taux d'épargne</span>
          <span className="text-sm font-semibold text-purple-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {tauxEpargne}%
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-card border rounded-xl p-5 ${c.border}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground text-xs">{c.label}</span>
                <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <Icon size={16} className={c.color} />
                </div>
              </div>
              <p className={`text-xl ${c.color}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{c.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Area chart — monthly flow */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-1">Flux de trésorerie</h3>
          <p className="text-muted-foreground text-xs mb-5">Revenus et dépenses — 6 derniers mois</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyFlow} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="depG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="mois" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="revenus" name="Revenus" stroke="#059669" strokeWidth={2} fill="url(#revG)" />
              <Area type="monotone" dataKey="depenses" name="Dépenses" stroke="#DC2626" strokeWidth={2} fill="url(#depG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top categories */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-1">Top dépenses</h3>
          <p className="text-muted-foreground text-xs mb-4">Par catégorie ce mois</p>
          <div className="space-y-3">
            {catSpend.length === 0 && <p className="text-muted-foreground text-sm">Aucune dépense ce mois</p>}
            {catSpend.map((c, i) => (
              <div key={c.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-foreground flex items-center gap-1.5">
                    <span>{c.icon}</span> {c.name}
                  </span>
                  <span className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono'" }}>
                    {formatTND(c.total)}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(c.total / catSpend[0].total) * 100}%`, opacity: 1 - i * 0.15 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budgets + recent tx */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Budget status */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">État des budgets</h3>
            <NavLink to="/budgets" className="text-xs text-primary flex items-center gap-1 hover:underline">
              Voir tout <ArrowRight size={12} />
            </NavLink>
          </div>
          <div className="space-y-4">
            {budgets.slice(0, 5).map(b => {
              const p = pct(b.spent ?? 0, Number(b.montant));
              const over = (b.spent ?? 0) > Number(b.montant);
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground truncate max-w-[140px]">{b.nom}</span>
                      <PeriodBadge period={b.periode} />
                    </div>
                    <span className={`text-xs ${over ? "text-red-600" : "text-muted-foreground"}`}
                      style={{ fontFamily: "'JetBrains Mono'" }}>
                      {formatTND(b.spent ?? 0)} / {formatTND(Number(b.montant))}
                    </span>
                  </div>
                  <ProgressBar value={p} showLabel />
                  {over && <p className="text-xs text-red-500 mt-0.5">⚠ Dépassement de {formatTND((b.spent ?? 0) - Number(b.montant))}</p>}
                </div>
              );
            })}
            {budgets.length === 0 && <p className="text-muted-foreground text-sm">Aucun budget</p>}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground">Transactions récentes</h3>
            <NavLink to="/transactions" className="text-xs text-primary flex items-center gap-1 hover:underline">
              Voir tout <ArrowRight size={12} />
            </NavLink>
          </div>
          <div className="space-y-1">
            {recentTx.map(tx => {
              const cat = categories.find(c => c.id === tx.categorie_id);
              return (
                <div key={tx.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors">
                  <span className="text-base flex-shrink-0">{cat?.icon ?? "💳"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{tx.description ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span className={`text-sm flex-shrink-0 ${tx.type === "revenu" ? "text-emerald-600" : "text-red-600"}`}
                    style={{ fontFamily: "'JetBrains Mono'" }}>
                    {tx.type === "revenu" ? "+" : "−"}{formatTND(Number(tx.montant))}
                  </span>
                </div>
              );
            })}
            {recentTx.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">Aucune transaction</p>}
          </div>
        </div>
      </div>

      {/* Bar chart — monthly comparison */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-foreground mb-1">Comparaison mensuelle</h3>
        <p className="text-muted-foreground text-xs mb-5">Revenus vs Dépenses sur 6 mois</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={monthlyFlow} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="mois" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<ChartTip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#6B7280" }} />
            <Bar dataKey="revenus" name="Revenus" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="depenses" name="Dépenses" fill="#DC2626" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts banner */}
      {unreadAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-amber-800">
              Vous avez <strong>{unreadAlerts.length} alertes non lues</strong> dont <strong>{overBudgets.length} budget(s) dépassé(s)</strong>.
            </p>
          </div>
          <NavLink to="/alertes" className="flex-shrink-0 text-xs text-amber-700 hover:underline flex items-center gap-1">
            Voir <ArrowRight size={12} />
          </NavLink>
        </div>
      )}
    </div>
  );
}
