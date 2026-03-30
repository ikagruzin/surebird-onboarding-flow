

## Apply Adaptive Grid Layout to All Home SelectionCard Groups

### What Changes

Import `getSelectionGridClass` from `@/lib/grid-layout` and replace every hardcoded grid/stack wrapper around `SelectionCard` groups with a dynamic call.

### Affected Groups

| Group | Current wrapper | Labels for calculation |
|-------|----------------|----------------------|
| **Preset Yes/No** (line 67) | `grid grid-cols-2 gap-2` | `["Yes", "No"]` → 2 cols (correct, but should use utility) |
| **Construction Materials** (line 179) | `space-y-2` (vertical stack) | `["(Largely) stone", "Wooden frame with stone wall", "Wooden skeleton"]` |
| **Floor Material** (line 203) | `space-y-2` | `["Stone/concrete", "Wood", "No floors"]` |
| **Roof Shape** (line 225) | `space-y-2` | `["Sloping", "Flat", "Special"]` |
| **Coverage Path** (line 307) | `space-y-2` | `["Household goods + Building", "Household goods", "Building"]` |

**Not affected** (correctly excluded):
- SegmentedControl groups (Role, Security, Net Income, Floor Count) — these are a different component, not SelectionCards
- Toggle rows (Building step) — not SelectionCards
- NativeSelect dropdowns — not SelectionCards
- ChipSelect (Usage) — not SelectionCards

### File Changed

| File | Change |
|------|--------|
| `src/components/products/home-steps.tsx` | Add import for `getSelectionGridClass`; replace 5 hardcoded wrappers with `className={getSelectionGridClass(labels)}` |

### Technical Note

For Coverage Path options that have `rightIcon` (InfoTip), the grid utility doesn't account for icon width. The longest label "Household goods + Building" (26 chars) estimates ~276px, so the utility will likely compute 2 cols. With the icon adding ~24px, these may wrap. If so, we can keep Coverage Path as 1-col stacked since all 3 have rightIcon and long labels. Will verify at implementation.

