/**
 * Car insurance — 3-step "High-Velocity" flow.
 * Step 1: Identity (license plate lookup)
 * Step 2: Driver (main driver & legal owner)
 * Step 3: Usage (damage-free years & km)
 */
import { useState, useCallback } from "react";
import type { ProductStepProps } from "@/config/products/types";
import type { ComponentType } from "react";
import { TacoMessage } from "@/components/onboarding/taco-message";
import { ValidationError } from "@/components/onboarding/validation-error";
import { SectionCard, SegmentedControl, NativeSelect } from "./shared-ui";
import { SelectionCard } from "@/components/ui/selection-card";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { DutchPlateInput } from "@/components/ui/dutch-plate-input";
import { CAR_OPTIONS, lookupPlate } from "@/config/products/car";
import { getSelectionGridClass } from "@/lib/grid-layout";
import { Car, Check, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ─── Shared InfoTip ─── */

const InfoTip = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="More info">
          <Info className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-sm">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/* ─── Step 1: Identity ─── */

const StepCarIdentity = ({ state, onUpdate, onAutoAdvance, animateTaco, onAnimationComplete, errors, onClearError }: ProductStepProps) => {
  const [lookupDone, setLookupDone] = useState(state.plateConfirmed === true);

  const handleLookup = useCallback((raw?: string) => {
    const plate = (raw || state.licensePlate || "").trim();
    if (!plate) return;

    const result = lookupPlate(plate);
    if (result) {
      onUpdate("carBrand", result.brand);
      onUpdate("carModel", result.model);
      onUpdate("plateConfirmed", true);
      setLookupDone(true);
    }
  }, [state.licensePlate, onUpdate]);

  const handlePlateChange = (raw: string) => {
    onUpdate("licensePlate", raw);
    if (lookupDone) {
      setLookupDone(false);
      onUpdate("plateConfirmed", false);
      onUpdate("carBrand", "");
      onUpdate("carModel", "");
    }
  };

  const handlePlateComplete = (raw: string) => {
    handleLookup(raw);
  };

  return (
    <div className="space-y-6">
      <TacoMessage
        message="Let's see what you're driving! Pop in your license plate and I'll pull the car details for you automatically."
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />
      <SectionCard>
        <div className="space-y-6">
          {/* License plate input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">License plate number</p>
              <InfoTip text="We use the license plate of your car to retrieve the details of your car from the RDW, among others. You can only take out car insurance for vehicles with a Dutch license plate." />
            </div>
            <DutchPlateInput
              value={state.licensePlate || ""}
              onChange={(raw) => { handlePlateChange(raw); onClearError?.("licensePlate"); }}
              onComplete={handlePlateComplete}
            />
            <ValidationError message={errors?.licensePlate} />
          </div>

          {/* Confirmation card */}
          {lookupDone && state.carBrand && (
            <div className="flex items-center gap-4 rounded-xl border-2 border-primary bg-primary/5 px-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Car className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{state.carBrand}</p>
                <p className="text-sm text-muted-foreground">{state.carModel}</p>
              </div>
              <Check className="h-5 w-5 text-primary" />
            </div>
          )}
          <ValidationError message={errors?.plateConfirmed} />
        </div>
      </SectionCard>
    </div>
  );
};

/* ─── Step 2: Driver ─── */

const StepCarDriver = ({ state, onUpdate, onAutoAdvance, animateTaco, onAnimationComplete }: ProductStepProps) => {
  const showDriverDetails = state.mainDriver === "No";
  const showAgeField = showDriverDetails && state.driverRelationship !== "" && state.driverRelationship !== "Myself";

  return (
    <div className="space-y-6">
      <TacoMessage
        message="Are you the main driver and legal owner?"
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />
      <SectionCard>
        <div className="space-y-6">
          {/* Main driver */}
          <div className="space-y-2">
            <SegmentedControl
              options={[...CAR_OPTIONS.mainDriverOptions]}
              value={state.mainDriver || ""}
              onChange={(v) => {
                onUpdate("mainDriver", v);
                if (v === "Yes") {
                  onUpdate("driverRelationship", "");
                  onUpdate("driverAge", "");
                  onUpdate("legalOwner", "");
                  onAutoAdvance({ mainDriver: "Yes", driverRelationship: "", driverAge: "", legalOwner: "" }, "car-driver");
                }
              }}
            />
          </div>

          {/* Conditional: driver details */}
          {showDriverDetails && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Who is the main driver?</p>
                <div className={getSelectionGridClass([...CAR_OPTIONS.driverRelationshipOptions])}>
                  {CAR_OPTIONS.driverRelationshipOptions.map((opt) => (
                    <SelectionCard
                      key={opt}
                      label={opt}
                      selected={state.driverRelationship === opt}
                      onClick={() => {
                        onUpdate("driverRelationship", opt);
                        if (opt === "Myself") {
                          onUpdate("driverAge", "");
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              {showAgeField && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">How old is the main driver?</p>
                  <FloatingLabelInput
                    label="Age"
                    type="number"
                    value={state.driverAge || ""}
                    onChange={(e) => onUpdate("driverAge", e.target.value)}
                    min={18}
                    max={99}
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">Who is the legal owner of the car?</p>
                  <InfoTip text="You can insure your partner's car, but only if your partner lives in your home. Children who have their own car must insure their own car." />
                </div>
                <div className={getSelectionGridClass([...CAR_OPTIONS.legalOwnerOptions])}>
                  {CAR_OPTIONS.legalOwnerOptions.map((opt) => (
                    <SelectionCard
                      key={opt}
                      label={opt}
                      selected={state.legalOwner === opt}
                      onClick={() => onUpdate("legalOwner", opt)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

/* ─── Step 3: Usage ─── */

const StepCarUsage = ({ state, onUpdate, animateTaco, onAnimationComplete }: ProductStepProps) => {
  return (
    <div className="space-y-6">
      <TacoMessage
        message="Perfect. Now, just a few quick details about your driving habits to calculate your personal discount."
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />
      <SectionCard>
        <div className="space-y-6">
          {/* Damage-free years */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">How many damage-free years do you have?</p>
              <InfoTip text="The number of years you have had car insurance without claiming damage. The higher this is, the more discount you get. Insurance companies have a central database in which they keep track of everyone's claim-free years, but they still want you to tell them the number." />
            </div>
            <FloatingLabelInput
              label="Number of years"
              type="number"
              value={state.damageFreeYears || ""}
              onChange={(e) => onUpdate("damageFreeYears", e.target.value)}
              min={0}
              max={30}
            />
          </div>

          {/* KM per year */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">How many kilometers do you drive per year?</p>
            <NativeSelect
              value={state.kmPerYear || ""}
              placeholder="Select km range"
              onChange={(e) => onUpdate("kmPerYear", e.target.value)}
            >
              {CAR_OPTIONS.kmBrackets.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </NativeSelect>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

/* ─── Component map ─── */

export const CAR_STEP_COMPONENTS: Record<string, ComponentType<ProductStepProps>> = {
  "car-identity": StepCarIdentity,
  "car-driver": StepCarDriver,
  "car-usage": StepCarUsage,
};
