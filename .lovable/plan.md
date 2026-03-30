

## Add InfoTip Explanations to Home Details Options

### Approach

- **SelectionCard options** (Building Type, Construction, Floor, Roof Shape): Add `rightIcon={<InfoTip>}` to individual confusing options using the existing `rightIcon` prop.
- **NativeSelect fields** (Roof Material): Add a single InfoTip next to the field **label** that explains the less obvious options in one tooltip.

### Changes

**File: `src/components/products/home-steps.tsx`**

For SelectionCard-based fields, we need to switch from `SegmentedControl` (which doesn't support per-item `rightIcon`) to manually rendering `SelectionCard` components for the options that need tooltips. Options without tooltips remain as-is.

**Options getting individual InfoTips (via rightIcon on SelectionCard):**
1. **Two-under-a-roof** — "A semi-detached home sharing one wall with a neighbour"
2. **Canal house** — "A traditional narrow Dutch city house, typically along a canal"
3. **Wooden skeleton** — "A timber-frame structure where wood carries the load"
4. **(Largely) stone** — "Exterior walls are mostly brick or stone masonry"
5. **Wooden frame with stone wall** — "Timber frame with a stone or brick outer cladding"
6. **No floors** — "Ground-level only, with a slab-on-grade foundation"
7. **Special** (roof shape) — "An unconventional roof shape like a dome, saw-tooth, or mansard"

**Options getting a label-level InfoTip (NativeSelect):**
8. **Roof material label** — Tooltip: "Artificial reeds = synthetic thatch imitation. (Largely) reed = natural thatched roof"

### Implementation Detail

For Construction Materials, Floor Materials, and Roof Shape — currently using `SegmentedControl` — we'll replace with manually mapped `SelectionCard` components so we can selectively pass `rightIcon` only to the options that need it. Options without tooltips will render identically but without the prop.

### Files Changed

| File | Change |
|------|--------|
| `src/components/products/home-steps.tsx` | Replace SegmentedControl with SelectionCard mapping for 4 fields; add InfoTips to 7 individual options + 1 label-level tooltip |

