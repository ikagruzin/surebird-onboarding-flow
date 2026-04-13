import { CheckCircle, Clock, AlertCircle, Phone, Mail } from "lucide-react";

type SuccessStatus = "success" | "pending" | "review-needed";

interface StepSuccessProps {
  email: string;
  status?: SuccessStatus;
}

export const StepSuccess = ({ email, status = "success" }: StepSuccessProps) => {
  if (status === "pending") {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center text-center py-16 space-y-8">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-warning/10 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
            <Clock className="w-16 h-16 text-warning animate-[fade-in_0.3s_ease-out_0.3s_both]" />
          </div>
          <div className="absolute -top-2 -right-2 text-2xl animate-[bounce_1s_ease-in-out_0.5s_both]">⏳</div>
        </div>

        <div className="space-y-3 max-w-md">
          <h1 className="text-3xl font-bold text-foreground">We're reviewing your request</h1>
          <p className="text-xl font-medium text-foreground">Your application is being processed.</p>
          <p className="text-base text-muted-foreground leading-relaxed">
            We'll notify you at{" "}
            <span className="font-medium text-foreground">{email || "your email"}</span>{" "}
            as soon as everything is confirmed. This usually takes 1–2 business days.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 text-primary-foreground px-8 py-4 rounded-full font-semibold text-base transition-all"
            style={{
              background: 'linear-gradient(180deg, hsl(121 66% 48%) 0%, hsl(121 66% 38%) 100%)',
              boxShadow: '0 4px 12px -2px hsla(121, 66%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)',
            }}
          >
            Go to my Dashboard
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-foreground border border-border hover:bg-muted transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact us
          </button>
        </div>
      </div>
    );
  }

  if (status === "review-needed") {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center text-center py-16 space-y-8">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
            <AlertCircle className="w-16 h-16 text-primary animate-[fade-in_0.3s_ease-out_0.3s_both]" />
          </div>
          <div className="absolute -top-2 -right-2 text-2xl animate-[bounce_1s_ease-in-out_0.5s_both]">📋</div>
        </div>

        <div className="space-y-3 max-w-md">
          <h1 className="text-3xl font-bold text-foreground">We need a bit more time</h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            We weren't able to process your request automatically. Our team will review it personally and get back to you within 2 business days at{" "}
            <span className="font-medium text-foreground">{email || "your email"}</span>.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Don't worry — this happens occasionally and doesn't affect your coverage options.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-primary-foreground px-8 py-4 rounded-full font-semibold text-base transition-all"
            style={{
              background: 'linear-gradient(180deg, hsl(121 66% 48%) 0%, hsl(121 66% 38%) 100%)',
              boxShadow: '0 4px 12px -2px hsla(121, 66%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)',
            }}
          >
            <Phone className="w-4 h-4" />
            Request a callback
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-foreground border border-border hover:bg-muted transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact us
          </button>
        </div>
      </div>
    );
  }

  // Default: success
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center text-center py-16 space-y-8">
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-success/10 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
          <CheckCircle className="w-16 h-16 text-success animate-[fade-in_0.3s_ease-out_0.3s_both]" />
        </div>
        <div className="absolute -top-2 -right-2 text-2xl animate-[bounce_1s_ease-in-out_0.5s_both]">🎉</div>
        <div className="absolute -bottom-1 -left-3 text-xl animate-[bounce_1s_ease-in-out_0.7s_both]">✨</div>
      </div>

      <div className="space-y-3 max-w-md">
        <h1 className="text-3xl font-bold text-foreground">Congratulations!</h1>
        <p className="text-xl font-medium text-foreground">You are now smartly insured. 🎊</p>
        <p className="text-base text-muted-foreground leading-relaxed">
          Your policy documents are being sent to{" "}
          <span className="font-medium text-foreground">{email || "your email"}</span>.
          Taco is now monitoring your deal 24/7.
        </p>
      </div>

      <button
        type="button"
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 text-primary-foreground px-8 py-4 rounded-full font-semibold text-base transition-all"
        style={{
          background: 'linear-gradient(180deg, hsl(121 66% 48%) 0%, hsl(121 66% 38%) 100%)',
          boxShadow: '0 4px 12px -2px hsla(121, 66%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)',
        }}
      >
        Go to my Dashboard
      </button>
    </div>
  );
};
