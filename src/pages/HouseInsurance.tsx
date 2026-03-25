import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, RotateCcw, Home, Check } from "lucide-react";
import StickyFooter from "@/components/onboarding/StickyFooter";
import FlowSwitcher from "@/components/onboarding/FlowSwitcher";
import TacoMessage from "@/components/onboarding/TacoMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectionCard } from "@/components/ui/selection-card";
import { NativeSelect } from "@/components/ui/native-select";
import { getSelectionGridClass } from "@/lib/grid-layout";
import iconHome from "@/assets/icon-home.svg";

/* ─── Types ─── */
interface HouseState {
  role: "tenant" | "homeowner" | "";
  buildingType: string;
  usage: string[];
  constructionMaterial: string;
  floorMaterial: string;
  roofShape: string;
  roofMaterial: string;
  ownRisk: string;
  coverageChoice: "household" | "building" | "both" | "";
  highValueAV: boolean;
  highValueAVAmount: string;
  jewelry: boolean;
  jewelryAmount: string;
  specialAssets: boolean;
  specialAssetsAmount: string;
  ownerInterest: boolean;
  ownerInterestAmount: string;
  security: string;
  netIncome: string;
  outsideValue: string;
  monumental: boolean;
  quoted: boolean;
  floorCount: string;
  rainwater: boolean;
  smartSensors: boolean;
  heatPump: boolean;
  basicCoverage: string;
}

const INITIAL_HOUSE: HouseState = {
  role: "",
  buildingType: "",
  usage: [],
  constructionMaterial: "",
  floorMaterial: "",
  roofShape: "",
  roofMaterial: "",
  ownRisk: "",
  coverageChoice: "",
  highValueAV: false,
  highValueAVAmount: "",
  jewelry: false,
  jewelryAmount: "",
  specialAssets: false,
  specialAssetsAmount: "",
  ownerInterest: false,
  ownerInterestAmount: "",
  security: "",
  netIncome: "",
  outsideValue: "",
  monumental: false,
  quoted: false,
  floorCount: "",
  rainwater: false,
  smartSensors: false,
  heatPump: false,
  basicCoverage: "",
};

const PRESET_HOUSE: Partial<HouseState> = {
  buildingType: "Townhouse",
  usage: ["I live there"],
  constructionMaterial: "(Largely) stone",
  floorMaterial: "Stone/concrete",
  roofShape: "Sloping",
  roofMaterial: "Pan roof",
};

const BUILDING_TYPES = [
  "Detached house", "Apartment", "Canal house", "Corner house",
  "Two-under-a-roof", "Townhouse", "Farmhouse",
];
const USAGE_OPTIONS = [
  "I live there", "Holiday home", "I rent it out",
  "Rental company for rooms", "Different",
];
const CONSTRUCTION_MATERIALS = [
  "Wooden skeleton", "(Largely) stone", "Wooden frame with stone wall",
];
const FLOOR_MATERIALS = ["No floors", "Wood", "Stone/concrete"];
const ROOF_SHAPES = ["Flat", "Sloping", "Special"];
const ROOF_MATERIALS = [
  "Wood", "Artificial reeds", "Asphalt/bitumen",
  "Pan roof", "(Largely) reed", "Shingles",
];
const OWN_RISK_OPTIONS = ["€100", "€250", "€500", "No deductible"];
const SECURITY_OPTIONS = ["None", "BORG", "Police mark", "Both"];
const NET_INCOME_OPTIONS = [
  "< €25,000", "€25,000 – €50,000", "€50,000 – €75,000",
  "€75,000 – €100,000", "> €100,000",
];
const OUTSIDE_VALUE_OPTIONS = ["€0", "€2,500", "€5,000", "€7,500", "€10,000"];

/* ─── Reusable UI Pieces ─── */

const SectionCard = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <Card>
    {title && (
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
    )}
    <CardContent className={title ? "" : "pt-6"}>
      {children}
    </CardContent>
  </Card>
);

const ChipSelect = ({
  options, selected, onChange,
}: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) => (
  <div className={getSelectionGridClass(options)}>
    {options.map((opt) => {
      const isActive = selected.includes(opt);
      return (
        <SelectionCard
          key={opt}
          label={opt}
          selected={isActive}
          onClick={() => onChange(isActive ? [] : [opt])}
          indicator="radio"
        />
      );
    })}
  </div>
);

