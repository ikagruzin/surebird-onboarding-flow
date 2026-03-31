import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Sidebar } from "@/components/onboarding/sidebar";
import { StepOne } from "@/components/onboarding/step-one";
import { StepName } from "@/components/onboarding/step-name";
import { StepAddress } from "@/components/onboarding/step-address";
import { StepBirthdate } from "@/components/onboarding/step-birthdate";
import { StepFamily } from "@/components/onboarding/step-family";
import { StepFamilyDetails } from "@/components/onboarding/step-family-details";
import { StepPreferences } from "@/components/onboarding/step-preferences";
import type { StepPreferencesHandle } from "@/components/onboarding/step-preferences";
import { StepReady } from "@/components/onboarding/step-ready";
import { StepAllSet } from "@/components/onboarding/step-all-set";
import { StepLoading } from "@/components/onboarding/step-loading";
import { StepUpsell } from "@/components/onboarding/step-upsell";
import { StepOffer } from "@/components/onboarding/step-offer";
import { OfferGate } from "@/components/onboarding/offer-gate";
import { StepPolicyUpload } from "@/components/onboarding/step-policy-upload";
import { StepStartDate } from "@/components/onboarding/step-start-date";
import { StepConfirmDetails } from "@/components/onboarding/step-confirm-details";
import { StepPhoneVerification } from "@/components/onboarding/step-phone-verification";
import { StepIdinVerification } from "@/components/onboarding/step-idin-verification";
import { StepAcceptanceQuestions } from "@/components/onboarding/step-acceptance-questions";
import { StepFinalPreview } from "@/components/onboarding/step-final-preview";
import { StepSuccess } from "@/components/onboarding/step-success";
import { Footer } from "@/components/onboarding/footer";
import { StickyFooter } from "@/components/onboarding/sticky-footer";
import { FlowSwitcher } from "@/components/onboarding/flow-switcher";
import { DevSkipButton } from "@/components/onboarding/dev-skip-button";
import { Progress } from "@/components/ui/progress";
import { INSURANCE_TYPES } from "@/components/onboarding/types";
import type { WizardState } from "@/components/onboarding/types";
import type { StepId, StepConfig, FlowConfig } from "@/config/flow-types";
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

