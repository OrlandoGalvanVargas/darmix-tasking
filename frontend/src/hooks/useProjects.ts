import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { ProjectPayload } from "@/types/project";
import type { PaginatedProjects } from "@/services/projects/projectService";
import { taskKeys } from "./useTasks";

interface ListParams {
  page?: number;
  per_page?: number;
}

export const projectKeys = {
  all: ["projects"] as const,
  list: (params: ListParams) => [...projectKeys.all, "list", params] as const,
  detail: (id: number) => [...projectKeys.all, "detail", id] as const,
};

export function useProjectsList(params: ListParams = {}) {
  return useQuery<PaginatedProjects>({
    queryKey: projectKeys.list(params),
    queryFn: () => api.projects.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useProject(id: number | undefined) {
  return useQuery({
    queryKey: projectKeys.detail(id ?? 0),
    queryFn: () => api.projects.show(id!),
    enabled: typeof id === "number" && Number.isFinite(id),
  });
}

export function useCreateProject() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProjectPayload) => api.projects.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateProject(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProjectPayload) => api.projects.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      qc.invalidateQueries({ queryKey: projectKeys.detail(id) });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.projects.remove(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      qc.invalidateQueries({ queryKey: projectKeys.detail(id) });
      qc.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
