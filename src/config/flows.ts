import type { FlowConfig } from "./flowTypes";
import flowA from "./flowA";
import flowB from "./flowB";

/** Registry of all available flows. Add new flows here. */
export const FLOWS: Record<string, FlowConfig> = {
  a: flowA,
  b: flowB,
};

export const DEFAULT_FLOW_ID = "a";

export function getFlow(flowId: string): FlowConfig {
  return FLOWS[flowId] || FLOWS[DEFAULT_FLOW_ID];
}

export function getAllFlows(): FlowConfig[] {
  return Object.values(FLOWS);
}
