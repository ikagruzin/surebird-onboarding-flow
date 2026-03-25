import { useState, useRef, useMemo } from "react";
import { Check, CheckCircle2, ChevronLeft, ChevronRight, ChevronDown, Plus, X, Info, MessageCircle, Lock, Calendar, Shield, Play, Star, Gift, Award } from "lucide-react";
import TacoMessage from "./TacoMessage";
import LegalCoverageSelector from "./LegalCoverageSelector";
import { INSURANCE_TYPES } from "./types";
import tacoAvatar from "@/assets/taco-avatar.jpg";
import person1 from "@/assets/person-1.png";
import person2 from "@/assets/person-2.png";
import person3 from "@/assets/person-3.png";
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
    badgeColor: "bg-primary/5 text-primary",
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
    badgeColor: "bg-primary/5 text-primary",
    happyClients: "+75 happy clients",
    deductible: "€100",
    cancellable: true,
    monthlyPrice: 2.11,
  },
  travel: {
    name: "Allianz",
    logo: "🛡️",
    badge: "Best and cheapest choice",
    badgeColor: "bg-primary/5 text-primary",
    happyClients: "+50 happy clients",
    deductible: "€50",
    cancellable: true,
    monthlyPrice: 4.20,
  },
  car: {
    name: "FBTO",
    logo: "🚗",
    badge: "The most popular choice",
    badgeColor: "bg-primary/5 text-primary",
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
    badgeColor: "bg-primary/5 text-primary",
    happyClients: "+80 happy clients",
    deductible: "€250",
    cancellable: true,
    monthlyPrice: 12.40,
  },
  accidents: {
    name: "Interpolis",
    logo: "🏥",
    badge: "The most popular choice",
    badgeColor: "bg-primary/5 text-primary",
    happyClients: "+60 happy clients",
    deductible: "€0",
    cancellable: true,
    monthlyPrice: 3.20,
  },
  caravan: {
    name: "Kamernet",
    logo: "🏕️",
    badge: "Best and cheapest choice",
    badgeColor: "bg-primary/5 text-primary",
    happyClients: "+30 happy clients",
    deductible: "€100",
    cancellable: true,
    monthlyPrice: 9.80,
  },
};

// Preference questions shown on offer page (per product)
const OFFER_PREFERENCES: Record<string, { id: string; label: string; options: { value: string; label: string }[]; customComponent?: string }[]> = {
  liability: [
    { id: "dog", label: "Do you want to insure your dog?", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }] },
    { id: "damage_limit", label: "Choose preferred damage limit", options: [{ value: "1250000", label: "€1,250,000" }, { value: "2250000", label: "€2,250,000" }] },
    { id: "own_risk", label: "What do you want to be your own risk?", options: [{ value: "100", label: "€100" }, { value: "none", label: "No excess" }] },
  ],
  home: [
    { id: "own_risk", label: "Own risk", options: [{ value: "0", label: "€0" }, { value: "100", label: "€100" }, { value: "250", label: "€250" }, { value: "500", label: "€500" }] },
  ],
  travel: [
    { id: "own_risk", label: "Own risk", options: [{ value: "0", label: "€0" }, { value: "250", label: "€250" }, { value: "500", label: "€500" }] },
    { id: "sports", label: "Do you play sports on vacation?", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }] },
    { id: "extraordinary_costs", label: "Cover extraordinary costs?", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }] },
    { id: "insure_cash", label: "Insure cash?", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }] },
    { id: "insure_accidents", label: "Insure accidents?", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }] },
    { id: "insure_medical", label: "Insure medical expenses?", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }] },
    { id: "legal_assistance", label: "Cover legal assistance?", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }] },
    { id: "business_travel", label: "Are you going on a business trip?", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }] },
    { id: "luggage", label: "Do you want to insure your luggage?", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }] },
    { id: "cancellation", label: "Do you want cancellation coverage?", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }] },
    { id: "roadside_assistance", label: "Add roadside assistance?", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }] },
    { id: "bike_coverage", label: "Extra coverage for your bike?", options: [{ value: "0", label: "€0" }, { value: "250", label: "€250" }, { value: "500", label: "€500" }] },
  ],
  legal: [
    { id: "coverage_modules", label: "Coverage areas", options: [], customComponent: "legal_coverage" },
  ],
};

