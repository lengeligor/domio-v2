import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "brand" | "green" | "amber" | "red";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-bg-muted text-text-secondary",
  brand: "bg-brand-subtle text-brand",
  green: "bg-green-subtle text-green",
  amber: "bg-amber-subtle text-amber",
  red: "bg-red-subtle text-red",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
