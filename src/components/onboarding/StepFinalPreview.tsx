import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { INSURANCE_TYPES } from "@/components/onboarding/types";
import tacoAvatar from "@/assets/taco-avatar.jpg";

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
}

const StepFinalPreview = ({
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
}: StepFinalPreviewProps) => {
  const products = INSURANCE_TYPES.filter((t) => selectedInsurances.includes(t.id));
  const totalMonthly = products.reduce((sum, p) => sum + p.savings, 0);
  const fullName = [firstName, infix, lastName].filter(Boolean).join(" ");

  // Use the first product's start date or fallback
  const firstDate = Object.values(startDates)[0] || "—";

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      {/* Taco message */}
      <div className="flex items-center gap-3">
        <img src={tacoAvatar} alt="Taco" className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="bg-muted rounded-2xl rounded-tl-md px-5 py-3">
          <p className="text-base text-foreground">
            Everything looks good! 🎉 Let's confirm and get you insured.
          </p>
        </div>
      </div>

      {/* Summary card */}
      <div className="rounded-3xl border-2 border-input bg-card p-6 space-y-5">
        <h3 className="text-lg font-semibold text-foreground">Your Insurance Summary</h3>

        {/* Products */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Selected Products</p>
          <div className="space-y-2">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-foreground">{p.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  €{p.savings.toFixed(2)}/mo
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-base font-semibold text-foreground">Total Monthly</span>
            <span className="text-base font-bold text-primary">
              €{totalMonthly.toFixed(2)}/mo
            </span>
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Start Date</p>
          <p className="text-sm font-medium text-foreground">{firstDate}</p>
        </div>

        {/* Personal Info */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Verified Details</p>
          <p className="text-sm font-medium text-foreground">{fullName}</p>
          <p className="text-sm text-muted-foreground">{iban || "—"}</p>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer group">
          <Checkbox
            checked={agreeTerms}
            onCheckedChange={(v) => onUpdateAgree("agreeTerms", v === true)}
            className="mt-0.5"
          />
          <span className="text-sm text-foreground leading-relaxed">
            I agree to the{" "}
            <span className="text-primary underline underline-offset-2">terms and conditions</span>{" "}
            and{" "}
            <span className="text-primary underline underline-offset-2">privacy policy</span>.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <Checkbox
            checked={agreeDebit}
            onCheckedChange={(v) => onUpdateAgree("agreeDebit", v === true)}
            className="mt-0.5"
          />
          <span className="text-sm text-foreground leading-relaxed">
            I give permission to automatically debit the premiums from my account{" "}
            <span className="font-mono font-medium">{iban || "••••"}</span>.
          </span>
        </label>
      </div>
    </div>
  );
};

export default StepFinalPreview;
