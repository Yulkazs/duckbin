"use client";

import { ReactNode, useEffect } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
  autoRemove?: boolean;
  duration?: number;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  autoRemove?: boolean;
  duration?: number;
}

const ToastItem: React.FC<ToastProps> = ({
  toast,
  onRemove,
  autoRemove = true,
  duration = 3000
}) => {
  useEffect(() => {
    if (autoRemove) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, onRemove, autoRemove, duration]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check size={16} className="text-green-400" />;
      case 'error':
        return <X size={16} className="text-red-400" />;
      case 'warning':
        return <AlertCircle size={16} className="text-orange-400" />;
      case 'info':
        return <Info size={16} className="text-blue-400" />;
      default:
        return <Info size={16} className="text-blue-400" />;
    }
  };

  const getAccentColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      case 'warning':
        return 'border-orange-500';
      case 'info':
        return 'border-blue-500';
      default:
        return 'border-blue-500';
    }
  };

  const getBackgroundGradient = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-gradient-to-r from-[#141414] from-70% to-[#101910]';
      case 'error':
        return 'bg-gradient-to-r from-[#141414] from-70% to-[#191010]';
      case 'warning':
        return 'bg-gradient-to-r from-[#141414] from-70% to-[#191610]';
      case 'info':
        return 'bg-gradient-to-r from-[#141414] from-70% to-[#101119]';
      default:
        return 'bg-gradient-to-r from-[#141414] from-70% to-[#101119]';
    }
  };

  return (
    <div
      className={`
        ${getBackgroundGradient()} 
        rounded-lg shadow-2xl backdrop-blur-sm transition-all duration-300 
        border-l-4 ${getAccentColor()}
        transform translate-x-0 opacity-100
        animate-in slide-in-from-right-full
      `}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {getIcon()}
        <span className="text-sm font-medium text-gray-200 flex-1">
          {toast.message}
        </span>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          aria-label="Close notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
  position = 'top-right',
  autoRemove = true,
  duration = 3000
}) => {
  if (toasts.length === 0) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed z-50 space-y-2 ${getPositionClasses()}`}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
          autoRemove={autoRemove}
          duration={duration}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const addToast = (message: string, type: Toast['type'] = 'info'): Toast => {
    const id = Math.random().toString(36).substring(7);
    return { id, message, type };
  };

  const removeToast = (toasts: Toast[], id: string): Toast[] => {
    return toasts.filter(toast => toast.id !== id);
  };

  return {
    addToast,
    removeToast
  };
};

// Simple Toast component for single use
interface SimpleToastProps {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  autoRemove?: boolean;
  duration?: number;
}

export const SimpleToast: React.FC<SimpleToastProps> = ({
  isVisible,
  message,
  type,
  onClose,
  position = 'top-right',
  autoRemove = true,
  duration = 3000
}) => {
  useEffect(() => {
    if (isVisible && autoRemove) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, autoRemove, duration]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check size={16} className="text-green-400" />;
      case 'error':
        return <X size={16} className="text-red-400" />;
      case 'warning':
        return <AlertCircle size={16} className="text-orange-400" />;
      case 'info':
        return <Info size={16} className="text-blue-400" />;
      default:
        return <Info size={16} className="text-blue-400" />;
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      case 'warning':
        return 'border-orange-500';
      case 'info':
        return 'border-blue-500';
      default:
        return 'border-blue-500';
    }
  };

  const getBackgroundGradient = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-[#141414] from-70% to-[#101910]';
      case 'error':
        return 'bg-gradient-to-r from-[#141414] from-70% to-[#191010]';
      case 'warning':
        return 'bg-gradient-to-r from-[#141414] from-70% to-[#191610]';
      case 'info':
        return 'bg-gradient-to-r from-[#141414] from-70% to-[#101119]';
      default:
        return 'bg-gradient-to-r from-[#141414] from-70% to-[#101119]';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      <div
        className={`
          ${getBackgroundGradient()} 
          rounded-lg shadow-2xl backdrop-blur-sm transition-all duration-300 
          border-l-4 ${getAccentColor()}
          transform translate-x-0 opacity-100
          animate-in slide-in-from-right-full
        `}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {getIcon()}
          <span className="text-sm font-medium text-gray-200 flex-1">
            {message}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};