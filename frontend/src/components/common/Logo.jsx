import React from 'react';

/**
 * ChitFlow Brand Logo Component
 * Modern geometric financial logo: intersecting circular/curved arcs symbolizing 
 * continuous wealth flow (chit pool circulation & financial prosperity)
 * with sharp contrast & gradient.
 */
export const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizeMap = {
    xs: { box: 'w-6 h-6', svg: 'w-4 h-4', text: 'text-xs', sub: 'text-[7px]' },
    sm: { box: 'w-7 h-7', svg: 'w-4 h-4', text: 'text-sm', sub: 'text-[8px]' },
    md: { box: 'w-8 h-8', svg: 'w-5 h-5', text: 'text-base', sub: 'text-[9px]' },
    lg: { box: 'w-10 h-10', svg: 'w-6 h-6', text: 'text-xl', sub: 'text-[10px]' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      {/* Dynamic Emblem */}
      <div
        className={`${currentSize.box} rounded-lg bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-1 flex items-center justify-center shadow-md shadow-indigo-600/20 ring-1 ring-white/20 shrink-0 relative overflow-hidden`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${currentSize.svg} text-white`}
        >
          {/* Subtle background glow */}
          <circle cx="16" cy="16" r="14" fill="white" fillOpacity="0.08" />
          {/* Flow loop arcs */}
          <path
            d="M8 16C8 11.5817 11.5817 8 16 8C19.5 8 22.5 10.2 23.5 13.5"
            stroke="white"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M24 16C24 20.4183 20.4183 24 16 24C12.5 24 9.5 21.8 8.5 18.5"
            stroke="#38BDF8"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Center Currency Node */}
          <circle cx="16" cy="16" r="3.2" fill="white" />
          <circle cx="21" cy="9" r="1.5" fill="#38BDF8" />
          <circle cx="11" cy="23" r="1.5" fill="white" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <div className="flex items-center space-x-1.5">
            <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${currentSize.text}`}>
              Chit<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
              Pro
            </span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
            FinTech Operations
          </span>
        </div>
      )}
    </div>
  );
};

