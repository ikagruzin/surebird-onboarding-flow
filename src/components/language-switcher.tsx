import { Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

/** Pill-style EN/NL toggle. Reads/writes the global language context. */
export const LanguageSwitcher = ({ className = "", compact = false }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`flex items-center gap-1 bg-muted rounded-full ${compact ? "p-0.5" : "p-1"} ${className}`}
      role="group"
      aria-label="Language"
    >
      <Globe className={`${compact ? "w-3.5 h-3.5 ml-1.5" : "w-4 h-4 ml-2"} text-muted-foreground`} />
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`${compact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"} rounded-full font-medium transition-colors ${
          language === "en" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("nl")}
        aria-pressed={language === "nl"}
        className={`${compact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"} rounded-full font-medium transition-colors ${
          language === "nl" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        NL
      </button>
    </div>
  );
};
