/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase JSON body limits for base64 image uploads (up to 20MB)
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Target Gemma 4 model
const GEMMA_MODEL_ID = 'gemma-4-26b-a4b-it';

// Server-side initialization of GoogleGenAI SDK with required aistudio-build telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export type AnalysisMode = 'explain' | 'issues' | 'extract' | 'actions';

const MODE_PROMPTS: Record<AnalysisMode, { title: string; systemPrompt: string }> = {
  explain: {
    title: 'Explain Image',
    systemPrompt: `You are Gemma Vision Assistant, an expert multimodal AI powered by Gemma 4.
Your task is: EXPLAIN IMAGE.
Describe the important visible content in clear, accessible, and structured language.
Structure your response with the following markdown sections:
### 1. Executive Summary
Provide a concise 2-sentence overview of what this image or screenshot represents.

### 2. Visible Elements & Layout
- Key interface components, objects, or visuals visible on screen
- Visual hierarchy and layout composition (header, sidebar, content area, modals, etc.)
- Primary focal points and styling cues (colors, status badges, alerts)

### 3. Context & Workflow
- What workflow, application, task, or document state is shown
- Who the intended audience or user might be

### 4. Key Takeaways
- 3-5 concise bullet points highlighting the most vital insights from this visual.

Be strictly factual and describe only what is visibly present in the image.`,
  },
  issues: {
    title: 'Find Issues',
    systemPrompt: `You are Gemma Vision Assistant, an expert multimodal AI powered by Gemma 4.
Your task is: FIND ISSUES.
Carefully inspect this image or screenshot to identify visible errors, inconsistencies, bugs, alignment issues, or potential problems.
Clearly distinguish direct observations from uncertain conclusions.

Structure your response with the following markdown sections:
### 1. Issue Overview
State clearly whether errors, bugs, or anomalies were detected, and rate the overall severity (None / Low / Medium / High / Critical).

### 2. Visible Problems & Anomalies
For each problem found, provide:
- **[Issue Name]** (Severity: High/Medium/Low)
  - **Factual Observation**: Exact visible text, broken element, error banner, HTTP status, misalignment, or failed state visible in the screenshot.
  - **Certainty**: Verified (100% visible on screen) vs Potential Hypothesis (likely cause based on UI cues).
  - **Probable Root Cause**: Why this issue may be occurring based on the visible context.

### 3. Visual & UX Inconsistencies
- Any typographical, contrast, layout clipping, responsiveness, or spacing flaws observed.

### 4. Recommended Fixes
- Concrete, actionable technical or design corrections to resolve the identified problems.

If no issues are detected, explicitly confirm that the visual appears well-formed, healthy, and error-free, and note any potential edge cases to watch for.`,
  },
  extract: {
    title: 'Extract Information',
    systemPrompt: `You are Gemma Vision Assistant, an expert multimodal AI powered by Gemma 4.
Your task is: EXTRACT INFORMATION.
Extract all relevant text, labels, numbers, fields, metrics, and structured data from this image into a clean, human-readable format.

Structure your response with the following markdown sections:
### 1. Identified Document / Screen Type
Identify what type of visual this is (e.g., Code Terminal, Analytics Dashboard, Cloud Console, Invoice/Receipt, Form UI, Architecture Diagram).

### 2. Key Data & Fields
Present extracted information using clean markdown tables or key-value lists:
- Field names, labels, and their exact corresponding values
- Numerical metrics, percentages, currency, dates, timestamps, IDs
- Configuration parameters, endpoints, or environment variables

### 3. Verbatim Text & Code Snippets
If code, stack traces, terminal commands, or literal text are visible, extract them verbatim in fenced code blocks (\`\`\`).

### 4. Data Summary & Structure
A concise summary of what this extracted dataset signifies.

Do not invent numbers or text. Transcribe accurately what is visible.`,
  },
  actions: {
    title: 'Suggest Actions',
    systemPrompt: `You are Gemma Vision Assistant, an expert multimodal AI powered by Gemma 4.
Your task is: SUGGEST ACTIONS.
Analyze this image and deliver a prioritized, practical roadmap of next steps based directly on what is shown.

Structure your response with the following markdown sections:
### 1. Current State Assessment
A brief diagnosis of the current state or bottleneck captured in the image.

### 2. Immediate Actions (High Priority)
- [ ] Urgent step 1: What must be done right away to fix, unblock, or progress.
- [ ] Urgent step 2: Clear, step-by-step instruction with terminal commands, configuration changes, or UI clicks if applicable.

### 3. Recommended Next Steps (Medium Priority)
- [ ] Next step 1: Best-practice validation, verification, or subsequent workflow step.
- [ ] Next step 2: Additional optimization or testing step.

### 4. Preventive & Long-term Measures (Low Priority)
- [ ] Long-term improvement: How to automate, monitor, or prevent similar issues in the future.

Ensure all recommendations are actionable, concrete, and directly relevant to the screenshot provided.`,
  },
};

