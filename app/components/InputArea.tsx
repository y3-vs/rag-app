'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FileAttachment } from '@/app/types';
import { Send, Paperclip, ImageIcon, X } from 'lucide-react';

interface InputAreaProps {
  attachments: FileAttachment[];
  isLoading: boolean;
  onSendMessage: (content: string, attachments: FileAttachment[]) => void;
  onAddAttachment: (file: FileAttachment) => void;
  onRemoveAttachment: (attachmentId: string) => void;
}

export function InputArea({
  attachments,
  isLoading,
  onSendMessage,
  onAddAttachment,
  onRemoveAttachment,
}: InputAreaProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input, attachments);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const attachment: FileAttachment = {
          id: Math.random().toString(36).substr(2, 9),
          filename: file.name,
          type: file.type.startsWith('image') ? 'image' : 'document',
          size: file.size,
          content: event.target?.result as string,
        };
        onAddAttachment(attachment);
      };

      if (file.type.startsWith('image')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });

    // Reset input
    e.currentTarget.value = '';
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file' && items[i].type.startsWith('image')) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const attachment: FileAttachment = {
              id: Math.random().toString(36).substr(2, 9),
              filename: `image-${Date.now()}.png`,
              type: 'image',
              size: file.size,
              content: event.target?.result as string,
            };
            onAddAttachment(attachment);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  return (
    <div className="border-t border-slate-700 bg-slate-900 p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded border border-slate-600"
            >
              {attachment.type === 'image' ? (
                <ImageIcon size={16} className="text-slate-400" />
              ) : (
                <Paperclip size={16} className="text-slate-400" />
              )}
              <span className="text-sm truncate max-w-xs">{attachment.filename}</span>
              <button
                onClick={() => onRemoveAttachment(attachment.id)}
                className="ml-2 p-1 hover:bg-slate-700 rounded transition-colors"
              >
                <X size={14} className="text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-3 items-end">
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.txt,.doc,.docx"
        />

        {/* File Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-2 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
          title="Upload file"
        >
          <Paperclip size={20} className="text-slate-400" />
        </button>

        {/* Message Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Type your message... (Shift+Enter for new line)"
          disabled={isLoading}
          className="flex-1 bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-4 py-3 resize-none disabled:opacity-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[50px]"
          rows={1}
          style={{ maxHeight: '200px', overflowY: 'auto' }}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
