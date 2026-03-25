import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectionCardVariants = cva(
  "relative flex items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left transition-all cursor-pointer hover:border-muted-foreground/30",
  {
    variants: {
      selected: {
        true: "border-primary bg-primary/10 shadow-md",
        false: "border-border bg-card hover:border-primary/40",
      },
      size: {
        default: "px-5 py-4",
        sm: "px-4 py-3",
        lg: "px-6 py-5",
      },
    },
    defaultVariants: {
      selected: false,
      size: "default",
    },
  },
);

export interface SelectionCardProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    Omit<VariantProps<typeof selectionCardVariants>, "selected"> {
  selected?: boolean;
  /** Content displayed as the main label */
  label: string;
  /** Optional icon rendered before the label */
  icon?: React.ReactNode;
  /** Whether to show a radio indicator (circle) or checkbox indicator */
  indicator?: "radio" | "checkbox" | "none";
}

const SelectionCard = React.forwardRef<HTMLButtonElement, SelectionCardProps>(
  ({ className, selected = false, size, label, icon, indicator = "radio", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role={indicator === "radio" ? "radio" : indicator === "checkbox" ? "checkbox" : undefined}
        aria-checked={selected}
        className={cn(selectionCardVariants({ selected, size, className }))}
        {...props}
      >
        {/* Indicator */}
        {indicator === "radio" && (
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              selected ? "border-primary bg-primary" : "border-border bg-card"
            )}
          >
            {selected && <span className="h-2 w-2 rounded-full bg-white" />}
          </span>
        )}
        {indicator === "checkbox" && (
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
              selected ? "border-primary bg-primary" : "border-border bg-card"
            )}
          >
            {selected && (
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
        )}

        {/* Icon */}
        {icon && <span className="shrink-0">{icon}</span>}

        {/* Label */}
        <span className="flex-1 font-medium text-foreground">{label}</span>
      </button>
    );
  },
);
SelectionCard.displayName = "SelectionCard";

export { SelectionCard, selectionCardVariants };
