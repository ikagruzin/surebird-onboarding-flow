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
import { useT } from "@/i18n/LanguageContext";
import { translateOptions } from "@/i18n/option-translate";
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

const YES_NO = ["Yes", "No"];

/* ─── Step 1: Context & Usage ─── */

const StepCaravanContext = ({ state, onUpdate, animateTaco, onAnimationComplete, errors, onClearError }: ProductStepProps) => {
  const t = useT();
  const showMobileHomeQ = state.caravanType === "Touring caravan";
  const showFloodQ = state.caravanType === "Mobile home" || state.usedAsMobileHome === "Yes";
  const yesNoLabels = translateOptions(t, "caravan", YES_NO);
  const typeLabels = translateOptions(t, "caravan", CARAVAN_OPTIONS.caravanTypes as unknown as string[]);
  const usageLabels = translateOptions(t, "caravan", CARAVAN_OPTIONS.usageOptions as unknown as string[]);

  return (
    <div className="space-y-6">
      <TacoMessage
        message={t("ui.products.caravan.context_taco", undefined, "Let's get your caravan covered. To start, tell me a bit how and where you use your caravan.")}
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />
      <SectionCard>
        <div className="space-y-6">
          {/* Caravan Type */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{t("products.caravan.q.caravanType")}</p>
            <div className={getSelectionGridClass(CARAVAN_OPTIONS.caravanTypes as unknown as string[])}>
              {CARAVAN_OPTIONS.caravanTypes.map((opt, idx) => {
                const tipText =
                  opt === "Touring caravan"
                    ? t("products.caravan.caravanType.touring.tip")
                    : opt === "Folding trailer"
                      ? t("products.caravan.caravanType.folding.tip")
                      : undefined;
                return (
                  <SelectionCard
                    key={opt}
                    label={typeLabels[idx]}
                    selected={state.caravanType === opt}
                    rightIcon={tipText ? <InfoTip text={tipText} /> : undefined}
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
            <p className="text-sm font-medium text-foreground">{t("products.caravan.q.usage")}</p>
            <NativeSelect
              value={state.usage}
              onChange={(e) => { onUpdate("usage", e.target.value); onClearError?.("usage"); }}
              placeholder={t("products.caravan.placeholder.usage", undefined, "Select usage")}
              className={errors?.usage ? "border-destructive" : ""}
            >
              {CARAVAN_OPTIONS.usageOptions.map((opt, idx) => (
                <option key={opt} value={opt}>{usageLabels[idx]}</option>
              ))}
            </NativeSelect>
            <ValidationError message={errors?.usage} />
          </div>

          {/* Used as mobile home? (conditional) */}
          {showMobileHomeQ && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{t("products.caravan.q.usedAsMobileHome")}</p>
                <InfoTip text={t("products.caravan.usedAsMobileHome.tip")} />
              </div>
              <SegmentedControl
                options={YES_NO}
                displayLabels={yesNoLabels}
                value={state.usedAsMobileHome}
                onChange={(v) => onUpdate("usedAsMobileHome", v)}
              />
            </div>
          )}

          {/* Near flood river? (conditional) */}
          {showFloodQ && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{t("products.caravan.q.nearFloodRiver")}</p>
                <InfoTip text={t("products.caravan.nearFloodRiver.tip")} />
              </div>
              <SegmentedControl
                options={YES_NO}
                displayLabels={yesNoLabels}
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
  const t = useT();
  const [autoFilled, setAutoFilled] = useState(false);
  const idLabels = translateOptions(t, "caravan", CARAVAN_OPTIONS.identificationMethods as unknown as string[]);
  const brandLabels = translateOptions(t, "caravan", CARAVAN_OPTIONS.brandOptions as unknown as string[]);
  const lengthLabels = translateOptions(t, "caravan", CARAVAN_OPTIONS.lengthOptions as unknown as string[]);

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
        message={t("ui.products.caravan.specs_taco", undefined, "Perfect. If you have your license plate, I can pull the technical details for you automatically! If not, just verify the details below.")}
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />
      <SectionCard>
        <div className="space-y-6">
          {/* Identification method */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{t("products.caravan.q.identificationMethod")}</p>
            <div className={getSelectionGridClass(CARAVAN_OPTIONS.identificationMethods as unknown as string[])}>
              {CARAVAN_OPTIONS.identificationMethods.map((opt, idx) => (
                <SelectionCard
                  key={opt}
                  label={idLabels[idx]}
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
              <p className="text-sm font-medium text-foreground">{t("products.caravan.q.licensePlate")}</p>
              <DutchPlateInput
                value={state.licensePlate}
                onChange={(raw) => onUpdate("licensePlate", raw)}
                onComplete={(raw) => simulateAutoFill(raw)}
              />
            </div>
          )}

          {state.identificationMethod === "Chassis number" && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">{t("products.caravan.q.chassisNumber")}</p>
              <Input
                value={state.chassisNumber}
                onChange={(e) => onUpdate("chassisNumber", e.target.value)}
                placeholder={t("products.caravan.placeholder.chassis", undefined, "Enter chassis number")}
                className="h-12 rounded-xl"
              />
            </div>
          )}

          {/* Brand & Year in one row */}
          <div className={`space-y-6 transition-opacity ${state.specsLoading ? "opacity-50 animate-pulse" : ""}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">{t("products.caravan.q.brand")}</p>
                <NativeSelect
                  value={state.brand}
                  onChange={(e) => { onUpdate("brand", e.target.value); onClearError?.("brand"); }}
                  placeholder={t("products.caravan.placeholder.brand", undefined, "Select brand")}
                  className={errors?.brand ? "border-destructive" : ""}
                >
                  {CARAVAN_OPTIONS.brandOptions.map((b, idx) => (
                    <option key={b} value={b}>{brandLabels[idx]}</option>
                  ))}
                </NativeSelect>
                <ValidationError message={errors?.brand} />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">{t("products.caravan.q.yearOfConstruction")}</p>
                <Input
                  type="number"
                  value={state.yearOfConstruction}
                  onChange={(e) => { onUpdate("yearOfConstruction", e.target.value); onClearError?.("yearOfConstruction"); }}
                  placeholder={t("products.caravan.placeholder.year", undefined, "e.g. 2020")}
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
              <p className="text-sm font-medium text-foreground">{t("products.caravan.q.length")}</p>
              <InfoTip text={t("products.caravan.length.tip")} />
            </div>
            <NativeSelect
              value={state.length}
              onChange={(e) => { onUpdate("length", e.target.value); onClearError?.("length"); }}
              placeholder={t("products.caravan.placeholder.length", undefined, "Select length")}
              className={errors?.length ? "border-destructive" : ""}
            >
              {CARAVAN_OPTIONS.lengthOptions.map((l, idx) => (
                <option key={l} value={l}>{lengthLabels[idx]}</option>
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
  const t = useT();
  const isUsed = state.condition === "Second hand";
  const catalogueNum = parseFloat(state.catalogueValue?.replace(/[^0-9.]/g, "") || "0");
  const conditionLabels = translateOptions(t, "caravan", CARAVAN_OPTIONS.conditionOptions as unknown as string[]);

  const formatCurrency = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    if (!digits) return "";
    return `€${parseInt(digits, 10).toLocaleString("nl-NL")}`;
  };

  const validatePurchase = (value: string) => {
    const num = parseFloat(value.replace(/[^0-9]/g, "") || "0");
    if (num > 60000) return t("products.caravan.error.maxValue", undefined, "Maximum €60,000");
    if (catalogueNum > 0 && num > catalogueNum) return t("products.caravan.error.exceedsCatalogue", undefined, "Cannot exceed catalogue value");
    return null;
  };

  const purchaseError = isUsed ? validatePurchase(state.purchaseValue || "") : null;

  return (
    <div className="space-y-6">
      <TacoMessage
        message={t("ui.products.caravan.financial_taco", undefined, "Last step! Tell me about the value so I can finalize your offer.")}
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />
      <SectionCard>
        <div className="space-y-6">
          {/* Condition */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">{t("products.caravan.q.condition")}</p>
              <InfoTip text={t("products.caravan.condition.tip")} />
            </div>
            <SegmentedControl
              options={[...CARAVAN_OPTIONS.conditionOptions]}
              displayLabels={conditionLabels}
              value={state.condition}
              onChange={(v) => { onUpdate("condition", v); onClearError?.("condition"); }}
            />
            <ValidationError message={errors?.condition} />
          </div>

          {/* Catalogue value */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{t("products.caravan.q.catalogueValue")}</p>
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
              <p className="text-sm font-medium text-foreground">{t("products.caravan.q.purchaseValue")}</p>
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
