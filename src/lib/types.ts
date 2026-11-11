export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiRequestOptions = {
  path: string
  method?: ApiMethod
  query?: Record<string, string | number | boolean | undefined | null>
  body?: BodyInit | FormData | Record<string, unknown> | undefined
  headers?: Record<string, string>
  /** false = no Authorization header and no session renewal (e.g. POST /miniapp/session). */
  auth?: boolean
}

export type ApiResponseError = {
  message: string
  status: number
  details: unknown
}
