/**
 * Shared types for the product engine.
 * Each insurance product (Home, Liability, Travel …) implements ProductConfig.
 * The same config drives both Flow C (single-product workbench)
 * and Flow A (multi-product orchestrator).
 */

/* ─── Step component contract ─── */

export interface ProductStepProps {
  /** Current product state (flat key-value object) */
  state: Record<string, any>;
  /** Update a single field in the product state */
  onUpdate: (key: string, value: any) => void;
  /**
   * Request an auto-advance to the next step.
   * Pass the state updates that should be applied before advancing,
   * plus the current step id so the engine can resolve the next step.
   */
  onAutoAdvance: (updates: Record<string, any>, fromStepId: string) => void;
  /** Whether the Taco intro message should animate (first visit) */
  animateTaco?: boolean;
  /** Called after the Taco animation finishes */
  onAnimationComplete?: () => void;
  /** Validation errors keyed by field ID */
  errors?: Record<string, string>;
  /** Clear a specific validation error when user interacts with a field */
  onClearError?: (field: string) => void;
}

/* ─── Product configuration ─── */

export interface ProductStepDef {
  id: string;
  label: string;
}

export interface ProductConfig {
  /** Unique product identifier (matches INSURANCE_TYPES.id) */
  id: string;
  /** Display label */
  label: string;
  /** Asset reference key (e.g. "icon-home") */
  icon: string;
  /** Initial (empty) state for this product */
  initialState: Record<string, any>;
  /** Pre-filled "smart preset" state (optional) */
  presetState?: Record<string, any>;
  /** Checklist items shown in the preset verification step */
  presetChecklist?: string[];
  /** All possible steps for this product */
  stepDefs: ProductStepDef[];
  /**
   * Returns the ordered list of step IDs for the current state.
   * The sequence can change dynamically based on user answers.
   */
  getStepSequence: (state: Record<string, any>) => string[];
  /** Returns true when the given step has enough data to proceed */
  validateStep: (stepId: string, state: Record<string, any>) => boolean;
  /** Returns field-level validation errors (empty object = valid). Optional — falls back to validateStep. */
  getValidationErrors?: (stepId: string, state: Record<string, any>) => Record<string, string>;
  /** Card definitions for the Offer detail tab (rest data + set-pref cards in display order) */
  offerCards?: OfferCardDef[];
  /** Default values for rest-data fields shown on the Offer page */
  offerInitialState?: Record<string, any>;
}

/* ─── Offer page card definition ─── */

export interface OfferCardDef {
  /** Unique card identifier */
  id: string;
  /** Card title */
  title: string;
  /** Explanatory subtitle shown below the title */
  subtitle: string;
  /** Where this data comes from */
  source: "rest" | "preferences";
  /** For "preferences" source: which step's data does this card display? */
  stepId?: string;
}
