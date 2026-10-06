import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MathSet, MathQuestion, PenaltyFlag, UserMathLog } from '../../types/mentalMath';
import {
  logMentalMathAttempt,
  updateGlobalMathAnalytics,
  getUserMentalMathStats,
  saveUserMentalMathStats,
} from '../../lib/dualSupabase';
import { getLevelMetadata } from '../../utils/mentalMathParser';
import { getLocalSetsForLevel, getParsedMentalMath } from '../../utils/parseMentalMath';
import { PostMortemReview } from './PostMortemReview';
import { sounds } from '../../utils/sound';
import { Zap, Award, Flame, ArrowRight, RotateCcw, Volume2, VolumeX, Upload } from 'lucide-react';

interface MathArenaProps {
  levelNumber: number;
  initialSetNumber?: number;
  activeUsername: string;
  onExitZen: () => void;
  onLevelAdvanced?: (newLevel: number) => void;
}

type ArenaScreenState = 'playing' | 'post_mortem' | 'set_passed' | 'level_cleared' | 'waiting_for_upload';

interface FailedQuestionRecord {
  question: MathQuestion;
  userAnswer: string;
  isTimeout?: boolean;
}

export const MathArena: React.FC<MathArenaProps> = ({
  levelNumber: initialLevelNumber,
  initialSetNumber = 1,
  activeUsername,
  onExitZen,
  onLevelAdvanced,
}) => {
  const [levelNumber, setLevelNumber] = useState(initialLevelNumber);
  const [sets, setSets] = useState<MathSet[]>([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [penaltyFlag, setPenaltyFlag] = useState<PenaltyFlag>('none');
  const [addedSecondsToast, setAddedSecondsToast] = useState<{ text: string; penalty: PenaltyFlag } | null>(null);

  // Screen State
  const [screenState, setScreenState] = useState<ArenaScreenState>('playing');
  const [failedQuestions, setFailedQuestions] = useState<FailedQuestionRecord[]>([]);

  // Dynamic Limits: 10s for Level 1-5, 15s for Level 6-10
  const defaultLimit = levelNumber <= 5 ? 10 : 15;
  const [timeLeft, setTimeLeft] = useState<number>(defaultLimit);
  const [maxTimeAllowed, setMaxTimeAllowed] = useState<number>(defaultLimit);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Level Progression: 2 wins needed to advance
  const [passedSetsThisLevel, setPassedSetsThisLevel] = useState<number[]>([]);

  // Total answers & speed tracking for this session
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [sessionTotalTimeMs, setSessionTotalTimeMs] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<any>(null);

  // Synchronous State Machine Refs to completely eliminate off-by-one race conditions
  const currentQIndexRef = useRef(0);
  const currentSetRef = useRef<MathSet | undefined>(undefined);
  const isEvaluatingRef = useRef(false);

  // Keep refs synchronized with active state
  useEffect(() => {
    currentQIndexRef.current = currentQIndex;
  }, [currentQIndex]);

  // 1. Load Sets for Level from hardcoded local content
  useEffect(() => {
    const availableSets = getLocalSetsForLevel(levelNumber);

    if (!availableSets || availableSets.length === 0) {
      setSets([]);
      currentSetRef.current = undefined;
      setScreenState('waiting_for_upload');
      return;
    }

    setSets(availableSets);

    // Check user's saved progress for this level
    const stats = getUserMentalMathStats(activeUsername);
    const passed = stats.levelProgress[levelNumber]?.passedSets || [];
    setPassedSetsThisLevel(passed);

    // Find exact set matching initialSetNumber or first unpassed set
    let startIdx = 0;
    const found = availableSets.findIndex((s) => s.setNumber === initialSetNumber);
    if (found !== -1) {
      startIdx = found;
    } else {
      startIdx = Math.min(Math.max(0, initialSetNumber - 1), Math.max(0, availableSets.length - 1));
    }

    const limit = levelNumber <= 5 ? 10 : 15;
    currentSetRef.current = availableSets[startIdx];
    currentQIndexRef.current = 0;
    isEvaluatingRef.current = false;

    setCurrentSetIndex(startIdx);
    setCurrentQIndex(0);
    setInputValue('');
    if (inputRef.current) inputRef.current.value = '';
    setPenaltyFlag('none');
    setTimeLeft(limit);
    setMaxTimeAllowed(limit);
    setScreenState('playing');
    setQuestionStartTime(Date.now());
  }, [levelNumber, initialSetNumber, activeUsername]);

  const currentSet: MathSet | undefined = sets[currentSetIndex];
  const currentQ: MathQuestion | undefined = currentSet?.questions[currentQIndex];

  // Keep currentSetRef in sync whenever sets or currentSetIndex changes
  useEffect(() => {
    if (sets[currentSetIndex]) {
      currentSetRef.current = sets[currentSetIndex];
    }
  }, [sets, currentSetIndex]);

  // 2. Countdown Timer Loop: Clean 1000ms integer updates (10, 9, 8...)
  const handleTimeout = useCallback(() => {
    if (isEvaluatingRef.current) return;
    isEvaluatingRef.current = true;

    // Capture the EXACT question index and question synchronously
    const targetIdx = currentQIndexRef.current;
    const activeSet = currentSetRef.current;
    const targetQ = activeSet?.questions[targetIdx];

    if (!targetQ || !activeSet) {
      isEvaluatingRef.current = false;
      return;
    }

    const rawInput = inputRef.current ? inputRef.current.value : inputValue;
    const trimmedUser = rawInput.trim();

    sounds.playIncorrect();
    const timeSpent = Date.now() - questionStartTime;

    // Clear input field synchronously
    if (inputRef.current) inputRef.current.value = '';
    setInputValue('');

    const logItem: UserMathLog = {
      id: crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}`,
      userName: activeUsername,
      level: levelNumber,
      setNumber: activeSet.setNumber,
      questionId: targetQ.id,
      mathPrompt: targetQ.expression,
      userAnswer: trimmedUser || 'TIMEOUT',
      correctAnswer: targetQ.answer,
      isCorrect: false,
      timeSpentMs: timeSpent,
      timeLimitSec: Math.round(maxTimeAllowed),
      penaltyFlag,
      setStatus: 'failed',
      createdAt: new Date().toISOString(),
    };
    logMentalMathAttempt(logItem);

    // Drop immediately into Post-Mortem Review on the EXACT question
    setFailedQuestions([
      {
        question: targetQ,
        userAnswer: trimmedUser || 'TIMEOUT',
        isTimeout: true,
      },
    ]);
    setScreenState('post_mortem');
    isEvaluatingRef.current = false;
  }, [activeUsername, levelNumber, inputValue, questionStartTime, maxTimeAllowed, penaltyFlag]);

  useEffect(() => {
    if (screenState !== 'playing' || !currentQ) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    // Clean 1-second interval to eliminate main thread chop
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [screenState, currentQIndex, currentSetIndex, handleTimeout, currentQ]);

  // Keep input focused at all times in Zen Mode
  useEffect(() => {
    if (screenState === 'playing') {
      inputRef.current?.focus();
    }
  }, [screenState, currentQIndex, currentSetIndex]);

  // 3. User Answer Submission Logic
  // Synchronous State Machine: Grades input against the EXACT question index currently visible
  const handleSubmitAnswer = () => {
    if (screenState !== 'playing') return;
    if (isEvaluatingRef.current) return; // Prevent double-triggering
    isEvaluatingRef.current = true;

    // Capture index and question synchronously
    const targetIdx = currentQIndexRef.current;
    const activeSet = currentSetRef.current;
    const targetQ = activeSet?.questions[targetIdx];

    if (!targetQ || !activeSet) {
      isEvaluatingRef.current = false;
      return;
    }

    const rawInput = inputRef.current ? inputRef.current.value : inputValue;
    const trimmedUser = rawInput.trim();
    const expectedStr = targetQ.answer.trim();

    // Clear input field immediately
    if (inputRef.current) inputRef.current.value = '';
    setInputValue('');

    // Parse both to floats to prevent trailing spaces or format discrepancies
    const userVal = parseFloat(trimmedUser);
    const expectedVal = parseFloat(expectedStr);

    const isCorrect =
      trimmedUser.length > 0 && !isNaN(userVal) && !isNaN(expectedVal)
        ? Math.abs(userVal - expectedVal) < 1e-6
        : trimmedUser.length > 0 && trimmedUser.toLowerCase() === expectedStr.toLowerCase();

    const timeSpentMs = Date.now() - questionStartTime;

    // Log to Client A
    const logItem: UserMathLog = {
      id: crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}`,
      userName: activeUsername,
      level: levelNumber,
      setNumber: activeSet.setNumber,
      questionId: targetQ.id,
      mathPrompt: targetQ.expression,
      userAnswer: trimmedUser || 'EMPTY',
      correctAnswer: expectedStr,
      isCorrect,
      timeSpentMs,
      timeLimitSec: Math.round(maxTimeAllowed),
      penaltyFlag,
      setStatus: isCorrect ? 'passed' : 'failed',
      createdAt: new Date().toISOString(),
    };
    logMentalMathAttempt(logItem);

    if (isCorrect) {
      sounds.playCorrect();
      setSessionCorrectCount((c) => c + 1);
      setSessionTotalTimeMs((t) => t + timeSpentMs);

      // Check if more questions remain in this set
      if (targetIdx < activeSet.questions.length - 1) {
        // ONLY increment index AFTER evaluation is fully resolved
        const nextIdx = targetIdx + 1;
        currentQIndexRef.current = nextIdx;
        setCurrentQIndex(nextIdx);

        const limit = levelNumber <= 5 ? 10 : 15;
        setPenaltyFlag('none');
        setTimeLeft(limit);
        setMaxTimeAllowed(limit);
        setQuestionStartTime(Date.now());
        isEvaluatingRef.current = false;
      } else {
        // Last question cleared successfully: Mark Set as "Cleared"
        handleSetCompletedSuccessfully();
        isEvaluatingRef.current = false;
      }
    } else {
      // INCORRECT ANSWER: HALT progression immediately!
      // Grade on the EXACT question they were looking at, do NOT increment index.
      sounds.playIncorrect();

      setFailedQuestions([
        {
          question: targetQ,
          userAnswer: trimmedUser || 'WRONG',
          isTimeout: false,
        },
      ]);
      setScreenState('post_mortem');
      isEvaluatingRef.current = false;
    }
  };

  // 4. Set Success & Progression State Machine
  const handleSetCompletedSuccessfully = () => {
    if (!currentSet) return;

    sounds.playCorrect();
    const updatedPassed = Array.from(new Set([...passedSetsThisLevel, currentSet.setNumber]));
    setPassedSetsThisLevel(updatedPassed);

    // Update user stats
    const stats = getUserMentalMathStats(activeUsername);
    const updatedStats = { ...stats };
    updatedStats.totalSetsCompleted += 1;
    updatedStats.totalQuestionsAnswered += currentSet.questions.length;
    updatedStats.totalQuestionsCorrect += currentSet.questions.length;

    const currentLevelProgress = updatedStats.levelProgress[levelNumber] || {
      passedSets: [],
      isUnlocked: true,
      isCompleted: false,
    };
    currentLevelProgress.passedSets = updatedPassed;

    // WIN CONDITION: 2 Sets successfully completed advances to next level!
    const WIN_CONDITION_SETS = 2;
    if (updatedPassed.length >= WIN_CONDITION_SETS) {
      currentLevelProgress.isCompleted = true;
      const nextLevel = levelNumber + 1;
      if (nextLevel <= 100) {
        updatedStats.unlockedLevel = Math.max(updatedStats.unlockedLevel, nextLevel);
        if (!updatedStats.levelProgress[nextLevel]) {
          updatedStats.levelProgress[nextLevel] = {
            passedSets: [],
            isUnlocked: true,
            isCompleted: false,
          };
        }
      }
      updatedStats.levelProgress[levelNumber] = currentLevelProgress;
      saveUserMentalMathStats(activeUsername, updatedStats);

      // Call Global Analytics RPC
      updateGlobalMathAnalytics(
        activeUsername,
        levelNumber,
        currentSet.setNumber,
        true,
        sessionTotalTimeMs / Math.max(1, sessionCorrectCount)
      );

      setScreenState('level_cleared');
    } else {
      updatedStats.levelProgress[levelNumber] = currentLevelProgress;
      saveUserMentalMathStats(activeUsername, updatedStats);

      // Call Global Analytics RPC
      updateGlobalMathAnalytics(
        activeUsername,
        levelNumber,
        currentSet.setNumber,
        true,
        sessionTotalTimeMs / Math.max(1, sessionCorrectCount)
      );

      setScreenState('set_passed');
    }
  };

  // 5. Keyboard Handling: 't' (+5s, reduced points), 'Shift+T' (+10s, zero points), 'Enter' (submit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // In post-mortem or victory state, let their internal listeners handle keys
      if (screenState !== 'playing') {
        return;
      }

      // Escape to exit Zen Mode
      if (e.key === 'Escape') {
        e.preventDefault();
        onExitZen();
        return;
      }

      // Shift+T -> +10s (penalty = zero points)
      if (e.shiftKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        sounds.playClick();
        setTimeLeft((prev) => prev + 10);
        setMaxTimeAllowed((prev) => prev + 10);
        setPenaltyFlag('zero');
        setAddedSecondsToast({ text: '+10s (Zero Points Penalty)', penalty: 'zero' });
        setTimeout(() => setAddedSecondsToast(null), 1800);
        return;
      }

      // 't' alone -> +5s (penalty = reduced points)
      if (!e.shiftKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        sounds.playClick();
        setTimeLeft((prev) => prev + 5);
        setMaxTimeAllowed((prev) => prev + 5);
        setPenaltyFlag((prev) => (prev === 'zero' ? 'zero' : 'reduced'));
        setAddedSecondsToast({ text: '+5s (Reduced Points Flagged)', penalty: 'reduced' });
        setTimeout(() => setAddedSecondsToast(null), 1800);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screenState, onExitZen]);

  // Advance to next set after set is cleared
  const handleProceedNextSet = () => {
    sounds.playClick();
    const nextSetIdx = (currentSetIndex + 1) % Math.max(1, sets.length);
    const limit = levelNumber <= 5 ? 10 : 15;
    currentQIndexRef.current = 0;
    currentSetRef.current = sets[nextSetIdx];
    isEvaluatingRef.current = false;

    setCurrentSetIndex(nextSetIdx);
    setCurrentQIndex(0);
    setInputValue('');
    if (inputRef.current) inputRef.current.value = '';
    setPenaltyFlag('none');
    setTimeLeft(limit);
    setMaxTimeAllowed(limit);
    setScreenState('playing');
    setQuestionStartTime(Date.now());
  };

  const handleAdvanceLevel = () => {
    sounds.playCorrect();
    const nextLevel = levelNumber + 1;
    if (nextLevel <= 100) {
      setLevelNumber(nextLevel);
      if (onLevelAdvanced) onLevelAdvanced(nextLevel);
    } else {
      onExitZen();
    }
  };

  // Reattempt a DIFFERENT set in that level upon failure: do not let them proceed until they pass
  const handleRetryDifferentSet = () => {
    sounds.playClick();
    const nextSetIdx = sets.length > 1
      ? (currentSetIndex + 1) % sets.length
      : currentSetIndex;

    const limit = levelNumber <= 5 ? 10 : 15;
    currentQIndexRef.current = 0;
    currentSetRef.current = sets[nextSetIdx];
    isEvaluatingRef.current = false;

    setCurrentSetIndex(nextSetIdx);
    setCurrentQIndex(0);
    setInputValue('');
    if (inputRef.current) inputRef.current.value = '';
    setPenaltyFlag('none');
    setTimeLeft(limit);
    setMaxTimeAllowed(limit);
    setScreenState('playing');
    setQuestionStartTime(Date.now());
  };

  // RENDER FAILURE STATE: POST-MORTEM COMPONENT
  if (screenState === 'post_mortem' && currentSet) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] text-[#f4f4f5] flex flex-col justify-center items-center overflow-y-auto p-4 select-none">
        <PostMortemReview
          levelNumber={levelNumber}
          failedSet={currentSet}
          failedQuestions={failedQuestions}
          onRetrySet={handleRetryDifferentSet}
          onReattemptNextSet={handleRetryDifferentSet}
          onExitZen={onExitZen}
          totalSetsInLevel={sets.length}
        />
      </div>
    );
  }

  // RENDER FATAL ERROR (If local curriculum markdown files missing or corrupted)
  if (getParsedMentalMath().fatalError) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] text-[#f4f4f5] flex flex-col items-center justify-center p-6 text-center select-none font-mono">
        <div className="max-w-md w-full p-8 border border-rose-800 rounded-2xl bg-[#09090b] space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
          <span className="text-rose-500 font-bold text-xs uppercase tracking-widest block">// FATAL DATA ERROR</span>
          <h2 className="text-xl font-bold text-white">Local Curriculum Files Missing</h2>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            {getParsedMentalMath().fatalError}
          </p>
          <button
            onClick={onExitZen}
            className="w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Exit Zen Mode (Esc)
          </button>
        </div>
      </div>
    );
  }

  // RENDER WAITING FOR UPLOAD (When no questions uploaded for this level)
  if (screenState === 'waiting_for_upload' || sets.length === 0 || !currentSet || !currentQ) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] text-[#f4f4f5] flex flex-col items-center justify-center p-6 text-center select-none font-mono">
        <div className="max-w-md w-full p-8 border border-neutral-800 rounded-2xl bg-[#09090b] space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center mx-auto text-neutral-400">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Waiting for upload</h2>
            <p className="text-xs text-neutral-400 font-sans mt-2 leading-relaxed">
              No questions found for Level {levelNumber}. Upload a file with questions to begin.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={onExitZen}
              style={{
                backgroundColor: 'var(--accent)',
                backgroundImage: 'var(--accent-gradient)',
                color: 'var(--accent-text, #050505)',
              }}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:opacity-90 active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Back to Upload</span>
            </button>

            <button
              onClick={onExitZen}
              className="w-full py-2.5 rounded-xl text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 text-xs font-mono transition-colors cursor-pointer"
            >
              Exit Zen Mode (Esc)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER INTERMEDIATE SET PASSED
  if (screenState === 'set_passed' && currentSet) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] text-[#f4f4f5] flex flex-col items-center justify-center p-6 text-center select-none font-mono">
        <div className="max-w-md w-full p-8 border border-emerald-500/80 rounded-2xl bg-[#09090b] space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
            <Zap className="w-7 h-7 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs uppercase text-emerald-400 tracking-widest block mb-1">
              SET {currentSet.setNumber} CLEARED
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Set Velocity Passed!</h2>
          </div>

          <div className="p-3 bg-[#121215] border border-neutral-800 rounded-lg text-xs text-muted flex items-center justify-between">
            <span>Level {levelNumber} Progress:</span>
            <span className="text-emerald-400 font-bold">
              {passedSetsThisLevel.length} / 2 Sets Won
            </span>
          </div>

          <p className="text-xs text-muted font-sans leading-relaxed">
            Need <strong>1 more set</strong> to unlock Level {levelNumber + 1}. Keep your neural focus intact.
          </p>

          <button
            onClick={handleProceedNextSet}
            style={{
              backgroundColor: 'var(--accent)',
              backgroundImage: 'var(--accent-gradient)',
              color: 'var(--accent-text, #050505)',
            }}
            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:opacity-90 active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Next Set (Enter)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // RENDER LEVEL CLEARED (WIN CONDITION ADVANCE)
  if (screenState === 'level_cleared') {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] text-[#f4f4f5] flex flex-col items-center justify-center p-6 text-center select-none font-mono">
        <div className="max-w-md w-full p-8 border border-accent rounded-2xl bg-[#09090b] space-y-6 shadow-[0_0_50px_rgba(34,197,94,0.2)] animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-accent/15 border-2 border-accent flex items-center justify-center mx-auto text-accent">
            <Award className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs uppercase text-accent tracking-widest block mb-1">
              LEVEL {levelNumber} COMPLETED
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Level Unlocked!</h2>
          </div>

          <p className="text-xs text-muted font-sans leading-relaxed">
            You successfully completed 2 Sets within the time threshold. Level {levelNumber + 1} is now accessible in
            your Mental Math training matrix.
          </p>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={handleAdvanceLevel}
              style={{
                backgroundColor: 'var(--accent)',
                backgroundImage: 'var(--accent-gradient)',
                color: 'var(--accent-text, #050505)',
              }}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:opacity-90 active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Advance to Level {levelNumber + 1} (Enter)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExitZen}
              className="w-full py-2.5 rounded-xl text-muted hover:text-white bg-neutral-900 border border-neutral-800 text-xs font-mono transition-colors cursor-pointer"
            >
              Exit to Level Dashboard (Esc)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 1. ZEN MODE: THE ZEN-MODE MATH ARENA
  // Aggressively hides global navigation, sidebar, and header.
  // Display only: Level/Set indicator, timer, math prompt, auto-focused cursor.
  // ========================================================
  const currentSetNum = currentSet?.setNumber || 1;
  const currentQNum = currentQIndex + 1;
  const totalQInSet = currentSet?.questions.length || 6;
  const currentLevelMeta = getLevelMetadata(levelNumber);

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="fixed inset-0 z-50 bg-[#050505] text-[#f4f4f5] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden font-mono cursor-default"
    >
      {/* ======================================================== */}
      {/* 1. TOP ROW: Level / Set Indicator & Countdown Timer      */}
      {/* ======================================================== */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-neutral-800/80 pb-4 text-xs">
        {/* Left: Level & Set Indicator */}
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded bg-[#121215] border border-neutral-700/80 font-bold tracking-wider text-accent text-xs">
            LVL {levelNumber.toString().padStart(2, '0')}
          </div>
          <div className="text-neutral-400 font-medium">
            SET {currentSetNum.toString().padStart(2, '0')} · Q {currentQNum}/{totalQInSet}
          </div>
          <span className="text-neutral-600 hidden sm:inline">|</span>
          <div className="text-neutral-500 text-[11px] hidden sm:inline">
            Target: 2 Wins to Advance ({passedSetsThisLevel.length}/2)
          </div>
        </div>

        {/* Right: Digital Countdown Timer */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span
              className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
                timeLeft <= (maxTimeAllowed <= 10 ? 3 : 4)
                  ? 'text-rose-500 animate-pulse font-extrabold'
                  : timeLeft <= (maxTimeAllowed <= 10 ? 5 : 7)
                  ? 'text-amber-400'
                  : 'text-sky-400'
              }`}
            >
              {timeLeft}s
            </span>
          </div>

          <button
            onClick={onExitZen}
            className="text-neutral-500 hover:text-neutral-200 text-xs px-2 py-1 rounded hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors cursor-pointer"
            title="Exit Zen Mode (Esc)"
          >
            Esc
          </button>
        </div>
      </header>

      {/* Subtle Smooth Timer Bar: Hardware-accelerated CSS transition */}
      <div className="w-full max-w-4xl mx-auto -mt-4 mb-auto">
        <div className="w-full h-1 bg-neutral-900 overflow-hidden">
          <div
            className={`h-full ${
              timeLeft <= (maxTimeAllowed <= 10 ? 3 : 4)
                ? 'bg-rose-500'
                : timeLeft <= (maxTimeAllowed <= 10 ? 5 : 7)
                ? 'bg-amber-400'
                : 'bg-sky-400'
            }`}
            style={{
              width: `${Math.max(0, Math.min(100, (timeLeft / maxTimeAllowed) * 100))}%`,
              transition: 'width 1s linear',
            }}
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CENTER: The Math Prompt & Auto-Focused Number Entry   */}
      {/* ======================================================== */}
      <main className="my-auto w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
        {/* Subtle Category Tag */}
        <span className="text-[11px] tracking-widest uppercase text-neutral-500 font-semibold">
          {currentLevelMeta.category}
        </span>

        {/* Large Math Prompt */}
        <div className="text-5xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight text-white select-none py-2">
          {currentQ?.expression || 'Loading...'}
        </div>

        {/* Auto-Focused Blinking Terminal Number Entry */}
        <div className="w-full max-w-sm relative">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9.-]*"
            autoFocus
            value={inputValue}
            onChange={(e) => {
              // Allow numbers, negative sign, decimal
              const val = e.target.value.replace(/[^0-9.-]/g, '');
              setInputValue(val);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmitAnswer();
              } else if (e.shiftKey && (e.key === 'T' || e.key === 't')) {
                e.preventDefault();
                sounds.playClick();
                setTimeLeft((prev) => prev + 10);
                setMaxTimeAllowed((prev) => prev + 10);
                setPenaltyFlag('zero');
                setAddedSecondsToast({ text: '+10s (Zero Points Penalty)', penalty: 'zero' });
                setTimeout(() => setAddedSecondsToast(null), 1800);
              } else if (!e.shiftKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                sounds.playClick();
                setTimeLeft((prev) => prev + 5);
                setMaxTimeAllowed((prev) => prev + 5);
                setPenaltyFlag((prev) => (prev === 'zero' ? 'zero' : 'reduced'));
                setAddedSecondsToast({ text: '+5s (Reduced Points Flagged)', penalty: 'reduced' });
                setTimeout(() => setAddedSecondsToast(null), 1800);
              }
            }}
            placeholder="Type answer..."
            className="w-full py-3.5 px-4 text-center text-3xl sm:text-4xl font-mono font-bold text-white bg-transparent border-b-2 border-neutral-700 focus:border-accent focus:outline-none transition-colors placeholder:text-neutral-700 placeholder:text-2xl placeholder:font-normal"
          />

          {/* Terminal Block Blinking Indicator */}
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-accent text-2xl animate-pulse font-mono">
            ▌
          </span>
        </div>

        {/* Dynamic Toast / Feedback for 't' and 'Shift+T' */}
        {addedSecondsToast && (
          <div
            className={`text-xs px-3 py-1 rounded-full font-mono font-medium animate-in fade-in duration-150 ${
              addedSecondsToast.penalty === 'zero'
                ? 'bg-rose-950/60 border border-rose-500 text-rose-300'
                : 'bg-amber-950/60 border border-amber-500 text-amber-300'
            }`}
          >
            {addedSecondsToast.text}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* 3. BOTTOM: Minimalist Keyboard Shortcut HUD              */}
      {/* ======================================================== */}
      <footer className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500">
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
            Enter
          </kbd>
          <span>Submit</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-400">
              t
            </kbd>
            <span>+5s (-pts)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-rose-400">
              Shift+T
            </kbd>
            <span>+10s (0pts)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
              Esc
            </kbd>
            <span>Exit</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MathArena;
