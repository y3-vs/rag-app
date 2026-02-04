'use client';

import React, { useEffect, useRef } from 'react';
import { Message, FileAttachment } from '@/app/types';
import { MessageDisplay } from './MessageDisplay';
import { InputArea } from './InputArea';
import { MoreVertical, Loader2 } from 'lucide-react';

interface ChatPanelProps {
  title: string;
  messages: Message[];
  attachments: FileAttachment[];
  isLoading: boolean;
  onSendMessage: (content: string, attachments: FileAttachment[]) => void;
  onAddAttachment: (file: FileAttachment) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  externalInputValue?: string;
}

export function ChatPanel({
  title,
  messages,
  attachments,
  isLoading,
  onSendMessage,
  onAddAttachment,
  onRemoveAttachment,
  externalInputValue,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">{title || 'New Chat'}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-200">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-lg font-medium mb-2">Start a conversation</h2>
            <p className="text-sm">Type a message or select a prompt template to begin</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageDisplay
                key={message.id}
                message={message}
                isStreaming={isLoading && index === messages.length - 1 && message.role === 'assistant'}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
        
        {/* Loading Indicator */}
        {isLoading && messages.length > 0 && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
              AI
            </div>
            <div className="flex items-center gap-1 px-4 py-3 bg-slate-800 text-slate-100 rounded-lg rounded-bl-none">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <InputArea
        attachments={attachments}
        isLoading={isLoading}
        onSendMessage={onSendMessage}
        onAddAttachment={onAddAttachment}
        onRemoveAttachment={onRemoveAttachment}
        externalInputValue={externalInputValue}
      />
    </div>
  );
}
