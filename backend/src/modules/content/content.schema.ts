import { z } from "zod";

const SubtopicSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
});

const QuestionSchema = z.object({
  id: z.number().int().positive().optional(),
  questionText: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctAnswer: z.string().min(1),
  explanation: z.string().optional(),
  type: z.string().optional(), // e.g., DIAGNOSTIC or QUIZ
});

export const TopicSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  prerequisites: z.array(z.number().int().positive()),
  subtopics: z.array(SubtopicSchema).min(1),
  questions: z.array(QuestionSchema).optional(), //  Added questions array support
});

export type Topic = z.infer<typeof TopicSchema>;