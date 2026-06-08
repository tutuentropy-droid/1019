import { useMemo } from 'react';
import type { AvatarPose, EmotionType } from '@/types';

interface AnimatedAvatarProps {
  archetype: string;
  accentColor: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pose?: AvatarPose;
  emotion?: EmotionType;
  speaking?: boolean;
  className?: string;
}

const SIZE_MAP: Record<string, number> = {
  sm: 48,
  md: 72,
  lg: 96,
  xl: 128
};

const ARCHETYPE_CONFIG: Record<string, {
  bodyShape: string;
  accessory: string;
  baseAnim: string;
}> = {
  'the-guardian': {
    bodyShape: 'square',
    accessory: 'shield',
    baseAnim: 'guardian-idle'
  },
  'the-wanderer': {
    bodyShape: 'slim',
    accessory: 'backpack',
    baseAnim: 'wanderer-float'
  },
  'the-warrior': {
    bodyShape: 'broad',
    accessory: 'sword',
    baseAnim: 'warrior-ready'
  },
  'the-healer': {
    bodyShape: 'soft',
    accessory: 'heart',
    baseAnim: 'healer-glow'
  },
  'the-philosopher': {
    bodyShape: 'slender',
    accessory: 'book',
    baseAnim: 'thinker-ponder'
  }
};

function getEyeExpression(emotion?: EmotionType) {
  switch (emotion) {
    case 'passionate':
    case 'defiant':
      return { rx: 3, ry: 1.5, eyebrow: -3 };
    case 'gentle':
      return { rx: 2.5, ry: 3, eyebrow: 1 };
    case 'skeptical':
      return { rx: 3, ry: 1, eyebrow: -4 };
    case 'analytical':
      return { rx: 2.5, ry: 2.5, eyebrow: -1 };
    case 'calm':
    default:
      return { rx: 2.5, ry: 2.5, eyebrow: 0 };
  }
}

function getMouthPath(emotion?: EmotionType, speaking?: boolean) {
  if (speaking) {
    return 'M 45 66 Q 50 74 55 66 Q 50 70 45 66 Z';
  }
  switch (emotion) {
    case 'passionate':
    case 'defiant':
      return 'M 42 67 L 58 67 L 56 70 L 44 70 Z';
    case 'gentle':
      return 'M 43 66 Q 50 71 57 66';
    case 'skeptical':
      return 'M 43 68 Q 50 65 57 68';
    case 'analytical':
      return 'M 44 68 L 56 68';
    case 'calm':
    default:
      return 'M 44 67 Q 50 70 56 67';
  }
}

