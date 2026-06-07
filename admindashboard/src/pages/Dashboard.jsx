import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import CardHeader from "../components/CardHeader";
import Badge from "../components/Badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";

const CHART_DATA = [
  { mois: "janv. 26", revenus: 8400,  depenses: 5200 },
  { mois: "févr. 26", revenus: 9200,  depenses: 6100 },
  { mois: "mars 26",  revenus: 7800,  depenses: 4900 },
  { mois: "avr. 26",  revenus: 11000, depenses: 7300 },
  { mois: "mai 26",   revenus: 9700,  depenses: 5800 },
  { mois: "juin 26",  revenus: 12400, depenses: 6900 },
];

const TOP_CATS = [
  { label: "Alimentation", pct: 42, montant: "1 840 DT", color: "#7C3AED" },
  { label: "Transport",    pct: 28, montant: "1 230 DT", color: "#10B981" },
  { label: "Loisirs",      pct: 18, montant: "790 DT",   color: "#F59E0B" },
  { label: "Santé",        pct: 12, montant: "525 DT",   color: "#3B82F6" },
];

const BUDGETS_STATE = [
  { name: "Alimentation", used: 340, total: 500, color: "#7C3AED" },
  { name: "Transport",    used: 190, total: 200, color: "#EF4444" },
  { name: "Loisirs",      used: 80,  total: 300, color: "#10B981" },
  { name: "Santé",        used: 50,  total: 150, color: "#F59E0B" },
];

const RECENT = [
  { id: 1, nom: "ahmed.benali",   action: "Inscription",         time: "il y a 3 min",  type: "success" },
  { id: 2, nom: "fatima.salhi",   action: "Budget dépassé",      time: "il y a 12 min", type: "danger"  },
  { id: 3, nom: "karim.dridi",    action: "Transaction ajoutée", time: "il y a 28 min", type: "purple"  },
  { id: 4, nom: "meriem.bouzid",  action: "Nouveau budget",      time: "il y a 1h",     type: "warning" },
];

const AV_COLORS = ["#7C3AED","#10B981","#F59E0B","#EF4444","#3B82F6"];
function getAv(name) {
  const c = AV_COLORS[name.charCodeAt(0) % AV_COLORS.length];
  const initials = name.split(/[._]/).map(p => p[0]?.toUpperCase()).join("").slice(0,2);
  return { c, initials };
}

