import type { ProductConfig } from "./types";

/* ─── Option arrays ─── */

export const CAR_OPTIONS = {
  mainDriverOptions: ["Yes", "No"],
  driverRelationshipOptions: ["My partner", "My child"],
  legalOwnerOptions: ["Myself", "My partner", "My child"],
  kmBrackets: [
    "0 – 7,500 km",
    "7,500 – 12,000 km",
    "12,000 – 20,000 km",
    "20,000 – 25,000 km",
    "25,000 – 30,000 km",
    "30,000+ km",
  ],
} as const;

/* ─── State shape ─── */

export interface CarState {
  licensePlate: string;
  carBrand: string;
  carModel: string;
  plateConfirmed: boolean;
  mainDriver: string;
  driverRelationship: string;
  driverAge: string;
  legalOwner: string;
  damageFreeYears: string;
  kmPerYear: string;
}

/* ─── Multi-instance helpers ─── */

let _carInstanceCounter = 0;

export interface CarInstance {
  id: string;
  state: Record<string, any>;
}

export function createCarInstance(): CarInstance {
  _carInstanceCounter++;
  return {
    id: `car-${Date.now()}-${_carInstanceCounter}`,
    state: { ...carProduct.initialState },
  };
}

/** Human-readable label for a car instance pill */
export function getCarInstanceLabel(instance: CarInstance, index: number): string {
  if (instance.state.carBrand && instance.state.plateConfirmed) {
    return instance.state.carModel?.split(" ")[0] || instance.state.carBrand;
  }
  return `Car ${index + 1}`;
}

/* ─── Simulated plate lookup ─── */

const PLATE_DB: Record<string, { brand: string; model: string }> = {
  "AB123C": { brand: "Volkswagen", model: "Golf 1.5 TSI" },
  "XY456Z": { brand: "Toyota", model: "Corolla 1.8 Hybrid" },
  "NL789D": { brand: "BMW", model: "320i Sedan" },
};

export function lookupPlate(plate: string): { brand: string; model: string } | null {
  const normalised = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return PLATE_DB[normalised] ?? { brand: "Volkswagen", model: "Golf 1.5 TSI" };
}

/* ─── Config ─── */

export const carProduct: ProductConfig = {
  id: "car",
  label: "Car",
  icon: "icon-car",

  initialState: {
    licensePlate: "",
    carBrand: "",
    carModel: "",
    plateConfirmed: false,
    mainDriver: "",
    driverRelationship: "",
    driverAge: "",
    damageFreeYears: "",
    kmPerYear: "",
  } satisfies CarState as Record<string, any>,

  presetState: {
    licensePlate: "",
    carBrand: "",
    carModel: "",
    plateConfirmed: false,
    mainDriver: "Yes",
    driverRelationship: "",
    driverAge: "",
    damageFreeYears: "",
    kmPerYear: "",
  },

  stepDefs: [
    { id: "car-identity", label: "Identity" },
    { id: "car-risk", label: "Risk & Usage" },
  ],

  getStepSequence(_state) {
    return ["car-identity", "car-risk"];
  },

  validateStep(stepId, state) {
    if (stepId === "car-identity") {
      return (state.licensePlate || "").length === 6 && state.plateConfirmed === true;
    }
    if (stepId === "car-risk") {
      const baseValid =
        state.mainDriver !== "" &&
        state.damageFreeYears !== "" &&
        state.kmPerYear !== "";
      if (state.mainDriver === "No") {
        return baseValid && state.driverRelationship !== "" && state.driverAge !== "";
      }
      return baseValid;
    }
    return false;
  },
};
