import React from 'react';
import { SubjectType, GKSubTab, QTSubTab, SquadMember, SQUAD_MEMBERS, UserProfile } from '../types';
import { Volume2, VolumeX, LogOut, Upload, BrainCircuit } from 'lucide-react';
import { sounds } from '../utils/sound';
import { JennyMascot } from './JennyMascot';

interface HeaderNavProps {
  selectedSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  activeGKTab: GKSubTab;
  onSelectGKTab: (tab: GKSubTab) => void;
  activeQTTab?: QTSubTab;
  onSelectQTTab?: (tab: QTSubTab) => void;
  totalSolved: number;
  targetTotal: number;
  activeUsername: SquadMember;
  userProfile?: UserProfile | null;
  onOpenProfile: () => void;
  onLogout: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenImport: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  selectedSubject,
  onSelectSubject,
  activeGKTab,
  onSelectGKTab,
  activeQTTab = 'drill',
  onSelectQTTab,
  totalSolved,
  targetTotal,
  activeUsername,
  userProfile,
  onOpenProfile,
  onLogout,
  soundEnabled,
  onToggleSound,
  onOpenImport,
}) => {
  const userInfo = SQUAD_MEMBERS[activeUsername];
  const displayName = userProfile?.display_name || activeUsername;

  const subjects: { id: SubjectType; label: string }[] = [
    { id: 'gk', label: 'GK' },
    { id: 'quants', label: 'QT' },
    { id: 'analytical', label: 'AR' },
  ];

  const gkSubTabs: { id: GKSubTab; label: string }[] = [
    { id: 'topics', label: 'Topics' },
    { id: 'qb', label: 'QB' },
    { id: 'oneliners', label: 'Oneliners' },
    { id: 'dump', label: 'Live Dump' },
  ];

  const qtSubTabs: { id: QTSubTab; label: string; badge?: string }[] = [
    { id: 'drill', label: 'Caselet Drill' },
    { id: 'mental_math', label: 'Mental Math', badge: 'Zen' },
  ];

  return (
    <header className="border-b border-border bg-panel/95 backdrop-blur sticky top-0 z-40 w-full overflow-x-hidden transition-colors">
      {/* Top Bar: Jenny Mascot Brand, 3 Primary Subjects (GK, QT, AR), Minimal Right Utilities */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 flex items-center justify-between gap-2">
        {/* Left: Jenny Mascot & Primary Subjects */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <div
            className="flex items-center gap-2 font-medium text-sm text-main tracking-tight shrink-0 cursor-pointer"
            title="Jenny The Cat Mascot"
          >
            <JennyMascot size="sm" />
            <span className="font-semibold text-main tracking-wide text-xs sm:text-sm hidden xs:inline">
              Jenny
            </span>
          </div>

          {/* Primary Subjects (GK, QT, AR) - Borderless clean tabs with touch scrolling */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {subjects.map((subj) => {
              const isSelected = selectedSubject === subj.id;
              return (
                <button
                  key={subj.id}
                  onClick={() => {
                    sounds.playClick();
                    onSelectSubject(subj.id);
                  }}
                  className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[32px] flex items-center justify-center ${
                    isSelected
                      ? 'bg-hover text-main font-semibold shadow-xs border border-border'
                      : 'text-muted hover:text-main hover:bg-hover/60'
                  }`}
                >
                  {subj.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Utility Area: Solved Counter, Sound, User with Avatar (Click opens Profile Modal), Logout */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted shrink-0">
          {/* Import Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenImport();
            }}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs text-main hover:text-accent bg-hover hover:bg-hover border border-border rounded transition-colors cursor-pointer min-h-[32px]"
            title="Open Deterministic Import GUI"
          >
            <Upload className="w-3 h-3 text-accent" />
            <span className="font-mono text-[11px] hidden sm:inline">Import</span>
          </button>

          {/* Minimal Solved Counter with Tabular Digits */}
          <div className="font-mono text-[11px] text-muted tabular-nums hidden xs:flex items-center">
            <span className="text-main font-medium">{totalSolved.toLocaleString()}</span>
            <span className="text-muted/60 mx-1">/</span>
            <span>{targetTotal.toLocaleString()}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="text-muted hover:text-main transition-colors cursor-pointer p-1 min-h-[32px] flex items-center justify-center"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-main" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-muted" />
            )}
          </button>

          {/* User Indicator (display_name & avatar) - Clicking opens Profile Edit Modal */}
          <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-border">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenProfile();
              }}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer group"
              title="Click to Edit Profile & Theme"
            >
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt={displayName}
                  className="w-5 h-5 rounded-full object-cover border border-border shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-black shrink-0"
                  style={{ backgroundColor: userInfo?.color || 'var(--accent)' }}
                >
                  {displayName[0] || 'U'}
                </span>
              )}

              <span className="text-main text-xs font-medium max-w-[70px] sm:max-w-none truncate group-hover:text-accent">
                {displayName}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="text-muted hover:text-rose-400 p-1 transition-colors cursor-pointer min-h-[32px] flex items-center justify-center"
              title="Log out"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Sub-Navigation: Rendered ONLY when GK is selected: Topics · QB · Oneliners · Live Dump */}
      {selectedSubject === 'gk' && (
        <div className="border-t border-border bg-background w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 h-9 flex items-center">
            <nav className="flex items-center gap-4 sm:gap-6 text-xs overflow-x-auto no-scrollbar py-1 w-full">
              {gkSubTabs.map((tab) => {
                const isActive = activeGKTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sounds.playClick();
                      onSelectGKTab(tab.id);
                    }}
                    className={`relative py-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'text-main font-medium'
                        : 'text-muted hover:text-main'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Secondary Sub-Navigation: Rendered when QT is selected: Caselet Drill · Mental Math Arena */}
      {selectedSubject === 'quants' && (
        <div className="border-t border-border bg-background w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 h-9 flex items-center justify-between">
            <nav className="flex items-center gap-4 sm:gap-6 text-xs overflow-x-auto no-scrollbar py-1">
              {qtSubTabs.map((tab) => {
                const isActive = activeQTTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sounds.playClick();
                      if (onSelectQTTab) onSelectQTTab(tab.id);
                    }}
                    className={`relative py-1 transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? 'text-main font-medium'
                        : 'text-muted hover:text-main'
                    }`}
                  >
                    {tab.id === 'mental_math' && <BrainCircuit className="w-3.5 h-3.5 text-accent" />}
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-accent/15 border border-accent/40 text-accent uppercase font-bold">
                        {tab.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent" />
                    )}
                  </button>
                );
              })}
            </nav>

            <span className="text-[11px] font-mono text-muted hidden sm:inline">
              100-Level Rapid Arena
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderNav;
