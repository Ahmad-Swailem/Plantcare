import { Plant, InsertPlant, PlantCareGuide, InsertPlantCareGuide } from "@shared/schema";

interface PlantTemplate {
  species: string;
  waterFrequency: number;
  sunlightNeeds: string;
  fertilizeFrequency?: number;
  imageUrl: string;
}

const PLANT_TEMPLATES: PlantTemplate[] = [
  {
    species: "Monstera Deliciosa",
    waterFrequency: 7,
    sunlightNeeds: "Helles indirektes Licht",
    fertilizeFrequency: 30,
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b"
  },
  {
    species: "Efeutute (Pothos)",
    waterFrequency: 7,
    sunlightNeeds: "Schwaches bis helles indirektes Licht",
    fertilizeFrequency: 30,
    imageUrl: "https://images.unsplash.com/photo-1600411833114-9b041f1ce7be"
  },
  {
    species: "Roma Tomate",
    waterFrequency: 2,
    sunlightNeeds: "Volle Sonne",
    fertilizeFrequency: 14,
    imageUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e"
  },
  {
    species: "Kirschtomate",
    waterFrequency: 2,
    sunlightNeeds: "Volle Sonne",
    fertilizeFrequency: 14,
    imageUrl: "https://images.unsplash.com/photo-1592978122244-d8facf6d2b2b"
  },
  {
    species: "Basilikum",
    waterFrequency: 3,
    sunlightNeeds: "Helles direktes Licht",
    fertilizeFrequency: 21,
    imageUrl: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733"
  },
  {
    species: "Erdbeerpflanze",
    waterFrequency: 2,
    sunlightNeeds: "Volle bis teilweise Sonne",
    fertilizeFrequency: 14,
    imageUrl: "https://images.unsplash.com/photo-1598280688213-6273a277c153"
  },
  {
    species: "Paprikapflanze",
    waterFrequency: 3,
    sunlightNeeds: "Volle Sonne",
    fertilizeFrequency: 14,
    imageUrl: "https://images.unsplash.com/photo-1596371624647-42d19df0b38b"
  },
  {
    species: "Apfelbaum",
    waterFrequency: 7,
    sunlightNeeds: "Volle Sonne",
    fertilizeFrequency: 30,
    imageUrl: "https://images.unsplash.com/photo-1628517394673-6f73c8e28398"
  },
  {
    species: "Zitronenbaum",
    waterFrequency: 5,
    sunlightNeeds: "Volle Sonne",
    fertilizeFrequency: 21,
    imageUrl: "https://images.unsplash.com/photo-1591872203534-278fc084969e"
  },
  {
    species: "Salatpflanze",
    waterFrequency: 2,
    sunlightNeeds: "Teilweise Sonne",
    fertilizeFrequency: 14,
    imageUrl: "https://images.unsplash.com/photo-1582095949400-9edcc05a288c"
  },
  {
    species: "Gurke",
    waterFrequency: 2,
    sunlightNeeds: "Volle Sonne",
    fertilizeFrequency: 14,
    imageUrl: "https://images.unsplash.com/photo-1596397249129-c7a8f8718873"
  },
  {
    species: "Kartoffelpflanze",
    waterFrequency: 4,
    sunlightNeeds: "Volle Sonne",
    fertilizeFrequency: 21,
    imageUrl: "https://images.unsplash.com/photo-1591204890117-28c7e82603d3"
  },
  {
    species: "Himbeere",
    waterFrequency: 3,
    sunlightNeeds: "Volle bis teilweise Sonne",
    fertilizeFrequency: 21,
    imageUrl: "https://images.unsplash.com/photo-1594066521341-330a79387ec3"
  }
];

export interface IStorage {
  // Plant CRUD
  getPlants(): Promise<Plant[]>;
  getPlant(id: number): Promise<Plant | undefined>;
  createPlant(plant: InsertPlant): Promise<Plant>;
  updatePlant(id: number, plant: Partial<Plant>): Promise<Plant | undefined>;
  deletePlant(id: number): Promise<boolean>;

  // Care guides
  getCareGuide(species: string): Promise<PlantCareGuide | undefined>;
  getCareGuides(): Promise<PlantCareGuide[]>;
  createCareGuide(guide: InsertPlantCareGuide): Promise<PlantCareGuide>;

  // Templates
  getPlantTemplates(): Promise<PlantTemplate[]>;
}

