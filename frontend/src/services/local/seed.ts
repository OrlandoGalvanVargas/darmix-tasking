import type {
  LocalDbSchema,
  LocalProject,
  LocalTask,
  LocalUser,
} from "./types";

export function createSeed(): LocalDbSchema {
  const now = new Date().toISOString();

  const users: LocalUser[] = [
    {
      id: 1,
      name: "Darmix",
      email: "demo@darmixista.test",
      password: "password123",
      created_at: now,
    },
    {
      id: 2,
      name: "Jambi",
      email: "otro@darmixista.test",
      password: "password123",
      created_at: now,
    },
  ];

  const projects: LocalProject[] = [
    {
      id: 1,
      user_id: 1,
      name: "Rediseño Web Corporativo",
      description:
        "Modernización del sitio principal con enfoque en UX y performance.",
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      user_id: 1,
      name: "App Móvil de Tareas",
      description:
        "Aplicación nativa para iOS y Android con sincronización offline.",
      created_at: now,
      updated_at: now,
    },
    {
      id: 3,
      user_id: 1,
      name: "Migración a la Nube",
      description:
        "Evaluación de proveedores cloud y plan de migración por fases.",
      created_at: now,
      updated_at: now,
    },
    {
      id: 4,
      user_id: 2,
      name: "Proyecto del Otro Usuario",
      description: "Este proyecto solo lo ve el segundo usuario.",
      created_at: now,
      updated_at: now,
    },
  ];

  const tasks: LocalTask[] = [
    {
      id: 1,
      project_id: 1,
      title: "Diseñar wireframes",
      description: "Baja fidelidad de las 5 vistas principales.",
      status: "completed",
      priority: "high",
      due_date: shiftDays(-10),
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      project_id: 1,
      title: "Implementar landing",
      description: null,
      status: "in_progress",
      priority: "high",
      due_date: shiftDays(5),
      created_at: now,
      updated_at: now,
    },
    {
      id: 3,
      project_id: 1,
      title: "Configurar CI/CD",
      description: "GitHub Actions con deploy automático.",
      status: "pending",
      priority: "medium",
      due_date: shiftDays(15),
      created_at: now,
      updated_at: now,
    },
    {
      id: 4,
      project_id: 1,
      title: "Optimizar imágenes",
      description: null,
      status: "pending",
      priority: "low",
      due_date: shiftDays(20),
      created_at: now,
      updated_at: now,
    },
    {
      id: 5,
      project_id: 1,
      title: "Documentar componentes",
      description: null,
      status: "in_progress",
      priority: "medium",
      due_date: shiftDays(7),
      created_at: now,
      updated_at: now,
    },

    {
      id: 6,
      project_id: 2,
      title: "Definir arquitectura",
      description: null,
      status: "completed",
      priority: "high",
      due_date: shiftDays(-5),
      created_at: now,
      updated_at: now,
    },
    {
      id: 7,
      project_id: 2,
      title: "Configurar Firebase",
      description: null,
      status: "completed",
      priority: "high",
      due_date: shiftDays(-2),
      created_at: now,
      updated_at: now,
    },
    {
      id: 8,
      project_id: 2,
      title: "Pantalla de login",
      description: "Autenticación biométrica + email.",
      status: "in_progress",
      priority: "high",
      due_date: shiftDays(3),
      created_at: now,
      updated_at: now,
    },
    {
      id: 9,
      project_id: 2,
      title: "Push notifications",
      description: null,
      status: "pending",
      priority: "medium",
      due_date: shiftDays(12),
      created_at: now,
      updated_at: now,
    },
    {
      id: 10,
      project_id: 2,
      title: "Publicar en TestFlight",
      description: null,
      status: "pending",
      priority: "low",
      due_date: shiftDays(30),
      created_at: now,
      updated_at: now,
    },

    {
      id: 11,
      project_id: 4,
      title: "Tarea privada A",
      description: null,
      status: "pending",
      priority: "medium",
      due_date: shiftDays(10),
      created_at: now,
      updated_at: now,
    },
    {
      id: 12,
      project_id: 4,
      title: "Tarea privada B",
      description: null,
      status: "completed",
      priority: "high",
      due_date: shiftDays(-1),
      created_at: now,
      updated_at: now,
    },
  ];

  return {
    users,
    projects,
    tasks,
    sequences: {
      users: users.length,
      projects: projects.length,
      tasks: tasks.length,
    },
  };
}

function shiftDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
