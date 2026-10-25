/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, Brain, Cpu, CheckCircle } from 'lucide-react';
import { AnalysisMode } from '../../server.ts';

interface LoadingIndicatorProps {
  mode: AnalysisMode;
  modelId: string;
}

const STEPS = [
  'Encoding and validating visual payload...',
  'Dispatching multimodal request to Gemma 4...',
  'Extracting visual tokens, layout, and textual elements...',
  'Synthesizing structured observations and recommendations...',
];

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ mode, modelId }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-4">
        {/* Animated Central Icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
            <Brain className="w-8 h-8 animate-pulse text-cyan-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-indigo-500/60 flex items-center justify-center">
            <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-white flex items-center justify-center gap-2">
            <span>Analyzing with {modelId || 'Gemma 4'}</span>
          </h3>
          <p className="text-xs text-indigo-300/80 mt-1">
            Running mode:{' '}
            <span className="font-semibold text-cyan-300 capitalize">
              {mode.replace('-', ' ')}
            </span>
          </p>
        </div>

        {/* Stepped Progress Indicator */}
        <div className="w-full max-w-md bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Progress Step {currentStep + 1} of {STEPS.length}</span>
            <span className="font-mono text-cyan-400">
              {Math.min(Math.round(((currentStep + 1) / STEPS.length) * 100), 95)}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-400 transition-all duration-700 rounded-full"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          <p className="text-xs text-slate-300 font-medium text-left flex items-center gap-2 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{STEPS[currentStep]}</span>
          </p>
        </div>

        <p className="text-[11px] text-slate-500 max-w-sm">
          Gemma 4 processes high-resolution image tokens server-side to generate deterministic, factual analysis without client key exposure.
        </p>
      </div>
    </div>
  );
};
