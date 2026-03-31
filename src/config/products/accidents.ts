import type { ProductConfig } from "./types";

/* ─── Option arrays ─── */

export const ACCIDENT_OPTIONS = {
  coverageOptions: [
    "Death: €5,000 | Disability: €25,000",
    "Death: €10,000 | Disability: €50,000",
    "Death: €15,000 | Disability: €100,000",
    "Death: €20,000 | Disability: €150,000",
  ],
  ownRiskOptions: ["€100", "€250", "€500", "€0"],
} as const;

/* ─── State shape ─── */

export interface AccidentState {
  coverage: string;
  ownRisk: string;
}

/* ─── Config ─── */

export const accidentsProduct: ProductConfig = {
  id: "accidents",
  label: "Accidents",
  icon: "icon-accidents",

  initialState: {
    coverage: "Death: €5,000 | Disability: €25,000",
    ownRisk: "€100",
  } satisfies AccidentState as Record<string, any>,

  presetState: {
    coverage: "Death: €5,000 | Disability: €25,000",
    ownRisk: "€100",
  },

  stepDefs: [
    { id: "accidents-all", label: "Accidents" },
  ],

  getStepSequence(_state) {
    return ["accidents-all"];
  },

  validateStep(stepId, state) {
    if (stepId === "accidents-all") {
      return state.coverage !== "" && state.ownRisk !== "";
    }
    return false;
  },
};
