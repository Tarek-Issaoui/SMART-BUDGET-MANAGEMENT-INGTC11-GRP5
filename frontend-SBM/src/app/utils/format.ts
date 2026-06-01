export function formatTND(amount: number): string {
  return amount.toLocaleString("fr-TN", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }) + " DT";
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

export function pct(spent: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(Math.round((spent / total) * 100), 100);
}

export function pctRaw(spent: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((spent / total) * 100);
}
