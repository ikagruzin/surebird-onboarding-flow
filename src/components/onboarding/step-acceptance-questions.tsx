import { Info } from "lucide-react";
import { TacoMessage } from "./taco-message";
import { ValidationError } from "./validation-error";
import { Checkbox } from "@/components/ui/checkbox";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import tacoAvatar from "@/assets/taco-avatar.jpg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AcceptanceQuestion {
  id: string;
  text: string;
  tooltip: string;
  defaultAnswer: "yes" | "no";
  explanationFields?: { key: string; label: string }[];
}

const QUESTIONS: AcceptanceQuestion[] = [
  {
    id: "cancelled",
    text: "Has an insurance policy been cancelled or refused in the last 8 years?",
    tooltip: "Insurers want to see if a previous policy was ended early by a provider.",
    defaultAnswer: "no",
    explanationFields: [{ key: "cancelled_explanation", label: "Explanation of termination(s)" }],
  },
  {
    id: "criminal",
    text: "Have you had contact with police/judiciary or been involved in a criminal offense?",
    tooltip: "A standard check to confirm there are no recent criminal convictions affecting your coverage.",
    defaultAnswer: "no",
    explanationFields: [{ key: "criminal_explanation", label: "Details of the offense or contact" }],
  },
  {
    id: "claims",
    text: "Have you had more than one loss or claim in the last 5 years?",
    tooltip: "Having multiple claims is fine—we just need to inform the insurer for an accurate calculation.",
    defaultAnswer: "no",
    explanationFields: [
      { key: "claims_explanation", label: "Explanation of claims" },
      { key: "claims_count", label: "Number of claims" },
    ],
  },
  {
    id: "bankrupt",
    text: "Have you been declared bankrupt or are you in debt restructuring?",
    tooltip: "This helps confirm financial stability for your monthly premium payments.",
    defaultAnswer: "no",
    explanationFields: [{ key: "bankrupt_explanation", label: "Details of bankruptcy or debt restructuring" }],
  },
  {
    id: "fraud",
    text: "Have you ever been involved in insurance fraud or deception?",
    tooltip: "A mandatory verification required for all financial service applications in the Netherlands.",
    defaultAnswer: "no",
    explanationFields: [{ key: "fraud_explanation", label: "Details of the fraud or deception" }],
  },
  {
    id: "bailiff",
    text: "Has a bailiff currently seized any of your income or assets?",
    tooltip: "Standard check regarding current financial mandates.",
    defaultAnswer: "no",
    explanationFields: [{ key: "bailiff_explanation", label: "Details of the seizure" }],
  },
  {
    id: "healthy",
    text: "Are all insured persons healthy and without defects?",
    tooltip: "Ensures everyone in your bundle is eligible for the specific coverage selected.",
    defaultAnswer: "yes",
    explanationFields: [{ key: "healthy_explanation", label: "Details of health condition or defect" }],
  },
];

interface StepAcceptanceQuestionsProps {
  answers: Record<string, string>;
  onUpdateAnswer: (questionId: string, value: string) => void;
  confirmed: boolean;
  onToggleConfirmed: (value: boolean) => void;
  explanations: Record<string, string>;
  onUpdateExplanation: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

export const StepAcceptanceQuestions = ({
  answers,
  onUpdateAnswer,
  confirmed,
  onToggleConfirmed,
  explanations,
  onUpdateExplanation,
  animateTaco,
  errors,
  onClearError,
}: StepAcceptanceQuestionsProps) => {
  const hasYesAnswer = QUESTIONS.some(
    (q) => q.id !== "healthy" && answers[q.id] === "yes"
  );
  const hasHealthyNo = answers["healthy"] === "no";

  const shouldShowFields = (q: AcceptanceQuestion): boolean => {
    if (q.id === "healthy") return answers[q.id] === "no";
    return answers[q.id] === "yes";
  };

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        message="Almost there! Just a few final checks 📋 We need to confirm a few standard legal details required by all Dutch insurers. Review and correct where necessary. You are responsible for providing accurate and complete information."
        animate={animateTaco}
      />

      <div className="space-y-4">
        <div className="rounded-2xl border-2 border-input bg-primary/5 p-5 flex gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Why do we ask this?
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              These questions are a mandatory part of Dutch insurance law. They
              ensure your policy is 100% valid so that if you ever need to make
              a claim, there are no administrative surprises.
            </p>
          </div>
        </div>
      </div>

      <TooltipProvider delayDuration={200}>
        <div className="space-y-3">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="rounded-2xl border-2 border-input bg-card p-5 space-y-3">
              <div className="flex items-start gap-4">
                <div className="flex-1 flex items-start gap-2">
                  <p className="text-sm font-medium text-foreground leading-snug pt-1">
                    {q.text}
                  </p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="shrink-0 mt-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-64 text-xs">
                      {q.tooltip}
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex shrink-0 rounded-xl border border-input overflow-hidden">
                  <button
                    type="button"
                    onClick={() => { onUpdateAnswer(q.id, "yes"); onClearError?.("acceptanceQuestions"); }}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      answers[q.id] === "yes"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => { onUpdateAnswer(q.id, "no"); onClearError?.("acceptanceQuestions"); }}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-l border-input ${
                      answers[q.id] === "no"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Conditional explanation fields — inside the card */}
              {shouldShowFields(q) && q.explanationFields && (
                <div className="space-y-3">
                  {q.explanationFields.map((field) => (
                    <FloatingLabelInput
                      key={field.key}
                      label={field.label}
                      value={explanations[field.key] || ""}
                      onChange={(e) => onUpdateExplanation(field.key, e.target.value)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <ValidationError message={errors?.acceptanceQuestions} />
      </TooltipProvider>

      {(hasYesAnswer || hasHealthyNo) && (
        <div className="flex items-center gap-3 animate-fade-in">
          <img
            src={tacoAvatar}
            alt="Taco"
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="bg-accent/10 border border-accent/30 rounded-2xl rounded-tl-md px-5 py-3">
            <p className="text-sm text-foreground">
              No worries — Taco will personally review this with the insurer to
              find a solution for you. 💪
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="rounded-2xl border-2 border-input bg-card p-5">
          <label
            className="flex items-start gap-3 cursor-pointer"
            onClick={() => {
              onToggleConfirmed(!confirmed);
            }}
          >
            <Checkbox
              checked={confirmed}
              onCheckedChange={(val) => onToggleConfirmed(!!val)}
              className="mt-0.5"
            />
            <span className="text-sm text-foreground leading-snug">
              I have reviewed all prefilled answers and confirmed that they are complete and accurate to the best of my knowledge
            </span>
          </label>
        </div>
        <ValidationError message={errors?.acceptanceConfirmed} />
      </div>
    </div>
  );
};
