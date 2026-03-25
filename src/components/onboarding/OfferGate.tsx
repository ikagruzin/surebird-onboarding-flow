import { useState } from "react";
import { Phone, Mail, ChevronRight, Lock } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import tacoAvatar from "@/assets/taco-avatar.jpg";

interface OfferGateProps {
  firstName: string;
  phone: string;
  email: string;
  onUpdatePhone: (value: string) => void;
  onUpdateEmail: (value: string) => void;
  onUnlock: () => void;
}

const OfferGate = ({
  firstName,
  phone,
  email,
  onUpdatePhone,
  onUpdateEmail,
  onUnlock,
}: OfferGateProps) => {
  const [contactMethod, setContactMethod] = useState<"phone" | "email">("phone");

  const canSubmit =
    contactMethod === "phone"
      ? phone.replace(/\s/g, "").length > 4
      : email.includes("@");

  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center pt-24">
      {/* The blurred backdrop is handled by the parent */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl animate-scale-in">
          <div className="flex items-start gap-3 mb-6">
            <img src={tacoAvatar} alt="Taco" className="w-10 h-10 rounded-full object-cover shrink-0" />
            <p className="text-base text-foreground">
              {firstName || "Hi"}, I have selected the best insurance policies for you based on your set preferences!
            </p>
          </div>

          {/* Savings + best choices badges */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success bg-success/10 border border-success/20 rounded-full px-3 py-1.5">
              🎁 You save with Surebird: €20.11
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-primary/10 rounded-full px-3 py-1.5">
              🛡️ Best and cheapest choices
            </span>
          </div>

          {/* Contact method toggle */}
          <div className="flex items-center gap-2 mb-5">
            <button
              onClick={() => setContactMethod("phone")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                contactMethod === "phone"
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card border-border text-foreground hover:bg-muted"
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone number
            </button>
            <button
              onClick={() => setContactMethod("email")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                contactMethod === "email"
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card border-border text-foreground hover:bg-muted"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email address
            </button>
          </div>

          <div className="mb-6">
            {contactMethod === "phone" ? (
              <FloatingLabelInput
                label="Phone number (+31)"
                value={phone}
                onChange={(e) => onUpdatePhone(e.target.value)}
                maxLength={15}
                inputMode="tel"
              />
            ) : (
              <FloatingLabelInput
                label="Email address"
                value={email}
                onChange={(e) => onUpdateEmail(e.target.value)}
                type="email"
              />
            )}
          </div>

          <button
            onClick={onUnlock}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 text-success-foreground px-7 py-3 rounded-full font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
              Enter your email address below to save your personal offer. This way you always have it at hand when you need it. No spam, no obligations: just store your overview safely!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferGate;
