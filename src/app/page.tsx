"use client";
import { useState, useEffect } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { ForecastCard } from "@/components/ForecastCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Settings } from "@/components/Settings";
import {
  getWeatherAndDetails,
  convertToFahrenheit,
  getSearchHistory,
  addToSearchHistory,
} from "@/utils/weather";
import {
  WeatherData,
  ForecastData,
  SearchHistoryItem,
} from "@/types/weather";
import { FaSearch, FaHistory } from "react-icons/fa";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setShowHistory(false);

    try {
      const data = await getWeatherAndDetails(city);
      setWeather(data.weather);
      setForecast(data.forecast);
      addToSearchHistory(data.weather.name, data.weather.sys.country);
      setSearchHistory(getSearchHistory());
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data"
      );
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = async (item: SearchHistoryItem) => {
    const searchTerm = `${item.city}, ${item.country}`;
    setCity(searchTerm);
    setShowHistory(false);
    setLoading(true);
    setError("");

    try {
      const { weather: weatherData, forecast: forecastData } = await getWeatherAndDetails(searchTerm);
      setWeather(weatherData);
      setForecast(forecastData);
      addToSearchHistory(item.city, item.country);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`min-h-screen p-8 ${
        themeMode === "dark"
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-400 to-blue-600"
      } text-white transition-colors duration-500`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Sky Stats</h1>
          <div className="flex items-center gap-2">
            <Settings
              tempUnit={tempUnit}
              themeMode={themeMode}
              onTempUnitChange={() =>
                setTempUnit((prev) => (prev === "C" ? "F" : "C"))
              }
              onThemeModeChange={() =>
                setThemeMode((prev) => (prev === "light" ? "dark" : "light"))
              }
            />
          </div>
        </div>

        <div className="relative">
          <form onSubmit={handleSearch} className="flex gap-2 mb-8">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/70"
            />
            {searchHistory.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors"
                aria-label="Show search history"
              >
                <FaHistory />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : <FaSearch />}
            </button>
          </form>

          {showHistory && searchHistory.length > 0 && (
            <div className="absolute z-10 w-full bg-white/20 backdrop-blur-md rounded-lg shadow-lg mt-1">
              {searchHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(item)}
                  className="w-full px-4 py-2 text-left hover:bg-white/20 transition-colors flex justify-between items-center"
                >
                  <span>
                    {item.city}, {item.country}
                  </span>
                  <span className="text-sm opacity-70">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div
            className="text-center text-white bg-red-500/50 backdrop-blur-md rounded-lg p-4 mb-8 max-w-md mx-auto"
            role="alert"
          >
            {error}
          </div>
        )}

        {loading && !weather && (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {weather && (
          <div className="flex flex-col items-center w-full">
            <WeatherCard
              weatherData={weather}
              tempUnit={tempUnit}
              themeMode={themeMode}
              onTempUnitChange={() =>
                setTempUnit((prev) => (prev === "C" ? "F" : "C"))
              }
              onConvertTemp={(temp) =>
                tempUnit === "F" ? convertToFahrenheit(temp) : temp
              }
            />
          </div>
        )}

        {forecast && (
          <ForecastCard
            forecast={forecast}
            tempUnit={tempUnit}
            themeMode={themeMode}
            onConvertTemp={(temp) =>
              tempUnit === "F" ? convertToFahrenheit(temp) : temp
            }
          />
        )}
      </div>
    </main>
  );
}
