import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BankQuestion,
  LeaderboardUser,
  SquadMember,
  SQUAD_MEMBERS,
} from '../types';
import {
  Search,
  Copy,
  Pencil,
  Check,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { sounds } from '../utils/sound';
import {
  fetchUnsolvedQuestions,
  fetchSolvedSprintQuestions,
  submitFactualAnswer,
  fetchLiveLeaderboard,
} from '../lib/clatService';
import { supabase } from '../lib/supabase';

interface OnelinersWorkbenchProps {
  activeUsername: SquadMember;
  onCorrectAnswer: () => void;
  markedQuestionIds?: Set<string>;
  onToggleMarkForReview?: (id: string) => void;
}

export const OnelinersWorkbench: React.FC<OnelinersWorkbenchProps> = ({
  activeUsername,
  onCorrectAnswer,
  markedQuestionIds = new Set(),
  onToggleMarkForReview,
}) => {
  // Two-way toggle: "Solve" | "Sprint"
  const [internalMode, setInternalMode] = useState<'solve' | 'sprint'>('solve');

  // ========================================================
  // SOLVE MODE STATE: Questions where correct_answer IS NULL
  // ========================================================
  const [unsolvedQueue, setUnsolvedQueue] = useState<BankQuestion[]>([]);
  const [currentSolveIndex, setCurrentSolveIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extraNotesInput, setExtraNotesInput] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [editOptions, setEditOptions] = useState<string[]>(['', '', '', '']);

  // Shared Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

  // ========================================================
  // SPRINT MODE STATE: Questions where correct_answer IS NOT NULL
  // ========================================================
  const [solvedPool, setSolvedPool] = useState<BankQuestion[]>([]);
  const [sprintIndex, setSprintIndex] = useState(0);
  const [sprintScore, setSprintScore] = useState(0);
  const [sprintStreak, setSprintStreak] = useState(0);
  const [sprintTimeLeft, setSprintTimeLeft] = useState(10);
  const [sprintGameOver, setSprintGameOver] = useState(false);
  const [sprintWrongPicked, setSprintWrongPicked] = useState<number | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const sprintTimerRef = useRef<any>(null);
  const cooldownTimerRef = useRef<any>(null);

  // 1. Load Unsolved questions for Solve Mode
  const loadUnsolved = useCallback(async () => {
    const list = await fetchUnsolvedQuestions();
    setUnsolvedQueue(list);
    setCurrentSolveIndex(0);
    setSelectedOption(null);
    if (list[0]) {
      setEditText(list[0].text);
      setEditOptions([...list[0].options]);
      setExtraNotesInput(list[0].extraNotes || '');
    }
  }, []);

  // 2. Load Solved questions for Sprint Mode
  const loadSolved = useCallback(async () => {
    const list = await fetchSolvedSprintQuestions();
    setSolvedPool(list);
    setSprintIndex(0);
  }, []);

  useEffect(() => {
    loadUnsolved();
    loadSolved();
    fetchLiveLeaderboard(activeUsername).then(setLeaderboard);
  }, [loadUnsolved, loadSolved, activeUsername]);

  // Real-time listener for user_attempts and question updates
  useEffect(() => {
    const channel = supabase
      .channel('realtime:workbench:global')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_attempts' },
        async () => {
          const freshLb = await fetchLiveLeaderboard(activeUsername);
          setLeaderboard(freshLb);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'questions' },
        () => {
          loadUnsolved();
          loadSolved();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeUsername, loadUnsolved, loadSolved]);

  const activeSolveQ = unsolvedQueue[currentSolveIndex];
  const activeSprintQ = solvedPool[sprintIndex];

  // Sync edit state when activeSolveQ changes
  useEffect(() => {
    if (activeSolveQ) {
      setEditText(activeSolveQ.text);
      setEditOptions([...activeSolveQ.options]);
      setExtraNotesInput(activeSolveQ.extraNotes || '');
      setSelectedOption(null);
    }
  }, [activeSolveQ]);

  // Handle Search Google [S]
  const handleSearchGoogle = useCallback(() => {
    if (!activeSolveQ) return;
    sounds.playClick();
    const cleaned = activeSolveQ.text
      .replace(/^(Q\d+[:.]?|Question\s*\d+[:.]?)\s*/i, '')
      .replace(/According to the passage,?/gi, '')
      .replace(/Which of the following is true regarding/gi, '')
      .replace(/Consider the following statements/gi, '')
      .trim();
    const query = encodeURIComponent(`${cleaned} legal GK news fact check`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  }, [activeSolveQ]);

  // Handle Copy for AI [C]
  const handleCopyForAI = useCallback(() => {
    if (!activeSolveQ) return;
    sounds.playClick();
    const prompt = `Please provide the definitive factual answer and a concise 1-sentence legal/GK rationale for the following multiple choice question:\n\nQuestion: ${activeSolveQ.text}\nOptions:\nA) ${activeSolveQ.options[0]}\nB) ${activeSolveQ.options[1]}\nC) ${activeSolveQ.options[2]}\nD) ${activeSolveQ.options[3]}\n\nReply format:\nAnswer: [A/B/C/D]\nRationale: [Reasoning and citation]`;
    navigator.clipboard.writeText(prompt);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  }, [activeSolveQ]);

  // Save Inline Edit
  const handleSaveInlineEdit = () => {
    if (!activeSolveQ) return;
    sounds.playClick();
    activeSolveQ.text = editText;
    activeSolveQ.options = [...editOptions];
    setIsEditing(false);
  };

  // Submit Answer to DB (Solve Mode)
  const handleSubmitSolve = useCallback(async () => {
    if (!activeSolveQ || selectedOption === null || isSubmitting) return;

    sounds.playCorrect();
    setIsSubmitting(true);
    const chosenLetter = ['A', 'B', 'C', 'D'][selectedOption];

    const success = await submitFactualAnswer(
      activeSolveQ.id,
      chosenLetter,
      activeUsername,
      extraNotesInput
    );

    if (success) {
      onCorrectAnswer();
      setUnsolvedQueue((prev) => prev.filter((q) => q.id !== activeSolveQ.id));
      setSelectedOption(null);
      setExtraNotesInput('');

      const freshLb = await fetchLiveLeaderboard(activeUsername);
      setLeaderboard(freshLb);
    }

    setIsSubmitting(false);
  }, [activeSolveQ, selectedOption, isSubmitting, activeUsername, extraNotesInput, onCorrectAnswer]);

  const handleSkipSolve = useCallback(() => {
    sounds.playClick();
    if (unsolvedQueue.length > 1) {
      setCurrentSolveIndex((prev) => (prev + 1) % unsolvedQueue.length);
      setSelectedOption(null);
    }
  }, [unsolvedQueue.length]);

  // Sprint Mode Hardware 10-Second Timer
  useEffect(() => {
    if (internalMode !== 'sprint' || sprintGameOver || !activeSprintQ) return;

    setSprintTimeLeft(10);
    if (sprintTimerRef.current) clearInterval(sprintTimerRef.current);

    sprintTimerRef.current = setInterval(() => {
      setSprintTimeLeft((prev) => {
        if (prev <= 0.1) {
          triggerSprintOver(null);
          return 0;
        }
        return Math.max(0, Math.round((prev - 0.1) * 10) / 10);
      });
    }, 100);

    return () => {
      if (sprintTimerRef.current) clearInterval(sprintTimerRef.current);
    };
  }, [internalMode, sprintGameOver, activeSprintQ, sprintIndex]);

  // Sprint Cooldown Timer (60s Lockout on Failure)
  useEffect(() => {
    if (cooldownSeconds > 0) {
      cooldownTimerRef.current = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, [cooldownSeconds]);

  const triggerSprintOver = (wrongIdx: number | null) => {
    if (sprintTimerRef.current) clearInterval(sprintTimerRef.current);
    sounds.playIncorrect();
    setSprintWrongPicked(wrongIdx);
    setSprintGameOver(true);
    setCooldownSeconds(60); // 60s cooldown lockout penalty
  };

  const handleSprintAnswer = (idx: number) => {
    if (sprintGameOver || !activeSprintQ) return;

    const chosenLetter = ['A', 'B', 'C', 'D'][idx];
    const isCorrect =
      chosenLetter === (activeSprintQ.correct_answer || '').toUpperCase() ||
      idx === activeSprintQ.correctOptionIndex;

    if (isCorrect) {
      sounds.playCorrect();
      onCorrectAnswer();
      setSprintScore((prev) => prev + 100 + Math.round(sprintTimeLeft * 20));
      setSprintStreak((prev) => prev + 1);

      // Fast 70ms advance on correct pick
      setTimeout(() => {
        setSprintTimeLeft(10);
        setSprintIndex((prev) => (prev + 1) % Math.max(1, solvedPool.length));
      }, 70);
    } else {
      triggerSprintOver(idx);
    }
  };

  const handleRestartSprint = () => {
    if (cooldownSeconds > 0) return;
    sounds.playClick();
    setSprintScore(0);
    setSprintStreak(0);
    setSprintTimeLeft(10);
    setSprintGameOver(false);
    setSprintWrongPicked(null);
    setSprintIndex((prev) => (prev + 1) % Math.max(1, solvedPool.length));
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        if (e.key === 'Enter' && e.ctrlKey && internalMode === 'solve') handleSubmitSolve();
        return;
      }

      if (internalMode === 'solve') {
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
          handleSubmitSolve();
        } else if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          handleSearchGoogle();
        } else if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          handleCopyForAI();
        } else if (e.code === 'Space') {
          e.preventDefault();
          handleSkipSolve();
        }
      } else if (internalMode === 'sprint') {
        if (!sprintGameOver) {
          if (e.key === '1' || e.key.toLowerCase() === 'a') handleSprintAnswer(0);
          else if (e.key === '2' || e.key.toLowerCase() === 'b') handleSprintAnswer(1);
          else if (e.key === '3' || e.key.toLowerCase() === 'c') handleSprintAnswer(2);
          else if (e.key === '4' || e.key.toLowerCase() === 'd') handleSprintAnswer(3);
        } else if ((e.code === 'Space' || e.key === 'Enter') && cooldownSeconds === 0) {
          e.preventDefault();
          handleRestartSprint();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    internalMode,
    sprintGameOver,
    cooldownSeconds,
    handleSubmitSolve,
    handleSearchGoogle,
    handleCopyForAI,
    handleSkipSolve,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 select-none">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-14 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-[#050505] border border-neutral-700 text-neutral-200 text-xs rounded shadow-lg">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Copied prompt to clipboard</span>
        </div>
      )}

      {/* Top Controls: Clean Two-Way Toggle ("Solve" | "Sprint") */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800/80 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md bg-neutral-900/80 p-0.5 border border-neutral-800">
            <button
              onClick={() => {
                sounds.playClick();
                setInternalMode('solve');
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                internalMode === 'solve'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Solve ({unsolvedQueue.length})
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setInternalMode('sprint');
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                internalMode === 'sprint'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sprint ({solvedPool.length})
            </button>
          </div>
        </div>

        <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
          {internalMode === 'solve' ? 'Collaborative Verification' : 'High-Speed Training'}
        </span>
      </div>

      {/* ======================================================== */}
      {/* A. SOLVE MODE: Collaborative Fact-Finding Workbench      */}
      {/* (Questions where correct_answer IS NULL)                 */}
      {/* ======================================================== */}
      {internalMode === 'solve' ? (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 items-start">
          {/* Left: Squad Stats & Feed */}
          <aside className="w-full lg:col-span-4 bg-[#050505] border border-neutral-800/80 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80 text-xs font-medium text-neutral-300">
              <span>Squad Leaderboard</span>
              <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>

            <div className="space-y-1">
              {leaderboard.map((user, idx) => {
                const info = SQUAD_MEMBERS[user.name as SquadMember] || SQUAD_MEMBERS.Samad;
                const isCurrent = user.name === activeUsername;
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-2 rounded text-xs transition-colors ${
                      isCurrent
                        ? 'bg-neutral-800/70 border border-neutral-700/80 text-white font-medium'
                        : 'text-neutral-400 hover:bg-neutral-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                      <span>{user.name}</span>
                      {isCurrent && <span className="text-neutral-500 text-[10px]">(You)</span>}
                    </div>
                    <div className="text-right font-mono text-[11px] text-neutral-300 tabular-nums">
                      {user.solvedCount} verified
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Center: Research Workbench */}
          <main className="w-full lg:col-span-8 bg-[#050505] border border-neutral-800/80 rounded-lg p-6 space-y-5">
            {activeSolveQ ? (
              <>
                {/* Meta & Research Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-400 text-xs">{activeSolveQ.id}</span>
                    <span className="text-neutral-600">·</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-neutral-400 text-[11px]">Pending verification</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSearchGoogle}
                      className="flex items-center gap-1 px-2.5 py-1 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded transition-colors cursor-pointer"
                      title="Search Google for factual confirmation"
                    >
                      <Search className="w-3 h-3 text-neutral-400" />
                      <span>Search [S]</span>
                    </button>

                    <button
                      onClick={handleCopyForAI}
                      className="flex items-center gap-1 px-2.5 py-1 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded transition-colors cursor-pointer"
                      title="Copy formatted prompt for AI verification"
                    >
                      <Copy className="w-3 h-3 text-neutral-400" />
                      <span>Copy [C]</span>
                    </button>

                    <button
                      onClick={() => setIsEditing((prev) => !prev)}
                      className={`p-1 rounded border transition-colors cursor-pointer ${
                        isEditing
                          ? 'border-emerald-500 text-emerald-400 bg-neutral-900'
                          : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                      }`}
                      title="Edit question text"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Statement - Hero Typography */}
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-black border border-neutral-700 rounded text-sm text-neutral-100 focus:outline-none leading-relaxed"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {editOptions.map((opt, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const next = [...editOptions];
                            next[idx] = e.target.value;
                            setEditOptions(next);
                          }}
                          placeholder={`Option ${['A', 'B', 'C', 'D'][idx]}`}
                          className="p-2 bg-black border border-neutral-800 rounded text-xs text-neutral-200"
                        />
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 text-xs text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveInlineEdit}
                        className="px-3.5 py-1 bg-emerald-500 text-black text-xs font-medium rounded"
                      >
                        Save Edits
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-base sm:text-lg font-sans font-medium text-neutral-100 leading-relaxed">
                      {activeSolveQ.text}
                    </h2>
                  </div>
                )}

                {/* Option Buttons (A/B/C/D) */}
                <div className="space-y-2 pt-1">
                  {activeSolveQ.options.map((opt, idx) => {
                    const letter = ['A', 'B', 'C', 'D'][idx];
                    const isPicked = selectedOption === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedOption(idx);
                        }}
                        className={`w-full flex items-center justify-between p-3.5 border rounded text-left text-sm transition-all cursor-pointer ${
                          isPicked
                            ? 'bg-neutral-800/80 border-emerald-500 text-white font-medium'
                            : 'border-neutral-800 hover:border-neutral-700 bg-black text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-5 h-5 rounded-xs flex items-center justify-center text-xs font-semibold shrink-0 ${
                              isPicked
                                ? 'bg-emerald-500 text-black'
                                : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="leading-snug">{opt}</span>
                        </div>
                        <span className="text-xs font-mono text-neutral-500 pl-3 shrink-0">
                          {idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Extra Notes / Verification Rationale Input */}
                <div className="pt-2">
                  <label className="block text-xs text-neutral-400 mb-1.5">
                    Verification Note / Authority (Saved to database):
                  </label>
                  <textarea
                    value={extraNotesInput}
                    onChange={(e) => setExtraNotesInput(e.target.value)}
                    placeholder="Add official gazette reference, statute citation, or verified fact..."
                    rows={2}
                    className="w-full p-2.5 bg-black border border-neutral-800 rounded text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
                  />
                </div>

                {/* Submit & Skip Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 text-xs">
                  <button
                    onClick={handleSkipSolve}
                    className="px-3 py-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded transition-colors cursor-pointer"
                  >
                    Skip (Space)
                  </button>

                  <button
                    onClick={handleSubmitSolve}
                    disabled={selectedOption === null || isSubmitting}
                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-black font-medium rounded transition-colors cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Submit Answer (Enter)'}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-neutral-500 text-xs space-y-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto" />
                <div className="text-neutral-200 font-medium text-sm">All Questions Verified</div>
                <p className="text-neutral-500 max-w-sm mx-auto">
                  The squad has verified all pending questions. Switch to Sprint mode to test your speed.
                </p>
                <button
                  onClick={loadUnsolved}
                  className="mt-3 px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs hover:border-neutral-700 rounded cursor-pointer"
                >
                  Refresh Queue
                </button>
              </div>
            )}
          </main>
        </div>
      ) : (
        /* ======================================================== */
        /* B. SPRINT MODE: Testing Engine                           */
        /* (Questions where correct_answer IS NOT NULL)             */
        /* ======================================================== */
        <div className="max-w-2xl mx-auto bg-[#050505] border border-neutral-800/80 rounded-lg p-6 sm:p-7 space-y-5">
          {activeSprintQ ? (
            <>
              {/* Sprint HUD: Timer, Streak, Score */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-neutral-400">
                    Question <span className="text-white font-medium">{sprintIndex + 1}</span> of {solvedPool.length}
                  </span>
                  <span className="text-neutral-600">·</span>
                  <span className="text-neutral-500 font-mono text-[11px]">
                    Verified by {activeSprintQ.verified_by || 'Squad'}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono text-xs">{sprintStreak} streak</span>
                  </div>
                  <div className="text-emerald-400 font-mono text-xs">
                    {sprintScore} pts
                  </div>
                </div>
              </div>

              {/* 10-Second Hardware Timer with Color Shifts: Sky Blue > 5s, Amber 2.5-5s, Pulsing Rose < 2.5s */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-neutral-500 font-mono text-[11px]">Time remaining</span>
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      sprintTimeLeft <= 2.5
                        ? 'text-rose-500 animate-pulse font-bold'
                        : sprintTimeLeft <= 5
                        ? 'text-amber-400'
                        : 'text-sky-400'
                    }`}
                  >
                    {sprintTimeLeft.toFixed(1)}s
                  </span>
                </div>
                <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-100 ${
                      sprintTimeLeft <= 2.5
                        ? 'bg-rose-500'
                        : sprintTimeLeft <= 5
                        ? 'bg-amber-400'
                        : 'bg-sky-400'
                    }`}
                    style={{ width: `${(sprintTimeLeft / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text - Hero Typography */}
              <div>
                <h2 className="text-base sm:text-lg font-sans font-medium text-neutral-100 leading-relaxed">
                  {activeSprintQ.text}
                </h2>
              </div>

              {/* Option Buttons */}
              <div className="space-y-2">
                {activeSprintQ.options.map((opt, idx) => {
                  const letter = ['A', 'B', 'C', 'D'][idx];
                  const isCorrectAnswer =
                    letter === (activeSprintQ.correct_answer || '').toUpperCase() ||
                    idx === activeSprintQ.correctOptionIndex;
                  const isWrongPicked = sprintWrongPicked === idx;

                  let borderClass = 'border-neutral-800 hover:border-neutral-700 bg-black text-neutral-200';
                  if (sprintGameOver) {
                    if (isCorrectAnswer) {
                      borderClass = 'border-emerald-500 bg-emerald-950/20 text-emerald-100 font-medium';
                    } else if (isWrongPicked) {
                      borderClass = 'border-rose-500 bg-rose-950/20 text-rose-100';
                    } else {
                      borderClass = 'border-neutral-800/50 bg-black/40 text-neutral-500';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSprintAnswer(idx)}
                      disabled={sprintGameOver}
                      className={`w-full flex items-center justify-between p-3.5 border rounded text-left text-sm transition-all cursor-pointer ${borderClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-xs flex items-center justify-center text-xs font-semibold border border-neutral-800 bg-neutral-900 text-neutral-400 shrink-0">
                          {letter}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>
                      <span className="text-xs font-mono text-neutral-500 pl-3 shrink-0">
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sudden Death Game Over & 60-Second Cooldown Penalty */}
              {sprintGameOver && (
                <div className="p-4 bg-black border border-rose-500/70 rounded-lg space-y-3 text-xs">
                  <div className="flex items-center justify-between text-rose-400">
                    <div className="flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Sprint Ended. Answer differed from verified key.</span>
                    </div>
                    <span className="font-mono">{sprintStreak} streak</span>
                  </div>

                  {activeSprintQ.extraNotes && (
                    <div className="p-2.5 bg-neutral-950 border border-neutral-800/80 rounded text-neutral-300 text-xs">
                      <span className="text-amber-400 font-mono text-[11px] block mb-0.5">Verification Note:</span>
                      <p className="leading-relaxed">{activeSprintQ.extraNotes}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                    <div>
                      {cooldownSeconds > 0 ? (
                        <span className="text-amber-400 font-mono text-xs">
                          Cooldown: {cooldownSeconds}s lockout
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-xs">Cooldown finished. Ready to retry.</span>
                      )}
                    </div>

                    <button
                      onClick={handleRestartSprint}
                      disabled={cooldownSeconds > 0}
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-medium text-xs rounded transition-colors cursor-pointer"
                    >
                      {cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s` : 'Try Again (Space)'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-14 text-center text-neutral-500 text-xs space-y-2">
              <CheckCircle2 className="w-7 h-7 text-neutral-600 mx-auto" />
              <div className="text-neutral-200 font-medium text-sm">No Verified Questions Yet</div>
              <p className="text-neutral-500 max-w-sm mx-auto">
                Questions must be verified in Solve mode before they appear in the Sprint test key.
              </p>
              <button
                onClick={() => setInternalMode('solve')}
                className="mt-3 px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded cursor-pointer"
              >
                Go to Solve Mode
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
