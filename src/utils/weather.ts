import axios from "axios";
import {
  WeatherData,
  ForecastData,
  SearchHistoryItem,
} from "@/types/weather";
import { SEARCH_CONFIG } from "./constants";

const { STORAGE_KEY } = SEARCH_CONFIG;

const MAX_SEARCH_HISTORY = 5;

export const getSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem(STORAGE_KEY);
  return history ? JSON.parse(history) : [];
};

export const addToSearchHistory = (city: string, country: string) => {
  if (typeof window === 'undefined') return;
  
  const history = getSearchHistory();
  const newSearch = { city, country, timestamp: Date.now() };
  
  const existingIndex = history.findIndex(item => 
    item.city.toLowerCase() === city.toLowerCase() && 
    item.country.toLowerCase() === country.toLowerCase()
  );
  
  if (existingIndex !== -1) {
    history.splice(existingIndex, 1);
  }
  
  history.unshift(newSearch);
  
  if (history.length > MAX_SEARCH_HISTORY) {
    history.pop();
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getCoordinates = async (city: string) => {
  try {
    const { data } = await axios.get(`/api/weather?endpoint=geocoding&city=${encodeURIComponent(city)}`);
    
    if (!data.length) {
      throw new Error("Location not found");
    }

    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error("Invalid API key");
      if (error.response?.status === 404) throw new Error("Location not found");
      if (error.response?.status === 429) throw new Error("Too many requests. Please try again later.");
      if (error.response?.status === 403) throw new Error("Access denied");
    }
    throw new Error("Failed to fetch location data");
  }
};

export const getWeather = async (city: string): Promise<WeatherData> => {
  try {
    const { data } = await axios.get(`/api/weather?endpoint=weather&city=${encodeURIComponent(city)}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error("Invalid API key");
      if (error.response?.status === 404) throw new Error("Location not found");
      if (error.response?.status === 429) throw new Error("Too many requests. Please try again later.");
      if (error.response?.status === 403) throw new Error("Access denied");
    }
    throw new Error("Failed to fetch weather data");
  }
};

export const getForecast = async (city: string): Promise<ForecastData> => {
  try {
    const { data } = await axios.get(`/api/weather?endpoint=forecast&city=${encodeURIComponent(city)}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error("Invalid API key");
      if (error.response?.status === 404) throw new Error("Location not found");
      if (error.response?.status === 429) throw new Error("Too many requests. Please try again later.");
      if (error.response?.status === 403) throw new Error("Access denied");
    }
    throw new Error("Failed to fetch forecast data");
  }
};

export const getWeatherAndDetails = async (city: string) => {
  const [weatherData, forecastData] = await Promise.all([
    getWeather(city),
    getForecast(city)
  ]);
  return { weather: weatherData, forecast: forecastData };
};

export const convertToFahrenheit = (celsius: number) => {
  return celsius * 9/5 + 32;
};

export const getWindDirection = (degrees: number) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees % 360 / 45) % 8;
  return directions[index];
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getLocalTime = (timestamp: number, timezone: number) => {
  const utcTime = new Date();
  utcTime.setTime(timestamp * 1000);
  const localOffset = utcTime.getTimezoneOffset() * 60;
  return new Date((timestamp + timezone + localOffset) * 1000);
};

export const isDaytime = (
  currentTime: number,
  sunrise: number,
  sunset: number
) => {
  return currentTime > sunrise && currentTime < sunset;
};