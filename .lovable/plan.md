

## Add Caravan Product to Offer Page (revised)

### Card Layout (6 cards)

| # | Card | Source | Subtitle |
|---|------|--------|----------|
| 1 | Own risk | Rest Data | "The amount you pay yourself when filing a claim. A higher own risk means a lower monthly premium." |
| 2 | Coverage | Rest Data | "Choose the level of protection for your caravan against damage and theft." |
| 3 | Additional coverage | Rest Data | "Ensure even better coverage with our special add-ons." |
| 4 | Usage | Set Pref | "Your caravan type, how you use it, and where it is located." |
| 5 | Caravan details | Set Pref | "Technical specifications and identification of your caravan." |
| 6 | Finance | Set Pref | "The value of your caravan determines your coverage and premium." |

### Rest Data Fields

**Own risk** — SegmentedControl: €0, €100, €250, €500 (default €100)

**Coverage** — SelectionCards (radio), default Casco Limited:

| Option | Subtitle |
|--------|----------|
| Fire and theft | "Covers damage caused by fire, explosion, lightning, and theft or attempted theft of your caravan." |
| Casco Limited | "Includes fire and theft plus storm, hail, flooding, collision with animals, and window damage." |
| Casco Extended | "The most complete coverage — also includes damage you cause yourself, such as a driving or parking accident." |

**Additional coverage** — complex card:

6 toggle items (all off by default). When toggled on, a NativeSelect appears with **"Select option"** as default placeholder (no "No longer insured" option):

| Toggle | Tooltip | Dropdown options |
|--------|---------|-----------------|
| Purchase value guarantee | "Guarantees the original purchase price in case of total loss within the selected period." | 1 year, 3 years, 5 years |
| Household goods | "Inventory or household effects means; the additional (not standard) inventory and the entire household effects located in the caravan or co-insured awning. Think, for example, of the furniture or a television." | €750, €1,500, €2,500, €3,000, €3,500 |
| Outbuilding | "Under the outbuilding are sheds that are not made of tent fabric. An outbuilding is not attached to the caravan." | €500, €1,000, €1,500, €2,000, €2,500 |
| Canopy | "By this we mean the non-closed cover (awning) that is added to the caravan." | €500, €1,000, €1,500, €2,000, €2,500 |
| Awning | "By this we mean the closed cover (awning) that is added to the caravan." | €1,000, €1,500, €2,000, €2,500, €3,000 |
| Mover | "A mechanical tool attached to the caravan to put it in place without using a vehicle." | €500, €1,000, €1,500, €2,000, €2,500, €3,000 |

Then a Yes/No radio:
- **Hail damage coverage** (default No) — tooltip: "Hail damage can cause significant damage to your caravan. With this additional coverage, hail damage is insured."
  - If Yes → **"Does the caravan have a hail-resistant roof?"** Yes/No (default No)

### Set Preferences Cards (4, 5, 6)

Render the same interactive controls from `caravan-steps.tsx` — caravan type selection with tooltips, usage dropdown, mobile home/flood conditionals, license plate/chassis, brand/year/length, condition/values. All existing `InfoTip` tooltips preserved.

### File Changes

| File | Change |
|------|--------|
| `src/config/products/caravan.ts` | Add `offerCards` (6 cards), `offerInitialState` with defaults |
| `src/components/products/caravan-offer-cards.tsx` | New file — renders all 6 cards |
| `src/components/onboarding/step-offer.tsx` | Add `activeTab === "caravan"` branch, import `CaravanOfferCards` |

