import React, { useState, useEffect, useCallback } from 'react';
import { BankQuestion, QuestionDifficulty } from '../types';
import { bankQuestions as allBankQuestions } from '../data/mockData';
import {
  Search,
  Folder,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface GKQuestionBankProps {
  onCorrectAnswer: () => void;
  initialPracticeId?: string;
}

export const GKQuestionBank: React.FC<GKQuestionBankProps> = ({
  onCorrectAnswer,
  initialPracticeId,
}) => {
  // Header Toggle inside QB: "Mocks" | "Current Affairs"
  const [activeType, setActiveType] = useState<'current' | 'mocks'>('current');
  const [viewMode, setViewMode] = useState<'directory' | 'practice'>('directory');

  // Directory Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | QuestionDifficulty>('ALL');

  // Practice State
  const [practiceQuestions, setPracticeQuestions] = useState<BankQuestion[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [solvedStatus, setSolvedStatus] = useState<Record<string, 'solved' | 'missed'>>({});

  // Filter pool
  const currentPool = allBankQuestions.filter(
    (q) => q.subject === 'gk' && (q.type ? q.type === activeType : activeType === 'current')
  );

  const categoryCounts: Record<string, number> = { All: currentPool.length };
  currentPool.forEach((q) => {
    categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
  });
  const categories = Object.keys(categoryCounts);

  const filteredQuestions = currentPool.filter((q) => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesDifficulty = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    const matchesSearch =
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subtopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const launchPractice = useCallback(
    (questionId?: string) => {
      sounds.playClick();
      const pool = filteredQuestions.length > 0 ? filteredQuestions : currentPool;
      setPracticeQuestions(pool);
      if (questionId) {
        const foundIdx = pool.findIndex((q) => q.id === questionId);
        setPracticeIndex(foundIdx !== -1 ? foundIdx : 0);
      } else {
        setPracticeIndex(0);
      }
      setViewMode('practice');
    },
    [filteredQuestions, currentPool]
  );

  useEffect(() => {
    if (initialPracticeId) {
      launchPractice(initialPracticeId);
    }
  }, [initialPracticeId, launchPractice]);

  const activeQ = practiceQuestions[practiceIndex] || currentPool[0];
  const activeSelectedAnswer = activeQ ? selectedAnswers[activeQ.id] : undefined;
  const isAnswered = activeSelectedAnswer !== undefined;

  const handleSelectOption = (idx: number) => {
    if (!activeQ || isAnswered) return;

    setSelectedAnswers((prev) => ({ ...prev, [activeQ.id]: idx }));
    const isCorrect = idx === activeQ.correctOptionIndex;

    setSolvedStatus((prev) => ({
      ...prev,
      [activeQ.id]: isCorrect ? 'solved' : 'missed',
    }));

    if (isCorrect) {
      sounds.playCorrect();
      onCorrectAnswer();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNextPractice = useCallback(() => {
    sounds.playClick();
    if (practiceIndex < practiceQuestions.length - 1) {
      setPracticeIndex((prev) => prev + 1);
    }
  }, [practiceIndex, practiceQuestions.length]);

  const handlePrevPractice = useCallback(() => {
    sounds.playClick();
    if (practiceIndex > 0) {
      setPracticeIndex((prev) => prev - 1);
    }
  }, [practiceIndex]);

  useEffect(() => {
    if (viewMode !== 'practice') return;

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
        handleNextPractice();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isAnswered, handleNextPractice]);

  const getDifficultyDot = (diff: QuestionDifficulty) => {
    switch (diff) {
      case 'Easy':
        return <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" title="Easy" />;
      case 'Moderate':
        return <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" title="Moderate" />;
      case 'Hard':
        return <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" title="Hard" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 select-none">
      {/* Top Controls: Clean Two-Way Toggle ("Current Affairs" | "Mocks") & View Switcher */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800/80 text-xs">
        <div className="flex items-center gap-2">
          {/* Two-way toggle */}
          <div className="flex items-center rounded-md bg-neutral-900/80 p-0.5 border border-neutral-800">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveType('current');
                setSelectedCategory('All');
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                activeType === 'current'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Current Affairs
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveType('mocks');
                setSelectedCategory('All');
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                activeType === 'mocks'
                  ? 'bg-neutral-800 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Mocks
            </button>
          </div>

          <span className="text-[11px] text-neutral-500 font-mono hidden sm:inline">
            {currentPool.length} questions
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          {viewMode === 'practice' ? (
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('directory');
              }}
              className="flex items-center gap-1.5 px-3 py-1 text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Directory</span>
            </button>
          ) : (
            <button
              onClick={() => launchPractice()}
              className="px-3.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-xs rounded transition-colors cursor-pointer"
            >
              Practice Mode
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: DIRECTORY & FILTER TABLE                          */}
      {/* ======================================================== */}
      {viewMode === 'directory' ? (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 items-start">
          {/* Left Sidebar */}
          <aside className="w-full lg:col-span-3 bg-[#050505] border border-neutral-800/80 rounded-lg p-3.5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800/80 text-xs font-medium text-neutral-300">
              <Folder className="w-3.5 h-3.5 text-emerald-500" />
              <span>Categories</span>
            </div>

            <div className="space-y-0.5">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedCategory(cat);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left rounded transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-800 text-white font-medium'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                    }`}
                  >
                    <span className="truncate pr-1">{cat}</span>
                    <span className="text-[11px] text-neutral-500 font-mono tabular-nums shrink-0">
                      {categoryCounts[cat]}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => launchPractice()}
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-200 text-xs font-medium rounded transition-colors cursor-pointer mt-2"
            >
              Practice Filtered ({filteredQuestions.length})
            </button>
          </aside>

          {/* Right Main Table */}
          <main className="w-full lg:col-span-9 bg-[#050505] border border-neutral-800/80 rounded-lg p-4 space-y-3">
            {/* Search & Difficulty Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by description, subtopic, or ID..."
                  className="w-full pl-8 pr-3 py-1 bg-black border border-neutral-800 rounded text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div className="flex items-center gap-1">
                {(['ALL', 'Easy', 'Moderate', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      sounds.playClick();
                      setDifficultyFilter(diff);
                    }}
                    className={`px-2.5 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                      difficultyFilter === diff
                        ? 'bg-neutral-800 text-white font-medium'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-neutral-800/70 rounded">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/90 border-b border-neutral-800 text-[11px] text-neutral-400 font-medium">
                  <tr>
                    <th className="py-2.5 px-3 font-mono">ID</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 hidden md:table-cell">Subtopic</th>
                    <th className="py-2.5 px-3">Difficulty</th>
                    <th className="py-2.5 px-3 hidden sm:table-cell">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-neutral-300">
                  {filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-500">
                        No questions matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.map((q) => {
                      const status = solvedStatus[q.id] || 'unsolved';
                      return (
                        <tr key={q.id} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-neutral-400">{q.id}</td>
                          <td className="py-2.5 px-3 max-w-[340px]">
                            <p className="line-clamp-2 leading-relaxed text-neutral-200">{q.text}</p>
                          </td>
                          <td className="py-2.5 px-3 text-neutral-400 hidden md:table-cell">
                            {q.subtopic}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              {getDifficultyDot(q.difficulty)}
                              <span className="text-[11px] text-neutral-400">{q.difficulty}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 hidden sm:table-cell">
                            {status === 'solved' ? (
                              <span className="text-emerald-400 text-[11px] font-medium">Solved</span>
                            ) : status === 'missed' ? (
                              <span className="text-rose-400 text-[11px] font-medium">Missed</span>
                            ) : (
                              <span className="text-neutral-500 text-[11px]">Unsolved</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => launchPractice(q.id)}
                              className="px-2.5 py-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 rounded text-xs transition-colors cursor-pointer"
                            >
                              Practice →
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      ) : (
        /* ======================================================== */
        /* VIEW 2: PRACTICE SESSION MODE (Centered Single Card)      */
        /* (No split-screen passage for GK)                         */
        /* ======================================================== */
        <div className="max-w-2xl mx-auto bg-[#050505] border border-neutral-800/80 rounded-lg p-6 sm:p-7 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-neutral-400">
                Question <span className="text-white font-medium">{practiceIndex + 1}</span> of {practiceQuestions.length}
              </span>
              <span className="text-neutral-600">·</span>
              <span className="font-mono text-neutral-500">{activeQ.id}</span>
              <span className="text-neutral-600">·</span>
              <div className="flex items-center gap-1">
                {getDifficultyDot(activeQ.difficulty)}
                <span className="text-[11px] text-neutral-400">{activeQ.difficulty}</span>
              </div>
            </div>
            <span className="text-[11px] text-neutral-500 font-mono">1–4 to select</span>
          </div>

          {/* Question Text - Hero Typography */}
          <div>
            <h2 className="text-base sm:text-lg font-sans font-medium text-neutral-100 leading-relaxed">
              {activeQ.text}
            </h2>
          </div>

          {/* Options: Clean, full-width rows with minimal 1px neutral borders */}
          <div className="space-y-2.5">
            {activeQ.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isPicked = activeSelectedAnswer === idx;
              const isCorrect = idx === activeQ.correctOptionIndex;

              let stateClass = 'border-neutral-800 hover:border-neutral-700 bg-black text-neutral-200';
              if (isAnswered) {
                if (isCorrect) {
                  stateClass = 'border-emerald-500/80 bg-emerald-950/20 text-emerald-100 font-medium';
                } else if (isPicked && !isCorrect) {
                  stateClass = 'border-rose-500/80 bg-rose-950/20 text-rose-100';
                } else {
                  stateClass = 'border-neutral-800/50 bg-black/40 text-neutral-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full flex items-center justify-between p-3.5 border rounded text-left text-sm transition-all cursor-pointer ${stateClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-xs flex items-center justify-center text-xs font-semibold text-neutral-400 bg-neutral-900 border border-neutral-800 shrink-0">
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

          {/* EXPLANATION & CONTEXT BOX: Automatically displayed below options upon answering */}
          {isAnswered && (
            <div className="p-4 bg-black border border-neutral-800/90 rounded text-xs space-y-2">
              <div className="text-[11px] text-emerald-400 font-medium tracking-wide">
                Explanation & Context
              </div>
              <p className="text-neutral-300 leading-relaxed font-sans text-xs">
                {activeQ.explanation}
              </p>
              {activeQ.source && (
                <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-900 font-mono">
                  Source: {activeQ.source}
                </div>
              )}
            </div>
          )}

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 text-xs">
            <button
              onClick={handlePrevPractice}
              disabled={practiceIndex === 0}
              className="px-3 py-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded disabled:opacity-30 transition-colors cursor-pointer"
            >
              Previous
            </button>

            <button
              onClick={() => setViewMode('directory')}
              className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Back to Directory
            </button>

            <button
              onClick={handleNextPractice}
              disabled={practiceIndex === practiceQuestions.length - 1}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-medium rounded disabled:opacity-30 transition-colors cursor-pointer"
            >
              Next (Enter)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
