import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Plus, X, Info, MessageCircle, Lock, Calendar, Shield } from "lucide-react";
import { INSURANCE_TYPES } from "./types";
import tacoAvatar from "@/assets/taco-avatar.jpg";
import iconLiability from "@/assets/icon-liability.svg";
import iconHome from "@/assets/icon-home.svg";
import iconCar from "@/assets/icon-car.svg";
import iconLegal from "@/assets/icon-legal.svg";
import iconAccidents from "@/assets/icon-accidents.svg";
import iconCaravan from "@/assets/icon-caravan.svg";
import iconTravel from "@/assets/icon-travel.svg";

const ICON_MAP: Record<string, string> = {
  Umbrella: iconLiability,
  Home: iconHome,
  Plane: iconTravel,
  Car: iconCar,
  Scale: iconLegal,
  Zap: iconAccidents,
  Caravan: iconCaravan,
};

const INSURER_DATA: Record<string, { name: string; logo: string; badge: string; badgeColor: string; happyClients: string; deductible: string; priceQuality?: string; cancellable: boolean; monthlyPrice: number }> = {
  home: {
    name: "Nationale Nederlanden",
    logo: "🔶",
    badge: "Best and cheapest choice",
    badgeColor: "bg-blue-50 text-blue-600",
    happyClients: "+100 happy clients",
    deductible: "€500",
    priceQuality: "Excellent",
    cancellable: true,
    monthlyPrice: 5.11,
  },
  liability: {
    name: "Anker Insurance",
    logo: "⚓",
    badge: "The most popular choice",
    badgeColor: "bg-blue-50 text-blue-600",
    happyClients: "+75 happy clients",
    deductible: "€100",
    cancellable: true,
    monthlyPrice: 2.11,
  },
  travel: {
    name: "Allianz",
    logo: "🛡️",
    badge: "Best and cheapest choice",
    badgeColor: "bg-blue-50 text-blue-600",
    happyClients: "+50 happy clients",
    deductible: "€50",
    cancellable: true,
    monthlyPrice: 4.20,
  },
  car: {
    name: "FBTO",
    logo: "🚗",
    badge: "The most popular choice",
    badgeColor: "bg-blue-50 text-blue-600",
    happyClients: "+200 happy clients",
    deductible: "€150",
    priceQuality: "Good",
    cancellable: true,
    monthlyPrice: 45.00,
  },
  legal: {
    name: "DAS",
    logo: "⚖️",
    badge: "Best and cheapest choice",
    badgeColor: "bg-blue-50 text-blue-600",
    happyClients: "+80 happy clients",
    deductible: "€250",
    cancellable: true,
    monthlyPrice: 12.40,
  },
  accidents: {
    name: "Interpolis",
    logo: "🏥",
    badge: "The most popular choice",
    badgeColor: "bg-blue-50 text-blue-600",
    happyClients: "+60 happy clients",
    deductible: "€0",
    cancellable: true,
    monthlyPrice: 3.20,
  },
  caravan: {
    name: "Kamernet",
    logo: "🏕️",
    badge: "Best and cheapest choice",
    badgeColor: "bg-blue-50 text-blue-600",
    happyClients: "+30 happy clients",
    deductible: "€100",
    cancellable: true,
    monthlyPrice: 9.80,
  },
};

// Preference questions shown on offer page (per product)
const OFFER_PREFERENCES: Record<string, { id: string; label: string; options: { value: string; label: string }[] }[]> = {
  liability: [
    { id: "dog", label: "Do you want to insure your dog?", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }] },
    { id: "damage_limit", label: "Choose preferred damage limit", options: [{ value: "1250000", label: "€1,250,000" }, { value: "2250000", label: "€2,250,000" }] },
    { id: "own_risk", label: "What do you want to be your own risk?", options: [{ value: "100", label: "€100" }, { value: "none", label: "No excess" }] },
  ],
  home: [
    { id: "own_risk", label: "Own risk", options: [{ value: "0", label: "€0" }, { value: "100", label: "€100" }, { value: "250", label: "€250" }, { value: "500", label: "€500" }] },
  ],
};

