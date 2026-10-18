import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  DICTIONARIES,
  type Language,
  LanguageContext,
  STORAGE_KEY,
  isLanguage,
} from './context'

/** A stored choice wins; otherwise the browser decides once. */
function initialLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLanguage(stored)) return stored
  } catch {
    // Private browsing and blocked site data both throw here.
  }

  return navigator.language.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // The choice simply will not survive a reload.
    }
  }, [])

  // Keeps the document in step with the choice, which is what a screen reader
  // and the browser's own translation prompt read.
  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en'
  }, [language])

  const value = useMemo(
    () => ({ language, setLanguage, copy: DICTIONARIES[language] }),
    [language, setLanguage],
  )

  return <LanguageContext value={value}>{children}</LanguageContext>
}
