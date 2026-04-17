

## Plan: Sync the uploaded NL data + translate sticky footer + close remaining gaps

### What's in the uploaded XLSX (Products_Data_Final-2)
9 sheets — Car, Home, Travel, Legal, Liability, Accidents, Caravan questions/options + a **Tooltips sheet (page 8)** with full NL tooltip translations for Car, Home, Travel, Liability, Accidents, Caravan. Many of these strings are missing or only English in `data.ts` today.

### Issues to fix

**1. Many product NL strings still missing in `data.ts`** — even though some keys exist (`products.liability.dog_tip` etc.), the file is missing NL values for:
- All Car questions/options (license plate, main driver, owner, damage-free years, kmPerYear, basic coverage WA/WA+/All risk, etc.) and all Car tooltips
- All Home questions, options for buildingType/usage/construction/floor/roof/coverageChoice, content toggles, building toggles, security/income/outsideValue, content/building coverage labels, plus all Home tooltips
- All Travel questions/options (travelDays, coverageArea, sport flow, equipment), all 8 supplements (title + description) in NL, extra-support amounts, and tooltips
- All Legal coverage modules (titles + descriptions) — currently English-only in places
- Caravan: type/usage/identification/brand/length/condition/coverage labels and tooltips
- Liability `dog`/`damageLimit` option labels (Ja/Nee, €1,250,000 etc.)
- Accidents coverage tier labels (Overlijden / Invaliditeit)

**2. Sticky footer not translated everywhere**
- `sticky-footer.tsx` hardcodes "You save:" and "Next" — wire to `sticky_footer.estimated_savings` + `sticky_footer.next` (keys already exist in EN+NL).
- `step-preferences.tsx` line 697 hardcodes "Estimated savings:" — wire to same key.
- `step-one.tsx` line 120 has a local "Estimated savings:" string — wire to `sticky_footer.estimated_savings`.
- `insurance-offer-card.tsx` "You save X% annually" — add new key `offer.you_save_annually`.
- `step-final-preview.tsx` "You save with Surebird" already uses `t()`, just verify NL value present.
- `step-offer.tsx` line 1396 hardcoded "You save with Surebird: €X" — wire to existing key.

**3. Misc remaining English strings discovered while auditing**
- `step-offer.tsx` FAQ answers (7 items) hardcoded EN — wire to `offer.faq.q1..q7` / `a1..a7` (need to add the data).
- "Annual payment discount" toggle copy in `step-final-preview.tsx`.
- Loyalty-tax FAQ answer + premium-protection sections.

### What I'll do

**A. Sync XLSX into `data.ts`**
For each product (Car, Home, Travel, Legal, Liability, Accidents, Caravan):
- **Questions**: add/update keys `products.<id>.<fieldId>.q` in EN + NL (verbatim from XLSX columns C/D).
- **Options**: add/update keys `products.<id>.opt.<fieldId>` as pipe-joined strings in EN + NL (columns F/G), so existing `translateOptions()` helper picks them up.
- **Tooltips** (from page 8): add keys `products.<id>.<fieldId>.tip` (or option-level `products.<id>.opt_tip.<value>`) for the ~35 tooltip rows, EN + NL.
- **Supplements & coverage modules**: add `products.travel.supp.<id>.title/desc` and `products.legal.cov.<id>.title/desc` (EN+NL) using the rich descriptions from the sheet.

This will add roughly 200 new key-value pairs (EN + NL) into `src/i18n/translations/data.ts`. All values come straight from the XLSX; where a NL cell was blank in the sheet, I'll write a natural Dutch translation consistent with the rest of the file.

**B. Wire components to read the new keys**
- `home-steps.tsx`, `car-steps.tsx`, `travel-steps.tsx`, `caravan-steps.tsx`, `legal-steps.tsx`, `liability-steps.tsx`, `accident-steps.tsx`: replace remaining hardcoded English question labels and InfoTip strings with `t("products.<id>.<field>.q")` and `t("products.<id>.<field>.tip")`. Pass option arrays through `translateOptions(t, "<id>", OPTS)` (already used in liability/accident — extend pattern).
- Also wire option arrays in offer-cards files (`car-offer-cards.tsx`, `home-offer-cards.tsx`, `travel-offer-cards.tsx`, `caravan-offer-cards.tsx`, `legal-offer-cards.tsx`, `liability-offer-cards.tsx`) so basic-coverage / own-risk / coverage-area selectors flip to Dutch on the offer page too.
- `legal-coverage-selector.tsx`: read module title + description from `products.legal.cov.*` keys.

**C. Sticky footer + savings copy**
- `sticky-footer.tsx`: replace "You save:" + "Next" with `t()` lookups.
- `step-preferences.tsx` line 697: same.
- `step-one.tsx` lines 112/120: route `saveAnnually`/`estimatedSavings` through `t()`.
- `insurance-offer-card.tsx`: add and wire `offer.you_save_annually` (with `{percent}` var).
- `step-offer.tsx` line 1396: wire to existing `finalise.final_preview.you_save_with_surebird_amount` (or new `offer.you_save_with_surebird`).

**D. Offer page FAQ**
Add `offer.faq.q1..q7` + `a1..a7` (EN + NL natural translations) and replace the hardcoded array in `step-offer.tsx`.

### Files to edit
- `src/i18n/translations/data.ts` — bulk EN + NL additions (~200 keys)
- `src/components/products/home-steps.tsx`, `car-steps.tsx`, `travel-steps.tsx`, `caravan-steps.tsx`, `legal-steps.tsx`, `liability-steps.tsx`, `accident-steps.tsx`
- `src/components/products/{home,car,travel,caravan,legal,liability,accident}-offer-cards.tsx`
- `src/components/onboarding/legal-coverage-selector.tsx`
- `src/components/onboarding/sticky-footer.tsx`
- `src/components/onboarding/step-preferences.tsx` (estimated savings line)
- `src/components/onboarding/step-one.tsx` (savings labels)
- `src/components/onboarding/insurance-offer-card.tsx` (you save annually)
- `src/components/onboarding/step-offer.tsx` (FAQ + savings line)

### Notes
- Pure copy-wiring + data sync. No behavior, layout, or logic changes.
- Where the XLSX NL cell is blank, I'll author natural Dutch consistent with surrounding copy (the `t()` helper falls back to EN if a key truly is missing, so nothing renders blank).
- Tooltips previously English-only (e.g., `home.contents`, `car.driver`, `caravan.specs`, `travel.foundations`) will become fully Dutch when the language is set to NL.