interface StepOfferProps {
  selectedInsurances: string[];
  preferences: Record<string, Record<string, string>>;
  firstName: string;
  onUpdatePreference: (insuranceId: string, questionId: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  /** Flow D: gated mode — blur offer until contact info provided */
  gated?: boolean;
  gateUnlocked?: boolean;
  gateOverlay?: React.ReactNode;
  animateTaco?: boolean;
}

const StepOffer = ({
  selectedInsurances,
  preferences,
  firstName,
  onUpdatePreference,
  onNext,
  onBack,
  gated = false,
  gateUnlocked = false,
  gateOverlay,
  animateTaco,
}: StepOfferProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number>(0); // first open by default
  const testimonialRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const FAQ_DATA = [
    {
      q: "Why is regular switching good?",
      a: "Insurers regularly change their conditions and premiums. Did you know that premiums can increase by up to 57% annually for loyal customers? If you stay with the same insurer for a long time, you often end up paying a \"Loyalty Tax.\" Surebird monitors the market 24/7 for you and makes switching as easy as the push of a button.",
    },
    {
      q: "How can I be sure that Surebird is reliable?",
      a: "We work only with top-tier Dutch insurers and are fully transparent about our offers. Our platform is designed to provide an extra layer of confidence by negotiating the best terms and quality for you, ensuring your coverage is always robust and up to date.",
    },
    {
      q: "Why choose Surebird?",
      a: "Surebird makes insurance \"an afterthought.\" Instead of you managing separate policies and researching websites every year, our smart systems automate the entire process. You get one clear overview, one point of contact, and the guarantee that you never overpay again.",
    },
    {
      q: "What is the business model of Surebird?",
      a: "We act as your digital insurance partner. Our goal is to save you money through smart bundling and commission rebates. We believe in long-term value; when you save, we succeed in building a platform that keeps insurance fair for everyone.",
    },
    {
      q: "How do I cancel my old insurance?",
      a: "You don't have to! Once you confirm your new Surebird package, our automated Switch Service handles the cancellation of your old policies for you. We ensure a seamless transition so you are never double-insured or without coverage.",
    },
    {
      q: "There are service costs on my quote, what are these?",
      a: "The service cost covers the continuous monitoring of your policies, our 24/7 \"Ask Taco\" support, and the technology that prevents your premiums from creeping up. When you bundle 3 or more products, these costs are diluted, often making the total package significantly cheaper than individual policies elsewhere.",
    },
    {
      q: "How much does Surebird cost?",
      a: "Our pricing is built into the transparent monthly premium you see on your offer page. There are no hidden fees. The amount you see includes your high-quality coverage and the service that ensures you stay on the best possible deal year after year.",
    },
  ];

  const renderFAQ = () => (
    <div className="mt-12 mb-8">
      <h2 className="text-xl font-bold text-foreground mb-6">FAQ</h2>
      <div className="space-y-3">
        {FAQ_DATA.map((item, i) => {
          const isOpen = openFaq === i;
          return (
            <div key={i} className="border border-border rounded-2xl bg-card overflow-hidden">
              <button
                onClick={() => setOpenFaq(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-semibold text-foreground text-sm">{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 animate-fade-in">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <span>Is your question not included? Taco and his team are here for you.</span>
        <button className="inline-flex items-center gap-1.5 font-semibold text-success hover:underline transition-colors">
          <MessageCircle className="w-4 h-4" />
          Chat with Taco
        </button>
      </div>
    </div>
  );

  const TESTIMONIALS = [
    { name: "Lars", topic: "the 'Loyalty Tax' savings", image: person1, videoId: "HYtrufZHVIM" },
    { name: "Sanne", topic: "the 'All-in-1' overview", image: person2, videoId: "HYtrufZHVIM" },
    { name: "Daan", topic: "the 'Switch Service' ease", image: person3, videoId: "HYtrufZHVIM" },
  ];

  const scrollTestimonials = (dir: "left" | "right") => {
    if (!testimonialRef.current) return;
    testimonialRef.current.scrollBy({ left: dir === "left" ? -236 : 236, behavior: "smooth" });
  };

  const renderTestimonials = () => (
    <div className="mt-12 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">What our members say about Surebird</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scrollTestimonials("left")}
            className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => scrollTestimonials("right")}
            className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
      <div
        ref={testimonialRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {TESTIMONIALS.map((t, i) => (
          <button
            key={i}
            onClick={() => setVideoModal(t.videoId)}
            className="relative shrink-0 w-56 h-72 rounded-2xl overflow-hidden group cursor-pointer snap-start"
          >
            <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-primary ml-0.5" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-semibold text-sm">{t.name}</p>
              <p className="text-white/80 text-xs">on {t.topic}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Video Modal */}
      {videoModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setVideoModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setVideoModal(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${videoModal}?autoplay=1`}
                title="Testimonial video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  const TRUSTPILOT_REVIEWS = [
    {
      name: "Marieke",
      rating: 5,
      title: "Positive experience so far.",
      text: "I have had a positive experience with this company so far. Prices are competitive, and they use an effective system to ensure that costs remain low. When I looked at one insurance it was a bit high, but when I put together my whole package it turned out that I would get 45 euros per month for the whole.",
    },
    {
      name: "Leontine",
      rating: 5,
      title: "No need to compare anymore.",
      text: "No need to compare anymore. Usually every year, or every now and then, I look for the most suitable coverage and the most affordable insurance myself. However, I now have coverage that better suits my needs and at the same time has a lower premium.",
    },
  ];


  const TrustpilotStars = ({ count, size = 16 }: { count: number; size?: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`flex items-center justify-center rounded-sm ${i <= count ? "bg-[#00b67a]" : "bg-[#dcdce6]"}`}
          style={{ width: size + 4, height: size + 4 }}
        >
          <Star className="text-white" style={{ width: size - 2, height: size - 2 }} fill="currentColor" />
        </div>
      ))}
    </div>
  );

  const scrollReviews = (dir: "left" | "right") => {
    if (!reviewsRef.current) return;
    reviewsRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const renderTrustpilotReviews = () => (
    <div className="mt-12 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Check out our reviews</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scrollReviews("left")}
            className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => scrollReviews("right")}
            className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      <div
        ref={reviewsRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Trustpilot overview card */}
        <div className="shrink-0 w-72 bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-between shadow-sm min-h-72 snap-start">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-success" fill="currentColor" />
            <span className="text-lg font-bold text-foreground">Trustpilot</span>
          </div>
          <div className="flex flex-col items-center my-4">
            <span className="text-5xl font-bold text-foreground mb-3">4.2</span>
            <TrustpilotStars count={4} size={20} />
          </div>
          <p className="text-sm text-muted-foreground mt-4">2,466 Trustpilot reviews</p>
        </div>

        {/* Review cards */}
        {TRUSTPILOT_REVIEWS.map((review, i) => {
          const isLong = review.text.length > 180;
          const displayText = isLong ? review.text.slice(0, 180) + "..." : review.text;
          return (
            <div key={i} className="shrink-0 w-72 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-72 snap-start">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-foreground">{review.rating}.0</span>
                  <TrustpilotStars count={review.rating} />
                </div>
                <h3 className="font-bold text-foreground mb-2 text-sm">{review.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {expandedReview === i ? review.text : displayText}
                </p>
                {isLong && (
                  <button
                    onClick={() => setExpandedReview(expandedReview === i ? null : i)}
                    className="text-sm font-semibold text-foreground underline mt-2"
                  >
                    {expandedReview === i ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-4">— {review.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

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
              {q.customComponent === "legal_coverage" ? (
                <LegalCoverageSelector
                  selected={(currentPrefs[q.id] || "consumer").split(",")}
                  onChange={(sel) => onUpdatePreference(id, q.id, sel.join(","))}
                />
              ) : (
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
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Sidebar calculations
  const renderCalculations = () => (
    <div className="space-y-6">
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

    </div>
  );

  const isBlurred = gated && !gateUnlocked;

  return (
    <div className="animate-fade-in relative">
      {/* Gate overlay */}
      {isBlurred && gateOverlay}

      {/* Content wrapper — blurred when gated */}
      <div className={isBlurred ? "filter blur-md select-none pointer-events-none transition-all duration-700" : "transition-all duration-700"}>
      <h1 className="text-3xl font-bold text-foreground mb-6">Your personal offer</h1>

      {/* Product tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab("all")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-semibold transition-all border ${
            activeTab === "all"
              ? "bg-foreground text-background border-foreground"
              : "bg-white border-[hsl(0,0%,84%)] text-foreground"
          }`}
          style={{ borderWidth: "1px" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={activeTab === "all" ? "text-background" : "text-foreground"}>
            <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="10" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="1" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <rect x="10" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          All offers
        </button>
        {selectedInsurances.map((id) => {
          const ins = INSURANCE_TYPES.find((t) => t.id === id)!;
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
              style={{ borderWidth: "1px" }}
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
        <button className="h-11 w-11 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] items-start">
        {/* Main content */}
        <div className="min-w-0">
          {activeTab === "all" ? (
            <>
              <div className="border border-border rounded-3xl p-6 bg-card mb-8">
                <TacoMessage
                  message={`${firstName || "Hi"}, I have selected the best insurance policies for you based on your set preferences!`}
                  animate={animateTaco}
                  variant="bubble"
                />
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success bg-success/10 border border-success/20 rounded-full px-3 py-1.5">
                    <Gift className="w-4 h-4" />
                    You save with Surebird: €{annualSavings.toFixed(2)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5">
                    <Award className="w-4 h-4" />
                    Best and cheapest choices
                  </span>
                </div>
              </div>
              {selectedInsurances.map((id) => renderOfferCard(id))}
            </>
          ) : (
            <>
              {renderOfferCard(activeTab)}
              {renderPreferences(activeTab)}
            </>
          )}

          <div className="mt-12 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Your benefits with Surebird</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Always well insured",
                  text: "Insurance boring? Not with Surebird! Our platform manages your insurance and offers customized personal coverage.",
                },
                {
                  title: "Never compare yourself again",
                  text: "Our smart systems find the best deals and stop premium increases. Always top insurance for the best price.",
                },
                {
                  title: "All in 1 overview",
                  text: "No more separate policies. All your insurance policies in one place, clear and efficient.",
                },
                {
                  title: "One point of contact for advice and damage",
                  text: "If something happens, you only have one point of contact for service and support in case of damage.",
                },
              ].map((card, i) => (
                <div key={i} className="flex flex-col p-6 rounded-2xl border border-border bg-card">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
          </div>

          {renderTestimonials()}
          {renderTrustpilotReviews()}
          {renderFAQ()}
        </div>

        {/* Right sidebar - calculations */}
        <div className="w-full xl:w-80 xl:shrink-0 xl:sticky xl:top-8 self-start">
          {renderCalculations()}
        </div>
      </div>
      </div>
    </div>
  );
};

export default StepOffer;
