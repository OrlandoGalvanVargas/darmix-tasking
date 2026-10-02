import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TASK_PRIORITY, TASK_STATUS } from "@/constants/task";
import { formatDate } from "@/lib/dates";
import { useUpdateTask } from "@/hooks/useTasks";
import { cn } from "@/lib/cn";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const PRIORITY_STYLES: Record<
  string,
  { dot: string; badgeTone: "success" | "warning" | "danger" }
> = {
  low: { dot: "bg-emerald-500", badgeTone: "success" },
  medium: { dot: "bg-amber-500", badgeTone: "warning" },
  high: { dot: "bg-rose-500", badgeTone: "danger" },
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const updateMutation = useUpdateTask();

  const handleStatusChange = (next: string) => {
    updateMutation.mutate({
      id: task.id,
      payload: { status: next as Task["status"] },
    });
  };

  const statusMeta = TASK_STATUS[task.status];
  const priorityMeta = TASK_PRIORITY[task.priority];
  const priorityStyle = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.low;

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-surface/80 p-4 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-ring/40 hover:shadow-lg hover:shadow-ring/5",
        task.status === "completed" && "bg-surface/40 opacity-75",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className={cn(
            "text-sm font-semibold tracking-tight text-foreground transition-colors",
            task.status === "completed" &&
              "line-through decoration-foreground-muted/50 text-foreground-muted",
          )}
        >
          {task.title}
        </h3>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100 focus-within:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="h-7 px-2.5 text-xs font-medium text-foreground-muted transition-colors hover:bg-surface-accent hover:text-foreground"
          >
            Editar
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task)}
            className="h-7 px-2.5 text-xs font-medium text-foreground-muted transition-colors hover:bg-danger/10 hover:text-danger"
          >
            Eliminar
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="line-clamp-2 text-xs leading-relaxed text-foreground-muted">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone={statusMeta.tone} className="px-2 py-0.5 text-[11px]">
          {statusMeta.label}
        </Badge>

        <Badge
          tone={priorityStyle.badgeTone}
          className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px]"
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full animate-pulse",
              priorityStyle.dot,
            )}
          />
          {priorityMeta.label}
        </Badge>

        {task.is_overdue && (
          <Badge
            tone="danger"
            className="animate-pulse px-2 py-0.5 text-[11px]"
          >
            Vencida
          </Badge>
        )}

        {task.due_date && !task.is_overdue && (
          <span className="text-[11px] font-medium text-foreground-muted">
            Vence {formatDate(task.due_date)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border/40 pt-3 mt-0.5">
        <label
          htmlFor={`status-${task.id}`}
          className="text-xs font-medium text-foreground-muted"
        >
          Estado:
        </label>

        <div className="relative inline-block">
          <select
            id={`status-${task.id}`}
            value={task.status}
            disabled={updateMutation.isPending}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="appearance-none rounded-lg border border-border/80 bg-surface/60 py-1 pl-2.5 pr-7 text-xs font-medium text-foreground transition-all hover:bg-surface hover:border-border focus:border-ring focus:outline-none disabled:opacity-50 cursor-pointer"
          >
            {Object.entries(TASK_STATUS).map(([value, meta]) => (
              <option
                key={value}
                value={value}
                className="bg-surface text-foreground"
              >
                {meta.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-foreground-muted">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
}
