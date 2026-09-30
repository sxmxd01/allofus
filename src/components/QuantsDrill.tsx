import React, { useState, useEffect, useCallback } from 'react';
import { Passage, PassageQuestion } from '../types';
import { passages } from '../data/mockData';
import { sounds } from '../utils/sound';

interface QuantsDrillProps {
  onCorrectAnswer: () => void;
}

export const QuantsDrill: React.FC<QuantsDrillProps> = ({ onCorrectAnswer }) => {
  const quantsPassages = passages.filter((p) => p.subjectType === 'quants');
  const activePassage: Passage = quantsPassages[0] || passages[0];

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
    <div className="w-full h-[calc(100vh-50px)] px-4 sm:px-6 py-3 flex flex-col bg-black text-neutral-100 select-none">
      {/* Clean Top Bar */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-neutral-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-200">{activePassage.title}</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-500 font-mono text-[11px]">
            {activePassage.wordCount} words
          </span>
        </div>
        <span className="text-[11px] text-neutral-500 font-mono">
          Quantitative Techniques
        </span>
      </div>

      {/* 50/50 Split-Screen: Both panes independently scrollable using overflow-y-auto */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-hidden">
        {/* ======================================================== */}
        {/* LEFT PANE (50% desktop): Caselet & Tables                */}
        {/* ======================================================== */}
        <section className="h-full overflow-y-auto bg-[#050505] border border-neutral-800/80 rounded-lg p-5 space-y-4">
          <div className="pb-2 border-b border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium text-neutral-300">Caselet Context</span>
            <span className="font-mono text-[11px] text-neutral-500">
              ~{activePassage.readTimeMinutes} min read
            </span>
          </div>

          {/* Caselet Text - Hero typography */}
          <div className="text-sm font-sans text-neutral-200 leading-relaxed whitespace-pre-line">
            {activePassage.text}
          </div>

          {/* Mathematical Table */}
          {activePassage.tableData && (
            <div className="border border-neutral-800 rounded overflow-hidden my-3">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/90 text-neutral-400 text-[11px] border-b border-neutral-800">
                  <tr>
                    {activePassage.tableData.headers.map((h, i) => (
                      <th key={i} className="py-2.5 px-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-neutral-300 font-mono">
                  {activePassage.tableData.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-neutral-900/40">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-2 px-3 tabular-nums">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activePassage.source && (
            <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-900 font-mono">
              Source: {activePassage.source}
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* RIGHT PANE (50% desktop): Question & Options             */}
        {/* ======================================================== */}
        <section className="h-full overflow-y-auto bg-[#050505] border border-neutral-800/80 rounded-lg p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Q1-Q5 Pagination Dots/Numbers */}
            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-800/80 text-xs">
              <div className="flex items-center gap-1.5">
                {activePassage.questions.map((q, idx) => {
                  const isCurrent = activeQIndex === idx;
                  const ans = selectedAnswers[q.id];
                  const hasAnswered = ans !== undefined;
                  const isRight = ans === q.correctOptionIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        sounds.playClick();
                        setActiveQIndex(idx);
                      }}
                      className={`w-7 h-7 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-neutral-800 text-white border border-neutral-600 shadow-xs'
                          : hasAnswered
                          ? isRight
                            ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/60'
                            : 'bg-rose-950/40 text-rose-400 border border-rose-800/60'
                          : 'bg-black text-neutral-400 border border-neutral-800 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] text-neutral-500 font-mono">1–4 to select</span>
            </div>

            {/* Question Text */}
            {currentQ && (
              <>
                <div>
                  <h2 className="text-base sm:text-lg font-sans font-medium text-neutral-100 leading-relaxed">
                    {currentQ.text}
                  </h2>
                </div>

                {/* Options: Clean full-width rows with minimal 1px neutral borders */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const letter = ['A', 'B', 'C', 'D'][idx];
                    const isPicked = selectedAnswer === idx;
                    const isCorrect = idx === currentQ.correctOptionIndex;

                    let borderClass = 'border-neutral-800 hover:border-neutral-700 bg-black text-neutral-200';
                    if (isAnswered) {
                      if (isCorrect) {
                        borderClass = 'border-emerald-500/80 bg-emerald-950/20 text-emerald-100 font-medium';
                      } else if (isPicked && !isCorrect) {
                        borderClass = 'border-rose-500/80 bg-rose-950/20 text-rose-100';
                      } else {
                        borderClass = 'border-neutral-800/50 bg-black/40 text-neutral-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
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

                {/* Arithmetic Derivation */}
                {isAnswered && (
                  <div className="p-3.5 bg-black border border-neutral-800/90 rounded text-xs space-y-1.5">
                    <div className="text-[11px] text-emerald-400 font-medium tracking-wide">
                      Step-by-Step Derivation
                    </div>
                    <pre className="text-neutral-300 font-sans whitespace-pre-line text-xs leading-relaxed">
                      {currentQ.explanation}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 text-xs">
            <button
              onClick={handlePrev}
              disabled={activeQIndex === 0}
              className="px-3 py-1.5 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded disabled:opacity-30 transition-colors cursor-pointer"
            >
              Previous
            </button>

            <span className="text-neutral-500 font-mono text-xs">
              Question {activeQIndex + 1} of {activePassage.questions.length}
            </span>

            <button
              onClick={handleNext}
              disabled={activeQIndex === activePassage.questions.length - 1}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-medium rounded disabled:opacity-30 transition-colors cursor-pointer"
            >
              Next (Enter)
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
