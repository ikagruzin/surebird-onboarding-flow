import { MessageCircle } from "lucide-react";
import { STEP_LABELS } from "./types";
import type { InsuranceType } from "./types";
import logoSurebird from "@/assets/logo-surebird.svg";
import tacoAvatar from "@/assets/taco-avatar.jpg";
import iconLiability from "@/assets/icon-liability.svg";
import iconHome from "@/assets/icon-home.svg";
import iconCar from "@/assets/icon-car.svg";
import iconLegal from "@/assets/icon-legal.svg";
import iconAccidents from "@/assets/icon-accidents.svg";
import iconCaravan from "@/assets/icon-caravan.svg";
import iconTravel from "@/assets/icon-travel.svg";

const SIDEBAR_ICON_MAP: Record<string, string> = {
  Umbrella: iconLiability,
  Home: iconHome,
  Car: iconCar,
  Scale: iconLegal,
  Zap: iconAccidents,
  Caravan: iconCaravan,
  Plane: iconTravel,
};

interface SidebarProps {
  currentStep?: number;
  showProgress?: boolean;
  visible?: boolean;
  showAvatar?: boolean;
  hoveredProduct?: InsuranceType | null;
}

export const Sidebar = ({ currentStep = 1, showProgress = true, visible = true, showAvatar = false, hoveredProduct }: SidebarProps) => {
  if (!visible) return null;

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 p-6 pb-6 justify-between shrink-0">
      <div>
        <div className="flex items-center gap-2 mb-10">
          <img src={logoSurebird} alt="Surebird" className="h-8" />
        </div>

        {showProgress && (
          <nav className="relative ml-2">
            <div className="absolute left-1 top-3 bottom-3 w-0.5 bg-border" />

            {STEP_LABELS.map((label, i) => {
              const stepNum = i + 1;
              const isCompleted = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;
              return (
                <div key={i} className="flex items-center gap-3 py-3 relative z-10">
                  <div
                    className={`w-3 h-3 rounded-full border-[2.5px] shrink-0 ${
                      isCurrent
                        ? "border-primary bg-primary"
                        : isCompleted
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40 bg-background"
                    }`}
                  >
                    {isCurrent && (
                      <div className="w-full h-full rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isCurrent
                        ? "text-foreground"
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
        )}
      </div>

      {/* Ask Taco */}
      <div className="p-4">
        {hoveredProduct && (
          <div className="animate-fade-in mb-5 p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <img src={SIDEBAR_ICON_MAP[hoveredProduct.icon]} alt={hoveredProduct.label} className="w-7 h-7" />
              <span className="text-sm font-bold text-foreground">{hoveredProduct.label}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{hoveredProduct.tooltip}</p>
          </div>
        )}
        {showAvatar && (
          <div className="flex items-center gap-3 mb-3">
            <img
              src={tacoAvatar}
              alt="Taco"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">Ask Taco</p>
              <p className="text-xs text-muted-foreground">I'm ready to assist you</p>
            </div>
          </div>
        )}
        {!showAvatar && (
          <p className="text-sm font-semibold text-foreground mb-3">Ask Taco</p>
        )}
        <button className="w-full flex items-center justify-center gap-2 border border-border rounded-full py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <MessageCircle className="w-4 h-4 text-success" />
          Chat via WhatsApp
        </button>
      </div>
    </aside>
  );
};

