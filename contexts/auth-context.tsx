'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Usuario, LoginCredentials, RegisterData, ApiResponse, AuthResponse } from '@/types';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar sesion del localStorage al montar
    const savedToken = localStorage.getItem('token');
    const savedUsuario = localStorage.getItem('usuario');
    
    if (savedToken && savedUsuario) {
      try {
        setToken(savedToken);
        setUsuario(JSON.parse(savedUsuario));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data: ApiResponse<AuthResponse> = await res.json();
      
      if (data.success && data.data) {
        setUsuario(data.data.usuario);
        setToken(data.data.token);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('usuario', JSON.stringify(data.data.usuario));
        return { success: true };
      }
      
      return { success: false, error: data.error || 'Error al iniciar sesion' };
    } catch {
      return { success: false, error: 'Error de conexion' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result: ApiResponse<AuthResponse> = await res.json();
      
      if (result.success && result.data) {
        setUsuario(result.data.usuario);
        setToken(result.data.token);
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('usuario', JSON.stringify(result.data.usuario));
        return { success: true };
      }
      
      return { success: false, error: result.error || 'Error al registrarse' };
    } catch {
      return { success: false, error: 'Error de conexion' };
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  const isAdmin = usuario?.rol_nombre === 'admin' || usuario?.id_rol === 1;

  return (
    <AuthContext.Provider value={{ usuario, token, isLoading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
