'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useChatStore } from '@/app/lib/rag/chat-store';
import { PROMPT_TEMPLATES } from '@/app/lib/rag/prompts';
import { Layout } from '@/app/components/Layout';
import { ChatHistory } from '@/app/components/ChatHistory';
import { ChatPanel } from '@/app/components/ChatPanel';
import { PromptTemplates } from '@/app/components/PromptTemplates';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { ErrorMessage, ErrorToast } from '@/app/components/ErrorMessage';
import { WelcomeState, EmptyHistoryState } from '@/app/components/EmptyState';
import { PageSkeleton } from '@/app/components/LoadingStates';
import { FileAttachment, PromptTemplate } from '@/app/types';

// Error type for toast notifications
interface ToastError {
  id: string;
  type: 'network' | 'server' | 'validation' | 'generic';
  message: string;
}

export default function Home() {
  const [externalInputValue, setExternalInputValue] = useState<string>();
  const [errors, setErrors] = useState<ToastError[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const {
    chatHistory,
    currentSessionId,
    currentFileAttachments,
    currentSession,
    isLoading,
    createNewChat,
    loadChatSession,
    addMessage,
    deleteChatSession,
    updateChatTitle,
    attachFile,
    removeAttachment,
  } = useChatStore();

  // Simulate initialization
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const addError = useCallback((message: string, type: ToastError['type'] = 'generic') => {
    const id = Math.random().toString(36).substr(2, 9);
    setErrors((prev) => [...prev, { id, type, message }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setErrors((prev) => prev.filter((e) => e.id !== id));
    }, 5000);
  }, []);

  const dismissError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleSelectTemplate = (template: PromptTemplate) => {
    try {
      setExternalInputValue(template.prompt);
    } catch (error) {
      addError('Failed to apply template. Please try again.', 'generic');
    }
  };

  const handleSendMessage = async (content: string, attachments: FileAttachment[]) => {
    try {
      if (!content.trim() && attachments.length === 0) {
        addError('Please enter a message or attach a file.', 'validation');
        return;
      }
      
      await addMessage('user', content);
      
      // Clear external input value after sending
      setExternalInputValue(undefined);
    } catch (error) {
      addError(
        error instanceof Error ? error.message : 'Failed to send message. Please try again.',
        'network'
      );
    }
  };

  const handleCreateNewChat = () => {
    try {
      createNewChat();
      setExternalInputValue(undefined);
    } catch (error) {
      addError('Failed to create new chat. Please try again.', 'generic');
    }
  };

  const handleAttachFile = async (file: FileAttachment) => {
    try {
      // Check file size (25MB limit)
      if (file.size > 25 * 1024 * 1024) {
        addError('File size exceeds 25MB limit.', 'validation');
        return;
      }
      
      attachFile(file);
    } catch (error) {
      addError('Failed to attach file. Please try again.', 'generic');
    }
  };

  // Show loading skeleton while initializing
  if (isInitializing) {
    return <PageSkeleton />;
  }

  return (
    <ErrorBoundary>
      <Layout
        chatHistory={
          <ChatHistory
            sessions={chatHistory}
            activeSessionId={currentSessionId || undefined}
            onNewChat={handleCreateNewChat}
            onSelectSession={loadChatSession}
            onDeleteSession={deleteChatSession}
            onUpdateSessionTitle={updateChatTitle}
          />
        }
        promptTemplates={
          <PromptTemplates
            templates={PROMPT_TEMPLATES}
            onSelectTemplate={handleSelectTemplate}
          />
        }
      >
        {currentSession ? (
          <ChatPanel
            title={currentSession.title}
            messages={currentSession.messages}
            attachments={currentFileAttachments}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onAddAttachment={handleAttachFile}
            onRemoveAttachment={removeAttachment}
            externalInputValue={externalInputValue}
          />
        ) : (
          <WelcomeState onStart={handleCreateNewChat} />
        )}
      </Layout>
      
      {/* Error Toast Notifications */}
      <ErrorToast errors={errors} onDismiss={dismissError} />
    </ErrorBoundary>
  );
}
