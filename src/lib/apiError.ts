import type { ApiResponseError } from './types'

/** Backend message for an API error (FastAPI `detail` string or validation list), else a generic one. */
export function getApiErrorMessage(error: unknown, fallback = 'Request failed. Please try again.') {
  const apiError = error as ApiResponseError | undefined
  const details = apiError?.details as string | { detail?: string | Array<{ msg?: string }> } | undefined
  if (typeof details === 'string' && details.trim()) return details
  if (details && typeof details === 'object') {
    if (typeof details.detail === 'string' && details.detail.trim()) return details.detail
    if (Array.isArray(details.detail)) {
      const messages = details.detail.map((item) => item.msg).filter((message): message is string => Boolean(message))
      if (messages.length) return messages.join(', ')
    }
  }
  if (error instanceof Error && error.message.trim()) return error.message
  if (apiError?.message) return apiError.message
  return fallback
}

export function getApiErrorStatus(error: unknown) {
  const status = (error as Partial<ApiResponseError> | null | undefined)?.status
  return typeof status === 'number' ? status : null
}
