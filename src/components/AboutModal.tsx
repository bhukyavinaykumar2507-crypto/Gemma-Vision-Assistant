/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  Award,
  CheckCircle2,
  FileCode,
  Terminal,
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelId: string;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, modelId }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="about-modal-title" className="text-base font-bold text-white">
                About Gemma Vision Assistant
              </h2>
              <p className="text-xs text-cyan-300">
                Hacktoberfest Hack Day Hyderabad — Best Use of Gemma 4
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-300">
          {/* Challenge Box */}
          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
            <Award className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white block mb-0.5">
                Target Challenge: Best Use of Gemma 4
              </span>
              <span>
                Built for React Hyderabad Hack Day during Hacktoberfest. This project proves how Gemma 4 multimodal capabilities turn visual screenshots into structured, actionable engineering outcomes.
              </span>
            </div>
          </div>

          {/* Model Identification */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Configured Model Identifier</span>
            </h3>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400">Model ID: </span>
                <span className="text-cyan-300 font-semibold">{modelId || 'gemma-4-26b-a4b-it'}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-medium">
                Live & Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              The application uses the official <code className="text-indigo-300 font-mono">@google/genai</code> SDK on a dedicated Node.js server to interface with Gemma 4.
            </p>
          </div>

          {/* Multimodal Architecture & Security */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multimodal Architecture & Security</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">
                  1. Server-Side Execution
                </span>
                <p className="text-slate-400 leading-relaxed">
                  All AI calls are processed in Express backend routes. The browser never accesses or contains the Gemini API key.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">
                  2. Visual Token Ingestion
                </span>
                <p className="text-slate-400 leading-relaxed">
                  Images are dispatched directly as standardized MIME inline parts to Gemma 4 without intermediate compression loss.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Analysis Modes */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Four Specialized Analysis Modes</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span><strong className="text-white">Explain Image:</strong> Describes visible interface components, visual hierarchy, context, and key takeaways in simple language.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span><strong className="text-white">Find Issues:</strong> Audits visual defects, error logs, and layout bugs. Rigorously separates verified observations from hypotheses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span><strong className="text-white">Extract Information:</strong> Transcribes tables, metrics, codes, form fields, and labels into structured markdown data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span><strong className="text-white">Suggest Actions:</strong> Delivers high-priority immediate fixes, follow-up improvements, and preventive measures.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            v1.0.0 • React + Express + Gemma 4
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
