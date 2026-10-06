import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SubjectType } from '../types';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  Plus,
  ChevronsUpDown,
  BookOpen,
} from 'lucide-react';
import { sounds } from '../utils/sound';
import {
  MONTHLY_GK_BATCHES,
  MonthlyGkBatch,
  MonthlyGkTopicItem,
} from '../data/monthlyGkData';

interface SyllabusTrackerProps {
  activeUsername: string;
  selectedSubject: SubjectType;
}

interface CustomTopicItem extends MonthlyGkTopicItem {
  monthName: string;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({
  activeUsername,
}) => {
  // 1. Completion state stored in localStorage per user
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`clat_gk_tracker_completed_${activeUsername}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return new Set(parsed);
        }
      } catch {}
    }
    return new Set<string>();
  });

  // 2. Custom topics stored in localStorage per user
  const [customTopics, setCustomTopics] = useState<CustomTopicItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`clat_gk_tracker_custom_${activeUsername}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {}
    }
    return [];
  });

  const [filterMode, setFilterMode] = useState<'all' | 'remaining' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // Newest first by default

  const searchInputRef = useRef<HTMLInputElement>(null);

  // New Topic Form State
  const [newMonthName, setNewMonthName] = useState('September 2026');
  const [newTitle, setNewTitle] = useState('');

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

  // Sync completed topics to localStorage whenever changed
  const toggleTopicCompletion = (topicId: string) => {
    setCompletedTopicIds((prev) => {
      const next = new Set(prev);
      const isNowCompleted = !next.has(topicId);
      if (isNowCompleted) {
        next.add(topicId);
        sounds.playCorrect();
      } else {
        next.delete(topicId);
        sounds.playClick();
      }

      try {
        localStorage.setItem(
          `clat_gk_tracker_completed_${activeUsername}`,
          JSON.stringify(Array.from(next))
        );
      } catch {}

      return next;
    });

    setSyncToast(`Saved locally for ${activeUsername}`);
    setTimeout(() => setSyncToast(null), 1400);
  };

  // Toggle month collapse
  const toggleMonthCollapse = (monthId: string) => {
    sounds.playClick();
    setCollapsedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(monthId)) next.delete(monthId);
      else next.add(monthId);
      return next;
    });
  };

  // Expand / Collapse all months
  const toggleAllMonths = () => {
    sounds.playClick();
    if (collapsedMonths.size === MONTHLY_GK_BATCHES.length) {
      setCollapsedMonths(new Set());
    } else {
      setCollapsedMonths(new Set(MONTHLY_GK_BATCHES.map((b) => b.id)));
    }
  };

  // Add custom topic
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sounds.playCorrect();
    const newTopic: CustomTopicItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: newTitle.trim(),
      monthName: newMonthName,
    };

    const updated = [newTopic, ...customTopics];
    setCustomTopics(updated);
    try {
      localStorage.setItem(
        `clat_gk_tracker_custom_${activeUsername}`,
        JSON.stringify(updated)
      );
    } catch {}

    setNewTitle('');
    setShowAddModal(false);
    setSyncToast(`Added topic for ${activeUsername}`);
    setTimeout(() => setSyncToast(null), 1400);
  };

  // Assemble full month batches with custom topics included
  const batches = useMemo(() => {
    const list: MonthlyGkBatch[] = MONTHLY_GK_BATCHES.map((b) => {
      const batchCustom = customTopics.filter((c) => c.monthName.toLowerCase() === b.name.toLowerCase());
      return {
        id: b.id,
        name: b.name,
        topics: [...batchCustom, ...b.topics],
      };
    });

    if (sortOrder === 'desc') {
      return [...list].reverse();
    }
    return list;
  }, [customTopics, sortOrder]);

  // Overall Statistics across all hardcoded topics
  const allTopics = useMemo(() => {
    return batches.flatMap((b) => b.topics);
  }, [batches]);

  const totalCount = allTopics.length;
  const completedCount = useMemo(() => {
    return allTopics.filter((t) => completedTopicIds.has(t.id)).length;
  }, [allTopics, completedTopicIds]);

  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return batches
      .map((batch) => {
        const matchingTopics = batch.topics.filter((t) => {
          const isDone = completedTopicIds.has(t.id);
          if (filterMode === 'remaining' && isDone) return false;
          if (filterMode === 'done' && !isDone) return false;
          if (q && !t.title.toLowerCase().includes(q)) return false;
          return true;
        });

        return {
          ...batch,
          topics: matchingTopics,
          rawTotalInBatch: batch.topics.length,
          completedInBatch: batch.topics.filter((t) => completedTopicIds.has(t.id)).length,
        };
      })
      .filter((batch) => batch.topics.length > 0 || (searchQuery === '' && filterMode === 'all'));
  }, [batches, searchQuery, filterMode, completedTopicIds]);

  return (
    <div className="max-w-[1000px] mx-auto px-3 sm:px-6 py-4 font-sans select-none w-full overflow-x-hidden">
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed top-14 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-panel border border-accent text-accent text-xs font-sans rounded shadow-lg animate-in fade-in duration-150">
          <Check className="w-3.5 h-3.5 text-accent" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TOP CONTROLS: Clean Academic Monthly GK Tracker          */}
      {/* ======================================================== */}
      <div className="bg-panel border border-border p-4 mb-4 space-y-3.5 rounded-lg shadow-sm transition-colors">
        {/* Progress Summary: "X of Y topics completed (Z%)" */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
            <div className="flex items-center gap-2 flex-wrap">
              <BookOpen className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-muted">
                <span className="text-accent font-semibold font-mono">{completedCount}</span> of{' '}
                <span className="font-mono text-main">{totalCount}</span> monthly topics completed
              </span>
              <span className="text-accent font-medium font-mono text-[11px]">
                ({percentage}%)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleAllMonths}
                className="text-muted hover:text-main text-xs transition-colors cursor-pointer hidden xs:flex items-center gap-1"
                title="Expand or collapse all months"
              >
                <ChevronsUpDown className="w-3.5 h-3.5 text-muted" />
                <span>{collapsedMonths.size === MONTHLY_GK_BATCHES.length ? 'Expand All' : 'Collapse All'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowAddModal(true);
                }}
                className="text-accent hover:opacity-80 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add topic</span>
              </button>
            </div>
          </div>

          {/* Clean Progress Bar */}
          <div className="w-full h-1.5 bg-background border border-border rounded-xs overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Filter Pills [All] | [Remaining] | [Done] & Search with '/' hotkey */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Filter Pills & Sort toggle */}
          <div className="flex items-center gap-1.5 font-sans overflow-x-auto no-scrollbar">
            {(['all', 'remaining', 'done'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setFilterMode(mode);
                }}
                className={`px-2.5 py-1 text-xs capitalize rounded border transition-colors cursor-pointer shrink-0 ${
                  filterMode === mode
                    ? 'bg-hover border-border text-main font-medium'
                    : 'bg-background border-border text-muted hover:text-main'
                }`}
              >
                {mode}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
              }}
              className="px-2 py-1 text-[11px] rounded border border-border text-muted hover:text-main transition-colors cursor-pointer shrink-0 bg-background"
              title="Toggle newest or chronological month order"
            >
              {sortOrder === 'desc' ? 'Sep → Jan' : 'Jan → Sep'}
            </button>
          </div>

          {/* Search bar with hotkey '/' */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 328 monthly topics ('/' to focus)..."
              className="w-full pl-8 pr-7 py-1 bg-background border border-border focus:border-accent text-xs font-sans text-main placeholder:text-muted/50 focus:outline-none rounded transition-colors"
            />
            <kbd className="hidden sm:inline-block absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted font-mono">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ACCORDION LIST: 9 Hardcoded Monthly Batches               */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {filteredBatches.map((batch) => {
          const isCollapsed = collapsedMonths.has(batch.id);
          const monthPct =
            batch.rawTotalInBatch > 0
              ? Math.round((batch.completedInBatch / batch.rawTotalInBatch) * 100)
              : 0;

          return (
            <div
              key={batch.id}
              className="bg-panel border border-border rounded-lg overflow-hidden shadow-xs transition-colors"
            >
              {/* Collapsible Month Header */}
              <button
                type="button"
                onClick={() => toggleMonthCollapse(batch.id)}
                className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 px-3.5 py-2.5 bg-background hover:bg-hover border-b border-border text-left transition-colors cursor-pointer"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-main min-w-0">
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-accent shrink-0" />
                  )}
                  <span className="font-medium font-sans break-words text-main">
                    {batch.name}
                  </span>
                  <span className="text-muted font-mono text-[11px] whitespace-nowrap">
                    ({batch.completedInBatch}/{batch.rawTotalInBatch} completed)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted tabular-nums">
                    {monthPct}%
                  </span>
                </div>
              </button>

              {/* High-Density Checklist Items */}
              {!isCollapsed && (
                <div className="divide-y divide-border">
                  {batch.topics.map((topic, idx) => {
                    const itemNum = (idx + 1).toString().padStart(2, '0');
                    const isDone = completedTopicIds.has(topic.id);

                    return (
                      <div
                        key={topic.id}
                        onClick={() => toggleTopicCompletion(topic.id)}
                        className="flex items-start sm:items-center gap-3 px-3.5 py-2.5 hover:bg-hover cursor-pointer transition-colors group select-none min-h-[2.5rem]"
                      >
                        {/* Square Checkbox on the left */}
                        <div
                          className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors mt-0.5 sm:mt-0 rounded-xs ${
                            isDone
                              ? 'bg-accent border-accent text-black'
                              : 'border-border bg-background group-hover:border-accent'
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        {/* Topic Number */}
                        <span
                          className={`font-mono text-xs tabular-nums shrink-0 mt-0.5 sm:mt-0 ${
                            isDone ? 'text-muted opacity-50' : 'text-muted'
                          }`}
                        >
                          {itemNum}.
                        </span>

                        {/* Topic Title with clean word-wrapping */}
                        <span
                          className={`text-xs font-sans flex-1 leading-relaxed break-words whitespace-normal transition-all ${
                            isDone
                              ? 'line-through text-muted opacity-50'
                              : 'text-main group-hover:text-accent'
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

      {/* Add Topic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans">
          <div className="bg-panel border border-border rounded-xl p-5 sm:p-6 max-w-md w-full shadow-2xl transition-colors">
            <h3 className="text-base font-semibold text-main mb-3">Add Custom Topic</h3>
            <form onSubmit={handleCreateTopic} className="space-y-3.5">
              <div>
                <label className="block text-xs font-sans text-muted mb-1">Month / Batch</label>
                <select
                  value={newMonthName}
                  onChange={(e) => setNewMonthName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-xs text-main focus:outline-none focus:border-accent"
                >
                  {MONTHLY_GK_BATCHES.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans text-muted mb-1">Topic Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Major Infrastructure and Connectivity Projects in India"
                  required
                  className="w-full px-3 py-2 bg-background border border-border rounded text-xs text-main placeholder:text-muted/50 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-muted hover:text-main cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: 'var(--accent-gradient, var(--accent))' }}
                  className="px-4 py-1.5 text-black font-medium text-xs rounded transition-opacity hover:opacity-90 cursor-pointer shadow-xs"
                >
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusTracker;
