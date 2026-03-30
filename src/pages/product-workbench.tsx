import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { StickyFooter } from "@/components/onboarding/sticky-footer";
import { FlowSwitcher } from "@/components/onboarding/flow-switcher";
import { useProductFlow } from "@/hooks/use-product-flow";
import { getAllProductConfigs, getProductConfig } from "@/config/products";
import { PRODUCT_STEP_COMPONENT_MAPS } from "@/components/products/component-maps";
import type { ProductStepProps } from "@/config/products/types";
import type { ComponentType } from "react";

import iconHome from "@/assets/icon-home.svg";
import iconLiability from "@/assets/icon-liability.svg";
import iconLegal from "@/assets/icon-legal.svg";
import iconAccidents from "@/assets/icon-accidents.svg";
import iconCaravan from "@/assets/icon-caravan.svg";

/* ─── Icon map ─── */
const ICON_MAP: Record<string, string> = {
  "icon-home": iconHome,
  "icon-liability": iconLiability,
  "icon-legal": iconLegal,
  "icon-accidents": iconAccidents,
  "icon-caravan": iconCaravan,
};

/* ─── Component maps per product ─── */
const COMPONENT_MAPS = PRODUCT_STEP_COMPONENT_MAPS;

/* ─── Flow C: Product Workbench ─── */

export const ProductWorkbench = () => {
  const navigate = useNavigate();
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const activeConfig = activeProductId ? getProductConfig(activeProductId) : undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Flow Switcher — always visible */}
      <FlowSwitcher currentFlowId="c" onSwitch={(id) => navigate(`/?flow=${id}`)} />

      {activeConfig ? (
        <ProductFlowView
          config={activeConfig}
          componentMap={COMPONENT_MAPS[activeConfig.id] || {}}
          onBack={() => setActiveProductId(null)}
        />
      ) : (
        <ProductListing onSelect={setActiveProductId} />
      )}
    </div>
  );
};

/* ─── Product Listing ─── */

const ProductListing = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const products = getAllProductConfigs();

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-3xl px-6 py-16">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Product Workbench
        </h1>
        <p className="text-muted-foreground mb-8">
          Select a product to test its flow in isolation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {products.map((product) => (
            <button
              key={product.id}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl border-2 border-border bg-card hover:border-primary hover:bg-primary/5 shadow-sm text-left transition-colors"
              onClick={() => onSelect(product.id)}
            >
              {ICON_MAP[product.icon] && (
                <img src={ICON_MAP[product.icon]} alt={product.label} className="w-10 h-10" />
              )}
              <span className="font-medium text-foreground flex-1">{product.label}</span>
              <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Product Flow View ─── */

interface ProductFlowViewProps {
  config: import("@/config/products/types").ProductConfig;
  componentMap: Record<string, ComponentType<ProductStepProps>>;
  onBack: () => void;
}

const ProductFlowView = ({ config, componentMap, onBack }: ProductFlowViewProps) => {
  const flow = useProductFlow(config);

  const handleNext = () => {
    if (flow.isLastStep) {
      flow.reset();
      onBack();
      return;
    }
    flow.goNext();
  };

  const handleBack = () => {
    if (flow.stepIdx > 0) {
      flow.goBack();
    } else {
      onBack();
    }
  };

  const StepComponent = componentMap[flow.currentStepId];

  if (!StepComponent) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-muted-foreground">No component found for step "{flow.currentStepId}"</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/10 transition-colors"
              aria-label="Back to products"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              {ICON_MAP[config.icon] && (
                <img src={ICON_MAP[config.icon]} alt={config.label} className="w-8 h-8" />
              )}
              <div>
                <h1 className="text-lg font-bold text-foreground">{config.label}</h1>
                <p className="text-xs text-muted-foreground">
                  Step {flow.stepIdx + 1} of {flow.steps.length}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => { flow.reset(); }}
            className="inline-flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 border border-destructive/30 rounded-full px-4 py-2 hover:bg-destructive/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Step content */}
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
        buttonLabel={flow.isLastStep ? "Complete" : "Next"}
        showSavings={false}
        showNextButton
      />
    </>
  );
};
