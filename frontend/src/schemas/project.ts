import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(255, "Máximo 255 caracteres"),
  description: z
    .string()
    .max(2000, "Máximo 2000 caracteres")
    .optional()
    .or(z.literal("")),
});

export type ProjectForm = z.infer<typeof projectSchema>;
