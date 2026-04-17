import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { TacoMessage } from "./taco-message";
import { ValidationError } from "./validation-error";
import { useT } from "@/i18n/LanguageContext";

interface StepNameProps {
  firstName: string;
  onUpdate: (field: "firstName" | "lastName", value: string) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

export const StepName = ({ firstName, onUpdate, onNext, onBack, animateTaco, errors, onClearError }: StepNameProps) => {
  const t = useT();
  return (
    <div className="animate-fade-in">
      <TacoMessage
        stepId="name"
        message={t("ui.aboutYou.taco_name", undefined, "Welcome to Surebird✌️ I'm Taco - your personal assistance. I'm here to help you to find the best insurance deal based on your needs. How should I address you?")}
        animate={animateTaco}
      />

      <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
        <div className="max-w-xs">
          <FloatingLabelInput
            label={t("ui.aboutYou.firstName_label", undefined, "First name")}
            value={firstName}
            onChange={(e) => {
              onUpdate("firstName", e.target.value);
              onClearError?.("firstName");
            }}
            maxLength={100}
            autoFocus={!firstName}
            className={errors?.firstName ? "border-destructive" : ""}
          />
          <ValidationError message={errors?.firstName} />
        </div>
      </div>
    </div>
  );
};
