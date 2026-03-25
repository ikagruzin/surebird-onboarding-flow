import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home, RotateCcw } from "lucide-react";
import StickyFooter from "@/components/onboarding/StickyFooter";
import FlowSwitcher from "@/components/onboarding/FlowSwitcher";
import type { HouseState } from "@/components/onboarding/types";
import { INITIAL_HOUSE, PRESET_HOUSE } from "@/components/onboarding/types";
import iconHome from "@/assets/icon-home.svg";

// Shared house step components
import StepHousePreset from "@/components/onboarding/house/StepHousePreset";
import StepHouseRole from "@/components/onboarding/house/StepHouseRole";
import StepHouseDetails from "@/components/onboarding/house/StepHouseDetails";
import StepHouseCoverage from "@/components/onboarding/house/StepHouseCoverage";
import StepHouseContents from "@/components/onboarding/house/StepHouseContents";
import StepHouseBuilding from "@/components/onboarding/house/StepHouseBuilding";

/* ─── Steps ─── */
type StepKey =
  | "product-selection"
  | "preset-verification"
  | "role"
  | "home-details"
  | "coverage-path"
  | "contents"
  | "building";

function getStepSequence(
  state: HouseState,
  version: "a" | "b",
  presetAnswer: "yes" | "no" | "",
): StepKey[] {
  const steps: StepKey[] = ["product-selection"];

  if (version === "a") {
    steps.push("preset-verification");

    if (presetAnswer === "yes") {
      steps.push("role");
      if (state.role === "tenant") {
        steps.push("contents");
      } else if (state.role === "homeowner") {
        steps.push("coverage-path");
        if (state.coverageChoice === "household") steps.push("contents");
        else if (state.coverageChoice === "building") steps.push("building");
        else if (state.coverageChoice === "both") steps.push("contents", "building");
      }
    } else if (presetAnswer === "no") {
      steps.push("home-details");
      steps.push("role");
      if (state.role === "tenant") {
        steps.push("contents");
      } else if (state.role === "homeowner") {
        steps.push("coverage-path");
        if (state.coverageChoice === "household") steps.push("contents");
        else if (state.coverageChoice === "building") steps.push("building");
        else if (state.coverageChoice === "both") steps.push("contents", "building");
      }
    }
  } else {
    steps.push("role");
    if (state.role === "tenant") {
      steps.push("home-details", "contents");
    } else if (state.role === "homeowner") {
      steps.push("coverage-path", "home-details");
      if (state.coverageChoice === "household") steps.push("contents");
      else if (state.coverageChoice === "building") steps.push("building");
      else if (state.coverageChoice === "both") steps.push("contents", "building");
    }
  }

  return steps;
}

