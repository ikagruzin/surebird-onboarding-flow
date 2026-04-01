/**
 * Travel product – Offer page detail cards.
 * Renders 5 editable cards: Own Risk, Coverage (supplements), Extra Support, Travel Details, Sport.
 */
import { useState } from "react";
import { SectionCard, SegmentedControl } from "./shared-ui";
import { SelectionCard } from "@/components/ui/selection-card";
import { getSelectionGridClass } from "@/lib/grid-layout";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  XCircle,
  Luggage,
  AlertTriangle,
  Briefcase,
  Scale,
  Zap,
  Car,
  Banknote,
} from "lucide-react";

interface TravelOfferCardsProps {
  /** Product state from Set Preferences (supplements, travelDays, coverageArea, sport fields) */
  productState: Record<string, any>;
  /** Rest-data state (ownRisk, extraSupport) */
  offerState: Record<string, any>;
  /** Update a product-state field */
  onUpdateProduct: (key: string, value: any) => void;
  /** Update a rest-data field */
  onUpdateOffer: (key: string, value: any) => void;
  /** Selected insurances for cross-product badge logic */
  selectedInsurances?: string[];
}

/* ─── Card wrapper with title + subtitle ─── */

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

const OwnRiskCard = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
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

/* ─── Card 2: Coverage (supplements checklist) ─── */

