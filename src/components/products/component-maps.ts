import type { ComponentType } from "react";
import type { ProductStepProps } from "@/config/products/types";
import { HOME_STEP_COMPONENTS } from "./home-steps";
import { LIABILITY_STEP_COMPONENTS } from "./liability-steps";
import { LEGAL_STEP_COMPONENTS } from "./legal-steps";
import { ACCIDENT_STEP_COMPONENTS } from "./accident-steps";
import { CARAVAN_STEP_COMPONENTS } from "./caravan-steps";
import { CAR_STEP_COMPONENTS } from "./car-steps";

/**
 * Shared product step-component registry used by Flow A and Flow C.
 * Add new product step maps here once, and both flows pick them up.
 */
export const PRODUCT_STEP_COMPONENT_MAPS: Record<string, Record<string, ComponentType<ProductStepProps>>> = {
  home: HOME_STEP_COMPONENTS,
  liability: LIABILITY_STEP_COMPONENTS,
  legal: LEGAL_STEP_COMPONENTS,
  accidents: ACCIDENT_STEP_COMPONENTS,
  caravan: CARAVAN_STEP_COMPONENTS,
  car: CAR_STEP_COMPONENTS,
};
