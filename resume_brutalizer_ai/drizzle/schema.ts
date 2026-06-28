import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Resume Audits Table
export const resumeAudits = mysqlTable("resume_audits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  resumeFileName: varchar("resumeFileName", { length: 255 }).notNull(),
  resumeStorageKey: varchar("resumeStorageKey", { length: 512 }).notNull(),
  overallScore: int("overallScore").notNull(), // 0-100
  skillMatchData: text("skillMatchData").notNull(), // JSON: { skill: string, percentage: number }[]
  improvementSuggestions: text("improvementSuggestions").notNull(), // JSON array of suggestions
  skillLearningRoadmap: text("skillLearningRoadmap"), // JSON: { skill, days, resources, difficulty }[]
  resumeRewriteSuggestions: text("resumeRewriteSuggestions"), // JSON: { section, before, after, reasoning }[]
  skillMasteryTimeline: text("skillMasteryTimeline"), // JSON: { skill, currentLevel, targetLevel, daysToMastery, prerequisites }[]
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ResumeAudit = typeof resumeAudits.$inferSelect;
export type InsertResumeAudit = typeof resumeAudits.$inferInsert;

// Development Tasks Table
export const devTasks = mysqlTable("dev_tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  techStackTags: varchar("techStackTags", { length: 512 }).notNull(), // JSON array: ["Java", "React", "GenAI"]
  predictedHours: int("predictedHours"),
  complexityLevel: varchar("complexityLevel", { length: 50 }), // "Low", "Medium", "High"
  architectureSuggestion: text("architectureSuggestion"),
  recommendedFrameworks: text("recommendedFrameworks"), // JSON array
  status: mysqlEnum("status", ["pending", "in_progress", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DevTask = typeof devTasks.$inferSelect;
export type InsertDevTask = typeof devTasks.$inferInsert;