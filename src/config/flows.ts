import type { FlowConfig } from "./flow-types";
import { flowA } from "./flow-a";
import { flowB } from "./flow-b";
import { flowC } from "./flow-c";
import { flowD } from "./flow-d";
import { flowFinal } from "./flow-final";

const designSystemEntry: FlowConfig = {
  id: "design-system",
  name: "Design System",
  description: "Living reference of all tokens, components & icons",
  phases: [],
  steps: [],
};

/** Registry of all available flows. Add new flows here. */
export const FLOWS: Record<string, FlowConfig> = {
  final: flowFinal,
  c: { ...flowC, name: "Products Data Only", description: "Test individual product flows (e.g. House Insurance)" },
  "design-system": designSystemEntry,
  a: flowA,
  b: flowB,
  d: flowD,
};

export const DEFAULT_FLOW_ID = "final";

export function getFlow(flowId: string): FlowConfig {
  return FLOWS[flowId] || FLOWS[DEFAULT_FLOW_ID];
}

export function getAllFlows(): FlowConfig[] {
  return Object.values(FLOWS);
}
