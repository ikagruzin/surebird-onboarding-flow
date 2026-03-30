

## Multi-Car Instance System -- Set Preferences Phase

### What We're Building

Inside the Car tab in Flow A's "Set Preferences," users complete the 2-step car flow, then Taco asks "Want to insure another car?" After confirming, a new car instance is added with sub-navigation pills to switch between them.

### Plan of Actions

**1. Extend Car product config to support multi-instance state**

- In `src/config/products/car.ts`, add a helper to create a fresh `CarState` instance with a unique ID
- Export `createCarInstance()` factory function

**2. Create a `MultiCarFlowTab` wrapper component**

- New file: `src/components/products/multi-car-flow-tab.tsx`
- Manages an array of car instances (each with its own state + step index)
- Renders sub-navigation pills: `Car 1 | Car 2 | + Add car` (pill labels update to brand/model after plate lookup, e.g. "Golf")
- Each pill shows a checkmark when that instance's flow is complete
- Trash icon on pills (except when only 1 car) to remove an instance
- After completing the last step of an instance, Taco asks: "Want to insure another car?" with Yes/No selection cards
- "Yes" creates a new instance and switches to it; "No" signals completion to parent
- Exposes the same `ProductFlowTabHandle` interface (handleNext, handleBack, isComplete, progress) so the parent orchestrator needs zero changes

**3. Wire it into `step-preferences.tsx`**

- When `activeTab === "car"`, render `MultiCarFlowTab` instead of `ProductFlowTab`
- The `MultiCarFlowTab` uses the same ref interface, so all existing back/next/completion logic in the orchestrator works unchanged
- Progress aggregates across all car instances (e.g., 2 instances x 2 steps = 4 total)

**4. Files changed**

| File | Change |
|------|--------|
| `src/config/products/car.ts` | Add `createCarInstance()` factory |
| `src/components/products/multi-car-flow-tab.tsx` | New -- multi-instance wrapper with sub-nav pills + "add another" prompt |
| `src/components/onboarding/step-preferences.tsx` | Swap `ProductFlowTab` for `MultiCarFlowTab` when product is "car" |

### UX Details

- Sub-nav pills sit between the product tabs and the step content, styled as smaller rounded pills
- Active pill: dark fill; completed pill: green checkmark; default: outline
- The "add another" prompt appears as a Taco message + two selection cards after the last step validates
- Deleting a car instance shows a brief confirmation, then renumbers remaining pills

