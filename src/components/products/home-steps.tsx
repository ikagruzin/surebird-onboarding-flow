/**
 * Step components for the Home insurance product.
 * Each component implements ProductStepProps.
 */
import { Check, Info } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SelectionCard } from "@/components/ui/selection-card";
import { Switch } from "@/components/ui/switch";
import { TacoMessage } from "@/components/onboarding/taco-message";
import { ValidationError } from "@/components/onboarding/validation-error";
import {
  SectionCard,
  ChipSelect,
  SegmentedControl,
  ToggleRow,
  NativeSelect,
} from "./shared-ui";
import { homeProduct, HOME_OPTIONS } from "@/config/products/home";
import type { ProductStepProps } from "@/config/products/types";
import { getSelectionGridClass } from "@/lib/grid-layout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ─── Reusable info tooltip ─── */

const InfoTip = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="w-4 h-4 text-muted-foreground shrink-0 cursor-help" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/* ─── Step: Preset Verification ─── */

export const HomePresetStep = ({
  state,
  onAutoAdvance,
  animateTaco,
  onAnimationComplete,
  errors,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="To save you time, I've pre-filled the standard details for a Dutch home. Can you confirm this?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="My house is/has:">
      <ul className="space-y-3 mb-5">
        {homeProduct.presetChecklist!.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">{item}</span>
          </li>
        ))}
      </ul>

      <div className={`mt-5 ${getSelectionGridClass(["Yes", "No"])}`}>
        <SelectionCard
          label="Yes"
          selected={state.presetAnswer === "yes"}
          indicator="radio"
          onClick={() =>
            onAutoAdvance(
              { presetAnswer: "yes", ...homeProduct.presetState },
              "preset-verification",
            )
          }
        />
        <SelectionCard
          label="No"
          selected={state.presetAnswer === "no"}
          indicator="radio"
          onClick={() =>
            onAutoAdvance({ presetAnswer: "no", ...homeProduct.presetState }, "preset-verification")
          }
        />
      </div>
      <ValidationError message={errors?.presetAnswer} />
    </SectionCard>
  </div>
);

/* ─── Step: Role Selection ─── */

export const HomeRoleStep = ({
  state,
  onAutoAdvance,
  animateTaco,
  onAnimationComplete,
  errors,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Great. Are you tenant or homeowner of this house?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />
    <Card>
      <CardContent className="pt-6">
        <SegmentedControl
          options={["Tenant", "Homeowner"]}
          value={
            state.role === "tenant"
              ? "Tenant"
              : state.role === "homeowner"
                ? "Homeowner"
                : ""
          }
          onChange={(v) =>
            onAutoAdvance(
              { role: v.toLowerCase() as "tenant" | "homeowner" },
              "role",
            )
          }
        />
        <ValidationError message={errors?.role} />
      </CardContent>
    </Card>
  </div>
);

/* ─── Step: Home Details ─── */

export const HomeDetailsStep = ({
  state,
  onUpdate,
  animateTaco,
  onAnimationComplete,
  errors,
  onClearError,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="No problem! You can manually adjust the details of your home below to make sure everything is accurate."
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Home Details">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-foreground">
              Building Type
            </label>
            <InfoTip text="Two-under-a-roof = a semi-detached house sharing one roof with a neighboring property. Canal house = a traditional narrow, multi-story house along a canal, typical of Dutch city centers." />
          </div>
          <NativeSelect
            value={state.buildingType}
            onChange={(e) => { onUpdate("buildingType", e.target.value); onClearError?.("buildingType"); }}
            placeholder="Select building type"
            className={errors?.buildingType ? "border-destructive" : ""}
          >
            {HOME_OPTIONS.buildingTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </NativeSelect>
          <ValidationError message={errors?.buildingType} />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Usage
          </label>
          <ChipSelect
            options={[...HOME_OPTIONS.usageOptions]}
            selected={state.usage}
            onChange={(v) => { onUpdate("usage", v); onClearError?.("usage"); }}
          />
          <ValidationError message={errors?.usage} />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Construction Materials
          </label>
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
                  onClick={() => { onUpdate("constructionMaterial", opt); onClearError?.("constructionMaterial"); }}
                />
              );
            })}
          </div>
          <ValidationError message={errors?.constructionMaterial} />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Floor Material
          </label>
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
                  onClick={() => { onUpdate("floorMaterial", opt); onClearError?.("floorMaterial"); }}
                />
              );
            })}
          </div>
          <ValidationError message={errors?.floorMaterial} />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Roof Shape
          </label>
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
                  onClick={() => { onUpdate("roofShape", opt); onClearError?.("roofShape"); }}
                />
              );
            })}
          </div>
          <ValidationError message={errors?.roofShape} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-foreground">
              Roof Material
            </label>
            <InfoTip text="Artificial reeds = synthetic thatching material that mimics the look of natural reed. (Largely) reed = the roof is primarily covered with natural reed thatching." />
          </div>
          <NativeSelect
            value={state.roofMaterial}
            onChange={(e) => { onUpdate("roofMaterial", e.target.value); onClearError?.("roofMaterial"); }}
            placeholder="Select roof material"
            className={errors?.roofMaterial ? "border-destructive" : ""}
          >
            {HOME_OPTIONS.roofMaterials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </NativeSelect>
          <ValidationError message={errors?.roofMaterial} />
        </div>
      </div>
    </SectionCard>
  </div>
);

