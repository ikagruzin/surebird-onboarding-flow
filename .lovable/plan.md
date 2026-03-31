

## Add Dynamic "Bundle" Badge to Product Selection Cards

### Overview

Add a small "Bundle" badge inside each product card (Step 1) that appears/disappears based on cross-sell cluster logic. Two clusters: Essentials (Car, Home, Liability) and Lifestyle (Travel, Legal). Accidents and Caravan are excluded.

### Changes

**File: `src/components/onboarding/step-one.tsx`**

1. **Define cluster map** as a constant:
```typescript
const BUNDLE_CLUSTERS: Record<string, string[]> = {
  car: ["home", "liability"],
  home: ["car", "liability"],
  liability: ["car", "home"],
  travel: ["legal"],
  legal: ["travel"],
};
```

2. **Compute badge visibility** inside `InsuranceGrid`: derive a `Set<string>` of product IDs that should show the badge — loop through `selected`, for each selected product look up its cluster partners, add any partner that is NOT in `selected`.

3. **Render the badge** inside each product card button, positioned between the label (`flex-1`) and the checkbox div. Use the existing `Badge` component from `@/components/ui/badge` with a small style (e.g., `variant="secondary"` or custom blue styling). Only render when `shouldShowBadge.has(ins.id)`.

4. **Badge styling**: Small pill with text "Bundle", matching the blue primary color scheme. Approximately: `bg-primary/10 text-primary border-0 text-[10px] px-2 py-0.5 uppercase tracking-wide font-bold`.

### Behavior Summary

| User action | Effect |
|-------------|--------|
| Select Car | Badge appears on Home & Liability (if unselected) |
| Then select Home | Badge disappears from Home, stays on Liability |
| Deselect Car | Badge disappears from Liability (no trigger left... unless Home triggers it back on Car and Liability — Home is still selected so Car and Liability get badges) |
| Select Travel | Badge appears on Legal |
| Select Legal | Badge disappears from Legal |

### Files Changed

| File | Change |
|------|--------|
| `src/components/onboarding/step-one.tsx` | Add cluster constant, compute badge set, render Badge component in InsuranceGrid |

