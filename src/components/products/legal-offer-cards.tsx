/**
 * Legal expenses – Offer page detail cards.
 * Renders 2 editable cards: Own Risk + Coverage modules.
 */
import { SegmentedControl } from "./shared-ui";
import { LegalCoverageSelector } from "@/components/onboarding/legal-coverage-selector";

interface LegalOfferCardsProps {
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

const OWN_RISK_OPTIONS = ["€0", "€100", "€250", "€500"];

export const LegalOfferCards = ({
  productState,
  offerState,
  onUpdateProduct,
  onUpdateOffer,
}: LegalOfferCardsProps) => (
  <div className="space-y-6 mt-8">
    {/* 1. Own Risk */}
    <OfferCard
      title="Own risk"
      subtitle="The amount you pay yourself when filing a claim. A higher own risk means a lower monthly premium."
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
      subtitle="Choose which legal areas you want covered. Consumer protection is always included."
    >
      <LegalCoverageSelector
        selected={productState.coverageModules || ["consumer"]}
        onChange={(v) => onUpdateProduct("coverageModules", v)}
      />
    </OfferCard>
  </div>
);
