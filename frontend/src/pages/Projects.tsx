import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useProjectsList, useDeleteProject } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { ProjectCard } from "@/components/projects/ProjectCard";
import {
  GrowthBranch,
  LeafGlyph,
  type LeafKind,
} from "@/components/projects/GrowthBranch";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { cn } from "@/lib/cn";
import { ApiError } from "@/services/http/ApiError";
import type { Project } from "@/types/project";

type ViewMode = "grid" | "list";
const VIEW_KEY = "darmix-tasking:projects-view";

function readStoredView(): ViewMode {
  try {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
}

function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 20) return "Buenas tardes";
  return "Buenas noches";
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function describeProgress(
  inProgress: number,
  pending: number,
  completed: number,
): string {
  if (inProgress + pending === 0) {
    return completed > 0
      ? "Todo está completado por ahora"
      : "Todavía no hay tareas en tus proyectos";
  }
  if (inProgress > 0 && pending > 0) {
    return `${plural(inProgress, "tarea en marcha", "tareas en marcha")} y ${pending} por empezar`;
  }
  if (inProgress > 0) {
    return plural(inProgress, "tarea en marcha", "tareas en marcha");
  }
  return plural(pending, "tarea por empezar", "tareas por empezar");
}

export default function Projects() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const { data, isLoading, isError, error, refetch } = useProjectsList({
    page,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | undefined>(undefined);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const deleteMutation = useDeleteProject();

  const [view, setView] = useState<ViewMode>(readStoredView);
  const [focusKind, setFocusKind] = useState<LeafKind | null>(null);
  const [today] = useState(() => new Date());

  const changeView = (next: ViewMode) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {}
  };

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setFormOpen(true);
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
      setFormOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const stats = useMemo(() => {
    const projects = data?.items ?? [];
    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    projects.forEach((p) => {
      const s = p.tasks_summary;
      if (s) {
        pending += s.pending;
        inProgress += s.in_progress;
        completed += s.completed;
      }
    });
    return {
      projects: data?.meta.total ?? 0,
      pending,
      inProgress,
      completed,
    };
  }, [data]);

  const firstName = user?.name?.split(" ")[0];
  const headline = firstName
    ? `${getGreeting(today)}, ${firstName}`
    : "Hola, de nuevo";

  const dateText = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(today);
  const dateLabel = dateText.charAt(0).toUpperCase() + dateText.slice(1);

  const hasItems = Boolean(data && data.items.length > 0);
  const multiPage = (data?.meta.last_page ?? 1) > 1;
  const subtitle = hasItems
    ? `${dateLabel}. ${describeProgress(stats.inProgress, stats.pending, stats.completed)}${multiPage ? " en esta página" : ""}.`
    : `${dateLabel}. Aquí está el pulso de tus proyectos.`;

  const spotlight = (kind: LeafKind) => (active: boolean) =>
    setFocusKind(active ? kind : null);

  return (
    <div className="space-y-10">
      {}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-soft text-balance text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            {headline}
          </h1>
          <p className="mt-3 max-w-xl text-base text-foreground-muted">
            {subtitle}
          </p>
        </div>
        <Button
          onClick={openCreate}
          size="lg"
          className="self-start sm:self-auto"
          leftIcon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          }
        >
          Nuevo proyecto
          <kbd
            aria-hidden="true"
            className="ml-1.5 hidden rounded border border-primary-foreground/30 px-1.5 text-[11px] font-medium leading-5 text-primary-foreground/80 sm:inline"
          >
            N
          </kbd>
        </Button>
      </header>

      {}
      {hasItems && (
        <section aria-label="Resumen de tareas" className="space-y-6">
          <GrowthBranch
            size="lg"
            pending={stats.pending}
            inProgress={stats.inProgress}
            completed={stats.completed}
            highlight={focusKind}
          />

          <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            <StatCard
              label="Proyectos"
              value={stats.projects}
              tone="primary"
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
                </svg>
              }
            />
            <StatCard
              label="Completadas"
              value={stats.completed}
              tone="success"
              icon={<LeafGlyph kind="done" size={20} />}
              onActiveChange={spotlight("done")}
            />
            <StatCard
              label="En progreso"
              value={stats.inProgress}
              tone="info"
              icon={<LeafGlyph kind="doing" size={20} />}
              onActiveChange={spotlight("doing")}
            />
            <StatCard
              label="Pendientes"
              value={stats.pending}
              tone="warning"
              icon={<LeafGlyph kind="todo" size={20} />}
              onActiveChange={spotlight("todo")}
            />
          </div>
        </section>
      )}

      {}
      {isLoading && <ProjectsSkeleton />}

      {isError && (
        <ErrorState
          message={
            error instanceof ApiError
              ? error.message
              : "No se pudieron cargar los proyectos."
          }
          onRetry={() => refetch()}
        />
      )}

      {data && data.items.length === 0 && (
        <EmptyState
          title="Tu espacio está vacío"
          description="Crea tu primer proyecto para empezar a organizar tus tareas y darles seguimiento."
          action={
            <Button onClick={openCreate} size="lg">
              Crear mi primer proyecto
            </Button>
          }
        />
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-medium text-foreground">
              Tus proyectos
            </h2>
            <ViewSwitch value={view} onChange={changeView} />
          </div>

          {}
          <div
            key={view}
            className={cn(
              "animate-fade-in grid gap-4",
              view === "grid" ? "md:grid-cols-2" : "grid-cols-1",
            )}
          >
            {data.items.map((p, idx) => {
              const isFeatured =
                view === "grid" && idx === 0 && data.items.length > 1;
              return (
                <div
                  key={p.id}
                  className={cn(
                    view === "grid" && idx === 0 && "md:col-span-2",
                  )}
                >
                  <ProjectCard
                    project={p}
                    featured={isFeatured}
                    variant={view === "list" ? "row" : "card"}
                    onEdit={openEdit}
                    onDelete={setDeleting}
                  />
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={data.meta.current_page}
            lastPage={data.meta.last_page}
            total={data.meta.total}
            from={data.meta.from}
            to={data.meta.to}
            onChange={(next) => {
              const params = new URLSearchParams(searchParams);
              params.set("page", String(next));
              setSearchParams(params);
            }}
          />
        </>
      )}

      <ProjectFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        project={editing}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar proyecto"
        message={
          deleting
            ? `¿Eliminar "${deleting.name}"? También se eliminarán sus tareas. Esta acción no se puede deshacer.`
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

function ViewSwitch({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (next: ViewMode) => void;
}) {
  const options = [
    {
      value: "grid" as const,
      label: "Mosaico",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      value: "list" as const,
      label: "Lista",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
  ];
  const index = options.findIndex((o) => o.value === value);

  return (
    <div
      role="radiogroup"
      aria-label="Vista de proyectos"
      className="relative grid grid-cols-2 rounded-xl border border-border bg-surface-muted p-0.5"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-[10px] bg-surface shadow-sm transition-transform duration-300 ease-spring"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          aria-label={o.label}
          onClick={() => onChange(o.value)}
          className={cn(
            "relative z-10 flex h-8 items-center justify-center gap-1.5 rounded-[10px] px-3 text-sm font-medium transition-colors",
            value === o.value
              ? "text-foreground"
              : "text-foreground-muted hover:text-foreground",
          )}
        >
          {o.icon}
          <span className="hidden sm:inline">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <Skeleton className="h-[92px] rounded-full" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Skeleton className="h-44 rounded-[1.75rem]" />
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-card" />
        ))}
      </div>
    </div>
  );
}
