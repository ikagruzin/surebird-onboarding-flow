import { useState, useEffect } from "react";
import { INSURANCE_TYPES } from "./types";
import { Calendar, CalendarDays } from "lucide-react";
import tacoAvatar from "@/assets/taco-avatar.jpg";
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
}

const formatDateInput = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  let result = "";
  for (let i = 0; i < Math.min(digits.length, 8); i++) {
    if (i === 2 || i === 4) result += "-";
    result += digits[i];
  }
  return result;
};

const getTodayFormatted = (): string => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const isValidDate = (val: string): boolean => {
  if (val.length !== 10) return false;
  const [dd, mm, yyyy] = val.split("-").map(Number);
  if (!dd || !mm || !yyyy) return false;
  const date = new Date(yyyy, mm - 1, dd);
  return date.getFullYear() === yyyy && date.getMonth() === mm - 1 && date.getDate() === dd;
};

const StepStartDate = ({
  selectedInsurances,
  startDates,
  onUpdateStartDate,
  onNext,
  onBack,
}: StepStartDateProps) => {
  const isSingle = selectedInsurances.length === 1;
  const [sameDate, setSameDate] = useState<"yes" | "no" | null>(null);

  const products = INSURANCE_TYPES.filter((t) => selectedInsurances.includes(t.id));
  const singleProduct = products[0];

  // For "yes" mode, use a unified key
  const unifiedDate = startDates["__unified"] || "";

  const handleUnifiedDateChange = (val: string) => {
    const formatted = formatDateInput(val);
    onUpdateStartDate("__unified", formatted);
    // Propagate to all products
    products.forEach((p) => onUpdateStartDate(p.id, formatted));
  };

  const handleUnifiedToday = () => {
    const today = getTodayFormatted();
    onUpdateStartDate("__unified", today);
    products.forEach((p) => onUpdateStartDate(p.id, today));
  };

  const handleIndividualDateChange = (id: string, val: string, prev: string) => {
    const formatted = val.length >= prev.length ? formatDateInput(val) : val;
    onUpdateStartDate(id, formatted);
  };

  const handleIndividualToday = (id: string) => {
    onUpdateStartDate(id, getTodayFormatted());
  };

  const canProceed = (): boolean => {
    if (isSingle) return isValidDate(startDates[singleProduct.id] || "");
    if (!sameDate) return false;
    if (sameDate === "yes") return isValidDate(unifiedDate);
    return products.every((p) => isValidDate(startDates[p.id] || ""));
  };

  const DateInput = ({ value, onChange, onToday, label }: { value: string; onChange: (v: string) => void; onToday: () => void; label?: string }) => (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="dd-mm-yyyy"
            maxLength={10}
            className="flex h-14 w-full rounded-xl border-2 border-input bg-white px-4 pr-12 text-base text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        </div>
        <button
          type="button"
          onClick={onToday}
          className="h-14 px-5 rounded-xl border-2 border-input bg-white text-sm font-semibold text-foreground hover:bg-muted transition-colors whitespace-nowrap"
        >
          Today
        </button>
      </div>
    </div>
  );

  // Single product scenario
  if (isSingle) {
    const product = singleProduct;
    const ins = INSURANCE_TYPES.find((t) => t.id === product.id)!;
    const iconSrc = ICON_MAP[ins.icon];

    return (
      <div className="animate-fade-in space-y-8">
        {/* Taco message */}
        <div className="flex items-center gap-3">
          <img src={tacoAvatar} alt="Taco" className="w-10 h-10 rounded-full object-cover shrink-0" />
          <div className="bg-muted rounded-2xl rounded-tl-md px-5 py-3">
            <p className="text-base text-foreground">When should your <strong>{ins.label}</strong> protection begin?</p>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            {iconSrc && <img src={iconSrc} alt={ins.label} className="w-8 h-8" />}
            <h3 className="text-lg font-semibold text-foreground">{ins.label} Insurance</h3>
          </div>
          <DateInput
            value={startDates[product.id] || ""}
            onChange={(v) => handleIndividualDateChange(product.id, v)}
            onToday={() => handleIndividualToday(product.id)}
          />
        </div>
      </div>
    );
  }

  // Multi product scenario
  return (
    <div className="animate-fade-in space-y-8">
      {/* Taco message */}
      <div className="flex items-center gap-3">
        <img src={tacoAvatar} alt="Taco" className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="bg-muted rounded-2xl rounded-tl-md px-5 py-3">
          <p className="text-base text-foreground">When should your protection begin?</p>
        </div>
      </div>

      {/* Same date toggle */}
      <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-5">
        <p className="text-base font-semibold text-foreground">
          Do you want to have the same start date for all your insurances?
        </p>
        <div className="flex gap-3">
          {(["yes", "no"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSameDate(opt)}
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

        {/* Yes: unified date picker */}
        {sameDate === "yes" && (
          <div className="pt-2">
            <DateInput
              value={unifiedDate}
              onChange={(v) => handleUnifiedDateChange(v)}
              onToday={handleUnifiedToday}
            />
          </div>
        )}
      </div>

      {/* No: individual date pickers */}
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
                <DateInput
                  value={startDates[product.id] || ""}
                  onChange={(v) => handleIndividualDateChange(product.id, v)}
                  onToday={() => handleIndividualToday(product.id)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StepStartDate;
