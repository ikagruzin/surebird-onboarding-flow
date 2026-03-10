import { Minus, Plus } from "lucide-react";
import tacoAvatar from "@/assets/taco-avatar.jpg";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";

interface StepFamilyDetailsProps {
  familyStatus: string;
  insurePartner: string;
  childrenCount: number;
  childrenAges: number[];
  onUpdatePartner: (value: string) => void;
  onUpdateChildren: (value: number) => void;
  onUpdateChildAge: (index: number, age: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepFamilyDetails = ({
  familyStatus,
  insurePartner,
  childrenCount,
  childrenAges,
  onUpdatePartner,
  onUpdateChildren,
  onUpdateChildAge,
}: StepFamilyDetailsProps) => {
  const showPartner = familyStatus === "partner" || familyStatus === "partner-children";
  const showChildren = familyStatus === "single-children" || familyStatus === "partner-children";

  return (
    <div className="animate-fade-in">
      <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
        {showPartner && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={tacoAvatar}
                alt="Tako"
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <p className="text-base font-semibold text-foreground">
                Do you want to insure your partner?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["yes", "no"].map((val) => (
                <button
                  key={val}
                  onClick={() => onUpdatePartner(val)}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                    insurePartner === val
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      insurePartner === val ? "border-primary" : "border-muted-foreground/40"
                    }`}
                  >
                    {insurePartner === val && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-foreground capitalize">{val === "yes" ? "Yes" : "No"}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showChildren && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-4">
              How many children do you want to insure?
            </p>
            <div className="flex items-center gap-0 mb-4">
              <button
                onClick={() => onUpdateChildren(Math.max(0, childrenCount - 1))}
                className="w-12 h-12 flex items-center justify-center border-2 border-border rounded-xl hover:bg-muted transition-colors"
              >
                <Minus className="w-4 h-4 text-foreground" />
              </button>
              <div className="w-16 h-12 flex items-center justify-center border-2 border-l-0 border-r-0 border-border text-sm font-semibold text-foreground">
                {childrenCount}
              </div>
              <button
                onClick={() => onUpdateChildren(Math.min(10, childrenCount + 1))}
                className="w-12 h-12 flex items-center justify-center border-2 border-border rounded-xl hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {childrenCount > 0 && (
              <div className="space-y-3 mt-4">
                <p className="text-sm font-semibold text-foreground">
                  What are the ages of your children?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: childrenCount }).map((_, i) => (
                    <FloatingLabelInput
                      key={i}
                      label={`Age child ${i + 1}`}
                      value={childrenAges[i] !== undefined && childrenAges[i] > 0 ? String(childrenAges[i]) : ""}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        onUpdateChildAge(i, Math.min(val, 25));
                      }}
                      inputMode="numeric"
                      maxLength={2}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StepFamilyDetails;
