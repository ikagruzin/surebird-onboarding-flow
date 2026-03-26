import { Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WizardState } from "./types";
import type { FlowConfig } from "@/config/flow-types";

const DUMMY_DATA: Partial<WizardState> = {
  selectedInsurances: ["liability"],
  firstName: "Jan",
  infix: "van",
  lastName: "Testerman",
  postcode: "1012AB",
  houseNumber: "42",
  addition: "",
  birthdate: "15-03-1990",
  familyStatus: "single",
  email: "jan@test.nl",
  phone: "+31612345678",
  preferences: {
    liability: { coverage: "2500000", deductible: "0" },
  },
};

interface DevSkipButtonProps {
  flow: FlowConfig;
  onSkip: (state: Partial<WizardState>, stepIndex: number) => void;
}

export const DevSkipButton = ({ flow, onSkip }: DevSkipButtonProps) => {
  // Find the step right before "loading"
  const loadingIndex = flow.steps.findIndex((s) => s.id === "loading");
  if (loadingIndex <= 0) return null;
  const targetIndex = loadingIndex - 1;
  const targetStep = flow.steps[targetIndex];

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onSkip(DUMMY_DATA, targetIndex)}
      className="fixed bottom-4 left-4 z-[9999] gap-1.5 rounded-lg bg-destructive/10 border-destructive/30 text-destructive text-xs opacity-70 hover:opacity-100 transition-opacity"
      title={`Skip to "${targetStep.id}" (dev only)`}
    >
      <Bug className="!size-3.5" />
      Skip to {targetStep.id}
    </Button>
  );
};

