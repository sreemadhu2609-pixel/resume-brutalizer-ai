import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { createResumeAudit, getResumeAuditsByUserId, getResumeAuditById } from "./db";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import { calculateSkillMatch, calculateOverallScore, aiSkillBenchmarks, improvementSuggestions } from "./aiJdData";

export const resumeRouter = router({
  /**
   * Upload and analyze a resume
   * Expects base64-encoded PDF content
   */
  analyzeResume: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileContent: z.string(), // base64 encoded PDF
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Store the resume file
        const fileBuffer = Buffer.from(input.fileContent, "base64");
        const storageKey = `resumes/${ctx.user.id}/${Date.now()}-${input.fileName}`;
        const { url: storageUrl } = await storagePut(storageKey, fileBuffer, "application/pdf");

        // Use LLM to extract skills from resume
        const extractionPrompt = `You are an expert resume analyzer. Extract ALL technical skills mentioned in this resume.
        
        Return ONLY a JSON array of skills, like: ["Python", "React", "Machine Learning", "AWS", "Docker"]
        
        Focus on:
        - Programming languages
        - Frameworks and libraries
        - Tools and platforms
        - Methodologies
        - Cloud services
        
        Be comprehensive and include every technical skill mentioned.`;

        const llmResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content: extractionPrompt,
            },
            {
              role: "user",
              content: `Please extract skills from this resume. File URL: ${storageUrl}`,
            },
          ],
        });

        let extractedSkills: string[] = [];
        try {
          const content = llmResponse.choices[0]?.message.content;
          if (typeof content === "string") {
            extractedSkills = JSON.parse(content);
          }
        } catch {
          extractedSkills = [];
        }

        // Calculate skill match against 2026 Indian AI JD data
        const matchedSkills = calculateSkillMatch(extractedSkills);
        const overallScore = calculateOverallScore(matchedSkills);

        // Generate improvement suggestions
        const matchedSkillNames = matchedSkills.filter((s) => s.matched).map((s) => s.skill);
        const missingTopSkills = aiSkillBenchmarks
          .slice(0, 10)
          .filter((s) => !matchedSkillNames.includes(s.skill));

        const suggestions = [
          ...improvementSuggestions.high_priority.filter((s) =>
            missingTopSkills.some((skill) => s.includes(skill.skill.split("/")[0]))
          ),
          ...improvementSuggestions.medium_priority.slice(0, 2),
        ];

        // Generate Skill Learning Roadmap
        const roadmapPrompt = `Based on these missing skills: ${missingTopSkills.map((s) => s.skill).join(", ")}
        
        Generate a JSON array with a 30-day learning roadmap for each skill. Include:
        - skill: skill name
        - days: how many days to learn (1-30)
        - resources: 2-3 specific resources (courses, tutorials, docs)
        - difficulty: "Easy", "Medium", or "Hard"
        
        Return ONLY valid JSON array.`;

        const roadmapResponse = await invokeLLM({
          messages: [
            { role: "system", content: "You are a learning pathway expert. Generate JSON only." },
            { role: "user", content: roadmapPrompt },
          ],
        });

        let skillLearningRoadmap: unknown[] = [];
        try {
          const roadmapContent = roadmapResponse.choices[0]?.message.content;
          if (typeof roadmapContent === "string") {
            skillLearningRoadmap = JSON.parse(roadmapContent);
          }
        } catch {
          skillLearningRoadmap = [];
        }

        // Generate Resume Rewrite Suggestions
        const rewritePrompt = `Given these skills to highlight: ${matchedSkillNames.join(", ")}
        
        Generate JSON array with resume rewrite suggestions. For each suggestion include:
        - section: "Skills", "Experience", "Projects", etc.
        - before: current text example
        - after: improved text example
        - reasoning: why this change matters
        
        Return ONLY valid JSON array with 3-5 suggestions.`;

        const rewriteResponse = await invokeLLM({
          messages: [
            { role: "system", content: "You are a resume expert. Generate JSON only." },
            { role: "user", content: rewritePrompt },
          ],
        });

        let resumeRewriteSuggestions: unknown[] = [];
        try {
          const rewriteContent = rewriteResponse.choices[0]?.message.content;
          if (typeof rewriteContent === "string") {
            resumeRewriteSuggestions = JSON.parse(rewriteContent);
          }
        } catch {
          resumeRewriteSuggestions = [];
        }

        // Generate Skill Mastery Timeline
        const timelinePrompt = `For these skills: ${matchedSkillNames.join(", ")}
        
        Generate a JSON array showing mastery progression. For each skill include:
        - skill: skill name
        - currentLevel: "Beginner", "Intermediate", or "Advanced"
        - targetLevel: "Expert" or "Advanced"
        - daysToMastery: estimated days (30-180)
        - prerequisites: array of skills needed first
        
        Return ONLY valid JSON array.`;

        const timelineResponse = await invokeLLM({
          messages: [
            { role: "system", content: "You are a skill development expert. Generate JSON only." },
            { role: "user", content: timelinePrompt },
          ],
        });

        let skillMasteryTimeline: unknown[] = [];
        try {
          const timelineContent = timelineResponse.choices[0]?.message.content;
          if (typeof timelineContent === "string") {
            skillMasteryTimeline = JSON.parse(timelineContent);
          }
        } catch {
          skillMasteryTimeline = [];
        }

        // Save audit to database
        const auditData = {
          userId: ctx.user.id,
          resumeFileName: input.fileName,
          resumeStorageKey: storageKey,
          overallScore,
          skillMatchData: JSON.stringify(
            matchedSkills.map((s) => ({
              skill: s.skill,
              percentage: s.percentage,
              matched: s.matched,
            }))
          ),
          improvementSuggestions: JSON.stringify(suggestions),
          skillLearningRoadmap: JSON.stringify(skillLearningRoadmap),
          resumeRewriteSuggestions: JSON.stringify(resumeRewriteSuggestions),
          skillMasteryTimeline: JSON.stringify(skillMasteryTimeline),
        };

        await createResumeAudit(auditData);

        return {
          success: true,
          overallScore,
          skillMatches: matchedSkills.map((s) => ({
            skill: s.skill,
            percentage: s.percentage,
            matched: s.matched,
          })),
          suggestions,
          skillLearningRoadmap,
          resumeRewriteSuggestions,
          skillMasteryTimeline,
          storageUrl,
        };
      } catch (error) {
        console.error("Resume analysis error:", error);
        throw new Error("Failed to analyze resume");
      }
    }),

  /**
   * Get all resume audits for the current user
   */
  getAudits: protectedProcedure.query(async ({ ctx }) => {
    try {
      const audits = await getResumeAuditsByUserId(ctx.user.id);
      return audits.map((audit) => ({
        ...audit,
        skillMatchData: JSON.parse(audit.skillMatchData),
        improvementSuggestions: JSON.parse(audit.improvementSuggestions),
        skillLearningRoadmap: audit.skillLearningRoadmap ? JSON.parse(audit.skillLearningRoadmap) : [],
        resumeRewriteSuggestions: audit.resumeRewriteSuggestions ? JSON.parse(audit.resumeRewriteSuggestions) : [],
        skillMasteryTimeline: audit.skillMasteryTimeline ? JSON.parse(audit.skillMasteryTimeline) : [],
      }));
    } catch (error) {
      console.error("Error fetching audits:", error);
      return [];
    }
  }),

  /**
   * Get a specific resume audit by ID
   */
  getAuditById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const audit = await getResumeAuditById(input.id);
        if (!audit || audit.userId !== ctx.user.id) {
          throw new Error("Audit not found or unauthorized");
        }
        return {
          ...audit,
          skillMatchData: JSON.parse(audit.skillMatchData),
          improvementSuggestions: JSON.parse(audit.improvementSuggestions),
          skillLearningRoadmap: audit.skillLearningRoadmap ? JSON.parse(audit.skillLearningRoadmap) : [],
          resumeRewriteSuggestions: audit.resumeRewriteSuggestions ? JSON.parse(audit.resumeRewriteSuggestions) : [],
          skillMasteryTimeline: audit.skillMasteryTimeline ? JSON.parse(audit.skillMasteryTimeline) : [],
        };
      } catch (error) {
        console.error("Error fetching audit:", error);
        throw error;
      }
    }),
});
