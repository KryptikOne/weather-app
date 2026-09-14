# Weather

A personal weather dashboard. Phone-first with a separate desktop layout, customizable cards, and weather-driven color. Data from OpenWeather One Call 3.0, sun and moon computed locally.

## Setup

```bash
pnpm install
```

Create `.env` in the project root:

```
OPENWEATHER_API_KEY=your_key_here
```

The key needs One Call 3.0 enabled on your OpenWeather account. Geocoding and air quality use the same key.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | development server |
| `pnpm build` | production build (needs the `.env` key present) |
| `pnpm test` | unit and component tests |
| `pnpm lint` | ESLint |

## Layout

- `src/app` routes, API handlers, manifest
- `src/cards` one folder per card: definition, component, math, tests
- `src/components` shell, layout renderer, shadcn primitives
- `src/lib` weather provider, astronomy, formatting, store, hooks, theme
- `docs/specs` design documents, `docs/plans` implementation plans
