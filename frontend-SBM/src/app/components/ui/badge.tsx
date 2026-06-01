import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

const SeverityBadge = ({ severity }: { severity: string }) => {
  const severityMap: Record<string, { text: string; color: string }> = {
    low: { text: "Faible", color: "bg-green-100 text-green-800" },
    medium: { text: "Moyen", color: "bg-amber-100 text-amber-800" },
    high: { text: "Élevé", color: "bg-red-100 text-red-800" }
  };

  const severityInfo = severityMap[severity] || { text: "Inconnu", color: "bg-gray-100 text-gray-800" };


  return (
    <Badge variant="default" className={severityInfo.color}>
      {severityInfo.text}
    </Badge>
  );
};

function PeriodBadge({ period }: { period: string }) {
  const periodMap: Record<string, { text: string; color: string }> = {
    hebdomadaire: { text: "Hebdomadaire", color: "bg-purple-100 text-purple-800" },
    mensuel: { text: "Mensuel", color: "bg-indigo-100 text-indigo-800" },
    annuel: { text: "Annuel", color: "bg-pink-100 text-pink-800" }
  };

  const periodInfo = periodMap[period] || { text: "Inconnu", color: "bg-gray-100 text-gray-800" };

  return (
    <Badge variant="default" className={periodInfo.color}>
      {periodInfo.text}
    </Badge>
  );
}

function TypeBadge({ type }: { type: string }) {
  const typeMap: Record<string, { text: string; color: string }> = {
    "revenu": { text: "Revenu", color: "bg-emerald-100 text-emerald-800" },
    "depense": { text: "Dépense", color: "bg-red-100 text-red-800" }
  };

  const typeInfo = typeMap[type] || { text: "Inconnu", color: "bg-gray-100 text-gray-800" };

  return (
    <Badge variant="default" className={typeInfo.color}>
      {typeInfo.text}
    </Badge>
  );
}

export { Badge, badgeVariants, SeverityBadge, PeriodBadge, TypeBadge };
