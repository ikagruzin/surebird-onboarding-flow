import { useState, useCallback, useRef } from "react";
import type { ProductConfig } from "@/config/products/types";

/**
 * Hook that manages product-flow state and navigation.
 * Used by both Flow C (standalone) and Flow A (embedded in tabs).
 */
export function useProductFlow(config: ProductConfig) {
  const [state, _setState] = useState<Record<string, any>>({
    ...config.initialState,
  });
  const [stepIdx, _setStepIdx] = useState(0);
  const [animatedSteps, setAnimatedSteps] = useState<Set<string>>(new Set());
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [shakeFooter, setShakeFooter] = useState(false);

  // Refs for stable closures in timeouts
  const stateRef = useRef(state);
  const stepIdxRef = useRef(stepIdx);

  const setState = useCallback((s: Record<string, any>) => {
    stateRef.current = s;
    _setState(s);
  }, []);

  const setStepIdx = useCallback((i: number) => {
    stepIdxRef.current = i;
    _setStepIdx(i);
  }, []);

  /* Derived values */
  const steps = config.getStepSequence(state);
  const currentStepId = steps[stepIdx] || steps[0];
  const isValid = config.validateStep(currentStepId, state);
  const isLastStep = stepIdx === steps.length - 1 && steps.length > 0;

  /* Taco animation tracking */
  const shouldAnimateTaco = !animatedSteps.has(currentStepId);
  const markAnimated = useCallback(() => {
    setAnimatedSteps((prev) => new Set(prev).add(currentStepId));
  }, [currentStepId]);

  /* State update */
  const update = useCallback(
    (key: string, value: any) => {
      const newState = { ...stateRef.current, [key]: value };
      setState(newState);
    },
    [setState],
  );

  /* Clear a single validation error */
  const clearError = useCallback((field: string) => {
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  /* Validate current step and return errors */
  const validateCurrentStep = useCallback((): Record<string, string> => {
    if (config.getValidationErrors) {
      return config.getValidationErrors(currentStepId, stateRef.current);
    }
    return {};
  }, [config, currentStepId]);

  /* Navigation */
  const goNext = useCallback(() => {
    const currentSteps = config.getStepSequence(stateRef.current);
    const nextIdx = stepIdxRef.current + 1;
    if (nextIdx < currentSteps.length) {
      setValidationErrors({});
      setStepIdx(nextIdx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [config, setStepIdx]);

  const goBack = useCallback(() => {
    if (stepIdxRef.current > 0) {
      setValidationErrors({});
      setStepIdx(stepIdxRef.current - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [setStepIdx]);

  /**
   * Try to advance: validate first, show errors if invalid.
   * Returns true if validation passed and advanced.
   */
  const tryNext = useCallback((): boolean => {
    const errs = config.getValidationErrors
      ? config.getValidationErrors(steps[stepIdxRef.current] || steps[0], stateRef.current)
      : {};
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      setShakeFooter(true);
      setTimeout(() => setShakeFooter(false), 500);
      return false;
    }
    setValidationErrors({});
    return true;
  }, [config, steps]);

  /**
   * Auto-advance: apply state updates, wait 400ms, then move to the next step.
   */
  const autoAdvance = useCallback(
    (updates: Record<string, any>, fromStepId: string) => {
      const newState = { ...stateRef.current, ...updates };
      setState(newState);
      setValidationErrors({});

      setTimeout(() => {
        const newSteps = config.getStepSequence(newState);
        const idx = newSteps.indexOf(fromStepId);
        if (idx >= 0 && idx + 1 < newSteps.length) {
          setStepIdx(idx + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 400);
    },
    [config, setState, setStepIdx],
  );

  /* Reset */
  const reset = useCallback(() => {
    setState({ ...config.initialState });
    setStepIdx(0);
    setAnimatedSteps(new Set());
    setValidationErrors({});
  }, [config, setState, setStepIdx]);

  return {
    state,
    update,
    steps,
    stepIdx,
    currentStepId,
    isValid,
    isLastStep,
    goNext,
    goBack,
    tryNext,
    autoAdvance,
    reset,
    shouldAnimateTaco,
    markAnimated,
    validationErrors,
    clearError,
    shakeFooter,
    /* escape hatches for complex orchestration */
    setState,
    setStepIdx,
  };
}
