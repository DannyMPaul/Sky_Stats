export const API_CONFIG = {
  BASE_URL: "https://api.openweathermap.org",
  ENDPOINTS: {
    WEATHER: "/data/2.5/weather",
    FORECAST: "/data/2.5/forecast",
    GEOCODING: "/geo/1.0/direct",
    AIR_POLLUTION: "/data/2.5/air_pollution",
  },
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;

export const WEATHER_ICONS = {
  DEFAULT_SIZE: "@4x.png",
  SMALL_SIZE: ".png",
} as const;

export const THEME_CONFIG = {
  STORAGE_KEY: "themeMode",
  DEFAULT_THEME: "light",
  ANIMATION_DURATION: 500,
} as const;

export const SEARCH_CONFIG = {
  MAX_HISTORY_ITEMS: 10,
  STORAGE_KEY: "weatherSearchHistory",
  DEBOUNCE_DELAY: 300,
} as const;

export const TEMPERATURE_UNITS = {
  CELSIUS: "C",
  FAHRENHEIT: "F",
} as const;

export const AQI_LEVELS = {
  GOOD: { min: 0, max: 50, label: "Good", color: "bg-green-500" },
  MODERATE: { min: 51, max: 100, label: "Moderate", color: "bg-yellow-500" },
  UNHEALTHY_SENSITIVE: { min: 101, max: 150, label: "Unhealthy for Sensitive Groups", color: "bg-orange-500" },
  UNHEALTHY: { min: 151, max: 200, label: "Unhealthy", color: "bg-red-500" },
  VERY_UNHEALTHY: { min: 201, max: 300, label: "Very Unhealthy", color: "bg-purple-500" },
  HAZARDOUS: { min: 301, max: 500, label: "Hazardous", color: "bg-purple-800" },
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  API_KEY_INVALID: "Invalid API key. Please check your configuration.",
  LOCATION_NOT_FOUND: "Location not found. Please try a different search term.",
  RATE_LIMIT_EXCEEDED: "Too many requests. Please try again later.",
  GENERAL_ERROR: "Something went wrong. Please try again.",
} as const;
