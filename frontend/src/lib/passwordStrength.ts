export type StrengthLevel = 0 | 1 | 2 | 3;

export interface Strength {
  level: StrengthLevel;
  label: string;
  color: string;
  width: string;
}

export function getPasswordStrength(password: string): Strength {
  if (!password) {
    return { level: 0, label: "Muy corta", color: "bg-border", width: "w-0" };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length < 8 || score <= 1) {
    return { level: 1, label: "Débil", color: "bg-danger", width: "w-1/3" };
  }
  if (score <= 3) {
    return { level: 2, label: "Media", color: "bg-warning", width: "w-2/3" };
  }
  return { level: 3, label: "Fuerte", color: "bg-success", width: "w-full" };
}
