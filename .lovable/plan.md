

## Travel Product — Offer Page Detail Tab (Revised)

### Card Order (corrected per your input)

| # | Card Title | Data Source | Fields |
|---|-----------|-------------|--------|
| 1 | Own risk | Rest Data | €0, €100, €250, €500 (default €100) |
| 2 | Coverage | Set Preferences (supplements step) | Medical Expenses, Cancellation Fees, Luggage, Extraordinary Costs checklist |
| 3 | Extra support | Rest Data | €0, €1,000, €2,500 (default €0) |
| 4 | Travel details | Set Preferences (foundations step) | Travel days (60/90/180/365), Coverage area (Europe/Worldwide) |
| 5 | Sport | Set Preferences (sport step) | Play sports Y/N, Adventure sports, Equipment toggles |

### Subtitle Copy Per Card

| Card | Subtitle |
|------|----------|
| Own risk | "The amount you pay yourself when filing a claim. A higher own risk means a lower monthly premium." |
| Coverage | "Select what should be covered during your trip. Medical expenses are always included." |
| Extra support | "Extra financial support on top of your standard coverage, for example in case of emergency repatriation." |
| Travel details | "How long and where you typically travel. This determines the scope of your coverage." |
| Sport | "Let us know about sports activities so we can make sure you are properly covered abroad." |

### Display Mode

Each card will show the **same interactive controls** as in the Set Preferences phase — selection cards, toggles, checklists — fully editable immediately. No collapsed/read-only mode. The difference from Set Preferences is purely layout: all steps are visible at once as stacked cards with their own title and subtitle, instead of one-at-a-time with Taco messages.

### Implementation

| File | Change |
|------|--------|
| `src/config/products/types.ts` | Add `OfferCardDef` interface (id, title, subtitle, source: "rest" or "preferences", stepId?) and optional `offerCards` + `offerInitialState` to `ProductConfig` |
| `src/config/products/travel.ts` | Add `offerCards` array (5 cards above) and `offerInitialState` with own-risk/extra-support defaults |
| `src/components/products/travel-offer-cards.tsx` | New file: renders the 5 cards using shared UI primitives (`SectionCard`, `SegmentedControl`, `ChipSelect`, `ToggleRow`). Reads current state, calls `onUpdate` for changes. |
| `src/components/onboarding/step-offer.tsx` | When rendering the Travel product detail tab, use `TravelOfferCards` instead of the current placeholder. Pass product state and update handler. |

### What I Need Next

After Travel is approved and implemented, you can provide the Rest Data for the next product (e.g., Home or Liability) and we repeat the pattern.

