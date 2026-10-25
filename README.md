# Gemma Vision Assistant 👁️⚡

> **Turn visual information into useful actions with Gemma 4.**  
> Target Challenge: **Best Use of Gemma 4** — *Hacktoberfest Hack Day Hyderabad (React Hyderabad)*

---

## 📌 Problem Statement

Developers, engineers, QA teams, and operators encounter dozens of visual data artifacts every day:
- **Cryptic terminal errors and build stack traces** that require manual scrolling, deciphering, and web searching.
- **Production cloud dashboards and metrics** that take time to interpret during an incident.
- **Complex UI bugs, misalignment, and layout glitches** that require meticulous reproduction steps and bug reports.
- **Financial statements, invoices, and structured forms** containing key metrics trapped in non-searchable image pixels.

Traditional OCR tools merely transcribe text without contextual awareness, while standard chat models lack structured visual reasoning workflows. Users need an AI assistant that can digest arbitrary screenshots, ground its observations strictly in visible evidence, identify problems, extract data, and output prioritized, step-by-step next actions.

---

## 💡 The Solution

**Gemma Vision Assistant** is a full-stack web application powered by **Gemma 4** (`gemma-4-26b-a4b-it`) via the official Google GenAI SDK (`@google/genai`).

It allows users to drop, paste, or select any screenshot and run four deterministic analysis modes:
1. **Explain Image:** Breaks down visible interface components, visual hierarchy, layout, context, and key takeaways in clean language.
2. **Find Issues:** Conducts an automated visual audit to pinpoint visible errors, stack traces, broken UI states, and anomalies, strictly distinguishing verified visual observations from hypotheses.
3. **Extract Information:** Accurately extracts numbers, keys, metrics, labels, code snippets, and form fields into structured tables and code blocks.
4. **Suggest Actions:** Converts the visual diagnosis into an actionable roadmap categorized by Immediate (High Priority), Recommended (Medium Priority), and Long-term/Preventive measures.

---

## 🎯 Target Users

- **Software Developers & DevOps Engineers:** Fast triage of compiler errors, terminal crashes, CI/CD failure screenshots, and Kubernetes/cloud dashboards.
- **QA & Test Automation Engineers:** Automated bug report generation with observation/hypothesis separation and repro guidance.
- **Product Managers & Designers:** Rapid UI/UX audits and layout hierarchy inspections.
- **Operations & Business Analysts:** Automated data extraction from invoice captures, receipts, and analytics dashboards.

---

## ✨ Features

- **Multimodal Visual Understanding:** Powered directly by `gemma-4-26b-a4b-it`, Google's open instruction-tuned multimodal model.
- **4 Dedicated Analysis Modes:** Instant toggle between Explain, Find Issues, Extract Information, and Suggest Actions.
- **Interactive Screenshot Presets:** Built-in canvas generators for one-click testing (TypeScript build failure, Hyderabad cluster dashboard, SaaS invoice, and mobile checkout bug).
- **Flexible Ingestion:** Drag-and-drop file upload, file browser, and direct clipboard pasting (`Ctrl+V` / `Cmd+V`).
- **Interactive Image Preview:** Full resolution inspection, zoom modal, file metadata chips (size, MIME type, dimensions), and quick replace.
- **Rich Structured Output:** Markdown renderer with copy-to-clipboard, export as `.md` report, and code block formatting.
- **Session History:** In-memory and local session cache allowing instant review of past visual audits without re-triggering API calls.
- **Strict Server-Side Security:** Zero Gemini API keys are exposed to the browser. All inferences run through an Express server proxy.
- **Responsive Dark Theme:** Tailored for laptops, tablets, and mobile viewports with accessible contrast and clean typography.

---

## 🏗️ Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                         │
│  React 19 • Vite • Tailwind CSS • Lucide Icons • Motion     │
│  - Image Upload & Clipboard Ingestion (PNG, JPEG, WEBP)     │
│  - Mode Selector & Custom Inquiries                         │
│  - Rich Markdown Result Viewer & Session History            │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / REST (Port 3000)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Server-Side Backend                       │
│  Node.js • Express • TypeScript • tsx                       │
│  - Endpoint: GET  /api/model-info (Model & Status Check)     │
│  - Endpoint: POST /api/analyze    (Payload Validation)      │
│  - File Size (< 10MB) & MIME Validation                     │
│  - Prompt Synthesis & Strict System Guardrails              │
└──────────────────────────────┬──────────────────────────────┘
                               │ Google GenAI SDK (@google/genai)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Google Gemini API                      │
│  Model: gemma-4-26b-a4b-it (Multimodal Vision Capable)       │
│  - Ingests image base64 inlineData + Mode-specific prompt    │
│  - Returns structured, deterministic analysis               │
└─────────────────────────────────────────────────────────────┘
```

### Technology Breakdown
- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Motion.
- **Backend:** Node.js 22, Express 4, TypeScript, tsx runtime.
- **AI / Multimodal SDK:** Official `@google/genai` (v2.4.0) with required `User-Agent: 'aistudio-build'`.
- **Target Model:** `gemma-4-26b-a4b-it` (Gemma 4 26B Instruction-Tuned).

---

## 🔑 Secure API Key Configuration

The application enforces a **Server-Side Only** architecture:
1. The Gemini API key is read exclusively on the server from `process.env.GEMINI_API_KEY`.
2. The key is **never** bundled into frontend client code, HTML, or logs.
3. In Google AI Studio, the key is automatically injected at runtime from the user's secrets panel.
4. For local deployment, set your key in `.env`:
   ```bash
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (version 20 or later recommended)
- npm (version 10 or later)
- Gemini API Key with access to Gemma 4 models

### 1. Clone or Open the Repository
```bash
git --version
cd gemma-vision-assistant
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` is populated with your key.

### 4. Run the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 🧪 Testing the Application

### Automated Test Suite
A comprehensive test suite is included in `test_runner.ts` covering all 10 core verification criteria:
```bash
npx tsx test_runner.ts
```

Test coverage includes:
1. Explain Image mode with visual input.
2. Find Issues mode with error inspection.
3. Extract Information mode with tabular data.
4. Suggest Actions mode with prioritized roadmap.
5. Submission attempt without image (Validation HTTP 400).
6. Unsupported file format rejection (MIME validation).
7. Payload error handling and size enforcement (< 10MB).
8. Multi-turn sequential image analysis without page refresh.
9. Mobile viewport responsiveness and HTML metadata.
10. Model identifier verification (`gemma-4-26b-a4b-it`).
11. Security audit checking for zero client-side key leakage.

---

## ⚠️ Known Limitations

1. **Static Visual Ingestion:** The current release analyzes static 2D raster images (PNG, JPEG, WEBP, GIF). Dynamic video streams and multi-page PDFs must be converted into screenshots prior to analysis.
2. **Extreme Low-Resolution Inputs:** Images with micro-text below 8px or extreme blurriness may reduce OCR accuracy.
3. **Execution Latency:** Gemma 4 26B visual token processing averages 6–12 seconds depending on image complexity and API queue load.

---

## 🔗 How to Connect to a New GitHub Repository

To connect this Google AI Studio project to your GitHub account:
1. Open the Google AI Studio project workspace.
2. In the top-right header, click the **GitHub** icon or **Export to GitHub**.
3. Authorize Google AI Studio with your GitHub account if prompted.
4. Select **Create New Repository** and enter `gemma-vision-assistant`.
5. Choose **Public** visibility (required for open-source Hacktoberfest submission).
6. Click **Push Code**. The repository will be created with all tracked source files, excluding `.env` and `node_modules` per `.gitignore`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
