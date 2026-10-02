import axios from "axios";
import { env } from "@/config/env";
import { API_ROUTES } from "@/constants/api";

export type Mode = "remote" | "local";

let mode: Mode | null = null;
let initPromise: Promise<Mode> | null = null;

export function initMode(): Promise<Mode> {
  if (initPromise) return initPromise;

  initPromise = detect();
  return initPromise;
}

async function detect(): Promise<Mode> {
  if (env.VITE_API_MODE === "local") {
    mode = "local";
    return mode;
  }
  if (env.VITE_API_MODE === "remote") {
    mode = "remote";
    return mode;
  }

  try {
    const res = await axios.get(`${env.VITE_API_URL}${API_ROUTES.ping}`, {
      timeout: 3000,
      headers: { Accept: "application/json" },
    });

    const ok = res.data?.success === true && res.data?.message === "pong";
    mode = ok ? "remote" : "local";
  } catch {
    mode = "local";
  }

  return mode;
}

export function getMode(): Mode {
  if (!mode)
    throw new Error("Repository no inicializado. Llama a initMode() primero.");
  return mode;
}

export function isLocalMode(): boolean {
  return getMode() === "local";
}
