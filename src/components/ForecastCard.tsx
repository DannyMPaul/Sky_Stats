import { ForecastData } from "@/utils/weather";
import { WiHumidity, WiStrongWind } from "react-icons/wi";

type ForecastCardProps = {
  forecast: ForecastData;
  tempUnit: "C" | "F";
  onConvertTemp: (temp: number) => number;
};

type WeatherInfoProps = {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
};

const WeatherInfo = ({ icon: Icon, value }: WeatherInfoProps) => (
  <div className="flex items-center justify-center space-x-2 text-sm">
    <Icon className="text-lg" />
    <span>{value}</span>
  </div>
);

export const ForecastCard = ({
  forecast,
  tempUnit,
  onConvertTemp,
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
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full mt-8">
      {dailyForecasts.map((day) => (
        <div
          key={day.dt}
          className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-white"
        >
          <div className="text-center">
            <div className="font-semibold">
              {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </div>

            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
              className="mx-auto"
            />

            <div className="text-lg font-bold">
              {Math.round(onConvertTemp(day.main.temp))}°{tempUnit}
            </div>

            <WeatherInfo icon={WiHumidity} value={`${day.main.humidity}%`} />

            <WeatherInfo
              icon={WiStrongWind}
              value={`${Math.round(day.wind.speed)} m/s`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
