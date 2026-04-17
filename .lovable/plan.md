

## Plan: Finish wiring translations to home tooltips, Set Preferences, and Finalise

### Why things still look English
The translation **data is already in `src/i18n/translations/data.ts` for both EN and NL** — the gap is purely the wiring. Three places never read from `t()`:

1. **Home tooltip card** (sidebar hover description on the first page) reads `hoveredProduct.tooltip`, which comes from the hardcoded `INSURANCE_TYPES` array in `src/components/onboarding/types.ts`. That string is English-only and ignores `tooltip.liability`, `tooltip.home`, etc. that already exist in the i18n file.
2. **Set Preferences** (`step-preferences.tsx`) and the per-product step files (`liability-steps.tsx`, `home-steps.tsx`, `car-steps.tsx`, `travel-steps.tsx`, `legal-steps.tsx`, `accidents-steps.tsx`, `caravan-steps.tsx`) all use hardcoded English question labels and option labels. The `products.*` keys exist in `data.ts` but no component calls `t()` on them.
3. **Finalise steps** (`step-confirm-details`, `step-phone-verification`, `step-idin-verification`, `step-acceptance-questions`, `step-final-preview`, `step-success`, `step-start-date`) only translate the Taco message. All field labels, headings, buttons and body copy are still hardcoded English.

Plus the Sidebar's `STEP_LABELS` ("About you", "Set preferences"…) is hardcoded — translations exist under `home.progress.step_1..4`.

### What I'll change

**1. Home page product tooltip (sidebar hover)**
- In `sidebar.tsx`, when rendering `hoveredProduct.tooltip`, look up `t(\`home.tooltip.${hoveredProduct.id}\`, undefined, hoveredProduct.tooltip)`. Same for the label → `t(\`home.label.${hoveredProduct.id}\`)`.

**2. Sidebar phase labels**
- Replace `STEP_LABELS[i]` with `t(\`home.progress.step_${i+1}\`, undefined, label)`.

**3. Set Preferences — product step components**
Wire `t()` into the 7 product step files so question labels, option labels, and InfoTip text resolve from `products.<product>.<field>.q` and `products.<product>.opt.<...>` keys:
- `liability-steps.tsx`, `home-steps.tsx`, `car-steps.tsx`, `travel-steps.tsx`, `legal-steps.tsx`, `accident-steps.tsx`, `caravan-steps.tsx`

For each file: import `useT`, replace hardcoded question strings (e.g. `"Do you want to insure your dog(s)?"`) with `t("products.liability.dog.q", undefined, fallback)`, and translate option labels rendered through `SegmentedControl`/`ChipSelect` via a small helper that maps `["No","Yes"]` → looked-up Dutch labels.

**4. Set Preferences — `step-preferences.tsx` legacy questions**
- The `QUESTIONS_BY_TYPE` map in this file (used by liability/travel/legal/accidents/caravan that don't yet route through ProductFlowTab) holds many hardcoded labels. I'll wrap label rendering with `t()` calls keyed by the existing `products.*` ids, and add small fallback mappings where a question id doesn't exist in data.ts yet.
- Translate UI chrome: "Confirm your details" header is N/A here, but headings like the remove-confirm dialog ("Remove [Product Name] insurance?", description, Cancel, Remove) → add and use new `preferences.*` keys (English in data.ts already covers most; add the missing dialog/UI strings).

**5. Finalise step components**
For each file, swap hardcoded strings for `t()` lookups using the **already-present** `finalise.*` keys:
- `step-start-date.tsx` → `start_date.sameDate`, `start_date.startDate`, `start_date.when_should_your_product_begin`
- `step-confirm-details.tsx` → `confirm_details.firstName / infix / lastName / phone / email`, plus header "Confirm your details" + gender labels (add 3 new keys: `confirm_details.header`, `confirm_details.gender_man/woman/different`)
- `step-phone-verification.tsx` → `phone_verification.*`
- `step-idin-verification.tsx` → `idin_verification.*`
- `step-acceptance-questions.tsx` → `acceptance_questions.*`
- `step-final-preview.tsx` → `final_preview.*` (summary header, badges, discount lines, totals, agreement checkboxes)
- `step-success.tsx` → `success.*` + add NL keys for the pending/review-needed variants (Contact us, status copy)

**6. Small i18n additions to `data.ts`**
Append a handful of missing keys (with EN + NL) that the above components need but aren't in the sheet yet: confirm-details header & gender options, success-page pending/review variant copy, preferences dialog labels, and the StepUpsell Taco message. I'll keep keys consistent with existing naming.

### Files to edit
- `src/components/onboarding/sidebar.tsx` — translate hover tooltip + step labels
- `src/components/onboarding/step-preferences.tsx` — translate legacy questions + dialog
- `src/components/products/{liability,home,car,travel,legal,accident,caravan}-steps.tsx` — translate question + option labels
- `src/components/onboarding/step-start-date.tsx`
- `src/components/onboarding/step-confirm-details.tsx`
- `src/components/onboarding/step-phone-verification.tsx`
- `src/components/onboarding/step-idin-verification.tsx`
- `src/components/onboarding/step-acceptance-questions.tsx`
- `src/components/onboarding/step-final-preview.tsx`
- `src/components/onboarding/step-success.tsx`
- `src/components/onboarding/step-upsell.tsx` — translate Taco message + tooltip
- `src/i18n/translations/data.ts` — add a small set of missing keys (EN + NL)

### Notes
- Wherever NL is missing (yellow cells in the sheet), the `t(key, vars, fallback)` helper already falls back to English — nothing renders blank.
- I'll keep all existing component logic, layouts, and behaviour unchanged. This is purely a copy-wiring pass.
- One known data-quality issue from the sheet I'll leave as-is (the NL `phone_verification.resend_verification_code` value is "Stuur nieuwe code in {timer}s", same as the timer string). Not blocking.

