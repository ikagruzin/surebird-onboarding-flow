import { useState, useEffect, useCallback } from "react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { TacoMessage } from "./taco-message";
import { ValidationError } from "./validation-error";
import { Info } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";

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
  animateTaco?: boolean;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

// Mock address lookup
async function lookupAddress(
  postcode: string,
  houseNumber: string
): Promise<AddressResult | null> {
  await new Promise((r) => setTimeout(r, 600));
  const pc = postcode.replace(/\s/g, "").toUpperCase();
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

export const StepAddress = ({
  firstName,
  postcode,
  houseNumber,
  addition,
  onUpdate,
  onNext,
  onBack,
  animateTaco,
  errors,
  onClearError,
}: StepAddressProps) => {
  const t = useT();
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

  return (
    <div className="animate-fade-in">
      <TacoMessage
        stepId="address"
        vars={{ firstName }}
        message={t("ui.aboutYou.taco_address", { firstName }, `Hey ${firstName} 👋 Nice to meet you! I have some questions to you to find the best deal for you. What is your address?`)}
        animate={animateTaco}
      />

      <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FloatingLabelInput
                label={t("ui.aboutYou.postcode_label", undefined, "Postcode")}
                value={postcode}
                onChange={(e) => {
                  onUpdate("postcode", e.target.value.toUpperCase());
                  onClearError?.("postcode");
                }}
                maxLength={7}
                autoFocus={!postcode}
                className={errors?.postcode ? "border-destructive" : ""}
              />
              <ValidationError message={errors?.postcode} />
            </div>
            <div>
              <FloatingLabelInput
                label={t("ui.aboutYou.houseNumber_label", undefined, "House number")}
                value={houseNumber}
                onChange={(e) => {
                  onUpdate("houseNumber", e.target.value);
                  onClearError?.("houseNumber");
                }}
                maxLength={10}
                className={errors?.houseNumber ? "border-destructive" : ""}
              />
              <ValidationError message={errors?.houseNumber} />
            </div>
          </div>

          {hasAdditions && (
            <Select value={addition} onValueChange={(v) => onUpdate("addition", v)}>
              <SelectTrigger className="h-12 rounded-lg">
                <SelectValue placeholder={t("ui.aboutYou.addition_placeholder", undefined, "Select addition")} />
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
          )}

          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("ui.aboutYou.address_lookup_loading", undefined, "Looking up address…")}
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
              {t("ui.aboutYou.address_not_found", undefined, "Address not found. Please check your postcode and house number.")}
            </p>
          )}
        </div>

        <div className="flex items-start gap-2 mt-8 text-muted-foreground">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-sm">
            {t("ui.aboutYou.address_info_text", undefined, "We need this information because your address is used by insurers when calculating the amount of your premium.")}
          </p>
        </div>
      </div>
    </div>
  );
};

