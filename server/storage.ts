import {
  users,
  personalityAssessments,
  journalEntries,
  careers,
  careerRecommendations,
  type User,
  type UpsertUser,
  type InsertPersonalityAssessment,
  type PersonalityAssessment,
  type InsertJournalEntry,
  type JournalEntry,
  type Career,
  type InsertCareer,
  type CareerRecommendation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Personality assessment operations
  savePersonalityAssessment(assessment: InsertPersonalityAssessment): Promise<PersonalityAssessment>;
  getPersonalityAssessment(userId: string): Promise<PersonalityAssessment | undefined>;
  
  // Journal operations
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(userId: string, limit?: number): Promise<JournalEntry[]>;
  updateJournalEntryAnalysis(entryId: string, keywords: string[], themes: string[], skills: string[]): Promise<void>;
  
  // Career operations
  getAllCareers(): Promise<Career[]>;
  getCareerById(id: string): Promise<Career | undefined>;
  createCareer(career: InsertCareer): Promise<Career>;
  
  // Career recommendation operations
  saveCareerRecommendations(userId: string, recommendations: Array<{ careerId: string; matchScore: number }>): Promise<void>;
  getCareerRecommendations(userId: string): Promise<Array<CareerRecommendation & { career: Career }>>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async savePersonalityAssessment(assessment: InsertPersonalityAssessment): Promise<PersonalityAssessment> {
    // Delete existing assessment for user
    await db.delete(personalityAssessments).where(eq(personalityAssessments.userId, assessment.userId));
    
    const [result] = await db
      .insert(personalityAssessments)
      .values(assessment)
      .returning();
    return result;
  }

  async getPersonalityAssessment(userId: string): Promise<PersonalityAssessment | undefined> {
    const [assessment] = await db
      .select()
      .from(personalityAssessments)
      .where(eq(personalityAssessments.userId, userId));
    return assessment;
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [result] = await db
      .insert(journalEntries)
      .values(entry)
      .returning();
    return result;
  }

  async getJournalEntries(userId: string, limit = 10): Promise<JournalEntry[]> {
    return db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(limit);
  }

  async updateJournalEntryAnalysis(entryId: string, keywords: string[], themes: string[], skills: string[]): Promise<void> {
    await db
      .update(journalEntries)
      .set({ keywords, themes, skills })
      .where(eq(journalEntries.id, entryId));
  }

  async getAllCareers(): Promise<Career[]> {
    return db.select().from(careers);
  }

  async getCareerById(id: string): Promise<Career | undefined> {
    const [career] = await db.select().from(careers).where(eq(careers.id, id));
    return career;
  }

  async createCareer(career: InsertCareer): Promise<Career> {
    const [result] = await db
      .insert(careers)
      .values(career)
      .returning();
    return result;
  }

  async saveCareerRecommendations(userId: string, recommendations: Array<{ careerId: string; matchScore: number }>): Promise<void> {
    // Delete existing recommendations
    await db.delete(careerRecommendations).where(eq(careerRecommendations.userId, userId));
    
    // Insert new recommendations
    if (recommendations.length > 0) {
      await db.insert(careerRecommendations).values(
        recommendations.map(rec => ({
          userId,
          careerId: rec.careerId,
          matchScore: rec.matchScore,
        }))
      );
    }
  }

  async getCareerRecommendations(userId: string): Promise<Array<CareerRecommendation & { career: Career }>> {
    return db
      .select({
        id: careerRecommendations.id,
        userId: careerRecommendations.userId,
        careerId: careerRecommendations.careerId,
        matchScore: careerRecommendations.matchScore,
        generatedAt: careerRecommendations.generatedAt,
        career: careers,
      })
      .from(careerRecommendations)
      .innerJoin(careers, eq(careerRecommendations.careerId, careers.id))
      .where(eq(careerRecommendations.userId, userId))
      .orderBy(desc(careerRecommendations.matchScore));
  }
}

export const storage = new DatabaseStorage();
