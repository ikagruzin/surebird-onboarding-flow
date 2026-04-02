

## Offer Page — Calculator, Pricing, Add/Remove Products & UI Updates

### Summary

Multiple changes to the offer page: calculator line-item granularity for Home/Car sub-products, annual discount logic affecting monthly prices, icon swaps, add/remove product functionality, and several UI tweaks.

### Changes

#### 1. Calculator: Home & Car Sub-Product Line Items

**Home**: When `coverageChoice === "both"`, show two lines: "Household goods" and "Building" (each with own price) instead of one "Home" line. When single sub-product, show that sub-product name.

**Car**: When multiple car instances exist, show one line per car labeled by license plate (e.g., "Car — AB-12-3C") each with own price. Single car shows "Car" as today.

#### 2. Annual Payment Discount Logic

When "Activate annual payment discount" toggle is on:
- Apply an additional discount (e.g., 5%) to every product's monthly price.
- **Keep showing "Total p/m"** (monthly) but the number reflects the reduced annual-rate divided by 12.
- Annual savings should increase correspondingly (reflect both the bundle discount + annual payment discount).
- The discount should also be reflected in each product's `InsuranceOfferCard` price on the "All offers" tab and in the calculator line items.

#### 3. Icon Replacements

| Location | Current Icon | New Icon |
|----------|-------------|----------|
| "You save X% annually" on InsuranceOfferCard | `CheckCircle2` | `BadgePercent` |
| "Discount: -X%" in calculator | `CheckCircle2` | `BadgePercent` |
| "Annual savings: €X" in calculator | `Calendar` | `Gift` (already imported) |
| "Annual savings" text + icon + number | current color | `text-success` (green) |

#### 4. Add Product from Offer Page

- The `+` button in the product tabs already exists but does nothing. Wire it to open the **same add-product modal** used in `step-preferences.tsx`.
- Extract the modal into a reusable component or duplicate the pattern inline in `step-offer.tsx`.
- When products are added, call a new `onAddInsurances` prop (same pattern as step-preferences) which updates `selectedInsurances` in the wizard state.
- Newly added products get default offer states initialized.
- The new product will need Set Preferences to be configured — render the product flow inline within the offer tab (same `ProductFlowTab`/`MultiCarFlowTab` components) so the user can fill preferences without leaving the offer page.

#### 5. "View details" → "View & Edit details"

Change the link text in `InsuranceOfferCard` from "View details" to "View & Edit details".

#### 6. "Edit" → "Remove" Button with Confirmation

On the "All offers" tab, for each product's header:
- Replace "Edit" button with "Remove" button (destructive-outline variant).
- Hide the "Remove" button if there is only 1 product selected.
- Clicking "Remove" opens an `AlertDialog` confirmation: "Are you sure you want to remove [Product Name]?" with "Cancel" and "Remove" actions.
- On confirm, call a new `onRemoveInsurance` prop to remove the product from `selectedInsurances`.

#### 7. Delete "Compare" Button

Remove all "Compare" buttons from the offer cards on the "All offers" tab.

#### 8. Remove Product Titles from Detail Tab Pages

When viewing a specific product tab (not "All offers"), remove the product name heading (`<h2>`) and the `renderOfferCard(activeTab)` call that shows the `InsuranceOfferCard` at the top. Only show the detail cards directly. Product titles remain on the "All offers" page.

### File Changes

| File | Change |
|------|--------|
| `src/components/onboarding/insurance-offer-card.tsx` | (1) Replace `CheckCircle2` with `BadgePercent` for savings. (2) Change "View details" text to "View & Edit details". |
| `src/components/onboarding/step-offer.tsx` | (1) Calculator: expand Home into sub-product lines, Car into per-instance lines. (2) Annual discount toggle: apply additional 5% discount to monthly prices when active, update all savings figures. (3) Calculator icons: `BadgePercent` for discount, `Gift` for annual savings, green color for savings row. (4) Add product modal (reuse pattern from step-preferences). Wire `+` button. (5) Replace "Edit" with "Remove" (hidden if only 1 product). Add AlertDialog confirmation. (6) Remove "Compare" buttons. (7) Remove product title + offer card from detail tab views (keep only on "all"). (8) New props: `onAddInsurances`, `onRemoveInsurance`. |
| `src/pages/index.tsx` | Pass `onAddInsurances` and `onRemoveInsurance` to `StepOffer`. Wire them to `setState` to update `selectedInsurances`. |

### Technical Details

**Annual discount calculation:**
```text
basePrice = INSURER_DATA[id].monthlyPrice
bundleDiscount = basePrice * (discountPercent / 100)
annualPaymentDiscount = annualDiscount ? (basePrice - bundleDiscount) * 0.05 : 0
finalMonthly = basePrice - bundleDiscount - annualPaymentDiscount
```

**Add product flow on offer page:**
When a new product is added from the offer page, it appears as a new tab. The detail tab renders `ProductFlowTab` / `MultiCarFlowTab` inline so the user can complete Set Preferences without navigating away. Once preferences are saved, the detail cards (Own Risk, Coverage, etc.) replace the flow.

**Remove product:**
```text
onRemoveInsurance(id) → setState(s => ({
  ...s,
  selectedInsurances: s.selectedInsurances.filter(i => i !== id)
}))
```

