import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getWindDirection,
  getLocalTime,
  formatTime,
  isDaytime,
} from "@/utils/weather";
import { WeatherData } from "@/types/weather";
import {
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiDaySunny,
  WiNightClear,
  WiBarometer,
  WiRaindrop,
} from "react-icons/wi";
import { motion, AnimatePresence } from "framer-motion";

type WeatherCardProps = {
  weatherData: WeatherData;
  tempUnit: "C" | "F";
  onTempUnitChange: () => void;
  onConvertTemp: (temp: number) => number;
  themeMode?: "light" | "dark";
};

const WeatherInfo = ({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label?: string;
}) => (
  <div className="flex items-center space-x-2" role="group" aria-label={label}>
    <Icon className="text-3xl" aria-hidden="true" />
    <span>{value}</span>
  </div>
);

export const WeatherCard = ({
  weatherData,
  tempUnit,
  onTempUnitChange,
  onConvertTemp,
  themeMode = "light",
}: WeatherCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(
    getLocalTime(Math.floor(Date.now() / 1000), weatherData.timezone)
  );

  useEffect(() => {
    const updateTime = () =>
      setCurrentTime(
        getLocalTime(Math.floor(Date.now() / 1000), weatherData.timezone)
      );
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [weatherData.timezone]);

  const daytime = isDaytime(
    Math.floor(currentTime.getTime() / 1000),
    weatherData.sys.sunrise,
    weatherData.sys.sunset
  );

  return (
    <div
      className="perspective-1000 w-full max-w-md mx-auto cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="front"
              className={`p-6 rounded-lg shadow-lg backdrop-blur-md w-full ${
                themeMode === "dark" ? "bg-gray-800/50" : "bg-white/20"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold mb-4">
                  {weatherData.name}, {weatherData.sys.country}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {daytime ? (
                    <WiDaySunny className="text-2xl" aria-hidden="true" />
                  ) : (
                    <WiNightClear className="text-2xl" aria-hidden="true" />
                  )}
                  <div className="text-lg">{formatTime(currentTime)}</div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                  alt={weatherData.weather[0].description}
                  width={128}
                  height={128}
                  className="w-32 h-32"
                />
                <div className="text-4xl font-bold mb-4 flex items-center gap-2">
                  <span>
                    {Math.round(onConvertTemp(weatherData.main.temp))}°
                    {tempUnit}
                  </span>
                </div>
                <div className="text-xl capitalize mb-4">
                  {weatherData.weather[0].description}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTempUnitChange();
                  }}
                  className="text-sm px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                >
                  Switch to °{tempUnit === "C" ? "F" : "C"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              className={`p-6 rounded-lg shadow-lg backdrop-blur-md w-full ${
                themeMode === "dark" ? "bg-gray-800/50" : "bg-white/20"
              }`}
              style={{
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-1 gap-4">
                <WeatherInfo
                  icon={WiThermometer}
                  value={`Feels like: ${Math.round(
                    onConvertTemp(weatherData.main.feels_like)
                  )}°${tempUnit}`}
                  label="Feels like temperature"
                />
                <WeatherInfo
                  icon={WiHumidity}
                  value={`Humidity: ${weatherData.main.humidity}%`}
                  label="Humidity percentage"
                />
                <WeatherInfo
                  icon={WiStrongWind}
                  value={`Wind: ${Math.round(
                    weatherData.wind.speed
                  )} m/s ${getWindDirection(weatherData.wind.deg)}`}
                  label="Wind speed and direction"
                />
                <WeatherInfo
                  icon={WiBarometer}
                  value={`Pressure: ${weatherData.main.pressure} hPa`}
                  label="Atmospheric pressure"
                />
                <WeatherInfo
                  icon={WiRaindrop}
                  value={`Visibility: ${(weatherData.visibility / 1000).toFixed(
                    1
                  )} km`}
                  label="Visibility"
                />
                <div className="text-sm text-center mt-2">
                  (Click to see basic view)
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
