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
  fetchNextOnelinerQuestion,
  unlockQuestion,
  submitFactualAnswer,
  fetchLiveLeaderboard,
} from '../lib/clatService';
import { supabaseOneliners } from '../lib/supabase';
import { executePrecisionSearch, copyQuestionForAI } from '../utils/searchHelper';
import { JennyMascot, JennyLoadingState } from './JennyMascot';

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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [editOptions, setEditOptions] = useState<string[]>(['', '', '', '']);

  // Shared Leaderboard & Live Ticker
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [recentTicker, setRecentTicker] = useState<{ user: string; questionId: string; time: string } | null>(null);

  // ========================================================
  // SPRINT MODE STATE: Questions where correct_answer IS NOT NULL
  // (Zero database writes, strictly in-memory and localStorage)
  // ========================================================
  const [sprintPlaylistScope, setSprintPlaylistScope] = useState<'all' | 'you'>('all');
  const [solvedPool, setSolvedPool] = useState<BankQuestion[]>([]);
  const [sprintIndex, setSprintIndex] = useState(0);
  const [sprintScore, setSprintScore] = useState(0);
  const [sprintStreak, setSprintStreak] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`clat_sprint_streak_${activeUsername}`);
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 0;
  });
  const [sprintTimeLeft, setSprintTimeLeft] = useState(10);
  const [sprintGameOver, setSprintGameOver] = useState(false);
  const [sprintWrongPicked, setSprintWrongPicked] = useState<number | null>(null);

  // 60s cooldown penalty strictly managed via localStorage
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const until = localStorage.getItem(`clat_sprint_cooldown_${activeUsername}`);
      if (until) {
        const diff = Math.ceil((parseInt(until, 10) - Date.now()) / 1000);
        if (diff > 0) return Math.min(60, diff);
      }
    }
    return 0;
  });

  const sprintTimerRef = useRef<any>(null);
  const cooldownTimerRef = useRef<any>(null);

  // 1. Load Unsolved question for Solve Mode using get_next_question(user_name)
  const loadUnsolved = useCallback(async () => {
    // 1. Priority: Existing RPC get_next_question(user_name)
    const nextQ = await fetchNextOnelinerQuestion(activeUsername);
    if (nextQ) {
      setUnsolvedQueue([nextQ]);
      setCurrentSolveIndex(0);
      setSelectedOption(null);
      setEditText(nextQ.text);
      setEditOptions([...nextQ.options]);
      setExtraNotesInput(nextQ.extraNotes || '');
      return;
    }

    const list = await fetchUnsolvedQuestions();
    setUnsolvedQueue(list);
    setCurrentSolveIndex(0);
    setSelectedOption(null);
    if (list[0]) {
      setEditText(list[0].text);
      setEditOptions([...list[0].options]);
      setExtraNotesInput(list[0].extraNotes || '');
    }
  }, [activeUsername]);

  // 2. Load Solved questions for Sprint Mode (with Spaced Repetition ordering via localStorage)
  const loadSolved = useCallback(async (scope: 'all' | 'you' = sprintPlaylistScope) => {
    const list = await fetchSolvedSprintQuestions(scope, activeUsername);

    // Spaced repetition ordering strictly via localStorage lastSeenAt
    let lastSeenMap: Record<string, number> = {};
    try {
      const saved = localStorage.getItem('clat_sprint_last_seen');
      if (saved) lastSeenMap = JSON.parse(saved);
    } catch {}

    const sorted = [...list].sort((a, b) => {
      const aSeen = lastSeenMap[a.id] || 0;
      const bSeen = lastSeenMap[b.id] || 0;
      return aSeen - bSeen;
    });

    setSolvedPool(sorted);
    setSprintIndex(0);
  }, [sprintPlaylistScope, activeUsername]);

  useEffect(() => {
    loadUnsolved();
    loadSolved();
    fetchLiveLeaderboard(activeUsername).then(setLeaderboard);
  }, [loadUnsolved, loadSolved, activeUsername]);

  // Real-time listener: Subscribe to UPDATE events on questions where status = 'answered'
  useEffect(() => {
    const channel = supabaseOneliners
      .channel('realtime:workbench:global:answered')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'questions' },
        async (payload) => {
          const newRow = payload.new as any;
          if (
            newRow &&
            (newRow.status === 'answered' ||
              newRow.verification_status === 'answered' ||
              newRow.correct_answer)
          ) {
            const freshLb = await fetchLiveLeaderboard(activeUsername);
            setLeaderboard(freshLb);
            const verifiedUser = newRow.answered_by || newRow.verified_by || newRow.user_name;
            if (verifiedUser) {
              setRecentTicker({
                user: verifiedUser,
                questionId: newRow.id,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              });
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'questions' },
        async () => {
          const freshLb = await fetchLiveLeaderboard(activeUsername);
          setLeaderboard(freshLb);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'user_attempts' },
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

  // 3. Precision Search Helper [S]
  const handleSearchGoogle = useCallback(async () => {
    if (!activeSolveQ) return;
    sounds.playClick();
    const result = await executePrecisionSearch(activeSolveQ.text, activeSolveQ.options);
    if (result.copiedToClipboard) {
      setToastMessage('Search popup blocked · Cleaned query copied to clipboard');
    } else if (result.openedWindow) {
      setToastMessage('Opened Google search in right window (860px)');
    }
    setTimeout(() => setToastMessage(null), 3000);
  }, [activeSolveQ]);

  // 4. Copy for AI Fallback [C]
  const handleCopyForAI = useCallback(async () => {
    if (!activeSolveQ) return;
    sounds.playClick();
    const success = await copyQuestionForAI(activeSolveQ.text, activeSolveQ.options);
    if (success) {
      setToastMessage('Copied raw question & 4 options for AI (LLM ready)');
    } else {
      setToastMessage('Failed to copy to clipboard');
    }
    setTimeout(() => setToastMessage(null), 2500);
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
    const chosenOptionText = activeSolveQ.options[selectedOption];

    const success = await submitFactualAnswer(
      activeSolveQ.id,
      chosenLetter,
      activeUsername,
      extraNotesInput,
      chosenOptionText
    );

    if (success) {
      onCorrectAnswer();
      setSelectedOption(null);
      setExtraNotesInput('');

      // Fetch next question via RPC get_next_question(user_name)
      const nextQ = await fetchNextOnelinerQuestion(activeUsername);
      if (nextQ) {
        setUnsolvedQueue([nextQ]);
        setCurrentSolveIndex(0);
      } else {
        setUnsolvedQueue((prev) => prev.filter((q) => q.id !== activeSolveQ.id));
      }

      const freshLb = await fetchLiveLeaderboard(activeUsername);
      setLeaderboard(freshLb);
    }

    setIsSubmitting(false);
  }, [activeSolveQ, selectedOption, isSubmitting, activeUsername, extraNotesInput, onCorrectAnswer]);

  const handleSkipSolve = useCallback(async () => {
    sounds.playClick();
    if (activeSolveQ) {
      await unlockQuestion(activeSolveQ.id, activeUsername);
    }
    const nextQ = await fetchNextOnelinerQuestion(activeUsername);
    if (nextQ) {
      setUnsolvedQueue([nextQ]);
      setCurrentSolveIndex(0);
      setSelectedOption(null);
    } else if (unsolvedQueue.length > 1) {
      setCurrentSolveIndex((prev) => (prev + 1) % unsolvedQueue.length);
      setSelectedOption(null);
    }
  }, [activeSolveQ, activeUsername, unsolvedQueue.length]);

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

  // Sprint Cooldown Timer (60s Lockout on Failure strictly via localStorage)
  useEffect(() => {
    if (cooldownSeconds > 0) {
      cooldownTimerRef.current = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownTimerRef.current);
            localStorage.removeItem(`clat_sprint_cooldown_${activeUsername}`);
            return 0;
          }
          const next = prev - 1;
          const until = Date.now() + next * 1000;
          localStorage.setItem(`clat_sprint_cooldown_${activeUsername}`, until.toString());
          return next;
        });
      }, 1000);
    }

    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, [cooldownSeconds, activeUsername]);

  const triggerSprintOver = (wrongIdx: number | null) => {
    if (sprintTimerRef.current) clearInterval(sprintTimerRef.current);
    sounds.playIncorrect();
    setSprintWrongPicked(wrongIdx);
    setSprintGameOver(true);

    // Set 60s cooldown penalty strictly via localStorage
    const until = Date.now() + 60000;
    localStorage.setItem(`clat_sprint_cooldown_${activeUsername}`, until.toString());
    localStorage.setItem(`clat_sprint_streak_${activeUsername}`, '0');
    setSprintStreak(0);
    setCooldownSeconds(60);
  };

  // ZERO DATABASE WRITES in Sprint Mode
  const handleSprintAnswer = (idx: number) => {
    if (sprintGameOver || !activeSprintQ) return;

    const chosenLetter = ['A', 'B', 'C', 'D'][idx];
    const isCorrect =
      chosenLetter === (activeSprintQ.correct_answer || '').toUpperCase() ||
      idx === activeSprintQ.correctOptionIndex;

    // Record lastSeenAt in localStorage for spaced repetition
    try {
      const saved = localStorage.getItem('clat_sprint_last_seen');
      const map = saved ? JSON.parse(saved) : {};
      map[activeSprintQ.id] = Date.now();
      localStorage.setItem('clat_sprint_last_seen', JSON.stringify(map));
    } catch {}

    if (isCorrect) {
      sounds.playCorrect();
      onCorrectAnswer();
      setSprintScore((prev) => prev + 100 + Math.round(sprintTimeLeft * 20));

      setSprintStreak((prev) => {
        const next = prev + 1;
        localStorage.setItem(`clat_sprint_streak_${activeUsername}`, next.toString());
        return next;
      });

      // Fast advance on correct pick
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
    setSprintTimeLeft(10);
    setSprintGameOver(false);
    setSprintWrongPicked(null);
    setSprintIndex((prev) => (prev + 1) % Math.max(1, solvedPool.length));
  };

  const handleSelectPlaylistScope = (scope: 'all' | 'you') => {
    sounds.playClick();
    setSprintPlaylistScope(scope);
    loadSolved(scope);
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
      {toastMessage && (
        <div className="fixed top-14 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-panel border border-border text-main text-xs rounded shadow-lg animate-in fade-in duration-150">
          <Check className="w-3.5 h-3.5 text-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Controls: Clean Two-Way Toggle ("Solve" | "Sprint") */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-border text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md bg-panel p-0.5 border border-border">
            <button
              onClick={() => {
                sounds.playClick();
                setInternalMode('solve');
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                internalMode === 'solve'
                  ? 'bg-hover text-main shadow-xs border border-border'
                  : 'text-muted hover:text-main'
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
                  ? 'bg-hover text-main shadow-xs border border-border'
                  : 'text-muted hover:text-main'
              }`}
            >
              Sprint ({solvedPool.length})
            </button>
          </div>
        </div>

        <span className="text-[11px] text-muted font-mono hidden sm:inline">
          {internalMode === 'solve' ? 'Collaborative Verification' : 'High-Speed Testing Engine'}
        </span>
      </div>

      {/* ======================================================== */}
      {/* A. SOLVE MODE: Collaborative Fact-Finding Workbench      */}
      {/* (Questions where correct_answer IS NULL)                 */}
      {/* ======================================================== */}
      {internalMode === 'solve' ? (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 items-start">
          {/* Left: Squad Stats & Feed */}
          <aside className="w-full lg:col-span-4 bg-panel border border-border rounded-lg p-4 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-medium text-main">
              <span>Squad Leaderboard</span>
              <span className="text-accent text-[10px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Live
              </span>
            </div>

            <div className="space-y-1">
              {leaderboard.map((user) => {
                const info = SQUAD_MEMBERS[user.name as SquadMember] || SQUAD_MEMBERS.Samad;
                const isCurrent = user.name === activeUsername;
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-2 rounded text-xs transition-colors ${
                      isCurrent
                        ? 'bg-hover border border-border text-main font-medium'
                        : 'text-muted hover:bg-hover/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
                      <span>{user.name}</span>
                      {isCurrent && <span className="text-muted text-[10px]">(You)</span>}
                    </div>
                    <div className="text-right font-mono text-[11px] text-muted tabular-nums">
                      {user.solvedCount} verified
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Realtime Ticker */}
            {recentTicker && (
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-accent">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                    Verified: {recentTicker.questionId}
                  </span>
                  <span className="text-muted text-[10px]">
                    {recentTicker.user} · {recentTicker.time}
                  </span>
                </div>
              </div>
            )}
          </aside>

          {/* Center: Research Workbench */}
          <main className="w-full lg:col-span-8 bg-panel border border-border rounded-lg p-6 space-y-5 transition-colors">
            {activeSolveQ ? (
              <>
                {/* Meta & Research Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-muted text-xs break-all">{activeSolveQ.id}</span>
                    <span className="text-muted/60 hidden xs:inline">·</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-muted text-[11px] whitespace-normal">Pending verification</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSearchGoogle}
                      className="flex items-center gap-1 px-2.5 py-1 text-muted hover:text-main border border-border hover:border-accent/50 rounded transition-colors cursor-pointer"
                      title="Search Google for factual confirmation"
                    >
                      <Search className="w-3 h-3 text-muted" />
                      <span>Search [S]</span>
                    </button>

                    <button
                      onClick={handleCopyForAI}
                      className="flex items-center gap-1 px-2.5 py-1 text-muted hover:text-main border border-border hover:border-accent/50 rounded transition-colors cursor-pointer"
                      title="Copy formatted prompt for AI verification"
                    >
                      <Copy className="w-3 h-3 text-muted" />
                      <span>Copy [C]</span>
                    </button>

                    <button
                      onClick={() => setIsEditing((prev) => !prev)}
                      className={`p-1 rounded border transition-colors cursor-pointer ${
                        isEditing
                          ? 'border-accent text-accent bg-hover'
                          : 'border-border text-muted hover:text-main'
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
                      className="w-full p-3 bg-background border border-border rounded text-sm text-main focus:outline-none focus:border-accent leading-relaxed"
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
                          className="p-2 bg-background border border-border rounded text-xs text-main focus:outline-none focus:border-accent"
                        />
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 text-xs text-muted hover:text-main"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveInlineEdit}
                        style={{ background: 'var(--accent-gradient, var(--accent))' }}
                        className="px-3.5 py-1 text-black text-xs font-medium rounded transition-opacity hover:opacity-90 shadow-xs"
                      >
                        Save Edits
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-base sm:text-lg font-sans font-medium text-main leading-relaxed break-words whitespace-normal">
                      {activeSolveQ.text}
                    </h2>
                  </div>
                )}

                {/* Option Buttons (A/B/C/D) */}
                <div className="space-y-2.5 pt-1">
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
                        className={`w-full flex items-center justify-between p-4 min-h-[3rem] h-auto border rounded text-left text-sm transition-all cursor-pointer ${
                          isPicked
                            ? 'bg-accent/15 border-accent text-main font-medium ring-1 ring-accent'
                            : 'border-border hover:border-accent bg-background text-main'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span
                            className={`w-5 h-5 rounded-xs flex items-center justify-center text-xs font-semibold shrink-0 ${
                              isPicked
                                ? 'bg-accent text-black'
                                : 'bg-hover text-muted border border-border'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="break-words whitespace-normal leading-relaxed text-sm">
                            {opt}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-muted pl-3 shrink-0 hidden sm:inline tabular-nums">
                          {idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Extra Notes / Verification Rationale Input */}
                <div className="pt-2">
                  <label className="block text-xs text-muted mb-1.5 font-sans">
                    Verification Note / Authority (Saved to database):
                  </label>
                  <textarea
                    value={extraNotesInput}
                    onChange={(e) => setExtraNotesInput(e.target.value)}
                    placeholder="Add official gazette reference, statute citation, or verified fact..."
                    rows={2}
                    className="w-full p-3 bg-background border border-border rounded text-xs text-main placeholder:text-muted/50 focus:outline-none focus:border-accent font-reading font-serif leading-relaxed"
                  />
                </div>

                {/* Submit & Skip Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                  <button
                    onClick={handleSkipSolve}
                    className="px-3.5 py-1.5 text-muted hover:text-main border border-border hover:border-accent/50 rounded transition-colors cursor-pointer min-h-[36px]"
                  >
                    Skip (Space)
                  </button>

                  <button
                    onClick={handleSubmitSolve}
                    disabled={selectedOption === null || isSubmitting}
                    style={{ background: 'var(--accent-gradient, var(--accent))' }}
                    className="px-4 py-1.5 disabled:opacity-30 text-black font-medium rounded transition-opacity hover:opacity-90 cursor-pointer min-h-[36px] shadow-xs"
                  >
                    {isSubmitting ? 'Saving...' : 'Submit Answer (Enter)'}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-14 text-center text-muted text-xs space-y-3">
                <JennyMascot size="lg" variant="sleeping" className="mx-auto" />
                <div className="text-main font-medium text-base font-sans">
                  All Current Questions Verified!
                </div>
                <p className="text-muted max-w-sm mx-auto font-sans leading-relaxed">
                  Jenny and the squad have verified all pending one-liners. Switch to Sprint mode to test your speed.
                </p>
                <button
                  onClick={loadUnsolved}
                  className="mt-3 px-3.5 py-1.5 bg-hover border border-border text-main text-xs hover:border-accent/50 rounded cursor-pointer min-h-[36px]"
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
        <div className="max-w-2xl mx-auto bg-panel border border-border rounded-lg p-6 sm:p-7 space-y-5 transition-colors">
          {activeSprintQ ? (
            <>
              {/* Sprint HUD: Scope Selector, Timer, Streak, Score */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border text-xs">
                <div className="flex items-center gap-3">
                  {/* Playlist Generation Scope: All vs You */}
                  <div className="flex items-center rounded bg-background p-0.5 border border-border">
                    <button
                      onClick={() => handleSelectPlaylistScope('all')}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
                        sprintPlaylistScope === 'all'
                          ? 'bg-hover text-main font-medium border border-border'
                          : 'text-muted hover:text-main'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleSelectPlaylistScope('you')}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded-xs transition-colors cursor-pointer ${
                        sprintPlaylistScope === 'you'
                          ? 'bg-hover text-main font-medium border border-border'
                          : 'text-muted hover:text-main'
                      }`}
                    >
                      You ({activeUsername})
                    </button>
                  </div>

                  <span className="font-mono text-muted text-xs">
                    {sprintIndex + 1} / {solvedPool.length}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono text-xs">{sprintStreak} streak</span>
                  </div>
                  <div className="text-accent font-mono text-xs font-semibold">
                    {sprintScore} pts
                  </div>
                </div>
              </div>

              {/* 10-Second Hardware Timer with Color Shifts: Sky Blue > 5s, Amber 2.5-5s, Pulsing Rose < 2.5s */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted font-mono text-[11px]">Time remaining</span>
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
                <div className="w-full h-1 bg-background border border-border rounded-full overflow-hidden">
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

              {/* Question Text - Academic Typography */}
              <div>
                <h2 className="text-base sm:text-lg font-sans font-medium text-main leading-relaxed break-words whitespace-normal">
                  {activeSprintQ.text}
                </h2>
              </div>

              {/* Option Buttons */}
              <div className="space-y-2.5">
                {activeSprintQ.options.map((opt, idx) => {
                  const letter = ['A', 'B', 'C', 'D'][idx];
                  const isCorrectAnswer =
                    letter === (activeSprintQ.correct_answer || '').toUpperCase() ||
                    idx === activeSprintQ.correctOptionIndex;
                  const isWrongPicked = sprintWrongPicked === idx;

                  let borderClass = 'border-border hover:border-accent bg-background text-main';
                  if (sprintGameOver) {
                    if (isCorrectAnswer) {
                      borderClass = 'border-accent bg-accent/15 text-main font-medium ring-1 ring-accent';
                    } else if (isWrongPicked) {
                      borderClass = 'border-rose-500 bg-rose-950/20 text-rose-300';
                    } else {
                      borderClass = 'border-border/40 bg-background/40 text-muted opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSprintAnswer(idx)}
                      disabled={sprintGameOver}
                      className={`w-full flex items-center justify-between p-4 min-h-[3rem] h-auto border rounded text-left text-sm transition-all cursor-pointer ${borderClass}`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-5 h-5 rounded-xs flex items-center justify-center text-xs font-semibold border border-border bg-hover text-muted shrink-0">
                          {letter}
                        </span>
                        <span className="break-words whitespace-normal leading-relaxed text-sm">
                          {opt}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-muted pl-3 shrink-0 hidden sm:inline tabular-nums">
                        {idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sudden Death Game Over & 60-Second Cooldown Penalty */}
              {sprintGameOver && (
                <div className="p-4 bg-background border border-rose-500/70 rounded-lg space-y-3 text-xs">
                  <div className="flex items-center justify-between text-rose-400">
                    <div className="flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Sprint Ended. Answer differed from verified key.</span>
                    </div>
                    <span className="font-mono tabular-nums">{sprintStreak} streak</span>
                  </div>

                  {activeSprintQ.extraNotes && (
                    <div className="p-3 bg-panel border border-border rounded text-main text-xs">
                      <span className="text-amber-400 font-sans font-medium text-[11px] block mb-1 uppercase tracking-wide">
                        Verification Note:
                      </span>
                      <p className="font-reading font-serif text-sm leading-relaxed text-main">
                        {activeSprintQ.extraNotes}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <div>
                      {cooldownSeconds > 0 ? (
                        <span className="text-amber-400 font-mono text-xs">
                          Cooldown: {cooldownSeconds}s lockout
                        </span>
                      ) : (
                        <span className="text-muted text-xs">Cooldown finished. Ready to retry.</span>
                      )}
                    </div>

                    <button
                      onClick={handleRestartSprint}
                      disabled={cooldownSeconds > 0}
                      style={{ background: 'var(--accent-gradient, var(--accent))' }}
                      className="px-4 py-1.5 disabled:opacity-30 text-black font-medium text-xs rounded transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
                    >
                      {cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s` : 'Try Again (Space)'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-14 text-center text-muted text-xs space-y-2">
              <CheckCircle2 className="w-7 h-7 text-muted mx-auto" />
              <div className="text-main font-medium text-sm">
                {sprintPlaylistScope === 'you' ? `No Verified Questions by ${activeUsername}` : 'No Verified Questions Yet'}
              </div>
              <p className="text-muted max-w-sm mx-auto">
                {sprintPlaylistScope === 'you'
                  ? `You haven't verified any questions yet in Solve mode. Switch to "All" to test across the full squad playlist.`
                  : 'Questions must be verified in Solve mode before they appear in the Sprint test key.'}
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                {sprintPlaylistScope === 'you' && (
                  <button
                    onClick={() => handleSelectPlaylistScope('all')}
                    className="px-3.5 py-1.5 bg-hover hover:opacity-90 text-main text-xs font-medium rounded cursor-pointer border border-border"
                  >
                    Switch to All
                  </button>
                )}
                <button
                  onClick={() => setInternalMode('solve')}
                  style={{ background: 'var(--accent-gradient, var(--accent))' }}
                  className="px-3.5 py-1.5 text-black text-xs font-medium rounded cursor-pointer shadow-xs hover:opacity-90"
                >
                  Go to Solve Mode
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
