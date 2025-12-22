import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, BookOpen, Users, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { voucherAPI } from '../services/api';
import VoucherActionModal from './VoucherActionModal';

const DashboardSidebar = () => {
    const location = useLocation();
    const { user } = useAuth();
    const isTeacher = user?.role === 'teacher';
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [voucherConfirm, setVoucherConfirm] = useState({ show: false, id: null, action: null, notes: '' });

    useEffect(() => {
        if (isTeacher) {
            loadVouchers();
            // Escuchar si alguien más procesa vouchers para recargar
            window.addEventListener('voucher-processed', loadVouchers);
            return () => window.removeEventListener('voucher-processed', loadVouchers);
        }
    }, [isTeacher]);

    const loadVouchers = async () => {
        setLoading(true);
        try {
            const response = await voucherAPI.getAll();
            setVouchers(response.data.filter(v => v.status === 'pending'));
        } catch (error) {
            console.error('Error al cargar vouchers en sidebar:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVoucherAction = (id, action) => {
        setVoucherConfirm({ show: true, id, action, notes: '' });
    };

    const confirmVoucherAction = async () => {
        const { id, action, notes } = voucherConfirm;
        try {
            if (action === 'approve') {
                await voucherAPI.approve(id, notes);
            } else {
                await voucherAPI.reject(id, notes);
            }
            setVoucherConfirm({ show: false, id: null, action: null, notes: '' });
            loadVouchers();
            // Notificar a otros componentes (ej: Dashboard)
            window.dispatchEvent(new CustomEvent('voucher-processed'));
        } catch (error) {
            console.error('Error al procesar voucher:', error);
            alert('Error al procesar el voucher');
        }
    };

    const menuItems = [
        {
            icon: Home,
            label: 'Página principal',
            path: isTeacher ? '/teacher/dashboard' : '/student/dashboard',
            key: 'home'
        },
        ...(!isTeacher ? [{
            icon: BookOpen,
            label: 'Explorar Cursos',
            path: '/courses',
            key: 'courses'
        }] : []),
        ...(isTeacher ? [{
            icon: Users,
            label: 'Gestionar Estudiantes',
            path: '/teacher/students',
            key: 'students'
        }] : []),
        {
            icon: Settings,
            label: 'Configuración',
            path: '/settings',
            key: 'settings'
        },
    ];

    const isActive = (path) => {
        if (path === '#') return false;
        return location.pathname === path;
    };

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-16 z-10">
            <nav className="py-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.key}
                            to={item.path}
                            className={`
                flex items-center space-x-3 px-6 py-3 transition-colors
                ${active
                                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-r-4 border-blue-700 dark:border-blue-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
              `}
                        >
                            <Icon size={20} className={active ? 'text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'} />
                            <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Sección de Vouchers para Docentes (Solo si hay pendientes) */}
            {isTeacher && vouchers.length > 0 && (
                <div className="mt-8 px-4 flex-1 flex flex-col h-[calc(100%-350px)]">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                            <AlertCircle size={14} className="mr-2" />
                            Vouchers Pendientes
                        </h3>
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                            {vouchers.length}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pb-6">
                        {loading && vouchers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 opacity-50">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mb-2"></div>
                            </div>
                        ) : (
                            vouchers.map((voucher) => (
                                <div key={voucher.id} className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-primary-500 dark:hover:border-primary-500 transition-all group">
                                    <div className="mb-2">
                                        <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 mb-0.5 truncate uppercase">
                                            {voucher.course_title}
                                        </p>
                                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                                            {voucher.student_name}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-3 gap-2">
                                        <a
                                            href={voucher.voucher_image}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 rounded-md border border-transparent hover:border-blue-200 transition-all"
                                            title="Ver comprobante"
                                        >
                                            <Eye size={16} />
                                        </a>

                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => handleVoucherAction(voucher.id, 'reject')}
                                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                title="Rechazar"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleVoucherAction(voucher.id, 'approve')}
                                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded-md transition-colors shadow-sm"
                                            >
                                                Aprobar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <VoucherActionModal
                show={voucherConfirm.show}
                action={voucherConfirm.action}
                notes={voucherConfirm.notes}
                onNotesChange={(val) => setVoucherConfirm(prev => ({ ...prev, notes: val }))}
                onCancel={() => setVoucherConfirm({ show: false, id: null, action: null, notes: '' })}
                onConfirm={confirmVoucherAction}
            />
        </aside>
    );
};

export default DashboardSidebar;
