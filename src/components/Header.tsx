/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Cpu, Info, ShieldCheck, Award } from 'lucide-react';

interface HeaderProps {
  modelId: string;
  isOnline: boolean;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ modelId, isOnline, onOpenAbout }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Gemma Vision Assistant
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Award className="w-3 h-3 text-cyan-400" />
                Hack Day Hyderabad
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Turn visual information into useful actions with Gemma 4.
            </p>
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 text-xs">
          {/* Active Model Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 shadow-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[11px] font-medium text-slate-200">
              {modelId || 'gemma-4-26b-a4b-it'}
            </span>
            <span className="hidden lg:inline text-slate-500 text-[10px]">| Vision</span>
          </div>

          {/* Secure Backend Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Server-side GenAI SDK</span>
          </div>

          {/* About / Help Modal Button */}
          <button
            type="button"
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-700/80 transition-colors text-xs font-medium cursor-pointer"
            aria-label="About Gemma Vision Assistant and Gemma 4"
          >
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>About</span>
          </button>
        </div>
      </div>
    </header>
  );
};
