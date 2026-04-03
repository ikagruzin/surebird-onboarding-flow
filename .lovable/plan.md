## Offer Page — 4 Feature Updates (excluding badge redesign)

### 1. Recalculating Overlay — Full Page

Move the overlay from inside `div.relative` (lines 1411-1417) to a `fixed inset-0 z-[60]` full-page overlay rendered at the root level of the component return (near the policy modal at bottom). Keep the spinning Surebird logo centered with "Updating prices..." text.

**Changes**:
- Remove the overlay from inside `<div className="relative">` (lines 1412-1416)
- Add at root level (before closing `</div>` of the component, near line 1624):
```tsx
{isRecalculating && (
  <div className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
    <img src={surebirdIcon} alt="Loading" className="w-16 h-16 animate-[spin_2s_linear_infinite]" />
    <p className="text-lg font-medium text-muted-foreground mt-4">Updating prices...</p>
  </div>
)}
```

### 2. Lock Discount for 24h — Complete Flow

**New imports** (line 1-2): Add `Clock` from lucide, `FloatingLabelInput`, `Checkbox`

**New states** (after line 209):
```tsx
const [showLockModal, setShowLockModal] = useState(false);
const [lockFormPhase, setLockFormPhase] = useState<"form" | "success">("form");
const [discountLocked, setDiscountLocked] = useState(false);
const [discountLockedAt, setDiscountLockedAt] = useState<number | null>(null);
const [lockName, setLockName] = useState(firstName || "");
const [lockEmail, setLockEmail] = useState("");
const [lockPhone, setLockPhone] = useState("");
const [lockMarketing, setLockMarketing] = useState(true);
const [lockPrivacy, setLockPrivacy] = useState(false);
const [lockCountdown, setLockCountdown] = useState("24:00:00");
```

**Countdown effect**:
```tsx
useEffect(() => {
  if (!discountLockedAt) return;
  const interval = setInterval(() => {
    const diff = 24 * 3600 * 1000 - (Date.now() - discountLockedAt);
    if (diff <= 0) { setLockCountdown("00:00:00"); clearInterval(interval); return; }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    setLockCountdown(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
  }, 1000);
  return () => clearInterval(interval);
}, [discountLockedAt]);
```

**Update button** (lines 1132-1135): Replace with conditional:
```tsx
{discountLocked ? (
  <button disabled className="w-full mt-3 inline-flex items-center justify-center gap-2 border border-success/30 bg-success/5 rounded-full px-6 py-3 text-sm font-medium text-success cursor-not-allowed">
    <Check className="w-4 h-4" />
    Discount locked {lockCountdown}
  </button>
) : (
  <button onClick={() => { setShowLockModal(true); setLockFormPhase("form"); }} className="w-full mt-3 inline-flex ...same styles...">
    <Lock className="w-4 h-4" />
    Lock discount for 24h
  </button>
)}
```

**Lock modal** (rendered at root level):
```tsx
{showLockModal && (
  <div className="fixed inset-0 z-[60] bg-black/40" onClick={() => setShowLockModal(false)} />
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div className="bg-background rounded-2xl border shadow-xl max-w-lg w-full p-8 relative">
      <button onClick={() => setShowLockModal(false)} className="absolute top-4 right-4 ...">
        <X />
      </button>
      {lockFormPhase === "form" ? (
        <>
          <TacoMessage message="Please enter your details to lock the discount for 24h and save your offer" />
          <div className="space-y-4">
            <FloatingLabelInput label="Name" value={lockName} onChange={...} />
            <FloatingLabelInput label="Email address" value={lockEmail} onChange={...} />
            <FloatingLabelInput label="Phone number" value={lockPhone} onChange={...} />
          </div>
          <div className="space-y-3 mt-6">
            <label className="flex items-start gap-3">
              <Checkbox checked={lockMarketing} onCheckedChange={...} />
              <span>Yes, keep comparing offers monthly and send me updates and offers</span>
            </label>
            <label className="flex items-start gap-3">
              <Checkbox checked={lockPrivacy} onCheckedChange={...} />
              <span>I agree to the <a className="text-primary underline">privacy policy</a> and <a className="text-primary underline">terms and conditions</a></span>
            </label>
          </div>
          <button onClick={() => { setLockFormPhase("success"); setDiscountLocked(true); setDiscountLockedAt(Date.now()); setTimeout(() => setShowLockModal(false), 2000); }} disabled={!lockPrivacy} className="w-full mt-6 ...primary button...">
            Lock the discount
          </button>
        </>
      ) : (
        <div className="text-center py-8">
          <Check className="w-12 h-12 text-success mx-auto mb-4" />
          <h3 className="text-xl font-bold">Your discount is locked for 24 hours!</h3>
        </div>
      )}
    </div>
  </div>
)}
```

### 3. Price Breakdown Modal

**New state**: `const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);`

**Trigger** (line 1139): Add `onClick={() => setShowPriceBreakdown(true)}` to the "Check the price breakdown" span.

**Modal** (rendered at root level):
```tsx
{showPriceBreakdown && (
  <overlay + centered card>
    <h3>Price breakdown</h3>
    {calcLineItems.map(item => (
      <row: item.label → €{item.originalPrice.toFixed(2)} />
    ))}
    <separator />
    <row: "Surebird service costs" → €2.50 <InfoTooltip: "This covers continuous monitoring..." /> />
    <row: "Insurance tax (21%)" → €{(totalBeforeDiscount * 0.21).toFixed(2)} />
    <separator />
    <row: "Bundle discount (-{discountPercent}%)" → -€{discountAmount.toFixed(2)} (in red) />
    {annualDiscount && <row: "Annual payment discount (-5%)" → -€{annualPaymentSaving.toFixed(2)} />}
    <separator />
    <bold row: "Total per month" → €{totalAfterDiscount.toFixed(2)} />
  </card>
)}
```

Uses `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent` for the info icon on service costs.

### 4. Add Product Loading — Centered

Change lines 894-895 from:
```tsx
<div className="max-w-3xl mx-auto px-6 py-12">
```
to:
```tsx
<div className="flex items-center justify-center min-h-screen">
```

### File Changes

| File | Change |
|------|--------|
| `src/components/onboarding/step-offer.tsx` | (1) Add imports: `Clock`, `FloatingLabelInput`, `Checkbox`, `Tooltip*`. (2) Add new states for lock modal, price breakdown. (3) Add countdown effect. (4) Move recalc overlay to fixed full-page. (5) Update lock discount button with conditional. (6) Add price breakdown click handler. (7) Render lock modal, price breakdown modal at root. (8) Center add-product loading container. |
