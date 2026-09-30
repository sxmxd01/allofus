import React, { useState, useRef, useEffect } from 'react';
import { TabType, SubjectType } from '../types';
import { subjectsList } from '../data/mockData';
import {
  BookOpen,
  Zap,
  CheckSquare,
  Terminal,
  Volume2,
  VolumeX,
  Shield,
  RotateCcw,
  ChevronDown,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface TopNavProps {
  selectedSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  totalSolved: number;
  targetTotal: number;
  activeUsername: string;
  onChangeActiveUser: (username: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetProgress: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  selectedSubject,
  onSelectSubject,
  activeTab,
  setActiveTab,
  totalSolved,
  targetTotal,
  activeUsername,
  onChangeActiveUser,
  soundEnabled,
  onToggleSound,
  onResetProgress,
}) => {
  const percentage = Math.min(100, Math.round((totalSolved / targetTotal) * 1000) / 10);
  const remaining = Math.max(0, targetTotal - totalSolved);

  // Active User Dropdown state
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [customNameInput, setCustomNameInput] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const presetUsers = ['Samad', 'Sadvitha', 'Shourya', 'Avni'];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectUser = (name: string) => {
    sounds.playClick();
    onChangeActiveUser(name);
    setUserDropdownOpen(false);
  };

  const handleAddCustomUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNameInput.trim()) return;
    sounds.playClick();
    onChangeActiveUser(customNameInput.trim());
    setCustomNameInput('');
    setUserDropdownOpen(false);
  };

  // Tab definitions: Sprint Mode is ONLY rendered when selectedSubject is 'gk'
  const allTabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'syllabus', label: 'Syllabus Tracker', icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { id: 'drill', label: 'Drill Mode', icon: <BookOpen className="w-3.5 h-3.5" />, badge: 'Passage View' },
    ...(selectedSubject === 'gk'
      ? [
          {
            id: 'sprint' as TabType,
            label: 'Sprint Mode',
            icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
            badge: '⚡ Speed',
          },
        ]
      : []),
    { id: 'dump', label: 'Live Dump', icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  return (
    <header className="border-b border-zinc-800 bg-black/95 backdrop-blur-md sticky top-0 z-50">
      {/* 1. TOP BRAND & SUBJECT SELECTOR BAR */}
      <div className="max-w-[1536px] mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Brand & Active User / Controls on Mobile */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono font-bold text-xs sm:text-sm tracking-wider text-zinc-100">
                CLAT<span className="text-emerald-400">::</span>TERMINAL
              </span>
            </div>
          </div>

          {/* User Status & Sound Controls (with interactive Active User selector) */}
          <div className="flex items-center gap-2">
            {/* Dynamic Active User Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-[11px] font-mono text-zinc-200 active:scale-95 touch-manipulation transition-all min-h-[36px]"
                title="Switch active user profile"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="hidden sm:inline text-zinc-400">Active:</span>
                <span className="text-zinc-100 font-bold truncate max-w-[85px] sm:max-w-none">
                  {activeUsername}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-56 rounded-lg bg-zinc-950 border border-zinc-700 shadow-2xl p-2 z-50 animate-fade-in font-sans">
                  <div className="px-2 py-1.5 text-[10px] font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800/80 mb-1">
                    Select Active User
                  </div>

                  <div className="space-y-1">
                    {presetUsers.map((user) => (
                      <button
                        key={user}
                        onClick={() => handleSelectUser(user)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                          activeUsername === user
                            ? 'bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-bold'
                            : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 font-mono text-[10px]">👤</span>
                          <span>{user}</span>
                        </div>
                        {activeUsername === user && <UserCheck className="w-3.5 h-3.5 text-cyan-400" />}
                      </button>
                    ))}
                  </div>

                  {/* Add Custom User */}
                  <form onSubmit={handleAddCustomUser} className="mt-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={customNameInput}
                        onChange={(e) => setCustomNameInput(e.target.value)}
                        placeholder="Add custom user..."
                        className="flex-1 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                        title="Switch to custom name"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 active:scale-95 touch-manipulation transition-transform min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={onResetProgress}
              title="Reset solved count"
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 active:scale-95 touch-manipulation transition-transform min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PRIMARY SUBJECT SELECTOR (Subject-First Routing) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mr-1 shrink-0 hidden lg:inline">
            Subject:
          </span>
          {subjectsList.map((subj) => {
            const isSelected = selectedSubject === subj.id;
            return (
              <button
                key={subj.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectSubject(subj.id);
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-mono font-medium whitespace-nowrap active:scale-95 touch-manipulation transition-all shrink-0 min-h-[38px] ${
                  isSelected
                    ? 'bg-zinc-800 text-white border border-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-semibold'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-zinc-800/80'
                }`}
              >
                <span className={isSelected ? 'text-emerald-400' : 'text-zinc-500'}>●</span>
                <span className="sm:hidden">{subj.shortLabel}</span>
                <span className="hidden sm:inline">{subj.label}</span>
                {subj.id === 'gk' && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 hidden md:inline">
                    Sprint
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SUB-VIEW TABS BAR & PROGRESS TICKER */}
      <div className="border-t border-zinc-800/80 bg-zinc-950/80 px-3 sm:px-6 py-2">
        <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Sub-views Tabs for the currently selected Subject */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
            {allTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap active:scale-95 touch-manipulation transition-all shrink-0 min-h-[38px] ${
                    isActive
                      ? 'bg-zinc-800 text-white border border-zinc-700 font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[9px] uppercase tracking-wider px-1 py-0.2 rounded bg-zinc-900 text-zinc-300 border border-zinc-700 font-mono hidden sm:inline">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Solved Progress Ticker (Responsive & Compact) */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs font-mono shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-[11px] sm:text-xs">Solved:</span>
              <span className="font-bold text-white text-xs sm:text-sm tabular-nums">
                {totalSolved.toLocaleString()}
              </span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400 text-xs tabular-nums">{targetTotal.toLocaleString()}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 tabular-nums">
                {percentage}%
              </span>
            </div>
            <div className="w-16 sm:w-28 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
