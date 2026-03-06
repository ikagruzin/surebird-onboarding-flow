import { Input } from "@/components/ui/input";

interface StepNameProps {
  firstName: string;
  lastName: string;
  onUpdate: (field: "firstName" | "lastName", value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepName = ({ firstName, lastName, onUpdate, onNext, onBack }: StepNameProps) => {
  const canProceed = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <div className="animate-fade-in">
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">
          Welcome to Surebird! Let's start with your name.
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            value={firstName}
            onChange={(e) => onUpdate("firstName", e.target.value)}
            placeholder="Name"
            className="h-12 rounded-lg"
            maxLength={100}
          />
          <Input
            value={lastName}
            onChange={(e) => onUpdate("lastName", e.target.value)}
            placeholder="Surname"
            className="h-12 rounded-lg"
            maxLength={100}
          />
        </div>
      </div>
    </div>
  );
};

export default StepName;
