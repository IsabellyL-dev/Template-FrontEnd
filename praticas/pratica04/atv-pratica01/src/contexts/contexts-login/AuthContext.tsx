import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../../adapters/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { isAuthenticated: true, user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

interface AuthContextValue {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restaura sessão do localStorage ao carregar
  useEffect(() => {
    const token = localStorage.getItem('chronos_token');
    const userRaw = localStorage.getItem('chronos_user');
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw) as User;
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } catch {
        localStorage.removeItem('chronos_token');
        localStorage.removeItem('chronos_user');
      }
    }
  }, []);

  async function login(email: string, password: string) {
    const data = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    localStorage.setItem('chronos_token', data.token);
    localStorage.setItem('chronos_user', JSON.stringify(data.user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: data });
  }

  async function register(name: string, email: string, password: string) {
    const data = await api.post<{ token: string; user: User }>('/auth/register', { name, email, password });
    localStorage.setItem('chronos_token', data.token);
    localStorage.setItem('chronos_user', JSON.stringify(data.user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: data });
  }

  function logout() {
    localStorage.removeItem('chronos_token');
    localStorage.removeItem('chronos_user');
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
