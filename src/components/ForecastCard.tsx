import { ForecastData } from "@/types/weather";
import Image from "next/image";
import {
  WiHumidity,
  WiStrongWind,
  WiRaindrop,
  WiThermometer,
} from "react-icons/wi";
import { motion } from "framer-motion";

type ForecastCardProps = {
  forecast: ForecastData;
  tempUnit: "C" | "F";
  onConvertTemp: (temp: number) => number;
  themeMode?: "light" | "dark";
};

type WeatherInfoProps = {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label?: string;
};

const WeatherInfo = ({ icon: Icon, value, label }: WeatherInfoProps) => (
  <div
    className="flex items-center justify-center space-x-2 text-sm"
    role="group"
    aria-label={label}
  >
    <Icon className="text-lg" aria-hidden="true" />
    <span>{value}</span>
  </div>
);

export const ForecastCard = ({
  forecast,
  tempUnit,
  onConvertTemp,
  themeMode = "light",
}: ForecastCardProps) => {
  const dailyForecasts = forecast.list
    .reduce((acc: typeof forecast.list, curr) => {
      const date = new Date(curr.dt * 1000).toLocaleDateString();
      if (
        !acc.find((f) => new Date(f.dt * 1000).toLocaleDateString() === date)
      ) {
        acc.push(curr);
      }
      return acc;
    }, [])
    .slice(1, 6);

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {dailyForecasts.map((day) => (
        <motion.div
          key={day.dt}
          className={`bg-white/20 backdrop-blur-md rounded-xl p-4 text-white ${
            themeMode === "dark" ? "hover:bg-white/30" : "hover:bg-white/25"
          } transition-colors`}
          whileHover={{ scale: 1.02 }}
          role="article"
          aria-label={`Weather forecast for ${new Date(
            day.dt * 1000
          ).toLocaleDateString("en-US", {
            weekday: "long",
          })}`}
        >
          <div className="text-center">
            <div className="font-semibold">
              {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </div>

            <Image
              src={`/weather-icons/${day.weather[0].icon}.svg`}
              alt={day.weather[0].description}
              width={50}
              height={50}
              className="mx-auto"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = '/default-weather.svg';
              }}
            />

            <div
              className="text-lg font-bold mb-2"
              role="text"
              aria-label={`Temperature ${Math.round(
                onConvertTemp(day.main.temp)
              )} degrees ${tempUnit}`}
            >
              {Math.round(onConvertTemp(day.main.temp))}°{tempUnit}
            </div>

            <div
              className="text-sm capitalize mb-3"
              role="text"
              aria-label={`Weather condition: ${day.weather[0].description}`}
            >
              {day.weather[0].description}
            </div>

            <div className="space-y-2">
              <WeatherInfo
                icon={WiThermometer}
                value={`Feels: ${Math.round(
                  onConvertTemp(day.main.feels_like)
                )}°${tempUnit}`}
                label="Feels like temperature"
              />

              <WeatherInfo
                icon={WiHumidity}
                value={`${day.main.humidity}%`}
                label="Humidity percentage"
              />

              <WeatherInfo
                icon={WiRaindrop}
                value={`${Math.round(day.pop * 100)}%`}
                label="Precipitation probability"
              />

              <WeatherInfo
                icon={WiStrongWind}
                value={`${Math.round(day.wind.speed)} m/s`}
                label="Wind speed"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
