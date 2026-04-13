

## Plan: Fix 5 Issues (Gender Layout, Regular Driver Layout, Add Car Flow, Compare Modal Selection, Success Page Variants)

### 1. Gender options — horizontal row
**Files**: `step-confirm-details.tsx`, `step-family-members-info.tsx`

Change `<div className="space-y-2">` wrapping gender SelectionCards to `<div className="grid grid-cols-3 gap-2">` so all three options (Man, Woman, Different) sit in a single row.

### 2. Regular driver options — horizontal row
**File**: `step-select-regular-driver.tsx`

Change `<div className="space-y-2">` wrapping children SelectionCards to `<div className="grid grid-cols-2 gap-2">` (or `grid-cols-3` if 3+ children) so driver options display in a row.

### 3. Add Car from offer — route through preferences flow
**File**: `step-offer.tsx` (lines ~1497-1510)

Currently the "Add car" button in the offer car detail view instantly creates a new car instance. Instead, it should launch the same add-product overlay (`renderAddFlowOverlay`) with `car` pre-selected, forcing the user through the car preferences steps before the new instance appears. Change the `onClick` to:
- Set `addFlowQueue` to `["car"]` (or append car if queue exists)
- Set `addFlowProduct` / `addFlowActiveTab` to `"car"`
- Set `addFlowPhase` to `"preferences"`

This reuses the existing full-page overlay that other products use. On completion, the loading screen fires `onAddInsurances` which handles state creation.

### 4. Compare modal — show selected state + allow switching
**File**: `step-offer.tsx` (compare modal, lines ~1676-1737)

Changes:
- Add a "Currently selected" badge/indicator on the recommended card (green checkmark or "Selected" label)
- Add a "Select" button on each competitor card that, when clicked, replaces the current insurer for that product in `localOfferStates`
- When a competitor is selected, close the modal and show a toast confirming the switch
- The `InsuranceOfferCard` component needs an optional `selected` prop (boolean) to show the selected state, and an optional `onSelect` callback for the "Select" button

**File**: `insurance-offer-card.tsx`
- Add optional `selected?: boolean` prop — renders a green "Selected" badge or highlighted border
- Add optional `onSelect?: () => void` prop — renders a "Select this" button when provided (on non-selected cards)

### 5. Success page — 3 result variants (Congratulations, Pending, Rejected)
**File**: `step-success.tsx`

Add a `status` prop: `"success" | "pending" | "review-needed"` (avoiding "rejected" — use softer language).

**Congratulations** (existing, `status="success"`): No changes.

**Pending** (`status="pending"`):
- Icon: Clock/hourglass in amber/warning color
- Title: "We're reviewing your request"
- Body: "Your application is being processed. We'll notify you at [email] as soon as everything is confirmed. This usually takes 1-2 business days."
- CTA: "Contact us" button (secondary/outline) linking to support
- Secondary CTA: "Go to my Dashboard" button

**Review Needed** (`status="review-needed"`):
- Icon: Info circle in blue/muted color  
- Title: "We need a bit more time"
- Body: "We weren't able to process your request automatically. Our team will review it personally and get back to you within 2 business days."
- CTA: "Request a callback" button (primary)
- Secondary CTA: "Contact us" link
- Reassurance text: "Don't worry — this happens occasionally and doesn't affect your coverage options."

**File**: `flow-final.ts` — The success step config stays the same. The `status` will be passed as a prop from `index.tsx`.

**File**: `index.tsx` — Add a `successStatus` state field (default `"success"`) and pass it to `StepSuccess`. For now, default to `"success"` — the status can be driven by API response later.

### Files to edit

| File | Change |
|------|--------|
| `step-confirm-details.tsx` | Gender → `grid grid-cols-3 gap-2` |
| `step-family-members-info.tsx` | Gender → `grid grid-cols-3 gap-2` |
| `step-select-regular-driver.tsx` | Children → `grid grid-cols-2 gap-2` |
| `step-offer.tsx` | "Add car" → use addFlow overlay; Compare modal → selected state + switch |
| `insurance-offer-card.tsx` | Add `selected` + `onSelect` props |
| `step-success.tsx` | 3 variants: success, pending, review-needed |
| `src/pages/index.tsx` | Add `successStatus` state, pass to StepSuccess |