/* ─── Page ─── */
const HouseInsurance = () => {
  const navigate = useNavigate();
  const [house, setHouse] = useState<HouseState>({ ...INITIAL_HOUSE });
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [testVersion, setTestVersion] = useState<"a" | "b">("a");
  const [presetAnswer, setPresetAnswer] = useState<"yes" | "no" | "">("");
  const [animatedSteps, setAnimatedSteps] = useState<Set<string>>(new Set());

  const update = useCallback(<K extends keyof HouseState>(key: K, val: HouseState[K]) => {
    setHouse((s) => ({ ...s, [key]: val }));
  }, []);

  const steps = getStepSequence(house, testVersion, presetAnswer);
  const currentStep = steps[currentStepIdx] || "product-selection";

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case "product-selection":
        return true;
      case "preset-verification":
        return presetAnswer !== "";
      case "role":
        return house.role !== "";
      case "home-details":
        return !!(
          house.buildingType && house.usage.length > 0 &&
          house.constructionMaterial && house.floorMaterial &&
          house.roofShape && house.roofMaterial
        );
      case "coverage-path":
        return house.coverageChoice !== "";
      case "contents":
        if (testVersion === "a") return !!(house.security && house.netIncome && house.outsideValue);
        return !!(house.security && house.netIncome && house.outsideValue && house.basicCoverage);
      case "building":
        if (testVersion === "a") return !!house.floorCount;
        return !!(house.floorCount && house.basicCoverage);
      default:
        return false;
    }
  };

  const isLastStep = currentStepIdx === steps.length - 1 && steps.length > 1;

  const goToNextStep = useCallback(() => {
    const nextIdx = currentStepIdx + 1;
    const currentSteps = getStepSequence(house, testVersion, presetAnswer);
    if (nextIdx < currentSteps.length) {
      setCurrentStepIdx(nextIdx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStepIdx, house, testVersion, presetAnswer]);

  const handleNext = () => {
    if (isLastStep) {
      navigate("/test-flows/house");
      handleReset();
      return;
    }
    goToNextStep();
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setHouse({ ...INITIAL_HOUSE });
    setCurrentStepIdx(0);
    setPresetAnswer("");
    setAnimatedSteps(new Set());
  };

  const handleVersionSwitch = (v: "a" | "b") => {
    setTestVersion(v);
    setHouse({ ...INITIAL_HOUSE });
    setCurrentStepIdx(1);
    setPresetAnswer("");
    setAnimatedSteps(new Set());
  };

  const handlePresetAnswer = (answer: "yes" | "no") => {
    setPresetAnswer(answer);
    setHouse((s) => ({ ...s, ...PRESET_HOUSE }));
    setTimeout(() => {
      const nextIdx = currentStepIdx + 1;
      const nextSteps = getStepSequence(
        answer === "yes" ? { ...house, ...PRESET_HOUSE } : house,
        testVersion,
        answer,
      );
      if (nextIdx < nextSteps.length) {
        setCurrentStepIdx(nextIdx);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 400);
  };

  // Auto-advance for role selection
  const handleRoleSelect = (role: "tenant" | "homeowner") => {
    update("role", role);
    setTimeout(() => {
      const updatedHouse = { ...house, role };
      const nextSteps = getStepSequence(updatedHouse, testVersion, presetAnswer);
      const roleIdx = nextSteps.indexOf("role");
      if (roleIdx >= 0 && roleIdx + 1 < nextSteps.length) {
        setCurrentStepIdx(roleIdx + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 400);
  };

  // Auto-advance for coverage selection
  const handleCoverageSelect = (choice: "household" | "building" | "both") => {
    update("coverageChoice", choice);
    setTimeout(() => {
      const updatedHouse = { ...house, coverageChoice: choice };
      const nextSteps = getStepSequence(updatedHouse, testVersion, presetAnswer);
      const coverageIdx = nextSteps.indexOf("coverage-path");
      if (coverageIdx >= 0 && coverageIdx + 1 < nextSteps.length) {
        setCurrentStepIdx(coverageIdx + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 400);
  };

  // Track animation per step
  const shouldAnimateTaco = !animatedSteps.has(currentStep);
  const markAnimated = useCallback(() => {
    setAnimatedSteps((prev) => new Set(prev).add(currentStep));
  }, [currentStep]);

  const totalSavings = 45;

  /* ─── Step Renders ─── */

  const renderProductSelection = () => (
    <div className="flex min-h-screen bg-background">
      <FlowSwitcher currentFlowId="c" onSwitch={() => navigate("/?flow=a")} />
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Choose your insurances</h2>
          <p className="text-muted-foreground mb-8">Select the product you'd like to test in this flow.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              className="flex items-center gap-3 px-5 py-4 rounded-2xl border-2 border-primary bg-primary/10 shadow-md text-left"
              onClick={handleNext}
            >
              <img src={iconHome} alt="Home" className="w-10 h-10" />
              <span className="font-medium text-foreground flex-1">Home</span>
              <div className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "product-selection":
        return null;
      case "preset-verification":
        return (
          <StepHousePreset
            presetAnswer={presetAnswer}
            onAnswer={handlePresetAnswer}
            animateTaco={shouldAnimateTaco}
            onAnimationComplete={markAnimated}
          />
        );
      case "role":
        return (
          <StepHouseRole
            role={house.role}
            onSelect={handleRoleSelect}
            animateTaco={shouldAnimateTaco}
            onAnimationComplete={markAnimated}
          />
        );
      case "home-details":
        return (
          <StepHouseDetails
            house={house}
            onUpdate={update}
            showOwnRisk={testVersion !== "a"}
            animateTaco={shouldAnimateTaco}
            onAnimationComplete={markAnimated}
          />
        );
      case "coverage-path":
        return (
          <StepHouseCoverage
            coverageChoice={house.coverageChoice}
            onSelect={handleCoverageSelect}
            animateTaco={shouldAnimateTaco}
            onAnimationComplete={markAnimated}
          />
        );
      case "contents":
        return (
          <StepHouseContents
            house={house}
            onUpdate={update}
            showCoverageLevel={testVersion !== "a"}
            animateTaco={shouldAnimateTaco}
            onAnimationComplete={markAnimated}
          />
        );
      case "building":
        return (
          <StepHouseBuilding
            house={house}
            onUpdate={update}
            showCoverageLevel={testVersion !== "a"}
            animateTaco={shouldAnimateTaco}
            onAnimationComplete={markAnimated}
          />
        );
      default:
        return null;
    }
  };

  if (currentStep === "product-selection") {
    return renderProductSelection();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">House Insurance</h1>
              <p className="text-xs text-muted-foreground">Product Flow Test</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-muted rounded-full p-1">
              <button
                onClick={() => handleVersionSwitch("a")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  testVersion === "a"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Version A
              </button>
              <button
                onClick={() => handleVersionSwitch("b")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  testVersion === "b"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Version B
              </button>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 border border-destructive/30 rounded-full px-4 py-2 hover:bg-destructive/5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16 pb-3">
          <p className="text-xs text-muted-foreground">
            {testVersion === "a"
              ? "Smart Preset — Confirms pre-filled home details before continuing."
              : "Manual Only — Fill in all home details from scratch."}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-12">
        {renderCurrentStep()}
      </div>

      <div aria-hidden className="h-36" />

      <StickyFooter
        savings={totalSavings}
        onNext={handleNext}
        onBack={currentStepIdx > 0 ? handleBack : undefined}
        disabled={!canGoNext()}
        buttonLabel={isLastStep ? "Continue to Offer" : "Next"}
        showSavings={false}
        showNextButton
      />
    </div>
  );
};

export default HouseInsurance;
