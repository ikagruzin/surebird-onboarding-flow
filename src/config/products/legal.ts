import type { ProductConfig } from "./types";

/* ─── Coverage options (shared with UI) ─── */

export const LEGAL_COVERAGE_OPTIONS = [
  { id: "consumer", label: "Consumer", mandatory: true },
  { id: "housing", label: "Housing" },
  { id: "work_income", label: "Work & Income" },
  { id: "traffic", label: "Traffic" },
  { id: "own_vehicle", label: "Own Vehicle" },
  { id: "tax_wealth", label: "Tax & Wealth" },
  { id: "mediation", label: "Mediation" },
] as const;

/* ─── State shape ─── */

export interface LegalState {
  coverageModules: string[]; // array of coverage option ids
}

/* ─── Config ─── */

export const legalProduct: ProductConfig = {
  id: "legal",
  label: "Legal expenses",
  icon: "icon-legal",

  initialState: {
    coverageModules: ["consumer"],
  } satisfies LegalState as Record<string, any>,

  presetState: {
    coverageModules: ["consumer"],
  },

  stepDefs: [
    { id: "legal-all", label: "Legal expenses" },
  ],

  getStepSequence(_state) {
    return ["legal-all"];
  },

  validateStep(stepId, state) {
    if (stepId === "legal-all") {
      return Array.isArray(state.coverageModules) && state.coverageModules.length > 0;
    }
    return false;
  },
};
