import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import TacoMessage from "@/components/onboarding/TacoMessage";
import { SegmentedControl } from "./HouseComponents";

interface StepHouseRoleProps {
  role: "tenant" | "homeowner" | "";
  onSelect: (role: "tenant" | "homeowner") => void;
  animateTaco: boolean;
  onAnimationComplete?: () => void;
}

const StepHouseRole: React.FC<StepHouseRoleProps> = ({
  role, onSelect, animateTaco, onAnimationComplete,
}) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Great. Now, what would you like to protect today?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <Card>
      <CardContent className="pt-6">
        <SegmentedControl
          options={["Tenant", "Homeowner"]}
          value={role === "tenant" ? "Tenant" : role === "homeowner" ? "Homeowner" : ""}
          onChange={(v) => onSelect(v.toLowerCase() as "tenant" | "homeowner")}
        />
      </CardContent>
    </Card>
  </div>
);

export default StepHouseRole;
