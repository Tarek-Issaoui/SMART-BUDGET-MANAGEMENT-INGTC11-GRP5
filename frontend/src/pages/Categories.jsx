import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Page.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ nom: "", type: "depense" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const { data } = await api.get("/categories/");
      setCategories(data);
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/categories/", form);
      setForm({ nom: "", type: "depense" });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Catégories</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate("/budgets")}>Budgets</button>
          <button className="btn-logout" onClick={logout}>Déconnexion</button>
        </div>
      </header>

      <div className="card">
        <h3>Nouvelle catégorie</h3>
        {error && <p className="form-error">{error}</p>}
        <form className="inline-form" onSubmit={handleCreate}>
          <input
            placeholder="Nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            required
          />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="depense">Dépense</option>
            <option value="revenu">Revenu</option>
          </select>
          <button type="submit" className="btn-primary">Ajouter</button>
        </form>
      </div>

      <div className="card">
        <h3>Liste des catégories</h3>
        {categories.length === 0 ? (
          <p className="empty">Aucune catégorie.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Nom</th><th>Type</th><th>Action</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.nom}</td>
                  <td>
                    <span className={`badge badge-${c.type}`}>{c.type}</span>
                  </td>
                  <td>
                    <button className="btn-danger-sm" onClick={() => handleDelete(c.id)}>Supprimer</button>
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
