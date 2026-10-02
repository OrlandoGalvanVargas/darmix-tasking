export const ROUTES = {
  login: "/login",
  register: "/register",
  projects: "/projects",
  project: (id: number | string) => `/projects/${id}`,
} as const;
