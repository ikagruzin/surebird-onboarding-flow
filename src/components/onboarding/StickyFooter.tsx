import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Gift } from "lucide-react";

interface StickyFooterProps {
  savings: number;
  onNext: () => void;
  onBack?: () => void;
  disabled?: boolean;
  buttonLabel?: string;
  hasSidebar?: boolean;
  showSavings?: boolean;
  showNextButton?: boolean;
}

const StickyFooter = ({ savings, onNext, onBack, disabled = false, buttonLabel = "Next", hasSidebar = false, showSavings = true, showNextButton = true }: StickyFooterProps) => {
  const formattedSavings = savings.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
  });

  const [animateSavings, setAnimateSavings] = useState(false);
  const prevSavingsRef = useRef(savings);

  useEffect(() => {
    if (savings > prevSavingsRef.current) {
      setAnimateSavings(true);
      const timer = setTimeout(() => setAnimateSavings(false), 400);
      return () => clearTimeout(timer);
    }
    prevSavingsRef.current = savings;
  }, [savings]);

  return (
    <div className={`pointer-events-none fixed bottom-4 z-50 ${hasSidebar ? 'left-0 lg:left-64 right-0' : 'left-0 right-0'}`}>
      <div className="pointer-events-auto max-w-3xl mx-auto px-6 py-4 flex items-center justify-between bg-card border border-border rounded-3xl shadow-lg">
        {showSavings ? (
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-foreground" />
            <span className="text-sm font-semibold text-foreground">You save:</span>
            <span className={`inline-flex items-center gap-1 bg-success/10 border border-success/20 rounded-full px-3 py-1 ${animateSavings ? 'animate-savings-pop' : ''}`}>
              <span className="text-lg font-bold text-success">{formattedSavings}</span>
            </span>
          </div>
        ) : (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-foreground px-4 py-3 rounded-full font-medium text-base hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        )}
        {showNextButton && (
          <button
            onClick={onNext}
            disabled={disabled}
            className="inline-flex items-center gap-2 text-success-foreground px-7 py-3 rounded-full font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{
              background: 'linear-gradient(180deg, hsl(121 72% 48%) 0%, hsl(121 72% 38%) 100%)',
              boxShadow: '0 4px 12px -2px hsla(121, 72%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)',
            }}
          >
            {buttonLabel}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default StickyFooter;
