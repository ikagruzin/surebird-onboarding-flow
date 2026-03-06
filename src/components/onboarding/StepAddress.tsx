import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, CheckCircle2, Loader2 } from "lucide-react";

interface AddressResult {
  street: string;
  city: string;
  fullAddress: string;
  additions: string[];
}

interface StepAddressProps {
  firstName: string;
  postcode: string;
  houseNumber: string;
  addition: string;
  onUpdate: (field: "postcode" | "houseNumber" | "addition", value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

// Mock address lookup — in production, replace with a real Dutch postcode API
async function lookupAddress(
  postcode: string,
  houseNumber: string
): Promise<AddressResult | null> {
  // Simulate API delay
  await new Promise((r) => setTimeout(r, 600));

  const pc = postcode.replace(/\s/g, "").toUpperCase();

  // Mock data for demo
  const DB: Record<string, Record<string, AddressResult>> = {
    "1053TM": {
      "8": {
        street: "Korteblekerstraat",
        city: "Amsterdam",
        fullAddress: "Korteblekerstraat 8, Amsterdam",
        additions: ["", "1", "2", "3"],
      },
    },
    "1012AB": {
      "1": {
        street: "Dam",
        city: "Amsterdam",
        fullAddress: "Dam 1, Amsterdam",
        additions: [""],
      },
    },
  };

  return DB[pc]?.[houseNumber] ?? null;
}

const StepAddress = ({
  firstName,
  postcode,
  houseNumber,
  addition,
  onUpdate,
  onNext,
  onBack,
}: StepAddressProps) => {
  const [addressResult, setAddressResult] = useState<AddressResult | null>(null);
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
      if (result && result.additions.length === 1) {
        onUpdate("addition", result.additions[0]);
      }
    } else {
      setAddressResult(null);
      setLooked(false);
    }
  }, [postcode, houseNumber, onUpdate]);

  useEffect(() => {
    const timeout = setTimeout(doLookup, 400);
    return () => clearTimeout(timeout);
  }, [doLookup]);

  const resolvedAddress = addressResult
    ? addition
      ? `${addressResult.street} ${houseNumber}${addition ? `-${addition}` : ""}, ${addressResult.city}`
      : `${addressResult.street} ${houseNumber}, ${addressResult.city}`
    : null;

  const hasAdditions =
    addressResult && addressResult.additions.filter((a) => a !== "").length > 0;

  const canProceed =
    addressResult != null &&
    postcode.trim().length >= 6 &&
    houseNumber.trim().length > 0 &&
    (hasAdditions ? addition !== "" : true);

  return (
    <div className="animate-fade-in max-w-md">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Nice to meet you, {firstName}! We need your address information to select
        the right and most suitable insurance for you.
      </h1>

      <div className="space-y-4 mt-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Postcode
            </label>
            <Input
              value={postcode}
              onChange={(e) => onUpdate("postcode", e.target.value.toUpperCase())}
              placeholder="1053TM"
              className="h-11"
              maxLength={7}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              House number
            </label>
            <Input
              value={houseNumber}
              onChange={(e) => onUpdate("houseNumber", e.target.value)}
              placeholder="8"
              className="h-11"
              maxLength={10}
            />
          </div>
        </div>

        {hasAdditions && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Addition
            </label>
            <Select value={addition} onValueChange={(v) => onUpdate("addition", v)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select addition" />
              </SelectTrigger>
              <SelectContent>
                {addressResult!.additions
                  .filter((a) => a !== "")
                  .map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

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

      <div className="flex justify-between mt-10">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default StepAddress;
