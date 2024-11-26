import { WeatherData } from "@/api/types";
import { useFavourite } from "@/hooks/use-favourite";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FavBtnProps {
  data: WeatherData;
}

const FavBtn = ({ data }: FavBtnProps) => {
  const { addFavourite, isFavourite, removeFavourite } =
    useFavourite();
  const isCurrentlyFavourite = isFavourite(data.coord.lat, data.coord.lon);

  const handleToggleFav = () => {
    if (isCurrentlyFavourite) {
      removeFavourite.mutate(`${data.coord.lat}-${data.coord.lon}`);
      toast.error(`Removed ${data.name} from Favourites`);
    } else {
      addFavourite.mutate({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      toast.success(`Added ${data.name} to Favourites`);
    }
  };

  return (
    <Button
      variant={isCurrentlyFavourite ? "default" : "outline"}
      size={"icon"}
      onClick={handleToggleFav}
      className={
        isCurrentlyFavourite ? "bg-yellow-500 hover:bg-yellow-600" : ""
      }
    >
      <Star
        className={`h-4 w-4 ${isCurrentlyFavourite ? "fill-current" : ""}`}
      />
    </Button>
  );
};

export default FavBtn;
