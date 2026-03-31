import { Check, Gift, Award } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { INSURANCE_TYPES } from "@/components/onboarding/types";
import { TacoMessage } from "./taco-message";
import { ValidationError } from "./validation-error";

/* Mirror the offer page pricing so summary matches */
const INSURER_PRICES: Record<string, number> = {
  home: 5.11,
  liability: 2.11,
  travel: 4.20,
  car: 45.00,
  legal: 12.40,
  accidents: 3.20,
  caravan: 9.80,
};
const DISCOUNT_PERCENT = 10;

interface StepFinalPreviewProps {
  selectedInsurances: string[];
  startDates: Record<string, string>;
  firstName: string;
  infix: string;
  lastName: string;
  iban: string;
  email: string;
  agreeTerms: boolean;
  agreeDebit: boolean;
  onUpdateAgree: (field: "agreeTerms" | "agreeDebit", value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

export const StepFinalPreview = ({
  selectedInsurances,
  startDates,
  firstName,
  infix,
  lastName,
  iban,
  email,
  agreeTerms,
  agreeDebit,
  onUpdateAgree,
  animateTaco,
  errors,
  onClearError,
}: StepFinalPreviewProps) => {
  const products = INSURANCE_TYPES.filter((t) => selectedInsurances.includes(t.id));
  const fullName = [firstName, infix, lastName].filter(Boolean).join(" ");
  const firstDate = Object.values(startDates)[0] || "—";

  const totalBeforeDiscount = products.reduce((sum, p) => sum + (INSURER_PRICES[p.id] || 5), 0);
  const discountAmount = totalBeforeDiscount * (DISCOUNT_PERCENT / 100);
  const totalAfterDiscount = totalBeforeDiscount - discountAmount;
  const annualSavings = Math.round(discountAmount * 12 * 100) / 100;

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        message="Everything looks good! 🎉 Let's confirm and get you insured."
        animate={animateTaco}
      />

      {/* Summary card */}
      <div className="rounded-3xl border-2 border-input bg-card p-6 space-y-5">
        <h3 className="text-lg font-semibold text-foreground">Your Insurance Summary</h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-success bg-success/10 border border-success/20 rounded-full px-4 py-3">
            <Gift className="w-5 h-5" />
            You save with Surebird: €{annualSavings.toFixed(2)}
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-3">
            <Award className="w-5 h-5" />
            Best and cheapest choices
          </span>
        </div>

        <div className="space-y-2">
          {products.map((p) => {
            const original = INSURER_PRICES[p.id] || 5;
            const discounted = original * (1 - DISCOUNT_PERCENT / 100);
            return (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-foreground">{p.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground line-through">€{original.toFixed(2)}</span>
                  <span className="text-sm font-semibold text-foreground">€{discounted.toFixed(2)}/mo</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-base font-semibold text-foreground">Total Monthly</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground line-through">€{totalBeforeDiscount.toFixed(2)}</span>
            <span className="text-base font-bold text-primary">€{totalAfterDiscount.toFixed(2)}/mo</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Start Date</p>
          <p className="text-sm font-medium text-foreground">{firstDate}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Verified Details</p>
          <p className="text-sm font-medium text-foreground">{fullName}</p>
          <p className="text-sm text-muted-foreground">{iban || "—"}</p>
        </div>

        {/* Agreement checkboxes – inside the card */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={agreeTerms}
                onCheckedChange={(v) => {
                  onUpdateAgree("agreeTerms", v === true);
                  onClearError?.("agreeTerms");
                }}
                className="mt-0.5"
              />
              <span className="text-sm text-foreground leading-relaxed">
                I agree to the{" "}
                <span className="text-primary underline underline-offset-2">terms and conditions</span>{" "}
                and{" "}
                <span className="text-primary underline underline-offset-2">privacy policy</span>.
              </span>
            </label>
            <ValidationError message={errors?.agreeTerms} />
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <Checkbox
                checked={agreeDebit}
                onCheckedChange={(v) => {
                  onUpdateAgree("agreeDebit", v === true);
                  onClearError?.("agreeDebit");
                }}
                className="mt-0.5"
              />
              <span className="text-sm text-foreground leading-relaxed">
                I give permission to automatically debit the premiums from my account{" "}
                <span className="font-mono font-medium">{iban || "••••"}</span>.
              </span>
            </label>
            <ValidationError message={errors?.agreeDebit} />
          </div>
        </div>
      </div>
    </div>
  );
};
        </div>
      </div>
    </div>
  );
};