interface SupplementDef {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const SUPPLEMENT_LIST: SupplementDef[] = [
  { id: "medical", label: "Medical Expenses", description: "Covers medical costs abroad that exceed Dutch health insurance rates.", icon: Stethoscope },
  { id: "cancellation", label: "Cancellation Fees", description: "Reimburses trip cancellation or interruption due to illness or emergencies.", icon: XCircle },
  { id: "luggage", label: "Luggage", description: "Protects against theft, loss, or damage to your belongings.", icon: Luggage },
  { id: "extraordinary", label: "Extraordinary Costs", description: "Covers search & rescue, emergency transport, or extended stay costs.", icon: AlertTriangle },
  { id: "business", label: "Business Trip", description: "Covers work travel, fairs, or congresses.", icon: Briefcase },
  { id: "legal", label: "Legal Assistance", description: "Covers legal costs abroad.", icon: Scale },
  { id: "accidents", label: "Accidents", description: "Fixed payout for permanent disability or death.", icon: Zap },
  { id: "road_assistance", label: "Road Assistance", description: "Emergency support if your vehicle breaks down abroad.", icon: Car },
  { id: "cash", label: "Cash", description: "Coverage up to €750 for stolen cash.", icon: Banknote },
];

const INITIAL_VISIBLE = 4;

const CoverageCard = ({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? SUPPLEMENT_LIST : SUPPLEMENT_LIST.slice(0, INITIAL_VISIBLE);

  const toggle = (id: string) => {
    if (id === "medical") return; // always included
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  };

  return (
    <OfferCard
      title="Coverage"
      subtitle="Select what should be covered during your trip. Medical expenses are always included."
    >
      <div className="space-y-3">
        {visible.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const Icon = opt.icon;
          const isMandatory = opt.id === "medical";
          return (
            <button
              key={opt.id}
              onClick={() => toggle(opt.id)}
              className={`relative flex items-start gap-4 w-full p-4 rounded-2xl border-2 transition-all text-left ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-muted-foreground/30"
              } cursor-pointer`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10">
                <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                  {isMandatory && (
                    <span className="text-2xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                      Always included
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{opt.description}</p>
              </div>
            </button>
          );
        })}

        {!showAll && SUPPLEMENT_LIST.length > INITIAL_VISIBLE && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Show more supplements
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
        {showAll && SUPPLEMENT_LIST.length > INITIAL_VISIBLE && (
          <button
            onClick={() => setShowAll(false)}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Show less
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </div>
    </OfferCard>
  );
};

/* ─── Card 3: Extra Support ─── */

const EXTRA_SUPPORT_OPTIONS = ["0", "1,000", "2,500"];

const ExtraSupportCard = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <OfferCard
    title="Extra support"
    subtitle="Extra financial support on top of your standard coverage, for example in case of emergency repatriation."
  >
    <SegmentedControl
      options={EXTRA_SUPPORT_OPTIONS.map((v) => `€${v}`)}
      value={`€${value}`}
      onChange={(v) => onChange(v.replace("€", ""))}
    />
  </OfferCard>
);

/* ─── Card 4: Travel Details ─── */

const TRAVEL_DAY_OPTIONS = ["60", "90", "180", "365"];
const COVERAGE_AREA_OPTIONS = ["Europe", "Worldwide"];

const TravelDetailsCard = ({
  travelDays,
  coverageArea,
  onUpdate,
}: {
  travelDays: string;
  coverageArea: string;
  onUpdate: (key: string, value: string) => void;
}) => (
  <OfferCard
    title="Travel details"
    subtitle="How long and where you typically travel. This determines the scope of your coverage."
  >
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Travel days per year</p>
        <SegmentedControl
          options={[...TRAVEL_DAY_OPTIONS]}
          value={travelDays}
          onChange={(v) => onUpdate("travelDays", v)}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Coverage area</p>
        <SegmentedControl
          options={[...COVERAGE_AREA_OPTIONS]}
          value={coverageArea}
          onChange={(v) => onUpdate("coverageArea", v)}
        />
      </div>
    </div>
  </OfferCard>
);

/* ─── Card 5: Sport ─── */

const YES_NO = ["Yes", "No"];

const SportCard = ({
  state,
  onUpdate,
}: {
  state: Record<string, any>;
  onUpdate: (key: string, value: string) => void;
}) => {
  const showDetails = state.playsSport === "Yes";
  const showEquipment = showDetails && state.bringsEquipment === "Yes";

  return (
    <OfferCard
      title="Sport"
      subtitle="Let us know about sports activities so we can make sure you are properly covered abroad."
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Do you play sport on vacation?</p>
          <SegmentedControl
            options={[...YES_NO]}
            value={state.playsSport}
            onChange={(v) => {
              onUpdate("playsSport", v);
              if (v === "No") {
                onUpdate("adventureSports", "No");
                onUpdate("bringsEquipment", "No");
                onUpdate("golfEquipment", "No");
                onUpdate("divingEquipment", "No");
              }
            }}
          />
        </div>

        {showDetails && (
          <>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Adventure sports?</p>
              <SegmentedControl
                options={[...YES_NO]}
                value={state.adventureSports}
                onChange={(v) => onUpdate("adventureSports", v)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Bring sports equipment?</p>
              <SegmentedControl
                options={[...YES_NO]}
                value={state.bringsEquipment}
                onChange={(v) => {
                  onUpdate("bringsEquipment", v);
                  if (v === "No") {
                    onUpdate("golfEquipment", "No");
                    onUpdate("divingEquipment", "No");
                  }
                }}
              />
            </div>
            {showEquipment && (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Golf equipment?</p>
                  <SegmentedControl
                    options={[...YES_NO]}
                    value={state.golfEquipment}
                    onChange={(v) => onUpdate("golfEquipment", v)}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Diving equipment?</p>
                  <SegmentedControl
                    options={[...YES_NO]}
                    value={state.divingEquipment}
                    onChange={(v) => onUpdate("divingEquipment", v)}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </OfferCard>
  );
};

/* ─── Main export ─── */

export const TravelOfferCards = ({
  productState,
  offerState,
  onUpdateProduct,
  onUpdateOffer,
}: TravelOfferCardsProps) => (
  <div className="space-y-6 mt-8">
    {/* 1. Own Risk */}
    <OwnRiskCard
      value={offerState.ownRisk || "100"}
      onChange={(v) => onUpdateOffer("ownRisk", v)}
    />

    {/* 2. Coverage (supplements) */}
    <CoverageCard
      selected={productState.supplements || ["medical"]}
      onChange={(v) => onUpdateProduct("supplements", v)}
    />

    {/* 3. Extra Support */}
    <ExtraSupportCard
      value={offerState.extraSupport || "0"}
      onChange={(v) => onUpdateOffer("extraSupport", v)}
    />

    {/* 4. Travel Details */}
    <TravelDetailsCard
      travelDays={productState.travelDays || "60"}
      coverageArea={productState.coverageArea || "Europe"}
      onUpdate={onUpdateProduct}
    />

    {/* 5. Sport */}
    <SportCard state={productState} onUpdate={onUpdateProduct} />
  </div>
);
