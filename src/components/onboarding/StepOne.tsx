import { INSURANCE_TYPES } from "./types";
import type { BundlePreset } from "./types";
import logoSurebird from "@/assets/logo-surebird.svg";
import bundleHomeFamily from "@/assets/bundle-home-family.png";
import bundleBusinessTravel from "@/assets/bundle-business-travel.png";
import bundlePopular from "@/assets/bundle-popular.png";
import bundleMaximum from "@/assets/bundle-maximum.png";
import iconLiability from "@/assets/icon-liability.svg";
import iconHome from "@/assets/icon-home.svg";
import iconCar from "@/assets/icon-car.svg";
import iconLegal from "@/assets/icon-legal.svg";
import iconAccidents from "@/assets/icon-accidents.svg";
import iconCaravan from "@/assets/icon-caravan.svg";
import iconTravel from "@/assets/icon-travel.svg";

const ICON_MAP: Record<string, React.ReactNode> = {
  Plane: <img src={iconTravel} alt="Travel" className="w-10 h-10" />,
  Home: <img src={iconHome} alt="Home" className="w-10 h-10" />,
  Umbrella: <img src={iconLiability} alt="Liability" className="w-10 h-10" />,
  Car: <img src={iconCar} alt="Car" className="w-10 h-10" />,
  Scale: <img src={iconLegal} alt="Legal" className="w-10 h-10" />,
  Zap: <img src={iconAccidents} alt="Accidents" className="w-10 h-10" />,
  Caravan: <img src={iconCaravan} alt="Caravan" className="w-10 h-10" />,
};

const SMALL_ICON_MAP: Record<string, React.ReactNode> = {
  Plane: <img src={iconTravel} alt="Travel" className="w-7 h-7" />,
  Home: <img src={iconHome} alt="Home" className="w-7 h-7" />,
  Umbrella: <img src={iconLiability} alt="Liability" className="w-7 h-7" />,
  Car: <img src={iconCar} alt="Car" className="w-7 h-7" />,
  Scale: <img src={iconLegal} alt="Legal" className="w-7 h-7" />,
  Zap: <img src={iconAccidents} alt="Accidents" className="w-7 h-7" />,
  Caravan: <img src={iconCaravan} alt="Caravan" className="w-7 h-7" />,
};

const BUNDLE_PRESETS: BundlePreset[] = [
  {
    id: "home-family",
    title: "Home & Family",
    description: "The essential foundation. Protect your home and your family against unexpected costs.",
    insuranceIds: ["living", "liability"],
    annualSavings: 80,
    image: bundleHomeFamily,
  },
  {
    id: "business-travel",
    title: "Business & Travel",
    description: "The essential foundation. Protect your home and your family against unexpected costs.",
    insuranceIds: ["legal", "travel", "car"],
    annualSavings: 120,
    image: bundleBusinessTravel,
  },
  {
    id: "popular",
    title: "Popular choice",
    description: "Our bundle of the most popular products.",
    insuranceIds: ["living", "liability", "car"],
    annualSavings: 120,
    image: bundlePopular,
  },
  {
    id: "maximum",
    title: "Maximum protection",
    description: "For all cases in life. Our maximum discount for total peace of mind.",
    insuranceIds: ["liability", "living", "travel", "car", "legal", "accidents"],
    annualSavings: 240,
    image: bundleMaximum,
  },
];

interface StepOneProps {
  selected: string[];
  onToggle: (id: string) => void;
  onBundleSelect: (ids: string[]) => void;
  onNext: () => void;
}

const StepOne = ({ selected, onToggle, onBundleSelect, onNext }: StepOneProps) => {
  const isActiveBundle = (preset: BundlePreset) =>
    preset.insuranceIds.every((id) => selected.includes(id)) &&
    preset.insuranceIds.length === selected.length;

  return (
    <div className="animate-fade-in pb-24">
      {/* Logo header */}
      <div className="mb-8 -ml-0">
        <img src={logoSurebird} alt="Surebird" className="h-8" />
      </div>

      <h1 className="text-[36px] leading-tight font-bold text-foreground mb-3">
        Choose your insurances
      </h1>
      <p className="text-muted-foreground mb-8">
        Smartly insured: save up to €300 a year on a package of 6 insurances!
      </p>

      {/* Insurance grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
        {INSURANCE_TYPES.map((ins) => {
          const isSelected = selected.includes(ins.id);
          return (
            <button
              key={ins.id}
              onClick={() => onToggle(ins.id)}
              className={`flex items-center gap-3 px-5 py-4 rounded-lg border transition-all text-left ${
                isSelected
                  ? "border-[#25B327] bg-[#EBFFEC]/45 shadow-sm"
                  : "border-border bg-card hover:border-[#25B327]/40"
              }`}
            >
              <span className="text-foreground">{ICON_MAP[ins.icon]}</span>
              <span className="font-medium text-foreground flex-1">{ins.label}</span>
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "border-[#25B327] bg-[#25B327]" : "border-border"
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bundle Preset Section */}
      <div className="mt-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Save the most with our packages
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl">
          Our customers always save the most with our packages instead of single insurance. Select the package which suits you best and benefit from the maximum savings.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BUNDLE_PRESETS.map((preset) => {
            const isActive = isActiveBundle(preset);
            return (
              <button
                key={preset.id}
                onClick={() => onBundleSelect(preset.insuranceIds)}
                className={`text-left rounded-xl border overflow-hidden transition-all hover:shadow-md ${
                  isActive
                    ? "border-[#25B327] ring-2 ring-[#25B327]/20 shadow-md"
                    : "border-border bg-card"
                }`}
              >
                <div className="relative h-40 overflow-hidden bg-muted">
                  <img
                    src={preset.image}
                    alt={preset.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 inline-flex items-center bg-success text-success-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                    Save annually €{preset.annualSavings}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-1">{preset.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{preset.description}</p>
                  <div className="flex gap-3 text-muted-foreground">
                    {preset.insuranceIds.map((id) => {
                      const ins = INSURANCE_TYPES.find((t) => t.id === id);
                      return ins ? (
                        <span key={id}>{SMALL_ICON_MAP[ins.icon]}</span>
                      ) : null;
                    })}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepOne;
