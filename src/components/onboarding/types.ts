import { LucideIcon } from "lucide-react";

export interface InsuranceType {
  id: string;
  label: string;
  icon: string; // lucide icon name mapped in component
  savings: number;
}

/* ─── House Insurance State ─── */
export interface HouseState {
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
  basicCoverage: string;
}

export const INITIAL_HOUSE: HouseState = {
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
  basicCoverage: "",
};

export const PRESET_HOUSE: Partial<HouseState> = {
  buildingType: "Townhouse",
  usage: ["I live there"],
  constructionMaterial: "(Largely) stone",
  floorMaterial: "Stone/concrete",
  roofShape: "Sloping",
  roofMaterial: "Pan roof",
};

/* ─── House Constants ─── */
export const BUILDING_TYPES = [
  "Detached house", "Apartment", "Canal house", "Corner house",
  "Two-under-a-roof", "Townhouse", "Farmhouse",
];
export const USAGE_OPTIONS = [
  "I live there", "Holiday home", "I rent it out",
  "Rental company for rooms", "Different",
];
export const CONSTRUCTION_MATERIALS = [
  "Wooden skeleton", "(Largely) stone", "Wooden frame with stone wall",
];
export const FLOOR_MATERIALS = ["No floors", "Wood", "Stone/concrete"];
export const ROOF_SHAPES = ["Flat", "Sloping", "Special"];
export const ROOF_MATERIALS = [
  "Wood", "Artificial reeds", "Asphalt/bitumen",
  "Pan roof", "(Largely) reed", "Shingles",
];
export const OWN_RISK_OPTIONS = ["€100", "€250", "€500", "No deductible"];
export const SECURITY_OPTIONS = ["None", "BORG", "Police mark", "Both"];
export const NET_INCOME_OPTIONS = [
  "< €25,000", "€25,000 – €50,000", "€50,000 – €75,000",
  "€75,000 – €100,000", "> €100,000",
];
export const OUTSIDE_VALUE_OPTIONS = ["€0", "€2,500", "€5,000", "€7,500", "€10,000"];

export interface WizardState {
  currentStep: number;
  selectedInsurances: string[];
  preferences: Record<string, Record<string, string>>;
  email: string;
  emailSubmitted: boolean;
  firstName: string;
  infix: string;
  lastName: string;
  postcode: string;
  houseNumber: string;
  addition: string;
  birthdate: string;
  familyStatus: string;
  insurePartner: string;
  childrenCount: number;
  childrenAges: number[];
  includeFamily: string;
  phone: string;
  startDates: Record<string, string>;
  iban: string;
  acceptanceAnswers: Record<string, string>;
  agreeTerms: boolean;
  agreeDebit: boolean;
  // House insurance
  house: HouseState;
  housePresetAnswer: "yes" | "no" | "";
}

export const INSURANCE_TYPES: InsuranceType[] = [
  { id: "liability", label: "Liability", icon: "Umbrella", savings: 45 },
  { id: "home", label: "Home", icon: "Home", savings: 45 },
  { id: "travel", label: "Travel", icon: "Plane", savings: 45 },
  { id: "car", label: "Car", icon: "Car", savings: 45 },
  { id: "legal", label: "Legal expenses", icon: "Scale", savings: 45 },
  { id: "accidents", label: "Accidents", icon: "Zap", savings: 45 },
  { id: "caravan", label: "Caravan", icon: "Caravan", savings: 30 },
];

export const STEP_LABELS = [
  "About you",
  "Set preferences",
  "Offer",
  "Finalize",
];

export interface BundlePreset {
  id: string;
  title: string;
  description: string;
  insuranceIds: string[];
  annualSavings: number;
  image: string;
}
