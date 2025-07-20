"use client";

import { ReactNode } from 'react';

interface ConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const Confirmation: React.FC<ConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Understood!',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'danger':
        return 'border-red-500';
      case 'warning':
        return 'border-orange-500';
      case 'info':
        return 'border-blue-500';
      default:
        return 'border-red-500';
    }
  };

  const getBackgroundGradient = () => {
    switch (type) {
      case 'danger':
        return 'bg-gradient-to-b from-[#141414] from-70% to-[#191010]';
      case 'warning':
        return 'bg-gradient-to-b from-[#141414] from-70% to-[#191610]';
      case 'info':
        return 'bg-gradient-to-b from-[#141414] from-70% to-[#101119]';
      default:
        return 'bg-gradient-to-b from-[#141414] from-70% to-[#191010]';
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 disabled:bg-red-400';
      case 'warning':
        return 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400';
      case 'info':
        return 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400';
      default:
        return 'bg-red-500 hover:bg-red-600 disabled:bg-red-400';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={handleBackdropClick}
    >
      <div className={`${getBackgroundGradient()} rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 relative border-l-4 ${getAccentColor()}`}>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3">
          {title}
        </h3>

        {/* Message */}
        <div className="text-gray-300 mb-6 leading-relaxed">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors disabled:cursor-not-allowed ${getButtonStyles()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};