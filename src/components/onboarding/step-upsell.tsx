import { useState } from "react";
import { INSURANCE_TYPES } from "./types";
import { TacoMessage } from "./taco-message";
import iconLiability from "@/assets/icon-liability.svg";
import iconHome from "@/assets/icon-home.svg";
import iconCar from "@/assets/icon-car.svg";
import iconLegal from "@/assets/icon-legal.svg";
import iconAccidents from "@/assets/icon-accidents.svg";
import iconCaravan from "@/assets/icon-caravan.svg";
import iconTravel from "@/assets/icon-travel.svg";

const ICON_MAP: Record<string, string> = {
  Plane: iconTravel,
  Home: iconHome,
  Umbrella: iconLiability,
  Car: iconCar,
  Scale: iconLegal,
  Zap: iconAccidents,
  Caravan: iconCaravan,
};

interface StepUpsellProps {
  selectedInsurances: string[];
  onComplete: (newlyAdded: string[]) => void;
  animateTaco?: boolean;
}

export const StepUpsell = ({ selectedInsurances, onComplete, animateTaco }: StepUpsellProps) => {
  const unselected = INSURANCE_TYPES.filter((t) => !selectedInsurances.includes(t.id));
  const [newSelections, setNewSelections] = useState<string[]>([]);

  const toggle = (id: string) => {
    setNewSelections((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="animate-fade-in">
      <TacoMessage
        message="You're almost there! Add more products to your bundle and save even more."
        animate={animateTaco}
      />

      <h2 className="text-2xl font-bold text-foreground mb-6">
        Would you like to add anything else?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {unselected.map((ins) => {
          const isChecked = newSelections.includes(ins.id);
          return (
            <button
              key={ins.id}
              onClick={() => toggle(ins.id)}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all text-left hover:shadow-md ${
                isChecked
                  ? "border-[#0385FF] bg-[#0385FF]/10 shadow-md"
                  : "border-border bg-card hover:border-[#0385FF]/40"
              }`}
            >
              <img src={ICON_MAP[ins.icon]} alt={ins.label} className="w-10 h-10" />
              <span className="font-medium text-foreground flex-1">{ins.label}</span>
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isChecked ? "border-[#0385FF] bg-[#0385FF]" : "border-border"
                }`}
              >
                {isChecked && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
