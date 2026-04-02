import type { ProductConfig } from "./types";

/* ─── Option arrays ─── */

export const CAR_OPTIONS = {
  mainDriverOptions: ["Yes", "No"],
  driverRelationshipOptions: ["My partner", "My child", "Myself"],
  legalOwnerOptions: ["My partner", "Myself"],
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
  if (instance.state.licensePlate && instance.state.plateConfirmed) {
    // Format the raw plate with dashes for display
    const raw = (instance.state.licensePlate as string).toUpperCase();
    return raw.length === 6
      ? `${raw.slice(0, 2)}-${raw.slice(2, 4)}-${raw.slice(4, 6)}`
      : raw;
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
    legalOwner: "",
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
    legalOwner: "",
    damageFreeYears: "",
    kmPerYear: "",
  },

  offerInitialState: {
    ownRisk: "100",
    coverage: "Limited Casco (WA+)",
    insuringOccupants: false,
    occupantType: "",
    roadsideAssistance: false,
    legalAid: false,
  },

  stepDefs: [
    { id: "car-identity", label: "Identity" },
    { id: "car-driver", label: "Driver" },
    { id: "car-usage", label: "Usage" },
  ],

  getStepSequence(_state) {
    return ["car-identity", "car-driver", "car-usage"];
  },

  validateStep(stepId, state) {
    if (stepId === "car-identity") {
      return (state.licensePlate || "").length === 6 && state.plateConfirmed === true;
    }
    if (stepId === "car-driver") {
      if (state.mainDriver === "") return false;
      if (state.mainDriver === "No") {
        const needsAge = state.driverRelationship !== "Myself";
        return state.driverRelationship !== "" && (!needsAge || state.driverAge !== "") && state.legalOwner !== "";
      }
      return true;
    }
    if (stepId === "car-usage") {
      return state.damageFreeYears !== "" && state.kmPerYear !== "";
    }
    return false;
  },

  getValidationErrors(stepId, state) {
    const errs: Record<string, string> = {};
    if (stepId === "car-identity") {
      if ((state.licensePlate || "").length < 6) errs.licensePlate = "Please enter a valid license plate (6 characters)";
      else if (!state.plateConfirmed) errs.plateConfirmed = "Please confirm your vehicle details";
    }
    if (stepId === "car-driver") {
      if (!state.mainDriver) errs.mainDriver = "Please indicate if you are the main driver";
      if (state.mainDriver === "No") {
        if (!state.driverRelationship) errs.driverRelationship = "Please select the driver's relationship";
        if (state.driverRelationship && state.driverRelationship !== "Myself" && !state.driverAge) errs.driverAge = "Please select the driver's age";
        if (!state.legalOwner) errs.legalOwner = "Please indicate the legal owner";
      }
    }
    if (stepId === "car-usage") {
      if (!state.damageFreeYears && state.damageFreeYears !== "0") errs.damageFreeYears = "Please select your damage-free years";
      if (!state.kmPerYear) errs.kmPerYear = "Please select your annual mileage";
    }
    return errs;
  },
};
