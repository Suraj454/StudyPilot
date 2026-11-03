import { z } from "zod";

export const CreateGoalSchema = z.object({
  subjectId: z.number().int().positive({ message: "Subject ID must be a positive integer" }),
  targetDate: z.string().refine((date) => !isNaN(Date.parse(date)) && new Date(date) > new Date(), {
    message: "Target date must be a valid date in the future",
  }),
  dailyStudyMinutes: z.number().int().positive({ message: "Daily study minutes must be greater than 0" }),
});

export type CreateGoalInput = z.infer<typeof CreateGoalSchema>;