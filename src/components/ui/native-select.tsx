import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  children: React.ReactNode;
}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, value, placeholder, children, ...props }, ref) => {
    const hasValue = value !== undefined && value !== "";

    return (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          className={cn(
            "flex h-12 w-full appearance-none rounded-xl border-2 bg-white px-4 py-2 pr-10 text-sm font-medium text-foreground transition-colors focus:outline-none focus:border-primary",
            hasValue
              ? "border-primary bg-primary/5"
              : "border-input hover:border-muted-foreground/30 focus:hover:border-primary",
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    );
  }
);
NativeSelect.displayName = "NativeSelect";

export { NativeSelect };
