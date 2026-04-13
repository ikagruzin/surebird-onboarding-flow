

## Plan: Upsell Step Between Preferences and Send Request

### What it does
After the user finishes filling in all product preferences, a new "upsell" step shows the products they haven't selected yet. The user can toggle any to add, then click Next in the sticky footer. If they added products, they go back to Set Preferences to fill those in. If they didn't add anything, they proceed to "Send request" (all-set). This step only appears once per session.

### Design decisions
- Reuse the exact same product card component from step-one (`InsuranceGrid` pattern): icon, label, checkbox — same styling, same 2-column grid
- No savings badges or benefit tooltips on cards (as requested)
- Taco message at top: "You're almost there! Add more products to your bundle and save even more."
- Heading: "Would you like to add anything else?"
- Sticky footer "Next" button proceeds — if new products were toggled, redirects to preferences; if none, goes to all-set
- A `upsellShown` flag in WizardState ensures this step is only shown once

### Files to change

| File | Change |
|------|--------|
| `src/components/onboarding/step-upsell.tsx` | Rewrite: use step-one's card style (icon images, 2-col grid, checkbox), Taco message, no savings badges. Accept `onAddProducts(ids)` callback. |
| `src/components/onboarding/types.ts` | Add `upsellShown: boolean` to WizardState |
| `src/config/flow-final.ts` | Insert `upsell-products` step between `preferences` and `all-set`, with `shouldSkip: (state) => state.upsellShown` |
| `src/pages/index.tsx` | Wire `upsell-products` step: render StepUpsell, handle toggle + navigation logic (if new products selected → go back to preferences, else → all-set), set `upsellShown = true` after first visit |

### Step flow
```text
preferences → upsell-products → (if added) → preferences → all-set
                               → (if none)  → all-set
```

The `shouldSkip` on `upsell-products` checks `state.upsellShown`, so returning from preferences the second time skips straight to all-set.

