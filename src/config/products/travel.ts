import type { ProductConfig } from "./types";

/* ─── State shape ─── */

export interface TravelState {
  coverageArea: "europe" | "world" | "";
  insuredParty: "myself" | "partner" | "family" | "";
  medicalExpenses: boolean;
  cancellation: boolean;
  winterSports: boolean;
  businessTrips: boolean;
  luggageCoverage: string;
  ownRisk: string;
}

/* ─── Config ─── */

export const travelProduct: ProductConfig = {
  id: "travel",
  label: "Travel",
  icon: "icon-travel",

  initialState: {
    coverageArea: "",
    insuredParty: "",
    medicalExpenses: true,
    cancellation: false,
    winterSports: false,
    businessTrips: false,
    luggageCoverage: "€1,500",
    ownRisk: "",
  } satisfies TravelState as Record<string, any>,

  stepDefs: [
    { id: "context", label: "Who & Where" },
    { id: "supplements", label: "Supplements" },
    { id: "safety-net", label: "Baggage & Risk" },
  ],

  getStepSequence() {
    return ["context", "supplements", "safety-net"];
  },

  validateStep(stepId, state) {
    switch (stepId) {
      case "context":
        return !!(state.coverageArea && state.insuredParty);
      case "supplements":
        return true; // all optional (medical pre-selected but user can toggle)
      case "safety-net":
        return !!(state.luggageCoverage && state.ownRisk);
      default:
        return false;
    }
  },
};
