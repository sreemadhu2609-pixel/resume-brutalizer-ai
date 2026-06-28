import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { createDevTask, getDevTasksByUserId, getDevTaskById, updateDevTask, deleteDevTask } from "./db";
import { invokeLLM } from "./_core/llm";

const taskStatusEnum = z.enum(["pending", "in_progress", "completed"]);

export const taskRouter = router({
  /**
   * Create a new development task and get AI predictions
   */
  createTask: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        techStackTags: z.array(z.string()).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Use LLM to predict complexity and suggest architecture
        const predictionPrompt = `You are an expert software architect specializing in AI-native applications.
        
        Given the following development task, provide:
        1. Estimated complexity level (Low/Medium/High)
        2. Estimated hours to complete
        3. Recommended architecture approach
        4. Recommended frameworks and tools
        
        Task: ${input.title}
        Description: ${input.description || "No description provided"}
        Tech Stack: ${input.techStackTags.join(", ")}
        
        Return ONLY a JSON object with this exact structure:
        {
          "complexityLevel": "Low|Medium|High",
          "estimatedHours": number,
          "architectureSuggestion": "string",
          "recommendedFrameworks": ["framework1", "framework2"]
        }`;

        const llmResponse = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "You are an expert software architect. Provide predictions in valid JSON format only.",
            },
            {
              role: "user",
              content: predictionPrompt,
            },
          ],
        });

        let prediction = {
          complexityLevel: "Medium",
          estimatedHours: 40,
          architectureSuggestion: "Microservices architecture with API gateway",
          recommendedFrameworks: ["Express.js", "React", "PostgreSQL"],
        };

        try {
          const content = llmResponse.choices[0]?.message.content;
          if (typeof content === "string") {
            prediction = JSON.parse(content);
          }
        } catch {
          // Use defaults if parsing fails
        }

        // Create task in database
        const taskData = {
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          techStackTags: JSON.stringify(input.techStackTags),
          predictedHours: prediction.estimatedHours,
          complexityLevel: prediction.complexityLevel,
          architectureSuggestion: prediction.architectureSuggestion,
          recommendedFrameworks: JSON.stringify(prediction.recommendedFrameworks),
          status: "pending" as const,
        };

        const result = await createDevTask(taskData);

        return {
          success: true,
          task: {
            ...taskData,
            techStackTags: input.techStackTags,
            recommendedFrameworks: prediction.recommendedFrameworks,
          },
        };
      } catch (error) {
        console.error("Task creation error:", error);
        throw new Error("Failed to create task");
      }
    }),

  /**
   * Get all tasks for the current user
   */
  getTasks: protectedProcedure.query(async ({ ctx }) => {
    try {
      const tasks = await getDevTasksByUserId(ctx.user.id);
      return tasks.map((task) => ({
        ...task,
        techStackTags: JSON.parse(task.techStackTags),
        recommendedFrameworks: task.recommendedFrameworks ? JSON.parse(task.recommendedFrameworks) : [],
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  }),

  /**
   * Get a specific task by ID
   */
  getTaskById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const task = await getDevTaskById(input.id);
        if (!task || task.userId !== ctx.user.id) {
          throw new Error("Task not found or unauthorized");
        }
        return {
          ...task,
          techStackTags: JSON.parse(task.techStackTags),
          recommendedFrameworks: task.recommendedFrameworks ? JSON.parse(task.recommendedFrameworks) : [],
        };
      } catch (error) {
        console.error("Error fetching task:", error);
        throw error;
      }
    }),

  /**
   * Update a task
   */
  updateTask: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: taskStatusEnum.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const task = await getDevTaskById(input.id);
        if (!task || task.userId !== ctx.user.id) {
          throw new Error("Task not found or unauthorized");
        }

        const updateData: Record<string, unknown> = {};
        if (input.title !== undefined) updateData.title = input.title;
        if (input.description !== undefined) updateData.description = input.description;
        if (input.status !== undefined) updateData.status = input.status;

        await updateDevTask(input.id, updateData);

        return { success: true };
      } catch (error) {
        console.error("Error updating task:", error);
        throw error;
      }
    }),

  /**
   * Delete a task
   */
  deleteTask: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const task = await getDevTaskById(input.id);
        if (!task || task.userId !== ctx.user.id) {
          throw new Error("Task not found or unauthorized");
        }

        await deleteDevTask(input.id);

        return { success: true };
      } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
      }
    }),
});
