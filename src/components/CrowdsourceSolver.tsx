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
  X,
} from 'lucide-react';
import { sounds } from '../utils/sound';
import {
  fetchSprintQuestions,
  recordUserAttempt,
  fetchLiveLeaderboard,
} from '../lib/clatService';
import { supabase } from '../lib/supabase';

interface CrowdsourceSolverProps {
  activeUsername: string;
  onCorrectAnswer: () => void;
  markedQuestionIds: Set<string>;
  onToggleMarkForReview: (id: string) => void;
}

export const CrowdsourceSolver: React.FC<CrowdsourceSolverProps> = ({
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Load GK questions and leaderboard
  useEffect(() => {
    let isMounted = true;
    async function load() {
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
    load();
    return () => {
      isMounted = false;
    };
  }, [activeUsername]);

  // Real-time leaderboard updates
  useEffect(() => {
    const channel = supabase
      .channel('realtime:user_attempts:crowdsource')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_attempts' },
        async () => {
          const fresh = await fetchLiveLeaderboard(activeUsername);
          setLeaderboard(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeUsername]);

  // Filter questions if marked only
  const activeQuestions = filterMarkedOnly
    ? questions.filter((q) => markedQuestionIds.has(q.id))
    : questions;

  const currentQ: SprintQuestion | undefined =
    activeQuestions.length > 0 ? activeQuestions[currentIndex % activeQuestions.length] : undefined;

  // Timer
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

  const handleNext = useCallback(() => {
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
      handleNext();
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

    const opt = ['A', 'B', 'C', 'D'][selectedOption] || String(selectedOption + 1);
    await recordUserAttempt(activeUsername, currentQ.id, opt, isCorrect);

    const freshLb = await fetchLiveLeaderboard(activeUsername);
    setLeaderboard(freshLb);
  }, [selectedOption, currentQ, isSubmitted, handleNext, onCorrectAnswer, activeUsername]);

  const handleSearchGoogle = useCallback(() => {
    if (!currentQ) return;
    sounds.playClick();
    const query = encodeURIComponent(`CLAT GK: ${currentQ.text}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener,noreferrer');
  }, [currentQ]);

  const handleCopyForAI = useCallback(() => {
    if (!currentQ) return;
    sounds.playClick();
    const promptText = `CLAT Exam GK Question:
Question: ${currentQ.text}
Options:
1. ${currentQ.options[0]}
2. ${currentQ.options[1]}
3. ${currentQ.options[2]}
4. ${currentQ.options[3]}

Please provide the verified answer, context, relevant dates or authorities, and high-yield revision points.`;

    navigator.clipboard.writeText(promptText).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  }, [currentQ]);

  // Keyboard Shortcuts (1-4 / A-D, Enter, S for search, C for copy)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
        return;
      }

      if (e.key === '1' || e.key.toLowerCase() === 'a') {
        setSelectedOption(0);
        sounds.playClick();
      } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
        setSelectedOption(1);
        sounds.playClick();
      } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
        setSelectedOption(2);
        sounds.playClick();
      } else if (e.key === '4' || e.key.toLowerCase() === 'd') {
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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, handleSearchGoogle, handleCopyForAI]);

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto p-12 text-center text-zinc-500 font-mono text-xs flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
        <span>Loading Crowdsource Solver & Leaderboard...</span>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="max-w-[1000px] mx-auto p-12 text-center">
        <BookmarkCheck className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
        <h3 className="text-zinc-200 font-mono text-sm font-bold">No Marked Questions</h3>
        <button
          onClick={() => setFilterMarkedOnly(false)}
          className="mt-4 px-4 py-2 bg-emerald-500 text-black font-bold font-mono text-xs rounded-md"
        >
          Show All Questions
        </button>
      </div>
    );
  }

  const isMarked = markedQuestionIds.has(currentQ.id);

  // Leaderboard Markup
  const renderLeaderboard = () => (
    <div className="space-y-2">
      {leaderboard.map((user, idx) => (
        <div
          key={user.id}
          className={`flex items-center justify-between p-2.5 rounded-md border text-xs font-mono transition-all ${
            user.isCurrentUser
              ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.2)] text-white'
              : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400'
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
              {user.isCurrentUser && <span className="text-cyan-400 text-[10px] ml-1">(You)</span>}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className={`font-bold tabular-nums ${user.isCurrentUser ? 'text-cyan-400' : 'text-zinc-200'}`}>
              {user.solvedCount}
            </span>{' '}
            <span className="text-zinc-500 text-[10px]">solved</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-5 font-sans">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-emerald-500 text-emerald-400 text-xs rounded-lg shadow-xl font-mono">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Copied prompt to clipboard for AI!</span>
        </div>
      )}

      {/* MOBILE LEADERBOARD BUTTON TRIGGER */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => {
            sounds.playClick();
            setMobileDrawerOpen(true);
          }}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 active:scale-[0.99] touch-manipulation"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold uppercase tracking-wider">Live Leaderboard</span>
            <span className="px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 text-[10px]">
              {leaderboard.length} Active
            </span>
          </div>
          <span className="text-cyan-400 font-semibold text-[11px]">View Rankings →</span>
        </button>
      </div>

      {/* MOBILE BOTTOM SLIDE-OUT SHEET FOR LEADERBOARD */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end lg:hidden">
          <div className="bg-zinc-950 border-t border-zinc-800 rounded-t-2xl p-4 max-h-[75vh] overflow-y-auto space-y-3 animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-200 uppercase">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Live Leaderboard</span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderLeaderboard()}
          </div>
        </div>
      )}

      {/* MAIN LAYOUT: Left Sidebar (Desktop) + Center Active Question Card */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 items-start">
        {/* Left Sidebar (Desktop only) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4 w-full">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 shadow-md">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-200 uppercase">
                  Leaderboard
                </h3>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400">
                {leaderboard.length} Active
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 mb-3">Live verified attempts</p>
            {renderLeaderboard()}
          </div>

          {/* Marked for Review Counter */}
          <button
            onClick={() => {
              sounds.playClick();
              setFilterMarkedOnly(!filterMarkedOnly);
              setCurrentIndex(0);
            }}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-mono font-medium active:scale-95 touch-manipulation transition-all ${
              filterMarkedOnly
                ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
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

        {/* Center Card: Active Question with Timer, Google Search, Copy for AI */}
        <main className="w-full lg:col-span-9 bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-2xl space-y-5">
          {/* Header row */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 uppercase tracking-wider text-[10px] font-bold">
                Crowdsource Solve
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  onToggleMarkForReview(currentQ.id);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border active:scale-95 touch-manipulation ${
                  isMarked
                    ? 'bg-amber-950/40 border-amber-500 text-amber-300 font-bold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span className="text-[11px]">{isMarked ? 'Marked' : 'Mark'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span className="tabular-nums font-semibold text-zinc-200 text-xs">{formatTimer(timerSeconds)}</span>
              </div>
              <button
                onClick={handleNext}
                className="flex items-center gap-1 text-zinc-400 hover:text-white font-mono text-xs active:scale-95 touch-manipulation"
              >
                <span>Skip</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1.5 font-semibold">
              CLAT GK · {currentQ.category}
            </div>
            <h2 className="text-lg sm:text-xl font-sans font-semibold text-white leading-relaxed">
              {currentQ.text}
            </h2>
          </div>

          {/* Action buttons: Search Google [S] & Copy for AI [C] */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={handleSearchGoogle}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white active:scale-95 touch-manipulation min-h-[40px]"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search Google</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-zinc-800 rounded border border-zinc-700 text-[10px] text-zinc-400">
                S
              </kbd>
            </button>

            <button
              onClick={handleCopyForAI}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white active:scale-95 touch-manipulation min-h-[40px]"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copy for AI</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-zinc-800 rounded border border-zinc-700 text-[10px] text-zinc-400">
                C
              </kbd>
            </button>
          </div>

          {/* A/B/C/D Option Checkboxes */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctOptionIndex;

              let cardStyle =
                'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-200 active:border-zinc-600';
              let badgeStyle = 'bg-zinc-800 text-zinc-300 border-zinc-700';

              if (isSubmitted) {
                if (isCorrectAnswer) {
                  cardStyle =
                    'bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-[0_0_12px_rgba(34,197,94,0.2)]';
                  badgeStyle = 'bg-emerald-500 text-black border-emerald-400 font-bold';
                } else if (isSelected && !isCorrectAnswer) {
                  cardStyle = 'bg-rose-950/40 border-rose-500 text-rose-100';
                  badgeStyle = 'bg-rose-500 text-white border-rose-400 font-bold';
                }
              } else if (isSelected) {
                cardStyle =
                  'bg-zinc-800/90 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/50';
                badgeStyle = 'bg-cyan-400 text-black border-cyan-300 font-bold';
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
                  className={`w-full flex items-center justify-between min-h-[52px] p-3.5 sm:p-4 rounded-lg border transition-all cursor-pointer active:scale-95 touch-manipulation select-none ${cardStyle}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span
                      className={`w-7 h-7 rounded flex items-center justify-center font-mono text-xs border shrink-0 ${badgeStyle}`}
                    >
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm font-sans font-medium text-left leading-snug">
                      {opt}
                    </span>
                  </div>

                  {isSubmitted && (
                    <div className="shrink-0 ml-2">
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
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-xs sm:text-sm animate-fade-in">
              <div className="flex items-center gap-2 mb-2 font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EXPLANATION & CONTEXT</span>
              </div>
              <p className="text-zinc-200 leading-relaxed font-sans">{currentQ.explanation}</p>
            </div>
          )}

          {/* Extra Notes Input */}
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Extra notes / reference
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
              placeholder="Add optional notes or memory aids..."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-lg text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none min-h-[40px]"
            />
          </div>

          {/* Bottom Submit Answer button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800/80 font-mono text-xs">
            <span className="text-zinc-500 text-center sm:text-left text-[11px]">
              Submitting saves attempt under <span className="text-cyan-400 font-bold">{activeUsername}</span>
            </span>

            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-sans text-xs sm:text-sm font-bold active:scale-95 touch-manipulation transition-all ${
                selectedOption === null
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
                  : isSubmitted
                  ? 'bg-zinc-100 hover:bg-white text-black shadow-md'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]'
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
        </main>
      </div>
    </div>
  );
};
