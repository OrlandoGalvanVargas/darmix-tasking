import { createSeed } from "./seed";
import type { LocalDbSchema } from "./types";

const DB_KEY = "task-manager:local-db";

let db: LocalDbSchema | null = null;

export async function initLocalDb(): Promise<void> {
  const stored = localStorage.getItem(DB_KEY);

  if (stored) {
    try {
      db = JSON.parse(stored);
      return;
    } catch {
      console.warn("DB local corrupta. Recreando con datos semilla.");
    }
  }

  db = createSeed();
  persist();
}

function persist(): void {
  if (!db) return;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function getDb(): LocalDbSchema {
  if (!db) throw new Error("Local DB no inicializada.");
  return db;
}

export function saveDb(): void {
  persist();
}

export function resetLocalDb(): void {
  db = createSeed();
  persist();
}
