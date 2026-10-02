import { ApiError } from "@/services/http/ApiError";
import type {
  AuthData,
  LoginPayload,
  RegisterPayload,
  TokenData,
  User,
} from "@/types/auth";
import { getDb, saveDb } from "./db";
import { getLocalUserId, toPublicUser } from "./mappers";
import { simulateDelay } from "./simulate";

function unauthorized(): ApiError {
  return new ApiError({
    message: "Credenciales inválidas.",
    code: "UNAUTHENTICATED",
    status: 401,
  });
}

function buildToken(userId: number): TokenData {
  return {
    access_token: `local-token-${userId}`,
    token_type: "bearer",
    expires_in: 3600,
  };
}

export const localAuthService = {
  async login(payload: LoginPayload): Promise<AuthData> {
    await simulateDelay(300);
    const db = getDb();
    const email = payload.email.toLowerCase().trim();

    const user = db.users.find(
      (u) => u.email === email && u.password === payload.password,
    );
    if (!user) throw unauthorized();

    return {
      user: toPublicUser(user),
      token: buildToken(user.id),
    };
  },

  async register(payload: RegisterPayload): Promise<AuthData> {
    await simulateDelay(300);
    const db = getDb();
    const email = payload.email.toLowerCase().trim();

    if (db.users.some((u) => u.email === email)) {
      throw new ApiError({
        message: "Los datos proporcionados no son válidos.",
        code: "VALIDATION_ERROR",
        status: 422,
        errors: { email: ["El correo ya está registrado."] },
      });
    }

    const nextId = ++db.sequences.users;
    const newUser = {
      id: nextId,
      name: payload.name.trim(),
      email,
      password: payload.password,
      created_at: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDb();

    return {
      user: toPublicUser(newUser),
      token: buildToken(newUser.id),
    };
  },

  async logout(): Promise<void> {
    await simulateDelay(100);
  },

  async me(): Promise<User> {
    await simulateDelay(150);
    const userId = getLocalUserId();
    if (!userId) throw unauthorized();

    const user = getDb().users.find((u) => u.id === userId);
    if (!user) throw unauthorized();

    return toPublicUser(user);
  },

  async refresh(): Promise<TokenData> {
    await simulateDelay(150);
    const userId = getLocalUserId();
    if (!userId) throw unauthorized();
    return buildToken(userId);
  },
};
