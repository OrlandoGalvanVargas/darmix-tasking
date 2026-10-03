import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { useProject } from "@/hooks/useProjects";
import { useDeleteTask, useTasksList } from "@/hooks/useTasks";
import { useCountUp } from "@/hooks/useCountUp";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { TaskFilters, type FiltersValue } from "@/components/tasks/TaskFilters";
import {
  GrowthBranch,
  LeafGlyph,
  type LeafKind,
} from "@/components/projects/GrowthBranch";
import { ProjectSeal } from "@/components/projects/ProjectSeal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import type { TaskStatus } from "@/constants/task";
import { ROUTES } from "@/constants/routes";
import { ApiError } from "@/services/http/ApiError";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

const STATUS_OF: Record<LeafKind, TaskStatus> = {
  todo: "pending",
  doing: "in_progress",
  done: "completed",
};

const KIND_OF: Record<TaskStatus, LeafKind> = {
  pending: "todo",
  in_progress: "doing",
  completed: "done",
};

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "n" || e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      ) {
        return;
      }
      if (document.querySelector('[aria-modal="true"]')) return;
      e.preventDefault();
      setEditing(undefined);
      setTaskFormOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (projectQuery.isLoading) {
    return <ProjectSkeleton />;
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
  const filtered = Boolean(status || priority || search);

  return (
    <div className="space-y-8">
      <nav>
        <Link
          to={ROUTES.projects}
          className="group inline-flex items-center gap-1.5 text-sm text-foreground-muted transition-colors hover:text-primary"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-x-1"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          Volver a proyectos
        </Link>
      </nav>

      <ProjectHero
        project={project}
        activeStatus={status}
        onToggleStatus={(next) =>
          updateFilters({
            status: status === next ? "" : next,
            priority,
            search,
          })
        }
      />

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
            filtered
              ? "Ninguna tarea coincide con los filtros"
              : "Este proyecto aún no tiene tareas"
          }
          description={
            filtered
              ? "Prueba con otros filtros o límpialos."
              : "Crea la primera tarea para empezar."
          }
          action={
            !filtered ? (
              <Button onClick={openCreate} size="lg">
                Crear tarea
              </Button>
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

function ProjectHero({
  project,
  activeStatus,
  onToggleStatus,
}: {
  project: Project;
  activeStatus: string;
  onToggleStatus: (status: TaskStatus) => void;
}) {
  const [hoverKind, setHoverKind] = useState<LeafKind | null>(null);

  const summary = project.tasks_summary ?? {
    pending: 0,
    in_progress: 0,
    completed: 0,
  };
  const total = summary.pending + summary.in_progress + summary.completed;
  const pct = total > 0 ? Math.round((summary.completed / total) * 100) : 0;
  const shownPct = useCountUp(pct, 1000, 250);

  const activeKind =
    activeStatus in KIND_OF ? KIND_OF[activeStatus as TaskStatus] : null;

  const cell = (kind: LeafKind, label: string, value: number) => {
    const target = STATUS_OF[kind];
    const tone =
      kind === "todo" ? "warning" : kind === "doing" ? "info" : "success";
    return (
      <StatCard
        label={label}
        value={value}
        tone={tone}
        icon={<LeafGlyph kind={kind} size={20} />}
        selected={activeStatus === target}
        onSelect={() => onToggleStatus(target)}
        onActiveChange={(active) => setHoverKind(active ? kind : null)}
      />
    );
  };

  return (
    <section aria-label="Resumen del proyecto" className="space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <ProjectSeal name={project.name} id={project.id} size="lg" />
          <div className="min-w-0">
            <h1 className="font-soft text-balance text-3xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-3 max-w-xl text-base text-foreground-muted">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {total > 0 && (
          <div className="shrink-0 sm:text-right">
            <p className="font-serif text-5xl leading-none tabular-nums text-foreground">
              {shownPct}
              <span className="ml-0.5 text-2xl text-foreground-muted">%</span>
            </p>
            <p className="mt-1 text-xs text-foreground-muted">
              {summary.completed} de {total} {total === 1 ? "tarea" : "tareas"}
            </p>
          </div>
        )}
      </div>

      <GrowthBranch
        size="lg"
        pending={summary.pending}
        inProgress={summary.in_progress}
        completed={summary.completed}
        highlight={hoverKind ?? activeKind}
      />

      <div className="grid grid-cols-3 gap-x-4 sm:gap-x-6">
        {cell("done", "Completadas", summary.completed)}
        {cell("doing", "En progreso", summary.in_progress)}
        {cell("todo", "Pendientes", summary.pending)}
      </div>
    </section>
  );
}

function ProjectSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-5 w-40" />
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
        <div className="w-full space-y-3">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <Skeleton className="h-[92px] rounded-full" />
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function TasksSkeleton() {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4"
        >
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/3" />
          <div className="border-t border-border pt-3">
            <Skeleton className="h-8 w-40 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
