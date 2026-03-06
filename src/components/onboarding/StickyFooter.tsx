import { ChevronRight } from "lucide-react";

interface StickyFooterProps {
  savings: number;
  onNext: () => void;
  disabled?: boolean;
  buttonLabel?: string;
  hasSidebar?: boolean;
}

const StickyFooter = ({ savings, onNext, disabled = false, buttonLabel = "Next", hasSidebar = false }: StickyFooterProps) => {
  const formattedSavings = savings.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className={`fixed bottom-0 right-0 z-50 bg-card border-t border-border ${hasSidebar ? 'left-0 lg:left-64' : 'left-0'}`}>
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-success">{buttonLabel === "Volgende" ? "Geschatte besparing:" : "Estimated savings:"}</span>
          <span className="inline-flex items-center gap-1 bg-success/10 border border-success/20 rounded-full px-3 py-1">
            <span className="text-lg font-bold text-success">{formattedSavings}</span>
          </span>
        </div>
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
