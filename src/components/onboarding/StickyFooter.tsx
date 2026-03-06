import { ChevronLeft, ChevronRight } from "lucide-react";

interface StickyFooterProps {
  savings: number;
  onNext: () => void;
  onBack?: () => void;
  disabled?: boolean;
  buttonLabel?: string;
  hasSidebar?: boolean;
  showSavings?: boolean;
}

const StickyFooter = ({ savings, onNext, onBack, disabled = false, buttonLabel = "Next", hasSidebar = false, showSavings = true }: StickyFooterProps) => {
  const formattedSavings = savings.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className={`fixed bottom-0 right-0 z-50 bg-card border-t border-border ${hasSidebar ? 'left-0 lg:left-64' : 'left-0'}`}>
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        {showSavings ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-success">Estimated savings:</span>
            <span className="inline-flex items-center gap-1 bg-success/10 border border-success/20 rounded-full px-3 py-1">
              <span className="text-lg font-bold text-success">{formattedSavings}</span>
            </span>
          </div>
        ) : (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-foreground px-4 py-3 rounded-lg font-medium text-base hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={disabled}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-lg font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {buttonLabel}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StickyFooter;
