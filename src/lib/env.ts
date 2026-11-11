/**
 * API base. On Vercel the default "/api" is proxied to the CIMS backend by vercel.json (no CORS);
 * set VITE_API_BASE_URL to call the backend directly instead.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
}
