## Badge Fixes — Detail Page Only + py-3 Height + Button Alignment

### 1. Detail page (`renderDetailTabOfferCard`, ~line 703-731)

Replace the current absolute-positioned tab badge + separate button row with a single flex row containing badge (left) and buttons (right), then the card below:

```text
<div className="flex items-center justify-between mb-3">
  <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-5 py-3">
    <Award className="w-4 h-4 text-primary" />
    <span className="text-primary text-sm font-semibold">Best and cheapest choice</span>
  </div>
  <div className="flex items-center gap-2">
    {canRemove && <Button variant="outline" size="sm" onClick={...}>Remove</Button>}
    <Button variant="outline" size="sm" onClick={...}>Compare</Button>
  </div>
</div>
<InsuranceOfferCard ... />  (no relative/mt-8 wrapper)
```

### 2. All Offers tab — remove badge from 3 locations

- **`renderOfferCard`** (~line 640-655): Remove the `relative mt-8` wrapper and badge div. Render `InsuranceOfferCard` directly.
- **Car instances** (~line 1337-1348): Same — remove badge, render card directly.
- **Home sub-products** (~line 1385-1396): Same — remove badge, render card directly.

### 3. Compare modal (~line 1621-1631) — keep badge as-is (tab style)

No changes to the compare modal badge.

### File changes

| File | Change |
|------|--------|
| `src/components/onboarding/step-offer.tsx` | Merge badge+buttons into one row on detail page with `py-3`; remove badge from All Offers in 3 locations. |
