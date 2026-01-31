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
    <div className="flex flex-col h-full">
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 w-full p-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg m-3 transition-colors"
      >
        <Plus size={18} />
        New Chat
      </button>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="p-4 text-center text-slate-400 text-sm">
            No chats yet. Start a new conversation!
          </div>
        ) : (
          <ul className="space-y-2 px-3 pb-4">
            {sessions.map((session) => (
              <li
                key={session.id}
                className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                  activeSessionId === session.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                {editingId === session.id ? (
                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 bg-slate-800 text-white px-2 py-1 rounded text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') finishEdit(session.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                    />
                    <button
                      onClick={() => finishEdit(session.id)}
                      className="p-1 hover:bg-slate-600 rounded"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 hover:bg-slate-600 rounded"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => onSelectSession(session.id)}
                      className="flex-1 text-left text-sm truncate"
                      title={session.title}
                    >
                      {session.title}
                    </button>
                    <button
                      onClick={() => startEdit(session)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600 rounded transition-opacity"
                      title="Rename"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-opacity"
                      title="Delete"
                    >
                      <Trash2 size={14} />
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