/* ─── Step: Coverage Path ─── */

const COVERAGE_OPTIONS: {
  key: string;
  label: string;
  tooltip: string;
}[] = [
  {
    key: "household",
    label: "Household goods",
    tooltip:
      "Covers everything inside your home — furniture, electronics, clothing, and personal belongings.",
  },
  {
    key: "building",
    label: "Building",
    tooltip:
      "Covers the physical structure of your home — walls, roof, floors, fitted kitchen, and bathroom installations.",
  },
  {
    key: "both",
    label: "Household goods + Building",
    tooltip:
      "Full protection for both your belongings and the building itself — the most comprehensive option.",
  },
];

export const HomeCoveragePathStep = ({
  state,
  onAutoAdvance,
  animateTaco,
  onAnimationComplete,
  errors,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="What would you like to insure?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />
    <Card>
      <CardContent className={`pt-6 ${getSelectionGridClass(COVERAGE_OPTIONS.map(o => o.label))}`}>
        {COVERAGE_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.key}
            label={opt.label}
            selected={state.coverageChoice === opt.key}
            indicator="radio"
            rightIcon={<InfoTip text={opt.tooltip} />}
            onClick={() =>
              onAutoAdvance({ coverageChoice: opt.key }, "coverage-path")
            }
          />
        ))}
        <ValidationError message={errors?.coverageChoice} />
      </CardContent>
    </Card>
  </div>
);

/* ─── Step: Contents Insurance ─── */

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
    tooltip:
      "Covers high-end audio and video equipment like home cinema systems, premium speakers, and professional-grade TVs.",
  },
  {
    field: "jewelry",
    amountField: "jewelryAmount",
    label: "Jewelry",
    threshold: "€6,000",
    tooltip:
      "Covers valuable jewelry items such as watches, rings, necklaces, and other precious accessories.",
  },
  {
    field: "specialAssets",
    amountField: "specialAssetsAmount",
    label: "Special assets",
    threshold: "€15,000",
    tooltip:
      "Covers art, antiques, collections, and other high-value possessions that exceed standard coverage limits.",
  },
  {
    field: "ownerInterest",
    amountField: "ownerInterestAmount",
    label: "Owner interest",
    threshold: "€6,000",
    tooltip:
      "Covers improvements you've made to a rented property — like a new kitchen or bathroom — that aren't part of the building insurance.",
  },
];

