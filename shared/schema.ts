import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  real,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  age: varchar("age"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personality assessment results
export const personalityAssessments = pgTable("personality_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  openness: real("openness").notNull(),
  conscientiousness: real("conscientiousness").notNull(),
  extraversion: real("extraversion").notNull(),
  agreeableness: real("agreeableness").notNull(),
  neuroticism: real("neuroticism").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Journal entries
export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  mood: varchar("mood"),
  enjoyed: text("enjoyed"),
  challenges: text("challenges"),
  learned: text("learned"),
  keywords: jsonb("keywords").$type<string[]>(),
  themes: jsonb("themes").$type<string[]>(),
  skills: jsonb("skills").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Career database
export const careers = pgTable("careers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  growthRate: real("growth_rate"),
  educationLevel: varchar("education_level"),
  remoteWork: boolean("remote_work").default(false),
  skills: jsonb("skills").$type<string[]>(),
  interests: jsonb("interests").$type<string[]>(),
  personalityVector: jsonb("personality_vector").$type<{
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  }>(),
  roadmapYear1: text("roadmap_year1"),
  roadmapYear2: text("roadmap_year2"),
  roadmapYear3: text("roadmap_year3"),
  iconClass: varchar("icon_class"),
  colorScheme: varchar("color_scheme"),
});

// User career recommendations
export const careerRecommendations = pgTable("career_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  careerId: varchar("career_id").notNull().references(() => careers.id),
  matchScore: real("match_score").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Schema exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertPersonalityAssessment = typeof personalityAssessments.$inferInsert;
export type PersonalityAssessment = typeof personalityAssessments.$inferSelect;

export type InsertJournalEntry = typeof journalEntries.$inferInsert;
export type JournalEntry = typeof journalEntries.$inferSelect;

export type InsertCareer = typeof careers.$inferInsert;
export type Career = typeof careers.$inferSelect;

export type InsertCareerRecommendation = typeof careerRecommendations.$inferInsert;
export type CareerRecommendation = typeof careerRecommendations.$inferSelect;

// Insert schemas
export const insertPersonalityAssessmentSchema = createInsertSchema(personalityAssessments).omit({
  id: true,
  completedAt: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
  keywords: true,
  themes: true,
  skills: true,
});

export const insertCareerSchema = createInsertSchema(careers).omit({
  id: true,
});
