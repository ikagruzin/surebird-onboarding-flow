import { LucideIcon } from "lucide-react";

export interface InsuranceType {
  id: string;
  label: string;
  icon: string; // lucide icon name mapped in component
  savings: number;
}

export interface WizardState {
  currentStep: number;
  selectedInsurances: string[];
  preferences: Record<string, Record<string, string>>;
  email: string;
  emailSubmitted: boolean;
}

export const INSURANCE_TYPES: InsuranceType[] = [
  { id: "liability", label: "Liability", icon: "Umbrella", savings: 40 },
  { id: "living", label: "Home", icon: "Home", savings: 45 },
  { id: "travel", label: "Travel", icon: "Plane", savings: 35 },
  { id: "car", label: "Car", icon: "Car", savings: 50 },
  { id: "legal", label: "Legal expenses", icon: "Scale", savings: 40 },
  { id: "accidents", label: "Accidents", icon: "Zap", savings: 10 },
  { id: "caravan", label: "Caravan", icon: "Caravan", savings: 15 },
];

export const STEP_LABELS = [
  "About you",
  "Your preferences",
  "Your offer",
  "Finalise",
];

export interface BundlePreset {
  id: string;
  title: string;
  description: string;
  insuranceIds: string[];
  annualSavings: number;
  image: string;
}
