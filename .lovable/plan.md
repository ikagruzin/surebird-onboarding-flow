

## Fix Product Workbench: Add Validation & Error Support

### Root Cause

The Product Workbench (`product-workbench.tsx`) was never updated when the "always-enabled CTA with validation on click" pattern was added. Two problems:

1. **`handleNext` skips validation** — it calls `flow.goNext()` directly without calling `flow.tryNext()` first. So on the last step, if `isValid` is true (which can happen with default/prefilled values), it immediately completes. On intermediate steps it advances without checking.

2. **Step components don't receive `errors` or `onClearError`** — the `StepComponent` render (line 173-179) passes no error props, so even if validation ran, fields wouldn't show red messages.

3. **Footer still uses old `disabled` pattern** — passing `disabled={!flow.isValid}` instead of always-enabled with shake.

### Fix

**File: `src/pages/product-workbench.tsx`**

1. Update `handleNext` to validate before advancing:
   - Call `flow.tryNext()` first; if it returns `false`, stop (errors are set).
   - Only proceed with `goNext()` or completion if validation passes.

2. Pass `errors={flow.validationErrors}` and `onClearError={flow.clearError}` to `StepComponent`.

3. Remove `disabled` from `StickyFooter`, add `shake={flow.shakeFooter}`.

### Files Changed

| File | Change |
|------|--------|
| `src/pages/product-workbench.tsx` | Add validation to handleNext, pass error props to steps, update footer |

