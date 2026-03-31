import { LucideIcon } from "lucide-react";

export interface InsuranceType {
  id: string;
  label: string;
  icon: string; // lucide icon name mapped in component
  savings: number;
  tooltip: string;
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
