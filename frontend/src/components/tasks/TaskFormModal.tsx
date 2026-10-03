import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { StatusSwitch } from "@/components/tasks/StatusSwitch";
import { PrioritySwitch } from "@/components/tasks/PriorityMark";
import { taskSchema, type TaskForm } from "@/schemas/task";
import type { TaskPriority, TaskStatus } from "@/constants/task";
import { toDateInputValue } from "@/lib/dates";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import { ApiError } from "@/services/http/ApiError";
import type { Task, TaskPayload, TaskUpdatePayload } from "@/types/task";

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  projectId: number;
  task?: Task;
}

export function TaskFormModal({
  open,
  onClose,
  projectId,
  task,
}: TaskFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? "Editar tarea" : "Nueva tarea"}
    >
      <TaskForm
        key={task?.id ?? "new"}
        projectId={projectId}
        task={task}
        onClose={onClose}
      />
    </Modal>
  );
}

function TaskForm({
  projectId,
  task,
  onClose,
}: {
  projectId: number;
  task?: Task;
  onClose: () => void;
}) {
  const [rootError, setRootError] = useState<string | null>(null);
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "pending",
      priority: task?.priority ?? "medium",
      due_date: toDateInputValue(task?.due_date),
    },
  });

  const onSubmit = async (values: TaskForm) => {
    setRootError(null);

    try {
      if (task) {
        const payload: TaskUpdatePayload = {
          title: values.title.trim(),
          description: values.description?.trim() || null,
          status: values.status as TaskUpdatePayload["status"],
          priority: values.priority as TaskUpdatePayload["priority"],
          due_date: values.due_date || null,
        };
        await updateMutation.mutateAsync({ id: task.id, payload });
      } else {
        const payload: TaskPayload = {
          project_id: projectId,
          title: values.title.trim(),
          description: values.description?.trim() || null,
          status: values.status as TaskPayload["status"],
          priority: values.priority as TaskPayload["priority"],
          due_date: values.due_date || null,
        };
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      if (error instanceof ApiError && error.isValidation()) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof TaskForm, { message: messages[0] });
        });
        return;
      }
      setRootError(
        error instanceof ApiError ? error.message : "Error inesperado.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="Título"
        placeholder="Ej: Diseñar landing page"
        autoFocus
        error={errors.title?.message}
        {...register("title")}
      />

      <Textarea
        label="Descripción (opcional)"
        placeholder="Detalles de la tarea"
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Estado</p>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <StatusSwitch
              labels="all"
              size={18}
              value={field.value as TaskStatus}
              onChange={field.onChange}
              ariaLabel="Estado"
            />
          )}
        />
        {errors.status?.message && (
          <p className="text-xs font-medium text-danger">
            {errors.status.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Prioridad</p>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <PrioritySwitch
              value={field.value as TaskPriority}
              onChange={field.onChange}
              ariaLabel="Prioridad"
            />
          )}
        />
        {errors.priority?.message && (
          <p className="text-xs font-medium text-danger">
            {errors.priority.message}
          </p>
        )}
      </div>

      <Input
        label="Fecha límite (opcional)"
        type="date"
        error={errors.due_date?.message}
        {...register("due_date")}
      />

      {rootError && (
        <div
          role="alert"
          className="animate-shake rounded-lg border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger"
        >
          {rootError}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {task ? "Guardar cambios" : "Crear tarea"}
        </Button>
      </div>
    </form>
  );
}
