import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authAPI } from '../services/api';
import { LogOut, Home, BookOpen, User, LayoutDashboard, Moon, Sun, Menu, X, Info } from 'lucide-react';

const Navbar = () => {
  const { user, logout, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Actualizar currentUser cuando cambia user del contexto
  useEffect(() => {
    console.log('User del contexto cambió:', user);
    setCurrentUser(user);
    setRefreshKey(prev => prev + 1);
  }, [user]);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  console.log('Renderizando Navbar con currentUser:', currentUser);

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/20 dark:border-gray-700/20 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3" onClick={() => setMobileMenuOpen(false)}>
            <img
              src="/logo.png"
              alt="Aula Click Cerro Grande"
              className="h-10 md:h-12 w-auto rounded-xl shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{ display: 'none' }}>
              <div className="h-10 md:h-12 w-10 md:w-12 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg md:text-xl">AC</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-primary-700 dark:text-primary-400 leading-tight">
                Aula Click <br /> Cerro Grande
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? "Modo claro" : "Modo oscuro"}
            >
              {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div key={`user-${refreshKey}-${currentUser?.id}`} className="text-right">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{currentUser.username}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {currentUser.role === 'teacher' ? 'Docente' : 'Estudiante'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Home size={20} />
                  <span>Inicio</span>
                </Link>
                <Link
                  to="/nosotros"
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Info size={20} />
                  <span>¿Quiénes somos?</span>
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors font-semibold"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? "Modo claro" : "Modo oscuro"}
            >
              {isDark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {currentUser ? (
              <div className="space-y-3">
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{currentUser.username}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {currentUser.role === 'teacher' ? 'Docente' : 'Estudiante'}
                  </p>
                </div>
                <Link
                  to={currentUser.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <LayoutDashboard size={20} />
                    <span>Mi Dashboard</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Home size={20} />
                    <span>Inicio</span>
                  </div>
                </Link>
                <Link
                  to="/nosotros"
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Info size={20} />
                    <span>¿Quiénes somos?</span>
                  </div>
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors font-semibold text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-semibold text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
