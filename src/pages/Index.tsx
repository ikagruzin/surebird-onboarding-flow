import { useState, useCallback, useRef } from "react";
import Sidebar from "@/components/onboarding/Sidebar";
import StepOne from "@/components/onboarding/StepOne";
import StepName from "@/components/onboarding/StepName";
import StepAddress from "@/components/onboarding/StepAddress";
import StepBirthdate from "@/components/onboarding/StepBirthdate";
import StepFamily from "@/components/onboarding/StepFamily";
import StepFamilyDetails from "@/components/onboarding/StepFamilyDetails";
import StepPreferences from "@/components/onboarding/StepPreferences";
import type { StepPreferencesHandle } from "@/components/onboarding/StepPreferences";
import StepReady from "@/components/onboarding/StepReady";
import StepLoading from "@/components/onboarding/StepLoading";
import StepUpsell from "@/components/onboarding/StepUpsell";
import StepOffer from "@/components/onboarding/StepOffer";
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
    childrenAges: [],
    includeFamily: "",
    phone: "+31",
  });

  const prefsRef = useRef<StepPreferencesHandle>(null);

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
  const isReadyStep = state.currentStep === 7;
  const isAboutYou = state.currentStep >= 2 && state.currentStep <= 7;

  // "About you" sub-step progress
  const aboutYouSubStep = state.currentStep - 1;
  const aboutYouTotalSubs = state.familyStatus === "single" ? 4 : 5;
  const aboutYouProgress = isReadyStep ? 100 : (Math.min(aboutYouSubStep, aboutYouTotalSubs) / aboutYouTotalSubs) * 100;

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
        return true;
      default:
        return true;
    }
  };

  const handleBack = () => {
    if (state.currentStep === 8) {
      // In preferences, try internal back first
      if (prefsRef.current) {
        const handled = prefsRef.current.handleBack();
        if (handled) return;
      }
      setStep(7);
      return;
    }
    if (state.currentStep === 7) {
      setStep(state.familyStatus === "single" ? 5 : 6);
      return;
    }
    setStep(state.currentStep - 1);
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
            childrenAges={state.childrenAges}
            onUpdatePartner={(value) =>
              setState((s) => ({ ...s, insurePartner: value }))
            }
            onUpdateChildren={(value) => {
              setState((s) => {
                const newAges = [...s.childrenAges];
                // Adjust ages array length
                while (newAges.length < value) newAges.push(0);
                while (newAges.length > value) newAges.pop();
                return { ...s, childrenCount: value, childrenAges: newAges };
              });
            }}
            onUpdateChildAge={(index, age) => {
              setState((s) => {
                const newAges = [...s.childrenAges];
                newAges[index] = age;
                return { ...s, childrenAges: newAges };
              });
            }}
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
            ref={prefsRef}
            selectedInsurances={state.selectedInsurances}
            preferences={state.preferences}
            firstName={state.firstName}
            phone={state.phone}
            savings={totalSavings}
            onUpdatePreference={updatePreference}
            onUpdatePhone={(value) => setState((s) => ({ ...s, phone: value }))}
            onAddInsurances={(ids) => setState((s) => ({ ...s, selectedInsurances: [...s.selectedInsurances, ...ids] }))}
            onNext={() => setStep(9)}
            onBack={() => setStep(7)}
          />
        );
      case 9:
        return (
          <StepLoading
            onComplete={() => setStep(10)}
          />
        );
      case 10:
        return (
          <StepOffer
            selectedInsurances={state.selectedInsurances}
            preferences={state.preferences}
            firstName={state.firstName}
            onUpdatePreference={updatePreference}
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

  const isOfferStep = state.currentStep === 10;
  const isLoadingStep = state.currentStep === 9;
  const isPreferencesStep = state.currentStep === 8;
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentStep={sidebarStep} visible={true} />

      <main className={`flex-1 px-6 md:px-12 lg:px-16 py-8 md:py-12 pb-28 ${isOfferStep ? '' : 'max-w-3xl mx-auto'}`}>
        {isAboutYou && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">About you</h1>
            <Progress value={aboutYouProgress} className="h-2 [&>div]:bg-success" />
          </div>
        )}
        {renderStep()}
        {!isAboutYou && !isLoadingStep && !isPreferencesStep && <Footer />}
      </main>

      {!isLoadingStep && !isOfferStep && (
        <StickyFooter
          savings={totalSavings}
          onNext={() => {
            if (state.currentStep === 5 && state.familyStatus) {
              // Already auto-advanced
              return;
            }
            setStep(state.currentStep + 1);
          }}
          onBack={handleBack}
          disabled={isAboutYou ? !canProceedAboutYou() : state.selectedInsurances.length === 0}
          buttonLabel={isReadyStep ? "Set preferences" : "Next"}
          hasSidebar={true}
          showSavings={!isAboutYou && !isReadyStep && !isPreferencesStep}
          showNextButton={state.currentStep !== 5}
        />
      )}
    </div>
  );
};

export default Index;
