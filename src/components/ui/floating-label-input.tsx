import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== "";

    return (
      <div className="relative">
        <input
          ref={ref}
          value={value}
          placeholder=" "
          className={cn(
            "peer flex h-12 w-full rounded-2xl border-2 border-input bg-white px-4 pt-5 pb-1 text-base text-foreground ring-offset-background hover:border-muted-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        />
        <label
          className={cn(
            "pointer-events-none absolute left-4 text-muted-foreground transition-all duration-200",
            hasValue
              ? "top-2 text-xs"
              : "top-1/2 -translate-y-1/2 text-base peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
