import { useQuery, useMutation } from "@tanstack/react-query";
import { Plant } from "@shared/schema";
import PlantCard from "@/components/PlantCard";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();

  const { data: plants, isLoading } = useQuery<Plant[]>({
    queryKey: ["/api/plants"],
  });

  const waterMutation = useMutation({
    mutationFn: async (plantId: number) => {
      await apiRequest("PATCH", `/api/plants/${plantId}`, {
        lastWatered: new Date(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plants"] });
      toast({
        title: "Pflanze gegossen!",
        description: "Der Gießplan wurde aktualisiert.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!plants?.length) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Willkommen bei Plant Care!</h2>
        <p className="mt-2 text-muted-foreground">
          Fügen Sie Ihre erste Pflanze hinzu, um zu beginnen.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plants.map((plant) => (
        <PlantCard
          key={plant.id}
          plant={plant}
          onWater={() => waterMutation.mutate(plant.id)}
        />
      ))}
    </div>
  );
}