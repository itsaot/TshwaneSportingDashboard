import session from "express-session";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";
import { users, User, InsertUser, players, Player, InsertPlayer, photos, Photo, InsertPhoto } from "@shared/schema";
import { db } from "./db";
import createMemoryStore from "memorystore";

// Create memory store for sessions
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player operations
  getPlayers(): Promise<Player[]>;
  getPlayerById(id: number): Promise<Player | undefined>;
  getPlayersByCategory(category: string): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: number, player: Partial<InsertPlayer>): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<boolean>;
  
  // Photo operations
  getPhotos(): Promise<Photo[]>;
  getPhotoById(id: number): Promise<Photo | undefined>;
  getPhotosByCategory(category: string): Promise<Photo[]>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  updatePhoto(id: number, photo: Partial<InsertPhoto>): Promise<Photo | undefined>;
  deletePhoto(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with admin user if none exists
    this.initAdminUser();
  }

  private async initAdminUser() {
    try {
      const existingAdmin = await this.getUserByUsername("sporting@tshwane.co.za");
      if (!existingAdmin) {
        await this.createUser({
          username: "sporting@tshwane.co.za",
          password: "0c6348d8578112604c02b6d2406986fab42e8ddc1e16ee9f0c0d76bbbad62f334b95eb679c4de5048e887ace2364582ca739f5e7203b308c8a2792d96958a19a.221395311cb524ab8600d38350c505d4", // hashed "Sporting@2020"
          fullName: "Tshwane Sporting Admin",
          isAdmin: true
        });
        console.log("Admin user created successfully");
      }
    } catch (err) {
      console.error("Error initializing admin user:", err);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Player operations
  async getPlayers(): Promise<Player[]> {
    return await db.select().from(players);
  }

  async getPlayerById(id: number): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player;
  }

  async getPlayersByCategory(category: string): Promise<Player[]> {
    return await db.select().from(players).where(eq(players.teamCategory, category));
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const [player] = await db.insert(players).values(insertPlayer).returning();
    return player;
  }

  async updatePlayer(id: number, updateData: Partial<InsertPlayer>): Promise<Player | undefined> {
    const [updatedPlayer] = await db
      .update(players)
      .set(updateData)
      .where(eq(players.id, id))
      .returning();
    return updatedPlayer;
  }

  async deletePlayer(id: number): Promise<boolean> {
    const result = await db.delete(players).where(eq(players.id, id));
    return !!result;
  }

  // Photo operations
  async getPhotos(): Promise<Photo[]> {
    return await db.select().from(photos);
  }

  async getPhotoById(id: number): Promise<Photo | undefined> {
    const [photo] = await db.select().from(photos).where(eq(photos.id, id));
    return photo;
  }

  async getPhotosByCategory(category: string): Promise<Photo[]> {
    return await db.select().from(photos).where(eq(photos.category, category));
  }

  async createPhoto(insertPhoto: InsertPhoto): Promise<Photo> {
    const [photo] = await db.insert(photos).values(insertPhoto).returning();
    return photo;
  }

  async updatePhoto(id: number, updateData: Partial<InsertPhoto>): Promise<Photo | undefined> {
    const [updatedPhoto] = await db
      .update(photos)
      .set(updateData)
      .where(eq(photos.id, id))
      .returning();
    return updatedPhoto;
  }

  async deletePhoto(id: number): Promise<boolean> {
    const result = await db.delete(photos).where(eq(photos.id, id));
    return !!result;
  }
}

export const storage = new DatabaseStorage();