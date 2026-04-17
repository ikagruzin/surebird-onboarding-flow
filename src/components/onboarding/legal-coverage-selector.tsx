import { useState } from "react";
import { ShoppingBag, Home, Briefcase, Car, KeyRound, TrendingUp, Scale, Building2, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

interface LegalCoverageOption {
  id: string;
  icon: React.ElementType;
  badgeKey?: string;
  locked?: boolean;
}

const LEGAL_OPTIONS: LegalCoverageOption[] = [
  { id: "consumer", icon: ShoppingBag, badgeKey: "products.legal.cov.badge.included", locked: true },
  { id: "housing", icon: Home, badgeKey: "products.legal.cov.badge.85" },
  { id: "work_income", icon: Briefcase, badgeKey: "products.legal.cov.badge.72" },
  { id: "traffic", icon: Car, badgeKey: "products.legal.cov.badge.65" },
  { id: "home_owners", icon: Building2 },
  { id: "own_vehicle", icon: KeyRound },
  { id: "tax_wealth", icon: TrendingUp },
  { id: "mediation", icon: Scale },
];

const INITIAL_VISIBLE = 3;

interface LegalCoverageSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const LegalCoverageSelector = ({ selected, onChange }: LegalCoverageSelectorProps) => {
  const t = useT();
  const [showAll, setShowAll] = useState(false);

  const visibleOptions = showAll ? LEGAL_OPTIONS : LEGAL_OPTIONS.slice(0, INITIAL_VISIBLE);

  const toggleOption = (id: string) => {
    if (id === "consumer") return;
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      {visibleOptions.map((opt) => {
        const isSelected = selected.includes(opt.id);
        const Icon = opt.icon;
        const isLocked = opt.locked;
        const label = t(`products.legal.cov.${opt.id}.title`);
        const description = t(`products.legal.cov.${opt.id}.desc`);
        const badge = opt.badgeKey ? t(opt.badgeKey) : null;

        return (
          <button
            key={opt.id}
            onClick={() => toggleOption(opt.id)}
            className={`relative flex items-start gap-4 w-full p-4 rounded-2xl border-2 transition-all text-left ${
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-muted-foreground/30"
            } ${isLocked ? "cursor-default" : "cursor-pointer"}`}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>

            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isSelected ? "bg-primary/15" : "bg-muted"
              }`}
            >
              <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">{label}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>

            {badge && (
              <span className="absolute top-3 right-3 text-2xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap bg-primary/10 text-primary">
                {badge}
              </span>
            )}
          </button>
        );
      })}

      {!showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {t("products.legal.show_more")}
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      {showAll && LEGAL_OPTIONS.length > INITIAL_VISIBLE && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {t("products.legal.show_less")}
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export { LEGAL_OPTIONS };
