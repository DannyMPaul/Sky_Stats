import Image from "next/image";
import { ForecastData } from "@/types/weather";
import { motion } from "framer-motion";

interface HourlyForecastProps {
  forecast: ForecastData;
  tempUnit: "C" | "F";
  onConvertTemp: (temp: number) => number;
  themeMode?: "light" | "dark";
}

export const HourlyForecast = ({
  forecast,
  tempUnit,
  onConvertTemp,
  themeMode = "light",
}: HourlyForecastProps) => {
  const hourlyData = forecast.list.slice(0, 8);

  return (
    <div
      className={`w-full p-4 rounded-lg ${
        themeMode === "dark" ? "bg-gray-800" : "bg-white/10"
      } backdrop-blur-md`}
    >
      <h3 className="text-lg font-semibold mb-4 text-center">
        Hourly Forecast
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {hourlyData.map((hour, index) => (
          <motion.div
            key={hour.dt}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex-shrink-0 text-center p-3 rounded-lg ${
              themeMode === "dark" ? "bg-gray-700" : "bg-white/20"
            } min-w-[80px]`}
          >
            <div className="text-sm font-medium mb-2">
              {new Date(hour.dt * 1000).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="flex justify-center mb-2">
              <Image
                src={`/weather-icons/${hour.weather[0].icon}.svg`}
                alt={hour.weather[0].description}
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
            <div className="text-lg font-bold mb-1">
              {Math.round(onConvertTemp(hour.main.temp))}°{tempUnit}
            </div>
            <div className="text-xs opacity-75 mb-1">
              {hour.pop > 0 && `${Math.round(hour.pop * 100)}%`}
            </div>
            <div className="text-xs opacity-75 capitalize">
              {hour.weather[0].description}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
