/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Cpu,
  Clock,
  Layers,
  FileText,
  Share2,
} from 'lucide-react';
import { RichMarkdown } from './RichMarkdown.tsx';
import { AnalysisMode } from '../../server.ts';
import { TASKS } from './TaskSelector.tsx';

export interface AnalysisResponseData {
  success: boolean;
  model: string;
  mode: AnalysisMode;
  modeTitle: string;
  result: string;
  timestamp: string;
  meta: {
    latencyMs: number;
    imageMime?: string;
    approxSizeBytes?: number;
  };
}

interface ResultPanelProps {
  data: AnalysisResponseData;
  onAnalyzeAnother: () => void;
  onSwitchMode: (newMode: AnalysisMode) => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  data,
  onAnalyzeAnother,
  onSwitchMode,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const header = `# Gemma Vision Assistant Analysis Report\nModel: ${data.model}\nMode: ${data.modeTitle}\nTimestamp: ${data.timestamp}\nLatency: ${data.meta.latencyMs}ms\n\n---\n\n`;
    const fullText = header + data.result;
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemma_analysis_${data.mode}_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentTask = TASKS.find((t) => t.id === data.mode);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden animate-fadeIn">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                {data.modeTitle || 'Analysis Results'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {data.model}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {data.meta.latencyMs} ms
              </span>
              <span>•</span>
              <span>{new Date(data.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Copy entire result to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Result</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Download report as Markdown file"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analyze Another</span>
          </button>
        </div>
      </div>

      {/* Main Formatted Markdown Result Body */}
      <div className="p-4 sm:p-6 text-slate-200 leading-relaxed overflow-x-auto bg-slate-950/40">
        <RichMarkdown content={data.result} />
      </div>

      {/* Re-analyze with another mode bar */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="font-medium text-slate-300">
            Re-examine this image in another mode:
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          {TASKS.filter((t) => t.id !== data.mode).map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onSwitchMode(task.id)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/80 transition-colors text-xs cursor-pointer"
            >
              Run {task.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
