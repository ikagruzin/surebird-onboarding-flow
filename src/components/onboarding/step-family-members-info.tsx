import { TacoMessage } from "./taco-message";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { SelectionCard } from "@/components/ui/selection-card";
import { ValidationError } from "./validation-error";
import type { FamilyMember } from "./types";

interface StepFamilyMembersInfoProps {
  familyMembers: FamilyMember[];
  onUpdateMember: (index: number, field: keyof FamilyMember, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

const GENDER_OPTIONS = ["Man", "Woman", "Different"];

export const StepFamilyMembersInfo = ({
  familyMembers,
  onUpdateMember,
  animateTaco,
  errors,
  onClearError,
}: StepFamilyMembersInfoProps) => {
  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        message="Tell us about your family members 👨‍👩‍👧‍👦"
        animate={animateTaco}
      />

      <div className="space-y-6">
        {familyMembers.map((member, idx) => {
          const prefix = `familyMember_${idx}`;
          const label = member.relation === "partner" ? "Partner" : `Child ${familyMembers.filter((m, i) => m.relation === "child" && i <= idx).length}`;
          return (
            <div key={idx} className="rounded-3xl border-2 border-input bg-white p-6 space-y-5">
              <h3 className="text-lg font-semibold text-foreground">{label}</h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <FloatingLabelInput
                      label="First name"
                      value={member.firstName}
                      onChange={(e) => {
                        onUpdateMember(idx, "firstName", e.target.value);
                        onClearError?.(`${prefix}_firstName`);
                      }}
                      className={errors?.[`${prefix}_firstName`] ? "border-destructive" : ""}
                    />
                    <ValidationError message={errors?.[`${prefix}_firstName`]} />
                  </div>
                  <div className="w-24">
                    <FloatingLabelInput
                      label="Infix"
                      value={member.infix}
                      onChange={(e) => onUpdateMember(idx, "infix", e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <FloatingLabelInput
                      label="Surname"
                      value={member.lastName}
                      onChange={(e) => {
                        onUpdateMember(idx, "lastName", e.target.value);
                        onClearError?.(`${prefix}_lastName`);
                      }}
                      className={errors?.[`${prefix}_lastName`] ? "border-destructive" : ""}
                    />
                    <ValidationError message={errors?.[`${prefix}_lastName`]} />
                  </div>
                </div>

                <div>
                  <FloatingLabelInput
                    label="Date of birth (dd-mm-yyyy)"
                    value={member.birthdate}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^0-9-]/g, "");
                      const raw = val.replace(/-/g, "");
                      if (raw.length >= 3 && !val.includes("-")) {
                        val = raw.slice(0, 2) + "-" + raw.slice(2);
                      }
                      if (raw.length >= 5) {
                        val = raw.slice(0, 2) + "-" + raw.slice(2, 4) + "-" + raw.slice(4, 8);
                      }
                      onUpdateMember(idx, "birthdate", val);
                      onClearError?.(`${prefix}_birthdate`);
                    }}
                    maxLength={10}
                    inputMode="numeric"
                    className={errors?.[`${prefix}_birthdate`] ? "border-destructive" : ""}
                  />
                  <ValidationError message={errors?.[`${prefix}_birthdate`]} />
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Gender</p>
                  <div className="space-y-2">
                    {GENDER_OPTIONS.map((g) => (
                      <SelectionCard
                        key={g}
                        label={g}
                        selected={member.gender === g}
                        indicator="radio"
                        onClick={() => {
                          onUpdateMember(idx, "gender", g);
                          onClearError?.(`${prefix}_gender`);
                        }}
                      />
                    ))}
                  </div>
                  <ValidationError message={errors?.[`${prefix}_gender`]} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
