'use client';

import React from 'react';
import { PromptTemplate } from '@/app/types';
import { 
  Sparkles, 
  BookOpen, 
  Code, 
  HelpCircle, 
  Lightbulb, 
  Globe,
  LucideIcon 
} from 'lucide-react';

interface PromptTemplatesProps {
  templates: PromptTemplate[];
  onSelectTemplate: (template: PromptTemplate) => void;
}

const iconMap: { [key: string]: LucideIcon } = {
  summarize: BookOpen,
  explain: Sparkles,
  'code-review': Code,
  'q-a': HelpCircle,
  brainstorm: Lightbulb,
  translate: Globe,
};

export function PromptTemplates({ templates, onSelectTemplate }: PromptTemplatesProps) {
  const getIcon = (iconName: string): LucideIcon => {
    return iconMap[iconName.toLowerCase()] || Sparkles;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-slate-100">Prompt Templates</h2>
        <p className="text-xs text-slate-400 mt-1">Quick-start suggestions</p>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {templates.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-8">
            No templates available
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => {
              const IconComponent = getIcon(template.icon);
              return (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="group p-3 rounded-lg border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all text-left"
                  title={template.description}
                >
                  <div className="flex items-start gap-2">
                    <div className="p-2 rounded bg-blue-600 bg-opacity-20 group-hover:bg-opacity-30 transition-colors">
                      <IconComponent size={16} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-100 group-hover:text-blue-300 transition-colors">
                        {template.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
