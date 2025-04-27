import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Admin users for the system
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Content categories/chapters
export const categoryEnum = pgEnum('category_type', [
  'early_reflections',
  'professional_journey',
  'personal_growth',
  'relationship_reflections',
  'philosophy',
  'creative',
  'other'
]);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: categoryEnum("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  type: true,
});

// Content entries
export const contentStatusEnum = pgEnum('content_status', [
  'draft',
  'published',
  'archived'
]);

export const contentEntries = pgTable("content_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: contentStatusEnum("status").default('draft').notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContentEntrySchema = createInsertSchema(contentEntries).pick({
  title: true,
  content: true,
  status: true,
  categoryId: true,
});

// Conversation history
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  sessionId: true,
});

// Individual messages in conversations
export const messageRoleEnum = pgEnum('message_role', [
  'user',
  'assistant'
]);

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  content: text("content").notNull(),
  role: messageRoleEnum("role").notNull(),
  emotionalTone: text("emotional_tone"),
  intent: text("intent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  content: true,
  role: true,
  emotionalTone: true,
  intent: true,
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  contentEntries: many(contentEntries),
}));

export const contentEntriesRelations = relations(contentEntries, ({ one }) => ({
  category: one(categories, {
    fields: [contentEntries.categoryId],
    references: [categories.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ many, one }) => ({
  messages: many(messages),
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertContentEntry = z.infer<typeof insertContentEntrySchema>;
export type ContentEntry = typeof contentEntries.$inferSelect;
export type ContentEntryWithCategory = ContentEntry & { category: Category };

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
