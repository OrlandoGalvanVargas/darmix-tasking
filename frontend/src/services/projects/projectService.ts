import { API_ROUTES } from "@/constants/api";
import { http } from "@/services/http/client";
import type { ApiSuccess, PaginationMeta } from "@/types/api";
import type {
  Project,
  ProjectPayload,
  ProjectWithTasks,
} from "@/types/project";

interface ListParams {
  page?: number;
  per_page?: number;
}

export interface PaginatedProjects {
  items: Project[];
  meta: PaginationMeta;
}

export const projectService = {
  async list(params: ListParams = {}): Promise<PaginatedProjects> {
    const { data } = await http.get<ApiSuccess<Project[]>>(
      API_ROUTES.projects.index,
      {
        params: { per_page: 15, ...params },
      },
    );

    return {
      items: data.data,
      meta: data.meta!.pagination,
    };
  },

  async show(id: number): Promise<ProjectWithTasks> {
    const { data } = await http.get<ApiSuccess<ProjectWithTasks>>(
      API_ROUTES.projects.show(id),
    );
    return data.data;
  },

  async create(payload: ProjectPayload): Promise<Project> {
    const { data } = await http.post<ApiSuccess<Project>>(
      API_ROUTES.projects.store,
      payload,
    );
    return data.data;
  },

  async update(id: number, payload: ProjectPayload): Promise<Project> {
    const { data } = await http.put<ApiSuccess<Project>>(
      API_ROUTES.projects.update(id),
      payload,
    );
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(API_ROUTES.projects.destroy(id));
  },
};
