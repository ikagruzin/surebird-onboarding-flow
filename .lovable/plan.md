## Offer Page — 4 Feature Updates

### 1. Recalculating Overlay — Full Page

Move the current localized overlay (lines 1411-1417) to a `fixed inset-0 z-[60]` full-page overlay. Keep the spinning Surebird logo centered on screen with "Updating prices..." text. Triggered by the existing `triggerRecalc` mechanism on any preference/offer state change.

### 2. Lock Discount for 24h — Complete Flow

The button at line 1132 currently does nothing. Implement:

**New states**: `showLockModal`, `lockFormPhase: "form" | "success"`, `discountLocked`, `discountLockedAt: number | null`, `lockFormData` (name, email, phone, marketing checkbox, privacy checkbox)

**A. Modal (form phase)**:
- TacoMessage: "Please enter your details to lock the discount for 24h and save your offer"
- 3 `FloatingLabelInput` fields: Name (pre-filled from `firstName`), Email, Phone
- 2 Checkboxes:
  - "Yes, keep comparing offers monthly and send me updates and offers" (default checked)
  - "I agree to the privacy policy and terms and conditions" (required, unchecked) — "privacy policy" and "terms and conditions" as blue links
- CTA: "Lock the discount" button (primary, full-width, rounded-full)

**B. Success phase**: Show success message in same modal, auto-close after 2s

**C. Button state change**: After locking → "Discount locked 23:59:00" with real-time countdown via `setInterval`. Button disabled with muted style. Timer counts from `discountLockedAt`.

### 3. Price Breakdown Modal

The "Check the price breakdown" link (line 1139) currently does nothing.

**New state**: `showPriceBreakdown`

**Modal contents**:
- Title: "Price breakdown"
- Per-product line items: product name → base premium
- "Surebird service costs" row with `Info` tooltip: "This covers continuous monitoring of your policies, 24/7 support, and smart switching technology to keep your premiums low."
- "Insurance tax (21%)" row
- Bundle discount row (if active)
- Annual payment discount row (if active)
- Total per month (bold)

### 4. Add Product Loading — Centered Layout

The loading container (lines 892-914) uses `max-w-3xl mx-auto px-6 py-12`. Change to `flex items-center justify-center min-h-screen` to center `StepLoading` vertically and horizontally.

### File Changes

| File | Change |
|------|--------|
| `src/components/onboarding/step-offer.tsx` | (1) Move recalc overlay to fixed full-page. (2) Add Lock Discount states, modal with form/success phases, countdown timer. (3) Add Price Breakdown modal. (4) Center add-product loading container. Import `FloatingLabelInput`, `Checkbox`, `Dialog`/`DialogContent`, `Tooltip`. |
