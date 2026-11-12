import React from 'react';

const statusConfigs = {
  PAID: {
    label: 'Paid',
    style: 'bg-[#34C759]/12 text-[#248A3D] dark:text-[#30D158] border-[#34C759]/20',
    dot: 'bg-[#34C759]',
  },
  COMPLETED: {
    label: 'Completed',
    style: 'bg-[#34C759]/12 text-[#248A3D] dark:text-[#30D158] border-[#34C759]/20',
    dot: 'bg-[#34C759]',
  },
  ACTIVE: {
    label: 'Active',
    style: 'bg-[#007AFF]/12 text-[#0062CC] dark:text-[#0A84FF] border-[#007AFF]/20',
    dot: 'bg-[#007AFF]',
  },
  PARTIALLY_PAID: {
    label: 'Partial',
    style: 'bg-[#FF9500]/12 text-[#C97100] dark:text-[#FF9F0A] border-[#FF9500]/20',
    dot: 'bg-[#FF9500]',
  },
  PENDING: {
    label: 'Pending',
    style: 'bg-[#5856D6]/12 text-[#4644B2] dark:text-[#5E5CE6] border-[#5856D6]/20',
    dot: 'bg-[#5856D6]',
  },
  UPCOMING: {
    label: 'Upcoming',
    style: 'bg-[#8E8E93]/12 text-[#636366] dark:text-[#AEAEB2] border-[#8E8E93]/20',
    dot: 'bg-[#8E8E93]',
  },
  OVERDUE: {
    label: 'Overdue',
    style: 'bg-[#FF3B30]/12 text-[#D70015] dark:text-[#FF453A] border-[#FF3B30]/20',
    dot: 'bg-[#FF3B30]',
  },
  SUSPENDED: {
    label: 'Suspended',
    style: 'bg-[#FF3B30]/12 text-[#D70015] dark:text-[#FF453A] border-[#FF3B30]/20',
    dot: 'bg-[#FF3B30]',
  },
  INACTIVE: {
    label: 'Inactive',
    style: 'bg-[#8E8E93]/12 text-[#636366] dark:text-[#AEAEB2] border-[#8E8E93]/20',
    dot: 'bg-[#8E8E93]',
  },
  PAUSED: {
    label: 'Paused',
    style: 'bg-[#FF9500]/12 text-[#C97100] dark:text-[#FF9F0A] border-[#FF9500]/20',
    dot: 'bg-[#FF9500]',
  },
};

export const StatusBadge = ({ status, className = '' }) => {
  const normStatus = status ? status.toUpperCase() : 'PENDING';
  const conf = statusConfigs[normStatus] || statusConfigs.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-tight border ${conf.style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${conf.dot}`} />
      {conf.label}
    </span>
  );
};
