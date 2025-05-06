"use client";

import { useState, useEffect } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { ForecastCard } from "@/components/ForecastCard";
import { Settings } from "@/components/Settings";
import {
  getWeather,
  getForecast,
  getAirQuality,
  getExtendedWeather,
  getBackgroundTheme,
  convertToFahrenheit,
  WeatherData,
  ForecastData,
  AirQualityData,
  ExtendedWeatherData,
} from "@/utils/weather";
import { FaSearch } from "react-icons/fa";
import { ThemeProvider } from "next-themes";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [extendedData, setExtendedData] = useState<ExtendedWeatherData | null>(null);
  const [error, setError] = useState("");
  const [tempUnit, setTempUnit] = useState<"C" | "F">(() => {
    if (typeof localStorage !== 'undefined') {
      return (localStorage.getItem("tempUnit") as "C" | "F") || "C";
    }
    return "C";
  });
  const [displayOptions, setDisplayOptions] = useState({
    showAirQuality: true,
    showExtendedDetails: true,
    showTrends: true,
  });
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem("recentSearches") || "[]");
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("tempUnit", tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearch = async (searchCity: string) => {
    if (!searchCity.trim()) return;
    
    try {
      const weatherData = await getWeather(searchCity);
      const [forecastData, airQualityData, extendedWeatherData] = await Promise.all([
        getForecast(searchCity),
        getAirQuality(weatherData.coord.lat, weatherData.coord.lon),
        getExtendedWeather(weatherData.coord.lat, weatherData.coord.lon),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      setAirQuality(airQualityData);
      setExtendedData(extendedWeatherData);
      setError("");

      const updatedSearches = [
        searchCity,
        ...recentSearches.filter((s) => s !== searchCity),
      ].slice(0, 5);
      setRecentSearches(updatedSearches);
      setCity("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather data");
      setWeather(null);
      setForecast(null);
      setAirQuality(null);
      setExtendedData(null);
    }
  };

  const handleDisplayOptionChange = (option: keyof typeof displayOptions) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const bgTheme = weather
    ? getBackgroundTheme(weather.weather[0].main, new Date().getHours())
    : "bg-gradient-to-br from-blue-400 to-blue-200";

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main className={`min-h-screen ${bgTheme} p-4 transition-colors duration-500`}>
        <Settings
          tempUnit={tempUnit}
          onTempUnitChange={() => setTempUnit(prev => prev === "C" ? "F" : "C")}
          displayOptions={displayOptions}
          onDisplayOptionChange={handleDisplayOptionChange}
        />

        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(city)}
                placeholder="Enter city name..."
                className="w-full px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                onClick={() => handleSearch(city)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              >
                <FaSearch />
              </button>
            </div>

            {recentSearches.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm text-white hover:bg-white/30 transition-colors whitespace-nowrap"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="text-center text-white bg-red-500/50 backdrop-blur-md rounded-lg p-4 mb-8 max-w-md mx-auto">
              {error}
            </div>
          )}

          {weather && (
            <div className="flex flex-col items-center">
              <WeatherCard
                weatherData={weather}
                extendedData={displayOptions.showExtendedDetails ? extendedData || undefined : undefined}
                airQuality={displayOptions.showAirQuality ? airQuality || undefined : undefined}
                tempUnit={tempUnit}
                onTempUnitChange={() => setTempUnit(prev => prev === "C" ? "F" : "C")}
                onConvertTemp={(temp) => tempUnit === "F" ? convertToFahrenheit(temp) : temp}
              />
              {forecast && (
                <ForecastCard
                  forecast={forecast}
                  tempUnit={tempUnit}
                  onConvertTemp={(temp) => tempUnit === "F" ? convertToFahrenheit(temp) : temp}
                />
              )}
            </div>
          )}

          {!weather && !error && (
            <div className="text-center text-white text-xl">
              Enter a city name to get the weather forecast
            </div>
          )}
        </div>
      </main>
    </ThemeProvider>
  );
}
