import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import Badge from "../components/Badge";

const SAMPLE = [
  { id:1, nom_utilisateur:"ahmed.benali",    email:"ahmed@email.com",   role:"utilisateur", statut:"actif",   created:"01/06/2026", budgets:3, transactions:24 },
  { id:2, nom_utilisateur:"fatima.salhi",    email:"fatima@email.com",  role:"utilisateur", statut:"actif",   created:"28/05/2026", budgets:5, transactions:41 },
  { id:3, nom_utilisateur:"karim.dridi",     email:"karim@email.com",   role:"admin",       statut:"actif",   created:"15/05/2026", budgets:2, transactions:18 },
  { id:4, nom_utilisateur:"meriem.bouzid",   email:"meriem@email.com",  role:"utilisateur", statut:"inactif", created:"10/04/2026", budgets:4, transactions:7  },
  { id:5, nom_utilisateur:"nawres.bennassib",email:"nawres@email.com",  role:"admin",       statut:"actif",   created:"01/01/2026", budgets:6, transactions:88 },
  { id:6, nom_utilisateur:"sami.bk",         email:"sami@email.com",    role:"utilisateur", statut:"actif",   created:"20/05/2026", budgets:1, transactions:12 },
];

const AV_COLORS = ["#7C3AED","#10B981","#F59E0B","#EF4444","#3B82F6"];
function getAv(name) {
  const c = AV_COLORS[name.charCodeAt(0) % AV_COLORS.length];
  return { c, initials: name.split(/[._]/).map(p=>p[0]?.toUpperCase()).join("").slice(0,2) };
}

export default function Users() {
  const [users, setUsers]     = useState([]);
  const [search, setSearch]   = useState("");
  const [roleFilter, setRole] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get("/utilisateurs")
      .then(res => setUsers(res.data))
      .catch(() => setUsers(SAMPLE))
      .finally(() => setLoading(false));
  }, []);

  const list = (users.length ? users : SAMPLE)
    .filter(u => roleFilter==="all" || u.role===roleFilter)
    .filter(u =>
      u.nom_utilisateur?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    );

  const totalUsers  = (users.length ? users : SAMPLE).length;
  const admins      = (users.length ? users : SAMPLE).filter(u=>u.role==="admin").length;
  const inactifs    = (users.length ? users : SAMPLE).filter(u=>u.statut==="inactif").length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"var(--text)", letterSpacing:"-0.01em" }}>Utilisateurs</h1>
          <p style={{ fontSize:13, color:"var(--text2)", marginTop:4 }}>Gestion des comptes utilisateurs</p>
        </div>
        <button style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 18px", borderRadius:10, background:"var(--purple)", color:"#fff", fontSize:13, fontWeight:600, boxShadow:"0 2px 10px rgba(124,58,237,0.3)" }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Inviter utilisateur
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[
          { label:"Total utilisateurs", val:totalUsers, col:"#7C3AED", bg:"#EDE9FE", icon:"👥" },
          { label:"Administrateurs",     val:admins,     col:"#10B981", bg:"#D1FAE5", icon:"🛡️" },
          { label:"Comptes inactifs",    val:inactifs,   col:"#F59E0B", bg:"#FEF3C7", icon:"😴" },
        ].map(({label,val,col,bg,icon})=>(
          <div key={label} style={{ background:"#fff", borderRadius:"var(--r-lg)", border:"1px solid var(--border)", padding:"18px 22px", boxShadow:"var(--shadow)", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
            <div>
              <div style={{ fontSize:11.5, color:"var(--text3)" }}>{label}</div>
              <div style={{ fontSize:24, fontWeight:700, color:col, marginTop:2, letterSpacing:"-0.02em" }}>{val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background:"#fff", borderRadius:"var(--r-lg)", border:"1px solid var(--border)", boxShadow:"var(--shadow)", overflow:"hidden" }}>
        <div style={{ padding:"16px 22px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:12 }}>
          {/* Role filter tabs */}
          <div style={{ display:"flex", gap:6 }}>
            {["all","utilisateur","admin"].map(r=>(
              <button key={r} onClick={()=>setRole(r)} style={{
                padding:"6px 14px", borderRadius:8, fontSize:12.5,
                fontWeight: roleFilter===r ? 600 : 400,
                color: roleFilter===r ? "var(--purple)" : "var(--text2)",
                background: roleFilter===r ? "var(--purple-pale)" : "transparent",
                border: roleFilter===r ? "1px solid var(--border2)" : "1px solid transparent",
              }}>
                {r==="all"?"Tous":r==="admin"?"Admins":"Utilisateurs"}
              </button>
            ))}
          </div>
          <div style={{ flex:1 }}/>
          <div style={{ position:"relative" }}>
            <svg style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--text3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:30, paddingRight:12, paddingTop:7, paddingBottom:7, background:"var(--purple-bg)", border:"1px solid var(--border)", borderRadius:9, fontSize:12.5, color:"var(--text)", outline:"none", fontFamily:"var(--font)", width:200 }}/>
          </div>
          <span style={{ fontSize:12, color:"var(--text3)", background:"var(--purple-bg)", border:"1px solid var(--border)", padding:"7px 12px", borderRadius:8 }}>{list.length} résultat{list.length!==1?"s":""}</span>
        </div>

        {/* Head */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 80px 80px 80px 80px", padding:"10px 22px", background:"var(--purple-bg)", borderBottom:"1px solid var(--border)", fontSize:11, fontWeight:600, color:"var(--purple-light)", textTransform:"uppercase", letterSpacing:"0.06em" }}>
          <div>Utilisateur</div><div>Email</div><div>Rôle</div><div>Statut</div><div>Budgets</div><div>Transactions</div>
        </div>

        {loading ? (
          <div style={{ padding:40, textAlign:"center", color:"var(--text3)" }}>Chargement...</div>
        ) : list.map((u,i)=>{
          const { c, initials } = getAv(u.nom_utilisateur||"user");
          return (
            <div key={u.id} style={{
              display:"grid", gridTemplateColumns:"1fr 1fr 80px 80px 80px 80px",
              padding:"13px 22px", alignItems:"center",
              borderBottom: i<list.length-1?"1px solid var(--border)":"none",
              transition:"background 0.12s",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="var(--purple-bg)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:`${c}18`, border:`1.5px solid ${c}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:c, flexShrink:0 }}>{initials}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{u.nom_utilisateur}</div>
                  <div style={{ fontSize:11, color:"var(--text3)" }}>Depuis {u.created||"—"}</div>
                </div>
              </div>
              <span style={{ fontSize:13, color:"var(--text2)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{u.email}</span>
              <Badge label={u.role==="admin"?"Admin":"User"} variant={u.role==="admin"?"purple":"info"} />
              <Badge label={u.statut||"actif"} variant={u.statut==="inactif"?"warning":"success"} dot />
              <span style={{ fontSize:13, fontWeight:600, color:"var(--text)", textAlign:"center" }}>{u.budgets??"-"}</span>
              <span style={{ fontSize:13, fontWeight:600, color:"var(--text)", textAlign:"center" }}>{u.transactions??"-"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
