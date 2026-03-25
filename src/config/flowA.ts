import type { FlowConfig } from "./flowTypes";

const flowA: FlowConfig = {
  id: "a",
  name: "Flow A — Standard",
  description: "Default onboarding: About you → Preferences → Offer → Finalise",
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
      phase: null, // manages its own header
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
    // ─── House Insurance Steps (shown only when "home" is selected) ───
    {
      id: "house-preset",
      phase: "finalise",
      hideSavings: true,
      hideNextButton: true, // auto-advances on Yes/No
      shouldSkip: (state) => !state.selectedInsurances?.includes("home"),
    },
    {
      id: "house-details",
      phase: "finalise",
      hideSavings: true,
      shouldSkip: (state) =>
        !state.selectedInsurances?.includes("home") ||
        state.housePresetAnswer === "yes" ||
        state.housePresetAnswer === "",
    },
    {
      id: "house-role",
      phase: "finalise",
      hideSavings: true,
      hideNextButton: true, // auto-advances on selection
      shouldSkip: (state) => !state.selectedInsurances?.includes("home"),
      getNextStep: (state) => {
        if (state.house?.role === "tenant") return "house-contents";
        if (state.house?.role === "homeowner") return "house-coverage";
        return null;
      },
    },
    {
      id: "house-coverage",
      phase: "finalise",
      hideSavings: true,
      hideNextButton: true, // auto-advances on selection
      shouldSkip: (state) =>
        !state.selectedInsurances?.includes("home") ||
        state.house?.role !== "homeowner",
      getNextStep: (state) => {
        if (state.house?.coverageChoice === "household") return "house-contents";
        if (state.house?.coverageChoice === "building") return "house-building";
        if (state.house?.coverageChoice === "both") return "house-contents";
        return null;
      },
    },
    {
      id: "house-contents",
      phase: "finalise",
      hideSavings: true,
      shouldSkip: (state) => {
        if (!state.selectedInsurances?.includes("home")) return true;
        const role = state.house?.role;
        const choice = state.house?.coverageChoice;
        if (role === "tenant") return false;
        if (role === "homeowner" && (choice === "household" || choice === "both")) return false;
        return true;
      },
      getNextStep: (state) => {
        if (state.house?.role === "homeowner" && state.house?.coverageChoice === "both") {
          return "house-building";
        }
        return "start-date";
      },
    },
    {
      id: "house-building",
      phase: "finalise",
      hideSavings: true,
      shouldSkip: (state) => {
        if (!state.selectedInsurances?.includes("home")) return true;
        const role = state.house?.role;
        const choice = state.house?.coverageChoice;
        if (role === "homeowner" && (choice === "building" || choice === "both")) return false;
        return true;
      },
    },
    // ─── End House Insurance Steps ───
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

export default flowA;
