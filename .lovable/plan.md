

## Offer Page — 6 UI/UX Fixes

### 1. Restore InsuranceOfferCard on individual product tabs

Currently, detail tabs (e.g., `activeTab === "travel"`) only render the detail cards — no `InsuranceOfferCard` at top. Restore the offer card but **without** the product title heading. The heading (`<h2>`) stays only on the "All offers" tab.

**Change in `step-offer.tsx`**: Before each product's detail cards (lines ~1100-1173), render `<InsuranceOfferCard>` without the `<h2>` wrapper. Also add a "Remove" button (outlined, no icon) next to the card area when `selectedInsurances.length > 1`.

### 2. Change "Remove" button style to outlined text-only (like old "Edit")

Replace the current `variant="destructive-outline"` + `Trash2` icon buttons with a plain outlined button: `variant="outline" size="sm"` with just the text "Remove", no icon. Applied on both "All offers" cards and individual product tabs.

### 3. Remove button on individual product tabs + sub-product removal

- Each individual product tab gets a "Remove" button (hidden if only 1 total product/sub-product).
- **Car**: Each car instance gets its own "Remove" button (hidden if only 1 car). Removing a car instance removes it from `__carInstances` array.
- **Home**: Each sub-product (Household / Building) gets a "Remove" button when `coverageChoice === "both"`. Removing one switches `coverageChoice` to the remaining one.
- The remove confirmation dialog stays the same, just with a contextual message (e.g., "Remove Household goods?" or "Remove Car AB-12-3C?").

New props needed: `onRemoveCarInstance` and `onUpdateHomeCoverage` (or reuse `onUpdateProductState` for home).

### 4. Calculator discount icon — match text color and smaller size

The `BadgePercent` icon on the "Discount" row (line ~808) currently uses `w-5 h-5 text-muted-foreground`. Change to `w-4 h-4` and remove the explicit color so it inherits the same `text-sm font-medium text-foreground` as its parent, matching the style of the `BadgePercent` on the `InsuranceOfferCard` savings line.

### 5. Add product → full-page overlay with Set Preferences flow + Loading

Instead of adding products directly, clicking "Add" in the modal should:
1. Close the selection modal.
2. Open a **full-page overlay** (`fixed inset-0 z-[70] bg-background overflow-y-auto`) containing the product's Set Preferences flow (`ProductFlowTab` / `MultiCarFlowTab`) with the same design, Taco messages, and sticky footer.
3. The overlay has a close/X button in the corner.
4. Once the user completes all steps, show the **Loading animation** (reuse `StepLoading` component) but without the "Where do you want me to send offer" gate — just the animation → auto-return to offer page with the new product added.

**Implementation**:
- New state: `addFlowProduct: string | null` (which product is being configured in overlay), `addFlowPhase: "preferences" | "loading"`.
- Render overlay when `addFlowProduct` is set:
  - `"preferences"` phase: Render `ProductFlowTab` (or `MultiCarFlowTab` for car) inside a full-screen container with a sticky footer for Next/Back. On completion → switch to `"loading"` phase.
  - `"loading"` phase: Render `StepLoading` with `onComplete` that calls `onAddInsurances([addFlowProduct])`, initializes offer state for the new product, and closes the overlay.
- The overlay uses the same sidebar-less layout as the preferences step.

### 6. "All offers" tab — Remove button per sub-item

On the "All offers" tab:
- **Car with multiple instances**: Each car instance card gets a "Remove" button (hidden if only 1 car AND only 1 total product).
- **Home with both sub-products**: Each sub-product card ("Household goods" / "Building") gets a "Remove" button.
- Standard products: Keep existing "Remove" button (hidden if only 1 product total).

### File Changes

| File | Change |
|------|--------|
| `src/components/onboarding/step-offer.tsx` | (1) Restore `InsuranceOfferCard` on detail tabs without `<h2>`. (2) Change Remove buttons to `variant="outline"` text-only. (3) Add Remove on detail tabs + per-car-instance + per-home-sub-product. (4) Fix calculator discount icon size/color. (5) Replace add-product modal with full-page overlay flow using `ProductFlowTab` + `StepLoading`. (6) New state for `addFlowProduct`, `addFlowPhase`. (7) New handlers for car instance removal and home sub-product removal. |
| `src/pages/index.tsx` | Wire new callbacks for car instance removal and home coverage choice updates if needed. |

