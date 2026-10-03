import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router";
import { loginSchema, type LoginForm } from "@/schemas/auth";
import { useLoginMutation } from "@/hooks/useAuthMutations";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import {
  MailIcon,
  LockIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@/components/ui/icons";
import { ROUTES } from "@/constants/routes";
import { ApiError } from "@/services/http/ApiError";

const DEMO_EMAIL = "demo@grupobalak.test";
const DEMO_PASSWORD = "password123";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rootError, setRootError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    setValue,
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

  const fillDemoCredentials = () => {
    setValue("email", DEMO_EMAIL, { shouldValidate: true });
    setValue("password", DEMO_PASSWORD, { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      {}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm text-foreground-muted">
          Ingresa tus credenciales para continuar
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          leftIcon={<MailIcon size={18} />}
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Contraseña"
          autoComplete="current-password"
          placeholder="••••••••"
          leftIcon={<LockIcon size={18} />}
          error={errors.password?.message}
          {...register("password")}
        />

        {rootError && (
          <div
            role="alert"
            className="animate-shake rounded-xl border border-danger/30 bg-danger-soft px-3.5 py-3 text-sm text-danger"
          >
            {rootError}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          rightIcon={<ArrowRightIcon size={18} />}
        >
          Iniciar sesión
        </Button>
      </form>

      {}
      <button
        type="button"
        onClick={fillDemoCredentials}
        className="group flex w-full items-center gap-2.5 rounded-xl border border-dashed border-border bg-surface-muted/40 px-3.5 py-2.5 text-left transition hover:border-primary/50 hover:bg-primary/5"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary/15">
          <SparklesIcon size={14} />
        </span>
        <span className="flex-1">
          <span className="block text-xs font-medium text-foreground">
            Probar con credenciales demo
          </span>
          <span className="block text-[11px] text-foreground-muted">
            {DEMO_EMAIL} · {DEMO_PASSWORD}
          </span>
        </span>
      </button>

      <p className="text-center text-sm text-foreground-muted">
        ¿No tienes cuenta?{" "}
        <Link
          to={ROUTES.register}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
}
