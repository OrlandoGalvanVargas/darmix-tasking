import type { Task } from "./task";

export interface TaskSummary {
  pending: number;
  in_progress: number;
  completed: number;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  tasks_count?: number;
  tasks_summary?: TaskSummary;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithTasks extends Project {
  tasks: Task[];
}

export interface ProjectPayload {
  name: string;
  description?: string | null;
}
