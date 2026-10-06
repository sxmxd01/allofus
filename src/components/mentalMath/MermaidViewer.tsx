import React from 'react';
import Markdown from 'react-markdown';
import { MermaidRenderer, extractMermaidCode } from './MermaidRenderer';

interface MermaidViewerProps {
  content?: string; // Markdown string potentially containing ```mermaid ... ``` code blocks
  mermaidSyntax?: string; // Isolated raw Mermaid syntax string
  flowText?: string; // Normal markdown text (Strategy, Shortcut, Inner Voice)
  className?: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({
  content = '',
  mermaidSyntax,
  flowText,
  className = '',
}) => {
  // Determine isolated Mermaid code
  let chartCode = mermaidSyntax || '';
  if (!chartCode && content) {
    chartCode = extractMermaidCode(content);
  }
  if (!chartCode && flowText) {
    chartCode = extractMermaidCode(flowText);
  }

  // Determine clean markdown (without raw ```mermaid code blocks)
  let cleanMarkdown = flowText || content || '';
  cleanMarkdown = cleanMarkdown.replace(/```mermaid[\s\S]*?```/gi, '').trim();

  return (
    <div className={`space-y-4 font-mono text-xs sm:text-sm text-neutral-200 ${className}`}>
      {/* 1. Dynamic Mermaid Flowchart */}
      {chartCode ? (
        <div className="w-full bg-[#09090b] border border-neutral-800 rounded-lg p-3 sm:p-4 overflow-x-auto">
          <MermaidRenderer chart={chartCode} />
        </div>
      ) : null}

      {/* 2. Strategy & Thought Process Markdown */}
      {cleanMarkdown ? (
        <div className="prose prose-invert prose-xs max-w-none text-neutral-300 font-mono leading-relaxed space-y-2 [&_strong]:text-emerald-400 [&_code]:text-emerald-300 [&_code]:bg-neutral-900 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded">
          <Markdown>{cleanMarkdown}</Markdown>
        </div>
      ) : null}
    </div>
  );
};

export default MermaidViewer;
