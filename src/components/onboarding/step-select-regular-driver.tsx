import { TacoMessage } from "./taco-message";
import { SelectionCard } from "@/components/ui/selection-card";
import { ValidationError } from "./validation-error";
import type { FamilyMember } from "./types";

interface CarForDriver {
  instanceId: string;
  licensePlate: string;
}

interface StepSelectRegularDriverProps {
  carsNeedingDriver: CarForDriver[];
  children: FamilyMember[];
  carRegularDrivers: Record<string, string>;
  onSelectDriver: (carInstanceId: string, childIndex: string) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

function formatPlate(raw: string): string {
  const p = raw.toUpperCase();
  return p.length === 6 ? `${p.slice(0, 2)}-${p.slice(2, 4)}-${p.slice(4, 6)}` : p;
}

export const StepSelectRegularDriver = ({
  carsNeedingDriver,
  children,
  carRegularDrivers,
  onSelectDriver,
  animateTaco,
  errors,
  onClearError,
}: StepSelectRegularDriverProps) => {
  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        message="Which child will be the regular driver for each car? 🚗"
        animate={animateTaco}
      />

      <div className="space-y-6">
        {carsNeedingDriver.map((car) => (
          <div key={car.instanceId} className="rounded-3xl border-2 border-input bg-white p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Select a regular driver for {formatPlate(car.licensePlate)}
            </h3>

            <div className="space-y-2">
              {children.map((child, childIdx) => {
                const childLabel = child.firstName ? `${child.firstName} ${child.infix ? child.infix + " " : ""}${child.lastName}`.trim() : `Child ${childIdx + 1}`;
                return (
                  <SelectionCard
                    key={childIdx}
                    label={childLabel}
                    selected={carRegularDrivers[car.instanceId] === String(childIdx)}
                    indicator="radio"
                    onClick={() => {
                      onSelectDriver(car.instanceId, String(childIdx));
                      onClearError?.(`regularDriver_${car.instanceId}`);
                    }}
                  />
                );
              })}
            </div>
            <ValidationError message={errors?.[`regularDriver_${car.instanceId}`]} />
          </div>
        ))}
      </div>
    </div>
  );
};
