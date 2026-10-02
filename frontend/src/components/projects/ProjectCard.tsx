import { Link } from "react-router";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const summary = project.tasks_summary ?? {
    pending: 0,
    in_progress: 0,
    completed: 0,
  };
  const total = summary.pending + summary.in_progress + summary.completed;
  const completedPct =
    total > 0 ? Math.round((summary.completed / total) * 100) : 0;

  return (
    <article
      className={
        "group relative flex flex-col justify-between overflow-hidden rounded-card " +
        "border border-border bg-surface p-5 transition-all duration-300 " +
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 " +
        "focus-within:border-primary/40 focus-within:shadow-lg"
      }
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-transparent transition-colors duration-300 group-hover:bg-primary" />

      <div className="space-y-4">
        <div className="flex items-start gap-3.5">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-105"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <Link
                to={ROUTES.project(project.id)}
                className={
                  "inline-flex max-w-full items-center gap-1 text-base font-semibold text-foreground transition group-hover:text-primary " +
                  "after:absolute after:inset-0 after:content-[''] " +
                  "focus:outline-none focus-visible:underline"
                }
              >
                <span className="line-clamp-1 font-semibold">
                  {project.name}
                </span>
                <svg
                  className="h-4 w-4 shrink-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H7M17 7V17"
                  />
                </svg>
              </Link>

              <div className="relative z-10 flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(project)}
                  aria-label={`Editar ${project.name}`}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-danger-soft hover:text-danger"
                  onClick={() => onDelete(project)}
                  aria-label={`Eliminar ${project.name}`}
                >
                  Eliminar
                </Button>
              </div>
            </div>

            {project.description ? (
              <p className="mt-0.5 line-clamp-2 text-sm text-foreground-muted">
                {project.description}
              </p>
            ) : (
              <p className="mt-0.5 text-sm italic text-foreground-muted/70">
                Sin descripción
              </p>
            )}
          </div>
        </div>

        {total > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-foreground-muted">
              <span className="font-medium text-foreground">
                {completedPct}% completado
              </span>
              <span>
                {summary.completed} de {total}{" "}
                {total === 1 ? "tarea" : "tareas"}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-success transition-all duration-500"
                style={{ width: `${completedPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <Badge tone="neutral">Pendientes: {summary.pending}</Badge>
        <Badge tone="info">En progreso: {summary.in_progress}</Badge>
        <Badge tone="success">Completadas: {summary.completed}</Badge>
      </div>
    </article>
  );
}
