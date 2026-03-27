/**
 * Step components for the Home insurance product.
 * Each component implements ProductStepProps.
 */
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TacoMessage } from "@/components/onboarding/taco-message";
import {
  SectionCard,
  ChipSelect,
  SegmentedControl,
  ToggleRow,
  NativeSelect,
} from "./shared-ui";
import { homeProduct, HOME_OPTIONS } from "@/config/products/home";
import type { ProductStepProps } from "@/config/products/types";

/* ─── Step: Preset Verification ─── */

export const HomePresetStep = ({
  state,
  onAutoAdvance,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="To save you time, I've pre-filled the standard details for a Dutch home. Can you confirm this?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Is this information correct?">
      <ul className="space-y-3 mb-5">
        {homeProduct.presetChecklist!.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() =>
            onAutoAdvance(
              { presetAnswer: "yes", ...homeProduct.presetState },
              "preset-verification",
            )
          }
          className={state.presetAnswer === "yes" ? "border-primary bg-primary/10" : ""}
        >
          Yes
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            onAutoAdvance({ presetAnswer: "no" }, "preset-verification")
          }
          className={state.presetAnswer === "no" ? "border-primary bg-primary/10" : ""}
        >
          No
        </Button>
      </div>
    </SectionCard>
  </div>
);

/* ─── Step: Role Selection ─── */

