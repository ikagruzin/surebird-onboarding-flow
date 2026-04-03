

## Offer Page — 5 Fixes

### 1. Badge: Move "All offers" style to Detail page, hide from All offers

The "All offers" tab has the correct tab-overlap badge style (lines 642-646: `rounded-t-xl`, smaller text). The detail page (lines 716-720) has a different implementation that overlays the card incorrectly.

**Fix**: Copy the All Offers badge style (tab-overlap with `absolute -top-[28px]`) into `renderDetailTabOfferCard`, replacing the current badge. Then remove the badge from `renderOfferCard` (All offers) entirely — render `InsuranceOfferCard` directly without the `relative mt-8` wrapper and badge div.

Increase badge height on detail page with `py-2.5` (up from `py-1.5` used on All offers).

### 2. Lock button: Keep original styling when locked

Currently when locked (line 1176), the button uses green styling (`border-success/30 bg-success/5 text-success`). Change it to match the unlocked button style: `border border-border text-foreground bg-background` with a `Check` icon and countdown, but same colors as the original outline button.

### 3. After adding product → redirect to "All offers" + success toast

In the `addFlowPhase === "loading"` completion handler (line 939-953), after `onAddInsurances` and state init:
- Set `setActiveTab("all")` to redirect to All offers
- Show a sonner toast: `toast.success("Your [product names] offer is ready to review!")`

### 4. Badge height increase on detail page

Use `py-2.5` and slightly larger text (`text-sm` instead of `text-xs`) for the detail page badge to make it taller than the All offers version.

### File changes

| File | Change |
|------|--------|
| `src/components/onboarding/step-offer.tsx` | (1) Move tab-overlap badge style to detail page, remove from All offers. (2) Change locked button to original outline styling. (3) Add `setActiveTab("all")` + `toast.success(...)` after add-flow loading completes. |

