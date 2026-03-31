/**
 * Step components for the Travel insurance product.
 * 3-step conversational flow with Taco messages.
 */
import { useState } from "react";
import { TacoMessage } from "@/components/onboarding/taco-message";
import { SectionCard, SegmentedControl } from "./shared-ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Info,
  Stethoscope,
  XCircle,
  Briefcase,
  Luggage,
  AlertTriangle,
  Scale,
  Zap,
  Car,
  Banknote,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import type { ProductStepProps } from "@/config/products/types";

/* ─── Shared InfoTip ─── */

const InfoTip = ({ text }: { text: string }) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Info className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

/* ─── Step 1: Foundations ─── */

const TRAVEL_DAY_OPTIONS = ["60", "90", "180", "365"];
const COVERAGE_OPTIONS = ["Europe", "Worldwide"];

export const TravelFoundationsStep = ({
  state,
  onUpdate,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Ready for your next adventure? Let's set up your travel protection."
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard>
      <div className="space-y-6">
        {/* Travel Days */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Up to how many days do you travel per year?
          </p>
          <SegmentedControl
            options={[...TRAVEL_DAY_OPTIONS]}
            value={state.travelDays}
            onChange={(v) => onUpdate("travelDays", v)}
          />
        </div>

        {/* Coverage Area */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">Coverage Area</p>
            <InfoTip text="'Europe' includes Morocco, Israel, Egypt, and Tunisia. If you're in doubt, we recommend 'Worldwide' so you can travel anywhere without a second thought!" />
          </div>
          <SegmentedControl
            options={[...COVERAGE_OPTIONS]}
            value={state.coverageArea}
            onChange={(v) => onUpdate("coverageArea", v)}
          />
        </div>
      </div>
    </SectionCard>
  </div>
);

/* ─── Step 2: Sport & Equipment ─── */

const YES_NO = ["Yes", "No"];

export const TravelSportStep = ({
  state,
  onUpdate,
  onAutoAdvance,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => {
  const showSportDetails = state.playsSport === "Yes";
  const showEquipmentDetails = showSportDetails && state.bringsEquipment === "Yes";

  return (
    <div className="animate-fade-in space-y-6">
      <TacoMessage
        message="Do you play sport on vacation?"
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />

      <SectionCard>
        <div className="space-y-6">
          {/* Play sport? */}
          <div className="space-y-2">
            <SegmentedControl
              options={[...YES_NO]}
              value={state.playsSport}
              onChange={(v) => {
                onUpdate("playsSport", v);
                if (v === "No") {
                  onAutoAdvance(
                    {
                      playsSport: "No",
                      adventureSports: "No",
                      bringsEquipment: "No",
                      golfEquipment: "No",
                      divingEquipment: "No",
                    },
                    "sport",
                  );
                }
              }}
            />
          </div>

          {showSportDetails && (
            <>
              {/* Adventure sports */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    Do you practice adventure sports?
                  </p>
                  <InfoTip text="Includes abseiling, rafting, climbing, diving, and parasailing." />
                </div>
                <SegmentedControl
                  options={[...YES_NO]}
                  value={state.adventureSports}
                  onChange={(v) => onUpdate("adventureSports", v)}
                />
              </div>

              {/* Brings equipment */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Do you bring any other sports equipment?
                </p>
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

              {showEquipmentDetails && (
                <>
                  {/* Golf */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Do you bring Golf equipment?
                    </p>
                    <SegmentedControl
                      options={[...YES_NO]}
                      value={state.golfEquipment}
                      onChange={(v) => onUpdate("golfEquipment", v)}
                    />
                  </div>

                  {/* Diving */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Do you bring Diving equipment?
                    </p>
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
      </SectionCard>
    </div>
  );
};

/* ─── Step 3: Supplements (Legal-style listing) ─── */

interface SupplementOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: "recommended" | "warning" | "info";
  crossProductBadge?: {
    productId: string;
    label: string;
    variant: "warning" | "info";
  };
  preSelected?: boolean;
}

const SUPPLEMENT_OPTIONS: SupplementOption[] = [
  {
    id: "medical",
    label: "Medical Expenses",
    description:
      "Your health insurance pays Dutch rates abroad. If a foreign hospital charges more, you pay the difference. We always recommend this.",
    icon: Stethoscope,
    badge: "Recommended",
    badgeVariant: "recommended",
    preSelected: true,
  },
  {
    id: "cancellation",
    label: "Cancellation Fees",
    description:
      "Get your money back if your trip is canceled or cut short due to illness, injury, or unexpected family emergencies.",
    icon: XCircle,
  },
  {
    id: "luggage",
    label: "Luggage",
    description:
      "Protect your suitcase, electronics, and personal items against theft, loss, or damage while traveling.",
    icon: Luggage,
  },
  {
    id: "extraordinary",
    label: "Extraordinary Costs",
    description:
      "Covers search and rescue, emergency transport home, or extra stay costs if you fall ill during your trip.",
    icon: AlertTriangle,
  },
  {
    id: "business",
    label: "Business Trip",
    description:
      "Covers work travel, fairs, or congresses. Note: This might already be arranged by your employer.",
    icon: Briefcase,
    badge: "Check Employer",
    badgeVariant: "warning",
  },
  {
    id: "legal",
    label: "Legal Assistance",
    description: "Covers legal costs abroad (e.g., traffic collisions).",
    icon: Scale,
    crossProductBadge: {
      productId: "legal",
      label: "Already in bundle",
      variant: "info",
    },
  },
  {
    id: "accidents",
    label: "Accidents",
    description:
      "A fixed payout for permanent disability or death. Usually only necessary if you have children.",
    icon: Zap,
  },
  {
    id: "road_assistance",
    label: "Road Assistance",
    description: "Emergency support if your vehicle breaks down abroad.",
    icon: Car,
    crossProductBadge: {
      productId: "car",
      label: "Check Car Policy",
      variant: "warning",
    },
  },
  {
    id: "cash",
    label: "Cash",
    description:
      "Coverage up to €750 for stolen cash. Requires police proof and is rarely successfully claimed.",
    icon: Banknote,
  },
];

const INITIAL_VISIBLE = 4;

const BADGE_STYLES: Record<string, string> = {
  recommended: "bg-primary/10 text-primary",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-amber-100 text-amber-700",
};

export const TravelSupplementsStep = ({
  state,
  onUpdate,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => {
  const [showAll, setShowAll] = useState(false);
  const selected: string[] = state.supplements || ["medical"];
  const selectedInsurances: string[] = state._selectedInsurances || [];

  const visibleOptions = showAll
    ? SUPPLEMENT_OPTIONS
    : SUPPLEMENT_OPTIONS.slice(0, INITIAL_VISIBLE);

  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      onUpdate(
        "supplements",
        selected.filter((s) => s !== id),
      );
    } else {
      onUpdate("supplements", [...selected, id]);
    }
  };

  const resolveBadge = (opt: SupplementOption) => {
    if (opt.crossProductBadge && selectedInsurances.includes(opt.crossProductBadge.productId)) {
      return { label: opt.crossProductBadge.label, variant: opt.crossProductBadge.variant };
    }
    if (opt.badge) {
      return { label: opt.badge, variant: opt.badgeVariant || "info" };
    }
    return null;
  };

  return (
    <div className="animate-fade-in space-y-6">
      <TacoMessage
        message="I've pre-selected the essentials. Just tick any extras that fit your travel style!"
        animate={animateTaco}
        onAnimationComplete={onAnimationComplete}
      />

      <SectionCard>
        <div className="space-y-3">
          {visibleOptions.map((opt) => {
            const isSelected = selected.includes(opt.id);
            const Icon = opt.icon;
            const badge = resolveBadge(opt);

            return (
              <button
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`relative flex items-start gap-4 w-full p-4 rounded-2xl border-2 transition-all text-left ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-muted-foreground/30"
                } cursor-pointer`}
              >
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/40"
                  }`}
                >
                  {isSelected && (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-primary/15" : "bg-primary/10"
                  }`}
                >
                  <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                {/* Badge */}
                {badge && (
                  <span
                    className={`absolute top-3 right-3 text-2xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                      BADGE_STYLES[badge.variant]
                    }`}
                  >
                    {badge.label}
                  </span>
                )}
              </button>
            );
          })}

          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Show more supplements
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {showAll && SUPPLEMENT_OPTIONS.length > INITIAL_VISIBLE && (
            <button
              onClick={() => setShowAll(false)}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Show less
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </SectionCard>
    </div>
  );
};

/* ─── Component map ─── */

export const TRAVEL_STEP_COMPONENTS: Record<
  string,
  React.ComponentType<ProductStepProps>
> = {
  foundations: TravelFoundationsStep,
  sport: TravelSportStep,
  supplements: TravelSupplementsStep,
};
