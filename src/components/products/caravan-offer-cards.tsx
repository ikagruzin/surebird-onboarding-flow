/**
 * Caravan product – Offer page detail cards.
 * 6 cards: Own Risk, Coverage, Additional Coverage, Usage, Caravan Details, Finance.
 */
import { useState, useCallback } from "react";
import { Info } from "lucide-react";
import { SectionCard, SegmentedControl, NativeSelect } from "./shared-ui";
import { SelectionCard } from "@/components/ui/selection-card";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
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

interface CaravanOfferCardsProps {
  productState: Record<string, any>;
  offerState: Record<string, any>;
  onUpdateProduct: (key: string, value: any) => void;
  onUpdateOffer: (key: string, value: any) => void;
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

/* ─── Card 2: Coverage ─── */

const COVERAGE_OPTIONS = [
  {
    id: "fire-theft",
    label: "Fire and theft",
    subtitle: "Covers damage caused by fire, explosion, lightning, and theft or attempted theft of your caravan.",
  },
  {
    id: "casco-limited",
    label: "Casco Limited",
    subtitle: "Includes fire and theft plus storm, hail, flooding, collision with animals, and window damage.",
  },
  {
    id: "casco-extended",
    label: "Casco Extended",
    subtitle: "The most complete coverage — also includes damage you cause yourself, such as a driving or parking accident.",
  },
];

const CoverageCard = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <OfferCard
    title="Coverage"
    subtitle="Choose the level of protection for your caravan against damage and theft."
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
              <span className="text-sm font-medium text-foreground">{opt.label}</span>
              <p className="text-xs text-muted-foreground mt-1">{opt.subtitle}</p>
            </div>
          </button>
        );
      })}
    </div>
  </OfferCard>
);

/* ─── Card 3: Additional Coverage ─── */

const ADDON_TOGGLES = [
  {
    key: "purchaseValueGuarantee",
    label: "Purchase value guarantee",
    tooltip: "Guarantees the original purchase price in case of total loss within the selected period.",
    options: ["1 year", "3 years", "5 years"],
  },
  {
    key: "outbuilding",
    label: "Outbuilding",
    tooltip: "Under the outbuilding are sheds that are not made of tent fabric. An outbuilding is not attached to the caravan.",
    options: ["€500", "€1,000", "€1,500", "€2,000", "€2,500"],
  },
  {
    key: "householdGoods",
    label: "Household goods",
    tooltip: "Inventory or household effects means; the additional (not standard) inventory and the entire household effects located in the caravan or co-insured awning. Think, for example, of the furniture or a television.",
    options: ["€750", "€1,500", "€2,500", "€3,000", "€3,500"],
  },
  {
    key: "canopy",
    label: "Canopy",
    tooltip: "By this we mean the non-closed cover (awning) that is added to the caravan.",
    options: ["€500", "€1,000", "€1,500", "€2,000", "€2,500"],
  },
  {
    key: "awning",
    label: "Awning",
    tooltip: "By this we mean the closed cover (awning) that is added to the caravan.",
    options: ["€1,000", "€1,500", "€2,000", "€2,500", "€3,000"],
  },
  {
    key: "mover",
    label: "Mover",
    tooltip: "A mechanical tool attached to the caravan to put it in place without using a vehicle.",
    options: ["€500", "€1,000", "€1,500", "€2,000", "€2,500", "€3,000"],
  },
];

