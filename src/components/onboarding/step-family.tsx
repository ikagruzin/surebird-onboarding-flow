import TacoMessage from "./taco-message";
import familySingle from "@/assets/family-single.png";
import familyPartner from "@/assets/family-partner.png";
import familySingleChildren from "@/assets/family-single-children.png";
import familyPartnerChildren from "@/assets/family-partner-children.png";

interface StepFamilyProps {
  familyStatus: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  animateTaco?: boolean;
}

const OPTIONS = [
  { id: "single", label: "Single", image: familySingle },
  { id: "partner", label: "Partner", image: familyPartner },
  { id: "single-children", label: "Single &\nChildren", image: familySingleChildren },
  { id: "partner-children", label: "Partner &\nChildren", image: familyPartnerChildren },
];

export const StepFamily = ({ familyStatus, onSelect, animateTaco }: StepFamilyProps) => {
  return (
    <div className="animate-fade-in">
      <TacoMessage message="What is your family status?" animate={animateTaco} />

      <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
        <div className="grid grid-cols-4 gap-3">
          {OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 p-4 pt-6 pb-5 transition-all ${
                familyStatus === option.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <img
                src={option.image}
                alt={option.label}
                className="w-12 h-12 object-contain"
              />
              <span className="text-sm font-semibold text-foreground text-center whitespace-pre-line">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

