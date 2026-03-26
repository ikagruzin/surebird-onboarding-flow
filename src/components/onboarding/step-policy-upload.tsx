import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle2, Sparkles, Shield, Clock, ArrowRight, HelpCircle, Mail, Monitor, Smartphone, Lightbulb, X } from "lucide-react";
import tacoAvatar from "@/assets/taco-avatar.jpg";

interface StepPolicyUploadProps {
  onParsed: (data: {
    firstName: string;
    lastName: string;
    postcode: string;
    houseNumber: string;
    birthdate: string;
    selectedInsurances: string[];
    preferences: Record<string, Record<string, string>>;
  }) => void;
  onBack: () => void;
}

const SIMULATED_DATA = {
  firstName: "J.",
  lastName: "Doe",
  postcode: "1015 CJ",
  houseNumber: "123",
  birthdate: "15-05-1985",
  selectedInsurances: ["home", "liability"],
  preferences: {
    home: {
      bouwaard: "stone_concrete",
      bouwjaar: "1920",
      eigenRisico: "100",
    },
  },
};

const AUDIT_STEPS = [
  { label: "Reading your policy document…", duration: 1200 },
  { label: "Extracting personal details…", duration: 1000 },
  { label: "Identifying coverage types…", duration: 1400 },
  { label: "Checking claim-free years…", duration: 1000 },
  { label: "Calculating your Surebird offer…", duration: 800 },
];