// API Route: Model info & health check
app.get('/api/model-info', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'online',
    modelId: GEMMA_MODEL_ID,
    modelName: 'Gemma 4 26B Instruction-Tuned (Vision Capable)',
    challenge: 'Best Use of Gemma 4 — Hacktoberfest Hack Day Hyderabad',
    provider: 'Google GenAI SDK (@google/genai)',
    isConfigured: hasKey,
    supportedModes: [
      { id: 'explain', label: 'Explain Image', description: 'Describe important visible content in simple, structured language' },
      { id: 'issues', label: 'Find Issues', description: 'Identify visible errors, inconsistencies, or potential problems' },
      { id: 'extract', label: 'Extract Information', description: 'Extract relevant text, labels, numbers, and fields' },
      { id: 'actions', label: 'Suggest Actions', description: 'Prioritized, practical next steps based on the image' },
    ],
    maxUploadSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
  });
});

// API Route: Image analysis using Gemma 4
app.post('/api/analyze', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { image, mimeType, mode = 'explain', customPrompt } = req.body;

    // Validate image presence
    if (!image || typeof image !== 'string') {
      res.status(400).json({
        error: 'No image provided. Please upload or paste an image to analyze.',
      });
      return;
    }

    // Validate mode
    const selectedMode = (mode in MODE_PROMPTS ? mode : 'explain') as AnalysisMode;

    // Validate mimeType
    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    let cleanMime = (mimeType || 'image/png').toLowerCase();
    if (cleanMime === 'image/jpg') cleanMime = 'image/jpeg';

    if (!allowedMimes.includes(cleanMime)) {
      res.status(400).json({
        error: `Unsupported file type: "${cleanMime}". Please upload a PNG, JPEG, WEBP, or GIF image.`,
      });
      return;
    }

    // Extract base64 payload
    let base64Data = image;
    const match = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (match) {
      cleanMime = match[1].toLowerCase();
      if (cleanMime === 'image/jpg') cleanMime = 'image/jpeg';
      base64Data = match[2];
    }

    // Validate base64 length / size
    const estimatedSizeBytes = Math.round((base64Data.length * 3) / 4);
    if (estimatedSizeBytes > 10 * 1024 * 1024) {
      res.status(413).json({
        error: `Image size exceeds the 10MB limit (approx ${Math.round(estimatedSizeBytes / (1024 * 1024))}MB). Please upload a smaller image.`,
      });
      return;
    }

    // Validate API Key
    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'Gemini API key is not configured on the server. Please verify your GEMINI_API_KEY environment variable in Settings > Secrets.',
      });
      return;
    }

    // Assemble prompt
    const modeConfig = MODE_PROMPTS[selectedMode];
    let fullPrompt = modeConfig.systemPrompt;
    if (customPrompt && typeof customPrompt === 'string' && customPrompt.trim()) {
      fullPrompt += `\n\n### Additional User Instructions & Inquiries:\n"${customPrompt.trim()}"\nPlease address this specific user inquiry while fulfilling the ${modeConfig.title} objective.`;
    }

    // Call Gemma 4 via official @google/genai SDK
    const response = await ai.models.generateContent({
      model: GEMMA_MODEL_ID,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: cleanMime,
              data: base64Data,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
    });

    const resultText = response.text || 'No text output returned by the model.';
    const latencyMs = Date.now() - startTime;

    // Safely extract high-level overview from markdown sections
    const overviewMatch = resultText.match(/###\s*(?:1\.\s*)?(?:Executive Summary|Overview|Summary|Current State Assessment)[^\n]*\n+([\s\S]*?)(?=\n###|\n##|$)/i);
    const overview = overviewMatch ? overviewMatch[1].trim() : resultText.split(/\n\s*\n/)[0]?.trim() || '';

    res.json({
      success: true,
      model: GEMMA_MODEL_ID,
      mode: selectedMode,
      modeTitle: modeConfig.title,
      result: resultText,
      overview,
      timestamp: new Date().toISOString(),
      meta: {
        latencyMs,
        imageMime: cleanMime,
        approxSizeBytes: estimatedSizeBytes,
      },
    });
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error('Error during Gemma Vision analysis:', error?.message || error);

    // Sanitize error message to prevent accidental key exposure
    let clientErrorMessage = error?.message || 'An unexpected error occurred while communicating with Gemma 4.';
    if (clientErrorMessage.includes('API_KEY')) {
      clientErrorMessage = 'API key validation error. Please check your credentials in AI Studio settings.';
    }

    res.status(500).json({
      error: clientErrorMessage,
      latencyMs,
    });
  }
});

// Start Express server and attach Vite middleware in development
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const server = http.createServer(app);

  if (!isProduction) {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Gemma Vision Assistant] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[Gemma Vision Assistant] Model configured: ${GEMMA_MODEL_ID}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
