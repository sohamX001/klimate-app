import { useFavourite } from "@/hooks/use-favourite";
// import { ScrollArea } from "./ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import { Button } from "./ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface FavCityTabProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

const FavouriteCity = () => {
  const { favourites, removeFavourite } = useFavourite();

  if (!favourites.length) {
    return null;
  }

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight">Favourites</h1>
      {/* <ScrollArea className="w-full pb-4 overflow-x-auto">
          <div className="flex gap-4">
            {favourites.map((city) => {
              return (
                <FavCityTab
                  key={city.id}
                  {...city}
                  onRemove={() => removeFavourite.mutate(city.id)}
                />
              );
            })}
          </div>
        </ScrollArea> */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex gap-4 max-xs:gap-2">
          {favourites.map((city) => (
            <FavCityTab
              key={city.id}
              {...city}
              onRemove={() => removeFavourite.mutate(city.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

function FavCityTab({ id, name, lat, lon, onRemove }: FavCityTabProps) {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

  return (
    <div
      onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
      role="button"
      tabIndex={0}
      className="relative flex min-w-[250px] cursor-pointer items-center justify-between gap-3 max-xs:gap-1 rounded-lg border bg-card
        p-4 pr-10 shadow-sm transition-all hover:shadow-md"
    >
      {/* cross btn */}

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 rounded-full p-0"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.error(`Removed ${name} from Favourites`);
        }}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Tab details */}

      {isLoading ? (
        <div className="flex h-8 items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
              className="h-8 w-8"
            />
            <div>
              <p className="font-medium truncate">{name}</p>
              <p className="text-xs text-muted-foreground">
                {weather.sys.country}
              </p>
            </div>
          </div>
          <div className="ml-2 text-right">
            <p className="text-xl font-bold">
              {Math.round(weather.main.temp)}°
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {weather.weather[0].description}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default FavouriteCity;
