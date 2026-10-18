import { createContext, use } from 'react'

import { type Copy, en, pt } from './copy'

export const LANGUAGES = ['en', 'pt'] as const
export type Language = (typeof LANGUAGES)[number]

export const DICTIONARIES: Record<Language, Copy> = { en, pt }
export const STORAGE_KEY = 'mysoundprint.language'

export interface LanguageValue {
  language: Language
  setLanguage: (language: Language) => void
  copy: Copy
}

export const LanguageContext = createContext<LanguageValue | null>(null)

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && LANGUAGES.includes(value as Language)
}

export function useLanguage(): LanguageValue {
  const value = use(LanguageContext)
  if (value === null) throw new Error('useLanguage must be used inside a LanguageProvider')
  return value
}

/** The common case: a component that only needs the strings. */
export function useCopy(): Copy {
  return useLanguage().copy
}
