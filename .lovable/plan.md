

## Dynamic Progress Bar for Set Preferences

### What You Want

One single progress bar that reflects total completion across **all selected products**, accounting for each product's internal steps. When every product's steps are fully filled, the bar reaches 100%.

### How It Works Today

The progress bar counts answered questions from `QUESTIONS_BY_TYPE` — a legacy system that most products no longer use. Products like Home, Car, Caravan, Travel, Legal, and Accidents use `ProductFlowTab` with multi-step flows, but their progress is **not counted** at all.

### Solution

Replace the static `QUESTIONS_BY_TYPE`-based calculation with one that reads each product's actual progress from `productFlowRefs`:

```text
For each selected product:
  - If completed (in completedTabs) → count as total/total
  - If has a productFlowRef → read ref.progress { completed, total }
  - Fallback (legacy) → count answered QUESTIONS_BY_TYPE

Sum all completed / Sum all totals → progressPercent
```

**Re-render trigger**: Refs don't cause re-renders, so we add a `progressTick` counter that increments whenever a tab completes or internal navigation happens (via a polling interval or callback).

### Key Detail

`ProductFlowTabHandle` already exposes `progress: { completed: number; total: number }` — this data is available, just not being read.

### File Changes

| File | Change |
|------|--------|
| `src/components/onboarding/step-preferences.tsx` | Replace lines 323-329 with dynamic calculation that reads from `productFlowRefs.current[id]?.progress` for product-flow products, marks completed tabs as 100%, and falls back to `QUESTIONS_BY_TYPE` for legacy. Add a `useEffect` interval (every 300ms) to poll ref progress and update a state variable, ensuring the bar re-renders as users fill steps. |

