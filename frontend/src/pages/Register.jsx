import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, Mail, RefreshCw } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1); // 1: Formulario, 2: Verificación
  const [formData, setFormData] = useState({
    full_name: '',
    full_lastname: '',
    email: '',
    password: '',
    password2: '',
    phone: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { sendVerificationCode, resendVerificationCode, verifyAndRegister } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  // Parser de nombres para compatibilidad con backend
  const parseNames = (fullName, fullLastname) => {
    const nameParts = fullName.trim().split(' ').filter(p => p);
    const lastnameParts = fullLastname.trim().split(' ').filter(p => p);

    return {
      first_name: nameParts[0] || '',
      middle_name: nameParts.slice(1).join(' ') || '',
      last_name: lastnameParts[0] || '',
      second_last_name: lastnameParts.slice(1).join(' ') || 'N/A'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validar contraseñas
    if (formData.password !== formData.password2) {
      setErrors({ password2: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    // Parsear nombres antes de enviar
    const parsedNames = parseNames(formData.full_name, formData.full_lastname);
    const dataToSend = {
      ...parsedNames,
      email: formData.email,
      password: formData.password,
      phone: formData.phone
    };

    const result = await sendVerificationCode(dataToSend);

    if (result.success) {
      setStep(2);
      setCountdown(60);
    } else {
      setErrors({ general: result.error });
    }
    setLoading(false);
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setLoading(true);
    const result = await resendVerificationCode(formData.email);

    if (result.success) {
      setCountdown(60);
      setErrors({ success: result.message });
    } else {
      setErrors({ general: result.error });
    }
    setLoading(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = await verifyAndRegister(formData.email, verificationCode);

    if (result.success) {
      navigate('/student/dashboard');
    } else {
      setErrors({ general: result.error });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-primary-600 rounded-full mb-4">
            <UserPlus className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Crear Cuenta</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Regístrate como estudiante</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 transition-colors duration-300">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800 dark:text-red-300 text-sm">{errors.general}</p>
            </div>
          )}

          {errors.success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-3">
              <Mail className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-green-800 dark:text-green-300 text-sm">{errors.success}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nombres Completos *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Ej: Juan Carlos"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ingresa todos tus nombres separados por espacios
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Apellidos Completos *
                </label>
                <input
                  type="text"
                  name="full_lastname"
                  value={formData.full_lastname}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Ej: Pérez García"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ingresa todos tus apellidos separados por espacios
                </p>
              </div>

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
                  Teléfono (Opcional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+51 999 999 999"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="Contraseña segura"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    className={`input-field ${errors.password2 ? 'border-red-500 dark:border-red-400' : ''}`}
                    placeholder="Repite tu contraseña"
                    required
                  />
                  {errors.password2 && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.password2}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando código...' : 'Enviar Código de Verificación'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="text-center mb-6">
                <Mail className="inline-block text-primary-600 dark:text-primary-400 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verifica tu Email</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enviamos un código de 6 dígitos a<br />
                  <strong className="text-gray-900 dark:text-white">{formData.email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Código de Verificación
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verificando...' : 'Completar Registro'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={countdown > 0 || loading}
                  className="inline-flex items-center space-x-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={16} />
                  <span>
                    {countdown > 0
                      ? `Reenviar código en ${countdown}s`
                      : 'Reenviar código'}
                  </span>
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  ← Volver al formulario
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
