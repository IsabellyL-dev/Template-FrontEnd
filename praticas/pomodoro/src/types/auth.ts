export interface AuthState {
  isAuthenticated: boolean;
}

export type AuthAction =
  | { type: "LOGIN" }
  | { type: "LOGOUT" };

export interface AuthContextType {
  state: AuthState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}