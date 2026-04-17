import { useState } from "react";
import { CheckCircle, Clock, AlertCircle, Mail } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

type SuccessStatus = "success" | "pending" | "review-needed";

interface StepSuccessProps {
  email: string;
  status?: SuccessStatus;
}

export const StepSuccess = ({ email, status: initialStatus = "success" }: StepSuccessProps) => {
  const t = useT();
  const [status, setStatus] = useState<SuccessStatus>(initialStatus);

  const STATUS_OPTIONS: { value: SuccessStatus; label: string }[] = [
    { value: "success", label: t("ui.success.status_success", undefined, "Congratulations") },
    { value: "pending", label: t("ui.success.status_pending", undefined, "Pending") },
    { value: "review-needed", label: t("ui.success.status_review", undefined, "Review needed") },
  ];

  const emailDisplay = email || t("ui.success.your_email", undefined, "your email");

  const switcher = (
    <div className="flex items-center gap-1 rounded-xl border border-input bg-muted p-1 mb-8">
      {STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setStatus(opt.value)}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            status === opt.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  if (status === "pending") {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center text-center py-16 space-y-8">
        {switcher}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
            <Clock className="w-16 h-16 text-primary animate-[fade-in_0.3s_ease-out_0.3s_both]" />
          </div>
        </div>

        <div className="space-y-3 max-w-md">
          <h1 className="text-3xl font-bold text-foreground">
            {t("ui.success.pending_title", undefined, "We're reviewing your request")}
          </h1>
          <p className="text-xl font-medium text-foreground">
            {t("ui.success.pending_subtitle", undefined, "Your application is being processed.")}
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("ui.success.pending_body", { email: emailDisplay }, `We'll notify you at ${emailDisplay} as soon as everything is confirmed. This usually takes 1–2 business days.`)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-foreground border border-border hover:bg-muted transition-colors"
          >
            <Mail className="w-4 h-4" />
            {t("ui.success.contact_us", undefined, "Contact us")}
          </button>
        </div>
      </div>
    );
  }

  if (status === "review-needed") {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center text-center py-16 space-y-8">
        {switcher}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
            <AlertCircle className="w-16 h-16 text-orange-500 animate-[fade-in_0.3s_ease-out_0.3s_both]" />
          </div>
        </div>

        <div className="space-y-3 max-w-md">
          <h1 className="text-3xl font-bold text-foreground">
            {t("ui.success.review_title", undefined, "We need a bit more time")}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {t("ui.success.review_body", { email: emailDisplay }, `We weren't able to process your request automatically. Our team will review it personally and get back to you within 2 business days at ${emailDisplay}.`)}
          </p>
          <p className="text-sm text-muted-foreground italic">
            {t("ui.success.review_note", undefined, "Don't worry — this happens occasionally and doesn't affect your coverage options.")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-foreground border border-border hover:bg-muted transition-colors"
          >
            <Mail className="w-4 h-4" />
            {t("ui.success.contact_us", undefined, "Contact us")}
          </button>
        </div>
      </div>
    );
  }

  // Default: success
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center text-center py-16 space-y-8">
      {switcher}
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-success/10 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
          <CheckCircle className="w-16 h-16 text-success animate-[fade-in_0.3s_ease-out_0.3s_both]" />
        </div>
      </div>

      <div className="space-y-3 max-w-md">
        <h1 className="text-3xl font-bold text-foreground">
          {t("finalise.success.congratulations", undefined, "Congratulations!")}
        </h1>
        <p className="text-xl font-medium text-foreground">
          {t("finalise.success.you_are_now_smartly_insured", undefined, "You are now smartly insured.")}
        </p>
        <p className="text-base text-muted-foreground leading-relaxed">
          {t("finalise.success.your_policy_documents_are_bein", { email: emailDisplay }, `Your policy documents are being sent to ${emailDisplay}. Taco is now monitoring your deal 24/7.`)}
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
        {t("finalise.success.go_to_my_dashboard", undefined, "Go to my Dashboard")}
      </button>
    </div>
  );
};
