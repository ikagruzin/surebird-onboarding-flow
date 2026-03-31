import { useState } from "react";
import { ShoppingBag, Home, Briefcase, Car, KeyRound, TrendingUp, Scale, Building2, ChevronDown, ChevronUp, Check } from "lucide-react";

interface LegalCoverageOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  locked?: boolean;
}

const LEGAL_OPTIONS: LegalCoverageOption[] = [
  {
    id: "consumer",
    label: "Consumer",
    description: "Conflicts over broken goods or services. For example, a conflict with an internet provider. This coverage is always included.",
    icon: ShoppingBag,
    badge: "Included",
    locked: true,
  },
  {
    id: "housing",
    label: "Housing",
    description: "Neighbor quarrels, conflicts that arise when buying/selling or renting a home, or during a renovation.",
    icon: Home,
    badge: "85% pick this",
  },
  {
    id: "work_income",
    label: "Work & Income",
    description: "Legal aid regarding work and income: disputes with employers, benefit disputes, or pension entitlement issues.",
    icon: Briefcase,
    badge: "72% pick this",
  },
  {
    id: "traffic",
    label: "Traffic",
    description: "Disputes arising from participation in traffic as a driver, pedestrian, or cyclist. Recommended if you travel regularly.",
    icon: Car,
    badge: "65% pick this",
  },
  {
    id: "home_owners",
    label: "Home owners",
    description: "Legal disputes related to buildings you own, outside your own home.",
    icon: Building2,
  },
  {
    id: "own_vehicle",
    label: "Own Vehicle",
    description: "Legal disputes specifically related to vehicles you own.",
    icon: KeyRound,
  },
  {
    id: "tax_wealth",
    label: "Tax & Wealth",
    description: "Assistance with disputes about investment products or with the tax authorities. Recommended for entrepreneurs or active investors.",
    icon: TrendingUp,
  },
  {
    id: "mediation",
    label: "Mediation",
    description: "Covers mediator costs for divorces or separations. Recommended if you are married or have young children.",
    icon: Scale,
  },
];

const INITIAL_VISIBLE = 3;

interface LegalCoverageSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const LegalCoverageSelector = ({ selected, onChange }: LegalCoverageSelectorProps) => {
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
            {/* Checkbox */}
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>

            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isSelected ? "bg-primary/15" : "bg-muted"
              }`}
            >
              <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">{opt.label}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{opt.description}</p>
            </div>

            {/* Badge */}
            {opt.badge && (
              <span
              className="absolute top-3 right-3 text-2xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap bg-primary/10 text-primary"
              >
                {opt.badge}
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
          Show more coverage
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      {showAll && LEGAL_OPTIONS.length > INITIAL_VISIBLE && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Show less
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export { LEGAL_OPTIONS };
