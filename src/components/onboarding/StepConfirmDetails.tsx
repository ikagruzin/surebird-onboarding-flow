import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import tacoAvatar from "@/assets/taco-avatar.jpg";

interface StepConfirmDetailsProps {
  firstName: string;
  infix: string;
  lastName: string;
  phone: string;
  email: string;
  onUpdateField: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepConfirmDetails = ({
  firstName,
  infix,
  lastName,
  phone,
  email,
  onUpdateField,
}: StepConfirmDetailsProps) => {
  return (
    <div className="animate-fade-in space-y-8 pb-8">
      {/* Taco message */}
      <div className="flex items-center gap-3">
        <img src={tacoAvatar} alt="Taco" className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="bg-muted rounded-2xl rounded-tl-md px-5 py-3">
          <p className="text-base text-foreground">
            Almost there! Double check your details below ✅
          </p>
        </div>
      </div>

      {/* Personal details card */}
      <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-5">
        <h3 className="text-lg font-semibold text-foreground">Confirm your details</h3>

        <div className="space-y-4">
          {/* Name row: First name + Infix + Surname */}
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

          {/* Phone */}
          <FloatingLabelInput
            label="Phone number"
            value={phone}
            onChange={(e) => onUpdateField("phone", e.target.value)}
          />

          {/* Email */}
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
