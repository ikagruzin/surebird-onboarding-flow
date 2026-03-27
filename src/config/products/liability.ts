import type { ProductConfig } from "./types";

/* ─── Option arrays ─── */

export const LIABILITY_OPTIONS = {
  dogOptions: ["No", "Yes"],
  damageLimitOptions: ["€1,250,000", "€2,250,000"],
  ownRiskOptions: ["€100", "No excess"],
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
    dog: "",
    damageLimit: "",
    ownRisk: "",
  } satisfies LiabilityState as Record<string, any>,

  presetState: {
    dog: "No",
    damageLimit: "€2,250,000",
    ownRisk: "€100",
  },

  stepDefs: [
    { id: "dog", label: "Dog" },
    { id: "damage-limit", label: "Damage Limit" },
    { id: "own-risk", label: "Own Risk" },
  ],

  getStepSequence(_state) {
    return ["dog", "damage-limit", "own-risk"];
  },

  validateStep(stepId, state) {
    switch (stepId) {
      case "dog":
        return state.dog !== "";
      case "damage-limit":
        return state.damageLimit !== "";
      case "own-risk":
        return state.ownRisk !== "";
      default:
        return false;
    }
  },
};
