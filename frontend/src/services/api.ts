import { getMode } from "./repository";
import { authService } from "./auth/authService";
import { projectService } from "./projects/projectService";
import { taskService } from "./tasks/taskService";
import { localAuthService } from "./local/localAuthService";
import { localProjectService } from "./local/localProjectService";
import { localTaskService } from "./local/localTaskService";

function isLocal(): boolean {
  return getMode() === "local";
}

export const api = {
  auth: {
    login: (p: Parameters<typeof authService.login>[0]) =>
      isLocal() ? localAuthService.login(p) : authService.login(p),
    register: (p: Parameters<typeof authService.register>[0]) =>
      isLocal() ? localAuthService.register(p) : authService.register(p),
    logout: () =>
      isLocal() ? localAuthService.logout() : authService.logout(),
    me: () => (isLocal() ? localAuthService.me() : authService.me()),
    refresh: () =>
      isLocal() ? localAuthService.refresh() : authService.refresh(),
  },

  projects: {
    list: (p?: Parameters<typeof projectService.list>[0]) =>
      isLocal() ? localProjectService.list(p) : projectService.list(p),
    show: (id: number) =>
      isLocal() ? localProjectService.show(id) : projectService.show(id),
    create: (p: Parameters<typeof projectService.create>[0]) =>
      isLocal() ? localProjectService.create(p) : projectService.create(p),
    update: (id: number, p: Parameters<typeof projectService.update>[1]) =>
      isLocal()
        ? localProjectService.update(id, p)
        : projectService.update(id, p),
    remove: (id: number) =>
      isLocal() ? localProjectService.remove(id) : projectService.remove(id),
  },

  tasks: {
    list: (p?: Parameters<typeof taskService.list>[0]) =>
      isLocal() ? localTaskService.list(p) : taskService.list(p),
    show: (id: number) =>
      isLocal() ? localTaskService.show(id) : taskService.show(id),
    create: (p: Parameters<typeof taskService.create>[0]) =>
      isLocal() ? localTaskService.create(p) : taskService.create(p),
    update: (id: number, p: Parameters<typeof taskService.update>[1]) =>
      isLocal() ? localTaskService.update(id, p) : taskService.update(id, p),
    remove: (id: number) =>
      isLocal() ? localTaskService.remove(id) : taskService.remove(id),
  },
};
