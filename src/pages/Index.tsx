import { useState, useCallback } from "react";
import Sidebar from "@/components/onboarding/Sidebar";
import StepOne from "@/components/onboarding/StepOne";
import StepName from "@/components/onboarding/StepName";
import StepAddress from "@/components/onboarding/StepAddress";
import StepBirthdate from "@/components/onboarding/StepBirthdate";
import StepFamily from "@/components/onboarding/StepFamily";
import StepFamilyDetails from "@/components/onboarding/StepFamilyDetails";
import StepPreferences from "@/components/onboarding/StepPreferences";
import StepReady from "@/components/onboarding/StepReady";
import StepUpsell from "@/components/onboarding/StepUpsell";
import StepPackage from "@/components/onboarding/StepPackage";
import Footer from "@/components/onboarding/Footer";
import AskTacoFloat from "@/components/onboarding/AskTacoFloat";
import StickyFooter from "@/components/onboarding/StickyFooter";
import { Progress } from "@/components/ui/progress";
import { INSURANCE_TYPES } from "@/components/onboarding/types";
import type { WizardState } from "@/components/onboarding/types";

const Index = () => {
  const [state, setState] = useState<WizardState>({
    currentStep: 1,
    selectedInsurances: [],
    preferences: {},
    email: "",
    emailSubmitted: false,
    firstName: "",
    lastName: "",
    postcode: "",
    houseNumber: "",
    addition: "",
    birthdate: "",
    familyStatus: "",
    insurePartner: "",
    childrenCount: 0,
    includeFamily: "",
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
  const isAboutYou = state.currentStep >= 2 && state.currentStep <= 6;

  // "About you" sub-step progress: steps 2-6 → sub-steps 1-5
  const aboutYouSubStep = state.currentStep - 1;
  const aboutYouTotalSubs = state.familyStatus === "single" ? 4 : 5;
  const aboutYouProgress = (Math.min(aboutYouSubStep, aboutYouTotalSubs) / aboutYouTotalSubs) * 100;

  const canProceedAboutYou = () => {
    switch (state.currentStep) {
      case 2:
        return state.firstName.trim().length > 0 && state.lastName.trim().length > 0;
      case 3: {
        const pc = state.postcode.replace(/\s/g, "");
        return pc.length >= 6 && state.houseNumber.trim().length > 0;
      }
      case 4:
        return state.birthdate.trim().length > 0;
      case 5:
        return !!state.familyStatus;
      case 6:
        return true; // family details - always can proceed
      default:
        return true;
    }
  };

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
          <StepName
            firstName={state.firstName}
            lastName={state.lastName}
            onUpdate={(field, value) =>
              setState((s) => ({ ...s, [field]: value }))
            }
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <StepAddress
            firstName={state.firstName}
            postcode={state.postcode}
            houseNumber={state.houseNumber}
            addition={state.addition}
            onUpdate={(field, value) =>
              setState((s) => ({ ...s, [field]: value }))
            }
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        );
      case 4:
        return (
          <StepBirthdate
            birthdate={state.birthdate}
            onUpdate={(value) =>
              setState((s) => ({ ...s, birthdate: value }))
            }
            onNext={() => setStep(5)}
            onBack={() => setStep(3)}
          />
        );
      case 5:
        return (
          <StepFamily
            familyStatus={state.familyStatus}
            onSelect={(value) => {
              setState((s) => ({ ...s, familyStatus: value }));
              if (value === "single") {
                setStep(7);
              } else {
              } else {
                setStep(6);
              }
            }}
            onBack={() => setStep(4)}
          />
        );
      case 6:
        return (
          <StepFamilyDetails
            familyStatus={state.familyStatus}
            insurePartner={state.insurePartner}
            childrenCount={state.childrenCount}
            onUpdatePartner={(value) =>
              setState((s) => ({ ...s, insurePartner: value }))
            }
            onUpdateChildren={(value) =>
              setState((s) => ({ ...s, childrenCount: value }))
            }
            onNext={() => setStep(7)}
            onBack={() => setStep(5)}
          />
        );
      case 7:
        return (
          <StepReady
            selectedInsurances={state.selectedInsurances}
            onNext={() => setStep(8)}
            onBack={() => setStep(state.familyStatus === "single" ? 5 : 6)}
          />
        );
      case 8:
        return (
          <StepPreferences
            selectedInsurances={state.selectedInsurances}
            preferences={state.preferences}
            onUpdatePreference={updatePreference}
            onNext={() => setStep(9)}
            onBack={() => setStep(7)}
          />
        );
      case 9:
        return (
          <StepUpsell
            selectedInsurances={state.selectedInsurances}
            onToggle={toggleInsurance}
            onNext={() => setStep(10)}
            onBack={() => setStep(8)}
          />
        );
      case 10:
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
            onNext={() => setStep(11)}
            onBack={() => setStep(9)}
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

  // Map wizard steps to sidebar steps:
  // 1 = product selection, 2-6 = About you, 7 = ready, 8-9 = Your preferences, 10 = Your offer, 11+ = Finalise
  const isFamilySelectStep = state.currentStep === 5;
  const isReadyStep = state.currentStep === 7;
  const sidebarStep =
    state.currentStep <= 1
      ? 1
      : state.currentStep <= 7
      ? 1
      : state.currentStep <= 9
      ? 2
      : state.currentStep === 10
      ? 3
      : 4;

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

  const getNextStep = () => {
    setStep(state.currentStep + 1);
  };

  const getPrevStep = () => {
    setStep(state.currentStep - 1);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentStep={sidebarStep} visible={true} />

      <main className="flex-1 px-6 md:px-12 lg:px-16 py-8 md:py-12 max-w-3xl mx-auto pb-28">
        {isAboutYou && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">About you</h1>
            <Progress value={aboutYouProgress} className="h-2 [&>div]:bg-success" />
          </div>
        )}
        {renderStep()}
        {!isAboutYou && <Footer />}
      </main>

      <StickyFooter
        savings={totalSavings}
        onNext={getNextStep}
        onBack={getPrevStep}
        disabled={isAboutYou ? !canProceedAboutYou() : state.selectedInsurances.length === 0}
        buttonLabel={isReadyStep ? "Set preferences" : "Next"}
        hasSidebar={true}
        showSavings={!isAboutYou && !isReadyStep}
      />
    </div>
  );
};

export default Index;
