/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  RotateCcw,
  Clock,
  Layers,
  AlertCircle,
  FileText,
  Info,
} from 'lucide-react';
import { RichMarkdown } from './RichMarkdown.tsx';
import { AnalysisMode } from '../../server.ts';
import { AnalysisResponse, analyzeImage, extractOverview } from '../services/analysisService.ts';
import { TASKS } from './TaskSelector.tsx';

interface AnalysisPanelProps {
  imageSrc?: string | null;
  fileInfo?: { name: string; size: number; mimeType: string } | null;
  selectedMode: AnalysisMode;
  customPrompt?: string;
  response?: AnalysisResponse | null;
  isAnalyzing?: boolean;
  onAnalyzeAnother?: () => void;
  onSwitchMode?: (newMode: AnalysisMode) => void;
  onResponseReceived?: (response: AnalysisResponse) => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  imageSrc,
  fileInfo,
  selectedMode,
  customPrompt = '',
  response = null,
  isAnalyzing = false,
  onAnalyzeAnother,
  onSwitchMode,
  onResponseReceived,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Correct asynchronous handler pattern:
  // Properly awaits the Promise<AnalysisResponse> from analyzeImage()
  // and safely accesses response properties without reading from undefined.
  const handleExecuteAnalysis = async () => {
    if (!imageSrc) {
      setLocalError('No image available to analyze. Please upload or select an image.');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);

    try {
      // Correctly await the asynchronous function that returns Promise<AnalysisResponse>
      const resolvedResponse: AnalysisResponse = await analyzeImage({
        image: imageSrc,
        mimeType: fileInfo?.mimeType || 'image/png',
        mode: selectedMode,
        customPrompt,
      });

      // Safely access overview from the resolved AnalysisResponse (never from a Promise or undefined)
      const summary: string = resolvedResponse.overview ?? extractOverview(resolvedResponse.result) ?? '';

      if (onResponseReceived) {
        onResponseReceived({
          ...resolvedResponse,
          overview: summary,
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Visual analysis failed.';
      setLocalError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!response?.result) return;
    navigator.clipboard.writeText(response.result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!response) return;
    const header = `# Gemma Vision Assistant Analysis Report\nModel: ${response.model}\nMode: ${response.modeTitle}\nTimestamp: ${response.timestamp}\nLatency: ${response.meta.latencyMs}ms\n\n---\n\n`;
    const fullText = header + response.result;
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemma_analysis_${response.mode}_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Safe overview extraction with full null-safety (never throws TypeError: Cannot read properties of undefined)
  const currentSummary: string = response?.overview ?? (response?.result ? extractOverview(response.result) : '');

  // Loading state
  if (isAnalyzing || isSubmitting) {
    return (
      <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-6 text-center space-y-3 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-cyan-400 mx-auto">
          <Sparkles className="w-5 h-5 animate-spin" />
        </div>
        <h3 className="text-sm font-semibold text-white">
          Awaiting Gemma 4 Response...
        </h3>
        <p className="text-xs text-slate-400">
          Synthesizing structured observations and actionable recommendations.
        </p>
      </div>
    );
  }

  // Error state
  if (localError) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-xs sm:text-sm text-red-200 flex items-start justify-between gap-3 shadow-lg">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-red-100 block">Analysis Error</span>
            <p className="text-red-300 mt-0.5">{localError}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleExecuteAnalysis}
          className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-white text-xs font-medium border border-red-500/40 transition-colors cursor-pointer shrink-0"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (!response) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center space-y-2">
        <FileText className="w-8 h-8 text-slate-500 mx-auto" />
        <h3 className="text-xs font-semibold text-slate-300">No Analysis Results Yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Click the Analyze button above to inspect your screenshot with Gemma 4.
        </p>
      </div>
    );
  }

  // Success result view
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden animate-fadeIn space-y-0">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                {response.modeTitle || 'Analysis Results'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {response.model}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {response.meta.latencyMs} ms
              </span>
              <span>•</span>
              <span>{new Date(response.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Copy result to clipboard"
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
            title="Export as Markdown"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {onAnalyzeAnother && (
            <button
              type="button"
              onClick={onAnalyzeAnother}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Analyze Another</span>
            </button>
          )}
        </div>
      </div>

      {/* Overview Callout (if available) */}
      {currentSummary && (
        <div className="p-4 bg-indigo-950/25 border-b border-indigo-500/20 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
            <span className="font-semibold text-cyan-300 block mb-0.5">Summary Overview</span>
            <p>{currentSummary}</p>
          </div>
        </div>
      )}

      {/* Main Rich Markdown Content */}
      <div className="p-4 sm:p-6 text-slate-200 leading-relaxed overflow-x-auto bg-slate-950/40">
        <RichMarkdown content={response.result} />
      </div>

      {/* Mode Switcher Bar */}
      {onSwitchMode && (
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="font-medium text-slate-300">
              Re-run on this image:
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-1.5">
            {TASKS.filter((t) => t.id !== response.mode).map((task) => (
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
      )}
    </div>
  );
};
