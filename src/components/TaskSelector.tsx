/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, AlertOctagon, FileSpreadsheet, ListChecks, MessageSquare } from 'lucide-react';
import { AnalysisMode } from '../../server.ts';

export interface TaskOption {
  id: AnalysisMode;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  samplePrompt: string;
}

export const TASKS: TaskOption[] = [
  {
    id: 'explain',
    title: 'Explain Image',
    badge: 'Overview & Layout',
    description: 'Describe important visible content, interface structure, visual hierarchy, and meaning.',
    icon: Eye,
    accentColor: 'indigo',
    samplePrompt: 'Focus on explaining the main purpose of this interface and who it is built for.',
  },
  {
    id: 'issues',
    title: 'Find Issues',
    badge: 'Bugs & Anomalies',
    description: 'Detect visible errors, inconsistencies, or broken states. Separates observations from hypotheses.',
    icon: AlertOctagon,
    accentColor: 'amber',
    samplePrompt: 'Examine any error codes, stack traces, or UI alignment bugs.',
  },
  {
    id: 'extract',
    title: 'Extract Information',
    badge: 'Text & Key Data',
    description: 'Extract relevant text, labels, numbers, metrics, code snippets, and structured fields.',
    icon: FileSpreadsheet,
    accentColor: 'cyan',
    samplePrompt: 'Extract all numerical figures, column values, and timestamps into a table.',
  },
  {
    id: 'actions',
    title: 'Suggest Actions',
    badge: 'Prioritized Steps',
    description: 'Get immediate, recommended, and preventive next steps based on what is visibly shown.',
    icon: ListChecks,
    accentColor: 'emerald',
    samplePrompt: 'Provide concrete CLI commands or troubleshooting steps to resolve the immediate blocker.',
  },
];

interface TaskSelectorProps {
  selectedMode: AnalysisMode;
  onSelectMode: (mode: AnalysisMode) => void;
  customPrompt: string;
  onCustomPromptChange: (val: string) => void;
  disabled?: boolean;
}

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  selectedMode,
  onSelectMode,
  customPrompt,
  onCustomPromptChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Select Analysis Mode
        </label>
        <span className="text-[11px] text-slate-500">
          Powered by Gemma 4 Vision
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {TASKS.map((task) => {
          const isSelected = selectedMode === task.id;
          const Icon = task.icon;

          return (
            <button
              key={task.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectMode(task.id)}
              className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group cursor-pointer ${
                isSelected
                  ? 'bg-slate-900/90 border-indigo-500/80 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700/80 text-slate-300'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-500/15 via-transparent to-transparent pointer-events-none" />
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800/60 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span
                      className={`font-semibold text-sm ${
                        isSelected ? 'text-white' : 'text-slate-200'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isSelected
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {task.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                    {task.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Optional Custom Instructions / Focus Field */}
      <div className="mt-3 pt-2">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="custom-prompt"
            className="text-xs font-medium text-slate-300 flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Specific Question or Focus Area (Optional)</span>
          </label>
          {customPrompt && (
            <button
              type="button"
              onClick={() => onCustomPromptChange('')}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <input
          id="custom-prompt"
          type="text"
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          disabled={disabled}
          placeholder="e.g., What caused the line 48 failure? or Extract the subtotal and tax amounts."
          className="w-full px-3.5 py-2 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors disabled:opacity-50"
        />
      </div>
    </div>
  );
};
