import WeatherSkeleton from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import CurrentWeather from "@/components/currentWeather";
import HourlyTemperature from "@/components/hourlyTemp";
import WeatherDetails from "@/components/weatherDetails";
import WeatherForecast from "@/components/weatherForecast";
import FavouriteCity from "@/components/favCity";

const Dashboard = () => {
  const {
    coordinates,
    error: locError,
    getLocation,
    isLoading: locLoading,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);
  console.log(weatherQuery.data);
  // console.log(forecastQuery);
  // console.log(locationQuery);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      // reload weeather data
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locLoading) {
    return <WeatherSkeleton />;
  }

  if (locError) {
    return (
      <Alert variant="default" className="border-yellow-700">
        <AlertTriangle className="h-4 w-4" color="orange" />
        <AlertTitle className="text-orange-400">Location error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p className="text-yellow-400">{locError}</p>
          <Button
            onClick={getLocation}
            variant={"outline"}
            className="w-fit text-yellow-500"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Enable location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // edge case - if it's somehow unable to get the coordinates
  if (!coordinates) {
    return (
      <Alert variant="default" className="border-yellow-700">
        <AlertTitle className="text-orange-400">Location required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p className="text-yellow-400">
            Please enable location access to see your local weather.
          </p>
          <Button
            onClick={getLocation}
            variant={"outline"}
            className="w-fit text-yellow-500"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Enable location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    <Alert variant="default" className="border-yellow-700">
      <AlertTriangle className="h-4 w-4" color="orange" />
      <AlertTitle className="text-orange-400">Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p className="text-yellow-400">
          Failed to fetch weather data. Please try again.
        </p>
        <Button
          onClick={handleRefresh}
          variant={"outline"}
          className="w-fit text-yellow-500"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          retry
        </Button>
      </AlertDescription>
    </Alert>;
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* favorite cities */}
      <FavouriteCity />

      {/* My location */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>

      <div className="grid gap-6">
        {/* <div className="flex flex-col lg:flex-row gap-4"> */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* current weather */}
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />

          {/* hourly temp */}
          <HourlyTemperature data={forecastQuery.data} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 items-start">
          {/* details */}
          <WeatherDetails data={weatherQuery.data} />

          {/* forecast */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
