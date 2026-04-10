

## Plan: Update Offer Preferences + Export About You & Finalise Copy

### Part 1: Update Offer Preferences from Spreadsheet

The spreadsheet data is largely already implemented in the detail offer cards. The one meaningful gap is:

**Home: Separate content vs building coverage on the Offer page**

The spreadsheet defines two distinct offer fields: `contentCoverage` (Extra extensive | All Risk) and `buildingCoverage` (Extra extensive | All Risk). Currently the code uses a single `CoverageCard` regardless of sub-tab.

Additionally, the `OFFER_PREFERENCES` constant in `step-offer.tsx` (used for "All offers" tab quick selectors) is missing entries for **car** and **caravan**, and **home** is missing the coverage selectors.

| File | Change |
|------|--------|
| `src/components/products/home-offer-cards.tsx` | Split `CoverageCard` into two: render "Content coverage" card when `activeSubTab === "household"` and "Building coverage" card when `activeSubTab === "building"`. Both use same Extra extensive / All Risk options. Track separate keys `contentCoverage` and `buildingCoverage` in offer state. |
| `src/components/onboarding/step-offer.tsx` | Update `OFFER_PREFERENCES` to add: **car** (basicCoverage segmented WA/WA+ Limited Casco/WA+ Full Casco, ownRisk €0/€100/€250/€500), **caravan** (desiredCoverage: Fire and theft/Casco Limited/Casco Extended, ownRisk), **home** add contentCoverage + buildingCoverage, **accidents** add ownRisk. Update `offerInitialState` defaults to match spreadsheet. |
| `src/config/products/home.ts` | Add `contentCoverage` and `buildingCoverage` to `offerInitialState` (default: "All Risk"). |

### Part 2: Export About You & Finalise Copy as Two Excel Files

Generate two Excel files for marketing/translation:

**File 1: `About_You_Copy.xlsx`** — Two sheets:
- **Questions & Answers**: Phase, Step, Field ID, Question (EN), Question (NL) [empty], Type, Options (EN), Options (NL) [empty], Default Value, Notes
  - Covers: Product selection, Name, Address, Birthdate, Family status, Family details, Ready
- **Taco Messages**: Step ID, Step Label (EN), Step Label (NL) [empty], Message (EN), Message (NL) [empty]

**File 2: `Finalise_Copy.xlsx`** — Two sheets:
- **Questions & Answers**: Same schema. Covers: Start date, Confirm details, Phone verification, iDIN verification, Acceptance questions, Final preview, Success
- **Taco Messages**: Same schema for Finalise-phase Taco messages

All copy will be extracted directly from the codebase (current English text). NL columns left empty with yellow highlighting for the marketing team to fill in.

| File | Action |
|------|--------|
| `/mnt/documents/About_You_Copy.xlsx` | Generate via Python/openpyxl |
| `/mnt/documents/Finalise_Copy.xlsx` | Generate via Python/openpyxl |

