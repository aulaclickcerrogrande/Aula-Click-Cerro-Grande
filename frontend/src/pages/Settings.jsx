import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI, authAPI, uploadAPI } from '../services/api';
import DashboardSidebar from '../components/DashboardSidebar';
import { User, Mail, Phone, BookOpen, LogOut, X, QrCode } from 'lucide-react';

const Settings = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(user);
    const [myCourses, setMyCourses] = useState([]);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [qrUploading, setQrUploading] = useState({ yape: false, plin: false });
    const [qrError, setQrError] = useState('');

    useEffect(() => {
        loadUserProfile();
        loadMyCourses();
    }, []);

    const loadUserProfile = async () => {
        try {
            const response = await authAPI.getProfile();
            setCurrentUser(response.data);
            // Actualizar también el contexto de auth
            updateUser(response.data);
        } catch (error) {
            console.error('Error al cargar perfil:', error);
        }
    };

    const loadMyCourses = async () => {
        try {
            const response = await courseAPI.getMyCourses();
            setMyCourses(response.data);
        } catch (error) {
            console.error('Error al cargar cursos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const coursesGratuitos = myCourses.filter(c => !c.is_paid);
    const coursesPagados = myCourses.filter(c => c.is_paid);

    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-900">
            <DashboardSidebar />

            <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-8">
                <h1 className="text-xl md:text-2xl font-normal text-gray-800 dark:text-gray-100 mb-6 md:mb-8">Configuración</h1>

                {/* Información Personal */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
                    <h2 className="text-base md:text-lg font-medium text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center">
                        <User size={18} className="mr-2 flex-shrink-0" />
                        Información Personal
                    </h2>

                    <div className="space-y-3 md:space-y-4">
                        <div className="flex items-start">
                            <Mail size={16} className="text-gray-500 dark:text-gray-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Correo Electrónico</p>
                                <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 font-medium truncate">{currentUser?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <User size={16} className="text-gray-500 dark:text-gray-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Nombres</p>
                                <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 font-medium break-words">
                                    {currentUser?.first_name} {currentUser?.middle_name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <User size={16} className="text-gray-500 dark:text-gray-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Apellidos</p>
                                <p className="text-sm md:text-base text-gray-900 dark:text-gray-100 font-medium break-words">
                                    {currentUser?.last_name} {currentUser?.second_last_name}
                                </p>
                            </div>
                        </div>

                        {currentUser?.phone && (
                            <div className="flex items-start">
                                <Phone size={16} className="text-gray-500 dark:text-gray-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                                    <p className="text-gray-900 dark:text-gray-100 font-medium">{currentUser.phone}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Métodos de Pago - Solo para docentes */}
                {currentUser?.role === 'teacher' && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                            <QrCode size={20} className="mr-2" />
                            Métodos de Pago (QR)
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Sube los códigos QR de tus billeteras digitales para que los estudiantes puedan realizar el pago de tus cursos.
                        </p>

                        {qrError && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-600 dark:text-red-400">
                                <X size={18} className="mr-2" />
                                <span className="text-sm">{qrError}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Yape */}
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Código QR Yape</label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                                    {currentUser?.yape_qr ? (
                                        <div className="relative inline-block">
                                            <img src={currentUser.yape_qr} alt="QR Yape" className="w-48 h-48 object-contain mx-auto rounded-lg shadow-sm" />
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await authAPI.updateProfile({ yape_qr: null });
                                                        loadUserProfile();
                                                    } catch (error) {
                                                        console.error('Error al quitar QR Yape:', error);
                                                    }
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <input
                                                type="file"
                                                id="yape-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    // Validación de tipo de archivo
                                                    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                                                    if (!allowedTypes.includes(file.type)) {
                                                        setQrError('Por favor, selecciona una imagen válida (JPG, PNG, WebP).');
                                                        return;
                                                    }

                                                    setQrError('');
                                                    setQrUploading(prev => ({ ...prev, yape: true }));
                                                    try {
                                                        const uploadRes = await uploadAPI.uploadFile(file, 'image');
                                                        await authAPI.updateProfile({ yape_qr: uploadRes.data.url });
                                                        await loadUserProfile();
                                                        alert('QR de Yape actualizado correctamente.');
                                                    } catch (error) {
                                                        console.error('Error al subir QR Yape:', error);
                                                        const serverMsg = error.response?.data?.error || error.response?.data?.detail;
                                                        const fieldErrors = error.response?.data && typeof error.response.data === 'object'
                                                            ? Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join(', ')
                                                            : null;
                                                        const msg = serverMsg || fieldErrors || error.message || 'Error al subir el QR de Yape. Inténtalo de nuevo.';
                                                        setQrError(msg);
                                                    } finally {
                                                        setQrUploading(prev => ({ ...prev, yape: false }));
                                                    }
                                                }}
                                            />
                                            <label htmlFor="yape-upload" className={`cursor-pointer flex flex-col items-center space-y-2 ${qrUploading.yape ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-600 dark:text-primary-400">
                                                    {qrUploading.yape ? (
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                                                    ) : (
                                                        <QrCode size={24} />
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {qrUploading.yape ? 'Subiendo...' : 'Click para subir QR de Yape'}
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Plin */}
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Código QR Plin</label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                                    {currentUser?.plin_qr ? (
                                        <div className="relative inline-block">
                                            <img src={currentUser.plin_qr} alt="QR Plin" className="w-48 h-48 object-contain mx-auto rounded-lg shadow-sm" />
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await authAPI.updateProfile({ plin_qr: null });
                                                        loadUserProfile();
                                                    } catch (error) {
                                                        console.error('Error al quitar QR Plin:', error);
                                                    }
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <input
                                                type="file"
                                                id="plin-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    // Validación de tipo de archivo
                                                    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
                                                    if (!allowedTypes.includes(file.type)) {
                                                        setQrError('Por favor, selecciona una imagen válida (JPG, PNG, WebP).');
                                                        return;
                                                    }

                                                    setQrError('');
                                                    setQrUploading(prev => ({ ...prev, plin: true }));
                                                    try {
                                                        const uploadRes = await uploadAPI.uploadFile(file, 'image');
                                                        await authAPI.updateProfile({ plin_qr: uploadRes.data.url });
                                                        await loadUserProfile();
                                                        alert('QR de Plin actualizado correctamente.');
                                                    } catch (error) {
                                                        console.error('Error al subir QR Plin:', error);
                                                        const serverMsg = error.response?.data?.error || error.response?.data?.detail;
                                                        const fieldErrors = error.response?.data && typeof error.response.data === 'object'
                                                            ? Object.entries(error.response.data).map(([k, v]) => `${k}: ${v}`).join(', ')
                                                            : null;
                                                        const msg = serverMsg || fieldErrors || error.message || 'Error al subir el QR de Plin. Inténtalo de nuevo.';
                                                        setQrError(msg);
                                                    } finally {
                                                        setQrUploading(prev => ({ ...prev, plin: false }));
                                                    }
                                                }}
                                            />
                                            <label htmlFor="plin-upload" className={`cursor-pointer flex flex-col items-center space-y-2 ${qrUploading.plin ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-full text-primary-600 dark:text-primary-400">
                                                    {qrUploading.plin ? (
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                                                    ) : (
                                                        <QrCode size={24} />
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {qrUploading.plin ? 'Subiendo...' : 'Click para subir QR de Plin'}
                                                </span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mis Cursos - Solo para estudiantes */}
                {currentUser?.role === 'student' && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                            <BookOpen size={20} className="mr-2" />
                            Mis Cursos Inscritos
                        </h2>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : myCourses.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">No estás inscrito en ningún curso aún.</p>
                        ) : (
                            <div className="space-y-4">
                                {/* Cursos Gratuitos */}
                                {coursesGratuitos.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Cursos Gratuitos ({coursesGratuitos.length})
                                        </h3>
                                        <ul className="space-y-2">
                                            {coursesGratuitos.map((course) => (
                                                <li key={course.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                    <span className="text-gray-900 dark:text-gray-100">{course.title}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                                                        Gratuito
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Cursos de Pago */}
                                {coursesPagados.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Cursos de Pago ({coursesPagados.length})
                                        </h3>
                                        <ul className="space-y-2">
                                            {coursesPagados.map((course) => (
                                                <li key={course.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded">
                                                    <span className="text-gray-900 dark:text-gray-100">{course.title}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                                                        S/ {course.price}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Cerrar Sesión */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sesión</h2>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </main>

            {/* Modal de Confirmación de Cierre de Sesión */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Confirmar Cierre de Sesión</h3>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            ¿Estás seguro que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder a tus cursos.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
