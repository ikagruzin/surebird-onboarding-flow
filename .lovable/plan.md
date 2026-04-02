

## Caravan Tweaks + Car Offer Page Implementation

### Part A: Caravan Tweaks (2 changes)

1. **"Recommended" badge on Casco Limited** — Add a small `Badge` component next to the "Casco Limited" label in the Coverage radio card, using the `bg-primary/10 text-primary` style from Travel.

2. **Remove separator before Hail Damage** — Remove `border-t border-border` classes from the hail damage section wrapper in `AdditionalCoverageCard`.

### Part B: Car Offer Page (new)

**Card layout (3 cards + multi-instance switcher)**

| # | Card | Fields |
|---|------|--------|
| 1 | Own risk | €0, €100, €250, €500 (default €100) — SegmentedControl |
| 2 | Coverage | Radio cards (same component as Caravan) with subtitles + "Recommended" badge on WA+ |
| 3 | Additional coverage | Toggles with conditional sub-fields |

**Coverage options (radio cards with subtitles)**

| Option | Subtitle | Badge |
|--------|----------|-------|
| Civil Liability (WA) | "The legally required minimum. Covers damage you cause to others, but not to your own vehicle." | — |
| Limited Casco (WA+) | "Includes civil liability plus theft, fire, storm, hail, and window damage to your own vehicle." | Recommended |
| Full Casco (All-risk) | "The most complete coverage — also covers damage to your own car, including collision and parking accidents." | — |

**Additional coverage toggles**

| Toggle | Default | When on → shows | Tooltip |
|--------|---------|-----------------|---------|
| Insuring occupants | Off | Radio: "Accidents occupant" / "Damage occupant" | "If something happens then the car is covered, but not the occupants. With this coverage, you also take care of the medical costs if someone does something wrong." |
| Roadside assistance | Off | (nothing extra) | "Covers the costs of roadside assistance if your car breaks down. Make sure it doesn't overlap with your travel insurance." |
| Legal aid | Off | (nothing extra) | "Provides legal support and covers attorney fees in case of a traffic-related dispute, such as after an accident." |

Occupant type tooltip: "With the passenger damage insurance (SIV) you will be reimbursed exactly enough to cover the (medical) costs if one of the passengers is wrong. With accident-occupant insurance (OIV) you get a fixed amount, even in the event of death. We recommend the SIV."

**Multi-instance car switcher**

- Pill navigation at top of car detail tab (like Set Preferences but without checkmarks — just selected/unselected styling)
- Each car instance gets its own offer state
- Need to expose all car instances from `MultiCarFlowTab` via `getState()` returning `{ instances: [...] }` and capture that in `step-preferences.tsx`'s `getProductStates()`

**Set Preferences data (cards 4-6 from car-steps)**

The car Set Preferences data (license plate, driver info, usage) will be shown per-instance below the Rest Data cards — same editable controls as in the steps.

| # | Card | Subtitle |
|---|------|----------|
| 4 | Vehicle | "Your car details retrieved from the license plate." |
| 5 | Driver | "Details about who primarily drives this vehicle." |
| 6 | Usage | "Your driving habits and experience for premium calculation." |

### File Changes

| File | Change |
|------|--------|
| `src/components/products/caravan-offer-cards.tsx` | Add "Recommended" badge to Casco Limited. Remove `border-t` from hail damage section. |
| `src/components/products/multi-car-flow-tab.tsx` | Modify `getState()` to return `{ instances: [...allInstances], ...activeState }` so the offer page gets all car data. |
| `src/components/onboarding/step-preferences.tsx` | No change needed — already calls `getState()` which will now include instances. |
| `src/config/products/car.ts` | Add `offerInitialState: { ownRisk: "100", coverage: "Limited Casco (WA+)" }`. |
| `src/components/products/car-offer-cards.tsx` | **New file** — Renders multi-instance pills (no checkmarks) + 3 Rest Data cards (Own Risk, Coverage radio cards, Additional Coverage toggles) + 3 Set Pref cards (Vehicle, Driver, Usage) per instance. Reuses the same radio card pattern from Caravan. |
| `src/components/onboarding/step-offer.tsx` | Import `CarOfferCards`, add `activeTab === "car"` branch. Handle per-instance offer state keyed by car instance ID. |

