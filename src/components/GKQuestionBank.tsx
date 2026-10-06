import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BankQuestion, QuestionDifficulty } from '../types';
import { bankQuestions as allBankQuestions } from '../data/mockData';
import { INITIAL_CURRENT_AFFAIRS, INITIAL_QUESTION_BANK } from '../data/questionBank';
import { supabaseMocks } from '../lib/supabase';
import {
  Search,
  Folder,
  ArrowRight,
  ArrowLeft,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { JennyLoadingState } from './JennyMascot';

interface GKQuestionBankProps {
  onCorrectAnswer: () => void;
  initialPracticeId?: string;
}

// Helper to normalize legacy questions into BankQuestion structure
const mapLegacyQuestionToBankQuestion = (q: any, type: 'current' | 'mocks'): BankQuestion => {
  const letterMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
  const rawAns = (q.answer || 'a').toString().trim();
  const correctIdx = letterMap[rawAns.toLowerCase()] ?? 0;

  const rawOptions = q.options;
  const optionsArr = Array.isArray(rawOptions)
    ? rawOptions
    : [
        rawOptions?.a || 'Option A',
        rawOptions?.b || 'Option B',
        rawOptions?.c || 'Option C',
        rawOptions?.d || 'Option D',
      ];

  return {
    id: q.id,
    subject: 'gk',
    type,
    sourceType: type,
    category: q.category || q.categoryName || 'General Preparation',
    subtopic: q.subtopic || 'General',
    text: q.question || q.text || '',
    options: optionsArr,
    correctOptionIndex: correctIdx,
    correct_answer: rawAns.toUpperCase(),
    explanation: q.explanation || 'Verified answer rationale from syllabus bank.',
    difficulty: (q.difficulty as QuestionDifficulty) || 'Moderate',
    source: q.source || (type === 'mocks' ? 'CLAT Mock Series' : 'National Current Affairs'),
    isVerified: true,
  };
};

// Immediate offline/fallback questions pool
const localCurrentPool: BankQuestion[] = [
  ...allBankQuestions
    .filter((q) => q.subject === 'gk' && (q.type === 'current' || q.sourceType === 'current'))
    .map((q) => ({ ...q, type: 'current' as const, sourceType: 'current' as const })),
  ...INITIAL_CURRENT_AFFAIRS.map((q) => mapLegacyQuestionToBankQuestion(q, 'current')),
];

const localMockPool: BankQuestion[] = [
  ...allBankQuestions
    .filter((q) => q.subject === 'gk' && (q.type === 'mocks' || q.sourceType === 'mocks'))
    .map((q) => ({ ...q, type: 'mocks' as const, sourceType: 'mocks' as const })),
  ...INITIAL_QUESTION_BANK.map((q) => mapLegacyQuestionToBankQuestion(q, 'mocks')),
];

export const GKQuestionBank: React.FC<GKQuestionBankProps> = ({
  onCorrectAnswer,
  initialPracticeId,
}) => {
  // Header Toggle inside QB: "Current Affairs" | "Mocks"
  const [activeType, setActiveType] = useState<'current' | 'mocks'>('current');

  // Supabase live data storage for questions (initialized with full local pool immediately)
  const [dbQuestions, setDbQuestions] = useState<BankQuestion[]>(() => localCurrentPool);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Minimizable categories sidebar
  const [isCategoriesMinimized, setIsCategoriesMinimized] = useState<boolean>(false);

  // Fetch live questions from Supabase qb_questions table and merge with local pool
  const fetchQuestions = useCallback(async () => {
    const localPool = activeType === 'current' ? localCurrentPool : localMockPool;
    try {
      const sectionFilter = activeType === 'mocks' ? 'question_bank' : 'current_affairs';
      const { data, error } = await supabaseMocks
        .from('qb_questions')
        .select('*')
        .or(`section.eq.${sectionFilter},source_type.eq.${activeType}`);

      if (!error && data && data.length > 0) {
        const letterMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
        const mapped: BankQuestion[] = data.map((row: any) => {
          const rawAns = (row.correct_answer || row.correct_option || 'a').toString().trim();
          const correctIdx = letterMap[rawAns.toLowerCase()] ?? 0;
          return {
            id: row.id,
            subject: 'gk',
            type: activeType,
            sourceType: activeType,
            category: row.category || 'General Preparation',
            subtopic: row.subtopic || 'General Studies',
            difficulty: (row.difficulty as QuestionDifficulty) || 'Moderate',
            text: row.question || row.question_text || row.text || '',
            options: [
              row.option_a || 'Option A',
              row.option_b || 'Option B',
              row.option_c || 'Option C',
              row.option_d || 'Option D',
            ],
            correctOptionIndex: correctIdx,
            correct_answer: rawAns.toUpperCase(),
            explanation: row.explanation || 'Verified rationale from syllabus bank.',
            source: row.source || (activeType === 'mocks' ? 'Mock Series' : 'Current Affairs'),
            isVerified: true,
          };
        });

        // Merge: Supabase live questions first, then local questions not already present
        const seenIds = new Set(mapped.map((q) => q.id));
        const combined = [...mapped, ...localPool.filter((q) => !seenIds.has(q.id))];
        setDbQuestions(combined);
      } else {
        setDbQuestions(localPool);
      }
    } catch {
      setDbQuestions(localPool);
    } finally {
      setIsLoading(false);
    }
  }, [activeType]);

  // When activeType toggles, immediately switch local pool, reset category, and query Supabase
  useEffect(() => {
    setSelectedCategory('All');
    setDbQuestions(activeType === 'current' ? localCurrentPool : localMockPool);
    fetchQuestions();
  }, [activeType, fetchQuestions]);

  // Real-time synchronization with Supabase qb_questions
  useEffect(() => {
    let isMounted = true;

    const channel = supabaseMocks
      .channel(`realtime:qb_questions:${activeType}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'qb_questions' },
        () => {
          if (isMounted) {
            fetchQuestions();
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabaseMocks.removeChannel(channel);
    };
  }, [activeType, fetchQuestions]);

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | QuestionDifficulty>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'directory' | 'practice'>('directory');

  // Practice state
  const [practiceQuestions, setPracticeQuestions] = useState<BankQuestion[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [solvedStatus, setSolvedStatus] = useState<Record<string, 'solved' | 'missed'>>({});

  const currentPool = dbQuestions;

  // Extract categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    currentPool.forEach((q) => {
      if (q.category && q.category.trim()) {
        set.add(q.category.trim());
      }
    });
    return ['All', ...Array.from(set).sort()];
  }, [currentPool]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: currentPool.length };
    currentPool.forEach((q) => {
      const cat = (q.category && q.category.trim()) || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [currentPool]);

  // Filter questions
  const filteredQuestions = currentPool.filter((q) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (q.category && q.category.trim() === selectedCategory.trim());
    const matchesDifficulty = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.subtopic && q.subtopic.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
        return <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" title="Easy" />;
      case 'Moderate':
        return <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" title="Moderate" />;
      case 'Hard':
        return <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" title="Hard" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 select-none font-sans text-main">
      {/* Top Controls: Clean Two-Way Toggle ("Current Affairs" | "Mocks") & View Switcher */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-border text-xs">
        <div className="flex items-center gap-2">
          {/* Two-way toggle */}
          <div className="flex items-center rounded-md bg-panel p-0.5 border border-border">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveType('current');
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                activeType === 'current'
                  ? 'bg-hover text-main shadow-xs border border-border'
                  : 'text-muted hover:text-main'
              }`}
            >
              Current Affairs
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveType('mocks');
              }}
              className={`px-3 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                activeType === 'mocks'
                  ? 'bg-hover text-main shadow-xs border border-border'
                  : 'text-muted hover:text-main'
              }`}
            >
              Mocks
            </button>
          </div>

          <span className="text-[11px] text-muted font-mono hidden sm:inline tabular-nums">
            {currentPool.length} questions
          </span>
        </div>

        {/* View Mode & Minimize Switcher */}
        <div className="flex items-center gap-2">
          {viewMode === 'directory' && (
            <button
              onClick={() => {
                sounds.playClick();
                setIsCategoriesMinimized((prev) => !prev);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-main hover:text-accent bg-panel hover:bg-hover border border-border rounded transition-colors cursor-pointer"
              title={isCategoriesMinimized ? 'Expand Categories' : 'Minimize Categories'}
            >
              {isCategoriesMinimized ? (
                <>
                  <PanelLeftOpen className="w-3.5 h-3.5 text-accent" />
                  <span>Show Categories</span>
                </>
              ) : (
                <>
                  <PanelLeftClose className="w-3.5 h-3.5 text-muted" />
                  <span>Minimize Categories</span>
                </>
              )}
            </button>
          )}

          {viewMode === 'practice' ? (
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('directory');
              }}
              className="flex items-center gap-1.5 px-3 py-1 text-xs text-muted hover:text-main border border-border hover:border-accent/50 rounded transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Directory</span>
            </button>
          ) : (
            <button
              onClick={() => launchPractice()}
              style={{ background: 'var(--accent-gradient, var(--accent))' }}
              className="px-3.5 py-1 text-black font-semibold text-xs rounded transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
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
          {/* Left Sidebar: Minimizable Categories */}
          {!isCategoriesMinimized && (
            <aside className="w-full lg:col-span-3 bg-panel border border-border rounded-lg p-3.5 space-y-3 transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-border text-xs font-medium text-main">
                <div className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-accent" />
                  <span>Categories</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsCategoriesMinimized(true);
                  }}
                  className="flex items-center gap-1 text-[11px] text-muted hover:text-main px-1.5 py-0.5 rounded hover:bg-hover transition-colors cursor-pointer"
                  title="Minimize categories sidebar"
                >
                  <span className="text-[10px] font-mono">Minimize</span>
                  <PanelLeftClose className="w-3 h-3 text-muted" />
                </button>
              </div>

              <div className="space-y-0.5 max-h-[60vh] overflow-y-auto no-scrollbar">
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
                          ? 'bg-hover text-main font-medium border border-border'
                          : 'text-muted hover:text-main hover:bg-hover/50'
                      }`}
                    >
                      <span className="truncate pr-1">{cat}</span>
                      <span className="text-[11px] text-muted font-mono tabular-nums shrink-0">
                        {categoryCounts[cat]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => launchPractice()}
                className="w-full py-2 bg-hover hover:opacity-90 border border-border text-main text-xs font-medium rounded transition-colors cursor-pointer mt-2"
              >
                Practice Filtered ({filteredQuestions.length})
              </button>
            </aside>
          )}

          {/* Right Main Table (Expands to 12 cols when categories minimized) */}
          <main
            className={`w-full ${
              isCategoriesMinimized ? 'lg:col-span-12' : 'lg:col-span-9'
            } bg-panel border border-border rounded-lg p-4 space-y-3 transition-colors`}
          >
            {/* Quick Un-minimize Bar if Categories Minimized */}
            {isCategoriesMinimized && (
              <div className="flex items-center justify-between pb-2.5 border-b border-border text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setIsCategoriesMinimized(false);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-hover hover:opacity-90 border border-border rounded text-main transition-colors cursor-pointer text-xs font-medium"
                    title="Open categories table"
                  >
                    <PanelLeftOpen className="w-3.5 h-3.5 text-accent" />
                    <span>Show Categories</span>
                  </button>
                  <span className="text-muted font-mono text-[11px]">
                    Category: <span className="text-main font-sans font-medium">{selectedCategory}</span>
                  </span>
                </div>

                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSelectedCategory('All');
                    }}
                    className="text-[11px] text-muted hover:text-main underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            )}

            {/* Search & Difficulty Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by description, subtopic, or ID..."
                  className="w-full pl-8 pr-3 py-1 bg-background border border-border rounded text-xs text-main placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                {(['ALL', 'Easy', 'Moderate', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      sounds.playClick();
                      setDifficultyFilter(diff);
                    }}
                    className={`px-2.5 py-0.5 text-xs rounded transition-colors cursor-pointer shrink-0 ${
                      difficultyFilter === diff
                        ? 'bg-hover text-main font-medium border border-border'
                        : 'text-muted hover:text-main'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-border rounded">
              <table className="w-full text-left text-xs">
                <thead className="bg-background border-b border-border text-[11px] text-muted font-medium">
                  <tr>
                    <th className="py-2.5 px-3 font-mono">ID</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 hidden md:table-cell">Subtopic</th>
                    <th className="py-2.5 px-3">Difficulty</th>
                    <th className="py-2.5 px-3 hidden sm:table-cell">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-main">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">
                        <JennyLoadingState
                          message={`Fetching ${activeType === 'mocks' ? 'Mock Questions' : 'Current Affairs'}...`}
                          submessage="Jenny is querying the live Supabase database"
                        />
                      </td>
                    </tr>
                  ) : filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted">
                        No questions matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.map((q) => {
                      const status = solvedStatus[q.id] || 'unsolved';
                      return (
                        <tr key={q.id} className="hover:bg-hover/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-muted">{q.id}</td>
                          <td className="py-2.5 px-3 max-w-[340px]">
                            <p className="line-clamp-2 leading-relaxed text-main">{q.text}</p>
                          </td>
                          <td className="py-2.5 px-3 text-muted hidden md:table-cell">
                            {q.subtopic}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              {getDifficultyDot(q.difficulty)}
                              <span className="text-[11px] text-muted">{q.difficulty}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 hidden sm:table-cell">
                            {status === 'solved' ? (
                              <span className="text-accent text-[11px] font-medium">Solved</span>
                            ) : status === 'missed' ? (
                              <span className="text-rose-400 text-[11px] font-medium">Missed</span>
                            ) : (
                              <span className="text-muted text-[11px]">Unsolved</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => launchPractice(q.id)}
                              className="px-2.5 py-1 bg-hover hover:opacity-90 border border-border text-main rounded text-[11px] transition-colors cursor-pointer"
                            >
                              Practice
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
        /* ======================================================== */
        <div className="max-w-2xl mx-auto bg-panel border border-border rounded-lg p-6 sm:p-7 space-y-6 transition-colors">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-muted">
                Question <span className="text-main font-medium">{practiceIndex + 1}</span> of {practiceQuestions.length}
              </span>
              <span className="text-muted/60">·</span>
              <span className="font-mono text-muted">{activeQ?.id}</span>
              <span className="text-muted/60">·</span>
              <div className="flex items-center gap-1">
                {activeQ && getDifficultyDot(activeQ.difficulty)}
                <span className="text-[11px] text-muted">{activeQ?.difficulty}</span>
              </div>
            </div>
            <span className="text-[11px] text-muted font-mono">1–4 to select</span>
          </div>

          {/* Question Text */}
          <div>
            <h2 className="text-base sm:text-lg font-sans font-medium text-main leading-relaxed break-words whitespace-normal">
              {activeQ?.text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {activeQ?.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isPicked = activeSelectedAnswer === idx;
              const isCorrect = idx === activeQ.correctOptionIndex;

              let stateClass = 'border-border hover:border-accent bg-background text-main';
              if (isAnswered) {
                if (isCorrect) {
                  stateClass = 'border-accent bg-accent/15 text-main font-medium ring-1 ring-accent';
                } else if (isPicked && !isCorrect) {
                  stateClass = 'border-rose-500/80 bg-rose-950/20 text-rose-300';
                } else {
                  stateClass = 'border-border/40 bg-background/40 text-muted opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full flex items-center justify-between p-4 min-h-[3rem] h-auto border rounded text-left text-sm transition-all cursor-pointer ${stateClass}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="w-5 h-5 rounded-xs flex items-center justify-center text-xs font-semibold text-main bg-hover border border-border shrink-0">
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

          {/* EXPLANATION & CONTEXT BOX */}
          {isAnswered && activeQ && (
            <div className="p-4 sm:p-5 bg-background border border-border rounded text-xs space-y-2">
              <div className="text-[11px] text-accent font-medium tracking-wide uppercase font-sans">
                Explanation & Context
              </div>
              <div className="font-reading font-serif text-sm sm:text-base text-main leading-relaxed sm:leading-loose whitespace-pre-line">
                {activeQ.explanation}
              </div>
              {activeQ.source && (
                <div className="text-[11px] text-muted pt-2 border-t border-border font-sans">
                  Source: {activeQ.source}
                </div>
              )}
            </div>
          )}

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
            <button
              onClick={handlePrevPractice}
              disabled={practiceIndex === 0}
              className="px-3 py-1.5 text-muted hover:text-main border border-border hover:border-accent/50 rounded disabled:opacity-30 transition-colors cursor-pointer"
            >
              Previous
            </button>

            <button
              onClick={() => setViewMode('directory')}
              className="text-muted hover:text-main transition-colors cursor-pointer"
            >
              Back to Directory
            </button>

            <button
              onClick={handleNextPractice}
              disabled={practiceIndex === practiceQuestions.length - 1}
              style={{ background: 'var(--accent-gradient, var(--accent))' }}
              className="px-4 py-1.5 text-black font-semibold rounded disabled:opacity-30 transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
            >
              Next (Enter)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GKQuestionBank;
