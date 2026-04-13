import { LucideIcon } from "lucide-react";

export interface InsuranceType {
  id: string;
  label: string;
  icon: string; // lucide icon name mapped in component
  savings: number;
  tooltip: string;
}

export interface FamilyMember {
  relation: "partner" | "child";
  firstName: string;
  infix: string;
  lastName: string;
  birthdate: string;
  gender: string;
}

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
  acceptanceConfirmed: boolean;
  agreeTerms: boolean;
  agreeDebit: boolean;
  /** Product states from Set Preferences (keyed by product id) */
  productStates: Record<string, Record<string, any>>;
  /** Rest-data states for Offer page (keyed by product id) */
  offerStates: Record<string, Record<string, any>>;
  acceptanceExplanations: Record<string, string>;
  gender: string;
  familyMembers: FamilyMember[];
  carRegCodes: Record<string, string>;
  carRegularDrivers: Record<string, string>;
  caravanLocationPostcode: string;
  caravanLocationHouseNumber: string;
  caravanLocationAddition: string;
  legalAdditionalAnswers: Record<string, string>;
}

export const INSURANCE_TYPES: InsuranceType[] = [
  { id: "liability", label: "Liability", icon: "Umbrella", savings: 45, tooltip: "Covers damage you accidentally cause to others or their property — one of the most essential insurances." },
  { id: "home", label: "Home", icon: "Home", savings: 45, tooltip: "Protects your house, belongings, and valuables against fire, theft, water damage, and storms." },
  { id: "travel", label: "Travel", icon: "Plane", savings: 45, tooltip: "Covers medical emergencies, trip cancellations, lost luggage, and other costs while abroad." },
  { id: "car", label: "Car", icon: "Car", savings: 45, tooltip: "Mandatory vehicle insurance covering damage to others, your own car, or both." },
  { id: "legal", label: "Legal expenses", icon: "Scale", savings: 45, tooltip: "Provides legal assistance and covers attorney fees when you face a legal dispute." },
  { id: "accidents", label: "Accidents", icon: "Zap", savings: 45, tooltip: "Pays out a lump sum in case of permanent disability or death caused by an accident." },
  { id: "caravan", label: "Caravan", icon: "Caravan", savings: 30, tooltip: "Covers your caravan or mobile home against damage, theft, and liability." },
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
