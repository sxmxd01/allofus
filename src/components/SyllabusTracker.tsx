import React, { useState, useEffect, useRef } from 'react';
import { SyllabusTopic, SubjectType } from '../types';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { fetchSyllabusTopics, updateSyllabusTopicStatus } from '../lib/clatService';
import { supabase } from '../lib/supabase';

interface SyllabusTrackerProps {
  activeUsername: string;
  selectedSubject: SubjectType;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({
  activeUsername,
  selectedSubject,
}) => {
  const [topics, setTopics] = useState<SyllabusTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'remaining' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Search input ref for hotkey '/'
  const searchInputRef = useRef<HTMLInputElement>(null);

  // New Topic Form State
  const [newMonth, setNewMonth] = useState('September 2026');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Landmark Judgments');

  // Hotkey listener: press '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        (e.target as HTMLElement).tagName !== 'INPUT' &&
        (e.target as HTMLElement).tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch topics from Supabase
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      const data = await fetchSyllabusTopics(activeUsername, selectedSubject);
      if (isMounted) {
        setTopics(data);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [activeUsername, selectedSubject]);

  // Toggle month accordion
  const toggleMonthCollapse = (month: string) => {
    sounds.playClick();
    setCollapsedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  };

  // Toggle item checkbox
  const handleToggleCheckbox = async (topic: SyllabusTopic) => {
    const willBeCompleted = !topic.isCompleted;

    if (willBeCompleted) {
      sounds.playCorrect();
    } else {
      sounds.playClick();
    }

    // 1. Optimistic UI update
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topic.id
          ? {
              ...t,
              isCompleted: willBeCompleted,
              status: willBeCompleted ? 'mastered' : 'pending',
            }
          : t
      )
    );

    // 2. Persist to Supabase syllabus_tracker table
    const success = await updateSyllabusTopicStatus(
      topic.id,
      activeUsername,
      willBeCompleted,
      topic.title,
      selectedSubject
    );

