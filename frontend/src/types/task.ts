import type { TaskPriority, TaskStatus } from "@/constants/task";

export interface TaskProjectRef {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  status_label: string;
  status_color: string;
  priority: TaskPriority;
  priority_label: string;
  priority_color: string;
  due_date: string | null;
  is_overdue: boolean;
  project?: TaskProjectRef;
  created_at: string;
  updated_at: string;
}

export interface TaskPayload {
  project_id: number;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: number;
  search?: string;
  page?: number;
  per_page?: number;
}
