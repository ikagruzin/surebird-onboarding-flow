

## Add Home Product to Offer Page

### Concept

Home insurance has up to 2 sub-products: **Household goods** and **Building** (determined by `coverageChoice` from Set Preferences: "household", "building", or "both"). When "both" is selected, a pill switcher (same as multi-car) lets the user toggle between them. Each sub-product has its own independent Own Risk and Coverage.

### Card Layout

**Household goods tab (4 cards)**

| # | Card | Source | Subtitle |
|---|------|--------|----------|
| 1 | Own risk | Rest Data | "The amount you pay yourself when filing a claim. A higher own risk means a lower monthly premium." |
| 2 | Coverage | Rest Data | Radio cards (same style as Car/Caravan) |
| 3 | Contents insurance | Set Preferences | "Details about your belongings and their estimated value." |
| 4 | My house details | Set Preferences | "The physical characteristics of your home." |

**Building tab (4 cards)**

| # | Card | Source | Subtitle |
|---|------|--------|----------|
| 1 | Own risk | Rest Data | Same subtitle |
| 2 | Coverage | Rest Data | Radio cards |
| 3 | Building insurance | Set Preferences | "Structural details and features of your building." |
| 4 | My house details | Set Preferences | Same shared data (common for both) |

### Coverage Options (radio cards with subtitles)

| Option | Subtitle | Badge |
|--------|----------|-------|
| Extra extensive | "Covers a wide range of damage including fire, storm, theft, and water damage — suitable for most homeowners." | — |
| All Risk | "The most comprehensive coverage — includes all risks except those explicitly excluded. Maximum protection for your home." | Recommended |

Default: **All Risk**

### Rest Data

- **Own risk**: €0, €100, €250, €500 (default €100) — SegmentedControl, independent per sub-product
- **Coverage**: Extra extensive / All Risk — radio cards, independent per sub-product

### Sub-product switcher

When `coverageChoice === "both"`, render pill buttons "Household goods" / "Building" above the insurance offer card (same pattern as car multi-instance pills). State tracked via `activeHomeTab: "household" | "building"`.

### Offer state structure

```text
localOfferStates.home = {
  household: { ownRisk: "100", coverage: "All Risk" },
  building:  { ownRisk: "100", coverage: "All Risk" }
}
```

When only one sub-product is selected, still key by sub-product ID but only render that one.

### Set Preferences cards

- **Contents insurance card**: Reuses the same fields from `HomeContentsStep` — high-value AV, jewelry, special assets, owner interest toggles with amount inputs, security, net income, outside value.
- **Building insurance card**: Reuses fields from `HomeBuildingStep` — monumental status, outbuildings, floor count, renovation, solar panels, heat pump.
- **My house details card**: Shared between both tabs — building type, usage, construction material, floor material, roof shape, roof material. Editable with same controls as `HomeDetailsStep`.

### All Offers page

When `coverageChoice === "both"`, render two insurance cards under one "Home" heading:
- "Household goods" sub-label + InsuranceOfferCard → Edit opens home tab with household active
- "Building" sub-label + InsuranceOfferCard → Edit opens home tab with building active

When only one sub-product, render single card as normal.

### File Changes

| File | Change |
|------|--------|
| `src/config/products/home.ts` | Add `offerInitialState: { household: { ownRisk: "100", coverage: "All Risk" }, building: { ownRisk: "100", coverage: "All Risk" } }` |
| `src/components/products/home-offer-cards.tsx` | **New file** — Renders 4 cards per active sub-product. Coverage uses radio card pattern from Car/Caravan. Contents/Building/Details cards reuse the same fields and controls from `home-steps.tsx`. |
| `src/components/onboarding/step-offer.tsx` | (1) Add `activeHomeTab` state. (2) Render home pill switcher when `coverageChoice === "both"`. (3) Initialize `localOfferStates.home` keyed by sub-product. (4) Add `activeTab === "home"` branch rendering `HomeOfferCards`. (5) In "All offers", when both sub-products: render grouped cards under one "Home" heading with sub-labels. |

