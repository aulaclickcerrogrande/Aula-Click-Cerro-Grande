import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const VoucherActionModal = ({ show, action, notes, onNotesChange, onCancel, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-700 transform transition-all animate-in fade-in zoom-in duration-200">
                <div className="text-center">
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${action === 'approve' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                        }`}>
                        {action === 'approve' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {action === 'approve' ? '¿Aprobar Voucher?' : '¿Rechazar Voucher?'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {action === 'approve'
                            ? 'El estudiante tendrá acceso inmediato al curso una vez aprobado.'
                            : 'Explica el motivo del rechazo para que el estudiante pueda corregirlo.'}
                    </p>

                    {action === 'reject' && (
                        <div className="mb-6">
                            <textarea
                                value={notes}
                                onChange={(e) => onNotesChange(e.target.value)}
                                placeholder="Ej: La imagen está borrosa, el monto no coincide, etc."
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px] resize-none"
                                autoFocus
                            />
                        </div>
                    )}
                    <div className="flex space-x-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors text-sm font-bold shadow-sm ${action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            {action === 'approve' ? 'Sí, Aprobar' : 'Sí, Rechazar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoucherActionModal;
