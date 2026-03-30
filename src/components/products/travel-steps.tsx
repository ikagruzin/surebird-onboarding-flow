/**
 * Step components for the Travel insurance product.
 * 3-step conversational flow with Taco messages.
 */
import { TacoMessage } from "@/components/onboarding/taco-message";
import { SelectionCard } from "@/components/ui/selection-card";
import { NativeSelect } from "@/components/ui/native-select";
import { SectionCard } from "./shared-ui";
import { Stethoscope, XCircle, Snowflake, Briefcase } from "lucide-react";
import type { ProductStepProps } from "@/config/products/types";

/* ─── Step 1: Context (Who & Where) ─── */

export const TravelContextStep = ({
  state,
  onUpdate,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Ready for your next adventure? Let's set up your year-round protection. Where do you usually travel?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Coverage area">
      <div className="space-y-2">
        {[
          { value: "europe", label: "Europe", sub: "Includes Mediterranean countries" },
          { value: "world", label: "World", sub: "Worldwide coverage" },
        ].map((opt) => (
          <SelectionCard
            key={opt.value}
            label={`${opt.label} — ${opt.sub}`}
            selected={state.coverageArea === opt.value}
            indicator="radio"
            onClick={() => onUpdate("coverageArea", opt.value)}
          />
        ))}
      </div>
    </SectionCard>

    <SectionCard title="Who are you insuring?">
      <div className="space-y-2">
        {[
          { value: "myself", label: "Myself only" },
          { value: "partner", label: "My partner" },
          { value: "family", label: "My whole family" },
        ].map((opt) => (
          <SelectionCard
            key={opt.value}
            label={opt.label}
            selected={state.insuredParty === opt.value}
            indicator="radio"
            onClick={() => onUpdate("insuredParty", opt.value)}
          />
        ))}
      </div>
    </SectionCard>
  </div>
);

/* ─── Step 2: Supplements & Sports ─── */

const SUPPLEMENTS = [
  {
    key: "medicalExpenses",
    label: "Medical Expenses",
    description: "Covers costs above the Dutch health insurance rate.",
    icon: Stethoscope,
    recommended: true,
  },
  {
    key: "cancellation",
    label: "Cancellation Insurance",
    description: "Refunds your trip if you can't go or have to come home early.",
    icon: XCircle,
  },
  {
    key: "winterSports",
    label: "Winter & Dangerous Sports",
    description: "Covers skiing, snowboarding, and high-risk sports like scuba diving.",
    icon: Snowflake,
  },
  {
    key: "businessTrips",
    label: "Business Trips",
    description: "Covers travel for work, fairs, or congresses.",
    icon: Briefcase,
  },
];

export const TravelSupplementsStep = ({
  state,
  onUpdate,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Great choice. Now, do you have any specific plans or hobbies? Only select what applies to you—I've kept it simple to save you time."
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Supplements">
      <div className="space-y-2">
        {SUPPLEMENTS.map((sup) => {
          const Icon = sup.icon;
          return (
            <SelectionCard
              key={sup.key}
              label={sup.label}
              icon={<Icon className="w-5 h-5 text-primary" />}
              selected={!!state[sup.key]}
              indicator="checkbox"
              onClick={() => onUpdate(sup.key, !state[sup.key])}
            />
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Roadside Assistance and Specific Equipment Values can be added on your offer page.
      </p>
    </SectionCard>
  </div>
);

/* ─── Step 3: Safety Net (Baggage & Risk) ─── */

const LUGGAGE_OPTIONS = ["€1,500", "€3,000", "€5,000"];
const OWN_RISK_OPTIONS = ["€0", "€50", "€100"];

export const TravelSafetyStep = ({
  state,
  onUpdate,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Almost there! I've set a standard protection for your luggage and a low own risk. Do these look okay to you?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Luggage coverage">
      <NativeSelect
        value={state.luggageCoverage}
        onChange={(e) => onUpdate("luggageCoverage", e.target.value)}
        placeholder="Select luggage coverage"
      >
        {LUGGAGE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt} {opt === "€1,500" ? "(Standard)" : ""}
          </option>
        ))}
      </NativeSelect>
    </SectionCard>

    <SectionCard title="Own risk (excess)">
      <div className="space-y-2">
        {OWN_RISK_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt}
            label={opt}
            selected={state.ownRisk === opt}
            indicator="radio"
            onClick={() => onUpdate("ownRisk", opt)}
          />
        ))}
      </div>
    </SectionCard>
  </div>
);

/* ─── Component map ─── */

export const TRAVEL_STEP_COMPONENTS: Record<
  string,
  React.ComponentType<ProductStepProps>
> = {
  context: TravelContextStep,
  supplements: TravelSupplementsStep,
  "safety-net": TravelSafetyStep,
};
