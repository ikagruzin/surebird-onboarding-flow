

## Offer Page — 5 Changes

### 1. Home & Car: Remove/Compare only on sub-products, not parent

**All offers tab**: When Home has "both" or Car has multiple instances, the parent heading row should NOT show Remove/Compare buttons. Only each sub-item (Household/Building cards, individual car instance cards) gets Remove and Compare buttons.

**Detail tabs**: Same logic — Remove/Compare appear per sub-product (per car instance pill, per home sub-tab), not at the top level.

For single car or single home sub-product, the buttons stay on the product level as today.

### 2. Align badge + buttons in one row on detail tabs

In `renderDetailTabOfferCard`, change the layout so the "Best and cheapest choice" badge and the Remove/Compare buttons sit on the same row:

```text
[🏆 Best and cheapest choice]          [Remove] [Compare]
```

Use `flex items-center justify-between mb-4` as the wrapper. Badge on the left, buttons on the right.

### 3. Compare modal with competitor insurances

When "Compare" is clicked, open a modal/dialog showing:
- **Current proposed insurance** at the top (highlighted with the "Best and cheapest choice" badge)
- **Below**: A list of 2-3 alternative insurers with higher prices

The alternatives are mock data — different insurer names, slightly higher prices, same structure as `InsuranceOfferCard`. The modal uses `DialogContent` with a scrollable body.

Add state `compareModalProduct: string | null` to track which product's compare modal is open.

### 4. Reduce gap between "Details" heading and first card

Change `mt-8 mb-6` on the "Details" `<h2>` to `mt-6 mb-3` to bring it closer to the Own Risk card below.

### 5. Loading animation on preference/offer changes using Surebird logo

When any insurance detail or preference option is changed (via `handleUpdateProductState`, `handleUpdateOfferState`, etc.), show a brief loading overlay on the detail cards area. The overlay displays the uploaded Surebird logo SVG spinning/pulsing as a loading indicator.

**Implementation**:
- Copy the uploaded SVG to `src/assets/logo-surebird-icon.svg`
- Add state `isRecalculating: boolean` in `step-offer.tsx`
- When any offer/product state update handler fires, set `isRecalculating = true`, then after a short delay (e.g., 800ms) set it back to `false`
- While `isRecalculating` is true, render a semi-transparent overlay on top of the detail cards area with the Surebird icon rotating (`animate-spin` but slower, custom animation ~2s)
- This is distinct from the full-page `StepLoading` — it's a localized inline overlay

### File Changes

| File | Change |
|------|--------|
| `src/assets/logo-surebird-icon.svg` | Copy uploaded SVG file |
| `src/components/onboarding/step-offer.tsx` | (1) Remove Remove/Compare from parent Car/Home headers on All Offers when multiple sub-items exist; add Compare per sub-item. (2) Align badge + buttons in one row in `renderDetailTabOfferCard`. (3) Add compare modal state + render `Dialog` with current + alternative insurers. (4) Change "Details" heading margins. (5) Add `isRecalculating` state + overlay with spinning Surebird logo on state changes. |
| `src/components/onboarding/insurance-offer-card.tsx` | No changes needed |

