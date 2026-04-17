import { useState } from "react";
import { ShieldCheck, X, QrCode, RefreshCw, Trash2 } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { TacoMessage } from "./taco-message";
import { ValidationError } from "./validation-error";
import { useT } from "@/i18n/LanguageContext";
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
  const t = useT();
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
        stepId="idin-verification"
        message="Let's verify your identity securely 🔒"
        animate={animateTaco}
      />

      {/* iDIN verification card */}
      <div className="rounded-3xl border-2 border-input bg-white p-6 space-y-5">
        <div className="flex items-center gap-3">
          <img src={idinLogo} alt="iDIN" className="w-10 h-10" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {t("finalise.idin_verification.secure_identity_verification", undefined, "Secure Identity Verification")}
            </h3>
            <p className="text-sm text-muted-foreground">{t("ui.idin.powered_by", undefined, "Powered by iDIN")}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("finalise.idin_verification.no_need_to_type_your_iban_or_n", undefined,
            "No need to type your IBAN or name. Simply verify with your bank app to ensure 100% security and accuracy.")}
        </p>

        {/* Idle state */}
        {verifyState === "idle" && (
          <>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleVerify}
                className="w-full h-14 rounded-xl border-2 border-primary bg-primary/5 text-primary text-base font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                {t("finalise.idin_verification.verify_with_my_bank", undefined, "Verify with my Bank")}
              </button>
              <button
                type="button"
                onClick={handleManualEntry}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                {t("finalise.idin_verification.or_enter_iban_manually", undefined, "Or enter IBAN manually")}
              </button>
            </div>
            <ValidationError message={errors?.iban} />
          </>
        )}

        {/* Pending (modal closed) */}
        {verifyState === "pending" && !showQrModal && (
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="w-full h-14 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-700 text-base font-semibold flex items-center justify-center gap-2"
          >
            <QrCode className="w-5 h-5" />
            {t("ui.idin.waiting", undefined, "Waiting for verification…")}
          </button>
        )}

        {/* Failed state */}
        {verifyState === "failed" && (
          <div className="space-y-3">
            <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-4 flex items-center gap-2">
              <X className="w-5 h-5 text-destructive shrink-0" />
              <span className="text-sm text-destructive font-medium">
                {t("finalise.idin_verification.verification_failed_please_try", undefined,
                  "Verification failed. Please try again or enter your IBAN manually.")}
              </span>
            </div>
            <button
              type="button"
              onClick={handleVerify}
              className="w-full h-14 rounded-xl border-2 border-primary bg-primary/5 text-primary text-base font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              {t("ui.idin.try_again", undefined, "Try again")}
            </button>
            <button
              type="button"
              onClick={handleManualEntry}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              {t("ui.idin.enter_iban_manually", undefined, "Enter IBAN manually")}
            </button>
          </div>
        )}

        {/* Verified state */}
        {verifyState === "verified" && (
          <div className="space-y-3">
            <div className="rounded-xl border-2 border-success/30 bg-success/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-success" />
                <span className="text-sm font-semibold text-success">
                  {t("finalise.idin_verification.bank_verified", undefined, "Bank Verified")}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("ui.idin.bank", undefined, "Bank")}</span>
                  <span className="text-sm font-medium text-foreground">{verifiedBankName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("ui.idin.iban_label", undefined, "IBAN")}</span>
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
                {t("finalise.idin_verification.scan_again", undefined, "Scan again")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 h-10 rounded-xl border border-input text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t("finalise.idin_verification.remove", undefined, "Remove")}
              </button>
            </div>
          </div>
        )}

        {/* Manual IBAN entry */}
        {verifyState === "manual" && (
          <div className="space-y-3">
            <FloatingLabelInput
              label={t("finalise.idin_verification.iban", undefined, "IBAN")}
              value={iban}
              onChange={(e) => onUpdateIban(e.target.value.toUpperCase())}
              placeholder=" "
            />
            <button
              type="button"
              onClick={handleVerify}
              className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
            >
              {t("ui.idin.or_verify_with_idin", undefined, "Or verify with iDIN instead")}
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
              <h3 className="text-lg font-semibold text-foreground">
                {t("ui.idin.modal_title", undefined, "Verify with your Bank")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("ui.idin.scan_with_app", undefined, "Scan with your banking app to safely share your IBAN and verified name.")}
              </p>
            </div>

            <div className="aspect-square max-w-52 mx-auto rounded-2xl border-2 border-input bg-muted/30 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-muted-foreground/50" />
            </div>

            <p className="text-center text-xs text-muted-foreground">
              {t("ui.idin.waiting", undefined, "Waiting for verification…")}
            </p>

            {/* Demo buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={simulateSuccess}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                {t("ui.idin.simulate_success", undefined, "Simulate Verification ✓")}
              </button>
              <button
                type="button"
                onClick={simulateFailure}
                className="w-full h-12 rounded-xl border border-destructive text-destructive text-sm font-semibold hover:bg-destructive/5 transition-colors"
              >
                {t("ui.idin.simulate_failure", undefined, "Simulate Failure ✗")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
