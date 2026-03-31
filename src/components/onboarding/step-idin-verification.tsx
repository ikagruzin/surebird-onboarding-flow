import { useState } from "react";
import { ShieldCheck, X, QrCode, RefreshCw, Trash2 } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { TacoMessage } from "./taco-message";
import { ValidationError } from "./validation-error";
import idinLogo from "@/assets/idin-logo.svg";

interface StepIdinVerificationProps {
  iban: string;
  onUpdateIban: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  animateTaco?: boolean;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

type VerifyState = "idle" | "pending" | "verified" | "failed" | "manual";

export const StepIdinVerification = ({
  iban,
  onUpdateIban,
  animateTaco,
  errors,
  onClearError,
}: StepIdinVerificationProps) => {
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");
  const [showQrModal, setShowQrModal] = useState(false);
  const [verifiedBankName, setVerifiedBankName] = useState("");
  const [verifiedIbanLast4, setVerifiedIbanLast4] = useState("");

  const handleVerify = () => {
    setShowQrModal(true);
    setVerifyState("pending");
  };

  const simulateSuccess = () => {
    setVerifyState("verified");
    setVerifiedBankName("ING Bank");
    setVerifiedIbanLast4("••82");
    onUpdateIban("NL••••••••••••82");
    setShowQrModal(false);
  };

  const simulateFailure = () => {
    setVerifyState("failed");
    setShowQrModal(false);
  };

  const handleRescan = () => {
    handleVerify();
  };

  const handleDelete = () => {
    setVerifyState("idle");
    setVerifiedBankName("");
    setVerifiedIbanLast4("");
    onUpdateIban("");
  };

  const handleManualEntry = () => {
    setVerifyState("manual");
    onUpdateIban("");
  };

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        message="Let's verify your identity securely 🔒"
        animate={animateTaco}
      />

      {/* iDIN verification card */}
      <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-5">
        <div className="flex items-center gap-3">
          <img src={idinLogo} alt="iDIN" className="w-10 h-10" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Secure Identity Verification</h3>
            <p className="text-sm text-muted-foreground">Powered by iDIN</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          No need to type your IBAN or name. Simply verify with your bank app to ensure 100% security and accuracy.
        </p>

        {/* Idle state */}
        {verifyState === "idle" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleVerify}
              className="w-full h-14 rounded-xl border-2 border-primary bg-primary/5 text-primary text-base font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Verify with my Bank
            </button>
            <button
              type="button"
              onClick={handleManualEntry}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Or enter IBAN manually
            </button>
          </div>
          <ValidationError message={errors?.iban} />
        )}

        {/* Pending (modal closed) */}
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

        {/* Failed state */}
        {verifyState === "failed" && (
          <div className="space-y-3">
            <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-4 flex items-center gap-2">
              <X className="w-5 h-5 text-destructive shrink-0" />
              <span className="text-sm text-destructive font-medium">
                Verification failed. Please try again or enter your IBAN manually.
              </span>
            </div>
            <button
              type="button"
              onClick={handleVerify}
              className="w-full h-14 rounded-xl border-2 border-primary bg-primary/5 text-primary text-base font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try again
            </button>
            <button
              type="button"
              onClick={handleManualEntry}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Enter IBAN manually
            </button>
          </div>
        )}

        {/* Verified state */}
        {verifyState === "verified" && (
          <div className="space-y-3">
            <div className="rounded-xl border-2 border-success/30 bg-success/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-success" />
                <span className="text-sm font-semibold text-success">Bank Verified</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bank</span>
                  <span className="text-sm font-medium text-foreground">{verifiedBankName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">IBAN</span>
                  <span className="text-sm font-mono font-medium text-foreground">NL•• •••• •••• {verifiedIbanLast4}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRescan}
                className="flex-1 h-10 rounded-xl border border-input text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Scan again
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 h-10 rounded-xl border border-input text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Manual IBAN entry */}
        {verifyState === "manual" && (
          <div className="space-y-3">
            <FloatingLabelInput
              label="IBAN"
              value={iban}
              onChange={(e) => onUpdateIban(e.target.value.toUpperCase())}
              placeholder=" "
            />
            <button
              type="button"
              onClick={handleVerify}
              className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
            >
              Or verify with iDIN instead
            </button>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
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

            <div className="aspect-square max-w-52 mx-auto rounded-2xl border-2 border-input bg-muted/30 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-muted-foreground/50" />
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Waiting for verification…
            </p>

            {/* Demo buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={simulateSuccess}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Simulate Verification ✓
              </button>
              <button
                type="button"
                onClick={simulateFailure}
                className="w-full h-12 rounded-xl border border-destructive text-destructive text-sm font-semibold hover:bg-destructive/5 transition-colors"
              >
                Simulate Failure ✗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

