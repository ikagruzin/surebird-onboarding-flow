/**
 * Accidents insurance — single consolidated card with smart defaults.
 */
import type { ProductStepProps } from "@/config/products/types";
import type { ComponentType } from "react";
import { TacoMessage } from "@/components/onboarding/taco-message";
import { SectionCard, SegmentedControl } from "./shared-ui";
import { ACCIDENT_OPTIONS } from "@/config/products/accidents";

/* ─── Single consolidated step ─── */

const StepAccidentAll = ({ state, onUpdate, animateTaco, onAnimationComplete }: ProductStepProps) => (
  <div className="space-y-6">
    <TacoMessage
      message="Accidents happen, but the financial impact shouldn't be a surprise. I've pre-selected a balanced coverage level for you—does this feel right?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />
    <SectionCard>
      <div className="space-y-6">
        {/* Coverage Level */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Choose your coverage level</p>
          <SegmentedControl
            options={[...ACCIDENT_OPTIONS.coverageOptions]}
            value={state.coverage}
            onChange={(v) => onUpdate("coverage", v)}
          />
        </div>

        {/* Own Risk */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">What do you want to be your own risk?</p>
          <SegmentedControl
            options={[...ACCIDENT_OPTIONS.ownRiskOptions]}
            value={state.ownRisk}
            onChange={(v) => onUpdate("ownRisk", v)}
          />
        </div>
      </div>
    </SectionCard>
  </div>
);

/* ─── Component map ─── */

export const ACCIDENT_STEP_COMPONENTS: Record<string, ComponentType<ProductStepProps>> = {
  "accidents-all": StepAccidentAll,
};
