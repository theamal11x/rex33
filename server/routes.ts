import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { nanoid } from "nanoid";
import { 
  contentStatusEnum, 
  categoryEnum, 
  insertCategorySchema, 
  insertContentEntrySchema,
  insertAiGuidelineSchema
} from "@shared/schema";

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
    console.log("Admin check - Auth status:", req.isAuthenticated());
    console.log("Admin check - User:", req.user);
    
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!req.user?.isAdmin) {
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
      const userMessage = await storage.createMessage({
        conversationId: conversation.id,
        content: message,
        role: 'user',
        emotionalTone: null,
        intent: null
      });
      
      // Get previous conversation context for better responses
      const existingMessages = await storage.getMessages(conversation.id);
      let conversationContext = '';
      
      // Build context from last 5 messages (if available)
      if (existingMessages.length > 0) {
        const recentMessages = existingMessages.slice(-Math.min(5, existingMessages.length));
        conversationContext = recentMessages.map(msg => 
          `${msg.role === 'user' ? 'User' : 'Rex'}: ${msg.content}`
        ).join('\n');
      }
      
      // Fetch relevant content entries to provide as context to Gemini
      const contentEntries = await storage.getContentEntries();
      let mohsinContent = '';
      
      // Extract content from the database to create Mohsin's knowledge base
      if (contentEntries.length > 0) {
        // Limit to 5 most relevant entries to avoid making the prompt too large
        const relevantEntries = contentEntries.slice(0, 5);
        mohsinContent = relevantEntries.map(entry => 
          `TOPIC: ${entry.title}\n${entry.content}`
        ).join('\n\n');
      }
      
      // Import the Gemini integration
      const { analyzeMessageWithGemini } = await import('./gemini');
      
      // Call Gemini API for response and emotional analysis with both conversation history and Mohsin's content
      const geminiResponse = await analyzeMessageWithGemini(message, conversationContext, mohsinContent);
      
      // Save assistant response
      const savedResponse = await storage.createMessage({
        conversationId: conversation.id,
        content: geminiResponse.response,
        role: 'assistant',
        emotionalTone: geminiResponse.emotionalTone,
        intent: geminiResponse.intent
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
  
  // New endpoint to get emotional journey data
  app.get('/api/conversation/:sessionId/emotional-journey', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const conversation = await storage.getConversationBySessionId(sessionId);
      
      if (!conversation) {
        return res.json([]);
      }
      
      const messages = await storage.getMessages(conversation.id);
      
      // Filter messages that have emotional tone data (usually assistant messages)
      const emotionalData = messages
        .filter(msg => msg.emotionalTone) // Only include messages with emotional tone
        .map(msg => ({
          timestamp: msg.createdAt,
          emotion: msg.emotionalTone,
          role: msg.role,
          id: msg.id
        }));
      
      res.json(emotionalData);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch emotional journey data' });
    }
  });
  
  // AI Guidelines Routes
  app.get('/api/ai-guidelines', requireAdmin, async (req, res) => {
    try {
      const guidelines = await storage.getAiGuidelines();
      res.json(guidelines);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch AI guidelines' });
    }
  });
  
  app.get('/api/ai-guidelines/active', async (req, res) => {
    try {
      const guidelines = await storage.getActiveAiGuidelines();
      res.json(guidelines);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch active AI guidelines' });
    }
  });
  
  app.get('/api/ai-guidelines/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const guideline = await storage.getAiGuideline(Number(id));
      
      if (!guideline) {
        return res.status(404).json({ message: 'AI guideline not found' });
      }
      
      res.json(guideline);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch AI guideline' });
    }
  });
  
  app.post('/api/ai-guidelines', requireAdmin, async (req, res) => {
    try {
      const guidelineData = insertAiGuidelineSchema.parse(req.body);
      const guideline = await storage.createAiGuideline(guidelineData);
      res.status(201).json(guideline);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid guideline data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create AI guideline' });
    }
  });
  
  app.put('/api/ai-guidelines/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertAiGuidelineSchema.partial().parse(req.body);
      const guideline = await storage.updateAiGuideline(Number(id), validatedData);
      
      if (!guideline) {
        return res.status(404).json({ message: 'AI guideline not found' });
      }
      
      res.json(guideline);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid guideline data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update AI guideline' });
    }
  });
  
  app.delete('/api/ai-guidelines/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteAiGuideline(Number(id));
      
      if (!success) {
        return res.status(404).json({ message: 'AI guideline not found or could not be deleted' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete AI guideline' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
