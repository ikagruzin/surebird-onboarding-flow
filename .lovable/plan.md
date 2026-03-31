

## Fix Column Shift in Product_Data_Template_v3.xlsx

### Confirmed Issue

You are correct. The columns in all 7 product sheets are shifted by one position to the right. The intended layout was:

```text
A: Phase | B: Field ID | C: Question (EN) | D: Question (NL) | E: Type | F: Options (EN) | G: Options (NL) | H: Default Value | I: Conditional On | J: Notes
```

But what was generated shifted the data so that:
- **Column C (Question EN)** contains the Field ID text
- **Column D (Question NL)** contains the English question
- **Column E (Type)** is blank or has options
- **Column F (Options EN)** contains the Type value
- **Column G (Options NL)** contains the English options

The root cause: the script likely wrote `[phase, stepId, fieldId, questionEN, ...]` instead of `[phase, fieldId, questionEN, "", ...]`, inserting an extra Step ID column and pushing everything right.

### Fix Plan

1. **Regenerate all 7 product sheets** with correct column mapping:
   - Column A: Phase (Set Preferences / Offer Preferences)
   - Column B: Field ID (e.g., `licensePlate`, `mainDriver`)
   - Column C: Question (EN) — actual English question text
   - Column D: Question (NL) — empty placeholder
   - Column E: Type (segmented, radio, select, text, number, toggle, chips, cards)
   - Column F: Options (EN) — actual English option values
   - Column G: Options (NL) — empty placeholder
   - Column H: Default Value
   - Column I: Conditional On
   - Column J: Notes

2. **Highlight empty NL columns** using the same style from `Product_Data_Template.xlsx` — light yellow background fill on all cells in Question (NL) and Options (NL) columns to indicate "translation needed."

3. **Apply same highlighting** to Tooltips sheet (NL columns) and Taco Messages sheet (NL columns).

4. **Keep Tooltips and Taco Messages sheets unchanged** (only add the yellow highlight for missing NL data).

### Technical Details

- Rebuild using openpyxl with correct column order
- Match formatting from `Product_Data_Template.xlsx` (bold headers, light fill, auto-width)
- Apply yellow highlight (`FFFFF2CC` or similar) to all empty NL placeholder cells
- Save as `Product_Data_Template_v3.xlsx` (overwrite)

### Files Changed

| File | Change |
|------|--------|
| `/mnt/documents/Product_Data_Template_v3.xlsx` | Regenerated with corrected column mapping and NL highlights |

