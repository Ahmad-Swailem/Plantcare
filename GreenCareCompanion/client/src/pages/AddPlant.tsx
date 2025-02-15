import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPlantSchema, type InsertPlant } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlantTemplate {
  species: string;
  waterFrequency: number;
  sunlightNeeds: string;
  fertilizeFrequency?: number;
  imageUrl: string;
}

export default function AddPlant() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertPlant>({
    resolver: zodResolver(insertPlantSchema),
    defaultValues: {
      name: "",
      species: "",
      image: "",
      waterFrequency: 7,
      sunlightNeeds: "",
      fertilizeFrequency: 30,
    },
  });

  const { data: templates } = useQuery<PlantTemplate[]>({
    queryKey: ["/api/plant-templates"],
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertPlant) => {
      await apiRequest("POST", "/api/plants", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plants"] });
      toast({
        title: "Plant added!",
        description: "Your new plant has been added to your collection.",
      });
      setLocation("/");
    },
  });

  const handleTemplateSelect = (species: string) => {
    const template = templates?.find((t) => t.species === species);
    if (template) {
      form.setValue("species", template.species);
      form.setValue("waterFrequency", template.waterFrequency);
      form.setValue("sunlightNeeds", template.sunlightNeeds);
      form.setValue("fertilizeFrequency", template.fertilizeFrequency);
      form.setValue("image", template.imageUrl);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neue Pflanze hinzufügen</CardTitle>
        <CardDescription>
          Wählen Sie aus häufigen Pflanzen oder fügen Sie eine benutzerdefinierte hinzu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-4"
          >
            {templates && templates.length > 0 && (
              <FormField
                control={form.control}
                name="species"
                render={() => (
                  <FormItem>
                    <FormLabel>Pflanzenart auswählen</FormLabel>
                    <Select onValueChange={handleTemplateSelect}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wählen Sie eine Pflanzenart" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem
                            key={template.species}
                            value={template.species}
                          >
                            {template.species}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pflanzenname</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="z.B. Wohnzimmer Monstera" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="waterFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gießen alle (Tage)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={60}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sunlightNeeds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lichtbedarf</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fertilizeFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Düngen alle (Tage)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={90}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Pflanze wird hinzugefügt..." : "Pflanze hinzufügen"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}