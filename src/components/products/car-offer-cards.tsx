/**
 * Car product – Offer page detail cards.
 * Cards: Own Risk, Coverage, Additional Coverage, Car Details, Driver, Usage.
 * Multi-instance support: pill switcher is rendered by parent (step-offer.tsx).
 * Each car instance has independent offer + product state.
 */
import { useState, useCallback } from "react";
import { Info, Car, Check } from "lucide-react";
import { SectionCard, SegmentedControl, NativeSelect } from "./shared-ui";
import { SelectionCard } from "@/components/ui/selection-card";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { DutchPlateInput, formatDutchPlate } from "@/components/ui/dutch-plate-input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CAR_OPTIONS, lookupPlate } from "@/config/products/car";
import { getSelectionGridClass } from "@/lib/grid-layout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ─── Types ─── */

interface CarOfferCardsProps {
  /** The active car instance's product state */
  instanceState: Record<string, any>;
  /** The active car instance's offer state */
  instanceOfferState: Record<string, any>;
  /** Update a key in the active instance's product state */
  onUpdateInstanceProduct: (key: string, value: any) => void;
  /** Update a key in the active instance's offer state */
  onUpdateInstanceOffer: (key: string, value: any) => void;
}

/* ─── Shared helpers ─── */

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

const OfferCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <div className="border border-border rounded-3xl p-6 bg-card">
    <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground mb-5">{subtitle}</p>
    {children}
  </div>
);

/* ─── Card 1: Own Risk ─── */

const OWN_RISK_OPTIONS = ["0", "100", "250", "500"];

const OwnRiskCard = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <OfferCard
    title="Own risk"
    subtitle="The amount you pay yourself when filing a claim. A higher own risk means a lower monthly premium."
  >
    <SegmentedControl
      options={OWN_RISK_OPTIONS.map((v) => `€${v}`)}
      value={`€${value}`}
      onChange={(v) => onChange(v.replace("€", ""))}
    />
  </OfferCard>
);

/* ─── Card 2: Coverage (Radio cards) ─── */

const COVERAGE_OPTIONS = [
  {
    id: "wa",
    label: "Civil Liability (WA)",
    subtitle: "The legally required minimum. Covers damage you cause to others, but not to your own vehicle.",
  },
  {
    id: "wa-plus",
    label: "Limited Casco (WA+)",
    subtitle: "Includes civil liability plus theft, fire, storm, hail, and window damage to your own vehicle.",
    recommended: true,
  },
  {
    id: "all-risk",
    label: "Full Casco (All-risk)",
    subtitle: "The most complete coverage — also covers damage to your own car, including collision and parking accidents.",
  },
];

const CoverageCard = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <OfferCard
    title="Coverage"
    subtitle="Choose the level of protection for your vehicle."
  >
    <div className="space-y-3">
      {COVERAGE_OPTIONS.map((opt) => {
        const selected = value === opt.label;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.label)}
            className={cn(
              "flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all cursor-pointer",
              selected
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-muted-foreground/30"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                selected ? "border-primary" : "border-muted-foreground/40"
              )}
            >
              {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{opt.label}</span>
                {opt.recommended && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{opt.subtitle}</p>
            </div>
          </button>
        );
      })}
    </div>
  </OfferCard>
);

/* ─── Card 3: Additional Coverage ─── */

