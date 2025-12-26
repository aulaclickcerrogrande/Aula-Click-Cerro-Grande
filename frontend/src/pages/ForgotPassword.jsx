import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Mail, ArrowLeft, Key, Lock } from 'lucide-react';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code + Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await authAPI.requestPasswordReset(email);
            setSuccess(response.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al enviar el código');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.resetPassword({
                email,
                code,
                new_password: newPassword
            });
            setSuccess(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cambiar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-6 md:py-12 transition-all duration-500">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 dark:border-gray-700/50 backdrop-blur-sm">
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl md:rounded-full mb-4 shadow-lg shadow-primary-500/20 rotate-3 transform">
                            <Key size={28} className="text-white md:w-8 md:h-8" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                            {step === 1 ? '¿Olvidaste tu clave?' : 'Nueva Contraseña'}
                        </h2>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                            {step === 1
                                ? 'Ingresa tu email para recibir un código de recuperación'
                                : 'Ingresa el código enviado y tu nueva contraseña'}
                        </p>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                        </div>
                    )}

                    {/* Step 1: Request Code */}
                    {step === 1 && (
                        <form onSubmit={handleRequestCode} className="space-y-5 md:space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest px-1">
                                    Correo Electrónico
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all text-sm md:text-base"
                                        placeholder="usuario@ejemplo.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-600/20 active:scale-95"
                            >
                                {loading ? 'Enviando...' : 'Pedir Código'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Reset Password */}
                    {step === 2 && (
                        <form onSubmit={handleResetPassword} className="space-y-4 md:space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest px-1">
                                    Código de Verificación
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                        maxLength="6"
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-center text-3xl font-black tracking-[0.5em] transition-all"
                                        placeholder="000000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest px-1">
                                    Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 border border-gray-100 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm md:text-base transition-all"
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest px-1">
                                    Repetir Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm md:text-base transition-all ${confirmPassword && newPassword !== confirmPassword
                                            ? 'border-red-400'
                                            : 'border-gray-100 dark:border-gray-700'
                                            }`}
                                        placeholder="Confirma tu contraseña"
                                    />
                                </div>
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p className="mt-1 text-[10px] md:text-xs text-red-500 font-bold uppercase tracking-wider px-1">Las contraseñas no coinciden</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !code || !newPassword || newPassword !== confirmPassword}
                                className="w-full bg-primary-600 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-600/20 active:scale-95"
                            >
                                {loading ? 'Restableciendo...' : 'Cambiar Contraseña'}
                            </button>
                        </form>
                    )}

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} className="mr-1" />
                            Volver a Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
