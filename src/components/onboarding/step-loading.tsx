import { useState, useEffect, useCallback } from "react";
import { Check, Loader2, SkipForward } from "lucide-react";
import { TacoMessage } from "./taco-message";
import { useT } from "@/i18n/LanguageContext";
import trustpilotReview from "@/assets/trustpilot-review.svg";

const USP_INTERVAL = 4500; // ~4.5s per card
const FINAL_CARD_PAUSE = 3000; // 3s after last card

interface StepLoadingProps {
  onComplete: () => void;
  animateTaco?: boolean;
}

const INITIAL_DELAY = 4000; // 4s before first card

export const StepLoading = ({ onComplete, animateTaco }: StepLoadingProps) => {
  const [visibleCards, setVisibleCards] = useState(0);
  const [completedChecks, setCompletedChecks] = useState<number[]>([]);

  const stableOnComplete = useCallback(onComplete, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Card 1 + checkmark 1
    timers.push(setTimeout(() => {
      setVisibleCards(1);
      setCompletedChecks([0]);
    }, INITIAL_DELAY));

    // Card 2
    timers.push(setTimeout(() => setVisibleCards(2), INITIAL_DELAY + USP_INTERVAL));

    // Card 3 + checkmark 2
    timers.push(setTimeout(() => {
      setVisibleCards(3);
      setCompletedChecks([0, 1]);
    }, INITIAL_DELAY + USP_INTERVAL * 2));

    // Card 4 + checkmark 3
    timers.push(setTimeout(() => {
      setVisibleCards(4);
      setCompletedChecks([0, 1, 2]);
    }, INITIAL_DELAY + USP_INTERVAL * 3));

    // Navigate to offer
    timers.push(setTimeout(() => {
      stableOnComplete();
    }, INITIAL_DELAY + USP_INTERVAL * 3 + FINAL_CARD_PAUSE));

    return () => timers.forEach(clearTimeout);
  }, [stableOnComplete]);

  return (
    <div className="animate-fade-in">
      <TacoMessage
        message="I am looking for the best offer for you..."
        animate={animateTaco}
      />

      {/* Checkmark progress */}
      <div className="bg-card rounded-3xl border border-border p-6 shadow-sm max-w-lg mb-8">
        {completedChecks.length < CHECKMARK_STEPS.length && (
          <div className="mb-4">
            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        )}

        <div className="space-y-3">
          {CHECKMARK_STEPS.map((step, i) => {
            const isDone = completedChecks.includes(i);
            return (
              <div
                key={i}
                className={`flex items-center gap-2 text-sm transition-all duration-500 ${
                  isDone ? "opacity-100" : "opacity-40"
                }`}
              >
                <Check
                  className={`w-4 h-4 shrink-0 transition-colors duration-500 ${
                    isDone ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span className="text-foreground">{step}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trustpilot Review */}
      <div className="flex justify-center my-8 max-w-lg">
        <img src={trustpilotReview} alt="Trustpilot 4.6 Excellent" className="h-9" />
      </div>

      {/* USP Card Stack */}
      <div className="relative max-w-lg" style={{ minHeight: visibleCards > 0 ? "200px" : "0" }}>
        {USP_CARDS.map((card, i) => {
          if (i >= visibleCards) return null;

          const cardsAbove = visibleCards - 1 - i; // how many cards are stacked on top
          const offsetY = cardsAbove * 10;
          const scale = 1 - cardsAbove * 0.02;
          const isTop = i === visibleCards - 1;

          return (
            <div
              key={i}
              className="absolute inset-x-0 bottom-0 transition-all duration-700 ease-out"
              style={{
                transform: `translateY(-${offsetY}px) scale(${scale})`,
                zIndex: i + 1,
                animation: isTop ? "usp-slide-up 0.6s ease-out" : undefined,
              }}
            >
              <div
                className={`flex flex-col p-6 rounded-2xl border border-border bg-card transition-shadow duration-500 ${
                  isTop
                    ? "shadow-lg"
                    : cardsAbove === 1
                    ? "shadow-md"
                    : "shadow-sm"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dev skip button */}
      <button
        onClick={stableOnComplete}
        className="fixed bottom-4 right-4 z-[9999] inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium opacity-70 hover:opacity-100 transition-opacity"
        title="Skip loading (dev only)"
      >
        <SkipForward className="w-3.5 h-3.5" />
        Skip
      </button>

      <style>{`
        @keyframes usp-slide-up {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(1);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

