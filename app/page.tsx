'use client';

import { useChatStore } from '@/app/lib/rag/chat-store';
import { PROMPT_TEMPLATES } from '@/app/lib/rag/prompts';
import { Layout } from '@/app/components/Layout';
import { ChatHistory } from '@/app/components/ChatHistory';
import { ChatPanel } from '@/app/components/ChatPanel';
import { PromptTemplates } from '@/app/components/PromptTemplates';
import { FileAttachment } from '@/app/types';

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
  } = useChatStore();

  const handleSelectTemplate = () => {
    // This will be called from InputArea when a template is selected
    // The InputArea component will handle populating the input field
  };

  const handleSendMessage = (content: string, attachments: FileAttachment[]) => {
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
        />
      )}
    </Layout>
  );
}
