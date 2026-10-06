import React, { useState } from 'react';
import { UserProfile, AppTheme, SQUAD_MEMBERS, SquadMember } from '../types';
import { supabaseMocks } from '../lib/supabase';
import { sounds } from '../utils/sound';
import { X, Check, Loader2, Sparkles, User, KeyRound, Palette, Image as ImageIcon } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onProfileUpdated: (updatedProfile: UserProfile) => void;
}

const THEME_OPTIONS: { id: AppTheme; label: string; accent: string }[] = [
  {
    id: 'default',
    label: 'Terminal',
    accent: '#22c55e',
  },
  {
    id: 'mono',
    label: 'Metallic',
    accent: '#d4d4d8',
  },
  {
    id: 'jade',
    label: 'Omarchy Jade',
    accent: '#34d399',
  },
  {
    id: 'cupid',
    label: 'Cupid Pink',
    accent: '#e11d48',
  },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}) => {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [username, setUsername] = useState(profile.username);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [passcode, setPasscode] = useState(profile.passcode || '');
  const [selectedTheme, setSelectedTheme] = useState<AppTheme>(profile.theme || 'default');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleThemeChange = (newTheme: AppTheme) => {
    sounds.playClick();
    setSelectedTheme(newTheme);
    // Instant live preview on DOM
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !username.trim()) {
      setErrorMsg('Name and Username cannot be empty.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    const updatedProfile: UserProfile = {
      ...profile,
      display_name: displayName.trim(),
      username: username.trim().toLowerCase(),
      avatar_url: avatarUrl.trim(),
      passcode: passcode.trim() || 'allofus',
      theme: selectedTheme,
    };

    try {
      const { error } = await supabaseMocks
        .from('user_profiles')
        .update({
          display_name: updatedProfile.display_name,
          username: updatedProfile.username,
          avatar_url: updatedProfile.avatar_url,
          passcode: updatedProfile.passcode,
          theme: updatedProfile.theme,
        })
        .eq('id', profile.id);

      if (error) {
        console.warn('Supabase profile update notice:', error.message);
      }

      // Always update local cache & DOM state zero-latency
      try {
        localStorage.setItem('clat_theme', selectedTheme);
        localStorage.setItem('clat_user_profile', JSON.stringify(updatedProfile));
        localStorage.setItem('clat_active_user', updatedProfile.display_name);
        const existingSession = localStorage.getItem('clat_auth_session');
        if (existingSession) {
          const parsed = JSON.parse(existingSession);
          parsed.user = updatedProfile.display_name;
          parsed.username = updatedProfile.username;
          localStorage.setItem('clat_auth_session', JSON.stringify(parsed));
        }
      } catch {}

      document.documentElement.setAttribute('data-theme', selectedTheme);
      sounds.playCorrect();
      setSuccessToast(true);
      onProfileUpdated(updatedProfile);

      setTimeout(() => {
        setSuccessToast(false);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    sounds.playClick();
    // Revert DOM theme to saved profile theme
    document.documentElement.setAttribute('data-theme', profile.theme || 'default');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-lg bg-panel border border-border text-main rounded-2xl shadow-2xl p-6 sm:p-7 space-y-6 relative overflow-hidden transition-colors">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-90" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-accent" />
            <h2 className="text-base font-semibold text-main tracking-tight">Edit Profile & Theme</h2>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 text-muted hover:text-main transition-colors cursor-pointer rounded-lg hover:bg-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar Preview & URL */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-border overflow-hidden flex items-center justify-center shrink-0 bg-background shadow-md">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback on broken image link
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-2xl font-bold text-black"
                  style={{
                    backgroundColor: SQUAD_MEMBERS[displayName as SquadMember]?.color || 'var(--accent)',
                  }}
                >
                  {displayName[0] || 'U'}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-xs text-muted font-medium flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-muted" />
                <span>Profile Picture (Avatar URL)</span>
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-background border border-border focus:border-accent text-xs text-main placeholder:text-muted/50 rounded-lg focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Name & Username Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs text-muted font-medium">Name (Display Name)</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Samad"
                className="w-full px-3 py-2 bg-background border border-border focus:border-accent text-xs text-main placeholder:text-muted/50 rounded-lg focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted font-medium">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-mono text-xs">
                  @
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full pl-7 pr-3 py-2 bg-background border border-border focus:border-accent text-xs text-main placeholder:text-muted/50 rounded-lg focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* Password (Passcode) */}
          <div className="space-y-1">
            <label className="text-xs text-muted font-medium flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-muted" />
              <span>Password (Passcode)</span>
            </label>
            <input
              type="text"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="allofus"
              className="w-full px-3 py-2 bg-background border border-border focus:border-accent text-xs text-main placeholder:text-muted/50 rounded-lg focus:outline-none transition-colors font-mono"
            />
          </div>

          {/* Theme Selector: Default, Mono, Jade, Cupid */}
          <div className="space-y-2 pt-1">
            <label className="text-xs text-muted font-medium flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-accent" />
              <span>Theme</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleThemeChange(theme.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-accent ring-1 ring-accent bg-hover shadow-md'
                        : 'border-border hover:border-accent/50 bg-background'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-xs"
                        style={{ backgroundColor: theme.accent }}
                      />
                      {isSelected && <Check className="w-3.5 h-3.5 text-accent" />}
                    </div>
                    <div className="text-xs font-semibold text-main">{theme.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMsg && (
            <div className="text-rose-400 text-xs font-mono text-center pt-1">{errorMsg}</div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs text-muted hover:text-main transition-colors cursor-pointer rounded-lg hover:bg-hover"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              style={{
                background: selectedTheme === 'mono' ? 'var(--accent-gradient)' : 'var(--accent)',
              }}
              className="px-5 py-2 hover:opacity-90 disabled:opacity-50 text-black font-semibold text-xs rounded-lg transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : successToast ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
