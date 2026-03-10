import { useState, useRef } from "react";
import { INSURANCE_TYPES } from "./types";
import type { BundlePreset } from "./types";
import Sidebar from "./Sidebar";
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
import { Globe, User, LayoutGrid, Layers, GalleryHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

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
    insuranceIds: ["home", "liability"],
    annualSavings: 90,
    image: bundleHomeFamily,
  },
  {
    id: "business-travel",
    title: "Business & Travel",
    description: "For those on the move. Global coverage for your trips and your vehicle in one click.",
    insuranceIds: ["legal", "travel", "car"],
    annualSavings: 135,
    image: bundleBusinessTravel,
  },
  {
    id: "popular",
    title: "Popular choice",
    description: "Our bundle of the most popular products.",
    insuranceIds: ["home", "liability", "car"],
    annualSavings: 135,
    image: bundlePopular,
  },
  {
    id: "maximum",
    title: "Maximum protection",
    description: "For all cases in life. Our maximum discount for total peace of mind.",
    insuranceIds: ["liability", "home", "travel", "car", "legal", "accidents"],
    annualSavings: 270,
    image: bundleMaximum,
  },
];

const ADVANTAGES = {
  en: [
    "Lowest price for your coverage",
    "Automatic annual comparison",
    "Independent advice",
  ],
  nl: [
    "Laagste prijs voor uw dekking",
    "Automatische jaarlijkse vergelijking",
    "Onafhankelijk advies",
  ],
};

const TRANSLATIONS = {
  en: {
    heading: "Choose your insurances",
    subtitle: "Smartly insured: save up to €300 a year on a package of 6 insurances!",
    bundleHeading: "Save the most with our packages",
    bundleSubtitle: "Our customers always save the most with our packages instead of single insurance. Select the package which suits you best and benefit from the maximum savings.",
    individualHeading: "Or choose individual insurances",
    individualSubtitle: "Smartly insured: save up to €300 a year on a package of 6 insurances!",
    advantageTitle: "Your advantage with Surebird",
    saveAnnually: "Save annually",
    versionA: "Version A",
    versionB: "Version B",
    versionC: "Version C",
    login: "Log in",
    askTaco: "Ask Taco",
    tacoReady: "I'm ready to assist you",
    chatWhatsApp: "Chat via WhatsApp",
    estimatedSavings: "Estimated savings:",
    next: "Next",
    // Insurance labels
    labels: {
      liability: "Liability",
      home: "Home",
      car: "Car",
      legal: "Legal",
      accidents: "Accidents",
      caravan: "Caravan",
      travel: "Travel",
    },
    // Bundle titles & descriptions
    bundles: {
      "home-family": { title: "Home & Family", description: "The essential foundation. Protect your home and your family against unexpected costs." },
      "business-travel": { title: "Business & Travel", description: "For those on the move. Global coverage for your trips and your vehicle in one click." },
      "popular": { title: "Popular choice", description: "Our bundle of the most popular products." },
      "maximum": { title: "Maximum protection", description: "For all cases in life. Our maximum discount for total peace of mind." },
    },
  },
  nl: {
    heading: "Kies uw verzekeringen",
    subtitle: "Slim verzekerd: bespaar tot €300 per jaar op een pakket van 6 verzekeringen!",
    bundleHeading: "Bespaar het meest met onze pakketten",
    bundleSubtitle: "Onze klanten besparen altijd het meest met onze pakketten in plaats van losse verzekeringen. Selecteer het pakket dat het beste bij u past en profiteer van de maximale besparing.",
    individualHeading: "Of kies losse verzekeringen",
    individualSubtitle: "Slim verzekerd: bespaar tot €300 per jaar op een pakket van 6 verzekeringen!",
    advantageTitle: "Uw voordeel bij Surebird",
    saveAnnually: "Jaarlijks besparen",
    versionA: "Versie A",
    versionB: "Versie B",
    versionC: "Versie C",
    login: "Inloggen",
    askTaco: "Vraag Taco",
    tacoReady: "Ik sta klaar om u te helpen",
    chatWhatsApp: "Chat via WhatsApp",
    estimatedSavings: "Geschatte besparing:",
    next: "Volgende",
    labels: {
      liability: "Aansprakelijkheid",
      living: "Wonen",
      car: "Auto",
      legal: "Rechtsbijstand",
      accidents: "Ongevallen",
      caravan: "Caravan",
      travel: "Reizen",
    },
    bundles: {
      "home-family": { title: "Huis & Gezin", description: "De essentiële basis. Bescherm uw huis en gezin tegen onverwachte kosten." },
      "business-travel": { title: "Zakelijk & Reizen", description: "Voor onderweg. Wereldwijde dekking voor uw reizen en uw voertuig in één klik." },
      "popular": { title: "Populaire keuze", description: "Ons pakket van de meest populaire producten." },
      "maximum": { title: "Maximale bescherming", description: "Voor alle gevallen in het leven. Onze maximale korting voor totale gemoedsrust." },
    },
  },
};

