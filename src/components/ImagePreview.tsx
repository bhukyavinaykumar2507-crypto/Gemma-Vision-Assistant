/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Maximize2, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { AnalysisMode } from '../../server.ts';

interface ImagePreviewProps {
  imageSrc: string;
  fileInfo: {
    name: string;
    size: number;
    mimeType: string;
  };
  selectedMode: AnalysisMode;
  onClear: () => void;
  onReplace: () => void;
  isAnalyzing?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageSrc,
  fileInfo,
  selectedMode,
  onClear,
  onReplace,
  isAnalyzing = false,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-lg group">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-medium text-slate-200 truncate max-w-[200px] sm:max-w-[320px]">
              {fileInfo.name}
            </span>
            <span className="text-[11px] text-slate-400 shrink-0">
              ({formatSize(fileInfo.size)})
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Expand view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={onReplace}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              title="Change image"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={onClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 cursor-pointer"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Image Container with Scanning / Glow Overlay when analyzing */}
        <div className="relative max-h-[380px] sm:max-h-[460px] overflow-hidden flex items-center justify-center bg-slate-950/80 p-2 sm:p-4">
          <img
            src={imageSrc}
            alt="Uploaded preview for Gemma 4 analysis"
            className="max-h-[360px] sm:max-h-[440px] w-auto max-w-full object-contain rounded-lg border border-slate-800/80 shadow"
          />

          {isAnalyzing && (
            <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none">
              {/* Laser Scan line effect */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse" />
            </div>
          )}
        </div>

        {/* Bottom Mode Pill */}
        <div className="px-3.5 py-2 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>Target Mode:</span>
            <span className="font-semibold text-indigo-300 capitalize">
              {selectedMode.replace('-', ' ')}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Ready for Gemma 4
          </span>
        </div>
      </div>

      {/* Expanded Zoom Modal */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-2 right-2 z-10">
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 shadow-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={imageSrc}
              alt="Zoomed preview"
              className="max-h-[85vh] max-w-full object-contain rounded-xl border border-slate-700 shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};
