import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ForecastData } from "@/types/weather";

interface TempChartProps {
  forecast: ForecastData;
  tempUnit: "C" | "F";
  onConvertTemp: (temp: number) => number;
  themeMode?: "light" | "dark";
}

export const TempChart = ({
  forecast,
  tempUnit,
  onConvertTemp,
  themeMode = "light",
}: TempChartProps) => {
  const chartData = forecast.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: Math.round(onConvertTemp(item.main.temp)),
    feelsLike: Math.round(onConvertTemp(item.main.feels_like)),
  }));

  const isDark = themeMode === "dark";

  return (
    <div className={`w-full h-64 p-4 rounded-lg ${
      isDark ? "bg-gray-800" : "bg-white/10"
    } backdrop-blur-md`}>
      <h3 className="text-lg font-semibold mb-4 text-center">
        24-Hour Temperature Trend
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#374151" : "#ffffff40"}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: isDark ? "#d1d5db" : "#ffffff" }}
            axisLine={{ stroke: isDark ? "#6b7280" : "#ffffff60" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: isDark ? "#d1d5db" : "#ffffff" }}
            axisLine={{ stroke: isDark ? "#6b7280" : "#ffffff60" }}
            label={{
              value: `Temperature (°${tempUnit})`,
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle", fill: isDark ? "#d1d5db" : "#ffffff" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              border: "none",
              borderRadius: "8px",
              color: isDark ? "#ffffff" : "#000000",
            }}
            formatter={(value, name) => [
              `${value}°${tempUnit}`,
              name === "temperature" ? "Temperature" : "Feels Like",
            ]}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="feelsLike"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
