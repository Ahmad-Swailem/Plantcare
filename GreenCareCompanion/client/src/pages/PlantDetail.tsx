import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Plant, PlantCareGuide } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CareSchedule from "@/components/CareSchedule";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";

export default function PlantDetail() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [, params] = useRoute("/plant/:id");
  const id = params?.id ? parseInt(params.id) : null;

  const { data: plant, isLoading: isLoadingPlant } = useQuery<Plant>({
    queryKey: [`/api/plants/${id}`],
    enabled: !!id,
  });

  const { data: careGuide } = useQuery<PlantCareGuide>({
    queryKey: [`/api/care-guides/${plant?.species}`],
    enabled: !!plant?.species,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;
      await apiRequest("DELETE", `/api/plants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plants"] });
      toast({
        title: "Plant deleted",
        description: "The plant has been removed from your collection.",
      });
      setLocation("/");
    },
  });

  if (isLoadingPlant) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!plant) {
    return <div>Plant not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <img
          src={plant.image}
          alt={plant.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div>
        <h1 className="text-2xl font-bold">{plant.name}</h1>
        <p className="text-muted-foreground">{plant.species}</p>
      </div>

      <CareSchedule plant={plant} />

      {careGuide && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Care Guide</h2>
          <div className="space-y-2">
            <p>
              <strong>Watering: </strong>
              {careGuide.wateringGuide}
            </p>
            <p>
              <strong>Sunlight: </strong>
              {careGuide.sunlightGuide}
            </p>
            {careGuide.fertilizingGuide && (
              <p>
                <strong>Fertilizing: </strong>
                {careGuide.fertilizingGuide}
              </p>
            )}
            {careGuide.commonIssues && (
              <p>
                <strong>Common Issues: </strong>
                {careGuide.commonIssues}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Plant
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                plant from your collection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate()}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
