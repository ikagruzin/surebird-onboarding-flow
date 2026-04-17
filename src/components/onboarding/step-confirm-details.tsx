import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { SelectionCard } from "@/components/ui/selection-card";
import { TacoMessage } from "./taco-message";
import { ValidationError } from "./validation-error";
import { useT } from "@/i18n/LanguageContext";

interface StepConfirmDetailsProps {
  firstName: string;
  infix: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  onUpdateField: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

export const StepConfirmDetails = ({
  firstName,
  infix,
  lastName,
  phone,
  email,
  gender,
  onUpdateField,
  animateTaco,
  errors,
  onClearError,
}: StepConfirmDetailsProps) => {
  const t = useT();

  // Gender uses canonical English IDs; labels are translated for display.
  const GENDER_OPTIONS: { id: string; label: string }[] = [
    { id: "Man", label: t("ui.confirm_details.gender_man", undefined, "Man") },
    { id: "Woman", label: t("ui.confirm_details.gender_woman", undefined, "Woman") },
    { id: "Different", label: t("ui.confirm_details.gender_different", undefined, "Different") },
  ];

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        stepId="confirm-details"
        message="Almost there! Double check your details below ✅"
        animate={animateTaco}
      />

      <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-5">
        <h3 className="text-lg font-semibold text-foreground">
          {t("ui.confirm_details.header", undefined, "Confirm your details")}
        </h3>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <FloatingLabelInput
                label={t("finalise.confirm_details.firstName", undefined, "First name")}
                value={firstName}
                onChange={(e) => {
                  onUpdateField("firstName", e.target.value);
                  onClearError?.("firstName");
                }}
                className={errors?.firstName ? "border-destructive" : ""}
              />
              <ValidationError message={errors?.firstName} />
            </div>
            <div className="w-24">
              <FloatingLabelInput
                label={t("finalise.confirm_details.infix", undefined, "Infix")}
                value={infix}
                onChange={(e) => onUpdateField("infix", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <FloatingLabelInput
                label={t("finalise.confirm_details.lastName", undefined, "Surname")}
                value={lastName}
                onChange={(e) => {
                  onUpdateField("lastName", e.target.value);
                  onClearError?.("lastName");
                }}
                className={errors?.lastName ? "border-destructive" : ""}
              />
              <ValidationError message={errors?.lastName} />
            </div>
          </div>

          <div>
            <FloatingLabelInput
              label={t("finalise.confirm_details.phone", undefined, "Phone number")}
              value={phone}
              onChange={(e) => {
                onUpdateField("phone", e.target.value);
                onClearError?.("phone");
              }}
              className={errors?.phone ? "border-destructive" : ""}
            />
            <ValidationError message={errors?.phone} />
          </div>

          <div>
            <FloatingLabelInput
              label={t("finalise.confirm_details.email", undefined, "Email address")}
              value={email}
              onChange={(e) => {
                onUpdateField("email", e.target.value);
                onClearError?.("email");
              }}
              type="email"
              className={errors?.email ? "border-destructive" : ""}
            />
            <ValidationError message={errors?.email} />
          </div>

          {/* Gender — after email */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              {t("ui.confirm_details.gender", undefined, "Gender")}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {GENDER_OPTIONS.map((g) => (
                <SelectionCard
                  key={g.id}
                  label={g.label}
                  selected={gender === g.id}
                  indicator="radio"
                  onClick={() => {
                    onUpdateField("gender", g.id);
                    onClearError?.("gender");
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
