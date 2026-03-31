

## Add Descriptions to Legal & Travel Options in Product_Data_Template_v3.xlsx

### What Changes

For **Legal Expenses** and **Travel** product sheets, the `coverageModules` and `supplements` fields currently list only the option titles (e.g., "Consumer, Housing, Work & Income..."). Each option also has a description/subtitle in the codebase that should be captured.

### Approach

Add a new column **"Option Descriptions (EN)"** and **"Option Descriptions (NL)"** to the product sheet layout — or, more practically, expand the existing rows for these two fields into **one row per option** with columns for:

| Phase | Field ID | Question (EN) | Question (NL) | Type | Option Title (EN) | Option Title (NL) | Option Description (EN) | Option Description (NL) | Default Value | Conditional On | Notes |

This applies to:

**Legal Expenses sheet** — `coverageModules` field, 8 options:
1. Consumer — "Conflicts over broken goods or services..." (locked/Included badge)
2. Housing — "Neighbor quarrels, conflicts that arise..." (85% pick this)
3. Work & Income — "Legal aid regarding work and income..." (72% pick this)
4. Traffic — "Disputes arising from participation in traffic..." (65% pick this)
5. Home owners — "Legal disputes related to buildings you own..."
6. Own Vehicle — "Legal disputes specifically related to vehicles you own."
7. Tax & Wealth — "Assistance with disputes about investment products..."
8. Mediation — "Covers mediator costs for divorces or separations..."

**Travel sheet** — `supplements` field, 9 options:
1. Medical Expenses — "Your health insurance pays Dutch rates abroad..." (Recommended badge)
2. Cancellation Fees — "Get your money back if your trip is canceled..."
3. Luggage — "Protect your suitcase, electronics, and personal items..."
4. Extraordinary Costs — "Covers search and rescue, emergency transport home..."
5. Business Trip — "Covers work travel, fairs, or congresses..." (Check Employer badge)
6. Legal Assistance — "Covers legal costs abroad..." (cross-product: Already in bundle)
7. Accidents — "A fixed payout for permanent disability or death..."
8. Road Assistance — "Emergency support if your vehicle breaks down abroad." (cross-product: Check Car Policy)
9. Cash — "Coverage up to €750 for stolen cash..."

### Implementation

- Regenerate `Product_Data_Template_v3.xlsx` with the two affected product sheets expanded
- Each option gets its own row under the parent field, with `Field ID` like `coverageModules.consumer`, `coverageModules.housing`, etc.
- Add **Option Description (EN)** and **Option Description (NL)** columns (NL highlighted yellow as placeholder)
- Badge info goes in the Notes column
- All other product sheets and Tooltips/Taco Messages sheets remain unchanged

### Files Changed

| File | Change |
|------|--------|
| `/mnt/documents/Product_Data_Template_v3.xlsx` | Legal & Travel sheets updated with per-option description rows |

