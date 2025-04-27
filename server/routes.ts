import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { nanoid } from "nanoid";
import { contentStatusEnum, categoryEnum, insertCategorySchema, insertContentEntrySchema } from "@shared/schema";

async function getOrCreateConversation(sessionId: string) {
  let conversation = await storage.getConversationBySessionId(sessionId);
  
  if (!conversation) {
    conversation = await storage.createConversation({
      sessionId,
      userId: null
    });
  }
  
  return conversation;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Admin check middleware
  const requireAdmin = (req: Request, res: Response, next: () => void) => {
    if (!req.isAuthenticated() || !req.user?.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  };
  
  // API endpoints
  
  // Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });
  
  app.post('/api/categories', requireAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid category data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create category' });
    }
  });
  
  app.put('/api/categories/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid category data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update category' });
    }
  });
  
  app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Category not found or could not be deleted' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete category' });
    }
  });
  
  // Content entries
  app.get('/api/content', async (req, res) => {
    try {
      const entries = await storage.getContentEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch content entries' });
    }
  });
  
  app.get('/api/content/category/:categoryId', async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const entries = await storage.getContentEntriesByCategory(categoryId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch content entries' });
    }
  });
  
  app.get('/api/content/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entry = await storage.getContentEntry(id);
      
      if (!entry) {
        return res.status(404).json({ message: 'Content entry not found' });
      }
      
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch content entry' });
    }
  });
  
  app.post('/api/content', requireAdmin, async (req, res) => {
    try {
      const validatedData = insertContentEntrySchema.parse(req.body);
      const entry = await storage.createContentEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid content entry data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create content entry' });
    }
  });
  
  app.put('/api/content/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertContentEntrySchema.partial().parse(req.body);
      const entry = await storage.updateContentEntry(id, validatedData);
      
      if (!entry) {
        return res.status(404).json({ message: 'Content entry not found' });
      }
      
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid content entry data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update content entry' });
    }
  });
  
  app.delete('/api/content/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContentEntry(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Content entry not found or could not be deleted' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete content entry' });
    }
  });
  
  // Conversation and messages
  app.post('/api/conversation/message', async (req, res) => {
    try {
      const { message, sessionId = nanoid() } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: 'Message is required' });
      }
      
      // Get or create conversation
      const conversation = await getOrCreateConversation(sessionId);
      
      // Save user message
      await storage.createMessage({
        conversationId: conversation.id,
        content: message,
        role: 'user',
        emotionalTone: null,
        intent: null
      });
      
      // This would be where we call the Gemini API for response and emotional analysis
      // For now, we'll just create a placeholder response
      const response = {
        content: "Thank you for your message. This is a placeholder response that would normally come from the Gemini API with emotional intelligence.",
        emotionalTone: "neutral",
        intent: "responding"
      };
      
      // Save assistant response
      const savedResponse = await storage.createMessage({
        conversationId: conversation.id,
        content: response.content,
        role: 'assistant',
        emotionalTone: response.emotionalTone,
        intent: response.intent
      });
      
      res.json({
        message: savedResponse,
        sessionId,
        conversationId: conversation.id
      });
    } catch (error) {
      console.error('Error processing message:', error);
      res.status(500).json({ message: 'Failed to process message' });
    }
  });
  
  app.get('/api/conversation/:sessionId/messages', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const conversation = await storage.getConversationBySessionId(sessionId);
      
      if (!conversation) {
        return res.json([]);
      }
      
      const messages = await storage.getMessages(conversation.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
