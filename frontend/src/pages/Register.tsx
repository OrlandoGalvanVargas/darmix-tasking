import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { registerSchema, type RegisterForm } from "@/schemas/auth";
import { useRegisterMutation } from "@/hooks/useAuthMutations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { ApiError } from "@/services/http/ApiError";

export default function Register() {
  const navigate = useNavigate();
  const [rootError, setRootError] = useState<string | null>(null);
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (values: RegisterForm) => {
    setRootError(null);

    try {
      await registerMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      navigate(ROUTES.projects, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isValidation()) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            setError(field as keyof RegisterForm, { message: messages[0] });
          });
          return;
        }
        setRootError(error.message);
        return;
      }
      setRootError("Ocurrió un error inesperado. Intenta de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="Nombre"
        type="text"
        autoComplete="name"
        placeholder="Tu nombre"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        placeholder="tu@correo.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        label="Confirmar contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="Repite tu contraseña"
        error={errors.password_confirmation?.message}
        {...register("password_confirmation")}
      />

      {rootError && (
        <div
          role="alert"
          className="rounded-lg border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger"
        >
          {rootError}
        </div>
      )}

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-foreground-muted">
        ¿Ya tienes cuenta?{" "}
        <Link
          to={ROUTES.login}
          className="font-medium text-primary hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
