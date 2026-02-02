'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { ChatSession, Message, FileAttachment } from '@/app/types';

interface ChatStore {
  // State
  chatHistory: ChatSession[];
  currentSessionId: string | null;
  currentFileAttachments: FileAttachment[];
  isLoading: boolean;
  error: string | null;

  // Computed
  currentSession: ChatSession | undefined;

  // Actions
  createNewChat: () => string;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  deleteChatSession: (id: string) => void;
  loadChatSession: (id: string) => void;
  updateChatTitle: (id: string, title: string) => void;
  attachFile: (file: FileAttachment) => void;
  removeAttachment: (fileId: string) => void;
  clearAttachments: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearChatHistory: () => void;
}

const createInitialSession = (): ChatSession => ({
  id: uuidv4(),
  title: 'New Chat',
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

const initialSession = createInitialSession();

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial State
      chatHistory: [initialSession],
      currentSessionId: initialSession.id,
      currentFileAttachments: [],
      isLoading: false,
      error: null,

      // Computed State
      get currentSession() {
        const { chatHistory, currentSessionId } = get();
        return chatHistory.find((session) => session.id === currentSessionId);
      },

      // Actions
      createNewChat: () => {
        const newSession = createInitialSession();
        set((state) => ({
          chatHistory: [...state.chatHistory, newSession],
          currentSessionId: newSession.id,
          currentFileAttachments: [],
          error: null,
        }));
        return newSession.id;
      },

      addMessage: (role: 'user' | 'assistant', content: string) => {
        set((state) => {
          const sessionId = state.currentSessionId;
          if (!sessionId) return state;

          const newMessage: Message = {
            id: uuidv4(),
            role,
            content,
            timestamp: new Date(),
            attachments: role === 'user' ? [...state.currentFileAttachments] : undefined,
          };

          const updatedHistory = state.chatHistory.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, newMessage],
                  updatedAt: new Date(),
                }
              : session
          );

          // Clear attachments after user message is sent
          const clearedAttachments = role === 'user' ? [] : state.currentFileAttachments;

          return {
            chatHistory: updatedHistory,
            currentFileAttachments: clearedAttachments,
          };
        });
      },

      deleteChatSession: (id: string) => {
        set((state) => {
          const updatedHistory = state.chatHistory.filter((session) => session.id !== id);
          const isCurrentSession = state.currentSessionId === id;

          return {
            chatHistory: updatedHistory.length > 0 ? updatedHistory : [createInitialSession()],
            currentSessionId: isCurrentSession
              ? updatedHistory[0]?.id || createInitialSession().id
              : state.currentSessionId,
            currentFileAttachments: isCurrentSession ? [] : state.currentFileAttachments,
          };
        });
      },

      loadChatSession: (id: string) => {
        set(() => ({
          currentSessionId: id,
          currentFileAttachments: [],
          error: null,
        }));
      },

      updateChatTitle: (id: string, title: string) => {
        set((state) => ({
          chatHistory: state.chatHistory.map((session) =>
            session.id === id
              ? { ...session, title, updatedAt: new Date() }
              : session
          ),
        }));
      },

      attachFile: (file: FileAttachment) => {
        set((state) => ({
          currentFileAttachments: [...state.currentFileAttachments, file],
        }));
      },

      removeAttachment: (fileId: string) => {
        set((state) => ({
          currentFileAttachments: state.currentFileAttachments.filter(
            (file) => file.id !== fileId
          ),
        }));
      },

      clearAttachments: () => {
        set(() => ({
          currentFileAttachments: [],
        }));
      },

      setLoading: (isLoading: boolean) => {
        set(() => ({
          isLoading,
        }));
      },

      setError: (error: string | null) => {
        set(() => ({
          error,
        }));
      },

      clearChatHistory: () => {
        const newSession = createInitialSession();
        set(() => ({
          chatHistory: [newSession],
          currentSessionId: newSession.id,
          currentFileAttachments: [],
          error: null,
        }));
      },
    }),
    {
      name: 'chat-store', // localStorage key
      version: 1,
    }
  )
);
