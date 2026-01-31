export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: FileAttachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FileAttachment {
  id: string;
  filename: string;
  type: 'document' | 'image';
  size: number;
  content?: string; // Base64 for images or text content
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: string;
}
