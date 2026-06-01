import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { TypeBadge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { LabeledInput, LabeledSelect, LabeledTextarea } from "../components/ui/Input";
import type { Transaction, TransactionType } from "../data/types";

function formatTND(n: number) {
  return n.toLocaleString("fr-TN", { minimumFractionDigits: 3 }) + " DT";
}

const emptyForm = {
  description: "", montant: "", type: "depense" as TransactionType,
  categorie_id: "", budget_id: "", groupe_id: "",
  date: new Date().toISOString().split("T")[0],
};

export function Transactions() {
  const { transactions, categories, budgets, groups, addTransaction, deleteTransaction } = useApp();
  const [modal, setModal] = useState<false | "add">(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"tous" | TransactionType>("tous");
  const [catFilter, setCatFilter] = useState("");
  const [delConfirm, setDelConfirm] = useState<number | null>(null);

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => {
    setForm({ ...emptyForm, categorie_id: String(categories[0]?.id ?? "") });
    setModal("add");
  };

  const handleSubmit = async () => {
    if (!form.description || !form.montant || !form.categorie_id) return;
    await addTransaction({
      description: form.description,
      montant: Number(form.montant),
      type: form.type,
      categorie_id: Number(form.categorie_id),
      budget_id: form.budget_id ? Number(form.budget_id) : null,
      groupe_id: form.groupe_id ? Number(form.groupe_id) : null,
      date: form.date,
    });
    setModal(false);
  };

  const filtered = transactions.filter(t => {
    const matchSearch = (t.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "tous" || t.type === typeFilter;
    const matchCat = !catFilter || t.categorie_id === Number(catFilter);
    return matchSearch && matchType && matchCat;
  });

  const totalRev = filtered.filter(t => t.type === "revenu").reduce((s, t) => s + t.montant, 0);
  const totalDep = filtered.filter(t => t.type === "depense").reduce((s, t) => s + t.montant, 0);

  const availableCats = categories.filter(c =>
    form.type === "revenu" ? c.type === "revenu" : c.type === "depense"
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground">Transactions</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} transactions</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-emerald-200 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Revenus filtrés</p>
          <p className="text-emerald-600 text-lg" style={{ fontFamily: "'JetBrains Mono'" }}>+{formatTND(totalRev)}</p>
        </div>
        <div className="bg-card border border-red-200 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Dépenses filtrées</p>
          <p className="text-red-600 text-lg" style={{ fontFamily: "'JetBrains Mono'" }}>−{formatTND(totalDep)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Net</p>
          <p className={`text-lg ${totalRev - totalDep >= 0 ? "text-purple-700" : "text-red-600"}`}
            style={{ fontFamily: "'JetBrains Mono'" }}>
            {formatTND(totalRev - totalDep)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div className="flex gap-2">
          {(["tous", "revenu", "depense"] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${typeFilter === t ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
              {t === "depense" ? "dépense" : t}
            </button>
          ))}
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">Toutes catégories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.nom}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 text-xs text-muted-foreground">Description</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground">Catégorie</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground">Groupe</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground">Date</th>
                <th className="text-right px-5 py-3 text-xs text-muted-foreground">Montant</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">Aucune transaction trouvée</td></tr>
              ) : filtered.map(tx => {
                const cat = categories.find(c => c.id === tx.categorie_id);
                const grp = groups.find(g => g.id === tx.groupe_id);
                return (
                  <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-foreground">{tx.description ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <span>{cat?.icon}</span> {cat?.nom}
                      </span>
                    </td>
                    <td className="px-4 py-3.5"><TypeBadge type={tx.type} /></td>
                    <td className="px-4 py-3.5 text-muted-foreground text-xs">{grp?.nom ?? "—"}</td>
                    <td className="px-4 py-3.5 text-muted-foreground text-xs">{tx.date}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={tx.type === "revenu" ? "text-emerald-600" : "text-red-600"}
                        style={{ fontFamily: "'JetBrains Mono'" }}>
                        {tx.type === "revenu" ? "+" : "−"}{formatTND(tx.montant)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => setDelConfirm(tx.id)} className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      <Modal open={!!modal} onClose={() => setModal(false)} title="Nouvelle transaction" size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <LabeledInput label="Description" value={form.description} onChange={e => f("description", e.target.value)} placeholder="ex. Marché Central" />
          </div>
          <LabeledInput label="Montant (DT)" type="number" step="0.001" value={form.montant} onChange={e => f("montant", e.target.value)} placeholder="0.000" />
          <LabeledSelect label="Type" value={form.type} onChange={e => { f("type", e.target.value); f("categorie_id", ""); }}>
            <option value="revenu">Revenu</option>
            <option value="depense">Dépense</option>
          </LabeledSelect>
          <LabeledSelect label="Catégorie" value={form.categorie_id} onChange={e => f("categorie_id", e.target.value)}>
            <option value="">-- Sélectionner --</option>
            {availableCats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.nom}</option>)}
          </LabeledSelect>
          <LabeledInput label="Date" type="date" value={form.date} onChange={e => f("date", e.target.value)} />
          <LabeledSelect label="Budget lié (optionnel)" value={form.budget_id} onChange={e => f("budget_id", e.target.value)}>
            <option value="">Aucun budget</option>
            {budgets.map(b => <option key={b.id} value={b.id}>{b.nom}</option>)}
          </LabeledSelect>
          <LabeledSelect label="Groupe (optionnel)" value={form.groupe_id} onChange={e => f("groupe_id", e.target.value)}>
            <option value="">Aucun groupe</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
          </LabeledSelect>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={() => setModal(false)} className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">Annuler</button>
          <button onClick={handleSubmit} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">Ajouter</button>
        </div>
      </Modal>

      <Modal open={delConfirm !== null} onClose={() => setDelConfirm(null)} title="Supprimer la transaction" size="sm">
        <p className="text-muted-foreground text-sm mb-5">Êtes-vous sûr de vouloir supprimer cette transaction ?</p>
        <div className="flex gap-3">
          <button onClick={() => setDelConfirm(null)} className="flex-1 py-2 border border-border rounded-lg text-sm">Annuler</button>
          <button onClick={async () => { await deleteTransaction(delConfirm!); setDelConfirm(null); }}
            className="flex-1 py-2 bg-destructive text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
            Supprimer
          </button>
        </div>
      </Modal>
    </div>
  );
}
