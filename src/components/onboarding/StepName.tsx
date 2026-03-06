import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

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
    <div className="animate-fade-in max-w-md">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Welcome to Surebird! Let's start with your name.
      </h1>
      <p className="text-muted-foreground mb-8">
        We'll use this to personalise your experience.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            First name
          </label>
          <Input
            value={firstName}
            onChange={(e) => onUpdate("firstName", e.target.value)}
            placeholder="Enter your first name"
            className="h-11"
            maxLength={100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Last name
          </label>
          <Input
            value={lastName}
            onChange={(e) => onUpdate("lastName", e.target.value)}
            placeholder="Enter your last name"
            className="h-11"
            maxLength={100}
          />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default StepName;