export class MemStorage implements IStorage {
  private plants: Map<number, Plant>;
  private careGuides: Map<string, PlantCareGuide>;
  private currentPlantId: number;
  private currentGuideId: number;

  constructor() {
    this.plants = new Map();
    this.careGuides = new Map();
    this.currentPlantId = 1;
    this.currentGuideId = 1;
    this.initializeCareGuides();
  }

  async getPlantTemplates(): Promise<PlantTemplate[]> {
    return PLANT_TEMPLATES;
  }

  private initializeCareGuides() {
    const guides: InsertPlantCareGuide[] = [
      {
        species: "Monstera Deliciosa",
        wateringGuide: "Gießen Sie gründlich, wenn die oberen 5-8 cm des Bodens trocken sind. Im Winter weniger gießen.",
        sunlightGuide: "Gedeiht in hellem, indirektem Licht. Direktes Sonnenlicht vermeiden.",
        fertilizingGuide: "Während der Wachstumsperiode (Frühling und Sommer) monatlich mit ausgewogenem Dünger düngen.",
        commonIssues: "Gelbe Blätter deuten oft auf Überwässerung hin. Braune Ränder können auf zu niedrige Luftfeuchtigkeit hinweisen."
      },
      {
        species: "Efeutute (Pothos)",
        wateringGuide: "Gießen wenn die obere Erdschicht trocken ist. Verträgt gelegentliches Austrocknen.",
        sunlightGuide: "Anpassungsfähig an die meisten Lichtbedingungen außer direkter Sonne.",
        fertilizingGuide: "Während der Wachstumsperiode monatlich mit ausgewogenem Dünger düngen.",
        commonIssues: "Gelbe Blätter weisen meist auf Überwässerung oder schlechte Drainage hin."
      },
      {
        species: "Roma Tomate",
        wateringGuide: "Regelmäßig und gleichmäßig gießen. Boden feucht aber nicht nass halten.",
        sunlightGuide: "Benötigt mindestens 6 Stunden direktes Sonnenlicht täglich.",
        fertilizingGuide: "Alle zwei Wochen mit Tomatendünger düngen.",
        commonIssues: "Braune Blätter können auf Wassermangel hinweisen. Schwarze Flecken auf Früchten auf zu viel Feuchtigkeit."
      },
      {
        species: "Kirschtomate",
        wateringGuide: "Regelmäßig gießen, besonders während der Fruchtbildung. Morgens gießen empfohlen.",
        sunlightGuide: "Volle Sonne, mindestens 6 Stunden täglich für optimales Wachstum.",
        fertilizingGuide: "Alle 14 Tage mit Tomatendünger versorgen.",
        commonIssues: "Gelbe Blätter können Nährstoffmangel anzeigen. Aufgeplatzte Früchte durch unregelmäßiges Gießen."
      },
      {
        species: "Basilikum",
        wateringGuide: "Regelmäßig gießen, Boden leicht feucht halten.",
        sunlightGuide: "Mindestens 6 Stunden Sonnenlicht täglich.",
        fertilizingGuide: "Alle 3 Wochen mit organischem Dünger düngen.",
        commonIssues: "Gelbe Blätter können auf Überwässerung hinweisen. Dünne Stängel auf zu wenig Licht."
      },
      {
        species: "Erdbeerpflanze",
        wateringGuide: "Regelmäßig gießen, besonders während der Fruchtbildung.",
        sunlightGuide: "Volle Sonne bis Halbschatten, mindestens 6 Stunden Sonne.",
        fertilizingGuide: "Alle 2 Wochen während der Wachstums- und Fruchtphase düngen.",
        commonIssues: "Braune Früchte deuten auf Wassermangel hin. Grauschimmel bei zu hoher Feuchtigkeit."
      },
      {
        species: "Paprikapflanze",
        wateringGuide: "Gleichmäßig feucht halten, nicht austrocknen lassen.",
        sunlightGuide: "Benötigt volle Sonne, mindestens 6 Stunden täglich.",
        fertilizingGuide: "Alle 2 Wochen mit Gemüsedünger düngen.",
        commonIssues: "Gelbe Blätter können Nährstoffmangel anzeigen. Braune Flecken auf Früchten deuten auf Sonnenbrand hin."
      },
      {
        species: "Apfelbaum",
        wateringGuide: "Regelmäßig wässern, besonders in der Wachstumsphase und während der Fruchtbildung.",
        sunlightGuide: "Benötigt volle Sonne für optimale Fruchtbildung.",
        fertilizingGuide: "Im Frühjahr und Sommer alle 4-6 Wochen mit Obstbaumdünger düngen.",
        commonIssues: "Schorfbildung bei zu hoher Feuchtigkeit. Blattläuse können Wachstum beeinträchtigen."
      },
      {
        species: "Zitronenbaum",
        wateringGuide: "Regelmäßig gießen, Staunässe vermeiden. Im Winter reduziert gießen.",
        sunlightGuide: "Heller, sonniger Standort. Im Sommer vor starker Mittagssonne schützen.",
        fertilizingGuide: "Von März bis Oktober alle 3 Wochen mit Zitrusdünger versorgen.",
        commonIssues: "Gelbe Blätter können Eisenmangel anzeigen. Blattfall im Winter ist normal."
      },
      {
        species: "Salatpflanze",
        wateringGuide: "Gleichmäßig feucht halten, nicht austrocknen lassen. Morgens gießen.",
        sunlightGuide: "Gedeiht am besten bei Teilsonne, zu viel direkte Sonne vermeiden.",
        fertilizingGuide: "Alle 2 Wochen mit stickstoffbetontem Dünger versorgen.",
        commonIssues: "Braune Blattränder deuten auf Wassermangel hin. Schneckenfraß vorbeugen."
      },
      {
        species: "Gurke",
        wateringGuide: "Regelmäßig und reichlich gießen, besonders während der Fruchtbildung.",
        sunlightGuide: "Volle Sonne, aber vor starker Mittagshitze schützen.",
        fertilizingGuide: "Alle 2 Wochen mit Gemüsedünger versorgen.",
        commonIssues: "Bittere Früchte bei Wassermangel. Mehltau bei zu hoher Luftfeuchtigkeit."
      },
      {
        species: "Kartoffelpflanze",
        wateringGuide: "Gleichmäßig feucht halten, nach Blüte weniger gießen.",
        sunlightGuide: "Volle Sonne für optimales Knollenwachstum.",
        fertilizingGuide: "Zu Beginn der Saison mit Kartoffeldünger versorgen.",
        commonIssues: "Krautfäule bei zu viel Nässe. Grüne Stellen an Knollen bei zu viel Licht."
      },
      {
        species: "Himbeere",
        wateringGuide: "Regelmäßig gießen, Mulchschicht hilft bei Feuchtigkeitserhalt.",
        sunlightGuide: "Sonniger bis halbschattiger Standort.",
        fertilizingGuide: "Im Frühjahr und während der Fruchtbildung alle 3 Wochen düngen.",
        commonIssues: "Rutenkrankheit bei zu viel Nässe. Früchte werden klein bei Nährstoffmangel."
      }
    ];

    guides.forEach(guide => this.createCareGuide(guide));
  }

