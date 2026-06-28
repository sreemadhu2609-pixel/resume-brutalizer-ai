import { describe, it, expect } from "vitest";
import { calculateSkillMatch, calculateOverallScore, aiSkillBenchmarks } from "./aiJdData";

describe("AI JD Data Analysis", () => {
  describe("calculateSkillMatch", () => {
    it("should match skills case-insensitively", () => {
      const resumeSkills = ["python", "REACT", "Docker"];
      const matches = calculateSkillMatch(resumeSkills);

      expect(matches.some((m) => m.skill === "Python" && m.matched)).toBe(true);
      expect(matches.some((m) => m.skill === "React / Frontend" && m.matched)).toBe(true);
      expect(matches.some((m) => m.skill === "Docker" && m.matched)).toBe(true);
    });

    it("should identify missing skills", () => {
      const resumeSkills = ["Python"];
      const matches = calculateSkillMatch(resumeSkills);

      expect(matches.some((m) => m.skill === "RAG / Retrieval Augmented Generation" && !m.matched)).toBe(true);
      expect(matches.some((m) => m.skill === "LangChain" && !m.matched)).toBe(true);
    });

    it("should return all benchmark skills", () => {
      const resumeSkills = [];
      const matches = calculateSkillMatch(resumeSkills);

      expect(matches.length).toBe(aiSkillBenchmarks.length);
    });

    it("should sort by percentage descending", () => {
      const resumeSkills = ["Python"];
      const matches = calculateSkillMatch(resumeSkills);

      for (let i = 0; i < matches.length - 1; i++) {
        expect(matches[i].percentage).toBeGreaterThanOrEqual(matches[i + 1].percentage);
      }
    });
  });

  describe("calculateOverallScore", () => {
    it("should give high score when top skills are matched", () => {
      const topSkillsMatched = aiSkillBenchmarks.slice(0, 10).map((s) => ({
        ...s,
        matched: true,
      }));

      const score = calculateOverallScore(topSkillsMatched);
      expect(score).toBeGreaterThan(60);
    });

    it("should give low score when no skills are matched", () => {
      const noSkillsMatched = aiSkillBenchmarks.map((s) => ({
        ...s,
        matched: false,
      }));

      const score = calculateOverallScore(noSkillsMatched);
      expect(score).toBe(0);
    });

    it("should return score between 0 and 100", () => {
      const mixedSkills = aiSkillBenchmarks.map((s, idx) => ({
        ...s,
        matched: idx % 2 === 0,
      }));

      const score = calculateOverallScore(mixedSkills);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("should weight top 10 skills at 70%", () => {
      // All top 10 matched = 70 points
      const topMatched = aiSkillBenchmarks.slice(0, 10).map((s) => ({
        ...s,
        matched: true,
      }));
      const topOnlyScore = calculateOverallScore(topMatched);

      // All other skills matched = 30 points
      const otherMatched = aiSkillBenchmarks.map((s, idx) => ({
        ...s,
        matched: idx >= 10,
      }));
      const otherOnlyScore = calculateOverallScore(otherMatched);

      expect(topOnlyScore).toBeGreaterThan(otherOnlyScore);
    });
  });
});
