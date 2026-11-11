import { z } from "zod";

const SubtopicSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
});

// Validate each question option.
const OptionSchema = z.object({
  id: z.number().int().positive(),
  text: z.string().min(1),
});

// Validate question data.
const QuestionSchema = z.object({
  id: z.number().int().positive().optional(),
  questionText: z.string().min(1),
  options: z.array(OptionSchema).min(2),
  correctOptionId: z.number().int().positive(),
  explanation: z.string().optional(),
  type: z.string().optional(),
}).refine(
  (question) =>
    question.options.some(
      (option) => option.id === question.correctOptionId
    ),
  {
    message: "Correct option ID must exist in the options array",
    path: ["correctOptionId"],
  }
);

// Validate topic data.
export const TopicSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  prerequisites: z.array(z.number().int().positive()),
  subtopics: z.array(SubtopicSchema).min(1),
  questions: z.array(QuestionSchema).optional(),
});

export type Topic = z.infer<typeof TopicSchema>;