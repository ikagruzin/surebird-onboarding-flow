import type { FlowConfig } from "./flow-types";

export const flowFinal: FlowConfig = {
  id: "final",
  name: "Final Flow",
  description: "Complete onboarding journey with gated offer and full verification",
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
    },
    {
      id: "name",
      phase: "about-you",
      hideSavings: true,
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
      buttonLabel: "Next",
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
      id: "all-set",
      phase: "preferences",
      hideSavings: true,
      buttonLabel: "Send request",
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
      id: "family-members-info",
      phase: "finalise",
      hideSavings: true,
      buttonLabel: "Next",
      shouldSkip: (state) => {
        const hasPartner = (state.familyStatus === "partner" || state.familyStatus === "partner-children") && state.insurePartner === "yes";
        const hasChildren = (state.familyStatus === "single-children" || state.familyStatus === "partner-children") && state.childrenCount > 0;
        // Also check if car assigned to partner/child
        const ps = state.productStates || {};
        const carStates = Object.keys(ps).filter((k) => k.startsWith("car-")).map((k) => ps[k]);
        const carNeedsFamily = carStates.some((c: any) => c.driverRelationship === "My partner" || c.driverRelationship === "My child");
        return !hasPartner && !hasChildren && !carNeedsFamily;
      },
    },
    {
      id: "select-regular-driver",
      phase: "finalise",
      hideSavings: true,
      buttonLabel: "Next",
      shouldSkip: (state) => {
        if ((state.childrenCount || 0) <= 1) return true;
        const ps = state.productStates || {};
        const carStates = Object.keys(ps).filter((k) => k.startsWith("car-")).map((k) => ps[k]);
        return !carStates.some((c: any) => c.driverRelationship === "My child");
      },
    },
    {
      id: "car-registration-code",
      phase: "finalise",
      hideSavings: true,
      buttonLabel: "Next",
      shouldSkip: (state) => !(state.selectedInsurances || []).includes("car"),
    },
    {
      id: "caravan-location",
      phase: "finalise",
      hideSavings: true,
      buttonLabel: "Next",
      shouldSkip: (state) => {
        if (!(state.selectedInsurances || []).includes("caravan")) return true;
        const ps = state.productStates || {};
        const caravanState = Object.keys(ps).filter((k) => k.startsWith("caravan")).map((k) => ps[k])[0] || ps["caravan"];
        return !caravanState || caravanState.caravanType !== "Mobile home";
      },
    },
    {
      id: "legal-additional-questions",
      phase: "finalise",
      hideSavings: true,
      buttonLabel: "Next",
      shouldSkip: (state) => !(state.selectedInsurances || []).includes("legal"),
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
