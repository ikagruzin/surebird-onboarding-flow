

## Generate Product Data Template Spreadsheet

### What We're Building

An Excel spreadsheet template that lists all product data across two sections — **Set Preferences** (data collected during the preferences phase) and **Offer Preferences** (data shown/editable on the offer page). You fill in missing offer preferences and return the file.

### Spreadsheet Structure

Each product gets its own sheet tab (Home, Liability, Travel, Car, Legal, Accidents, Caravan). Each sheet has:

| Column | Description |
|--------|-------------|
| **Phase** | "Set Preferences" or "Offer Page" |
| **Field ID** | Technical key (e.g. `ownRisk`, `dog`) |
| **Question (EN)** | English label shown to user |
| **Question (NL)** | Empty — for business to translate |
| **Type** | `select`, `radio`, `toggle`, `number`, `text`, `checklist` |
| **Options (EN)** | Pipe-separated values (e.g. `€100 \| €250 \| €500`) |
| **Options (NL)** | Empty — for translation |
| **Default Value** | Pre-selected value |
| **Conditional On** | Parent field + value that triggers visibility (e.g. `mainDriver = No`) |
| **Notes** | Any extra context |

### What's Pre-filled

- **Set Preferences rows**: Extracted from each product's `initialState`, `stepDefs`, and step components (field IDs, labels, options, defaults, conditions)
- **Offer Preferences rows**: The 4 products that already have data (liability, home, travel, legal) are pre-filled from `OFFER_PREFERENCES`
- **Missing products** (car, accidents, caravan): Offer Preferences section left with placeholder rows highlighted in yellow for you to complete

### Your Workflow

1. I generate the Excel file with all current data pre-filled
2. You (or business) fill in the yellow-highlighted rows for missing offer preferences
3. You add Dutch translations in the NL columns
4. Upload the completed file back
5. I update the codebase from the spreadsheet data

### Plan of Actions

1. **Read all product configs and step components** to extract field IDs, labels, options, defaults, and conditional logic
2. **Read existing `OFFER_PREFERENCES`** from step-offer.tsx
3. **Generate the Excel file** using openpyxl with one sheet per product, pre-filled data, and yellow-highlighted empty cells
4. **Deliver** as a downloadable file

