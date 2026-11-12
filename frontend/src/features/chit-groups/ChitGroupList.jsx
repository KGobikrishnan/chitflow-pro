import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Users,
  Calendar,
  ChevronRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CreateGroupModal } from './CreateGroupModal';

export const ChitGroupList = () => {
  const navigate = useNavigate();
  const groups = useAppStore((state) => state.groups);
  const installments = useAppStore((state) => state.installments);
  const members = useAppStore((state) => state.members);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredGroups = groups.filter((g) => {
    if (statusFilter !== 'ALL' && g.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#e2e4e9] dark:border-[#1e283d]">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Chit Groups
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {groups.length} Circles
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage chit fund circles, duration tenures, member capacities and auction dividend pools.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white dark:bg-[#111625] border border-[#e2e4e9] dark:border-[#1e283d] rounded-md px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Chit Group</span>
          </button>
        </div>
      </div>

      {/* Modern Financial Group Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGroups.map((group) => {
          const groupInstallments = installments.filter((ins) => ins.groupId === group.id);
          const totalCollected = groupInstallments.reduce((sum, ins) => sum + (ins.paidAmount || 0), 0);
          const totalExpectedEver = groupInstallments.reduce((sum, ins) => sum + (ins.expectedAmount || 0), 0);
          const completionPercent = totalExpectedEver > 0 ? Math.round((totalCollected / totalExpectedEver) * 100) : 0;
          const assignedMembers = members.filter((m) => m.assignedGroupIds?.includes(group.id));

          return (
            <div
              key={group.id}
              onClick={() => navigate(`/chit-groups/${group.id}`)}
              className="bg-white dark:bg-[#111625] rounded-lg border border-[#e2e4e9] dark:border-[#1e283d] p-5 shadow-xs hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-medium text-slate-400">
                      {group.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {group.name}
                    </h3>
                  </div>
                  <StatusBadge status={group.status} />
                </div>

                <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {group.description || 'Systematic financial chit scheme with structured monthly auction bidding.'}
                </p>

                {/* Financial Metric Grid */}
                <div className="mt-4 grid grid-cols-2 gap-3 py-3 border-y border-[#e2e4e9]/70 dark:border-[#1e283d] text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono">Chit Value</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {formatCurrency(group.chitValue)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono">Monthly Due</span>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {formatCurrency(group.monthlyInstallment)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono">Enrollment</span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {assignedMembers.length} / {group.memberCount} members
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono">Tenure</span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {group.durationMonths} Months
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">Realized Collection</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {completionPercent}% ({formatCurrency(totalCollected)})
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${Math.min(completionPercent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#e2e4e9]/70 dark:border-[#1e283d] flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px]">Due Day: {group.collectionDueDate}th</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 text-xs">
                  Open Workspace <ChevronRight className="w-3.5 h-3.5" />
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
