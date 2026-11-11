import { createContext } from 'react'
import type { Locale } from './messages'

export type TranslateParams = Record<string, string | number>

export type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, fallback?: string, params?: TranslateParams) => string
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
