import { Check } from "lucide-react";

export const Footer = () => (
  <div className="border-t border-border mt-12 pt-6 pb-8">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-foreground mb-2">Your advantage with Surebird</p>
        <ul className="space-y-1">
          {["Lowest price for your coverage", "Automatic annual comparison", "Independent advice"].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-success shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">★ Trustpilot</span>
        <span className="text-sm font-bold text-foreground">4.3</span>
        <span className="text-xs text-muted-foreground">Excellent</span>
      </div>
    </div>
  </div>
);

