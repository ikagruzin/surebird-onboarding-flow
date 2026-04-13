import { TacoMessage } from "./taco-message";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { ValidationError } from "./validation-error";

interface StepLegalAdditionalQuestionsProps {
  answers: Record<string, string>;
  onUpdateAnswer: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

export const StepLegalAdditionalQuestions = ({
  answers,
  onUpdateAnswer,
  animateTaco,
  errors,
  onClearError,
}: StepLegalAdditionalQuestionsProps) => {
  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        message="A few more details for your legal expenses insurance ⚖️"
        animate={animateTaco}
      />

      <div className="space-y-3">
        {/* Profession — always shown */}
        <div className="rounded-2xl border-2 border-input bg-card p-5 space-y-3">
          <p className="text-sm font-medium text-foreground leading-snug">
            What is your profession?
          </p>
          <FloatingLabelInput
            label="Profession"
            value={answers.profession || ""}
            onChange={(e) => {
              onUpdateAnswer("profession", e.target.value);
              onClearError?.("legalProfession");
            }}
            className={errors?.legalProfession ? "border-destructive" : ""}
          />
          <ValidationError message={errors?.legalProfession} />
        </div>

        {/* Working */}
        <div className="space-y-0">
          <div className="rounded-2xl border-2 border-input bg-card p-5 flex items-start gap-4">
            <p className="flex-1 text-sm font-medium text-foreground leading-snug pt-1">
              Are you currently employed?
            </p>
            <div className="flex shrink-0 rounded-xl border border-input overflow-hidden">
              <button
                type="button"
                onClick={() => onUpdateAnswer("working", "yes")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  answers.working === "yes" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => onUpdateAnswer("working", "no")}
                className={`px-4 py-2 text-sm font-medium transition-colors border-l border-input ${
                  answers.working === "no" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                No
              </button>
            </div>
          </div>
          {answers.working === "yes" && (
            <div className="pl-5 pr-5 pb-4 pt-3">
              <FloatingLabelInput
                label="Which company do you work for?"
                value={answers.company || ""}
                onChange={(e) => onUpdateAnswer("company", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Disability */}
        <div className="space-y-0">
          <div className="rounded-2xl border-2 border-input bg-card p-5 flex items-start gap-4">
            <p className="flex-1 text-sm font-medium text-foreground leading-snug pt-1">
              Do you have a disability benefit?
            </p>
            <div className="flex shrink-0 rounded-xl border border-input overflow-hidden">
              <button
                type="button"
                onClick={() => onUpdateAnswer("disability", "yes")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  answers.disability === "yes" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => onUpdateAnswer("disability", "no")}
                className={`px-4 py-2 text-sm font-medium transition-colors border-l border-input ${
                  answers.disability === "no" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                No
              </button>
            </div>
          </div>
          {answers.disability === "yes" && (
            <div className="pl-5 pr-5 pb-4 pt-3">
              <FloatingLabelInput
                label="What disability benefit do you have?"
                value={answers.disabilityDetails || ""}
                onChange={(e) => onUpdateAnswer("disabilityDetails", e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Reorganization */}
        <div className="rounded-2xl border-2 border-input bg-card p-5 flex items-start gap-4">
          <p className="flex-1 text-sm font-medium text-foreground leading-snug pt-1">
            Is a reorganization currently underway or is there a short-term restructuring planned?
          </p>
          <div className="flex shrink-0 rounded-xl border border-input overflow-hidden">
            <button
              type="button"
              onClick={() => onUpdateAnswer("reorganization", "yes")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                answers.reorganization === "yes" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => onUpdateAnswer("reorganization", "no")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-l border-input ${
                answers.reorganization === "no" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
