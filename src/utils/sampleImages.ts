/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SamplePreset {
  id: string;
  title: string;
  category: string;
  recommendedMode: 'explain' | 'issues' | 'extract' | 'actions';
  description: string;
  fileName: string;
  getDataUrl: () => string;
  dataUrl?: string;
  imageSrc?: string;
}

const FALLBACK_PNG_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACWCAIAAAAUvlBOAAABmUlEQVR4nO3SQQkAIADAQBv4tIP9A1rCIcjBBdhjY64N143nBXzJWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxFwlgkjEXCWCSMRcJYJIxF4gC3AKEdn2QZMQAAAABJRU5ErkJggg==';

let cachedTerminalPng = '';
let cachedDashboardPng = '';
let cachedInvoicePng = '';
let cachedMobilePng = '';

export function generateTerminalErrorImage(): string {
  if (cachedTerminalPng) return cachedTerminalPng;
  if (typeof document === 'undefined') return FALLBACK_PNG_DATA_URL;

  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 540;
  const ctx = canvas.getContext('2d');
  if (!ctx) return FALLBACK_PNG_DATA_URL;

  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Terminal Window Bar
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, canvas.width, 36);

  // Window buttons
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(20, 18, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(40, 18, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(60, 18, 6, 0, Math.PI * 2);
  ctx.fill();

  // Title
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px monospace';
  ctx.fillText('bash - deploy@prod-node-04: ~/services/gemma-backend (npm run build)', 100, 22);

  // Code & Error content
  ctx.font = '14px "JetBrains Mono", monospace';
  let y = 70;

  ctx.fillStyle = '#38bdf8';
  ctx.fillText('$ npm run build', 30, y);
  y += 28;

  ctx.fillStyle = '#94a3b8';
  ctx.fillText('> gemma-vision-app@1.0.0 build', 30, y);
  y += 24;
  ctx.fillText('> tsc && vite build', 30, y);
  y += 35;

  ctx.fillStyle = '#ef4444';
  ctx.fillText('src/components/AnalysisPanel.tsx:48:22 - error TS2339: Property \'result\' does not exist', 30, y);
  y += 24;
  ctx.fillText('on type \'Promise<AnalysisResponse>\'. Did you forget to await the promise?', 30, y);
  y += 32;

  ctx.fillStyle = '#64748b';
  ctx.fillText('48   const summary = response.result.overview;', 30, y);
  y += 24;
  ctx.fillStyle = '#ef4444';
  ctx.fillText('                     ~~~~~~~~~~~~', 30, y);
  y += 35;

  ctx.fillStyle = '#f87171';
  ctx.fillText('Unhandled Runtime Rejection: TypeError: Cannot read properties of undefined (reading \'overview\')', 30, y);
  y += 24;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('    at Object.renderContent (/app/src/components/AnalysisPanel.tsx:48:22)', 30, y);
  y += 22;
  ctx.fillText('    at commitHookEffectListMount (node_modules/react-dom/cjs/react-dom.development.js:23150:26)', 30, y);
  y += 22;
  ctx.fillText('    at commitPassiveMountEffects (node_modules/react-dom/cjs/react-dom.development.js:23216:11)', 30, y);
  y += 38;

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(30, y - 18, 380, 28);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('Exit code 1: Build failed with 1 error.', 40, y);
  const dataUrl = canvas.toDataURL('image/png');
  cachedTerminalPng = dataUrl;
  return dataUrl;
}

export function generateDashboardMetricsImage(): string {
  if (cachedDashboardPng) return cachedDashboardPng;
  if (typeof document === 'undefined') return FALLBACK_PNG_DATA_URL;

  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 560;
  const ctx = canvas.getContext('2d');
  if (!ctx) return FALLBACK_PNG_DATA_URL;

  // Background
  ctx.fillStyle = '#0b1329';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Nav
  ctx.fillStyle = '#111e38';
  ctx.fillRect(0, 0, canvas.width, 56);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('HYDERABAD CLUSTER METRICS — REGION: ASIA-SOUTH1', 30, 34);

  ctx.fillStyle = '#10b981';
  ctx.fillRect(800, 16, 130, 26);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('STATUS: HEALTHY', 814, 33);

  // 4 Metric Cards
  const cards = [
    { title: 'CPU Utilization', value: '88.4%', sub: 'Spike alert triggered', color: '#f59e0b', status: 'HIGH LOAD' },
    { title: 'Active Inferences', value: '4,280 / sec', sub: '+18% vs last hour', color: '#38bdf8', status: 'NOMINAL' },
    { title: 'p99 Latency', value: '342 ms', sub: 'Target: < 500ms', color: '#10b981', status: 'OPTIMAL' },
    { title: 'Memory Allocated', value: '14.2 GB / 16 GB', sub: '88.7% saturation', color: '#ef4444', status: 'WARNING' },
  ];

  cards.forEach((card, i) => {
    const x = 30 + i * 228;
    const y = 80;
    ctx.fillStyle = '#172554';
    ctx.fillRect(x, y, 212, 120);

    // border
    ctx.strokeStyle = '#1e3a8a';
    ctx.strokeRect(x, y, 212, 120);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText(card.title, x + 16, y + 26);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(card.value, x + 16, y + 62);

    ctx.fillStyle = card.color;
    ctx.font = '11px sans-serif';
    ctx.fillText(card.sub, x + 16, y + 90);

    ctx.fillStyle = card.color;
    ctx.fillRect(x + 130, y + 14, 70, 18);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText(card.status, x + 136, y + 27);
  });

  // Services Table Section
  ctx.fillStyle = '#172554';
  ctx.fillRect(30, 230, 900, 290);
  ctx.strokeStyle = '#1e3a8a';
  ctx.strokeRect(30, 230, 900, 290);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('Microservice Health & Resource Allocation', 50, 265);

  // Table header
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(50, 285, 860, 32);
  ctx.fillStyle = '#93c5fd';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('SERVICE NAME', 65, 305);
  ctx.fillText('MODEL WORKLOAD', 260, 305);
  ctx.fillText('REPLICAS', 480, 305);
  ctx.fillText('ERROR RATE', 620, 305);
  ctx.fillText('UPTIME', 780, 305);

  const rows = [
    { name: 'vision-analyzer-svc', workload: 'gemma-4-26b-a4b-it', replicas: '12 / 12', error: '0.01%', uptime: '99.98%' },
    { name: 'ocr-extraction-svc', workload: 'gemma-4-31b-it', replicas: '8 / 8', error: '0.00%', uptime: '100.0%' },
    { name: 'issue-diagnostics-svc', workload: 'gemma-4-26b-a4b-it', replicas: '6 / 6', error: '0.04%', uptime: '99.92%' },
    { name: 'api-gateway-proxy', workload: 'Express Node.js', replicas: '4 / 4', error: '0.00%', uptime: '100.0%' },
  ];

  rows.forEach((r, idx) => {
    const rowY = 340 + idx * 42;
    ctx.fillStyle = idx % 2 === 0 ? '#132147' : '#0f1c3d';
    ctx.fillRect(50, rowY - 20, 860, 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = '13px monospace';
    ctx.fillText(r.name, 65, rowY);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(r.workload, 260, rowY);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(r.replicas, 480, rowY);
    ctx.fillStyle = r.error === '0.00%' ? '#34d399' : '#fbbf24';
    ctx.fillText(r.error, 620, rowY);
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText(r.uptime, 780, rowY);
  });

  const dataUrl = canvas.toDataURL('image/png');
  cachedDashboardPng = dataUrl;
  return dataUrl;
}

export function generateInvoiceImage(): string {
  if (cachedInvoicePng) return cachedInvoicePng;
  if (typeof document === 'undefined') return FALLBACK_PNG_DATA_URL;

  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return FALLBACK_PNG_DATA_URL;

  // Clean paper white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header banner
  ctx.fillStyle = '#4338ca';
  ctx.fillRect(0, 0, canvas.width, 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('INVOICE / TAX STATEMENT', 40, 50);

  ctx.font = '14px sans-serif';
  ctx.fillText('Invoice #: INV-2026-OCT-894', 540, 50);

  // Invoice Details
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('BILLED TO:', 40, 120);
  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('Apex Global Technologies Ltd', 40, 142);
  ctx.fillText('Hitec City, Madhapur, Hyderabad, TS 500081', 40, 162);
  ctx.fillText('GSTIN: 36AAACA1234F1Z5', 40, 182);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('PAYMENT DETAILS:', 480, 120);
  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('Date: October 24, 2026', 480, 142);
  ctx.fillText('Due Date: November 07, 2026', 480, 162);
  ctx.fillText('Payment Terms: Net 14 Days', 480, 182);

  // Line Items Table
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(40, 220, 720, 36);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('ITEM DESCRIPTION', 55, 243);
  ctx.fillText('QTY', 420, 243);
  ctx.fillText('UNIT PRICE', 510, 243);
  ctx.fillText('TOTAL AMOUNT', 630, 243);

  const items = [
    { desc: 'Gemma 4 Vision Inference Cluster (26B-A4B-IT)', qty: '4 Nodes', unit: '$300.00', total: '$1,200.00' },
    { desc: 'Cloud SQL Postgres High Availability Dedicated', qty: '1 DB', unit: '$450.00', total: '$450.00' },
    { desc: 'Edge CDN Bandwidth & Image Proxy (5 TB)', qty: '5 TB', unit: '$36.00', total: '$180.00' },
    { desc: 'Enterprise 24/7 SLA Support Package', qty: '1 Month', unit: '$250.00', total: '$250.00' },
  ];

  let lineY = 285;
  items.forEach((item, i) => {
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#f8fafc';
    ctx.fillRect(40, lineY - 20, 720, 34);

    ctx.fillStyle = '#1e293b';
    ctx.font = '13px sans-serif';
    ctx.fillText(item.desc, 55, lineY);
    ctx.fillText(item.qty, 420, lineY);
    ctx.fillText(item.unit, 510, lineY);
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(item.total, 630, lineY);

    lineY += 38;
  });

  // Totals Box
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(440, 440, 320, 130);
  ctx.strokeStyle = '#e2e8f0';
  ctx.strokeRect(440, 440, 320, 130);

  ctx.fillStyle = '#475569';
  ctx.font = '13px sans-serif';
  ctx.fillText('Subtotal:', 460, 468);
  ctx.fillText('$2,080.00', 670, 468);

  ctx.fillText('Taxes & GST (18%):', 460, 496);
  ctx.fillText('$374.40', 670, 496);

  ctx.fillStyle = '#4338ca';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('Total Amount Due:', 460, 538);
  ctx.fillText('$2,454.40 USD', 635, 538);

  const dataUrl = canvas.toDataURL('image/png');
  cachedInvoicePng = dataUrl;
  return dataUrl;
}

export function generateMobileCheckoutBugImage(): string {
  if (cachedMobilePng) return cachedMobilePng;
  if (typeof document === 'undefined') return FALLBACK_PNG_DATA_URL;

  const canvas = document.createElement('canvas');
  canvas.width = 460;
  canvas.height = 760;
  const ctx = canvas.getContext('2d');
  if (!ctx) return FALLBACK_PNG_DATA_URL;

  // Phone frame
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Status bar
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, canvas.width, 40);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('9:41', 24, 25);
  ctx.fillText('5G  100%', 390, 25);

  // App Bar
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(0, 40, canvas.width, 56);
  ctx.fillStyle = '#a5b4fc';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('← Checkout (Step 3 of 3)', 20, 75);

  // Error Alert Banner
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(20, 115, 420, 58);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('⚠ Error 409: Coupon Code EXPIRED', 36, 140);
  ctx.font = '11px sans-serif';
  ctx.fillText('The promo code "OCTOBER_DEV" reached its maximum limit.', 36, 158);

  // Shipping Address Card
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(20, 190, 420, 110);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('Delivery Address', 36, 216);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '12px sans-serif';
  ctx.fillText('Vinay Kumar Bhukya', 36, 240);
  ctx.fillText('React Hyderabad Hack Day — T-Hub Phase 2', 36, 258);
  ctx.fillText('Hyderabad, Telangana, 500081', 36, 276);

  // Broken Form Field (Overlapping & Out-of-bounds UI glitch)
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(20, 320, 420, 130);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.fillText('Discount Coupon Code', 36, 345);

  // Input Box with overlapping red text
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(36, 360, 260, 44);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 360, 260, 44);

  ctx.fillStyle = '#ef4444';
  ctx.font = '13px monospace';
  ctx.fillText('OCTOBER_DEV', 48, 388);

  // Apply Button disabled
  ctx.fillStyle = '#475569';
  ctx.fillRect(310, 360, 110, 44);
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('Apply', 346, 388);

  // Visual Bug: Overlapping label clipping into bottom border
  ctx.fillStyle = '#f87171';
  ctx.font = '10px sans-serif';
  ctx.fillText('* Discount could not be applied. NaN calculated for subtotal.', 36, 425);

  // Price Summary
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(20, 470, 420, 140);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '13px sans-serif';
  ctx.fillText('Subtotal:', 36, 500);
  ctx.fillText('$129.00', 360, 500);

  ctx.fillText('Discount:', 36, 530);
  ctx.fillStyle = '#ef4444';
  ctx.fillText('-$NaN', 370, 530);

  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('Estimated Shipping:', 36, 560);
  ctx.fillText('FREE', 368, 560);

  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('Order Total:', 36, 592);
  ctx.fillStyle = '#ef4444';
  ctx.fillText('$NaN USD', 350, 592);

  // Disabled Pay Button
  ctx.fillStyle = '#334155';
  ctx.fillRect(20, 640, 420, 52);
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('Place Order (Disabled - Invalid Total)', 85, 672);

  const dataUrl = canvas.toDataURL('image/png');
  cachedMobilePng = dataUrl;
  return dataUrl;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'terminal-error',
    title: 'TypeScript Build Failure',
    category: 'Developer Tools',
    recommendedMode: 'issues',
    description: 'Terminal output with unhandled rejection, missing await, and exit code 1.',
    fileName: 'terminal_build_error.png',
    getDataUrl: generateTerminalErrorImage,
    get dataUrl() {
      return generateTerminalErrorImage();
    },
    get imageSrc() {
      return generateTerminalErrorImage();
    },
  },
  {
    id: 'dashboard-metrics',
    title: 'Hyderabad Cluster Metrics',
    category: 'Cloud Architecture',
    recommendedMode: 'explain',
    description: 'Production cluster monitor with CPU spike, service table, and Gemma workloads.',
    fileName: 'cluster_metrics_dashboard.png',
    getDataUrl: generateDashboardMetricsImage,
    get dataUrl() {
      return generateDashboardMetricsImage();
    },
    get imageSrc() {
      return generateDashboardMetricsImage();
    },
  },
  {
    id: 'invoice-statement',
    title: 'Enterprise SaaS Invoice',
    category: 'Finance / Documents',
    recommendedMode: 'extract',
    description: 'Formatted invoice #INV-2026-OCT-894 with line items, tax breakdown, and GSTIN.',
    fileName: 'invoice_inv_2026_894.png',
    getDataUrl: generateInvoiceImage,
    get dataUrl() {
      return generateInvoiceImage();
    },
    get imageSrc() {
      return generateInvoiceImage();
    },
  },
  {
    id: 'mobile-checkout-bug',
    title: 'Mobile Checkout UI Glitch',
    category: 'App QA & Testing',
    recommendedMode: 'actions',
    description: 'Expired promo code causing NaN order total and disabled payment button.',
    fileName: 'mobile_checkout_glitch.png',
    getDataUrl: generateMobileCheckoutBugImage,
    get dataUrl() {
      return generateMobileCheckoutBugImage();
    },
    get imageSrc() {
      return generateMobileCheckoutBugImage();
    },
  },
];

