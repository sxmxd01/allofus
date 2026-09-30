import React from 'react';
import { SquadMember, SQUAD_MEMBERS } from '../types';
import { ArrowRight } from 'lucide-react';
import { sounds } from '../utils/sound';

interface LoginScreenProps {
  onSelectUser: (user: SquadMember) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSelectUser }) => {
  const squadList: SquadMember[] = ['Avni', 'Sadvitha', 'Samad', 'Shourya'];

  const handleChoose = (name: SquadMember) => {
    sounds.playClick();
    if (name === 'Sadvitha') {
      sounds.playHarpEntrance();
    }
    onSelectUser(name);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col items-center justify-center p-6 selection:bg-neutral-800">
      <div className="w-full max-w-md bg-[#050505] border border-neutral-800 rounded-lg p-8 space-y-6">
        {/* Understated Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800/80">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-semibold tracking-tight text-white">CLAT</span>
        </div>

        {/* Prompt */}
        <div className="space-y-1">
          <h1 className="text-base font-medium text-neutral-200">
            Select Squad Member
          </h1>
          <p className="text-xs text-neutral-500 leading-normal">
            Choose your identity to access question tracking, verification, and sprint progress.
          </p>
        </div>

        {/* 4 Member Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {squadList.map((member) => {
            const info = SQUAD_MEMBERS[member];
            return (
              <button
                key={member}
                onClick={() => handleChoose(member)}
                className="flex items-center justify-between p-3.5 bg-black border border-neutral-800/90 hover:border-neutral-700 active:border-emerald-500/80 rounded transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-sm flex items-center justify-center text-xs font-semibold text-black shrink-0"
                    style={{ backgroundColor: info.color }}
                  >
                    {member[0]}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-neutral-200 group-hover:text-white">
                      {member}
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-300 group-hover:translate-x-0.5 transition-all" />
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-neutral-900 text-center">
          <span className="text-[11px] text-neutral-600">
            Session persists locally on this device
          </span>
        </div>
      </div>
    </div>
  );
};
