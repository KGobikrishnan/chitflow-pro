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
      {/* Apple Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#AF52DE] uppercase tracking-wider block mb-0.5">
            Chit Schemes
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#000000] dark:text-[#FFFFFF]">
            Chit Groups
          </h1>
          <p className="text-xs text-[#8E8E93] mt-0.5 font-medium">
            Manage chit circles, tenures, subscriber pools and auction dividends
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* iOS Segmented Filter */}
          <div className="ios-segmented">
            {['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`ios-segmented-btn ${statusFilter === s ? 'active' : 'text-slate-600 dark:text-slate-400'}`}
              >
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="ios-pill-btn px-4 py-2 text-xs text-white bg-[#007AFF] hover:bg-[#0062CC] shadow-[0_3px_12px_rgba(0,122,255,0.35)] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {/* Apple iOS Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              className="ios-card p-6 flex flex-col justify-between hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#8E8E93]">
                      {group.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5 group-hover:text-[#007AFF] transition-colors">
                      {group.name}
                    </h3>
                  </div>
                  <StatusBadge status={group.status} />
                </div>

                <p className="mt-2 text-xs text-[#8E8E93] line-clamp-2 leading-relaxed">
                  {group.description || 'Systematic financial chit scheme with structured monthly auction bidding.'}
                </p>

                {/* Apple Stats Grid */}
                <div className="mt-4 grid grid-cols-2 gap-3.5 py-4 border-y border-black/5 dark:border-white/10 text-xs">
                  <div>
                    <span className="text-[#8E8E93] text-[10px] uppercase font-bold tracking-wider">Chit Value</span>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {formatCurrency(group.chitValue)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#8E8E93] text-[10px] uppercase font-bold tracking-wider">Monthly Due</span>
                    <p className="text-base font-extrabold text-[#007AFF] mt-0.5">
                      {formatCurrency(group.monthlyInstallment)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#8E8E93] text-[10px] uppercase font-bold tracking-wider">Subscribers</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#007AFF]" />
                      {assignedMembers.length} / {group.memberCount} enrolled
                    </p>
                  </div>
                  <div>
                    <span className="text-[#8E8E93] text-[10px] uppercase font-bold tracking-wider">Tenure</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#5856D6]" />
                      {group.durationMonths} Months
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#8E8E93] font-medium">Realized Collection</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {completionPercent}% ({formatCurrency(totalCollected)})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#E5E5EA] dark:bg-[#2C2C2E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#007AFF] to-[#5856D6] rounded-full transition-all"
                      style={{ width: `${Math.min(completionPercent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-[#8E8E93]">
                <span className="font-medium">Due Day: {group.collectionDueDate}th of month</span>
                <span className="font-bold text-[#007AFF] flex items-center gap-0.5">
                  View Workspace <ChevronRight className="w-4 h-4" />
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
