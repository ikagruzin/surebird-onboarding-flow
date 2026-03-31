/**
 * Renders a single product's step flow inside a tab.
 * Used by StepPreferences in Flow A to embed real product logic.
 */
import { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { useProductFlow } from "@/hooks/use-product-flow";
import { getProductConfig } from "@/config/products";
import { PRODUCT_STEP_COMPONENT_MAPS } from "./component-maps";

export interface ProductFlowTabHandle {
  /** Returns true if handled internally, false if flow is complete */
  handleNext: () => boolean;
  /** Returns true if handled internally, false if at first step */
  handleBack: () => boolean;
  /** Whether all steps are done and valid */
  isComplete: boolean;
  /** Progress info for the parent's progress bar */
  progress: { completed: number; total: number };
  /** Whether the footer should shake */
  shakeFooter: boolean;
}

interface ProductFlowTabProps {
  productId: string;
  animateTaco?: boolean;
  isActive?: boolean;
}

export const ProductFlowTab = forwardRef<ProductFlowTabHandle, ProductFlowTabProps>(
  ({ productId, isActive = false }, ref) => {
    const config = getProductConfig(productId)!;
    const flow = useProductFlow(config);
    const componentMap = PRODUCT_STEP_COMPONENT_MAPS[productId] || {};
    const StepComponent = componentMap[flow.currentStepId];
    const wasActiveRef = useRef(false);

    useEffect(() => {
      if (!wasActiveRef.current && isActive && flow.shouldAnimateTaco) {
        // no-op effect to align first visible render with active state changes
      }
      wasActiveRef.current = isActive;
    }, [isActive, flow.shouldAnimateTaco]);

    useImperativeHandle(ref, () => ({
      handleNext: () => {
        if (flow.isLastStep) {
          if (flow.isValid) return false; // complete → parent handles tab transition
          // Not valid — try to show errors
          flow.tryNext();
          return true; // consume event
        }
        if (flow.isValid) {
          flow.goNext();
        } else {
          flow.tryNext();
        }
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
      shakeFooter: flow.shakeFooter,
    }), [flow.isLastStep, flow.isValid, flow.stepIdx, flow.steps.length, flow.goNext, flow.goBack, flow.tryNext, flow.shakeFooter]);

    if (!StepComponent) {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No step component found for product "{productId}" and step "{flow.currentStepId}".
        </div>
      );
    }

    return (
      <StepComponent
        state={flow.state}
        onUpdate={(key, value) => {
          flow.update(key, value);
          flow.clearError(key);
        }}
        onAutoAdvance={flow.autoAdvance}
        animateTaco={isActive && flow.shouldAnimateTaco}
        onAnimationComplete={flow.markAnimated}
        errors={flow.validationErrors}
        onClearError={flow.clearError}
      />
    );
  },
);

ProductFlowTab.displayName = "ProductFlowTab";
