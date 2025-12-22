import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authAPI } from '../services/api';
import { LogOut, Home, BookOpen, User, LayoutDashboard, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);
  const [refreshKey, setRefreshKey] = useState(0);

  // Actualizar currentUser cuando cambia user del contexto
  useEffect(() => {
    console.log('User del contexto cambió:', user);
    setCurrentUser(user);
    setRefreshKey(prev => prev + 1); // Forzar re-render
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Log para debug
  console.log('Renderizando Navbar con currentUser:', currentUser);

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/20 dark:border-gray-700/20 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Aula Click Cerro Grande"
              className="h-12 w-auto rounded-xl shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{ display: 'none' }}>
              <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">AC</span>
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-primary-700 dark:text-primary-400">Aula Click</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Cerro Grande</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Botón de modo oscuro */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? "Modo claro" : "Modo oscuro"}
            >
              {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
            </button>

            <div className="flex items-center space-x-6">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div key={`user-${refreshKey}-${currentUser?.id}`} className="hidden md:block text-right">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{currentUser.username}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {currentUser.role === 'teacher' ? 'Docente' : 'Estudiante'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <Home size={20} />
                    <span>Inicio</span>
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 py-2 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors font-semibold"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