const Tooltip_ = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px", fontSize:12, boxShadow:"0 4px 16px rgba(124,58,237,0.12)" }}>
      <p style={{ color:"var(--text2)", marginBottom:6, fontWeight:500 }}>{label}</p>
      {payload.map(p => <p key={p.dataKey} style={{ color:p.color, marginTop:3 }}>{p.name}: <strong>{Number(p.value).toLocaleString("fr-FR")} DT</strong></p>)}
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats]   = useState({ users:14, budgets:2500, transactions:11, alertes:3 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.get("/utilisateurs"),
      adminApi.get("/budgets"),
      adminApi.get("/transactions"),
      adminApi.get("/alertes"),
    ]).then(([u,b,t,a]) => setStats({ users:u.data.length, budgets:b.data.length, transactions:t.data.length, alertes:a.data.length }))
     .catch(()=>{})
     .finally(()=>setLoading(false));
  }, []);

  const v = n => loading ? "—" : n;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Page header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"var(--text)", letterSpacing:"-0.01em" }}>Tableau de bord</h1>
          <p style={{ fontSize:13, color:"var(--text2)", marginTop:4 }}>Aperçu financier — juin 2026</p>
        </div>
        <div style={{
          display:"flex", alignItems:"center", gap:8, padding:"8px 16px",
          background:"#fff", border:"1px solid var(--border)", borderRadius:22,
          fontSize:13, fontWeight:500, color:"var(--purple)",
          boxShadow:"var(--shadow)",
        }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--purple)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Taux d'épargne &nbsp;<strong>8%</strong>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        <StatCard title="Revenus du mois"  value={`${v(stats.users)} DT`}        iconColor="#10B981" iconBg="#D1FAE5" icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>} trend="+12%" trendUp={true} sub="vs mois précédent" />
        <StatCard title="Dépenses du mois" value={`${v(stats.transactions)} DT`} iconColor="#EF4444" iconBg="#FEE2E2" icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>} trend="+5%" trendUp={false} sub="vs mois précédent" />
        <StatCard title="Solde net"         value={`${v(stats.budgets)} DT`}      iconColor="#7C3AED" iconBg="#EDE9FE" icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>} trend="+18%" trendUp={true} sub="vs mois précédent" />
        <StatCard title="Alertes non lues"  value={v(stats.alertes)}              iconColor="#F59E0B" iconBg="#FEF3C7" icon={<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>} sub="à traiter" />
      </div>

      {/* Chart + top cats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:14 }}>
        <Card>
          <CardHeader title="Flux de trésorerie" sub="Revenus et dépenses — 6 derniers mois" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART_DATA} margin={{ top:4, right:4, bottom:0, left:-10 }}>
              <defs>
                <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDE9FE" vertical={false}/>
              <XAxis dataKey="mois" tick={{ fill:"#9CA3AF", fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:"#9CA3AF", fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}k`}/>
              <Tooltip content={<Tooltip_ />}/>
              <Legend wrapperStyle={{ fontSize:12, paddingTop:10 }}/>
              <Area type="monotone" dataKey="revenus"  name="Revenus"  stroke="#7C3AED" strokeWidth={2.2} fill="url(#gR)" dot={false} activeDot={{ r:4, fill:"#7C3AED" }}/>
              <Area type="monotone" dataKey="depenses" name="Dépenses" stroke="#EF4444" strokeWidth={2.2} fill="url(#gD)" dot={false} activeDot={{ r:4, fill:"#EF4444" }}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Top dépenses" sub="Par catégorie ce mois" />
          {TOP_CATS.map(({ label, pct, montant, color }) => (
            <div key={label} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:13, color:"var(--text2)" }}>{label}</span>
                <span style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{montant}</span>
              </div>
              <div style={{ height:6, borderRadius:10, background:"#F3F0FF" }}>
                <div style={{ height:"100%", width:`${pct}%`, borderRadius:10, background:color, transition:"width 0.8s ease" }}/>
              </div>
              <div style={{ fontSize:11, color:"var(--text3)", marginTop:3, textAlign:"right" }}>{pct}%</div>
            </div>
          ))}
        </Card>
      </div>

      {/* Bottom: budgets + transactions */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card>
          <CardHeader title="État des budgets" action="Voir tout" />
          {BUDGETS_STATE.map(({ name, used, total, color }) => {
            const pct = Math.round((used/total)*100);
            const over = pct >= 90;
            return (
              <div key={name} style={{ padding:"11px 0", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{name}</span>
                    <span style={{ fontSize:12, color: over?"#EF4444":"var(--text2)" }}>{used} / {total} DT</span>
                  </div>
                  <div style={{ height:5, borderRadius:10, background:"#F3F0FF" }}>
                    <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, borderRadius:10, background: over?"#EF4444":color }}/>
                  </div>
                </div>
                <Badge label={`${pct}%`} variant={over?"danger":"purple"} />
              </div>
            );
          })}
        </Card>

        <Card>
          <CardHeader title="Transactions récentes" action="Voir tout" />
          {RECENT.map(({ id, nom, action, time, type }) => {
            const { c, initials } = getAv(nom);
            return (
              <div key={id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:"1px solid var(--border)" }}>
                <div style={{
                  width:36, height:36, borderRadius:"50%",
                  background:`${c}18`, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:12, fontWeight:700, color:c, flexShrink:0,
                }}>{initials}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{action}</div>
                  <div style={{ fontSize:11.5, color:"var(--text3)", marginTop:1 }}>{nom}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <Badge label={action.split(" ")[0]} variant={type} />
                  <span style={{ fontSize:10.5, color:"var(--text3)" }}>{time}</span>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}
