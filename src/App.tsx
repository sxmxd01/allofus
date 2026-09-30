import React, { useState, useEffect } from 'react';
import { SubjectType, GKSubTab, SquadMember } from './types';
import { HeaderNav } from './components/HeaderNav';
import { LoginScreen } from './components/LoginScreen';
import { SyllabusTracker } from './components/SyllabusTracker';
import { GKQuestionBank } from './components/GKQuestionBank';
import { OnelinersWorkbench } from './components/OnelinersWorkbench';
import { QuantsDrill } from './components/QuantsDrill';
import { AnalyticalDrill } from './components/AnalyticalDrill';
import { PetalCanvas } from './components/PetalCanvas';
import { ImportPage } from './components/ImportPage';
import { sounds } from './utils/sound';

export const App: React.FC = () => {
  // Routing: /import route vs main dashboard
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
  };

  // 1. Squad Member Authentication State
  // If no user found in localStorage, defaults to null and renders blocking LoginScreen
  const [activeUsername, setActiveUsername] = useState<SquadMember | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clat_active_user');
      if (saved && ['Avni', 'Sadvitha', 'Samad', 'Shourya'].includes(saved)) {
        return saved as SquadMember;
      }
    }
    return null; // Global blocking login screen on initial visit or after logout
  });

  // 2. Primary 3-Subject Hierarchy ([GK], [Quants], [Analytical])
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clat_selected_subject');
      if (saved && ['gk', 'quants', 'analytical'].includes(saved)) {
        return saved as SubjectType;
      }
    }
    return 'gk';
  });

  // 3. GK Sub-navbar Tabs: [Topics], [QB], [Oneliners]
  const [activeGKTab, setActiveGKTab] = useState<GKSubTab>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clat_active_gktab');
      if (saved && ['topics', 'qb', 'oneliners'].includes(saved)) {
        return saved as GKSubTab;
      }
    }
    return 'topics';
  });

  // 4. Sadvitha Profile Features: Soft Pink Theme Toggle
  const [pinkThemeEnabled, setPinkThemeEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('clat_pink_theme') === 'true';
    }
    return false;
  });

  // 5. Global Solved Counter
  const [totalSolved, setTotalSolved] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clat_total_solved');
      if (saved) return parseInt(saved, 10);
    }
    return 412;
  });
  const targetTotal = 2600;

  const [soundEnabled, setSoundEnabled] = useState(true);

  // 6. Marked for Review Questions
  const [markedQuestionIds, setMarkedQuestionIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clat_marked_questions');
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch {}
      }
    }
    return new Set(['GK-101', 'GK-104']);
  });

  // Persistence effects
  useEffect(() => {
    if (activeUsername) {
      localStorage.setItem('clat_active_user', activeUsername);
    } else {
      localStorage.removeItem('clat_active_user');
    }
  }, [activeUsername]);

  useEffect(() => {
    localStorage.setItem('clat_selected_subject', selectedSubject);
  }, [selectedSubject]);

  useEffect(() => {
    localStorage.setItem('clat_active_gktab', activeGKTab);
  }, [activeGKTab]);

  useEffect(() => {
    localStorage.setItem('clat_pink_theme', String(pinkThemeEnabled));
  }, [pinkThemeEnabled]);

  useEffect(() => {
    localStorage.setItem('clat_total_solved', totalSolved.toString());
  }, [totalSolved]);

  useEffect(() => {
    localStorage.setItem('clat_marked_questions', JSON.stringify(Array.from(markedQuestionIds)));
  }, [markedQuestionIds]);

  const handleCorrectAnswer = () => {
    setTotalSolved((prev) => Math.min(targetTotal, prev + 1));
  };

  const handleToggleMarkForReview = (qId: string) => {
    setMarkedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playClick();
  };

  const handleTogglePinkTheme = () => {
    sounds.playClick();
    setPinkThemeEnabled((prev) => !prev);
  };

  const handleLogout = () => {
    sounds.playClick();
    localStorage.removeItem('clat_active_user');
    setActiveUsername(null);
  };

  // If current URL route is /import, render the dedicated ImportPage
  if (currentPath === '/import') {
    return <ImportPage onBackToApp={() => navigateTo('/')} />;
  }

  // ========================================================
  // GLOBAL BLOCKING LOGIN SCREEN (When no user in localStorage)
  // ========================================================
  if (!activeUsername) {
    return <LoginScreen onSelectUser={(user) => setActiveUsername(user)} />;
  }

  const isPinkModeActive = activeUsername === 'Sadvitha' && pinkThemeEnabled;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        isPinkModeActive
          ? 'bg-[#0a0508] text-rose-100 selection:bg-pink-500/40 selection:text-pink-200'
          : 'bg-[#000000] text-neutral-100 selection:bg-emerald-500/30 selection:text-emerald-300'
      }`}
    >
      {/* Sadvitha Falling Petals Canvas */}
      <PetalCanvas active={isPinkModeActive} />

      {/* Top Header Navigation */}
      <HeaderNav
        selectedSubject={selectedSubject}
        onSelectSubject={setSelectedSubject}
        activeGKTab={activeGKTab}
        onSelectGKTab={setActiveGKTab}
        totalSolved={totalSolved}
        targetTotal={targetTotal}
        activeUsername={activeUsername}
        onLogout={handleLogout}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        pinkThemeEnabled={pinkThemeEnabled}
        onTogglePinkTheme={handleTogglePinkTheme}
        onOpenImport={() => navigateTo('/import')}
      />

      {/* Main Sub-views */}
      <main className="flex-1 w-full pb-4">
        {/* ======================================================== */}
        {/* SUBJECT 1: GENERAL KNOWLEDGE (GK)                        */}
        {/* Sub-navbar: [Topics] | [QB] | [Oneliners]                */}
        {/* ======================================================== */}
        {selectedSubject === 'gk' && (
          <>
            {activeGKTab === 'topics' && (
              <SyllabusTracker
                activeUsername={activeUsername}
                selectedSubject="gk"
              />
            )}

            {activeGKTab === 'qb' && (
              <GKQuestionBank onCorrectAnswer={handleCorrectAnswer} />
            )}

            {activeGKTab === 'oneliners' && (
              <OnelinersWorkbench
                activeUsername={activeUsername}
                onCorrectAnswer={handleCorrectAnswer}
                markedQuestionIds={markedQuestionIds}
                onToggleMarkForReview={handleToggleMarkForReview}
              />
            )}
          </>
        )}

        {/* ======================================================== */}
        {/* SUBJECT 2: QUANTS (Quantitative Techniques)               */}
        {/* Single Mode: Direct Drill Mode (Independent 50/50 scroll) */}
        {/* ======================================================== */}
        {selectedSubject === 'quants' && (
          <QuantsDrill onCorrectAnswer={handleCorrectAnswer} />
        )}

        {/* ======================================================== */}
        {/* SUBJECT 3: ANALYTICAL REASONING                           */}
        {/* Single Mode: Direct Drill Mode (Independent 50/50 scroll) */}
        {/* ======================================================== */}
        {selectedSubject === 'analytical' && (
          <AnalyticalDrill onCorrectAnswer={handleCorrectAnswer} />
        )}
      </main>
    </div>
  );
};

export default App;
