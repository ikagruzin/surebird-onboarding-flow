import { Plane, Home, Umbrella, Car, Scale, Zap, Caravan, ChevronRight } from "lucide-react";
import { INSURANCE_TYPES } from "./types";

const ICON_MAP: Record<string, React.ReactNode> = {
  Plane: <Plane className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  Umbrella: <Umbrella className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Caravan: <Caravan className="w-5 h-5" />,
};

interface StepOneProps {
  selected: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
}

const StepOne = ({ selected, onToggle, onNext }: StepOneProps) => {
  const totalSavings = INSURANCE_TYPES.filter((t) => selected.includes(t.id)).reduce(
    (sum, t) => sum + t.savings,
    0
  );

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
        Choose your insurances
      </h1>
      <p className="text-muted-foreground mb-8">
        Smartly insured: save up to €280 a year on a package of 6 insurances!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
        {INSURANCE_TYPES.map((ins) => {
          const isSelected = selected.includes(ins.id);
          return (
            <button
              key={ins.id}
              onClick={() => onToggle(ins.id)}
              className={`flex items-center gap-3 px-5 py-4 rounded-lg border transition-all text-left ${
                isSelected
                  ? "border-primary bg-info-light shadow-sm"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <span className="text-foreground">{ICON_MAP[ins.icon]}</span>
              <span className="font-medium text-foreground flex-1">{ins.label}</span>
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "border-primary bg-primary" : "border-border"
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {totalSavings > 0 && (
        <div className="mt-6 text-sm font-medium text-success animate-fade-in">
          Estimated savings: €{totalSavings}/year
        </div>
      )}

      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3 rounded-lg font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          Next step
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StepOne;
