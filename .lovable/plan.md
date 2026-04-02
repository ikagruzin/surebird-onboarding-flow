

## Caravan Offer Page — 3 UI Changes

### 1. Coverage Card — Radio variant with subtitle

The current Coverage card uses `SelectionCard` (compact h-12) with subtitles rendered outside. Change it to a taller card style similar to Travel's coverage cards but with a **radio indicator** instead of checkbox, and **no icon**. 

This means creating a inline variant in the caravan file — a button with `rounded-2xl border-2 p-4` styling, radio circle indicator, label + subtitle inside the card body. This keeps it consistent with the Travel coverage pattern while using radio selection.

### 2. Hail Damage Coverage — Toggle style

Replace the current `SegmentedControl` Yes/No for hail damage with a **Switch toggle** (same as other add-ons). When toggled on, instead of a dropdown, show the follow-up question "Does the caravan have a hail-resistant roof?" with a Yes/No `SegmentedControl`.

### 3. Reorder — Household goods after Outbuilding

Current order: Purchase value, **Household goods**, Outbuilding, Canopy, Awning, Mover.
New order: Purchase value, **Outbuilding**, **Household goods**, Canopy, Awning, Mover.

### File Changes

| File | Change |
|------|--------|
| `src/components/products/caravan-offer-cards.tsx` | (1) Rewrite `CoverageCard` to use taller radio cards with subtitle inside. (2) Convert hail damage from SegmentedControl to Switch toggle with conditional sub-question. (3) Swap `householdGoods` and `outbuilding` in `ADDON_TOGGLES` array order. |

