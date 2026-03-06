import { Button } from "@/components/ui/button";
import { ChevronRight, Users, User, Gift } from "lucide-react";

interface StepFamilyProps {
  includeFamily: string;
  onUpdate: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepFamily = ({ includeFamily, onUpdate, onNext, onBack }: StepFamilyProps) => {
  return (
    <div className="animate-fade-in max-w-md">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Do you want to insure your family?
      </h1>

      {/* Incentive badge */}
      <div className="inline-flex items-center gap-1.5 bg-success/10 text-success rounded-full px-3 py-1.5 text-sm font-medium mb-8">
        <Gift className="w-4 h-4" />
        Get up to 5% family discount
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onUpdate("yes")}
          className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
            includeFamily === "yes"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/30"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              includeFamily === "yes"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Yes, include my family</p>
            <p className="text-sm text-muted-foreground">
              Cover your partner and children under one policy
            </p>
          </div>
        </button>

        <button
          onClick={() => onUpdate("no")}
          className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
            includeFamily === "no"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/30"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              includeFamily === "no"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No, just me</p>
            <p className="text-sm text-muted-foreground">
              Individual coverage only
            </p>
          </div>
        </button>
      </div>

      <div className="flex justify-between mt-10">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!includeFamily}>
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default StepFamily;
