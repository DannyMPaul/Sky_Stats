import axios from "axios";

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: [
    {
      main: string;
      description: string;
      icon: string;
    }
  ];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  visibility: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    weather: [
      {
        main: string;
        description: string;
        icon: string;
      }
    ];
    wind: {
      speed: number;
      deg: number;
    };
    pop: number;
  }>;
}

export interface SearchHistoryItem {
  city: string;
  country: string;
  timestamp: number;
}

export const MAX_SEARCH_HISTORY = 5;

export const getSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem('weatherSearchHistory');
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
  
  localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
};

export const getCoordinates = async (city: string) => {
  if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY)
    throw new Error("Weather API key is not configured");

  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    );

    if (!data.length) throw new Error("Location not found");

    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error("Invalid API key");
      if (error.response?.status === 404) throw new Error("Location not found");
    }
    throw new Error("Failed to fetch location data");
  }
};

export const getWeather = async (city: string): Promise<WeatherData> => {
  if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY)
    throw new Error("Weather API key is not configured");

  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error("Invalid API key");
      if (error.response?.status === 404) throw new Error("Location not found");
    }
    throw new Error("Failed to fetch weather data");
  }
};

export const getForecast = async (city: string): Promise<ForecastData> => {
  if (!process.env.NEXT_PUBLIC_WEATHER_API_KEY)
    throw new Error("Weather API key is not configured");

  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) throw new Error("Invalid API key");
      if (error.response?.status === 404) throw new Error("Location not found");
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