import React, { useState } from 'react';
import { BankQuestion, SubjectType, QuestionDifficulty } from '../types';
import { bankQuestions } from '../data/mockData';
import {
  Search,
  BookOpen,
  ArrowRight,
  Filter,
  CheckCircle2,
  HelpCircle,
  Folder,
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface QuestionBankProps {
  selectedSubject: SubjectType;
  onLaunchPractice: (questionId?: string) => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  selectedSubject,
  onLaunchPractice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | QuestionDifficulty>('ALL');

  // Filter questions for the selected subject
  const subjectQuestions = bankQuestions.filter((q) => q.subject === selectedSubject);

  // Group categories with question counts for the Left Sidebar
  const categoryCounts: Record<string, number> = { All: subjectQuestions.length };
  subjectQuestions.forEach((q) => {
    categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
  });

  const categories = Object.keys(categoryCounts);

  // Filter questions based on search, category, and difficulty
  const filteredQuestions = subjectQuestions.filter((q) => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesDifficulty = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    const matchesSearch =
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subtopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="max-w-[1536px] mx-auto px-3 sm:px-6 py-5 font-sans">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 items-start">
        {/* ======================================================== */}
        {/* LEFT SIDEBAR: Categories & Counts (Match mockqs.vercel.app) */}
        {/* ======================================================== */}
        <aside className="w-full lg:col-span-3 bg-zinc-950 border border-zinc-800 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-3 shadow-md">
          <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-800/80">
            <Folder className="w-4 h-4 text-emerald-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">
              Categories & Modules
            </h3>
          </div>

          <div className="space-y-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-mono active:scale-95 touch-manipulation transition-all min-h-[36px] ${
                    isSelected
                      ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <span className="truncate pr-2">{cat}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] tabular-nums shrink-0 ${
                      isSelected
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    {categoryCounts[cat]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Launch Practice All Button */}
          <div className="pt-3 border-t border-zinc-800/80">
            <button
              onClick={() => {
                sounds.playClick();
                onLaunchPractice();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono active:scale-95 touch-manipulation transition-all shadow-[0_0_12px_rgba(34,197,94,0.3)] min-h-[42px]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Launch Drill Mode</span>
            </button>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* RIGHT AREA: Directory Table & Search/Filter Controls */}
        {/* ======================================================== */}
        <main className="w-full lg:col-span-9 bg-zinc-950 border border-zinc-800 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
          {/* Controls: Search Bar & Difficulty Filter Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, keyword, or subtopic..."
                className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-lg text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none min-h-[38px]"
              />
            </div>

            {/* Difficulty Filter Pills ([ALL] | [Easy] | [Moderate] | [Hard]) */}
            <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800 overflow-x-auto no-scrollbar">
              {(['ALL', 'Easy', 'Moderate', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    sounds.playClick();
                    setDifficultyFilter(diff);
                  }}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-mono active:scale-95 touch-manipulation transition-all min-h-[32px] ${
                    difficultyFilter === diff
                      ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Table (Match mockqs.vercel.app) */}
          <div className="overflow-x-auto rounded-lg border border-zinc-800/80">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 font-mono text-[11px] text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">#ID</th>
                  <th className="py-2.5 px-3">Question Description</th>
                  <th className="py-2.5 px-3 hidden md:table-cell">Subtopic</th>
                  <th className="py-2.5 px-3">Difficulty</th>
                  <th className="py-2.5 px-3 hidden sm:table-cell">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-500 font-mono text-xs">
                      No questions matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredQuestions.map((q) => {
                    let diffBadge = 'bg-emerald-950 text-emerald-400 border-emerald-800';
                    if (q.difficulty === 'Moderate') {
                      diffBadge = 'bg-amber-950 text-amber-400 border-amber-800';
                    } else if (q.difficulty === 'Hard') {
                      diffBadge = 'bg-rose-950 text-rose-400 border-rose-800';
                    }

                    return (
                      <tr
                        key={q.id}
                        className="hover:bg-zinc-900/40 transition-colors group"
                      >
                        {/* #ID */}
                        <td className="py-3 px-3 font-mono font-bold text-zinc-300 whitespace-nowrap">
                          {q.id}
                        </td>

                        {/* Question Description */}
                        <td className="py-3 px-3 min-w-[200px] max-w-[360px]">
                          <p className="line-clamp-2 text-zinc-200 group-hover:text-white leading-snug">
                            {q.text}
                          </p>
                        </td>

                        {/* Subtopic */}
                        <td className="py-3 px-3 font-mono text-zinc-400 hidden md:table-cell whitespace-nowrap">
                          {q.subtopic}
                        </td>

                        {/* Difficulty */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${diffBadge}`}
                          >
                            {q.difficulty}
                          </span>
                        </td>

                        {/* Solved/Missed Status */}
                        <td className="py-3 px-3 hidden sm:table-cell whitespace-nowrap">
                          <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600" />
                            <span>Unsolved</span>
                          </span>
                        </td>

                        {/* Practice Button */}
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => {
                              sounds.playClick();
                              onLaunchPractice(q.id);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] active:scale-95 touch-manipulation transition-colors"
                          >
                            <span>Practice</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-2">
            <span>Showing {filteredQuestions.length} of {subjectQuestions.length} questions</span>
            <span className="text-emerald-500">● Live Directory Mode</span>
          </div>
        </main>
      </div>
    </div>
  );
};
