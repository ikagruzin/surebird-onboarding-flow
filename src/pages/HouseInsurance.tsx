import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, RotateCcw, Home, Info, Check } from "lucide-react";
import StickyFooter from "@/components/onboarding/StickyFooter";
import FlowSwitcher from "@/components/onboarding/FlowSwitcher";
import Sidebar from "@/components/onboarding/Sidebar";
import iconHome from "@/assets/icon-home.svg";
import tacoAvatar from "@/assets/taco-avatar.jpg";

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
  ownRisk: "€250",
  basicCoverage: "Extra Extensive",
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

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border border-border rounded-2xl bg-card p-6 shadow-sm">
    <h3 className="text-lg font-bold text-foreground mb-5">{title}</h3>
    {children}
  </div>
);

const SegmentedControl = ({
  options, value, onChange, columns = 3,
}: {
  options: string[]; value: string; onChange: (v: string) => void; columns?: number;
}) => (
  <div className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : columns === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-3"}`}>
    {options.map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
          value === opt
            ? "border-primary bg-primary/5 text-foreground"
            : "border-border text-foreground hover:border-muted-foreground/30"
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

const ChipSelect = ({
  options, selected, onChange,
}: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {options.map((opt) => {
      const isActive = selected.includes(opt);
      return (
        <button
          key={opt}
          onClick={() => onChange(isActive ? selected.filter((s) => s !== opt) : [...selected, opt])}
          className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
            isActive
              ? "border-primary bg-primary/5 text-foreground"
              : "border-border text-foreground hover:border-muted-foreground/30"
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

const DropdownSelect = ({
  options, value, onChange, placeholder,
}: {
  options: string[]; value: string; onChange: (v: string) => void; placeholder: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-xl border-2 border-input bg-white px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none"
  >
    <option value="">{placeholder}</option>
    {options.map((o) => (
      <option key={o} value={o}>{o}</option>
    ))}
  </select>
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
        className="w-full rounded-xl border-2 border-input bg-white px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
    // Version A: Smart Preset
    steps.push("preset-verification");

    if (presetAnswer === "yes") {
      // Yes → skip home-details, go to role → insurance steps → offer
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
      // No → manual flow (same as Version B)
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
  } else {
    // Version B: Manual Only
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
          house.roofShape && house.roofMaterial && house.ownRisk
        );
      case "coverage-path":
        return house.coverageChoice !== "";
      case "contents":
        return !!(house.security && house.netIncome && house.outsideValue && house.basicCoverage);
      case "building":
        return !!(house.floorCount && house.basicCoverage);
      default:
        return false;
    }
  };

  const isLastStep = currentStepIdx === steps.length - 1 && steps.length > 1;

  const handleNext = () => {
    if (isLastStep) {
      navigate("/?flow=a");
      return;
    }
    const nextIdx = currentStepIdx + 1;
    if (nextIdx < steps.length) {
      setCurrentStepIdx(nextIdx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
  };

  const handleVersionSwitch = (v: "a" | "b") => {
    setTestVersion(v);
    setHouse({ ...INITIAL_HOUSE });
    setCurrentStepIdx(0);
    setPresetAnswer("");
  };

  const handlePresetAnswer = (answer: "yes" | "no") => {
    setPresetAnswer(answer);
    if (answer === "yes") {
      // Apply preset values
      setHouse((s) => ({ ...s, ...PRESET_HOUSE }));
    }
  };

  const totalSavings = 45;

  /* ─── Step Renders ─── */

  const renderPresetVerification = () => (
    <div className="animate-fade-in space-y-6">
      {/* Taco message */}
      <div className="flex items-start gap-3">
        <img src={tacoAvatar} alt="Taco" className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="bg-muted rounded-2xl rounded-tl-md px-5 py-3">
          <p className="text-base text-foreground">
            Based on your address, I've found some details about your home. Can you confirm this?
          </p>
        </div>
      </div>

      {/* Verification card */}
      <div className="border-2 border-border rounded-2xl bg-card p-6 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-foreground">Is this information correct?</h3>
        <p className="text-sm text-muted-foreground">My house has:</p>
        <ul className="space-y-3">
          {[
            "Stone/concrete exterior walls",
            "A sloping or mainly sloping roof without thatch",
            "A kitchen or bathroom less than 10 years old",
            "Outbuildings of up to 100 m²",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{item}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-border pt-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handlePresetAnswer("yes")}
              className={`px-5 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                presetAnswer === "yes"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-foreground hover:border-muted-foreground/30"
              }`}
            >
              Yes, that's correct
            </button>
            <button
              onClick={() => handlePresetAnswer("no")}
              className={`px-5 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                presetAnswer === "no"
                  ? "border-destructive bg-destructive/10 text-foreground"
                  : "border-border text-foreground hover:border-muted-foreground/30"
              }`}
            >
              No, I'll fill it in
            </button>
          </div>
        </div>

        {presetAnswer === "yes" && (
          <div className="bg-success/10 border border-success/20 rounded-xl px-4 py-3 animate-fade-in">
            <p className="text-sm text-success font-medium">
              ✓ Great! We'll use these details. You can always edit them later from the offer page.
            </p>
          </div>
        )}
        {presetAnswer === "no" && (
          <div className="bg-muted rounded-xl px-4 py-3 animate-fade-in">
            <p className="text-sm text-muted-foreground">
              No problem — you'll be able to enter your home details manually in the next steps.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderRoleSelection = () => (
    <SectionCard title="You are the...">
      <SegmentedControl
        options={["Tenant", "Homeowner"]}
        value={house.role === "tenant" ? "Tenant" : house.role === "homeowner" ? "Homeowner" : ""}
        onChange={(v) => update("role", v === "Tenant" ? "tenant" : "homeowner")}
        columns={2}
      />
    </SectionCard>
  );

  const renderHomeDetails = () => (
    <SectionCard title="Home Details">
      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Building Type</label>
          <DropdownSelect options={BUILDING_TYPES} value={house.buildingType} onChange={(v) => update("buildingType", v)} placeholder="Select building type" />
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
          <DropdownSelect options={ROOF_MATERIALS} value={house.roofMaterial} onChange={(v) => update("roofMaterial", v)} placeholder="Select roof material" />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Own Risk</label>
          <SegmentedControl options={OWN_RISK_OPTIONS} value={house.ownRisk} onChange={(v) => update("ownRisk", v)} columns={4} />
        </div>
      </div>
    </SectionCard>
  );

  const renderCoveragePath = () => (
    <SectionCard title="What insurance do you want?">
      <SegmentedControl
        options={["Household Goods", "Building", "Both"]}
        value={
          house.coverageChoice === "household" ? "Household Goods"
            : house.coverageChoice === "building" ? "Building"
            : house.coverageChoice === "both" ? "Both" : ""
        }
        onChange={(v) =>
          update("coverageChoice", v === "Household Goods" ? "household" : v === "Building" ? "building" : "both")
        }
      />
    </SectionCard>
  );

  const renderContentsInsurance = () => (
    <SectionCard title="Contents Insurance">
      <div className="space-y-5">
        <ToggleRow label="High-value Audiovisual" sublabel=">€12k" checked={house.highValueAV} onChange={(v) => update("highValueAV", v)} showAmount amount={house.highValueAVAmount} onAmountChange={(v) => update("highValueAVAmount", v)} />
        <ToggleRow label="Jewelry" sublabel=">€6k" checked={house.jewelry} onChange={(v) => update("jewelry", v)} showAmount amount={house.jewelryAmount} onAmountChange={(v) => update("jewelryAmount", v)} />
        <ToggleRow label="Special assets" sublabel=">€15k" checked={house.specialAssets} onChange={(v) => update("specialAssets", v)} showAmount amount={house.specialAssetsAmount} onAmountChange={(v) => update("specialAssetsAmount", v)} />
        <ToggleRow label="Owner interest" sublabel=">€6k" checked={house.ownerInterest} onChange={(v) => update("ownerInterest", v)} showAmount amount={house.ownerInterestAmount} onAmountChange={(v) => update("ownerInterestAmount", v)} />
        <div className="border-t border-border pt-5">
          <label className="text-sm font-semibold text-foreground mb-2 block">Security</label>
          <SegmentedControl options={SECURITY_OPTIONS} value={house.security} onChange={(v) => update("security", v)} columns={4} />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Net Income</label>
          <SegmentedControl options={NET_INCOME_OPTIONS} value={house.netIncome} onChange={(v) => update("netIncome", v)} />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Outside Value</label>
          <DropdownSelect options={OUTSIDE_VALUE_OPTIONS} value={house.outsideValue} onChange={(v) => update("outsideValue", v)} placeholder="Select outside value" />
        </div>
        <div className="border-t border-border pt-5">
          <label className="text-sm font-semibold text-foreground mb-2 block">Coverage Level</label>
          <SegmentedControl options={["Extra Extensive", "All Risk"]} value={house.basicCoverage} onChange={(v) => update("basicCoverage", v)} columns={2} />
        </div>
      </div>
    </SectionCard>
  );

  const renderBuildingInsurance = () => (
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
        <div className="border-t border-border pt-5">
          <label className="text-sm font-semibold text-foreground mb-2 block">Coverage Level</label>
          <SegmentedControl options={["Extra Extensive", "All Risk"]} value={house.basicCoverage} onChange={(v) => update("basicCoverage", v)} columns={2} />
        </div>
      </div>
    </SectionCard>
  );

  const renderProductSelection = () => (
    <div className="flex min-h-screen bg-background">
      <FlowSwitcher currentFlowId="c" onSwitch={() => navigate("/?flow=a")} />
      <Sidebar showProgress={false} showAvatar={true} />
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

  // Product selection gets its own full-page layout
  if (currentStep === "product-selection") {
    return renderProductSelection();
  }

  return (
    <div className="min-h-screen bg-background">
      <FlowSwitcher currentFlowId="c" onSwitch={() => navigate("/?flow=a")} />
      <AskTacoFloat />

      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
            {/* Version switcher */}
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

        {/* Version description */}
        <div className="max-w-4xl mx-auto px-6 pb-3">
          <p className="text-xs text-muted-foreground">
            {testVersion === "a"
              ? "Smart Preset — Confirms pre-filled home details before continuing."
              : "Manual Only — Fill in all home details from scratch."}
          </p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-2 mb-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < currentStepIdx
                    ? "bg-success text-success-foreground"
                    : i === currentStepIdx
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  i === currentStepIdx ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {stepLabels[s]}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-6 h-0.5 ${i < currentStepIdx ? "bg-success" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="md:col-span-2">
            {renderCurrentStep()}
          </div>
        </div>
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
