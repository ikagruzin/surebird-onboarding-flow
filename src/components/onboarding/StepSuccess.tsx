import { CheckCircle } from "lucide-react";

interface StepSuccessProps {
  email: string;
}

const StepSuccess = ({ email }: StepSuccessProps) => {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center text-center py-16 space-y-8">
      {/* Animated checkmark */}
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-success/10 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
          <CheckCircle className="w-16 h-16 text-success animate-[fade-in_0.3s_ease-out_0.3s_both]" />
        </div>
        {/* Celebration particles */}
        <div className="absolute -top-2 -right-2 text-2xl animate-[bounce_1s_ease-in-out_0.5s_both]">🎉</div>
        <div className="absolute -bottom-1 -left-3 text-xl animate-[bounce_1s_ease-in-out_0.7s_both]">✨</div>
      </div>

      <div className="space-y-3 max-w-md">
        <h1 className="text-3xl font-bold text-foreground">
          Congratulations!
        </h1>
        <p className="text-xl font-medium text-foreground">
          You are now smartly insured. 🎊
        </p>
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
          background: 'linear-gradient(180deg, hsl(121 72% 48%) 0%, hsl(121 72% 38%) 100%)',
          boxShadow: '0 4px 12px -2px hsla(121, 72%, 42%, 0.4), inset 0 1px 1px hsla(0, 0%, 100%, 0.25)',
        }}
      >
        Go to my Dashboard
      </button>
    </div>
  );
};

export default StepSuccess;
