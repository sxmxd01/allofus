import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SprintQuestion } from '../types';
import {
  Flame,
  Zap,
  RotateCcw,
  Trophy,
  Play,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { fetchSprintQuestions, recordUserAttempt } from '../lib/clatService';

interface ArcadeSprintProps {
  activeUsername: string;
  onCorrectAnswer: () => void;
}

export const ArcadeSprint: React.FC<ArcadeSprintProps> = ({
  activeUsername,
  onCorrectAnswer,
}) => {
  const [questions, setQuestions] = useState<SprintQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Arcade Speed Run State
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Sudden Death Timer (10 seconds)
  const TIMER_MAX = 10;
  const [timeLeft, setTimeLeft] = useState(TIMER_MAX);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState<'wrong' | 'timeout' | null>(null);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [wrongSelection, setWrongSelection] = useState<number | null>(null);

  const timerRef = useRef<any>(null);

  // Load questions
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      const qs = await fetchSprintQuestions();
      if (isMounted) {
        // Shuffle questions for fresh arcade experience
        const shuffled = [...qs].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentQ: SprintQuestion | undefined =
    questions.length > 0 ? questions[currentIndex % questions.length] : undefined;

  // Sudden-death timer loop
  useEffect(() => {
    if (isLoading || isGameOver || !currentQ) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timeout = Sudden Death Game Over
          handleGameOver('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading, isGameOver, currentQ, currentIndex]);

  const handleGameOver = (reason: 'wrong' | 'timeout') => {
    if (timerRef.current) clearInterval(timerRef.current);
    sounds.playIncorrect();
    setGameOverReason(reason);
    setIsGameOver(true);

    if (streak > bestStreak) setBestStreak(streak);
    if (score > bestScore) setBestScore(score);
  };

  const handleRestart = useCallback(() => {
    sounds.playClick();
    setStreak(0);
    setScore(0);
    setTimeLeft(TIMER_MAX);
    setIsGameOver(false);
    setGameOverReason(null);
    setLastFeedback(null);
    setWrongSelection(null);
    setQuestionsAnswered(0);
    // Shuffle and pick new start
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, questions.length));
  }, [questions.length]);

  const handleAnswer = useCallback(
    async (idx: number) => {
      if (!currentQ || isGameOver) return;

      const isCorrect = idx === currentQ.correctOptionIndex;
      const optLetter = ['A', 'B', 'C', 'D'][idx] || String(idx + 1);

      // Record to Supabase
      recordUserAttempt(activeUsername, currentQ.id, optLetter, isCorrect);

      if (isCorrect) {
        sounds.playCorrect();
        onCorrectAnswer();
        setLastFeedback('correct');

        const nextStreak = streak + 1;
        const pointsAdded = 100 + nextStreak * 25;
        const nextScore = score + pointsAdded;

        setStreak(nextStreak);
        setScore(nextScore);
        if (nextStreak > bestStreak) setBestStreak(nextStreak);
        if (nextScore > bestScore) setBestScore(nextScore);

        setQuestionsAnswered((prev) => prev + 1);

        // Reset 10s timer and advance immediately
        setTimeLeft(TIMER_MAX);
        setCurrentIndex((prev) => (prev + 1) % questions.length);

        setTimeout(() => setLastFeedback(null), 400);
      } else {
        // Sudden death! Answering incorrectly ends sprint
        setWrongSelection(idx);
        setLastFeedback('wrong');
        handleGameOver('wrong');
      }
    },
    [
      currentQ,
      isGameOver,
      activeUsername,
      onCorrectAnswer,
      streak,
      score,
      bestStreak,
      bestScore,
      questions.length,
    ]
  );

  const handleSkip = useCallback(() => {
    if (isGameOver || !currentQ) return;
    sounds.playClick();
    // Skipping resets streak to 0, resets timer
    setStreak(0);
    setTimeLeft(TIMER_MAX);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  }, [isGameOver, currentQ, questions.length]);

  // Keyboard Shortcuts (1-4 / A-D, Space to skip, Enter to retry)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (isGameOver) {
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          handleRestart();
        }
        return;
      }

      if (e.key === '1' || e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleAnswer(0);
      } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleAnswer(1);
      } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleAnswer(2);
      } else if (e.key === '4' || e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleAnswer(3);
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, handleAnswer, handleRestart, handleSkip]);

  if (isLoading) {
    return (
      <div className="max-w-[700px] mx-auto p-12 text-center text-zinc-500 font-mono text-xs flex items-center justify-center gap-2">
        <Zap className="w-4 h-4 animate-spin text-amber-400" />
        <span>Loading Arcade Sprint...</span>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="max-w-[700px] mx-auto p-12 text-center text-zinc-400 font-mono text-xs">
        No sprint questions available.
      </div>
    );
  }

  // Timer indicator color
  const timerPercent = (timeLeft / TIMER_MAX) * 100;
  const isTimeCritical = timeLeft <= 3;

  return (
    <div className="max-w-[800px] mx-auto px-3 sm:px-6 py-4 sm:py-8 font-sans">
      {/* ======================================================== */}
      {/* MINIMALIST CENTERED ARCADE CARD */}
      {/* ======================================================== */}
      <div
        className={`relative bg-zinc-950 border rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-2xl transition-all duration-300 ${
          lastFeedback === 'correct'
            ? 'border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
            : lastFeedback === 'wrong'
            ? 'border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.3)]'
            : isTimeCritical
            ? 'border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
            : 'border-zinc-800'
        }`}
      >
        {/* Top HUD: Streak Flame, Countdown Timer, and Total Score */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-zinc-800/80 mb-6 font-mono">
          {/* Streak Flame Icon */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs sm:text-sm transition-all ${
                streak > 0
                  ? 'bg-amber-950/60 border-amber-500/80 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}
            >
              <Flame
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  streak > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-zinc-600'
                }`}
              />
              <span className="tabular-nums">STREAK: {streak}</span>
            </div>
          </div>

          {/* 10s Countdown Timer */}
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full border text-xs sm:text-sm font-bold tabular-nums transition-colors ${
                isTimeCritical
                  ? 'bg-rose-950 border-rose-500 text-rose-300 animate-bounce'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-100'
              }`}
            >
              <span className="text-[10px] text-zinc-500 uppercase">Timer:</span>
              <span className="text-base sm:text-lg">{timeLeft}s</span>
            </div>
          </div>

          {/* Total Score */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs sm:text-sm font-bold">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span className="text-zinc-400 hidden sm:inline">SCORE:</span>
              <span className="text-emerald-400 tabular-nums">{score}</span>
            </div>
          </div>
        </div>

        {/* Linear Timer Bar */}
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-6 border border-zinc-800">
          <div
            className={`h-full transition-all duration-300 ${
              isTimeCritical ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-amber-400'
            }`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>

        {/* Question Text */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
            <span>CLAT Speed-Run One-Liner</span>
            <span>Keys 1–4 / A–D • Space to skip</span>
          </div>
          <h2 className="text-base sm:text-xl font-sans font-semibold text-white leading-relaxed">
            {currentQ.text}
          </h2>
        </div>

        {/* Large Thumb-Friendly Options (min 48px height, active:scale-95) */}
        <div className="grid grid-cols-1 gap-3 sm:gap-3.5 mb-6">
          {currentQ.options.map((opt, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isWrongChoice = wrongSelection === idx;

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isGameOver}
                className={`w-full flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border text-left text-xs sm:text-sm font-sans active:scale-95 touch-manipulation transition-all min-h-[48px] select-none ${
                  isWrongChoice
                    ? 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                    : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-600 text-zinc-100'
                }`}
              >
                <span className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 font-mono text-xs font-bold flex items-center justify-center text-zinc-300 shrink-0">
                  {letter}
                </span>
                <span className="flex-1 leading-snug">{opt}</span>
                <span className="font-mono text-[10px] text-zinc-500 hidden sm:inline">[{idx + 1}]</span>
              </button>
            );
          })}
        </div>

        {/* Footer controls: Skip button */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 font-mono text-xs text-zinc-400">
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 active:scale-95 touch-manipulation transition-colors"
          >
            <span>Skip Question</span>
            <span className="text-[10px] text-zinc-500">[Space]</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-zinc-500">
              Best Streak: <strong className="text-zinc-300">{bestStreak}</strong>
            </span>
            <span className="text-zinc-500">
              Active: <strong className="text-cyan-400">{activeUsername}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUDDEN-DEATH SUMMARY MODAL (Sprint Ended) */}
      {/* ======================================================== */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="w-full max-w-md bg-zinc-950 border border-rose-500/80 rounded-2xl p-6 sm:p-7 shadow-[0_0_40px_rgba(244,63,94,0.3)] text-center space-y-5 animate-scale-up">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-950/80 border border-rose-500 flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-7 h-7 text-rose-400" />
            </div>

            <div>
              <h3 className="font-mono text-xl sm:text-2xl font-black uppercase tracking-wider text-rose-400">
                Sprint Ended
              </h3>
              <p className="font-mono text-xs text-zinc-400 mt-1">
                {gameOverReason === 'timeout'
                  ? 'Time expired! 10-second sudden death triggered.'
                  : 'Incorrect answer! Sudden-death mode terminated.'}
              </p>
            </div>

            {/* Score & Streak Summary Cards */}
            <div className="grid grid-cols-2 gap-3 py-2 font-mono">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                <span className="text-[11px] text-zinc-500 uppercase block">Final Streak</span>
                <span className="text-2xl font-black text-amber-400 tabular-nums">{streak}</span>
                <span className="text-[10px] text-zinc-600 block mt-0.5">Best: {bestStreak}</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                <span className="text-[11px] text-zinc-500 uppercase block">Total Score</span>
                <span className="text-2xl font-black text-emerald-400 tabular-nums">{score}</span>
                <span className="text-[10px] text-zinc-600 block mt-0.5">Best: {bestScore}</span>
              </div>
            </div>

            {/* Correct Solution reveal */}
            {currentQ && (
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3 text-left text-xs font-sans">
                <span className="font-mono text-[10px] uppercase text-emerald-400 font-bold block mb-1">
                  Correct Answer:
                </span>
                <p className="text-zinc-200">
                  <strong className="text-emerald-300 font-mono mr-1">
                    {['A', 'B', 'C', 'D'][currentQ.correctOptionIndex]}.
                  </strong>
                  {currentQ.options[currentQ.correctOptionIndex]}
                </p>
              </div>
            )}

            {/* Retry Button */}
            <button
              onClick={handleRestart}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-sm active:scale-95 touch-manipulation transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] min-h-[48px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Sprint [Enter]</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
