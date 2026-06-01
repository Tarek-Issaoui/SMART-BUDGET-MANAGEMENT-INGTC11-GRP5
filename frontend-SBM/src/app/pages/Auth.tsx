import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Eye, EyeOff } from "lucide-react";

type Mode = "connexion" | "inscription";

export function Auth() {
  const { login, register, currentUser } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("connexion");

  useEffect(() => {
    if (currentUser) navigate("/", { replace: true });
  }, [currentUser, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let ok: boolean;
      if (mode === "connexion") {
        ok = await login(email, password);
      } else {
        if (!name.trim()) { setError("Le nom est requis."); return; }
        ok = await register(name, email, password);
      }
      if (ok) navigate("/");
      else setError("Identifiants invalides. Veuillez réessayer.");
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-1/2 p-12" style={{ backgroundColor: "#1E1B4B" }}>
        <div className="flex items-center gap-2.5 mb-auto">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white">GBI</span>
          </div>
          <span className="text-white text-lg">Gestion Budget Intelligent</span>
        </div>
        <div className="mb-auto">
          <h1 className="text-4xl text-white mb-4">
            Gérez vos finances<br />en toute simplicité
          </h1>
          <p className="text-purple-300 text-lg leading-relaxed">
            Budgets, dépenses, groupes et alertes — tout ce dont vous avez besoin pour maîtriser vos finances personnelles et collectives.
          </p>
        </div>
        <p className="text-purple-400 text-sm">© 2026 GBI</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-sm">₣</span>
            </div>
            <span className="text-foreground">GBI</span>
          </div>

          <h2 className="text-foreground mb-1">
            {mode === "connexion" ? "Connexion" : "Créer un compte"}
          </h2>
          <p className="text-muted-foreground text-sm mb-7">
            {mode === "connexion" ? "Accédez à votre espace financier" : "Commencez à gérer vos finances"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "inscription" && (
              <div className="space-y-1.5">
                <label className="text-sm text-foreground">Nom complet</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Votre nom" required
                  className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm text-foreground">Adresse e-mail</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="vous@exemple.tn" required
                className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-foreground">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary pr-10"
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button type="submit" disabled={submitting}
              className="w-full py-2.5 bg-primary text-white rounded-lg text-sm hover:bg-purple-700 transition-colors disabled:opacity-60">
              {submitting ? "Chargement..." : mode === "connexion" ? "Se connecter" : "Créer le compte"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "connexion" ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <button onClick={() => { setMode(m => m === "connexion" ? "inscription" : "connexion"); setError(""); }}
              className="text-primary hover:underline">
              {mode === "connexion" ? "S'inscrire" : "Se connecter"}
            </button>
          </div>

          {/* {mode === "connexion" && (
            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">Comptes de démonstration :</p>
              <div className="space-y-2">
                {[
                  { email: "tarek.issaoui@gmail.com", password: "0123tarek", name: "Tarek Issaoui",   role: "Admin" },
                  { email: "sarra.mansouri@gmail.com", password: "sarra2024", name: "Sarra Mansouri", role: "Membre" },
                  { email: "karim.trabelsi@gmail.com", password: "karim2024", name: "Karim Trabelsi", role: "Membre" },
                  { email: "nadia.gharbi@gmail.com",   password: "nadia2024", name: "Nadia Gharbi",   role: "Membre" },
                ].map(d => (
                  <button key={d.email}
                    onClick={() => { setEmail(d.email); setPassword(d.password); }}
                    className="w-full flex items-center gap-3 px-3 py-2 bg-muted rounded-lg hover:bg-secondary transition-colors text-left">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs flex-shrink-0 font-medium">
                      {d.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      d.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                    }`}>{d.role}</span>
                  </button>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
