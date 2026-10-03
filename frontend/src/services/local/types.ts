import type { TaskPriority, TaskStatus } from "@/constants/task";

export interface LocalUser {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

export interface LocalProject {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocalTask {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface LocalDbSchema {
  users: LocalUser[];
  projects: LocalProject[];
  tasks: LocalTask[];
  sequences: {
    users: number;
    projects: number;
    tasks: number;
  };
}
