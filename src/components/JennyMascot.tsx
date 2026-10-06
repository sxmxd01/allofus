import React from 'react';

export interface JennyMascotProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'default' | 'loading' | 'sleeping' | string;
  className?: string;
  showThoughtBubble?: boolean;
  thoughtText?: string;
  onClick?: () => void;
}

export const JennyMascot: React.FC<JennyMascotProps> = ({
  size = 'sm',
  className = '',
  showThoughtBubble = false,
  thoughtText = 'Thinking...',
  onClick,
}) => {
  const getDimensionClass = () => {
    if (typeof size === 'number') return `w-[${size}px] h-[${size}px]`;
    switch (size) {
      case 'xs':
        return 'w-6 h-6';
      case 'sm':
        return 'w-8 h-8';
      case 'md':
        return 'w-10 h-10';
      case 'lg':
        return 'w-16 h-16';
      case 'xl':
        return 'w-24 h-24';
      default:
        return 'w-8 h-8';
    }
  };

  const dimClass = typeof size === 'number' ? '' : getDimensionClass();
  const inlineStyle = typeof size === 'number' ? { width: size, height: size } : undefined;

  return (
    <div
      className={`inline-flex items-center gap-3 relative select-none shrink-0 ${className}`}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 100 100"
        className={`${dimClass || 'w-8 h-8'} group shrink-0 overflow-visible`}
        style={inlineStyle}
      >
        <defs>
          <filter id="jenny-eye-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Head with Grey Outline (Identical to reference image) */}
        <path
          d="M 25 35 L 20 12 L 38 24 Q 50 25 62 24 L 80 12 L 75 35 C 84 45 84 66 76 78 C 66 90 34 90 24 78 C 16 66 16 45 25 35 Z"
          fill="#17181a"
          stroke="#71717a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Inner Ears */}
        <path d="M 24 28 L 22 17 L 34 24 Z" fill="#323438" />
        <path d="M 76 28 L 78 17 L 66 24 Z" fill="#323438" />

        {/* Whiskers (3 on each side) */}
        <g stroke="#71717a" strokeWidth="1.5" strokeLinecap="round">
          <line x1="28" y1="54" x2="8" y2="52" />
          <line x1="28" y1="58" x2="6" y2="58" />
          <line x1="28" y1="62" x2="8" y2="64" />

          <line x1="72" y1="54" x2="92" y2="52" />
          <line x1="72" y1="58" x2="94" y2="58" />
          <line x1="72" y1="62" x2="92" y2="64" />
        </g>

        {/* Eyes (Animated Blinking with Lime Glow & White Specular Highlight) */}
        <g className="animate-jenny-blink" style={{ transformOrigin: '50px 52px' }}>
          {/* Left Eye Socket */}
          <path
            d="M 30 52 Q 38 43 46 52 Q 38 61 30 52 Z"
            fill="#121314"
            stroke="#52525b"
            strokeWidth="1.2"
          />
          {/* Left Glowing Eye (inherits --accent theme variable) */}
          <ellipse
            cx="38"
            cy="52"
            rx="7.5"
            ry="7"
            fill="var(--accent, #bbf405)"
            filter="url(#jenny-eye-glow)"
          />
          {/* Left Specular Highlight */}
          <circle cx="39.5" cy="50" r="2.2" fill="#ffffff" />

          {/* Right Eye Socket */}
          <path
            d="M 54 52 Q 62 43 70 52 Q 62 61 54 52 Z"
            fill="#121314"
            stroke="#52525b"
            strokeWidth="1.2"
          />
          {/* Right Glowing Eye (inherits --accent theme variable) */}
          <ellipse
            cx="62"
            cy="52"
            rx="7.5"
            ry="7"
            fill="var(--accent, #bbf405)"
            filter="url(#jenny-eye-glow)"
          />
          {/* Right Specular Highlight */}
          <circle cx="63.5" cy="50" r="2.2" fill="#ffffff" />
        </g>

        {/* White Dot Nose */}
        <circle cx="50" cy="59" r="2.2" fill="#ffffff" />

        {/* Cute Cat Mouth (Animated Yawn) */}
        <path
          d="M 46 64 Q 48 67 50 64 Q 52 67 54 64"
          fill="none"
          stroke="#71717a"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="animate-jenny-yawn"
        />
      </svg>

      {/* Thought bubble (When requested) */}
      {showThoughtBubble && (
        <div className="bg-panel border border-border rounded-xl px-3 py-1 shadow-xl relative text-xs font-sans text-main flex items-center gap-2">
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-panel border-l border-b border-border rotate-45" />
          <span className="relative z-10 leading-snug">{thoughtText}</span>
        </div>
      )}
    </div>
  );
};

export const JennyLoadingState: React.FC<{
  message?: string;
  submessage?: string;
  className?: string;
}> = ({
  message = 'Fetching live questions...',
  submessage = 'Jenny is pawing through the legal records',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-4 select-none ${className}`}
    >
      <JennyMascot size="lg" />
      <div className="space-y-1">
        <div className="text-sm font-medium text-main font-sans tracking-tight">
          {message}
        </div>
        <p className="text-xs text-muted font-sans">{submessage}</p>
      </div>
    </div>
  );
};

export default JennyMascot;
