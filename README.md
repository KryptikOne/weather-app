# Weather

A personal weather dashboard. Phone-first with a separate desktop layout, customizable cards, and weather-driven color. Data from OpenWeather One Call 3.0, sun and moon computed locally.

## Setup

```bash
pnpm install
```

Create `.env` in the project root:

```
OPENWEATHER_API_KEY=your_key_here
APP_PIN=a-long-string-of-digits
APP_SESSION_SECRET=any-long-random-string
```

`APP_PIN` is digits only, at least six; a long one from a password manager is the idea. `APP_SESSION_SECRET` signs the session cookie (`openssl rand -base64 32` makes a good one). Without both, the app stays locked: every page redirects to `/unlock` and the API routes answer 401, so an unconfigured deployment never spends API calls.

The key needs One Call 3.0 enabled on your OpenWeather account. Geocoding and air quality use the same key.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | development server |
| `pnpm build` | production build (needs the `.env` key present) |
| `pnpm test` | unit and component tests |
| `pnpm lint` | ESLint |

## Access

The deployment is private. Every page and API route sits behind a PIN gate (`src/proxy.ts`): the first visit on a device shows `/unlock`, a correct PIN sets a signed cookie that lasts a year, and requests without it never reach OpenWeather. Wrong guesses answer slowly with a generic error. The site also sends `noindex` and a disallow-all `robots.txt`.

## Layout

- `src/app` routes, API handlers, manifest
- `src/cards` one folder per card: definition, component, math, tests
- `src/components` shell, layout renderer, shadcn primitives
- `src/lib` weather provider, astronomy, formatting, store, hooks, theme
- `docs/specs` design documents, `docs/plans` implementation plans
