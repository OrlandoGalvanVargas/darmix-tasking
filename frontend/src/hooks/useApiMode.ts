import { useEffect, useState } from "react";
import { getMode, type Mode } from "@/services/repository";

export function useApiMode(): Mode {
  const [mode] = useState<Mode>(() => {
    try {
      return getMode();
    } catch {
      return "remote";
    }
  });

  useEffect(() => {}, [mode]);

  return mode;
}
