import { TASK_PRIORITY, TASK_STATUS } from "@/constants/task";
import { tokenStorage } from "@/services/storage/token";
import type { User } from "@/types/auth";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import type { LocalProject, LocalTask, LocalUser } from "./types";

export function toPublicUser(u: LocalUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    created_at: u.created_at,
  };
}

export function toProjectResource(
  project: LocalProject,
  tasks: LocalTask[],
): Project {
  const projectTasks = tasks.filter((t) => t.project_id === project.id);

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    tasks_count: projectTasks.length,
    tasks_summary: {
      pending: projectTasks.filter((t) => t.status === "pending").length,
      in_progress: projectTasks.filter((t) => t.status === "in_progress")
        .length,
      completed: projectTasks.filter((t) => t.status === "completed").length,
    },
    created_at: project.created_at,
    updated_at: project.updated_at,
  };
}

export function toTaskResource(task: LocalTask, project?: LocalProject): Task {
  const statusMeta = TASK_STATUS[task.status];
  const priorityMeta = TASK_PRIORITY[task.priority];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = task.due_date
    ? new Date(task.due_date) < today && task.status !== "completed"
    : false;

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    status_label: statusMeta.label,
    status_color: statusMeta.tone,
    priority: task.priority,
    priority_label: priorityMeta.label,
    priority_color: priorityMeta.tone,
    due_date: task.due_date,
    is_overdue: isOverdue,
    project: project ? { id: project.id, name: project.name } : undefined,
    created_at: task.created_at,
    updated_at: task.updated_at,
  };
}

export function getLocalUserId(): number | null {
  const token = tokenStorage.get();
  if (!token) return null;
  const match = token.match(/^local-token-(\d+)$/);
  if (!match) return null;
  return Number(match[1]);
}
