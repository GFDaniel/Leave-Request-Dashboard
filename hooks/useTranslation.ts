"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

type Language = "en" | "es";

interface TranslationData {
  [key: string]: any;
}

interface UseTranslationReturn {
  t: (key: string, params?: Record<string, string | number>) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const STORAGE_KEY = "leave-request-language";
const DEFAULT_LANGUAGE: Language = "en";

// Import translations statically to ensure they're available immediately
import enTranslations from "../locales/en.json";
import esTranslations from "../locales/es.json";

// Pre-populate cache with static imports
const translationCache: Record<Language, TranslationData> = {
  en: enTranslations,
  es: esTranslations,
};

// Global state for language to ensure all components update together
let globalLanguage: Language = DEFAULT_LANGUAGE;
const subscribers = new Set<(lang: Language) => void>();

// Initialize from localStorage if available
if (typeof window !== "undefined") {
  const savedLanguage = localStorage.getItem(STORAGE_KEY) as Language;
  if (savedLanguage && ["en", "es"].includes(savedLanguage)) {
    globalLanguage = savedLanguage;
  }
}

export function useTranslation(): UseTranslationReturn {
  const [language, setLanguageState] = useState<Language>(globalLanguage);
  const [, forceUpdate] = useState({});

  // Subscribe to global language changes
  useEffect(() => {
    const updateLanguage = (newLang: Language) => {
      console.log(`Hook: Language updated to ${newLang}`);
      setLanguageState(newLang);
      forceUpdate({}); // Force re-render
    };

    subscribers.add(updateLanguage);

    // Sync with global state
    if (language !== globalLanguage) {
      setLanguageState(globalLanguage);
    }

    return () => {
      subscribers.delete(updateLanguage);
    };
  }, [language]);

  // Get translations for current language - always synchronous
  const translations = useMemo(() => {
    const currentTranslations =
      translationCache[language] || translationCache[DEFAULT_LANGUAGE];
    console.log(`Getting translations for language: ${language}`);
    return currentTranslations;
  }, [language]);

  // Change language function - completely synchronous
  const setLanguage = useCallback((lang: Language) => {
    console.log(`Setting language from ${globalLanguage} to ${lang}`);

    // Update global state
    globalLanguage = lang;

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }

    // Notify all subscribers immediately
    subscribers.forEach((callback) => callback(lang));

    console.log(`Language change complete: ${lang}`);
  }, []);

  // Translation function with nested key support and parameter interpolation
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split(".");
      let value: any = translations;

      // Navigate through nested object
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          console.warn(
            `Translation key not found: ${key} for language: ${language}`
          );
          return key; // Return the key itself if translation not found
        }
      }

      if (typeof value !== "string") {
        console.warn(`Translation value is not a string for key: ${key}`);
        return key;
      }

      // Replace parameters in the translation string
      if (params) {
        return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
          return str.replace(
            new RegExp(`{{${paramKey}}}`, "g"),
            String(paramValue)
          );
        }, value);
      }

      return value;
    },
    [translations, language]
  );

  return {
    t,
    language,
    setLanguage,
    isLoading: false, // Always false since translations are pre-loaded
  };
}
