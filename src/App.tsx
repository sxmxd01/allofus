import React, { useState, useEffect } from 'react';
import { SubjectType, GKSubTab, QTSubTab, SquadMember, UserProfile } from './types';
import { HeaderNav } from './components/HeaderNav';
import { LoginScreen } from './components/LoginScreen';
import { ProfileModal } from './components/ProfileModal';
import { SyllabusTracker } from './components/SyllabusTracker';
import { GKQuestionBank } from './components/GKQuestionBank';
import { OnelinersWorkbench } from './components/OnelinersWorkbench';
import { LiveDump } from './components/LiveDump';
import { QuantsDrill } from './components/QuantsDrill';
import { AnalyticalDrill } from './components/AnalyticalDrill';
import { ImportPage } from './components/ImportPage';
import { JennyLoadingState } from './components/JennyMascot';
import { MathArena } from './components/mentalMath/MathArena';
import { MentalMathDashboard } from './components/mentalMath/MentalMathDashboard';
import { sounds } from './utils/sound';
import { fetchTotalSolvedCount } from './lib/clatService';
import { supabaseOneliners } from './lib/supabase';

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

  // 1. User Profile & Squad Member Authentication State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('clat_user_profile');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {}
    }
    return null;
  });

  const [activeUsername, setActiveUsername] = useState<SquadMember | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSession = localStorage.getItem('clat_auth_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (
            parsed?.isAuthenticated &&
            parsed?.user &&
            ['Avni', 'Sadvitha', 'Samad', 'Shourya'].includes(parsed.user)
          ) {
            return parsed.user as SquadMember;
          }
        }
      } catch {}
    }
    return null;
  });

  // Zero-Latency Theme Application on Load
  useEffect(() => {
    const activeTheme = userProfile?.theme || localStorage.getItem('clat_theme') || 'default';
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [userProfile?.theme]);

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

  const [isSwitchingSubject, setIsSwitchingSubject] = useState(false);

  const handleSelectSubject = (subj: SubjectType) => {
    if (subj === selectedSubject) return;
    setIsSwitchingSubject(true);
    setSelectedSubject(subj);
    setTimeout(() => {
      setIsSwitchingSubject(false);
    }, 280);
  };

  // 3. GK Sub-navbar Tabs: [Topics], [QB], [Oneliners], [Dump]
  const [activeGKTab, setActiveGKTab] = useState<GKSubTab>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clat_active_gktab');
      if (saved && ['topics', 'qb', 'oneliners', 'dump'].includes(saved)) {
        return saved as GKSubTab;
      }
    }
    return 'topics';
  });

  // QT Sub-navbar Tabs: [Caselet Drill], [Mental Math]
  const [activeQTTab, setActiveQTTab] = useState<QTSubTab>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clat_active_qttab');
      if (saved && ['drill', 'mental_math'].includes(saved)) {
        return saved as QTSubTab;
      }
    }
    return 'drill';
  });

  // Zen Mode state for Mental Math Arena
  const [zenArenaConfig, setZenArenaConfig] = useState<{
    levelNumber: number;
    setNumber?: number;
  } | null>(null);

  // 4. Global Solved Counter: Live Supabase aggregation
  const [totalSolved, setTotalSolved] = useState<number>(0);
  const targetTotal = 2600;

  useEffect(() => {
    let isMounted = true;

    fetchTotalSolvedCount().then((count) => {
      if (isMounted) {
        setTotalSolved(count);
      }
    });

    const channel = supabaseOneliners
      .channel('realtime:app:global_total_solved')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'questions' },
        async () => {
          const fresh = await fetchTotalSolvedCount();
          if (isMounted) {
            setTotalSolved(fresh);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabaseOneliners.removeChannel(channel);
    };
  }, []);

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Marked for Review Questions
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
    localStorage.setItem('clat_active_qttab', activeQTTab);
  }, [activeQTTab]);

  useEffect(() => {
    localStorage.setItem('clat_marked_questions', JSON.stringify(Array.from(markedQuestionIds)));
  }, [markedQuestionIds]);

  const handleCorrectAnswer = () => {
    setTotalSolved((prev) => Math.min(targetTotal, prev + 1));
    fetchTotalSolvedCount().then((fresh) => {
      setTotalSolved(fresh);
    });
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

  const handleLogout = () => {
    sounds.playClick();
    localStorage.removeItem('clat_auth_session');
    localStorage.removeItem('clat_active_user');
    localStorage.removeItem('clat_user_profile');
    setActiveUsername(null);
    setUserProfile(null);
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setActiveUsername(profile.display_name as SquadMember);
  };

  const handleProfileUpdated = (updated: UserProfile) => {
    setUserProfile(updated);
    if (['Avni', 'Sadvitha', 'Samad', 'Shourya'].includes(updated.display_name)) {
      setActiveUsername(updated.display_name as SquadMember);
    }
  };

  // If current URL route is /import, render the dedicated ImportPage
  if (currentPath === '/import') {
    return <ImportPage onBackToApp={() => navigateTo('/')} />;
  }

  // ========================================================
  // NETFLIX-STYLE LOGIN SCREEN (When unauthenticated)
  // ========================================================
  if (!activeUsername) {
    return <LoginScreen onSelectProfile={handleLoginSuccess} />;
  }

  // ========================================================
  // ZEN MODE: THE ZEN-MODE MATH ARENA
  // Aggressively hides global navigation, sidebar, and header.
  // ========================================================
  if (zenArenaConfig) {
    return (
      <MathArena
        levelNumber={zenArenaConfig.levelNumber}
        initialSetNumber={zenArenaConfig.setNumber || 1}
        activeUsername={activeUsername}
        onExitZen={() => setZenArenaConfig(null)}
        onLevelAdvanced={(newLevel) => {
          setZenArenaConfig({ levelNumber: newLevel, setNumber: 1 });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans w-full overflow-x-hidden bg-background text-main transition-colors duration-200">
      {/* Top Header Navigation */}
      <HeaderNav
        selectedSubject={selectedSubject}
        onSelectSubject={handleSelectSubject}
        activeGKTab={activeGKTab}
        onSelectGKTab={setActiveGKTab}
        activeQTTab={activeQTTab}
        onSelectQTTab={setActiveQTTab}
        totalSolved={totalSolved}
        targetTotal={targetTotal}
        activeUsername={activeUsername}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenImport={() => navigateTo('/import')}
      />

      {/* Profile Management Modal */}
      {userProfile && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          profile={userProfile}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* Main Sub-views */}
      <main className="flex-1 w-full pb-24 overflow-x-hidden">
        {isSwitchingSubject ? (
          <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <JennyLoadingState
              message={`Opening ${selectedSubject === 'gk' ? 'General Knowledge' : selectedSubject === 'quants' ? 'Quantitative Techniques' : 'Analytical Reasoning'}...`}
              submessage="Jenny is setting up your question papers"
            />
          </div>
        ) : (
          <>
            {/* ======================================================== */}
            {/* SUBJECT 1: GENERAL KNOWLEDGE (GK)                        */}
            {/* Sub-navbar: [Topics] | [QB] | [Oneliners] | [Dump]       */}
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

                {activeGKTab === 'dump' && (
                  <LiveDump
                    activeUsername={activeUsername}
                    displayName={userProfile?.display_name || activeUsername}
                    avatarUrl={userProfile?.avatar_url}
                  />
                )}
              </>
            )}

            {/* ======================================================== */}
            {/* SUBJECT 2: QUANTS (Quantitative Techniques)               */}
            {/* Sub-modes: Caselet Drill & Mental Math Training Arena     */}
            {/* ======================================================== */}
            {selectedSubject === 'quants' && (
              <>
                {activeQTTab === 'drill' && (
                  <QuantsDrill onCorrectAnswer={handleCorrectAnswer} />
                )}
                {activeQTTab === 'mental_math' && (
                  <MentalMathDashboard
                    activeUsername={activeUsername}
                    onStartZenMode={(levelNumber, setNumber) => {
                      setZenArenaConfig({ levelNumber, setNumber });
                    }}
                  />
                )}
              </>
            )}

            {/* ======================================================== */}
            {/* SUBJECT 3: ANALYTICAL REASONING                           */}
            {/* Single Mode: Direct Drill Mode (Independent 50/50 scroll) */}
            {/* ======================================================== */}
            {selectedSubject === 'analytical' && (
              <AnalyticalDrill onCorrectAnswer={handleCorrectAnswer} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
