import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Copy,
  Download,
  Trash2,
  Check,
  Edit3,
  Eye,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { fetchSharedNotes, saveSharedNotes } from '../lib/clatService';
import { supabase } from '../lib/supabase';

interface LiveDumpProps {
  initialNotes: string;
}

export const LiveDump: React.FC<LiveDumpProps> = ({ initialNotes }) => {
  const [content, setContent] = useState<string>(initialNotes);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [syncStatus, setSyncStatus] = useState<'saved' | 'syncing' | 'offline'>('saved');
  const [isLiveConnected, setIsLiveConnected] = useState(true);

  // Track if current update was initiated locally to avoid cursor jumping / feedback loop
  const localUpdateTimestampRef = useRef<number>(0);
  const debounceTimerRef = useRef<any>(null);

  // 1. Initial Load from Supabase shared_notes (id: 'global_dump')
  useEffect(() => {
    let isMounted = true;
    async function loadNotes() {
      const serverContent = await fetchSharedNotes();
      if (isMounted && serverContent !== null) {
        setContent(serverContent);
      }
    }
    loadNotes();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Real-time Subscription to shared_notes (id: 'global_dump')
  useEffect(() => {
    const channel = supabase
      .channel('realtime:shared_notes:global_dump')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shared_notes',
          filter: 'id=eq.global_dump',
        },
        (payload) => {
          // If the change came from another client, apply it
          const newRow = payload.new as { content?: string; updated_at?: string } | undefined;
          if (newRow && typeof newRow.content === 'string') {
            const timeSinceLocalEdit = Date.now() - localUpdateTimestampRef.current;
            // Only overwrite if not typed in the last 600ms
            if (timeSinceLocalEdit > 600) {
              setContent(newRow.content);
              setSyncStatus('saved');
            }
          }
        }
      )
      .subscribe((status) => {
        setIsLiveConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. User Typing Handler with 500ms Debounce to Supabase
  const handleContentChange = (newText: string) => {
    setContent(newText);
    localUpdateTimestampRef.current = Date.now();
    setSyncStatus('syncing');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      const success = await saveSharedNotes(newText);
      setSyncStatus(success ? 'saved' : 'offline');
    }, 500);
  };

  // Compute text statistics
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lineCount = content ? content.split('\n').length : 0;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopy = () => {
    sounds.playClick();
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    sounds.playClick();
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CLAT_Shared_Notes_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('Clear Live Dump shared notes? Changes will sync to Supabase for all users.')) {
      sounds.playClick();
      handleContentChange('');
    }
  };

  const insertTemplate = (template: string) => {
    sounds.playClick();
    const updated = content ? `${content}\n\n${template}` : template;
    handleContentChange(updated);
  };

  const caseTemplate = `### [CASE NAME] v. [RESPONDENT] (Year)
- **Bench:** [e.g. 5-Judge Constitution Bench headed by CJI]
- **Key Constitutional Provisions:** Article [e.g. 14, 19(1)(a), 21]
- **Ratio Decidendi (Core Principle):** 
- **Obiter Dicta:** 
- **Exam Importance:** [High / Critical for Legal Reasoning]`;

  const legalMaximTemplate = `### LEGAL MAXIMS SNAPSHOT
- **Ubi jus ibi remedium:** Where there is a right, there is a remedy.
- **Volenti non fit injuria:** To a willing person, no injury is done.
- **Actus non facit reum nisi mens sit rea:** An act does not make a person guilty unless the mind is also guilty.
- **Audi alteram partem:** Hear the other side (rule of natural justice).
- **Damnum sine injuria:** Damage without legal injury (not actionable).
- **Injuria sine damno:** Legal injury without physical damage (actionable in tort).`;

  const mistakeLogTemplate = `### MISTAKE LOG [Date: ${new Date().toLocaleDateString()}]
- **Question Concept:** 
- **What I Selected:** 
- **Correct Legal Rule:** 
- **Trap Avoidance Rule:** `;

  return (
    <div className="max-w-[1536px] mx-auto px-3 sm:px-6 py-4 sm:py-5 flex flex-col h-[calc(100vh-160px)]">
      {/* Top Controls Toolbar */}
      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-t-lg sm:rounded-t-xl flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">
              LIVE_DUMP.TXT
            </span>
          </div>
          <span className="text-zinc-600">|</span>

          {/* Supabase Live indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-amber-400">Syncing to Supabase (500ms)...</span>
              </>
            ) : syncStatus === 'saved' ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Live Supabase Synced</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-zinc-400">Local Buffer (Syncing...)</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Insert Templates */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono no-scrollbar">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider hidden xl:inline">
            Insert:
          </span>
          <button
            onClick={() => insertTemplate(caseTemplate)}
            className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-[11px] whitespace-nowrap active:scale-95 touch-manipulation min-h-[32px]"
          >
            + Case Brief
          </button>
          <button
            onClick={() => insertTemplate(legalMaximTemplate)}
            className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-[11px] whitespace-nowrap active:scale-95 touch-manipulation min-h-[32px]"
          >
            + Legal Maxims
          </button>
          <button
            onClick={() => insertTemplate(mistakeLogTemplate)}
            className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-[11px] whitespace-nowrap active:scale-95 touch-manipulation min-h-[32px]"
          >
            + Mistake Log
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Mode Switcher */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-md p-0.5">
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('editor');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors active:scale-95 touch-manipulation min-h-[32px] ${
                viewMode === 'editor'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('preview');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors active:scale-95 touch-manipulation min-h-[32px] ${
                viewMode === 'preview'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 touch-manipulation transition-colors min-h-[32px]"
            title="Copy entire text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 touch-manipulation transition-colors min-h-[32px]"
            title="Download as Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={handleClear}
            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400 active:scale-95 touch-manipulation transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
            title="Clear notes"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Large Full-Screen Editor Area */}
      <div className="flex-1 bg-black border-x border-zinc-800 relative overflow-hidden flex flex-col">
        {viewMode === 'editor' ? (
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Live shared notes dump... Automatically synced to Supabase shared_notes (id: global_dump) with 500ms debounce. Real-time updates broadcast to all students."
            className="w-full flex-1 p-4 sm:p-6 bg-transparent text-emerald-400 font-mono text-sm sm:text-base leading-relaxed resize-none focus:outline-none placeholder:text-zinc-700 selection:bg-emerald-500/30 selection:text-emerald-200"
            spellCheck={false}
          />
        ) : (
          <div className="w-full flex-1 p-4 sm:p-6 overflow-y-auto font-sans text-sm sm:text-base leading-relaxed text-zinc-200 space-y-4">
            {content ? (
              content.split('\n').map((line, idx) => {
                if (line.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-base sm:text-lg font-bold text-white font-mono mt-4 text-emerald-400">
                      {line.replace('### ', '')}
                    </h3>
                  );
                } else if (line.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-lg sm:text-xl font-bold text-white font-mono mt-5 pb-1 border-b border-zinc-800">
                      {line.replace('## ', '')}
                    </h2>
                  );
                } else if (line.startsWith('# ')) {
                  return (
                    <h1 key={idx} className="text-xl sm:text-2xl font-bold text-white font-mono mt-2 text-cyan-400">
                      {line.replace('# ', '')}
                    </h1>
                  );
                } else if (line.startsWith('- ')) {
                  return (
                    <li key={idx} className="ml-4 list-disc text-zinc-300 font-mono text-xs sm:text-sm leading-relaxed">
                      {line.replace('- ', '')}
                    </li>
                  );
                } else if (line.trim() === '') {
                  return <div key={idx} className="h-2" />;
                }
                return (
                  <p key={idx} className="text-zinc-300 font-mono text-xs sm:text-sm">
                    {line}
                  </p>
                );
              })
            ) : (
              <p className="text-zinc-600 font-mono">No notes entered yet. Switch to Edit mode to begin typing.</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Status & Telemetry Bar */}
      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-b-lg sm:rounded-b-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
          <span className="flex items-center gap-1.5">
            <span className="text-zinc-500">Words:</span>
            <span className="text-zinc-100 font-bold tabular-nums">{wordCount.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-zinc-500">Chars:</span>
            <span className="text-zinc-100 font-bold tabular-nums">{charCount.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-zinc-500">Lines:</span>
            <span className="text-zinc-100 font-bold tabular-nums">{lineCount.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1.5 hidden sm:flex">
            <span className="text-zinc-500">Read:</span>
            <span className="text-zinc-100 font-bold tabular-nums">~{readTimeMin}m</span>
          </span>
        </div>

        <div className="text-zinc-500 text-[10px] sm:text-[11px] flex items-center gap-2">
          <span>Row: shared_notes.global_dump</span>
          <span>·</span>
          <span>500ms Debounce</span>
        </div>
      </div>
    </div>
  );
};
