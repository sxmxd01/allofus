import React, { useState, useEffect, useCallback } from 'react';
import { SprintQuestion, LeaderboardUser } from '../types';
import {
  Search,
  Copy,
  Check,
  Star,
  Clock,
  ChevronRight,
  Send,
  Sparkles,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Cloud,
  RefreshCw,
} from 'lucide-react';
import { sounds } from '../utils/sound';
import {
  fetchSprintQuestions,
  recordUserAttempt,
  fetchLiveLeaderboard,
} from '../lib/clatService';
import { supabaseOneliners } from '../lib/supabase';

interface SprintModeProps {
  activeUsername: string;
  onCorrectAnswer: () => void;
  markedQuestionIds: Set<string>;
  onToggleMarkForReview: (id: string) => void;
}

export const SprintMode: React.FC<SprintModeProps> = ({
  activeUsername,
  onCorrectAnswer,
  markedQuestionIds,
  onToggleMarkForReview,
}) => {
  const [questions, setQuestions] = useState<SprintQuestion[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1);
  const [copiedToast, setCopiedToast] = useState(false);
  const [questionNotes, setQuestionNotes] = useState<Record<string, string>>({});
  const [filterMarkedOnly, setFilterMarkedOnly] = useState(false);
  const [mobileLeaderboardOpen, setMobileLeaderboardOpen] = useState(false);

  // 1. Fetch unverified/active GK questions & live leaderboard
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      const [qs, lb] = await Promise.all([
        fetchSprintQuestions(),
        fetchLiveLeaderboard(activeUsername),
      ]);
      if (isMounted) {
        setQuestions(qs);
        setLeaderboard(lb);
        setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeUsername]);

  // 2. Real-time Subscription to user_attempts table to update live leaderboard instantly
  useEffect(() => {
    const channel = supabaseOneliners
      .channel('realtime:user_attempts:sprint')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'questions' },
        async () => {
          const freshLb = await fetchLiveLeaderboard(activeUsername);
          setLeaderboard(freshLb);
        }
      )
      .subscribe();

    return () => {
      supabaseOneliners.removeChannel(channel);
    };
  }, [activeUsername]);

  // Filter questions if "Marked for review" filter is on
  const activeQuestions = filterMarkedOnly
    ? questions.filter((q) => markedQuestionIds.has(q.id))
    : questions;

  const currentQ: SprintQuestion | undefined =
    activeQuestions.length > 0 ? activeQuestions[currentIndex % activeQuestions.length] : undefined;

  // Question Timer
  useEffect(() => {
    setTimerSeconds(1);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, filterMarkedOnly]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = useCallback(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (activeQuestions.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % activeQuestions.length);
    }
  }, [activeQuestions.length]);

  const handleSubmit = useCallback(async () => {
    if (selectedOption === null || !currentQ) return;
    if (isSubmitted) {
      sounds.playClick();
      handleNextQuestion();
      return;
    }

    setIsSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctOptionIndex;
    if (isCorrect) {
      sounds.playCorrect();
      onCorrectAnswer();
    } else {
      sounds.playIncorrect();
    }

    // Save attempt to user_attempts table under activeUsername
    const optionLetter = ['A', 'B', 'C', 'D'][selectedOption] || String(selectedOption + 1);
    await recordUserAttempt(activeUsername, currentQ.id, optionLetter, isCorrect);

    // Refresh live leaderboard
    const updatedLeaderboard = await fetchLiveLeaderboard(activeUsername);
    setLeaderboard(updatedLeaderboard);
  }, [selectedOption, currentQ, isSubmitted, handleNextQuestion, onCorrectAnswer, activeUsername]);

  const handleSearchGoogle = useCallback(() => {
    if (!currentQ) return;
    sounds.playClick();
    const query = encodeURIComponent(`CLAT GK: ${currentQ.text}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener,noreferrer');
  }, [currentQ]);

  const handleCopyForAI = useCallback(() => {
    if (!currentQ) return;
    sounds.playClick();
    const promptText = `CLAT Exam Question:
Question: ${currentQ.text}
Options:
1. ${currentQ.options[0]}
2. ${currentQ.options[1]}
3. ${currentQ.options[2]}
4. ${currentQ.options[3]}

Please provide the correct answer, legal explanation, relevant constitutional articles or statutes, and 3 key high-yield revision points for CLAT 2026.`;

    navigator.clipboard.writeText(promptText).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  }, [currentQ]);

  // Keyboard Shortcuts (1-4 for options, Enter for submit, S for search, C for copy, M for mark)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        if (e.key === 'Enter' && e.ctrlKey) {
          handleSubmit();
        }
        return;
      }

      if (e.key === '1') {
        setSelectedOption(0);
        sounds.playClick();
      } else if (e.key === '2') {
        setSelectedOption(1);
        sounds.playClick();
      } else if (e.key === '3') {
        setSelectedOption(2);
        sounds.playClick();
      } else if (e.key === '4') {
        setSelectedOption(3);
        sounds.playClick();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSearchGoogle();
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopyForAI();
      } else if (e.key.toLowerCase() === 'm' && currentQ) {
        e.preventDefault();
        sounds.playClick();
        onToggleMarkForReview(currentQ.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, handleSearchGoogle, handleCopyForAI, currentQ, onToggleMarkForReview]);

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-2 text-zinc-400 font-mono text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Fetching GK questions and live leaderboard from Supabase...</span>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-xl max-w-lg mx-auto">
          <BookmarkCheck className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-zinc-100">No Marked Questions</h3>
          <p className="text-zinc-400 text-sm mt-2">
            You currently have no questions marked for review. Toggle back to all questions to continue the sprint.
          </p>
          <button
            onClick={() => setFilterMarkedOnly(false)}
            className="mt-6 w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-md transition-colors active:scale-95 touch-manipulation"
          >
            Show All Questions
          </button>
        </div>
      </div>
    );
  }

  const isMarked = markedQuestionIds.has(currentQ.id);

  // Leaderboard Content helper
  const renderLeaderboardList = () => (
    <div className="space-y-2">
      {leaderboard.map((user, idx) => (
        <div
          key={user.id}
          className={`flex items-center justify-between p-2.5 rounded-md border text-xs font-mono transition-all ${
            user.isCurrentUser
              ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.2)] text-white'
              : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-zinc-500 font-bold text-[11px]">#{idx + 1}</span>
            <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
              <span className="text-[10px] text-zinc-300">👤</span>
            </div>
            <div className="truncate">
              <span className={user.isCurrentUser ? 'text-zinc-100 font-bold' : 'text-zinc-300'}>
                {user.name}
              </span>
              {user.isCurrentUser && <span className="text-cyan-400 text-[10px] ml-1.5">(You)</span>}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span
              className={`font-bold tabular-nums ${
                user.isCurrentUser ? 'text-cyan-400' : 'text-zinc-200'
              }`}
            >
              {user.solvedCount}
            </span>{' '}
            <span className="text-zinc-500 text-[11px]">solved</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-emerald-500 text-emerald-400 text-xs rounded-lg shadow-xl font-mono">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Copied prompt to clipboard for AI!</span>
        </div>
      )}

      {/* MOBILE COMPACT LEADERBOARD ACCORDION */}
      <div className="lg:hidden mb-4">
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
          <button
            onClick={() => {
              sounds.playClick();
              setMobileLeaderboardOpen(!mobileLeaderboardOpen);
            }}
            className="w-full flex items-center justify-between p-3 text-xs font-mono text-zinc-300 hover:bg-zinc-900/60 active:scale-[0.99] touch-manipulation transition-all"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold uppercase tracking-wider text-zinc-200">Live Leaderboard</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
                {leaderboard.length} Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-cyan-400 font-semibold">
                {activeUsername} (
                {leaderboard.find((u) => u.name === activeUsername)?.solvedCount ?? 0} solved)
              </span>
              {mobileLeaderboardOpen ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </button>

          {mobileLeaderboardOpen && (
            <div className="p-3 pt-0 border-t border-zinc-800/80 bg-zinc-950">
              {renderLeaderboardList()}
            </div>
          )}
        </div>
      </div>

      {/* MAIN LAYOUT: Desktop 12-col grid, mobile flex-col stack */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* DESKTOP LEFT SIDEBAR: Leaderboard & Review Drawer */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4 w-full">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-300 uppercase">
                  Leaderboard
                </h3>
              </div>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
                {leaderboard.length} Active
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 mb-3">Live attempts from Supabase</p>

            {renderLeaderboardList()}
          </div>

          {/* Marked for Review Button / Filter Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              setFilterMarkedOnly(!filterMarkedOnly);
              setCurrentIndex(0);
            }}
            className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs font-mono font-medium active:scale-95 touch-manipulation transition-all ${
              filterMarkedOnly
                ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Star
                className={`w-4 h-4 ${
                  markedQuestionIds.size > 0 ? 'text-amber-400 fill-amber-400' : 'text-zinc-500'
                }`}
              />
              <span className="uppercase tracking-wider font-bold">Marked for Review</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-bold tabular-nums">
              {markedQuestionIds.size}
            </span>
          </button>
        </aside>

        {/* ACTIVE QUESTION PANEL */}
        <main className="w-full lg:col-span-9 bg-zinc-950 border border-zinc-800 rounded-lg p-4 sm:p-6 shadow-2xl relative">
          {/* Top Meta Bar */}
          <div className="flex items-center justify-between gap-2 pb-3 mb-4 sm:mb-5 border-b border-zinc-800/80 font-mono text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2 sm:px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 font-semibold uppercase tracking-wider text-[10px] sm:text-[11px]">
                Active GK Question
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  onToggleMarkForReview(currentQ.id);
                }}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded border active:scale-95 touch-manipulation transition-colors ${
                  isMarked
                    ? 'bg-amber-950/40 border-amber-500/80 text-amber-300 font-medium'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span className="text-[11px]">{isMarked ? 'Marked' : 'Mark'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 text-zinc-400">
              <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span className="tabular-nums font-semibold text-zinc-200 text-[11px] sm:text-xs">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  handleNextQuestion();
                }}
                className="flex items-center gap-0.5 hover:text-zinc-200 active:scale-95 touch-manipulation transition-colors p-1"
                title="Skip to next question"
              >
                <span className="text-[11px] sm:text-xs">Skip</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-emerald-400 uppercase tracking-wider mb-1.5 font-semibold">
              <span>CLAT GK · {currentQ.category}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-cyan-400 flex items-center gap-1">
                <Cloud className="w-3 h-3" />
                <span>Supabase Live</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-sans font-semibold text-white leading-snug tracking-tight">
              {currentQ.text}
            </h2>
          </div>

          {/* Action Buttons (Search Google & Copy for AI) */}
          <div className="flex flex-wrap items-center gap-2 mb-5 font-mono text-xs">
            <button
              onClick={handleSearchGoogle}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white active:scale-95 touch-manipulation transition-all min-h-[40px]"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Search Google</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700">
                S
              </kbd>
            </button>

            <button
              onClick={handleCopyForAI}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white active:scale-95 touch-manipulation transition-all min-h-[40px]"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Copy for AI</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700">
                C
              </kbd>
            </button>
          </div>

          {/* Prompt Header */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2.5">
            <span>Select the correct answer:</span>
            <span className="text-zinc-500 text-[11px]">Keys 1–4 or Tap</span>
          </div>

          {/* LARGE, DISTINCT, THUMB-FRIENDLY OPTION BUTTONS */}
          <div className="space-y-3 mb-5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctOptionIndex;

              let cardStyles =
                'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 text-zinc-200 active:border-zinc-600';
              let badgeStyles = 'bg-zinc-800 text-zinc-300 border-zinc-700';

              if (isSubmitted) {
                if (isCorrectAnswer) {
                  cardStyles = 'bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                  badgeStyles = 'bg-emerald-500 text-black border-emerald-400 font-bold';
                } else if (isSelected && !isCorrectAnswer) {
                  cardStyles = 'bg-rose-950/40 border-rose-500 text-rose-100';
                  badgeStyles = 'bg-rose-500 text-white border-rose-400 font-bold';
                }
              } else if (isSelected) {
                cardStyles =
                  'bg-zinc-800/90 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50';
                badgeStyles = 'bg-cyan-400 text-black border-cyan-300 font-bold';
              }

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (!isSubmitted) {
                      sounds.playClick();
                      setSelectedOption(idx);
                    }
                  }}
                  className={`w-full flex items-center justify-between min-h-[56px] sm:min-h-[50px] p-3.5 sm:p-4 rounded-lg border transition-all cursor-pointer active:scale-95 touch-manipulation select-none ${cardStyles}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span
                      className={`w-8 h-8 sm:w-7 sm:h-7 rounded-md flex items-center justify-center font-mono text-xs border shrink-0 transition-colors ${badgeStyles}`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base font-sans font-medium text-left leading-snug">
                      {option}
                    </span>
                  </div>

                  {/* Submission outcome icons */}
                  {isSubmitted && (
                    <div className="shrink-0 ml-3">
                      {isCorrectAnswer ? (
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

          {/* Explanation Box */}
          {isSubmitted && (
            <div className="mb-5 p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-sm animate-fade-in">
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Verified Legal Explanation</span>
              </div>
              <p className="text-zinc-200 leading-relaxed font-sans text-xs sm:text-sm">
                {currentQ.explanation}
              </p>
              <div className="mt-3 pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-500">
                Source: <span className="text-zinc-400">{currentQ.source}</span>
              </div>
            </div>
          )}

          {/* Extra Notes Input */}
          <div className="mb-5">
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Extra notes (optional)
            </label>
            <input
              type="text"
              value={questionNotes[currentQ.id] || ''}
              onChange={(e) =>
                setQuestionNotes({
                  ...questionNotes,
                  [currentQ.id]: e.target.value,
                })
              }
              placeholder="Add personal notes or memory aids..."
              className="w-full px-3 py-2 sm:py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-zinc-600 focus:outline-none text-zinc-200 text-xs font-mono placeholder:text-zinc-600"
            />
          </div>

          {/* Bottom Submission Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-zinc-800/80 font-mono text-xs">
            <div className="text-zinc-500 text-[11px] sm:text-xs text-center sm:text-left">
              Submits under{' '}
              <span className="text-cyan-400 font-semibold">{activeUsername}</span> to{' '}
              <code className="text-zinc-400 font-mono">user_attempts</code>
            </div>

            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`w-full sm:w-auto min-h-[48px] sm:min-h-[40px] flex items-center justify-center gap-2 px-6 py-2.5 rounded-md font-sans text-xs sm:text-sm font-bold active:scale-95 touch-manipulation transition-all ${
                selectedOption === null
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
                  : isSubmitted
                  ? 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-md font-bold'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] font-bold'
              }`}
            >
              {isSubmitted ? (
                <>
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Quick Marked-For-Review Toggle Banner */}
          <div className="lg:hidden mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
            <button
              onClick={() => {
                sounds.playClick();
                setFilterMarkedOnly(!filterMarkedOnly);
                setCurrentIndex(0);
              }}
              className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 active:scale-95 touch-manipulation py-1"
            >
              <Star
                className={`w-4 h-4 ${
                  markedQuestionIds.size > 0 ? 'text-amber-400 fill-amber-400' : 'text-zinc-500'
                }`}
              />
              <span className="font-semibold">
                {filterMarkedOnly ? 'Show All Questions' : 'View Marked for Review'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px]">
                {markedQuestionIds.size}
              </span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
