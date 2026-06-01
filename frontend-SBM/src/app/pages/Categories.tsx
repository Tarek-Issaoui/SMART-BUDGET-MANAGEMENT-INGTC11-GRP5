import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { TypeBadge } from "../components/ui/badge";
import { Modal } from "../components/ui/Modal";
import { LabeledInput, LabeledSelect } from "../components/ui/input";
import type { CategoryType } from "../data/types";
import { getCatMeta, setCatMeta } from "../utils/catMeta";

const ICONS = ["💼", "💻", "📈", "🏠", "🛒", "🚗", "💊", "🎭", "📚", "⚡", "🍕", "👕", "✈️", "💰", "🏋️", "🎵", "📱", "🎮", "🐾", "🎁"];
const COLORS = ["#7C3AED", "#059669", "#DC2626", "#D97706", "#2563EB", "#0891B2", "#BE185D", "#9333EA", "#1D4ED8", "#B45309"];

const emptyForm = { nom: "", type: "depense" as CategoryType, icon: "📋", color: COLORS[0] };

export function Categories() {
  const { categories, addCategory, deleteCategory, transactions } = useApp();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [delConfirm, setDelConfirm] = useState<number | null>(null);
  const [tab, setTab] = useState<"tous" | CategoryType>("tous");

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.nom) return;
    setCatMeta(form.nom, { icon: form.icon, color: form.color });
    await addCategory(form.nom, form.type);
    setModal(false);
    setForm({ ...emptyForm });
  };

  const filtered = tab === "tous" ? categories : categories.filter(c => c.type === tab);
  const txCount = (id: number) => transactions.filter(t => t.categorie_id === id).length;

  const revenue = categories.filter(c => c.type === "revenu");
  const depense = categories.filter(c => c.type === "depense");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Catégories</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{revenue.length} revenus · {depense.length} dépenses</p>
        </div>
        <button onClick={() => { setForm({ ...emptyForm }); setModal(true); }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
          <Plus size={16} /> Nouvelle catégorie
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["tous", "revenu", "depense"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize transition-colors ${tab === t ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
            {t === "depense" ? "dépense" : t}
          </button>
        ))}
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(c => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: (c.color ?? "#7C3AED") + "18" }}>
              {c.icon ?? "📋"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-foreground text-sm">{c.nom}</p>
                <TypeBadge type={c.type} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{txCount(c.id)} transaction(s)</p>
            </div>
            <button onClick={() => setDelConfirm(c.id)}
              className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-3 text-center py-10">Aucune catégorie</p>
        )}
      </div>

      {/* Add modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Nouvelle catégorie">
        <div className="space-y-4">
          <LabeledInput label="Nom" value={form.nom} onChange={e => f("nom", e.target.value)} placeholder="ex. Alimentation" />
          <LabeledSelect label="Type" value={form.type} onChange={e => f("type", e.target.value)}>
            <option value="revenu">Revenu</option>
            <option value="depense">Dépense</option>
          </LabeledSelect>

          {/* Icon picker */}
          <div className="space-y-1.5">
            <label className="text-sm text-foreground">Icône (affichage local)</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(icon => (
                <button key={icon} onClick={() => f("icon", icon)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-colors ${form.icon === icon ? "bg-primary/20 ring-2 ring-primary" : "bg-muted hover:bg-secondary"}`}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: form.color + "20" }}>
              {form.icon}
            </div>
            <div>
              <p className="text-foreground text-sm">{form.nom || "Nom de la catégorie"}</p>
              <TypeBadge type={form.type} />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={() => setModal(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">Annuler</button>
            <button onClick={handleSubmit} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">Créer</button>
          </div>
        </div>
      </Modal>

      <Modal open={delConfirm !== null} onClose={() => setDelConfirm(null)} title="Supprimer la catégorie" size="sm">
        <p className="text-muted-foreground text-sm mb-5">Cette catégorie sera supprimée.</p>
        <div className="flex gap-3">
          <button onClick={() => setDelConfirm(null)} className="flex-1 py-2 border border-border rounded-lg text-sm">Annuler</button>
          <button onClick={async () => { await deleteCategory(delConfirm!); setDelConfirm(null); }}
            className="flex-1 py-2 bg-destructive text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  );
}
