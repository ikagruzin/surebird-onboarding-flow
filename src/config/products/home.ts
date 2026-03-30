import type { ProductConfig } from "./types";

/* ─── Option arrays ─── */

export const HOME_OPTIONS = {
  buildingTypes: [
    "Detached house", "Apartment", "Canal house", "Corner house",
    "Two-under-a-roof", "Townhouse", "Farmhouse",
  ],
  usageOptions: [
    "I live there", "Holiday home", "I rent it out",
    "Rental company for rooms", "Different",
  ],
  constructionMaterials: [
    "Wooden skeleton", "(Largely) stone", "Wooden frame with stone wall",
  ],
  floorMaterials: ["No floors", "Wood", "Stone/concrete"],
  roofShapes: ["Flat", "Sloping", "Special"],
  roofMaterials: [
    "Wood", "Artificial reeds", "Asphalt/bitumen",
    "Pan roof", "(Largely) reed", "Shingles",
  ],
  ownRiskOptions: ["€100", "€250", "€500", "No deductible"],
  securityOptions: ["None", "BORG", "Police mark"],
  netIncomeOptions: [
    "up to €1,000", "€1,000 - €2,000", "€2,000 - €3,000",
    "€3,000 - €4,850",
  ],
  outsideValueOptions: ["€0", "€2,500", "€5,000", "€7,500", "€15,000", "€25,000"],
} as const;

/* ─── State shape ─── */

export interface HomeState {
  presetAnswer: "yes" | "no" | "";
  role: "tenant" | "homeowner" | "";
  buildingType: string;
  usage: string[];
  constructionMaterial: string;
  floorMaterial: string;
  roofShape: string;
  roofMaterial: string;
  ownRisk: string;
  coverageChoice: "household" | "building" | "both" | "";
  highValueAV: boolean;
  highValueAVAmount: string;
  jewelry: boolean;
  jewelryAmount: string;
  specialAssets: boolean;
  specialAssetsAmount: string;
  ownerInterest: boolean;
  ownerInterestAmount: string;
  security: string;
  netIncome: string;
  outsideValue: string;
  monumental: boolean;
  quoted: boolean;
  floorCount: string;
  rainwater: boolean;
  smartSensors: boolean;
  heatPump: boolean;
}

/* ─── Config ─── */

export const homeProduct: ProductConfig = {
  id: "home",
  label: "Home",
  icon: "icon-home",

  initialState: {
    presetAnswer: "",
    role: "",
    buildingType: "",
    usage: [],
    constructionMaterial: "",
    floorMaterial: "",
    roofShape: "",
    roofMaterial: "",
    ownRisk: "",
    coverageChoice: "",
    highValueAV: false,
    highValueAVAmount: "",
    jewelry: false,
    jewelryAmount: "",
    specialAssets: false,
    specialAssetsAmount: "",
    ownerInterest: false,
    ownerInterestAmount: "",
    security: "None",
    netIncome: "",
    outsideValue: "€0",
    monumental: false,
    quoted: false,
    floorCount: "",
    rainwater: false,
    smartSensors: false,
    heatPump: false,
  } satisfies HomeState as Record<string, any>,

  presetState: {
    buildingType: "Townhouse",
    usage: ["I live there"],
    constructionMaterial: "(Largely) stone",
    floorMaterial: "Stone/concrete",
    roofShape: "Sloping",
    roofMaterial: "Pan roof",
  },

  presetChecklist: [
    "Stone exterior walls",
    "A sloping roof with tiles, pan, or shingles",
    "Concrete or stone floors throughout",
    "Used only for private residential living",
  ],

  stepDefs: [
    { id: "preset-verification", label: "Verify" },
    { id: "role", label: "Role" },
    { id: "home-details", label: "Home Details" },
    { id: "coverage-path", label: "Coverage" },
    { id: "contents", label: "Contents Insurance" },
    { id: "building", label: "Building Insurance" },
  ],

  getStepSequence(state) {
    const steps: string[] = ["preset-verification"];

    if (state.presetAnswer === "yes") {
      steps.push("role");
      if (state.role === "tenant") {
        steps.push("contents");
      } else if (state.role === "homeowner") {
        steps.push("coverage-path");
        if (state.coverageChoice === "household") steps.push("contents");
        else if (state.coverageChoice === "building") steps.push("building");
        else if (state.coverageChoice === "both") steps.push("contents", "building");
      }
    } else if (state.presetAnswer === "no") {
      steps.push("home-details", "role");
      if (state.role === "tenant") {
        steps.push("contents");
      } else if (state.role === "homeowner") {
        steps.push("coverage-path");
        if (state.coverageChoice === "household") steps.push("contents");
        else if (state.coverageChoice === "building") steps.push("building");
        else if (state.coverageChoice === "both") steps.push("contents", "building");
      }
    }

    return steps;
  },

  validateStep(stepId, state) {
    switch (stepId) {
      case "preset-verification":
        return state.presetAnswer !== "";
      case "role":
        return state.role !== "";
      case "home-details":
        return !!(
          state.buildingType &&
          state.usage?.length > 0 &&
          state.constructionMaterial &&
          state.floorMaterial &&
          state.roofShape &&
          state.roofMaterial
        );
      case "coverage-path":
        return state.coverageChoice !== "";
      case "contents":
        return !!(state.security && state.netIncome && state.outsideValue);
      case "building":
        return !!state.floorCount;
      default:
        return false;
    }
  },
};
