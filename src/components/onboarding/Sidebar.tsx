import { Check, MessageCircle } from "lucide-react";
import { STEP_LABELS } from "./types";

interface SidebarProps {
  currentStep: number;
}

const Sidebar = ({ currentStep }: SidebarProps) => {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-r border-border p-6 justify-between shrink-0">
      <div>
        <div className="flex items-center gap-2 mb-10">
          <span className="text-2xl">🐦</span>
          <span className="text-xl font-bold text-primary">Surebird</span>
        </div>
        <nav className="space-y-1">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isCompleted = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;
            return (
              <div key={i} className="flex items-center gap-3 py-3">
                {isCompleted ? (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                ) : (
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stepNum}
                  </div>
                )}
                <span
                  className={`text-sm font-medium ${
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </nav>
      </div>
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
            🌮
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Ask Taco</p>
            <p className="text-xs text-muted-foreground">I'm ready to assist you</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <MessageCircle className="w-4 h-4 text-success" />
          Chat via WhatsApp
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
