import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "../auth";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
    }
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts valid registration", () => {
    const result = registerSchema.safeParse({
      name: "Juan Pérez",
      email: "juan@example.com",
      password: "secret123",
      password_confirmation: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "Juan",
      email: "juan@example.com",
      password: "secret123",
      password_confirmation: "otra-cosa",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) =>
          i.path.includes("password_confirmation"),
        ),
      ).toBe(true);
    }
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      name: "Juan",
      email: "juan@example.com",
      password: "123",
      password_confirmation: "123",
    });
    expect(result.success).toBe(false);
  });
});
