/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, FileUp, Sparkles } from 'lucide-react';

interface UploadAreaProps {
  onImageSelected: (dataUrl: string, fileInfo: { name: string; size: number; mimeType: string }) => void;
  disabled?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onImageSelected, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

  const processFile = (file: File) => {
    setValidationError(null);

    // Validate mime type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setValidationError(
        `Unsupported file type (${file.type || 'unknown'}). Please upload a PNG, JPEG, WEBP, or GIF image.`
      );
      return;
    }

    // Validate size
    if (file.size > MAX_SIZE_BYTES) {
      setValidationError(
        `Image is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, {
          name: file.name,
          size: file.size,
          mimeType: file.type,
        });
      }
    };
    reader.onerror = () => {
      setValidationError('Failed to read the selected file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
    // Reset so same file can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Support paste from clipboard anywhere on window when no image is loaded
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (disabled) return;
      if (e.clipboardData && e.clipboardData.items) {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.type.indexOf('image') !== -1) {
            const blob = item.getAsFile();
            if (blob) {
              processFile(new File([blob], `screenshot_${Date.now()}.png`, { type: blob.type }));
              break;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [disabled]);

  return (
    <div className="space-y-2.5">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer select-none group ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/20 scale-[0.99]'
            : 'border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 hover:border-indigo-500/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
              isDragging
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300'
            }`}
          >
            {isDragging ? (
              <FileUp className="w-7 h-7 animate-bounce" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200">
              Drag & drop screenshot or image here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              or <span className="text-indigo-400 font-medium underline underline-offset-2">browse from device</span>, or paste with <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] border border-slate-700">Ctrl+V</kbd>
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>PNG, JPEG, WEBP, GIF</span>
            <span>•</span>
            <span>Up to 10 MB</span>
          </div>
        </div>
      </div>

      {validationError && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <div className="flex-1">
            <span className="font-semibold">Invalid File: </span>
            {validationError}
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-red-400 hover:text-red-200 text-xs cursor-pointer font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
