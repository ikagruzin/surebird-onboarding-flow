import { useState } from "react";
import { CheckCircle2, ShieldCheck, X, QrCode } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import tacoAvatar from "@/assets/taco-avatar.jpg";
import idinLogo from "@/assets/idin-logo.svg";

interface StepConfirmDetailsProps {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  onUpdateField: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

type VerifyState = "idle" | "pending" | "verified";

const StepConfirmDetails = ({
  firstName,
  lastName,
  phone,
  email,
  onUpdateField,
  onNext,
  onBack,
}: StepConfirmDetailsProps) => {
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");
  const [showQrModal, setShowQrModal] = useState(false);

  const handleVerify = () => {
    setShowQrModal(true);
    setVerifyState("pending");
  };

  const simulateSuccess = () => {
    setVerifyState("verified");
    setShowQrModal(false);
  };

  const VerifiedBadge = () => (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
      <CheckCircle2 className="w-3.5 h-3.5" />
      Verified
    </span>
  );

  const maskedIban = "NL•• •••• •••• ••82";
  const bankName = "ING Bank";

  return (
    <div className="animate-fade-in space-y-8">
      {/* Taco message */}
      <div className="flex items-center gap-3">
        <img src={tacoAvatar} alt="Taco" className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="bg-muted rounded-2xl rounded-tl-md px-5 py-3">
          <p className="text-base text-foreground">
            Almost there! Double check your details below ✅
          </p>
        </div>
      </div>

      {/* Personal details card */}
      <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-5">
        <h3 className="text-lg font-semibold text-foreground">Confirm your details</h3>

        <div className="space-y-4">
          {/* First name */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground pl-1">First name</span>
              {firstName && <VerifiedBadge />}
            </div>
            <FloatingLabelInput
              label="First name"
              value={firstName}
              onChange={(e) => onUpdateField("firstName", e.target.value)}
            />
          </div>

          {/* Surname */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground pl-1">Surname</span>
              {lastName && <VerifiedBadge />}
            </div>
            <FloatingLabelInput
              label="Surname"
              value={lastName}
              onChange={(e) => onUpdateField("lastName", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground pl-1">Phone number</span>
              {phone && phone.length > 3 && <VerifiedBadge />}
            </div>
            <FloatingLabelInput
              label="Phone number"
              value={phone}
              onChange={(e) => onUpdateField("phone", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground pl-1">Email address</span>
              {email && email.includes("@") && <VerifiedBadge />}
            </div>
            <FloatingLabelInput
              label="Email address"
              value={email}
              onChange={(e) => onUpdateField("email", e.target.value)}
              type="email"
            />
          </div>
        </div>
      </div>

      {/* iDIN verification card */}
      <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-5">
        <div className="flex items-center gap-3">
          <img src={idinLogo} alt="iDIN" className="w-10 h-10" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Secure Identity & Payment Verification</h3>
            <p className="text-sm text-muted-foreground">Powered by iDIN</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          No need to type your IBAN or name. Simply verify with your bank app to ensure 100% security and accuracy.
        </p>

        {verifyState === "idle" && (
          <button
            type="button"
            onClick={handleVerify}
            className="w-full h-14 rounded-xl border-2 border-primary bg-primary/5 text-primary text-base font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            Verify with my Bank
          </button>
        )}

        {verifyState === "pending" && !showQrModal && (
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="w-full h-14 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-700 text-base font-semibold flex items-center justify-center gap-2"
          >
            <QrCode className="w-5 h-5" />
            Waiting for verification…
          </button>
        )}

        {verifyState === "verified" && (
          <div className="rounded-xl border-2 border-success/30 bg-success/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-success" />
              <span className="text-sm font-semibold text-success">Bank Verified</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bank</span>
                <span className="text-sm font-medium text-foreground">{bankName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">IBAN</span>
                <span className="text-sm font-mono font-medium text-foreground">{maskedIban}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>

            <div className="text-center space-y-2">
              <img src={idinLogo} alt="iDIN" className="w-12 h-12 mx-auto" />
              <h3 className="text-lg font-semibold text-foreground">Verify with your Bank</h3>
              <p className="text-sm text-muted-foreground">
                Scan with your banking app to safely share your IBAN and verified name.
              </p>
            </div>

            {/* QR Code placeholder */}
            <div className="aspect-square max-w-[200px] mx-auto rounded-2xl border-2 border-input bg-muted/30 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-muted-foreground/50" />
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Waiting for verification…
            </p>

            {/* Simulate success for demo */}
            <button
              type="button"
              onClick={simulateSuccess}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Simulate Verification ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepConfirmDetails;
