import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { TacoMessage } from "./taco-message";
import { ValidationError } from "./validation-error";

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

const GENDER_OPTIONS = ["Man", "Woman", "Different"];

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
  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        message="Almost there! Double check your details below ✅"
        animate={animateTaco}
      />

      {/* Personal details card */}
      <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-5">
        <h3 className="text-lg font-semibold text-foreground">Confirm your details</h3>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <FloatingLabelInput
                label="First name"
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
                label="Infix"
                value={infix}
                onChange={(e) => onUpdateField("infix", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <FloatingLabelInput
                label="Surname"
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
              label="Phone number"
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
              label="Email address"
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
        </div>
      </div>
    </div>
  );
};

