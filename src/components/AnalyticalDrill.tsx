import React, { useState, useEffect, useCallback } from 'react';
import { Passage, PassageQuestion } from '../types';
import { passages } from '../data/mockData';
import { sounds } from '../utils/sound';
import { Play, ExternalLink } from 'lucide-react';
import { supabaseMocks } from '../lib/supabase';

interface AnalyticalDrillProps {
  onCorrectAnswer: () => void;
}

export const AnalyticalDrill: React.FC<AnalyticalDrillProps> = ({ onCorrectAnswer }) => {
  const [allAnalyticalPassages, setAllAnalyticalPassages] = useState<Passage[]>(() => {
    return passages.filter((p) => p.subjectType === 'analytical');
  });
  const [passageIndex, setPassageIndex] = useState(0);

  // Fetch any live imported analytical passages from supabaseMocks
  useEffect(() => {
    let isMounted = true;
    async function loadLivePassages() {
      try {
        const { data, error } = await supabaseMocks
          .from('passages')
          .select('*')
          .eq('subject', 'analytical');

        if (!error && data && data.length > 0 && isMounted) {
          const passageIds = data.map((p) => p.id);
          const { data: qData } = await supabaseMocks
            .from('questions')
            .select('*')
            .in('passage_id', passageIds);

          const mapped: Passage[] = data.map((row) => {
            const relatedQ = (qData || []).filter((q) => q.passage_id === row.id);
            const letterMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };

            const questionsList: PassageQuestion[] = relatedQ.map((q, idx) => ({
              id: q.id,
              questionNumber: idx + 1,
              text: q.question || q.text || '',
              options: [q.option_a || '', q.option_b || '', q.option_c || '', q.option_d || ''],
              correctOptionIndex: letterMap[q.correct_answer] ?? 0,
              explanation: q.explanation || 'Verified rationale.',
              isVerified: true,
            }));

            return {
              id: row.id,
              title: row.title || 'Analytical Reasoning Puzzle',
              subjectType: 'analytical',
              subject: 'analytical',
              source: row.source || 'Imported Exam Set',
              wordCount: row.word_count || 150,
              readTimeMinutes: row.read_time_minutes || 2,
              text: row.text || row.content || '',
              solution_video_url: row.solution_video_url || undefined,
              questions: questionsList.length > 0 ? questionsList : (passages[1]?.questions || []),
            };
          });

          if (mapped.length > 0) {
            setAllAnalyticalPassages(mapped);
          }
        }
      } catch {}
    }

    loadLivePassages();
    return () => {
      isMounted = false;
    };
  }, []);

  const activePassage: Passage =
    allAnalyticalPassages[passageIndex] || allAnalyticalPassages[0] || passages[1] || passages[0];

  const [activeQIndex, setActiveQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const currentQ: PassageQuestion | undefined = activePassage.questions[activeQIndex];
  const selectedAnswer = currentQ ? selectedAnswers[currentQ.id] : undefined;
  const isAnswered = selectedAnswer !== undefined;

  const handleSelectOption = (idx: number) => {
    if (!currentQ || isAnswered) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: idx,
    }));

    const isCorrect = idx === currentQ.correctOptionIndex;
    if (isCorrect) {
      sounds.playCorrect();
      onCorrectAnswer();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleNext = useCallback(() => {
    sounds.playClick();
    if (activeQIndex < activePassage.questions.length - 1) {
      setActiveQIndex((prev) => prev + 1);
    }
  }, [activeQIndex, activePassage.questions.length]);

  const handlePrev = useCallback(() => {
    sounds.playClick();
    if (activeQIndex > 0) {
      setActiveQIndex((prev) => prev - 1);
    }
  }, [activeQIndex]);

  // Keyboard Shortcuts (1-4, Enter)
  useEffect(() => {
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
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, handleNext]);

  return (
    <div className="w-full min-h-[calc(100vh-50px)] lg:h-[calc(100vh-50px)] px-3 sm:px-6 py-3 flex flex-col bg-background text-main select-none overflow-x-hidden transition-colors">
      {/* Clean Top Bar */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-border text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-main truncate">{activePassage.title}</span>
          <span className="text-muted/60 shrink-0">·</span>
          <span className="text-muted font-mono text-[11px] shrink-0 tabular-nums">
            {activePassage.wordCount} words
          </span>
        </div>
        <span className="text-[11px] text-muted font-medium shrink-0">
          Analytical Reasoning
        </span>
      </div>

      {/* 50/50 Split-Screen: Both panes independently scrollable on desktop, stacked on mobile */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 overflow-visible lg:overflow-hidden pb-4 lg:pb-0">
        {/* ======================================================== */}
        {/* LEFT PANE (50% desktop): Puzzle Setup                    */}
        {/* ======================================================== */}
        <section className="h-auto lg:h-full overflow-y-auto bg-panel border border-border rounded-lg p-4 sm:p-5 space-y-4 transition-colors">
          <div className="pb-2 border-b border-border flex items-center justify-between text-xs text-muted">
            <span className="font-medium text-main">Logic Conditions</span>
            <span className="font-mono text-[11px] text-muted tabular-nums">
              ~{activePassage.readTimeMinutes} min read
            </span>
          </div>

          {/* Puzzle Conditions Text - Pure text without table/chart visual references */}
          <div className="font-reading font-serif text-sm sm:text-base text-main leading-relaxed sm:leading-loose whitespace-pre-line tracking-normal">
            {activePassage.text}
          </div>

          {/* Solution Video Link Button (opens in new tab) */}
          {activePassage.solution_video_url && (
            <div className="pt-2">
              <a
                href={activePassage.solution_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-background hover:bg-hover border border-border hover:border-accent text-xs font-sans text-main rounded-lg transition-colors group cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-accent fill-accent/20 group-hover:scale-110 transition-transform" />
                <span className="font-medium">View Solution Video</span>
                <ExternalLink className="w-3 h-3 text-muted group-hover:text-main" />
              </a>
            </div>
          )}

          {activePassage.source && (
            <div className="text-[11px] text-muted pt-2 border-t border-border font-sans">
              Source: {activePassage.source}
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* RIGHT PANE (50% desktop): Question & Options             */}
        {/* ======================================================== */}
        <section className="h-auto lg:h-full overflow-y-auto bg-panel border border-border rounded-lg p-4 sm:p-5 space-y-5 flex flex-col justify-between transition-colors">
          <div className="space-y-4">
            {/* Q1-Q5 Pagination Dots/Numbers */}
            <div className="flex items-center justify-between pb-2.5 border-b border-border text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {activePassage.questions.map((q, idx) => {
                  const isCurrent = activeQIndex === idx;
                  const ans = selectedAnswers[q.id];
                  const hasAnswered = ans !== undefined;
                  const isRight = ans === q.correctOptionIndex;

                  let dotClass = 'bg-background border-border text-muted hover:border-accent hover:text-main';
                  if (hasAnswered) {
                    dotClass = isRight
                      ? 'bg-accent/20 border-accent text-accent font-semibold ring-1 ring-accent'
                      : 'bg-rose-950/40 border-rose-500 text-rose-300 font-semibold';
                  } else if (isCurrent) {
                    dotClass = 'bg-hover border-border text-main font-semibold shadow-xs';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        sounds.playClick();
                        setActiveQIndex(idx);
                      }}
                      className={`w-7 h-7 rounded border flex items-center justify-center font-mono text-xs transition-all cursor-pointer ${dotClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <span className="font-mono text-xs text-muted hidden xs:inline tabular-nums">
                Q {activeQIndex + 1} of {activePassage.questions.length}
              </span>
            </div>

            {/* Question Text */}
            {currentQ ? (
              <div className="space-y-4">
                <div className="text-sm sm:text-base font-normal text-main leading-relaxed font-sans">
                  <span className="font-mono text-muted font-semibold mr-1.5 tabular-nums">
                    {activeQIndex + 1}.
                  </span>
                  {currentQ.text}
                </div>

                {/* 4 Interactive Option Buttons (A/B/C/D) */}
                <div className="space-y-2 pt-1 font-sans">
                  {currentQ.options.map((opt, idx) => {
                    const letter = ['A', 'B', 'C', 'D'][idx];
                    const isSelected = selectedAnswer === idx;
                    const isCorrectChoice = idx === currentQ.correctOptionIndex;

                    let borderClass = 'border-border hover:border-accent bg-background text-main hover:bg-hover';
                    let letterBadgeClass = 'border-border text-muted bg-panel';

                    if (isAnswered) {
                      if (isCorrectChoice) {
                        borderClass = 'border-accent bg-accent/15 text-main font-medium ring-1 ring-accent';
                        letterBadgeClass = 'border-accent text-black bg-accent font-bold';
                      } else if (isSelected) {
                        borderClass = 'border-rose-500/80 bg-rose-950/20 text-rose-200 font-medium';
                        letterBadgeClass = 'border-rose-500 text-white bg-rose-600 font-bold';
                      } else {
                        borderClass = 'border-border/50 bg-background/50 text-muted opacity-60';
                        letterBadgeClass = 'border-border text-muted bg-panel/50';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-3.5 sm:p-4 rounded border text-left flex items-start sm:items-center gap-3 transition-all cursor-pointer group min-h-[3rem] h-auto ${borderClass} ${
                          !isAnswered ? 'active:border-accent' : ''
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-xs border flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 sm:mt-0 transition-colors ${letterBadgeClass}`}
                        >
                          {letter}
                        </span>
                        <span className="text-xs sm:text-sm leading-relaxed break-words whitespace-normal flex-1">
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Instant Explanation Feedback */}
                {isAnswered && (
                  <div className="p-3.5 bg-background border border-border rounded text-xs space-y-1.5 animate-in fade-in duration-200 transition-colors">
                    <div className="text-[11px] text-accent font-medium tracking-wide uppercase font-sans">
                      {selectedAnswer === currentQ.correctOptionIndex
                        ? 'Correct Rationale'
                        : 'Explanation'}
                    </div>
                    <div className="font-reading font-serif text-main leading-relaxed text-xs sm:text-sm">
                      {currentQ.explanation}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Navigation Buttons (Prev / Next) */}
          <div className="flex items-center justify-between pt-3 border-t border-border text-xs font-sans">
            <button
              onClick={handlePrev}
              disabled={activeQIndex === 0}
              className="px-3.5 py-1.5 border border-border hover:border-accent disabled:opacity-30 disabled:hover:border-border text-muted hover:text-main hover:bg-hover rounded transition-colors cursor-pointer min-h-[36px]"
            >
              ← Previous
            </button>

            <span className="font-mono text-muted text-[11px] hidden sm:inline">
              Keys: [1-4] or [A-D] to answer · [Enter] next
            </span>

            <button
              onClick={handleNext}
              disabled={activeQIndex === activePassage.questions.length - 1}
              style={{ background: 'var(--accent-gradient, var(--accent))' }}
              className="px-4 py-1.5 text-black font-semibold rounded disabled:opacity-30 transition-all hover:opacity-90 cursor-pointer min-h-[36px] shadow-xs"
            >
              Next Question →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticalDrill;
