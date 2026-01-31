import { PromptTemplate } from '@/app/types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'summarize',
    title: 'Summarize',
    description: 'Extract key points from uploaded document',
    prompt: 'Please analyze the provided document and provide a concise summary highlighting the main points, key findings, and important conclusions.',
    icon: 'FileText',
  },
  {
    id: 'explain',
    title: 'Explain',
    description: 'Break down complex topics',
    prompt: 'Please explain the following content in simple, easy-to-understand terms. Break it down into main concepts and provide examples where helpful.',
    icon: 'BookOpen',
  },
  {
    id: 'code-review',
    title: 'Code Review',
    description: 'Analyze code and suggest improvements',
    prompt: 'Please review the provided code. Identify any issues, suggest improvements for readability and performance, and recommend best practices.',
    icon: 'Code',
  },
  {
    id: 'qa',
    title: 'Q&A',
    description: 'Answer questions based on uploaded context',
    prompt: 'Based on the provided content, please answer the following questions thoroughly and accurately. If information is not available in the context, indicate that.',
    icon: 'HelpCircle',
  },
  {
    id: 'brainstorm',
    title: 'Brainstorm',
    description: 'Generate creative ideas',
    prompt: 'Let\'s brainstorm creative ideas on this topic. Generate multiple unique perspectives, suggestions, and innovative approaches. Feel free to think outside the box.',
    icon: 'Lightbulb',
  },
  {
    id: 'translate',
    title: 'Translate',
    description: 'Convert text to another language',
    prompt: 'Please translate the provided text. Ensure the translation is accurate, maintains the original meaning, and flows naturally in the target language.',
    icon: 'Globe',
  },
];

export const getPromptById = (id: string): PromptTemplate | undefined => {
  return PROMPT_TEMPLATES.find((template) => template.id === id);
};

export const getPromptByTitle = (title: string): PromptTemplate | undefined => {
  return PROMPT_TEMPLATES.find((template) => template.title === title);
};
