import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { projectSchema, type ProjectForm } from "@/schemas/project";
import { useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { ApiError } from "@/services/http/ApiError";
import type { Project, ProjectPayload } from "@/types/project";

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  project?: Project;
}

export function ProjectFormModal({
  open,
  onClose,
  project,
}: ProjectFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? "Editar proyecto" : "Nuevo proyecto"}
    >
      <ProjectForm
        key={project?.id ?? "new"}
        project={project}
        onClose={onClose}
      />
    </Modal>
  );
}

function ProjectForm({
  project,
  onClose,
}: {
  project?: Project;
  onClose: () => void;
}) {
  const [rootError, setRootError] = useState<string | null>(null);
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject(project?.id ?? 0);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
    },
  });

  const onSubmit = async (values: ProjectForm) => {
    setRootError(null);

    const payload: ProjectPayload = {
      name: values.name.trim(),
      description: values.description?.trim() || null,
    };

    try {
      if (project) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      if (error instanceof ApiError && error.isValidation()) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof ProjectForm, { message: messages[0] });
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
        label="Nombre"
        placeholder="Nombre del proyecto"
        autoFocus
        error={errors.name?.message}
        {...register("name")}
      />

      <Textarea
        label="Descripción (opcional)"
        placeholder="Describe brevemente el objetivo del proyecto"
        error={errors.description?.message}
        {...register("description")}
      />

      {rootError && (
        <div className="rounded-lg border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
          {rootError}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {project ? "Guardar cambios" : "Crear proyecto"}
        </Button>
      </div>
    </form>
  );
}
