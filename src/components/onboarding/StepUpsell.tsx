import { ChevronLeft, ChevronRight, Plus, Check, Plane, Home, Umbrella, Car, Scale, Zap, Caravan } from "lucide-react";
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

interface StepUpsellProps {
  selectedInsurances: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepUpsell = ({ selectedInsurances, onToggle, onNext, onBack }: StepUpsellProps) => {
  const unselected = INSURANCE_TYPES.filter((t) => !selectedInsurances.includes(t.id));
  const totalExtraSavings = unselected.reduce((s, t) => s + t.savings, 0);

  // Completed tabs for pill nav
  const selected = INSURANCE_TYPES.filter((t) => selectedInsurances.includes(t.id));

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm font-medium text-foreground border border-border rounded-lg px-4 py-2 mb-6 hover:bg-muted transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
        Specify your preferences
      </h1>

      {/* Pill tabs showing completed */}
      <div className="flex flex-wrap gap-2 mb-8">
        {selected.map((ins) => (
          <div
            key={ins.id}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium bg-card border border-border text-foreground"
          >
            <Check className="w-4 h-4 text-success" />
            {ins.label}
          </div>
        ))}
        <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center">
          <Plus className="w-4 h-4" />
        </div>
      </div>

      {unselected.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Save an extra €{totalExtraSavings}
          </h2>
          <div className="space-y-3 max-w-xl">
            {unselected.map((ins) => (
              <button
                key={ins.id}
                onClick={() => onToggle(ins.id)}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-all text-left"
              >
                <span className="text-foreground">{ICON_MAP[ins.icon]}</span>
                <span className="font-medium text-foreground flex-1">{ins.label}</span>
                <span className="text-sm font-semibold text-success">Save €{ins.savings}</span>
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3 rounded-full font-semibold text-base hover:opacity-90 transition-opacity"
        >
          Next step
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StepUpsell;
