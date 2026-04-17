import { useState } from "react";
import { Check, Gift, Award } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { INSURANCE_TYPES } from "@/components/onboarding/types";
import { TacoMessage } from "./taco-message";
import { ValidationError } from "./validation-error";

const INSURER_PRICES: Record<string, number> = {
  home: 5.11,
  liability: 2.11,
  travel: 4.20,
  car: 45.00,
  legal: 12.40,
  accidents: 3.20,
  caravan: 9.80,
};
const BUNDLE_DISCOUNT_PERCENT = 10;
const ANNUAL_DISCOUNT_PERCENT = 5;

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
  const [annualDiscount, setAnnualDiscount] = useState(false);

  const products = INSURANCE_TYPES.filter((t) => selectedInsurances.includes(t.id));
  const fullName = [firstName, infix, lastName].filter(Boolean).join(" ");
  const firstDate = Object.values(startDates)[0] || "—";

  const totalBefore = products.reduce((sum, p) => sum + (INSURER_PRICES[p.id] || 5), 0);
  const bundleDiscount = totalBefore * (BUNDLE_DISCOUNT_PERCENT / 100);
  const afterBundle = totalBefore - bundleDiscount;
  const annualExtra = annualDiscount ? afterBundle * (ANNUAL_DISCOUNT_PERCENT / 100) : 0;
  const finalMonthly = afterBundle - annualExtra;
  const annualTotal = finalMonthly * 12;
  const totalMonthlySavings = bundleDiscount + annualExtra;
  const annualSavings = Math.round(totalMonthlySavings * 12 * 100) / 100;

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        stepId="final-preview"
        message="Everything looks good! 🎉 Let's confirm and get you insured."
        animate={animateTaco}
      />

      <div className="rounded-3xl border-2 border-input bg-card p-6 space-y-5">
        <h3 className="text-lg font-semibold text-foreground">Your Insurance Summary</h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-success bg-success/10 border border-success/20 rounded-full px-4 py-3">
            <Gift className="w-5 h-5" />
            You save with Surebird: €{annualSavings.toFixed(2)}/yr
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-3">
            <Award className="w-5 h-5" />
            Best and cheapest choices
          </span>
        </div>

        {/* Product lines */}
        <div className="space-y-2">
          {products.map((p) => {
            const original = INSURER_PRICES[p.id] || 5;
            const afterB = original * (1 - BUNDLE_DISCOUNT_PERCENT / 100);
            const final = annualDiscount ? afterB * (1 - ANNUAL_DISCOUNT_PERCENT / 100) : afterB;
            return (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-foreground">{p.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground line-through">€{original.toFixed(2)}</span>
                  <span className="text-sm font-semibold text-foreground">€{final.toFixed(2)}/mo</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Discount lines */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-success">Discount — 10%</span>
            <span className="text-sm font-semibold text-success">-€{bundleDiscount.toFixed(2)}</span>
          </div>
          {annualDiscount && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-success">Annual payment discount — 5%</span>
              <span className="text-sm font-semibold text-success">-€{annualExtra.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Annual discount toggle */}
        <div className="flex items-center justify-between py-3 border-t border-b border-border">
          <div>
            <span className="text-sm font-medium text-foreground">Annual payment discount</span>
            <span className="text-xs text-muted-foreground ml-1">— save 5% extra</span>
          </div>
          <Switch checked={annualDiscount} onCheckedChange={setAnnualDiscount} />
        </div>

        {/* Totals */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-base font-semibold text-foreground">Total Monthly</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground line-through">€{totalBefore.toFixed(2)}</span>
            <span className="text-base font-bold text-primary">€{finalMonthly.toFixed(2)}/mo</span>
          </div>
        </div>

        {annualDiscount && (
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-foreground">Annual Total</span>
            <span className="text-base font-bold text-primary">€{annualTotal.toFixed(2)}/yr</span>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Start Date</p>
          <p className="text-sm font-medium text-foreground">{firstDate}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Verified Details</p>
          <p className="text-sm font-medium text-foreground">{fullName}</p>
          <p className="text-sm text-muted-foreground">{iban || "—"}</p>
        </div>

        {/* Agreement checkboxes */}
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
