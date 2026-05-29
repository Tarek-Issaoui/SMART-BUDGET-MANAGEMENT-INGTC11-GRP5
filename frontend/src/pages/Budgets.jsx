import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Page.css";

const empty = {
  nom: "", montant: "", periode: "mensuel",
  date_debut: "", date_fin: "", categorie_id: "",
};

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const [b, c] = await Promise.all([api.get("/budgets/"), api.get("/categories/")]);
      setBudgets(b.data);
      setCategories(c.data);
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = { ...form, montant: parseFloat(form.montant), categorie_id: form.categorie_id || null };
    try {
      if (editing) {
        await api.put(`/budgets/${editing}`, payload);
        setEditing(null);
      } else {
        await api.post("/budgets/", payload);
      }
      setForm(empty);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur.");
    }
  };

  const handleEdit = (b) => {
    setEditing(b.id);
    setForm({
      nom: b.nom, montant: b.montant, periode: b.periode,
      date_debut: b.date_debut, date_fin: b.date_fin,
      categorie_id: b.categorie_id ?? "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce budget ?")) return;
    await api.delete(`/budgets/${id}`);
    load();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Budgets</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate("/categories")}>Catégories</button>
          <button className="btn-logout" onClick={logout}>Déconnexion</button>
        </div>
      </header>

      <div className="card">
        <h3>{editing ? "Modifier le budget" : "Nouveau budget"}</h3>
        {error && <p className="form-error">{error}</p>}
        <form className="grid-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nom</label>
            <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
          </div>
          <div className="field">
            <label>Montant (DH)</label>
            <input type="number" min="0" step="0.01" value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value })} required />
          </div>
          <div className="field">
            <label>Période</label>
            <select value={form.periode} onChange={(e) => setForm({ ...form, periode: e.target.value })}>
              <option value="hebdomadaire">Hebdomadaire</option>
              <option value="mensuel">Mensuel</option>
              <option value="annuel">Annuel</option>
            </select>
          </div>
          <div className="field">
            <label>Catégorie</label>
            <select value={form.categorie_id} onChange={(e) => setForm({ ...form, categorie_id: e.target.value })}>
              <option value="">— Aucune —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nom} ({c.type})</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Date début</label>
            <input type="date" value={form.date_debut} onChange={(e) => setForm({ ...form, date_debut: e.target.value })} required />
          </div>
          <div className="field">
            <label>Date fin</label>
            <input type="date" value={form.date_fin} onChange={(e) => setForm({ ...form, date_fin: e.target.value })} required />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editing ? "Mettre à jour" : "Ajouter"}</button>
            {editing && (
              <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(empty); }}>
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Liste des budgets</h3>
        {budgets.length === 0 ? (
          <p className="empty">Aucun budget.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Nom</th><th>Montant</th><th>Période</th><th>Début</th><th>Fin</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {budgets.map((b) => (
                <tr key={b.id}>
                  <td>{b.nom}</td>
                  <td><strong>{b.montant} DH</strong></td>
                  <td><span className="badge badge-periode">{b.periode}</span></td>
                  <td>{b.date_debut}</td>
                  <td>{b.date_fin}</td>
                  <td className="actions-cell">
                    <button className="btn-edit-sm" onClick={() => handleEdit(b)}>Modifier</button>
                    <button className="btn-danger-sm" onClick={() => handleDelete(b.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
