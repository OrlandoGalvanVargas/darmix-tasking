import { ApiError } from "@/services/http/ApiError";
import type { PaginationMeta } from "@/types/api";
import type { Task, TaskPayload, TaskUpdatePayload } from "@/types/task";
import { getDb, saveDb } from "./db";
import { getLocalUserId, toTaskResource } from "./mappers";
import { simulateDelay } from "./simulate";

export interface TaskListParams {
  project_id?: number;
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PaginatedTasks {
  items: Task[];
  meta: PaginationMeta;
}

function unauthorized(): ApiError {
  return new ApiError({
    message: "No autenticado.",
    code: "UNAUTHENTICATED",
    status: 401,
  });
}

function notFound(): ApiError {
  return new ApiError({
    message: "Recurso no encontrado.",
    code: "RESOURCE_NOT_FOUND",
    status: 404,
  });
}

export const localTaskService = {
  async list(params: TaskListParams = {}): Promise<PaginatedTasks> {
    await simulateDelay();
    const userId = getLocalUserId();
    if (!userId) throw unauthorized();

    const db = getDb();
    const userProjectIds = new Set(
      db.projects.filter((p) => p.user_id === userId).map((p) => p.id),
    );

    let filtered = db.tasks.filter((t) => userProjectIds.has(t.project_id));

    if (params.project_id) {
      filtered = filtered.filter((t) => t.project_id === params.project_id);
    }
    if (params.status) {
      filtered = filtered.filter((t) => t.status === params.status);
    }
    if (params.priority) {
      filtered = filtered.filter((t) => t.priority === params.priority);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description?.toLowerCase().includes(q) ?? false),
      );
    }

    filtered.sort(
      (a, b) => b.created_at.localeCompare(a.created_at) || b.id - a.id,
    );

    const page = params.page ?? 1;
    const perPage = params.per_page ?? 15;
    const total = filtered.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);

    const projectMap = new Map(db.projects.map((p) => [p.id, p]));

    return {
      items: paginated.map((t) =>
        toTaskResource(t, projectMap.get(t.project_id)),
      ),
      meta: {
        current_page: page,
        per_page: perPage,
        total,
        last_page: lastPage,
        from: total === 0 ? null : start + 1,
        to: total === 0 ? null : Math.min(start + perPage, total),
      },
    };
  },

  async show(id: number): Promise<Task> {
    await simulateDelay();
    const userId = getLocalUserId();
    if (!userId) throw unauthorized();

    const db = getDb();
    const task = db.tasks.find((t) => t.id === id);
    if (!task) throw notFound();

    const project = db.projects.find(
      (p) => p.id === task.project_id && p.user_id === userId,
    );
    if (!project) throw notFound();

    return toTaskResource(task, project);
  },

  async create(payload: TaskPayload): Promise<Task> {
    await simulateDelay();
    const userId = getLocalUserId();
    if (!userId) throw unauthorized();

    const db = getDb();
    const project = db.projects.find(
      (p) => p.id === payload.project_id && p.user_id === userId,
    );
    if (!project) {
      throw new ApiError({
        message: "Los datos proporcionados no son válidos.",
        code: "VALIDATION_ERROR",
        status: 422,
        errors: {
          project_id: ["El proyecto seleccionado no existe o no te pertenece."],
        },
      });
    }

    const nextId = ++db.sequences.tasks;
    const now = new Date().toISOString();

    const newTask = {
      id: nextId,
      project_id: payload.project_id,
      title: payload.title.trim(),
      description: payload.description ?? null,
      status: payload.status ?? ("pending" as const),
      priority: payload.priority ?? ("medium" as const),
      due_date: payload.due_date ?? null,
      created_at: now,
      updated_at: now,
    };
    db.tasks.push(newTask);
    saveDb();

    return toTaskResource(newTask, project);
  },

  async update(id: number, payload: TaskUpdatePayload): Promise<Task> {
    await simulateDelay();
    const userId = getLocalUserId();
    if (!userId) throw unauthorized();

    const db = getDb();
    const task = db.tasks.find((t) => t.id === id);
    if (!task) throw notFound();

    const project = db.projects.find(
      (p) => p.id === task.project_id && p.user_id === userId,
    );
    if (!project) throw notFound();

    if (payload.title !== undefined) task.title = payload.title.trim();
    if (payload.description !== undefined)
      task.description = payload.description ?? null;
    if (payload.status !== undefined) task.status = payload.status;
    if (payload.priority !== undefined) task.priority = payload.priority;
    if (payload.due_date !== undefined)
      task.due_date = payload.due_date ?? null;
    task.updated_at = new Date().toISOString();
    saveDb();

    return toTaskResource(task, project);
  },

  async remove(id: number): Promise<void> {
    await simulateDelay();
    const userId = getLocalUserId();
    if (!userId) throw unauthorized();

    const db = getDb();
    const task = db.tasks.find((t) => t.id === id);
    if (!task) throw notFound();

    const project = db.projects.find(
      (p) => p.id === task.project_id && p.user_id === userId,
    );
    if (!project) throw notFound();

    db.tasks = db.tasks.filter((t) => t.id !== id);
    saveDb();
  },
};
