import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { registerSchema, type RegisterForm } from "@/schemas/auth";
import { useRegisterMutation } from "@/hooks/useAuthMutations";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { LeafGlyph } from "@/components/projects/GrowthBranch";
import { fieldLevel, useAuthGrowth } from "@/components/layout/authGrowth";
import {
  MailIcon,
  LockIcon,
  UserIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";
import { ROUTES } from "@/constants/routes";
import { ApiError } from "@/services/http/ApiError";
import { getPasswordStrength } from "@/lib/passwordStrength";
import { cn } from "@/lib/cn";

export default function Register() {
  const navigate = useNavigate();
  const [rootError, setRootError] = useState<string | null>(null);
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setError,
    control,
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

  const name = useWatch({ control, name: "name" }) ?? "";
  const email = useWatch({ control, name: "email" }) ?? "";
  const passwordValue = useWatch({ control, name: "password" }) ?? "";
  const confirmation =
    useWatch({ control, name: "password_confirmation" }) ?? "";
  const strength = getPasswordStrength(passwordValue);

  const nameLevel = fieldLevel(name, name.trim().length >= 2);
  const emailLevel = fieldLevel(email, /^\S+@\S+\.\S+$/.test(email));
  const passwordLevel = fieldLevel(passwordValue, passwordValue.length >= 8);
  const confirmationLevel = fieldLevel(
    confirmation,
    confirmation.length > 0 && confirmation === passwordValue,
  );
  const setLevels = useAuthGrowth()?.setLevels;

  useEffect(() => {
    setLevels?.([nameLevel, emailLevel, passwordLevel, confirmationLevel]);
  }, [nameLevel, emailLevel, passwordLevel, confirmationLevel, setLevels]);

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
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-soft text-4xl font-medium leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Crea tu cuenta
        </h1>
        <p className="text-sm text-foreground-muted">
          Empieza a organizar tus proyectos en segundos
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          label="Nombre"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre"
          leftIcon={<UserIcon size={18} />}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          leftIcon={<MailIcon size={18} />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="space-y-2">
          <PasswordInput
            label="Contraseña"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            leftIcon={<LockIcon size={18} />}
            error={errors.password?.message}
            {...register("password")}
          />

          {}
          {passwordValue && !errors.password && (
            <div
              className="animate-fade-in flex items-center gap-2.5"
              aria-live="polite"
            >
              <span className="flex items-center gap-1" aria-hidden="true">
                {[1, 2, 3].map((n) => {
                  const filled = strength.level >= n;
                  return (
                    <span
                      key={`${n}-${filled}`}
                      className={cn("block", filled && "leaf-pop")}
                      style={{ ["--delay" as string]: `${n * 40}ms` }}
                    >
                      <LeafGlyph kind={filled ? "done" : "todo"} size={16} />
                    </span>
                  );
                })}
              </span>
              <p className="text-xs font-medium text-foreground-muted">
                Seguridad:{" "}
                <span className="text-foreground">{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        <PasswordInput
          label="Confirmar contraseña"
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          leftIcon={<LockIcon size={18} />}
          error={errors.password_confirmation?.message}
          {...register("password_confirmation")}
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
          Crear cuenta
        </Button>
      </form>

      <p className="text-center text-sm text-foreground-muted">
        ¿Ya tienes cuenta?{" "}
        <Link
          to={ROUTES.login}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
