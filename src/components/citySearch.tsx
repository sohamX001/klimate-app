import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { useState } from "react";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/use-search-history";
import { format } from "date-fns";
import { useFavourite } from "@/hooks/use-favourite";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(" ");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");

    //Add to search history
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  const { favourites } = useFavourite();

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search cities
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Enter city name"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No cities found.</CommandEmpty>
          )}

          {/* fav cities list */}

          {favourites.length > 0 && (
            <CommandGroup heading="Favourites">
              {favourites.map((loc) => {
                return (
                  <CommandItem
                    key={loc.id}
                    value={`${loc.lat}|${loc.lon}|${loc.name}|${loc.country}`}
                    onSelect={handleSelect}
                  >
                    <Star className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>{loc.name}</span>
                    {loc.state && (
                      <span className="text-sm text-muted-foreground">
                        , {loc.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {loc.country}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">
                    Recent Searches
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
                {history.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                    onSelect={handleSelect}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{item.name}</span>
                    {item.state && (
                      <span className="text-sm text-muted-foreground">
                        , {item.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {item.country}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {format(item.searchedAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="fIex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations.map((loc) => {
                return (
                  <CommandItem
                    key={`${loc.lat}-${loc.lon}`}
                    value={`${loc.lat}|${loc.lon}|${loc.name}|${loc.country}`}
                    onSelect={handleSelect}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>{loc.name}</span>
                    {loc.state && (
                      <span className="text-sm text-muted-foreground">
                        , {loc.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {loc.country}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