    if (success) {
      setSyncToast(`Saved in Supabase for ${activeUsername}`);
      setTimeout(() => setSyncToast(null), 1800);
    }
  };

  // Calculations for overall progress bar: "X of Y topics completed (Z%)"
  const totalCount = topics.length;
  const completedCount = topics.filter((t) => t.isCompleted).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter topics
  const filteredTopics = topics.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'remaining') return !t.isCompleted;
    if (filterMode === 'done') return t.isCompleted;
    return true;
  });

  // Group by month
  const months = Array.from(new Set(topics.map((t) => t.month)));

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    sounds.playCorrect();

    const newId = `topic-${Date.now()}`;
    const newTopic: SyllabusTopic = {
      id: newId,
      subject: selectedSubject,
      month: newMonth,
      title: newTitle.trim(),
      category: newCategory,
      status: 'pending',
      isCompleted: false,
    };

    setTopics((prev) => [newTopic, ...prev]);
    setShowAddModal(false);

    try {
      await supabase.from('syllabus_tracker').insert({
        id: newId,
        user_name: activeUsername,
        subject: selectedSubject,
        topic_name: newTitle.trim(),
        is_completed: false,
      });
    } catch {}

    setNewTitle('');
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-4 font-mono select-none">
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed top-14 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-[#050505] border border-emerald-500 text-emerald-400 text-xs font-mono">
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TOP CONTROLS (gktrck.vercel.app terminal aesthetic)       */}
      {/* ======================================================== */}
      <div className="bg-[#050505] border border-neutral-800 p-4 mb-4 space-y-3">
        {/* Progress Summary: "X of Y topics completed (Z%)" */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
            <div className="flex items-center gap-2">
              <span className="text-neutral-300">
                <span className="text-emerald-400 font-semibold font-mono">{completedCount}</span> of{' '}
                <span className="font-mono">{totalCount}</span> topics completed
              </span>
              <span className="text-emerald-400 font-medium font-mono text-[11px]">
                ({percentage}%)
              </span>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                setShowAddModal(true);
              }}
              className="text-neutral-400 hover:text-emerald-400 text-xs transition-colors cursor-pointer"
            >
              + Add topic
            </button>
          </div>

          {/* Clean Progress Bar */}
          <div className="w-full h-1.5 bg-neutral-900 border border-neutral-800 rounded-xs overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Filter Pills [All] | [Remaining] | [Done] & Search with '/' hotkey */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 font-sans">
            {(['all', 'remaining', 'done'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  sounds.playClick();
                  setFilterMode(mode);
                }}
                className={`px-2.5 py-1 text-xs capitalize rounded-xs border transition-colors cursor-pointer ${
                  filterMode === mode
                    ? 'bg-neutral-800 border-neutral-700 text-white font-medium'
                    : 'bg-black border-neutral-800/80 text-neutral-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Search bar with hotkey '/' */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (press '/' to focus)..."
              className="w-full pl-8 pr-7 py-1 bg-black border border-neutral-800 focus:border-neutral-600 text-xs font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none"
            />
            <kbd className="hidden sm:inline-block absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500 font-mono">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ACCORDION LIST: Clean High-Density Checklist */}
      {/* ======================================================== */}
      {isLoading ? (
        <div className="p-12 text-center text-zinc-500 font-mono text-xs flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Loading syllabus checklist...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {months.map((month) => {
            const monthTopics = filteredTopics.filter((t) => t.month === month);
            if (monthTopics.length === 0) return null;

            const monthDone = monthTopics.filter((t) => t.isCompleted).length;
            const isCollapsed = collapsedMonths.has(month);

            return (
              <div
                key={month}
                className="bg-[#050505] border border-neutral-800"
              >
                {/* Collapsible Month Header */}
                <button
                  onClick={() => toggleMonthCollapse(month)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-black hover:bg-neutral-900 border-b border-neutral-800 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs text-neutral-200">
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    <span className="font-medium font-sans">
                      {month}
                    </span>
                    <span className="text-neutral-500 font-mono text-[11px]">
                      ({monthDone}/{monthTopics.length} completed)
                    </span>
                  </div>

                  <span className="text-xs font-mono text-neutral-500 hidden sm:inline tabular-nums">
                    {Math.round((monthDone / monthTopics.length) * 100)}%
                  </span>
                </button>

                {/* High-Density Checklist Items */}
                {!isCollapsed && (
                  <div className="divide-y divide-neutral-900">
                    {monthTopics.map((topic, idx) => {
                      const itemNum = (idx + 1).toString().padStart(2, '0');
                      const isDone = !!topic.isCompleted;

                      return (
                        <div
                          key={topic.id}
                          onClick={() => handleToggleCheckbox(topic)}
                          className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-neutral-950 cursor-pointer transition-colors group select-none"
                        >
                          {/* Square Checkbox on the left */}
                          <div
                            className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                              isDone
                                ? 'bg-emerald-500 border-emerald-400 text-black'
                                : 'border-neutral-700 bg-black group-hover:border-neutral-500'
                            }`}
                          >
                            {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>

                          {/* Topic Number */}
                          <span
                            className={`font-mono text-xs tabular-nums shrink-0 ${
                              isDone ? 'text-neutral-600' : 'text-neutral-500'
                            }`}
                          >
                            {itemNum}.
                          </span>

                          {/* Topic Title */}
                          <span
                            className={`text-xs font-sans flex-1 leading-snug transition-all ${
                              isDone
                                ? 'line-through text-neutral-500 opacity-60'
                                : 'text-neutral-200 group-hover:text-white'
                            }`}
                          >
                            {topic.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 sm:p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold font-mono text-white mb-3">Add Syllabus Checklist Item</h3>
            <form onSubmit={handleCreateTopic} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Month / Batch</label>
                <input
                  type="text"
                  value={newMonth}
                  onChange={(e) => setNewMonth(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs font-mono text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Topic Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Criminal Law Amendment (BNS Section 152)"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder:text-zinc-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono"
                >
                  Add to Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
