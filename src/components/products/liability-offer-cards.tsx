/**
 * Liability – Offer page detail cards.
 * Renders 2 editable cards: Own Risk + Coverage (dog + damage limit).
 */
import { SegmentedControl } from "./shared-ui";
import { LIABILITY_OPTIONS } from "@/config/products/liability";

interface LiabilityOfferCardsProps {
  productState: Record<string, any>;
  offerState: Record<string, any>;
  onUpdateProduct: (key: string, value: any) => void;
  onUpdateOffer: (key: string, value: any) => void;
}

const OfferCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <div className="border border-border rounded-3xl p-6 bg-card">
    <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground mb-5">{subtitle}</p>
    {children}
  </div>
);

const OWN_RISK_OPTIONS = ["€0", "€100"];

export const LiabilityOfferCards = ({
  productState,
  offerState,
  onUpdateProduct,
  onUpdateOffer,
}: LiabilityOfferCardsProps) => (
  <div className="space-y-6 mt-8">
    {/* 1. Own Risk */}
    <OfferCard
      title="Own risk"
      subtitle="The amount you pay yourself when filing a claim. Choose €0 for full coverage at a slightly higher premium."
    >
      <SegmentedControl
        options={OWN_RISK_OPTIONS}
        value={offerState.ownRisk || "€100"}
        onChange={(v) => onUpdateOffer("ownRisk", v)}
      />
    </OfferCard>

    {/* 2. Coverage */}
    <OfferCard
      title="Coverage"
      subtitle="Adjust your liability coverage preferences, including pet insurance and maximum damage limit."
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Do you want to insure your dog(s)?</p>
          <SegmentedControl
            options={[...LIABILITY_OPTIONS.dogOptions]}
            value={productState.dog || "No"}
            onChange={(v) => onUpdateProduct("dog", v)}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Damage limit</p>
          <SegmentedControl
            options={[...LIABILITY_OPTIONS.damageLimitOptions]}
            value={productState.damageLimit || "€1,250,000"}
            onChange={(v) => onUpdateProduct("damageLimit", v)}
          />
        </div>
      </div>
    </OfferCard>
  </div>
);
