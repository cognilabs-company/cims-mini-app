import { normalizePhone } from './service'

/** "+998901234567" → "+998 90 123 45 67" (Uzbek numbers); other numbers are returned as-is. */
export function formatPhone(value: string | null | undefined) {
  const raw = (value ?? '').trim()
  const digits = normalizePhone(raw)
  if (digits.length === 12 && digits.startsWith('998')) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`
  }
  if (digits.length === 9) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`
  }
  return raw || '-'
}
