import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem('access_token');

      if (token) {
        try {
          // Cargar perfil actualizado desde el backend
          const response = await authAPI.getProfile();
          setUser(response.data);
          // Actualizar localStorage también
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Error al cargar perfil:', error);
          // Si falla, limpiar todo
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    loadUserProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, access, refresh } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      setUser(user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al iniciar sesión'
      };
    }
  };

  const sendVerificationCode = async (data) => {
    try {
      const response = await authAPI.sendVerificationCode(data);
      return { success: true, message: response.data.message, email: response.data.email };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al enviar código de verificación'
      };
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      const response = await authAPI.resendVerificationCode(email);
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al reenviar código'
      };
    }
  };

  const verifyAndRegister = async (email, code) => {
    try {
      const response = await authAPI.verifyAndRegister({ email, code });
      const { user, access, refresh } = response.data;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      setUser(user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al verificar código'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      sendVerificationCode,
      resendVerificationCode,
      verifyAndRegister,
      logout,
      updateUser,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
