

## "Best and cheapest choice" Badge — Tab-Style Overlap

### What changes

The badge currently renders as a separate rounded-full pill element above the `InsuranceOfferCard`, creating a visual gap. The design intent is for the badge to act as a **tab attached to the card's top-left border** — its bottom edge merges seamlessly into the card.

### Implementation

**Wrap badge + card in a single `relative` container** with top margin to make room for the overlapping tab:

```text
<div className="relative mt-8">
  {/* Badge: absolute, overlapping top-left border */}
  <div className="absolute -top-[28px] left-6 z-10
    flex items-center gap-2
    bg-primary/5 border border-primary/20 border-b-0
    rounded-t-xl px-5 py-2">
    <Award className="w-4 h-4 text-primary" />
    <span className="text-primary text-sm font-semibold">
      Best and cheapest choice
    </span>
  </div>
  <InsuranceOfferCard ... />
</div>
```

Key CSS details:
- `border-b-0` removes the bottom border so it merges with the card
- `rounded-t-xl` rounds only top corners (flat bottom)
- `-top-[28px]` pulls the badge up so it overlaps the card's top border
- `left-6` aligns it with the card's internal padding
- The `InsuranceOfferCard` container keeps `overflow: visible` (default)
- Remove/Compare buttons stay in a separate row above or move to the right of the badge row

### Locations to update

1. **`renderDetailTabOfferCard`** (line ~698-724): Restructure badge + card into the overlapping layout
2. **All offers tab** (line ~1605-1609): Same tab-overlap pattern on the mini badge
3. **Compare modal** (line ~1288-1291): Same treatment for the "current" card

### File changes

| File | Change |
|------|--------|
| `src/components/onboarding/step-offer.tsx` | Refactor badge from standalone pill to absolutely-positioned tab overlapping the InsuranceOfferCard border in 3 locations. Move Remove/Compare buttons to a separate row above the card+badge unit. |

