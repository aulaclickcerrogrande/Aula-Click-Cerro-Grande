import React, { useEffect, useState } from 'react';
import { voucherAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, X, Bell } from 'lucide-react';

const VoucherNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.role === 'student') {
            loadNotifications();
        }
    }, [user]);

    const loadNotifications = async () => {
        try {
            const response = await voucherAPI.getAll();
            // Filtrar vouchers aprobados o rechazados que no han sido vistos
            const filtered = response.data.filter(v =>
                (v.status === 'approved' || v.status === 'rejected') && !v.is_seen
            );
            setNotifications(filtered);
        } catch (error) {
            console.error('Error al cargar notificaciones de vouchers:', error);
        }
    };

    const handleDismiss = async (notificationId) => {
        try {
            await voucherAPI.markAsSeen(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error('Error al marcar notificación como vista:', error);
            // Si falla la API, al menos lo quitamos del estado local para no molestar al usuario en esta sesión
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        }
    };

    if (!user || user.role !== 'student' || notifications.length === 0) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 mt-4 space-y-3">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className={`flex items-center justify-between p-4 rounded-xl border shadow-sm transition-all animate-in slide-in-from-top-2 duration-300 ${n.status === 'approved'
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 text-green-800 dark:text-green-300'
                            : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 text-red-800 dark:text-red-300'
                        }`}
                >
                    <div className="flex items-center space-x-3">
                        {n.status === 'approved' ? (
                            <CheckCircle className="flex-shrink-0 text-green-600 dark:text-green-400" size={24} />
                        ) : (
                            <XCircle className="flex-shrink-0 text-red-600 dark:text-red-400" size={24} />
                        )}
                        <div>
                            <p className="font-bold text-sm md:text-base">
                                {n.status === 'approved' ? '¡Inscripción Aprobada!' : 'Inscripción Rechazada'}
                            </p>
                            <p className="text-xs md:text-sm opacity-90">
                                Tu pago para el curso <span className="font-semibold">"{n.course_title}"</span> ha sido {n.status === 'approved' ? 'aprobado. ¡Ya puedes empezar a estudiar!' : 'rechazado.'}
                                {n.notes && <span className="block mt-1 italic">Nota: {n.notes}</span>}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDismiss(n.id)}
                        className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                        title="Cerrar aviso"
                    >
                        <X size={20} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default VoucherNotifications;
