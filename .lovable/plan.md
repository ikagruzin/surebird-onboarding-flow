

## Add Validation Errors to Product Steps & Finalise Phase (Excluding Defaults)

### Scope

Add inline validation errors only for fields that **start empty and require user action**. Fields with defaults/preselected values are excluded since they're always valid.

### Fields That Need Errors

**Home**
- `presetAnswer` (empty) → "Please confirm whether your house matches"
- `role` (empty) → "Please select tenant or homeowner"
- `coverageChoice` (empty) → "Please select your coverage type"
- `home-details` step: `buildingType`, `usage`, `constructionMaterial`, `floorMaterial`, `roofShape`, `roofMaterial` (all empty) → specific messages per field
- Contents/Building steps: all have defaults → **no errors needed**

**Car**
- `licensePlate` (empty) → "Please enter a valid license plate"
- `plateConfirmed` (false) → "Please confirm your vehicle details"
- `mainDriver` (empty) → "Please indicate if you are the main driver"
- `driverRelationship` (empty, conditional) → "Please select the driver's relationship"
- `driverAge` (empty, conditional) → "Please select the driver's age"
- `legalOwner` (empty, conditional) → "Please indicate the legal owner"
- `damageFreeYears` (empty) → "Please select your damage-free years"
- `kmPerYear` (empty) → "Please select your annual mileage"

**Caravan**
- `caravanType` (empty) → "Please select your caravan type"
- `usage` (empty) → "Please select how you use your caravan"
- `brand` (empty) → "Please select the brand"
- `yearOfConstruction` (empty) → "Please enter the year of construction"
- `length` (empty) → "Please select the length"
- `condition` (empty) → "Please select the condition"
- `catalogueValue` (empty) → "Please enter the catalogue value"
- `purchaseValue` (empty, conditional) → "Please enter the purchase value"

**Travel**
- `playsSport` (empty) → "Please indicate if you play sports while travelling"
- All other fields have defaults → **no errors needed**

**Liability** → all fields have defaults → **no errors needed**
**Legal** → has defaults → **no errors needed**
**Accidents** → has defaults → **no errors needed**

**Finalise Phase**
- `phone` (currently not validated) → "Please enter your phone number"
- `acceptance-questions` (unanswered) → "Please answer all questions before continuing"

### Implementation

1. **Add `getValidationErrors(stepId, state)` to `ProductConfig`** — returns `Record<string, string>` (empty = valid). Only Home, Car, Caravan, Travel implement it.

2. **Update `useProductFlow`** — add `validationErrors` and `shakeFooter` state. On next, call `getValidationErrors`; if non-empty, set errors + shake instead of advancing.

3. **Update `ProductFlowTab`** — pass `errors` and `onClearError` to step components via extended `ProductStepProps`.

4. **Update product step components** — show `ValidationError` below fields with errors, apply `border-destructive` styling. Add `onClearError` calls on user interaction.

5. **Update `index.tsx`** — add phone validation to `confirm-details` and acceptance-questions validation.

6. **Update `step-confirm-details.tsx`** and **`step-acceptance-questions.tsx`** — display errors.

### Files Changed

| File | Change |
|------|--------|
| `src/config/products/types.ts` | Add optional `getValidationErrors` to ProductConfig |
| `src/config/products/home.ts` | Add `getValidationErrors` for preset, role, home-details, coverage-path |
| `src/config/products/car.ts` | Add `getValidationErrors` for identity, driver, usage |
| `src/config/products/caravan.ts` | Add `getValidationErrors` for context, specs, financial |
| `src/config/products/travel.ts` | Add `getValidationErrors` for sport step |
| `src/hooks/use-product-flow.ts` | Add error state, shake, validate-on-next |
| `src/components/products/product-flow-tab.tsx` | Pass errors + onClearError to step components |
| `src/components/products/home-steps.tsx` | Show errors on applicable fields |
| `src/components/products/car-steps.tsx` | Show errors on applicable fields |
| `src/components/products/caravan-steps.tsx` | Show errors on applicable fields |
| `src/components/products/travel-steps.tsx` | Show error on playsSport |
| `src/pages/index.tsx` | Add phone + acceptance-questions validation |
| `src/components/onboarding/step-confirm-details.tsx` | Show phone error |
| `src/components/onboarding/step-acceptance-questions.tsx` | Accept + show errors |

