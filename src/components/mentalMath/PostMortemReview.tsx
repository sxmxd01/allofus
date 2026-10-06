import React, { useEffect } from 'react';
import { MathSet, MathQuestion } from '../../types/mentalMath';
import { MermaidRenderer, extractMermaidCode } from './MermaidRenderer';
import Markdown from 'react-markdown';
import { sounds } from '../../utils/sound';
import { RotateCcw } from 'lucide-react';

interface FailedQuestionItem {
  question: MathQuestion;
  userAnswer: string;
  isTimeout?: boolean;
}

interface PostMortemReviewProps {
  levelNumber: number;
  failedSet: MathSet;
  failedQuestions: FailedQuestionItem[];
  onRetrySet?: () => void;
  onReattemptNextSet?: () => void;
  onExitZen?: () => void;
  totalSetsInLevel?: number;
}

export const PostMortemReview: React.FC<PostMortemReviewProps> = ({
  levelNumber,
  failedSet,
  failedQuestions,
  onRetrySet,
  onReattemptNextSet,
  onExitZen,
}) => {
  const activeItem = failedQuestions[0];

  const handleRetryAction = () => {
    sounds.playClick();
    if (onRetrySet) {
      onRetrySet();
    } else if (onReattemptNextSet) {
      onReattemptNextSet();
    }
  };

  useEffect(() => {
    sounds.playIncorrect();
  }, []);

  // Enter shortcut to "Retry Set", Esc to exit Zen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleRetryAction();
      } else if (e.key === 'Escape' && onExitZen) {
        e.preventDefault();
        sounds.playClick();
        onExitZen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRetrySet, onReattemptNextSet, onExitZen]);

  if (!activeItem) return null;

  // Extract Mermaid syntax and clean flow markdown
  const rawThought = activeItem.question.flow_text || activeItem.question.thoughtProcess || '';
  const mermaidCode = activeItem.question.mermaid_syntax || extractMermaidCode(rawThought);
  const cleanMarkdown = rawThought.replace(/```mermaid[\s\S]*?```/gi, '').trim();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 font-mono text-[#f4f4f5] select-none animate-in fade-in duration-150">
      {/* 1. Minimal Terminal Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs text-neutral-500 uppercase tracking-widest">
        <span>// POST-MORTEM · LEVEL {levelNumber} · SET {failedSet.setNumber}</span>
        <span>STATUS: FAILED</span>
      </div>

      {/* 2. Math Prompt & Answer Comparison */}
      <div className="py-6 space-y-4">
        <div className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
          {activeItem.question.expression}
        </div>

        {/* High-contrast answer readout */}
        <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base pt-1">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 uppercase text-xs">Correct:</span>
            <span className="text-emerald-400 font-bold text-lg sm:text-xl">
              {activeItem.question.answer}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-500 uppercase text-xs">Your input:</span>
            <span className="text-rose-400 font-bold text-lg sm:text-xl line-through decoration-rose-500/70">
              {activeItem.isTimeout ? 'TIMEOUT' : activeItem.userAnswer || 'BLANK'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Cognitive Flowchart & Strategy (Clean Terminal Display) */}
      <div className="border-t border-neutral-800 pt-5 space-y-4">
        <div className="text-xs text-neutral-500 tracking-wider uppercase">
          // COGNITIVE FLOW & STRATEGY
        </div>

        {/* Dynamic Mermaid Flowchart */}
        {mermaidCode ? (
          <div className="bg-[#09090b] border border-neutral-800/80 rounded-lg p-3 sm:p-5 overflow-x-auto">
            <MermaidRenderer chart={mermaidCode} />
          </div>
        ) : null}

        {/* Monospace Strategy Text */}
        {cleanMarkdown ? (
          <div className="prose prose-invert prose-xs max-w-none text-neutral-300 font-mono text-xs sm:text-sm leading-relaxed space-y-2.5 [&_strong]:text-emerald-400 [&_code]:text-emerald-300 [&_code]:bg-neutral-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_ul]:list-disc [&_ul]:pl-4">
            <Markdown>{cleanMarkdown}</Markdown>
          </div>
        ) : null}
      </div>

      {/* 4. Minimalist Action HUD */}
      <div className="mt-8 pt-5 border-t border-neutral-800 flex items-center justify-between text-xs">
        <div className="text-neutral-500 hidden sm:block font-mono">
          Take a second with the shortcut, then run it back.
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {onExitZen && (
            <button
              onClick={onExitZen}
              className="px-3 py-2 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-neutral-800 rounded text-xs font-mono"
            >
              Exit (Esc)
            </button>
          )}

          <button
            onClick={handleRetryAction}
            className="px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black transition-colors cursor-pointer flex items-center gap-2 font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Retry Set (Enter)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostMortemReview;
