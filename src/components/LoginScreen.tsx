import React, { useState, useEffect } from 'react';
import { UserProfile, SQUAD_MEMBERS, SquadMember } from '../types';
import { supabaseMocks } from '../lib/supabase';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { sounds } from '../utils/sound';

interface LoginScreenProps {
  onSelectProfile: (profile: UserProfile) => void;
}

const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: '15e782b2-e3b8-4345-9cde-c5751c5ee7d8',
    username: 'avni',
    display_name: 'Avni',
    avatar_url: '',
    passcode: 'allofus',
    theme: 'default',
  },
  {
    id: '52d5d2f6-ba94-447c-8a60-32f04a621867',
    username: 'sadvitha',
    display_name: 'Sadvitha',
    avatar_url: '',
    passcode: 'allofus',
    theme: 'default',
  },
  {
    id: '6cfc3c1d-406b-4773-aeb1-907dc92f77fe',
    username: 'samad',
    display_name: 'Samad',
    avatar_url: '',
    passcode: 'allofus',
    theme: 'default',
  },
  {
    id: 'c859a228-ee77-47b1-8cc6-366ac8c9941f',
    username: 'shourya',
    display_name: 'Shourya',
    avatar_url: '',
    passcode: 'allofus',
    theme: 'default',
  },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSelectProfile }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(DEFAULT_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  // Isolated Database Handshake: Fetch user_profiles once on mount. Do NOT poll again.
  useEffect(() => {
    let isMounted = true;
    async function loadProfiles() {
      try {
        const { data, error } = await supabaseMocks
          .from('user_profiles')
          .select('*')
          .order('display_name', { ascending: true });

        if (!error && data && data.length > 0 && isMounted) {
          const mapped: UserProfile[] = data.map((row: any) => ({
            id: row.id,
            username: row.username,
            display_name: row.display_name,
            avatar_url: row.avatar_url || '',
            passcode: row.passcode || 'allofus',
            theme: row.theme || 'default',
            created_at: row.created_at,
          }));
          setProfiles(mapped);
        }
      } catch (err) {
        console.warn('user_profiles initial fetch note:', err);
      }
    }

    loadProfiles();
    return () => {
      isMounted = false;
    };
  }, []);

  const executeLogin = (profile: UserProfile) => {
    sounds.playCorrect();
    // Instantly apply saved theme to DOM
    const userTheme = profile.theme || 'default';
    document.documentElement.setAttribute('data-theme', userTheme);

    try {
      localStorage.setItem('clat_theme', userTheme);
      localStorage.setItem('clat_user_profile', JSON.stringify(profile));
      localStorage.setItem(
        'clat_auth_session',
        JSON.stringify({
          isAuthenticated: true,
          user: profile.display_name,
          username: profile.username,
        })
      );
      localStorage.setItem('clat_active_user', profile.display_name);
    } catch {}

    onSelectProfile(profile);
  };

  const handleSelectProfile = (profile: UserProfile) => {
    sounds.playClick();
    if (profile.display_name === 'Sadvitha') {
      sounds.playHarpEntrance();
    }
    setSelectedProfile(profile);
    setPassword('');
    setErrorMsg('');
  };

  const handleBackToSelection = () => {
    sounds.playClick();
    setSelectedProfile(null);
    setPassword('');
    setErrorMsg('');
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setErrorMsg('');

    // Case-insensitive passcode check against user_profiles row
    if (
      selectedProfile &&
      val.trim().toLowerCase() === (selectedProfile.passcode || 'allofus').trim().toLowerCase()
    ) {
      executeLogin(selectedProfile);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;

    if (
      password.trim().toLowerCase() ===
      (selectedProfile.passcode || 'allofus').trim().toLowerCase()
    ) {
      executeLogin(selectedProfile);
    } else {
      sounds.playIncorrect();
      setErrorMsg('Incorrect passcode');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-background text-main flex flex-col items-center justify-center p-4 sm:p-8 font-sans select-none transition-colors duration-200">
      {/* NETFLIX-STYLE VIEW 1: Profile Selection Grid */}
      {!selectedProfile ? (
        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-main mb-8 sm:mb-12">
            Who's Answering?
          </h1>

          {/* Row of 4 Large Circular Profile Pictures */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 max-w-4xl">
            {profiles.map((p) => {
              const squadInfo = SQUAD_MEMBERS[p.display_name as SquadMember];
              const accentColor = squadInfo?.color || 'var(--accent)';

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProfile(p)}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none transition-transform active:scale-95"
                >
                  {/* Large Circular Profile Picture with hover ring */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-border group-hover:border-accent transition-all overflow-hidden flex items-center justify-center relative shadow-xl group-hover:scale-105 bg-panel">
                    {p.avatar_url ? (
                      <img
                        src={p.avatar_url}
                        alt={p.display_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-semibold text-black"
                        style={{ backgroundColor: accentColor }}
                      >
                        {p.display_name[0] || 'U'}
                      </div>
                    )}
                  </div>

                  {/* ONLY place username is visible in the entire app */}
                  <span className="mt-3.5 text-xs sm:text-sm font-mono text-muted group-hover:text-main transition-colors">
                    @{p.username}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* NETFLIX-STYLE VIEW 2: Smooth Morph to Passcode Screen */
        <div className="flex flex-col items-center space-y-6 w-full max-w-xs animate-in fade-in zoom-in-95 duration-200">
          <button
            type="button"
            onClick={handleBackToSelection}
            className="self-start flex items-center gap-1.5 text-xs text-muted hover:text-main transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch profile</span>
          </button>

          {/* Profile Circle */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-accent shadow-2xl flex items-center justify-center bg-panel">
            {selectedProfile.avatar_url ? (
              <img
                src={selectedProfile.avatar_url}
                alt={selectedProfile.display_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-semibold text-black"
                style={{
                  backgroundColor:
                    SQUAD_MEMBERS[selectedProfile.display_name as SquadMember]?.color || 'var(--accent)',
                }}
              >
                {selectedProfile.display_name[0] || 'U'}
              </div>
            )}
          </div>

          <div className="text-center">
            <h2 className="text-xl font-medium text-main">{selectedProfile.display_name}</h2>
            <span className="text-xs font-mono text-muted">@{selectedProfile.username}</span>
          </div>

          <form onSubmit={handlePasswordSubmit} className="w-full space-y-3">
            <div
              className={`relative transition-transform ${
                shake ? 'translate-x-1.5 ring-1 ring-rose-500 rounded-xl' : ''
              }`}
            >
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Enter passcode"
                className="w-full px-4 py-3 bg-panel border border-border focus:border-accent text-sm text-main placeholder:text-muted/50 rounded-xl focus:outline-none transition-colors text-center tracking-widest font-mono"
              />
              <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" />
            </div>

            {errorMsg && (
              <div className="text-center text-rose-400 text-xs font-mono">{errorMsg}</div>
            )}

            <button
              type="submit"
              disabled={!password.trim()}
              style={{
                background: selectedProfile.theme === 'mono' ? 'var(--accent-gradient)' : 'var(--accent)',
              }}
              className="w-full py-2.5 px-4 hover:opacity-90 disabled:opacity-30 text-black font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>Unlock</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
