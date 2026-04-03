

## Final Preview Step — Annual Payment Discount & Pricing Enhancements

### Changes

**1. Annual payment discount toggle**

Add a `Switch` toggle inside the summary card (between the product list and Total Monthly row) labeled "Annual payment discount — save 5% extra". This toggle activates/deactivates the annual discount. New state managed locally via `useState`.

When active:
- Each product line shows the additional 5% applied on top of the 10% bundle discount
- A new "Annual total" row appears below "Total Monthly" showing `totalAfterDiscount * 12` (with the 5% already applied)
- The savings badge updates to include the annual discount amount

**2. Discount line item — visible like calculator**

Add a "Discount — 10%" line between the product list and the total row, styled the same as the offer calculator (green text, showing `-€X.XX`). When annual discount is active, show a second line "Annual payment discount — 5%" also in green.

**3. Props & state**

- Add `annualDiscount` boolean state inside `StepFinalPreview` (local `useState`, default `false`)
- No new props needed from parent — this is a display preference toggle

### Pricing logic

```
bundleDiscount = totalBefore * 0.10
afterBundle = totalBefore - bundleDiscount
annualExtra = annualDiscount ? afterBundle * 0.05 : 0
finalMonthly = afterBundle - annualExtra
annualTotal = finalMonthly * 12
```

### File changes

| File | Change |
|------|--------|
| `src/components/onboarding/step-final-preview.tsx` | Import `Switch`. Add `annualDiscount` state. Add discount line items (10% bundle + optional 5% annual) between product list and total. Add Switch toggle row. Show "Annual total" row when active. Update savings badge to reflect combined savings. |

