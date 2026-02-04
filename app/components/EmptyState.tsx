'use client';

import React from 'react';
import { 
  MessageSquare, 
  FileText, 
  Upload, 
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      {icon && (
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        {description}
      </p>
      <div className="flex gap-3">
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {action.label}
            <ArrowRight size={16} />
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-lg"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}

// Pre-built empty states for common scenarios

export function EmptyChatState({ onStartChat }: { onStartChat: () => void }) {
  return (
    <EmptyState
      icon={<MessageSquare size={28} className="text-slate-400" />}
      title="Start a conversation"
      description="Send a message or upload a file to begin chatting with the AI assistant."
      action={{
        label: 'New Message',
        onClick: onStartChat,
      }}
    />
  );
}

export function EmptyHistoryState({ onCreateChat }: { onCreateChat: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
        <MessageSquare size={20} className="text-slate-500" />
      </div>
      <h3 className="text-sm font-medium text-slate-300 mb-1">
        No conversations yet
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Start a new chat to begin
      </p>
      <button
        onClick={onCreateChat}
        className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Start Chat
      </button>
    </div>
  );
}

export function EmptySearchState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      icon={<Search size={28} className="text-slate-400" />}
      title="No results found"
      description={`We couldn't find any chats matching "${query}". Try a different search term.`}
      action={{
        label: 'Clear Search',
        onClick: onClear,
      }}
    />
  );
}

export function EmptyFileState({ onUpload }: { onUpload: () => void }) {
  return (
    <EmptyState
      icon={<Upload size={28} className="text-slate-400" />}
      title="No files attached"
      description="Upload documents or images to include them in your conversation."
      action={{
        label: 'Upload File',
        onClick: onUpload,
      }}
    />
  );
}

export function WelcomeState({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-lg mx-auto">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
        <Sparkles size={36} className="text-white" />
      </div>
      <h1 className="text-2xl font-bold text-slate-100 mb-3">
        Welcome to RAG Chat
      </h1>
      <p className="text-slate-400 mb-8 leading-relaxed">
        Your AI-powered assistant for intelligent conversations. 
        Upload documents, ask questions, and get insightful responses 
        powered by advanced language models.
      </p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="bg-slate-800 rounded-lg p-4 text-left">
          <FileText size={20} className="text-blue-400 mb-2" />
          <h4 className="text-sm font-medium text-slate-200 mb-1">Document Analysis</h4>
          <p className="text-xs text-slate-500">Upload and analyze documents</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-left">
          <MessageSquare size={20} className="text-indigo-400 mb-2" />
          <h4 className="text-sm font-medium text-slate-200 mb-1">Smart Chat</h4>
          <p className="text-xs text-slate-500">AI-powered conversations</p>
        </div>
      </div>
      <button
        onClick={onStart}
        className="mt-8 flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Get Started
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
