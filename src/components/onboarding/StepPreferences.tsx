import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Check, Plus, Info, X, Mail, Phone, ChevronRight } from "lucide-react";
import { INSURANCE_TYPES } from "./types";
import { Progress } from "@/components/ui/progress";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import LegalCoverageSelector from "./LegalCoverageSelector";
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

interface PreferenceQuestion {
  id: string;
  label: string;
  description?: string;
  options: { value: string; label: string; badge?: string; subText?: string; bullets?: string[]; hasViewDetails?: boolean }[];
  infoText?: string;
  autoAdvance?: boolean;
  cardLayout?: boolean; // render as rich cards instead of radio buttons
}

const QUESTIONS_BY_TYPE: Record<string, PreferenceQuestion[]> = {
  home: [
    {
      id: "owner_type",
      label: "Are you a homeowner or tenant?",
      options: [
        { value: "homeowner", label: "Homeowner" },
        { value: "tenant", label: "Tenant" },
      ],
      autoAdvance: true,
    },
    {
      id: "house_info",
      label: "Is this information correct?",
      description: "My house has:\n• stone/concrete exterior walls\n• a sloping or mainly sloping roof without thatch\n• a kitchen or bathroom less than 10 years old\n• outbuildings of up to 100 m2",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
      autoAdvance: true,
    },
    {
      id: "insure_type",
      label: "What do you want to insure?",
      options: [
        { value: "household", label: "Household goods", badge: "My advice" },
        { value: "building", label: "Building" },
        { value: "both", label: "Household goods + Building" },
      ],
      infoText: "As you own an apartment, household goods insurance is sufficient. The homeowners' association (VvE) often already has building insurance.",
    },
  ],
  liability: [
    {
      id: "dog",
      label: "Do you want to insure your dog?",
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes" },
      ],
    },
    {
      id: "damage_limit",
      label: "Choose preferred damage limit",
      options: [
        { value: "1250000", label: "€1,250,000" },
        { value: "2250000", label: "€2,250,000" },
      ],
    },
    {
      id: "own_risk",
      label: "What do you want to be your own risk?",
      options: [
        { value: "100", label: "€100" },
        { value: "none", label: "No excess" },
      ],
    },
  ],
  travel: [
    {
      id: "trip_type",
      label: "What type of travel insurance fits you best?",
      cardLayout: true,
      options: [
        {
          value: "continuous",
          label: "Continuous",
          badge: "Most popular",
          subText: "Choose this one if you:",
          bullets: [
            "Travels more than 2 weeks per year.",
            "Or travels more than once a year.",
            "Wants to be well insured at all times.",
          ],
          hasViewDetails: true,
        },
        {
          value: "short_term",
          label: "Short-term",
          subText: "Choose this one if you:",
          bullets: [
            "Travels less than 2 weeks a year.",
            "Travels a maximum of 1x per year.",
          ],
          hasViewDetails: true,
        },
      ],
      autoAdvance: true,
    },
    {
      id: "coverage_area",
      label: "Where do you travel to?",
      options: [
        { value: "europe", label: "Europe" },
        { value: "worldwide", label: "Worldwide" },
      ],
      autoAdvance: true,
    },
  ],
  car: [
    {
      id: "coverage_type",
      label: "What type of car insurance do you need?",
      options: [
        { value: "liability", label: "Liability only" },
        { value: "limited", label: "Limited casco" },
        { value: "full", label: "All-risk" },
      ],
    },
  ],
  legal: [
    {
      id: "coverage_modules",
      label: "What legal coverage do you need?",
      description: "Select the coverage areas that are relevant to you. Consumer coverage is always included.",
      options: [],
      customComponent: "legal_coverage",
    },
  ],
  accidents: [
    {
      id: "coverage",
      label: "Who do you want to insure?",
      options: [
        { value: "self", label: "Just me" },
        { value: "family", label: "My family" },
      ],
      autoAdvance: true,
    },
  ],
  caravan: [
    {
      id: "type",
      label: "What type of caravan do you have?",
      options: [
        { value: "touring", label: "Touring caravan" },
        { value: "static", label: "Static caravan" },
      ],
      autoAdvance: true,
    },
  ],
};

const DEFAULT_PREFERENCES: Record<string, Record<string, string>> = {
  liability: {
    dog: "no",
    damage_limit: "2250000",
    own_risk: "100",
  },
  travel: {
    own_risk: "500",
    sports: "no",
    extraordinary_costs: "no",
    insure_cash: "no",
    insure_accidents: "no",
    insure_medical: "yes",
    legal_assistance: "no",
    business_travel: "no",
    luggage: "no",
    cancellation: "no",
    roadside_assistance: "no",
    bike_coverage: "0",
  },
  legal: {
    coverage_modules: "consumer",
  },
};

