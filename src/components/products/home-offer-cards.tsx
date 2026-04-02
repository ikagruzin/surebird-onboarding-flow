/**
 * Home product – Offer page detail cards.
 * Supports two sub-products: Household goods & Building.
 * Each sub-product has: Own Risk, Coverage, a product-specific Set Preferences card, and shared My House Details.
 */
import { Info, Check } from "lucide-react";
import { SectionCard, SegmentedControl, ChipSelect, NativeSelect } from "./shared-ui";
import { SelectionCard } from "@/components/ui/selection-card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { HOME_OPTIONS } from "@/config/products/home";
import { getSelectionGridClass } from "@/lib/grid-layout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ─── Types ─── */

interface HomeOfferCardsProps {
  /** Current sub-product tab: "household" or "building" */
  activeSubTab: "household" | "building";
  /** Product state from Set Preferences */
  productState: Record<string, any>;
  /** Offer state for the active sub-product */
  subOfferState: Record<string, any>;
  /** Update a key in product state */
  onUpdateProduct: (key: string, value: any) => void;
  /** Update a key in the active sub-product's offer state */
  onUpdateSubOffer: (key: string, value: any) => void;
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
      options={OWN_RISK_OPTIONS.map((v) => (v === "0" ? "No deductible" : `€${v}`))}
      value={value === "0" ? "No deductible" : `€${value}`}
      onChange={(v) => {
        const raw = v === "No deductible" ? "0" : v.replace("€", "");
        onChange(raw);
      }}
    />
  </OfferCard>
);

/* ─── Card 2: Coverage ─── */

const COVERAGE_OPTIONS: { value: string; label: string; subtitle: string; recommended?: boolean }[] = [
  {
    value: "Extra extensive",
    label: "Extra extensive",
    subtitle: "Covers a wide range of damage including fire, storm, theft, and water damage — suitable for most homeowners.",
  },
  {
    value: "All Risk",
    label: "All Risk",
    subtitle: "The most comprehensive coverage — includes all risks except those explicitly excluded. Maximum protection for your home.",
    recommended: true,
  },
];

const CoverageCard = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <OfferCard
    title="Coverage"
    subtitle="Choose the level of protection for your home insurance."
  >
    <div className="space-y-3">
      {COVERAGE_OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`w-full flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-muted-foreground/30"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                isSelected ? "border-primary" : "border-muted-foreground/40"
              }`}
            >
              {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                {opt.recommended && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-medium">
                    Recommended
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{opt.subtitle}</p>
            </div>
          </button>
        );
      })}
    </div>
  </OfferCard>
);

/* ─── Card 3a: Contents Insurance (Set Preferences) ─── */

const CONTENTS_ITEMS: {
  field: string;
  amountField: string;
  label: string;
  threshold: string;
  tooltip: string;
}[] = [
  {
    field: "highValueAV",
    amountField: "highValueAVAmount",
    label: "High-value Audiovisual",
    threshold: "€12,000",
    tooltip: "Covers high-end audio and video equipment like home cinema systems, premium speakers, and professional-grade TVs.",
  },
  {
    field: "jewelry",
    amountField: "jewelryAmount",
    label: "Jewelry",
    threshold: "€6,000",
    tooltip: "Covers valuable jewelry items such as watches, rings, necklaces, and other precious accessories.",
  },
  {
    field: "specialAssets",
    amountField: "specialAssetsAmount",
    label: "Special assets",
    threshold: "€15,000",
    tooltip: "Covers art, antiques, collections, and other high-value possessions that exceed standard coverage limits.",
  },
  {
    field: "ownerInterest",
    amountField: "ownerInterestAmount",
    label: "Owner interest",
    threshold: "€6,000",
    tooltip: "Covers improvements you've made to a rented property — like a new kitchen or bathroom — that aren't part of the building insurance.",
  },
];