const SegmentedControl = ({
  options, value, onChange,
}: {
  options: string[]; value: string; onChange: (v: string) => void;
}) => (
  <div className={getSelectionGridClass(options)}>
    {options.map((opt) => (
      <SelectionCard
        key={opt}
        label={opt}
        selected={value === opt}
        onClick={() => onChange(opt)}
        indicator="radio"
      />
    ))}
  </div>
);

const ToggleRow = ({
  label, sublabel, checked, onChange, showAmount, amount, onAmountChange,
}: {
  label: string; sublabel?: string; checked: boolean; onChange: (v: boolean) => void;
  showAmount?: boolean; amount?: string; onAmountChange?: (v: string) => void;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between gap-4">
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {sublabel && <span className="text-xs text-muted-foreground ml-1">({sublabel})</span>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-input"
        }`}
      >
        <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`} />
      </button>
    </div>
    {showAmount && checked && (
      <input
        type="text"
        placeholder="Enter amount (€)"
        value={amount || ""}
        onChange={(e) => onAmountChange?.(e.target.value)}
        className="w-full rounded-2xl border-2 border-input bg-background h-14 px-4 text-sm text-foreground focus:outline-none focus:border-primary"
      />
    )}
  </div>
);

/* ─── Steps ─── */
type StepKey =
  | "product-selection"
  | "preset-verification"
  | "role"
  | "home-details"
  | "coverage-path"
  | "contents"
  | "building";

function getStepSequence(
  state: HouseState,
  version: "a" | "b",
  presetAnswer: "yes" | "no" | "",
): StepKey[] {
  const steps: StepKey[] = ["product-selection"];

  if (version === "a") {
    steps.push("preset-verification");

    if (presetAnswer === "yes") {
      steps.push("role");
      if (state.role === "tenant") {
        steps.push("contents");
      } else if (state.role === "homeowner") {
        steps.push("coverage-path");
        if (state.coverageChoice === "household") steps.push("contents");
        else if (state.coverageChoice === "building") steps.push("building");
        else if (state.coverageChoice === "both") steps.push("contents", "building");
      }
    } else if (presetAnswer === "no") {
      steps.push("home-details");
      steps.push("role");
      if (state.role === "tenant") {
        steps.push("contents");
      } else if (state.role === "homeowner") {
        steps.push("coverage-path");
        if (state.coverageChoice === "household") steps.push("contents");
        else if (state.coverageChoice === "building") steps.push("building");
        else if (state.coverageChoice === "both") steps.push("contents", "building");
      }
    }
  } else {
    steps.push("role");
    if (state.role === "tenant") {
      steps.push("home-details", "contents");
    } else if (state.role === "homeowner") {
      steps.push("coverage-path", "home-details");
      if (state.coverageChoice === "household") steps.push("contents");
      else if (state.coverageChoice === "building") steps.push("building");
      else if (state.coverageChoice === "both") steps.push("contents", "building");
    }
  }

  return steps;
}

