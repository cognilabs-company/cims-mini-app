# CIMS Mini App

Telegram Mini App for Cognilabs CIMS employees:

- **Telefon** — WebRTC calls through the employee's CIMS SIP extension (JsSIP): keypad, lead search by the last digits, recent calls, call notes, full-screen incoming / active call screen.
- **Davomat** — assigned locations, current state, GPS accuracy and distance, **Keldim / Ketdim** (location-based check-in / check-out). While the app is open, the position is sent every 25 s; nothing runs in the background.
- **Xarita** — live employee map (Leaflet + OpenStreetMap), only with `capabilities.live_location.view`: `GET /attendance/location-map` plus the `WS /attendance/location-map/ws` socket, opened only once the tab is opened.
- With `capabilities.calls.edit`, the gear on the Phone tab opens call forwarding (`/telephony/extensions/{user_id}/forwarding-targets`).

Backend contract: `CIMS_MINIAPP_FRONTEND.md` (CIMS backend team).

## How it works

1. Loads `https://telegram.org/js/telegram-web-app.js`, calls `Telegram.WebApp.ready()`.
2. Sends `Telegram.WebApp.initData` unchanged in `X-Telegram-Init-Data` to `POST /miniapp/session` and gets a short-lived CIMS JWT.
3. The JWT is kept **in memory only** (never in localStorage / cookies) and renewed from initData before it expires or on a 401.
4. `/miniapp/attendance/*` calls send both `X-Telegram-Init-Data` and the JWT; telephony uses the existing `/telephony/*` API and `WS /telephony/events`.

Opened outside Telegram, the app shows "Open in Telegram". If the Telegram account is not linked to a CIMS employee, the backend message is shown.

## Development

```bash
npm install
npm run dev        # http://localhost:5173 — /api is proxied to the CIMS backend
npm run build      # type-check + production build into dist/
```

Node 20.19+ (or 22.12+).

## Deploy to Vercel

1. Import this repository in Vercel (framework preset: **Vite** — already set in `vercel.json`).
2. No environment variables are required. `vercel.json` proxies `/api/*` to `https://api.project.cims.cognilabs.org/*`, so there is no CORS setup; all other paths serve `index.html`.
3. Deploy and copy the production URL, e.g. `https://cims-mini-app.vercel.app`.

## Connect to Telegram

Use the bot whose token the CIMS backend uses to validate `initData` (ask the backend team) — opened from any other bot, `/miniapp/session` is rejected.

In **@BotFather**:

- `/mybots` → the bot → **Bot Settings → Menu Button → Configure menu button** → send the Vercel URL → send a button title (e.g. `CIMS`).
- Optional direct link: `/newapp` → the bot → title, description, 640×360 photo, the Vercel URL, short name (e.g. `cims`) → `https://t.me/<bot>/cims`.

Employees need their Telegram account linked to their CIMS user, a location assigned by the CEO (CIMS → Davomat → Lokatsiyalar), and must allow location and microphone access on first use.

## Structure

```
src/
  miniapp/      MiniAppPage, PhoneTab, CallScreen, AttendanceTab, MapTab, lib (api, geo, telegram)
  telephony/    TelephonyEngine (JsSIP line, call events, actions), API service, ForwardingTargets, ringtone
  attendance/   live location map: service (REST + socket), useLiveLocationMap, LiveLocationMap (Leaflet), helpers
  ui/           Input, SelectField, Switch (same look as the main CIMS app)
  lib/          HTTP client, memory-only session, API errors
  i18n/         uz / ru / en texts (same keys as the main CIMS app)
```
