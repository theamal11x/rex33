import { 
  users, 
  categories, 
  contentEntries, 
  conversations, 
  messages,
  aiGuidelines,
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type ContentEntry,
  type InsertContentEntry,
  type ContentEntryWithCategory,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type AiGuideline,
  type InsertAiGuideline
} from "@shared/schema";

import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

// Define a type for session store
type SessionStore = session.Store;

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category management
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Content entries management
  getContentEntries(): Promise<ContentEntryWithCategory[]>;
  getContentEntriesByCategory(categoryId: number): Promise<ContentEntry[]>;
  getContentEntry(id: number): Promise<ContentEntry | undefined>;
  createContentEntry(entry: InsertContentEntry): Promise<ContentEntry>;
  updateContentEntry(id: number, entry: Partial<InsertContentEntry>): Promise<ContentEntry | undefined>;
  deleteContentEntry(id: number): Promise<boolean>;
  
  // Conversation management
  getConversations(): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationBySessionId(sessionId: string): Promise<Conversation | undefined>;
  
  // Message management
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // AI Guidelines management
  getAiGuidelines(): Promise<AiGuideline[]>;
  getActiveAiGuidelines(): Promise<AiGuideline[]>;
  getAiGuideline(id: number): Promise<AiGuideline | undefined>;
  createAiGuideline(guideline: InsertAiGuideline): Promise<AiGuideline>;
  updateAiGuideline(id: number, guideline: Partial<InsertAiGuideline>): Promise<AiGuideline | undefined>;
  deleteAiGuideline(id: number): Promise<boolean>;
  
  // Session store for authentication
  sessionStore: SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: SessionStore;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Category management
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }
  
  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    try {
      await db.delete(categories).where(eq(categories.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Content entries management
  async getContentEntries(): Promise<ContentEntryWithCategory[]> {
    return await db.query.contentEntries.findMany({
      with: {
        category: true,
      },
      orderBy: [desc(contentEntries.createdAt)],
    });
  }
  
  async getContentEntriesByCategory(categoryId: number): Promise<ContentEntry[]> {
    return await db
      .select()
      .from(contentEntries)
      .where(eq(contentEntries.categoryId, categoryId))
      .orderBy(desc(contentEntries.createdAt));
  }
  
  async getContentEntry(id: number): Promise<ContentEntry | undefined> {
    const [entry] = await db.select().from(contentEntries).where(eq(contentEntries.id, id));
    return entry;
  }
  
  async createContentEntry(insertEntry: InsertContentEntry): Promise<ContentEntry> {
    const [entry] = await db.insert(contentEntries).values(insertEntry).returning();
    return entry;
  }
  
  async updateContentEntry(id: number, updateData: Partial<InsertContentEntry>): Promise<ContentEntry | undefined> {
    const [updatedEntry] = await db
      .update(contentEntries)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(contentEntries.id, id))
      .returning();
    return updatedEntry;
  }
  
  async deleteContentEntry(id: number): Promise<boolean> {
    try {
      await db.delete(contentEntries).where(eq(contentEntries.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Conversation management
  async getConversations(): Promise<Conversation[]> {
    return await db.select().from(conversations);
  }
  
  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values(insertConversation).returning();
    return conversation;
  }
  
  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }
  
  async getConversationBySessionId(sessionId: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.sessionId, sessionId));
    return conversation;
  }
  
  // Message management
  async getMessages(conversationId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt));
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }
  
  // AI Guidelines management
  async getAiGuidelines(): Promise<AiGuideline[]> {
    const result = await db
      .select()
      .from(aiGuidelines);
    
    // Sort in memory since the orderBy has issues
    return result.sort((a, b) => {
      // First by priority (descending)
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      // Then by title (ascending)
      return a.title.localeCompare(b.title);
    });
  }
  
  async getActiveAiGuidelines(): Promise<AiGuideline[]> {
    const result = await db
      .select()
      .from(aiGuidelines)
      .where(eq(aiGuidelines.isActive, true));
    
    // Sort in memory since the orderBy has issues
    return result.sort((a, b) => {
      // First by priority (descending)
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      // Then by title (ascending)
      return a.title.localeCompare(b.title);
    });
  }
  
  async getAiGuideline(id: number): Promise<AiGuideline | undefined> {
    const [guideline] = await db.select().from(aiGuidelines).where(eq(aiGuidelines.id, id));
    return guideline;
  }
  
  async createAiGuideline(insertGuideline: InsertAiGuideline): Promise<AiGuideline> {
    const [guideline] = await db.insert(aiGuidelines).values(insertGuideline).returning();
    return guideline;
  }
  
  async updateAiGuideline(id: number, updateData: Partial<InsertAiGuideline>): Promise<AiGuideline | undefined> {
    const [updatedGuideline] = await db
      .update(aiGuidelines)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(aiGuidelines.id, id))
      .returning();
    return updatedGuideline;
  }
  
  async deleteAiGuideline(id: number): Promise<boolean> {
    try {
      await db.delete(aiGuidelines).where(eq(aiGuidelines.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
