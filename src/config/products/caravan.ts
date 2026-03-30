import type { ProductConfig } from "./types";

/* ─── Option arrays ─── */

export const CARAVAN_OPTIONS = {
  caravanTypes: ["Mobile home", "Touring caravan", "Folding trailer"],
  usageOptions: [
    "Recreational, personal use only",
    "Recreational, occasional rental",
    "Permanently inhabited by you",
    "Business, rental to third parties",
  ],
  identificationMethods: ["License plate", "Chassis number", "Pass On Later"],
  lengthOptions: ["Up to 5m", "5-7m", "7-10m", "10-15m", "More than 15m"],
  brandOptions: [
    "Hobby", "Fendt", "Knaus", "Dethleffs", "Adria",
    "Bürstner", "Hymer", "Caravelair", "Eriba", "Other",
  ],
  conditionOptions: ["Brand New", "Used"],
} as const;

/* ─── State shape ─── */

export interface CaravanState {
  // Step 1: Context & Usage
  caravanType: string;
  usage: string;
  usedAsMobileHome: string;
  nearFloodRiver: string;
  // Step 2: Vehicle Specs
  identificationMethod: string;
  licensePlate: string;
  chassisNumber: string;
  brand: string;
  yearOfConstruction: string;
  length: string;
  specsLoading: boolean;
  // Step 3: Financial
  condition: string;
  catalogueValue: string;
  purchaseValue: string;
}

/* ─── Config ─── */

export const caravanProduct: ProductConfig = {
  id: "caravan",
  label: "Caravan",
  icon: "icon-caravan",

  initialState: {
    caravanType: "",
    usage: "",
    usedAsMobileHome: "",
    nearFloodRiver: "",
    identificationMethod: "License plate",
    licensePlate: "",
    chassisNumber: "",
    brand: "",
    yearOfConstruction: "",
    length: "",
    specsLoading: false,
    condition: "",
    catalogueValue: "",
    purchaseValue: "",
  } satisfies CaravanState as Record<string, any>,

  stepDefs: [
    { id: "caravan-context", label: "Context & Usage" },
    { id: "caravan-specs", label: "Vehicle Specs" },
    { id: "caravan-financial", label: "Financial" },
  ],

  getStepSequence() {
    return ["caravan-context", "caravan-specs", "caravan-financial"];
  },

  validateStep(stepId, state) {
    switch (stepId) {
      case "caravan-context": {
        if (!state.caravanType || !state.usage) return false;
        const showMobileQ = state.caravanType === "Touring caravan" || state.caravanType === "Folding trailer";
        if (showMobileQ && !state.usedAsMobileHome) return false;
        const showFloodQ = state.caravanType === "Mobile home" || state.usedAsMobileHome === "Yes";
        if (showFloodQ && !state.nearFloodRiver) return false;
        return true;
      }
      case "caravan-specs":
        return !!(state.brand && state.yearOfConstruction && state.length);
      case "caravan-financial": {
        if (!state.condition || !state.catalogueValue) return false;
        if (state.condition === "Used" && !state.purchaseValue) return false;
        return true;
      }
      default:
        return false;
    }
  },
};
