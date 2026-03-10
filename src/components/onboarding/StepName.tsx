import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import tacoAvatar from "@/assets/taco-avatar.jpg";

interface StepNameProps {
  firstName: string;
  lastName: string;
  onUpdate: (field: "firstName" | "lastName", value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepName = ({ firstName, lastName, onUpdate, onNext, onBack }: StepNameProps) => {
  return (
    <div className="animate-fade-in">
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-start gap-3 mb-12">
          <img
            src={tacoAvatar}
            alt="Tako"
            className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
          />
          <p className="text-base text-foreground">
            <span className="font-semibold">Welcome to Surebird</span>✌️
            <br />
            I'm Tako - your personal assistance. I'm here to help you to find the best insurance deal based on your needs.
            <br />
            How should I address you?
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FloatingLabelInput
            label="First name"
            value={firstName}
            onChange={(e) => onUpdate("firstName", e.target.value)}
            maxLength={100}
          />
          <FloatingLabelInput
            label="Last name"
            value={lastName}
            onChange={(e) => onUpdate("lastName", e.target.value)}
            maxLength={100}
          />
        </div>
      </div>
    </div>
  );
};

export default StepName;
