# RAG MVP Application - Implementation Plan

**Date:** January 31, 2026  
**Project:** Next.js RAG Chat Application with Vercel AI SDK & OpenRouter  
**Target Design:** Three-panel layout (Chat History | Chat Interface | Prompt Templates)

---

## Project Overview

Build a Retrieval-Augmented Generation (RAG) MVP chatbot application using Next.js 16, Vercel AI SDK, and OpenRouter as the LLM provider. The application features a modern three-panel interface with chat history management, real-time streaming responses, file upload capabilities, and reusable prompt templates.

### Key Features
- **Left Sidebar:** Chat history navigation with "New Chat" button
- **Center Panel:** Main chat interface with message display, input field, and file/image upload
- **Right Sidebar:** Prompt template buttons with predefined AI tasks
- **Streaming Responses:** Real-time AI responses using Vercel AI SDK
- **File Support:** Upload documents and images for RAG context
- **Responsive Design:** Mobile-friendly tab-based navigation

---

## Phase 1: Project Setup & Dependencies

### 1.1 Install Required Dependencies

**Core AI Libraries:**
```
npm install ai openai-edge openrouter-js axios
```

**Supporting Libraries:**
- `zustand` - State management for chat history
- `lucide-react` - UI icons
- `uuid` - Generate chat session IDs
- `dotenv` - Environment variable management

**Dev Dependencies:**
```
npm install -D @types/uuid
```

### 1.2 Environment Variables Setup

Create `.env.local` in project root:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openrouter/auto
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

**Note:** Get OpenRouter API key from https://openrouter.ai/

---

## Phase 2: Project Structure

### 2.1 Create Directory Structure

```
app/
├── api/
│   ├── chat/
│   │   └── route.ts              # Chat streaming endpoint
│   └── upload/
│       └── route.ts              # File upload endpoint
├── components/
│   ├── ChatHistory.tsx           # Left sidebar - chat list
│   ├── ChatPanel.tsx             # Center - main chat interface
│   ├── PromptTemplates.tsx       # Right sidebar - prompt buttons
│   ├── MessageDisplay.tsx        # Individual message component
│   ├── InputArea.tsx             # Chat input + upload controls
│   └── Layout.tsx                # Three-panel layout wrapper
├── lib/
│   ├── rag/
│   │   ├── chat-store.ts         # Zustand chat state management
│   │   ├── prompts.ts            # Predefined prompt templates
│   │   ├── file-handler.ts       # File upload & processing
│   │   └── ai-client.ts          # OpenRouter AI client setup
│   └── utils/
│       ├── formatting.ts         # Message formatting utilities
│       └── constants.ts          # App constants
├── globals.css                   # Tailwind + custom styles
├── layout.tsx                    # Root layout
├── page.tsx                      # Main app page (three-panel UI)
└── types.ts                      # TypeScript interfaces

public/
├── icons/                        # UI icons (if not using lucide-react)
└── uploads/                      # Temp file storage (optional)
```

---

## Phase 3: Core Implementation

