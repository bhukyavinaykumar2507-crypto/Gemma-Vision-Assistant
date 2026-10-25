/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalysisMode } from '../../server.ts';

export interface AnalysisResponseMeta {
  latencyMs: number;
  imageMime?: string;
  approxSizeBytes?: number;
}

export interface AnalysisResponse {
  success: boolean;
  model: string;
  mode: AnalysisMode;
  modeTitle: string;
  result: string;
  overview?: string;
  timestamp: string;
  meta: AnalysisResponseMeta;
}

export interface AnalyzeImageParams {
  image: string;
  mimeType?: string;
  mode?: AnalysisMode;
  customPrompt?: string;
}

/**
 * Safely extracts the executive summary or overview paragraph from a Gemma 4 markdown output.
 */
export function extractOverview(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') return '';

  // Look for Executive Summary or Overview section
  const summaryMatch = markdown.match(/###\s*(?:1\.\s*)?(?:Executive Summary|Overview|Summary|Current State Assessment)[^\n]*\n+([\s\S]*?)(?=\n###|\n##|$)/i);
  if (summaryMatch && summaryMatch[1]) {
    return summaryMatch[1].trim();
  }

  // Fallback to first non-empty paragraph
  const paragraphs = markdown.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !p.startsWith('#'));
  return paragraphs[0] || '';
}

/**
 * Triggers the server-side Gemma 4 multimodal analysis via /api/analyze.
 * Returns a Promise that resolves to the typed AnalysisResponse.
 */
export async function analyzeImage(params: AnalyzeImageParams): Promise<AnalysisResponse> {
  const { image, mimeType = 'image/png', mode = 'explain', customPrompt } = params;

  if (!image) {
    throw new Error('No image provided. Please upload or select an image before analyzing.');
  }

  const baseUrl = typeof window !== 'undefined' ? '' : 'http://127.0.0.1:3000';
  const res = await fetch(`${baseUrl}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image,
      mimeType,
      mode,
      customPrompt: customPrompt?.trim() || undefined,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || `Analysis request failed with status ${res.status}`);
  }

  const response = data as AnalysisResponse;
  if (!response.overview && response.result) {
    response.overview = extractOverview(response.result);
  }

  return response;
}
