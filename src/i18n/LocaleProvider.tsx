import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LocaleContext, type TranslateParams } from './context'
import { messages, type Locale } from './messages'

const STORAGE_KEY = 'cims-locale'

function readLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'uz' || stored === 'ru' || stored === 'en') return stored
  } catch { /* private mode */ }
  return 'uz'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    try { localStorage.setItem(STORAGE_KEY, locale) } catch { /* private mode */ }
  }, [locale])

  const setLocale = useCallback((next: Locale) => setLocaleState(next), [])
  const t = useCallback((key: string, fallback?: string, params?: TranslateParams) => {
    const table = messages[locale] as Record<string, string>
    const text = table[key] ?? (messages.en as Record<string, string>)[key] ?? fallback ?? key
    return params ? text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) => (name in params ? String(params[name]) : match)) : text
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
