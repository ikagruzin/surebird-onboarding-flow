/**
 * Legal expenses insurance — single consolidated card with coverage selector.
 */
import type { ProductStepProps } from "@/config/products/types";
import type { ComponentType } from "react";
import { TacoMessage } from "@/components/onboarding/taco-message";
import { SectionCard } from "./shared-ui";
import { LegalCoverageSelector } from "@/components/onboarding/legal-coverage-selector";

/* ─── Single consolidated step ─── */

import { useT } from "@/i18n/LanguageContext";

const StepLegalAll = ({ state, onUpdate, animateTaco, onAnimationComplete }: ProductStepProps) => {
  const t = useT();
  return (
    <div className="space-y-6">
      <TacoMessage
        message={t("ui.products.legal.taco", undefined, "Legal expenses insurance gives you access to legal help when you need it most. Consumer coverage is always included—select any additional areas that matter to you.")}
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />
      <SectionCard>
        <LegalCoverageSelector
          selected={state.coverageModules || ["consumer"]}
          onChange={(selected) => onUpdate("coverageModules", selected)}
        />
      </SectionCard>
    </div>
  );
};

/* ─── Component map ─── */

export const LEGAL_STEP_COMPONENTS: Record<string, ComponentType<ProductStepProps>> = {
  "legal-all": StepLegalAll,
};
