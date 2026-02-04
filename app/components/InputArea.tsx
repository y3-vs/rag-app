'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FileAttachment } from '@/app/types';
import { Send, Paperclip, ImageIcon, X, Upload } from 'lucide-react';

interface InputAreaProps {
  attachments: FileAttachment[];
  isLoading: boolean;
  onSendMessage: (content: string, attachments: FileAttachment[]) => void;
  onAddAttachment: (file: FileAttachment) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  externalInputValue?: string;
}

export function InputArea({
  attachments,
  isLoading,
  onSendMessage,
  onAddAttachment,
  onRemoveAttachment,
  externalInputValue,
}: InputAreaProps) {
  const [input, setInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Update input when external value is provided
  useEffect(() => {
    if (externalInputValue !== undefined) {
      setInput(externalInputValue);
    }
  }, [externalInputValue]);

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
    processFiles(e.currentTarget.files);
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

  const processFiles = useCallback((files: FileList | null) => {
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
  }, [onAddAttachment]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  return (
    <div
      ref={dropZoneRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative border-t border-slate-700 bg-slate-900 p-4"
      role="region"
      aria-label="Message input area"
    >
      {/* Drag and Drop Overlay */}
      {isDragging && (
        <div 
          className="absolute inset-0 bg-blue-600 bg-opacity-20 border-2 border-dashed border-blue-500 rounded-lg z-10 flex items-center justify-center"
          role="alert"
          aria-live="polite"
        >
          <div className="text-center">
            <Upload size={48} className="text-blue-400 mx-auto mb-2" aria-hidden="true" />
            <p className="text-blue-200 font-medium">Drop files here to upload</p>
          </div>
        </div>
      )}
      
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap" role="list" aria-label="Attached files">
          {attachments.map((attachment, index) => (
            <div
              key={attachment.id}
              className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded border border-slate-600"
              role="listitem"
              aria-label={`${attachment.type} attachment: ${attachment.filename}`}
            >
              {attachment.type === 'image' ? (
                <ImageIcon size={16} className="text-slate-400" aria-hidden="true" />
              ) : (
                <Paperclip size={16} className="text-slate-400" aria-hidden="true" />
              )}
              <span className="text-sm truncate max-w-xs">{attachment.filename}</span>
              <button
                onClick={() => onRemoveAttachment(attachment.id)}
                className="ml-2 p-1 hover:bg-slate-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Remove attachment ${attachment.filename}`}
                title={`Remove ${attachment.filename}`}
              >
                <X size={14} className="text-slate-400" aria-hidden="true" />
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
          aria-hidden="true"
          tabIndex={-1}
        />

        {/* File Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="p-2 hover:bg-slate-800 rounded transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Upload file attachment"
          title="Upload file (accepts images, PDF, TXT, DOC, DOCX)"
          type="button"
        >
          <Paperclip size={20} className="text-slate-400" aria-hidden="true" />
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
          className="flex-1 bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-4 py-3 resize-none disabled:opacity-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 min-h-[50px]"
          rows={1}
          style={{ maxHeight: '200px', overflowY: 'auto' }}
          aria-label="Message input"
          aria-multiline="true"
          aria-disabled={isLoading}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label={isLoading ? "Sending message" : "Send message"}
          title="Send message (Enter)"
          type="button"
        >
          <Send size={20} aria-hidden="true" />
        </button>
      </div>
      
      {/* Keyboard shortcuts hint for screen readers */}
      <span className="sr-only">
        Press Enter to send message. Press Shift Enter for a new line.
        Use the upload button or drag and drop files to attach them.
      </span>
    </div>
  );
}
