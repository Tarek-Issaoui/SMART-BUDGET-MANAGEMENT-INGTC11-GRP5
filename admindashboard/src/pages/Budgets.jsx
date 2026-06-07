import { useState } from "react";
import Card from "../components/Card";
import CardHeader from "../components/CardHeader";
import Badge from "../components/Badge";

const BUDGETS = [
  { id:1, user:"ahmed.benali",  categorie:"Alimentation", montant:500,  depense:340, periode:"Juin 2026", statut:"en_cours" },
  { id:2, user:"fatima.salhi",  categorie:"Transport",    montant:200,  depense:190, periode:"Juin 2026", statut:"critique" },
  { id:3, user:"karim.dridi",   categorie:"Loisirs",      montant:300,  depense:80,  periode:"Juin 2026", statut:"en_cours" },
  { id:4, user:"meriem.bouzid", categorie:"Santé",        montant:150,  depense:50,  periode:"Juin 2026", statut:"en_cours" },
  { id:5, user:"nawres.bn",     categorie:"Alimentation", montant:600,  depense:580, periode:"Juin 2026", statut:"critique" },
  { id:6, user:"sami.bk",       categorie:"Éducation",   montant:400,  depense:120, periode:"Juin 2026", statut:"en_cours" },
];

const CATS = [
  { name:"Alimentation", count:2, total:1100, color:"#7C3AED", icon:"🛒" },
  { name:"Transport",    count:1, total:200,  color:"#10B981", icon:"🚗" },
  { name:"Loisirs",      count:1, total:300,  color:"#F59E0B", icon:"🎬" },
  { name:"Santé",        count:1, total:150,  color:"#EF4444", icon:"💊" },
  { name:"Éducation",    count:1, total:400,  color:"#3B82F6", icon:"📚" },
];

const AV_COLORS = ["#7C3AED","#10B981","#F59E0B","#EF4444","#3B82F6"];
function getAv(name) {
  const c = AV_COLORS[name.charCodeAt(0) % AV_COLORS.length];
  const initials = name.split(/[._]/).map(p=>p[0]?.toUpperCase()).join("").slice(0,2);
  return { c, initials };
}

export default function Budgets() {
  const [search, setSearch] = useState("");

  const filtered = BUDGETS.filter(b =>
    b.user.includes(search.toLowerCase()) ||
    b.categorie.toLowerCase().includes(search.toLowerCase())
  );

  const total  = BUDGETS.reduce((s,b) => s+b.montant, 0);
  const spent  = BUDGETS.reduce((s,b) => s+b.depense, 0);
  const critiques = BUDGETS.filter(b=>b.statut==="critique").length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"var(--text)", letterSpacing:"-0.01em" }}>Budgets</h1>
          <p style={{ fontSize:13, color:"var(--text2)", marginTop:4 }}>Vue d'ensemble des budgets créés</p>
        </div>
        <button style={{
          display:"flex", alignItems:"center", gap:8,
          padding:"9px 18px", borderRadius:10,
          background:"var(--purple)", color:"#fff",
          fontSize:13, fontWeight:600,
          boxShadow:"0 2px 10px rgba(124,58,237,0.3)",
        }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nouveau budget
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[
          { label:"Total budgets", val:`${total.toLocaleString("fr-FR")} DT`, icon:"📊", col:"#7C3AED", bg:"#EDE9FE" },
          { label:"Total dépensé", val:`${spent.toLocaleString("fr-FR")} DT`, icon:"💸", col:"#EF4444", bg:"#FEE2E2" },
          { label:"Budgets critiques", val:String(critiques), icon:"⚠️", col:"#F59E0B", bg:"#FEF3C7" },
        ].map(({label,val,icon,col,bg})=>(
          <div key={label} style={{
            background:"#fff", borderRadius:"var(--r-lg)", border:"1px solid var(--border)",
            padding:"18px 22px", boxShadow:"var(--shadow)",
            display:"flex", alignItems:"center", gap:14,
          }}>
            <div style={{ width:44, height:44, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{icon}</div>
            <div>
              <div style={{ fontSize:11.5, color:"var(--text3)" }}>{label}</div>
              <div style={{ fontSize:22, fontWeight:700, color:col, marginTop:3, letterSpacing:"-0.02em" }}>{val}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:14 }}>
        {/* Table */}
        <Card style={{ padding:0, overflow:"hidden" }}>
          <div style={{ padding:"18px 22px 14px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:12 }}>
            <h2 style={{ fontSize:15, fontWeight:600, color:"var(--text)", flex:1 }}>Liste des budgets</h2>
            <div style={{ position:"relative" }}>
              <svg style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--text3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text" placeholder="Filtrer..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{ paddingLeft:30, paddingRight:12, paddingTop:7, paddingBottom:7, background:"var(--purple-bg)", border:"1px solid var(--border)", borderRadius:9, fontSize:12.5, color:"var(--text)", outline:"none", fontFamily:"var(--font)", width:180 }}
              />
            </div>
          </div>

          {/* Head */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 120px 120px 80px", padding:"10px 22px", background:"var(--purple-bg)", borderBottom:"1px solid var(--border)", fontSize:11, fontWeight:600, color:"var(--purple-light)", textTransform:"uppercase", letterSpacing:"0.06em" }}>
            <div>Utilisateur & Catégorie</div><div>Montant</div><div>Dépensé</div><div>Progression</div><div>Statut</div>
          </div>

          {filtered.map((b,i) => {
            const { c, initials } = getAv(b.user);
            const pct = Math.round((b.depense/b.montant)*100);
            const over = pct >= 90;
            return (
              <div key={b.id} style={{
                display:"grid", gridTemplateColumns:"1fr 100px 120px 120px 80px",
                padding:"13px 22px", alignItems:"center",
                borderBottom: i<filtered.length-1 ? "1px solid var(--border)" : "none",
                transition:"background 0.12s",
              }}
              onMouseEnter={e=>e.currentTarget.style.background="var(--purple-bg)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:`${c}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:c, flexShrink:0 }}>{initials}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{b.user}</div>
                    <div style={{ fontSize:11, color:"var(--text3)", marginTop:1 }}>{b.categorie} · {b.periode}</div>
                  </div>
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>{b.montant} DT</span>
                <span style={{ fontSize:13, color: over?"#EF4444":"var(--text2)" }}>{b.depense} DT</span>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ flex:1, height:5, borderRadius:10, background:"#F3F0FF" }}>
                      <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, borderRadius:10, background: over?"#EF4444":"#7C3AED" }}/>
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color: over?"#EF4444":"var(--purple)", flexShrink:0 }}>{pct}%</span>
                  </div>
                </div>
                <Badge label={b.statut==="critique"?"Critique":"En cours"} variant={b.statut==="critique"?"danger":"success"} dot />
              </div>
            );
          })}
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader title="Par catégorie" />
          {CATS.map(({ name, count, total, color, icon }) => (
            <div key={name} style={{ display:"flex", alignItems:"center", gap:11, padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${color}15`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{name}</div>
                <div style={{ fontSize:11, color:"var(--text3)", marginTop:1 }}>{count} budget{count>1?"s":""} · {total} DT</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
