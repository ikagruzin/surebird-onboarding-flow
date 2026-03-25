import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectionCard } from "@/components/ui/selection-card";
import { NativeSelect } from "@/components/ui/native-select";
import { getSelectionGridClass } from "@/lib/grid-layout";
import type { HouseState } from "@/components/onboarding/types";

/* ─── Reusable UI Pieces for House Steps ─── */

export const SectionCard = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <Card>
    {title && (
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
    )}
    <CardContent className={title ? "" : "pt-6"}>
      {children}
    </CardContent>
  </Card>
);

export const ChipSelect = ({
  options, selected, onChange,
}: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) => (
  <div className={getSelectionGridClass(options)}>
    {options.map((opt) => {
      const isActive = selected.includes(opt);
      return (
        <SelectionCard
          key={opt}
          label={opt}
          selected={isActive}
          onClick={() => onChange(isActive ? [] : [opt])}
          indicator="radio"
        />
      );
    })}
  </div>
);

export const SegmentedControl = ({
  options, value, onChange,
}: {
  options: string[]; value: string; onChange: (v: string) => void;
}) => (
  <div className={getSelectionGridClass(options)}>
    {options.map((opt) => (
      <SelectionCard
        key={opt}
        label={opt}
        selected={value === opt}
        onClick={() => onChange(opt)}
        indicator="radio"
      />
    ))}
  </div>
);

export const ToggleRow = ({
  label, sublabel, checked, onChange, showAmount, amount, onAmountChange,
}: {
  label: string; sublabel?: string; checked: boolean; onChange: (v: boolean) => void;
  showAmount?: boolean; amount?: string; onAmountChange?: (v: string) => void;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between gap-4">
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {sublabel && <span className="text-xs text-muted-foreground ml-1">({sublabel})</span>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-input"
        }`}
      >
        <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`} />
      </button>
    </div>
    {showAmount && checked && (
      <input
        type="text"
        placeholder="Enter amount (€)"
        value={amount || ""}
        onChange={(e) => onAmountChange?.(e.target.value)}
        className="w-full rounded-2xl border-2 border-input bg-background h-14 px-4 text-sm text-foreground focus:outline-none focus:border-primary"
      />
    )}
  </div>
);
