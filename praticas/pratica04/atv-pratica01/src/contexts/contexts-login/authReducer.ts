import type { AuthState, AuthAction } from "../types/auth";

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { isAuthenticated: true };

    case "LOGOUT":
      return { isAuthenticated: false };

    default:
      return state;
  }
}