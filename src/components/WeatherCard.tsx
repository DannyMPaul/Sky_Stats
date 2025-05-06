import { useState, useEffect } from "react";
import {
  WeatherData,
  ExtendedWeatherData,
  AirQualityData,
  getWindDirection,
  getLocalTime,
  formatTime,
  isDaytime,
  getAQIColor,
  getAQILabel,
} from "@/utils/weather";
import {
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiSunrise,
  WiSunset,
  WiDaySunny,
  WiNightClear,
  WiBarometer,
  WiRaindrop,
} from "react-icons/wi";
import { motion } from "framer-motion";
import { TempChart } from "./TempChart";
import { Tab } from "@headlessui/react";

type WeatherCardProps = {
  weatherData: WeatherData;
  extendedData?: ExtendedWeatherData;
  airQuality?: AirQualityData;
  tempUnit: "C" | "F";
  onTempUnitChange: () => void;
  onConvertTemp: (temp: number) => number;
};

export const WeatherCard = ({
  weatherData,
  extendedData,
  airQuality,
  tempUnit,
  onTempUnitChange,
  onConvertTemp,
}: WeatherCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
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

  const WeatherInfo = ({ icon: Icon, value }: { icon: any; value: string }) => (
    <div className="flex items-center space-x-2">
      <Icon className="text-3xl" />
      <span>{value}</span>
    </div>
  );

  return (
    <motion.div
      className="w-full max-w-2xl relative cursor-pointer"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="absolute w-full h-full backface-hidden rounded-xl shadow-lg p-6 text-white"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="flex flex-col items-center justify-between h-full">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              {daytime ? (
                <WiDaySunny className="text-2xl" />
              ) : (
                <WiNightClear className="text-2xl" />
              )}
              <div className="text-lg">{formatTime(currentTime)}</div>
            </div>
          </div>

          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            alt={weatherData.weather[0].description}
            className="w-32 h-32"
          />
          <div className="text-4xl font-bold mb-4 flex items-center gap-2">
            {Math.round(onConvertTemp(weatherData.main.temp))}°{tempUnit}
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
          <div className="text-xl capitalize">
            {weatherData.weather[0].description}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute w-full h-full backface-hidden rounded-xl shadow-lg p-6 text-white"
        animate={{ rotateY: isFlipped ? 0 : -180 }}
        transition={{ duration: 0.6 }}
        style={{ backfaceVisibility: "hidden" }}
      >
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-white/20 p-1 mb-4">
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
               ${selected ? 'bg-white/20 shadow text-white' : 'text-white/60 hover:bg-white/10'}
               focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60`
            }>
              Details
            </Tab>
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
               ${selected ? 'bg-white/20 shadow text-white' : 'text-white/60 hover:bg-white/10'}
               focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60`
            }>
              Air Quality
            </Tab>
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5
               ${selected ? 'bg-white/20 shadow text-white' : 'text-white/60 hover:bg-white/10'}
               focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60`
            }>
              Trends
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="space-y-4">
              <WeatherInfo
                icon={WiThermometer}
                value={`Feels like: ${Math.round(
                  onConvertTemp(weatherData.main.feels_like)
                )}°${tempUnit}`}
              />
              <WeatherInfo
                icon={WiHumidity}
                value={`Humidity: ${weatherData.main.humidity}%`}
              />
              <WeatherInfo
                icon={WiStrongWind}
                value={`Wind: ${Math.round(
                  weatherData.wind.speed
                )} m/s ${getWindDirection(weatherData.wind.deg)}`}
              />
              {extendedData && (
                <>
                  <WeatherInfo
                    icon={WiBarometer}
                    value={`Pressure: ${extendedData.current.pressure} hPa`}
                  />
                  <WeatherInfo
                    icon={WiRaindrop}
                    value={`Dew Point: ${Math.round(onConvertTemp(extendedData.current.dew_point))}°${tempUnit}`}
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">UV Index:</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${(extendedData.current.uvi / 11) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{extendedData.current.uvi.toFixed(1)}</span>
                  </div>
                  <WeatherInfo
                    icon={WiRaindrop}
                    value={`Visibility: ${(extendedData.current.visibility / 1000).toFixed(1)} km`}
                  />
                </>
              )}
            </Tab.Panel>
            <Tab.Panel className="space-y-4">
              {airQuality && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getAQIColor(airQuality.list[0].main.aqi)}`}>
                      {getAQILabel(airQuality.list[0].main.aqi)}
                    </div>
                    <div className="text-sm opacity-80">Air Quality Index</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm">PM2.5: {airQuality.list[0].components.pm2_5} µg/m³</div>
                      <div className="text-sm">PM10: {airQuality.list[0].components.pm10} µg/m³</div>
                      <div className="text-sm">O₃: {airQuality.list[0].components.o3} µg/m³</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">NO₂: {airQuality.list[0].components.no2} µg/m³</div>
                      <div className="text-sm">SO₂: {airQuality.list[0].components.so2} µg/m³</div>
                      <div className="text-sm">CO: {airQuality.list[0].components.co} µg/m³</div>
                    </div>
                  </div>
                </div>
              )}
            </Tab.Panel>
            <Tab.Panel>
              {extendedData && (
                <TempChart
                  data={extendedData.hourly.slice(0, 24)}
                  tempUnit={tempUnit}
                  onConvertTemp={onConvertTemp}
                />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </motion.div>
    </motion.div>
  );
};
