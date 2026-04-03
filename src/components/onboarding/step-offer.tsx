import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { Check, BadgePercent, ChevronLeft, ChevronRight, ChevronDown, Plus, X, Info, MessageCircle, Lock, Shield, Play, Star, Gift, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StickyFooter } from "./sticky-footer";
import { Button } from "@/components/ui/button";
import { InsuranceOfferCard } from "./insurance-offer-card";
import logoNN from "@/assets/logo-nationale-nederlanden.svg";
import logoAllianz from "@/assets/logo-allianz.svg";
import { TacoMessage } from "./taco-message";
import { LegalCoverageSelector } from "./legal-coverage-selector";
import { INSURANCE_TYPES } from "./types";
import { TravelOfferCards } from "@/components/products/travel-offer-cards";
import { LegalOfferCards } from "@/components/products/legal-offer-cards";
import { LiabilityOfferCards } from "@/components/products/liability-offer-cards";
import { AccidentOfferCards } from "@/components/products/accident-offer-cards";
import { CaravanOfferCards } from "@/components/products/caravan-offer-cards";
import { CarOfferCards } from "@/components/products/car-offer-cards";
import { HomeOfferCards } from "@/components/products/home-offer-cards";
import { getProductConfig } from "@/config/products";
import { ProductFlowTab, type ProductFlowTabHandle } from "@/components/products/product-flow-tab";
import { MultiCarFlowTab } from "@/components/products/multi-car-flow-tab";
import { StepLoading } from "./step-loading";
import { getCarInstanceLabel, type CarInstance } from "@/config/products/car";
import { formatDutchPlate } from "@/components/ui/dutch-plate-input";
import { cn } from "@/lib/utils";
import tacoAvatar from "@/assets/taco-avatar.jpg";
import trustpilotLogo from "@/assets/trustpilot-logo.svg";
import trustpilotReview from "@/assets/trustpilot-review.svg";
import surebirdIcon from "@/assets/logo-surebird-icon.svg";
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

