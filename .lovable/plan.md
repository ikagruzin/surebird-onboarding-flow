

## Add `rightIcon` Prop to SelectionCard + Update Coverage Path

### Changes

**1. `src/components/ui/selection-card.tsx`**
- Add optional `rightIcon?: React.ReactNode` prop
- Render it after the label with `stopPropagation` to prevent triggering card selection

**2. `src/components/products/home-steps.tsx`**
- In `HomeCoveragePathStep`, replace the absolute-positioned `InfoTip` wrapper with the new `rightIcon` prop on each `SelectionCard`
- Remove the outer `<div className="relative">` wrappers since they're no longer needed

### Result
Coverage path cards ("Household goods", "Building", "Household goods + Building") will have inline info icons on the right side, rendered natively within the component rather than via absolute positioning.

