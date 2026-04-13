export type StepId =
  | "product-selection"
  | "policy-upload"
  | "name"
  | "address"
  | "birthdate"
  | "family"
  | "family-details"
  | "ready"
  | "preferences"
  | "all-set"
  | "loading"
  | "offer"
  | "start-date"
  | "confirm-details"
  | "phone-verification"
  | "idin-verification"
  | "acceptance-questions"
  | "family-members-info"
  | "select-regular-driver"
  | "car-registration-code"
  | "caravan-location"
  | "legal-additional-questions"
  | "final-preview"
  | "success";

export type PhaseId = "about-you" | "preferences" | "offer" | "finalise";

export interface StepConfig {
  id: StepId;
  phase: PhaseId | null; // null = no phase header/progress
  /** If true, step manages its own layout (no sidebar wrapper) */
  standalone?: boolean;
  /** If true, sticky footer is hidden */
  hideFooter?: boolean;
  /** If true, full-width main (no max-w-3xl) */
  fullWidth?: boolean;
  /** Custom button label for this step */
  buttonLabel?: string;
  /** If true, hide next button in footer */
  hideNextButton?: boolean;
  /** If true, hide savings in footer */
  hideSavings?: boolean;
  /** Dynamic next step override. Return step ID or null for default (next in sequence) */
  getNextStep?: (state: Record<string, any>) => StepId | null;
  /** Dynamic previous step override */
  getPrevStep?: (state: Record<string, any>) => StepId | null;
  /** Dynamic skip condition - if returns true, skip this step */
  shouldSkip?: (state: Record<string, any>) => boolean;
}

export interface PhaseConfig {
  id: PhaseId;
  label: string;
  /** Which sidebar step index (1-4) this maps to */
  sidebarStep: number;
}

export interface FlowConfig {
  id: string;
  name: string;
  description: string;
  steps: StepConfig[];
  phases: PhaseConfig[];
}
