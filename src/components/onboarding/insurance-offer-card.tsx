import { BadgePercent, SmilePlus } from "lucide-react";

interface InsuranceOfferCardProps {
  insurerName: string;
  logoSrc?: string;
  monthlyPrice: number;
  originalPrice?: number;
  savingsPercent?: number;
  happyClients: string;
  onViewDetails?: () => void;
}

export const InsuranceOfferCard = ({
  insurerName,
  logoSrc,
  monthlyPrice,
  originalPrice,
  savingsPercent,
  happyClients,
  onViewDetails,
}: InsuranceOfferCardProps) => {
  return (
    <div className="border border-border rounded-3xl p-6 bg-card">
      <div className="flex items-start justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          {logoSrc ? (
            <img src={logoSrc} alt={insurerName} className="h-8 object-contain" />
          ) : (
            <span className="text-lg font-bold text-foreground">{insurerName}</span>
          )}
        </div>

        {/* Right: Price + savings */}
        <div className="text-right">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">per month</span>
            {originalPrice != null && originalPrice > monthlyPrice && (
              <span className="text-base text-muted-foreground line-through">€{originalPrice.toFixed(2)}</span>
            )}
            <span className="text-2xl font-bold text-foreground">€{monthlyPrice.toFixed(2)}</span>
          </div>
          {savingsPercent != null && savingsPercent > 0 && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-success mt-1">
              <BadgePercent className="w-4 h-4" />
              You save {savingsPercent}% annually
            </span>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-4">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <SmilePlus className="w-4 h-4" />
          {happyClients}
        </span>
        <button
          onClick={onViewDetails}
          className="text-sm font-semibold text-foreground underline underline-offset-2 hover:text-foreground/80 transition-colors"
        >
          View & Edit details
        </button>
      </div>
    </div>
  );
};
