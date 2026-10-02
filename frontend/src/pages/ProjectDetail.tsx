import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { useProject } from "@/hooks/useProjects";
import { useDeleteTask, useTasksList } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { TaskFilters, type FiltersValue } from "@/components/tasks/TaskFilters";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { ROUTES } from "@/constants/routes";
import { ApiError } from "@/services/http/ApiError";
import type { Task } from "@/types/task";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const status = searchParams.get("status") ?? "";
  const priority = searchParams.get("priority") ?? "";
  const search = searchParams.get("search") ?? "";

  const projectQuery = useProject(projectId);
  const tasksQuery = useTasksList({
    project_id: projectId,
    page,
    status: status || undefined,
    priority: priority || undefined,
    search: search || undefined,
  });

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | undefined>(undefined);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const deleteMutation = useDeleteTask();

  const updateFilters = (filters: FiltersValue) => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    if (filters.search) params.set("search", filters.search);

    setSearchParams(params);
  };

  const openCreate = () => {
    setEditing(undefined);
    setTaskFormOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setTaskFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    await deleteMutation.mutateAsync(deleting.id);
    setDeleting(null);
  };

  if (projectQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (projectQuery.isError || !projectQuery.data) {
    const err = projectQuery.error;
    return (
      <ErrorState
        title="No se pudo cargar el proyecto"
        message={err instanceof ApiError ? err.message : "Error desconocido."}
        onRetry={() => projectQuery.refetch()}
      />
    );
  }

  const project = projectQuery.data;
  const summary = project.tasks_summary ?? {
    pending: 0,
    in_progress: 0,
    completed: 0,
  };

  return (
    <div className="space-y-6">
      <nav className="text-sm text-foreground-muted">
        <Link to={ROUTES.projects} className="hover:text-primary">
          ← Volver a proyectos
        </Link>
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-foreground">
          {project.name}
        </h1>
        {project.description && (
          <p className="text-sm text-foreground-muted">{project.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Badge tone="neutral">Pendientes: {summary.pending}</Badge>
          <Badge tone="info">En progreso: {summary.in_progress}</Badge>
          <Badge tone="success">Completadas: {summary.completed}</Badge>
        </div>
      </header>

      <TaskFilters
        value={{ status, priority, search }}
        onChange={updateFilters}
        onCreate={openCreate}
      />

      {tasksQuery.isLoading && <TasksSkeleton />}

      {tasksQuery.isError && (
        <ErrorState
          message={
            tasksQuery.error instanceof ApiError
              ? tasksQuery.error.message
              : "No se pudieron cargar las tareas."
          }
          onRetry={() => tasksQuery.refetch()}
        />
      )}

      {tasksQuery.data && tasksQuery.data.items.length === 0 && (
        <EmptyState
          title={
            status || priority || search
              ? "Ninguna tarea coincide con los filtros"
              : "Este proyecto aún no tiene tareas"
          }
          description={
            status || priority || search
              ? "Prueba con otros filtros o límpialos."
              : "Crea la primera tarea para empezar."
          }
          action={
            !status && !priority && !search ? (
              <button
                onClick={openCreate}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
              >
                Crear tarea
              </button>
            ) : undefined
          }
        />
      )}

      {tasksQuery.data && tasksQuery.data.items.length > 0 && (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {tasksQuery.data.items.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </div>

          <Pagination
            currentPage={tasksQuery.data.meta.current_page}
            lastPage={tasksQuery.data.meta.last_page}
            total={tasksQuery.data.meta.total}
            from={tasksQuery.data.meta.from}
            to={tasksQuery.data.meta.to}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              params.set("page", String(next));
              setSearchParams(params);
            }}
          />
        </>
      )}

      <TaskFormModal
        open={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        projectId={projectId}
        task={editing}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar tarea"
        message={
          deleting
            ? `¿Eliminar "${deleting.title}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

function TasksSkeleton() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4"
        >
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
