import { STORAGE_KEYS } from "@/constants/storage";

export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(STORAGE_KEYS.token);
  },
  set(token: string): void {
    localStorage.setItem(STORAGE_KEYS.token, token);
  },
  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.token);
  },
};