### 3.1 TypeScript Interfaces (`app/types.ts`)

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: FileAttachment[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface FileAttachment {
  id: string;
  filename: string;
  type: 'document' | 'image';
  size: number;
  content?: string; // Base64 for images or text content
}

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: string;
}
```

### 3.2 API Route: Chat Endpoint (`app/api/chat/route.ts`)

**Responsibilities:**
- Accept user messages via POST request
- Initialize Vercel AI SDK with OpenRouter configuration
- Stream AI responses back to client
- Handle errors gracefully

**Implementation Notes:**
- Use `streamText` from `ai/react` for streaming
- Pass OpenRouter API key and model configuration
- Include file context if attachments are present
- Implement rate limiting and error handling

### 3.3 Zustand Store (`lib/rag/chat-store.ts`)

**State Management:**
- Current chat session (messages)
- Chat history (list of all sessions)
- Current file attachments
- UI state (loading, error, selected session)

**Actions:**
- `createNewChat()` - Initialize new session
- `addMessage(role, content)` - Add message to current session
- `deleteChatSession(id)` - Remove chat from history
- `loadChatSession(id)` - Switch between chats
- `updateChatTitle(id, title)` - Rename session
- `attachFile(file)` - Add file to current session
- `removeAttachment(id)` - Remove file

### 3.4 Prompt Templates (`lib/rag/prompts.ts`)

**Example Templates:**
1. **"Summarize"** - Extract key points from uploaded document
2. **"Explain"** - Break down complex topics
3. **"Code Review"** - Analyze code and suggest improvements
4. **"Q&A"** - Answer questions based on uploaded context
5. **"Brainstorm"** - Generate creative ideas
6. **"Translate"** - Convert text to another language

Each template includes:
- Title and description
- System prompt for AI
- Icon identifier
- Expected use case

### 3.5 File Handler (`lib/rag/file-handler.ts`)

**Features:**
- Validate file types (PDF, TXT, images)
- Parse text from documents
- Convert images to base64
- Extract file metadata
- Size validation (max 25MB)

### 3.6 AI Client Setup (`lib/rag/ai-client.ts`)

**Configuration:**
```typescript
const aiClient = new OpenRouterClient({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: 'openrouter/auto',
  baseURL: process.env.OPENROUTER_BASE_URL,
  temperature: 0.7,
  maxTokens: 2048,
});
```

---

## Phase 4: UI Components

### 4.1 Layout Component (`app/components/Layout.tsx`)

**Purpose:** Three-panel container with responsive behavior

**Desktop (1024px+):**
- Fixed left sidebar (250px) - Chat history
- Flexible center panel - Chat interface
- Fixed right sidebar (300px) - Prompt templates

**Mobile (<1024px):**
- Tabs at bottom: History | Chat | Templates
- Full-width active panel
- Collapsible headers

**Implementation:** Use CSS Grid or Flexbox with Tailwind

### 4.2 ChatHistory Component (`app/components/ChatHistory.tsx`)

**Features:**
- List of past chat sessions with titles
- "New Chat" button at top
- Hover actions (rename, delete)
- Indicators for active session
- Scroll for long history
- Search/filter functionality (optional for MVP)

**Styling:** Tailwind - dark theme with hover states

### 4.3 ChatPanel Component (`app/components/ChatPanel.tsx`)

**Contains:**
- Header with current chat title and options
- Message display area (scrollable)
- Input area with upload controls
- Loading spinner for streaming responses

**Message Flow:**
1. User types message + optional files
2. Click "Send" → add to store & display immediately
3. API request to `/api/chat`
4. Stream response as it arrives
5. Display in chat with timestamp

### 4.4 PromptTemplates Component (`app/components/PromptTemplates.tsx`)

**Features:**
- Grid of prompt buttons (2-3 columns)
- Each button shows: icon, title, description
- Click → insert prompt into chat input (or auto-send)
- Hover effect showing full description
- Scrollable container

**Interaction:**
- **Option A:** Click template → fills input field (user can edit before sending)
- **Option B:** Click template → auto-sends with current file context
- **Recommendation:** Option A for MVP (more control)

### 4.5 MessageDisplay Component (`app/components/MessageDisplay.tsx`)

**Displays:**
- Message text with markdown support
- Timestamp
- User/Assistant avatar
- File attachments (preview for images, link for documents)
- Streaming indicator (for in-progress messages)

**Styling:** 
- User messages: right-aligned, blue background
- Assistant messages: left-aligned, gray background
- Use `rehype` or `react-markdown` for markdown rendering

### 4.6 InputArea Component (`app/components/InputArea.tsx`)

**Controls:**
- Text input field (auto-expanding textarea)
- File upload button with drag-and-drop
- Image paste support
- Send button (disabled while loading)
- File preview (show attachments)
- Clear attachments button

---

## Phase 5: Styling & Theme

### 5.1 Tailwind Configuration

**Color Scheme:**
- Primary: Blue-600 (button actions)
- Accent: Indigo-500 (highlights)
- Background: Dark mode (slate-900, slate-950)
- Text: Light gray (slate-100, slate-200)

**Custom Utilities:**
- Message bubbles (border-radius, shadows)
- Scrollbar styling
- Animation for streaming text
- Responsive grid adjustments

### 5.2 Global Styles (`app/globals.css`)

- Reset default styles
- Define CSS variables for colors
- Animations for message appearance
- Markdown styling for code blocks
- Print-friendly styles

---

## Phase 6: Data Flow & State Management

### 6.1 Chat Session Flow

```
User Input → InputArea
    ↓
Store (Zustand)
    ↓
API Route (/api/chat)
    ↓
OpenRouter API
    ↓
Stream Response
    ↓
MessageDisplay
    ↓
Store Update (completed message)
```

### 6.2 File Handling Flow

```
User Selects File
    ↓
FileHandler validates
    ↓
Convert to base64/text
    ↓
Store attachment
    ↓
Include in API request
    ↓
AI uses context for response
```

### 6.3 Prompt Template Flow

```
User Clicks Template
    ↓
Template prompt inserted into input
    ↓
User can edit + add files
    ↓
