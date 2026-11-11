import { env } from './env'
import { getAccessToken, renewMemorySession } from './session'
import type { ApiRequestOptions, ApiResponseError } from './types'

function buildUrl(path: string, query?: ApiRequestOptions['query']) {
  const base = env.apiBaseUrl.replace(/\/$/, '')
  const url = new URL(/^https?:\/\//i.test(path) ? path : `${base}${path}`, window.location.origin)
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
  })
  return url.toString()
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!response.ok) {
    const details = contentType.includes('application/json')
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null)
    const error: ApiResponseError = { message: `Request failed with status ${response.status}`, status: response.status, details }
    throw error
  }
  if (response.status === 204) return undefined as T
  if (contentType.includes('application/json')) return response.json() as Promise<T>
  return response.text() as unknown as T
}

async function perform<T>(options: ApiRequestOptions, canRetry: boolean): Promise<T> {
  const { path, method = 'GET', query, body, headers, auth = true } = options
  const requestHeaders = new Headers({ Accept: 'application/json' })
  if (body !== undefined && !(body instanceof FormData) && typeof body !== 'string') requestHeaders.set('Content-Type', 'application/json')
  const token = auth ? getAccessToken() : null
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`)
  Object.entries(headers ?? {}).forEach(([key, value]) => requestHeaders.set(key, value))

  const response = await fetch(buildUrl(path, query), {
    method,
    cache: 'no-store',
    headers: requestHeaders,
    body: body === undefined ? undefined : body instanceof FormData || typeof body === 'string' ? body : JSON.stringify(body),
  })

  if (response.status === 401 && auth && canRetry && (await renewMemorySession())) {
    return perform<T>(options, false)
  }
  return parseResponse<T>(response)
}

export function request<T>(options: ApiRequestOptions): Promise<T> {
  return perform<T>(options, true)
}

export async function requestBlob(path: string): Promise<Blob> {
  const load = async (canRetry: boolean): Promise<Blob> => {
    const headers = new Headers()
    const token = getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
    const response = await fetch(buildUrl(path), { headers, cache: 'no-store' })
    if (response.status === 401 && canRetry && (await renewMemorySession())) return load(false)
    if (!response.ok) return parseResponse<Blob>(response)
    return response.blob()
  }
  return load(true)
}
