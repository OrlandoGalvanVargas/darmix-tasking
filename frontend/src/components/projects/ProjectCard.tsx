import { Link } from "react-router";
import { GrowthBranch, LeafGlyph } from "@/components/projects/GrowthBranch";
import { ProjectSeal } from "@/components/projects/ProjectSeal";
import { ROUTES } from "@/constants/routes";
import { useCountUp } from "@/hooks/useCountUp";
import { formatDate } from "@/lib/dates";
import { cn } from "@/lib/cn";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;

  variant?: "card" | "row";
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({
  project,
  featured = false,
  variant = "card",
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const row = variant === "row";
  const summary = project.tasks_summary ?? {
    pending: 0,
    in_progress: 0,
    completed: 0,
  };
  const total = summary.pending + summary.in_progress + summary.completed;
  const completedPct =
    total > 0 ? Math.round((summary.completed / total) * 100) : 0;
  const shownPct = useCountUp(completedPct, 1000, 300);

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden border border-border bg-surface p-5",
        "transition-colors duration-300 ease-out",
        "hover:border-primary/50 focus-within:border-primary/50",
        featured ? "rounded-[1.75rem]" : row ? "rounded-2xl" : "rounded-card",
        featured &&
          "md:grid md:grid-cols-[minmax(0,1fr)_minmax(260px,420px)] md:items-center md:gap-10 md:p-8",
        row &&
          "md:grid md:grid-cols-[minmax(0,1fr)_minmax(240px,340px)] md:items-center md:gap-8 md:py-4",
      )}
    >
      {}
      <div className="flex min-w-0 items-start gap-4">
        <ProjectSeal
          name={project.name}
          id={project.id}
          size={featured ? "lg" : "md"}
          className="-rotate-6 transition-transform duration-500 ease-spring group-hover:rotate-0 group-hover:scale-105"
        />

        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "leading-tight",
              featured ? "text-2xl font-medium" : "text-lg font-medium",
            )}
          >
            <Link
              to={ROUTES.project(project.id)}
              className={cn(
                "title-wonk text-foreground after:absolute after:inset-0 after:content-['']",
                "focus:outline-none focus-visible:underline",
                "group-hover:text-primary",
              )}
            >
              {project.name}
            </Link>
          </h3>

          {project.description ? (
            <p
              className={cn(
                "mt-1.5 text-sm leading-relaxed text-foreground-muted",
                featured
                  ? "line-clamp-3"
                  : row
                    ? "line-clamp-1"
                    : "line-clamp-2",
              )}
            >
              {project.description}
            </p>
          ) : (
            <p className="mt-1.5 text-sm italic text-foreground-muted/60">
              Sin descripción
            </p>
          )}
        </div>

        <div className="relative z-10 flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 pointer-coarse:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(project)}
            aria-label={`Editar ${project.name}`}
            title="Editar"
            className="grid h-8 w-8 place-items-center rounded-lg text-foreground-muted transition hover:bg-surface-muted hover:text-foreground"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(project)}
            aria-label={`Eliminar ${project.name}`}
            title="Eliminar"
            className="grid h-8 w-8 place-items-center rounded-lg text-foreground-muted transition hover:bg-danger-soft hover:text-danger"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="m6 6 1 14h10l1-14" />
            </svg>
          </button>
        </div>
      </div>

      {}
      <div className="pointer-events-none flex min-w-0 flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          {total > 0 ? (
            <>
              <p
                className={cn(
                  "font-serif leading-none tabular-nums text-foreground",
                  featured ? "text-5xl" : "text-4xl",
                )}
              >
                {shownPct}
                <span className="ml-0.5 text-xl text-foreground-muted">%</span>
              </p>
              <p className="text-xs text-foreground-muted">
                {summary.completed} de {total}{" "}
                {total === 1 ? "tarea" : "tareas"}
              </p>
            </>
          ) : (
            <p className="text-sm text-foreground-muted">Sin tareas todavía</p>
          )}
        </div>

        <GrowthBranch
          pending={summary.pending}
          inProgress={summary.in_progress}
          completed={summary.completed}
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-muted">
          <span className="inline-flex items-center gap-1.5">
            <LeafGlyph kind="todo" size={14} />
            {summary.pending} pendientes
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LeafGlyph kind="doing" size={14} />
            {summary.in_progress} en progreso
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LeafGlyph kind="done" size={14} />
            {summary.completed} completadas
          </span>
          <span className="ml-auto hidden sm:inline">
            {formatDate(project.created_at)}
          </span>
        </div>
      </div>
    </article>
  );
}
