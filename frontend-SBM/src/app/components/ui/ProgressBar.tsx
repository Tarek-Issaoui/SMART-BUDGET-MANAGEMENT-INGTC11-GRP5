interface ProgressBarProps {
  value: number; // 0–100
  showLabel?: boolean;
}

function barColor(v: number) {
  if (v >= 100) return "bg-red-500";
  if (v >= 80) return "bg-amber-500";
  return "bg-primary";
}

export function ProgressBar({ value, showLabel = false }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor(value)}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs tabular-nums w-9 text-right ${value >= 100 ? "text-red-600" : value >= 80 ? "text-amber-600" : "text-muted-foreground"}`}>
          {value}%
        </span>
      )}
    </div>
  );
}
