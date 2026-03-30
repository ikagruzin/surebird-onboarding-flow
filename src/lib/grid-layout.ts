/**
 * Adaptive grid layout utility for SelectionCard groups.
 *
 * Uses a width-budget approach: estimates each card's minimum width
 * based on label length, then determines how many fit per row
 * within the available container (~560px usable).
 *
 * Card width formula: (chars × 8px) + 68px (indicator + padding)
 * Container budget: ~560px (max-w-3xl minus outer padding)
 */

const CHAR_WIDTH = 8;
const CARD_OVERHEAD = 68; // indicator (28px) + padding (40px)
const CONTAINER_WIDTH = 560;
const GAP = 8;

function estimateCardWidth(label: string): number {
  return label.length * CHAR_WIDTH + CARD_OVERHEAD;
}

export function getSelectionGridClass(labels: readonly string[]): string {
  const count = labels.length;
  if (count <= 1) return "grid grid-cols-1 gap-2";

  const maxCardWidth = Math.max(...labels.map(estimateCardWidth));

  // How many cards fit side-by-side?
  // Available = CONTAINER_WIDTH, each card = maxCardWidth, gaps between
  const fitsPerRow = Math.floor(
    (CONTAINER_WIDTH + GAP) / (maxCardWidth + GAP)
  );

  // Clamp: at least 1, at most count, at most 4
  const cols = Math.min(Math.max(fitsPerRow, 1), count, 4);

  switch (cols) {
    case 4:
      return "grid grid-cols-2 sm:grid-cols-4 gap-2";
    case 3:
      return "grid grid-cols-3 gap-2";
    case 2:
      return "grid grid-cols-2 gap-2";
    default:
      return "grid grid-cols-1 gap-2";
  }
}
