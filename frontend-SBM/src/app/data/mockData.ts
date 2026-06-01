import type { User, Group, Category, Budget, Transaction, Alert } from "./types";

export const mockUsers: User[] = [
  { id: "u1", name: "Amine Belhaj", email: "amine@exemple.tn", avatar: "AB" },
  { id: "u2", name: "Sarra Mansouri", email: "sarra@exemple.tn", avatar: "SM" },
  { id: "u3", name: "Karim Trabelsi", email: "karim@exemple.tn", avatar: "KT" },
  { id: "u4", name: "Nadia Gharbi", email: "nadia@exemple.tn", avatar: "NG" },
];

export const mockGroups: Group[] = [
  { id: "g1", name: "Famille Belhaj", description: "Budget familial mensuel", memberIds: ["u1", "u2"], createdAt: "2026-01-10" },
  { id: "g2", name: "Startup TechTN", description: "Dépenses d'entreprise", memberIds: ["u1", "u3", "u4"], createdAt: "2026-02-15" },
  { id: "g3", name: "Colocation Manar", description: "Charges communes", memberIds: ["u2", "u3"], createdAt: "2026-03-01" },
];

export const mockCategories: Category[] = [
  { id: "c1", name: "Salaire", type: "revenu", color: "#059669", icon: "💼" },
  { id: "c2", name: "Freelance", type: "revenu", color: "#2563EB", icon: "💻" },
  { id: "c3", name: "Investissements", type: "revenu", color: "#7C3AED", icon: "📈" },
  { id: "c4", name: "Loyer", type: "dépense", color: "#DC2626", icon: "🏠" },
  { id: "c5", name: "Alimentation", type: "dépense", color: "#D97706", icon: "🛒" },
  { id: "c6", name: "Transport", type: "dépense", color: "#0891B2", icon: "🚗" },
  { id: "c7", name: "Santé", type: "dépense", color: "#BE185D", icon: "💊" },
  { id: "c8", name: "Loisirs", type: "dépense", color: "#9333EA", icon: "🎭" },
  { id: "c9", name: "Éducation", type: "dépense", color: "#1D4ED8", icon: "📚" },
  { id: "c10", name: "Factures", type: "dépense", color: "#B45309", icon: "⚡" },
];

export const mockBudgets: Budget[] = [
  { id: "b1", name: "Budget Alimentation Mai", amount: 800, spent: 620, period: "mensuel", startDate: "2026-05-01", endDate: "2026-05-31", categoryId: "c5", groupId: "g1", createdBy: "u1" },
  { id: "b2", name: "Budget Transport", amount: 300, spent: 310, period: "mensuel", startDate: "2026-05-01", endDate: "2026-05-31", categoryId: "c6", createdBy: "u1" },
  { id: "b3", name: "Budget Loisirs Été", amount: 1200, spent: 450, period: "trimestriel", startDate: "2026-04-01", endDate: "2026-06-30", categoryId: "c8", createdBy: "u1" },
  { id: "b4", name: "Dépenses Startup", amount: 5000, spent: 3800, period: "mensuel", startDate: "2026-05-01", endDate: "2026-05-31", categoryId: "c9", groupId: "g2", createdBy: "u3" },
  { id: "b5", name: "Charges Colocation", amount: 600, spent: 580, period: "mensuel", startDate: "2026-05-01", endDate: "2026-05-31", categoryId: "c4", groupId: "g3", createdBy: "u2" },
  { id: "b6", name: "Budget Santé Annuel", amount: 2000, spent: 780, period: "annuel", startDate: "2026-01-01", endDate: "2026-12-31", categoryId: "c7", createdBy: "u1" },
];