const StepPolicyUpload = ({ onParsed, onBack }: StepPolicyUploadProps) => {
  const [stage, setStage] = useState<"upload" | "parsing" | "done">("upload");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [currentAuditStep, setCurrentAuditStep] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const startParsing = useCallback((name: string) => {
    setFileName(name);
    setStage("parsing");
    setCurrentAuditStep(0);

    // Sequentially advance through audit steps
    let totalDelay = 0;
    AUDIT_STEPS.forEach((step, i) => {
      totalDelay += step.duration;
      setTimeout(() => setCurrentAuditStep(i + 1), totalDelay);
    });

    // After all steps, trigger completion
    totalDelay += 600;
    setTimeout(() => {
      setStage("done");
      setTimeout(() => onParsed(SIMULATED_DATA), 1200);
    }, totalDelay);
  }, [onParsed]);

  const handleFile = (file: File) => {
    if (file.type === "application/pdf" || file.type.startsWith("image/")) {
      startParsing(file.name);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const progress = (currentAuditStep / AUDIT_STEPS.length) * 100;

  if (stage === "parsing" || stage === "done") {
    return (
      <div className="animate-fade-in">
        {/* Taco floating card */}
        <div className="flex items-start gap-4 mb-10">
          <img src={tacoAvatar} alt="Taco" className="w-14 h-14 rounded-full object-cover ring-4 ring-success/20" />
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex-1">
            <p className="text-lg font-semibold text-foreground mb-1">
              {stage === "done" ? "All done! 🎉" : "Taco is auditing your policy…"}
            </p>
            <p className="text-sm text-muted-foreground">
              {stage === "done"
                ? "I found your details and coverage. Redirecting you to your personalized offer…"
                : `Analyzing "${fileName}"`
              }
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-success transition-all duration-500 ease-out"
              style={{ width: `${stage === "done" ? 100 : progress}%` }}
            />
          </div>
        </div>

        {/* Audit steps list */}
        <div className="space-y-3">
          {AUDIT_STEPS.map((step, i) => {
            const isDone = currentAuditStep > i;
            const isCurrent = currentAuditStep === i;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  isDone
                    ? "border-success/30 bg-success/5"
                    : isCurrent
                    ? "border-primary/30 bg-primary/5 animate-pulse"
                    : "border-border bg-card opacity-40"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 shrink-0 ${isCurrent ? "border-primary" : "border-border"}`} />
                )}
                <span className={`text-sm font-medium ${isDone ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {stage === "done" && (
          <div className="mt-8 flex items-center gap-3 px-5 py-4 rounded-2xl bg-success/10 border border-success/20">
            <Sparkles className="w-6 h-6 text-success" />
            <div>
              <p className="font-semibold text-foreground">Found: Home & Liability insurance</p>
              <p className="text-sm text-muted-foreground">Redirecting to your personalized offer…</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header with Taco */}
      <div className="flex items-start gap-4 mb-8">
        <img src={tacoAvatar} alt="Taco" className="w-14 h-14 rounded-full object-cover ring-4 ring-success/20" />
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">The Smart Audit</h1>
          <p className="text-muted-foreground leading-relaxed max-w-xl">
            Switching made simple. Upload your current policy (PDF or photo) and Taco will instantly audit your coverage.
            We'll extract your details, verify your claim-free years, and show you a better deal in 60 seconds—no manual typing required.
          </p>
        </div>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        <span className="inline-flex items-center gap-1.5 bg-success/10 text-success border border-success/20 rounded-full px-4 py-2 text-sm font-medium">
          <Clock className="w-4 h-4" /> 60 seconds
        </span>
        <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-2 text-sm font-medium">
          <Shield className="w-4 h-4" /> Secure & private
        </span>
        <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground border border-border rounded-full px-4 py-2 text-sm font-medium">
          <Sparkles className="w-4 h-4" /> AI-powered
        </span>
      </div>

      {/* Upload dropzone */}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all ${
          dragOver
            ? "border-success bg-success/5 scale-[1.01]"
            : "border-border bg-card hover:border-success/50 hover:bg-muted/50"
        }`}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
          dragOver ? "bg-success/20" : "bg-muted"
        }`}>
          <Upload className={`w-8 h-8 ${dragOver ? "text-success" : "text-muted-foreground"}`} />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-1">
            Drop your policy here
          </p>
          <p className="text-sm text-muted-foreground">
            or <span className="text-primary underline">browse files</span> — PDF or image
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="w-3.5 h-3.5" />
          Supported: PDF, JPG, PNG
        </div>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </label>

      {/* Policy help link */}
      <div className="mt-5 text-center">
        <button
          onClick={() => setShowHelp(true)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          Don't know where to find your policy?
        </button>
      </div>

      {/* Policy Help Modal */}
      {showHelp && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowHelp(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
              {/* Modal header */}
              <div className="flex items-start gap-3 p-6 pb-4 border-b border-border">
                <img src={tacoAvatar} alt="Taco" className="w-10 h-10 rounded-full object-cover ring-2 ring-success/20 shrink-0" />
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-foreground">No worries, Taco is here to help!</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Most Dutch insurers make it easy to grab your policy in under 2 minutes. Here is where to look:
                  </p>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-1 rounded-lg hover:bg-muted transition-colors shrink-0"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Check your Email</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Search your inbox for terms like <span className="font-medium text-foreground">'Polisblad'</span>, <span className="font-medium text-foreground">'Verzekeringsbewijs'</span>, or the name of your current insurer (e.g., Allianz, Interpolis, Centraal Beheer).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Monitor className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Log in to 'Mijn [Insurer's Name]'</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every major insurer has a customer portal. Log in and look for a <span className="font-medium text-foreground">'Documents'</span> or <span className="font-medium text-foreground">'Downloads'</span> section to find your most recent Polisblad as a PDF.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Use your Insurer's App</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      If you have your insurer's app on your phone, you can often download the policy and upload it directly here.
                    </p>
                  </div>
                </div>

                {/* Tip */}
                <div className="flex gap-3 p-4 rounded-xl bg-success/5 border border-success/20">
                  <Lightbulb className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">
                    <span className="font-semibold">Tip:</span> We specifically need the <span className="font-medium">'Polisblad'</span> (Policy Sheet) because it contains the technical details Taco needs to find you a better deal!
                  </p>
                </div>
              </div>

              {/* Modal footer */}
              <div className="p-6 pt-2">
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Got it, let me find my policy
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Back link */}
      <button
        onClick={onBack}
        className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to insurance selection
      </button>
    </div>
  );
};

export default StepPolicyUpload;
