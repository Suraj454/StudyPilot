import {z} from "zod";

export const StartDiagnosticSchemma = z.object({
    goalId: z.number().int().positive(),
})

export const SubmitDiagnosticSchema = z.object({
    answers : z.array(
        z.object({
            questionId: z.number().int().positive(),
            selectedOptionId: z.number().int().positive(),
        })
    ).min(1),
});

export type StartDiagnosticInput = z.infer<typeof StartDiagnosticSchemma>;
export type SubmitDiagnosticInput = z.infer<typeof SubmitDiagnosticSchema>;