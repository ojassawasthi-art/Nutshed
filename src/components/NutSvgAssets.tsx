import React, { useState } from 'react';
import type { NutIconKind } from '../data/catalog';

export function GlobalSvgDefs() {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
      <defs>
        {/* Jaipur Jharokha Arch ClipPath (objectBoundingBox 0..1) */}
        <clipPath id="jharokha-clip" clipPathUnits="objectBoundingBox">
          <path d="M 0,1 L 0,0.42 C 0,0.28 0.08,0.23 0.16,0.20 C 0.25,0.16 0.34,0.09 0.5,0.01 C 0.66,0.09 0.75,0.16 0.84,0.20 C 0.92,0.23 1,0.28 1,0.42 L 1,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function AlmondIcon({
  className = 'w-6 h-6',
  color = '#F2A93B',
  grooveColor = '#0A1F17',
}: {
  className?: string;
  color?: string;
  grooveColor?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 6C44 18 51 31 51 42C51 52.5 42.5 58 32 58C21.5 58 13 52.5 13 42C13 31 20 18 32 6Z"
        fill={color}
      />
      <path
        d="M32 16C26.5 26.5 24.5 36.5 26.5 47.5"
        stroke={grooveColor}
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M36.5 23C39 30 40 37 39 45"
        stroke={grooveColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

export function NutStridLogo({
  theme = 'dark',
  showCaption = true,
  size = 'md',
}: {
  theme?: 'dark' | 'light';
  showCaption?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const textColor = theme === 'dark' ? 'text-oat' : 'text-ink';
  const captionColor = theme === 'dark' ? 'text-saffron/90' : 'text-almond/80';
  const sizeClasses =
    size === 'sm'
      ? 'text-xl sm:text-2xl'
      : size === 'lg'
        ? 'text-4xl sm:text-5xl'
        : 'text-2xl sm:text-[28px]';

  return (
    <span className="inline-flex flex-col items-start leading-none select-none">
      <span
        className={`font-serif font-semibold tracking-tight lowercase inline-flex items-baseline ${sizeClasses} ${textColor}`}
      >
        <span>n</span>
        <span className="relative inline-flex items-center justify-center mx-[1px]">
          <span className="opacity-95">u</span>
          <AlmondIcon
            className={
              size === 'lg'
                ? 'w-3.5 h-3.5 -mt-5 -ml-0.5'
                : size === 'sm'
                  ? 'w-2.5 h-2.5 -mt-3'
                  : 'w-3 h-3 -mt-3.5'
            }
            color="#F2A93B"
            grooveColor={theme === 'dark' ? '#0A1F17' : '#FAF4E6'}
          />
        </span>
        <span>tstrid</span>
      </span>
      {showCaption && (
        <span
          className={`font-mono text-[9px] tracking-[0.26em] uppercase mt-0.5 ${captionColor}`}
        >
          jaipur
        </span>
      )}
    </span>
  );
}

export function JharokhaArchOutline({
  className = '',
  strokeColor = '#F2A93B',
  strokeWidth = 2,
  progress = 1,
}: {
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  progress?: number;
}) {
  const pathLength = 1000;
  const dashOffset = Math.max(0, pathLength * (1 - progress));
  return (
    <svg
      viewBox="0 0 320 420"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 18 408 L 18 182 C 18 122 52 102 82 88 C 115 73 142 42 160 14 C 178 42 205 73 238 88 C 268 102 302 122 302 182 L 302 408 Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={pathLength}
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
      />
      <path
        d="M 32 396 L 32 186 C 32 134 62 115 90 102 C 119 88 144 60 160 34 C 176 60 201 88 230 102 C 258 115 288 134 288 186 L 288 396"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.55}
        strokeOpacity="0.45"
        strokeLinecap="round"
        pathLength={pathLength}
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
}

export function NutCutout({
  kind,
  className = 'w-12 h-12',
}: {
  kind: NutIconKind;
  className?: string;
}) {
  switch (kind) {
    case 'almond':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="almGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D69553" />
              <stop offset="65%" stopColor="#A9642A" />
              <stop offset="100%" stopColor="#773F15" />
            </linearGradient>
          </defs>
          <path d="M32 6C45 19 52 33 50 45C48 54 40 58 32 58C24 58 16 54 14 45C12 33 19 19 32 6Z" fill="url(#almGrad)" />
          <path d="M32 14C27 25 25 36 27 48M37 22C39 30 39 39 37 48" stroke="#5A2D0C" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.55" />
          <path d="M25 22C22 28 21 34 22 40" stroke="#F4C792" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.45" />
        </svg>
      );
    case 'cashew':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="casGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF7E4" />
              <stop offset="70%" stopColor="#EAD6AE" />
              <stop offset="100%" stopColor="#C9A875" />
            </linearGradient>
          </defs>
          <path
            d="M44 13C53 18 54 31 46 41C38 51 24 54 15 47C10 43 12 35 19 34C25 33 30 30 31 24C32 18 36 9 44 13Z"
            fill="url(#casGrad)"
          />
          <path d="M40 19C44 24 42 33 35 39" stroke="#FFFDF7" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.7" />
        </svg>
      );
    case 'pistachio':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <ellipse cx="32" cy="33" rx="18" ry="23" fill="#E9DEC8" />
          <path d="M32 10C22 14 17 25 18 37C19 46 25 54 32 56C28 45 27 24 32 10Z" fill="#D2C2A3" />
          <ellipse cx="33" cy="32" rx="9" ry="15" fill="#9DC44D" />
          <path d="M30 22C34 25 36 33 34 42" stroke="#6B8E23" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M29 19C26 24 26 32 27 39" stroke="#C8E68A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'walnut':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <path
            d="M32 12C43 10 53 19 52 31C51 43 42 54 32 52C22 54 13 43 12 31C11 19 21 10 32 12Z"
            fill="#C79253"
          />
          <path
            d="M32 14V50M20 22C25 25 27 30 23 35M44 22C39 25 37 30 41 35M22 41C26 40 28 43 26 47M42 41C38 40 36 43 38 47"
            stroke="#7B4E21"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );
    case 'date':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <defs>
            <linearGradient id="datGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C3E1D" />
              <stop offset="60%" stopColor="#4F220D" />
              <stop offset="100%" stopColor="#2B1105" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="32" rx="16" ry="24" transform="rotate(-18 32 32)" fill="url(#datGrad)" />
          <path d="M24 18C22 27 25 38 32 45" stroke="#B66B3F" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.6" />
          <circle cx="24" cy="12" r="3" fill="#B68B59" />
        </svg>
      );
    case 'fig':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <path
            d="M32 10C35 16 47 23 48 37C49 48 41 55 32 55C23 55 15 48 16 37C17 23 29 16 32 10Z"
            fill="#C89E68"
          />
          <path d="M24 27C23 35 24 44 27 50M33 24C34 34 34 44 32 51M41 28C41 36 40 43 37 49" stroke="#9B723F" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.55" />
        </svg>
      );
    case 'apricot':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <defs>
            <radialGradient id="aprGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFB84D" />
              <stop offset="70%" stopColor="#E67E22" />
              <stop offset="100%" stopColor="#B85310" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="33" r="20" fill="url(#aprGrad)" />
          <path d="M24 24C28 29 29 37 26 44" stroke="#9D3F08" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
        </svg>
      );
    case 'raisins':
      return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
          <ellipse cx="24" cy="36" rx="10" ry="13" transform="rotate(-15 24 36)" fill="#2F2131" />
          <ellipse cx="40" cy="34" rx="10" ry="13" transform="rotate(14 40 34)" fill="#251927" />
          <ellipse cx="32" cy="24" rx="9" ry="11" fill="#3B293E" />
          <path d="M21 31C20 35 21 39 23 41M38 29C39 33 38 37 36 39" stroke="#6E5474" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </svg>
      );
  }
}

export function MarigoldPetalSvg({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M16 3C22 7 25 14 23 22C21 27 17 29 16 29C15 29 11 27 9 22C7 14 10 7 16 3Z"
        fill="#F28A2E"
      />
      <path
        d="M16 6C19 10 20 16 18 24"
        stroke="#FFD07B"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

export function StickerBadge({
  label,
  tone = 'saffron',
  rotate = '-rotate-2',
}: {
  label: string;
  tone?: 'saffron' | 'pistachio' | 'rose';
  rotate?: string;
}) {
  const toneClasses =
    tone === 'pistachio'
      ? 'bg-pistachio text-ink border-ink/15'
      : tone === 'rose'
        ? 'bg-rose text-oat border-ink/15'
        : 'bg-saffron text-ink border-ink/15';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.14em] font-bold border shadow-sm whitespace-nowrap shrink-0 ${toneClasses} ${rotate}`}
    >
      {label}
    </span>
  );
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-oat-muted/70 text-ink/70 p-4 text-center ${className}`}
      >
        <AlmondIcon className="w-8 h-8 mb-2" color="#F2A93B" grooveColor="#0A1F17" />
        <span className="font-serif text-sm">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-oat-muted/40 ${className}`}>
      {!loaded && <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
