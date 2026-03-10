import { Info } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import tacoAvatar from "@/assets/taco-avatar.jpg";
import { ChangeEvent, KeyboardEvent, useState } from "react";

interface StepBirthdateProps {
  birthdate: string;
  onUpdate: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

function formatDateInput(raw: string, prevValue: string): string {
  // Strip non-digits
  const digits = raw.replace(/\D/g, "").slice(0, 8);

  let result = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) result += "-";
    result += digits[i];
  }
  return result;
}

const StepBirthdate = ({ birthdate, onUpdate, onNext, onBack }: StepBirthdateProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value, birthdate);
    onUpdate(formatted);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-12">
          <img
            src={tacoAvatar}
            alt="Tako"
            className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
          />
          <p className="text-base font-semibold text-foreground">
            How old are you? 🎂
          </p>
        </div>

        <div className="max-w-xs">
          <FloatingLabelInput
            label="dd-mm-yyyy"
            value={birthdate}
            onChange={handleChange}
            maxLength={10}
            inputMode="numeric"
            autoFocus
          />
        </div>

        <div className="flex items-start gap-2 mt-8 text-muted-foreground">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-sm">
            We need this information because your age is used by insurers when calculating the amount of your premium.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepBirthdate;
