import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md min-w-[300px] animate-[slideInRight_0.3s_ease-out]
            ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100' : ''}
            ${toast.type === 'error' ? 'bg-red-950/90 border-red-500/50 text-red-100' : ''}
            ${toast.type === 'info' ? 'bg-blue-950/90 border-blue-500/50 text-blue-100' : ''}
          `}
        >
          <div className={`
            p-1.5 rounded-full shrink-0
            ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : ''}
            ${toast.type === 'error' ? 'bg-red-500/20 text-red-400' : ''}
            ${toast.type === 'info' ? 'bg-blue-500/20 text-blue-400' : ''}
          `}>
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
          </div>
          
          <div className="flex-1 text-sm font-medium">{toast.message}</div>
          
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;