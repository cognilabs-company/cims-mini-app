/*
 * Memory-only session: the CIMS JWT lives in this module and is never written to
 * localStorage / sessionStorage / cookies. When it expires, `renew` creates a new
 * session from Telegram initData (POST /miniapp/session).
 */
let memorySession: { token: string | null; renew: () => Promise<string | null> } | null = null
let renewing: Promise<string | null> | null = null

export function startMemorySession(renew: () => Promise<string | null>) {
  memorySession = { token: null, renew }
}

export function setMemoryAccessToken(token: string | null) {
  if (memorySession) memorySession.token = token
}

export function getAccessToken() {
  return memorySession?.token ?? null
}

/** New token (null when renewing failed). Parallel 401s share one renewal. */
export function renewMemorySession(): Promise<string | null> {
  const session = memorySession
  if (!session) return Promise.resolve(null)
  if (!renewing) {
    renewing = session.renew()
      .then((token) => { session.token = token; return token })
      .finally(() => { renewing = null })
  }
  return renewing
}
