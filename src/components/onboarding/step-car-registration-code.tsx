import { TacoMessage } from "./taco-message";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { ValidationError } from "./validation-error";
import { Info } from "lucide-react";

interface CarInstance {
  instanceId: string;
  licensePlate: string;
}

interface StepCarRegistrationCodeProps {
  cars: CarInstance[];
  carRegCodes: Record<string, string>;
  onUpdateCode: (instanceId: string, value: string) => void;
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

export const StepCarRegistrationCode = ({
  cars,
  carRegCodes,
  onUpdateCode,
  animateTaco,
  errors,
  onClearError,
}: StepCarRegistrationCodeProps) => {
  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        message="We need the reporting code for your vehicle(s). This is the last 4 digits of your chassis number, which you can find on your registration certificate (kentekencard) 📄"
        animate={animateTaco}
      />

      <div className="rounded-2xl border-2 border-input bg-primary/5 p-5 flex gap-3">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">Where to find this?</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The reporting code (meldcode) consists of the last 4 digits of your chassis number (VIN). You can find it on your vehicle registration certificate (Part I), or in the glove compartment sticker of your vehicle.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {cars.map((car) => (
          <div key={car.instanceId} className="rounded-3xl border-2 border-input bg-white p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-lg border-2 border-yellow-400 bg-yellow-300 px-3 py-1 text-sm font-bold text-foreground tracking-wider">
                {formatPlate(car.licensePlate)}
              </span>
            </div>

            <FloatingLabelInput
              label="Reporting code (last 4 digits)"
              value={carRegCodes[car.instanceId] || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
                onUpdateCode(car.instanceId, val);
                onClearError?.(`regCode_${car.instanceId}`);
              }}
              maxLength={4}
              inputMode="numeric"
              className={errors?.[`regCode_${car.instanceId}`] ? "border-destructive" : ""}
            />
            <ValidationError message={errors?.[`regCode_${car.instanceId}`]} />
          </div>
        ))}
      </div>
    </div>
  );
};
