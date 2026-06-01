// ── Backend-aligned types ─────────────────────────────────────────────────────

export interface User {
  id: number;
  nom_utilisateur: string;
  email: string;
  role: "admin" | "membre";
  cree_le: string;
}

export interface Groupe {
  id: number;
  nom: string;
  cree_par: number;
  cree_le: string;
}

export interface MembreGroupe {
  groupe_id: number;
  utilisateur_id: number;
  role: "proprietaire" | "editeur" | "lecteur";
  rejoint_le: string;
}

export type CategoryType = "revenu" | "depense";

export interface Category {
  id: number;
  nom: string;
  type: CategoryType;
  utilisateur_id: number | null;
  // UI-only (not from backend)
  color?: string;
  icon?: string;
}

export type BudgetPeriode = "hebdomadaire" | "mensuel" | "annuel";

export interface Budget {
  id: number;
  nom: string;
  montant: number;
  periode: BudgetPeriode;
  date_debut: string;
  date_fin: string;
  categorie_id: number | null;
  utilisateur_id: number | null;
  groupe_id: number | null;
  // UI-only: computed from transactions
  spent?: number;
}

export type TransactionType = "revenu" | "depense";

export interface Transaction {
  id: number;
  montant: number;
  type: TransactionType;
  description: string | null;
  date: string;
  categorie_id: number;
  budget_id: number | null;
  utilisateur_id: number;
  groupe_id: number | null;
  cree_le: string;
}

export interface Alerte {
  id: number;
  budget_id: number;
  utilisateur_id: number;
  message: string | null;
  est_lu: boolean;
  cree_le: string;
}
