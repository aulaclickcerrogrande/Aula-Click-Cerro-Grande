import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authAPI } from '../services/api';
import { LogOut, Home, BookOpen, User, LayoutDashboard, Moon, Sun, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/20 dark:border-gray-700/20 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3" onClick={() => setIsMenuOpen(false)}>
            <img
              src="/logo.png"
              alt="Aula Click"
              className="h-10 md:h-12 w-auto rounded-xl shadow-md"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-primary-700 dark:text-primary-400 leading-tight">Aula Click</h1>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Cerro Grande</p>
            </div>
          </Link>

          {/* Desktop & Mobile Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user.username}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {user.role === 'teacher' ? 'Docente' : 'Estudiante'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
                  >
                    <LogOut size={18} />
                    <span>Salir</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="px-4 py-2 text-primary-600 dark:text-primary-400 font-semibold">
                    Entrar
                  </Link>
                  <Link to="/register" className="px-5 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700">
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 animate-in slide-in-from-top duration-200">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {user ? (
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                  <p className="font-bold text-gray-900 dark:text-white">{user.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.role === 'teacher' ? 'Docente' : 'Estudiante'}
                  </p>
                </div>
                <Link
                  to={user.role === 'teacher' ? '/teacher' : '/student'}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                >
                  <LayoutDashboard size={20} />
                  <span className="font-semibold">Mi Panel</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-semibold">Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-4 text-center font-bold text-gray-700 dark:text-gray-200 border-2 border-gray-100 dark:border-gray-800 rounded-2xl"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-4 text-center font-bold text-white bg-primary-600 rounded-2xl shadow-lg shadow-primary-200 dark:shadow-none"
                >
                  Crear Cuenta Gratis
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
