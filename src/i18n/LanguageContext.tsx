import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { en, nl } from "./translations/data";

export type Language = "en" | "nl";

const DICTS = { en, nl } as const;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  /** Resolve a dotted key like "home.main.heading" or "taco.confirm-details". Falls back to provided default or the key itself. */
  t: (key: string, vars?: Record<string, string | number>, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "surebird:language";

function lookup(dict: any, key: string): string | undefined {
  // First try exact dotted key (most product/taco/finalise keys are stored as flat keys with dots inside the leaf)
  // Walk segments, but if we encounter a leaf string, try the rest of the path as a single key inside the prior level.
  const parts = key.split(".");
  let cur: any = dict;
  for (let i = 0; i < parts.length; i++) {
    if (cur == null) return undefined;
    if (typeof cur === "string") return cur;
    // Try greedy: combined remainder
    const remainder = parts.slice(i).join(".");
    if (Object.prototype.hasOwnProperty.call(cur, remainder)) {
      const v = cur[remainder];
      return typeof v === "string" ? v : undefined;
    }
    cur = cur[parts[i]];
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : `{${k}}`));
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "nl" || stored === "en" ? stored : "en";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>, fallback?: string) => {
      const dict = DICTS[language];
      const fallbackDict = DICTS.en;
      const found = lookup(dict, key) ?? lookup(fallbackDict, key) ?? fallback ?? key;
      return interpolate(found, vars);
    },
    [language]
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

/** Convenience hook for components that only need the t() helper. */
export const useT = () => useLanguage().t;
