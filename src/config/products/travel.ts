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

  offerInitialState: {
    ownRisk: "100",
    extraSupport: "0",
  },

  offerCards: [
    {
      id: "own-risk",
      title: "Own risk",
      subtitle: "The amount you pay yourself when filing a claim. A higher own risk means a lower monthly premium.",
      source: "rest",
    },
    {
      id: "coverage",
      title: "Coverage",
      subtitle: "Select what should be covered during your trip. Medical expenses are always included.",
      source: "preferences",
      stepId: "supplements",
    },
    {
      id: "extra-support",
      title: "Extra support",
      subtitle: "Extra financial support on top of your standard coverage, for example in case of emergency repatriation.",
      source: "rest",
    },
    {
      id: "travel-details",
      title: "Travel details",
      subtitle: "How long and where you typically travel. This determines the scope of your coverage.",
      source: "preferences",
      stepId: "foundations",
    },
    {
      id: "sport",
      title: "Sport",
      subtitle: "Let us know about sports activities so we can make sure you are properly covered abroad.",
      source: "preferences",
      stepId: "sport",
    },
  ],

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

  getValidationErrors(stepId, state) {
    const errs: Record<string, string> = {};
    if (stepId === "sport") {
      if (!state.playsSport) errs.playsSport = "Please indicate if you play sports while travelling";
    }
    return errs;
  },
};