/* ─── Page ─── */
const HouseInsurance = () => {
  const navigate = useNavigate();
  const [house, setHouse] = useState<HouseState>({ ...INITIAL_HOUSE });
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [testVersion, setTestVersion] = useState<"a" | "b">("a");
  const [presetAnswer, setPresetAnswer] = useState<"yes" | "no" | "">("");
  const [animatedSteps, setAnimatedSteps] = useState<Set<string>>(new Set());

  const update = useCallback(<K extends keyof HouseState>(key: K, val: HouseState[K]) => {
    setHouse((s) => ({ ...s, [key]: val }));
  }, []);

  const steps = getStepSequence(house, testVersion, presetAnswer);
  const currentStep = steps[currentStepIdx] || "product-selection";

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case "product-selection":
        return true;
      case "preset-verification":
        return presetAnswer !== "";
      case "role":
        return house.role !== "";
      case "home-details":
        return !!(
          house.buildingType && house.usage.length > 0 &&
          house.constructionMaterial && house.floorMaterial &&
          house.roofShape && house.roofMaterial
        );
      case "coverage-path":
        return house.coverageChoice !== "";
      case "contents":
        if (testVersion === "a") return !!(house.security && house.netIncome && house.outsideValue);
        return !!(house.security && house.netIncome && house.outsideValue && house.basicCoverage);
      case "building":
        if (testVersion === "a") return !!house.floorCount;
        return !!(house.floorCount && house.basicCoverage);
      default:
        return false;
    }
  };

  const isLastStep = currentStepIdx === steps.length - 1 && steps.length > 1;

  const goToNextStep = useCallback(() => {
    const nextIdx = currentStepIdx + 1;
    const currentSteps = getStepSequence(house, testVersion, presetAnswer);
    if (nextIdx < currentSteps.length) {
      setCurrentStepIdx(nextIdx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStepIdx, house, testVersion, presetAnswer]);

  const handleNext = () => {
    if (isLastStep) {
      navigate("/test-flows/house");
      handleReset();
      return;
    }
    goToNextStep();
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setHouse({ ...INITIAL_HOUSE });
    setCurrentStepIdx(0);
    setPresetAnswer("");
    setAnimatedSteps(new Set());
  };

  const handleVersionSwitch = (v: "a" | "b") => {
    setTestVersion(v);
    setHouse({ ...INITIAL_HOUSE });
    setCurrentStepIdx(1);
    setPresetAnswer("");
    setAnimatedSteps(new Set());
  };

  const handlePresetAnswer = (answer: "yes" | "no") => {
    setPresetAnswer(answer);
    setHouse((s) => ({ ...s, ...PRESET_HOUSE }));
    setTimeout(() => {
      const nextIdx = currentStepIdx + 1;
      const nextSteps = getStepSequence(
        answer === "yes" ? { ...house, ...PRESET_HOUSE } : house,
        testVersion,
        answer,
      );
      if (nextIdx < nextSteps.length) {
        setCurrentStepIdx(nextIdx);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 400);
  };

  // Auto-advance for role selection
  const handleRoleSelect = (role: "tenant" | "homeowner") => {
    update("role", role);
    setTimeout(() => {
      // Recalculate steps with the new role
      const updatedHouse = { ...house, role };
      const nextSteps = getStepSequence(updatedHouse, testVersion, presetAnswer);
      const roleIdx = nextSteps.indexOf("role");
      if (roleIdx >= 0 && roleIdx + 1 < nextSteps.length) {
        setCurrentStepIdx(roleIdx + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 400);
  };

  // Auto-advance for coverage selection
  const handleCoverageSelect = (choice: "household" | "building" | "both") => {
    update("coverageChoice", choice);
    setTimeout(() => {
      const updatedHouse = { ...house, coverageChoice: choice };
      const nextSteps = getStepSequence(updatedHouse, testVersion, presetAnswer);
      const coverageIdx = nextSteps.indexOf("coverage-path");
      if (coverageIdx >= 0 && coverageIdx + 1 < nextSteps.length) {
        setCurrentStepIdx(coverageIdx + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 400);
  };

  // Track animation per step
  const shouldAnimateTaco = !animatedSteps.has(currentStep);
  const markAnimated = useCallback(() => {
    setAnimatedSteps((prev) => new Set(prev).add(currentStep));
  }, [currentStep]);

  const totalSavings = 45;

  /* ─── Step Renders ─── */

  const renderPresetVerification = () => (
    <div className="animate-fade-in space-y-6">
      <TacoMessage
        message="To save you time, I've pre-filled the standard details for a Dutch home. Can you confirm this?"
        animate={shouldAnimateTaco}
        onAnimationComplete={markAnimated}
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
              onClick={() => handlePresetAnswer("yes")}
              className={presetAnswer === "yes" ? "border-primary bg-primary/10" : ""}
            >
              Yes
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePresetAnswer("no")}
              className={presetAnswer === "no" ? "border-primary bg-primary/10" : ""}
            >
              No
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );

  const renderRoleSelection = () => (
    <div className="animate-fade-in space-y-6">
      <TacoMessage
        message="Great. Now, what would you like to protect today?"
        animate={shouldAnimateTaco}
        onAnimationComplete={markAnimated}
      />

      <Card>
        <CardContent className="pt-6">
          <SegmentedControl
            options={["Tenant", "Homeowner"]}
            value={house.role === "tenant" ? "Tenant" : house.role === "homeowner" ? "Homeowner" : ""}
            onChange={(v) => handleRoleSelect(v.toLowerCase() as "tenant" | "homeowner")}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderHomeDetails = () => (
    <div className="animate-fade-in space-y-6">
      <TacoMessage
        message="No problem! You can manually adjust the details of your home below to make sure everything is 100% accurate."
        animate={shouldAnimateTaco}
        onAnimationComplete={markAnimated}
      />

      <SectionCard title="Home Details">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Building Type</label>
            <NativeSelect value={house.buildingType} onChange={(e) => update("buildingType", e.target.value)} placeholder="Select building type">
              {BUILDING_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </NativeSelect>
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Usage</label>
            <ChipSelect options={USAGE_OPTIONS} selected={house.usage} onChange={(v) => update("usage", v)} />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Construction Materials</label>
            <SegmentedControl options={CONSTRUCTION_MATERIALS} value={house.constructionMaterial} onChange={(v) => update("constructionMaterial", v)} />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Floor Material</label>
            <SegmentedControl options={FLOOR_MATERIALS} value={house.floorMaterial} onChange={(v) => update("floorMaterial", v)} />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Roof Shape</label>
            <SegmentedControl options={ROOF_SHAPES} value={house.roofShape} onChange={(v) => update("roofShape", v)} />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Roof Material</label>
            <NativeSelect value={house.roofMaterial} onChange={(e) => update("roofMaterial", e.target.value)} placeholder="Select roof material">
              {ROOF_MATERIALS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </NativeSelect>
          </div>
          {testVersion !== "a" && (
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Own Risk</label>
              <SegmentedControl options={OWN_RISK_OPTIONS} value={house.ownRisk} onChange={(v) => update("ownRisk", v)} />
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );

  const renderCoveragePath = () => (
    <div className="animate-fade-in space-y-6">
      <TacoMessage
        message="Great. Now, what would you like to protect today? You can insure your belongings, the building itself, or both for full peace of mind."
        animate={shouldAnimateTaco}
        onAnimationComplete={markAnimated}
      />

      <Card>
        <CardContent className="pt-6">
          <SegmentedControl
            options={["Household Goods", "Building", "Both"]}
            value={
              house.coverageChoice === "household" ? "Household Goods"
              : house.coverageChoice === "building" ? "Building"
              : house.coverageChoice === "both" ? "Both"
              : ""
            }
            onChange={(v) => {
              const map: Record<string, "household" | "building" | "both"> = {
                "Household Goods": "household",
                "Building": "building",
                "Both": "both",
              };
              handleCoverageSelect(map[v]);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderContentsInsurance = () => (
    <div className="animate-fade-in space-y-6">
      <TacoMessage
        message="Let's look at your belongings. This covers everything that would fall out if you turned your house upside down—like your furniture, electronics, and jewelry."
        animate={shouldAnimateTaco}
        onAnimationComplete={markAnimated}
      />

      <SectionCard title="Contents Insurance">
        <div className="space-y-5">
          <ToggleRow label="High-value Audiovisual" sublabel=">€12k" checked={house.highValueAV} onChange={(v) => update("highValueAV", v)} showAmount amount={house.highValueAVAmount} onAmountChange={(v) => update("highValueAVAmount", v)} />
          <ToggleRow label="Jewelry" sublabel=">€6k" checked={house.jewelry} onChange={(v) => update("jewelry", v)} showAmount amount={house.jewelryAmount} onAmountChange={(v) => update("jewelryAmount", v)} />
          <ToggleRow label="Special assets" sublabel=">€15k" checked={house.specialAssets} onChange={(v) => update("specialAssets", v)} showAmount amount={house.specialAssetsAmount} onAmountChange={(v) => update("specialAssetsAmount", v)} />
          <ToggleRow label="Owner interest" sublabel=">€6k" checked={house.ownerInterest} onChange={(v) => update("ownerInterest", v)} showAmount amount={house.ownerInterestAmount} onAmountChange={(v) => update("ownerInterestAmount", v)} />
          <div className="border-t border-border pt-5">
            <label className="text-sm font-semibold text-foreground mb-2 block">Security</label>
            <SegmentedControl options={SECURITY_OPTIONS} value={house.security} onChange={(v) => update("security", v)} />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Net Income</label>
            <SegmentedControl options={NET_INCOME_OPTIONS} value={house.netIncome} onChange={(v) => update("netIncome", v)} />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Outside Value</label>
            <NativeSelect value={house.outsideValue} onChange={(e) => update("outsideValue", e.target.value)} placeholder="Select outside value">
              {OUTSIDE_VALUE_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </NativeSelect>
          </div>
          {testVersion !== "a" && (
            <div className="border-t border-border pt-5">
              <label className="text-sm font-semibold text-foreground mb-2 block">Coverage Level</label>
              <SegmentedControl options={["Extra Extensive", "All Risk"]} value={house.basicCoverage} onChange={(v) => update("basicCoverage", v)} />
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );

  const renderBuildingInsurance = () => (
    <div className="animate-fade-in space-y-6">
      <TacoMessage
        message="Now for the structure itself. This protects the physical building, including the walls, roof, and even your fitted kitchen or bathroom pipes."
        animate={shouldAnimateTaco}
        onAnimationComplete={markAnimated}
      />

      <SectionCard title="Building Insurance">
        <div className="space-y-5">
          <ToggleRow label="Monumental status" checked={house.monumental} onChange={(v) => update("monumental", v)} />
          <ToggleRow label="Quoted status" checked={house.quoted} onChange={(v) => update("quoted", v)} />
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Floor count</label>
            <SegmentedControl options={["1", "2", "2+"]} value={house.floorCount} onChange={(v) => update("floorCount", v)} />
          </div>
          <div className="border-t border-border pt-5 space-y-5">
            <ToggleRow label="Rainwater collection" checked={house.rainwater} onChange={(v) => update("rainwater", v)} />
            <ToggleRow label="Smart sensors" checked={house.smartSensors} onChange={(v) => update("smartSensors", v)} />
            <ToggleRow label="Heat pump" checked={house.heatPump} onChange={(v) => update("heatPump", v)} />
          </div>
          {testVersion !== "a" && (
            <div className="border-t border-border pt-5">
              <label className="text-sm font-semibold text-foreground mb-2 block">Coverage Level</label>
              <SegmentedControl options={["Extra Extensive", "All Risk"]} value={house.basicCoverage} onChange={(v) => update("basicCoverage", v)} />
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );

  const renderProductSelection = () => (
    <div className="flex min-h-screen bg-background">
      <FlowSwitcher currentFlowId="c" onSwitch={() => navigate("/?flow=a")} />
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-3xl px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Choose your insurances</h2>
          <p className="text-muted-foreground mb-8">Select the product you'd like to test in this flow.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              className="flex items-center gap-3 px-5 py-4 rounded-2xl border-2 border-primary bg-primary/10 shadow-md text-left"
              onClick={handleNext}
            >
              <img src={iconHome} alt="Home" className="w-10 h-10" />
              <span className="font-medium text-foreground flex-1">Home</span>
              <div className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "product-selection":
        return null;
      case "preset-verification":
        return renderPresetVerification();
      case "role":
        return renderRoleSelection();
      case "home-details":
        return renderHomeDetails();
      case "coverage-path":
        return renderCoveragePath();
      case "contents":
        return renderContentsInsurance();
      case "building":
        return renderBuildingInsurance();
      default:
        return null;
    }
  };

  const stepLabels: Record<StepKey, string> = {
    "product-selection": "Products",
    "preset-verification": "Verify",
    role: "Role",
    "home-details": "Home Details",
    "coverage-path": "Coverage",
    contents: "Contents Insurance",
    building: "Building Insurance",
  };

  if (currentStep === "product-selection") {
    return renderProductSelection();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">House Insurance</h1>
              <p className="text-xs text-muted-foreground">Product Flow Test</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-muted rounded-full p-1">
              <button
                onClick={() => handleVersionSwitch("a")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  testVersion === "a"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Version A
              </button>
              <button
                onClick={() => handleVersionSwitch("b")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  testVersion === "b"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Version B
              </button>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 border border-destructive/30 rounded-full px-4 py-2 hover:bg-destructive/5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16 pb-3">
          <p className="text-xs text-muted-foreground">
            {testVersion === "a"
              ? "Smart Preset — Confirms pre-filled home details before continuing."
              : "Manual Only — Fill in all home details from scratch."}
          </p>
        </div>
      </div>

      {/* Progress indicator hidden */}

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16 py-8 md:py-12">
        {renderCurrentStep()}
      </div>

      <div aria-hidden className="h-36" />

      <StickyFooter
        savings={totalSavings}
        onNext={handleNext}
        onBack={currentStepIdx > 0 ? handleBack : undefined}
        disabled={!canGoNext()}
        buttonLabel={isLastStep ? "Continue to Offer" : "Next"}
        showSavings={false}
        showNextButton
      />
    </div>
  );
};

export default HouseInsurance;
