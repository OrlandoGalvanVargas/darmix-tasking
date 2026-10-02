import { API_ROUTES } from "@/constants/api";
import { http } from "@/services/http/client";
import type { ApiSuccess } from "@/types/api";
import type {
  AuthData,
  LoginPayload,
  RegisterPayload,
  TokenData,
  User,
} from "@/types/auth";

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthData> {
    const { data } = await http.post<ApiSuccess<AuthData>>(
      API_ROUTES.auth.register,
      payload,
    );
    return data.data;
  },

  async login(payload: LoginPayload): Promise<AuthData> {
    const { data } = await http.post<ApiSuccess<AuthData>>(
      API_ROUTES.auth.login,
      payload,
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await http.post(API_ROUTES.auth.logout);
  },

  async me(): Promise<User> {
    const { data } = await http.get<ApiSuccess<User>>(API_ROUTES.auth.me);
    return data.data;
  },

  async refresh(): Promise<TokenData> {
    const { data } = await http.post<ApiSuccess<TokenData>>(
      API_ROUTES.auth.refresh,
    );
    return data.data;
  },
};
