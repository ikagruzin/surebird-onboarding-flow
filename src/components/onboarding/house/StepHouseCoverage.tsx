import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import TacoMessage from "@/components/onboarding/TacoMessage";
import { SegmentedControl } from "./HouseComponents";

interface StepHouseCoverageProps {
  coverageChoice: "household" | "building" | "both" | "";
  onSelect: (choice: "household" | "building" | "both") => void;
  animateTaco: boolean;
  onAnimationComplete?: () => void;
}

const StepHouseCoverage: React.FC<StepHouseCoverageProps> = ({
  coverageChoice, onSelect, animateTaco, onAnimationComplete,
}) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Great. Now, what would you like to protect today? You can insure your belongings, the building itself, or both for full peace of mind."
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <Card>
      <CardContent className="pt-6">
        <SegmentedControl
          options={["Household Goods", "Building", "Both"]}
          value={
            coverageChoice === "household" ? "Household Goods"
            : coverageChoice === "building" ? "Building"
            : coverageChoice === "both" ? "Both"
            : ""
          }
          onChange={(v) => {
            const map: Record<string, "household" | "building" | "both"> = {
              "Household Goods": "household",
              "Building": "building",
              "Both": "both",
            };
            onSelect(map[v]);
          }}
        />
      </CardContent>
    </Card>
  </div>
);

export default StepHouseCoverage;
