import { Info } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import TacoMessage from "./taco-message";
import { ChangeEvent } from "react";

interface StepBirthdateProps {
  birthdate: string;
  onUpdate: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
}

function formatDateInput(raw: string, prevValue: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  let result = "";
  for (let i = 0; i < digits.length; i++) {
    if (i === 2 || i === 4) result += "-";
    result += digits[i];
  }
  return result;
}

const StepBirthdate = ({ birthdate, onUpdate, onNext, onBack, animateTaco }: StepBirthdateProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value, birthdate);
    onUpdate(formatted);
  };

  return (
    <div className="animate-fade-in">
      <TacoMessage message="How old are you? 🎂" animate={animateTaco} />

      <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
        <div className="max-w-xs">
          <FloatingLabelInput
            label="dd-mm-yyyy"
            value={birthdate}
            onChange={handleChange}
            maxLength={10}
            inputMode="numeric"
            autoFocus={!birthdate}
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
