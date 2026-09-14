# 🌤️ Weather App

A personal weather dashboard built on [Next.js](https://nextjs.org) that pulls real-time data from the [OpenWeatherMap API](https://openweathermap.org/api).

## 🚀 Features

- Current conditions, hourly, and daily views by city
- Temperature, humidity, wind, and more
- Clean and mobile-friendly UI

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KryptikOne/weather-app.git
cd weather-app
pnpm install
```

### 2. Get an API Key

Sign up at [OpenWeatherMap](https://openweathermap.org/api) and create an API key. The current-conditions call uses the One Call 3.0 API, which needs that subscription enabled on your account.

In the project root, create a `.env` file:

```
OPENWEATHER_API_KEY=your_key_here
```

### 3. Run Locally

```bash
pnpm dev
```
