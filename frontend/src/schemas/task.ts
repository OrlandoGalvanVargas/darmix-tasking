import { z } from "zod";
import { TASK_PRIORITY, TASK_STATUS } from "@/constants/task";

const statusValues = Object.keys(TASK_STATUS) as [string, ...string[]];
const priorityValues = Object.keys(TASK_PRIORITY) as [string, ...string[]];

export const taskSchema = z.object({
  title: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(255, "Máximo 255 caracteres"),
  description: z
    .string()
    .max(5000, "Máximo 5000 caracteres")
    .optional()
    .or(z.literal("")),
  status: z.enum(statusValues),
  priority: z.enum(priorityValues),
  due_date: z.string().optional().or(z.literal("")),
});

export type TaskForm = z.infer<typeof taskSchema>;
