import { createContext, useContext, useReducer } from "react";
import { authReducer } from "./authReducer";
import { MOCK_USER } from "../constants/auth";
import type { AuthContextType, AuthState } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  isAuthenticated: sessionStorage.getItem("auth") === "true",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(username: string, password: string): boolean {
    if (
      username === MOCK_USER.username &&
      password === MOCK_USER.password
    ) {
      dispatch({ type: "LOGIN" });
      sessionStorage.setItem("auth", "true");
      return true;
    }
    return false;
  }

  function logout() {
    dispatch({ type: "LOGOUT" });
    sessionStorage.removeItem("auth");
  }

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro do provider");
  return context;
}