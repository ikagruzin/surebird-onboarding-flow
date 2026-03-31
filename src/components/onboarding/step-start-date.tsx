import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { INSURANCE_TYPES } from "./types";
import { TacoMessage } from "./taco-message";
import { ValidationError } from "./validation-error";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import iconLiability from "@/assets/icon-liability.svg";
import iconHome from "@/assets/icon-home.svg";
import iconCar from "@/assets/icon-car.svg";
import iconLegal from "@/assets/icon-legal.svg";
import iconAccidents from "@/assets/icon-accidents.svg";
import iconCaravan from "@/assets/icon-caravan.svg";
import iconTravel from "@/assets/icon-travel.svg";

const ICON_MAP: Record<string, string> = {
  Umbrella: iconLiability,
  Home: iconHome,
  Plane: iconTravel,
  Car: iconCar,
  Scale: iconLegal,
  Zap: iconAccidents,
  Caravan: iconCaravan,
};

interface StepStartDateProps {
  selectedInsurances: string[];
  startDates: Record<string, string>;
  onUpdateStartDate: (insuranceId: string, date: string) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

/** Convert dd-mm-yyyy to Date */
function parseStoredDate(val: string): Date | undefined {
  if (!val || val.length !== 10) return undefined;
  const [dd, mm, yyyy] = val.split("-").map(Number);
  if (!dd || !mm || !yyyy) return undefined;
  return new Date(yyyy, mm - 1, dd);
}

/** Convert Date to dd-mm-yyyy */
function formatToStored(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

const DatePickerField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) => {
  const selectedDate = parseStoredDate(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-14 justify-start text-left font-normal rounded-2xl border-2 border-input bg-white px-4",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-3 h-5 w-5 text-muted-foreground" />
          {selectedDate ? format(selectedDate, "dd-MM-yyyy") : <span>Pick a start date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onChange(formatToStored(date))}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};

export const StepStartDate = ({
  selectedInsurances,
  startDates,
  onUpdateStartDate,
  animateTaco,
  errors,
  onClearError,
}: StepStartDateProps) => {
  const isSingle = selectedInsurances.length === 1;
  const [sameDate, setSameDate] = useState<"yes" | "no" | null>(null);

  const products = INSURANCE_TYPES.filter((t) => selectedInsurances.includes(t.id));
  const singleProduct = products[0];

  const unifiedDate = startDates["__unified"] || "";

  const handleUnifiedChange = (date: string) => {
    onUpdateStartDate("__unified", date);
    products.forEach((p) => onUpdateStartDate(p.id, date));
    onClearError?.("startDate");
  };

  // Single product
  if (isSingle) {
    const ins = INSURANCE_TYPES.find((t) => t.id === singleProduct.id)!;
    const iconSrc = ICON_MAP[ins.icon];

    return (
      <div className="animate-fade-in space-y-8">
        <TacoMessage
          message={`When should your ${ins.label} protection begin?`}
          animate={animateTaco}
        />
        <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            {iconSrc && <img src={iconSrc} alt={ins.label} className="w-8 h-8" />}
            <h3 className="text-lg font-semibold text-foreground">{ins.label} Insurance</h3>
          </div>
          <DatePickerField
            value={startDates[singleProduct.id] || ""}
            onChange={(date) => { onUpdateStartDate(singleProduct.id, date); onClearError?.(`startDate_${singleProduct.id}`); }}
          />
          <ValidationError message={errors?.[`startDate_${singleProduct.id}`]} />
        </div>
      </div>
    );
  }

  // Multi product
  return (
    <div className="animate-fade-in space-y-8">
      <TacoMessage message="Do you want to have the same start date for all your insurances?" animate={animateTaco} />

      <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-5">
        <div className="flex gap-3">
          {(["yes", "no"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { setSameDate(opt); onClearError?.("sameDate"); }}
              className={`flex-1 h-12 rounded-xl border-2 text-base font-semibold transition-all ${
                sameDate === opt
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-input bg-white text-foreground hover:bg-muted"
              }`}
            >
              {opt === "yes" ? "Yes" : "No"}
            </button>
          ))}
        </div>
        <ValidationError message={errors?.sameDate} />

        {sameDate === "yes" && (
          <div className="pt-2">
            <DatePickerField value={unifiedDate} onChange={handleUnifiedChange} />
            <ValidationError message={errors?.startDate} />
          </div>
        )}
      </div>

      {sameDate === "no" && (
        <div className="space-y-4">
          {products.map((product) => {
            const ins = INSURANCE_TYPES.find((t) => t.id === product.id)!;
            const iconSrc = ICON_MAP[ins.icon];
            return (
              <div key={product.id} className="rounded-3xl border-2 border-input bg-white p-6 space-y-4">
                <div className="flex items-center gap-3">
                  {iconSrc && <img src={iconSrc} alt={ins.label} className="w-8 h-8" />}
                  <h3 className="text-lg font-semibold text-foreground">{ins.label} Insurance</h3>
                </div>
                <DatePickerField
                  value={startDates[product.id] || ""}
                  onChange={(date) => { onUpdateStartDate(product.id, date); onClearError?.(`startDate_${product.id}`); }}
                />
                <ValidationError message={errors?.[`startDate_${product.id}`]} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
