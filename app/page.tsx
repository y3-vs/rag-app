'use client';

import { useChatStore } from '@/app/lib/rag/chat-store';
import { PROMPT_TEMPLATES } from '@/app/lib/rag/prompts';
import { Layout } from '@/app/components/Layout';
import { ChatHistory } from '@/app/components/ChatHistory';
import { ChatPanel } from '@/app/components/ChatPanel';
import { PromptTemplates } from '@/app/components/PromptTemplates';
import { PromptTemplate } from '@/app/types';

export default function Home() {
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
    clearAttachments,
  } = useChatStore();

  const handleSelectTemplate = (template: PromptTemplate) => {
    // This will be called from InputArea when a template is selected
    // The InputArea component will handle populating the input field
  };

  const handleSendMessage = (content: string) => {
    addMessage('user', content);
  };

  return (
    <Layout
      chatHistory={
        <ChatHistory
          sessions={chatHistory}
          activeSessionId={currentSessionId || undefined}
          onNewChat={createNewChat}
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
      {currentSession && (
        <ChatPanel
          title={currentSession.title}
          messages={currentSession.messages}
          attachments={currentFileAttachments}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onAddAttachment={attachFile}
          onRemoveAttachment={removeAttachment}
          onClearAttachments={clearAttachments}
        />
      )}
    </Layout>
  );
}
