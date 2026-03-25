import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { HouseState } from "./types";
import { INITIAL_HOUSE, PRESET_HOUSE } from "./types";
import StepHousePreset from "./house/StepHousePreset";
import StepHouseRole from "./house/StepHouseRole";
import StepHouseDetails from "./house/StepHouseDetails";
import StepHouseCoverage from "./house/StepHouseCoverage";
import StepHouseContents from "./house/StepHouseContents";
import StepHouseBuilding from "./house/StepHouseBuilding";

type StepKey = "preset" | "details" | "role" | "coverage" | "contents" | "building";

interface HomePreferencesFlowProps {
  initialData?: string;
  onDataChange: (value: string) => void;
  onCompleteChange: (completed: boolean) => void;
}

function getStepSequence(state: HouseState, presetAnswer: "yes" | "no" | ""): StepKey[] {
  const steps: StepKey[] = ["preset"];

  if (presetAnswer === "yes") {
    steps.push("role");
    if (state.role === "tenant") {
      steps.push("contents");
    } else if (state.role === "homeowner") {
      steps.push("coverage");
      if (state.coverageChoice === "household") steps.push("contents");
      else if (state.coverageChoice === "building") steps.push("building");
      else if (state.coverageChoice === "both") steps.push("contents", "building");
    }
  } else if (presetAnswer === "no") {
    steps.push("details", "role");
    if (state.role === "tenant") {
      steps.push("contents");
    } else if (state.role === "homeowner") {
      steps.push("coverage");
      if (state.coverageChoice === "household") steps.push("contents");
      else if (state.coverageChoice === "building") steps.push("building");
      else if (state.coverageChoice === "both") steps.push("contents", "building");
    }
  }

  return steps;
}

const HomePreferencesFlow = ({ initialData, onDataChange, onCompleteChange }: HomePreferencesFlowProps) => {
  const parsed = useMemo(() => {
    if (!initialData) return null;
    try {
      return JSON.parse(initialData) as {
        house?: HouseState;
        presetAnswer?: "yes" | "no" | "";
        currentStepIdx?: number;
        completed?: boolean;
      };
    } catch {
      return null;
    }
  }, [initialData]);

  const [house, setHouse] = useState<HouseState>(parsed?.house || { ...INITIAL_HOUSE });
  const [presetAnswer, setPresetAnswer] = useState<"yes" | "no" | "">(parsed?.presetAnswer || "");
  const [currentStepIdx, setCurrentStepIdx] = useState(parsed?.currentStepIdx || 0);
  const [completed, setCompleted] = useState(!!parsed?.completed);

  const update = <K extends keyof HouseState>(key: K, val: HouseState[K]) => {
    const nextHouse = { ...house, [key]: val };
    setHouse(nextHouse);
    const payload = JSON.stringify({ house: nextHouse, presetAnswer, currentStepIdx, completed });
    onDataChange(payload);
  };

  const steps = getStepSequence(house, presetAnswer);
  const currentStep = steps[currentStepIdx] || "preset";

  const persist = (next: {
    nextHouse?: HouseState;
    nextPreset?: "yes" | "no" | "";
    nextIdx?: number;
    nextCompleted?: boolean;
  }) => {
    const payload = JSON.stringify({
      house: next.nextHouse ?? house,
      presetAnswer: next.nextPreset ?? presetAnswer,
      currentStepIdx: next.nextIdx ?? currentStepIdx,
      completed: next.nextCompleted ?? completed,
    });
    onDataChange(payload);
    if (typeof next.nextCompleted === "boolean") {
      onCompleteChange(next.nextCompleted);
    }
  };

  const goNext = () => {
    if (currentStepIdx < steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      persist({ nextIdx });
      return;
    }

    setCompleted(true);
    onCompleteChange(true);
    persist({ nextCompleted: true });
  };

  const goBack = () => {
    if (currentStepIdx > 0) {
      const nextIdx = currentStepIdx - 1;
      setCurrentStepIdx(nextIdx);
      persist({ nextIdx });
    }
  };

  const handlePresetAnswer = (answer: "yes" | "no") => {
    const nextHouse = { ...house, ...PRESET_HOUSE };
    setPresetAnswer(answer);
    setHouse(nextHouse);
    const nextSteps = getStepSequence(nextHouse, answer);
    const nextIdx = Math.min(1, nextSteps.length - 1);
    setCurrentStepIdx(nextIdx);
    onCompleteChange(false);
    persist({ nextHouse, nextPreset: answer, nextIdx, nextCompleted: false });
  };

  const handleRoleSelect = (role: "tenant" | "homeowner") => {
    const nextHouse = { ...house, role };
    setHouse(nextHouse);
    const nextSteps = getStepSequence(nextHouse, presetAnswer);
    const roleIdx = nextSteps.indexOf("role");
    const nextIdx = roleIdx >= 0 ? Math.min(roleIdx + 1, nextSteps.length - 1) : currentStepIdx;
    setCurrentStepIdx(nextIdx);
    persist({ nextHouse, nextIdx });
  };

  const handleCoverageSelect = (choice: "household" | "building" | "both") => {
    const nextHouse = { ...house, coverageChoice: choice };
    setHouse(nextHouse);
    const nextSteps = getStepSequence(nextHouse, presetAnswer);
    const coverageIdx = nextSteps.indexOf("coverage");
    const nextIdx = coverageIdx >= 0 ? Math.min(coverageIdx + 1, nextSteps.length - 1) : currentStepIdx;
    setCurrentStepIdx(nextIdx);
    persist({ nextHouse, nextIdx });
  };

  if (completed) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-semibold text-foreground">Home preferences completed.</p>
          <p className="text-sm text-muted-foreground">You can continue to phone/email details, or edit your answers below.</p>
        </div>
        <Button variant="outline" onClick={() => { setCompleted(false); onCompleteChange(false); persist({ nextCompleted: false }); }}>
          Edit Home Preferences
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {currentStep === "preset" && (
        <StepHousePreset
          presetAnswer={presetAnswer}
          onAnswer={handlePresetAnswer}
          animateTaco={false}
        />
      )}

      {currentStep === "details" && (
        <StepHouseDetails
          house={house}
          onUpdate={update}
          animateTaco={false}
        />
      )}

      {currentStep === "role" && (
        <StepHouseRole
          role={house.role}
          onSelect={handleRoleSelect}
          animateTaco={false}
        />
      )}

      {currentStep === "coverage" && (
        <StepHouseCoverage
          coverageChoice={house.coverageChoice}
          onSelect={handleCoverageSelect}
          animateTaco={false}
        />
      )}

      {currentStep === "contents" && (
        <StepHouseContents
          house={house}
          onUpdate={update}
          animateTaco={false}
        />
      )}

      {currentStep === "building" && (
        <StepHouseBuilding
          house={house}
          onUpdate={update}
          animateTaco={false}
        />
      )}

      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={goBack} disabled={currentStepIdx === 0}>
          Back
        </Button>
        <Button onClick={goNext}>
          {currentStepIdx >= steps.length - 1 ? "Done" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default HomePreferencesFlow;
