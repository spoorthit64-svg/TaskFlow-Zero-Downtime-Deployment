import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          bgColor: 'bg-white',
          borderColor: 'border-emerald-500/30',
          accent: 'bg-emerald-500',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          bgColor: 'bg-white',
          borderColor: 'border-rose-500/30',
          accent: 'bg-rose-500',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          bgColor: 'bg-white',
          borderColor: 'border-amber-500/30',
          accent: 'bg-amber-500',
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
          bgColor: 'bg-white',
          borderColor: 'border-blue-500/30',
          accent: 'bg-blue-500',
        };
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const config = getToastConfig(toast.type);
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${config.bgColor} ${config.borderColor} transition-all duration-300 animate-slide-in relative overflow-hidden`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accent}`} />
            {config.icon}
            <div className="flex-1 text-sm font-medium text-slate-800 pr-2">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-slate-100"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};