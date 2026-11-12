import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Users,
  Calendar,
  IndianRupee,
  ChevronRight,
  TrendingUp,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreateGroupModal } from './CreateGroupModal';

export const ChitGroupList = () => {
  const navigate = useNavigate();
  const groups = useAppStore((state) => state.groups);
  const installments = useAppStore((state) => state.installments);
  const members = useAppStore((state) => state.members);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chit Groups"
        subtitle="Manage chit fund circles, contribution values, duration schedules and auctions"
        breadcrumbs={['ChitFlow', 'Chit Groups']}
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Chit Group</span>
          </button>
        }
      />

      {/* Chit Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          // Calculations for this group
          const groupInstallments = installments.filter((ins) => ins.groupId === group.id);
          const totalCollected = groupInstallments.reduce((sum, ins) => sum + (ins.paidAmount || 0), 0);
          const totalExpectedEver = groupInstallments.reduce((sum, ins) => sum + (ins.expectedAmount || 0), 0);
          const completionPercent = totalExpectedEver > 0 ? Math.round((totalCollected / totalExpectedEver) * 100) : 0;
          const assignedMembers = members.filter((m) => m.assignedGroupIds?.includes(group.id));

          return (
            <div
              key={group.id}
              onClick={() => navigate(`/chit-groups/${group.id}`)}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-medium text-slate-400">
                      {group.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {group.name}
                    </h3>
                  </div>
                  <StatusBadge status={group.status} />
                </div>

                <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                  {group.description || 'Systematic chit fund scheme with structured auction dividend disbursement.'}
                </p>

                {/* Main Specs */}
                <div className="mt-4 grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] uppercase">Chit Value</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {formatCurrency(group.chitValue)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] uppercase">Monthly Installment</span>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {formatCurrency(group.monthlyInstallment)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] uppercase">Members</span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {assignedMembers.length} / {group.memberCount} enrolled
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] uppercase">Tenure</span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {group.durationMonths} Months
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Realized Collections</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {completionPercent}% ({formatCurrency(totalCollected)})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${Math.min(completionPercent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer action */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Start: {formatDate(group.startDate)}</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                  View Ledger <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

