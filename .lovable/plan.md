

## Plan: 10 Fixes Across Upsell, Confirm Details, Acceptance Questions, and Success Page

### 1. Upsell step: Remove heading, add hover tooltip, dynamic savings in Taco message
**File**: `src/components/onboarding/step-upsell.tsx`
- Delete the "Would you like to add anything else?" h2 heading
- Add `hoveredProduct` state and `onMouseEnter`/`onMouseLeave` on each card (same pattern as step-one)
- Pass `hoveredProduct` to Sidebar (need to accept and forward it from parent, or display inline tooltip)
- Change Taco message to something like: `"Add now and unlock up to <span style='color:green'>€{savings}</span> in extra savings!"` where savings is calculated from the number of unselected products. The TacoMessage component likely accepts a string, so we may need to support JSX or use a different approach — render a custom message block with the green-highlighted amount.
- New copy example: "Bundle more, save more! Add products now and unlock up to €XX in additional savings."

### 2. Confirm Details: Move gender after email
**File**: `src/components/onboarding/step-confirm-details.tsx`
- Move the Gender section (lines 81-98) to after the Email field (after line 125), keeping the same markup

### 3. Acceptance Questions: Delete "No worries" Taco message
**File**: `src/components/onboarding/step-acceptance-questions.tsx`
- Remove lines 204-218 (the conditional block showing "No worries — Taco will personally review...")

### 4. Acceptance Questions: Make confirmation card fully clickable
**File**: `src/components/onboarding/step-acceptance-questions.tsx`
- The label/onClick is already there (lines 222-226) but it seems the click handler on the label conflicts with the Checkbox `onCheckedChange`. Fix: ensure the entire card div triggers the toggle, not just the checkbox. Remove the duplicate `onClick` on label if needed and ensure the `<label>` wraps the full card area properly.

### 5. Preferences: Auto-select newly added product tab after upsell
**Files**: `src/pages/index.tsx`, `src/components/onboarding/step-preferences.tsx`
- Add a prop like `initialActiveTab?: string` to StepPreferences
- When returning from upsell with new selections, pass the first upsell product id as `initialActiveTab`
- In StepPreferences, use a `useEffect` to update `activeTab` when `initialActiveTab` changes

### 6. Success page — Pending: Remove "Go to my Dashboard", blue icon/bg
**File**: `src/components/onboarding/step-success.tsx`
- Remove the "Go to my Dashboard" button from the pending variant (keep only "Contact us")
- Change icon circle from `bg-warning/10` to `bg-primary/10` and Clock icon from `text-warning` to `text-primary`

### 7. Success page — Review needed: Orange colors, remove "Request a callback"
**File**: `src/components/onboarding/step-success.tsx`
- Change icon circle from `bg-primary/10` to `bg-orange-100` and AlertCircle from `text-primary` to `text-orange-500`
- Remove the "Request a callback" button (keep only "Contact us")

### Files to change

| File | Changes |
|------|---------|
| `step-upsell.tsx` | Remove h2, add hover tooltip, dynamic savings in Taco message |
| `step-confirm-details.tsx` | Move gender after email |
| `step-acceptance-questions.tsx` | Remove "No worries" block, fix confirmation card clickability |
| `step-success.tsx` | Pending: remove dashboard btn + blue icon; Review: orange icon + remove callback btn |
| `step-preferences.tsx` | Accept `initialActiveTab` prop, sync `activeTab` |
| `src/pages/index.tsx` | Pass `initialActiveTab` from upsell selections |

