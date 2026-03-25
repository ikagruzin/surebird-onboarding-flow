import React from "react";
import TacoMessage from "@/components/onboarding/TacoMessage";
import { NativeSelect } from "@/components/ui/native-select";
import type { HouseState } from "@/components/onboarding/types";
import {
  SectionCard, ChipSelect, SegmentedControl,
} from "./HouseComponents";
import {
  BUILDING_TYPES, USAGE_OPTIONS, CONSTRUCTION_MATERIALS,
  FLOOR_MATERIALS, ROOF_SHAPES, ROOF_MATERIALS, OWN_RISK_OPTIONS,
} from "@/components/onboarding/types";

interface StepHouseDetailsProps {
  house: HouseState;
  onUpdate: <K extends keyof HouseState>(key: K, val: HouseState[K]) => void;
  showOwnRisk?: boolean;
  animateTaco: boolean;
  onAnimationComplete?: () => void;
}

const StepHouseDetails: React.FC<StepHouseDetailsProps> = ({
  house, onUpdate, showOwnRisk, animateTaco, onAnimationComplete,
}) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="No problem! You can manually adjust the details of your home below to make sure everything is 100% accurate."
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Home Details">
      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Building Type</label>
          <NativeSelect value={house.buildingType} onChange={(e) => onUpdate("buildingType", e.target.value)} placeholder="Select building type">
            {BUILDING_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </NativeSelect>
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Usage</label>
          <ChipSelect options={USAGE_OPTIONS} selected={house.usage} onChange={(v) => onUpdate("usage", v)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Construction Materials</label>
          <SegmentedControl options={CONSTRUCTION_MATERIALS} value={house.constructionMaterial} onChange={(v) => onUpdate("constructionMaterial", v)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Floor Material</label>
          <SegmentedControl options={FLOOR_MATERIALS} value={house.floorMaterial} onChange={(v) => onUpdate("floorMaterial", v)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Roof Shape</label>
          <SegmentedControl options={ROOF_SHAPES} value={house.roofShape} onChange={(v) => onUpdate("roofShape", v)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Roof Material</label>
          <NativeSelect value={house.roofMaterial} onChange={(e) => onUpdate("roofMaterial", e.target.value)} placeholder="Select roof material">
            {ROOF_MATERIALS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </NativeSelect>
        </div>
        {showOwnRisk && (
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Own Risk</label>
            <SegmentedControl options={OWN_RISK_OPTIONS} value={house.ownRisk} onChange={(v) => onUpdate("ownRisk", v)} />
          </div>
        )}
      </div>
    </SectionCard>
  </div>
);

export default StepHouseDetails;
