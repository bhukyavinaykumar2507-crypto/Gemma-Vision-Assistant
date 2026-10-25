/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  AlertTriangle,
  RefreshCw,
  Layers,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { Sidebar, HistoryItem } from './components/Sidebar.tsx';
import { UploadArea } from './components/UploadArea.tsx';
import { ImagePreview } from './components/ImagePreview.tsx';
import { TaskSelector, TASKS } from './components/TaskSelector.tsx';
import { AnalysisPanel } from './components/AnalysisPanel.tsx';
import { ResultPanel } from './components/ResultPanel.tsx';
import { LoadingIndicator } from './components/LoadingIndicator.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { SamplePreset, SAMPLE_PRESETS, getPresetDataUrl } from './utils/sampleImages.ts';
import { AnalysisMode } from '../server.ts';
import { AnalysisResponse, analyzeImage, extractOverview } from './services/analysisService.ts';

export default function App() {
  const [modelId, setModelId] = useState<string>('gemma-4-26b-a4b-it');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isConfigured, setIsConfigured] = useState<boolean>(true);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; mimeType: string } | null>(null);
  const [selectedMode, setSelectedMode] = useState<AnalysisMode>('explain');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('gemma_vision_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gemma_vision_history', JSON.stringify(history.slice(0, 10)));
    } catch (e) {
      console.warn('Could not persist history to localStorage', e);
    }
  }, [history]);

  // Fetch model info on mount
  useEffect(() => {
    fetch('/api/model-info')
      .then((res) => res.json())
      .then((data) => {
        if (data.modelId) setModelId(data.modelId);
        setIsOnline(data.status === 'online');
        setIsConfigured(data.isConfigured);
      })
      .catch((err) => {
        console.warn('Model info check failed:', err);
        setIsOnline(false);
      });
  }, []);

  const handleImageSelected = (
    dataUrl: string,
    info: { name: string; size: number; mimeType: string }
  ) => {
    setSelectedImage(dataUrl);
    setFileInfo(info);
    setErrorMessage(null);
    setAnalysisResult(null);
  };

  const handleSelectSample = (sample: SamplePreset) => {
    // 1. Safely resolve the actual sample image data URL
    const dataUrl = getPresetDataUrl(sample);
    if (!dataUrl) {
      setErrorMessage('Could not load sample preset image. Please try another sample.');
      return;
    }

    // 2. Load into visual input state
    setSelectedImage(dataUrl);

    // 3. Populate accurate file metadata
    setFileInfo({
      name: sample.fileName,
      size: Math.round((dataUrl.length * 3) / 4) || 200000,
      mimeType: 'image/png',
    });

    // 4. Set the appropriate analysis mode
    setSelectedMode(sample.recommendedMode);

    // 5. Clear errors and reset result to display image preview & enable Analyze button
    setErrorMessage(null);
    setAnalysisResult(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setFileInfo(null);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  const handleRunAnalysis = async (overrideMode?: AnalysisMode) => {
    const modeToRun = overrideMode || selectedMode;

    if (!selectedImage) {
      setErrorMessage('Please upload, paste, or select a sample image before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      // Passes the exact same image data displayed in the preview to the Gemma 4 backend
      const data: AnalysisResponse = await analyzeImage({
        image: selectedImage,
        mimeType: fileInfo?.mimeType || 'image/png',
        mode: modeToRun,
        customPrompt: customPrompt.trim() || undefined,
      });

      setAnalysisResult(data);

      // Add to session history
      const newHistoryItem: HistoryItem = {
        id: `hist-${Date.now()}`,
        imageThumbnail: selectedImage,
        fileName: fileInfo?.name || 'Analyzed Screenshot',
        mode: modeToRun,
        modeTitle: data.modeTitle || modeToRun,
        timestamp: data.timestamp,
        result: data.result,
        latencyMs: data.meta?.latencyMs || 0,
      };

      setHistory((prev) => [newHistoryItem, ...prev.filter((h) => h.id !== newHistoryItem.id)].slice(0, 10));
    } catch (err: unknown) {
      console.error('Analysis error:', err);
      const errMsg = err instanceof Error ? err.message : 'Failed to complete visual analysis. Please check server logs.';
      setErrorMessage(errMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSwitchModeAndRerun = (newMode: AnalysisMode) => {
    setSelectedMode(newMode);
    handleRunAnalysis(newMode);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    let dataUrl = item.imageThumbnail;

    // If thumbnail was missing or corrupted, restore from known presets by fileName or id
    if (!dataUrl || !dataUrl.startsWith('data:image/')) {
      const matchingPreset = SAMPLE_PRESETS.find(
        (p) => p.fileName === item.fileName || p.id === item.id
      );
      if (matchingPreset) {
        dataUrl = getPresetDataUrl(matchingPreset);
      }
    }

    if (dataUrl) {
      setSelectedImage(dataUrl);
      setFileInfo({
        name: item.fileName,
        size: Math.round((dataUrl.length * 3) / 4) || 150000,
        mimeType: 'image/png',
      });
    }

    setSelectedMode(item.mode);
    setAnalysisResult({
      success: true,
      model: modelId,
      mode: item.mode,
      modeTitle: item.modeTitle,
      result: item.result,
      overview: item.result ? extractOverview(item.result) : '',
      timestamp: item.timestamp,
      meta: {
        latencyMs: item.latencyMs,
      },
    });
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <Header
        modelId={modelId}
        isOnline={isOnline}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <Sidebar
          modelId={modelId}
          onSelectSample={handleSelectSample}
          history={history}
          onSelectHistory={handleSelectHistoryItem}
          onClearHistory={() => setHistory([])}
          onOpenAbout={() => setIsAboutOpen(true)}
        />

        {/* Central Execution Column */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Main Visual Workflow Card */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6 shadow-xl space-y-5">
            {/* Step 1: Image Upload / Preview */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-[11px] font-bold">
                    1
                  </span>
                  <span>Visual Input</span>
                </h2>
                {selectedImage && !isAnalyzing && (
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    Clear Image
                  </button>
                )}
              </div>

              {!selectedImage ? (
                <UploadArea
                  onImageSelected={handleImageSelected}
                  disabled={isAnalyzing}
                />
              ) : (
                <ImagePreview
                  imageSrc={selectedImage}
                  fileInfo={fileInfo || { name: 'screenshot.png', size: 0, mimeType: 'image/png' }}
                  selectedMode={selectedMode}
                  onClear={handleClearImage}
                  onReplace={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/png,image/jpeg,image/webp,image/gif';
                    input.onchange = (e: any) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            handleImageSelected(ev.target.result as string, {
                              name: file.name,
                              size: file.size,
                              mimeType: file.type,
                            });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                  isAnalyzing={isAnalyzing}
                />
              )}
            </div>

            {/* Step 2: Task Mode Selector */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-[11px] font-bold">
                    2
                  </span>
                  <span>Multimodal Analysis Task</span>
                </h2>
              </div>

              <TaskSelector
                selectedMode={selectedMode}
                onSelectMode={setSelectedMode}
                customPrompt={customPrompt}
                onCustomPromptChange={setCustomPrompt}
                disabled={isAnalyzing}
              />
            </div>

            {/* Prominent Analyze Button */}
            <div className="pt-2">
              {(() => {
                const isInputValid = Boolean(
                  selectedImage &&
                  typeof selectedImage === 'string' &&
                  selectedImage.trim().length > 50 &&
                  fileInfo &&
                  !isAnalyzing
                );

                return (
                  <button
                    type="button"
                    onClick={() => handleRunAnalysis()}
                    disabled={!isInputValid}
                    className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                      !isInputValid
                        ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed opacity-70 shadow-none'
                        : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-500/25 ring-1 ring-white/20 hover:scale-[1.008]'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Analyzing Image with Gemma 4...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current text-white" />
                        <span>
                          Analyze Image with{' '}
                          {TASKS.find((t) => t.id === selectedMode)?.title || 'Gemma 4'}
                        </span>
                      </>
                    )}
                  </button>
                );
              })()}

              {!selectedImage && (
                <p className="text-center text-[11px] text-slate-500 mt-2">
                  Tip: Upload a screenshot above or select a preset from the sidebar to begin.
                </p>
              )}
            </div>
          </section>

          {/* Error State Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg animate-fadeIn">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <span className="font-bold text-red-100 block">Analysis Request Failed</span>
                <p className="text-red-300 leading-relaxed">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRunAnalysis()}
                className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-white font-medium text-xs border border-red-500/40 transition-colors cursor-pointer shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isAnalyzing && (
            <LoadingIndicator mode={selectedMode} modelId={modelId} />
          )}

          {/* Success Result State */}
          {analysisResult && !isAnalyzing && (
            <AnalysisPanel
              response={analysisResult}
              selectedMode={selectedMode}
              onAnalyzeAnother={handleClearImage}
              onSwitchMode={handleSwitchModeAndRerun}
            />
          )}

          {/* Empty State when no image and no result */}
          {!selectedImage && !analysisResult && !isAnalyzing && (
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/20 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200">
                Awaiting Screenshot or Visual Input
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Gemma 4 is ready to analyze user interfaces, terminal logs, code snippets, diagrams, error messages, and invoices.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        modelId={modelId}
      />
    </div>
  );
}
