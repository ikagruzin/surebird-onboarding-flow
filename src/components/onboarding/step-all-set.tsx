import { Check } from "lucide-react";
import { INSURANCE_TYPES } from "./types";
import { TacoMessage } from "./taco-message";
import { useT } from "@/i18n/LanguageContext";

interface StepAllSetProps {
  selectedInsurances: string[];
  firstName: string;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
}

export const StepAllSet = ({
  selectedInsurances,
  firstName,
  animateTaco,
}: StepAllSetProps) => {
  const t = useT();
  const products = INSURANCE_TYPES.filter((p) => selectedInsurances.includes(p.id));

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        message={t("ui.allSet.taco", { firstName: firstName || "there" })}
        animate={animateTaco}
      />

      <div className="rounded-3xl border-2 border-input bg-card p-6 space-y-5">
        <h3 className="text-lg font-semibold text-foreground">
          {t("ui.allSet.title", undefined, "All set!")}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("ui.allSet.subtitle", undefined, "We have everything we need to prepare your personal insurance offer. Here's what we'll be looking at:")}
        </p>

        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 py-2">
              <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-success" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {t(`home.label.${p.id}`, undefined, p.label)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {t("ui.allSet.footer", undefined, "After submitting, Taco will analyse the market and find the best deals for you. This usually takes about 25 seconds.")}
          </p>
        </div>
      </div>
    </div>
  );
};
