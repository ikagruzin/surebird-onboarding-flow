

## Car Offer Page Fixes + All Offers Multi-Car Display

### Issues to Fix

**1. Per-instance offer state (independent insurance data per car)**
Currently `onUpdateOffer` writes to a flat `localOfferStates.car` object shared across all cars. Fix: key offer state by car instance ID (`localOfferStates.car[instanceId]`). Each car gets its own Own Risk, Coverage, and Additional Coverage selections.

**2. Rename "Vehicle" → "Car Details" with editable license plate**
Replace the read-only `VehicleCard` with an editable card titled "Car Details" that includes the `DutchPlateInput` component (same as Set Preferences identity step) plus the brand/model confirmation card. Users can change the plate and trigger a new lookup.

**3. Driver card not editable**
The `handleUpdateInstanceProduct` function writes keys like `__carInstance_car-123_mainDriver` into the flat product state — but the `DriverCard` reads from `activeState` which is the instance's snapshot. Fix: make `handleUpdateInstanceProduct` update the actual instance state inside `localProductStates.car.__carInstances[idx].state` so changes are reflected immediately.

**4. Car switcher placement — above the insurance offer card**
Move the multi-instance pill switcher out of `CarOfferCards` and render it in `step-offer.tsx` between the product tabs and the `renderOfferCard(activeTab)` call, so it appears above the insurance card (as shown in screenshot).

**5. "All offers" page — grouped under one heading**
When `activeTab === "all"` and there are multiple cars, render one "Car" heading followed by stacked insurance offer cards, each showing the formatted license plate as a sub-label (e.g., "AB-12-3C"). Each card's "Edit" button navigates to the car tab with the corresponding instance active.

### File Changes

| File | Change |
|------|--------|
| `src/components/products/car-offer-cards.tsx` | (1) Remove pill switcher from component (moved to parent). (2) Replace `VehicleCard` with `CarDetailsCard` — editable `DutchPlateInput` + brand/model confirmation, same as `car-steps.tsx` identity step. (3) Fix `handleUpdateInstanceProduct` to update instance state in-place via a new callback prop `onUpdateInstanceState`. (4) Make offer state read/write per instance via `instanceOfferState` / `onUpdateInstanceOffer`. |
| `src/components/onboarding/step-offer.tsx` | (1) Render car pill switcher above `renderOfferCard("car")` when `activeTab === "car"`. (2) Change car offer state structure to be keyed by instance ID: `localOfferStates.car = { [instanceId]: {...} }`. (3) Pass per-instance offer handlers to `CarOfferCards`. (4) In "All offers" view, for car product: render one "Car" heading then loop over car instances, rendering an offer card per instance with license plate sub-label. (5) Fix product state updates to mutate `__carInstances[idx].state` directly. |

### Technical Detail

**Per-instance offer state structure:**
```text
localOfferStates.car = {
  "car-123-1": { ownRisk: "100", coverage: "Limited Casco (WA+)", ... },
  "car-456-2": { ownRisk: "250", coverage: "Civil Liability (WA)", ... }
}
```

**Per-instance product state update** — instead of writing `__carInstance_id_key`, directly mutate the instance inside the array:
```text
setLocalProductStates(prev => {
  const instances = [...prev.car.__carInstances];
  instances[idx] = { ...instances[idx], state: { ...instances[idx].state, [key]: value } };
  return { ...prev, car: { ...prev.car, __carInstances: instances } };
});
```

**All offers rendering for car:**
```text
Car (heading)
├── [AB-12-3C] InsuranceOfferCard  → Edit opens car tab, idx=0
└── [XY-45-6Z] InsuranceOfferCard  → Edit opens car tab, idx=1
```

