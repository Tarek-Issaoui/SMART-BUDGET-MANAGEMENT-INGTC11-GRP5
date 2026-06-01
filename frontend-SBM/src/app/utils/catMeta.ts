// Maps category name → { icon, color } stored in localStorage
// Backend doesn't store these, so we persist them client-side

const KEY = "sbm_cat_meta";

const DEFAULTS: Record<string, { icon: string; color: string }> = {
  "Salaire":         { icon: "💼", color: "#059669" },
  "Freelance":       { icon: "💻", color: "#2563EB" },
  "Investissements": { icon: "📈", color: "#7C3AED" },
  "Remboursement":   { icon: "💰", color: "#0891B2" },
  "Loyer":           { icon: "🏠", color: "#DC2626" },
  "Alimentation":    { icon: "🛒", color: "#D97706" },
  "Transport":       { icon: "🚗", color: "#0891B2" },
  "Santé":           { icon: "💊", color: "#BE185D" },
  "Loisirs":         { icon: "🎭", color: "#9333EA" },
  "Éducation":       { icon: "📚", color: "#1D4ED8" },
  "Factures":        { icon: "⚡", color: "#B45309" },
  "Vêtements":       { icon: "👕", color: "#6D28D9" },
  "Restaurants":     { icon: "🍕", color: "#EA580C" },
  "Épargne":         { icon: "🏦", color: "#047857" },
};

function load(): Record<string, { icon: string; color: string }> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function save(data: Record<string, { icon: string; color: string }>) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getCatMeta(nom: string): { icon: string; color: string } {
  const stored = load();
  return stored[nom] ?? DEFAULTS[nom] ?? { icon: "📋", color: "#7C3AED" };
}

export function setCatMeta(nom: string, meta: { icon: string; color: string }) {
  const stored = load();
  stored[nom] = meta;
  save(stored);
}
