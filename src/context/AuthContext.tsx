'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/config';

export interface UserProfile {
  email: string;
  name: string;
  name_en: string;
  role: 'admin' | 'productor' | 'comprador';
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  isProductor: boolean;
  isComprador: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar credenciales desde localStorage si existen al montar el componente
    const hydrateFromStorage = () => {
      const storedToken = localStorage.getItem('hy_token');
      const storedUser = localStorage.getItem('hy_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    hydrateFromStorage();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      // Guardar en estado
      setToken(data.access_token);
      setUser(data.user);

      // Guardar en localStorage
      localStorage.setItem('hy_token', data.access_token);
      localStorage.setItem('hy_user', JSON.stringify(data.user));
      
      return true;
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hy_token');
    localStorage.removeItem('hy_user');
  };

  const isAdmin = user?.role === 'admin';
  const isProductor = user?.role === 'productor';
  const isComprador = user?.role === 'comprador';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        isAdmin,
        isProductor,
        isComprador,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
