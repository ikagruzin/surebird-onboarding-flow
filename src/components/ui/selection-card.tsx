import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const selectionCardVariants = cva(
  "relative flex items-center gap-3 rounded-xl border-2 px-4 h-12 text-left transition-all cursor-pointer shadow-sm",
  {
    variants: {
      selected: {
        true: "border-primary bg-primary/5",
        false: "border-border bg-card hover:border-muted-foreground/30",
      },
      size: {
        default: "px-4",
        sm: "px-3",
        lg: "px-5",
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
  /** Optional icon rendered after the label (e.g. info tooltip) */
  rightIcon?: React.ReactNode;
  /** Whether to show a radio indicator (circle) or checkbox indicator */
  indicator?: "radio" | "checkbox" | "none";
}

const SelectionCard = React.forwardRef<HTMLButtonElement, SelectionCardProps>(
  ({ className, selected = false, size, label, icon, rightIcon, indicator = "radio", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role={indicator === "radio" ? "radio" : indicator === "checkbox" ? "checkbox" : undefined}
        aria-checked={selected}
        className={cn(selectionCardVariants({ selected, size, className }))}
        {...props}
      >
        {indicator === "radio" && (
          <span
            className={cn(
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              selected ? "border-primary" : "border-muted-foreground/40"
            )}
          >
            {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
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
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
        {rightIcon && (
          <span className="shrink-0" onClick={(e) => e.stopPropagation()}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);
SelectionCard.displayName = "SelectionCard";

export { SelectionCard, selectionCardVariants };
