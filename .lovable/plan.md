

## Offer Page — 7 Changes

### 1. Full-page "Add Product" overlay → match Set Preferences layout

The current overlay (lines 787-886) has a custom header, no product tabs, no progress bar, and a different footer. Rewrite it to mirror `StepPreferences`:

- **Title**: "Set your preferences" (same as preferences step)
- **Product tabs**: Show tabs for all products being added (from `addFlowQueue`), with checkmark for completed ones, `+` button hidden
- **Progress bar**: `<Progress>` bar below tabs showing aggregate completion across all queued products
- **Footer**: Reuse `StickyFooter` component (with savings, green CTA, same styling)
- **Content width**: Use same `max-w-3xl mx-auto px-6 md:px-12 lg:px-16` as preferences
- **Multi-product flow**: Complete all selected products sequentially (tab by tab) before showing Loading. Remove the current behavior of showing Loading between each product. After the last product is completed → show `StepLoading` (without lead capture gate) → return to offer page with all new products added at once.
- **Close/X button**: Keep in the top-right corner

### 2. Separator line between product tabs and sub-tabs (Car & Home)

On detail pages for Car (multi-instance pills) and Home (Household/Building pills), add a horizontal separator (`border-t border-border`) between the main product tab bar and the sub-product pill switcher. Matches the screenshot.

### 3. Add "Compare" button next to "Remove"

Add a `Compare` button (`variant="outline" size="sm"`) next to the Remove button on:
- Each product's detail tab (in `renderDetailTabOfferCard`)
- Each product card on the "All offers" tab (in `renderOfferCard` and the car/home grouped sections)

Both buttons sit in a `flex gap-2` container.

### 4. "Best and cheapest choice" badge on detail pages

Add a badge above the `InsuranceOfferCard` on detail tabs (in `renderDetailTabOfferCard`), styled exactly as in the screenshot:
- `bg-primary/10 border border-primary/20 rounded-full px-4 py-2`
- Award icon (`Award` from lucide) in `text-primary`
- Text: "Best and cheapest choice" in `text-primary text-sm font-semibold`

### 5. "Policy Conditions" link instead of "View & Edit details" on detail pages

On detail tab pages, the `InsuranceOfferCard` currently shows no `onViewDetails` (it's only on All Offers). Change:
- On **All Offers** tab: Keep "View & Edit details" linking to the product tab
- On **detail tabs**: Show "Policy Conditions" instead. Clicking opens a modal/dialog containing an `<iframe>` loading `https://verzekeringskaarten.nl/allianz/aansprakelijkheidsverzekering-allianz`

Add new prop to `InsuranceOfferCard`: `actionLabel?: string` (defaults to "View & Edit details"). Add state `policyModalOpen` in `step-offer.tsx`.

### 6. "Details" title after the insurance card on detail pages

In `renderDetailTabOfferCard`, after the `InsuranceOfferCard`, add:
```
<h2 className="text-2xl font-bold text-foreground mt-8 mb-6">Details</h2>
```

### File Changes

| File | Change |
|------|--------|
| `src/components/onboarding/insurance-offer-card.tsx` | Add `actionLabel` prop (default "View & Edit details"). Use it for the bottom-right link text. |
| `src/components/onboarding/step-offer.tsx` | (1) Rewrite `renderAddFlowOverlay` to match Set Preferences layout — tabs, progress bar, StickyFooter, sequential multi-product completion before single Loading phase. (2) Add `border-t border-border` separator before car/home sub-tabs. (3) Add "Compare" button next to "Remove" everywhere. (4) Add "Best and cheapest choice" badge in `renderDetailTabOfferCard`. (5) Pass `actionLabel="Policy Conditions"` + `onViewDetails` to open iframe modal on detail tabs. (6) Add "Details" heading after insurance card. (7) Add `policyModalOpen` state + iframe dialog. |

