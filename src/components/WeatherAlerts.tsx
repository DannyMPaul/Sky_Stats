import { WeatherAlert } from "@/types/weather";
import { IoWarning } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

type WeatherAlertsProps = {
  alerts: WeatherAlert[];
  themeMode?: "light" | "dark";
};

const getSeverityColor = (severity: WeatherAlert["severity"]) => {
  const colors: Record<WeatherAlert["severity"], string> = {
    Minor: "bg-yellow-500",
    Moderate: "bg-orange-500",
    Severe: "bg-red-500",
    Extreme: "bg-purple-500",
  };
  return colors[severity] || colors.Minor;
};

export const WeatherAlerts = ({
  alerts,
  themeMode = "light",
}: WeatherAlertsProps) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <AnimatePresence>
        {alerts.map((alert, index) => (
          <motion.div
            key={`${alert.event}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`mb-4 rounded-lg overflow-hidden ${
              themeMode === "dark" ? "bg-gray-800" : "bg-white/20"
            } backdrop-blur-md shadow-lg`}
          >
            <div
              className={`${getSeverityColor(
                alert.severity
              )} px-4 py-2 flex items-center gap-2 text-white`}
            >
              <IoWarning className="text-xl" />
              <span className="font-bold">{alert.event}</span>
              <span className="ml-auto text-sm">
                {new Date(alert.start * 1000).toLocaleString()} -{" "}
                {new Date(alert.end * 1000).toLocaleString()}
              </span>
            </div>
            <div className="p-4 text-white">
              <p className="text-sm mb-2">Source: {alert.sender_name}</p>
              <p className="whitespace-pre-wrap">{alert.description}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
