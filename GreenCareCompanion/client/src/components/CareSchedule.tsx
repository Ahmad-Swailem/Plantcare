import { Plant } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Droplet, Sun, TestTube } from "lucide-react";

interface CareScheduleProps {
  plant: Plant;
}

export default function CareSchedule({ plant }: CareScheduleProps) {
  const lastWateredDate = plant.lastWatered ? new Date(plant.lastWatered) : null;
  const lastFertilizedDate = plant.lastFertilized ? new Date(plant.lastFertilized) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Care Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Droplet className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <p className="font-medium">Watering</p>
            <p className="text-sm text-muted-foreground">
              Every {plant.waterFrequency} days
            </p>
            <p className="text-sm">
              Last watered: {lastWateredDate ? format(lastWateredDate, "PPP") : "Never"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Sun className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <p className="font-medium">Sunlight Needs</p>
            <p className="text-sm text-muted-foreground">
              {plant.sunlightNeeds}
            </p>
          </div>
        </div>

        {plant.fertilizeFrequency && (
          <div className="flex items-start gap-3">
            <TestTube className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Fertilizing</p>
              <p className="text-sm text-muted-foreground">
                Every {plant.fertilizeFrequency} days
              </p>
              {lastFertilizedDate && (
                <p className="text-sm">
                  Last fertilized: {format(lastFertilizedDate, "PPP")}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}