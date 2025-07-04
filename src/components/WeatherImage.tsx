import { useState } from "react";
import Image from "next/image";

interface WeatherImageProps {
  iconCode: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export const WeatherImage = ({
  iconCode,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: WeatherImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <Image
        src="/default-weather.svg"
        alt="Weather icon"
        width={width}
        height={height}
        className={className}
        priority={priority}
        onLoad={handleLoad}
      />
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          <div className="animate-pulse bg-gray-300 rounded-full w-8 h-8"></div>
        </div>
      )}
      <Image
        src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        unoptimized
      />
    </div>
  );
};
