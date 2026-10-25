# Hacktoberfest Hack Day Hyderabad — Project Submission

## Project Overview

- **Project Title:** Gemma Vision Assistant
- **Short Description:** A multimodal AI assistant that analyzes screenshots and images, explains their contents, identifies visible problems, extracts key data, and suggests actionable next steps using Gemma 4.
- **Selected Challenge:** Best Use of Gemma 4
- **Submitter / Team Lead:** Vinay Kumar Bhukya ([bhukyavinaykumar2507@gmail.com](mailto:bhukyavinaykumar2507@gmail.com))
- **Team Members:** Vinay Kumar Bhukya *(Add additional teammates here if applicable: `[Teammate Name]`)*

---

## Links & Repository

- **Public GitHub Repository URL:** `[YOUR_GITHUB_REPOSITORY_URL_HERE]` *(e.g., https://github.com/vinaykumar2507/gemma-vision-assistant)*
- **Live Demo URL (Shared Preview):** https://ais-pre-le67pcjwv7fsjwc24kfo4c-634737936894.asia-southeast1.run.app
- **Development Environment URL:** https://ais-dev-le67pcjwv7fsjwc24kfo4c-634737936894.asia-southeast1.run.app
- **Demo Video / Pitch Link:** `[ADD_YOUTUBE_OR_LOOM_LINK_HERE_OPTIONAL]`

---

## 1. Problem Statement & Solution

### The Problem
Engineers, testers, and operations teams spend hours manually inspecting visual diagnostic information:
- Error dialogs, compiler stack traces, and terminal logs.
- Cloud architecture monitors and telemetry dashboards.
- UI bug reports, broken alignment states, and visual glitches.
- Invoices, receipts, and tabular documents trapped in static screenshots.

Existing tools either offer rudimentary optical character recognition (OCR) without semantic understanding, or general chat assistants without structured visual diagnostic frameworks.

### The Solution: Gemma Vision Assistant
Gemma Vision Assistant integrates Google's open instruction-tuned multimodal model, **Gemma 4** (`gemma-4-26b-a4b-it`), to execute four structured diagnostic workflows:
1. **Explain Image:** Deconstructs layout hierarchy, visual elements, context, and key takeaways.
2. **Find Issues:** Audits visible defects, stack traces, and layout bugs while rigorously separating verified observations from hypotheses.
3. **Extract Information:** Extracts structured data (tables, numbers, IDs, and verbatim code) into markdown.
4. **Suggest Actions:** Generates prioritized checklists (Immediate, Recommended, Preventive) for rapid triage.

---

## 2. Features & Target Users

### Key Features
- **Pure Multimodal Ingestion:** Ingests PNG, JPEG, WEBP, and GIF images via drag-and-drop, file browsing, or direct clipboard pasting (`Ctrl+V` / `⌘+V`).
- **Interactive Preset Test Suite:** 4 built-in canvas screenshot generators for one-click testing of each analysis mode.
- **Visual Evidence Separation:** In Find Issues mode, strictly separates factual visual evidence from speculative root causes.
- **Session Cache & History:** Retains session analysis history with thumbnail previews to compare multiple modes without repeated API calls.
- **One-Click Markdown & Code Export:** Copy structured results or download full `.md` reports.
- **High-Fidelity Dark UI:** Professional dark theme with indigo/cyan accents, responsive mobile-first layout, and accessible contrast.

### Target Users
- **Software Engineers & DevOps:** Rapid diagnostic triage for CI/CD failure logs and cluster telemetry.
- **QA Automation Engineers:** Fast generation of reproducible bug reports with clear visual observation records.
- **Product & UX Designers:** Automated visual hierarchy and alignment audits.
- **Operations & Finance Teams:** Automated data extraction from invoice captures and status tables.

---

## 3. Technology Stack & Gemma 4 Integration

- **Frontend:** React 19, Vite 8, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Backend:** Node.js 22, Express 4, TypeScript, tsx.
- **Multimodal AI SDK:** Official Google GenAI SDK (`@google/genai` v2.4.0) with required `User-Agent: 'aistudio-build'` telemetry.
- **Model Configured:** `gemma-4-26b-a4b-it` (Gemma 4 26B Instruction-Tuned, Multimodal Vision Capable).
- **Security:** 100% server-side API key handling. The browser client communicates only through internal REST endpoints (`/api/model-info`, `/api/analyze`), ensuring zero API key exposure.

---

## 4. Evidence of Working Multimodal Workflow

The application was verified with automated and manual test runs against the live `gemma-4-26b-a4b-it` model:

| Test Case | Mode Tested | Input Type | Model Response Outcome | Status |
|---|---|---|---|---|
| **Test 1** | Explain Image | Image with visual elements | Structured summary, visual hierarchy breakdown, and context | **PASS** |
| **Test 2** | Find Issues | Error screenshot | Verified observation of error message vs root cause hypothesis | **PASS** |
| **Test 3** | Extract Information | Tabular / numerical image | Extracted fields, labels, metrics, and structured markdown | **PASS** |
| **Test 4** | Suggest Actions | Diagnostic screenshot | Prioritized immediate, medium-term, and long-term action plan | **PASS** |
| **Test 5** | Input Validation | Empty submission | HTTP 400 validation error rejected without API call | **PASS** |
| **Test 6** | MIME Type Guard | Unsupported format (`application/pdf`) | HTTP 400 rejected with clear supported formats notice | **PASS** |
| **Test 7** | Payload Guard | Oversized payload (> 10MB) | HTTP 413 payload too large rejected cleanly | **PASS** |
| **Test 8** | Consecutive Runs | Multi-turn without refresh | Successful sequential executions across different modes | **PASS** |
| **Test 9** | Mobile Layout | Viewport test (375px – 1440px) | Fully responsive navigation, preview scaling, and modal | **PASS** |
| **Test 10** | Model Verification | Runtime model identity | Verified `modelId: "gemma-4-26b-a4b-it"` in responses and UI | **PASS** |

---

## 5. Setup & Local Demonstration Instructions

### Quick Start
```bash
# 1. Clone repository
git clone [YOUR_GITHUB_REPOSITORY_URL_HERE]
cd gemma-vision-assistant

# 2. Install dependencies
npm install

# 3. Configure API Key
cp .env.example .env
# Edit .env and supply your GEMINI_API_KEY="AIzaSy..."

# 4. Start local development server
npm run dev
# Server starts on http://localhost:3000
```

### Testing the Live Application
1. Open `http://localhost:3000` in your browser.
2. In the left sidebar, click any sample preset (e.g., **"TypeScript Build Failure"** or **"Hyderabad Cluster Metrics"**).
3. Select an analysis mode (**Explain Image**, **Find Issues**, **Extract Information**, or **Suggest Actions**).
4. Click the prominent **Analyze Image** button.
5. Review the structured markdown response, click **Copy Result** or **Export**, and test switching to another mode without re-uploading.

---

## 6. Honest Limitations & Acknowledgements

### Limitations
- **Static Raster Formats:** Only processes static 2D images (PNG, JPEG, WEBP, GIF). Video streams or multipage PDFs require converting frames to image format before analysis.
- **Low-Resolution Micro-Text:** Extremely low-resolution screenshots (< 8px font height) or heavy blur can reduce OCR precision.
- **Inference Latency:** Multimodal vision processing with 26B parameters requires 6–12 seconds per request depending on cloud queue load.

### Acknowledgements
- **React Hyderabad** team and community mentors for organizing Hack Day Hyderabad during Hacktoberfest.
- **Google DeepMind & Google AI Studio** for open-access Gemma 4 model releases and the modern `@google/genai` TypeScript SDK.

---

## 7. Submission Workflow (Step-by-Step Instructions)

Follow these exact steps to submit this project to the official React Hyderabad Hack Day repository:

1. **Fork the Official Repository:**
   - Navigate to the official React Hyderabad Hack Day repository: `https://github.com/react-hyderabad/hack-day` *(or the official designated event repo)*.
   - Click the **Fork** button in the top right to create a fork under your GitHub account.

2. **Clone Your Fork Locally:**
   ```bash
   git clone https://github.com/vinaykumar2507/hack-day.git
   cd hack-day
   ```

3. **Create a Submission Branch:**
   ```bash
   git checkout -b submission/gemma-vision-assistant
   ```

4. **Copy the Completed Submission File:**
   - Place this file under the `submissions/` directory:
   ```bash
   mkdir -p submissions
   cp /path/to/gemma-vision-assistant/submissions/gemma-vision-assistant.md submissions/gemma-vision-assistant.md
   ```
   - Ensure you replace `[YOUR_GITHUB_REPOSITORY_URL_HERE]` with your actual public repository URL.

5. **Commit and Push Your Branch:**
   ```bash
   git add submissions/gemma-vision-assistant.md
   git commit -m "Add Hacktoberfest Hack Day submission: Gemma Vision Assistant (Best Use of Gemma 4)"
   git push origin submission/gemma-vision-assistant
   ```

6. **Open a Pull Request:**
   - Go to your fork on GitHub and click **Contribute > Open pull request**.
   - Set the base repository to the React Hyderabad main branch.
   - **PR Title:** `[Submission] Gemma Vision Assistant — Best Use of Gemma 4`
   - Fill in the PR description referencing this submission file.

7. **Verify & Event Platform Finalization:**
   - Verify that all CI checks on the PR pass.
   - Complete any required submission forms on the event platform (Unstop / Devpost) with the PR URL and Live Demo link before the deadline.
