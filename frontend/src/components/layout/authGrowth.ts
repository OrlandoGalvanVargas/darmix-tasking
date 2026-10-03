import { useOutletContext } from "react-router";

export type FieldLevel = 0 | 1 | 2;

export interface AuthOutletContext {
  setLevels: (levels: FieldLevel[]) => void;
}

export function fieldLevel(value: string, looksValid: boolean): FieldLevel {
  if (!value) return 0;
  return looksValid ? 2 : 1;
}

export function useAuthGrowth(): AuthOutletContext | undefined {
  return useOutletContext<AuthOutletContext | undefined>();
}
