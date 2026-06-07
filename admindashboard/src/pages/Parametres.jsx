import { useState } from "react";
import Card from "../components/Card";
import CardHeader from "../components/CardHeader";
import Badge from "../components/Badge";

const Section = ({ children }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:16 }}>{children}</div>
);

const Field = ({ label, sub, children }) => (
  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:24, padding:"16px 0", borderBottom:"1px solid var(--border)" }}>
    <div style={{ flex:1 }}>
      <div style={{ fontSize:13.5, fontWeight:500, color:"var(--text)" }}>{label}</div>
      {sub && <div style={{ fontSize:12, color:"var(--text3)", marginTop:2 }}>{sub}</div>}
    </div>
    <div style={{ flexShrink:0 }}>{children}</div>
  </div>
);

const Toggle = ({ on, onChange }) => (
  <div
    onClick={()=>onChange(!on)}
    style={{
      width:44, height:24, borderRadius:12,
      background: on?"var(--purple)":"#E5E7EB",
      position:"relative", cursor:"pointer",
      transition:"background 0.2s",
    }}>
    <div style={{
      position:"absolute", top:3, left: on?20:3,
      width:18, height:18, borderRadius:"50%",
      background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.15)",
      transition:"left 0.2s",
    }}/>
  </div>
);

export default function Parametres() {
  const [notifs, setNotifs]   = useState({ email:true, sms:false, alertes:true });
  const [theme,  setTheme]    = useState("light");
  const [lang,   setLang]     = useState("fr");

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h1 style={{ fontSize:22, fontWeight:700, color:"var(--text)", letterSpacing:"-0.01em" }}>Paramètres</h1>
        <p style={{ fontSize:13, color:"var(--text2)", marginTop:4 }}>Configuration de l'application</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:20 }}>
        {/* Sidebar nav */}
        <div>
          {[
            { label:"Profil",          icon:"👤" },
            { label:"Notifications",   icon:"🔔", active:true },
            { label:"Sécurité",        icon:"🔐" },
            { label:"Apparence",       icon:"🎨" },
            { label:"Langue & région", icon:"🌍" },
          ].map(({ label, icon, active }) => (
            <div key={label} style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"10px 12px", borderRadius:10, marginBottom:2,
              fontSize:13.5, fontWeight: active?600:400,
              color: active?"var(--purple)":"var(--text2)",
              background: active?"var(--purple-pale)":"transparent",
              cursor:"pointer",
              transition:"all 0.15s",
            }}
            onMouseEnter={e=>{ if(!active) e.currentTarget.style.background="var(--purple-bg)"; }}
            onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}
            >
              <span>{icon}</span>{label}
            </div>
          ))}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Profil card */}
          <Card>
            <CardHeader title="Informations du profil" />
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
              <div style={{
                width:64, height:64, borderRadius:"50%",
                background:"linear-gradient(135deg,#7C3AED,#A855F7)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:22, fontWeight:700, color:"#fff",
                boxShadow:"0 4px 16px rgba(124,58,237,0.3)",
              }}>NA</div>
              <div>
                <div style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>nawres</div>
                <div style={{ fontSize:12.5, color:"var(--text3)" }}>nawresbennassib@email.com</div>
                <Badge label="Super Admin" variant="purple" style={{ marginTop:6 }} />
              </div>
              <button style={{ marginLeft:"auto", fontSize:12, color:"var(--purple)", padding:"7px 14px", borderRadius:9, border:"1px solid var(--border2)", background:"var(--purple-pale)", fontWeight:500 }}>Modifier</button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { label:"Nom d'utilisateur", val:"nawres" },
                { label:"Email",             val:"nawresbennassib@email.com" },
                { label:"Rôle",              val:"Super Admin" },
                { label:"Membre depuis",     val:"01 janv. 2026" },
              ].map(({label,val})=>(
                <div key={label} style={{ background:"var(--purple-bg)", borderRadius:10, border:"1px solid var(--border)", padding:"12px 14px" }}>
                  <div style={{ fontSize:11, color:"var(--text3)", marginBottom:3 }}>{label}</div>
                  <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{val}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader title="Notifications" sub="Gérez comment vous recevez les alertes" />
            <Field label="Notifications par email" sub="Recevoir les alertes par email">
              <Toggle on={notifs.email} onChange={v=>setNotifs(p=>({...p,email:v}))}/>
            </Field>
            <Field label="Notifications SMS" sub="Recevoir les alertes par SMS">
              <Toggle on={notifs.sms} onChange={v=>setNotifs(p=>({...p,sms:v}))}/>
            </Field>
            <Field label="Alertes budget dépassé" sub="Notification immédiate si un budget est dépassé">
              <Toggle on={notifs.alertes} onChange={v=>setNotifs(p=>({...p,alertes:v}))}/>
            </Field>
          </Card>

          {/* Langue */}
          <Card>
            <CardHeader title="Langue & région" />
            <div style={{ display:"flex", gap:10 }}>
              {[{val:"fr",label:"🇫🇷 Français"},{val:"ar",label:"🇹🇳 Arabe"},{val:"en",label:"🇬🇧 English"}].map(({val,label})=>(
                <button key={val} onClick={()=>setLang(val)} style={{
                  padding:"9px 18px", borderRadius:9, fontSize:13,
                  fontWeight: lang===val ? 600 : 400,
                  color: lang===val ? "var(--purple)" : "var(--text2)",
                  background: lang===val ? "var(--purple-pale)" : "#fff",
                  border: lang===val ? "1.5px solid var(--purple)" : "1px solid var(--border)",
                  transition:"all 0.15s",
                }}>{label}</button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
