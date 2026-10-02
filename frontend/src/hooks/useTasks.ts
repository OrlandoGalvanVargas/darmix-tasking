import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type {
  PaginatedTasks,
  TaskListParams,
} from "@/services/tasks/taskService";
import type { TaskPayload, TaskUpdatePayload } from "@/types/task";
import { projectKeys } from "./useProjects";

export const taskKeys = {
  all: ["tasks"] as const,
  list: (params: TaskListParams) => [...taskKeys.all, "list", params] as const,
  detail: (id: number) => [...taskKeys.all, "detail", id] as const,
};

export function useTasksList(params: TaskListParams = {}) {
  return useQuery<PaginatedTasks>({
    queryKey: taskKeys.list(params),
    queryFn: () => api.tasks.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: TaskPayload) => api.tasks.create(payload),
    onSuccess: (_task, vars) => {
      qc.invalidateQueries({ queryKey: taskKeys.all });
      qc.invalidateQueries({ queryKey: projectKeys.detail(vars.project_id) });
      qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TaskUpdatePayload }) =>
      api.tasks.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskKeys.all });
      qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.tasks.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskKeys.all });
      qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}
