import type { ProductConfig } from "./types";

/* ─── Option arrays ─── */

export const LIABILITY_OPTIONS = {
  dogOptions: ["No", "Yes"],
  damageLimitOptions: ["€1,250,000", "€2,250,000"],
  ownRiskOptions: ["€100", "€0"],
} as const;

/* ─── State shape ─── */

export interface LiabilityState {
  dog: string;
  damageLimit: string;
  ownRisk: string;
}

/* ─── Config ─── */

export const liabilityProduct: ProductConfig = {
  id: "liability",
  label: "Liability",
  icon: "icon-liability",

  initialState: {
    dog: "No",
    damageLimit: "€1,250,000",
    ownRisk: "€100",
  } satisfies LiabilityState as Record<string, any>,

  presetState: {
    dog: "No",
    damageLimit: "€1,250,000",
    ownRisk: "€100",
  },

  stepDefs: [
    { id: "liability-all", label: "Liability" },
  ],

  getStepSequence(_state) {
    return ["liability-all"];
  },

  validateStep(stepId, state) {
    if (stepId === "liability-all") {
      return state.dog !== "" && state.damageLimit !== "";
    }
    return false;
  },
};
