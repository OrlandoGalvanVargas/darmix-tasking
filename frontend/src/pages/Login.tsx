import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router";
import { loginSchema, type LoginForm } from "@/schemas/auth";
import { useLoginMutation } from "@/hooks/useAuthMutations";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { LeafGlyph } from "@/components/projects/GrowthBranch";
import { fieldLevel, useAuthGrowth } from "@/components/layout/authGrowth";
import { MailIcon, LockIcon, ArrowRightIcon } from "@/components/ui/icons";
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
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const email = useWatch({ control, name: "email" }) ?? "";
  const password = useWatch({ control, name: "password" }) ?? "";
  const emailLevel = fieldLevel(email, /^\S+@\S+\.\S+$/.test(email));
  const passwordLevel = fieldLevel(password, password.length >= 8);
  const setLevels = useAuthGrowth()?.setLevels;

  useEffect(() => {
    setLevels?.([emailLevel, passwordLevel]);
  }, [emailLevel, passwordLevel, setLevels]);

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
      <header className="space-y-2">
        <h1 className="font-soft text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl">
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
          className="group"
          rightIcon={
            <ArrowRightIcon
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          }
        >
          Iniciar sesión
        </Button>
      </form>

      {}
      <button
        type="button"
        onClick={fillDemoCredentials}
        className="group flex w-full items-center gap-3 rounded-xl border border-border px-3.5 py-3 text-left transition-colors hover:border-primary/50"
      >
        <LeafGlyph
          kind="doing"
          size={22}
          className="shrink-0 transition-transform duration-500 ease-spring group-hover:rotate-12 group-hover:scale-110"
        />
        <span className="flex-1">
          <span className="block text-sm font-medium text-foreground">
            Probar con credenciales demo
          </span>
          <span className="block text-xs text-foreground-muted">
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
