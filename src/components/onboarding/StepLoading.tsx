import { useState, useEffect, useCallback } from "react";
import { Check, Loader2 } from "lucide-react";
import TacoMessage from "./TacoMessage";

const USP_INTERVAL = 3500; // ~3.5s per card (30% slower)
const FINAL_CARD_PAUSE = 2600; // 30% slower

interface StepLoadingProps {
  onComplete: () => void;
  animateTaco?: boolean;
}

const USP_CARDS = [
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
];

const CHECKMARK_STEPS = [
  "Analysing all your data",
  "Checking all insurance policies",
  "Preparing your offer",
];

const TACO_MESSAGES = [
  "I'm crunching the numbers to find your best deal...",
  "Almost there! While I work, here's why our members love Surebird...",
  "Everything is ready. Taking you to your personal offer now!",
];

const USP_INTERVAL = 2700; // ~2.7s per card
const FINAL_CARD_PAUSE = 2000; // 2s after 4th card before navigating

const StepLoading = ({ onComplete, animateTaco }: StepLoadingProps) => {
  const [visibleCards, setVisibleCards] = useState(0);
  const [completedChecks, setCompletedChecks] = useState<number[]>([]);
  const [tacoMessageIndex, setTacoMessageIndex] = useState(0);

  const stableOnComplete = useCallback(onComplete, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Card 1 appears at 1.5s
    timers.push(setTimeout(() => setVisibleCards(1), 1500));
    // Checkmark 1 completes with card 1
    timers.push(setTimeout(() => setCompletedChecks([0]), 1500));

    // Card 2 at ~4.2s
    timers.push(setTimeout(() => setVisibleCards(2), 1500 + USP_INTERVAL));
    // Taco message changes to mid-way
    timers.push(setTimeout(() => setTacoMessageIndex(1), 1500 + USP_INTERVAL));

    // Card 3 at ~6.9s, checkmark 2
    timers.push(setTimeout(() => {
      setVisibleCards(3);
      setCompletedChecks([0, 1]);
    }, 1500 + USP_INTERVAL * 2));

    // Card 4 at ~9.6s, checkmark 3
    timers.push(setTimeout(() => {
      setVisibleCards(4);
      setCompletedChecks([0, 1, 2]);
    }, 1500 + USP_INTERVAL * 3));

    // Taco final message shortly after card 4
    timers.push(setTimeout(() => setTacoMessageIndex(2), 1500 + USP_INTERVAL * 3 + 800));

    // Navigate to offer after final pause
    timers.push(setTimeout(() => {
      stableOnComplete();
    }, 1500 + USP_INTERVAL * 3 + FINAL_CARD_PAUSE));

    return () => timers.forEach(clearTimeout);
  }, [stableOnComplete]);

  return (
    <div className="animate-fade-in">
      {/* Dynamic Taco message */}
      <TacoMessage
        key={tacoMessageIndex}
        message={TACO_MESSAGES[tacoMessageIndex]}
        animate={animateTaco !== false}
        wordDelay={30}
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

export default StepLoading;
