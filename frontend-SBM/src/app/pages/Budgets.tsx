import { useState } from "react";
import { Plus, Edit2, Trash2, Users } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ProgressBar } from "../components/ui/ProgressBar";
import { PeriodBadge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { LabeledInput, LabeledSelect } from "../components/ui/Input";
import type { Budget, BudgetPeriode } from "../data/types";

function formatTND(n: number) {
  return n.toLocaleString("fr-TN", { minimumFractionDigits: 3 }) + " DT";
}

const emptyForm = {
  nom: "", montant: "", periode: "mensuel" as BudgetPeriode,
  date_debut: new Date().toISOString().split("T")[0],
  date_fin: new Date().toISOString().split("T")[0],
  categorie_id: "", groupe_id: "",
};

export function Budgets() {
  const { budgets, categories, groups, addBudget, updateBudget, deleteBudget } = useApp();
  const [modal, setModal] = useState<false | "add" | "edit">(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [delConfirm, setDelConfirm] = useState<number | null>(null);
  const [filter, setFilter] = useState<"tous" | BudgetPeriode>("tous");

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => {
    setForm({ ...emptyForm, categorie_id: String(categories.find(c => c.type === "depense")?.id ?? "") });
    setEditing(null); setModal("add");
  };
  const openEdit = (b: Budget) => {
    setForm({
      nom: b.nom, montant: String(b.montant), periode: b.periode,
      date_debut: b.date_debut, date_fin: b.date_fin,
      categorie_id: String(b.categorie_id ?? ""), groupe_id: String(b.groupe_id ?? ""),
    });
    setEditing(b); setModal("edit");
  };

  const handleSubmit = async () => {
    if (!form.nom || !form.montant || !form.categorie_id) return;
    const payload = {
      nom: form.nom, montant: Number(form.montant), periode: form.periode,
      date_debut: form.date_debut, date_fin: form.date_fin,
      categorie_id: Number(form.categorie_id),
      groupe_id: form.groupe_id ? Number(form.groupe_id) : null,
    };
    if (modal === "add") await addBudget(payload);
    else if (editing) await updateBudget(editing.id, payload);
    setModal(false);
  };

  const filtered = filter === "tous" ? budgets : budgets.filter(b => b.periode === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Budgets</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{budgets.length} budgets actifs</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
          <Plus size={16} /> Nouveau budget
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["tous", "hebdomadaire", "mensuel", "annuel"] as const).map(p => (
          <button key={p} onClick={() => setFilter(p)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize transition-colors ${filter === p ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
            {p}
          </button>
        ))}
      </div>

      {/* Budget cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(b => {
          const cat = categories.find(c => c.id === b.categorie_id);
          const grp = groups.find(g => g.id === b.groupe_id);
          const spent = b.spent ?? 0;
          const p = b.montant ? Math.min(Math.round((spent / b.montant) * 100), 100) : 0;
          const over = spent > b.montant;

          return (
            <div key={b.id} className={`bg-card border rounded-xl p-5 hover:shadow-md transition-shadow ${over ? "border-red-200" : "border-border"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat?.icon ?? "📋"}</span>
                  <div>
                    <p className="text-foreground text-sm leading-tight">{b.nom}</p>
                    <p className="text-muted-foreground text-xs">{cat?.nom}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(b)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDelConfirm(b.id)} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">Dépensé / Alloué</span>
                  <span className={`text-xs ${over ? "text-red-600" : "text-muted-foreground"}`}
                    style={{ fontFamily: "'JetBrains Mono'" }}>
                    {formatTND(spent)} / {formatTND(b.montant)}
                  </span>
                </div>
                <ProgressBar value={p} showLabel />
                {over && <p className="text-xs text-red-600">Dépassement de {formatTND(spent - b.montant)}</p>}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <PeriodBadge period={b.periode} />
                <div className="flex items-center gap-2">
                  {grp && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users size={12} /> {grp.nom}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{b.date_fin}</span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-3 text-center py-10">Aucun budget</p>
        )}
      </div>

      {/* Add/Edit modal */}
      <Modal open={!!modal} onClose={() => setModal(false)} title={modal === "add" ? "Nouveau budget" : "Modifier le budget"}>
        <div className="space-y-4">
          <LabeledInput label="Nom du budget" value={form.nom} onChange={e => f("nom", e.target.value)} placeholder="ex. Budget Alimentation" />
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Montant (DT)" type="number" step="0.001" value={form.montant} onChange={e => f("montant", e.target.value)} placeholder="0.000" />
            <LabeledSelect label="Période" value={form.periode} onChange={e => f("periode", e.target.value)}>
              <option value="hebdomadaire">Hebdomadaire</option>
              <option value="mensuel">Mensuel</option>
              <option value="annuel">Annuel</option>
            </LabeledSelect>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Date de début" type="date" value={form.date_debut} onChange={e => f("date_debut", e.target.value)} />
            <LabeledInput label="Date de fin" type="date" value={form.date_fin} onChange={e => f("date_fin", e.target.value)} />
          </div>
          <LabeledSelect label="Catégorie" value={form.categorie_id} onChange={e => f("categorie_id", e.target.value)}>
            <option value="">-- Sélectionner --</option>
            {categories.filter(c => c.type === "depense").map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.nom}</option>
            ))}
          </LabeledSelect>
          <LabeledSelect label="Groupe (optionnel)" value={form.groupe_id} onChange={e => f("groupe_id", e.target.value)}>
            <option value="">Aucun groupe</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
          </LabeledSelect>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">Annuler</button>
            <button onClick={handleSubmit} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
              {modal === "add" ? "Créer" : "Enregistrer"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={delConfirm !== null} onClose={() => setDelConfirm(null)} title="Supprimer le budget" size="sm">
        <p className="text-muted-foreground text-sm mb-5">Cette action est irréversible.</p>
        <div className="flex gap-3">
          <button onClick={() => setDelConfirm(null)} className="flex-1 py-2 border border-border rounded-lg text-sm">Annuler</button>
          <button onClick={async () => { await deleteBudget(delConfirm!); setDelConfirm(null); }}
            className="flex-1 py-2 bg-destructive text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  );
}
