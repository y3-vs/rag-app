'use client';

import React, { ReactNode, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  chatHistory: ReactNode;
  promptTemplates: ReactNode;
}

export function Layout({ children, chatHistory, promptTemplates }: LayoutProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'chat' | 'templates'>('chat');

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full gap-0">
        {/* Left Sidebar - Chat History */}
        <aside className="w-64 border-r border-slate-700 bg-slate-900 flex flex-col overflow-hidden">
          {chatHistory}
        </aside>

        {/* Center Panel - Chat Interface */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>

        {/* Right Sidebar - Prompt Templates */}
        <aside className="w-80 border-l border-slate-700 bg-slate-900 flex flex-col overflow-hidden">
          {promptTemplates}
        </aside>
      </div>

      {/* Mobile Layout with Tabs */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Tab Navigation */}
        <nav className="flex gap-0 border-b border-slate-700 bg-slate-900">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-4 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'border-b-2 border-blue-500 text-blue-400 bg-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 px-4 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === 'chat'
                ? 'border-b-2 border-blue-500 text-blue-400 bg-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 px-4 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'border-b-2 border-blue-500 text-blue-400 bg-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Templates
          </button>
        </nav>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'history' && (
            <aside className="h-full overflow-y-auto bg-slate-900">
              {chatHistory}
            </aside>
          )}
          {activeTab === 'chat' && (
            <main className="h-full flex flex-col">
              {children}
            </main>
          )}
          {activeTab === 'templates' && (
            <aside className="h-full overflow-y-auto bg-slate-900">
              {promptTemplates}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
