# 🎙️ Two-Minute Live Demonstration Script: Gemma Vision Assistant

**Target Challenge:** Best Use of Gemma 4 — Hacktoberfest Hack Day Hyderabad  
**Model Configured:** `gemma-4-26b-a4b-it`  
**Duration:** Exactly 2 minutes (120 seconds)  

---

## ⏱️ Timeline & Stage Overview

| Timing | Segment | On-Screen Action | Key Message |
|---|---|---|---|
| **0:00 – 0:15** | Introduction to Problem | Display app landing page with dark theme | Visual errors & metrics take too much time to manually triage |
| **0:15 – 0:40** | Image Upload & Mode Selection | Click "TypeScript Build Failure" preset or paste screenshot | Quick ingestion, instant preview, mode selection |
| **0:40 – 1:05** | Live Gemma 4 Analysis | Click "Analyze Image with Find Issues" | Progress bar, structured result with observation vs hypothesis |
| **1:05 – 1:30** | Multimodal Architecture | Scroll result, switch mode to "Suggest Actions", open About modal | 100% server-side Node.js proxy, official `@google/genai` SDK |
| **1:30 – 1:50** | Differentiator & Limitation | Show Markdown copy/export & code structure in sidebar | 4 deterministic modes vs general chat; limitation: static images only |
| **1:50 – 2:00** | Conclusion & GitHub | Display GitHub repo link & Hack Day badge | Clear closing call to action |

---

## 🎬 Step-by-Step Script with Exact Words & Actions

### 1. Introduction to the Problem (0:00 – 0:15)
- **On-Screen Action:**  
  Show the main interface at `http://localhost:3000`. Highlight the title **"Gemma Vision Assistant"** and the active model badge **`gemma-4-26b-a4b-it`**.
- **Spoken Words:**  
  > *"Hello everyone! As developers and engineers, we deal with dozens of screenshots every day — broken terminal stack traces, overloaded cloud dashboards, and UI glitches. But copying logs or writing bug tickets manually is slow and error-prone. Today, I'm presenting **Gemma Vision Assistant**, an open-source tool built with Gemma 4 that transforms visual screenshots into structured, actionable engineering outcomes."*

---

### 2. Live Image Ingestion & Mode Selection (0:15 – 0:40)
- **On-Screen Action:**  
  Click on the **"TypeScript Build Failure"** sample preset from the left sidebar (or drag & drop a real screenshot, or press `Ctrl+V`).  
  Point to the high-resolution preview showing the error: `TypeError: Cannot read properties of undefined (reading 'overview') at AnalysisPanel.tsx:48`.  
  Select the **"Find Issues"** mode card.
- **Spoken Words:**  
  > *"You can drag and drop any PNG or JPEG, paste directly from your clipboard, or select a sample preset. Here, we've loaded a real developer screenshot of a broken build. Notice our four dedicated modes: Explain Image, Find Issues, Extract Information, and Suggest Actions. Let's select **Find Issues** to diagnose what broke."*

---

### 3. Live Gemma 4 Analysis & Structured Result (0:40 – 1:05)
- **On-Screen Action:**  
  Click the prominent **"Analyze Image with Find Issues"** button.  
  Observe the loading indicator showing the progress steps: *"Sending to Gemma 4 (gemma-4-26b-a4b-it)..."*.  
  When the result card appears, scroll through the structured sections: **Executive Summary**, **Visible Problems & Anomalies**, and **Factual Observation vs. Hypothesis**.
- **Spoken Words:**  
  > *"We click Analyze. Our Node.js backend sends the raw image tokens directly to `gemma-4-26b-a4b-it` using the official Google GenAI SDK. And here is our result! Notice how Gemma 4 doesn't just give vague text: it specifically identifies the exact TypeScript error TS2339 on line 48, explicitly marks the missing await as a verified visual observation, and separates it from the root cause hypothesis. That strict separation is essential for developer trust."*

---

### 4. Multimodal Architecture & Second Mode Demo (1:05 – 1:30)
- **On-Screen Action:**  
  Click the **"Run Suggest Actions"** button at the bottom of the result panel to re-analyze the exact same image without re-uploading.  
  Briefly open the **"About"** modal to show the architecture overview.
- **Spoken Words:**  
  > *"Without re-uploading, I can immediately switch modes to **Suggest Actions**. Under the hood, the application is built with a React 19 frontend and an Express Node.js server. Crucially, the Gemini API key is stored securely in server-side environment variables and is never exposed to the client browser. Gemma 4 provides prioritized checkboxes: immediate high-priority fixes, compiler checks, and preventive linting rules."*

---

### 5. Key Implementation Files, Differentiator & Limitation (1:30 – 1:50)
- **On-Screen Action:**  
  Click **"Copy Result"** (showing the green Copied checkmark) and show the file structure (`server.ts`, `src/App.tsx`, `src/components/TaskSelector.tsx`).
- **Spoken Words:**  
  > *"The core differentiator of Gemma Vision Assistant is that it isn't an unconstrained chatbot — it provides four structured, purpose-built multimodal workflows tailored for engineering tasks, with full copy and Markdown export. One honest limitation today: it operates on static screenshots rather than real-time video feeds, but it handles all common image formats up to 10 megabytes."*

---

### 6. Closing Statement (1:50 – 2:00)
- **On-Screen Action:**  
  Close the modal and point to the **"Hacktoberfest Hack Day Hyderabad — Best Use of Gemma 4"** badge and GitHub documentation link.
- **Spoken Words:**  
  > *"Gemma Vision Assistant shows the true practical power of Gemma 4's visual understanding for daily developer productivity. The project is completely open source under the MIT License and ready for review. Thank you!"*

---

## 🛡️ Backup Plan (Network / API Outage Fallback)

If the venue Wi-Fi or API encounters transient latency during the live pitch:
1. Open the **Session History** in the left sidebar where previous runs on each sample preset are pre-cached in memory/localStorage.
2. Click any history item (e.g. `cluster_metrics_dashboard.png` or `terminal_build_error.png`) to instantly render the full, verified Gemma 4 result and latency metadata without initiating a new network round-trip.
