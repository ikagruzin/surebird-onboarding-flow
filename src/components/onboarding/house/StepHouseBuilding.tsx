import React from "react";
import TacoMessage from "@/components/onboarding/TacoMessage";
import type { HouseState } from "@/components/onboarding/types";
import { SectionCard, SegmentedControl, ToggleRow } from "./HouseComponents";

interface StepHouseBuildingProps {
  house: HouseState;
  onUpdate: <K extends keyof HouseState>(key: K, val: HouseState[K]) => void;
  showCoverageLevel?: boolean;
  animateTaco: boolean;
  onAnimationComplete?: () => void;
}

const StepHouseBuilding: React.FC<StepHouseBuildingProps> = ({
  house, onUpdate, showCoverageLevel, animateTaco, onAnimationComplete,
}) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Now for the structure itself. This protects the physical building, including the walls, roof, and even your fitted kitchen or bathroom pipes."
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Building Insurance">
      <div className="space-y-5">
        <ToggleRow label="Monumental status" checked={house.monumental} onChange={(v) => onUpdate("monumental", v)} />
        <ToggleRow label="Outbuilding" checked={house.quoted} onChange={(v) => onUpdate("quoted", v)} />
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Floor count</label>
          <SegmentedControl options={["1", "2", "2+"]} value={house.floorCount} onChange={(v) => onUpdate("floorCount", v)} />
        </div>
        <div className="border-t border-border pt-5 space-y-5">
          <ToggleRow label="Renovation" checked={house.rainwater} onChange={(v) => onUpdate("rainwater", v)} />
          <ToggleRow label="Solar Panels" checked={house.smartSensors} onChange={(v) => onUpdate("smartSensors", v)} />
          <ToggleRow label="Heat pump" checked={house.heatPump} onChange={(v) => onUpdate("heatPump", v)} />
        </div>
        {showCoverageLevel && (
          <div className="border-t border-border pt-5">
            <label className="text-sm font-semibold text-foreground mb-2 block">Coverage Level</label>
            <SegmentedControl options={["Extra Extensive", "All Risk"]} value={house.basicCoverage} onChange={(v) => onUpdate("basicCoverage", v)} />
          </div>
        )}
      </div>
    </SectionCard>
  </div>
);

export default StepHouseBuilding;
