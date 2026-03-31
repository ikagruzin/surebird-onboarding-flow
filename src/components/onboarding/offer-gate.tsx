import { useState } from "react";
import { Phone, Mail, ChevronRight, Lock } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { SelectionCard } from "@/components/ui/selection-card";
import { TacoMessage } from "./taco-message";
import tacoAvatar from "@/assets/taco-avatar.jpg";

interface OfferGateProps {
  firstName: string;
  phone: string;
  email: string;
  onUpdatePhone: (value: string) => void;
  onUpdateEmail: (value: string) => void;
  onUnlock: () => void;
}

export const OfferGate = ({
  firstName,
  phone,
  email,
  onUpdatePhone,
  onUpdateEmail,
  onUnlock,
}: OfferGateProps) => {
  const [contactMethod, setContactMethod] = useState<"phone" | "email" | "none">("phone");

  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center pt-24">
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl animate-scale-in">
          <TacoMessage
            message="Great news! Your personal offer is ready. Where do you want me to send it?"
            animate={true}
          />

          {/* Contact method selection */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <SelectionCard
              label="Phone"
              icon={<Phone className="w-4 h-4" />}
              selected={contactMethod === "phone"}
              onClick={() => setContactMethod("phone")}
              indicator="radio"
            />
            <SelectionCard
              label="Email"
              icon={<Mail className="w-4 h-4" />}
              selected={contactMethod === "email"}
              onClick={() => setContactMethod("email")}
              indicator="radio"
            />
            <SelectionCard
              label="None"
              selected={contactMethod === "none"}
              onClick={() => setContactMethod("none")}
              indicator="radio"
            />
          </div>

          {contactMethod !== "none" && (
            <div className="space-y-3 mb-6">
              {contactMethod === "phone" && (
                <FloatingLabelInput
                  label="Phone number (+31)"
                  value={phone}
                  onChange={(e) => onUpdatePhone(e.target.value)}
                  maxLength={15}
                  inputMode="tel"
                />
              )}
              {contactMethod === "email" && (
                <FloatingLabelInput
                  label="Email address"
                  value={email}
                  onChange={(e) => onUpdateEmail(e.target.value)}
                  type="email"
                />
              )}
            </div>
          )}

          <button
            onClick={onUnlock}
            disabled={
              (contactMethod === "phone" && phone.replace(/\s/g, "").length <= 4) ||
              (contactMethod === "email" && !email.includes("@"))
            }
            className="inline-flex items-center gap-2 text-success-foreground px-7 py-3 rounded-full font-semibold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(180deg, hsl(121 72% 48%) 0%, hsl(121 72% 38%) 100%)',
              boxShadow: '0 4px 12px -2px hsla(121, 72%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)',
            }}
          >
            View my offer
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-2 mt-5 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <p>
              Enter your details to save your personal offer. No spam, no obligations: just store your overview safely!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

