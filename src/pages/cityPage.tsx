import CurrentWeather from "@/components/currentWeather";
import FavBtn from "@/components/favBtn";
import HourlyTemperature from "@/components/hourlyTemp";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WeatherDetails from "@/components/weatherDetails";
import WeatherForecast from "@/components/weatherForecast";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";

const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    <Alert variant="default" className="border-yellow-700">
      <AlertTriangle className="h-4 w-4" color="orange" />
      <AlertTitle className="text-orange-400">Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p className="text-yellow-400">
          Failed to load weather data. Please try again.
        </p>
      </AlertDescription>
    </Alert>;
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* favorite cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>

        {/* favourite btn */}
        <div>
          <FavBtn data={{...weatherQuery.data, name: params.cityName}} />
        </div>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          {/* current weather */}
          <CurrentWeather data={weatherQuery.data} />

          {/* hourly temp */}
          <HourlyTemperature data={forecastQuery.data} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* details */}
          <WeatherDetails data={weatherQuery.data} />

          {/* forecast */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default CityPage;
