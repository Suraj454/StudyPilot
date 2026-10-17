import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;