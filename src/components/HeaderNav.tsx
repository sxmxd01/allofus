import React from 'react';
import { SubjectType, GKSubTab, SquadMember, SQUAD_MEMBERS } from '../types';
import { Volume2, VolumeX, LogOut, Heart, Upload } from 'lucide-react';
import { sounds } from '../utils/sound';

interface HeaderNavProps {
  selectedSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  activeGKTab: GKSubTab;
  onSelectGKTab: (tab: GKSubTab) => void;
  totalSolved: number;
  targetTotal: number;
  activeUsername: SquadMember;
  onLogout: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  pinkThemeEnabled: boolean;
  onTogglePinkTheme: () => void;
  onOpenImport: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  selectedSubject,
  onSelectSubject,
  activeGKTab,
  onSelectGKTab,
  totalSolved,
  targetTotal,
  activeUsername,
  onLogout,
  soundEnabled,
  onToggleSound,
  pinkThemeEnabled,
  onTogglePinkTheme,
  onOpenImport,
}) => {
  const userInfo = SQUAD_MEMBERS[activeUsername];

  const subjects: { id: SubjectType; label: string }[] = [
    { id: 'gk', label: 'GK' },
    { id: 'quants', label: 'QT' },
    { id: 'analytical', label: 'AR' },
  ];

  const gkSubTabs: { id: GKSubTab; label: string }[] = [
    { id: 'topics', label: 'Topics' },
    { id: 'qb', label: 'QB' },
    { id: 'oneliners', label: 'Oneliners' },
  ];

  return (
    <header className="border-b border-neutral-800/80 bg-black/95 backdrop-blur sticky top-0 z-40">
      {/* Top Bar: Brand, 3 Primary Subjects (GK, QT, AR), Minimal Right Utilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
        {/* Left: Understated Brand Mark */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-medium text-sm text-neutral-200 tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-white">CLAT</span>
          </div>

          {/* Primary Subjects (GK, QT, AR) - Borderless clean tabs */}
          <nav className="flex items-center gap-1">
            {subjects.map((subj) => {
              const isSelected = selectedSubject === subj.id;
              return (
                <button
                  key={subj.id}
                  onClick={() => {
                    sounds.playClick();
                    onSelectSubject(subj.id);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
                  }`}
                >
                  {subj.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Utility Area: Solved Counter, Sound, User with Logout */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs text-neutral-400">
          {/* Import Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenImport();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 rounded transition-colors cursor-pointer"
            title="Open Deterministic Import GUI"
          >
            <Upload className="w-3 h-3 text-emerald-400" />
            <span className="font-mono text-[11px]">Import</span>
          </button>

          {/* Sadvitha Pink Theme Toggle */}
          {activeUsername === 'Sadvitha' && (
            <button
              onClick={onTogglePinkTheme}
              className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                pinkThemeEnabled ? 'text-pink-400' : 'text-neutral-500 hover:text-pink-300'
              }`}
              title="Toggle theme"
            >
              <Heart className={`w-3.5 h-3.5 ${pinkThemeEnabled ? 'fill-pink-400' : ''}`} />
            </button>
          )}

          {/* Minimal Solved Counter */}
          <div className="font-mono text-[11px] text-neutral-400 tabular-nums">
            <span className="text-neutral-200 font-medium">{totalSolved.toLocaleString()}</span>
            <span className="text-neutral-600 mx-1">/</span>
            <span>{targetTotal.toLocaleString()}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-neutral-300" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-neutral-600" />
            )}
          </button>

          {/* User Indicator + Minimal Logout Icon */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: userInfo.color }}
              />
              <span className="text-neutral-200 text-xs font-medium">{activeUsername}</span>
            </div>

            <button
              onClick={onLogout}
              className="text-neutral-500 hover:text-neutral-300 p-0.5 transition-colors cursor-pointer"
              title="Log out"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Sub-Navigation: Rendered ONLY when GK is selected: Topics · QB · Oneliners */}
      {selectedSubject === 'gk' && (
        <div className="border-t border-neutral-800/60 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center gap-6">
            <nav className="flex items-center gap-4 text-xs">
              {gkSubTabs.map((tab) => {
                const isActive = activeGKTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sounds.playClick();
                      onSelectGKTab(tab.id);
                    }}
                    className={`relative py-1 transition-colors cursor-pointer ${
                      isActive
                        ? 'text-white font-medium'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
