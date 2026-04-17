/**
 * Helper to translate single option labels (e.g. "Yes", "€100") for a given product.
 *
 * The translation data stores option arrays as pipe-joined strings under keys like
 *   `products.car.opt.Yes | No` -> `Ja | Nee`
 * This helper finds the matching key by locating the English option within any pipe-joined
 * key under that product, then maps its index to the translated array.
 */
import { en } from "./translations/data";

type ProductId = "car" | "home" | "travel" | "legal" | "liability" | "accidents" | "caravan";

/** Build a per-product index of english option -> { key, index } once. */
const OPTION_INDEX: Record<string, { key: string; index: number }> = (() => {
  const map: Record<string, { key: string; index: number }> = {};
  const products = en.products as Record<string, string>;
  for (const fullKey of Object.keys(products)) {
    // fullKey examples: "car.opt.Yes | No", "liability.opt.No | Yes"
    const m = fullKey.match(/^([a-z]+)\.opt\.(.+)$/);
    if (!m) continue;
    const [, product, optsString] = m;
    const parts = optsString.split(" | ");
    parts.forEach((part, idx) => {
      // Index by both `<product>:<en option>` and just `<product>:<en option trimmed>`
      map[`${product}:${part}`] = { key: fullKey, index: idx };
    });
  }
  return map;
})();

/** Translate a single English option label for a product. Falls back to the input. */
export function translateOption(
  t: (key: string, vars?: Record<string, string | number>, fallback?: string) => string,
  product: ProductId,
  enOption: string,
): string {
  const entry = OPTION_INDEX[`${product}:${enOption}`];
  if (!entry) return enOption;
  const translated = t(`products.${entry.key}`, undefined, "");
  if (!translated) return enOption;
  const parts = translated.split(" | ");
  return parts[entry.index] ?? enOption;
}

/** Translate every option in an array. */
export function translateOptions(
  t: (key: string, vars?: Record<string, string | number>, fallback?: string) => string,
  product: ProductId,
  options: readonly string[],
): string[] {
  return options.map((o) => translateOption(t, product, o));
}
