export type Tone = "neutral" | "info" | "success" | "warning" | "danger";

export const TASK_STATUS = {
  pending: { label: "Pendiente", tone: "neutral" },
  in_progress: { label: "En progreso", tone: "info" },
  completed: { label: "Completada", tone: "success" },
} as const satisfies Record<string, { label: string; tone: Tone }>;

export const TASK_PRIORITY = {
  low: { label: "Baja", tone: "success" },
  medium: { label: "Media", tone: "warning" },
  high: { label: "Alta", tone: "danger" },
} as const satisfies Record<string, { label: string; tone: Tone }>;

export type TaskStatus = keyof typeof TASK_STATUS;
export type TaskPriority = keyof typeof TASK_PRIORITY;
