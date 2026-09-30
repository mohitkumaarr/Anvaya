import React from 'react';

interface AnvayaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export const AnvayaLogo: React.FC<AnvayaLogoProps> = ({
  size = 'md',
  showText = false,
  textColor = 'text-slate-900',
  className = '',
}) => {
  const sizeMap = {
    xs: { icon: 20, font: 'text-xs', sub: 'text-[9px]' },
    sm: { icon: 28, font: 'text-sm', sub: 'text-[10px]' },
    md: { icon: 36, font: 'text-base', sub: 'text-[11px]' },
    lg: { icon: 44, font: 'text-xl', sub: 'text-xs' },
    xl: { icon: 56, font: 'text-2xl', sub: 'text-sm' },
  };

  const { icon, font, sub } = sizeMap[size];

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* Precision Geometric Cadastral & Nexus Emblem */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="anvaya-grad-base" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="anvaya-grad-saffron" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="anvaya-grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="anvaya-grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <filter id="anvaya-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Cadastral Hexagon Boundary */}
        <polygon
          points="50,6 90,28 90,72 50,94 10,72 10,28"
          fill="url(#anvaya-grad-base)"
          stroke="#334155"
          strokeWidth="2.5"
          filter="url(#anvaya-shadow)"
        />

        {/* Inner Cadastral Layer 1: Agricultural Ground (Green) */}
        <path
          d="M 16 68 L 50 88 L 84 68 L 50 50 Z"
          fill="url(#anvaya-grad-emerald)"
          opacity="0.9"
        />

        {/* Inner Cadastral Layer 2: Spatial Zoning & Commons (Amber/Gold) */}
        <path
          d="M 16 32 L 50 50 L 50 88 L 16 68 Z"
          fill="url(#anvaya-grad-saffron)"
          opacity="0.85"
        />

        {/* Inner Cadastral Layer 3: Digital Land Infrastructure (Cyan) */}
        <path
          d="M 50 12 L 84 32 L 84 68 L 50 50 Z"
          fill="url(#anvaya-grad-cyan)"
          opacity="0.85"
        />

        {/* Central Nexus Core (Anvaya Causal Point) */}
        <circle cx="50" cy="50" r="6.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />

        {/* Connected Relational Rays (The Anvaya Connection) */}
        <line x1="50" y1="50" x2="50" y2="12" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 2" opacity="0.85" />
        <line x1="50" y1="50" x2="16" y2="32" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 2" opacity="0.85" />
        <line x1="50" y1="50" x2="84" y2="32" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 2" opacity="0.85" />
        <line x1="50" y1="50" x2="50" y2="88" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 2" opacity="0.85" />

        {/* Satellite Nexus Nodes */}
        <circle cx="50" cy="12" r="3" fill="#f59e0b" />
        <circle cx="84" cy="32" r="3" fill="#38bdf8" />
        <circle cx="16" cy="32" r="3" fill="#10b981" />
        <circle cx="50" cy="88" r="3" fill="#ffffff" />
      </svg>

      {/* Brand Typographic Identity */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className={`font-black tracking-tight uppercase ${font} ${textColor}`}>
              Anvaya
            </span>
            <span className="rounded bg-amber-100 px-1 py-0.2 text-[9px] font-bold text-amber-800 tracking-wider">
              DPI
            </span>
          </div>
          <span className={`leading-none text-slate-500 font-medium ${sub}`}>
            National Land Governance Platform
          </span>
        </div>
      )}
    </div>
  );
};
