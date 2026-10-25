/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Terminal, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RichMarkdownProps {
  content: string;
}

export const RichMarkdown: React.FC<RichMarkdownProps> = ({ content }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Parse lines and sections
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = '';
  let codeBlockIndex = 0;
  let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (!listBuffer) return;
    const ListTag = listBuffer.type === 'ul' ? 'ul' : 'ol';
    const currentItems = [...listBuffer.items];
    const key = `list-${elements.length}`;

    elements.push(
      <ListTag
        key={key}
        className={`my-3 space-y-2 text-sm text-slate-300 ${
          listBuffer.type === 'ul' ? 'list-disc list-inside' : 'list-decimal list-inside'
        }`}
      >
        {currentItems.map((item, idx) => {
          // Check for task checkbox [ ] or [x]
          const taskMatch = item.match(/^\[([ xX])\]\s*(.*)/);
          if (taskMatch) {
            const isChecked = taskMatch[1].toLowerCase() === 'x';
            return (
              <li key={idx} className="flex items-start gap-2 list-none">
                <span
                  className={`inline-flex items-center justify-center w-4 h-4 rounded mt-0.5 border ${
                    isChecked
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'border-slate-600 bg-slate-900 text-transparent'
                  }`}
                >
                  ✓
                </span>
                <span className="flex-1">{renderInlineFormatting(taskMatch[2])}</span>
              </li>
            );
          }
          return <li key={idx}>{renderInlineFormatting(item)}</li>;
        })}
      </ListTag>
    );
    listBuffer = null;
  };

  lines.forEach((line, lineIdx) => {
    // Code block toggle
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        flushList();
        const codeText = codeBuffer.join('\n');
        const currentIndex = codeBlockIndex++;
        elements.push(
          <div key={`code-${currentIndex}`} className="my-4 rounded-lg overflow-hidden border border-slate-800 bg-slate-950/80">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                {codeLanguage || 'code'}
              </span>
              <button
                type="button"
                onClick={() => copyCode(codeText, currentIndex)}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                title="Copy code"
              >
                {copiedCodeIndex === currentIndex ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed whitespace-pre">
              {codeText}
            </pre>
          </div>
        );
        codeBuffer = [];
        codeLanguage = '';
        inCodeBlock = false;
        return;
      } else {
        flushList();
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3).trim();
        codeBuffer = [];
        return;
      }
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList();
      const headingText = trimmed.slice(4);
      elements.push(
        <h3
          key={`h3-${lineIdx}`}
          className="text-base font-semibold text-indigo-200 mt-5 mb-2.5 pb-1 border-b border-slate-800/80 flex items-center gap-2"
        >
          <span className="w-1.5 h-4 bg-indigo-500 rounded-full inline-block" />
          {renderInlineFormatting(headingText)}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      const headingText = trimmed.slice(3);
      elements.push(
        <h2
          key={`h2-${lineIdx}`}
          className="text-lg font-bold text-slate-100 mt-6 mb-3 pb-1.5 border-b border-slate-700/60 flex items-center gap-2"
        >
          <span className="w-2 h-5 bg-cyan-400 rounded-full inline-block" />
          {renderInlineFormatting(headingText)}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList();
      const headingText = trimmed.slice(2);
      elements.push(
        <h1 key={`h1-${lineIdx}`} className="text-xl font-bold text-white mt-6 mb-3">
          {renderInlineFormatting(headingText)}
        </h1>
      );
      return;
    }

    // Bullet lists (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.slice(2);
      if (!listBuffer || listBuffer.type !== 'ul') {
        flushList();
        listBuffer = { type: 'ul', items: [itemText] };
      } else {
        listBuffer.items.push(itemText);
      }
      return;
    }

    // Numbered lists (1. , 2. )
    const numberedMatch = trimmed.match(/^\d+\.\s+(.*)/);
    if (numberedMatch) {
      const itemText = numberedMatch[1];
      if (!listBuffer || listBuffer.type !== 'ol') {
        flushList();
        listBuffer = { type: 'ol', items: [itemText] };
      } else {
        listBuffer.items.push(itemText);
      }
      return;
    }

    // Callout / Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      const quoteText = trimmed.slice(2);
      elements.push(
        <blockquote
          key={`quote-${lineIdx}`}
          className="my-3 pl-3.5 py-1.5 border-l-2 border-indigo-400 bg-indigo-950/20 text-indigo-200 text-sm italic rounded-r"
        >
          {renderInlineFormatting(quoteText)}
        </blockquote>
      );
      return;
    }

    // Standard Paragraph
    flushList();
    elements.push(
      <p key={`p-${lineIdx}`} className="my-2 text-sm text-slate-300 leading-relaxed">
        {renderInlineFormatting(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className="space-y-1.5">{elements}</div>;
};

// Simple inline parser for bold, inline code, and highlights
function renderInlineFormatting(text: string): React.ReactNode {
  // Split tokens by code `...` and bold **...**
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Check for inline code `...`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <code
          key={`code-${keyIdx++}`}
          className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Check for bold **...**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={`bold-${keyIdx++}`} className="font-semibold text-slate-100">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Check for italic *...*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push(
        <em key={`italic-${keyIdx++}`} className="italic text-slate-300">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Regular character accumulation
    const nextSpecial = remaining.search(/[`*]/);
    if (nextSpecial === -1) {
      parts.push(remaining);
      break;
    } else {
      parts.push(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return <>{parts}</>;
}
