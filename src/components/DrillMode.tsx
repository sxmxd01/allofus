import React, { useState, useEffect, useCallback } from 'react';
import { Passage, PassageQuestion, SubjectType } from '../types';
import { subjectsList } from '../data/mockData';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sparkles,
  Highlighter,
  Cloud,
  RefreshCw,
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { fetchDrillPassages } from '../lib/clatService';

interface DrillModeProps {
  selectedSubject: SubjectType;
  onCorrectAnswer: () => void;
}

export const DrillMode: React.FC<DrillModeProps> = ({
  selectedSubject,
  onCorrectAnswer,
}) => {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [highlightMode, setHighlightMode] = useState(false);

  // User state per passage: answers & submissions
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  // Fetch verified questions and associated passages from Supabase
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      const data = await fetchDrillPassages(selectedSubject);
      if (isMounted) {
        setPassages(data);
        setSelectedPassageIndex(0);
        setActiveQuestionIndex(0);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [selectedSubject]);

  const currentPassage = passages[selectedPassageIndex] || passages[0];
  const currentQuestions = currentPassage ? currentPassage.questions : [];
  const currentQ: PassageQuestion | undefined = currentQuestions[activeQuestionIndex] || currentQuestions[0];

  const selectedAnswer = currentQ ? (userAnswers[currentQ.id] ?? null) : null;
  const isSubmitted = currentQ ? (submittedQuestions[currentQ.id] || false) : false;
  const isFlagged = currentQ ? flaggedQuestions.has(currentQ.id) : false;

  const toggleFlag = (qId: string) => {
    sounds.playClick();
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (isSubmitted || !currentQ) return;
    sounds.playClick();
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionIdx }));
  };

  const handleSubmitQuestion = useCallback(() => {
    if (selectedAnswer === null || isSubmitted || !currentQ) return;
    setSubmittedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));

    const isCorrect = selectedAnswer === currentQ.correctOptionIndex;
    if (isCorrect) {
      sounds.playCorrect();
      onCorrectAnswer();
    } else {
      sounds.playIncorrect();
    }
  }, [selectedAnswer, isSubmitted, currentQ, onCorrectAnswer]);

  // Keyboard navigation (A/B/C/D or 1-4, Enter to submit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === '1' || e.key.toLowerCase() === 'a') {
        handleSelectAnswer(0);
      } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
        handleSelectAnswer(1);
      } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
        handleSelectAnswer(2);
      } else if (e.key === '4' || e.key.toLowerCase() === 'd') {
        handleSelectAnswer(3);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (!isSubmitted) {
          handleSubmitQuestion();
        } else if (activeQuestionIndex < currentQuestions.length - 1) {
          setActiveQuestionIndex((prev) => prev + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectAnswer, handleSubmitQuestion, isSubmitted, activeQuestionIndex, currentQuestions.length]);

  // Passage font size classes
  const fontClass =
    fontSize === 'normal'
      ? 'text-sm sm:text-base leading-relaxed'
      : 'text-base sm:text-lg leading-loose';

  // Calculate passage score
  let correctCount = 0;
  let attemptedCount = 0;
  currentQuestions.forEach((q) => {
    if (submittedQuestions[q.id]) {
      attemptedCount++;
      if (userAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    }
  });

  const clatScore = (correctCount * 1 - (attemptedCount - correctCount) * 0.25).toFixed(2);
  const currentSubjectObj = subjectsList.find((s) => s.id === selectedSubject);

  if (isLoading) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-2 text-zinc-400 font-mono text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Fetching verified passages & questions from Supabase...</span>
        </div>
      </div>
    );
  }

  if (!currentPassage || !currentQ) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 py-16 text-center">
        <p className="text-zinc-400 font-mono text-sm">No passages found for {selectedSubject}.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1536px] mx-auto px-3 sm:px-6 py-4 sm:py-5">
      {/* Top Passage Selector & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg sm:rounded-xl mb-4">
        {/* Left: Passage Tabs for current subject */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider hidden sm:inline mr-1">
            {currentSubjectObj?.shortLabel} Passages:
          </span>
          {passages.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                sounds.playClick();
                setSelectedPassageIndex(idx);
                setActiveQuestionIndex(0);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono active:scale-95 touch-manipulation transition-all whitespace-nowrap min-h-[38px] ${
                selectedPassageIndex === idx
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/50 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800'
              }`}
            >
              <span>{`#0${idx + 1}`}</span>
              <span className="font-sans font-medium truncate max-w-[140px] sm:max-w-[220px]">
                {p.title}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Passage Summary Score */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-cyan-400 text-[10px] hidden md:flex items-center gap-1">
            <Cloud className="w-3 h-3" />
            <span>Supabase Verified</span>
          </span>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>Passage:</span>
            <span className="text-emerald-400 font-bold tabular-nums">
              {correctCount}/{currentQuestions.length}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-cyan-400 font-bold tabular-nums">
              {clatScore} pts
            </span>
          </div>
        </div>
      </div>

      {/* SPECIAL PASSAGE VIEW: SPLIT SCREEN LAYOUT ON DESKTOP, CLEAN STACK ON MOBILE */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 items-stretch min-h-[calc(100vh-230px)]">
        {/* ======================================================== */}
        {/* LEFT HALF: Long Reading Passage from passages table */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 bg-zinc-950 border border-zinc-800 rounded-lg sm:rounded-xl flex flex-col overflow-hidden shadow-xl">
          {/* Passage Header & Controls */}
          <div className="p-3.5 sm:p-4 border-b border-zinc-800 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono mb-1">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                  {currentPassage.subject}
                </span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-400">{currentPassage.wordCount} words</span>
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-400">~{currentPassage.readTimeMinutes} min</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {currentPassage.title}
              </h1>
            </div>

            {/* Reading Tools (Font Size + Highlight) */}
            <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
              <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-md p-0.5">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-1 rounded text-xs active:scale-95 touch-manipulation ${
                    fontSize === 'normal' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400'
                  }`}
                  title="Standard text size"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-1 rounded text-sm active:scale-95 touch-manipulation ${
                    fontSize === 'large' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400'
                  }`}
                  title="Large text size"
                >
                  A+
                </button>
              </div>

              <button
                onClick={() => setHighlightMode(!highlightMode)}
                className={`p-1.5 rounded-md border text-xs active:scale-95 touch-manipulation transition-colors ${
                  highlightMode
                    ? 'bg-amber-950 border-amber-500 text-amber-300'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
                title={highlightMode ? 'Highlighting enabled' : 'Toggle highlight mode'}
              >
                <Highlighter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Passage Scrollable Container (Independent Scroll) */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[50vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-270px)] focus:outline-none">
            <div className="mb-3 sm:mb-4 text-xs font-mono text-zinc-500 italic pb-2 sm:pb-3 border-b border-zinc-800/80">
              Source: {currentPassage.source}
            </div>

            {/* Passage Body Text */}
            <div
              className={`text-zinc-200 space-y-4 font-sans font-normal tracking-wide leading-relaxed select-text ${fontClass} ${
                highlightMode ? 'selection:bg-amber-400/40 selection:text-amber-200' : ''
              }`}
            >
              {currentPassage.text.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="first-letter:text-xl first-letter:font-semibold">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Verified question on right applies to this text</span>
              <span className="text-emerald-500/80">● End of Passage</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT HALF: Multiple-Choice Questions from questions table */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 bg-zinc-950 border border-zinc-800 rounded-lg sm:rounded-xl flex flex-col justify-between overflow-hidden shadow-xl">
          {/* Question Nav & Header */}
          <div className="p-3.5 sm:p-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
            {/* Question Quick-Jump Dots */}
            <div className="flex items-center justify-between gap-2.5 mb-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {currentQuestions.map((q, qIndex) => {
                  const isCurrent = activeQuestionIndex === qIndex;
                  const isAnswered = submittedQuestions[q.id];
                  const isQCorrect = userAnswers[q.id] === q.correctOptionIndex;
                  const isQFlagged = flaggedQuestions.has(q.id);

                  let btnBg = 'bg-zinc-900 border-zinc-800 text-zinc-400';
                  if (isCurrent) {
                    btnBg = 'bg-zinc-800 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400 font-bold';
                  } else if (isAnswered) {
                    btnBg = isQCorrect
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-400'
                      : 'bg-rose-950/60 border-rose-600 text-rose-400';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        sounds.playClick();
                        setActiveQuestionIndex(qIndex);
                      }}
                      className={`relative w-8 h-8 sm:w-8 sm:h-8 rounded-md border text-xs font-mono font-medium flex items-center justify-center active:scale-95 touch-manipulation transition-all ${btnBg}`}
                    >
                      <span>Q{qIndex + 1}</span>
                      {isQFlagged && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-black" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bookmark / Flag Button */}
              <button
                onClick={() => toggleFlag(currentQ.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono border active:scale-95 touch-manipulation transition-colors ${
                  isFlagged
                    ? 'bg-amber-950 border-amber-500 text-amber-300 font-semibold'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
              </button>
            </div>

            {/* Question Title Bar */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">
                  Question {activeQuestionIndex + 1} of {currentQuestions.length}
                </span>
                {currentQ.isVerified && (
                  <span className="flex items-center gap-1 text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified (Passage linked)</span>
                  </span>
                )}
              </div>
              <span className="text-zinc-500 hidden sm:inline">Shortcut: A–D or 1–4</span>
            </div>
          </div>

          {/* Question Body & Options Scrollable Area */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[55vh] lg:max-h-[calc(100vh-340px)]">
            {/* The Question Text */}
            <div className="mb-4 sm:mb-6">
              <p className="text-sm sm:text-base font-sans font-medium text-white leading-relaxed">
                {currentQ.text}
              </p>
            </div>

            {/* A/B/C/D Option Cards with Large Tap Hitbox */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const optionLetter = ['A', 'B', 'C', 'D'][idx];
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQ.correctOptionIndex;

                let cardStyle =
                  'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300 active:border-zinc-600';
                let letterStyle = 'bg-zinc-800 border-zinc-700 text-zinc-400';

                if (isSubmitted) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-950/30 border-emerald-500 text-emerald-200';
                    letterStyle = 'bg-emerald-600 text-black border-emerald-400 font-bold';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'bg-rose-950/30 border-rose-500 text-rose-200';
                    letterStyle = 'bg-rose-600 text-white border-rose-400 font-bold';
                  }
                } else if (isSelected) {
                  cardStyle =
                    'bg-zinc-800/90 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/50';
                  letterStyle = 'bg-cyan-500 text-black border-cyan-400 font-bold';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-lg border transition-all cursor-pointer min-h-[52px] active:scale-95 touch-manipulation select-none ${cardStyle}`}
                  >
                    <span
                      className={`w-7 h-7 sm:w-7 sm:h-7 rounded flex items-center justify-center font-mono text-xs shrink-0 border mt-0.5 ${letterStyle}`}
                    >
                      {optionLetter}
                    </span>
                    <span className="text-xs sm:text-sm font-sans font-normal leading-relaxed text-left flex-1">
                      {option}
                    </span>

                    {/* Result Icon */}
                    {isSubmitted && (
                      <div className="shrink-0 mt-0.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-rose-400" />
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation Drawer (Post-Submission) */}
            {isSubmitted && (
              <div className="mt-5 p-3.5 sm:p-4 rounded-lg bg-zinc-900/90 border border-zinc-800 animate-fade-in">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Passage Application & Ratio Decidendi</span>
                </div>
                <p className="text-zinc-200 text-xs sm:text-sm font-sans leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Question Controls Bar */}
          <div className="p-3.5 sm:p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between gap-2 shrink-0 font-mono text-xs">
            <button
              onClick={() => {
                if (activeQuestionIndex > 0) {
                  sounds.playClick();
                  setActiveQuestionIndex((prev) => prev - 1);
                }
              }}
              disabled={activeQuestionIndex === 0}
              className={`flex items-center gap-1 px-3 py-2 rounded border active:scale-95 touch-manipulation min-h-[40px] ${
                activeQuestionIndex === 0
                  ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Submit / Lock / Continue Button */}
            {!isSubmitted ? (
              <button
                onClick={handleSubmitQuestion}
                disabled={selectedAnswer === null}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-md font-sans font-bold text-xs active:scale-95 touch-manipulation transition-all min-h-[40px] ${
                  selectedAnswer === null
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  if (activeQuestionIndex < currentQuestions.length - 1) {
                    setActiveQuestionIndex((prev) => prev - 1);
                  }
                }}
                disabled={activeQuestionIndex === currentQuestions.length - 1}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-md font-sans font-bold text-xs active:scale-95 touch-manipulation transition-all min-h-[40px] ${
                  activeQuestionIndex === currentQuestions.length - 1
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-zinc-100 hover:bg-white text-black'
                }`}
              >
                Next Question →
              </button>
            )}

            <button
              onClick={() => {
                if (activeQuestionIndex < currentQuestions.length - 1) {
                  sounds.playClick();
                  setActiveQuestionIndex((prev) => prev + 1);
                }
              }}
              disabled={activeQuestionIndex === currentQuestions.length - 1}
              className={`flex items-center gap-1 px-3 py-2 rounded border active:scale-95 touch-manipulation min-h-[40px] ${
                activeQuestionIndex === currentQuestions.length - 1
                  ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
