/**
 * Liability insurance — single consolidated card with smart defaults.
 */
import type { ProductStepProps } from "@/config/products/types";
import type { ComponentType } from "react";
import { TacoMessage } from "@/components/onboarding/taco-message";
import { SectionCard, SegmentedControl } from "./shared-ui";
import { LIABILITY_OPTIONS } from "@/config/products/liability";

/* ─── Single consolidated step ─── */

const StepLiabilityAll = ({ state, onUpdate, animateTaco, onAnimationComplete }: ProductStepProps) => (
  <div className="space-y-6">
    <TacoMessage
      message="Liability insurance is a small step that covers big accidents. I've pre-filled the most common choices for you—do these look right?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />
    <SectionCard>
      <div className="space-y-6">
        {/* Dog Insurance */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Do you want to insure your dog?</p>
          <SegmentedControl
            options={[...LIABILITY_OPTIONS.dogOptions]}
            value={state.dog}
            onChange={(v) => onUpdate("dog", v)}
          />
        </div>

        {/* Damage Limit */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Choose your preferred damage limit</p>
          <SegmentedControl
            options={[...LIABILITY_OPTIONS.damageLimitOptions]}
            value={state.damageLimit}
            onChange={(v) => onUpdate("damageLimit", v)}
          />
        </div>

        {/* Own Risk */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">What do you want to be your own risk?</p>
          <SegmentedControl
            options={[...LIABILITY_OPTIONS.ownRiskOptions]}
            value={state.ownRisk}
            onChange={(v) => onUpdate("ownRisk", v)}
          />
        </div>
      </div>
    </SectionCard>
  </div>
);

/* ─── Component map ─── */

export const LIABILITY_STEP_COMPONENTS: Record<string, ComponentType<ProductStepProps>> = {
  "liability-all": StepLiabilityAll,
};
