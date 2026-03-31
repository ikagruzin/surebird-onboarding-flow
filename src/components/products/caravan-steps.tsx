/**
 * Caravan insurance — 3-step bite-sized flow.
 * Step 1: Context & Usage | Step 2: Vehicle Specs | Step 3: Financial Valuation
 */
import { useState, useEffect, useCallback } from "react";
import type { ProductStepProps } from "@/config/products/types";
import type { ComponentType } from "react";
import { Info } from "lucide-react";
import { TacoMessage } from "@/components/onboarding/taco-message";
import { ValidationError } from "@/components/onboarding/validation-error";
import { SectionCard, SegmentedControl, NativeSelect } from "./shared-ui";
import { SelectionCard } from "@/components/ui/selection-card";
import { Input } from "@/components/ui/input";
import { DutchPlateInput } from "@/components/ui/dutch-plate-input";
import { CARAVAN_OPTIONS } from "@/config/products/caravan";
import { getSelectionGridClass } from "@/lib/grid-layout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const InfoTip = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Info className="w-4 h-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-64 text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/* ─── Step 1: Context & Usage ─── */

const StepCaravanContext = ({ state, onUpdate, animateTaco, onAnimationComplete, errors, onClearError }: ProductStepProps) => {
  const showMobileHomeQ = state.caravanType === "Touring caravan";
  const showFloodQ = state.caravanType === "Mobile home" || state.usedAsMobileHome === "Yes";

  return (
    <div className="space-y-6">
      <TacoMessage
        message="Let's get your caravan covered. To start, tell me a bit how and where you use your caravan."
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />
      <SectionCard>
        <div className="space-y-6">
          {/* Caravan Type */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">What kind of caravan is it?</p>
            <div className={getSelectionGridClass(CARAVAN_OPTIONS.caravanTypes as unknown as string[])}>
              {CARAVAN_OPTIONS.caravanTypes.map((opt) => {
                const tooltip =
                  opt === "Touring caravan"
                    ? "A caravan that is towed behind a car and can be detached at the campsite."
                    : opt === "Folding trailer"
                      ? "A lightweight, collapsible trailer that folds out into a tent-like living space."
                      : undefined;
                return (
                  <SelectionCard
                    key={opt}
                    label={opt}
                    selected={state.caravanType === opt}
                    rightIcon={tooltip ? <InfoTip text={tooltip} /> : undefined}
                  onClick={() => {
                    onUpdate("caravanType", opt);
                    onClearError?.("caravanType");
                      if (opt === "Mobile home") {
                        onUpdate("usedAsMobileHome", "");
                        onUpdate("nearFloodRiver", "No");
                      } else if (opt === "Touring caravan") {
                        onUpdate("usedAsMobileHome", "No");
                        onUpdate("nearFloodRiver", "No");
                      } else {
                        onUpdate("usedAsMobileHome", "");
                        onUpdate("nearFloodRiver", "");
                      }
                    }}
                    indicator="radio"
                  />
                );
              })}
            </div>
            <ValidationError message={errors?.caravanType} />
          </div>

          {/* Usage */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">How do you use it?</p>
            <NativeSelect
              value={state.usage}
              onChange={(e) => { onUpdate("usage", e.target.value); onClearError?.("usage"); }}
              placeholder="Select usage"
              className={errors?.usage ? "border-destructive" : ""}
            >
              {CARAVAN_OPTIONS.usageOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </NativeSelect>
            <ValidationError message={errors?.usage} />
          </div>

          {/* Used as mobile home? (conditional) */}
          {showMobileHomeQ && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Used as a mobile home?</p>
                <InfoTip text="Select Yes if it remains at one location year-round in the NL (winter storage allowed elsewhere in the NL)." />
              </div>
              <SegmentedControl
                options={["Yes", "No"]}
                value={state.usedAsMobileHome}
                onChange={(v) => onUpdate("usedAsMobileHome", v)}
              />
            </div>
          )}

          {/* Near flood river? (conditional) */}
          {showFloodQ && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Is your caravan campsite located near a 'high-water' area (floodplain)?</p>
                <InfoTip text="A floodplain (uiterwaard) is the land between the river and the dike. If you cross a dike to reach your campsite, select Yes. These areas are the first to flood and require specific coverage." />
              </div>
              <SegmentedControl
                options={["Yes", "No"]}
                value={state.nearFloodRiver}
                onChange={(v) => onUpdate("nearFloodRiver", v)}
              />
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

/* ─── Step 2: Vehicle Specifications ─── */

const StepCaravanSpecs = ({ state, onUpdate, animateTaco, onAnimationComplete, errors, onClearError }: ProductStepProps) => {
  const [autoFilled, setAutoFilled] = useState(false);

  const simulateAutoFill = useCallback((raw?: string) => {
    const plate = raw || state.licensePlate || "";
    if (state.identificationMethod === "License plate" && plate.length >= 6 && !autoFilled) {
      onUpdate("specsLoading", true);
      setTimeout(() => {
        onUpdate("brand", "Hobby");
        onUpdate("yearOfConstruction", "2019");
        onUpdate("specsLoading", false);
        setAutoFilled(true);
      }, 1000);
    }
  }, [state.identificationMethod, state.licensePlate, autoFilled, onUpdate]);

  // Reset autofill if plate changes
  useEffect(() => {
    setAutoFilled(false);
  }, [state.licensePlate]);

  return (
    <div className="space-y-6">
      <TacoMessage
        message="Perfect. If you have your license plate, I can pull the technical details for you automatically! If not, just verify the details below."
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />
      <SectionCard>
        <div className="space-y-6">
          {/* Identification method */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Identify by</p>
            <div className={getSelectionGridClass(CARAVAN_OPTIONS.identificationMethods as unknown as string[])}>
              {CARAVAN_OPTIONS.identificationMethods.map((opt) => (
                <SelectionCard
                  key={opt}
                  label={opt}
                  selected={state.identificationMethod === opt}
                  onClick={() => onUpdate("identificationMethod", opt)}
                  indicator="radio"
                />
              ))}
            </div>
            </div>
          </div>

          {/* Input for plate or chassis */}
          {state.identificationMethod === "License plate" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">License plate</p>
              <DutchPlateInput
                value={state.licensePlate}
                onChange={(raw) => onUpdate("licensePlate", raw)}
                onComplete={(raw) => simulateAutoFill(raw)}
              />
            </div>
          )}

          {state.identificationMethod === "Chassis number" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Chassis number</p>
              <Input
                value={state.chassisNumber}
                onChange={(e) => onUpdate("chassisNumber", e.target.value)}
                placeholder="Enter chassis number"
                className="h-12 rounded-xl"
              />
            </div>
          )}

          {/* Brand & Year in one row */}
          <div className={`space-y-6 transition-opacity ${state.specsLoading ? "opacity-50 animate-pulse" : ""}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Brand</p>
                <NativeSelect
                  value={state.brand}
                  onChange={(e) => { onUpdate("brand", e.target.value); onClearError?.("brand"); }}
                  placeholder="Select brand"
                  className={errors?.brand ? "border-destructive" : ""}
                >
                  {CARAVAN_OPTIONS.brandOptions.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </NativeSelect>
                <ValidationError message={errors?.brand} />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Year of construction</p>
                <Input
                  type="number"
                  value={state.yearOfConstruction}
                  onChange={(e) => { onUpdate("yearOfConstruction", e.target.value); onClearError?.("yearOfConstruction"); }}
                  placeholder="e.g. 2020"
                  className={`h-12 rounded-xl ${errors?.yearOfConstruction ? "border-destructive" : ""}`}
                  min={1970}
                  max={new Date().getFullYear()}
                />
                <ValidationError message={errors?.yearOfConstruction} />
              </div>
            </div>
          </div>

          {/* Length - always independent */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">Length</p>
              <InfoTip text="Measure the body only. Please enter the length of the caravan's living area. Do not include the drawbar (the metal V-shaped part at the front that attaches to your car)." />
            </div>
            <NativeSelect
              value={state.length}
              onChange={(e) => { onUpdate("length", e.target.value); onClearError?.("length"); }}
              placeholder="Select length"
              className={errors?.length ? "border-destructive" : ""}
            >
              {CARAVAN_OPTIONS.lengthOptions.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </NativeSelect>
            <ValidationError message={errors?.length} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

/* ─── Step 3: Financial Valuation ─── */

const StepCaravanFinancial = ({ state, onUpdate, animateTaco, onAnimationComplete, errors, onClearError }: ProductStepProps) => {
  const isUsed = state.condition === "Second hand";
  const catalogueNum = parseFloat(state.catalogueValue?.replace(/[^0-9.]/g, "") || "0");

  const formatCurrency = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    if (!digits) return "";
    return `€${parseInt(digits, 10).toLocaleString("nl-NL")}`;
  };

  const validatePurchase = (value: string) => {
    const num = parseFloat(value.replace(/[^0-9]/g, "") || "0");
    if (num > 60000) return "Maximum €60,000";
    if (catalogueNum > 0 && num > catalogueNum) return "Cannot exceed catalogue value";
    return null;
  };

  const purchaseError = isUsed ? validatePurchase(state.purchaseValue || "") : null;

  return (
    <div className="space-y-6">
      <TacoMessage
        message="Last step! Tell me about the value so I can finalize your offer."
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />
      <SectionCard>
        <div className="space-y-6">
          {/* Condition */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">Bought it as</p>
              <InfoTip text='Choose "New" if you are the first owner.' />
            </div>
            <SegmentedControl
              options={[...CARAVAN_OPTIONS.conditionOptions]}
              value={state.condition}
              onChange={(v) => { onUpdate("condition", v); onClearError?.("condition"); }}
            />
            <ValidationError message={errors?.condition} />
          </div>

          {/* Catalogue value */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Original price when new? (Catalogue Value)</p>
            <Input
              value={state.catalogueValue}
              onChange={(e) => { onUpdate("catalogueValue", formatCurrency(e.target.value)); onClearError?.("catalogueValue"); }}
              placeholder="€0"
              className={`h-12 rounded-xl ${errors?.catalogueValue ? "border-destructive" : ""}`}
            />
            <ValidationError message={errors?.catalogueValue} />
          </div>

          {/* Purchase value (conditional) */}
          {isUsed && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">What did you pay for it? (Purchase Value)</p>
              <Input
                value={state.purchaseValue}
                onChange={(e) => { onUpdate("purchaseValue", formatCurrency(e.target.value)); onClearError?.("purchaseValue"); }}
                placeholder="€0"
                className={`h-12 rounded-xl ${purchaseError || errors?.purchaseValue ? "border-destructive" : ""}`}
              />
              {purchaseError && (
                <p className="text-xs text-destructive">{purchaseError}</p>
              )}
              <ValidationError message={errors?.purchaseValue} />
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

/* ─── Component map ─── */

export const CARAVAN_STEP_COMPONENTS: Record<string, ComponentType<ProductStepProps>> = {
  "caravan-context": StepCaravanContext,
  "caravan-specs": StepCaravanSpecs,
  "caravan-financial": StepCaravanFinancial,
};
