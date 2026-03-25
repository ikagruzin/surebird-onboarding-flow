import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import TacoMessage from "@/components/onboarding/TacoMessage";
import { SectionCard } from "./HouseComponents";

interface StepHousePresetProps {
  presetAnswer: "yes" | "no" | "";
  onAnswer: (answer: "yes" | "no") => void;
  animateTaco: boolean;
  onAnimationComplete?: () => void;
}

const StepHousePreset: React.FC<StepHousePresetProps> = ({
  presetAnswer, onAnswer, animateTaco, onAnimationComplete,
}) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="To save you time, I've pre-filled the standard details for a Dutch home. Can you confirm this?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Is this information correct?">
      <ul className="space-y-3 mb-5">
        {[
          "Stone exterior walls",
          "A sloping roof with tiles, pan, or shingles",
          "Concrete or stone floors throughout",
          "Used only for private residential living",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => onAnswer("yes")}
            className={presetAnswer === "yes" ? "border-primary bg-primary/10" : ""}
          >
            Yes
          </Button>
          <Button
            variant="outline"
            onClick={() => onAnswer("no")}
            className={presetAnswer === "no" ? "border-primary bg-primary/10" : ""}
          >
            No
          </Button>
        </div>
      </div>
    </SectionCard>
  </div>
);

export default StepHousePreset;
