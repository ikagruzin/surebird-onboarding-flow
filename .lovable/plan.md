
I checked the code and the uploaded spreadsheet. The main reason Dutch is still missing is not just “missing translations” — it is a combination of 4 concrete issues:

1. The NL data is present for many product fields, but the UI is still rendering hardcoded English.
- `src/components/products/home-steps.tsx`
- `src/components/products/travel-steps.tsx`
- `src/components/products/caravan-steps.tsx`
- `src/components/onboarding/legal-coverage-selector.tsx`

These files still contain English labels, English tooltips, English badges, and raw English option arrays instead of reading from `t(...)` / translation keys.

2. The translation helper is mostly not wired into these products.
- `translateOptions()` exists in `src/i18n/option-translate.ts`
- but Home / Travel / Caravan / Legal are not actually using it in their step components
- so even when `data.ts` contains Dutch values, the screen keeps showing the original English constants

3. Some important NL keys are still incomplete in `src/i18n/translations/data.ts`.
This is especially true for the richer card content:
- `products.travel.supp.*` (supplement titles/descriptions/badges)
- `products.legal.cov.*` (coverage module titles/descriptions/badges)

So for Travel supplements and Legal coverage cards, part of the Dutch data is missing in addition to the wiring problem.

4. Some option values do not exactly match the translation keys, which breaks lookup even after wiring.
Examples I found:
- Caravan lengths use `5-7m` in config but `5–7m` in translations
- Home income options use `€1,000 - €2,000` in config but `€1,000–€2,000` in translations
- Home config is missing `More than €4,850` although it exists in the spreadsheet/translation data

Why this kept failing:
Previous passes mainly added keys into `data.ts`, but did not replace the English source arrays/components that actually render the product UI. So the translation data exists in the file, but the app is still reading English from component constants and config arrays.

Fix plan:
1. Sync the remaining missing NL rows from the spreadsheet into `data.ts`, especially Travel supplement and Legal coverage-card content.
2. Refactor Home, Travel, Caravan, and Legal product steps to read all questions/options/tooltips from translations instead of hardcoded English.
3. Route every option set through `translateOptions()` or translated card models.
4. Normalize config values so the English source strings exactly match translation keys.
5. Move remaining product copy outside the translation layer (preset checklist, badges, show-more/less, validation copy, placeholders) into translations too.
6. Audit offer-card duplicates (`home-offer-cards.tsx`, `caravan-offer-cards.tsx`, related offer surfaces) so the same product text is Dutch there as well.

So the short answer is: the spreadsheet is not the main blocker anymore — the rendering layer is. The product components are still hardcoded in English, and a few translation datasets are still incomplete or mismatched.
