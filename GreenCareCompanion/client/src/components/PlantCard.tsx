import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plant } from "@shared/schema";
import { Link } from "wouter";
import { Droplet, Sun } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface PlantCardProps {
  plant: Plant;
  onWater?: () => void;
}

export default function PlantCard({ plant, onWater }: PlantCardProps) {
  const daysSinceWatered = plant.lastWatered
    ? Math.floor(
        (Date.now() - new Date(plant.lastWatered).getTime()) / (1000 * 60 * 60 * 24)
      )
    : plant.waterFrequency;

  const needsWater = daysSinceWatered >= plant.waterFrequency;

  const getWateringText = () => {
    if (needsWater) {
      return "Gießen erforderlich!";
    }
    return `Nächstes Gießen in ${plant.waterFrequency - daysSinceWatered} Tagen`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <img
          src={plant.image}
          alt={plant.name}
          className="h-full w-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold">{plant.name}</h3>
        <p className="text-sm text-muted-foreground">{plant.species}</p>
        <div className="mt-2 flex items-center gap-2">
          <Droplet className="h-4 w-4 text-blue-500" />
          <span className="text-sm">{getWateringText()}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <Sun className="h-4 w-4 text-yellow-500" />
          <span className="text-sm">{plant.sunlightNeeds}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button
          variant={needsWater ? "default" : "secondary"}
          className="flex-1"
          onClick={onWater}
        >
          Pflanze gießen
        </Button>
        <Link href={`/plant/${plant.id}`}>
          <Button variant="outline" className="flex-1">
            Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}