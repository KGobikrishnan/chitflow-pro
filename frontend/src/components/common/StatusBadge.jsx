import React from 'react';

const statusConfigs = {
  PAID: {
    label: 'Paid',
    style: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  COMPLETED: {
    label: 'Completed',
    style: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  ACTIVE: {
    label: 'Active',
    style: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20',
    dot: 'bg-indigo-500',
  },
  PARTIALLY_PAID: {
    label: 'Partial',
    style: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500',
  },
  PENDING: {
    label: 'Pending',
    style: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
    dot: 'bg-sky-500',
  },
  UPCOMING: {
    label: 'Upcoming',
    style: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    dot: 'bg-slate-400',
  },
  OVERDUE: {
    label: 'Overdue',
    style: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
    dot: 'bg-rose-500',
  },
  SUSPENDED: {
    label: 'Suspended',
    style: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    dot: 'bg-red-500',
  },
  INACTIVE: {
    label: 'Inactive',
    style: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    dot: 'bg-slate-400',
  },
  PAUSED: {
    label: 'Paused',
    style: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500',
  },
};

export const StatusBadge = ({ status, className = '' }) => {
  const normStatus = status ? status.toUpperCase() : 'PENDING';
  const conf = statusConfigs[normStatus] || statusConfigs.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium tracking-tight border ${conf.style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${conf.dot}`} />
      {conf.label}
    </span>
  );
};
