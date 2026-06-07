import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import Badge from "../components/Badge";

const SAMPLE = [
  { id:1, message:"Budget Alimentation dépassé à 112%",          type:"danger",  est_lu:false, user:"ahmed.benali",  time:"il y a 5 min"  },
  { id:2, message:"Nouveau compte utilisateur — ahmed@email.com", type:"info",   est_lu:false, user:"Système",        time:"il y a 23 min" },
  { id:3, message:"Transaction suspecte détectée — 2 300 DT",    type:"warning", est_lu:false, user:"fatima.salhi",  time:"il y a 1h"    },
  { id:4, message:"Mise à jour système effectuée avec succès",    type:"success", est_lu:true,  user:"Système",        time:"hier"          },
  { id:5, message:"Budget Transport proche du seuil (89%)",       type:"warning", est_lu:true,  user:"karim.dridi",   time:"hier"          },
  { id:6, message:"Nouveau groupe créé : Famille Dridi",          type:"info",    est_lu:true,  user:"meriem.bouzid", time:"avant-hier"    },
];

const TYPE = {
  danger:  { color:"#EF4444", bg:"#FEE2E2", variant:"danger",  label:"Critique",
    icon:<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  warning: { color:"#F59E0B", bg:"#FEF3C7", variant:"warning", label:"Attention",
    icon:<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  info:    { color:"#7C3AED", bg:"#EDE9FE", variant:"purple",  label:"Info",
    icon:<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> },
  success: { color:"#10B981", bg:"#D1FAE5", variant:"success", label:"Succès",
    icon:<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
};

const AV_COLORS = ["#7C3AED","#10B981","#F59E0B","#EF4444","#3B82F6"];
function getAv(name) {
  if (name==="Système") return { c:"#6B7280", initials:"SY" };
  const c = AV_COLORS[name.charCodeAt(0) % AV_COLORS.length];
  return { c, initials: name.split(/[._]/).map(p=>p[0]?.toUpperCase()).join("").slice(0,2) };
}

export default function Alertes() {
  const [alertes, setAlertes] = useState([]);
  const [filter,  setFilter]  = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get("/alertes")
      .then(res => setAlertes(res.data))
      .catch(() => setAlertes(SAMPLE))
      .finally(() => setLoading(false));
  }, []);

  const data   = alertes.length ? alertes : SAMPLE;
  const unread = data.filter(a=>!a.est_lu).length;

  const filtered = filter==="all"    ? data
                 : filter==="unread" ? data.filter(a=>!a.est_lu)
                 : data.filter(a=>a.est_lu);

  const markRead = id => setAlertes(p=>p.map(a=>a.id===id?{...a,est_lu:true}:a));
  const markAll  = () => setAlertes(p=>p.map(a=>({...a,est_lu:true})));

  const TABS = [
    { key:"all",    label:"Toutes",   count:data.length },
    { key:"unread", label:"Non lues", count:unread },
    { key:"read",   label:"Lues",     count:data.length-unread },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"var(--text)", letterSpacing:"-0.01em" }}>Alertes</h1>
          <p style={{ fontSize:13, color:"var(--text2)", marginTop:4 }}>Notifications et messages système</p>
        </div>
        {unread>0 && (
          <button onClick={markAll} style={{ fontSize:13, fontWeight:500, color:"var(--purple)", padding:"9px 16px", borderRadius:10, background:"var(--purple-pale)", border:"1px solid var(--border2)" }}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {Object.entries(TYPE).map(([key, conf])=>{
          const count = data.filter(a=>a.type===key).length;
          return (
            <div key={key} style={{ background:"#fff", borderRadius:"var(--r)", border:"1px solid var(--border)", padding:"14px 18px", boxShadow:"var(--shadow)", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:conf.bg, display:"flex", alignItems:"center", justifyContent:"center", color:conf.color, flexShrink:0 }}>{conf.icon}</div>
              <div>
                <div style={{ fontSize:11, color:"var(--text3)" }}>{conf.label}</div>
                <div style={{ fontSize:22, fontWeight:700, color:conf.color, lineHeight:1, marginTop:2 }}>{count}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6 }}>
        {TABS.map(({key,label,count})=>(
          <button key={key} onClick={()=>setFilter(key)} style={{
            padding:"8px 16px", borderRadius:9, fontSize:13,
            fontWeight: filter===key ? 600 : 400,
            color: filter===key ? "var(--purple)" : "var(--text2)",
            background: filter===key ? "var(--purple-pale)" : "#fff",
            border: filter===key ? "1px solid var(--border2)" : "1px solid var(--border)",
            display:"flex", alignItems:"center", gap:7,
            boxShadow: filter===key ? "none" : "var(--shadow)",
          }}>
            {label}
            <span style={{ fontSize:11, padding:"1px 7px", borderRadius:20, background: filter===key?"var(--purple)":"#F3F0FF", color: filter===key?"#fff":"var(--purple)", fontWeight:600 }}>{count}</span>
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {loading ? (
          <div style={{ padding:40, textAlign:"center", color:"var(--text3)", background:"#fff", borderRadius:"var(--r-lg)", border:"1px solid var(--border)" }}>Chargement...</div>
        ) : filtered.length===0 ? (
          <div style={{ padding:40, textAlign:"center", color:"var(--text3)", background:"#fff", borderRadius:"var(--r-lg)", border:"1px solid var(--border)" }}>Aucune alerte dans cette catégorie</div>
        ) : filtered.map(a=>{
          const conf = TYPE[a.type]||TYPE.info;
          const { c, initials } = getAv(a.user||"Système");
          return (
            <div key={a.id} style={{
              background:"#fff",
              border:`1px solid ${a.est_lu?"var(--border)":conf.bg}`,
              borderLeft:`3px solid ${a.est_lu?"#E5E7EB":conf.color}`,
              borderRadius:"var(--r)",
              padding:"14px 18px",
              display:"flex", alignItems:"center", gap:14,
              boxShadow: a.est_lu?"none":"var(--shadow)",
              opacity: a.est_lu?0.65:1,
              transition:"all 0.15s",
            }}>
              <div style={{ width:38, height:38, borderRadius:11, background:conf.bg, display:"flex", alignItems:"center", justifyContent:"center", color:conf.color, flexShrink:0 }}>{conf.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}>
                  <Badge label={conf.label} variant={conf.variant} />
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", background:`${c}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:c }}>{initials}</div>
                    <span style={{ fontSize:11, color:"var(--text3)" }}>{a.user||"Système"}</span>
                  </div>
                  {!a.est_lu && <span style={{ width:6, height:6, borderRadius:"50%", background:conf.color, display:"inline-block" }}/>}
                </div>
                <p style={{ fontSize:13.5, color:"var(--text)", lineHeight:1.45 }}>{a.message}</p>
                <span style={{ fontSize:11.5, color:"var(--text3)", marginTop:4, display:"block" }}>{a.time}</span>
              </div>
              {!a.est_lu && (
                <button onClick={()=>markRead(a.id)} style={{ fontSize:12, color:"var(--purple)", padding:"6px 13px", borderRadius:8, border:"1px solid var(--border2)", background:"var(--purple-pale)", flexShrink:0, fontWeight:500, transition:"all 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#DDD6FE"}
                  onMouseLeave={e=>e.currentTarget.style.background="var(--purple-pale)"}
                >Marquer lu</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
