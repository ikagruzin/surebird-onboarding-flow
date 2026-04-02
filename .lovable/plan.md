

## Add Legal, Liability & Accidents to Offer Page

### Summary

Create offer-page detail card components for **Legal expenses**, **Liability**, and **Accidents** — following the same pattern as Travel. Each product gets its own offer cards file rendering Rest Data + Set Preferences cards with titles, subtitles, and fully editable controls.

### Data Layout

**Legal expenses** (2 cards)
| # | Card | Source | Fields |
|---|------|--------|--------|
| 1 | Own risk | Rest Data | €0, €100, €250, €500 (default €100) |
| 2 | Coverage | Set Pref | Coverage modules checklist (Consumer mandatory + optional modules) |

**Liability** (2 cards)
| # | Card | Source | Fields |
|---|------|--------|--------|
| 1 | Own risk | Rest Data | €0, €100 (default €100) |
| 2 | Coverage | Set Pref | Dog Y/N, Damage limit €1.25M/€2.25M |

**Accidents** (2 cards)
| # | Card | Source | Fields |
|---|------|--------|--------|
| 1 | Own risk | Rest Data | €0, €100, €250, €500 (default €100) |
| 2 | Coverage | Set Pref | Coverage level selection |

### Subtitle Copy

| Product | Card | Subtitle |
|---------|------|----------|
| Legal | Own risk | "The amount you pay yourself when filing a claim. A higher own risk means a lower monthly premium." |
| Legal | Coverage | "Choose which legal areas you want covered. Consumer protection is always included." |
| Liability | Own risk | "The amount you pay yourself when filing a claim. Choose €0 for full coverage at a slightly higher premium." |
| Liability | Coverage | "Adjust your liability coverage preferences, including pet insurance and maximum damage limit." |
| Accidents | Own risk | "The amount you pay yourself when filing a claim. A higher own risk means a lower monthly premium." |
| Accidents | Coverage | "Your accident insurance coverage level, determining the payout in case of permanent disability or death." |

### File Changes

| File | Change |
|------|--------|
| `src/config/products/legal.ts` | Add `offerCards` (2 cards) and `offerInitialState: { ownRisk: "€100" }` |
| `src/config/products/liability.ts` | Add `offerCards` (2 cards) and `offerInitialState: { ownRisk: "€100" }` |
| `src/config/products/accidents.ts` | Add `offerCards` (2 cards) and `offerInitialState: { ownRisk: "€100" }` |
| `src/components/products/legal-offer-cards.tsx` | New file — renders Own Risk (SegmentedControl) + Coverage (LegalCoverageSelector) |
| `src/components/products/liability-offer-cards.tsx` | New file — renders Own Risk (SegmentedControl) + Coverage (SegmentedControl for dog + damage limit) |
| `src/components/products/accident-offer-cards.tsx` | New file — renders Own Risk (SegmentedControl) + Coverage (SelectionCards for coverage level) |
| `src/components/onboarding/step-offer.tsx` | Import the 3 new offer card components. Extend the `activeTab` rendering logic (lines 751-761) to render `LegalOfferCards`, `LiabilityOfferCards`, or `AccidentOfferCards` when the respective tab is active, same pattern as Travel. |

### Remaining Products (for future)

Home, Car, and Caravan will follow after these 3 are done, using the same architecture. The Rest Data for those products will be provided by you.

