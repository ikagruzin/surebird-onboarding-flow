

## Sidebar Info Card on Product Hover

### What

When the user hovers over any product on the first page, an info card instantly appears in the sidebar (above the "Ask Taco" section) with a short explanation of that insurance type. When the mouse leaves, the card disappears.

### How

1. **Add tooltip descriptions to data** (`src/components/onboarding/types.ts`)
   - Add a `tooltip` field to `InsuranceType` and populate each product with a short plain-language description

2. **Add `hoveredProduct` prop to Sidebar** (`src/components/onboarding/sidebar.tsx`)
   - Accept an optional `hoveredProduct: InsuranceType | null` prop
   - When set, render an info card above the "Ask Taco" section showing the product icon, name, and description
   - Use `animate-fade-in` for a smooth appearance

3. **Wire hover events in StepOne** (`src/components/onboarding/step-one.tsx`)
   - Add `hoveredProduct` state
   - On each product button: `onMouseEnter` → set hovered product, `onMouseLeave` → clear it
   - Pass `hoveredProduct` to `<Sidebar>`

### Info Card Design

Positioned in the sidebar between the progress/logo area and the "Ask Taco" section. Shows:
- Product icon (small)
- Product name (bold)
- 1-2 sentence description

Styled as a bordered card with `rounded-xl`, `bg-muted/50`, matching the existing design system.

### Tooltip Copy

| Product | Text |
|---------|------|
| Liability | "Covers damage you accidentally cause to others or their property — one of the most essential insurances." |
| Home | "Protects your house, belongings, and valuables against fire, theft, water damage, and storms." |
| Travel | "Covers medical emergencies, trip cancellations, lost luggage, and other costs while abroad." |
| Car | "Mandatory vehicle insurance covering damage to others, your own car, or both." |
| Legal expenses | "Provides legal assistance and covers attorney fees when you face a legal dispute." |
| Accidents | "Pays out a lump sum in case of permanent disability or death caused by an accident." |
| Caravan | "Covers your caravan or mobile home against damage, theft, and liability." |

### Files Changed

| File | Change |
|------|--------|
| `src/components/onboarding/types.ts` | Add `tooltip` field to `InsuranceType` + data |
| `src/components/onboarding/sidebar.tsx` | Accept `hoveredProduct` prop, render info card |
| `src/components/onboarding/step-one.tsx` | Add hover state, pass to Sidebar |

