import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  species: text("species").notNull(),
  image: text("image").notNull(),
  waterFrequency: integer("water_frequency").notNull(), // Days between watering
  sunlightNeeds: text("sunlight_needs").notNull(),
  lastWatered: timestamp("last_watered"),
  notes: text("notes"),
  fertilizeFrequency: integer("fertilize_frequency"), // Days between fertilizing
  lastFertilized: timestamp("last_fertilized"),
});

export const plantCareGuides = pgTable("plant_care_guides", {
  id: serial("id").primaryKey(),
  species: text("species").unique().notNull(),
  wateringGuide: text("watering_guide").notNull(),
  sunlightGuide: text("sunlight_guide").notNull(),
  fertilizingGuide: text("fertilizing_guide"),
  commonIssues: text("common_issues"),
});

export const insertPlantSchema = createInsertSchema(plants).omit({ 
  id: true,
  lastWatered: true,
  lastFertilized: true 
}).extend({
  waterFrequency: z.number().min(1).max(60),
  fertilizeFrequency: z.number().min(1).max(90).optional(),
});

export const insertCareGuideSchema = createInsertSchema(plantCareGuides).omit({ id: true });

export type Plant = typeof plants.$inferSelect;
export type InsertPlant = z.infer<typeof insertPlantSchema>;
export type PlantCareGuide = typeof plantCareGuides.$inferSelect;
export type InsertPlantCareGuide = z.infer<typeof insertCareGuideSchema>;
