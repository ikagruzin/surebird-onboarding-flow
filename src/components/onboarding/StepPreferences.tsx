import { useState, useEffect } from "react";
import { Check, Plus, Info, X } from "lucide-react";
import { INSURANCE_TYPES } from "./types";
import { Progress } from "@/components/ui/progress";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
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
  options: { value: string; label: string; badge?: string }[];
  infoText?: string;
  autoAdvance?: boolean;
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
      id: "coverage",
      label: "What type of coverage do you need?",
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
      id: "type",
      label: "What legal assistance do you need?",
      options: [
        { value: "basic", label: "Basic" },
        { value: "extended", label: "Extended" },
      ],
      autoAdvance: true,
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
};

interface StepPreferencesProps {
  selectedInsurances: string[];
  preferences: Record<string, Record<string, string>>;
  firstName: string;
  phone: string;
  onUpdatePreference: (insuranceId: string, questionId: string, value: string) => void;
  onUpdatePhone: (value: string) => void;
  onAddInsurances: (ids: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPreferences = ({
  selectedInsurances,
  preferences,
  firstName,
  phone,
  onUpdatePreference,
  onUpdatePhone,
  onAddInsurances,
  onNext,
  onBack,
}: StepPreferencesProps) => {
  const [activeTab, setActiveTab] = useState(selectedInsurances[0]);
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);
  const [questionStep, setQuestionStep] = useState(0);
  const [showPhoneStep, setShowPhoneStep] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalSelection, setAddModalSelection] = useState<string[]>([]);

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

  const handleSelectOption = (questionId: string, value: string) => {
    onUpdatePreference(activeTab, questionId, value);

    if (currentQuestion?.autoAdvance) {
      setTimeout(() => {
        if (questionStep < questions.length - 1) {
          setQuestionStep(questionStep + 1);
        } else {
          completeCurrentTab();
        }
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
      setActiveTab(nextTab);
      setQuestionStep(0);
    } else {
      setShowPhoneStep(true);
    }
  };

  const handleNextStep = () => {
    if (showAllQuestions && allQuestionsAnswered) {
      completeCurrentTab();
    } else if (questionStep < questions.length - 1) {
      setQuestionStep(questionStep + 1);
    } else {
      completeCurrentTab();
    }
  };

  // Handle switching tabs freely
  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setQuestionStep(0);
    setShowPhoneStep(false);
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

  // Shared product tabs renderer
  const renderProductTabs = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {selectedInsurances.map((id) => {
        const ins = INSURANCE_TYPES.find((t) => t.id === id)!;
        const isActive = activeTab === id && !showPhoneStep;
        const isComplete = completedTabs.includes(id);
        return (
          <button
            key={id}
            onClick={() => handleTabClick(id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-semibold transition-all shadow-sm ${
              isActive
                ? "bg-foreground text-background"
                : "bg-white border-2 border-border text-foreground"
            }`}
          >
            {isComplete ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <img
                src={ICON_MAP[ins.icon]}
                alt={ins.label}
                className={`w-8 h-8 ${isActive ? "brightness-0 invert" : ""}`}
              />
            )}
            {ins.label}
          </button>
        );
      })}
      <button
        onClick={handleOpenAddModal}
        className="w-11 h-11 rounded-full border-2 border-border bg-white flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors shadow-sm"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  // Add modal
  const renderAddModal = () => {
    if (!showAddModal) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
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
                    className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl border-2 transition-all text-left ${
                      isChecked
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        isChecked ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <img src={ICON_MAP[ins.icon]} alt={ins.label} className="w-7 h-7" />
                    <span className="text-sm font-medium text-foreground">{ins.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-3 rounded-full border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAddModal}
              disabled={addModalSelection.length === 0}
              className="flex-1 px-4 py-3 rounded-full bg-success text-success-foreground font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Phone collection step
  if (showPhoneStep) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-[32px] font-bold text-foreground mb-6">Set your preferences</h1>

        {renderProductTabs()}
        <Progress value={progressPercent} className="h-2 [&>div]:bg-success mb-6" />

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-6">
            <img src={tacoAvatar} alt="Tako" className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5" />
            <p className="text-base font-semibold text-foreground">
              We are almost there, {firstName} 🙌
              <br />
              Just a few more details and you'll get your personal offer!
            </p>
          </div>

          <div className="max-w-lg">
            <FloatingLabelInput
              label="+31"
              value={phone}
              onChange={(e) => onUpdatePhone(e.target.value)}
              maxLength={15}
              inputMode="tel"
            />
          </div>

          <div className="flex items-start gap-2 mt-6 text-muted-foreground">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-sm">
              Enter your email address below to save your personal offer. This way you always have it at hand when you need it. No spam, no obligations: just store your overview safely!
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

      {/* Questions card */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
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
            <div className="flex items-start gap-3 mb-8">
              <img src={tacoAvatar} alt="Tako" className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5" />
              <p className="text-base font-semibold text-foreground">
                {currentQuestion?.label}
              </p>
            </div>

            {currentQuestion?.description && (
              <div className="mb-6">
                <p className="text-sm text-foreground whitespace-pre-line">{currentQuestion.description}</p>
              </div>
            )}

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

            {currentQuestion?.infoText && (
              <div className="flex items-start gap-2 mt-6 text-muted-foreground">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-sm">{currentQuestion.infoText}</p>
              </div>
            )}
          </>
        )}
      </div>
      {renderAddModal()}
    </div>
  );
};

export default StepPreferences;
