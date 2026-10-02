import { ApiError } from "@/services/http/ApiError";
import type { PaginationMeta } from "@/types/api";
import type {
  Project,
  ProjectPayload,
  ProjectWithTasks,
} from "@/types/project";
import { getDb, saveDb } from "./db";
import { getLocalUserId, toProjectResource, toTaskResource } from "./mappers";
import { simulateDelay } from "./simulate";

interface ListParams {
  page?: number;
  per_page?: number;
}

export interface PaginatedProjects {
  items: Project[];
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

export const localProjectService = {
  async list(params: ListParams = {}): Promise<PaginatedProjects> {
    await simulateDelay();
    const userId = getLocalUserId();
    if (!userId) throw unauthorized();

    const db = getDb();
    const all = db.projects
      .filter((p) => p.user_id === userId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id - a.id);

    const page = params.page ?? 1;
    const perPage = params.per_page ?? 15;
    const total = all.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    const paginated = all.slice(start, start + perPage);

    return {
      items: paginated.map((p) => toProjectResource(p, db.tasks)),
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

  async show(id: number): Promise<ProjectWithTasks> {
    await simulateDelay();
    const userId = getLocalUserId();
    if (!userId) throw unauthorized();

    const db = getDb();
    const project = db.projects.find(
      (p) => p.id === id && p.user_id === userId,
    );
    if (!project) throw notFound();

    const tasks = db.tasks
      .filter((t) => t.project_id === project.id)
      .sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id - a.id);

    return {
      ...toProjectResource(project, db.tasks),
      tasks: tasks.map((t) => toTaskResource(t, project)),
    };
  },

  async create(payload: ProjectPayload): Promise<Project> {
    await simulateDelay();
    const userId = getLocalUserId();
    if (!userId) throw unauthorized();

    const db = getDb();
    const nextId = ++db.sequences.projects;
    const now = new Date().toISOString();

    const newProject = {
      id: nextId,
      user_id: userId,
      name: payload.name.trim(),
      description: payload.description ?? null,
      created_at: now,
      updated_at: now,
    };
    db.projects.push(newProject);
    saveDb();

    return toProjectResource(newProject, db.tasks);
  },

  async update(id: number, payload: ProjectPayload): Promise<Project> {
    await simulateDelay();
    const userId = getLocalUserId();
    if (!userId) throw unauthorized();

    const db = getDb();
    const project = db.projects.find(
      (p) => p.id === id && p.user_id === userId,
    );
    if (!project) throw notFound();

    project.name = payload.name.trim();
    project.description = payload.description ?? null;
    project.updated_at = new Date().toISOString();
    saveDb();

    return toProjectResource(project, db.tasks);
  },

  async remove(id: number): Promise<void> {
    await simulateDelay();
    const userId = getLocalUserId();
    if (!userId) throw unauthorized();

    const db = getDb();
    const project = db.projects.find(
      (p) => p.id === id && p.user_id === userId,
    );
    if (!project) throw notFound();

    db.projects = db.projects.filter((p) => p.id !== id);
    db.tasks = db.tasks.filter((t) => t.project_id !== id);
    saveDb();
  },
};
