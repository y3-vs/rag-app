'use client';

import React from 'react';
import { AlertCircle, X, WifiOff, ServerCrash, FileWarning } from 'lucide-react';

export type ErrorType = 'network' | 'server' | 'validation' | 'generic';

interface ErrorMessageProps {
  type?: ErrorType;
  title?: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

const errorConfig = {
  network: {
    icon: WifiOff,
    title: 'Connection Error',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500 bg-opacity-10',
    borderColor: 'border-amber-500 border-opacity-30',
  },
  server: {
    icon: ServerCrash,
    title: 'Server Error',
    color: 'text-red-400',
    bgColor: 'bg-red-500 bg-opacity-10',
    borderColor: 'border-red-500 border-opacity-30',
  },
  validation: {
    icon: FileWarning,
    title: 'Validation Error',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500 bg-opacity-10',
    borderColor: 'border-orange-500 border-opacity-30',
  },
  generic: {
    icon: AlertCircle,
    title: 'Error',
    color: 'text-red-400',
    bgColor: 'bg-red-500 bg-opacity-10',
    borderColor: 'border-red-500 border-opacity-30',
  },
};

export function ErrorMessage({
  type = 'generic',
  title,
  message,
  onDismiss,
  onRetry,
  className = '',
}: ErrorMessageProps) {
  const config = errorConfig[type];
  const Icon = config.icon;
  const displayTitle = title || config.title;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`rounded-lg border p-4 ${config.bgColor} ${config.borderColor} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5 ${config.color}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${config.color}`}>
            {displayTitle}
          </h3>
          <p className="text-sm text-slate-300 mt-1">
            {message}
          </p>
          {(onRetry || onDismiss) && (
            <div className="flex gap-2 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-sm px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  Try Again
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-sm px-3 py-1.5 text-slate-400 hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 rounded"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-slate-400 hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 rounded p-1"
            aria-label="Dismiss error"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

interface ErrorToastProps {
  errors: Array<{
    id: string;
    type?: ErrorType;
    message: string;
  }>;
  onDismiss: (id: string) => void;
}

export function ErrorToast({ errors, onDismiss }: ErrorToastProps) {
  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {errors.map((error) => (
        <ErrorMessage
          key={error.id}
          type={error.type}
          message={error.message}
          onDismiss={() => onDismiss(error.id)}
          className="shadow-lg animate-slide-up"
        />
      ))}
    </div>
  );
}
