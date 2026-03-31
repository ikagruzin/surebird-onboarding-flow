import type { ProductConfig } from "./types";

/* ─── State shape ─── */

export interface TravelState {
  /* Step 1 – Foundations */
  travelDays: string;
  coverageArea: string;

  /* Step 2 – Sport & Equipment */
  playsSport: string;
  adventureSports: string;
  bringsEquipment: string;
  golfEquipment: string;
  divingEquipment: string;

  /* Step 3 – Supplements */
  supplements: string[];

  /** Injected by the orchestrator for cross-product badge logic */
  _selectedInsurances?: string[];
}

/* ─── Config ─── */

export const travelProduct: ProductConfig = {
  id: "travel",
  label: "Travel",
  icon: "icon-travel",

  initialState: {
    travelDays: "60",
    coverageArea: "Europe",

    playsSport: "",
    adventureSports: "No",
    bringsEquipment: "No",
    golfEquipment: "No",
    divingEquipment: "No",

    supplements: ["medical"],

    _selectedInsurances: [],
  } satisfies TravelState as Record<string, any>,

  stepDefs: [
    { id: "foundations", label: "Foundations" },
    { id: "sport", label: "Sport & Equipment" },
    { id: "supplements", label: "Supplements" },
  ],

  getStepSequence() {
    return ["foundations", "sport", "supplements"];
  },

  validateStep(stepId, state) {
    switch (stepId) {
      case "foundations":
        return !!(state.travelDays && state.coverageArea);
      case "sport":
        return !!state.playsSport;
      case "supplements":
        return true; // all optional
      default:
        return false;
    }
  },
};
