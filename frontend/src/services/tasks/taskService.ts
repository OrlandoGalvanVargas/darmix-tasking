import { API_ROUTES } from "@/constants/api";
import { http } from "@/services/http/client";
import type { ApiSuccess, PaginationMeta } from "@/types/api";
import type { Task, TaskPayload, TaskUpdatePayload } from "@/types/task";

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

export const taskService = {
  async list(params: TaskListParams = {}): Promise<PaginatedTasks> {
    const { data } = await http.get<ApiSuccess<Task[]>>(
      API_ROUTES.tasks.index,
      {
        params: { per_page: 15, ...params },
      },
    );

    return {
      items: data.data,
      meta: data.meta!.pagination,
    };
  },

  async show(id: number): Promise<Task> {
    const { data } = await http.get<ApiSuccess<Task>>(
      API_ROUTES.tasks.show(id),
    );
    return data.data;
  },

  async create(payload: TaskPayload): Promise<Task> {
    const { data } = await http.post<ApiSuccess<Task>>(
      API_ROUTES.tasks.store,
      payload,
    );
    return data.data;
  },

  async update(id: number, payload: TaskUpdatePayload): Promise<Task> {
    const { data } = await http.patch<ApiSuccess<Task>>(
      API_ROUTES.tasks.update(id),
      payload,
    );
    return data.data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(API_ROUTES.tasks.destroy(id));
  },
};
