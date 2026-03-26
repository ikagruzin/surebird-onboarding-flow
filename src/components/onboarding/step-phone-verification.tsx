import { useState, useRef, useEffect } from "react";
import { Shield } from "lucide-react";
import { TacoMessage } from "./taco-message";

interface StepPhoneVerificationProps {
  phone: string;
  onVerified: () => void;
  onBack: () => void;
  animateTaco?: boolean;
}

export const StepPhoneVerification = ({ phone, onVerified, onBack, animateTaco }: StepPhoneVerificationProps) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const maskedPhone = phone.length > 4
    ? "•".repeat(phone.length - 4) + phone.slice(-4)
    : phone;

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(d => d !== "")) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        onVerified();
      }, 1500);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="animate-fade-in space-y-8 pb-8">
      <TacoMessage
        message="I just sent a verification code to your phone 📱"
        animate={animateTaco}
      />

      <div className="rounded-3xl border-2 border-input bg-white p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Verify your phone number</h3>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to {maskedPhone}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={isVerifying}
              className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none ${
                digit
                  ? "border-primary bg-primary/5"
                  : "border-border"
              } ${isVerifying ? "opacity-50" : ""} focus:border-primary focus:ring-2 focus:ring-primary/20`}
            />
          ))}
        </div>

        {isVerifying && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Verifying...
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-muted-foreground">
              Resend code in <span className="font-semibold text-foreground">{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm font-medium text-primary hover:underline"
            >
              Resend verification code
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