export const HomeRoleStep = ({
  state,
  onAutoAdvance,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Great. Are you tenant or homeowner of this house?"
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />
    <Card>
      <CardContent className="pt-6">
        <SegmentedControl
          options={["Tenant", "Homeowner"]}
          value={
            state.role === "tenant"
              ? "Tenant"
              : state.role === "homeowner"
                ? "Homeowner"
                : ""
          }
          onChange={(v) =>
            onAutoAdvance(
              { role: v.toLowerCase() as "tenant" | "homeowner" },
              "role",
            )
          }
        />
      </CardContent>
    </Card>
  </div>
);

/* ─── Step: Home Details ─── */

export const HomeDetailsStep = ({
  state,
  onUpdate,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="No problem! You can manually adjust the details of your home below to make sure everything is 100% accurate."
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Home Details">
      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Building Type
          </label>
          <NativeSelect
            value={state.buildingType}
            onChange={(e) => onUpdate("buildingType", e.target.value)}
            placeholder="Select building type"
          >
            {HOME_OPTIONS.buildingTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Usage
          </label>
          <ChipSelect
            options={[...HOME_OPTIONS.usageOptions]}
            selected={state.usage}
            onChange={(v) => onUpdate("usage", v)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Construction Materials
          </label>
          <SegmentedControl
            options={[...HOME_OPTIONS.constructionMaterials]}
            value={state.constructionMaterial}
            onChange={(v) => onUpdate("constructionMaterial", v)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Floor Material
          </label>
          <SegmentedControl
            options={[...HOME_OPTIONS.floorMaterials]}
            value={state.floorMaterial}
            onChange={(v) => onUpdate("floorMaterial", v)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Roof Shape
          </label>
          <SegmentedControl
            options={[...HOME_OPTIONS.roofShapes]}
            value={state.roofShape}
            onChange={(v) => onUpdate("roofShape", v)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Roof Material
          </label>
          <NativeSelect
            value={state.roofMaterial}
            onChange={(e) => onUpdate("roofMaterial", e.target.value)}
            placeholder="Select roof material"
          >
            {HOME_OPTIONS.roofMaterials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>
    </SectionCard>
  </div>
);

/* ─── Step: Coverage Path ─── */

export const HomeCoveragePathStep = ({
  state,
  onAutoAdvance,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => (
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
            state.coverageChoice === "household"
              ? "Household Goods"
              : state.coverageChoice === "building"
                ? "Building"
                : state.coverageChoice === "both"
                  ? "Both"
                  : ""
          }
          onChange={(v) => {
            const map: Record<string, string> = {
              "Household Goods": "household",
              Building: "building",
              Both: "both",
            };
            onAutoAdvance({ coverageChoice: map[v] }, "coverage-path");
          }}
        />
      </CardContent>
    </Card>
  </div>
);

/* ─── Step: Contents Insurance ─── */

export const HomeContentsStep = ({
  state,
  onUpdate,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Let's look at your belongings. This covers everything that would fall out if you turned your house upside down—like your furniture, electronics, and jewelry."
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Contents Insurance">
      <div className="space-y-5">
        <ToggleRow
          label="High-value Audiovisual"
          sublabel=">€12k"
          checked={state.highValueAV}
          onChange={(v) => onUpdate("highValueAV", v)}
          showAmount
          amount={state.highValueAVAmount}
          onAmountChange={(v) => onUpdate("highValueAVAmount", v)}
        />
        <ToggleRow
          label="Jewelry"
          sublabel=">€6k"
          checked={state.jewelry}
          onChange={(v) => onUpdate("jewelry", v)}
          showAmount
          amount={state.jewelryAmount}
          onAmountChange={(v) => onUpdate("jewelryAmount", v)}
        />
        <ToggleRow
          label="Special assets"
          sublabel=">€15k"
          checked={state.specialAssets}
          onChange={(v) => onUpdate("specialAssets", v)}
          showAmount
          amount={state.specialAssetsAmount}
          onAmountChange={(v) => onUpdate("specialAssetsAmount", v)}
        />
        <ToggleRow
          label="Owner interest"
          sublabel=">€6k"
          checked={state.ownerInterest}
          onChange={(v) => onUpdate("ownerInterest", v)}
          showAmount
          amount={state.ownerInterestAmount}
          onAmountChange={(v) => onUpdate("ownerInterestAmount", v)}
        />
        <div className="border-t border-border pt-5">
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Security
          </label>
          <SegmentedControl
            options={[...HOME_OPTIONS.securityOptions]}
            value={state.security}
            onChange={(v) => onUpdate("security", v)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Net Income
          </label>
          <SegmentedControl
            options={[...HOME_OPTIONS.netIncomeOptions]}
            value={state.netIncome}
            onChange={(v) => onUpdate("netIncome", v)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Outside Value
          </label>
          <NativeSelect
            value={state.outsideValue}
            onChange={(e) => onUpdate("outsideValue", e.target.value)}
            placeholder="Select outside value"
          >
            {HOME_OPTIONS.outsideValueOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>
    </SectionCard>
  </div>
);

/* ─── Step: Building Insurance ─── */

export const HomeBuildingStep = ({
  state,
  onUpdate,
  animateTaco,
  onAnimationComplete,
}: ProductStepProps) => (
  <div className="animate-fade-in space-y-6">
    <TacoMessage
      message="Now for the structure itself. This protects the physical building, including the walls, roof, and even your fitted kitchen or bathroom pipes."
      animate={animateTaco}
      onAnimationComplete={onAnimationComplete}
    />

    <SectionCard title="Building Insurance">
      <div className="space-y-5">
        <ToggleRow
          label="Monumental status"
          checked={state.monumental}
          onChange={(v) => onUpdate("monumental", v)}
        />
        <ToggleRow
          label="Outbuilding"
          checked={state.quoted}
          onChange={(v) => onUpdate("quoted", v)}
        />
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">
            Floor count
          </label>
          <SegmentedControl
            options={["1", "2", "2+"]}
            value={state.floorCount}
            onChange={(v) => onUpdate("floorCount", v)}
          />
        </div>
        <div className="border-t border-border pt-5 space-y-5">
          <ToggleRow
            label="Renovation"
            checked={state.rainwater}
            onChange={(v) => onUpdate("rainwater", v)}
          />
          <ToggleRow
            label="Solar Panels"
            checked={state.smartSensors}
            onChange={(v) => onUpdate("smartSensors", v)}
          />
          <ToggleRow
            label="Heat pump"
            checked={state.heatPump}
            onChange={(v) => onUpdate("heatPump", v)}
          />
        </div>
      </div>
    </SectionCard>
  </div>
);

/* ─── Component map (used by the renderer / pages) ─── */

export const HOME_STEP_COMPONENTS: Record<
  string,
  React.ComponentType<ProductStepProps>
> = {
  "preset-verification": HomePresetStep,
  role: HomeRoleStep,
  "home-details": HomeDetailsStep,
  "coverage-path": HomeCoveragePathStep,
  contents: HomeContentsStep,
  building: HomeBuildingStep,
};
