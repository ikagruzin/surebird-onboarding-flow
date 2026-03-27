/**
 * Renders a single product's step flow inside a tab.
 * Used by StepPreferences in Flow A to embed real product logic.
 */
import { forwardRef, useImperativeHandle } from "react";
import { useProductFlow } from "@/hooks/use-product-flow";
import { getProductConfig } from "@/config/products";
import { HOME_STEP_COMPONENTS } from "./home-steps";
import type { ProductStepProps } from "@/config/products/types";
import type { ComponentType } from "react";

/** Component maps per product. Add new products here. */
const COMPONENT_MAPS: Record<string, Record<string, ComponentType<ProductStepProps>>> = {
  home: HOME_STEP_COMPONENTS,
};

export interface ProductFlowTabHandle {
  /** Returns true if handled internally, false if flow is complete */
  handleNext: () => boolean;
  /** Returns true if handled internally, false if at first step */
  handleBack: () => boolean;
  /** Whether all steps are done and valid */
  isComplete: boolean;
  /** Progress info for the parent's progress bar */
  progress: { completed: number; total: number };
}

interface ProductFlowTabProps {
  productId: string;
  animateTaco?: boolean;
}

export const ProductFlowTab = forwardRef<ProductFlowTabHandle, ProductFlowTabProps>(
  ({ productId }, ref) => {
    const config = getProductConfig(productId)!;
    const flow = useProductFlow(config);
    const componentMap = COMPONENT_MAPS[productId] || {};
    const StepComponent = componentMap[flow.currentStepId];

    useImperativeHandle(ref, () => ({
      handleNext: () => {
        if (flow.isLastStep) {
          if (flow.isValid) return false; // complete → parent handles tab transition
          return true; // not valid yet, consume event
        }
        if (flow.isValid) flow.goNext();
        return true; // handled internally
      },
      handleBack: () => {
        if (flow.stepIdx > 0) {
          flow.goBack();
          return true;
        }
        return false; // at first step → parent handles
      },
      isComplete: flow.isLastStep && flow.isValid,
      progress: {
        completed: Math.min(flow.stepIdx + (flow.isValid ? 1 : 0), flow.steps.length),
        total: flow.steps.length,
      },
    }), [flow.isLastStep, flow.isValid, flow.stepIdx, flow.steps.length, flow.goNext, flow.goBack]);

    if (!StepComponent) return null;

    return (
      <StepComponent
        state={flow.state}
        onUpdate={flow.update}
        onAutoAdvance={flow.autoAdvance}
        animateTaco={flow.shouldAnimateTaco}
        onAnimationComplete={flow.markAnimated}
      />
    );
  },
);

ProductFlowTab.displayName = "ProductFlowTab";
