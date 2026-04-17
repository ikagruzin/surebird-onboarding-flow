

## Plan: Add full Dutch translations and a global language switcher

### Answer to your question
Right now the EN/NL toggle is **only on the home page** (step-one). The `language` state is local React state inside `step-one.tsx`, and no other onboarding step uses translations — every other page (About You, Set Preferences, product steps, Finalise, Success) is hardcoded in English. To make the switcher work everywhere we need to:
1. Lift `language` into a global **LanguageContext** so it persists across phases.
2. Render the same EN/NL toggle in the shared header/sidebar so it's visible on every step.
3. Wire each phase's copy through a translation lookup.

### Scope of translation data
The 4 uploaded files cover:
- **Home_Page_Copy-4.xlsx** ✅ parsed — header, main, labels, tooltips, bundles, sidebar, sticky footer, progress
- **Finalise_Phase_Copy.xlsx** ✅ parsed — start date, confirm details, phone verify, iDIN, acceptance questions, final preview, success + Taco messages
- **About_You_Phase_Copy.xlsx** ❌ failed to parse — likely a format issue. I'll re-attempt parsing in default mode using openpyxl directly.
- **Products_Data_Final.xlsx** ❌ failed to parse — same; will read via openpyxl in default mode.

### Architecture

```text
src/i18n/
  ├── LanguageContext.tsx     // Provider + useLanguage() hook + localStorage persistence
  ├── translations/
  │   ├── home.ts             // from Home_Page_Copy
  │   ├── about-you.ts        // from About_You_Phase_Copy
  │   ├── finalise.ts         // from Finalise_Phase_Copy
  │   ├── products.ts         // from Products_Data_Final (questions, options, tooltips per product)
  │   ├── taco.ts             // Taco messages for every step
  │   └── index.ts            // merge + export `t(key, vars?)` helper
src/components/language-switcher.tsx   // shared EN/NL toggle component
```

### Implementation steps

1. **Extract translations from the two unparseable xlsx files** using openpyxl in /tmp, then write structured `.ts` translation modules under `src/i18n/translations/`.
2. **Create `LanguageContext`** with `language`, `setLanguage`, persisted in `localStorage` (default EN). Wrap `<App />` in `main.tsx`.
3. **Create `LanguageSwitcher` component** (the same pill toggle currently in step-one). Place it in:
   - `step-one` header (replace local switcher, now reads from context)
   - The onboarding `Sidebar` header so it's visible on About You / Preferences / Offer / Finalise
4. **Refactor `step-one.tsx`** to read `language` from context instead of local state, and merge in any new keys/copy edits from the xlsx (e.g. "Have you already saved an offer?" → updated NL copy "Heb je al eerder een offerte opgeslagen?", insurance label "Home" → "Wonen", bundle title "Explorer plan" → "Ontdekkers pakket", etc.).
5. **Wire the remaining onboarding steps** to translations. For each step file (`step-confirm-details`, `step-phone-verification`, `step-idin-verification`, `step-acceptance-questions`, `step-final-preview`, `step-success`, `step-start-date`, About-You steps like `step-name`, `step-birthdate`, `step-address`, `step-family*`, and product steps via shared-ui), replace hardcoded strings with `t("...")` calls.
6. **Translate Taco messages** — update `TacoMessage` callsites to look up the translated message based on `stepId` + current language.
7. **Translate product configs** — questions, option labels, and tooltips in `src/config/products/*.ts` get a parallel NL map sourced from Products_Data_Final.
8. **Persistence**: language choice survives page reloads via `localStorage` and is shared across all routes.

### Notes / decisions for you

- **Validation/error messages**: The xlsx files mostly cover question copy. I'll translate the existing inline validation error strings too (best-effort, consistent tone with the NL copy provided).
- **Dynamic placeholders** like `{product}`, `{email}`, `{maskedPhone}`, `{iban}`, `{amount}`: I'll keep them as `{var}` interpolations in the translation strings.
- **Default language**: EN (matches current behavior). The toggle persists user choice afterwards.
- **Yellow-highlighted / missing NL cells**: where Dutch is missing in the sheet, I'll fall back to the English string so nothing renders blank.

### Files to be created
- `src/i18n/LanguageContext.tsx`
- `src/i18n/translations/home.ts`
- `src/i18n/translations/about-you.ts`
- `src/i18n/translations/finalise.ts`
- `src/i18n/translations/products.ts`
- `src/i18n/translations/taco.ts`
- `src/i18n/translations/index.ts`
- `src/components/language-switcher.tsx`

### Files to be edited (high level)
- `src/main.tsx` — wrap with `LanguageProvider`
- `src/components/onboarding/sidebar.tsx` — render `LanguageSwitcher`
- `src/components/onboarding/step-one.tsx` — use context + updated copy
- All other `step-*.tsx` files — replace hardcoded strings with `t(...)`
- `src/components/onboarding/taco-message.tsx` — translation-aware
- `src/config/products/*.ts` — add NL labels for questions/options/tooltips, plus a small helper to resolve them by language

