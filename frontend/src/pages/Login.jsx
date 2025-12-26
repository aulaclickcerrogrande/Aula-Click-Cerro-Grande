import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      setLoading(false);

      if (result.success) {
        if (result.user.role === 'teacher') {
          navigate('/teacher/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        setError(result.error || 'Algo no cuadra. Revisa que tu email y contraseña estén bien escritos.');
      }
    } catch (err) {
      console.error('Error en handleSubmit:', err);
      setLoading(false);
      setError('Ups, hubo un problema al conectar. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-primary-600 rounded-full mb-4">
            <LogIn className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Accede a tu cuenta de Aula Click</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 transition-colors duration-300">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Tu contraseña"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-gray-600 dark:text-gray-400 text-center">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300">
                Regístrate aquí
              </Link>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              ¿Olvidaste tu contraseña?{' '}
              <Link to="/forgot-password" className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300">
                Recupérala aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
