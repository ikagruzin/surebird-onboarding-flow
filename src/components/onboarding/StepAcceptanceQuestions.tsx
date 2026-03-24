import { Info } from "lucide-react";
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
}

const QUESTIONS: AcceptanceQuestion[] = [
  {
    id: "cancelled",
    text: "Has an insurance policy been cancelled or refused in the last 8 years?",
    tooltip: "Insurers want to see if a previous policy was ended early by a provider.",
  },
  {
    id: "criminal",
    text: "Have you had contact with police/judiciary or been involved in a criminal offense?",
    tooltip: "A standard check to confirm there are no recent criminal convictions affecting your coverage.",
  },
  {
    id: "claims",
    text: "Have you had more than one loss or claim in the last 5 years?",
    tooltip: "Having multiple claims is fine—we just need to inform the insurer for an accurate calculation.",
  },
  {
    id: "bankrupt",
    text: "Have you been declared bankrupt or are you in debt restructuring?",
    tooltip: "This helps confirm financial stability for your monthly premium payments.",
  },
  {
    id: "fraud",
    text: "Have you ever been involved in insurance fraud or deception?",
    tooltip: "A mandatory verification required for all financial service applications in the Netherlands.",
  },
  {
    id: "bailiff",
    text: "Has a bailiff currently seized any of your income or assets?",
    tooltip: "Standard check regarding current financial mandates.",
  },
  {
    id: "healthy",
    text: "Are all insured persons healthy and without defects?",
    tooltip: "Ensures everyone in your bundle is eligible for the specific coverage selected.",
  },
];

interface StepAcceptanceQuestionsProps {
  answers: Record<string, string>;
  onUpdateAnswer: (questionId: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepAcceptanceQuestions = ({
  answers,
  onUpdateAnswer,
}: StepAcceptanceQuestionsProps) => {
  const hasYesAnswer = Object.values(answers).some((v) => v === "yes");

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      {/* Taco message */}
      <div className="flex items-center gap-3">
        <img
          src={tacoAvatar}
          alt="Taco"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="bg-muted rounded-2xl rounded-tl-md px-5 py-3">
          <p className="text-base text-foreground">
            Almost there! Just a few final checks 📋 We need to confirm a few standard legal details required by all Dutch insurers.
          </p>
        </div>
      </div>

      {/* Why we ask card */}
      <div className="space-y-4">

        {/* Why we ask card */}
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

      {/* Questions list */}
      <TooltipProvider delayDuration={200}>
        <div className="space-y-3">
          {QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="rounded-2xl border-2 border-input bg-card p-5 flex items-start gap-4"
            >
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
                  <TooltipContent
                    side="top"
                    className="max-w-64 text-xs"
                  >
                    {q.tooltip}
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Toggle group */}
              <div className="flex shrink-0 rounded-xl border border-input overflow-hidden">
                <button
                  type="button"
                  onClick={() => onUpdateAnswer(q.id, "yes")}
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
                  onClick={() => onUpdateAnswer(q.id, "no")}
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
          ))}
        </div>
      </TooltipProvider>

      {/* Taco review message for "Yes" answers */}
      {hasYesAnswer && (
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
    </div>
  );
};

export default StepAcceptanceQuestions;
