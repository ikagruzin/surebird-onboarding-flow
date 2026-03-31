/**
 * MultiCarFlowTab — manages multiple car instances inside a single "Car" product tab.
 *
 * Renders sub-navigation pills (Car 1 | Car 2 | + Add car) and delegates
 * each instance to the standard car step components.
 * Exposes the same ProductFlowTabHandle interface so the parent orchestrator
 * needs zero changes.
 */
import { forwardRef, useImperativeHandle, useState, useCallback, useRef } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import type { ProductFlowTabHandle } from "./product-flow-tab";
import { getProductConfig } from "@/config/products";
import { PRODUCT_STEP_COMPONENT_MAPS } from "./component-maps";
import { createCarInstance, getCarInstanceLabel, type CarInstance } from "@/config/products/car";
import { TacoMessage } from "@/components/onboarding/taco-message";
import { SelectionCard } from "@/components/ui/selection-card";
import { cn } from "@/lib/utils";

type Phase = "steps" | "add-prompt" | "done";
type AddPromptAnswer = "" | "yes" | "no";

export const MultiCarFlowTab = forwardRef<ProductFlowTabHandle, { productId: string; onComplete?: () => void }>(
  ({ productId, onComplete }, ref) => {
    const config = getProductConfig(productId)!;
    const componentMap = PRODUCT_STEP_COMPONENT_MAPS[productId] || {};

    // State: array of car instances
    const [instances, setInstances] = useState<CarInstance[]>(() => [createCarInstance()]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [stepIdxMap, setStepIdxMap] = useState<Record<string, number>>({});
    const [animatedSteps, setAnimatedSteps] = useState<Set<string>>(new Set());
    const [phase, setPhase] = useState<Phase>("steps");
    const [addPromptAnswer, setAddPromptAnswer] = useState<AddPromptAnswer>("");
    const [hasAskedAddPrompt, setHasAskedAddPrompt] = useState(false);

    const stateRef = useRef(instances);
    stateRef.current = instances;

    const active = instances[activeIdx];
    const activeStepIdx = stepIdxMap[active?.id] || 0;
    const steps = config.getStepSequence(active?.state || {});
    const currentStepId = steps[activeStepIdx] || steps[0];
    const isValid = config.validateStep(currentStepId, active?.state || {});
    const isLastStep = activeStepIdx === steps.length - 1;

    // Check if an instance is fully complete
    const isInstanceComplete = useCallback((inst: CarInstance) => {
      const s = config.getStepSequence(inst.state);
      const lastStep = s[s.length - 1];
      return config.validateStep(lastStep, inst.state);
    }, [config]);

    const allComplete = instances.every(isInstanceComplete) && phase !== "add-prompt";

    // Taco animation
    const tacoKey = `${active?.id}-${currentStepId}`;
    const shouldAnimateTaco = !animatedSteps.has(tacoKey);
    const markAnimated = useCallback(() => {
      setAnimatedSteps((prev) => new Set(prev).add(tacoKey));
    }, [tacoKey]);

    // Update a field in the active instance
    const update = useCallback((key: string, value: any) => {
      setInstances((prev) => {
        const next = [...prev];
        next[activeIdx] = {
          ...next[activeIdx],
          state: { ...next[activeIdx].state, [key]: value },
        };
        return next;
      });
    }, [activeIdx]);

    // Auto-advance within a car instance
    const autoAdvance = useCallback((updates: Record<string, any>, fromStepId: string) => {
      setInstances((prev) => {
        const next = [...prev];
        next[activeIdx] = {
          ...next[activeIdx],
          state: { ...next[activeIdx].state, ...updates },
        };
        return next;
      });
      setTimeout(() => {
        const inst = stateRef.current[activeIdx];
        const newSteps = config.getStepSequence({ ...inst.state, ...updates });
        const idx = newSteps.indexOf(fromStepId);
        if (idx >= 0 && idx + 1 < newSteps.length) {
          setStepIdxMap((prev) => ({ ...prev, [inst.id]: idx + 1 }));
        }
      }, 400);
    }, [activeIdx, config]);

    // Navigation
    const goNextStep = useCallback(() => {
      const nextIdx = activeStepIdx + 1;
      if (nextIdx < steps.length) {
        setStepIdxMap((prev) => ({ ...prev, [active.id]: nextIdx }));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, [activeStepIdx, steps.length, active?.id]);

    const goBackStep = useCallback(() => {
      if (activeStepIdx > 0) {
        setStepIdxMap((prev) => ({ ...prev, [active.id]: activeStepIdx - 1 }));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, [activeStepIdx, active?.id]);

    // Add another car
    const addCarInstance = useCallback(() => {
      const newInst = createCarInstance();
      setInstances((prev) => [...prev, newInst]);
      setActiveIdx(instances.length);
      setPhase("steps");
      setHasAskedAddPrompt(true);
      setAddPromptAnswer("");
    }, [instances.length]);

    // Remove a car instance
    const removeCarInstance = useCallback((idx: number) => {
      if (instances.length <= 1) return;
      setInstances((prev) => prev.filter((_, i) => i !== idx));
      if (activeIdx >= idx && activeIdx > 0) {
        setActiveIdx(activeIdx - 1);
      }
      setPhase("steps");
    }, [instances.length, activeIdx]);

    // Expose handle
    useImperativeHandle(ref, () => ({
      handleNext: () => {
        if (phase === "done") {
          return false; // all done → parent handles tab transition
        }

        if (phase === "add-prompt") {
          // User is on the "add another?" prompt — they should pick Yes/No
          return true;
        }

        if (isLastStep && isValid) {
          if (!hasAskedAddPrompt) {
            // First car completed → show "add another?" prompt
            setPhase("add-prompt");
            return true;
          } else {
            // Subsequent cars → done, let parent advance
            setPhase("done");
            onComplete?.();
            return true;
          }
        }

        if (!isLastStep && isValid) {
          goNextStep();
          return true;
        }

        return true; // not valid yet, consume event
      },
      handleBack: () => {
        if (phase === "add-prompt") {
          setPhase("steps");
          return true;
        }
        if (activeStepIdx > 0) {
          goBackStep();
          return true;
        }
        // Switch to previous car instance if possible
        if (activeIdx > 0) {
          setActiveIdx(activeIdx - 1);
          const prevInst = instances[activeIdx - 1];
          const prevSteps = config.getStepSequence(prevInst.state);
          setStepIdxMap((prev) => ({ ...prev, [prevInst.id]: prevSteps.length - 1 }));
          setPhase("steps");
          return true;
        }
        return false; // at very beginning → parent handles
      },
      isComplete: phase === "done",
      progress: {
        completed: instances.reduce((sum, inst, i) => {
          const s = config.getStepSequence(inst.state);
          const idx = stepIdxMap[inst.id] || 0;
          const complete = isInstanceComplete(inst);
          return sum + Math.min(idx + (i === activeIdx && isValid || complete ? 1 : 0), s.length);
        }, 0),
        total: instances.reduce((sum, inst) => sum + config.getStepSequence(inst.state).length, 0),
      },
    }), [phase, isLastStep, isValid, activeStepIdx, activeIdx, instances, allComplete, config, goNextStep, goBackStep, stepIdxMap, isInstanceComplete]);

    const StepComponent = componentMap[currentStepId];

    return (
      <div className="space-y-4">
        {/* Sub-navigation pills */}
        {(instances.length > 1 || phase === "add-prompt") && (
          <div className="flex flex-wrap items-center gap-2">
            {instances.map((inst, i) => {
              const complete = isInstanceComplete(inst);
              const isActive = i === activeIdx && (phase === "steps" || phase === "done");
              const label = getCarInstanceLabel(inst, i);
              return (
                <div key={inst.id} className="relative group">
                  <button
                    onClick={() => {
                      setActiveIdx(i);
                      setPhase("steps");
                    }}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border",
                      isActive
                        ? "bg-foreground text-background border-foreground"
                        : complete
                          ? "bg-white border-success text-foreground"
                          : "bg-white border-border text-foreground hover:border-muted-foreground/30"
                    )}
                  >
                    {complete && (
                      <Check className={cn("w-4 h-4", isActive ? "text-background" : "text-success")} />
                    )}
                    {label}
                  </button>
                  {/* Trash icon (only if >1 instance) */}
                  {instances.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCarInstance(i);
                      }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
            {/* + Add car pill */}
            <button
              onClick={addCarInstance}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border border-border bg-white text-muted-foreground hover:bg-muted transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add car
            </button>
          </div>
        )}

        {/* Phase: steps (normal car flow) */}
        {(phase === "steps" || phase === "done") && StepComponent && (
          <StepComponent
            state={active.state}
            onUpdate={update}
            onAutoAdvance={autoAdvance}
            animateTaco={shouldAnimateTaco}
            onAnimationComplete={markAnimated}
          />
        )}

        {/* Phase: add-prompt (Taco asks "want another car?") */}
        {phase === "add-prompt" && (
          <>
            <TacoMessage
              message="Nice one! Want to insure another car?"
              animate={!animatedSteps.has("add-prompt")}
              onAnimationComplete={() => setAnimatedSteps((prev) => new Set(prev).add("add-prompt"))}
            />
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <SelectionCard
                  label="Yes"
                  selected={addPromptAnswer === "yes"}
                  indicator="radio"
                  onClick={() => {
                    setAddPromptAnswer("yes");
                    setTimeout(() => addCarInstance(), 400);
                  }}
                />
                <SelectionCard
                  label="No"
                  selected={addPromptAnswer === "no"}
                  indicator="radio"
                  onClick={() => {
                    setAddPromptAnswer("no");
                    setTimeout(() => {
                      setPhase("done");
                      onComplete?.();
                    }, 400);
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
);

MultiCarFlowTab.displayName = "MultiCarFlowTab";
