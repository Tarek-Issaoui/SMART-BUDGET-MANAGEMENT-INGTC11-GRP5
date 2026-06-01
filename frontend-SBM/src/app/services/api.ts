import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string) => {
    const form = new URLSearchParams({ username: email, password });
    const { data } = await api.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data as { access_token: string; token_type: string };
  },
  register: async (payload: { nom_utilisateur: string; email: string; mot_de_passe: string }) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  me: async () => {
    const { data } = await api.get("/utilisateurs/me");
    return data;
  },
};

// ── Categories ────────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: async () => { const { data } = await api.get("/categories/"); return data; },
  create: async (payload: { nom: string; type: "revenu" | "depense" }) => {
    const { data } = await api.post("/categories/", payload); return data;
  },
  delete: async (id: number) => { await api.delete(`/categories/${id}`); },
};

// ── Budgets ───────────────────────────────────────────────────────────────────
export const budgetsApi = {
  getAll: async () => { const { data } = await api.get("/budgets/"); return data; },
  create: async (payload: object) => { const { data } = await api.post("/budgets/", payload); return data; },
  update: async (id: number, payload: object) => { const { data } = await api.put(`/budgets/${id}`, payload); return data; },
  delete: async (id: number) => { await api.delete(`/budgets/${id}`); },
};

// ── Transactions ──────────────────────────────────────────────────────────────
export const transactionsApi = {
  getAll: async () => { const { data } = await api.get("/transactions/"); return data; },
  create: async (payload: object) => { const { data } = await api.post("/transactions/", payload); return data; },
  delete: async (id: number) => { await api.delete(`/transactions/${id}`); },
};

// ── Groupes ───────────────────────────────────────────────────────────────────
export const groupesApi = {
  getAll: async () => { const { data } = await api.get("/groupes/"); return data; },
  create: async (payload: { nom: string }) => { const { data } = await api.post("/groupes/", payload); return data; },
  delete: async (id: number) => { await api.delete(`/groupes/${id}`); },
  addMembre: async (groupeId: number, payload: { utilisateur_id: number; role?: string }) => {
    const { data } = await api.post(`/groupes/${groupeId}/membres`, payload); return data;
  },
  removeMembre: async (groupeId: number, utilisateurId: number) => {
    await api.delete(`/groupes/${groupeId}/membres/${utilisateurId}`);
  },
  getMembres: async (groupeId: number) => { const { data } = await api.get(`/groupes/${groupeId}/membres`); return data; },
};

// ── Utilisateurs ──────────────────────────────────────────────────────────────
export const utilisateursApi = {
  getAll: async () => { const { data } = await api.get("/utilisateurs"); return data; },
};

// ── Alertes ───────────────────────────────────────────────────────────────────
export const alertesApi = {
  getAll: async () => { const { data } = await api.get("/alertes/"); return data; },
  markAsRead: async (id: number) => { const { data } = await api.patch(`/alertes/${id}/lu`); return data; },
  delete: async (id: number) => { await api.delete(`/alertes/${id}`); },
};

export default api;
