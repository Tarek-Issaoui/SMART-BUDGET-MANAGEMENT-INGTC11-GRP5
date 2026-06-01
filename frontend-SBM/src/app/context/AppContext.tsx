import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User, Groupe, Category, Budget, Transaction, Alerte } from "../data/types";
import { authApi, categoriesApi, budgetsApi, transactionsApi, groupesApi, alertesApi } from "../services/api";
import { getCatMeta, setCatMeta } from "../utils/catMeta";

interface AppState {
  currentUser: User | null;
  groups: Groupe[];
  categories: Category[];
  budgets: Budget[];
  transactions: Transaction[];
  alerts: Alerte[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // Groups
  addGroup: (nom: string) => Promise<void>;
  deleteGroup: (id: number) => Promise<void>;
  // Categories
  addCategory: (nom: string, type: "revenu" | "depense") => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  // Budgets
  addBudget: (payload: object) => Promise<void>;
  updateBudget: (id: number, payload: object) => Promise<void>;
  deleteBudget: (id: number) => Promise<void>;
  // Transactions
  addTransaction: (payload: object) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  // Alerts
  markAlertRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Groupe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      const [cats, buds, txs, grps, alts] = await Promise.all([
        categoriesApi.getAll(),
        budgetsApi.getAll(),
        transactionsApi.getAll(),
        groupesApi.getAll(),
        alertesApi.getAll(),
      ]);
      setCategories(cats.map((c: Category) => ({ ...c, ...getCatMeta(c.nom) })));
      // Compute spent per budget from transactions
      const budgetsWithSpent = buds.map((b: Budget) => ({
        ...b,
        spent: txs
          .filter((t: Transaction) => t.budget_id === b.id && t.type === "depense")
          .reduce((sum: number, t: Transaction) => sum + t.montant, 0),
      }));
      setBudgets(budgetsWithSpent);
      setTransactions(txs);
      setGroups(grps);
      setAlerts(alts);
    } catch {
      // silently fail if not authenticated
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then((user) => { setCurrentUser(user); return loadAll(); })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { access_token } = await authApi.login(email, password);
      localStorage.setItem("token", access_token);
      const user = await authApi.me();
      setCurrentUser(user);
      await loadAll();
      return true;
    } catch {
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await authApi.register({ nom_utilisateur: name, email, mot_de_passe: password });
      return await login(email, password);
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setGroups([]); setCategories([]); setBudgets([]); setTransactions([]); setAlerts([]);
  };

  const addGroup = async (nom: string) => {
    const g = await groupesApi.create({ nom });
    setGroups(prev => [...prev, g]);
  };

  const deleteGroup = async (id: number) => {
    await groupesApi.delete(id);
    setGroups(prev => prev.filter(g => g.id !== id));
  };

  const addCategory = async (nom: string, type: "revenu" | "depense") => {
    const c = await categoriesApi.create({ nom, type });
    setCategories(prev => [...prev, c]);
  };

  const deleteCategory = async (id: number) => {
    await categoriesApi.delete(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addBudget = async (payload: object) => {
    const b = await budgetsApi.create(payload);
    setBudgets(prev => [...prev, { ...b, spent: 0 }]);
  };

  const updateBudget = async (id: number, payload: object) => {
    const b = await budgetsApi.update(id, payload);
    setBudgets(prev => prev.map(x => x.id === id ? { ...b, spent: x.spent } : x));
  };

  const deleteBudget = async (id: number) => {
    await budgetsApi.delete(id);
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const addTransaction = async (payload: object) => {
    const t = await transactionsApi.create(payload);
    setTransactions(prev => [t, ...prev]);
    if ((t as Transaction).budget_id && (t as Transaction).type === "depense") {
      setBudgets(prev => prev.map(b =>
        b.id === (t as Transaction).budget_id
          ? { ...b, spent: (b.spent ?? 0) + (t as Transaction).montant }
          : b
      ));
    }
  };

  const deleteTransaction = async (id: number) => {
    await transactionsApi.delete(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const markAlertRead = async (id: number) => {
    const updated = await alertesApi.markAsRead(id);
    setAlerts(prev => prev.map(a => a.id === id ? updated : a));
  };

  const markAllRead = async () => {
    const unread = alerts.filter(a => !a.est_lu);
    await Promise.all(unread.map(a => alertesApi.markAsRead(a.id)));
    setAlerts(prev => prev.map(a => ({ ...a, est_lu: true })));
  };

  const refresh = loadAll;

  return (
    <AppContext.Provider value={{
      currentUser, groups, categories, budgets, transactions, alerts, loading,
      login, register, logout,
      addGroup, deleteGroup,
      addCategory, deleteCategory,
      addBudget, updateBudget, deleteBudget,
      addTransaction, deleteTransaction,
      markAlertRead, markAllRead,
      refresh,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
