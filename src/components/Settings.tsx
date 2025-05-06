import { Switch } from '@headlessui/react';
import { useTheme } from 'next-themes';

interface SettingsProps {
  tempUnit: 'C' | 'F';
  onTempUnitChange: () => void;
  displayOptions: {
    showAirQuality: boolean;
    showExtendedDetails: boolean;
    showTrends: boolean;
  };
  onDisplayOptionChange: (option: keyof typeof displayOptions) => void;
}

export const Settings = ({
  tempUnit,
  onTempUnitChange,
  displayOptions,
  onDisplayOptionChange,
}: SettingsProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg text-white">
        <h3 className="text-lg font-semibold mb-4">Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Temperature Unit</span>
            <button
              onClick={onTempUnitChange}
              className="px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
            >
              °{tempUnit}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span>Theme</span>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span>Show Air Quality</span>
            <Switch
              checked={displayOptions.showAirQuality}
              onChange={() => onDisplayOptionChange('showAirQuality')}
              className={`${
                displayOptions.showAirQuality ? 'bg-blue-600' : 'bg-gray-400'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span className="sr-only">Show air quality</span>
              <span
                className={`${
                  displayOptions.showAirQuality ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <span>Show Extended Details</span>
            <Switch
              checked={displayOptions.showExtendedDetails}
              onChange={() => onDisplayOptionChange('showExtendedDetails')}
              className={`${
                displayOptions.showExtendedDetails ? 'bg-blue-600' : 'bg-gray-400'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span className="sr-only">Show extended details</span>
              <span
                className={`${
                  displayOptions.showExtendedDetails ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>

          <div className="flex items-center justify-between">
            <span>Show Temperature Trends</span>
            <Switch
              checked={displayOptions.showTrends}
              onChange={() => onDisplayOptionChange('showTrends')}
              className={`${
                displayOptions.showTrends ? 'bg-blue-600' : 'bg-gray-400'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
            >
              <span className="sr-only">Show temperature trends</span>
              <span
                className={`${
                  displayOptions.showTrends ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};