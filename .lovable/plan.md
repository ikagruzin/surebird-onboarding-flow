

## Plan: Multiple Changes Across Onboarding Flow

### 1. Birthdate question copy change
**File**: `src/components/onboarding/step-birthdate.tsx`
- Change Taco message from "How old are you? 🎂" to "What is your date of birth? 🎂"

### 2. Car tabs always visible in Set Preferences
**File**: `src/components/products/multi-car-flow-tab.tsx`
- Line 264: Change condition from `(instances.length > 1 || phase === "add-prompt")` to `true` — always render the sub-navigation pills (car instance tabs + "Add car" button), even when there's only one car and the user hasn't finished filling it

### 3. Home preset: Add "Building type" to prefilled checklist
**File**: `src/components/products/home-steps.tsx`
- In `HomePresetStep`, add "An apartment" as the first item in the preset checklist display (before the existing 4 items)
- Render it as the first `<li>` in the checklist, showing "An apartment" with the same check icon style

**File**: `src/config/products/home.ts`
- Add `"An apartment"` as the first entry in `presetChecklist` array

### 4. Home contents: Replace "outside value" with toggle + dropdown
**File**: `src/components/products/home-steps.tsx`
- In `HomeContentsStep`, replace the "How much value do you take with you outside?" section with:
  - Title: **"Insure things you take outside"** with tooltip: "Items you regularly carry outside your home, like a laptop, phone, bicycle, or sports equipment."
  - A toggle switch (default off). The `outsideValue` field stays "€0" when off
  - When toggled on: show a `NativeSelect` dropdown with the same options minus "€0", placeholder "Select outside value"
  - Default `outsideValue` in home config stays "€0"

### 5. Delete products from Set Preferences
**File**: `src/components/onboarding/step-preferences.tsx`
- Add `onRemoveInsurance` prop (callback `(id: string) => void`)
- In `renderProductTabs()`, add a small trash/X icon on each product tab pill that appears on hover
- The delete icon is only shown when `selectedInsurances.length > 1` (disabled/hidden when only 1 product)
- Clicking it calls `onRemoveInsurance(id)`, switches active tab if needed

**File**: `src/pages/index.tsx`
- Pass `onRemoveInsurance` to `StepPreferences` (same handler as offer page: filter from `selectedInsurances`)

### 6. Acceptance questions: "Healthy" defaults to Yes
**File**: `src/pages/index.tsx`
- Change initial `acceptanceAnswers` from `healthy: "no"` to `healthy: "yes"`

### 7. Acceptance questions: Show explanation inputs when "Yes" selected (non-default)
**File**: `src/components/onboarding/step-acceptance-questions.tsx`
- Add a `QUESTION_EXPLANATION_CONFIG` mapping per question ID defining the input label(s) to show when user selects "Yes":
  - `cancelled`: "Explanation of termination(s)"
  - `criminal`: "Details of the offense or contact"
  - `claims`: "Explanation of claims" + "Number of claims" (two fields)
  - `bankrupt`: "Details of bankruptcy or debt restructuring"
  - `fraud`: "Details of the fraud or deception"
  - `bailiff`: "Details of the seizure"
  - `healthy`: no fields (Yes is default; show fields only when "No" is selected instead)
- For `healthy`, the logic is inverted: show explanation field when "No" is selected (label: "Details of health condition or defect")
- Add props for `explanations: Record<string, string>` and `onUpdateExplanation: (field: string, value: string) => void`
- Render `FloatingLabelInput` or `Textarea` fields below each question card when the non-default answer is selected

**File**: `src/components/onboarding/types.ts`
- Add `acceptanceExplanations: Record<string, string>` to `WizardState`

**File**: `src/pages/index.tsx`
- Add `acceptanceExplanations: {}` to `INITIAL_STATE`
- Pass `explanations` and `onUpdateExplanation` to `StepAcceptanceQuestions`

### Files changed (summary)

| File | Changes |
|------|---------|
| `src/components/onboarding/step-birthdate.tsx` | Update Taco message text |
| `src/components/products/multi-car-flow-tab.tsx` | Always show car tabs |
| `src/config/products/home.ts` | Add "An apartment" to presetChecklist |
| `src/components/products/home-steps.tsx` | Replace outside value with toggle+dropdown |
| `src/components/onboarding/step-preferences.tsx` | Add delete product functionality, add `onRemoveInsurance` prop |
| `src/pages/index.tsx` | Pass `onRemoveInsurance` to prefs, change healthy default to "yes", add `acceptanceExplanations` state |
| `src/components/onboarding/step-acceptance-questions.tsx` | Add conditional explanation inputs per question |
| `src/components/onboarding/types.ts` | Add `acceptanceExplanations` field |

