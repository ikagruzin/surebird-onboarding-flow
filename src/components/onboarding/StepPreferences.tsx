import { ChevronLeft, ChevronRight, Check, Plus, Home, Umbrella, Plane, Car, Scale, Zap, Caravan } from "lucide-react";
import { INSURANCE_TYPES } from "./types";
import { useState } from "react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Plane: <Plane className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Umbrella: <Umbrella className="w-4 h-4" />,
  Car: <Car className="w-4 h-4" />,
  Scale: <Scale className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Caravan: <Caravan className="w-4 h-4" />,
};

interface PreferenceQuestion {
  id: string;
  label: string;
  description?: string;
  options: { value: string; label: string }[];
}

const QUESTIONS_BY_TYPE: Record<string, PreferenceQuestion[]> = {
  home: [
    {
      id: "own_risk",
      label: "Your own risk?",
      description: "This is what you have to pay if you file a claim. We recommend choosing an amount that wouldn't cause you much stress if you suddenly lost it.",
      options: [
        { value: "100", label: "€100" },
        { value: "250", label: "€250" },
        { value: "500", label: "€500" },
        { value: "none", label: "No excess" },
      ],
    },
    {
      id: "owner",
      label: "Are you the owner of the house?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
  ],
  liability: [
    {
      id: "dog",
      label: "Do you want to co-insure your dog?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "damage_limit",
      label: "Choose preferred damage limit",
      description: "Damages above €1.25 million are quite rare, but the difference in premiums is very small. That's why we recommend €2.5 million, for that extra bit of certainty.",
      options: [
        { value: "1250000", label: "€1,250,000" },
        { value: "2250000", label: "€2,250,000" },
      ],
    },
    {
      id: "own_risk",
      label: "What do you want to be your own risk?",
      description: "This is what you have to pay yourself when you file a claim. We recommend choosing an amount that would not cause much stress if you suddenly lost it.",
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
    },
  ],
};

interface StepPreferencesProps {
  selectedInsurances: string[];
  preferences: Record<string, Record<string, string>>;
  onUpdatePreference: (insuranceId: string, questionId: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepPreferences = ({
  selectedInsurances,
  preferences,
  onUpdatePreference,
  onNext,
  onBack,
}: StepPreferencesProps) => {
  const [activeTab, setActiveTab] = useState(selectedInsurances[0]);
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);

  const activeInsurance = INSURANCE_TYPES.find((t) => t.id === activeTab);
  const questions = QUESTIONS_BY_TYPE[activeTab] || [];
  const currentPrefs = preferences[activeTab] || {};

  const allQuestionsAnswered = questions.every((q) => currentPrefs[q.id]);

  const handleNext = () => {
    if (!completedTabs.includes(activeTab) && allQuestionsAnswered) {
      setCompletedTabs((prev) => [...prev, activeTab]);
    }

    const currentIndex = selectedInsurances.indexOf(activeTab);
    if (currentIndex < selectedInsurances.length - 1) {
      setActiveTab(selectedInsurances[currentIndex + 1]);
    } else {
      onNext();
    }
  };

  const allDone = selectedInsurances.every(
    (id) =>
      (QUESTIONS_BY_TYPE[id] || []).every(
        (q) => (preferences[id] || {})[q.id]
      )
  );

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm font-medium text-foreground border border-border rounded-lg px-4 py-2 mb-6 hover:bg-muted transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
        Specify your preferences
      </h1>

      {/* Pill tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {selectedInsurances.map((id) => {
          const ins = INSURANCE_TYPES.find((t) => t.id === id)!;
          const isActive = activeTab === id;
          const isComplete = completedTabs.includes(id);
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-foreground text-background"
                  : "bg-card border border-border text-foreground hover:bg-muted"
              }`}
            >
              {isComplete ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                ICON_MAP[ins.icon]
              )}
              {ins.label}
            </button>
          );
        })}
        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground">
          <Plus className="w-4 h-4" />
        </div>
      </div>

      {/* Questions */}
      <div className="bg-card rounded-xl border border-border p-6 max-w-xl">
        <h2 className="text-xl font-semibold text-foreground mb-6">General information</h2>
        <div className="space-y-8">
          {questions.map((q) => (
            <div key={q.id}>
              <h3 className="font-semibold text-foreground mb-1">{q.label}</h3>
              {q.description && (
                <p className="text-sm text-muted-foreground mb-3">{q.description}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt) => {
                  const isSelected = currentPrefs[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => onUpdatePreference(activeTab, q.id, opt.value)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-lg border transition-all text-left ${
                        isSelected
                          ? "border-primary bg-info-light"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-primary" : "border-border"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <span className="font-medium text-foreground">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          disabled={!allQuestionsAnswered}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3 rounded-full font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          Next step
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StepPreferences;
