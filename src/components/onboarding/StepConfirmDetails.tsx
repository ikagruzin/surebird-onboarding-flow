import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import TacoMessage from "./TacoMessage";

interface StepConfirmDetailsProps {
  firstName: string;
  infix: string;
  lastName: string;
  phone: string;
  email: string;
  onUpdateField: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
}

const StepConfirmDetails = ({
  firstName,
  infix,
  lastName,
  phone,
  email,
  onUpdateField,
  animateTaco,
}: StepConfirmDetailsProps) => {
  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        message="Almost there! Double check your details below ✅"
        animate={animateTaco}
        variant="bubble"
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
                onChange={(e) => onUpdateField("firstName", e.target.value)}
              />
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
                onChange={(e) => onUpdateField("lastName", e.target.value)}
              />
            </div>
          </div>

          <FloatingLabelInput
            label="Phone number"
            value={phone}
            onChange={(e) => onUpdateField("phone", e.target.value)}
          />

          <FloatingLabelInput
            label="Email address"
            value={email}
            onChange={(e) => onUpdateField("email", e.target.value)}
            type="email"
          />
        </div>
      </div>
    </div>
  );
};

export default StepConfirmDetails;
