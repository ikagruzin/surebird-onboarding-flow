import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllFlows } from "@/config/flows";
import { ChevronDown } from "lucide-react";

interface FlowSwitcherProps {
  currentFlowId: string;
  onSwitch: (flowId: string) => void;
}

/** Flow IDs that redirect to dedicated routes instead of the main wizard */
const FLOW_ROUTES: Record<string, string> = {
  c: "/test-flows/house",
  "design-system": "/design-system",
};

const FlowSwitcher = ({ currentFlowId, onSwitch }: FlowSwitcherProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const flows = getAllFlows();
  const current = flows.find((f) => f.id === currentFlowId);

  const handleSelect = (flowId: string) => {
    setOpen(false);
    if (FLOW_ROUTES[flowId]) {
      navigate(FLOW_ROUTES[flowId]);
    } else {
      onSwitch(flowId);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2 shadow-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-success" />
          {current?.name || "Flow"}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0" onClick={() => setOpen(false)} />
            <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
              <div className="px-4 py-2 border-b border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Switch Flow</span>
              </div>
              {flows.map((flow) => (
                <button
                  key={flow.id}
                  onClick={() => handleSelect(flow.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors ${
                    flow.id === currentFlowId ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {flow.id === currentFlowId && (
                      <span className="w-2 h-2 rounded-full bg-success" />
                    )}
                    <span className="text-sm font-medium text-foreground">{flow.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 ml-4">{flow.description}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlowSwitcher;
