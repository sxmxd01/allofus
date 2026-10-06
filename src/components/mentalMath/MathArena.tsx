import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MathSet, MathQuestion, PenaltyFlag, UserMathLog } from '../../types/mentalMath';
import {
  logMentalMathAttempt,
  updateGlobalMathAnalytics,
  getUserMentalMathStats,
  saveUserMentalMathStats,
} from '../../lib/dualSupabase';
import {
  getLevelMetadata,
  getLocalSetsForLevel,
  getParsedMentalMath,
} from '../../utils/parseMentalMath';
import { PostMortemReview } from './PostMortemReview';
import { sounds } from '../../utils/sound';
import { Zap, Award, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';

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
  // Curriculum Fatal Check on load
  const parsedData = getParsedMentalMath();
  const fatalError = parsedData.fatalError;

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

  // Synchronous State Machine Refs
  const currentQIndexRef = useRef(0);
  const currentSetRef = useRef<MathSet | undefined>(undefined);
  const isEvaluatingRef = useRef(false);

  useEffect(() => {
    currentQIndexRef.current = currentQIndex;
  }, [currentQIndex]);

  // 1. Load Sets for Level from hardcoded local content
  useEffect(() => {
    if (fatalError) return;

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
  }, [levelNumber, initialSetNumber, activeUsername, fatalError]);

  const currentSet: MathSet | undefined = sets[currentSetIndex];
  const currentQ: MathQuestion | undefined = currentSet?.questions[currentQIndex];

  useEffect(() => {
    if (sets[currentSetIndex]) {
      currentSetRef.current = sets[currentSetIndex];
    }
  }, [sets, currentSetIndex]);

  // 2. Countdown Timer Loop: Clean 1000ms integer updates (10, 9, 8...)
  const handleTimeout = useCallback(() => {
    if (isEvaluatingRef.current) return;
    isEvaluatingRef.current = true;

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

    // Halt immediately and go to Post-Mortem Review on the EXACT question
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

  // Keep input focused in Zen Mode
  useEffect(() => {
    if (screenState === 'playing') {
      inputRef.current?.focus();
    }
  }, [screenState, currentQIndex, currentSetIndex]);

  // 3. Answer Submission Logic: handles integers, decimals, and ratios (e.g. 7:3)
  const handleSubmitAnswer = () => {
    if (screenState !== 'playing') return;
    if (isEvaluatingRef.current) return;
    isEvaluatingRef.current = true;

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

    if (inputRef.current) inputRef.current.value = '';
    setInputValue('');

    const cleanUser = trimmedUser.replace(/\s+/g, '');
    const cleanExpected = expectedStr.replace(/\s+/g, '');

    let isCorrect = false;
    if (cleanExpected.includes(':')) {
      // Ratio answer comparison: exact colon structure match
      isCorrect = cleanUser === cleanExpected;
    } else {
      const userVal = parseFloat(cleanUser);
      const expectedVal = parseFloat(cleanExpected);
      isCorrect =
        cleanUser.length > 0 && !isNaN(userVal) && !isNaN(expectedVal)
          ? Math.abs(userVal - expectedVal) < 1e-6
          : cleanUser.length > 0 && cleanUser.toLowerCase() === cleanExpected.toLowerCase();
    }

    const timeSpentMs = Date.now() - questionStartTime;

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

      if (targetIdx < activeSet.questions.length - 1) {
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
        handleSetCompletedSuccessfully();
        isEvaluatingRef.current = false;
      }
    } else {
      // WRONG ANSWER: Halt immediately and go to Post-Mortem Review
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

    // WIN CONDITION: 2 Sets successfully completed advances to next level
    const WIN_CONDITION_SETS = 2;
    if (updatedPassed.length >= WIN_CONDITION_SETS) {
      currentLevelProgress.isCompleted = true;
      const nextLevel = levelNumber + 1;
      if (nextLevel <= 10) {
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

  // Keyboard navigation & Shortcuts across all screens
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global Escape to exit Zen
      if (e.key === 'Escape') {
        e.preventDefault();
        onExitZen();
        return;
      }

      // Enter key behavior across intermediate screens
      if (e.key === 'Enter') {
        if (screenState === 'set_passed') {
          e.preventDefault();
          handleProceedNextSet();
          return;
        }
        if (screenState === 'level_cleared') {
          e.preventDefault();
          handleAdvanceLevel();
          return;
        }
      }

      // Only process during 'playing' state
      if (screenState !== 'playing') {
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
  }, [screenState, onExitZen, sets, currentSetIndex, levelNumber]);

  // Advance to next set in sequence
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
    if (nextLevel <= 10) {
      setLevelNumber(nextLevel);
      if (onLevelAdvanced) onLevelAdvanced(nextLevel);
    } else {
      onExitZen();
    }
  };

  // Restart CURRENT set from question 1 upon failure
  const handleRetryCurrentSet = () => {
    sounds.playClick();
    const limit = levelNumber <= 5 ? 10 : 15;
    currentQIndexRef.current = 0;
    currentSetRef.current = sets[currentSetIndex];
    isEvaluatingRef.current = false;

    setCurrentQIndex(0);
    setInputValue('');
    if (inputRef.current) inputRef.current.value = '';
    setPenaltyFlag('none');
    setTimeLeft(limit);
    setMaxTimeAllowed(limit);
    setScreenState('playing');
    setQuestionStartTime(Date.now());
  };

  // 1. FATAL ERROR SCREEN: Abort and display fatal message if files missing or failed sanity check
  if (fatalError) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] text-[#f4f4f5] flex flex-col items-center justify-center p-6 text-center select-none font-mono">
        <div className="max-w-md w-full p-6 border border-rose-800 bg-[#09090b] space-y-4 rounded">
          <div className="flex items-center justify-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4" />
            <span>// FATAL CURRICULUM ERROR</span>
          </div>
          <h2 className="text-lg font-bold text-white">Curriculum Sanity Check Failed</h2>
          <pre className="text-xs text-neutral-400 font-mono leading-relaxed text-left bg-[#050505] p-3 border border-neutral-800 rounded whitespace-pre-wrap">
            {fatalError}
          </pre>
          <p className="text-[11px] text-neutral-500">
            src/data/level1-5.md is hand-authored. Auto-generating questions is forbidden.
          </p>
          <button
            onClick={onExitZen}
            className="w-full py-2 bg-[#121212] border border-neutral-700 text-xs text-white hover:border-neutral-500 transition-colors cursor-pointer font-mono rounded"
          >
            Exit Zen Mode (Esc)
          </button>
        </div>
      </div>
    );
  }

  // 2. POST-MORTEM SCREEN: On wrong answer, halt immediately and review
  if (screenState === 'post_mortem' && currentSet) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] text-[#f4f4f5] flex flex-col justify-center items-center overflow-y-auto p-4 select-none">
        <PostMortemReview
          levelNumber={levelNumber}
          failedSet={currentSet}
          failedQuestions={failedQuestions}
          onRetrySet={handleRetryCurrentSet}
          onExitZen={onExitZen}
          totalSetsInLevel={sets.length}
        />
      </div>
    );
  }

  // 3. WAITING FOR CONTENT SCREEN
  if (screenState === 'waiting_for_upload' || sets.length === 0 || !currentSet || !currentQ) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] text-[#f4f4f5] flex flex-col items-center justify-center p-6 text-center select-none font-mono">
        <div className="max-w-md w-full p-6 border border-neutral-800 bg-[#09090b] space-y-5 rounded">
          <span className="text-neutral-500 font-bold text-xs uppercase tracking-widest block font-mono">
            // LEVEL {levelNumber}
          </span>
          <h2 className="text-xl font-bold text-white">No questions available for Level {levelNumber}</h2>
          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Curriculum content for this level has not been loaded.
          </p>
          <button
            onClick={onExitZen}
            className="w-full py-2 bg-[#121212] border border-neutral-700 text-xs text-white hover:border-neutral-500 transition-colors cursor-pointer font-mono rounded"
          >
            Exit Zen Mode (Esc)
          </button>
        </div>
      </div>
    );
  }

  // 4. INTERMEDIATE SET PASSED SCREEN
  if (screenState === 'set_passed' && currentSet) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] text-[#f4f4f5] flex flex-col items-center justify-center p-6 text-center select-none font-mono">
        <div className="max-w-md w-full p-6 border border-emerald-600/80 bg-[#09090b] space-y-5 rounded">
          <div className="w-10 h-10 rounded bg-[#121212] border border-emerald-600 flex items-center justify-center mx-auto text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>

          <div>
            <span className="text-xs uppercase text-emerald-400 tracking-widest block mb-1">
              SET {currentSet.setNumber} CLEARED
            </span>
            <h2 className="text-xl font-bold text-white">Set Cleared</h2>
          </div>

          <div className="p-2.5 bg-[#121212] border border-neutral-800 rounded text-xs text-neutral-400 flex items-center justify-between">
            <span>Level {levelNumber} Progress:</span>
            <span className="text-emerald-400 font-bold">
              {passedSetsThisLevel.length} / 2 Sets Won
            </span>
          </div>

          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Solid work. 1 more clean set to unlock Level {levelNumber + 1}.
          </p>

          <button
            onClick={handleProceedNextSet}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer rounded"
          >
            <span>Proceed to Next Set (Enter)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 5. LEVEL CLEARED SCREEN
  if (screenState === 'level_cleared') {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] text-[#f4f4f5] flex flex-col items-center justify-center p-6 text-center select-none font-mono">
        <div className="max-w-md w-full p-6 border border-emerald-500 bg-[#09090b] space-y-5 rounded">
          <div className="w-12 h-12 rounded bg-[#121212] border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
            <Award className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs uppercase text-emerald-400 tracking-widest block mb-1">
              LEVEL {levelNumber} COMPLETED
            </span>
            <h2 className="text-2xl font-bold text-white">Level {levelNumber + 1} Unlocked</h2>
          </div>

          <p className="text-xs text-neutral-400 font-sans leading-relaxed">
            Two clean sets in the bag. You're ready for Level {levelNumber + 1}.
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={handleAdvanceLevel}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer rounded"
            >
              <span>Advance to Level {levelNumber + 1} (Enter)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExitZen}
              className="w-full py-2 text-neutral-400 hover:text-white bg-[#121212] border border-neutral-800 text-xs font-mono transition-colors cursor-pointer rounded"
            >
              Exit to Dashboard (Esc)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 6. MAIN PLAYING ARENA
  const currentSetNum = currentSet?.setNumber || 1;
  const currentQNum = currentQIndex + 1;
  const totalQInSet = currentSet?.questions.length || 6;
  const currentLevelMeta = getLevelMetadata(levelNumber);

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="fixed inset-0 z-50 bg-[#050505] text-[#f4f4f5] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden font-mono cursor-default"
    >
      {/* Top Header */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-neutral-800 pb-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="px-2 py-0.5 rounded bg-[#121212] border border-neutral-800 font-bold tracking-wider text-emerald-400 text-xs">
            LVL {levelNumber.toString().padStart(2, '0')}
          </div>
          <div className="text-neutral-400 font-medium">
            SET {currentSetNum.toString().padStart(2, '0')} · Q {currentQNum}/{totalQInSet}
          </div>
          <span className="text-neutral-700 hidden sm:inline">|</span>
          <div className="text-neutral-500 text-[11px] hidden sm:inline">
            Target: 2 Sets to Advance ({passedSetsThisLevel.length}/2)
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
              timeLeft <= (maxTimeAllowed <= 10 ? 3 : 4)
                ? 'text-rose-500 animate-pulse'
                : timeLeft <= (maxTimeAllowed <= 10 ? 5 : 7)
                ? 'text-amber-400'
                : 'text-neutral-300'
            }`}
          >
            {timeLeft}s
          </span>

          <button
            onClick={onExitZen}
            className="text-neutral-500 hover:text-white text-xs px-2 py-1 rounded bg-[#121212] border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
            title="Exit Zen Mode (Esc)"
          >
            Esc
          </button>
        </div>
      </header>

      {/* Timer Bar */}
      <div className="w-full max-w-4xl mx-auto -mt-4 mb-auto">
        <div className="w-full h-1 bg-neutral-900 overflow-hidden">
          <div
            className={`h-full ${
              timeLeft <= (maxTimeAllowed <= 10 ? 3 : 4)
                ? 'bg-rose-500'
                : timeLeft <= (maxTimeAllowed <= 10 ? 5 : 7)
                ? 'bg-amber-400'
                : 'bg-emerald-500'
            }`}
            style={{
              width: `${Math.max(0, Math.min(100, (timeLeft / maxTimeAllowed) * 100))}%`,
              transition: 'width 1s linear',
            }}
          />
        </div>
      </div>

      {/* Main Center Prompt */}
      <main className="my-auto w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
        <span className="text-[11px] tracking-widest uppercase text-neutral-500 font-semibold font-mono">
          {currentLevelMeta.category}
        </span>

        {/* Large Math Prompt */}
        <div className="text-5xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight text-white select-none py-2">
          {currentQ?.expression || '...'}
        </div>

        {/* Auto-Focused Number Entry (supports numbers, decimals, and colons for ratios) */}
        <div className="w-full max-w-sm relative">
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            pattern="[0-9.:-]*"
            autoFocus
            value={inputValue}
            onChange={(e) => {
              // Allow numbers, negative sign, decimal, and ratio colons
              const val = e.target.value.replace(/[^0-9.:-]/g, '');
              setInputValue(val);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmitAnswer();
              }
            }}
            placeholder="Type answer..."
            className="w-full py-3.5 px-4 text-center text-3xl sm:text-4xl font-mono font-bold text-white bg-transparent border-b-2 border-neutral-700 focus:border-emerald-500 focus:outline-none transition-colors placeholder:text-neutral-700 placeholder:text-2xl placeholder:font-normal"
          />

          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400 text-2xl animate-pulse font-mono">
            ▌
          </span>
        </div>

        {/* Toast for time extensions */}
        {addedSecondsToast && (
          <div
            className={`text-xs px-2.5 py-1 rounded font-mono font-medium ${
              addedSecondsToast.penalty === 'zero'
                ? 'bg-rose-950/60 border border-rose-600 text-rose-300'
                : 'bg-amber-950/60 border border-amber-600 text-amber-300'
            }`}
          >
            {addedSecondsToast.text}
          </div>
        )}
      </main>

      {/* Keyboard HUD */}
      <footer className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800 text-[11px] text-neutral-500">
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono">
            Enter
          </kbd>
          <span>Submit</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-400 font-mono">
              t
            </kbd>
            <span>+5s</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-rose-400 font-mono">
              Shift+T
            </kbd>
            <span>+10s</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
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