interface StepOfferProps {
  selectedInsurances: string[];
  preferences: Record<string, Record<string, string>>;
  firstName: string;
  onUpdatePreference: (insuranceId: string, questionId: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepOffer = ({
  selectedInsurances,
  preferences,
  firstName,
  onUpdatePreference,
  onNext,
  onBack,
}: StepOfferProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const totalBeforeDiscount = selectedInsurances.reduce((sum, id) => sum + (INSURER_DATA[id]?.monthlyPrice || 5), 0);
  const discountPercent = 10;
  const discountAmount = totalBeforeDiscount * (discountPercent / 100);
  const totalAfterDiscount = totalBeforeDiscount - discountAmount;
  const annualSavings = Math.round(discountAmount * 12 * 100) / 100;

  const renderOfferCard = (id: string) => {
    const insurer = INSURER_DATA[id];
    const ins = INSURANCE_TYPES.find(t => t.id === id);
    if (!insurer || !ins) return null;

    return (
      <div key={id} className="mb-8">
        {activeTab === "all" && (
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-foreground">{ins.label}</h2>
            <button className="text-sm font-medium text-foreground border border-border rounded-full px-4 py-2 hover:bg-muted transition-colors">
              Edit preferences
            </button>
          </div>
        )}

        {/* Badge + navigation */}
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-primary/10 rounded-full px-3 py-1.5">
            <Shield className="w-4 h-4" />
            {insurer.badge}
          </span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="border border-border rounded-3xl p-6 bg-card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-success flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">{insurer.name}</span>
            </div>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              😊 {insurer.happyClients}
            </span>
          </div>

          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deductible:</span>
              <span className="font-semibold text-foreground">{insurer.deductible}</span>
            </div>
            {insurer.priceQuality && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price/quality:</span>
                <span className="font-semibold text-foreground">{insurer.priceQuality}</span>
              </div>
            )}
            {insurer.cancellable && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Can be cancelled on daily basis:</span>
                <Check className="w-4 h-4 text-success" />
              </div>
            )}
          </div>

          <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
            <button className="text-sm font-medium text-foreground underline underline-offset-2">
              View details
            </button>
            <div className="text-right">
              <span className="text-sm text-muted-foreground">per month </span>
              <span className="text-2xl font-bold text-foreground">€{insurer.monthlyPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-xs font-medium text-success flex items-center gap-1">
              <Check className="w-3 h-3" />
              Discount is available for you
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderPreferences = (id: string) => {
    const prefs = OFFER_PREFERENCES[id];
    if (!prefs) return null;
    const currentPrefs = preferences[id] || {};

    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Preferences</h2>
          <button className="text-sm font-medium text-foreground border border-border rounded-full px-4 py-2 hover:bg-muted transition-colors">
            Edit other preferences
          </button>
        </div>

        <div className="border border-border rounded-3xl p-6 bg-card space-y-6">
          {prefs.map((q) => (
            <div key={q.id}>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-base font-semibold text-foreground">{q.label}</p>
                <Info className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className={`grid gap-3 ${q.options.length === 2 ? "grid-cols-2" : q.options.length <= 4 ? "grid-cols-2" : "grid-cols-1"}`}>
                {q.options.map((opt) => {
                  const isSelected = currentPrefs[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => onUpdatePreference(id, q.id, opt.value)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all text-left ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-primary" : "border-muted-foreground/40"
                        }`}
                      >
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <span className="text-sm font-medium text-foreground">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Sidebar calculations
  const renderCalculations = () => (
    <div className="sticky top-8 space-y-6">
      {/* Offer calculations */}
      <div className="border border-border rounded-3xl p-6 bg-card">
        <h3 className="text-lg font-bold text-foreground mb-1">Offer calculations</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Here you can see exactly how your new total price is structured and what discount you are getting!
        </p>

        <div className="space-y-2 text-sm mb-4">
          {selectedInsurances.map(id => {
            const ins = INSURANCE_TYPES.find(t => t.id === id);
            const insurer = INSURER_DATA[id];
            return (
              <div key={id} className="flex justify-between">
                <span className="font-medium text-foreground">{ins?.label || id}</span>
                <span className="text-foreground">€{(insurer?.monthlyPrice || 5).toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border pt-3 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-foreground">Total before discount</span>
            <span className="font-semibold text-destructive line-through">€{totalBeforeDiscount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <Check className="w-4 h-4 text-success" />
              Discount:
            </span>
            <span className="bg-success/10 text-success text-xs font-semibold px-2.5 py-1 rounded-full">
              {discountPercent}% discount is applied
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Activate discount for annual payment</span>
            <div className="w-10 h-6 bg-muted rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm" />
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-4 pt-4">
          <div className="flex justify-between items-baseline bg-primary/5 rounded-2xl px-4 py-3">
            <span className="text-lg font-bold text-foreground">Total p/m</span>
            <span className="text-2xl font-bold text-foreground">€{totalAfterDiscount.toFixed(1)}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-sm font-semibold text-success">
            <Calendar className="w-4 h-4" />
            Annual savings: €{annualSavings.toFixed(2)}
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full mt-4 inline-flex items-center justify-center gap-2 text-success-foreground px-7 py-3.5 rounded-full font-semibold text-base transition-all"
          style={{
            background: 'linear-gradient(180deg, hsl(121 72% 48%) 0%, hsl(121 72% 38%) 100%)',
            boxShadow: '0 4px 12px -2px hsla(121, 72%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)',
          }}
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>

        <button className="w-full mt-3 inline-flex items-center justify-center gap-2 border border-border rounded-full px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Lock className="w-4 h-4" />
          Lock price for 24h
        </button>

        <div className="flex items-start gap-2 mt-4 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <p>All prices include 21% insurance tax and service costs. <span className="underline cursor-pointer">Check the price breakdown</span></p>
        </div>
      </div>

      {/* Advantages */}
      <div>
        <h3 className="text-base font-bold text-foreground mb-3">Your advantage at Surebird</h3>
        <div className="space-y-2">
          {["Concealable daily", "Arranged today, insured tomorrow", "No service charges"].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-success" />
              <span className="text-foreground">{item}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <span className="text-yellow-500 text-lg">★</span>
          <span className="text-sm font-semibold text-foreground">Trustpilot</span>
          <span className="text-lg font-bold text-foreground ml-1">4.6</span>
          <span className="text-xs text-muted-foreground">Excellent</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h1 className="text-[32px] font-bold text-foreground mb-6">Your personal offer</h1>

      {/* Product tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab("all")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-semibold transition-all border ${
            activeTab === "all"
              ? "bg-foreground text-background border-foreground"
              : "bg-white border-[hsl(0,0%,84%)] text-foreground"
          }`}
          style={{ borderWidth: '1px' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={activeTab === "all" ? "text-background" : "text-foreground"}>
            <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="10" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="1" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="10" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          All offers
        </button>
        {selectedInsurances.map(id => {
          const ins = INSURANCE_TYPES.find(t => t.id === id)!;
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-semibold transition-all border ${
                isActive
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white border-[hsl(0,0%,84%)] text-foreground"
              }`}
              style={{ borderWidth: '1px' }}
            >
              <img
                src={ICON_MAP[ins.icon]}
                alt={ins.label}
                className={`w-6 h-6 ${isActive ? "brightness-0 invert" : ""}`}
              />
              {ins.label}
            </button>
          );
        })}
        <button className="h-[44px] w-[44px] rounded-full border border-[hsl(0,0%,84%)] bg-white flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {activeTab === "all" && (
            <>
              {/* Taco message */}
              <div className="border border-border rounded-3xl p-6 bg-card mb-8">
                <div className="flex items-start gap-3 mb-4">
                  <img src={tacoAvatar} alt="Taco" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <p className="text-base text-foreground">
                    {firstName || "Hi"}, I have selected the best insurance policies for you based on your set preferences! If you have any questions or need my personal assistance, feel free to contact me 👍
                  </p>
                </div>
                <button className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <MessageCircle className="w-4 h-4 text-success" />
                  Chat via WhatsApp
                </button>
              </div>

              {/* All offer cards */}
              {selectedInsurances.map(id => renderOfferCard(id))}
            </>
          )}

          {activeTab !== "all" && (
            <>
              {renderOfferCard(activeTab)}
              {renderPreferences(activeTab)}
            </>
          )}
        </div>

        {/* Right sidebar - calculations */}
        <div className="hidden lg:block w-[320px] shrink-0">
          {renderCalculations()}
        </div>
      </div>
    </div>
  );
};

export default StepOffer;
