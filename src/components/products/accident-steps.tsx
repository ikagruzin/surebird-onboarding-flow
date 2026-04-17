/**
 * Accidents insurance — single consolidated card with smart defaults.
 */
import type { ProductStepProps } from "@/config/products/types";
import type { ComponentType } from "react";
import { Info } from "lucide-react";
import { TacoMessage } from "@/components/onboarding/taco-message";
import { SectionCard, SegmentedControl } from "./shared-ui";
import { ACCIDENT_OPTIONS } from "@/config/products/accidents";
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

const StepAccidentAll = ({ state, onUpdate, animateTaco, onAnimationComplete }: ProductStepProps) => {
  const t = useT();
  return (
    <div className="space-y-6">
      <TacoMessage
        message={t("ui.products.accidents.taco", undefined, "Accidents happen, but the financial impact shouldn't be a surprise. I've pre-selected a balanced coverage level for you—does this feel right?")}
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />
      <SectionCard>
        <div className="space-y-6">
          {/* Coverage Level */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">
                {t("products.accidents.coverage.q", undefined, "Your coverage level")}
              </p>
              <InfoTip text={t("ui.products.accidents.coverage_tip", undefined, "Insurers use a scale: for the most severe forms of disability, you receive 100% of the benefit. In less serious forms, you get a part of the amount. In the Netherlands, a funeral costs €7,000 to €10,000. If you want to have that covered, at least choose the second option.")} />
            </div>
            <SegmentedControl
              options={[...ACCIDENT_OPTIONS.coverageOptions]}
              value={state.coverage}
              onChange={(v) => onUpdate("coverage", v)}
            />
          </div>

        </div>
      </SectionCard>
    </div>
  );
};

/* ─── Component map ─── */

export const ACCIDENT_STEP_COMPONENTS: Record<string, ComponentType<ProductStepProps>> = {
  "accidents-all": StepAccidentAll,
};
