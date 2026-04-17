

## Plan: Finish Dutch translations across About You, remaining product steps, and audit gaps

### What's still English

**About You input labels** — `step-name.tsx`, `step-address.tsx`, `step-birthdate.tsx`, `step-family.tsx`, `step-family-details.tsx`, `step-ready.tsx` translate the Taco message but **not** the FloatingLabelInput labels ("First name", "Postcode", "House number", "dd-mm-yyyy"), the info-text under inputs ("We need this information because…"), the addition selector ("Select addition"), the loading text ("Looking up address…"), or the success/error states ("Address not found…").

**Product step files not yet wired**:
- `home-steps.tsx`
- `car-steps.tsx`
- `travel-steps.tsx`
- `caravan-steps.tsx`

These still use hardcoded English question labels and option strings. The translation keys under `products.home.*`, `products.car.*`, `products.travel.*`, `products.caravan.*` already exist in `data.ts` from the original XLSX import.

**Other gaps found by audit**:
1. `step-preferences.tsx` — tab names, "Set your preferences" header, the remove-confirm dialog ("Remove [X] insurance?", Cancel/Remove buttons), and the legacy `QUESTIONS_BY_TYPE` labels for products that don't route through ProductFlowTab.
2. `step-upsell.tsx` — h2 headers, savings copy, hover tooltip, and the dynamic Taco message.
3. `step-loading.tsx` — book-stack progress copy, "Skip" button.
4. `step-final-preview.tsx` — agreement checkbox copy, "Annual payment discount" toggle label, totals row.
5. `step-success.tsx` — pending and review-needed variant body copy + buttons.
6. `step-policy-upload.tsx` (Flow B) — upload prompts, drag-drop hints.
7. `sticky-footer.tsx` — "You save €X annually" string, CTA label.
8. `step-acceptance-questions.tsx` — explanation field placeholders + "Healthy" question label.
9. `step-family-members-info.tsx` — field labels (first name, infix, surname, dob, gender) and section headers.
10. `step-car-registration-code.tsx` and `step-caravan-location.tsx` — finalise sub-steps for car/caravan with hardcoded prompts.

### What I'll change

**1. About You input labels & helper text**
Add to `data.ts` under a new `aboutYou.*` namespace (with EN + NL):
- `aboutYou.firstName_label`, `lastName_label`, `infix_label`
- `aboutYou.postcode_label`, `houseNumber_label`, `addition_placeholder`
- `aboutYou.birthdate_placeholder` ("dd-mm-yyyy" — same in NL)
- `aboutYou.address_lookup_loading`, `address_not_found`, `address_info_text`
- `aboutYou.birthdate_info_text`

Then wire `t()` into `step-name.tsx`, `step-address.tsx`, `step-birthdate.tsx`.

**2. Remaining product step files**
Wire `useT` + `translateOption(s)` into:
- `home-steps.tsx`
- `car-steps.tsx`
- `travel-steps.tsx`
- `caravan-steps.tsx`

For each: replace hardcoded question strings with `t("products.<id>.<field>.q", undefined, fallback)` and pass options through `translateOptions(t, "<id>", options)`. Keep all existing logic & layout.

**3. Step Preferences chrome**
- Translate header "Set your preferences" + tab labels (use the existing `home.label.*` keys).
- Translate the remove-confirm AlertDialog (title, description, Cancel, Remove) using new `preferences.removeDialog.*` keys.
- Translate `QUESTIONS_BY_TYPE` labels for the legacy single-card products.

**4. Other components**
- `step-upsell.tsx`: translate Taco message, savings copy ("Add now and save €X more annually"), hover tooltip — reuse `home.tooltip.*`.
- `step-loading.tsx`: translate book-stack messages + Skip button.
- `step-final-preview.tsx`: translate agreement checkboxes, annual-payment toggle, totals.
- `step-success.tsx`: translate pending + review-needed body copy.
- `step-family-members-info.tsx`: translate field labels.
- `step-car-registration-code.tsx`, `step-caravan-location.tsx`: translate prompts.
- `sticky-footer.tsx`: translate savings text + CTA.
- `step-acceptance-questions.tsx`: translate "Healthy" question + explanation placeholders.
- `step-policy-upload.tsx`: translate upload prompts.

**5. Add missing keys to `data.ts`**
Append EN + NL strings for everything above. Where Dutch is uncertain, I'll use natural translations consistent with existing copy ("Voornaam", "Postcode", "Huisnummer", "Achternaam", etc.). The `t()` helper falls back to EN if a key is missing, so nothing renders blank.

### Files to edit
- `src/i18n/translations/data.ts` — add ~40 new keys (EN + NL)
- `src/components/onboarding/step-name.tsx`
- `src/components/onboarding/step-address.tsx`
- `src/components/onboarding/step-birthdate.tsx`
- `src/components/onboarding/step-family.tsx`
- `src/components/onboarding/step-family-details.tsx`
- `src/components/onboarding/step-family-members-info.tsx`
- `src/components/onboarding/step-preferences.tsx`
- `src/components/onboarding/step-upsell.tsx`
- `src/components/onboarding/step-loading.tsx`
- `src/components/onboarding/step-final-preview.tsx`
- `src/components/onboarding/step-success.tsx`
- `src/components/onboarding/step-acceptance-questions.tsx`
- `src/components/onboarding/step-car-registration-code.tsx`
- `src/components/onboarding/step-caravan-location.tsx`
- `src/components/onboarding/step-policy-upload.tsx`
- `src/components/onboarding/sticky-footer.tsx`
- `src/components/products/home-steps.tsx`
- `src/components/products/car-steps.tsx`
- `src/components/products/travel-steps.tsx`
- `src/components/products/caravan-steps.tsx`

### Notes
- Pure copy-wiring pass — no behavior, layout, or logic changes.
- All Dutch fallbacks where the XLSX left blanks will use natural NL phrasing consistent with already-translated keys.
- Validation error strings (e.g. "Please select…") will also be translated where they appear in the visited components.

