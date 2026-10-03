import { PriorityMark } from "@/components/tasks/PriorityMark";
import { StatusSwitch } from "@/components/tasks/StatusSwitch";
import { TASK_PRIORITY, type TaskStatus } from "@/constants/task";
import { formatDate } from "@/lib/dates";
import { useUpdateTask } from "@/hooks/useTasks";
import { cn } from "@/lib/cn";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const updateMutation = useUpdateTask();

  const optimisticStatus = updateMutation.isPending
    ? updateMutation.variables?.payload.status
    : undefined;
  const shownStatus: TaskStatus = optimisticStatus ?? task.status;
  const completed = shownStatus === "completed";

  const handleStatusChange = (next: TaskStatus) => {
    if (updateMutation.isPending || next === task.status) return;
    updateMutation.mutate({
      id: task.id,
      payload: { status: next },
    });
  };

  const priorityMeta = TASK_PRIORITY[task.priority];

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4",
        "transition-colors duration-300",
        "hover:border-primary/50 focus-within:border-primary/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className={cn(
            "font-sans text-[0.95rem] font-semibold leading-snug tracking-tight line-through decoration-1 transition-colors duration-500",
            completed
              ? "text-foreground-muted decoration-foreground-muted/60"
              : "text-foreground decoration-transparent",
          )}
        >
          {task.title}
        </h3>

        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 pointer-coarse:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Editar ${task.title}`}
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
            onClick={() => onDelete(task)}
            aria-label={`Eliminar ${task.title}`}
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

      {task.description && (
        <p className="line-clamp-2 text-sm leading-relaxed text-foreground-muted">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-foreground-muted">
        <span className="inline-flex items-center gap-1.5">
          <PriorityMark priority={task.priority} />
          Prioridad {priorityMeta.label.toLowerCase()}
        </span>

        {task.is_overdue ? (
          <span className="font-medium text-danger">
            Vencida{task.due_date ? ` · ${formatDate(task.due_date)}` : ""}
          </span>
        ) : (
          task.due_date && <span>Vence {formatDate(task.due_date)}</span>
        )}
      </div>

      <div className="mt-0.5 border-t border-border pt-3">
        <StatusSwitch
          value={shownStatus}
          onChange={handleStatusChange}
          ariaLabel={`Estado de ${task.title}`}
        />
      </div>
    </article>
  );
}
