import type { ProductConfig } from "./types";
import { homeProduct } from "./home";
import { liabilityProduct } from "./liability";
import { legalProduct } from "./legal";
import { accidentsProduct } from "./accidents";
import { caravanProduct } from "./caravan";

/** Registry of all product configs. Add new products here. */
const PRODUCT_CONFIGS: Record<string, ProductConfig> = {
  home: homeProduct,
  liability: liabilityProduct,
  legal: legalProduct,
  accidents: accidentsProduct,
  caravan: caravanProduct,
};

/** Get a single product config by id. Returns undefined if not found. */
export function getProductConfig(id: string): ProductConfig | undefined {
  return PRODUCT_CONFIGS[id];
}

/** Get all registered product configs. */
export function getAllProductConfigs(): ProductConfig[] {
  return Object.values(PRODUCT_CONFIGS);
}

/** Check whether a product has a full config (vs placeholder). */
export function hasProductConfig(id: string): boolean {
  return id in PRODUCT_CONFIGS;
}

export type { ProductConfig, ProductStepProps, ProductStepDef } from "./types";
