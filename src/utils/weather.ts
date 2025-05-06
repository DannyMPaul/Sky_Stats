import axios from 'axios';

export interface WeatherData {
  weather: [{ main: string; description: string; icon: string }];
  main: { temp: number; feels_like: number; humidity: number };
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  wind: { speed: number; deg: number };
  timezone: number;
  dt: number;
}

export interface ForecastData {
  list: {
    dt: number;
    main: { temp: number; humidity: number };
    weather: [{ main: string; description: string; icon: string }];
    wind: { speed: number; deg: number };
    dt_txt: string;
  }[];
  city: { name: string; country: string };
}

export interface AirQualityData {
  list: [{
    main: { aqi: number };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }];
}

export interface ExtendedWeatherData {
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: [{ id: number; main: string; description: string; icon: string }];
  };
  hourly: Array<{
    dt: number;
    temp: number;
    pressure: number;
    humidity: number;
    uvi: number;
    clouds: number;
    visibility: number;
    pop: number;
    weather: [{ id: number; main: string; description: string; icon: string }];
  }>;
  daily: Array<{
    dt: number;
    temp: { day: number; min: number; max: number };
    pressure: number;
    humidity: number;
    uvi: number;
    pop: number;
    weather: [{ id: number; main: string; description: string; icon: string }];
  }>;
}

export const getWeather = async (city: string): Promise<WeatherData> => {
  if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY) throw new Error('Weather API key is not configured');
  try {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error('Invalid API key');
      if (error.response?.status === 404) throw new Error('City not found');
    }
    throw new Error('Failed to fetch weather data');
  }
};

export const getForecast = async (city: string): Promise<ForecastData> => {
  if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY) throw new Error('Weather API key is not configured');
  try {
    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error('Invalid API key');
      if (error.response?.status === 404) throw new Error('City not found');
    }
    throw new Error('Failed to fetch forecast data');
  }
};

export const getAirQuality = async (lat: number, lon: number): Promise<AirQualityData> => {
  if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY) throw new Error('Weather API key is not configured');
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error('Invalid API key');
      if (error.response?.status === 404) throw new Error('Location not found');
    }
    throw new Error('Failed to fetch air quality data');
  }
};

export const getExtendedWeather = async (lat: number, lon: number): Promise<ExtendedWeatherData> => {
  if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY) throw new Error('Weather API key is not configured');
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error('Invalid API key');
      if (error.response?.status === 404) throw new Error('Location not found');
    }
    throw new Error('Failed to fetch extended weather data');
  }
};

export const getBackgroundTheme = (weatherMain: string, hours: number): string => {
  const isDaytime = hours > 6 && hours < 18;
  const themes: Record<string, string> = {
    Clear: isDaytime ? 'bg-gradient-to-br from-blue-400 to-blue-200' : 'bg-gradient-to-br from-blue-900 to-blue-700',
    Clouds: isDaytime ? 'bg-gradient-to-br from-gray-300 to-gray-100' : 'bg-gradient-to-br from-gray-800 to-gray-600',
    Rain: 'bg-gradient-to-br from-gray-700 to-gray-500',
    Snow: 'bg-gradient-to-br from-blue-100 to-gray-100',
    Thunderstorm: 'bg-gradient-to-br from-gray-900 to-gray-700',
    Drizzle: 'bg-gradient-to-br from-gray-400 to-gray-300',
    Mist: 'bg-gradient-to-br from-gray-400 to-gray-200'
  };
  return themes[weatherMain] || themes.Clear;
};

export const getWindDirection = (degrees: number): string => 
  ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round((degrees % 360) / 45) % 8];

export const convertToFahrenheit = (celsius: number): number => (celsius * 9/5) + 32;

export const getLocalTime = (timestamp: number, timezoneOffset: number): Date => {
  const utcMilliseconds = timestamp * 1000;
  const localOffset = new Date().getTimezoneOffset() * 60 * 1000;
  return new Date(utcMilliseconds + localOffset + (timezoneOffset * 1000));
};

export const isDaytime = (timestamp: number, sunrise: number, sunset: number): boolean => 
  timestamp > sunrise && timestamp < sunset;

export const formatTime = (date: Date): string => {
  const hours24 = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes} ${hours24 >= 12 ? 'PM' : 'AM'}`;
};

export const getAQIColor = (aqi: number): string => {
  const levels = {
    1: 'text-green-500',
    2: 'text-yellow-500',
    3: 'text-orange-500',
    4: 'text-red-500',
    5: 'text-purple-500'
  };
  return levels[aqi as keyof typeof levels] || levels[1];
};

export const getAQILabel = (aqi: number): string => {
  const levels = {
    1: 'Good',
    2: 'Fair',
    3: 'Moderate',
    4: 'Poor',
    5: 'Very Poor'
  };
  return levels[aqi as keyof typeof levels] || levels[1];
};