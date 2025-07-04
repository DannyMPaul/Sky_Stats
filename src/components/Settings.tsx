import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdSettings, MdClose } from "react-icons/md";
import { WiThermometer, WiDaySunny, WiNightClear } from "react-icons/wi";

interface SettingsProps {
  tempUnit: "C" | "F";
  themeMode: "light" | "dark";
  onTempUnitChange: () => void;
  onThemeModeChange: () => void;
}

export const Settings = ({
  tempUnit,
  themeMode,
  onTempUnitChange,
  onThemeModeChange,
}: SettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const settingsOptions = [
    {
      title: "Temperature Unit",
      icon: WiThermometer,
      current: tempUnit,
      options: ["C", "F"],
      onChange: onTempUnitChange,
    },
    {
      title: "Theme Mode",
      icon: themeMode === "light" ? WiDaySunny : WiNightClear,
      current: themeMode,
      options: ["light", "dark"],
      onChange: onThemeModeChange,
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Open settings"
      >
        <MdSettings size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md mx-4 p-6 rounded-xl ${
                themeMode === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
              } shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Settings</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close settings"
                >
                  <MdClose size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {settingsOptions.map((option) => (
                  <div key={option.title} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <option.icon className="text-lg" />
                      <span className="font-medium">{option.title}</span>
                    </div>
                    <div className="flex gap-2">
                      {option.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={option.onChange}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            option.current === opt
                              ? "bg-blue-500 text-white"
                              : themeMode === "dark"
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {opt === "C" ? "Celsius" : opt === "F" ? "Fahrenheit" : opt === "light" ? "Light" : "Dark"}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your preferences are automatically saved locally.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