const INSURER_DATA: Record<string, { name: string; logoSrc?: string; happyClients: string; deductible: string; priceQuality?: string; cancellable: boolean; monthlyPrice: number; savingsPercent: number }> = {
  home: {
    name: "Nationale Nederlanden",
    logoSrc: logoNN,
    happyClients: "650+ happy clients",
    deductible: "€500",
    priceQuality: "Excellent",
    cancellable: true,
    monthlyPrice: 5.11,
    savingsPercent: 5,
  },
  liability: {
    name: "Allianz",
    logoSrc: logoAllianz,
    happyClients: "150+ happy clients",
    deductible: "€100",
    cancellable: true,
    monthlyPrice: 2.11,
    savingsPercent: 2,
  },
  travel: {
    name: "Allianz",
    logoSrc: logoAllianz,
    happyClients: "50+ happy clients",
    deductible: "€50",
    cancellable: true,
    monthlyPrice: 4.20,
    savingsPercent: 3,
  },
  car: {
    name: "FBTO",
    happyClients: "200+ happy clients",
    deductible: "€150",
    priceQuality: "Good",
    cancellable: true,
    monthlyPrice: 45.00,
    savingsPercent: 4,
  },
  legal: {
    name: "DAS",
    happyClients: "80+ happy clients",
    deductible: "€250",
    cancellable: true,
    monthlyPrice: 12.40,
    savingsPercent: 3,
  },
  accidents: {
    name: "Interpolis",
    happyClients: "60+ happy clients",
    deductible: "€0",
    cancellable: true,
    monthlyPrice: 3.20,
    savingsPercent: 2,
  },
  caravan: {
    name: "Kamernet",
    happyClients: "30+ happy clients",
    deductible: "€100",
    cancellable: true,
    monthlyPrice: 9.80,
    savingsPercent: 1,
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
  /** Product states captured from Set Preferences */
  productStates?: Record<string, Record<string, any>>;
  /** Rest-data states for offer page */
  offerStates?: Record<string, Record<string, any>>;
  /** Callback to update offer states */
  onUpdateOfferState?: (productId: string, key: string, value: any) => void;
  /** Callback to update product states */
  onUpdateProductState?: (productId: string, key: string, value: any) => void;
  /** Callback to add new insurance products */
  onAddInsurances?: (ids: string[]) => void;
  /** Callback to remove an insurance product */
  onRemoveInsurance?: (id: string) => void;
}

export const StepOffer = ({
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
  productStates = {},
  offerStates: offerStatesProp = {},
  onUpdateOfferState,
  onUpdateProductState,
  onAddInsurances,
  onRemoveInsurance,
}: StepOfferProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [annualDiscount, setAnnualDiscount] = useState(false);
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [activeCarIdx, setActiveCarIdx] = useState(0);
  const [activeHomeTab, setActiveHomeTab] = useState<"household" | "building">("household");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalSelection, setAddModalSelection] = useState<string[]>([]);
  const [removeConfirm, setRemoveConfirm] = useState<{ label: string; action: () => void } | null>(null);
  const [addFlowQueue, setAddFlowQueue] = useState<string[]>([]);
  const [addFlowProduct, setAddFlowProduct] = useState<string | null>(null);
  const [addFlowPhase, setAddFlowPhase] = useState<"preferences" | "loading">("preferences");
  const [addFlowActiveTab, setAddFlowActiveTab] = useState<string>("");
  const [addFlowCompletedTabs, setAddFlowCompletedTabs] = useState<string[]>([]);
  const addFlowRef = useRef<ProductFlowTabHandle>(null);
  const addFlowRefs = useRef<Record<string, ProductFlowTabHandle | null>>({});
  const testimonialRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [compareModalProduct, setCompareModalProduct] = useState<string | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const recalcTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Local product states (copy from Set Preferences, editable on offer page)
  const [localProductStates, setLocalProductStates] = useState<Record<string, Record<string, any>>>(() => ({ ...productStates }));

  // Extract car instances once for reuse
  const carInstances: { id: string; state: Record<string, any> }[] = useMemo(() => {
    return localProductStates?.car?.__carInstances || [{ id: "car-0", state: productStates?.car || {} }];
  }, [localProductStates?.car?.__carInstances, productStates?.car]);

  // Local offer states (rest data) with defaults from product configs
  // Car uses per-instance offer state keyed by instance ID
  const [localOfferStates, setLocalOfferStates] = useState<Record<string, Record<string, any>>>(() => {
    const initial: Record<string, Record<string, any>> = {};
    for (const id of selectedInsurances) {
      if (id === "car") {
        const config = getProductConfig("car");
        const carInsts = productStates?.car?.__carInstances || [{ id: "car-0", state: productStates?.car || {} }];
        const carOfferMap: Record<string, any> = {};
        for (const inst of carInsts) {
          carOfferMap[inst.id] = { ...(config?.offerInitialState || {}) };
        }
        initial.car = carOfferMap;
      } else {
        const config = getProductConfig(id);
        initial[id] = { ...(config?.offerInitialState || {}), ...(offerStatesProp[id] || {}) };
      }
    }
    return initial;
  });

  const triggerRecalc = useCallback(() => {
    setIsRecalculating(true);
    if (recalcTimerRef.current) clearTimeout(recalcTimerRef.current);
    recalcTimerRef.current = setTimeout(() => setIsRecalculating(false), 800);
  }, []);

  const handleUpdateOfferState = (productId: string, key: string, value: any) => {
    setLocalOfferStates((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), [key]: value },
    }));
    onUpdateOfferState?.(productId, key, value);
    triggerRecalc();
  };

  const handleUpdateProductState = (productId: string, key: string, value: any) => {
    setLocalProductStates((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), [key]: value },
    }));
    onUpdateProductState?.(productId, key, value);
    triggerRecalc();
  };

  // ── Car-specific per-instance handlers ──

  const handleUpdateCarInstanceOffer = useCallback((instanceId: string, key: string, value: any) => {
    setLocalOfferStates((prev) => ({
      ...prev,
      car: {
        ...(prev.car || {}),
        [instanceId]: { ...(prev.car?.[instanceId] || {}), [key]: value },
      },
    }));
    triggerRecalc();
  }, [triggerRecalc]);

  const handleUpdateCarInstanceProduct = useCallback((instanceIdx: number, key: string, value: any) => {
    setLocalProductStates((prev) => {
      const instances = [...(prev.car?.__carInstances || carInstances)];
      instances[instanceIdx] = {
        ...instances[instanceIdx],
        state: { ...instances[instanceIdx].state, [key]: value },
      };
      return { ...prev, car: { ...prev.car, __carInstances: instances } };
    });
    triggerRecalc();
  }, [carInstances, triggerRecalc]);

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

  // ── Pricing calculations with annual discount ──
  const discountPercent = 10;
  const annualPaymentRate = 0.05; // 5% extra discount for annual payment

  // Build calculator line items (granular for Home sub-products and Car instances)
  const calcLineItems = useMemo(() => {
    const items: { key: string; label: string; originalPrice: number; productId: string }[] = [];
    for (const id of selectedInsurances) {
      const insurer = INSURER_DATA[id];
      const original = insurer?.monthlyPrice || 5;

      if (id === "home" && localProductStates.home?.coverageChoice === "both") {
        items.push({ key: "home-household", label: "Household goods", originalPrice: original * 0.6, productId: "home" });
        items.push({ key: "home-building", label: "Building", originalPrice: original * 0.4, productId: "home" });
      } else if (id === "car" && carInstances.length > 1) {
        carInstances.forEach((inst, idx) => {
          const plateLabel = inst.state.licensePlate && inst.state.plateConfirmed
            ? `Car — ${formatDutchPlate((inst.state.licensePlate as string).toUpperCase())}`
            : `Car ${idx + 1}`;
          items.push({ key: inst.id, label: plateLabel, originalPrice: original, productId: "car" });
        });
      } else {
        const ins = INSURANCE_TYPES.find(t => t.id === id);
        items.push({ key: id, label: ins?.label || id, originalPrice: original, productId: id });
      }
    }
    return items;
  }, [selectedInsurances, localProductStates.home?.coverageChoice, carInstances]);

  const totalBeforeDiscount = calcLineItems.reduce((sum, item) => sum + item.originalPrice, 0);
  const discountAmount = totalBeforeDiscount * (discountPercent / 100);
  const afterBundleDiscount = totalBeforeDiscount - discountAmount;
  const annualPaymentSaving = annualDiscount ? afterBundleDiscount * annualPaymentRate : 0;
  const totalAfterDiscount = afterBundleDiscount - annualPaymentSaving;
  const annualSavings = Math.round((discountAmount + annualPaymentSaving) * 12 * 100) / 100;

  // Helper to calculate final monthly price for a product (used on offer cards)
  const getFinalMonthly = (originalPrice: number) => {
    const afterBundle = originalPrice * (1 - discountPercent / 100);
    return annualDiscount ? afterBundle * (1 - annualPaymentRate) : afterBundle;
  };

  const renderOfferCard = (id: string) => {
    const insurer = INSURER_DATA[id];
    const ins = INSURANCE_TYPES.find(t => t.id === id);
    if (!insurer || !ins) return null;

    return (
      <div key={id} className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-foreground">{ins.label}</h2>
          <div className="flex items-center gap-2">
            {selectedInsurances.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRemoveConfirm({ label: ins.label, action: () => { onRemoveInsurance?.(id); } })}
              >
                Remove
              </Button>
            )}
            <Button variant="outline" size="sm">Compare</Button>
          </div>
        </div>

        <InsuranceOfferCard
          insurerName={insurer.name}
          logoSrc={insurer.logoSrc}
          originalPrice={insurer.monthlyPrice}
          monthlyPrice={getFinalMonthly(insurer.monthlyPrice)}
          savingsPercent={insurer.savingsPercent}
          happyClients={insurer.happyClients}
          onViewDetails={() => setActiveTab(id)}
        />
      </div>
    );
  };

  const renderDetailTabOfferCard = (productId: string) => {
    const insurer = INSURER_DATA[productId];
    const ins = INSURANCE_TYPES.find(t => t.id === productId);
    if (!insurer || !ins) return null;

    let canRemove = false;
    let removeLabel = ins.label;
    let removeAction = () => { onRemoveInsurance?.(productId); setActiveTab("all"); };

    if (productId === "car" && carInstances.length > 1) {
      const activeInst = carInstances[activeCarIdx] || carInstances[0];
      const plateLabel = activeInst.state.licensePlate && activeInst.state.plateConfirmed
        ? formatDutchPlate((activeInst.state.licensePlate as string).toUpperCase())
        : `Car ${activeCarIdx + 1}`;
      canRemove = true;
      removeLabel = plateLabel;
      removeAction = () => {
        setLocalProductStates((prev) => {
          const instances = [...(prev.car?.__carInstances || carInstances)];
          instances.splice(activeCarIdx, 1);
          return { ...prev, car: { ...prev.car, __carInstances: instances } };
        });
        setLocalOfferStates((prev) => {
          const carOffer = { ...prev.car };
          const instToRemove = carInstances[activeCarIdx];
          if (instToRemove) delete carOffer[instToRemove.id];
          return { ...prev, car: carOffer };
        });
        setActiveCarIdx(0);
      };
    } else if (productId === "home" && localProductStates.home?.coverageChoice === "both") {
      canRemove = true;
      removeLabel = activeHomeTab === "household" ? "Household goods" : "Building";
      removeAction = () => {
        const newChoice = activeHomeTab === "household" ? "building" : "household";
        handleUpdateProductState("home", "coverageChoice", newChoice);
        setActiveHomeTab(newChoice as "household" | "building");
      };
    } else if (selectedInsurances.length > 1) {
      canRemove = true;
    }

    return (
      <div className="mb-6">
        {/* Badge + action buttons aligned in one row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-semibold">Best and cheapest choice</span>
          </div>
          <div className="flex items-center gap-2">
            {canRemove && (
              <Button variant="outline" size="sm" onClick={() => setRemoveConfirm({ label: removeLabel, action: removeAction })}>
                Remove
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setCompareModalProduct(productId)}>Compare</Button>
          </div>
        </div>

        <InsuranceOfferCard
          insurerName={insurer.name}
          logoSrc={insurer.logoSrc}
          originalPrice={insurer.monthlyPrice}
          monthlyPrice={getFinalMonthly(insurer.monthlyPrice)}
          savingsPercent={insurer.savingsPercent}
          happyClients={insurer.happyClients}
          actionLabel="Policy conditions"
          onViewDetails={() => setPolicyModalOpen(true)}
        />

        <h2 className="text-2xl font-bold text-foreground mt-6 mb-3">Details</h2>
      </div>
    );
  };

  // ── Add product modal ──
  const nonSelectedProducts = INSURANCE_TYPES.filter(t => !selectedInsurances.includes(t.id));

  const handleOpenAddModal = () => {
    setAddModalSelection([]);
    setShowAddModal(true);
  };

  const handleToggleAddProduct = (id: string) => {
    setAddModalSelection(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSaveAddModal = () => {
    if (addModalSelection.length > 0) {
      setAddFlowQueue([...addModalSelection]);
      setAddFlowProduct(addModalSelection[0]);
      setAddFlowActiveTab(addModalSelection[0]);
      setAddFlowCompletedTabs([]);
      setAddFlowPhase("preferences");
    }
    setShowAddModal(false);
  };

  const renderAddModal = () => {
    if (!showAddModal) return null;
    return (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowAddModal(false);
        }}
      >
        <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md mx-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Add products</h2>
            <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {nonSelectedProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">All products have been added.</p>
          ) : (
            <div className="space-y-3 mb-6">
              {nonSelectedProducts.map((ins) => {
                const isChecked = addModalSelection.includes(ins.id);
                return (
                  <button
                    key={ins.id}
                    onClick={() => handleToggleAddProduct(ins.id)}
                    className={`flex items-center gap-3 w-full px-5 py-4 rounded-2xl border-2 transition-all text-left hover:shadow-md ${
                      isChecked
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <img src={ICON_MAP[ins.icon]} alt={ins.label} className="w-10 h-10" />
                    <span className="text-sm font-medium text-foreground flex-1">{ins.label}</span>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        isChecked ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              onClick={handleSaveAddModal}
              disabled={addModalSelection.length === 0}
              className="px-6 py-3 rounded-full text-success-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{
                background: 'linear-gradient(180deg, hsl(121 72% 48%) 0%, hsl(121 72% 38%) 100%)',
                boxShadow: '0 4px 12px -2px hsla(121, 72%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)',
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Remove confirmation modal ──
  const renderRemoveConfirm = () => {
    if (!removeConfirm) return null;
    return (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
        onClick={(e) => {
          if (e.target === e.currentTarget) setRemoveConfirm(null);
        }}
      >
        <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-sm mx-4 p-6">
          <h2 className="text-lg font-bold text-foreground mb-2">Remove {removeConfirm.label}?</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Are you sure you want to remove {removeConfirm.label} from your offer? This action cannot be undone.
          </p>
          <div className="flex items-center gap-3 justify-end">
            <Button variant="outline" size="sm" onClick={() => setRemoveConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                removeConfirm.action();
                setRemoveConfirm(null);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // ── Add flow: progress polling ──
  const [addFlowProgressTick, setAddFlowProgressTick] = useState(0);
  useEffect(() => {
    if (!addFlowProduct || addFlowPhase !== "preferences") return;
    const interval = setInterval(() => setAddFlowProgressTick((t) => t + 1), 300);
    return () => clearInterval(interval);
  }, [addFlowProduct, addFlowPhase]);

  const addFlowProgressPercent = useMemo(() => {
    void addFlowProgressTick;
    if (addFlowQueue.length === 0) return 0;
    let totalSteps = 0;
    let completedSteps = 0;
    for (const id of addFlowQueue) {
      const config = getProductConfig(id);
      const stepCount = config?.stepDefs?.length || 3;
      if (addFlowCompletedTabs.includes(id)) {
        totalSteps += stepCount;
        completedSteps += stepCount;
      } else {
        const flowRef = addFlowRefs.current[id];
        if (flowRef?.progress) {
          totalSteps += flowRef.progress.total;
          completedSteps += flowRef.progress.completed;
        } else {
          totalSteps += stepCount;
        }
      }
    }
    return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  }, [addFlowProgressTick, addFlowQueue, addFlowCompletedTabs]);

  const handleAddFlowNext = () => {
    const ref = addFlowRefs.current[addFlowActiveTab];
    if (!ref) return;
    const handled = ref.handleNext();
    if (!handled) {
      // Current tab complete
      const flowState = ref.getState();
      setLocalProductStates((prev) => ({ ...prev, [addFlowActiveTab]: flowState }));
      const newCompleted = [...addFlowCompletedTabs, addFlowActiveTab];
      setAddFlowCompletedTabs(newCompleted);
      // Move to next uncompleted tab
      const nextTab = addFlowQueue.find(id => !newCompleted.includes(id));
      if (nextTab) {
        setAddFlowActiveTab(nextTab);
      } else {
        // All done → loading
        setAddFlowPhase("loading");
      }
    }
  };

  const handleAddFlowBack = () => {
    const ref = addFlowRefs.current[addFlowActiveTab];
    if (ref && ref.handleBack()) return;
    // At first step of current tab → go to previous tab
    const idx = addFlowQueue.indexOf(addFlowActiveTab);
    if (idx > 0) {
      setAddFlowActiveTab(addFlowQueue[idx - 1]);
    }
  };

  // ── Full-page add product overlay ──
  const renderAddFlowOverlay = () => {
    if (!addFlowProduct) return null;

    if (addFlowPhase === "loading") {
      return (
        <div className="fixed inset-0 z-[70] bg-background overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <StepLoading onComplete={() => {
              onAddInsurances?.(addFlowQueue);
              for (const id of addFlowQueue) {
                const config = getProductConfig(id);
                if (config?.offerInitialState) {
                  setLocalOfferStates((prev) => ({
                    ...prev,
                    [id]: { ...(config.offerInitialState || {}) },
                  }));
                }
              }
              setAddFlowProduct(null);
              setAddFlowQueue([]);
              setAddFlowCompletedTabs([]);
              setAddFlowPhase("preferences");
            }} />
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-[70] bg-background overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-16 py-12 pb-40">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">Set your preferences</h1>
            <button
              onClick={() => { setAddFlowProduct(null); setAddFlowQueue([]); setAddFlowCompletedTabs([]); }}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Product tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {addFlowQueue.map((id) => {
              const ins = INSURANCE_TYPES.find((t) => t.id === id)!;
              const isActive = addFlowActiveTab === id;
              const isComplete = addFlowCompletedTabs.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => setAddFlowActiveTab(id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-semibold transition-all border h-12 ${
                    isActive
                      ? "bg-foreground text-background border-foreground"
                      : "bg-white border-border text-foreground"
                  }`}
                >
                  {isComplete ? (
                    <Check className={`w-6 h-6 ${isActive ? "text-background" : "text-success"}`} />
                  ) : (
                    <img
                      src={ICON_MAP[ins.icon]}
                      alt={ins.label}
                      className={`w-6 h-6 ${isActive ? "brightness-0 invert" : ""}`}
                    />
                  )}
                  {ins.label}
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <Progress value={addFlowProgressPercent} className="h-2 [&>div]:bg-success mb-6" />

          {/* Product flow content — always mounted to preserve state */}
          {addFlowQueue.map((id) => (
            <div key={id} className={addFlowActiveTab === id ? "" : "hidden"}>
              {id === "car" ? (
                <MultiCarFlowTab
                  ref={(r) => { addFlowRefs.current[id] = r; }}
                  productId="car"
                  isActive={addFlowActiveTab === id}
                />
              ) : (
                <ProductFlowTab
                  ref={(r) => { addFlowRefs.current[id] = r; }}
                  productId={id}
                  isActive={addFlowActiveTab === id}
                />
              )}
            </div>
          ))}

          {/* Spacer for sticky footer */}
          <div className="h-36 md:h-40" />
        </div>

        {/* Sticky footer matching Set Preferences */}
        <StickyFooter
          savings={0}
          onNext={handleAddFlowNext}
          onBack={handleAddFlowBack}
          showSavings={false}
        />
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
      <div className="border border-border rounded-3xl overflow-hidden bg-card">
        <div className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Offer calculations</h3>

          <div className="space-y-3 text-sm mb-4">
            {calcLineItems.map(item => {
              const afterBundle = item.originalPrice * (1 - discountPercent / 100);
              const final = annualDiscount ? afterBundle * (1 - annualPaymentRate) : afterBundle;
              return (
                <div key={item.key} className="flex justify-between items-center">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground line-through text-sm">€{item.originalPrice.toFixed(2)}</span>
                    <span className="font-semibold text-foreground">€{final.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                <BadgePercent className="w-4 h-4" />
                Discount:
              </span>
              <span className="text-base font-semibold" style={{ color: 'hsl(0 74% 42%)' }}>-{discountPercent}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Activate annual payment discount</span>
              <button
                type="button"
                onClick={() => setAnnualDiscount(!annualDiscount)}
                className={`w-10 h-5 rounded-full relative transition-colors ${annualDiscount ? "bg-success" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${annualDiscount ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Total row - full width background */}
        <div className="flex justify-between items-center bg-primary/5 px-6 py-4">
          <span className="text-xl font-bold text-foreground">Total p/m</span>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold line-through" style={{ color: 'hsl(0 74% 42%)' }}>€{totalBeforeDiscount.toFixed(2)}</span>
            <span className="text-2xl font-bold text-foreground">€{totalAfterDiscount.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-6 pt-4">
          <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-success">
            <Gift className="w-4 h-4" />
            Annual savings: €{annualSavings.toFixed(2)}
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
            Lock discount for 24h
          </button>

          <div className="flex items-start gap-2 mt-4 text-xs text-muted-foreground">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <p>All prices include 21% insurance tax and service costs. <span className="underline cursor-pointer">Check the price breakdown</span></p>
          </div>
        </div>
      </div>

      {/* USP Card */}
      <div className="border border-border rounded-3xl p-6 bg-card">
        <h3 className="text-lg font-bold text-foreground mb-4">With Surebird you have:</h3>
        <ul className="space-y-3 mb-6">
          {[
            "14 days cooling off period",
            "The best price & quality",
            "All insurances in once place",
            "A personal assistance",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-base text-foreground">
              <Check className="w-5 h-5 text-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="pt-4">
          <img src={trustpilotReview} alt="Trustpilot 4.6 Excellent" className="h-9" />
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
      <div className="grid gap-8 xl:grid-cols-[minmax(0,680px)_320px] justify-center items-start">
        {/* Main content */}
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-foreground mb-6">Your personal offer</h1>

          {/* Product tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-semibold transition-all border ${
                activeTab === "all"
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white border-border text-foreground"
              }`}
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
                      : "bg-white border-border text-foreground"
                  }`}
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
            <button
              onClick={handleOpenAddModal}
              className="h-11 w-11 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {activeTab === "all" ? (
            <>
              <div className="border border-border rounded-3xl p-6 bg-card mb-8">
                <TacoMessage
                  message={`${firstName || "Hi"}, I have selected the best insurance policies for you based on your set preferences!`}
                  animate={animateTaco}
                />
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-success bg-success/10 border border-success/20 rounded-full px-4 py-3">
                    <Gift className="w-5 h-5" />
                    You save with Surebird: €{annualSavings.toFixed(2)}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-3">
                    <Award className="w-5 h-5" />
                    Best and cheapest choices
                  </span>
                </div>
              </div>
              {selectedInsurances.map((id) => {
                // Car: grouped under one heading with one card per instance
                if (id === "car" && carInstances.length > 1) {
                  const ins = INSURANCE_TYPES.find((t) => t.id === "car")!;
                  const insurer = INSURER_DATA.car;
                  return (
                    <div key="car" className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-2xl font-bold text-foreground">{ins.label}</h2>
                        <div className="flex items-center gap-2">
                          {selectedInsurances.length > 1 && (
                            <Button variant="outline" size="sm" onClick={() => setRemoveConfirm({ label: ins.label, action: () => onRemoveInsurance?.("car") })}>
                              Remove
                            </Button>
                          )}
                          <Button variant="outline" size="sm">Compare</Button>
                        </div>
                      </div>
                      {carInstances.map((inst, idx) => {
                        const plateLabel = inst.state.licensePlate && inst.state.plateConfirmed
                          ? formatDutchPlate((inst.state.licensePlate as string).toUpperCase())
                          : `Car ${idx + 1}`;
                        return (
                          <div key={inst.id} className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-muted-foreground">{plateLabel}</p>
                              {carInstances.length > 1 && (
                                <Button variant="outline" size="sm" onClick={() => setRemoveConfirm({
                                  label: plateLabel,
                                  action: () => {
                                    setLocalProductStates((prev) => {
                                      const instances = [...(prev.car?.__carInstances || carInstances)];
                                      instances.splice(idx, 1);
                                      return { ...prev, car: { ...prev.car, __carInstances: instances } };
                                    });
                                    setLocalOfferStates((prev) => {
                                      const carOffer = { ...prev.car };
                                      delete carOffer[inst.id];
                                      return { ...prev, car: carOffer };
                                    });
                                    if (activeCarIdx >= idx && activeCarIdx > 0) setActiveCarIdx(activeCarIdx - 1);
                                  },
                                })}>
                                  Remove
                                </Button>
                              )}
                            </div>
                            <InsuranceOfferCard
                              insurerName={insurer.name}
                              logoSrc={insurer.logoSrc}
                              originalPrice={insurer.monthlyPrice}
                              monthlyPrice={getFinalMonthly(insurer.monthlyPrice)}
                              savingsPercent={insurer.savingsPercent}
                              happyClients={insurer.happyClients}
                              onViewDetails={() => { setActiveCarIdx(idx); setActiveTab("car"); }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                // Home: grouped under one heading with sub-product cards when "both"
                if (id === "home" && localProductStates.home?.coverageChoice === "both") {
                  const ins = INSURANCE_TYPES.find((t) => t.id === "home")!;
                  const insurer = INSURER_DATA.home;
                  return (
                    <div key="home" className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-2xl font-bold text-foreground">{ins.label}</h2>
                        <div className="flex items-center gap-2">
                          {selectedInsurances.length > 1 && (
                            <Button variant="outline" size="sm" onClick={() => setRemoveConfirm({ label: ins.label, action: () => onRemoveInsurance?.("home") })}>
                              Remove
                            </Button>
                          )}
                          <Button variant="outline" size="sm">Compare</Button>
                        </div>
                      </div>
                      {(["household", "building"] as const).map((sub) => {
                        const subLabel = sub === "household" ? "Household goods" : "Building";
                        return (
                          <div key={sub} className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-muted-foreground">{subLabel}</p>
                              <Button variant="outline" size="sm" onClick={() => setRemoveConfirm({
                                label: subLabel,
                                action: () => {
                                  const newChoice = sub === "household" ? "building" : "household";
                                  handleUpdateProductState("home", "coverageChoice", newChoice);
                                  setActiveHomeTab(newChoice as "household" | "building");
                                },
                              })}>
                                Remove
                              </Button>
                            </div>
                            <InsuranceOfferCard
                              insurerName={insurer.name}
                              logoSrc={insurer.logoSrc}
                              originalPrice={insurer.monthlyPrice}
                              monthlyPrice={getFinalMonthly(insurer.monthlyPrice)}
                              savingsPercent={insurer.savingsPercent}
                              happyClients={insurer.happyClients}
                              onViewDetails={() => { setActiveHomeTab(sub); setActiveTab("home"); }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return renderOfferCard(id);
              })}
            </>
          ) : (
            <>
              {/* Car pill switcher above the offer card */}
              {activeTab === "car" && carInstances.length > 1 && (
                <>
                  <div className="border-t border-border my-4" />
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {carInstances.map((inst, i) => {
                      const isActive = i === activeCarIdx;
                      const label = getCarInstanceLabel(inst as CarInstance, i);
                      return (
                        <button
                          key={inst.id}
                          onClick={() => setActiveCarIdx(i)}
                          className={cn(
                            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border",
                            isActive
                              ? "bg-foreground text-background border-foreground"
                              : "bg-white border-border text-foreground hover:border-muted-foreground/30"
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Home sub-product pill switcher */}
              {activeTab === "home" && (() => {
                const coverageChoice = localProductStates.home?.coverageChoice;
                if (coverageChoice === "both") {
                  return (
                    <>
                      <div className="border-t border-border my-4" />
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {(["household", "building"] as const).map((sub) => {
                          const isActive = activeHomeTab === sub;
                          return (
                            <button
                              key={sub}
                              onClick={() => setActiveHomeTab(sub)}
                              className={cn(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border",
                                isActive
                                  ? "bg-foreground text-background border-foreground"
                                  : "bg-white border-border text-foreground hover:border-muted-foreground/30"
                              )}
                            >
                              {sub === "household" ? "Household goods" : "Building"}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  );
                }
                return null;
              })()}

              {/* Offer card on detail tabs (no h2 title) */}
              {renderDetailTabOfferCard(activeTab)}

              {/* Detail cards */}
              {activeTab === "travel" && localProductStates.travel ? (
                <TravelOfferCards
                  productState={localProductStates.travel}
                  offerState={localOfferStates.travel || {}}
                  onUpdateProduct={(key, value) => handleUpdateProductState("travel", key, value)}
                  onUpdateOffer={(key, value) => handleUpdateOfferState("travel", key, value)}
                  selectedInsurances={selectedInsurances}
                />
              ) : activeTab === "legal" ? (
                <LegalOfferCards
                  productState={localProductStates.legal || { coverageModules: ["consumer"] }}
                  offerState={localOfferStates.legal || {}}
                  onUpdateProduct={(key, value) => handleUpdateProductState("legal", key, value)}
                  onUpdateOffer={(key, value) => handleUpdateOfferState("legal", key, value)}
                />
              ) : activeTab === "liability" ? (
                <LiabilityOfferCards
                  productState={localProductStates.liability || { dog: "No", damageLimit: "€1,250,000" }}
                  offerState={localOfferStates.liability || {}}
                  onUpdateProduct={(key, value) => handleUpdateProductState("liability", key, value)}
                  onUpdateOffer={(key, value) => handleUpdateOfferState("liability", key, value)}
                />
              ) : activeTab === "accidents" ? (
                <AccidentOfferCards
                  productState={localProductStates.accidents || { coverage: "Death: €5,000 | Disability: €25,000" }}
                  offerState={localOfferStates.accidents || {}}
                  onUpdateProduct={(key, value) => handleUpdateProductState("accidents", key, value)}
                  onUpdateOffer={(key, value) => handleUpdateOfferState("accidents", key, value)}
                />
              ) : activeTab === "caravan" ? (
                <CaravanOfferCards
                  productState={localProductStates.caravan || {}}
                  offerState={localOfferStates.caravan || {}}
                  onUpdateProduct={(key, value) => handleUpdateProductState("caravan", key, value)}
                  onUpdateOffer={(key, value) => handleUpdateOfferState("caravan", key, value)}
                />
              ) : activeTab === "car" ? (() => {
                const activeInst = carInstances[activeCarIdx] || carInstances[0];
                const instOfferState = localOfferStates.car?.[activeInst?.id] || {};
                return (
                  <CarOfferCards
                    instanceState={activeInst?.state || {}}
                    instanceOfferState={instOfferState}
                    onUpdateInstanceProduct={(key, value) => handleUpdateCarInstanceProduct(activeCarIdx, key, value)}
                    onUpdateInstanceOffer={(key, value) => handleUpdateCarInstanceOffer(activeInst?.id, key, value)}
                  />
                );
              })() : activeTab === "home" ? (() => {
                const coverageChoice = localProductStates.home?.coverageChoice || "household";
                const effectiveSubTab = coverageChoice === "both" ? activeHomeTab
                  : coverageChoice === "building" ? "building" as const
                  : "household" as const;
                const subOffer = localOfferStates.home?.[effectiveSubTab] || { ownRisk: "100", coverage: "All Risk" };
                return (
                  <HomeOfferCards
                    activeSubTab={effectiveSubTab}
                    productState={localProductStates.home || {}}
                    subOfferState={subOffer}
                    onUpdateProduct={(key, value) => handleUpdateProductState("home", key, value)}
                    onUpdateSubOffer={(key, value) => {
                      setLocalOfferStates((prev) => ({
                        ...prev,
                        home: {
                          ...(prev.home || {}),
                          [effectiveSubTab]: { ...(prev.home?.[effectiveSubTab] || {}), [key]: value },
                        },
                      }));
                    }}
                  />
                );
              })() : (
                renderPreferences(activeTab)
              )}
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
      {renderAddModal()}
      {renderRemoveConfirm()}
      {renderAddFlowOverlay()}

      {/* Policy conditions modal */}
      {policyModalOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/40" onClick={() => setPolicyModalOpen(false)} />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl h-[90vh] bg-background rounded-2xl border border-border shadow-xl overflow-hidden">
              <button
                onClick={() => setPolicyModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
              <iframe
                src="https://verzekeringskaarten.nl/allianz/aansprakelijkheidsverzekering-allianz"
                title="Policy conditions"
                className="w-full h-full"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

