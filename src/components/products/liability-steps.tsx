/**
 * Liability insurance — single consolidated card with smart defaults.
 */
import type { ProductStepProps } from "@/config/products/types";
import type { ComponentType } from "react";
import { Info } from "lucide-react";
import { TacoMessage } from "@/components/onboarding/taco-message";
import { SectionCard, SegmentedControl } from "./shared-ui";
import { LIABILITY_OPTIONS } from "@/config/products/liability";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ─── Reusable info tooltip ─── */

const InfoTip = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Info className="w-4 h-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-64 text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/* ─── Single consolidated step ─── */

import { useT } from "@/i18n/LanguageContext";
import { translateOptions } from "@/i18n/option-translate";

const StepLiabilityAll = ({ state, onUpdate, animateTaco, onAnimationComplete }: ProductStepProps) => {
  const t = useT();
  return (
    <div className="space-y-6">
      <TacoMessage
        message={t("ui.products.liability.taco", undefined, "Liability insurance is a small step that covers big accidents. I've pre-filled the most common choices for you—do these look right?")}
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />
      <SectionCard>
        <div className="space-y-6">
          {/* Dog Insurance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">
                {t("products.liability.dog.q", undefined, "Do you want to insure your dog(s)?")}
              </p>
              <InfoTip text={t("ui.products.liability.dog_tip", undefined, "Pets are not insured by default. Choose 'Yes' if you want to co-insure dog(s).")} />
            </div>
            <SegmentedControl
              options={translateOptions(t, "liability", LIABILITY_OPTIONS.dogOptions)}
              value={state.dog ? translateOptions(t, "liability", [state.dog])[0] : ""}
              onChange={(v) => {
                const idx = translateOptions(t, "liability", LIABILITY_OPTIONS.dogOptions).indexOf(v);
                onUpdate("dog", LIABILITY_OPTIONS.dogOptions[idx] ?? v);
              }}
            />
          </div>

          {/* Damage Limit */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">
                {t("products.liability.damageLimit.q", undefined, "Choose your preferred damage limit")}
              </p>
              <InfoTip text={t("ui.products.liability.damage_limit_tip", undefined, "Unfortunately, insurers do not cover any damage without a limit. Claims above €1.25 million are quite rare, but the difference in premium is very small. For extra bit of certainty, you can choose €2.5 million.")} />
            </div>
            <SegmentedControl
              options={[...LIABILITY_OPTIONS.damageLimitOptions]}
              value={state.damageLimit}
              onChange={(v) => onUpdate("damageLimit", v)}
            />
          </div>

        </div>
      </SectionCard>
    </div>
  );
};

/* ─── Component map ─── */

export const LIABILITY_STEP_COMPONENTS: Record<string, ComponentType<ProductStepProps>> = {
  "liability-all": StepLiabilityAll,
};
