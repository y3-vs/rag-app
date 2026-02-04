'use client';

import React from 'react';
import { Message, FileAttachment } from '@/app/types';
import { format } from 'date-fns';
import { File, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import 'highlight.js/styles/github-dark.css';

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
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Bot size={16} className="text-white" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-lg lg:max-w-xl xl:max-w-2xl rounded-lg px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none ml-auto'
            : 'bg-slate-800 text-slate-100 rounded-bl-none'
        }`}
      >
        {/* Message Content */}
        <div className="text-sm leading-relaxed break-words prose prose-invert max-w-none">
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeSanitize]}
              components={{
                code({ node, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !className?.includes('language-');
                  return !isInline && match ? (
                    <pre className="bg-slate-900 rounded-lg p-3 overflow-x-auto my-2">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-slate-700 px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {children}
                    </a>
                  );
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-slate-600 pl-4 my-2 italic text-slate-300">
                      {children}
                    </blockquote>
                  );
                },
                ul({ children }) {
                  return <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>;
                },
                h1({ children }) {
                  return <h1 className="text-xl font-bold mb-2 mt-4">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-base font-bold mb-1 mt-2">{children}</h3>;
                },
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-3 border-t border-slate-600 pt-3">
            {message.attachments.map(renderAttachment)}
          </div>
        )}

        {/* Streaming Indicator */}
        {isStreaming && (
          <div className="mt-2 flex gap-1 items-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-ping"></span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-ping" style={{ animationDelay: '0.2s' }}></span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-ping" style={{ animationDelay: '0.4s' }}></span>
            <span className="text-xs opacity-60 ml-1">typing</span>
          </div>
        )}

        {/* Timestamp */}
        {!isStreaming && (
          <span className="text-xs opacity-60 mt-2 block">
            {format(new Date(message.timestamp), 'h:mm a')}
          </span>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
}