Standard send flow
```

---

## Phase 7: Development Checklist

### Backend (API Routes)
- [x] Create `/api/chat/route.ts` with streaming
- [x] Create `/api/upload/route.ts` for file handling
- [ ] Test with curl/Postman
- [ ] Add error handling and validation

### Frontend Components
- [x] Build `Layout.tsx` structure
- [x] Build `ChatHistory.tsx` (mock data first)
- [x] Build `ChatPanel.tsx` (mock messages)
- [x] Build `PromptTemplates.tsx` (static templates)
- [x] Build `MessageDisplay.tsx` (markdown support)
- [x] Build `InputArea.tsx` (upload controls)

### State Management
- [ ] Create Zustand store (`chat-store.ts`)
- [ ] Integrate store with components
- [ ] Test state persistence (localStorage)
- [ ] Implement chat session switching

### Integration & Testing
- [ ] Connect InputArea to API route
- [ ] Test streaming responses
- [ ] Test file upload
- [ ] Test prompt template injection
- [ ] Test responsive behavior
- [ ] Performance optimization (lazy loading)

### Polish & Deployment
- [ ] Error boundaries & error messages
- [ ] Loading states
- [ ] Empty state screens
- [ ] Keyboard shortcuts (optional)
- [ ] Build optimization
- [ ] Deploy to Vercel

---

## Phase 8: Optional Enhancements (Post-MVP)

1. **Authentication** - Add user accounts with chat history persistence to database
2. **Database** - Store chat sessions in PostgreSQL/MongoDB instead of localStorage
3. **RAG with Embeddings** - Use OpenRouter embeddings for semantic search
4. **Document Parsing** - Extract text from PDFs and Word documents
5. **Chat Export** - Export conversations as PDF or JSON
6. **Keyboard Shortcuts** - Cmd/Ctrl + K for quick search, Enter to send
7. **Dark/Light Theme** - Toggle between themes
8. **Multi-language** - Support for different languages

---

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State Management | Zustand |
| AI SDK | Vercel AI SDK (openai-edge) |
| LLM Provider | OpenRouter |
| Components | React 19 |
| HTTP Client | Axios / Fetch API |
| Icons | Lucide React |
| Utilities | UUID, date-fns |

---

## Success Criteria

✅ **MVP is complete when:**
1. User can create new chat sessions and navigate history
2. Messages stream from OpenRouter API in real-time
3. File uploads are accepted and included in chat context
4. Prompt templates populate the input field
5. UI responds correctly on desktop and mobile
6. No console errors or TypeScript issues
7. Chat persists in browser (localStorage)

✅ **Performance targets:**
- First paint: < 2 seconds
- Chat response time: < 5 seconds
- File upload: < 10 seconds

---

## File Structure Summary

```
vibe2/
├── app/
│   ├── api/chat/route.ts
│   ├── api/upload/route.ts
│   ├── components/
│   │   ├── ChatHistory.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── PromptTemplates.tsx
│   │   ├── MessageDisplay.tsx
│   │   ├── InputArea.tsx
│   │   └── Layout.tsx
│   ├── lib/rag/
│   │   ├── chat-store.ts
│   │   ├── prompts.ts
│   │   ├── file-handler.ts
│   │   └── ai-client.ts
│   ├── lib/utils/
│   │   ├── formatting.ts
│   │   └── constants.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── types.ts
├── planning/
│   └── rag-mvp-plan.md (this file)
├── public/
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## Notes & Recommendations

- **Start with static components** before connecting to the API
- **Test API separately** using curl or Postman before frontend integration
- **Use localStorage** for chat history in MVP (upgrade to database later)
- **Handle streaming gracefully** — show loading indicator while waiting for response
- **Mobile-first approach** — design for mobile first, then enhance for desktop
- **Error handling** — Graceful fallbacks when API fails or file upload errors
- **Accessibility** — Add ARIA labels, keyboard navigation, sufficient contrast

---

## References & Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai)
- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Streaming Best Practices](https://react.dev)

---

**Plan Created:** January 31, 2026  
**Next Step:** Begin Phase 1 - Install dependencies and set up environment

**Date:** January 31, 2026  
**Project:** Next.js RAG Chat Application with Vercel AI SDK & OpenRouter  
**Target Design:** Three-panel layout (Chat History | Chat Interface | Prompt Templates)

---

## Project Overview

Build a Retrieval-Augmented Generation (RAG) MVP chatbot application using Next.js 16, Vercel AI SDK, and OpenRouter as the LLM provider. The application features a modern three-panel interface with chat history management, real-time streaming responses, file upload capabilities, and reusable prompt templates.

### Key Features
- **Left Sidebar:** Chat history navigation with "New Chat" button
- **Center Panel:** Main chat interface with message display, input field, and file/image upload
- **Right Sidebar:** Prompt template buttons with predefined AI tasks
- **Streaming Responses:** Real-time AI responses using Vercel AI SDK
- **File Support:** Upload documents and images for RAG context
- **Responsive Design:** Mobile-friendly tab-based navigation

---

## Phase 1: Project Setup & Dependencies

### 1.1 Install Required Dependencies

**Core AI Libraries:**