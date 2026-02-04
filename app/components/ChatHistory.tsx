'use client';

import React, { useState } from 'react';
import { ChatSession } from '@/app/types';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeSessionId?: string;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onUpdateSessionTitle: (sessionId: string, title: string) => void;
}

export function ChatHistory({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onUpdateSessionTitle,
}: ChatHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startEdit = (session: ChatSession) => {
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const finishEdit = (sessionId: string) => {
    if (editTitle.trim()) {
      onUpdateSessionTitle(sessionId, editTitle);
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full" role="navigation" aria-label="Chat history">
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 w-full p-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg m-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Start a new chat"
      >
        <Plus size={18} aria-hidden="true" />
        New Chat
      </button>

      {/* Chat List */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        role="region"
        aria-label="Chat sessions list"
      >
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-slate-400 text-sm" role="status">
            No chats yet. Start a new conversation!
          </div>
        ) : (
          <ul 
            className="space-y-2 px-3 pb-4"
            role="listbox"
            aria-label="Chat sessions"
          >
            {sessions.map((session) => (
              <li
                key={session.id}
                className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                  activeSessionId === session.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
                role="option"
                aria-selected={activeSessionId === session.id}
                aria-label={`Chat: ${session.title}${activeSessionId === session.id ? ' (active)' : ''}`}
              >
                {editingId === session.id ? (
                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 bg-slate-800 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') finishEdit(session.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      aria-label="Edit chat title"
                    />
                    <button
                      onClick={() => finishEdit(session.id)}
                      className="p-1 hover:bg-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Save title"
                      title="Save"
                    >
                      <Check size={14} aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 hover:bg-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Cancel editing"
                      title="Cancel"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onSelectSession(session.id)}
                      className="flex-1 text-left text-sm truncate focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 -ml-1"
                      title={session.title}
                      aria-label={`Open chat: ${session.title}`}
                    >
                      {session.title}
                    </button>
                    <button
                      onClick={() => startEdit(session)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600 rounded transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Rename chat: ${session.title}`}
                      title="Rename chat"
                    >
                      <Edit2 size={14} aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Delete chat: ${session.title}`}
                      title="Delete chat"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
