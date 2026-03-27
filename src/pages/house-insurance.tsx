import { useNavigate } from "react-router-dom";
import { Home, RotateCcw } from "lucide-react";
import { StickyFooter } from "@/components/onboarding/sticky-footer";
import { FlowSwitcher } from "@/components/onboarding/flow-switcher";
import { useProductFlow } from "@/hooks/use-product-flow";
import { homeProduct } from "@/config/products/home";
import { HOME_STEP_COMPONENTS } from "@/components/products/home-steps";
import iconHome from "@/assets/icon-home.svg";

/* ─── Flow C: House Insurance Workbench ─── */

export const HouseInsurance = () => {
  const navigate = useNavigate();
  const flow = useProductFlow(homeProduct);

  /* Product selection is page-level, not part of the product flow */
  const isProductSelection = flow.stepIdx === -1;

  /* Handlers */
  const handleStartFlow = () => {
    flow.setStepIdx(0);
  };

  const handleNext = () => {
    if (flow.isLastStep) {
      flow.reset();
      return;
    }
    flow.goNext();
  };

  const handleBack = () => {
    if (flow.stepIdx > 0) {
      flow.goBack();
    }
  };

  const handleReset = () => {
    flow.reset();
  };

  /* ─── Product Selection Screen ─── */
  if (flow.stepIdx === 0 && flow.steps.length === 0) {
    // No steps yet — show product selection (stepIdx 0 with empty sequence means fresh start)
  }

  const renderProductSelection = () => (
    <div className="flex min-h-screen bg-background">
      <FlowSwitcher currentFlowId="c" onSwitch={() => navigate("/?flow=a")} />
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Choose your insurances
          </h2>
          <p className="text-muted-foreground mb-8">
            Select the product you'd like to test in this flow.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              className="flex items-center gap-3 px-5 py-4 rounded-2xl border-2 border-primary bg-primary/10 shadow-md text-left"
              onClick={handleStartFlow}
            >
              <img src={iconHome} alt="Home" className="w-10 h-10" />
              <span className="font-medium text-foreground flex-1">Home</span>
              <div className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Render current step ─── */
  const StepComponent = HOME_STEP_COMPONENTS[flow.currentStepId];

  /* If no steps are available yet, show product selection */
  if (!StepComponent) {
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
              <h1 className="text-lg font-bold text-foreground">
                House Insurance
              </h1>
              <p className="text-xs text-muted-foreground">
                Product Flow Test
              </p>
            </div>
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

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-12">
        <StepComponent
          state={flow.state}
          onUpdate={flow.update}
          onAutoAdvance={flow.autoAdvance}
          animateTaco={flow.shouldAnimateTaco}
          onAnimationComplete={flow.markAnimated}
        />
      </div>

      <div aria-hidden className="h-36" />

      <StickyFooter
        savings={45}
        onNext={handleNext}
        onBack={flow.stepIdx > 0 ? handleBack : undefined}
        disabled={!flow.isValid}
        buttonLabel={flow.isLastStep ? "Continue to Offer" : "Next"}
        showSavings={false}
        showNextButton
      />
    </div>
  );
};
