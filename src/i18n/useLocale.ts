import { useContext } from 'react'
import { LocaleContext } from './context'

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('LocaleProvider is missing')
  return context
}