export default function AnimatedAvatar({
  archetype,
  accentColor,
  size = 'md',
  pose = 'idle',
  emotion = 'calm',
  speaking = false,
  className = ''
}: AnimatedAvatarProps) {
  const pixelSize = SIZE_MAP[size];
  const config = ARCHETYPE_CONFIG[archetype] || ARCHETYPE_CONFIG['the-guardian'];
  const eyes = getEyeExpression(emotion);
  const mouthPath = getMouthPath(emotion, speaking);

  const animClass = useMemo(() => {
    const base = `avatar-${archetype.replace('the-', '')}`;
    const poseClass = pose !== 'idle' ? `pose-${pose}` : '';
    const speakClass = speaking ? 'avatar-speaking' : '';
    return `${base} ${poseClass} ${speakClass}`.trim();
  }, [archetype, pose, speaking]);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${animClass} ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        viewBox="0 0 100 100"
        width={pixelSize}
        height={pixelSize}
        className="avatar-svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id={`glow-${archetype}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`body-${archetype}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.5" />
          </linearGradient>
          <filter id={`shadow-${archetype}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={accentColor} floodOpacity="0.4" />
          </filter>
        </defs>

        <circle cx="50" cy="55" r="42" fill={`url(#glow-${archetype})`} className="avatar-glow" />

        <g className="avatar-body-group" filter={`url(#shadow-${archetype})`}>
          {config.bodyShape === 'square' && (
            <rect x="28" y="48" width="44" height="42" rx="8" fill={`url(#body-${archetype})`} />
          )}
          {config.bodyShape === 'slim' && (
            <path d="M 36 48 Q 32 70 34 90 L 66 90 Q 68 70 64 48 Z" fill={`url(#body-${archetype})`} />
          )}
          {config.bodyShape === 'broad' && (
            <path d="M 24 52 L 76 52 L 72 90 L 28 90 Z" fill={`url(#body-${archetype})`} />
          )}
          {config.bodyShape === 'soft' && (
            <ellipse cx="50" cy="70" rx="22" ry="24" fill={`url(#body-${archetype})`} />
          )}
          {config.bodyShape === 'slender' && (
            <path d="M 38 50 Q 36 72 38 90 L 62 90 Q 64 72 62 50 Z" fill={`url(#body-${archetype})`} />
          )}

          <g className="avatar-left-arm">
            {archetype === 'the-guardian' && (
              <rect x="18" y="55" width="12" height="30" rx="6" fill={`url(#body-${archetype})`} opacity="0.8" />
            )}
            {archetype === 'the-warrior' && (
              <rect x="16" y="50" width="14" height="35" rx="7" fill={`url(#body-${archetype})`} opacity="0.85" />
            )}
            {archetype !== 'the-guardian' && archetype !== 'the-warrior' && (
              <rect x="20" y="55" width="10" height="28" rx="5" fill={`url(#body-${archetype})`} opacity="0.75" />
            )}
          </g>
          <g className="avatar-right-arm">
            {archetype === 'the-healer' && (
              <rect x="70" y="52" width="10" height="28" rx="5" fill={`url(#body-${archetype})`} opacity="0.75" transform="rotate(-15, 75, 66)" />
            )}
            {archetype === 'the-philosopher' && (
              <rect x="68" y="50" width="10" height="25" rx="5" fill={`url(#body-${archetype})`} opacity="0.8" transform="rotate(-30, 73, 62)" />
            )}
            {archetype !== 'the-healer' && archetype !== 'the-philosopher' && (
              <rect x="70" y="55" width="10" height="28" rx="5" fill={`url(#body-${archetype})`} opacity="0.75" />
            )}
          </g>
        </g>

        <g className="avatar-head-group">
          <circle cx="50" cy="35" r="20" fill="#F5E6D3" stroke={accentColor} strokeWidth="2" />

          <g className="avatar-hair">
            {archetype === 'the-guardian' && (
              <path d="M 32 30 Q 30 18 50 15 Q 70 18 68 30 Q 66 24 50 22 Q 34 24 32 30 Z" fill={accentColor} opacity="0.85" />
            )}
            {archetype === 'the-wanderer' && (
              <path d="M 30 32 Q 28 16 50 14 Q 72 16 70 32 Q 72 28 68 24 Q 60 18 50 20 Q 40 18 32 24 Q 28 28 30 32 Z" fill={accentColor} opacity="0.8" />
            )}
            {archetype === 'the-warrior' && (
              <path d="M 33 30 Q 32 14 50 12 Q 68 14 67 30 L 67 26 Q 58 20 50 22 Q 42 20 33 26 Z" fill={accentColor} opacity="0.9" />
            )}
            {archetype === 'the-healer' && (
              <path d="M 31 34 Q 28 18 50 16 Q 72 18 69 34 Q 66 26 50 24 Q 34 26 31 34 Z" fill={accentColor} opacity="0.75" />
            )}
            {archetype === 'the-philosopher' && (
              <path d="M 34 30 Q 32 16 50 15 Q 68 16 66 30 Q 64 22 50 21 Q 36 22 34 30 Z" fill={accentColor} opacity="0.85" />
            )}
          </g>

          <g className="avatar-eyebrows">
            <line
              x1="38"
              y1={28 + eyes.eyebrow}
              x2="45"
              y2={27 + eyes.eyebrow}
              stroke="#3D2C1E"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="55"
              y1={27 + eyes.eyebrow}
              x2="62"
              y2={28 + eyes.eyebrow}
              stroke="#3D2C1E"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          <g className="avatar-eyes">
            <ellipse cx="41.5" cy="35" rx={eyes.rx} ry={eyes.ry} fill="#2C1810" className="avatar-eye" />
            <ellipse cx="58.5" cy="35" rx={eyes.rx} ry={eyes.ry} fill="#2C1810" className="avatar-eye" />
            <circle cx="42.5" cy="34" r="0.8" fill="white" />
            <circle cx="59.5" cy="34" r="0.8" fill="white" />
          </g>

          <path
            d={mouthPath}
            stroke="#8B4513"
            strokeWidth="1.2"
            fill={speaking ? '#C2565A' : 'none'}
            strokeLinecap="round"
            className="avatar-mouth"
          />
        </g>

        <g className="avatar-accessory">
          {config.accessory === 'shield' && (
            <g className="accessory-shield">
              <path
                d="M 15 58 L 15 78 Q 15 86 25 88 Q 35 86 35 78 L 35 58 Z"
                fill={accentColor}
                opacity="0.7"
                stroke="white"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              <path d="M 20 64 L 30 64 M 25 62 L 25 82" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
            </g>
          )}

          {config.accessory === 'backpack' && (
            <g className="accessory-backpack">
              <rect x="60" y="52" width="18" height="28" rx="4" fill={accentColor} opacity="0.7" />
              <rect x="63" y="56" width="12" height="4" rx="2" fill="white" opacity="0.2" />
              <rect x="63" y="64" width="12" height="4" rx="2" fill="white" opacity="0.2" />
            </g>
          )}

          {config.accessory === 'sword' && (
            <g className="accessory-sword">
              <rect x="78" y="30" width="4" height="55" rx="1" fill="#D4D4D4" opacity="0.9" />
              <rect x="74" y="80" width="12" height="4" rx="1" fill={accentColor} opacity="0.8" />
              <rect x="77" y="84" width="6" height="8" rx="1" fill="#5D4037" />
            </g>
          )}

          {config.accessory === 'heart' && (
            <g className="accessory-heart">
              <path
                d="M 78 58 C 78 54 82 52 84 56 C 86 52 90 54 90 58 C 90 64 84 70 84 70 C 84 70 78 64 78 58 Z"
                fill="#FF6B9D"
                opacity="0.85"
                className="heart-pulse"
              />
            </g>
          )}

          {config.accessory === 'book' && (
            <g className="accessory-book">
              <rect x="68" y="58" width="20" height="26" rx="2" fill={accentColor} opacity="0.75" />
              <line x1="78" y1="58" x2="78" y2="84" stroke="white" strokeWidth="0.8" strokeOpacity="0.3" />
              <line x1="71" y1="64" x2="85" y2="64" stroke="white" strokeWidth="0.6" strokeOpacity="0.3" />
              <line x1="71" y1="68" x2="85" y2="68" stroke="white" strokeWidth="0.6" strokeOpacity="0.3" />
              <line x1="71" y1="72" x2="82" y2="72" stroke="white" strokeWidth="0.6" strokeOpacity="0.3" />
            </g>
          )}
        </g>

        {speaking && (
          <g className="avatar-speech-indicator">
            <circle cx="85" cy="25" r="3" fill={accentColor} opacity="0.9">
              <animate attributeName="r" values="3;5;3" dur="0.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.4;0.9" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="92" cy="20" r="2" fill={accentColor} opacity="0.7">
              <animate attributeName="r" values="2;4;2" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0.2;0.7" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {pose === 'thinking' && (
          <g className="avatar-think-bubble">
            <circle cx="18" cy="20" r="3" fill="white" opacity="0.6" />
            <circle cx="14" cy="16" r="2" fill="white" opacity="0.5" />
            <circle cx="10" cy="12" r="1.5" fill="white" opacity="0.4" />
          </g>
        )}
      </svg>
    </div>
  );
}
