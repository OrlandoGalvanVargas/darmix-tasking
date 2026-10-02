import { initMode } from "@/services/repository";
import { initLocalDb } from "@/services/local/db";

export async function bootstrap(): Promise<void> {
  const mode = await initMode();

  if (mode === "local") {
    await initLocalDb();
    console.info("Modo demo local activo");
  }
}
