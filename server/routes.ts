import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPersonalityAssessmentSchema, insertJournalEntrySchema } from "@shared/schema";
import { analyzeJournalEntry } from "./services/nlp";
import { generateCareerRecommendations, initializeCareers } from "./services/careers.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  // await setupAuth(app); // Temporarily disabled for demo

  // Initialize careers database
  await initializeCareers();

  // Demo user for testing
  const demoUser = {
    id: "demo-user",
    email: "demo@niyati.app",
    firstName: "Demo",
    lastName: "User",
    profileImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Ensure demo user exists
  try {
    await storage.upsertUser(demoUser);
  } catch (error) {
    console.log("Demo user already exists");
  }

  // Auth routes (demo mode)
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      res.json(demoUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Personality Assessment routes
  app.post('/api/personality-assessment', async (req: any, res) => {
    try {
      const userId = "demo-user";
      const assessmentData = insertPersonalityAssessmentSchema.parse({
        ...req.body,
        userId,
      });

      const assessment = await storage.savePersonalityAssessment(assessmentData);
      
      // Generate career recommendations after assessment
      await generateCareerRecommendations(userId);
      
      res.json(assessment);
    } catch (error) {
      console.error("Error saving personality assessment:", error);
      res.status(400).json({ message: "Failed to save assessment" });
    }
  });

  app.get('/api/personality-assessment', async (req: any, res) => {
    try {
      const userId = "demo-user";
      const assessment = await storage.getPersonalityAssessment(userId);
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching personality assessment:", error);
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  // Journal routes
  app.post('/api/journal-entries', async (req: any, res) => {
    try {
      const userId = "demo-user";
      const entryData = insertJournalEntrySchema.parse({
        ...req.body,
        userId,
      });

      const entry = await storage.createJournalEntry(entryData);
      
      // Analyze entry asynchronously
      analyzeJournalEntry(entry).catch(console.error);
      
      // Regenerate career recommendations
      generateCareerRecommendations(userId).catch(console.error);
      
      res.json(entry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(400).json({ message: "Failed to create journal entry" });
    }
  });

  app.get('/api/journal-entries', async (req: any, res) => {
    try {
      const userId = "demo-user";
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const entries = await storage.getJournalEntries(userId, limit);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  // Career routes
  app.get('/api/careers', async (req: any, res) => {
    try {
      const careers = await storage.getAllCareers();
      res.json(careers);
    } catch (error) {
      console.error("Error fetching careers:", error);
      res.status(500).json({ message: "Failed to fetch careers" });
    }
  });

  app.get('/api/career-recommendations', async (req: any, res) => {
    try {
      const userId = "demo-user";
      const recommendations = await storage.getCareerRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching career recommendations:", error);
      res.status(500).json({ message: "Failed to fetch career recommendations" });
    }
  });

  app.get('/api/careers/:id', async (req: any, res) => {
    try {
      const career = await storage.getCareerById(req.params.id);
      if (!career) {
        return res.status(404).json({ message: "Career not found" });
      }
      res.json(career);
    } catch (error) {
      console.error("Error fetching career:", error);
      res.status(500).json({ message: "Failed to fetch career" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard', async (req: any, res) => {
    try {
      const userId = "demo-user";
      
      const [assessment, journalEntries, recommendations] = await Promise.all([
        storage.getPersonalityAssessment(userId),
        storage.getJournalEntries(userId, 50),
        storage.getCareerRecommendations(userId),
      ]);

      const stats = {
        assessmentComplete: !!assessment,
        journalEntryCount: journalEntries.length,
        journalStreak: calculateStreak(journalEntries),
        topRecommendations: recommendations.slice(0, 3),
        overallProgress: calculateOverallProgress(!!assessment, journalEntries.length),
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function calculateStreak(entries: any[]): number {
  if (entries.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  const sortedEntries = entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = new Date(sortedEntries[i].createdAt);
    const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === i) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateOverallProgress(hasAssessment: boolean, journalCount: number): number {
  let progress = 0;
  
  if (hasAssessment) progress += 40;
  if (journalCount > 0) progress += 20;
  if (journalCount >= 5) progress += 20;
  if (journalCount >= 10) progress += 20;
  
  return Math.min(progress, 100);
}
