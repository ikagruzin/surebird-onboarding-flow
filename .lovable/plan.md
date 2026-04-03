## Offer Page — 5 Feature Updates

### 1. "Best and cheapest choice" Badge — Match Design Reference

The current badge uses `bg-primary/10 border border-primary/20` with an `Award` icon inline. The user's design (My_design.png) shows a different style: the badge has a **ribbon/medal icon** (not the Award icon), text is **bolder**, and the badge has a more pronounced pill shape with subtle shadow.

**Changes to `renderDetailTabOfferCard`** (line ~664-668):
- Replace `Award` icon with a custom ribbon SVG or use `Medal` from lucide (closest match)
- Increase padding to `px-5 py-2.5`
- Add subtle shadow: `shadow-sm`
- Use `font-bold` instead of `font-semibold`
- Ensure the badge background matches the screenshot: lighter blue tint with visible border

Apply the same fix to the compare modal badge (line ~1565) and the "All offers" tab badge (line ~1242).

### 2. Recalculating Overlay — Cover Entire Page

Currently the recalculating overlay only covers the detail cards area (lines 1411-1417). Change it to cover the **entire page** (full-screen overlay like the add flow overlay) so it's visible regardless of scroll position.

**Changes**:
- Move the overlay from inside the detail cards `<div className="relative">` to a `fixed inset-0 z-50` overlay
- Keep the spinning Surebird logo centered on screen
- Apply to all products when any preference changes (already triggered by `triggerRecalc`)

### 3. Lock Discount for 24h — Full Flow

The "Lock discount for 24h" button (line ~1132) currently does nothing. Implement:

**A. Modal with Taco message + form:**
- Taco avatar + message: "Please enter your details to lock the discount for 24h and save your offer"
- Form fields: Name (pre-filled from `firstName`), Email address, Phone number (all using `FloatingLabelInput`)
- Two checkboxes:
  - "Yes, keep comparing offers monthly and send me updates and offers" (checked by default)
  - "I agree to the privacy policy and terms and conditions" (unchecked, required) — with "privacy policy", "terms", and "conditions" as blue links
- CTA button: "Lock the discount" (primary styled, full-width, `rounded-full`)

**B. Success state:**
- After clicking "Lock the discount", show success message inside the same modal: "Your discount is locked for 24 hours!"
- Close modal after brief delay

**C. Button state change:**
- After locking, the button text changes to "Discount locked" with a countdown timer showing remaining time (e.g., "23:59:00")
- Button becomes disabled with a muted/success style
- Timer counts down in real-time using `setInterval`

**New state**: `discountLocked: boolean`, `discountLockedAt: number | null`, `showLockModal: boolean`, `lockFormPhase: "form" | "success"`

### 4. Price Breakdown Modal

The "Check the price breakdown" link (line ~1139) currently does nothing. Implement a modal showing:

- **Title**: "Price breakdown"
- **Line items per product**: Product name → base premium
- **Service costs**: "Surebird service costs" with an `Info` tooltip icon explaining: "This covers continuous monitoring of your policies, 24/7 support, and smart switching technology to keep your premiums low."
- **Insurance tax**: "Insurance tax (21%)" 
- **Bundle discount**: Show the discount percentage and amount saved
- **Annual payment discount** (if active): Show the additional savings
- **Total**: Bold total per month
- Modal uses the same custom modal pattern (fixed overlay + centered card)

### 5. Add Product Loading — Centered Full-Page Layout

The loading page in the add-product overlay (lines 892-914) is not centered. Currently it renders `StepLoading` inside `max-w-3xl mx-auto px-6 py-12`. Match the original loading step layout:

- Make the loading container `flex items-center justify-center min-h-screen`
- Hide the sidebar (keep it in DOM but not visible — already the case since it's an overlay)
- Center `StepLoading` vertically and horizontally within the full-page overlay

### File Changes

| File | Change |
|------|--------|
| `src/components/onboarding/step-offer.tsx` | (1) Update badge styling in 3 locations. (2) Move recalculating overlay to fixed full-page. (3) Add Lock Discount modal with form, success state, countdown timer. (4) Add Price Breakdown modal. (5) Center the add-product loading phase. New states: `showLockModal`, `lockFormPhase`, `discountLocked`, `discountLockedAt`, `showPriceBreakdown`. |