/**
 * Robust helper to safely obtain a valid data URL from any sample preset, ID, or file name.
 */
export function getPresetDataUrl(sample: SamplePreset | string | any): string {
  if (!sample) return FALLBACK_PNG_DATA_URL;

  // If a string was passed (like ID or fileName)
  if (typeof sample === 'string') {
    const match = SAMPLE_PRESETS.find((p) => p.id === sample || p.fileName === sample);
    if (match) return getPresetDataUrl(match);
    if (sample.startsWith('data:image/')) return sample;
    return FALLBACK_PNG_DATA_URL;
  }

  // If object has dataUrl string
  if (typeof sample.dataUrl === 'string' && sample.dataUrl.startsWith('data:image/')) {
    return sample.dataUrl;
  }

  // If object has imageSrc string
  if (typeof sample.imageSrc === 'string' && sample.imageSrc.startsWith('data:image/')) {
    return sample.imageSrc;
  }

  // If object has getDataUrl function
  if (typeof sample.getDataUrl === 'function') {
    try {
      const url = sample.getDataUrl();
      if (url && typeof url === 'string' && url.startsWith('data:image/')) {
        return url;
      }
    } catch (e) {
      console.warn('Error invoking sample.getDataUrl():', e);
    }
  }

  // Match against known presets by id or fileName
  const presetMatch = SAMPLE_PRESETS.find((p) => p.id === sample.id || p.fileName === sample.fileName);
  if (presetMatch && typeof presetMatch.getDataUrl === 'function') {
    try {
      const url = presetMatch.getDataUrl();
      if (url && typeof url === 'string' && url.startsWith('data:image/')) {
        return url;
      }
    } catch (e) {
      console.warn('Error invoking presetMatch.getDataUrl():', e);
    }
  }

  return FALLBACK_PNG_DATA_URL;
}
