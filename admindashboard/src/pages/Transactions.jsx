import { useState } from "react";
import Card from "../components/Card";
import Badge from "../components/Badge";

const DATA = [
  { id:1,  user:"ahmed.benali",  desc:"Courses Monoprix",      cat:"Alimentation", montant:-85,  date:"03/06/2026", type:"depense" },
  { id:2,  user:"fatima.salhi",  desc:"Salaire juin",           cat:"Revenu",       montant:2800, date:"01/06/2026", type:"revenu" },
  { id:3,  user:"karim.dridi",   desc:"Carburant",              cat:"Transport",    montant:-55,  date:"02/06/2026", type:"depense" },
  { id:4,  user:"meriem.bouzid", desc:"Netflix",                cat:"Loisirs",      montant:-15,  date:"01/06/2026", type:"depense" },
  { id:5,  user:"nawres.bn",     desc:"Consultation médecin",   cat:"Santé",        montant:-40,  date:"31/05/2026", type:"depense" },
  { id:6,  user:"sami.bk",       desc:"Freelance projet web",   cat:"Revenu",       montant:1200, date:"30/05/2026", type:"revenu" },
  { id:7,  user:"ahmed.benali",  desc:"Restaurant Le Phénix",   cat:"Loisirs",      montant:-62,  date:"29/05/2026", type:"depense" },
  { id:8,  user:"fatima.salhi",  desc:"Pharmacie",              cat:"Santé",        montant:-28,  date:"28/05/2026", type:"depense" },
];

const AV_COLORS = ["#7C3AED","#10B981","#F59E0B","#EF4444","#3B82F6"];
function getAv(name) {
  const c = AV_COLORS[name.charCodeAt(0) % AV_COLORS.length];
  return { c, initials: name.split(/[._]/).map(p=>p[0]?.toUpperCase()).join("").slice(0,2) };
}

const CAT_ICONS = { Alimentation:"🛒", Transport:"🚗", Loisirs:"🎬", Santé:"💊", Revenu:"💰", Éducation:"📚" };

export default function Transactions() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = DATA
    .filter(t => filter==="all" || t.type===filter)
    .filter(t => t.user.includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase()));

  const totalRevenu  = DATA.filter(t=>t.type==="revenu").reduce((s,t)=>s+t.montant,0);
  const totalDepense = DATA.filter(t=>t.type==="depense").reduce((s,t)=>s+Math.abs(t.montant),0);
  const solde = totalRevenu - totalDepense;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"var(--text)", letterSpacing:"-0.01em" }}>Transactions</h1>
          <p style={{ fontSize:13, color:"var(--text2)", marginTop:4 }}>Historique de toutes les transactions</p>
        </div>
        <button style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", borderRadius:10, background:"var(--purple)", color:"#fff", fontSize:13, fontWeight:600, boxShadow:"0 2px 10px rgba(124,58,237,0.3)" }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Ajouter
        </button>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[
          { label:"Total revenus",  val:`+${totalRevenu.toLocaleString("fr-FR")} DT`,  col:"#10B981", bg:"#D1FAE5", icon:"📈" },
          { label:"Total dépenses", val:`-${totalDepense.toLocaleString("fr-FR")} DT`, col:"#EF4444", bg:"#FEE2E2", icon:"📉" },
          { label:"Solde net",       val:`${solde.toLocaleString("fr-FR")} DT`,          col:"#7C3AED", bg:"#EDE9FE", icon:"⚖️" },
        ].map(({label,val,col,bg,icon})=>(
          <div key={label} style={{ background:"#fff", borderRadius:"var(--r-lg)", border:"1px solid var(--border)", padding:"18px 22px", boxShadow:"var(--shadow)", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
            <div>
              <div style={{ fontSize:11.5, color:"var(--text3)" }}>{label}</div>
              <div style={{ fontSize:20, fontWeight:700, color:col, marginTop:2, letterSpacing:"-0.02em" }}>{val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + table */}
      <div style={{ background:"#fff", borderRadius:"var(--r-lg)", border:"1px solid var(--border)", boxShadow:"var(--shadow)", overflow:"hidden" }}>
        <div style={{ padding:"16px 22px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex", gap:6 }}>
            {["all","revenu","depense"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{
                padding:"6px 14px", borderRadius:8, fontSize:12.5,
                fontWeight: filter===f ? 600 : 400,
                color: filter===f ? "var(--purple)" : "var(--text2)",
                background: filter===f ? "var(--purple-pale)" : "transparent",
                border: filter===f ? "1px solid var(--border2)" : "1px solid transparent",
              }}>
                {f==="all"?"Toutes":f==="revenu"?"Revenus":"Dépenses"}
              </button>
            ))}
          </div>
          <div style={{ flex:1 }}/>
          <div style={{ position:"relative" }}>
            <svg style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--text3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:30, paddingRight:12, paddingTop:7, paddingBottom:7, background:"var(--purple-bg)", border:"1px solid var(--border)", borderRadius:9, fontSize:12.5, color:"var(--text)", outline:"none", fontFamily:"var(--font)", width:200 }}/>
          </div>
        </div>

        {/* Head */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 120px 100px 120px 90px", padding:"10px 22px", background:"var(--purple-bg)", borderBottom:"1px solid var(--border)", fontSize:11, fontWeight:600, color:"var(--purple-light)", textTransform:"uppercase", letterSpacing:"0.06em" }}>
          <div>Transaction</div><div>Catégorie</div><div>Montant</div><div>Date</div><div>Type</div>
        </div>

        {filtered.length===0 ? (
          <div style={{ padding:"40px", textAlign:"center", color:"var(--text3)", fontSize:14 }}>Aucune transaction trouvée</div>
        ) : filtered.map((t,i)=>{
          const { c, initials } = getAv(t.user);
          return (
            <div key={t.id} style={{
              display:"grid", gridTemplateColumns:"1fr 120px 100px 120px 90px",
              padding:"13px 22px", alignItems:"center",
              borderBottom: i<filtered.length-1?"1px solid var(--border)":"none",
              transition:"background 0.12s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="var(--purple-bg)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:`${c}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:c, flexShrink:0 }}>{initials}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{t.desc}</div>
                  <div style={{ fontSize:11, color:"var(--text3)", marginTop:1 }}>{t.user}</div>
                </div>
              </div>
              <span style={{ fontSize:13, display:"flex", alignItems:"center", gap:5 }}>
                <span>{CAT_ICONS[t.cat]||"📌"}</span>
                <span style={{ color:"var(--text2)" }}>{t.cat}</span>
              </span>
              <span style={{ fontSize:14, fontWeight:700, color: t.montant>0?"#10B981":"#EF4444" }}>
                {t.montant>0?"+":""}{t.montant} DT
              </span>
              <span style={{ fontSize:12, color:"var(--text3)" }}>{t.date}</span>
              <Badge label={t.type==="revenu"?"Revenu":"Dépense"} variant={t.type==="revenu"?"success":"danger"} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