const AdditionalCoverageCard = ({
  offerState,
  onUpdateOffer,
}: {
  offerState: Record<string, any>;
  onUpdateOffer: (key: string, value: any) => void;
}) => {
  const hailCoverage = offerState.hailDamageCoverage || "No";
  const hailResistantRoof = offerState.hailResistantRoof || "No";

  return (
    <OfferCard
      title="Additional coverage"
      subtitle="Ensure even better coverage with our special add-ons."
    >
      <div className="space-y-4">
        {ADDON_TOGGLES.map((addon) => {
          const enabled = offerState[`${addon.key}Enabled`] === true;
          const selectedValue = offerState[addon.key] || "";

          return (
            <div key={addon.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{addon.label}</span>
                  <InfoTip text={addon.tooltip} />
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={(checked) => {
                    onUpdateOffer(`${addon.key}Enabled`, checked);
                    if (!checked) onUpdateOffer(addon.key, "");
                  }}
                />
              </div>
              {enabled && (
                <NativeSelect
                  value={selectedValue}
                  onChange={(e) => onUpdateOffer(addon.key, e.target.value)}
                  placeholder="Select option"
                >
                  {addon.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </NativeSelect>
              )}
            </div>
          );
        })}

        {/* Hail damage coverage */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Hail damage coverage</span>
              <InfoTip text="Hail damage can cause significant damage to your caravan. With this additional coverage, hail damage is insured." />
            </div>
            <Switch
              checked={hailCoverage === "Yes"}
              onCheckedChange={(checked) => {
                onUpdateOffer("hailDamageCoverage", checked ? "Yes" : "No");
                if (!checked) onUpdateOffer("hailResistantRoof", "No");
              }}
            />
          </div>

          {hailCoverage === "Yes" && (
            <div className="space-y-2 pl-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Does the caravan have a hail-resistant roof?</span>
              </div>
              <SegmentedControl
                options={["Yes", "No"]}
                value={hailResistantRoof}
                onChange={(v) => onUpdateOffer("hailResistantRoof", v)}
              />
            </div>
          )}
        </div>
      </div>
    </OfferCard>
  );
};

/* ─── Card 4: Usage (Set Pref) ─── */

const UsageCard = ({
  state,
  onUpdate,
}: {
  state: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}) => {
  const showMobileHomeQ = state.caravanType === "Touring caravan";
  const showFloodQ = state.caravanType === "Mobile home" || state.usedAsMobileHome === "Yes";

  return (
    <OfferCard
      title="Usage"
      subtitle="Your caravan type, how you use it, and where it is located."
    >
      <div className="space-y-5">
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
        </div>

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
    </OfferCard>
  );
};

/* ─── Card 5: Caravan Details (Set Pref) ─── */

const CaravanDetailsCard = ({
  state,
  onUpdate,
}: {
  state: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}) => {
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

  return (
    <OfferCard
      title="Caravan details"
      subtitle="Technical specifications and identification of your caravan."
    >
      <div className="space-y-5">
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

        <div className={`space-y-5 transition-opacity ${state.specsLoading ? "opacity-50 animate-pulse" : ""}`}>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">Length</p>
            <InfoTip text="Measure the body only. Please enter the length of the caravan's living area. Do not include the drawbar (the metal V-shaped part at the front that attaches to your car)." />
          </div>
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
    </OfferCard>
  );
};

/* ─── Card 6: Finance (Set Pref) ─── */

const FinanceCard = ({
  state,
  onUpdate,
}: {
  state: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}) => {
  const isUsed = state.condition === "Second hand";

  const formatCurrency = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    if (!digits) return "";
    return `€${parseInt(digits, 10).toLocaleString("nl-NL")}`;
  };

  return (
    <OfferCard
      title="Finance"
      subtitle="The value of your caravan determines your coverage and premium."
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">Bought it as</p>
            <InfoTip text='Choose "New" if you are the first owner.' />
          </div>
          <SegmentedControl
            options={[...CARAVAN_OPTIONS.conditionOptions]}
            value={state.condition}
            onChange={(v) => onUpdate("condition", v)}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Original price when new? (Catalogue Value)</p>
          <Input
            value={state.catalogueValue}
            onChange={(e) => onUpdate("catalogueValue", formatCurrency(e.target.value))}
            placeholder="€0"
            className="h-12 rounded-xl"
          />
        </div>

        {isUsed && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">What did you pay for it? (Purchase Value)</p>
            <Input
              value={state.purchaseValue}
              onChange={(e) => onUpdate("purchaseValue", formatCurrency(e.target.value))}
              placeholder="€0"
              className="h-12 rounded-xl"
            />
          </div>
        )}
      </div>
    </OfferCard>
  );
};

/* ─── Main export ─── */

export const CaravanOfferCards = ({
  productState,
  offerState,
  onUpdateProduct,
  onUpdateOffer,
}: CaravanOfferCardsProps) => (
  <div className="space-y-6">
    <OwnRiskCard
      value={offerState.ownRisk || "100"}
      onChange={(v) => onUpdateOffer("ownRisk", v)}
    />
    <CoverageCard
      value={offerState.coverage || "Casco Limited"}
      onChange={(v) => onUpdateOffer("coverage", v)}
    />
    <AdditionalCoverageCard offerState={offerState} onUpdateOffer={onUpdateOffer} />
    <UsageCard state={productState} onUpdate={onUpdateProduct} />
    <CaravanDetailsCard state={productState} onUpdate={onUpdateProduct} />
    <FinanceCard state={productState} onUpdate={onUpdateProduct} />
  </div>
);