const ContentsCard = ({
  state,
  onUpdate,
}: {
  state: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}) => (
  <OfferCard
    title="Contents insurance"
    subtitle="Details about your belongings and their estimated value."
  >
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Select if your belongings worth more than the stated amount
      </p>

      {CONTENTS_ITEMS.map((item) => (
        <div key={item.field} className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {item.threshold}
              </span>
              <InfoTip text={item.tooltip} />
            </div>
            <Switch
              checked={!!state[item.field]}
              onCheckedChange={(v) => onUpdate(item.field, v)}
            />
          </div>
          {state[item.field] && (
            <input
              type="text"
              placeholder="Enter amount (€)"
              value={state[item.amountField] || ""}
              onChange={(e) => onUpdate(item.amountField, e.target.value)}
              className="w-full rounded-2xl border-2 border-input bg-background h-14 px-4 text-sm text-foreground focus:outline-none focus:border-primary"
            />
          )}
        </div>
      ))}

      <div className="border-t border-border pt-5">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-semibold text-foreground">Any house security?</label>
          <InfoTip text="Security measures installed in your home, such as BORG-certified locks or police-marked valuables." />
        </div>
        <SegmentedControl
          options={[...HOME_OPTIONS.securityOptions]}
          value={state.security || "None"}
          onChange={(v) => onUpdate("security", v)}
        />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-semibold text-foreground">Monthly net income (highest earner)</label>
          <InfoTip text="We use this to estimate the replacement value of your household contents. Choose the monthly net income of the highest earner." />
        </div>
        <SegmentedControl
          options={[...HOME_OPTIONS.netIncomeOptions]}
          value={state.netIncome || "€2,000 - €3,000"}
          onChange={(v) => onUpdate("netIncome", v)}
        />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-semibold text-foreground">How much value do you take outside?</label>
          <InfoTip text="Items you regularly carry outside your home, like a laptop, phone, bicycle, or sports equipment." />
        </div>
        <NativeSelect
          value={state.outsideValue || "€0"}
          onChange={(e) => onUpdate("outsideValue", e.target.value)}
          placeholder="Select outside value"
        >
          {HOME_OPTIONS.outsideValueOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </NativeSelect>
      </div>
    </div>
  </OfferCard>
);

/* ─── Card 3b: Building Insurance (Set Preferences) ─── */

const BuildingCard = ({
  state,
  onUpdate,
}: {
  state: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}) => (
  <OfferCard
    title="Building insurance"
    subtitle="Structural details and features of your building."
  >
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Monumental status</span>
          <InfoTip text="A monumental building is officially designated as a cultural heritage site. This affects coverage requirements and premiums." />
        </div>
        <Switch checked={!!state.monumental} onCheckedChange={(v) => onUpdate("monumental", v)} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">More than 25m² outbuildings</span>
          <InfoTip text="Outbuildings larger than 25m² such as sheds, garages, or garden houses that are separate from the main building." />
        </div>
        <Switch checked={!!state.quoted} onCheckedChange={(v) => onUpdate("quoted", v)} />
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Floor count</label>
        <SegmentedControl
          options={[...HOME_OPTIONS.floorCountOptions]}
          value={state.floorCount || "1"}
          onChange={(v) => onUpdate("floorCount", v)}
        />
      </div>
      <div className="border-t border-border pt-5 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Renovation in the last 10 years</span>
            <InfoTip text="Any major renovation work done in the last 10 years, such as kitchen or bathroom remodels, extensions, or structural changes." />
          </div>
          <Switch checked={!!state.rainwater} onCheckedChange={(v) => onUpdate("rainwater", v)} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Solar Panels</span>
            <InfoTip text="Solar panels installed on the roof or property. These may affect the insured building value." />
          </div>
          <Switch checked={!!state.smartSensors} onCheckedChange={(v) => onUpdate("smartSensors", v)} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Heat pump</span>
            <InfoTip text="A heat pump system installed for heating or cooling. This increases the building's insured value." />
          </div>
          <Switch checked={!!state.heatPump} onCheckedChange={(v) => onUpdate("heatPump", v)} />
        </div>
      </div>
    </div>
  </OfferCard>
);

/* ─── Card 4: My House Details (shared, Set Preferences) ─── */

const HouseDetailsCard = ({
  state,
  onUpdate,
}: {
  state: Record<string, any>;
  onUpdate: (key: string, value: any) => void;
}) => (
  <OfferCard
    title="My house details"
    subtitle="The physical characteristics of your home."
  >
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-semibold text-foreground">Building Type</label>
          <InfoTip text="Two-under-a-roof = a semi-detached house sharing one roof with a neighboring property. Canal house = a traditional narrow, multi-story house along a canal, typical of Dutch city centers." />
        </div>
        <NativeSelect
          value={state.buildingType || ""}
          onChange={(e) => onUpdate("buildingType", e.target.value)}
          placeholder="Select building type"
        >
          {HOME_OPTIONS.buildingTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </NativeSelect>
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Usage</label>
        <ChipSelect
          options={[...HOME_OPTIONS.usageOptions]}
          selected={state.usage || []}
          onChange={(v) => onUpdate("usage", v)}
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Construction Materials</label>
        <div className={getSelectionGridClass(HOME_OPTIONS.constructionMaterials)}>
          {HOME_OPTIONS.constructionMaterials.map((opt) => {
            const tooltips: Record<string, string> = {
              "Wooden skeleton": "The main structural frame is made of wood (timber-frame construction).",
              "(Largely) stone": "The exterior walls are mostly built with brick, stone, or concrete blocks.",
              "Wooden frame with stone wall": "A timber structural frame with an outer layer of brick or stone cladding.",
            };
            return (
              <SelectionCard
                key={opt}
                label={opt}
                selected={state.constructionMaterial === opt}
                indicator="radio"
                rightIcon={tooltips[opt] ? <InfoTip text={tooltips[opt]} /> : undefined}
                onClick={() => onUpdate("constructionMaterial", opt)}
              />
            );
          })}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Floor Material</label>
        <div className={getSelectionGridClass(HOME_OPTIONS.floorMaterials)}>
          {HOME_OPTIONS.floorMaterials.map((opt) => {
            const tooltips: Record<string, string> = {
              "No floors": "Ground-level only, with no additional story floors above (e.g., concrete slab on grade).",
            };
            return (
              <SelectionCard
                key={opt}
                label={opt}
                selected={state.floorMaterial === opt}
                indicator="radio"
                rightIcon={tooltips[opt] ? <InfoTip text={tooltips[opt]} /> : undefined}
                onClick={() => onUpdate("floorMaterial", opt)}
              />
            );
          })}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground mb-2 block">Roof Shape</label>
        <div className={getSelectionGridClass(HOME_OPTIONS.roofShapes)}>
          {HOME_OPTIONS.roofShapes.map((opt) => {
            const tooltips: Record<string, string> = {
              "Special": "An unconventional roof shape such as a dome, mansard, or multi-angled design.",
            };
            return (
              <SelectionCard
                key={opt}
                label={opt}
                selected={state.roofShape === opt}
                indicator="radio"
                rightIcon={tooltips[opt] ? <InfoTip text={tooltips[opt]} /> : undefined}
                onClick={() => onUpdate("roofShape", opt)}
              />
            );
          })}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-semibold text-foreground">Roof Material</label>
          <InfoTip text="Artificial reeds = synthetic thatching material that mimics the look of natural reed. (Largely) reed = the roof is primarily covered with natural reed thatching." />
        </div>
        <NativeSelect
          value={state.roofMaterial || ""}
          onChange={(e) => onUpdate("roofMaterial", e.target.value)}
          placeholder="Select roof material"
        >
          {HOME_OPTIONS.roofMaterials.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </NativeSelect>
      </div>
    </div>
  </OfferCard>
);

/* ─── Main export ─── */

export const HomeOfferCards = ({
  activeSubTab,
  productState,
  subOfferState,
  onUpdateProduct,
  onUpdateSubOffer,
}: HomeOfferCardsProps) => {
  return (
    <div className="space-y-6 mt-6">
      {/* Card 1: Own Risk */}
      <OwnRiskCard
        value={subOfferState.ownRisk || "100"}
        onChange={(v) => onUpdateSubOffer("ownRisk", v)}
      />

      {/* Card 2: Coverage */}
      <CoverageCard
        value={subOfferState.coverage || "All Risk"}
        onChange={(v) => onUpdateSubOffer("coverage", v)}
      />

      {/* Card 3: Product-specific Set Preferences card */}
      {activeSubTab === "household" ? (
        <ContentsCard state={productState} onUpdate={onUpdateProduct} />
      ) : (
        <BuildingCard state={productState} onUpdate={onUpdateProduct} />
      )}

      {/* Card 4: Shared My House Details */}
      <HouseDetailsCard state={productState} onUpdate={onUpdateProduct} />
    </div>
  );
};
