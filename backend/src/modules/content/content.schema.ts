import { z } from "zod";

const SubtopicSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
});

export const TopicSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  prerequisites: z.array(z.number().int().positive()),
  subtopics: z.array(SubtopicSchema).min(1),
});

export type Topic = z.infer<typeof TopicSchema>;
