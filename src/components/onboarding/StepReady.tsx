import TacoMessage from "./TacoMessage";
import { INSURANCE_TYPES } from "./types";
import iconLiability from "@/assets/icon-liability.svg";
import iconHome from "@/assets/icon-home.svg";
import iconCar from "@/assets/icon-car.svg";
import iconLegal from "@/assets/icon-legal.svg";
import iconAccidents from "@/assets/icon-accidents.svg";
import iconCaravan from "@/assets/icon-caravan.svg";
import iconTravel from "@/assets/icon-travel.svg";

const ICON_MAP: Record<string, string> = {
  Umbrella: iconLiability,
  Home: iconHome,
  Plane: iconTravel,
  Car: iconCar,
  Scale: iconLegal,
  Zap: iconAccidents,
  Caravan: iconCaravan,
};

interface StepReadyProps {
  selectedInsurances: string[];
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
}

const StepReady = ({ selectedInsurances, onNext, onBack, animateTaco }: StepReadyProps) => {
  const selected = INSURANCE_TYPES.filter((t) =>
    selectedInsurances.includes(t.id)
  );

  return (
    <div className="animate-fade-in">
      <TacoMessage
        message="Amazing! 🙌 The first step has been completed successfully. Now it's time to set your preferences about your selected insurances in order to find the best deal for you."
        animate={animateTaco}
      />

      <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
        <div className="flex flex-wrap gap-2 mb-6">
          {selected.map((ins) => (
            <div
              key={ins.id}
              className="flex items-center gap-2 border border-border rounded-full px-4 py-2"
            >
              <img
                src={ICON_MAP[ins.icon]}
                alt={ins.label}
                className="w-5 h-5"
              />
              <span className="text-sm font-semibold text-foreground">
                {ins.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-sm font-semibold text-foreground">
          It will take ≈ 2-3 min
        </p>
      </div>
    </div>
  );
};

export default StepReady;
