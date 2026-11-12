import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Download,
  Users,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { exportToCSV } from '../../utils/export';

export const CollectionCalendar = () => {
  const navigate = useNavigate();
  const groups = useAppStore((state) => state.groups);
  const members = useAppStore((state) => state.members);
  const installments = useAppStore((state) => state.installments);

  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('2026-11'); // Nov 2026 default
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter installments by month, group, status
  const filteredInstallments = installments.filter((ins) => {
    if (selectedMonth && ins.month !== selectedMonth) return false;
    if (selectedGroup !== 'ALL' && ins.groupId !== selectedGroup) return false;
    if (statusFilter !== 'ALL' && ins.status !== statusFilter) return false;
    return true;
  });

  // Calculate monthly collection KPIs for this selected slice
  const expectedTotal = filteredInstallments.reduce((sum, ins) => sum + (ins.expectedAmount || 0), 0);
  const collectedTotal = filteredInstallments.reduce((sum, ins) => sum + (ins.paidAmount || 0), 0);
  const pendingTotal = filteredInstallments.reduce((sum, ins) => sum + (ins.remainingAmount || 0), 0);
  const efficiency = expectedTotal > 0 ? Math.round((collectedTotal / expectedTotal) * 100) : 0;

  const handleExport = () => {
    const data = filteredInstallments.map((ins) => {
      const mem = members.find((m) => m.id === ins.memberId);
      const grp = groups.find((g) => g.id === ins.groupId);
      return {
        'Chit Group': grp ? grp.name : ins.groupId,
        'Member Name': mem ? mem.fullName : ins.memberId,
        'Mobile': mem ? mem.mobileNumber : '',
        'Month': ins.month,
        'Due Date': ins.dueDate,
        'Expected Amount': ins.expectedAmount,
        'Paid Amount': ins.paidAmount,
        'Remaining Balance': ins.remainingAmount,
        'Status': ins.status,
      };
    });
    exportToCSV(data, `ChitFlow_Collections_${selectedMonth}.csv`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collections Matrix"
        subtitle="Month-wise collection calendar and status monitoring for all enrolled subscribers"
        breadcrumbs={['ChitFlow', 'Collections']}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Month</span>
            </button>
            <button
              onClick={() => navigate('/payments')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <span>Record New Payment</span>
            </button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Month selector */}
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Cycle Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 font-medium text-slate-800 dark:text-white"
            >
              <option value="2026-08">Aug 2026</option>
              <option value="2026-09">Sep 2026</option>
              <option value="2026-10">Oct 2026</option>
              <option value="2026-11">Nov 2026 (Current)</option>
              <option value="2026-12">Dec 2026</option>
              <option value="2027-01">Jan 2027</option>
            </select>
          </div>

          {/* Group selector */}
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Chit Group:</span>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 font-medium text-slate-800 dark:text-white"
            >
              <option value="ALL">All Groups</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status selector */}
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 font-medium text-slate-800 dark:text-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="PAID">Paid</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
              <option value="UPCOMING">Upcoming</option>
            </select>
          </div>
        </div>

        {/* Small Progress Pill */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="text-right">
            <span className="text-slate-400">Target Realized:</span>
            <span className="ml-1 font-bold text-slate-900 dark:text-white">{efficiency}%</span>
          </div>
          <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${efficiency}%` }} />
          </div>
        </div>
      </div>

      {/* Monthly Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Target Inflow</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(expectedTotal)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{filteredInstallments.length} installment schedules</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Actual Collected</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(collectedTotal)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{efficiency}% realization</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Pending / Overdue</span>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(pendingTotal)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting realization</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Collection Health</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {efficiency >= 80 ? 'Optimal' : efficiency >= 50 ? 'Moderate' : 'Action Required'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Based on due dates</p>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Member Details</th>
                <th className="px-4 py-3">Chit Group</th>
                <th className="px-4 py-3">Installment #</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Expected Amount</th>
                <th className="px-4 py-3">Paid Amount</th>
                <th className="px-4 py-3">Outstanding</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInstallments.length > 0 ? (
                filteredInstallments.map((ins) => {
                  const mem = members.find((m) => m.id === ins.memberId);
                  const grp = groups.find((g) => g.id === ins.groupId);

                  return (
                    <tr key={ins.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {mem?.fullName || ins.memberId}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {mem?.mobileNumber} • {mem?.city}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {grp?.name || ins.groupId}
                      </td>
                      <td className="px-4 py-3 font-semibold">Month {ins.installmentNumber}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(ins.dueDate)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(ins.expectedAmount)}
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-600">
                        {formatCurrency(ins.paidAmount)}
                      </td>
                      <td className="px-4 py-3 font-bold text-rose-600">
                        {formatCurrency(ins.remainingAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={ins.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {ins.remainingAmount > 0 ? (
                          <button
                            onClick={() =>
                              navigate(
                                `/payments?memberId=${ins.memberId}&groupId=${ins.groupId}&installmentId=${ins.id}`
                              )
                            }
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs inline-flex items-center gap-1"
                          >
                            <span>Collect</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-[11px] flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Paid in Full
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500">
                    No installments match the selected month and filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