interface StepOneProps {
  selected: string[];
  onToggle: (id: string) => void;
  onBundleSelect: (ids: string[]) => void;
  onNext: () => void;
}

const StepOne = ({ selected, onToggle, onBundleSelect, onNext }: StepOneProps) => {
  const [version, setVersion] = useState<"A" | "B" | "C">("A");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<"en" | "nl">("en");

  const isActiveBundle = (preset: BundlePreset) =>
    preset.insuranceIds.every((id) => selected.includes(id)) &&
    preset.insuranceIds.length === selected.length;

  const t = TRANSLATIONS[language];

  const InsuranceGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {INSURANCE_TYPES.map((ins) => {
        const isSelected = selected.includes(ins.id);
        const label = t.labels[ins.id as keyof typeof t.labels] || ins.label;
        return (
          <button
            key={ins.id}
            onClick={() => onToggle(ins.id)}
            className={`flex items-center gap-3 px-5 py-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
              isSelected
                ? "border-[#0177E5] bg-[#0385FF]/10 shadow-md"
                : "border-border bg-card hover:border-[#0177E5]/40"
            }`}
          >
            <span className="text-foreground">{ICON_MAP[ins.icon]}</span>
            <span className="font-medium text-foreground flex-1">{label}</span>
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isSelected ? "border-[#0177E5] bg-[#0177E5]" : "border-border"
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
  );

  const BundlePresets = ({ showHeader = true }: { showHeader?: boolean }) => (
    <div>
      {showHeader && (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t.bundleHeading}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t.bundleSubtitle}
          </p>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BUNDLE_PRESETS.map((preset) => {
          const isActive = isActiveBundle(preset);
          const bundleT = t.bundles[preset.id as keyof typeof t.bundles];
          return (
            <button
              key={preset.id}
              onClick={() => onBundleSelect(preset.insuranceIds)}
              className={`text-left rounded-xl border overflow-hidden transition-all hover:shadow-md ${
                isActive
                  ? "border-[#0177E5] bg-[#0385FF]/10 ring-2 ring-[#0177E5]/20 shadow-md"
                  : "border-border bg-card"
              }`}
            >
              <div className="relative h-40 overflow-hidden bg-muted">
                <img
                  src={preset.image}
                  alt={bundleT?.title || preset.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 inline-flex items-center bg-card text-success text-xs font-semibold px-3 py-1.5 rounded-full border border-[#EEEEEE]">
                  {t.saveAnnually} €{preset.annualSavings}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-1">{bundleT?.title || preset.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{bundleT?.description || preset.description}</p>
                <div className="flex gap-3 text-muted-foreground">
                  {preset.insuranceIds.map((id) => {
                    const ins = INSURANCE_TYPES.find((it) => it.id === id);
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
  );

  const scrollSlider = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const cardWidth = container.querySelector("button")?.offsetWidth || 300;
    const gap = 16;
    const scrollAmount = cardWidth + gap;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const BundleSlider = ({ showHeader = true }: { showHeader?: boolean }) => (
    <div>
      {showHeader && (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t.bundleHeading}
          </h2>
          <p className="text-muted-foreground mb-4">
            {t.bundleSubtitle}
          </p>
        </>
      )}
      <div className="relative">
        <button
          onClick={() => scrollSlider("left")}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors shadow-md"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => scrollSlider("right")}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors shadow-md"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {BUNDLE_PRESETS.map((preset) => {
          const isActive = isActiveBundle(preset);
          const bundleT = t.bundles[preset.id as keyof typeof t.bundles];
          return (
            <button
              key={preset.id}
              onClick={() => onBundleSelect(preset.insuranceIds)}
              className={`text-left rounded-xl border overflow-hidden transition-all hover:shadow-md snap-start shrink-0 w-[calc(50%-8px)] min-w-[260px] ${
                isActive
                  ? "border-[#0177E5] bg-[#0385FF]/10 ring-2 ring-[#0177E5]/20 shadow-md"
                  : "border-border bg-card"
              }`}
            >
              <div className="relative h-40 overflow-hidden bg-muted">
                <img
                  src={preset.image}
                  alt={bundleT?.title || preset.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 inline-flex items-center bg-card text-success text-xs font-semibold px-3 py-1.5 rounded-full border border-[#EEEEEE]">
                  {t.saveAnnually} €{preset.annualSavings}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-1">{bundleT?.title || preset.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{bundleT?.description || preset.description}</p>
                <div className="flex gap-3 text-muted-foreground">
                  {preset.insuranceIds.map((id) => {
                    const ins = INSURANCE_TYPES.find((it) => it.id === id);
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar showProgress={false} showAvatar={true} />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center">
        {/* Header */}
        <header className="w-full max-w-3xl flex items-center justify-end gap-3 px-6 py-4">
          {/* Version switcher */}
          <div className="flex items-center bg-muted rounded-lg p-0.5 mr-auto">
            <button
              onClick={() => setVersion("A")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                version === "A"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
             <LayoutGrid className="w-3.5 h-3.5" />
              {t.versionA}
            </button>
            <button
              onClick={() => setVersion("B")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                version === "B"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
             <Layers className="w-3.5 h-3.5" />
              {t.versionB}
            </button>
            <button
              onClick={() => setVersion("C")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                version === "C"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
             <GalleryHorizontal className="w-3.5 h-3.5" />
              {t.versionC}
            </button>
          </div>

          {/* Language switcher */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setLanguage("en")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                language === "en"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              EN
            </button>
            <button
              onClick={() => setLanguage("nl")}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                language === "nl"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              NL
            </button>
          </div>

          {/* Login button */}
          <button className="flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <User className="w-4 h-4" />
            {t.login}
          </button>
        </header>

        {/* Content */}
        <main className="w-full max-w-3xl px-6 py-8 pb-32">
          <div className="animate-fade-in">
            <h1 className="text-[32px] leading-tight font-bold text-foreground mb-3">
              {version === "A" ? t.heading : t.bundleHeading}
            </h1>
            <p className="text-muted-foreground mb-8">
              {version === "A" ? t.subtitle : t.bundleSubtitle}
            </p>

            {version === "A" ? (
              <>
                <InsuranceGrid />
                <div className="mt-16">
                  <BundlePresets />
                </div>
              </>
            ) : version === "B" ? (
              <>
                <BundlePresets showHeader={false} />
                <div className="mt-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {t.individualHeading}
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    {t.individualSubtitle}
                  </p>
                  <InsuranceGrid />
                </div>
              </>
            ) : (
              <>
                <BundleSlider showHeader={false} />
                <div className="mt-16">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {t.individualHeading}
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    {t.individualSubtitle}
                  </p>
                  <InsuranceGrid />
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default StepOne;
