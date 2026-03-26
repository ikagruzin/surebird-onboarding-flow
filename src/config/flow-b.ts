import type { FlowConfig } from "./flow-types";

export const flowB: FlowConfig = {
  id: "b",
  name: "Flow B — Smart Audit",
  description: "Fast-track: upload existing policy → skip to offer",
  phases: [
    { id: "about-you", label: "About you", sidebarStep: 1 },
    { id: "preferences", label: "Set preferences", sidebarStep: 2 },
    { id: "offer", label: "Your offer", sidebarStep: 3 },
    { id: "finalise", label: "Finalise", sidebarStep: 4 },
  ],
  steps: [
    {
      id: "product-selection",
      phase: null,
      standalone: true,
      buttonLabel: "Next",
      getNextStep: () => "name", // Normal path skips policy-upload
    },
    {
      id: "policy-upload",
      phase: null,
      hideFooter: true,
      getPrevStep: () => "product-selection",
    },
    // About you steps still exist for the normal path
    {
      id: "name",
      phase: "about-you",
      hideSavings: true,
      getPrevStep: () => "product-selection",
    },
    {
      id: "address",
      phase: "about-you",
      hideSavings: true,
    },
    {
      id: "birthdate",
      phase: "about-you",
      hideSavings: true,
    },
    {
      id: "family",
      phase: "about-you",
      hideSavings: true,
      hideNextButton: true,
      getNextStep: (state) => (state.familyStatus === "single" ? "ready" : "family-details"),
    },
    {
      id: "family-details",
      phase: "about-you",
      hideSavings: true,
      shouldSkip: (state) => state.familyStatus === "single",
    },
    {
      id: "ready",
      phase: "about-you",
      hideSavings: true,
      buttonLabel: "Set preferences",
      getPrevStep: (state) => (state.familyStatus === "single" ? "family" : "family-details"),
    },
    {
      id: "preferences",
      phase: null,
      hideSavings: true,
    },
    {
      id: "loading",
      phase: null,
      hideFooter: true,
    },
    {
      id: "offer",
      phase: null,
      fullWidth: true,
      hideFooter: true,
    },
    {
      id: "start-date",
      phase: "finalise",
      hideSavings: true,
      buttonLabel: "Go further",
    },
    {
      id: "confirm-details",
      phase: "finalise",
      hideSavings: true,
      buttonLabel: "Next",
    },
    {
      id: "phone-verification",
      phase: "finalise",
      hideSavings: true,
      hideNextButton: true,
      buttonLabel: "Verifying...",
    },
    {
      id: "idin-verification",
      phase: "finalise",
      hideSavings: true,
      buttonLabel: "Confirm & continue",
    },
    {
      id: "acceptance-questions",
      phase: "finalise",
      hideSavings: true,
      buttonLabel: "Continue",
    },
    {
      id: "final-preview",
      phase: "finalise",
      hideSavings: true,
      buttonLabel: "Confirm & Insure",
    },
    {
      id: "success",
      phase: null,
      hideFooter: true,
    },
  ],
};