const AdditionalCoverageCard = ({
  offerState,
  onUpdateOffer,
}: {
  offerState: Record<string, any>;
  onUpdateOffer: (key: string, value: any) => void;
}) => (
  <OfferCard
    title="Additional coverage"
    subtitle="Add extra protection for your car and passengers."
  >
    <div className="space-y-4">
      {/* Insuring occupants */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Insuring occupants</span>
            <InfoTip text="If something happens then the car is covered, but not the occupants. With this coverage, you also take care of the medical costs if someone does something wrong." />
          </div>
          <Switch
            checked={offerState.insuringOccupants === true}
            onCheckedChange={(checked) => {
              onUpdateOffer("insuringOccupants", checked);
              if (!checked) onUpdateOffer("occupantType", "");
            }}
          />
        </div>
        {offerState.insuringOccupants && (
          <div className="space-y-2 pl-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">Type of occupant coverage</p>
              <InfoTip text="With the passenger damage insurance (SIV) you will be reimbursed exactly enough to cover the (medical) costs if one of the passengers is wrong. With accident-occupant insurance (OIV) you get a fixed amount, even in the event of death. We recommend the SIV." />
            </div>
            <div className={getSelectionGridClass(["Accidents occupant", "Damage occupant"])}>
              <SelectionCard
                label="Accidents occupant"
                selected={offerState.occupantType === "Accidents occupant"}
                onClick={() => onUpdateOffer("occupantType", "Accidents occupant")}
                indicator="radio"
              />
              <SelectionCard
                label="Damage occupant"
                selected={offerState.occupantType === "Damage occupant"}
                onClick={() => onUpdateOffer("occupantType", "Damage occupant")}
                indicator="radio"
              />
            </div>
          </div>
        )}
      </div>

      {/* Roadside assistance */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Roadside assistance</span>
          <InfoTip text="Covers the costs of roadside assistance if your car breaks down. Make sure it doesn't overlap with your travel insurance." />
        </div>
        <Switch
          checked={offerState.roadsideAssistance === true}
          onCheckedChange={(checked) => onUpdateOffer("roadsideAssistance", checked)}
        />
      </div>

      {/* Legal aid */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Legal aid</span>
          <InfoTip text="Provides legal support and covers attorney fees in case of a traffic-related dispute, such as after an accident." />
        </div>
        <Switch
          checked={offerState.legalAid === true}
          onCheckedChange={(checked) => onUpdateOffer("legalAid", checked)}
        />
      </div>
    </div>
  </OfferCard>
);

/* ─── Card 4: Car Details (editable plate + brand/model) ─── */

const CarDetailsCard = ({
  state,
  onUpdate,
}: {
  state: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}) => {
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

  return (
    <OfferCard
      title="Car details"
      subtitle="Your car details retrieved from the license plate."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">License plate number</p>
            <InfoTip text="We use the license plate of your car to retrieve the details of your car from the RDW, among others. You can only take out car insurance for vehicles with a Dutch license plate." />
          </div>
          <DutchPlateInput
            value={state.licensePlate || ""}
            onChange={handlePlateChange}
            onComplete={handleLookup}
          />
        </div>

        {/* Confirmation card */}
        {(lookupDone || state.plateConfirmed) && state.carBrand && (
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
      </div>
    </OfferCard>
  );
};

/* ─── Card 5: Driver (Set Pref — editable) ─── */

const DriverCard = ({
  state,
  onUpdate,
}: {
  state: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}) => {
  const showDriverDetails = state.mainDriver === "No";
  const showAgeField = showDriverDetails && state.driverRelationship !== "" && state.driverRelationship !== "Myself";

  return (
    <OfferCard
      title="Driver"
      subtitle="Details about who primarily drives this vehicle."
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Are you the main driver and legal owner?</p>
          <SegmentedControl
            options={[...CAR_OPTIONS.mainDriverOptions]}
            value={state.mainDriver || ""}
            onChange={(v) => {
              onUpdate("mainDriver", v);
              if (v === "Yes") {
                onUpdate("driverRelationship", "");
                onUpdate("driverAge", "");
                onUpdate("legalOwner", "");
              }
            }}
          />
        </div>

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
                      if (opt === "Myself") onUpdate("driverAge", "");
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
                <p className="text-sm font-medium text-foreground">Who is the legal owner?</p>
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
    </OfferCard>
  );
};

/* ─── Card 6: Usage (Set Pref — editable) ─── */

const UsageCard = ({
  state,
  onUpdate,
}: {
  state: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}) => (
  <OfferCard
    title="Usage"
    subtitle="Your driving habits and experience for premium calculation."
  >
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">Damage-free years</p>
          <InfoTip text="The number of years you have had car insurance without claiming damage. The higher this is, the more discount you get." />
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

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Kilometers per year</p>
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
  </OfferCard>
);

/* ─── Main component ─── */

export const CarOfferCards = ({
  instanceState,
  instanceOfferState,
  onUpdateInstanceProduct,
  onUpdateInstanceOffer,
}: CarOfferCardsProps) => {
  const offerState = instanceOfferState || {};
  const state = instanceState || {};

  return (
    <div className="space-y-4">
      {/* Rest Data cards */}
      <OwnRiskCard
        value={offerState.ownRisk || "100"}
        onChange={(v) => onUpdateInstanceOffer("ownRisk", v)}
      />
      <CoverageCard
        value={offerState.coverage || "Limited Casco (WA+)"}
        onChange={(v) => onUpdateInstanceOffer("coverage", v)}
      />
      <AdditionalCoverageCard
        offerState={offerState}
        onUpdateOffer={onUpdateInstanceOffer}
      />

      {/* Set Preferences cards */}
      <CarDetailsCard state={state} onUpdate={onUpdateInstanceProduct} />
      <DriverCard state={state} onUpdate={onUpdateInstanceProduct} />
      <UsageCard state={state} onUpdate={onUpdateInstanceProduct} />
    </div>
  );
};