export interface StepPreferencesHandle {
  handleBack: () => boolean; // returns true if handled internally
  handleNext: () => boolean; // returns true if handled internally
}

interface StepPreferencesProps {
  selectedInsurances: string[];
  preferences: Record<string, Record<string, string>>;
  firstName: string;
  phone: string;
  email: string;
  savings: number;
  onUpdatePreference: (insuranceId: string, questionId: string, value: string) => void;
  onUpdatePhone: (value: string) => void;
  onUpdateEmail: (value: string) => void;
  onAddInsurances: (ids: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPreferences = forwardRef<StepPreferencesHandle, StepPreferencesProps>(({
  selectedInsurances,
  preferences,
  firstName,
  phone,
  email,
  savings,
  onUpdatePreference,
  onUpdatePhone,
  onUpdateEmail,
  onAddInsurances,
  onNext,
  onBack,
}, ref) => {
  const [activeTab, setActiveTab] = useState(selectedInsurances[0]);
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);
  const [questionStep, setQuestionStep] = useState(0);
  const [showPhoneStep, setShowPhoneStep] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalSelection, setAddModalSelection] = useState<string[]>([]);
  const [contactMethod, setContactMethod] = useState<"phone" | "email">("phone");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<"left" | "right">("left");

  // Apply default preferences on mount
  useEffect(() => {
    selectedInsurances.forEach((id) => {
      const defaults = DEFAULT_PREFERENCES[id];
      if (defaults) {
        Object.entries(defaults).forEach(([qId, val]) => {
          if (!(preferences[id] || {})[qId]) {
            onUpdatePreference(id, qId, val);
          }
        });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const questions = QUESTIONS_BY_TYPE[activeTab] || [];
  const currentPrefs = preferences[activeTab] || {};
  const currentQuestion = questions[questionStep];

  const showAllQuestions = questions.every(q => !q.autoAdvance);
  const allQuestionsAnswered = questions.every((q) => currentPrefs[q.id]);

  // Total progress across all products
  const totalQuestions = selectedInsurances.reduce((sum, id) => sum + (QUESTIONS_BY_TYPE[id]?.length || 0), 0);
  const answeredQuestions = selectedInsurances.reduce((sum, id) => {
    const qs = QUESTIONS_BY_TYPE[id] || [];
    return sum + qs.filter(q => (preferences[id] || {})[q.id]).length;
  }, 0);
  const progressPercent = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  // Expose back/next handlers to parent
  useImperativeHandle(ref, () => ({
    handleBack: () => {
      if (showPhoneStep) {
        setShowPhoneStep(false);
        return true;
      }
      if (questionStep > 0) {
        setQuestionStep(questionStep - 1);
        return true;
      }
      const currentIndex = selectedInsurances.indexOf(activeTab);
      if (currentIndex > 0) {
        const prevTab = selectedInsurances[currentIndex - 1];
        animateTabSwitch(prevTab, "right");
        const prevQuestions = QUESTIONS_BY_TYPE[prevTab] || [];
        setQuestionStep(Math.max(0, prevQuestions.length - 1));
        return true;
      }
      return false;
    },
    handleNext: () => {
      if (showPhoneStep) {
        // Phone/email step done → proceed to next wizard step
        return false;
      }
      handleNextStep();
      return true; // handled internally
    },
  }), [showPhoneStep, questionStep, activeTab, selectedInsurances, preferences]);

  const animateTabSwitch = (newTab: string, direction: "left" | "right" = "left") => {
    setTransitionDirection(direction);
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTransitioning(false);
    }, 200);
  };

  const handleSelectOption = (questionId: string, value: string) => {
    onUpdatePreference(activeTab, questionId, value);

    if (currentQuestion?.autoAdvance) {
      setTimeout(() => {
        if (questionStep < questions.length - 1) {
          setQuestionStep(questionStep + 1);
        }
        // Don't auto-complete tab - user must click Next
      }, 300);
    }
  };

  const completeCurrentTab = () => {
    if (!completedTabs.includes(activeTab)) {
      setCompletedTabs((prev) => [...prev, activeTab]);
    }
    const currentIndex = selectedInsurances.indexOf(activeTab);
    if (currentIndex < selectedInsurances.length - 1) {
      const nextTab = selectedInsurances[currentIndex + 1];
      animateTabSwitch(nextTab);
      setQuestionStep(0);
    } else {
      setShowPhoneStep(true);
    }
  };

  const handleNextStep = () => {
    // Check if all questions for current tab are answered
    const tabQuestions = QUESTIONS_BY_TYPE[activeTab] || [];
    const tabPrefs = preferences[activeTab] || {};
    const allAnswered = tabQuestions.every(q => tabPrefs[q.id]);
    
    if (!allAnswered) return; // Can't proceed without answering all

    if (showAllQuestions) {
      completeCurrentTab();
    } else if (questionStep < questions.length - 1) {
      setQuestionStep(questionStep + 1);
    } else {
      completeCurrentTab();
    }
  };

  const handleTabClick = (id: string) => {
    if (id === activeTab) return;
    const currentIndex = selectedInsurances.indexOf(activeTab);
    const newIndex = selectedInsurances.indexOf(id);
    animateTabSwitch(id, newIndex > currentIndex ? "left" : "right");
    setQuestionStep(0);
    setShowPhoneStep(false);
  };

  // Can proceed on current tab?
  const canProceedCurrentTab = () => {
    if (showPhoneStep) {
      return contactMethod === "phone" 
        ? phone.replace(/\s/g, "").length > 4
        : email.includes("@");
    }
    const tabQuestions = QUESTIONS_BY_TYPE[activeTab] || [];
    const tabPrefs = preferences[activeTab] || {};
    if (showAllQuestions) {
      return tabQuestions.every(q => tabPrefs[q.id]);
    }
    // For auto-advance, check if last question or current question is answered
    if (questionStep >= tabQuestions.length - 1) {
      return tabQuestions.every(q => tabPrefs[q.id]);
    }
    return !!tabPrefs[tabQuestions[questionStep]?.id];
  };

  // Add products modal
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
      onAddInsurances(addModalSelection);
    }
    setShowAddModal(false);
  };

  const formattedSavings = savings.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
  });

