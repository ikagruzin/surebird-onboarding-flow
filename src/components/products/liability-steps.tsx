/**
 * Step components for the Liability insurance product.
 * Each step renders inside ProductFlowTab via the shared engine.
 */
import type { ProductStepProps } from "@/config/products/types";
import type { ComponentType } from "react";
import { TacoMessage } from "@/components/onboarding/taco-message";
import { SectionCard, SegmentedControl } from "./shared-ui";
import { LIABILITY_OPTIONS } from "@/config/products/liability";

/* ─── Step: Dog ─── */

const StepDog = ({ state, onAutoAdvance, animateTaco, onAnimationComplete }: ProductStepProps) => (
  <div className="space-y-6">
    <TacoMessage
      message="Do you want to insure your dog?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />
    <SectionCard>
      <SegmentedControl
        options={[...LIABILITY_OPTIONS.dogOptions]}
        value={state.dog}
        onChange={(v) => onAutoAdvance({ dog: v }, "dog")}
      />
    </SectionCard>
  </div>
);

/* ─── Step: Damage Limit ─── */

const StepDamageLimit = ({ state, onAutoAdvance, animateTaco, onAnimationComplete }: ProductStepProps) => (
  <div className="space-y-6">
    <TacoMessage
      message="Choose your preferred damage limit"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />
    <SectionCard>
      <SegmentedControl
        options={[...LIABILITY_OPTIONS.damageLimitOptions]}
        value={state.damageLimit}
        onChange={(v) => onAutoAdvance({ damageLimit: v }, "damage-limit")}
      />
    </SectionCard>
  </div>
);

/* ─── Step: Own Risk ─── */

const StepOwnRisk = ({ state, onUpdate, animateTaco, onAnimationComplete }: ProductStepProps) => (
  <div className="space-y-6">
    <TacoMessage
      message="What do you want to be your own risk?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />
    <SectionCard>
      <SegmentedControl
        options={[...LIABILITY_OPTIONS.ownRiskOptions]}
        value={state.ownRisk}
        onChange={(v) => onUpdate("ownRisk", v)}
      />
    </SectionCard>
  </div>
);

/* ─── Component map ─── */

export const LIABILITY_STEP_COMPONENTS: Record<string, ComponentType<ProductStepProps>> = {
  "dog": StepDog,
  "damage-limit": StepDamageLimit,
  "own-risk": StepOwnRisk,
};
