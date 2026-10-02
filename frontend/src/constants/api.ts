export const API_ROUTES = {
  ping: "/ping",

  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },

  projects: {
    index: "/projects",
    store: "/projects",
    show: (id: number | string) => `/projects/${id}`,
    update: (id: number | string) => `/projects/${id}`,
    destroy: (id: number | string) => `/projects/${id}`,
  },

  tasks: {
    index: "/tasks",
    store: "/tasks",
    show: (id: number | string) => `/tasks/${id}`,
    update: (id: number | string) => `/tasks/${id}`,
    destroy: (id: number | string) => `/tasks/${id}`,
  },
} as const;
