"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { translations, type Language, type TranslationKey, LANGUAGES } from "./translations";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const RTL_LANGUAGES: Language[] = ["ar", "fa", "ur"];
const LANG_STORAGE_KEY = "nullchat-lang";

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
  isRTL: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  // Load the language chosen earlier in this tab's session. The
  // preference lives in sessionStorage only, so it is gone once the tab
  // closes; any copy under the same key in localStorage is removed.
  useEffect(() => {
    try {
      localStorage.removeItem(LANG_STORAGE_KEY);
    } catch {}
    try {
      const saved = sessionStorage.getItem(LANG_STORAGE_KEY) as Language | null;
      if (saved && LANGUAGES.some((l) => l.code === saved)) {
        setLangState(saved);
      }
    } catch {}
  }, []);

  // Update dir attribute and remember the choice for this session
  useEffect(() => {
    const isRTL = RTL_LANGUAGES.includes(lang);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    try {
      sessionStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {}
  }, [lang]);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[lang]?.[key] ?? translations.en[key] ?? key;
    },
    [lang]
  );

  const isRTL = RTL_LANGUAGES.includes(lang);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export { LANGUAGES, type Language };
