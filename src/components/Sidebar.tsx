/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Cpu,
  Layers,
  History,
  ShieldCheck,
  Award,
  ChevronRight,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '../utils/sampleImages.ts';
import { AnalysisMode } from '../../server.ts';
import { TASKS } from './TaskSelector.tsx';

export interface HistoryItem {
  id: string;
  imageThumbnail: string;
  fileName: string;
  mode: AnalysisMode;
  modeTitle: string;
  timestamp: string;
  result: string;
  latencyMs: number;
}

interface SidebarProps {
  modelId: string;
  onSelectSample: (sample: SamplePreset) => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onOpenAbout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  modelId,
  onSelectSample,
  history,
  onSelectHistory,
  onClearHistory,
  onOpenAbout,
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0 space-y-5">
      {/* Target Challenge Badge */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-900/90 p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
              Target Challenge
            </span>
            <h3 className="text-sm font-bold text-white leading-tight">
              Best Use of Gemma 4
            </h3>
            <p className="text-xs text-indigo-200/70 mt-1">
              Hacktoberfest Hack Day Hyderabad
            </p>
          </div>
        </div>

        {/* Model Specs Card */}
        <div className="mt-3.5 pt-3 border-t border-indigo-500/20 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Target Model:</span>
            <span className="font-mono text-cyan-300 font-medium">
              {modelId || 'gemma-4-26b-a4b-it'}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Architecture:</span>
            <span className="text-indigo-200">Multimodal Vision</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Security:</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3" /> Zero Client Keys
            </span>
          </div>
        </div>
      </div>

      {/* Quick-Test Sample Presets */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Try Sample Presets</span>
          </h4>
          <span className="text-[11px] text-slate-500">Instant Test</span>
        </div>

        <p className="text-xs text-slate-400 leading-snug">
          Click any sample screenshot to populate the preview and test each mode:
        </p>

        <div className="space-y-2">
          {SAMPLE_PRESETS.map((sample) => {
            const task = TASKS.find((t) => t.id === sample.recommendedMode);
            const TaskIcon = task?.icon || Sparkles;

            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-800/80 bg-slate-950/60 hover:bg-slate-800/70 hover:border-indigo-500/40 transition-all text-xs group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {sample.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-indigo-950 group-hover:text-indigo-300">
                    {sample.category}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-indigo-300">
                    <TaskIcon className="w-3 h-3" />
                    Best for: {task?.title}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Analysis Session History */}
      {history.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Session History ({history.length})</span>
            </h4>
            <button
              type="button"
              onClick={onClearHistory}
              className="text-[11px] text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Clear session history"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectHistory(item)}
                className="w-full text-left p-2 rounded-lg bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800/80 flex items-center gap-2.5 transition-colors cursor-pointer text-xs"
              >
                <img
                  src={item.imageThumbnail}
                  alt={item.fileName}
                  className="w-8 h-8 rounded object-cover border border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-200 truncate">
                    {item.fileName}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span className="text-cyan-400 capitalize">{item.mode}</span>
                    <span>•</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hackathon Architecture Footer Link */}
      <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 text-xs text-slate-400 flex items-center justify-between">
        <div>
          <span className="font-medium text-slate-300 block">Open Source Submission</span>
          <span className="text-[11px] text-slate-500">React Hyderabad & Hacktoberfest</span>
        </div>
        <button
          type="button"
          onClick={onOpenAbout}
          className="text-indigo-400 hover:text-cyan-300 transition-colors text-xs font-semibold cursor-pointer"
        >
          View Docs
        </button>
      </div>
    </aside>
  );
};
