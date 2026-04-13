import { useState, useEffect, useCallback } from "react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { TacoMessage } from "./taco-message";
import { ValidationError } from "./validation-error";
import { CheckCircle2, Loader2 } from "lucide-react";

interface StepCaravanLocationProps {
  postcode: string;
  houseNumber: string;
  addition: string;
  onUpdate: (field: "caravanLocationPostcode" | "caravanLocationHouseNumber" | "caravanLocationAddition", value: string) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

async function lookupAddress(postcode: string, houseNumber: string) {
  await new Promise((r) => setTimeout(r, 600));
  const pc = postcode.replace(/\s/g, "").toUpperCase();
  const DB: Record<string, Record<string, { street: string; city: string }>> = {
    "1053TM": { "8": { street: "Korteblekerstraat", city: "Amsterdam" } },
    "1012AB": { "1": { street: "Dam", city: "Amsterdam" } },
  };
  return DB[pc]?.[houseNumber] ?? null;
}

export const StepCaravanLocation = ({
  postcode,
  houseNumber,
  addition,
  onUpdate,
  animateTaco,
  errors,
  onClearError,
}: StepCaravanLocationProps) => {
  const [addressResult, setAddressResult] = useState<{ street: string; city: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [looked, setLooked] = useState(false);

  const doLookup = useCallback(async () => {
    const pc = postcode.replace(/\s/g, "");
    if (pc.length >= 6 && houseNumber.trim().length > 0) {
      setLoading(true);
      setLooked(false);
      const result = await lookupAddress(pc, houseNumber.trim());
      setAddressResult(result);
      setLoading(false);
      setLooked(true);
    } else {
      setAddressResult(null);
      setLooked(false);
    }
  }, [postcode, houseNumber]);

  useEffect(() => {
    const timeout = setTimeout(doLookup, 400);
    return () => clearTimeout(timeout);
  }, [doLookup]);

  const resolvedAddress = addressResult
    ? `${addressResult.street} ${houseNumber}${addition ? `-${addition}` : ""}, ${addressResult.city}`
    : null;

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        message="Where is your caravan located? 📍"
        animate={animateTaco}
      />

      <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Caravan location</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FloatingLabelInput
              label="Postcode"
              value={postcode}
              onChange={(e) => {
                onUpdate("caravanLocationPostcode", e.target.value.toUpperCase());
                onClearError?.("caravanPostcode");
              }}
              maxLength={7}
              className={errors?.caravanPostcode ? "border-destructive" : ""}
            />
            <ValidationError message={errors?.caravanPostcode} />
          </div>
          <div>
            <FloatingLabelInput
              label="House number"
              value={houseNumber}
              onChange={(e) => {
                onUpdate("caravanLocationHouseNumber", e.target.value);
                onClearError?.("caravanHouseNumber");
              }}
              maxLength={10}
              className={errors?.caravanHouseNumber ? "border-destructive" : ""}
            />
            <ValidationError message={errors?.caravanHouseNumber} />
          </div>
        </div>

        <FloatingLabelInput
          label="Addition (optional)"
          value={addition}
          onChange={(e) => onUpdate("caravanLocationAddition", e.target.value)}
        />

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Looking up address…
          </div>
        )}

        {!loading && looked && addressResult && resolvedAddress && (
          <div className="flex items-center gap-2 bg-success/10 text-success rounded-lg px-4 py-3 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {resolvedAddress}
          </div>
        )}

        {!loading && looked && !addressResult && (
          <p className="text-sm text-destructive">
            Address not found. Please check your postcode and house number.
          </p>
        )}
      </div>
    </div>
  );
};
