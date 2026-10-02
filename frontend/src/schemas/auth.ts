import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Ingresa un correo válido")
    .max(255, "El correo es demasiado largo"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Mínimo 2 caracteres")
      .max(255, "Máximo 255 caracteres"),
    email: z
      .email("Ingresa un correo válido")
      .max(255, "El correo es demasiado largo"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .max(255, "Máximo 255 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
