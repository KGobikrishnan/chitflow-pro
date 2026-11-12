import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Route error caught by ErrorBoundary:', error);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-full bg-[#FF3B30]/15 text-[#FF3B30] flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
        Something unexpected occurred
      </h2>
      <p className="text-xs text-[#8E8E93] max-w-md mb-6 font-mono bg-black/5 dark:bg-white/5 p-3 rounded-lg">
        {error?.message || error?.statusText || 'An unexpected error occurred while rendering this view.'}
      </p>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => window.location.reload()}
          className="ios-pill-btn px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1C1C1E] border border-black/10 flex items-center gap-1.5 shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reload Page</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="ios-pill-btn px-4 py-2 text-xs font-semibold text-white bg-[#007AFF] hover:bg-[#0062CC] flex items-center gap-1.5 shadow-xs"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Overview</span>
        </button>
      </div>
    </div>
  );
};

