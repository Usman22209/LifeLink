export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  accessToken: string | null;
  expiresAt: number | null;
  user: User | null;
}
