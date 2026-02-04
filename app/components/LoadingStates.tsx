'use client';

import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function LoadingState({
  message = 'Loading...',
  size = 'md',
  fullScreen = false,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-slate-900 bg-opacity-90 z-50'
    : 'w-full h-full min-h-[200px]';

  return (
    <div
      className={`${containerClasses} flex flex-col items-center justify-center`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2
        className={`${sizeClasses[size]} text-blue-500 animate-spin mb-3`}
        aria-hidden="true"
      />
      <span className="text-slate-400 text-sm">{message}</span>
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className = '' }: LoadingDotsProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span
        className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-slate-700 rounded animate-pulse ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* User message skeleton */}
      <div className="flex justify-end">
        <div className="max-w-[70%] space-y-2">
          <Skeleton className="h-16 w-64 rounded-lg" />
        </div>
      </div>
      
      {/* Assistant message skeleton */}
      <div className="flex justify-start gap-3">
        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        <div className="max-w-[70%] space-y-2">
          <Skeleton className="h-20 w-80 rounded-lg" />
          <Skeleton className="h-12 w-48 rounded-lg" />
        </div>
      </div>
      
      {/* User message skeleton */}
      <div className="flex justify-end">
        <div className="max-w-[70%] space-y-2">
          <Skeleton className="h-12 w-40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="h-screen flex">
      {/* Sidebar skeleton */}
      <div className="w-64 bg-slate-800 border-r border-slate-700 p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-full" count={5} />
      </div>
      
      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b border-slate-700 p-4 flex items-center">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex-1">
          <ChatSkeleton />
        </div>
        <div className="h-24 border-t border-slate-700 p-4">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
      
      {/* Right panel skeleton */}
      <div className="w-64 bg-slate-800 border-l border-slate-700 p-4 space-y-4 hidden lg:block">
        <Skeleton className="h-8 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 w-full" count={6} />
        </div>
      </div>
    </div>
  );
}

interface StreamingIndicatorProps {
  className?: string;
}

export function StreamingIndicator({ className = '' }: StreamingIndicatorProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label="AI is typing">
      <span
        className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"
        style={{ animationDelay: '0ms', animationDuration: '1s' }}
      />
      <span
        className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"
        style={{ animationDelay: '0.2s', animationDuration: '1s' }}
      />
      <span
        className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"
        style={{ animationDelay: '0.4s', animationDuration: '1s' }}
      />
      <span className="text-xs text-slate-400 ml-1">typing</span>
    </div>
  );
}

export function InitializingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="relative">
        <div className="w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full animate-ping absolute" />
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center relative">
          <Sparkles size={28} className="text-white" />
        </div>
      </div>
      <p className="text-slate-400 text-sm">Initializing AI assistant...</p>
    </div>
  );
}
