

## Generate Product_Data_Template_v3.xlsx

### Overview

Create a comprehensive Excel workbook with 9 sheets: one per product (7 sheets with both Set Preferences and Offer Preferences data on the same sheet), plus Tooltips and Taco Messages sheets. All text columns include EN and NL pairs. The NL columns will be empty placeholders — and yes, once you upload a version with Dutch translations filled in, I can parse it and update the file automatically.

### Sheet Structure

**Per-product sheets (7):** Each has two sections separated by a bold header row.

Columns for both sections:
`Phase | Field ID | Question (EN) | Question (NL) | Type | Options (EN) | Options (NL) | Default Value | Conditional On | Notes`

---

### Product Sheet Contents

**1. Car** (3 steps + 2 offer fields)
- Set Preferences:
  - car-identity: licensePlate (text input, 6 chars), plateConfirmed (auto)
  - car-driver: mainDriver (Yes/No, segmented), driverRelationship (My partner, My child, Myself — cards, conditional on mainDriver=No), driverAge (number, conditional on relationship != Myself), legalOwner (My partner, Myself — cards, conditional on mainDriver=No)
  - car-usage: damageFreeYears (number), kmPerYear (select, 6 brackets)
- Offer Preferences:
  - basicCoverage: WA, WA+ Limited Casco, WA+ Full Casco All-risk (default: WA+)
  - ownRisk: 100, 250, 500, 0 (default: 100)

**2. Home** (6 steps + 3 offer fields)
- Set Preferences: presetAnswer, role, buildingType, usage (multi-chip), constructionMaterial, floorMaterial, roofShape, roofMaterial, coverageChoice, highValueAV + amount, jewelry + amount, specialAssets + amount, ownerInterest + amount, security, netIncome, outsideValue, monumental, quoted (outbuildings), floorCount, rainwater (renovation), smartSensors (solar), heatPump
- Offer: ownRisk (100/250/500/0, default 100), contentCoverage (Extra extensive/All Risk, default All Risk), buildingCoverage (Extra extensive/All Risk, default All Risk)

**3. Travel** (3 steps + 2 offer fields)
- Set Preferences: travelDays (60/90/180/365), coverageArea (Europe/Worldwide), playsSport (Y/N), adventureSports (Y/N), bringsEquipment (Y/N), golfEquipment (Y/N), divingEquipment (Y/N), supplements (9 checkbox options)
- Offer: ownRisk (100/250/500/0, default 100), extraSupport (2500/1000/0, default 0)

**4. Legal Expenses** (1 step + 1 offer field)
- Set Preferences: coverageModules — Consumer (locked), Housing, Work & Income, Traffic, Home owners, Own Vehicle, Tax & Wealth, Mediation
- Offer: ownRisk (100/250/500/0, default 100)

**5. Liability** (1 step + 1 offer field)
- Set Preferences: dog (No/Yes), damageLimit (€1.25M/€2.25M)
- Offer: ownRisk (100/0, default 100)

**6. Accidents** (1 step + 1 offer field)
- Set Preferences: coverage (4 tiers: Death €5K|Disability €25K through Death €20K|Disability €150K)
- Offer: ownRisk (100/250/500/0, default 100)

**7. Caravan** (3 steps + 2 offer fields)
- Set Preferences: caravanType (3 options), usage (4 dropdown options), usedAsMobileHome (Y/N conditional), nearFloodRiver (Y/N conditional), identificationMethod (3 options), licensePlate/chassisNumber, brand (10 options), yearOfConstruction, length (5 options), condition (New/Second hand), catalogueValue, purchaseValue (conditional)
- Offer: desiredCoverage (Fire and theft/Casco Limited (WA)/Casco Extended, default Casco Limited), ownRisk (100/250/500/0, default 100)

---

### Sheet 8: Tooltips

Columns: `Product | Step | Level | Question/Option (EN) | Question/Option (NL) | Tooltip (EN) | Tooltip (NL)`

Level = "Question" or "Option"

~40+ entries extracted from all UI components including:
- **Question-level**: Car (license plate, main driver, legal owner, damage-free years), Caravan (mobile home, floodplain, length, bought as), Home (building type, roof material, security, net income, outside value, monumental, outbuildings, renovation, solar, heat pump, 4 content items), Travel (coverage area, adventure sports), Liability (dog, damage limit), Accidents (coverage level), plus coverage path options (3 entries)
- **Option-level**: Home construction materials (3), floor material "No floors", roof shape "Special", Caravan type "Touring caravan" and "Folding trailer"

### Sheet 9: Taco Messages

Columns: `Product | Step ID | Step Label (EN) | Step Label (NL) | Message (EN) | Message (NL)`

20 entries across all products, one per step.

---

### Technical Details

- Built with openpyxl, bold headers with light fill per section
- Auto-width columns, NL columns empty as placeholders
- Saved to `/mnt/documents/Product_Data_Template_v3.xlsx`

### Dutch Translation Workflow

Yes — once you upload a version with NL columns filled in, I can parse the Excel file and automatically merge the Dutch translations into the workbook, matching by Product + Field ID / Step ID.

