

## Plan: Fix 5 Bugs in Finalise Phase Steps

### Bug 1: Gender — Replace segmented buttons with SelectionCard radio indicators
Both `step-confirm-details.tsx` and `step-family-members-info.tsx` use custom segmented buttons for gender. Replace with `SelectionCard` components using `indicator="radio"` to match the existing design system (same pattern used in `step-select-regular-driver.tsx`).

### Bug 2: "Select Regular Driver" not appearing
The `shouldSkip` logic in `flow-final.ts` line 117 checks `state.childrenCount <= 1` but `childrenCount` comes from the About You phase. The issue is likely that `childrenCount` is stored as a string or not properly populated. Additionally, `productStates` keys for car instances use the format `car-{uuid}` — need to verify the `driverRelationship` field name matches what the car flow actually stores. Will add console logging and fix the skip condition to properly check children count (parse as number) and verify the car state field name.

### Bug 3: Car Registration Code — missing license plate display and input
The `StepCarRegistrationCode` component already has the license plate badge and input field in its JSX. The issue is likely that `carInstances` array is empty because the filter `ps2[k]?.licensePlate` doesn't match the actual field name in car product state. Need to check what field the car flow stores the plate under (could be `licensePlate`, `plate`, etc.) and fix the filter.

### Bug 4: Caravan Location — rename "Mobile home location" to mention "Caravan"
In `step-caravan-location.tsx`, change `h3` text from "Mobile home location" to "Caravan location" and update the Taco message from "Where is your mobile home located?" to "Where is your caravan located?"

### Bug 5: Legal Additional Questions & Acceptance Questions — move conditional inputs inside card
Both components render conditional input fields **outside** the card container (in `pl-5 pr-5 pb-4 pt-3` divs after the card). Move them **inside** the `rounded-2xl border-2` card, full-width, below the Yes/No toggle. Same fix applies to `step-acceptance-questions.tsx`.

### Files to edit

| File | Change |
|------|--------|
| `src/components/onboarding/step-confirm-details.tsx` | Replace gender segmented buttons with SelectionCard radio |
| `src/components/onboarding/step-family-members-info.tsx` | Replace gender segmented buttons with SelectionCard radio |
| `src/config/flow-final.ts` | Fix `select-regular-driver` shouldSkip logic — use `Number(state.childrenCount)` |
| `src/pages/index.tsx` | Debug car state field names for registration code + regular driver filters |
| `src/components/onboarding/step-caravan-location.tsx` | Rename to "Caravan location" |
| `src/components/onboarding/step-legal-additional-questions.tsx` | Move conditional inputs inside card container, full width |
| `src/components/onboarding/step-acceptance-questions.tsx` | Move conditional inputs inside card container, full width |

