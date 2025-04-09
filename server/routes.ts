import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPlayerSchema, insertPhotoSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Set up multer for file storage
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Create uploads directory if it doesn't exist
      const uploadPath = path.join(process.cwd(), "dist", "public", "uploads");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG and GIF are allowed."));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Player routes
  app.get("/api/players", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const players = category 
        ? await storage.getPlayersByCategory(category)
        : await storage.getPlayers();
      res.json(players);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch players" });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.getPlayerById(id);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json(player);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch player" });
    }
  });

  app.post("/api/players", upload.single("photo"), async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      console.log("Raw player form data:", req.body);

      const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const playerData = { ...req.body, photoUrl };
      
      // Convert string age to number
      if (playerData.age && typeof playerData.age === 'string') {
        playerData.age = parseInt(playerData.age, 10);
      }
      
      // Fix date formats if needed
      if (playerData.dateOfBirth) {
        try {
          // Ensure date is in YYYY-MM-DD format
          const date = new Date(playerData.dateOfBirth);
          playerData.dateOfBirth = date.toISOString().split('T')[0];
        } catch (e) {
          console.error("Error formatting dateOfBirth:", e);
        }
      }
      
      if (playerData.dateJoined) {
        try {
          // Ensure date is in YYYY-MM-DD format
          const date = new Date(playerData.dateJoined);
          playerData.dateJoined = date.toISOString().split('T')[0];
        } catch (e) {
          console.error("Error formatting dateJoined:", e);
        }
      }

      console.log("Processed player data before validation:", playerData);
      
      // Validate player data
      const validatedData = insertPlayerSchema.parse(playerData);
      console.log("Validated player data:", validatedData);
      
      const player = await storage.createPlayer(validatedData);
      res.status(201).json(player);
    } catch (err) {
      console.error("Player creation error:", err);
      if (err instanceof z.ZodError) {
        console.error("Zod validation errors:", JSON.stringify(err.errors, null, 2));
        return res.status(400).json({ message: "Invalid player data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create player", error: err instanceof Error ? err.message : String(err) });
    }
  });

  app.put("/api/players/:id", upload.single("photo"), async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      let playerData = { ...req.body };
      
      if (req.file) {
        playerData.photoUrl = `/uploads/${req.file.filename}`;
      }
      
      const updatedPlayer = await storage.updatePlayer(id, playerData);
      if (!updatedPlayer) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json(updatedPlayer);
    } catch (err) {
      res.status(500).json({ message: "Failed to update player" });
    }
  });

  app.delete("/api/players/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const success = await storage.deletePlayer(id);
      
      if (!success) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete player" });
    }
  });

  // Photo routes
  app.get("/api/photos", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const photos = category 
        ? await storage.getPhotosByCategory(category)
        : await storage.getPhotos();
      res.json(photos);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch photos" });
    }
  });

  app.get("/api/photos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const photo = await storage.getPhotoById(id);
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }
      res.json(photo);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch photo" });
    }
  });

  app.post("/api/photos", upload.single("image"), async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      console.log("Raw photo form data:", req.body);

      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      const photoData = { 
        ...req.body, 
        imageUrl,
        uploadedBy: req.user.id
      };
      
      // Ensure description is defined even if empty
      if (photoData.description === undefined) {
        photoData.description = "";
      }
      
      console.log("Processed photo data before validation:", photoData);
      
      // Validate photo data
      const validatedData = insertPhotoSchema.parse(photoData);
      console.log("Validated photo data:", validatedData);
      
      const photo = await storage.createPhoto(validatedData);
      res.status(201).json(photo);
    } catch (err) {
      console.error("Photo creation error:", err);
      if (err instanceof z.ZodError) {
        console.error("Zod validation errors:", JSON.stringify(err.errors, null, 2));
        return res.status(400).json({ message: "Invalid photo data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create photo", error: err instanceof Error ? err.message : String(err) });
    }
  });

  app.put("/api/photos/:id", upload.single("image"), async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      console.log("Raw photo update data:", req.body);

      const id = parseInt(req.params.id);
      let photoData = { ...req.body };
      
      if (req.file) {
        photoData.imageUrl = `/uploads/${req.file.filename}`;
      }
      
      // Ensure description is defined even if empty
      if (photoData.description === undefined) {
        photoData.description = "";
      }
      
      console.log("Processed photo data before update:", photoData);
      
      // Validate the update if we're updating required fields
      if (photoData.title || photoData.category) {
        try {
          // Get the existing photo to merge with updates
          const existingPhoto = await storage.getPhotoById(id);
          if (!existingPhoto) {
            return res.status(404).json({ message: "Photo not found" });
          }
          
          // Merge existing data with updates
          const completePhotoData = { ...existingPhoto, ...photoData };
          console.log("Complete photo data for validation:", completePhotoData);
          
          // Validate the complete data
          insertPhotoSchema.parse(completePhotoData);
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            console.error("Zod validation errors in update:", JSON.stringify(validationError.errors, null, 2));
            return res.status(400).json({ message: "Invalid photo data", errors: validationError.errors });
          }
          throw validationError;
        }
      }
      
      const updatedPhoto = await storage.updatePhoto(id, photoData);
      if (!updatedPhoto) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      res.json(updatedPhoto);
    } catch (err) {
      console.error("Photo update error:", err);
      res.status(500).json({ 
        message: "Failed to update photo", 
        error: err instanceof Error ? err.message : String(err) 
      });
    }
  });

  app.delete("/api/photos/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const success = await storage.deletePhoto(id);
      
      if (!success) {
        return res.status(404).json({ message: "Photo not found" });
      }
      
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });

  // Admin dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      if (!req.isAuthenticated() || !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const players = await storage.getPlayers();
      const photos = await storage.getPhotos();
      
      const totalPlayers = players.length;
      const registeredPlayers = players.filter(p => p.registrationStatus === "Registered").length;
      const pendingPlayers = players.filter(p => p.registrationStatus === "Pending").length;
      const totalPhotos = photos.length;
      
      res.json({
        totalPlayers,
        registeredPlayers,
        pendingPlayers,
        totalPhotos
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
