export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface TokenData {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
}

export interface AuthData {
  user: User;
  token: TokenData;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
