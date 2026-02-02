'use client';

import React from 'react';
import { Message, FileAttachment } from '@/app/types';
import { format } from 'date-fns';
import { File } from 'lucide-react';

interface MessageDisplayProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageDisplay({ message, isStreaming = false }: MessageDisplayProps) {
  const isUser = message.role === 'user';

  const renderAttachment = (attachment: FileAttachment) => {
    if (attachment.type === 'image' && attachment.content) {
      return (
        <div key={attachment.id} className="mt-2">
          <img
            src={attachment.content}
            alt={attachment.filename}
            className="max-w-xs rounded-lg border border-slate-600"
          />
          <p className="text-xs text-slate-400 mt-1">{attachment.filename}</p>
        </div>
      );
    }

    return (
      <div
        key={attachment.id}
        className="mt-2 flex items-center gap-2 p-2 bg-slate-800 rounded border border-slate-600"
      >
        <File size={16} className="text-slate-400" />
        <span className="flex-1 text-sm truncate">{attachment.filename}</span>
        <span className="text-xs text-slate-500">{(attachment.size / 1024).toFixed(1)}KB</span>
      </div>
    );
  };

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
          AI
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-md rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-slate-800 text-slate-100 rounded-bl-none'
        }`}
      >
        {/* Message Content */}
        <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.content}
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 border-t border-slate-600 pt-3">
            {message.attachments.map(renderAttachment)}
          </div>
        )}

        {/* Streaming Indicator */}
        {isStreaming && (
          <div className="mt-2 flex gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-current opacity-60 animate-pulse"></span>
            <span className="inline-block w-2 h-2 rounded-full bg-current opacity-60 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="inline-block w-2 h-2 rounded-full bg-current opacity-60 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs opacity-70 mt-2 block">
          {format(new Date(message.timestamp), 'HH:mm')}
        </span>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
          U
        </div>
      )}
    </div>
  );
}
