/**
 * DutchPlateInput — visual replica of a Dutch (NL) license plate.
 *
 * • Yellow background with blue "NL" strip on the left
 * • Auto-formats using Dutch sidecode patterns
 * • Rejects vowels (A E I O U), C, and Q per RDW rules
 * • Stores raw 6-char string; displays formatted value
 * • Fires onComplete when 6 valid characters are entered
 */
import * as React from "react";
import { cn } from "@/lib/utils";

/* ─── Forbidden characters (RDW) ─── */

const FORBIDDEN = /[AEIOUC Q]/i;

/** Strip everything except allowed alphanumeric, uppercase, max 6 chars */
function sanitise(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .split("")
    .filter((ch) => !FORBIDDEN.test(ch))
    .join("")
    .slice(0, 6);
}

/* ─── Dutch sidecode formatter ─── */

type Pattern = [RegExp, string];

/**
 * Official sidecode patterns (1–10+).
 * Each regex matches a raw 6-char plate and the replacement inserts dashes.
 */
const SIDECODE_PATTERNS: Pattern[] = [
  // Sidecode 1:  XX-99-99
  [/^([A-Z]{2})(\d{2})(\d{2})$/, "$1-$2-$3"],
  // Sidecode 2:  99-99-XX
  [/^(\d{2})(\d{2})([A-Z]{2})$/, "$1-$2-$3"],
  // Sidecode 3:  99-XX-99
  [/^(\d{2})([A-Z]{2})(\d{2})$/, "$1-$2-$3"],
  // Sidecode 4:  XX-99-XX
  [/^([A-Z]{2})(\d{2})([A-Z]{2})$/, "$1-$2-$3"],
  // Sidecode 5:  XX-XX-99
  [/^([A-Z]{2})([A-Z]{2})(\d{2})$/, "$1-$2-$3"],
  // Sidecode 6:  99-XX-XX
  [/^(\d{2})([A-Z]{2})([A-Z]{2})$/, "$1-$2-$3"],
  // Sidecode 7:  99-XXX-9
  [/^(\d{2})([A-Z]{3})(\d{1})$/, "$1-$2-$3"],
  // Sidecode 8:  9-XXX-99
  [/^(\d{1})([A-Z]{3})(\d{2})$/, "$1-$2-$3"],
  // Sidecode 9:  XX-999-X
  [/^([A-Z]{2})(\d{3})([A-Z]{1})$/, "$1-$2-$3"],
  // Sidecode 10: X-999-XX
  [/^([A-Z]{1})(\d{3})([A-Z]{2})$/, "$1-$2-$3"],
  // Sidecode 11: XXX-99-X
  [/^([A-Z]{3})(\d{2})([A-Z]{1})$/, "$1-$2-$3"],
  // Sidecode 12: X-99-XXX
  [/^([A-Z]{1})(\d{2})([A-Z]{3})$/, "$1-$2-$3"],
  // Sidecode 13: 9-XX-999
  [/^(\d{1})([A-Z]{2})(\d{3})$/, "$1-$2-$3"],
  // Sidecode 14: 999-XX-9
  [/^(\d{3})([A-Z]{2})(\d{1})$/, "$1-$2-$3"],
];

/** Format a raw plate string with dashes based on sidecode detection */
export function formatDutchPlate(raw: string): string {
  if (raw.length < 4) return raw;

  for (const [regex, replacement] of SIDECODE_PATTERNS) {
    if (regex.test(raw)) {
      return raw.replace(regex, replacement);
    }
  }

  // Fallback: simple 2-2-2 split
  if (raw.length <= 2) return raw;
  if (raw.length <= 4) return `${raw.slice(0, 2)}-${raw.slice(2)}`;
  return `${raw.slice(0, 2)}-${raw.slice(2, 4)}-${raw.slice(4)}`;
}

/* ─── Component ─── */

interface DutchPlateInputProps {
  /** Raw plate value (no dashes, uppercase, max 6 chars) */
  value: string;
  /** Called with sanitised raw value on every change */
  onChange: (raw: string) => void;
  /** Called when a valid 6-char plate is entered */
  onComplete?: (raw: string) => void;
  className?: string;
  disabled?: boolean;
}

export const DutchPlateInput = ({
  value,
  onChange,
  onComplete,
  className,
  disabled,
}: DutchPlateInputProps) => {
  const displayValue = formatDutchPlate(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = sanitise(e.target.value);
    onChange(raw);
    if (raw.length === 6) {
      onComplete?.(raw);
    }
  };

  return (
    <div
      className={cn(
        "flex items-stretch overflow-hidden rounded-xl border-2 border-[#1a1a1a]",
        className,
      )}
    >
      {/* Blue NL strip */}
      <div className="flex w-11 shrink-0 flex-col items-center justify-center bg-[#003DA5] px-1">
        <span className="text-xs font-bold leading-none text-white tracking-wide">NL</span>
      </div>

      {/* Yellow plate input */}
      <input
        type="text"
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        value={displayValue}
        onChange={handleChange}
        placeholder="XX-999-X"
        className={cn(
          "h-14 flex-1 bg-[#FFBD33] px-4 text-center text-xl tracking-widest text-[#1a1a1a] placeholder:text-[#1a1a1a]/30",
          "font-['Barlow'] font-bold",
          "focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        )}
      />
    </div>
  );
};
