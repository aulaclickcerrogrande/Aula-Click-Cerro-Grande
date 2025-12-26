import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, ArrowLeft } from 'lucide-react';
import BrandTitle from '../components/BrandTitle';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-8 md:py-12 px-4 transition-colors duration-300 relative overflow-hidden">
      {/* Botón Volver */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <ArrowLeft size={20} />
          <span className="font-bold">Volver</span>
        </button>
      </div>
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-block p-3 md:p-4 bg-primary-600 rounded-full mb-3 md:mb-4">
            <LogIn className="text-white" size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Iniciar Sesión</h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-2">Accede a tu cuenta de <BrandTitle className="font-bold italic" /></p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 transition-colors duration-300">
          {error && (
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2 md:space-x-3">
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-red-800 dark:text-red-300 text-xs md:text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" autoComplete="off">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field text-sm md:text-base"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field text-sm md:text-base"
                placeholder="Tu contraseña"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base py-3 md:py-4"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-4 md:mt-6 space-y-2 md:space-y-3">
            <p className="text-gray-600 dark:text-gray-400 text-center text-xs md:text-sm">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300">
                Regístrate aquí
              </Link>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-center text-xs md:text-sm">
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