export const mockTransactions: Transaction[] = [
  { id: "t1", description: "Salaire mai 2026", amount: 3200, type: "revenu", categoryId: "c1", date: "2026-05-01", createdBy: "u1" },
  { id: "t2", description: "Mission Freelance – Nexio Corp", amount: 1500, type: "revenu", categoryId: "c2", budgetId: undefined, date: "2026-05-05", createdBy: "u1" },
  { id: "t3", description: "Loyer appartement mai", amount: 850, type: "dépense", categoryId: "c4", budgetId: "b5", groupId: "g3", date: "2026-05-05", createdBy: "u1" },
  { id: "t4", description: "Marché Centrale – Légumes", amount: 87.5, type: "dépense", categoryId: "c5", budgetId: "b1", groupId: "g1", date: "2026-05-08", createdBy: "u1" },
  { id: "t5", description: "Carburant – Station Total", amount: 95, type: "dépense", categoryId: "c6", budgetId: "b2", date: "2026-05-09", createdBy: "u1" },
  { id: "t6", description: "Pharmacie Centrale", amount: 42, type: "dépense", categoryId: "c7", budgetId: "b6", date: "2026-05-10", createdBy: "u1" },
  { id: "t7", description: "Cinema City Stars", amount: 28, type: "dépense", categoryId: "c8", budgetId: "b3", date: "2026-05-12", createdBy: "u1" },
  { id: "t8", description: "Dividendes portefeuille", amount: 220, type: "revenu", categoryId: "c3", date: "2026-05-14", createdBy: "u1" },
  { id: "t9", description: "Facture STEG", amount: 65, type: "dépense", categoryId: "c10", date: "2026-05-15", createdBy: "u1" },
  { id: "t10", description: "Carrefour Market", amount: 135, type: "dépense", categoryId: "c5", budgetId: "b1", groupId: "g1", date: "2026-05-16", createdBy: "u2" },
  { id: "t11", description: "Abonnement Coursera", amount: 180, type: "dépense", categoryId: "c9", budgetId: "b4", groupId: "g2", date: "2026-05-17", createdBy: "u3" },
  { id: "t12", description: "Restaurant La Goulette", amount: 75, type: "dépense", categoryId: "c8", budgetId: "b3", date: "2026-05-18", createdBy: "u1" },
  { id: "t13", description: "Taxi Bolt", amount: 22, type: "dépense", categoryId: "c6", budgetId: "b2", date: "2026-05-20", createdBy: "u1" },
  { id: "t14", description: "Mission Freelance – AlphaTech", amount: 900, type: "revenu", categoryId: "c2", date: "2026-05-22", createdBy: "u1" },
  { id: "t15", description: "Facture SONEDE", amount: 38, type: "dépense", categoryId: "c10", date: "2026-05-25", createdBy: "u1" },
];

export const mockAlerts: Alert[] = [
  { id: "a1", title: "Budget dépassé – Transport", message: "Votre budget Transport de 300,000 DT a été dépassé de 10,000 DT ce mois-ci.", severity: "critique", budgetId: "b2", read: false, createdAt: "2026-05-20T10:30:00" },
  { id: "a2", title: "Alerte 80% – Alimentation", message: "Vous avez consommé 77,5% de votre budget Alimentation. Il vous reste 180,000 DT.", severity: "avertissement", budgetId: "b1", read: false, createdAt: "2026-05-18T09:00:00" },
  { id: "a3", title: "Budget Startup à 76%", message: "Les dépenses de la Startup TechTN atteignent 76% du budget mensuel alloué.", severity: "avertissement", budgetId: "b4", read: true, createdAt: "2026-05-17T14:15:00" },
  { id: "a4", title: "Charges colocation proches limite", message: "Le budget Charges Colocation est à 96,7%. Vérifiez les dépenses restantes.", severity: "critique", budgetId: "b5", read: false, createdAt: "2026-05-25T08:45:00" },
  { id: "a5", title: "Nouveau membre – Famille Belhaj", message: "Sarra Mansouri a été ajoutée au groupe Famille Belhaj.", severity: "info", read: true, createdAt: "2026-05-10T11:00:00" },
  { id: "a6", title: "Budget Loisirs bien géré", message: "Votre budget Loisirs Été est à 37,5% à mi-période. Bonne maîtrise !", severity: "info", budgetId: "b3", read: true, createdAt: "2026-05-15T16:00:00" },
];

export const monthlyFlow = [
  { mois: "Déc", revenus: 4200, dépenses: 3100 },
  { mois: "Jan", revenus: 4800, dépenses: 3400 },
  { mois: "Fév", revenus: 4500, dépenses: 2900 },
  { mois: "Mar", revenus: 5100, dépenses: 3600 },
  { mois: "Avr", revenus: 4700, dépenses: 3200 },
  { mois: "Mai", revenus: 5820, dépenses: 3518 },
];
