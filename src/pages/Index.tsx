import { useState, useCallback } from "react";
import Sidebar from "@/components/onboarding/Sidebar";
import StepOne from "@/components/onboarding/StepOne";
import StepPreferences from "@/components/onboarding/StepPreferences";
import StepUpsell from "@/components/onboarding/StepUpsell";
import StepPackage from "@/components/onboarding/StepPackage";
import Footer from "@/components/onboarding/Footer";
import AskTacoFloat from "@/components/onboarding/AskTacoFloat";
import StickyFooter from "@/components/onboarding/StickyFooter";
import { INSURANCE_TYPES } from "@/components/onboarding/types";
import type { WizardState } from "@/components/onboarding/types";

const Index = () => {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    selectedInsurances: [],
    preferences: {},
    email: "",
    emailSubmitted: false,
  });

  const setStep = (step: number) =>
    setState((s) => ({ ...s, currentStep: step }));

  const toggleInsurance = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      selectedInsurances: s.selectedInsurances.includes(id)
        ? s.selectedInsurances.filter((i) => i !== id)
        : [...s.selectedInsurances, id],
    }));
  }, []);

  const selectBundle = useCallback((ids: string[]) => {
    setState((s) => ({ ...s, selectedInsurances: [...ids] }));
  }, []);

  const updatePreference = useCallback(
    (insuranceId: string, questionId: string, value: string) => {
      setState((s) => ({
        ...s,
        preferences: {
          ...s.preferences,
          [insuranceId]: {
            ...(s.preferences[insuranceId] || {}),
            [questionId]: value,
          },
        },
      }));
    },
    []
  );

  const totalSavings = INSURANCE_TYPES.filter((t) =>
    state.selectedInsurances.includes(t.id)
  ).reduce((sum, t) => sum + t.savings, 0);

  const isStep1 = state.currentStep === 1;

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <StepOne
            selected={state.selectedInsurances}
            onToggle={toggleInsurance}
            onBundleSelect={selectBundle}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <StepPreferences
            selectedInsurances={state.selectedInsurances}
            preferences={state.preferences}
            onUpdatePreference={updatePreference}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <StepUpsell
            selectedInsurances={state.selectedInsurances}
            onToggle={toggleInsurance}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        );
      case 4:
        return (
          <StepPackage
            selectedInsurances={state.selectedInsurances}
            email={state.email}
            emailSubmitted={state.emailSubmitted}
            onEmailChange={(email) =>
              setState((s) => ({ ...s, email, emailSubmitted: false }))
            }
            onEmailSubmit={() =>
              setState((s) => ({ ...s, emailSubmitted: true }))
            }
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        );
      default:
        return (
          <div className="animate-fade-in text-center py-20">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              🎉 Thank you!
            </h1>
            <p className="text-muted-foreground">
              Your package request has been submitted. We'll be in touch soon!
            </p>
          </div>
        );
    }
  };

  // Map wizard steps to sidebar steps
  const sidebarStep =
    state.currentStep <= 1 ? 1 : state.currentStep <= 3 ? 2 : state.currentStep === 4 ? 3 : 4;

  // Step 1 has its own full layout with sidebar
  if (isStep1) {
    return (
      <>
        {renderStep()}
        <StickyFooter
          savings={totalSavings}
          onNext={() => setStep(2)}
          disabled={state.selectedInsurances.length === 0}
          buttonLabel="Next"
          hasSidebar={true}
        />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentStep={sidebarStep} visible={true} />

      <main className="flex-1 px-6 md:px-12 lg:px-16 py-8 md:py-12 max-w-3xl mx-auto">
        {renderStep()}
        <Footer />
      </main>

      <StickyFooter
        savings={totalSavings}
        onNext={() => {}}
        disabled={state.selectedInsurances.length === 0}
        buttonLabel="Next"
        hasSidebar={true}
      />
    </div>
  );
};

export default Index;
