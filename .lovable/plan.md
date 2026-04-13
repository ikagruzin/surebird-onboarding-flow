

## Plan: Add Family Members Info, Registration Code, Caravan Location, and Legal Questions to Finalise Phase

This plan adds 5 new conditional steps in the Finalise phase, inserted between Phone Verification and iDIN Verification.

### New Step Flow (after phone verification)

```text
Phone Verification
  ↓
Family Members Info        ← if insuring partner/children OR car assigned to partner/child
  ↓
Select Regular Driver      ← if multiple children + car assigned to "My child"
  ↓
Car Registration Code      ← if any car selected
  ↓
Caravan Location           ← if caravan selected AND caravanType === "Mobile home"
  ↓
Legal Additional Questions ← if legal expenses selected
  ↓
iDIN Verification
  ↓
(rest unchanged)
```

### Technical Changes

#### 1. New StepIds in `src/config/flow-types.ts`
Add: `"family-members-info"`, `"select-regular-driver"`, `"car-registration-code"`, `"caravan-location"`, `"legal-additional-questions"`

#### 2. New steps in `src/config/flow-final.ts`
Insert 5 new step configs between `phone-verification` and `idin-verification`, each with `shouldSkip` logic:
- **family-members-info**: Skip if no partner/children to insure AND no car assigned to partner/child
- **select-regular-driver**: Skip if no car has `driverRelationship === "My child"` OR childrenCount <= 1
- **car-registration-code**: Skip if `car` not in selectedInsurances
- **caravan-location**: Skip if `caravan` not selected OR caravanType !== "Mobile home"
- **legal-additional-questions**: Skip if `legal` not in selectedInsurances

#### 3. WizardState additions in `src/components/onboarding/types.ts`
Add to `WizardState`:
- `gender: string` (for main user)
- `familyMembers: FamilyMember[]` (partner + children details)
- `carRegCodes: Record<string, string>` (keyed by car instance ID)
- `carRegularDrivers: Record<string, string>` (car instance → child index)
- `caravanLocationPostcode: string`, `caravanLocationHouseNumber: string`, `caravanLocationAddition: string`
- `legalAdditionalAnswers: Record<string, string>` (profession, working, company, disability, disabilityDetails, reorganization)

Where `FamilyMember = { relation: "partner" | "child"; firstName: string; infix: string; lastName: string; birthdate: string; gender: string }`

#### 4. Update `step-confirm-details.tsx`
Add a Gender field (Man / Woman / Different) as a segmented control below the name row.

#### 5. New component: `src/components/onboarding/step-family-members-info.tsx`
- Taco message: "Tell us about your family members 👨‍👩‍👧‍👦"
- For each family member (partner first, then children), render a card with: First name, Infix, Surname, Date of birth, Gender (Man/Woman/Different)
- Pre-populate the list from: insured partner + children count from About You phase, PLUS any car instances where `driverRelationship === "My child"` or `"My partner"` that aren't already covered

#### 6. New component: `src/components/onboarding/step-select-regular-driver.tsx`
- Shows one card per car that has `driverRelationship === "My child"`
- Card title: "Select a regular driver for [License Plate]"
- Lists children names (from familyMembers) as radio options
- Single select per car

#### 7. New component: `src/components/onboarding/step-car-registration-code.tsx`
- Taco message: "We need the reporting code for your vehicle(s). This is the last 4 digits of your chassis number, found on your registration certificate."
- For each car instance: show a card with the license plate (read-only) and a "Reporting code" input field
- Copy is more informative than the screenshot reference

#### 8. New component: `src/components/onboarding/step-caravan-location.tsx`
- Taco message: "Where is your mobile home located? 📍"
- Same postcode + house number + addition fields as the address step
- Pre-fill from user's address (postcode, houseNumber, addition)
- Auto-lookup address on valid input

#### 9. New component: `src/components/onboarding/step-legal-additional-questions.tsx`
- Visual style matches acceptance-questions (Yes/No toggles with conditional input fields)
- Questions:
  1. "What is your profession?" — text input (always shown)
  2. "Are you working?" — Yes/No → if Yes: "Which company do you work for?" input
  3. "Do you have a disability benefit?" — Yes/No → if Yes: "What disability benefit do you have?" input
  4. "Is a reorganization currently underway or is there a short-term?" — Yes/No

#### 10. Wire everything in `src/pages/index.tsx`
- Add new state fields to INITIAL_STATE
- Add `renderStep` cases for all 5 new steps
- Add validation for required fields
- Pass `gender` prop to StepConfirmDetails
- Pass `productStates` to new steps for car/caravan data access

| File | Action |
|------|--------|
| `src/config/flow-types.ts` | Add 5 new StepId values |
| `src/config/flow-final.ts` | Insert 5 step configs with shouldSkip logic |
| `src/components/onboarding/types.ts` | Add FamilyMember type + new WizardState fields |
| `src/components/onboarding/step-confirm-details.tsx` | Add Gender segmented control |
| `src/components/onboarding/step-family-members-info.tsx` | New component |
| `src/components/onboarding/step-select-regular-driver.tsx` | New component |
| `src/components/onboarding/step-car-registration-code.tsx` | New component |
| `src/components/onboarding/step-caravan-location.tsx` | New component |
| `src/components/onboarding/step-legal-additional-questions.tsx` | New component |
| `src/pages/index.tsx` | Wire all new steps, state, validation |

