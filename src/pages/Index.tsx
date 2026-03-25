import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import StepPolicyUpload from "@/components/onboarding/StepPolicyUpload";
import StepStartDate from "@/components/onboarding/StepStartDate";
import StepConfirmDetails from "@/components/onboarding/StepConfirmDetails";
import StepPhoneVerification from "@/components/onboarding/StepPhoneVerification";
import StepIdinVerification from "@/components/onboarding/StepIdinVerification";
import StepAcceptanceQuestions from "@/components/onboarding/StepAcceptanceQuestions";
import StepFinalPreview from "@/components/onboarding/StepFinalPreview";
import StepSuccess from "@/components/onboarding/StepSuccess";
import Footer from "@/components/onboarding/Footer";
import StickyFooter from "@/components/onboarding/StickyFooter";
import FlowSwitcher from "@/components/onboarding/FlowSwitcher";
import { Progress } from "@/components/ui/progress";
import { INSURANCE_TYPES } from "@/components/onboarding/types";
import type { WizardState } from "@/components/onboarding/types";
import type { StepId, StepConfig, FlowConfig } from "@/config/flowTypes";
import { getFlow, DEFAULT_FLOW_ID } from "@/config/flows";

const INITIAL_STATE: WizardState = {
  currentStep: 0,
  selectedInsurances: [],
  preferences: {},
  email: "",
  emailSubmitted: false,
  firstName: "",
  infix: "",
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
  startDates: {},
  iban: "",
  acceptanceAnswers: {},
  agreeTerms: false,
  agreeDebit: false,
};

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const flowId = searchParams.get("flow") || DEFAULT_FLOW_ID;
  const flow = useMemo(() => getFlow(flowId), [flowId]);

  const [state, setState] = useState<WizardState>({ ...INITIAL_STATE });
  const prefsRef = useRef<StepPreferencesHandle>(null);
  const seenStepsRef = useRef<Set<string>>(new Set());

  // Current step index into flow.steps array
  const stepIndex = state.currentStep;
  const currentStepConfig = flow.steps[stepIndex] as StepConfig | undefined;
  const currentStepId = currentStepConfig?.id || "product-selection";

  // Track whether Taco message should animate (only on first visit)
  const shouldAnimateTaco = !seenStepsRef.current.has(currentStepId);

  useEffect(() => {
    seenStepsRef.current.add(currentStepId);
  }, [currentStepId]);

  const switchFlow = (newFlowId: string) => {
    setSearchParams({ flow: newFlowId });
    setState({ ...INITIAL_STATE });
  };

  // Navigate to a step by its ID
  const goToStepId = (id: StepId) => {
    const idx = flow.steps.findIndex((s) => s.id === id);
    if (idx !== -1) setState((s) => ({ ...s, currentStep: idx }));
  };

  const goToIndex = (idx: number) => {
    setState((s) => ({ ...s, currentStep: idx }));
  };

  // Get next step index, respecting skipConditions and getNextStep overrides
  const getNextIndex = (): number => {
    if (currentStepConfig?.getNextStep) {
      const nextId = currentStepConfig.getNextStep(state);
      if (nextId) {
        const idx = flow.steps.findIndex((s) => s.id === nextId);
        if (idx !== -1) return idx;
      }
    }
    // Default: next in sequence, skipping any that should be skipped
    let next = stepIndex + 1;
    while (next < flow.steps.length && flow.steps[next].shouldSkip?.(state)) {
      next++;
    }
    return Math.min(next, flow.steps.length - 1);
  };

  const getPrevIndex = (): number => {
    if (currentStepConfig?.getPrevStep) {
      const prevId = currentStepConfig.getPrevStep(state);
      if (prevId) {
        const idx = flow.steps.findIndex((s) => s.id === prevId);
        if (idx !== -1) return idx;
      }
    }
    let prev = stepIndex - 1;
    while (prev >= 0 && flow.steps[prev].shouldSkip?.(state)) {
      prev--;
    }
    return Math.max(prev, 0);
  };

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

  // Validation
  const canProceed = (): boolean => {
    switch (currentStepId) {
      case "product-selection":
        return state.selectedInsurances.length > 0;
      case "name":
        return state.firstName.trim().length > 0 && state.lastName.trim().length > 0;
      case "address": {
        const pc = state.postcode.replace(/\s/g, "");
        return pc.length >= 6 && state.houseNumber.trim().length > 0;
      }
      case "birthdate":
        return state.birthdate.trim().length > 0;
      case "family":
        return !!state.familyStatus;
      case "family-details":
        return true;
      case "ready":
        return true;
      case "preferences":
        return true;
      case "start-date": {
        const products = INSURANCE_TYPES.filter((t) => state.selectedInsurances.includes(t.id));
        return products.every((p) => {
          const val = state.startDates[p.id] || "";
          if (val.length !== 10) return false;
          const [dd, mm, yyyy] = val.split("-").map(Number);
          if (!dd || !mm || !yyyy) return false;
          const date = new Date(yyyy, mm - 1, dd);
          return date.getFullYear() === yyyy && date.getMonth() === mm - 1 && date.getDate() === dd;
        });
      }
      case "confirm-details":
        return !!(state.firstName && state.lastName && state.email.includes("@"));
      case "phone-verification":
        return false; // auto-submits
      case "idin-verification":
        return state.iban.length >= 5;
      case "acceptance-questions":
        return true;
      case "final-preview":
        return state.agreeTerms && state.agreeDebit;
      default:
        return true;
    }
  };

  // Phase progress calculation
  const getPhaseProgress = (): number => {
    if (!currentStepConfig?.phase) return 0;
    const phaseSteps = flow.steps.filter((s) => s.phase === currentStepConfig.phase);
    const idxInPhase = phaseSteps.findIndex((s) => s.id === currentStepId);
    // If it's the last step in phase (like "ready"), show 100%
    if (idxInPhase === phaseSteps.length - 1) return 100;
    return ((idxInPhase + 1) / phaseSteps.length) * 100;
  };

  // Sidebar step
  const getSidebarStep = (): number => {
    if (!currentStepConfig?.phase) {
      if (currentStepId === "product-selection") return 1;
      if (currentStepId === "preferences" || currentStepId === "loading") return 2;
      if (currentStepId === "offer") return 3;
      return 4;
    }
    const phase = flow.phases.find((p) => p.id === currentStepConfig.phase);
    return phase?.sidebarStep || 1;
  };

  const handleNext = () => {
    // Family step auto-advances via onSelect
    if (currentStepId === "family" && state.familyStatus) return;

    // Preferences delegates internally
    if (currentStepId === "preferences" && prefsRef.current) {
      const handled = prefsRef.current.handleNext();
      if (handled) return;
    }

    goToIndex(getNextIndex());
  };

  const handleBack = () => {
    if (currentStepId === "preferences" && prefsRef.current) {
      const handled = prefsRef.current.handleBack();
      if (handled) return;
    }
    goToIndex(getPrevIndex());
  };

  const phaseLabel = currentStepConfig?.phase
    ? flow.phases.find((p) => p.id === currentStepConfig.phase)?.label
    : null;

  const showFooter = !currentStepConfig?.hideFooter;
  const showSavings = !currentStepConfig?.hideSavings;
  const showNextButton = !currentStepConfig?.hideNextButton;
  const buttonLabel = currentStepConfig?.buttonLabel || "Next";
  const isStandalone = currentStepConfig?.standalone;
  const isFullWidth = currentStepConfig?.fullWidth;

  // Render step component by ID
  const renderStep = () => {
    switch (currentStepId) {
      case "product-selection":
        return (
          <StepOne
            selected={state.selectedInsurances}
            onToggle={toggleInsurance}
            onBundleSelect={selectBundle}
            onNext={() => goToIndex(getNextIndex())}
            onSmartAudit={
              flow.steps.some((s) => s.id === "policy-upload")
                ? () => goToStepId("policy-upload")
                : undefined
            }
          />
        );
      case "policy-upload":
        return (
          <StepPolicyUpload
            onParsed={(data) => {
              setState((s) => ({
                ...s,
                firstName: data.firstName,
                lastName: data.lastName,
                postcode: data.postcode,
                houseNumber: data.houseNumber,
                birthdate: data.birthdate,
                selectedInsurances: data.selectedInsurances,
                preferences: { ...s.preferences, ...data.preferences },
                familyStatus: "single", // default for fast-track
              }));
              // Fast-track: jump directly to offer
              goToStepId("offer");
            }}
            onBack={() => goToStepId("product-selection")}
          />
        );
      case "name":
        return (
          <StepName
            firstName={state.firstName}
            lastName={state.lastName}
            onUpdate={(field, value) => setState((s) => ({ ...s, [field]: value }))}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
            animateTaco={shouldAnimateTaco}
          />
        );
      case "address":
        return (
          <StepAddress
            firstName={state.firstName}
            postcode={state.postcode}
            houseNumber={state.houseNumber}
            addition={state.addition}
            onUpdate={(field, value) => setState((s) => ({ ...s, [field]: value }))}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
            animateTaco={shouldAnimateTaco}
          />
        );
      case "birthdate":
        return (
          <StepBirthdate
            birthdate={state.birthdate}
            onUpdate={(value) => setState((s) => ({ ...s, birthdate: value }))}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
          />
        );
      case "family":
        return (
          <StepFamily
            familyStatus={state.familyStatus}
            onSelect={(value) => {
              setState((s) => ({ ...s, familyStatus: value }));
              // Use the step config's getNextStep if available
              const config = flow.steps[stepIndex];
              if (config?.getNextStep) {
                const nextId = config.getNextStep({ ...state, familyStatus: value });
                if (nextId) goToStepId(nextId);
              } else {
                goToIndex(stepIndex + 1);
              }
            }}
            onBack={() => goToIndex(getPrevIndex())}
          />
        );
      case "family-details":
        return (
          <StepFamilyDetails
            familyStatus={state.familyStatus}
            insurePartner={state.insurePartner}
            childrenCount={state.childrenCount}
            childrenAges={state.childrenAges}
            onUpdatePartner={(value) => setState((s) => ({ ...s, insurePartner: value }))}
            onUpdateChildren={(value) => {
              setState((s) => {
                const newAges = [...s.childrenAges];
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
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
          />
        );
      case "ready":
        return (
          <StepReady
            selectedInsurances={state.selectedInsurances}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
          />
        );
      case "preferences":
        return (
          <StepPreferences
            ref={prefsRef}
            selectedInsurances={state.selectedInsurances}
            preferences={state.preferences}
            firstName={state.firstName}
            phone={state.phone}
            email={state.email}
            savings={totalSavings}
            onUpdatePreference={updatePreference}
            onUpdatePhone={(value) => setState((s) => ({ ...s, phone: value }))}
            onUpdateEmail={(value) => setState((s) => ({ ...s, email: value }))}
            onAddInsurances={(ids) => setState((s) => ({ ...s, selectedInsurances: [...s.selectedInsurances, ...ids] }))}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
          />
        );
      case "loading":
        return <StepLoading onComplete={() => goToIndex(getNextIndex())} />;
      case "offer":
        return (
          <StepOffer
            selectedInsurances={state.selectedInsurances}
            preferences={state.preferences}
            firstName={state.firstName}
            onUpdatePreference={updatePreference}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
          />
        );
      case "start-date":
        return (
          <StepStartDate
            selectedInsurances={state.selectedInsurances}
            startDates={state.startDates}
            onUpdateStartDate={(id, date) =>
              setState((s) => ({ ...s, startDates: { ...s.startDates, [id]: date } }))
            }
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
          />
        );
      case "confirm-details":
        return (
          <StepConfirmDetails
            firstName={state.firstName}
            infix={state.infix}
            lastName={state.lastName}
            phone={state.phone}
            email={state.email}
            onUpdateField={(field, value) => setState((s) => ({ ...s, [field]: value }))}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
          />
        );
      case "phone-verification":
        return (
          <StepPhoneVerification
            phone={state.phone}
            onVerified={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
          />
        );
      case "idin-verification":
        return (
          <StepIdinVerification
            iban={state.iban}
            onUpdateIban={(value) => setState((s) => ({ ...s, iban: value }))}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
          />
        );
      case "acceptance-questions":
        return (
          <StepAcceptanceQuestions
            answers={state.acceptanceAnswers}
            onUpdateAnswer={(qId, val) =>
              setState((s) => ({
                ...s,
                acceptanceAnswers: { ...s.acceptanceAnswers, [qId]: val },
              }))
            }
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
          />
        );
      case "final-preview":
        return (
          <StepFinalPreview
            selectedInsurances={state.selectedInsurances}
            startDates={state.startDates}
            firstName={state.firstName}
            infix={state.infix}
            lastName={state.lastName}
            iban={state.iban}
            email={state.email}
            agreeTerms={state.agreeTerms}
            agreeDebit={state.agreeDebit}
            onUpdateAgree={(field, value) => setState((s) => ({ ...s, [field]: value }))}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
          />
        );
      case "success":
        return <StepSuccess email={state.email} />;
      default:
        return <StepSuccess email={state.email} />;
    }
  };

  // Standalone layout (Step 1)
  if (isStandalone) {
    return (
      <div className="pb-0">
        <FlowSwitcher currentFlowId={flowId} onSwitch={switchFlow} />
        {renderStep()}
        {showFooter && <div aria-hidden className="h-36 md:h-40" />}
        {showFooter && (
          <StickyFooter
            savings={totalSavings}
            onNext={handleNext}
            disabled={!canProceed()}
            buttonLabel={buttonLabel}
            hasSidebar={true}
            showSavings={showSavings}
            showNextButton={showNextButton}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentStep={getSidebarStep()} visible={true} />
      <FlowSwitcher currentFlowId={flowId} onSwitch={switchFlow} />

      <main className={`flex-1 px-6 md:px-12 lg:px-16 py-8 md:py-12 ${isFullWidth ? '' : 'max-w-3xl mx-auto'}`}>
        {phaseLabel && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">{phaseLabel}</h1>
            <Progress value={getPhaseProgress()} className="h-2 [&>div]:bg-success" />
          </div>
        )}
        {renderStep()}
        {showFooter && <div aria-hidden className="h-36 md:h-40" />}
      </main>

      {showFooter && (
        <StickyFooter
          savings={totalSavings}
          onNext={handleNext}
          onBack={handleBack}
          disabled={!canProceed()}
          buttonLabel={buttonLabel}
          hasSidebar={true}
          showSavings={showSavings}
          showNextButton={showNextButton}
        />
      )}
    </div>
  );
};

export default Index;
