import { useState } from "react";
import { INSURANCE_TYPES } from "./types";
import type { InsuranceType } from "./types";
import { useT } from "@/i18n/LanguageContext";
import tacoAvatar from "@/assets/taco-avatar.jpg";
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
  upsellSelections: string[];
  onToggle: (id: string) => void;
  onHoveredProduct?: (product: InsuranceType | null) => void;
  animateTaco?: boolean;
}

export const StepUpsell = ({ selectedInsurances, upsellSelections, onToggle, onHoveredProduct, animateTaco }: StepUpsellProps) => {
  const t = useT();
  const unselected = INSURANCE_TYPES.filter((t) => !selectedInsurances.includes(t.id));
  const potentialSavings = unselected.reduce((sum, t) => sum + t.savings, 0);
  const tacoText = t("ui.upsell.taco", { amount: potentialSavings }, `Bundle more, save more! Add products now and unlock up to €${potentialSavings} in additional savings.`);
  const parts = tacoText.split(`€${potentialSavings}`);

  return (
    <div className="animate-fade-in">
      {/* Custom Taco message with green-highlighted savings */}
      <div className="flex items-center gap-3 mb-6">
        <img
          src={tacoAvatar}
          alt="Taco"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <p className="text-base font-semibold text-foreground">
          {parts[0]}
          <span className="text-success">€{potentialSavings}</span>
          {parts[1] ?? ""}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {unselected.map((ins) => {
          const isChecked = upsellSelections.includes(ins.id);
          return (
            <button
              key={ins.id}
              onClick={() => onToggle(ins.id)}
              onMouseEnter={() => onHoveredProduct?.(ins)}
              onMouseLeave={() => onHoveredProduct?.(null)}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all text-left hover:shadow-md ${
                isChecked
                  ? "border-[#0385FF] bg-[#0385FF]/10 shadow-md"
                  : "border-border bg-card hover:border-[#0385FF]/40"
              }`}
            >
              <img src={ICON_MAP[ins.icon]} alt={ins.label} className="w-10 h-10" />
              <span className="font-medium text-foreground flex-1">{t(`home.label.${ins.id}`, undefined, ins.label)}</span>
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
