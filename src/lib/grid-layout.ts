/**
 * Adaptive grid layout utility for SelectionCard groups.
 *
 * Determines the optimal Tailwind grid class based on:
 * - Number of options
 * - Maximum label character length
 *
 * Short labels (≤15 chars) → horizontal/grid layouts
 * Long labels (>15 chars) → stacked vertically
 */

const SHORT_THRESHOLD = 15;

export function getSelectionGridClass(labels: string[]): string {
  const count = labels.length;
  const maxLen = Math.max(...labels.map((l) => l.length));
  const isShort = maxLen <= SHORT_THRESHOLD;

  if (count <= 1) return "grid grid-cols-1 gap-2";

  if (count === 2) {
    return isShort
      ? "grid grid-cols-2 gap-2"
      : "grid grid-cols-1 gap-2";
  }

  if (count === 3) {
    return isShort
      ? "grid grid-cols-3 gap-2"
      : "grid grid-cols-1 gap-2";
  }

  if (count === 4) {
    return isShort
      ? "grid grid-cols-2 sm:grid-cols-4 gap-2"
      : "grid grid-cols-1 gap-2";
  }

  if (count === 5) {
    return isShort
      ? "grid grid-cols-3 gap-2"
      : "grid grid-cols-1 gap-2";
  }

  if (count === 6) {
    return isShort
      ? "grid grid-cols-3 gap-2"
      : "grid grid-cols-2 gap-2";
  }

  // 7+: always stack
  return "grid grid-cols-1 gap-2";
}
