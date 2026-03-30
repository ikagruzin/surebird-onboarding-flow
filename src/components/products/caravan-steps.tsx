/**
 * Caravan insurance — 3-step bite-sized flow.
 * Step 1: Context & Usage | Step 2: Vehicle Specs | Step 3: Financial Valuation
 */
import { useState, useEffect, useCallback } from "react";
import type { ProductStepProps } from "@/config/products/types";
import type { ComponentType } from "react";
import { TacoMessage } from "@/components/onboarding/taco-message";
import { SectionCard, SegmentedControl, NativeSelect } from "./shared-ui";
import { SelectionCard } from "@/components/ui/selection-card";
import { Input } from "@/components/ui/input";
import { CARAVAN_OPTIONS } from "@/config/products/caravan";
import { getSelectionGridClass } from "@/lib/grid-layout";

/* ─── Step 1: Context & Usage ─── */

const StepCaravanContext = ({ state, onUpdate, animateTaco, onAnimationComplete }: ProductStepProps) => {
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
              {CARAVAN_OPTIONS.caravanTypes.map((opt) => (
                <SelectionCard
                  key={opt}
                  label={opt}
                  selected={state.caravanType === opt}
                  onClick={() => {
                    onUpdate("caravanType", opt);
                    // Reset conditional fields
                    if (opt === "Mobile home") {
                      onUpdate("usedAsMobileHome", "");
                    } else {
                      onUpdate("nearFloodRiver", "");
                    }
                  }}
                  indicator="radio"
                />
              ))}
            </div>
          </div>

          {/* Usage */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">How do you use it?</p>
            <NativeSelect
              value={state.usage}
              onChange={(e) => onUpdate("usage", e.target.value)}
              placeholder="Select usage"
            >
              {CARAVAN_OPTIONS.usageOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </NativeSelect>
          </div>

          {/* Used as mobile home? (conditional) */}
          {showMobileHomeQ && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Used as a mobile home?</p>
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
              <p className="text-sm font-medium text-foreground">Is it near a river that might flood?</p>
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

const StepCaravanSpecs = ({ state, onUpdate, animateTaco, onAnimationComplete }: ProductStepProps) => {
  const [autoFilled, setAutoFilled] = useState(false);

  const simulateAutoFill = useCallback(() => {
    if (state.identificationMethod === "License plate" && state.licensePlate.length >= 6 && !autoFilled) {
      onUpdate("specsLoading", true);
      setTimeout(() => {
        onUpdate("brand", "Hobby");
        onUpdate("yearOfConstruction", "2019");
        onUpdate("length", "5-7m");
        onUpdate("specsLoading", false);
        setAutoFilled(true);
      }, 1000);
    }
  }, [state.identificationMethod, state.licensePlate, autoFilled, onUpdate]);

  // Reset autofill if plate changes
  useEffect(() => {
    setAutoFilled(false);
  }, [state.licensePlate]);

  const formatDutchPlate = (value: string) => {
    const clean = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6);
    if (clean.length <= 2) return clean;
    if (clean.length <= 4) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
    return `${clean.slice(0, 2)}-${clean.slice(2, 4)}-${clean.slice(4)}`;
  };

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

          {/* Input for plate or chassis */}
          {state.identificationMethod === "License plate" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">License plate</p>
              <div className="flex gap-2">
                <Input
                  value={state.licensePlate}
                  onChange={(e) => onUpdate("licensePlate", formatDutchPlate(e.target.value))}
                  placeholder="AB-12-CD"
                  className="h-12 rounded-xl font-mono tracking-wider uppercase"
                />
                <button
                  type="button"
                  onClick={simulateAutoFill}
                  disabled={state.licensePlate.length < 6 || state.specsLoading}
                  className="h-12 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 shrink-0"
                >
                  {state.specsLoading ? "Loading…" : "Look up"}
                </button>
              </div>
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

          {/* Permanent spec fields */}
          <div className={`space-y-6 transition-opacity ${state.specsLoading ? "opacity-50 animate-pulse" : ""}`}>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Brand</p>
              <NativeSelect
                value={state.brand}
                onChange={(e) => onUpdate("brand", e.target.value)}
                placeholder="Select brand"
              >
                {CARAVAN_OPTIONS.brandOptions.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </NativeSelect>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Year of construction</p>
              <Input
                type="number"
                value={state.yearOfConstruction}
                onChange={(e) => onUpdate("yearOfConstruction", e.target.value)}
                placeholder="e.g. 2020"
                className="h-12 rounded-xl"
                min={1970}
                max={new Date().getFullYear()}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Length</p>
              <NativeSelect
                value={state.length}
                onChange={(e) => onUpdate("length", e.target.value)}
                placeholder="Select length"
              >
                {CARAVAN_OPTIONS.lengthOptions.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </NativeSelect>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

/* ─── Step 3: Financial Valuation ─── */

const StepCaravanFinancial = ({ state, onUpdate, animateTaco, onAnimationComplete }: ProductStepProps) => {
  const isUsed = state.condition === "Used";
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
            <p className="text-sm font-medium text-foreground">Was it bought second-hand?</p>
            <SegmentedControl
              options={[...CARAVAN_OPTIONS.conditionOptions]}
              value={state.condition}
              onChange={(v) => onUpdate("condition", v)}
            />
          </div>

          {/* Catalogue value */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Original price when new? (Catalogue Value)</p>
            <Input
              value={state.catalogueValue}
              onChange={(e) => onUpdate("catalogueValue", formatCurrency(e.target.value))}
              placeholder="€0"
              className="h-12 rounded-xl"
            />
          </div>

          {/* Purchase value (conditional) */}
          {isUsed && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">What did you pay for it? (Purchase Value)</p>
              <Input
                value={state.purchaseValue}
                onChange={(e) => onUpdate("purchaseValue", formatCurrency(e.target.value))}
                placeholder="€0"
                className={`h-12 rounded-xl ${purchaseError ? "border-destructive" : ""}`}
              />
              {purchaseError && (
                <p className="text-xs text-destructive">{purchaseError}</p>
              )}
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
