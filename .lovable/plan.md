

## Always-Enabled CTA with Inline Validation Errors

### Approach: "Validate on Click" with Field-Level Error Messages

Instead of disabling the Next button, it stays **always enabled**. When clicked with incomplete/invalid data, it:
1. Scrolls to the first invalid field
2. Shows a red error message below the problematic input
3. Optionally shakes the button briefly for tactile feedback

This is the best UX pattern because:
- Users always know the button is interactive (no confusion about why it's greyed out)
- Error messages are contextual and specific (not a generic toast)
- It follows established form patterns (similar to how banks/government forms work)

### Validation Rules & Error Messages Per Step

| Step | Field | Error Message (EN) |
|------|-------|--------------------|
| product-selection | No insurance selected | "Please select at least one insurance" |
| name | firstName empty | "Please enter your first name" |
| address | postcode empty/short | "Please enter a valid postcode" |
| address | houseNumber empty | "Please enter your house number" |
| birthdate | empty or incomplete | "Please enter your date of birth (dd-mm-yyyy)" |
| family | no selection | "Please select your family status" |
| start-date | missing date for a product | "Please select a start date for all products" |
| confirm-details | firstName empty | "First name is required" |
| confirm-details | lastName empty | "Surname is required" |
| confirm-details | email invalid | "Please enter a valid email address" |
| idin-verification | iban too short | "Please complete iDIN verification" |
| final-preview | terms unchecked | "You must agree to the terms" |
| final-preview | debit unchecked | "You must give debit permission" |

### Implementation

**1. Add validation error state to `index.tsx`**

- Add `validationErrors: Record<string, string>` state
- Create a `validate()` function that returns field-error pairs for the current step
- Modify `handleNext()`: if `validate()` returns errors, set them in state and scroll to the first error field instead of advancing
- Clear errors when the user changes step or updates a field

**2. Create `ValidationError` component**

A small reusable component: red text below a field with a fade-in animation.

```text
<ValidationError message="Please enter your first name" />
```

**3. Update step components to accept and display errors**

Each step component receives an optional `errors?: Record<string, string>` prop. Fields that have an error key show the `ValidationError` below them. The field's border turns red (`border-destructive`).

Affected step components:
- `step-name.tsx` — firstName error
- `step-address.tsx` — postcode, houseNumber errors
- `step-birthdate.tsx` — birthdate error
- `step-one.tsx` — product selection error (shown as alert above grid)
- `step-start-date.tsx` — per-product date errors
- `step-confirm-details.tsx` — firstName, lastName, email errors
- `step-idin-verification.tsx` — iban error
- `step-final-preview.tsx` — terms/debit errors

**4. Update `StickyFooter`**

- Remove `disabled` prop usage — button is always clickable
- Add a subtle shake animation (`animate-shake`) on invalid click via a `triggerShake` state

**5. Clear errors on field change**

Pass an `onClearError(fieldId)` callback to step components. When the user types or selects, the specific error is cleared immediately so the red state disappears as they fix it.

### Files Changed

| File | Change |
|------|--------|
| `src/pages/index.tsx` | Add validation logic, error state, modify handleNext |
| `src/components/onboarding/validation-error.tsx` | New — reusable error message component |
| `src/components/onboarding/sticky-footer.tsx` | Remove disabled styling, add shake animation |
| `src/components/onboarding/step-name.tsx` | Accept & display errors |
| `src/components/onboarding/step-address.tsx` | Accept & display errors |
| `src/components/onboarding/step-birthdate.tsx` | Accept & display errors |
| `src/components/onboarding/step-one.tsx` | Accept & display errors |
| `src/components/onboarding/step-start-date.tsx` | Accept & display errors |
| `src/components/onboarding/step-confirm-details.tsx` | Accept & display errors |
| `src/components/onboarding/step-idin-verification.tsx` | Accept & display errors |
| `src/components/onboarding/step-final-preview.tsx` | Accept & display errors |
| `src/index.css` | Add shake keyframe animation |

