import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z
    .string()
    .min(1, "VITE_API_URL es requerido")
    .refine(
      (v) =>
        v.startsWith("/") ||
        v.startsWith("http://") ||
        v.startsWith("https://"),
      {
        message:
          "VITE_API_URL debe ser una URL absoluta o una ruta relativa (ej. /api)",
      },
    ),
  VITE_API_MODE: z.enum(["auto", "remote", "local"]).default("auto"),
});

export type ApiMode = z.infer<typeof envSchema>["VITE_API_MODE"];

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error(
    "Error en variables de entorno:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error(
    "Configuración de entorno inválida. Revisa .env (ver .env.example).",
  );
}

export const env = parsed.data;