  async getPlants(): Promise<Plant[]> {
    return Array.from(this.plants.values());
  }

  async getPlant(id: number): Promise<Plant | undefined> {
    return this.plants.get(id);
  }

  async createPlant(insertPlant: InsertPlant): Promise<Plant> {
    const id = this.currentPlantId++;
    const plant: Plant = {
      ...insertPlant,
      id,
      lastWatered: new Date().toISOString(),
      lastFertilized: insertPlant.fertilizeFrequency ? new Date().toISOString() : null,
      notes: insertPlant.notes || null,
      fertilizeFrequency: insertPlant.fertilizeFrequency || null,
    };
    this.plants.set(id, plant);
    return plant;
  }

  async updatePlant(id: number, updates: Partial<Plant>): Promise<Plant | undefined> {
    const existing = this.plants.get(id);
    if (!existing) return undefined;

    const updated: Plant = { ...existing, ...updates };
    this.plants.set(id, updated);
    return updated;
  }

  async deletePlant(id: number): Promise<boolean> {
    return this.plants.delete(id);
  }

  async getCareGuide(species: string): Promise<PlantCareGuide | undefined> {
    return this.careGuides.get(species);
  }

  async getCareGuides(): Promise<PlantCareGuide[]> {
    return Array.from(this.careGuides.values());
  }

  async createCareGuide(guide: InsertPlantCareGuide): Promise<PlantCareGuide> {
    const id = this.currentGuideId++;
    const careGuide: PlantCareGuide = {
      ...guide,
      id,
      fertilizingGuide: guide.fertilizingGuide || null,
      commonIssues: guide.commonIssues || null,
    };
    this.careGuides.set(guide.species, careGuide);
    return careGuide;
  }
}

export const storage = new MemStorage();