import type { TranslateParams } from './context'
import type { Locale } from './messages'

/** Interpolation values `t` accepts (the main CIMS app's TranslationParams). */
export type TranslationParams = TranslateParams

const intlLocales: Record<Locale, string> = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' }

/** Intl locale for dates / numbers in the current UI language (LocaleProvider keeps it in <html lang>). */
export function getIntlLocale(locale?: Locale) {
  const current = locale ?? (typeof document === 'undefined' ? '' : document.documentElement.lang)
  return Object.hasOwn(intlLocales, current) ? intlLocales[current as Locale] : intlLocales.uz
}
