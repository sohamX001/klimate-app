import type { GeocodingResponse, WeatherData } from "@/api/types";
import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName?: GeocodingResponse;
}
const CurrentWeather = ({ data, locationName }: CurrentWeatherProps) => {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
      <Card className="lg:col-span-6 xl:col-span-5 h-full">
        <CardContent className="p-6 max-xs:px-6 px-10 lg:p-6">
          <div className="grid md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-1">
                  <h2 className="text-xl font-bold tracking-tighter">
                    {locationName?.name}
                  </h2>
                  {locationName?.state && (
                    <span className="text-muted-foreground">
                      , {locationName.state}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex justify-center md:justify-start">
                  {locationName?.country}
                </p>
              </div>

              <div className="flex items-center justify-around max-xs:justify-between md:justify-between gap-2">
                <p className="text-6xl font-bold tracking-tighter">
                  {formatTemp(temp)}
                </p>
                <div className="space-y-1">
                  <p className="text-lg font-medium text-muted-foreground">
                    Feels like {formatTemp(feels_like)}
                  </p>
                  <div className="flex justify-between gap-2 text-sm font-medium">
                    <span className="flex items-center gap-1 text-blue-500">
                      <ArrowDown className="h-3 w-3" />
                      {formatTemp(temp_min)}
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <ArrowUp className="h-3 w-3" />
                      {formatTemp(temp_max)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-around md:justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Humidity</p>
                    <p className="text-sm text-muted-foreground">{humidity}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-blue-500" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Wind speed</p>
                    <p className="text-sm text-muted-foreground">{speed} m/s</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center aspect-square w-full max-w-[200px]">
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                  alt={currentWeather.description}
                  className="h-full w-full object-contain"
                />
                <div className="absolute bottom-0 text-center">
                  <p className="text-sm font-medium capitalize">
                    {currentWeather.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
};

export default CurrentWeather;
