export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  token: string | null;
  sessionId: string | null;
  user: User | null;
}