export const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const flowId = searchParams.get("flow") || DEFAULT_FLOW_ID;
  const flow = useMemo(() => getFlow(flowId), [flowId]);

  const [state, setState] = useState<WizardState>({ ...INITIAL_STATE });
  const [offerUnlocked, setOfferUnlocked] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [shakeFooter, setShakeFooter] = useState(false);
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
    setOfferUnlocked(false);
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
        return state.firstName.trim().length > 0;
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
      case "all-set":
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

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    switch (currentStepId) {
      case "product-selection":
        if (state.selectedInsurances.length === 0) errs.selection = "Please select at least one insurance";
        break;
      case "name":
        if (!state.firstName.trim()) errs.firstName = "Please enter your first name";
        break;
      case "address": {
        const pc = state.postcode.replace(/\s/g, "");
        if (pc.length < 6) errs.postcode = "Please enter a valid postcode";
        if (!state.houseNumber.trim()) errs.houseNumber = "Please enter your house number";
        break;
      }
      case "birthdate":
        if (state.birthdate.trim().length < 10) errs.birthdate = "Please enter your date of birth (dd-mm-yyyy)";
        break;
      case "family":
        if (!state.familyStatus) errs.familyStatus = "Please select your family status";
        break;
      case "start-date": {
        const products = INSURANCE_TYPES.filter((t) => state.selectedInsurances.includes(t.id));
        products.forEach((p) => {
          const val = state.startDates[p.id] || "";
          if (val.length !== 10) errs[`startDate_${p.id}`] = `Please select a start date for ${p.label}`;
        });
        break;
      }
      case "confirm-details":
        if (!state.firstName.trim()) errs.firstName = "First name is required";
        if (!state.lastName.trim()) errs.lastName = "Surname is required";
        if (!state.email.includes("@")) errs.email = "Please enter a valid email address";
        break;
      case "idin-verification":
        if (state.iban.length < 5) errs.iban = "Please complete iDIN verification";
        break;
      case "final-preview":
        if (!state.agreeTerms) errs.agreeTerms = "You must agree to the terms";
        if (!state.agreeDebit) errs.agreeDebit = "You must give debit permission";
        break;
    }
    return errs;
  };

  const clearError = useCallback((field: string) => {
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleNext = () => {
    // Family step auto-advances via onSelect
    if (currentStepId === "family" && state.familyStatus) return;

    // Preferences delegates internally
    if (currentStepId === "preferences" && prefsRef.current) {
      const handled = prefsRef.current.handleNext();
      if (handled) return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      setShakeFooter(true);
      setTimeout(() => setShakeFooter(false), 500);
      return;
    }

    setValidationErrors({});
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
            onUpdate={(field, value) => setState((s) => ({ ...s, [field]: value }))}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
            animateTaco={shouldAnimateTaco}
            errors={validationErrors}
            onClearError={clearError}
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
            errors={validationErrors}
            onClearError={clearError}
          />
        );
      case "birthdate":
        return (
          <StepBirthdate
            birthdate={state.birthdate}
            onUpdate={(value) => setState((s) => ({ ...s, birthdate: value }))}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
            animateTaco={shouldAnimateTaco}
            errors={validationErrors}
            onClearError={clearError}
          />
        );
      case "family":
        return (
          <StepFamily
            familyStatus={state.familyStatus}
            onSelect={(value) => {
              setState((s) => ({ ...s, familyStatus: value }));
              const config = flow.steps[stepIndex];
              if (config?.getNextStep) {
                const nextId = config.getNextStep({ ...state, familyStatus: value });
                if (nextId) goToStepId(nextId);
              } else {
                goToIndex(stepIndex + 1);
              }
            }}
            onBack={() => goToIndex(getPrevIndex())}
            animateTaco={shouldAnimateTaco}
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
            animateTaco={shouldAnimateTaco}
          />
        );
      case "ready":
        return (
          <StepReady
            selectedInsurances={state.selectedInsurances}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
            animateTaco={shouldAnimateTaco}
          />
        );
      case "preferences":
        return null; // rendered as always-mounted below
      case "loading":
        return <StepLoading onComplete={() => goToIndex(getNextIndex())} animateTaco={shouldAnimateTaco} />;
      case "all-set":
        return (
          <StepAllSet
            selectedInsurances={state.selectedInsurances}
            firstName={state.firstName}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
            animateTaco={shouldAnimateTaco}
          />
        );
      case "offer": {
        const isGatedFlow = flow.steps.some((s) => s.id === "all-set");
        return (
          <StepOffer
            selectedInsurances={state.selectedInsurances}
            preferences={state.preferences}
            firstName={state.firstName}
            onUpdatePreference={updatePreference}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
            animateTaco={shouldAnimateTaco}
            gated={isGatedFlow}
            gateUnlocked={offerUnlocked}
            gateOverlay={
              <OfferGate
                firstName={state.firstName}
                phone={state.phone}
                email={state.email}
                onUpdatePhone={(value) => setState((s) => ({ ...s, phone: value }))}
                onUpdateEmail={(value) => setState((s) => ({ ...s, email: value }))}
                onUnlock={() => setOfferUnlocked(true)}
              />
            }
          />
        );
      }
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
            animateTaco={shouldAnimateTaco}
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
            animateTaco={shouldAnimateTaco}
            errors={validationErrors}
            onClearError={clearError}
          />
        );
      case "phone-verification":
        return (
          <StepPhoneVerification
            phone={state.phone}
            onVerified={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
            animateTaco={shouldAnimateTaco}
          />
        );
      case "idin-verification":
        return (
          <StepIdinVerification
            iban={state.iban}
            onUpdateIban={(value) => setState((s) => ({ ...s, iban: value }))}
            onNext={() => goToIndex(getNextIndex())}
            onBack={() => goToIndex(getPrevIndex())}
            animateTaco={shouldAnimateTaco}
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
            animateTaco={shouldAnimateTaco}
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
            animateTaco={shouldAnimateTaco}
            errors={validationErrors}
            onClearError={clearError}
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
      <DevSkipButton
        flow={flow}
        onSkip={(data, idx) => {
          setState((s) => ({ ...s, ...data, currentStep: idx }));
        }}
      />
      {renderStep()}
      {showFooter && <div aria-hidden className="h-36 md:h-40" />}
      {showFooter && (
        <StickyFooter
            savings={totalSavings}
            onNext={handleNext}
            buttonLabel={buttonLabel}
            hasSidebar={true}
            showSavings={showSavings}
            showNextButton={showNextButton}
            shake={shakeFooter}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentStep={getSidebarStep()} visible={true} />
      <FlowSwitcher currentFlowId={flowId} onSwitch={switchFlow} />
      <DevSkipButton
        flow={flow}
        onSkip={(data, idx) => {
          setState((s) => ({ ...s, ...data, currentStep: idx }));
        }}
      />

      <main className={`flex-1 px-6 md:px-12 lg:px-16 py-8 md:py-12 ${isFullWidth ? '' : 'max-w-3xl mx-auto'}`}>
        {phaseLabel && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">{phaseLabel}</h1>
            <Progress value={getPhaseProgress()} className="h-2 [&>div]:bg-success" />
          </div>
        )}
        {/* Always-mounted StepPreferences to preserve state */}
        {flow.steps.some((s) => s.id === "preferences") && (
          <div className={currentStepId === "preferences" ? "" : "hidden"}>
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
              animateTaco={shouldAnimateTaco}
              skipContactStep={flow.steps.some((s) => s.id === "all-set")}
            />
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
          buttonLabel={buttonLabel}
          hasSidebar={true}
          showSavings={showSavings}
          showNextButton={showNextButton}
          shake={shakeFooter}
        />
      )}
    </div>
  );
};

