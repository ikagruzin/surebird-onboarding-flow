import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { TacoMessage } from "./taco-message";

interface StepNameProps {
  firstName: string;
  onUpdate: (field: "firstName" | "lastName", value: string) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
}

export const StepName = ({ firstName, onUpdate, onNext, onBack, animateTaco }: StepNameProps) => {
  return (
    <div className="animate-fade-in">
      <TacoMessage
        message="Welcome to Surebird✌️ I'm Taco - your personal assistance. I'm here to help you to find the best insurance deal based on your needs. How should I address you?"
        animate={animateTaco}
      />

      <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
        <FloatingLabelInput
          label="First name"
          value={firstName}
          onChange={(e) => onUpdate("firstName", e.target.value)}
          maxLength={100}
          autoFocus={!firstName}
        />
      </div>
    </div>
  );
};

