import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertPlantSchema } from "@shared/schema";
import { z } from "zod";

const updatePlantSchema = insertPlantSchema.partial();

export async function registerRoutes(app: Express) {
  app.get("/api/plants", async (_req, res) => {
    const plants = await storage.getPlants();
    res.json(plants);
  });

  app.get("/api/plants/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }

    const plant = await storage.getPlant(id);
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.json(plant);
  });

  app.post("/api/plants", async (req, res) => {
    const result = insertPlantSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid plant data" });
    }

    const plant = await storage.createPlant(result.data);
    res.status(201).json(plant);
  });

  app.patch("/api/plants/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }

    const result = updatePlantSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid update data" });
    }

    const updated = await storage.updatePlant(id, result.data);
    if (!updated) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.json(updated);
  });

  app.delete("/api/plants/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }

    const success = await storage.deletePlant(id);
    if (!success) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.status(204).end();
  });

  app.get("/api/care-guides", async (_req, res) => {
    const guides = await storage.getCareGuides();
    res.json(guides);
  });

  app.get("/api/care-guides/:species", async (req, res) => {
    const guide = await storage.getCareGuide(req.params.species);
    if (!guide) {
      return res.status(404).json({ message: "Care guide not found" });
    }
    res.json(guide);
  });

  app.get("/api/plant-templates", async (_req, res) => {
    const templates = await storage.getPlantTemplates();
    res.json(templates);
  });

  const httpServer = createServer(app);
  return httpServer;
}