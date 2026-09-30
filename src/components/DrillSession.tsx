import React, { useState, useEffect, useCallback } from 'react';
import { SubjectType, BankQuestion, Passage, PassageQuestion } from '../types';
import { bankQuestions, passages } from '../data/mockData';
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sparkles,
  CheckCircle2,
  XCircle,
  Highlighter,
  RotateCcw,
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface DrillSessionProps {
  selectedSubject: SubjectType;
  initialQuestionId?: string;
  onCorrectAnswer: () => void;
}

export const DrillSession: React.FC<DrillSessionProps> = ({
  selectedSubject,
  initialQuestionId,
  onCorrectAnswer,
}) => {
  // If subject is 'gk', adaptive drill uses single-column centered card (No split pane).
  // If subject is legal, logic, english, quant, uses two-pane split view with reading passage.
  const isGK = selectedSubject === 'gk';

  // --- GK Drill State (Single Column) ---
  const gkQuestions = bankQuestions.filter((q) => q.subject === 'gk');
  const [gkIndex, setGkIndex] = useState(0);

  // --- Passage Drill State (Split Screen) ---
  const subjectPassages = passages.filter((p) => p.subjectType === selectedSubject);
  const activePassagesList = subjectPassages.length > 0 ? subjectPassages : passages;
  const [passageIndex, setPassageIndex] = useState(0);
  const [passageQIndex, setPassageQIndex] = useState(0);

  // Common interactive state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [highlightMode, setHighlightMode] = useState(false);

  // If initialQuestionId was passed from Question Bank
  useEffect(() => {
    if (initialQuestionId) {
      if (isGK) {
        const foundIdx = gkQuestions.findIndex((q) => q.id === initialQuestionId);
        if (foundIdx !== -1) setGkIndex(foundIdx);
      }
    }
  }, [initialQuestionId, isGK]);

  // Current active question
  let currentQuestion: {
    id: string;
    text: string;
    options: string[];
    correctOptionIndex?: number | null;
    explanation: string;
    category?: string;
    source?: string;
  } | undefined;

  let totalQuestionsCount = 0;
  let currentQuestionNumber = 1;

  if (isGK) {
    const q = gkQuestions[gkIndex] || gkQuestions[0];
    currentQuestion = q;
    totalQuestionsCount = gkQuestions.length;
    currentQuestionNumber = gkIndex + 1;
  } else {
    const p = activePassagesList[passageIndex] || activePassagesList[0];
    const q = p?.questions[passageQIndex] || p?.questions[0];
    currentQuestion = q;
    totalQuestionsCount = p?.questions.length || 0;
    currentQuestionNumber = passageQIndex + 1;
  }

  const selectedAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : undefined;
  const isAnswered = selectedAnswer !== undefined;
  const isFlagged = currentQuestion ? flaggedQuestions.has(currentQuestion.id) : false;

  const toggleFlag = (id: string) => {
    sounds.playClick();
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectOption = (idx: number) => {
    if (!currentQuestion || isAnswered) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: idx,
    }));

    const isCorrect = idx === currentQuestion.correctOptionIndex;
    if (isCorrect) {
      sounds.playCorrect();
      onCorrectAnswer();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNext = useCallback(() => {
    sounds.playClick();
    if (isGK) {
      if (gkIndex < gkQuestions.length - 1) {
        setGkIndex((prev) => prev + 1);
      }
    } else {
      const p = activePassagesList[passageIndex];
      if (p && passageQIndex < p.questions.length - 1) {
        setPassageQIndex((prev) => prev + 1);
      }
    }
  }, [isGK, gkIndex, gkQuestions.length, activePassagesList, passageIndex, passageQIndex]);

  const handlePrev = useCallback(() => {
    sounds.playClick();
    if (isGK) {
      if (gkIndex > 0) {
        setGkIndex((prev) => prev - 1);
      }
    } else {
      if (passageQIndex > 0) {
        setPassageQIndex((prev) => prev - 1);
      }
    }
  }, [isGK, gkIndex, passageQIndex]);

  // Keyboard Shortcuts (1-4 / A-D, Enter to continue)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (!isAnswered) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') handleSelectOption(0);
        else if (e.key === '2' || e.key.toLowerCase() === 'b') handleSelectOption(1);
        else if (e.key === '3' || e.key.toLowerCase() === 'c') handleSelectOption(2);
        else if (e.key === '4' || e.key.toLowerCase() === 'd') handleSelectOption(3);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleNext]);

  if (!currentQuestion) {
    return (
      <div className="max-w-[1000px] mx-auto p-12 text-center text-zinc-400 font-mono text-xs">
        No questions available for this subject.
      </div>
    );
  }

  // --- RENDER RIGHT (OR CENTER) QUESTION CARD ---
  const renderQuestionBox = () => {
    if (!currentQuestion) return null;
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl flex flex-col justify-between">
        {/* Question Header & Nav dots */}
        <div>
          <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-zinc-800/80 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-emerald-400 font-bold">
                Q{currentQuestionNumber} of {totalQuestionsCount}
              </span>
              <span className="text-zinc-500 hidden sm:inline">Keys 1–4 / A–D</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono border active:scale-95 touch-manipulation transition-colors ${
                  isFlagged
                    ? 'bg-amber-950 border-amber-500 text-amber-300 font-bold'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
              </button>
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg font-sans font-semibold text-white leading-relaxed mb-5">
            {currentQuestion.text}
          </h2>

          {/* Option Buttons (Immediate visual feedback on click/press) */}
          <div className="space-y-3 mb-5">
            {currentQuestion.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isPicked = selectedAnswer === idx;
              const isCorrectAnswer = idx === currentQuestion.correctOptionIndex;

              let cardStyle =
                'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 text-zinc-200 active:border-zinc-600';
              let badgeStyle = 'bg-zinc-800 text-zinc-300 border-zinc-700';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  // Highlight correct answer in emerald green border/fill
                  cardStyle =
                    'bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.25)]';
                  badgeStyle = 'bg-emerald-500 text-black border-emerald-400 font-bold';
                } else if (isPicked && !isCorrectAnswer) {
                  // If user picked wrong, highlight choice in rose red border/fill
                  cardStyle = 'bg-rose-950/40 border-rose-500 text-rose-100';
                  badgeStyle = 'bg-rose-500 text-white border-rose-400 font-bold';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-lg border transition-all cursor-pointer min-h-[50px] active:scale-95 touch-manipulation select-none ${cardStyle}`}
                >
                  <span
                    className={`w-7 h-7 rounded flex items-center justify-center font-mono text-xs shrink-0 border mt-0.5 ${badgeStyle}`}
                  >
                    {letter}
                  </span>
                  <span className="text-xs sm:text-sm font-sans font-normal leading-relaxed text-left flex-1">
                    {opt}
                  </span>

                  {isAnswered && (
                    <div className="shrink-0 mt-0.5">
                      {isCorrectAnswer ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isPicked ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* EXPLANATION & CONTEXT BOX: Immediately rendered directly below options */}
          {isAnswered && (
            <div className="mb-5 p-4 rounded-lg bg-zinc-900 border border-zinc-800 animate-fade-in text-xs sm:text-sm">
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXPLANATION & CONTEXT</span>
              </div>
              <p className="text-zinc-200 font-sans leading-relaxed">{currentQuestion.explanation}</p>
              {currentQuestion.source && (
                <div className="mt-2.5 pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
                  Source: <span className="text-zinc-400">{currentQuestion.source}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Pagination & Next Controls */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-800/80 font-mono text-xs">
          <button
            onClick={handlePrev}
            disabled={currentQuestionNumber <= 1}
            className={`flex items-center gap-1 px-3 py-2 rounded border active:scale-95 touch-manipulation min-h-[38px] ${
              currentQuestionNumber <= 1
                ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <span className="text-zinc-500 text-[11px] hidden sm:inline">
            Press <kbd className="px-1 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-zinc-300">Enter</kbd> to continue
          </span>

          <button
            onClick={handleNext}
            disabled={currentQuestionNumber >= totalQuestionsCount}
            className={`flex items-center gap-1 px-4 py-2 rounded border font-semibold active:scale-95 touch-manipulation min-h-[38px] ${
              currentQuestionNumber >= totalQuestionsCount
                ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-zinc-100 hover:bg-white text-black font-bold'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // ========================================================
  // 1. GK DRILL: Single-Column Centered Card (No split pane)
  // ========================================================
  if (isGK) {
    return (
      <div className="max-w-[760px] mx-auto px-3 sm:px-6 py-6 font-sans">
        {renderQuestionBox()}
      </div>
    );
  }

  // ========================================================
  // 2. LEGAL, LOGIC, ENGLISH, QUANT: Two-Pane Split View
  // ========================================================
  const activePassage = activePassagesList[passageIndex] || activePassagesList[0];

  return (
    <div className="max-w-[1536px] mx-auto px-3 sm:px-6 py-5 font-sans">
      {/* Passage Selector Top Bar */}
      <div className="flex items-center justify-between gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg sm:rounded-xl mb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline mr-1">
            Passages:
          </span>
          {activePassagesList.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                sounds.playClick();
                setPassageIndex(idx);
                setPassageQIndex(0);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono active:scale-95 touch-manipulation transition-all whitespace-nowrap min-h-[36px] ${
                passageIndex === idx
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/60 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800'
              }`}
            >
              <span>{`#0${idx + 1}`}</span>
              <span className="font-sans font-medium truncate max-w-[160px]">{p.title}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setHighlightMode(!highlightMode)}
          className={`p-1.5 rounded-md border text-xs active:scale-95 touch-manipulation ${
            highlightMode
              ? 'bg-amber-950 border-amber-500 text-amber-300'
              : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200'
          }`}
          title="Toggle highlight mode"
        >
          <Highlighter className="w-4 h-4" />
        </button>
      </div>

      {/* Two-Pane Split Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 items-stretch min-h-[calc(100vh-230px)]">
        {/* Left Pane: Scrollable Passage */}
        <div className="lg:col-span-6 bg-zinc-950 border border-zinc-800 rounded-lg sm:rounded-xl flex flex-col overflow-hidden shadow-xl">
          <div className="p-3.5 sm:p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold mr-2">
                {activePassage.subject}
              </span>
              <span className="text-xs font-mono text-zinc-400">{activePassage.wordCount} words</span>
            </div>
            <span className="text-xs font-mono text-zinc-500">~{activePassage.readTimeMinutes} min read</span>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[50vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-280px)]">
            <h1 className="text-base sm:text-lg font-bold text-white mb-2">{activePassage.title}</h1>
            <div className="text-xs font-mono text-zinc-500 italic pb-3 mb-4 border-b border-zinc-800/80">
              Source: {activePassage.source}
            </div>

            <div
              className={`text-zinc-200 space-y-4 font-sans text-sm sm:text-base leading-relaxed ${
                highlightMode ? 'selection:bg-amber-400/40 selection:text-amber-200' : ''
              }`}
            >
              {activePassage.text.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane: Multiple-choice question and options */}
        <div className="lg:col-span-6 flex flex-col">{renderQuestionBox()}</div>
      </div>
    </div>
  );
};
