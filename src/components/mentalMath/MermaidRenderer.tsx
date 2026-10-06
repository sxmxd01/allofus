import React, { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
  className?: string;
}

let isMermaidConfigured = false;

function ensureMermaidConfig() {
  if (!isMermaidConfigured && typeof window !== 'undefined') {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        themeVariables: {
          darkMode: true,
          background: '#09090b',
          primaryColor: '#10b981',
          primaryTextColor: '#f4f4f5',
          primaryBorderColor: '#059669',
          lineColor: '#71717a',
          secondaryColor: '#18181b',
          tertiaryColor: '#27272a',
          textColor: '#f4f4f5',
          mainBkg: '#18181b',
          nodeBorder: '#10b981',
        },
      });
      isMermaidConfigured = true;
    } catch (e) {
      console.warn('Mermaid config notice:', e);
    }
  }
}

/**
 * Extracts raw Mermaid code inside triple backticks if present
 */
export function extractMermaidCode(rawText: string): string {
  if (!rawText) return '';
  const match = rawText.match(/```mermaid\s*\n?([\s\S]*?)```/i);
  if (match) {
    return match[1].trim();
  }
  // If already pure mermaid syntax without backticks
  if (rawText.includes('graph ') || rawText.includes('flowchart ')) {
    return rawText.trim();
  }
  return '';
}

/**
 * Robust, dynamic Mermaid Flowchart component
 */
export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const rawId = useId().replace(/[:]/g, '_');
  const cleanChart = extractMermaidCode(chart);

  useEffect(() => {
    if (!cleanChart) {
      setSvgContent('');
      return;
    }

    ensureMermaidConfig();
    let isCancelled = false;

    async function renderDiagram() {
      try {
        setRenderError(null);
        const uniqueId = `mermaid_svg_${rawId}_${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, cleanChart);
        if (!isCancelled) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.warn('Mermaid diagram render notice:', err?.message || err);
          setRenderError(err?.message || 'Could not compile diagram');
        }
      }
    }

    renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [cleanChart, rawId]);

  if (!cleanChart) return null;

  return (
    <div className={`w-full overflow-x-auto select-none my-3 ${className}`}>
      {svgContent ? (
        <div
          ref={containerRef}
          className="w-full flex justify-center items-center py-2 [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:drop-shadow-sm"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : renderError ? (
        <div className="p-3 text-xs font-mono text-neutral-400 bg-neutral-900/80 border border-neutral-800 rounded">
          <span className="text-[10px] text-neutral-500 uppercase block mb-1">Flowchart:</span>
          <pre className="overflow-x-auto whitespace-pre">{cleanChart}</pre>
        </div>
      ) : (
        <div className="py-3 text-xs font-mono text-neutral-500 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Rendering cognitive flowchart...</span>
        </div>
      )}
    </div>
  );
};

export default MermaidRenderer;
