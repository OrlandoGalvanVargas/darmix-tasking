import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router";
import { loginSchema, type LoginForm } from "@/schemas/auth";
import { useLoginMutation } from "@/hooks/useAuthMutations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { ApiError } from "@/services/http/ApiError";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rootError, setRootError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginForm) => {
    setRootError(null);

    try {
      await loginMutation.mutateAsync(values);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? ROUTES.projects, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.isValidation()) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            setError(field as keyof LoginForm, { message: messages[0] });
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
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
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
        Iniciar sesión
      </Button>

      <p className="text-center text-sm text-foreground-muted">
        ¿No tienes cuenta?{" "}
        <Link
          to={ROUTES.register}
          className="font-medium text-primary hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </form>
  );
}
