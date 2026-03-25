import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import TacoMessage from "./TacoMessage";

interface StepLoadingProps {
  onComplete: () => void;
  animateTaco?: boolean;
}

const STEPS = [
  "Analysing all your data",
  "Checking all insurance policies",
  "Preparing your offer",
];

const StepLoading = ({ onComplete, animateTaco }: StepLoadingProps) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, i]);
      }, (i + 1) * 1200)
    );

    const finalTimer = setTimeout(() => {
      onComplete();
    }, STEPS.length * 1200 + 800);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, [onComplete]);

  return (
    <div className="animate-fade-in">
      <TacoMessage
        message="I am looking for the best offer for you..."
        animate={animateTaco}
      />

      <div className="bg-card rounded-3xl border border-border p-6 shadow-sm max-w-lg">
        <div className="mb-4">
          <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
        </div>

        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm transition-opacity duration-300 ${
                completedSteps.includes(i) ? "opacity-100" : "opacity-40"
              }`}
            >
              <Check className={`w-4 h-4 shrink-0 ${completedSteps.includes(i) ? "text-success" : "text-muted-foreground"}`} />
              <span className="text-foreground">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepLoading;