  // Extra savings from adding more products
  const extraSavings = nonSelectedProducts.reduce((sum, t) => sum + t.savings, 0);

  // Transition classes
  const getTransitionClass = () => {
    if (isTransitioning) {
      return transitionDirection === "left" 
        ? "opacity-0 translate-x-4 transition-all duration-200" 
        : "opacity-0 -translate-x-4 transition-all duration-200";
    }
    return "opacity-100 translate-x-0 transition-all duration-200";
  };

  // Product tabs
  const renderProductTabs = () => (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {selectedInsurances.map((id) => {
        const ins = INSURANCE_TYPES.find((t) => t.id === id)!;
        const isActive = activeTab === id && !showPhoneStep;
        const isComplete = completedTabs.includes(id);
        return (
          <button
            key={id}
            onClick={() => handleTabClick(id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-semibold transition-all border h-[48px] ${
              isActive
                ? "bg-foreground text-background border-foreground"
                : "bg-white border-tab-border text-foreground"
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
      <button
        onClick={handleOpenAddModal}
        className="h-[48px] px-4 rounded-full border border-tab-border bg-white flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  // Add modal
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Estimated savings:</span>
              <span className="inline-flex items-center gap-1 bg-success/10 border border-success/20 rounded-full px-3 py-1">
                <span className="text-base font-bold text-success">{formattedSavings}</span>
              </span>
            </div>
            <button
              onClick={handleSaveAddModal}
              disabled={addModalSelection.length === 0}
              className="px-6 py-3 rounded-full text-success-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{
                background: 'linear-gradient(180deg, hsl(121 72% 48%) 0%, hsl(121 72% 38%) 100%)',
                boxShadow: '0 4px 12px -2px hsla(121, 72%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)',
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Phone/email collection step
  if (showPhoneStep) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-[32px] font-bold text-foreground mb-6">Set your preferences</h1>

        {renderProductTabs()}
        <Progress value={progressPercent} className="h-2 [&>div]:bg-success mb-6" />

        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-6">
            <img src={tacoAvatar} alt="Tako" className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5" />
            <p className="text-base font-semibold text-foreground">
              We are almost there, {firstName} 🙌
              <br />
              <span className="font-normal text-muted-foreground">
                Just one more detail so we can send you your personal offer!
              </span>
            </p>
          </div>

          {/* Contact method toggle */}
          <div className="flex items-center gap-2 mb-5">
            <button
              onClick={() => setContactMethod("phone")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                contactMethod === "phone"
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white border-border text-foreground hover:bg-muted"
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone number
            </button>
            <button
              onClick={() => setContactMethod("email")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                contactMethod === "email"
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white border-border text-foreground hover:bg-muted"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email address
            </button>
          </div>

          <div className="max-w-lg">
            {contactMethod === "phone" ? (
              <FloatingLabelInput
                label="Phone number (+31)"
                value={phone}
                onChange={(e) => onUpdatePhone(e.target.value)}
                maxLength={15}
                inputMode="tel"
              />
            ) : (
              <FloatingLabelInput
                label="Email address"
                value={email}
                onChange={(e) => onUpdateEmail(e.target.value)}
                type="email"
              />
            )}
          </div>

          <div className="flex items-start gap-2 mt-6 text-muted-foreground">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-sm">
              {contactMethod === "phone"
                ? "We'll use your phone number to send you a verification code and keep you updated on your offer. No spam!"
                : "We'll use your email to send your personal offer and keep it safe for you. No spam, no obligations!"
              }
            </p>
          </div>
        </div>
        {renderAddModal()}
      </div>
    );
  }

  // Get intro message for current product
  const getIntroMessage = () => {
    const ins = INSURANCE_TYPES.find(t => t.id === activeTab);
    if (!ins) return null;
    if (showAllQuestions) {
      return `${firstName}, now I have a few questions about the ${ins.label.toLowerCase()} insurance.`;
    }
    return null;
  };

  const introMessage = getIntroMessage();

  return (
    <div className="animate-fade-in">
      <h1 className="text-[32px] font-bold text-foreground mb-6">Set your preferences</h1>

      {/* Product tabs */}
      {renderProductTabs()}

      {/* Progress bar */}
      <Progress value={progressPercent} className="h-2 [&>div]:bg-success mb-6" />

      {/* Questions card with transition */}
      <div key={activeTab} className={getTransitionClass()}>
        <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
          {showAllQuestions ? (
            <>
              <div className="flex items-start gap-3 mb-6">
                <img src={tacoAvatar} alt="Tako" className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5" />
                <p className="text-base font-semibold text-foreground">
                  {introMessage}
                </p>
              </div>

              <div className="space-y-6">
                {questions.map((q) => (
                  <div key={q.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-base font-semibold text-foreground">{q.label}</p>
                      {q.infoText && <Info className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div className={`grid gap-3 ${q.options.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                      {q.options.map((opt) => {
                        const isSelected = currentPrefs[q.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleSelectOption(q.id, opt.value)}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left shadow-sm ${
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
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-8">
                <img src={tacoAvatar} alt="Tako" className="w-10 h-10 rounded-full object-cover shrink-0" />
                <p className="text-base font-semibold text-foreground">
                  {currentQuestion?.label}
                </p>
              </div>

              {currentQuestion?.description && (
                <div className="mb-6">
                  <p className="text-sm text-foreground whitespace-pre-line">{currentQuestion.description}</p>
                </div>
              )}

              {currentQuestion?.cardLayout ? (
                <div className="grid gap-4 grid-cols-1">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = currentPrefs[currentQuestion.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(currentQuestion.id, opt.value)}
                        className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all text-left shadow-sm ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-3 w-full">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? "border-primary" : "border-muted-foreground/40"
                            }`}
                          >
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                          </div>
                          <span className="text-base font-bold text-foreground flex-1">{opt.label}</span>
                          {opt.badge && (
                            <span className="text-xs font-medium bg-success/10 text-success px-2.5 py-1 rounded-full">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        {opt.subText && (
                          <p className="text-sm text-muted-foreground mb-2 ml-8">{opt.subText}</p>
                        )}
                        {opt.bullets && (
                          <ul className="space-y-1.5 ml-8 mb-3">
                            {opt.bullets.map((bullet, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {opt.hasViewDetails && (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary ml-8 mt-1">
                            View details <ChevronRight className="w-4 h-4" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className={`grid gap-3 ${currentQuestion?.options.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {currentQuestion?.options.map((opt) => {
                    const isSelected = currentPrefs[currentQuestion.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(currentQuestion.id, opt.value)}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all text-left shadow-sm ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? "border-primary" : "border-muted-foreground/40"
                            }`}
                          >
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                          </div>
                          <span className="text-sm font-medium text-foreground">{opt.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {opt.badge && (
                            <span className="text-xs font-medium bg-success/10 text-success px-2 py-1 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              {opt.badge}
                            </span>
                          )}
                          {currentQuestion.options.length > 2 && (
                            <Info className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion?.infoText && (
                <div className="flex items-start gap-2 mt-6 text-muted-foreground">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-sm">{currentQuestion.infoText}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {renderAddModal()}
    </div>
  );
});

StepPreferences.displayName = "StepPreferences";

export default StepPreferences;
