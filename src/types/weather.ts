export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
    id: number;
  }>;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  visibility: number;
  clouds: {
    all: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
      id: number;
    }>;
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    clouds: {
      all: number;
    };
    pop: number;
    visibility: number;
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    timezone: number;
    coord: {
      lat: number;
      lon: number;
    };
  };
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  severity: "Minor" | "Moderate" | "Severe" | "Extreme";
  tags: string[];
}

export interface AirQualityData {
  list: Array<{
    main: {
      aqi: number;
    };
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
    dt: number;
  }>;
}

export interface SearchHistoryItem {
  city: string;
  country: string;
  timestamp: number;
}

export interface GeocodeData {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export type TemperatureUnit = "C" | "F";
export type ThemeMode = "light" | "dark";

export interface UserPreferences {
  temperatureUnit: TemperatureUnit;
  themeMode: ThemeMode;
  autoLocation: boolean;
  notifications: boolean;
  refreshInterval: number;
}

export interface WeatherApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ComponentProps {
  className?: string;
  themeMode?: ThemeMode;
}

export interface WeatherComponentProps extends ComponentProps {
  tempUnit: TemperatureUnit;
  onConvertTemp: (temp: number) => number;
}