export const HomeContentsStep = ({
  state,
  onUpdate,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Let's make sure your belongings are properly covered. Contents insurance protects what's inside your home — from furniture and electronics to clothing and valuables."
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Contents Insurance">
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          Select if your belongings worth more than the stated amount
        </p>

        {CONTENTS_ITEMS.map((item) => (
          <div key={item.field} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {item.label}
                </span>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {item.threshold}
                </span>
                <InfoTip text={item.tooltip} />
              </div>
              <button
                onClick={() => onUpdate(item.field, !state[item.field])}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                  state[item.field] ? "bg-primary" : "bg-input"
                }`}
              >
                <span
                  className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                    state[item.field] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
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
            <label className="text-sm font-semibold text-foreground">
              Any house security?
            </label>
            <InfoTip text="Security measures installed in your home, such as BORG-certified locks or police-marked valuables." />
          </div>
          <SegmentedControl
            options={[...HOME_OPTIONS.securityOptions]}
            value={state.security}
            onChange={(v) => onUpdate("security", v)}
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-foreground">
              Monthly net income (highest earner in your household)
            </label>
            <InfoTip text="We use this to estimate the replacement value of your household contents. Choose the monthly net income of the highest earner." />
          </div>
          <SegmentedControl
            options={[...HOME_OPTIONS.netIncomeOptions]}
            value={state.netIncome}
            onChange={(v) => onUpdate("netIncome", v)}
          />
        </div>
        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-foreground">
                Insure things you take outside
              </label>
              <InfoTip text="Items you regularly carry outside your home, like a laptop, phone, bicycle, or sports equipment." />
            </div>
            <Switch
              checked={state.outsideValue !== "€0"}
              onCheckedChange={(checked) => {
                if (!checked) {
                  onUpdate("outsideValue", "€0");
                } else {
                  onUpdate("outsideValue", "");
                }
              }}
            />
          </div>
          {state.outsideValue !== "€0" && state.outsideValue !== "" && (
            <div className="mt-3">
              <NativeSelect
                value={state.outsideValue || ""}
                onChange={(e) => onUpdate("outsideValue", e.target.value)}
                placeholder="Select outside value"
              >
                {HOME_OPTIONS.outsideValueOptions
                  .filter((o) => o !== "€0")
                  .map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
              </NativeSelect>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  </div>
);

/* ─── Step: Building Insurance ─── */

export const HomeBuildingStep = ({
  state,
  onUpdate,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Now for the structure itself. This protects the physical building, including the walls, roof, and even your fitted kitchen or bathroom pipes."
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Building Insurance">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Monumental status</span>
            <InfoTip text="A monumental building is officially designated as a cultural heritage site. This affects coverage requirements and premiums." />
          </div>
          <button onClick={() => onUpdate("monumental", !state.monumental)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${state.monumental ? "bg-primary" : "bg-input"}`}><span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${state.monumental ? "translate-x-5" : "translate-x-0"}`} /></button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">More than 25m² outbuildings</span>
            <InfoTip text="Outbuildings larger than 25m² such as sheds, garages, or garden houses that are separate from the main building." />
          </div>
          <button onClick={() => onUpdate("quoted", !state.quoted)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${state.quoted ? "bg-primary" : "bg-input"}`}><span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${state.quoted ? "translate-x-5" : "translate-x-0"}`} /></button>
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Floor count
          </label>
          <SegmentedControl
            options={[...HOME_OPTIONS.floorCountOptions]}
            value={state.floorCount}
            onChange={(v) => onUpdate("floorCount", v)}
          />
        </div>
        <div className="border-t border-border pt-5 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Renovation in the last 10 years</span>
              <InfoTip text="Any major renovation work done in the last 10 years, such as kitchen or bathroom remodels, extensions, or structural changes." />
            </div>
            <button onClick={() => onUpdate("rainwater", !state.rainwater)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${state.rainwater ? "bg-primary" : "bg-input"}`}><span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${state.rainwater ? "translate-x-5" : "translate-x-0"}`} /></button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Solar Panels</span>
              <InfoTip text="Solar panels installed on the roof or property. These may affect the insured building value." />
            </div>
            <button onClick={() => onUpdate("smartSensors", !state.smartSensors)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${state.smartSensors ? "bg-primary" : "bg-input"}`}><span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${state.smartSensors ? "translate-x-5" : "translate-x-0"}`} /></button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Heat pump</span>
              <InfoTip text="A heat pump system installed for heating or cooling. This increases the building's insured value." />
            </div>
            <button onClick={() => onUpdate("heatPump", !state.heatPump)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${state.heatPump ? "bg-primary" : "bg-input"}`}><span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${state.heatPump ? "translate-x-5" : "translate-x-0"}`} /></button>
          </div>
        </div>
      </div>
    </SectionCard>
  </div>
);

/* ─── Component map (used by the renderer / pages) ─── */

export const HOME_STEP_COMPONENTS: Record<
  string,
  React.ComponentType<ProductStepProps>
> = {
  "preset-verification": HomePresetStep,
  role: HomeRoleStep,
  "home-details": HomeDetailsStep,
  "coverage-path": HomeCoveragePathStep,
  contents: HomeContentsStep,
  building: HomeBuildingStep,
};
