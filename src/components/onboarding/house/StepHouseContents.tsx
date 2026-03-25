import React from "react";
import { NativeSelect } from "@/components/ui/native-select";
import TacoMessage from "@/components/onboarding/TacoMessage";
import type { HouseState } from "@/components/onboarding/types";
import {
  SectionCard, SegmentedControl, ToggleRow,
} from "./HouseComponents";
import { SECURITY_OPTIONS, NET_INCOME_OPTIONS, OUTSIDE_VALUE_OPTIONS } from "@/components/onboarding/types";

interface StepHouseContentsProps {
  house: HouseState;
  onUpdate: <K extends keyof HouseState>(key: K, val: HouseState[K]) => void;
  showCoverageLevel?: boolean;
  animateTaco: boolean;
  onAnimationComplete?: () => void;
}

const StepHouseContents: React.FC<StepHouseContentsProps> = ({
  house, onUpdate, showCoverageLevel, animateTaco, onAnimationComplete,
}) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Let's look at your belongings. This covers everything that would fall out if you turned your house upside down—like your furniture, electronics, and jewelry."
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Contents Insurance">
      <div className="space-y-5">
        <ToggleRow label="High-value Audiovisual" sublabel=">€12k" checked={house.highValueAV} onChange={(v) => onUpdate("highValueAV", v)} showAmount amount={house.highValueAVAmount} onAmountChange={(v) => onUpdate("highValueAVAmount", v)} />
        <ToggleRow label="Jewelry" sublabel=">€6k" checked={house.jewelry} onChange={(v) => onUpdate("jewelry", v)} showAmount amount={house.jewelryAmount} onAmountChange={(v) => onUpdate("jewelryAmount", v)} />
        <ToggleRow label="Special assets" sublabel=">€15k" checked={house.specialAssets} onChange={(v) => onUpdate("specialAssets", v)} showAmount amount={house.specialAssetsAmount} onAmountChange={(v) => onUpdate("specialAssetsAmount", v)} />
        <ToggleRow label="Owner interest" sublabel=">€6k" checked={house.ownerInterest} onChange={(v) => onUpdate("ownerInterest", v)} showAmount amount={house.ownerInterestAmount} onAmountChange={(v) => onUpdate("ownerInterestAmount", v)} />
        <div className="border-t border-border pt-5">
          <label className="text-sm font-semibold text-foreground mb-2 block">Security</label>
          <SegmentedControl options={SECURITY_OPTIONS} value={house.security} onChange={(v) => onUpdate("security", v)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Net Income</label>
          <SegmentedControl options={NET_INCOME_OPTIONS} value={house.netIncome} onChange={(v) => onUpdate("netIncome", v)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Outside Value</label>
          <NativeSelect value={house.outsideValue} onChange={(e) => onUpdate("outsideValue", e.target.value)} placeholder="Select outside value">
            {OUTSIDE_VALUE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </NativeSelect>
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

export default StepHouseContents;
