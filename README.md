# Sky Stats

Sky Stats is a weather application built with [Next.js](https://nextjs.org) that provides detailed weather information, air quality data, and customization options. It is designed to deliver an intuitive and visually appealing user experience.

## Features

### 1. Air Quality Index (AQI) Integration

- Displays air quality data using OpenWeatherMap's Air Pollution API.
- Shows AQI levels and pollutant information on the weather card's flip side.
- Utilizes color coding to indicate air quality levels (e.g., good, moderate, poor).

### 2. Extended Weather Details

- Provides precipitation probability.
- Includes UV index information.
- Displays atmospheric pressure, dew point temperature, and visibility conditions.

### 3. Historical Weather Data

- Features a graph showing temperature trends over the past 24 hours.
- Includes historical weather comparisons (e.g., "warmer than yesterday").
- Displays monthly averages for the selected location.

### 4. Customization Options

- Allows users to choose their default temperature unit (Celsius/Fahrenheit).
- Offers theme customization (light/dark mode).
- Enables users to customize which weather metrics are displayed.
- Supports reordering of forecast information.

## Getting Started

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

- **`src/app`**: Contains the main application files, including layout and global styles.
- **`src/components`**: Includes reusable components such as `WeatherCard`, `ForecastCard`, and `Settings`.
- **`src/utils`**: Utility functions and hooks, such as `useWeatherApi` and `useKeyboardShortcuts`.
- **`public`**: Static assets like icons and images.

## Learn More

To learn more about Next.js, visit the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

## Deployment

The easiest way to deploy Sky Stats is to use the [Vercel Platform](https://vercel.com). Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
